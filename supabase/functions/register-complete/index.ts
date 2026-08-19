/* Completa la registrazione di un brand o di un distributore.

   Perche' esiste: il browser di chi si registra non ha ancora una sessione
   (Supabase la rilascia solo dopo la conferma dell'email), quindi ogni
   scrittura fatta dal browser veniva rifiutata dalle regole di riga. Il
   risultato era un account vuoto: niente azienda, niente partita IVA, niente
   documenti, niente firma del contratto. Qui l'account e i suoi dati vengono
   creati tutti insieme, lato server, in un colpo solo. */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MIME_AMMESSI = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_DOC = 5 * 1024 * 1024;        // 5 MB a documento
const MAX_ORA = 30;                      // freno contro le registrazioni a raffica

const risposta = (corpo: unknown, stato = 200) =>
  new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json" } });

const testo = (v: unknown, max = 200) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return risposta({ errore: "metodo" }, 405);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  let b: any;
  try { b = await req.json(); } catch { return risposta({ errore: "corpo non leggibile" }, 400); }

  // ------------------------------------------------------------ controlli
  const email = testo(b.email, 160)?.toLowerCase();
  const password = typeof b.password === "string" ? b.password : "";
  const role = b.role === "brand" ? "brand" : b.role === "distributor" ? "distributor" : null;
  const accountType = ["distributor", "chain", "ecommerce"].includes(b.account_type) ? b.account_type : "distributor";

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return risposta({ errore: "email" }, 400);
  if (password.length < 8) return risposta({ errore: "password" }, 400);
  if (!role) return risposta({ errore: "ruolo" }, 400);

  const { data: aperte } = await admin.rpc("registrations_open");
  if (aperte === false) return risposta({ errore: "registrazioni_chiuse" }, 403);

  const dallOra = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", dallOra);
  if ((count ?? 0) >= MAX_ORA) return risposta({ errore: "troppe_richieste" }, 429);

  // -------------------------------------------------------------- account
  const { data: creato, error: errCrea } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,   // l'indirizzo lo verifichiamo noi al momento dell'approvazione
    user_metadata: {
      role,
      account_type: accountType,
      company_name: testo(b.company_name),
      full_name: testo(b.full_name),
    },
  });

  if (errCrea || !creato?.user) {
    const m = (errCrea?.message || "").toLowerCase();
    const gia = m.includes("already") || m.includes("registered") || m.includes("exists");
    return risposta({ errore: gia ? "email_gia_usata" : "creazione", dettaglio: errCrea?.message }, 400);
  }
  const uid = creato.user.id;

  // Da qui in avanti l'account esiste: se qualcosa fallisce lo cancelliamo,
  // per non lasciare in giro utenti a meta'.
  const annulla = async (dove: string, e: unknown) => {
    await admin.auth.admin.deleteUser(uid).catch(() => {});
    console.error("registrazione annullata a " + dove, e);
    return risposta({ errore: "salvataggio", passo: dove }, 500);
  };

  // -------------------------------------------------------- dati azienda
  const isBrand = role === "brand";
  const { error: errProf } = await admin.from("profiles").upsert({
    id: uid,
    email,
    role,
    account_type: accountType,
    full_name: testo(b.full_name),
    company_name: testo(b.company_name),
    phone: testo(b.phone, 40),
    country: testo(b.country, 80),
    website: testo(b.website, 200),
    preferred_lang: testo(b.preferred_lang, 5) || "en",
    ...(isBrand ? {} : {
      shipping_address: testo(b.shipping_address),
      shipping_city: testo(b.shipping_city, 80),
      shipping_zip: testo(b.shipping_zip, 20),
      shipping_region: testo(b.shipping_region, 80),
    }),
  }, { onConflict: "id" });
  if (errProf) return await annulla("profilo", errProf);

  // ------------------------------------------------------- dati fiscali
  const { error: errFisc } = await admin.from("profile_billing").upsert({
    id: uid,
    vat_number: testo(b.vat_number, 40),
    sdi_code: testo(b.sdi_code, 20),
    pec_email: testo(b.pec_email, 160),
    ...(isBrand ? {
      iban: testo(b.iban, 40),
      bank_name: testo(b.bank_name),
      account_holder: testo(b.account_holder),
      swift_bic: testo(b.swift_bic, 20),
    } : {}),
  }, { onConflict: "id" });
  if (errFisc) return await annulla("fiscali", errFisc);

  // --------------------------------- firma elettronica del contratto
  const { error: errFirma } = await admin.from("agreement_acceptances").insert({
    user_id: uid,
    role,
    agreement_type: isBrand ? "brand_agreement" : "distributor_terms",
    agreement_version: testo(b.agreement_version, 10) || "1.0",
    accepted_name: testo(b.full_name),
    company_name: testo(b.company_name),
    user_agent: testo(b.user_agent, 300),
  });
  if (errFirma) return await annulla("firma", errFirma);

  // ------------------------------------------------------- i documenti
  const documenti = Array.isArray(b.documenti) ? b.documenti.slice(0, 6) : [];
  const caricati: string[] = [];
  for (const d of documenti) {
    const tipo = testo(d?.doc_type, 40);
    const nome = (testo(d?.file_name, 120) || "documento").replace(/[^\w.\-]/g, "_");
    const mime = testo(d?.content_type, 60) || "application/pdf";
    if (!tipo || typeof d?.base64 !== "string") continue;
    if (!MIME_AMMESSI.includes(mime)) return await annulla("documento:" + tipo, "formato non ammesso");

    let bytes: Uint8Array;
    try {
      const grezzo = atob(d.base64);
      bytes = new Uint8Array(grezzo.length);
      for (let i = 0; i < grezzo.length; i++) bytes[i] = grezzo.charCodeAt(i);
    } catch (e) { return await annulla("documento:" + tipo, e); }
    if (bytes.length > MAX_DOC) return await annulla("documento:" + tipo, "troppo grande");

    const percorso = `${uid}/${tipo}/${Date.now()}_${nome}`;
    const { error: errUp } = await admin.storage.from("documents")
      .upload(percorso, bytes, { contentType: mime, upsert: false });
    if (errUp) return await annulla("documento:" + tipo, errUp);

    /* Il secchio e' privato: salviamo il percorso, non un indirizzo pubblico.
       Il pannello admin lo apre con un link firmato a scadenza. */
    const { error: errRiga } = await admin.from("documents").insert({
      user_id: uid, doc_type: tipo, file_url: percorso, file_name: nome,
    });
    if (errRiga) return await annulla("documento:" + tipo, errRiga);
    caricati.push(tipo);
  }

  return risposta({ ok: true, user_id: uid, documenti: caricati });
});
