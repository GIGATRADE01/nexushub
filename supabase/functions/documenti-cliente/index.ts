/* I due documenti che il cliente riceve davvero: la spedizione con il
   tracking e la fattura.

   Perche' lato server e non dal pannello: i numeri di una fattura non si
   calcolano nel browser. Qui si leggono l'ordine e le sue righe dal
   database, si decide il regime IVA dal paese e dalla partita IVA, si
   numera progressivamente e si manda l'email NELLA LINGUA DEL CLIENTE.
   Il pannello chiede soltanto "spedisci" o "fattura".

   Chiama solo l'amministrazione: il token viene controllato. */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { invia } from "./mailer.ts";
import { FRASI, lingua } from "./lingue.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const REPLY_TO = Deno.env.get("EMAIL_REPLY_TO") || "info@nexushub.trade";
const MITTENTE = Deno.env.get("EMAIL_MITTENTE") || "info@nexushub.trade";

const NOI = {
  nome: "GIGA TRADE S.R.L.S.",
  indirizzo: "Via Ottavio Revel 6, 10121 Torino, Italia",
  piva: "IT13105910015",
  marchio: "NexusHub",
  sito: "https://nexushub.trade",
};
const NOI_RIGA = `${NOI.nome}, ${NOI.indirizzo}, P.IVA ${NOI.piva}`;

const UE = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
  "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"];

/* Il paese arriva scritto in mille modi: "IT", "Italia", "Italy", "italy ". */
const NOMI: Record<string, string> = {
  ITALIA: "IT", ITALY: "IT", DEUTSCHLAND: "DE", GERMANY: "DE", GERMANIA: "DE",
  FRANCE: "FR", FRANCIA: "FR", ESPANA: "ES", SPAIN: "ES", SPAGNA: "ES",
  NEDERLAND: "NL", NETHERLANDS: "NL", OLANDA: "NL", BELGIUM: "BE", BELGIO: "BE",
  POLSKA: "PL", POLAND: "PL", POLONIA: "PL", PORTUGAL: "PT", PORTOGALLO: "PT",
  SVIZZERA: "CH", SWITZERLAND: "CH", SUISSE: "CH", AUSTRIA: "AT", OSTERREICH: "AT",
  GREECE: "GR", GRECIA: "GR", ROMANIA: "RO", CZECHIA: "CZ", SVERIGE: "SE", SWEDEN: "SE",
};

const paeseIso = (v: unknown) => {
  const s = String(v || "").trim().toUpperCase().replace(/[^A-Z]/g, "");
  if (!s) return "";
  if (s.length === 2) return s;
  return NOMI[s] || s.slice(0, 2);
};

/* Il regime IVA di una cessione di beni che parte dall'Italia.
   Non e' l'aliquota del paese del cliente: per il B2B intracomunitario la
   fattura e' senza IVA con inversione contabile, e l'IVA la assolve lui a
   casa sua. Se la partita IVA non e' valida a VIES, invece, l'operazione e'
   interna e l'IVA italiana va addebitata: e' il punto dove si prendono gli
   accertamenti. */
const regimeIva = (paese: string, piva: string | null, viesOk: boolean | null) => {
  const p = paeseIso(paese);
  if (p === "IT") return { aliquota: 22, chiave: "ivaInterna" as const };
  if (UE.includes(p)) {
    if (piva && viesOk === true) return { aliquota: 0, chiave: "ivaUe" as const };
    return { aliquota: 22, chiave: "ivaUeNoVies" as const };
  }
  if (!p) return { aliquota: 22, chiave: "ivaIgnoto" as const };
  return { aliquota: 0, chiave: "ivaExport" as const };
};

const LOCALE: Record<string, string> = {
  en: "en-GB", it: "it-IT", fr: "fr-FR", es: "es-ES", de: "de-DE", zh: "zh-CN", ar: "ar",
};

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* L'email parte e la richiesta non la aspetta: il worker ha un tetto di CPU
   e il collegamento SMTP se lo mangia quasi tutto. waitUntil tiene vivo il
   worker quel tanto che basta senza bloccare la risposta. */
const spedisci = (p: Promise<unknown>, che: string) => {
  const lavoro = p
    .then((e: any) => { if (e && e.ok === false) console.error("email non spedita:", che, e.errore); })
    .catch((e) => console.error("email, errore di invio:", che, String(e?.message || e)));
  const runtime = (globalThis as any).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(lavoro);
};

const risposta = (corpo: unknown, stato = 200) =>
  new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json" } });

