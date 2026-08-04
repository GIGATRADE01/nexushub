/**
 * launch-notify — email di lancio prodotto verso i distributori.
 *
 * Due modalita':
 *   { launch_id }  -> annuncio, chiamato dal brand dal proprio pannello
 *   { cron: true } -> promemoria ricorrenti (7 giorni prima, 1 giorno prima, giorno del lancio)
 *
 * Ogni destinatario riceve l'email nella propria lingua (profiles.preferred_lang,
 * altrimenti dedotta dal paese, altrimenti inglese). Un invio per destinatario/lancio/tipo:
 * l'indice unico su launch_notifications impedisce i doppioni.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
/* Quando nexushub.trade sara' verificato su Resend bastera' impostare EMAIL_FROM. */
const FROM = Deno.env.get("EMAIL_FROM") || "NexusHub <onboarding@resend.dev>";
const SITE = "https://nexushub.trade";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Kind = "announce" | "reminder_7" | "reminder_1" | "launch_day";

/* ---------------------------------------------------------------- lingue */

const LANG_BY_COUNTRY: Record<string, string> = {
  IT: "it", FR: "fr", BE: "fr", LU: "fr", MC: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es",
  DE: "de", AT: "de", CH: "de",
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  AE: "ar", SA: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar",
  EG: "ar", MA: "ar", TN: "ar", DZ: "ar", JO: "ar", LB: "ar", IQ: "ar",
};

const langOf = (p: { preferred_lang?: string | null; country?: string | null }) => {
  const pref = (p.preferred_lang || "").slice(0, 2).toLowerCase();
  if (["en", "it", "fr", "es", "de", "zh", "ar"].includes(pref)) return pref;
  const c = (p.country || "").trim().toUpperCase();
  return LANG_BY_COUNTRY[c] || (c.length > 2 ? LANG_BY_COUNTRY[c.slice(0, 2)] : null) || "en";
};

