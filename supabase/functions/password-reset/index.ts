/* Recupero della password.

   Perche' non usiamo quello di Supabase: il progetto usa il server di posta
   di prova incluso, che accetta due email all'ora e consegna solo alle
   caselle del titolare. In pratica un distributore che dimentica la password
   non riceve niente. Qui il collegamento lo generiamo noi e lo spediamo dalla
   posta di NexusHub, nella lingua in cui la persona si e' registrata. */

/* Niente libreria supabase-js qui dentro: caricarla insieme al client SMTP
   fa sforare il limite di memoria del worker (WORKER_RESOURCE_LIMIT) e la
   funzione muore dopo aver spedito l'email. Bastano due chiamate REST. */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { invia } from "./mailer.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITO = Deno.env.get("SITE_URL") || "https://nexushub.trade";

type Voce = { oggetto: string; titolo: string; corpo: string; tasto: string; nota: string };

const TESTI: Record<string, Voce> = {
  en: { oggetto: "Reset your NexusHub password", titolo: "Reset your password",
        corpo: "We received a request to reset the password for your NexusHub account. Click the button below to choose a new one.",
        tasto: "Choose a new password",
        nota: "The link expires in one hour and can be used once. If you did not ask for this, ignore this message: nothing changes." },
  it: { oggetto: "Reimposta la password di NexusHub", titolo: "Reimposta la password",
        corpo: "Abbiamo ricevuto la richiesta di reimpostare la password del tuo account NexusHub. Premi il tasto qui sotto per sceglierne una nuova.",
        tasto: "Scegli una nuova password",
        nota: "Il collegamento scade tra un'ora e si puo' usare una volta sola. Se non hai chiesto tu il cambio, ignora questo messaggio: non cambia nulla." },
  fr: { oggetto: "Réinitialisez votre mot de passe NexusHub", titolo: "Réinitialiser le mot de passe",
        corpo: "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte NexusHub. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.",
        tasto: "Choisir un nouveau mot de passe",
        nota: "Le lien expire dans une heure et ne peut servir qu'une fois. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : rien ne change." },
  es: { oggetto: "Restablece tu contraseña de NexusHub", titolo: "Restablecer la contraseña",
        corpo: "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de NexusHub. Pulsa el botón de abajo para elegir una nueva.",
        tasto: "Elegir una contraseña nueva",
        nota: "El enlace caduca en una hora y solo se puede usar una vez. Si no lo has pedido tú, ignora este mensaje: no cambia nada." },
  de: { oggetto: "NexusHub-Passwort zurücksetzen", titolo: "Passwort zurücksetzen",
        corpo: "Wir haben eine Anfrage erhalten, das Passwort Ihres NexusHub-Kontos zurückzusetzen. Klicken Sie auf die Schaltfläche unten, um ein neues zu wählen.",
        tasto: "Neues Passwort wählen",
        nota: "Der Link läuft in einer Stunde ab und kann einmal verwendet werden. Falls Sie das nicht angefordert haben, ignorieren Sie diese Nachricht: es ändert sich nichts." },
  zh: { oggetto: "重置您的 NexusHub 密码", titolo: "重置密码",
        corpo: "我们收到了重置您 NexusHub 账户密码的请求。请点击下方按钮设置新密码。",
        tasto: "设置新密码",
        nota: "链接一小时后失效，且仅可使用一次。若非您本人申请，请忽略本邮件，账户不会改变。" },
  ar: { oggetto: "إعادة تعيين كلمة مرور NexusHub", titolo: "إعادة تعيين كلمة المرور",
        corpo: "وصلنا طلب لإعادة تعيين كلمة مرور حسابك في NexusHub. اضغط الزر أدناه لاختيار كلمة جديدة.",
        tasto: "اختر كلمة مرور جديدة",
        nota: "ينتهي الرابط خلال ساعة ويُستخدم مرة واحدة. إن لم تطلب ذلك، تجاهل هذه الرسالة: لن يتغيّر شيء." },
};

