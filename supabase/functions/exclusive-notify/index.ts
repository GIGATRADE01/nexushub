// exclusive-notify — le email sulle esclusive territoriali, a brand e distributore.
//
// Un'esclusiva senza scadenza non la concede nessuno; una con scadenza che
// arriva senza preavviso fa perdere il territorio a chi stava vendendo bene.
// Da qui partono tre cose:
//   avviso     -> mancano 60 / 30 / 7 giorni: quanto e' stato fatto e cosa serve
//   rinnovata  -> obiettivo raggiunto, il periodo riparte
//   decaduta   -> obiettivo mancato: il territorio torna disponibile
//
// Ognuno la riceve nella propria lingua (profiles.preferred_lang), arabo
// compreso, con il testo che gira da destra a sinistra.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { invia } from "./mailer.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://nexushub.trade";

async function db(path: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!r.ok) return [];
  return await r.json();
}

type Ctx = {
  brand: string;
  dist: string;
  paese: string;
  giorni: number;
  fatti: number;
  minimo: number;
  scadenza: string;
};

/* Sette lingue. Le chiavi con {…} vengono sostituite alla fine. */
const L: Record<string, Record<string, string>> = {
  en: {
    avvisoT: "Exclusivity for {paese}: {giorni} days left",
    avvisoB: "The exclusive rights held by {dist} for {paese} on {brand} expire on {scadenza}.",
    rinnT: "Exclusivity for {paese} renewed",
    rinnB: "The target was met, so the exclusive rights of {dist} for {paese} on {brand} have been renewed automatically.",
    decT: "Exclusivity for {paese} has ended",
    decB: "The minimum was not reached, so the exclusive rights of {dist} for {paese} on {brand} have ended. The territory is open again and new distributors can apply.",
    progresso: "Purchased in this period",
    minimo: "Minimum for renewal",
    scade: "Expires on",
    units: "units",
    nessunMin: "no minimum set",
    cta: "Open the platform",
    firma: "NexusHub · The European Distribution Platform · Turin, Italy",
  },
  it: {
    avvisoT: "Esclusiva {paese}: mancano {giorni} giorni",
    avvisoB: "L'esclusiva di {dist} per {paese} su {brand} scade il {scadenza}.",
    rinnT: "Esclusiva {paese} rinnovata",
    rinnB: "L'obiettivo è stato raggiunto: l'esclusiva di {dist} per {paese} su {brand} è stata rinnovata automaticamente.",
    decT: "Esclusiva {paese} terminata",
    decB: "Il minimo non è stato raggiunto: l'esclusiva di {dist} per {paese} su {brand} è terminata. Il territorio torna disponibile e nuovi distributori possono candidarsi.",
    progresso: "Acquistato nel periodo",
    minimo: "Minimo per il rinnovo",
    scade: "Scade il",
    units: "pezzi",
    nessunMin: "nessun minimo impostato",
    cta: "Apri la piattaforma",
    firma: "NexusHub · La piattaforma europea di distribuzione · Torino, Italia",
  },
  fr: {
    avvisoT: "Exclusivité {paese} : {giorni} jours restants",
    avvisoB: "L'exclusivité de {dist} pour {paese} sur {brand} expire le {scadenza}.",
    rinnT: "Exclusivité {paese} renouvelée",
    rinnB: "L'objectif a été atteint : l'exclusivité de {dist} pour {paese} sur {brand} a été renouvelée automatiquement.",
    decT: "Exclusivité {paese} terminée",
    decB: "Le minimum n'a pas été atteint : l'exclusivité de {dist} pour {paese} sur {brand} a pris fin. Le territoire est de nouveau disponible.",
    progresso: "Acheté sur la période",
    minimo: "Minimum pour le renouvellement",
    scade: "Expire le",
    units: "pièces",
    nessunMin: "aucun minimum fixé",
    cta: "Ouvrir la plateforme",
    firma: "NexusHub · La plateforme européenne de distribution · Turin, Italie",
  },
  es: {
    avvisoT: "Exclusividad {paese}: quedan {giorni} días",
    avvisoB: "La exclusividad de {dist} para {paese} sobre {brand} vence el {scadenza}.",
    rinnT: "Exclusividad {paese} renovada",
    rinnB: "Se alcanzó el objetivo: la exclusividad de {dist} para {paese} sobre {brand} se ha renovado automáticamente.",
    decT: "Exclusividad {paese} finalizada",
    decB: "No se alcanzó el mínimo: la exclusividad de {dist} para {paese} sobre {brand} ha terminado. El territorio vuelve a estar disponible.",
    progresso: "Comprado en el periodo",
    minimo: "Mínimo para renovar",
    scade: "Vence el",
    units: "unidades",
    nessunMin: "sin mínimo establecido",
    cta: "Abrir la plataforma",
    firma: "NexusHub · La plataforma europea de distribución · Turín, Italia",
  },
  de: {
    avvisoT: "Exklusivität {paese}: noch {giorni} Tage",
    avvisoB: "Die Exklusivrechte von {dist} für {paese} auf {brand} laufen am {scadenza} aus.",
    rinnT: "Exklusivität {paese} verlängert",
    rinnB: "Das Ziel wurde erreicht: Die Exklusivrechte von {dist} für {paese} auf {brand} wurden automatisch verlängert.",
    decT: "Exklusivität {paese} beendet",
    decB: "Das Minimum wurde nicht erreicht: Die Exklusivrechte von {dist} für {paese} auf {brand} sind beendet. Das Gebiet ist wieder verfügbar.",
    progresso: "Im Zeitraum gekauft",
    minimo: "Minimum für die Verlängerung",
    scade: "Läuft ab am",
    units: "Stück",
    nessunMin: "kein Minimum festgelegt",
    cta: "Plattform öffnen",
    firma: "NexusHub · Die europäische Distributionsplattform · Turin, Italien",
  },
  zh: {
    avvisoT: "{paese} 独家权：还剩 {giorni} 天",
    avvisoB: "{dist} 在 {paese} 对 {brand} 的独家经销权将于 {scadenza} 到期。",
    rinnT: "{paese} 独家权已续期",
    rinnB: "目标已达成：{dist} 在 {paese} 对 {brand} 的独家经销权已自动续期。",
    decT: "{paese} 独家权已结束",
    decB: "未达到最低要求：{dist} 在 {paese} 对 {brand} 的独家经销权已结束，该区域重新开放。",
    progresso: "本期采购量",
    minimo: "续期所需最低量",
    scade: "到期日",
    units: "件",
    nessunMin: "未设置最低量",
    cta: "打开平台",
    firma: "NexusHub · 欧洲分销平台 · 意大利都灵",
  },
  ar: {
    avvisoT: "حصرية {paese}: تبقّى {giorni} يومًا",
    avvisoB: "تنتهي حصرية {dist} في {paese} على {brand} بتاريخ {scadenza}.",
    rinnT: "تم تجديد حصرية {paese}",
    rinnB: "تم تحقيق الهدف، لذا جُدِّدت حصرية {dist} في {paese} على {brand} تلقائيًا.",
    decT: "انتهت حصرية {paese}",
    decB: "لم يتم بلوغ الحد الأدنى، لذا انتهت حصرية {dist} في {paese} على {brand}. الإقليم متاح مجددًا ويمكن لموزّعين جدد التقدّم.",
    progresso: "المشتريات خلال الفترة",
    minimo: "الحد الأدنى للتجديد",
    scade: "تنتهي في",
    units: "قطعة",
    nessunMin: "لا يوجد حد أدنى",
    cta: "افتح المنصة",
    firma: "NexusHub · منصة التوزيع الأوروبية · تورينو، إيطاليا",
  },
};