/* Testi. {brand} {title} {date} {days} vengono sostituiti a runtime. */
const TXT: Record<string, Record<Kind, { subject: string; head: string; body: string }> & { cta: string; why: string; stop: string; when: string }> = {
  en: {
    announce: { subject: "{brand} — new launch: {title}", head: "New launch", body: "{brand} is preparing a new launch on NexusHub. Here are the details; you can reserve your quantity before the launch date." },
    reminder_7: { subject: "{title} — 7 days to launch", head: "7 days to go", body: "{brand} launches {title} in one week. Reserve now to secure your allocation." },
    reminder_1: { subject: "{title} — tomorrow", head: "Tomorrow", body: "{brand} launches {title} tomorrow. Last call to reserve your quantity." },
    launch_day: { subject: "{title} — available today", head: "Available today", body: "{title} by {brand} launches today and can be ordered on NexusHub." },
    cta: "View the launch", why: "You receive this email as an authorised distributor on NexusHub.", stop: "To stop these notifications, reply STOP.", when: "Launch date",
  },
  it: {
    announce: { subject: "{brand} — nuovo lancio: {title}", head: "Nuovo lancio", body: "{brand} sta preparando un nuovo lancio su NexusHub. Qui i dettagli: puoi prenotare la tua quantita' prima della data di lancio." },
    reminder_7: { subject: "{title} — mancano 7 giorni", head: "Mancano 7 giorni", body: "{brand} lancia {title} fra una settimana. Prenota ora per assicurarti la tua quota." },
    reminder_1: { subject: "{title} — domani", head: "Domani", body: "{brand} lancia {title} domani. Ultima occasione per prenotare la tua quantita'." },
    launch_day: { subject: "{title} — disponibile da oggi", head: "Disponibile da oggi", body: "{title} di {brand} viene lanciato oggi ed e' ordinabile su NexusHub." },
    cta: "Vedi il lancio", why: "Ricevi questa email in quanto distributore autorizzato su NexusHub.", stop: "Per non ricevere piu' queste notifiche, rispondi STOP.", when: "Data di lancio",
  },
  fr: {
    announce: { subject: "{brand} — nouveau lancement : {title}", head: "Nouveau lancement", body: "{brand} prepare un nouveau lancement sur NexusHub. Voici les details : vous pouvez reserver votre quantite avant la date de lancement." },
    reminder_7: { subject: "{title} — J-7", head: "J-7", body: "{brand} lance {title} dans une semaine. Reservez des maintenant pour securiser votre allocation." },
    reminder_1: { subject: "{title} — demain", head: "Demain", body: "{brand} lance {title} demain. Derniere occasion de reserver votre quantite." },
    launch_day: { subject: "{title} — disponible aujourd'hui", head: "Disponible aujourd'hui", body: "{title} de {brand} est lance aujourd'hui et peut etre commande sur NexusHub." },
    cta: "Voir le lancement", why: "Vous recevez cet email en tant que distributeur autorise sur NexusHub.", stop: "Pour ne plus recevoir ces notifications, repondez STOP.", when: "Date de lancement",
  },
  es: {
    announce: { subject: "{brand} — nuevo lanzamiento: {title}", head: "Nuevo lanzamiento", body: "{brand} prepara un nuevo lanzamiento en NexusHub. Estos son los detalles: puedes reservar tu cantidad antes de la fecha de lanzamiento." },
    reminder_7: { subject: "{title} — faltan 7 dias", head: "Faltan 7 dias", body: "{brand} lanza {title} dentro de una semana. Reserva ahora para asegurar tu asignacion." },
    reminder_1: { subject: "{title} — manana", head: "Manana", body: "{brand} lanza {title} manana. Ultima oportunidad para reservar tu cantidad." },
    launch_day: { subject: "{title} — disponible hoy", head: "Disponible hoy", body: "{title} de {brand} se lanza hoy y ya puede pedirse en NexusHub." },
    cta: "Ver el lanzamiento", why: "Recibes este email como distribuidor autorizado en NexusHub.", stop: "Para dejar de recibir estas notificaciones, responde STOP.", when: "Fecha de lanzamiento",
  },
  de: {
    announce: { subject: "{brand} — neue Einfuhrung: {title}", head: "Neue Einfuhrung", body: "{brand} bereitet eine neue Produkteinfuhrung auf NexusHub vor. Hier die Details: Sie konnen Ihre Menge vor dem Starttermin reservieren." },
    reminder_7: { subject: "{title} — noch 7 Tage", head: "Noch 7 Tage", body: "{brand} bringt {title} in einer Woche auf den Markt. Reservieren Sie jetzt Ihr Kontingent." },
    reminder_1: { subject: "{title} — morgen", head: "Morgen", body: "{brand} bringt {title} morgen auf den Markt. Letzte Gelegenheit zur Reservierung." },
    launch_day: { subject: "{title} — ab heute verfugbar", head: "Ab heute verfugbar", body: "{title} von {brand} startet heute und kann auf NexusHub bestellt werden." },
    cta: "Zur Einfuhrung", why: "Sie erhalten diese E-Mail als autorisierter Distributor auf NexusHub.", stop: "Wenn Sie diese Benachrichtigungen nicht mehr erhalten mochten, antworten Sie mit STOP.", when: "Starttermin",
  },
  zh: {
    announce: { subject: "{brand} — 新品发布：{title}", head: "新品发布", body: "{brand} 正在 NexusHub 筹备新品发布。详情如下，您可在发布日之前预订数量。" },
    reminder_7: { subject: "{title} — 距发布还有 7 天", head: "距发布还有 7 天", body: "{brand} 将于一周后发布 {title}。立即预订以锁定您的配额。" },
    reminder_1: { subject: "{title} — 明天发布", head: "明天发布", body: "{brand} 将于明天发布 {title}。这是预订数量的最后机会。" },
    launch_day: { subject: "{title} — 今日上市", head: "今日上市", body: "{brand} 的 {title} 今日发布，现可在 NexusHub 下单。" },
    cta: "查看发布", why: "您作为 NexusHub 的授权分销商收到此邮件。", stop: "如不愿再收到此类通知，请回复 STOP。", when: "发布日期",
  },
  ar: {
    announce: { subject: "{brand} — إطلاق جديد: {title}", head: "إطلاق جديد", body: "تستعد {brand} لإطلاق منتج جديد على NexusHub. إليك التفاصيل، ويمكنك حجز كميتك قبل تاريخ الإطلاق." },
    reminder_7: { subject: "{title} — 7 أيام على الإطلاق", head: "7 أيام على الإطلاق", body: "تطلق {brand} منتج {title} بعد أسبوع. احجز الآن لتأمين حصتك." },
    reminder_1: { subject: "{title} — غدًا", head: "غدًا", body: "تطلق {brand} منتج {title} غدًا. هذه آخر فرصة لحجز كميتك." },
    launch_day: { subject: "{title} — متاح اليوم", head: "متاح اليوم", body: "يُطلق {title} من {brand} اليوم، وأصبح متاحًا للطلب على NexusHub." },
    cta: "عرض الإطلاق", why: "تصلك هذه الرسالة بصفتك موزّعًا معتمدًا على NexusHub.", stop: "لإيقاف هذه الإشعارات، ردّ بكلمة STOP.", when: "تاريخ الإطلاق",
  },
};

