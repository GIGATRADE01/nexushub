/* Completa la registrazione di un brand, di un distributore o di un
   procacciatore d'affari.

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
  const role = b.role === "brand" ? "brand"
    : b.role === "distributor" ? "distributor"
    : b.role === "procacciatore" ? "procacciatore" : null;
  const accountType = ["distributor", "chain", "ecommerce"].includes(b.account_type) ? b.account_type : "distributor";

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return risposta({ errore: "email" }, 400);
  if (password.length < 8) return risposta({ errore: "password" }, 400);
  if (!role) return risposta({ errore: "ruolo" }, 400);

  // Catene ed e-commerce non passano dal brand: li serviamo noi, dal nostro
  // magazzino, a un prezzo che decidiamo noi. Prima di spedire a un'azienda
  // dobbiamo sapere quanto e' grande, e il sito e' l'unico modo di saperlo
  // in trenta secondi. Il controllo c'e' anche nel modulo, ma quello lo salta
  // chiunque apra la console del browser.
  const gestito = accountType === "chain" || accountType === "ecommerce";
  if (gestito && !testo(b.website, 200)) return risposta({ errore: "sito_obbligatorio" }, 400);

  /* Il codice dell'agente. Due strade: lo digita il negoziante che si iscrive
     da solo, oppure e' l'agente stesso a registrare il negozio dal suo portale
     (iPad in giro per i negozi). In entrambi i casi il negozio nasce IN ATTESA
     e l'aggancio si vede nella scheda di approvazione: e' Andrea che decide. */
  let procacciatoreId: string | null = null;
  const codiceAgente = testo(b.procacciatore_codice, 30)?.toUpperCase();
  if (codiceAgente && role === "distributor") {
    const { data: ag } = await admin.from("procacciatori")
      .select("id, stato").eq("codice", codiceAgente).maybeSingle();
    if (!ag) return risposta({ errore: "codice_agente_sconosciuto" }, 400);
    if (ag.stato !== "approvato") return risposta({ errore: "codice_agente_non_attivo" }, 400);
    procacciatoreId = ag.id;
  }

  /* ABILITAZIONE IMMEDIATA, ma solo se a registrare e' DAVVERO l'agente
     (28/10/2026, ordine di Andrea: il negozio deve poter comprare subito).

     Non basta il codice dell'agente: quello lo digita anche il negoziante nel
     modulo pubblico, e chi lo copia da un biglietto da visita si
     auto-approverebbe. Quindi si chiede il gettone della sessione e lo si
     verifica qui: deve appartenere a un procacciatore approvato. Un campo
     booleano mandato dal browser non servirebbe a niente, lo cambia chiunque
     apra la console.

     Chi si iscrive da solo resta IN ATTESA come prima: li' non c'e' nessuno
     che risponde del negozio. */
  let daAgente = false;
  const gettone = testo(b.agente_token, 4000);
  if (gettone && role === "distributor") {
    const { data: chi } = await admin.auth.getUser(gettone);
    if (chi?.user) {
      const { data: ag } = await admin.from("procacciatori")
        .select("id, stato").eq("id", chi.user.id).maybeSingle();
      if (ag && ag.stato === "approvato") {
        daAgente = true;
        procacciatoreId = ag.id;   // vale la sessione, non il codice digitato
      }
    }
  }

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
  const isProc = role === "procacciatore";
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
    // Quanto e' grande: punti vendita per le catene, scaglione di fatturato
    // per gli e-commerce. Serve a decidere che listino fargli.
    business_size: testo(b.business_size, 60),
    preferred_lang: testo(b.preferred_lang, 5) || "en",
    // Aperto subito se lo porta un agente, altrimenti 'pending' per difetto.
    ...(daAgente ? { status: "approved" } : {}),
    ...(procacciatoreId ? {
      procacciatore_id: procacciatoreId,
      procacciatore_dal: new Date().toISOString(),
    } : {}),
    ...(isBrand ? {} : {
      shipping_address: testo(b.shipping_address),
      shipping_city: testo(b.shipping_city, 80),
      shipping_zip: testo(b.shipping_zip, 20),
      shipping_region: testo(b.shipping_region, 80),
      /* Orari, interno, citofono. Finche' non c'era questo campo finivano
         dentro l'indirizzo o in nessun posto, e il corriere trovava chiuso. */
      delivery_notes: testo(b.delivery_notes, 500),
    }),
  }, { onConflict: "id" });
  if (errProf) return await annulla("profilo", errProf);

  // ------------------------------------------------------- dati fiscali
  const { error: errFisc } = await admin.from("profile_billing").upsert({
    id: uid,
    vat_number: testo(b.vat_number, 40),
    /* Codice fiscale: su una ditta individuale la fattura lo vuole e la
       partita IVA non basta. */
    tax_code: testo(b.tax_code, 40),
    sdi_code: testo(b.sdi_code, 20),
    pec_email: testo(b.pec_email, 160),
    ...((isBrand || isProc) ? {
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
    agreement_type: isProc ? "procacciatore_agreement"
      : isBrand ? "brand_agreement" : "distributor_terms",
    agreement_version: testo(b.agreement_version, 10) || "1.0",
    accepted_name: testo(b.full_name),
    company_name: testo(b.company_name),
    user_agent: testo(b.user_agent, 300),
  });
  if (errFirma) return await annulla("firma", errFirma);

  /* Il procacciatore: codice personale, dati per la liquidazione e le tre
     domande che filtrano meglio di qualunque documento. Nasce IN ATTESA: non
     vede nulla e non porta nessuno finche' Andrea non lo approva a mano.

     Le due accettazioni sono separate apposta. Gli artt. 1341-1342 c.c.
     vogliono un'approvazione SPECIFICA per le clausole vessatorie — recesso
     senza indennita, storno, non circonvenzione, foro esclusivo. Senza quella
     seconda spunta sono inefficaci, e si scopre quando servono. */
  if (isProc) {
    if (!b.vessatorie_accettate) return await annulla("vessatorie", "non approvate");
    const codice = "NX-" + (testo(b.country, 2) || "EU").toUpperCase() +
      "-" + uid.replace(/-/g, "").slice(0, 6).toUpperCase();
    const { error: errProc } = await admin.from("procacciatori").insert({
      id: uid,
      codice,
      stato: "in_attesa",
      piva: testo(b.vat_number, 40),
      paese: testo(b.country, 80),
      iban: testo(b.iban, 40),
      intestatario_conto: testo(b.account_holder) || testo(b.company_name),
      negozi_gia_serviti: testo(b.negozi_gia_serviti, 1500),
      cosa_vende_oggi: testo(b.cosa_vende_oggi, 1000),
      clienti_in_30gg: Number.isFinite(Number(b.clienti_in_30gg))
        ? Math.max(0, Math.min(9999, Math.round(Number(b.clienti_in_30gg)))) : null,
      contratto_versione: testo(b.contratto_versione, 20) || "2026-10-v1",
      contratto_accettato_il: new Date().toISOString(),
      contratto_ip: testo(req.headers.get("x-forwarded-for"), 60),
      vessatorie_accettate_il: new Date().toISOString(),
    });
    if (errProc) return await annulla("procacciatore", errProc);
  }

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