const riempi = (s: string, c: Ctx) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String((c as any)[k] ?? ""));

function corpo(lang: string, evento: string, c: Ctx) {
  const d = L[lang] || L.en;
  const rtl = lang === "ar";
  const colore = evento === "decaduta" ? "#c0392b" : evento === "rinnovata" ? "#27ae60" : "#c9a84c";
  const titolo = riempi(d[evento === "avviso" ? "avvisoT" : evento === "rinnovata" ? "rinnT" : "decT"], c);
  const testo = riempi(d[evento === "avviso" ? "avvisoB" : evento === "rinnovata" ? "rinnB" : "decB"], c);

  const barra = c.minimo > 0
    ? `<div style="margin:18px 0">
         <div style="display:flex;justify-content:space-between;font-size:12px;color:#8890aa;margin-bottom:6px">
           <span>${d.progresso}: <strong style="color:#ede9e3">${c.fatti} ${d.units}</strong></span>
           <span>${d.minimo}: <strong style="color:#ede9e3">${c.minimo} ${d.units}</strong></span>
         </div>
         <div style="height:8px;background:#252838;border-radius:5px;overflow:hidden">
           <div style="height:8px;width:${Math.min(100, Math.round((c.fatti / c.minimo) * 100))}%;background:${c.fatti >= c.minimo ? "#27ae60" : "#c9a84c"}"></div>
         </div>
       </div>`
    : `<p style="color:#8890aa;font-size:12px;margin:14px 0">${d.progresso}: <strong style="color:#ede9e3">${c.fatti} ${d.units}</strong> · ${d.nessunMin}</p>`;

  const html = `
<div dir="${rtl ? "rtl" : "ltr"}" style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#08080f;color:#ede9e3;padding:34px;border-radius:12px;text-align:${rtl ? "right" : "left"}">
  <div style="text-align:center;margin-bottom:24px">
    <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#c9a84c,#7a5e28);border-radius:11px;line-height:48px;font-size:22px;font-weight:900;color:#08080f">N</div>
  </div>
  <div style="background:${colore}15;border:1px solid ${colore}45;border-radius:10px;padding:18px;margin-bottom:18px">
    <h2 style="color:${colore};margin:0;font-size:19px">${titolo}</h2>
  </div>
  <p style="color:#ede9e3;font-size:15px;line-height:1.7;margin:0 0 6px">${testo}</p>
  ${evento === "avviso" ? `<p style="color:#8890aa;font-size:13px;margin:0">${d.scade}: <strong style="color:#e2bc6a">${c.scadenza}</strong></p>` : ""}
  ${barra}
  <div style="text-align:center;margin:26px 0 4px">
    <a href="${SITE}" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#c9a84c,#7a5e28);color:#08080f;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px">${d.cta} &rarr;</a>
  </div>
  <p style="color:#4a4e68;font-size:11px;text-align:center;border-top:1px solid #252838;padding-top:14px;margin-top:24px">${d.firma}</p>
</div>`;

  return { subject: titolo, html };
}

