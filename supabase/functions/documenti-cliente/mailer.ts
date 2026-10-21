// Un solo posto da cui partono le email della piattaforma.
//
// Canale principale: SMTP Zoho. Il dominio e' gia' firmato con il selettore
// zmail e i report DMARC di Google, Microsoft e Messe Frankfurt confermano SPF
// e DKIM in pass: le email escono da @nexushub.trade senza dover verificare
// nulla altrove.
//
// Attenzione alla chiusura della connessione: aspettare close() fa esaurire le
// risorse del worker (WORKER_RESOURCE_LIMIT) DOPO che l'email e' gia' partita.
// Il risultato sarebbe un falso fallimento, e la coda rispedirebbe la stessa
// notifica. Quindi: si considera riuscito l'invio quando send() ritorna, e la
// connessione si chiude senza attenderla.
//
// Resend resta come riserva se SMTP non risponde. Serve pero' il dominio
// verificato su Resend, altrimenti consegna solo alla casella del titolare.

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

/* I valori arrivano da un incolla a mano nel pannello: tab, spazi e virgolette
   di troppo sono la norma, e un solo carattere invisibile fa fallire l'invio
   con un messaggio che non dice nulla. Si ripuliscono qui, una volta sola. */
const pulisci = (v?: string) => v?.replace(/^[\s"']+|[\s"']+$/g, "") || undefined;

const ZOHO_USER = pulisci(Deno.env.get("ZOHO_USER"));
const ZOHO_APP_PASSWORD = pulisci(Deno.env.get("ZOHO_APP_PASSWORD"));
const ZOHO_SMTP = pulisci(Deno.env.get("ZOHO_SMTP")) || "smtppro.zoho.eu";

/* Seconda casella, per le email che vanno ai clienti. Zoho non lascia
   scrivere "da" un indirizzo diverso da quello con cui ci si autentica:
   per far uscire le email da info@ bisogna entrare come info@. Se queste
   due voci non ci sono, si spedisce dalla casella principale. */
const ZOHO_USER_INFO = pulisci(Deno.env.get("ZOHO_USER_INFO"));
const ZOHO_APP_PASSWORD_INFO = pulisci(Deno.env.get("ZOHO_APP_PASSWORD_INFO"));

/* Sceglie con quali credenziali entrare, in base a chi deve risultare il
   mittente. */
function credenziali(mittente?: string) {
  if (mittente && ZOHO_USER_INFO && ZOHO_APP_PASSWORD_INFO
      && mittente.toLowerCase() === ZOHO_USER_INFO.toLowerCase()) {
    return { utente: ZOHO_USER_INFO, password: ZOHO_APP_PASSWORD_INFO };
  }
  return { utente: ZOHO_USER!, password: ZOHO_APP_PASSWORD! };
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = pulisci(Deno.env.get("EMAIL_FROM")) || "NexusHub <onboarding@resend.dev>";
const REPLY_TO = pulisci(Deno.env.get("EMAIL_REPLY_TO")) || "info@nexushub.trade";

export type Esito = { ok: boolean; via: string; errore?: string };

/* Zoho accetta come mittente la casella autenticata o un suo alias. Le
   email dirette ai clienti devono uscire da info@, non dalla casella
   personale: chi risponde deve finire nella casella giusta e il cliente non
   deve vedere l'indirizzo privato. Se Zoho rifiuta l'alias, l'errore lo dice
   e si torna al mittente autenticato. */
async function viaZoho(to: string, subject: string, html: string, replyTo?: string, mittente?: string): Promise<Esito> {
  const c = credenziali(mittente);
  const client = new SMTPClient({
    connection: {
      hostname: ZOHO_SMTP,
      port: 465,
      tls: true,
      auth: { username: c.utente, password: c.password },
    },
  });

  /* Il mittente e' sempre la casella con cui siamo entrati: chiedere un
     indirizzo diverso fa rifiutare l'invio, oppure Zoho lo riscrive e non
     si capisce perche' l'email risulti partita da un altro indirizzo. */
  await client.send({
    from: `NexusHub <${c.utente}>`,
    to,
    replyTo: replyTo || ZOHO_USER!,
    subject,
    html,
    content: "auto",
  });

  /* Da qui in poi l'email e' partita: qualunque cosa succeda alla connessione
     non deve piu' cambiare l'esito. Le si concede un secondo e mezzo per
     chiudersi pulita - lasciarla aperta fa terminare male il worker, aspettarla
     senza limite lo blocca. */
  await Promise.race([
    client.close().catch(() => {}),
    new Promise((r) => setTimeout(r, 1500)),
  ]);
  return { ok: true, via: "zoho" };
}

async function viaResend(to: string, subject: string, html: string, replyTo?: string, mittente?: string): Promise<Esito> {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: mittente ? `NexusHub <${mittente}>` : RESEND_FROM, reply_to: replyTo || REPLY_TO, to, subject, html }),
  });
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, via: "resend", errore: r.ok ? undefined : JSON.stringify(d) };
}

export async function invia(
  to: string,
  subject: string,
  html: string,
  opts: { replyTo?: string; forzaResend?: boolean; mittente?: string } = {},
): Promise<Esito> {
  const zohoPronto = !!(ZOHO_USER && ZOHO_APP_PASSWORD);

  if (zohoPronto && !opts.forzaResend) {
    try {
      return await viaZoho(to, subject, html, opts.replyTo, opts.mittente);
    } catch (e) {
      const errZoho = String(e?.message || e);
      /* Se la seconda casella non risponde, si riprova con quella
         principale: meglio l'email dal mittente sbagliato che nessuna. */
      if (opts.mittente) {
        try {
          await viaZoho(to, subject, html, opts.replyTo);
          return { ok: true, via: "zoho (mittente di ripiego)", errore: `alias rifiutato: ${errZoho}` };
        } catch (e2) { /* si passa alla riserva */ }
      }
      if (RESEND_API_KEY) {
        const r = await viaResend(to, subject, html, opts.replyTo, opts.mittente);
        return { ...r, via: "resend (zoho ha fallito)", errore: `zoho: ${errZoho} || resend: ${r.errore ?? "ok"}` };
      }
      return { ok: false, via: "zoho", errore: errZoho };
    }
  }

  if (RESEND_API_KEY) return await viaResend(to, subject, html, opts.replyTo, opts.mittente);
  return { ok: false, via: "nessuno", errore: "nessun canale di invio configurato" };
}
