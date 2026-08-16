// Un solo posto da cui partono le email della piattaforma.
//
// Preferisce SMTP Zoho: il dominio e' gia' firmato con il selettore zmail e i
// report DMARC di Google, Microsoft e Messe Frankfurt confermano SPF e DKIM in
// pass. Con Zoho le email escono da @nexushub.trade senza dover verificare
// nulla altrove.
//
// Resend resta come riserva: serve per gli invii di massa (gli avvisi di lancio
// a tutta la rete distributori), dove il limite giornaliero di Zoho non basta.

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const ZOHO_USER = Deno.env.get("ZOHO_USER");
const ZOHO_APP_PASSWORD = Deno.env.get("ZOHO_APP_PASSWORD");
const ZOHO_SMTP = Deno.env.get("ZOHO_SMTP") || "smtppro.zoho.eu";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = Deno.env.get("EMAIL_FROM") || "NexusHub <onboarding@resend.dev>";

export type Esito = { ok: boolean; via: string; errore?: string };

/* Zoho accetta come mittente solo la casella autenticata o un suo alias:
   il From lo decide ZOHO_USER, non il chiamante. */
async function viaZoho(to: string, subject: string, html: string, replyTo?: string): Promise<Esito> {
  const client = new SMTPClient({
    connection: {
      hostname: ZOHO_SMTP,
      port: 465,
      tls: true,
      auth: { username: ZOHO_USER!, password: ZOHO_APP_PASSWORD! },
    },
  });
  try {
    await client.send({
      from: `NexusHub <${ZOHO_USER}>`,
      to,
      replyTo: replyTo || ZOHO_USER!,
      subject,
      html,
      content: "auto",
    });
    return { ok: true, via: "zoho" };
  } finally {
    try { await client.close(); } catch { /* la connessione puo' gia' essere chiusa */ }
  }
}

async function viaResend(to: string, subject: string, html: string, replyTo?: string): Promise<Esito> {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: RESEND_FROM, reply_to: replyTo, to, subject, html }),
  });
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, via: "resend", errore: r.ok ? undefined : JSON.stringify(d) };
}

export async function invia(
  to: string,
  subject: string,
  html: string,
  opts: { replyTo?: string; forzaResend?: boolean } = {},
): Promise<Esito> {
  const zohoPronto = !!(ZOHO_USER && ZOHO_APP_PASSWORD);

  if (zohoPronto && !opts.forzaResend) {
    try {
      return await viaZoho(to, subject, html, opts.replyTo);
    } catch (e) {
      /* SMTP giu' o limite giornaliero raggiunto: meglio Resend che nessuna email. */
      if (RESEND_API_KEY) {
        const r = await viaResend(to, subject, html, opts.replyTo);
        return { ...r, via: "resend (zoho ha fallito)", errore: r.errore || String(e?.message || e) };
      }
      return { ok: false, via: "zoho", errore: String(e?.message || e) };
    }
  }

  if (RESEND_API_KEY) return await viaResend(to, subject, html, opts.replyTo);
  return { ok: false, via: "nessuno", errore: "nessun canale di invio configurato" };
}
