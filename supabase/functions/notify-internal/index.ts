// notify-internal — le email che avvisano NexusHub di quello che succede in piattaforma.
//
// Tre eventi, tre caselle:
//   registration   -> andrea@   (nuova registrazione: dati, P.IVA, VIES, documenti)
//   access_request -> andrea@   (un distributore si candida a un brand)
//   order          -> orders@   (nuovo ordine)
//
// Chiamata dai trigger sul database via pg_net. Il corpo e' { kind, id }.
// In italiano: queste email le legge Andrea, non i clienti.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { invia } from "../_shared/mailer.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TO_DECISIONI = Deno.env.get("MAIL_DECISIONI") || "andrea@nexushub.trade";
const TO_ORDINI = Deno.env.get("MAIL_ORDINI") || "orders@nexushub.trade";
const SITE = "https://nexushub.trade";

const esc = (s: unknown) =>
  String(s ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function db(path: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!r.ok) return [];
  return await r.json();
}

/* I documenti caricati in fase di registrazione: link diretto, cosi' si aprono dalla mail. */
function docUrl(u: string) {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `${SUPABASE_URL}/storage/v1/object/public/${u.replace(/^\/+/, "")}`;
}

const shell = (titolo: string, colore: string, corpo: string, cta: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#08080f;color:#ede9e3;padding:32px;border-radius:12px">
  <div style="text-align:center;margin-bottom:24px">
    <div style="display:inline-block;width:46px;height:46px;background:linear-gradient(135deg,#c9a84c,#7a5e28);border-radius:11px;line-height:46px;font-size:21px;font-weight:900;color:#08080f">N</div>
    <p style="color:#8890aa;font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin:10px 0 0">NexusHub &middot; notifica interna</p>
  </div>
  <div style="background:${colore}15;border:1px solid ${colore}45;border-radius:10px;padding:18px;margin-bottom:20px">
    <h2 style="color:${colore};margin:0;font-size:19px">${titolo}</h2>
  </div>
  ${corpo}
  <div style="text-align:center;margin:28px 0 4px">
    <a href="${SITE}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#c9a84c,#7a5e28);color:#08080f;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px">${cta} &rarr;</a>
  </div>
  <p style="color:#4a4e68;font-size:11px;text-align:center;border-top:1px solid #252838;padding-top:14px;margin-top:24px">
    Notifica automatica della piattaforma &middot; <a href="${SITE}" style="color:#c9a84c">nexushub.trade</a>
  </p>
</div>`;

const righe = (v: [string, unknown][]) =>
  `<table style="width:100%;border-collapse:collapse;font-size:14px">${v
    .map(
      ([k, val]) =>
        `<tr><td style="padding:7px 0;color:#8890aa;width:190px;vertical-align:top">${k}</td>
          <td style="padding:7px 0;color:#ede9e3;font-weight:600">${esc(val)}</td></tr>`,
    )
    .join("")}</table>`;

const RUOLO: Record<string, string> = {
  brand: "BRAND",
  distributor: "DISTRIBUTORE",
  admin: "ADMIN",
};

async function registrazione(id: string) {
  const [p] = await db(`profiles?id=eq.${id}&select=*`);
  if (!p) return null;
  const [b] = await db(`profile_billing?id=eq.${id}&select=*`);
  const docs = await db(`documents?user_id=eq.${id}&select=doc_type,file_name,file_url`);

  const tipo = RUOLO[p.role] || String(p.role || "").toUpperCase();
  const catena = p.account_type === "managed" || p.account_type === "chain";

  const vies = b?.vies_valid === true
    ? `✅ valida${b.vies_name ? " — " + esc(b.vies_name) : ""}`
    : b?.vies_valid === false
      ? "⚠️ NON validata dal VIES"
      : "non verificata";

  const elencoDoc = docs.length
    ? `<div style="background:#151720;border-radius:10px;padding:16px;margin:18px 0">
         <p style="color:#c9a84c;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 10px">Documenti caricati (${docs.length})</p>
         ${docs
           .map(
             (d: any) =>
               `<p style="margin:6px 0"><a href="${docUrl(d.file_url)}" style="color:#e2bc6a;font-size:13px">📄 ${esc(d.doc_type)} — ${esc(d.file_name)}</a></p>`,
           )
           .join("")}
       </div>`
    : `<div style="background:#c0392b12;border:1px solid #c0392b35;border-radius:10px;padding:14px;margin:18px 0">
         <p style="color:#c0392b;font-size:13px;margin:0">⚠️ Nessun documento caricato in fase di registrazione.</p>
       </div>`;

  return {
    to: TO_DECISIONI,
    subject: `[REGISTRAZIONE] ${tipo}${catena ? " (catena)" : ""} - ${p.company_name || p.email}`,
    html: shell(
      `Nuova registrazione ${tipo}`,
      p.role === "brand" ? "#c9a84c" : "#3d8ef0",
      righe([
        ["Azienda", p.company_name],
        ["Tipo", tipo + (catena ? " · catena/retail gestito" : "")],
        ["Paese", p.country],
        ["Referente", p.full_name],
        ["Email", p.email],
        ["Telefono", p.phone],
        ["P.IVA / VAT", b?.vat_number],
        ["Controllo VIES", vies],
        ["PEC", b?.pec_email],
        ["Lingua preferita", (p.preferred_lang || "—").toUpperCase()],
        ["Contratto firmato", p.terms_accepted_at ? "✅ " + String(p.terms_accepted_at).slice(0, 10) : "❌ non ancora"],
        ["Stato attuale", p.status],
      ]) + elencoDoc,
      "Apri la piattaforma e decidi",
    ),
  };
}

async function candidatura(id: string) {
  const [r] = await db(`brand_access_requests?id=eq.${id}&select=*`);
  if (!r) return null;
  const [d] = await db(`profiles?id=eq.${r.distributor_id}&select=company_name,country,email,trust_score,account_state`);
  const [m] = await db(`profiles?id=eq.${r.brand_id}&select=company_name`);
  const [db_] = await db(`profile_billing?id=eq.${r.distributor_id}&select=vat_number,vies_valid`);

  /* Se nel paese c'e' gia' un'esclusiva, va detto subito: cambia la risposta. */
  const esclusive = await db(
    `brand_access_requests?brand_id=eq.${r.brand_id}&status=eq.approved&exclusive=is.true&select=distributor_id`,
  );

  return {
    to: TO_DECISIONI,
    subject: `[CANDIDATURA] ${d?.company_name || "Un distributore"} -> ${m?.company_name || "un brand"}`,
    html: shell(
      "Nuova candidatura distributore → brand",
      "#8e44ad",
      righe([
        ["Distributore", d?.company_name],
        ["Paese", d?.country],
        ["Email", d?.email],
        ["P.IVA / VAT", db_?.vat_number],
        ["VIES", db_?.vies_valid === true ? "✅ valida" : db_?.vies_valid === false ? "⚠️ non validata" : "non verificata"],
        ["Punteggio fiducia", `${d?.trust_score ?? "—"}${d?.account_state === "at_risk" ? " ⚠️ A RISCHIO" : ""}`],
        ["Brand richiesto", m?.company_name],
        ["Esclusive gia' assegnate", esclusive.length ? `${esclusive.length} — verificare il territorio` : "nessuna"],
      ]),
      "Approva o rifiuta",
    ),
  };
}

async function ordine(id: string) {
  const [o] = await db(`orders?id=eq.${id}&select=*`);
  if (!o) return null;
  const [d] = await db(`profiles?id=eq.${o.distributor_id}&select=company_name,country`);
  const [m] = await db(`profiles?id=eq.${o.brand_id}&select=company_name`);

  return {
    to: TO_ORDINI,
    subject: `[ORDINE] ${o.order_number || ""} - EUR ${o.total_amount}`,
    html: shell(
      "Nuovo ordine ricevuto",
      "#27ae60",
      righe([
        ["Ordine", o.order_number],
        ["Distributore", d?.company_name],
        ["Paese di consegna", d?.country],
        ["Brand", m?.company_name],
        ["Importo", `€ ${o.total_amount}`],
        ["Stato", o.status],
      ]),
      "Vedi l'ordine",
    ),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { kind, id, preview } = await req.json();
    if (!kind || !id) {
      return new Response(JSON.stringify({ error: "servono kind e id" }), { status: 400 });
    }

    const mail =
      kind === "registration" ? await registrazione(id)
      : kind === "access_request" ? await candidatura(id)
      : kind === "order" ? await ordine(id)
      : null;

    if (!mail) {
      return new Response(JSON.stringify({ error: "evento sconosciuto o record inesistente" }), { status: 404 });
    }

    /* preview: restituisce l'email senza spedirla, per controllarla prima. */
    if (preview) {
      return new Response(JSON.stringify({ preview: mail }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const esito = await invia(mail.to, mail.subject, mail.html);

    return new Response(JSON.stringify({ sent: esito.ok, to: mail.to, ...esito }), {
      status: esito.ok ? 200 : 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