const pagina = (v: Voce, link: string, rtl: boolean) => `
<div dir="${rtl ? "rtl" : "ltr"}" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#08080f;color:#ede9e3;padding:36px;border-radius:12px">
  <div style="text-align:center;margin-bottom:28px">
    <div style="display:inline-block;width:52px;height:52px;background:linear-gradient(135deg,#c9a84c,#7a5e28);border-radius:12px;line-height:52px;font-size:24px;font-weight:900;color:#08080f">N</div>
    <h1 style="color:#c9a84c;font-size:22px;margin:12px 0 2px">NexusHub</h1>
  </div>
  <h2 style="font-size:19px;margin:0 0 12px;color:#f0ece4">${v.titolo}</h2>
  <p style="font-size:14px;line-height:1.7;color:#c9c5be;margin:0 0 8px">${v.corpo}</p>
  <div style="text-align:center;margin:28px 0">
    <a href="${link}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#c9a84c,#7a5e28);color:#08080f;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px">${v.tasto}</a>
  </div>
  <p style="font-size:12px;line-height:1.7;color:#8890aa;margin:0">${v.nota}</p>
  <p style="color:#4a4e68;font-size:11px;text-align:center;border-top:1px solid #252838;padding-top:16px;margin-top:28px">
    GIGA TRADE S.R.L.S. · Torino, Italia · <a href="${SITO}" style="color:#c9a84c">nexushub.trade</a>
  </p>
</div>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const rispondi = (corpo: unknown, stato = 200) =>
    new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, "Content-Type": "application/json" } });

  let b: any;
  try { b = await req.json(); } catch { return rispondi({ errore: "corpo" }, 400); }

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return rispondi({ errore: "email" }, 400);

  const URL_BASE = Deno.env.get("SUPABASE_URL")!;
  const CHIAVE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const intestazioni = { apikey: CHIAVE, Authorization: `Bearer ${CHIAVE}`, "Content-Type": "application/json" };

  /* La lingua in cui la persona si e' registrata: e' quella in cui deve
     ricevere l'email. Se non la troviamo si va in inglese. */
  let linguaProfilo: string | undefined;
  try {
    const r = await fetch(`${URL_BASE}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=preferred_lang`, { headers: intestazioni });
    const righe = await r.json();
    linguaProfilo = Array.isArray(righe) && righe[0]?.preferred_lang;
  } catch { /* la lingua non e' essenziale */ }

  /* Non diciamo mai se l'indirizzo esiste o no: chi prova a indovinare le
     email dei clienti non deve ricavare niente da questa risposta. */
  const rLink = await fetch(`${URL_BASE}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: intestazioni,
    body: JSON.stringify({ type: "recovery", email, redirect_to: SITO + "/" }),
  });
  const dati = await rLink.json().catch(() => ({}));

  /* Il collegamento se lo costruisce la piattaforma, non lo si prende da
     Supabase: quello che genera Supabase torna sempre al "Site URL" del
     progetto (che qui e' rimasto http://localhost:3000) e ignora l'indirizzo
     che gli passiamo se non e' nella lista bianca del pannello. Con il
     gettone in mano il ritorno lo decidiamo noi, e non dipende piu' da
     nessuna impostazione. */
  /* Il gettone viaggia nel frammento e senza segno di uguale: la posta
     codifica il messaggio in quoted-printable e un "=" seguito da due cifre
     esadecimali viene interpretato come carattere di controllo. Il
     collegamento arrivava rotto e nessuno se ne sarebbe accorto guardando
     l'email. */
  const gettone = dati?.hashed_token || dati?.properties?.hashed_token;
  const collegamento = gettone
    ? `${SITO}/#recupero/${encodeURIComponent(gettone)}`
    : (dati?.action_link || dati?.properties?.action_link);

  if (!rLink.ok || !collegamento) {
    console.log("recupero password: nessun collegamento per questo indirizzo");
    return rispondi({ ok: true });
  }

  const lingua = (b.lang || linguaProfilo || "en") as string;
  const v = TESTI[lingua] || TESTI.en;

  /* L'invio SMTP costa piu' CPU di quanta ne abbia un worker per una singola
     richiesta: aspettarlo fa morire la funzione con WORKER_RESOURCE_LIMIT
     dopo che l'email e' gia' partita, e chi ha premuto il tasto vede un
     errore per una cosa riuscita. Quindi si risponde subito e l'invio
     prosegue in sottofondo, che e' esattamente cio' che serve qui: la
     risposta non deve dire nulla, nemmeno se l'indirizzo esiste. */
  const spedizione = invia(email, v.oggetto, pagina(v, collegamento, lingua === "ar"), {
    replyTo: "info@nexushub.trade",
  }).then((esito) => {
    if (!esito.ok) console.error("recupero password non spedito:", esito.errore);
  }).catch((e) => console.error("recupero password, errore di invio:", String(e?.message || e)));

  const runtime = (globalThis as any).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(spedizione);

  return rispondi({ ok: true });
});
