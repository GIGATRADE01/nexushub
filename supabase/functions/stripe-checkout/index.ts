// stripe-checkout — DISMESSA. Il flusso di pagamento vive in stripe-connect.
//
// Questa era la prima versione: creava la sessione con una commissione fissa
// all'11,4%, rimandava al vecchio dominio vercel e soprattutto accettava
// webhook SENZA verificarne la firma. Chiunque poteva quindi inviare un finto
// "pagamento completato" e far risultare pagato un ordine mai pagato.
//
// Non viene piu' chiamata dal sito (che usa stripe-connect), ma restava
// raggiungibile: qui resta solo un guscio che rifiuta tutto. Se su Stripe
// esistesse ancora un endpoint puntato qui, la firma viene comunque verificata
// prima di rispondere, cosi' nessun pagamento vero va perso in silenzio.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

async function firmaValida(payload: string, header: string, secret: string): Promise<boolean> {
  try {
    if (!header || !secret) return false;
    let t = "";
    const v1s: string[] = [];
    for (const part of header.split(",")) {
      const [k, val] = part.split("=");
      if (k === "t") t = val;
      else if (k === "v1") v1s.push(val);
    }
    if (!t || !v1s.length) return false;
    if (Math.abs(Math.floor(Date.now() / 1000) - Number(t)) > 300) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${payload}`));
    const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return v1s.includes(hex);
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  if (req.method === "POST") {
    const raw = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    /* Un webhook davvero firmato da Stripe significa che l'endpoint e' ancora
       configurato qui: va spostato su stripe-connect, e intanto lo si dice
       chiaramente invece di far finta di averlo elaborato. */
    if (sig && (await firmaValida(raw, sig, STRIPE_WEBHOOK_SECRET))) {
      return new Response(
        JSON.stringify({
          error: "endpoint dismesso",
          azione: "Su Stripe, spostare il webhook su /functions/v1/stripe-connect",
        }),
        { status: 410, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    return new Response("Invalid signature", { status: 400, headers: cors });
  }

  return new Response(
    JSON.stringify({ stato: "dismessa", usare: "stripe-connect" }),
    { status: 410, headers: { ...cors, "Content-Type": "application/json" } },
  );
});