const fill = (s: string, v: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

const esc = (s: string) =>
  String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function buildEmail(lang: string, kind: Kind, l: any, brandName: string) {
  const T = TXT[lang] || TXT.en;
  const rtl = lang === "ar";
  const vars = {
    brand: esc(brandName),
    title: esc(l.title),
    date: new Date(l.launch_date).toLocaleDateString(lang === "zh" ? "zh-CN" : lang, { day: "2-digit", month: "long", year: "numeric" }),
  };
  const subject = fill(T[kind].subject, vars);
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";

  const html = `<div dir="${dir}" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#08080f;color:#ede9e3;padding:36px;border-radius:12px;text-align:${align}">
  <div style="text-align:center;margin-bottom:26px">
    <div style="display:inline-block;width:52px;height:52px;background:linear-gradient(135deg,#c9a84c,#7a5e28);border-radius:12px;line-height:52px;font-size:24px;font-weight:900;color:#08080f">N</div>
    <h1 style="color:#c9a84c;font-size:22px;margin:12px 0 2px">NexusHub</h1>
    <p style="color:#8890aa;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin:0">Global B2B Distribution Platform</p>
  </div>
  <div style="background:#c9a84c15;border:1px solid #c9a84c40;border-radius:10px;padding:18px;text-align:center;margin-bottom:18px">
    <p style="color:#c9a84c;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 6px">${esc(T[kind].head)}</p>
    <h2 style="color:#ede9e3;margin:0;font-size:21px">${vars.title}</h2>
    ${l.subtitle ? `<p style="color:#8890aa;margin:6px 0 0;font-size:14px">${esc(l.subtitle)}</p>` : ""}
  </div>
  ${l.cover_url ? `<img src="${esc(l.cover_url)}" alt="${vars.title}" style="width:100%;border-radius:10px;margin-bottom:18px">` : ""}
  <p style="color:#ede9e3;font-size:15px;line-height:1.7">${fill(T[kind].body, vars)}</p>
  ${l.description ? `<p style="color:#8890aa;font-size:14px;line-height:1.7">${esc(l.description)}</p>` : ""}
  <div style="background:#151720;border-radius:10px;padding:14px 16px;margin:18px 0">
    <span style="color:#8890aa;font-size:13px">${esc(T.when)}</span>
    <span style="color:#e2bc6a;font-weight:700;font-size:15px;float:${rtl ? "left" : "right"}">${vars.date}</span>
    <div style="clear:both"></div>
  </div>
  <div style="text-align:center;margin:26px 0">
    <a href="${SITE}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#c9a84c,#7a5e28);color:#08080f;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px">${esc(T.cta)} &rarr;</a>
  </div>
  <p style="color:#4a4e68;font-size:11px;text-align:center;border-top:1px solid #252838;padding-top:16px;margin-top:26px">
    ${esc(T.why)} ${esc(T.stop)}<br>
    NexusHub &middot; GIGA TRADE S.R.L.S. &middot; Via Ottavio Revel 6, 10121 Torino, Italia &middot; <a href="${SITE}" style="color:#c9a84c">nexushub.trade</a>
  </p>
</div>`;
  return { subject, html };
}

async function sendOne(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Resend HTTP ${res.status}`);
  return data;
}

/* Invia un tipo di notifica per un lancio, saltando chi l'ha gia' ricevuta. */
async function notifyLaunch(db: any, launch: any, kind: Kind, onlySubscribers: boolean) {
  const { data: brand } = await db.from("profiles").select("company_name").eq("id", launch.brand_id).single();
  const brandName = brand?.company_name || "NexusHub";

  const ids = new Set<string>();
  const { data: subs } = await db.from("launch_subscribers").select("distributor_id").eq("launch_id", launch.id).eq("notify", true);
  (subs || []).forEach((s: any) => s.distributor_id && ids.add(s.distributor_id));

  if (!onlySubscribers) {
    const { data: rel } = await db.from("brand_distributor_relationships")
      .select("distributor_id, status").eq("brand_id", launch.brand_id);
    (rel || []).filter((r: any) => String(r.status) === "approved" || String(r.status) === "active")
      .forEach((r: any) => r.distributor_id && ids.add(r.distributor_id));
  }
  if (!ids.size) return { sent: 0, skipped: 0, failed: 0 };

  const { data: people } = await db.from("profiles")
    .select("id, email, company_name, country, preferred_lang, status")
    .in("id", [...ids]);

  const { data: already } = await db.from("launch_notifications")
    .select("email").eq("launch_id", launch.id).eq("kind", kind);
  const done = new Set((already || []).map((a: any) => a.email));

  let sent = 0, skipped = 0, failed = 0;
  for (const p of people || []) {
    if (!p.email || done.has(p.email)) { skipped++; continue; }
    if (p.status && String(p.status) !== "approved" && String(p.status) !== "active") { skipped++; continue; }
    const lang = langOf(p);
    const { subject, html } = buildEmail(lang, kind, launch, brandName);
    try {
      await sendOne(p.email, subject, html);
      await db.from("launch_notifications").insert({ launch_id: launch.id, distributor_id: p.id, email: p.email, kind, lang, status: "sent" });
      sent++;
    } catch (e) {
      await db.from("launch_notifications").insert({ launch_id: launch.id, distributor_id: p.id, email: p.email, kind, lang, status: "failed", error: String(e).slice(0, 300) });
      failed++;
    }
  }
  return { sent, skipped, failed };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const db = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));

    /* --- anteprima: restituisce l'email senza inviarla --- */
    if (body.preview) {
      const { data: launch } = await db.from("product_launches").select("*").eq("id", body.launch_id).single();
      if (!launch) return json({ error: "launch not found" }, 404);
      const { data: brand } = await db.from("profiles").select("company_name").eq("id", launch.brand_id).single();
      const out = buildEmail(body.lang || "en", (body.kind || "announce") as Kind, launch, brand?.company_name || "NexusHub");
      return json({ ok: true, ...out });
    }

    /* --- giro dei promemoria: 7 giorni prima, 1 giorno prima, giorno del lancio --- */
    if (body.cron) {
      const { data: launches } = await db.from("product_launches")
        .select("*").eq("status", "published").gte("launch_date", new Date(Date.now() - 86400000).toISOString());
      const out: any[] = [];
      const today = new Date(); today.setHours(0, 0, 0, 0);
      for (const l of launches || []) {
        const d = new Date(l.launch_date); d.setHours(0, 0, 0, 0);
        const days = Math.round((d.getTime() - today.getTime()) / 86400000);
        const kind: Kind | null = days === 7 ? "reminder_7" : days === 1 ? "reminder_1" : days === 0 ? "launch_day" : null;
        if (!kind) continue;
        out.push({ launch: l.title, kind, ...(await notifyLaunch(db, l, kind, true)) });
      }
      return json({ ok: true, processed: out });
    }

    /* --- annuncio: solo il brand proprietario del lancio --- */
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token) return json({ error: "missing token" }, 401);
    const { data: auth } = await db.auth.getUser(token);
    const uid = auth?.user?.id;
    if (!uid) return json({ error: "invalid token" }, 401);

    const { data: launch } = await db.from("product_launches").select("*").eq("id", body.launch_id).single();
    if (!launch) return json({ error: "launch not found" }, 404);
    if (launch.brand_id !== uid) return json({ error: "not your launch" }, 403);
    if (launch.status !== "published") return json({ error: "publish the launch first" }, 400);

    const res = await notifyLaunch(db, launch, "announce", false);
    return json({ ok: true, ...res });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