const cornice = (contenuto: string, rtl: boolean) => `<div dir="${rtl ? "rtl" : "ltr"}" style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;color:#1a1a22;padding:32px;border:1px solid #e3e3ea;border-radius:12px">
  <div style="border-bottom:2px solid #c9a84c;padding-bottom:14px;margin-bottom:22px">
    <div style="font-size:19px;font-weight:700;color:#1a1a22">${NOI.marchio}</div>
    <div style="font-size:11px;color:#6b6b7b;margin-top:3px">${NOI.nome} &middot; ${NOI.indirizzo} &middot; P.IVA ${NOI.piva}</div>
  </div>
  ${contenuto}
  <p style="color:#9a9aab;font-size:11px;text-align:center;border-top:1px solid #e3e3ea;padding-top:14px;margin-top:26px">
    ${NOI.marchio} &middot; Turin, Italy &middot; <a href="${NOI.sito}" style="color:#9b7f2e">nexushub.trade</a>
  </p></div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return risposta({ errore: "metodo" }, 405);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ------------------------------------------------- solo l'amministrazione
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return risposta({ errore: "non autorizzato" }, 401);
  const { data: chi } = await admin.auth.getUser(token);
  if (!chi?.user) return risposta({ errore: "non autorizzato" }, 401);
  const { data: profilo } = await admin.from("profiles").select("role").eq("id", chi.user.id).maybeSingle();
  if (!profilo || profilo.role !== "admin") return risposta({ errore: "non autorizzato" }, 403);

  let b: any;
  try { b = await req.json(); } catch { return risposta({ errore: "corpo non leggibile" }, 400); }

  const azione = b.azione === "spedizione" ? "spedizione" : b.azione === "fattura" ? "fattura" : null;
  if (!azione) return risposta({ errore: "azione" }, 400);
  if (!b.order_id) return risposta({ errore: "ordine" }, 400);

  // ------------------------------------------------------------- l'ordine
  const { data: ordine, error: errOrd } = await admin.from("orders")
    .select("*").eq("id", b.order_id).maybeSingle();
  if (errOrd || !ordine) return risposta({ errore: "ordine_non_trovato" }, 404);

  const { data: cliente } = await admin.from("profiles")
    .select("id, company_name, full_name, email, country, preferred_lang, shipping_address, shipping_city, shipping_zip")
    .eq("id", ordine.distributor_id).maybeSingle();
  const { data: fisc } = await admin.from("profile_billing")
    .select("vat_number, vies_valid, sdi_code, pec_email").eq("id", ordine.distributor_id).maybeSingle();

  const destinatario = cliente?.email;
  if (!destinatario) return risposta({ errore: "cliente_senza_email" }, 400);
  const nomeCliente = cliente?.company_name || cliente?.full_name || destinatario;

  /* La lingua del cliente, quella che ha scelto iscrivendosi. */
  const lg = lingua(cliente?.preferred_lang);
  const F = FRASI[lg];
  const rtl = lg === "ar";
  const loc = LOCALE[lg] || "en-GB";
  const eur = (v: number) =>
    new Intl.NumberFormat(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + " €";

  // =========================================================== SPEDIZIONE
  if (azione === "spedizione") {
    const corriere = String(b.courier || "").trim().slice(0, 40);
    const codice = String(b.tracking_number || "").trim().slice(0, 60);
    if (!corriere || !codice) return risposta({ errore: "corriere_o_tracking" }, 400);

    /* L'indirizzo di tracciamento: se il pannello non lo passa lo costruiamo
       noi, perche' un codice senza link il cliente non lo usa. */
    const link = String(b.tracking_url || "").trim() || ({
      BRT: "https://vas.brt.it/vas/sped_det_show.hsm?referer=sped_numspe_par.htm&Nspediz=" + encodeURIComponent(codice),
      DHL: "https://www.dhl.com/it-it/home/tracciabilita.html?tracking-id=" + encodeURIComponent(codice),
      UPS: "https://www.ups.com/track?tracknum=" + encodeURIComponent(codice),
      GLS: "https://gls-group.eu/IT/it/servizi-online/ricerca-spedizioni?match=" + encodeURIComponent(codice),
      FEDEX: "https://www.fedex.com/fedextrack/?trknbr=" + encodeURIComponent(codice),
      TNT: "https://www.tnt.it/tracking/Tracking.do?cons=" + encodeURIComponent(codice),
      POSTE: "https://www.poste.it/cerca/index.html#/risultati-spedizioni/" + encodeURIComponent(codice),
    } as Record<string, string>)[corriere.toUpperCase()] || "";

    const { error: errUp } = await admin.from("orders").update({
      courier: corriere,
      tracking_number: codice,
      tracking_url: link || null,
      status: "shipped",
      shipped_at: new Date().toISOString(),
    }).eq("id", ordine.id);
    if (errUp) return risposta({ errore: "salvataggio", dettaglio: errUp.message }, 500);

    const html = cornice(`
      <h2 style="font-size:19px;margin:0 0 6px;color:#1a1a22">${esc(F.spedTitolo)}</h2>
      <p style="font-size:14px;color:#4a4a58;margin:0 0 18px">${esc(F.spedOrdine)} <b>${esc(ordine.order_number)}</b> &mdash; ${esc(nomeCliente)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px">
        <tr><td style="padding:9px 0;color:#6b6b7b;border-bottom:1px solid #ececed">${esc(F.spedCorriere)}</td>
            <td style="padding:9px 0;text-align:${rtl ? "left" : "right"};font-weight:700;border-bottom:1px solid #ececed">${esc(corriere)}</td></tr>
        <tr><td style="padding:9px 0;color:#6b6b7b;border-bottom:1px solid #ececed">${esc(F.spedCodice)}</td>
            <td style="padding:9px 0;text-align:${rtl ? "left" : "right"};font-family:monospace;font-weight:700;border-bottom:1px solid #ececed">${esc(codice)}</td></tr>
        <tr><td style="padding:9px 0;color:#6b6b7b">${esc(F.spedDove)}</td>
            <td style="padding:9px 0;text-align:${rtl ? "left" : "right"}">${esc(ordine.shipping_city || cliente?.shipping_city || "")} ${esc(ordine.shipping_country || cliente?.country || "")}</td></tr>
      </table>
      ${link ? `<div style="text-align:center;margin:22px 0"><a href="${link}" style="display:inline-block;padding:13px 28px;background:#c9a84c;color:#1a1a22;text-decoration:none;border-radius:9px;font-weight:700;font-size:14px">${esc(F.spedBottone)}</a></div>` : ""}
      <p style="font-size:13px;color:#6b6b7b;line-height:1.6">${esc(F.spedNota)}</p>`, rtl);

    /* L'invio SMTP consuma piu' CPU di quanta ne abbia un worker dentro una
       richiesta: aspettarlo faceva uccidere la funzione con "CPU Time
       exceeded" DOPO aver gia' aggiornato l'ordine. Si risponde subito e si
       lascia proseguire l'invio, come fa send-email. */
    spedisci(invia(destinatario, `${F.spedOggetto} ${ordine.order_number}`, html,
      { replyTo: REPLY_TO, mittente: MITTENTE }), "spedizione");

    return risposta({ ok: true, tracking_url: link, email: destinatario, lingua: lg });
  }

  // ============================================================== FATTURA
  const { data: righe } = await admin.from("order_items")
    .select("product_name, sku, quantity, unit_price, total_price")
    .eq("order_id", ordine.id);

  if (!righe || righe.length === 0) return risposta({ errore: "ordine_senza_righe" }, 400);

  const paese = ordine.shipping_country || cliente?.country || "";
  const iva = regimeIva(paese, fisc?.vat_number || null, fisc?.vies_valid ?? null);
  const notaIva = F[iva.chiave];

  const imponibile = righe.reduce((s, r) => s + Number(r.total_price || 0), 0);
  const imposta = Math.round(imponibile * iva.aliquota) / 100;
  const totale = Math.round((imponibile + imposta) * 100) / 100;

  /* Se la fattura di questo ordine esiste gia', si riusa il suo numero: una
     fattura non si rinumera, si ristampa. */
  const { data: esistente } = await admin.from("invoices")
    .select("invoice_number").eq("order_id", ordine.id).eq("type", "vendita").maybeSingle();

  let numero = esistente?.invoice_number;
  if (!numero) {
    const { data: n, error: errN } = await admin.rpc("prossimo_numero_fattura", {
      p_anno: new Date().getFullYear(),
    });
    if (errN || !n) return risposta({ errore: "numerazione", dettaglio: errN?.message }, 500);
    numero = String(n);
  }

  const indirizzo = [
    ordine.shipping_address || cliente?.shipping_address,
    [ordine.shipping_zip || cliente?.shipping_zip, ordine.shipping_city || cliente?.shipping_city].filter(Boolean).join(" "),
    paese,
  ].filter(Boolean).join(" — ");

  const { error: errFat } = await admin.from("invoices").upsert({
    invoice_number: numero,
    order_id: ordine.id,
    type: "vendita",
    from_entity: `${NOI.nome} · ${NOI.indirizzo}`,
    to_entity: `${nomeCliente}${indirizzo ? " · " + indirizzo : ""}`,
    from_vat: NOI.piva,
    to_vat: fisc?.vat_number || null,
    subtotal: imponibile,
    vat_rate: iva.aliquota,
    vat_amount: imposta,
    total: totale,
    status: ordine.payment_status === "paid" ? "paid" : "issued",
    paid_at: ordine.payment_status === "paid" ? (ordine.paid_at || new Date().toISOString()) : null,
    notes: FRASI.it[iva.chiave],
  }, { onConflict: "invoice_number" });
  if (errFat) return risposta({ errore: "salvataggio_fattura", dettaglio: errFat.message }, 500);

  const fine = rtl ? "left" : "right";
  const corpoRighe = righe.map((r) => `
    <tr>
      <td style="padding:9px 6px;border-bottom:1px solid #ececed;font-size:13px">${esc(r.product_name)}<div style="color:#9a9aab;font-size:11px;font-family:monospace">${esc(r.sku || "")}</div></td>
      <td style="padding:9px 6px;border-bottom:1px solid #ececed;text-align:center;font-size:13px">${Number(r.quantity || 0)}</td>
      <td style="padding:9px 6px;border-bottom:1px solid #ececed;text-align:${fine};font-size:13px">${eur(Number(r.unit_price || 0))}</td>
      <td style="padding:9px 6px;border-bottom:1px solid #ececed;text-align:${fine};font-size:13px;font-weight:700">${eur(Number(r.total_price || 0))}</td>
    </tr>`).join("");

  const html = cornice(`
    <div style="display:block;margin-bottom:20px">
      <h2 style="font-size:19px;margin:0 0 4px;color:#1a1a22">${esc(F.fatTitolo)} ${esc(numero)}</h2>
      <div style="font-size:12px;color:#6b6b7b">${esc(F.fatData)} ${new Date().toLocaleDateString(loc)} &mdash; ${esc(F.fatOrdine)} ${esc(ordine.order_number)}</div>
    </div>

    <div style="background:#f7f7fa;border:1px solid #e3e3ea;border-radius:9px;padding:14px 16px;margin-bottom:20px">
      <div style="font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:#9a9aab;margin-bottom:6px">${esc(F.fatA)}</div>
      <div style="font-size:14px;font-weight:700;color:#1a1a22">${esc(nomeCliente)}</div>
      ${indirizzo ? `<div style="font-size:12.5px;color:#4a4a58;margin-top:2px">${esc(indirizzo)}</div>` : ""}
      ${fisc?.vat_number ? `<div style="font-size:12.5px;color:#4a4a58;margin-top:2px">VAT ${esc(fisc.vat_number)}${fisc.vies_valid === true ? " — " + esc(F.fatVies) : ""}</div>` : ""}
      ${fisc?.sdi_code ? `<div style="font-size:12.5px;color:#4a4a58">${esc(F.fatSdi)} ${esc(fisc.sdi_code)}</div>` : ""}
      ${fisc?.pec_email ? `<div style="font-size:12.5px;color:#4a4a58">${esc(F.fatPec)} ${esc(fisc.pec_email)}</div>` : ""}
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:6px">
      <thead><tr style="background:#f7f7fa">
        <th style="padding:8px 6px;text-align:${rtl ? "right" : "left"};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9a9aab">${esc(F.fatProdotto)}</th>
        <th style="padding:8px 6px;text-align:center;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9a9aab">${esc(F.fatPezzi)}</th>
        <th style="padding:8px 6px;text-align:${fine};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9a9aab">${esc(F.fatUnitario)}</th>
        <th style="padding:8px 6px;text-align:${fine};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9a9aab">${esc(F.fatTotale)}</th>
      </tr></thead>
      <tbody>${corpoRighe}</tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:14px">
      <tr><td style="padding:6px 6px;text-align:${fine};font-size:13px;color:#6b6b7b">${esc(F.fatImponibile)}</td>
          <td style="padding:6px 6px;text-align:${fine};font-size:13px;width:140px">${eur(imponibile)}</td></tr>
      <tr><td style="padding:6px 6px;text-align:${fine};font-size:13px;color:#6b6b7b">${esc(F.fatIva)} ${iva.aliquota}%</td>
          <td style="padding:6px 6px;text-align:${fine};font-size:13px">${eur(imposta)}</td></tr>
      <tr><td style="padding:10px 6px;text-align:${fine};font-size:15px;font-weight:700;border-top:2px solid #1a1a22">${esc(F.fatTot)}</td>
          <td style="padding:10px 6px;text-align:${fine};font-size:15px;font-weight:700;border-top:2px solid #1a1a22">${eur(totale)}</td></tr>
    </table>

    <p style="font-size:12px;color:#6b6b7b;background:#f7f7fa;border-${rtl ? "right" : "left"}:3px solid #c9a84c;padding:11px 13px;margin:18px 0 0;line-height:1.6">${esc(notaIva)}</p>
    <p style="font-size:12px;color:#9a9aab;margin-top:14px">${esc(F.fatPiede.replace("{noi}", NOI_RIGA))}</p>`, rtl);

  spedisci(invia(destinatario, `${F.fatOggetto} ${numero} — ${F.fatOrdine} ${ordine.order_number}`, html,
    { replyTo: REPLY_TO, mittente: MITTENTE }), "fattura");

  return risposta({
    ok: true, numero, imponibile, aliquota: iva.aliquota, imposta, totale,
    regime: FRASI.it[iva.chiave], email: destinatario, lingua: lg,
  });
});