serve(async (req) => {
  try {
    const { req_id, evento, preview } = await req.json();
    if (!req_id || !evento) {
      return new Response(JSON.stringify({ error: "servono req_id e evento" }), { status: 400 });
    }

    const [r] = await db(`brand_access_requests?id=eq.${req_id}&select=*`);
    if (!r) return new Response(JSON.stringify({ error: "esclusiva inesistente" }), { status: 404 });

    const [b] = await db(`profiles?id=eq.${r.brand_id}&select=company_name,email,preferred_lang`);
    const [d] = await db(`profiles?id=eq.${r.distributor_id}&select=company_name,email,country,preferred_lang`);
    const [st] = await db(`esclusive_stato?id=eq.${req_id}&select=giorni_mancanti,pezzi_fatti`);

    const c: Ctx = {
      brand: b?.company_name || "—",
      dist: d?.company_name || "—",
      paese: d?.country || "—",
      giorni: st?.giorni_mancanti ?? 0,
      fatti: st?.pezzi_fatti ?? 0,
      minimo: r.exclusive_min_units || 0,
      scadenza: r.exclusive_until ? String(r.exclusive_until).slice(0, 10) : "—",
    };

    /* Ognuno nella propria lingua: la stessa notizia, due email diverse. */
    const destinatari = [
      { email: b?.email, lang: (b?.preferred_lang || "en").toLowerCase() },
      { email: d?.email, lang: (d?.preferred_lang || "en").toLowerCase() },
    ].filter((x) => !!x.email);

    const esiti = [];
    for (const dest of destinatari) {
      const { subject, html } = corpo(dest.lang, evento, c);
      if (preview) {
        esiti.push({ to: dest.email, lang: dest.lang, subject });
      } else {
        const e = await invia(dest.email!, subject, html);
        esiti.push({ to: dest.email, lang: dest.lang, ...e });
      }
    }

    return new Response(JSON.stringify({ evento, esiti }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500 });
  }
});
