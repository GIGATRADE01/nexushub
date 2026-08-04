/* NexusHub — infrastruttura documenti legali multilingua.
   Ogni documento vive in un file separato e registra window.LEGAL[chiave][lingua]
   nel formato { title, updated, sections: [[titolo, htmlCorpo], ...] }.
   In caso di discrepanza fa fede la versione inglese. */
window.LEGAL_LANGS = [
  { k: "en", name: "English", dir: "ltr" },
  { k: "it", name: "Italiano", dir: "ltr" },
  { k: "fr", name: "Français", dir: "ltr" },
  { k: "es", name: "Español", dir: "ltr" },
  { k: "de", name: "Deutsch", dir: "ltr" },
  { k: "zh", name: "中文", dir: "ltr" },
  { k: "ar", name: "العربية", dir: "rtl" },
];

window.LEGAL = window.LEGAL || {};

/* Dati societari, identici in tutte le lingue tranne la resa di "Torino" e "P.IVA". */
window.LEGAL_CO = {
  en: "GIGA TRADE S.R.L.S. — single-member company<br>Via Ottavio Revel 6, 10121 Turin (TO), Italy<br>VAT ID IT13105910015 · REA TO-1339467<br>Email: <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
  it: "GIGA TRADE S.R.L.S. — Società a socio unico<br>Via Ottavio Revel 6, 10121 Torino (TO), Italia<br>P.IVA / C.F. IT13105910015 · REA TO-1339467<br>Email: <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a> · PEC: gigatrade_srls@pec.it",
  fr: "GIGA TRADE S.R.L.S. — société à associé unique<br>Via Ottavio Revel 6, 10121 Turin (TO), Italie<br>N° de TVA IT13105910015 · REA TO-1339467<br>Email : <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
  es: "GIGA TRADE S.R.L.S. — sociedad unipersonal<br>Via Ottavio Revel 6, 10121 Turín (TO), Italia<br>NIF/IVA IT13105910015 · REA TO-1339467<br>Email: <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
  de: "GIGA TRADE S.R.L.S. — Ein-Personen-Gesellschaft<br>Via Ottavio Revel 6, 10121 Turin (TO), Italien<br>USt-IdNr. IT13105910015 · REA TO-1339467<br>E-Mail: <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
  zh: "GIGA TRADE S.R.L.S.（一人有限责任公司）<br>意大利都灵市 Via Ottavio Revel 6, 10121 (TO)<br>增值税号 IT13105910015 · 工商登记号 REA TO-1339467<br>邮箱：<a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
  ar: "GIGA TRADE S.R.L.S. — شركة ذات شريك وحيد<br>Via Ottavio Revel 6, 10121 تورينو (TO)، إيطاليا<br>رقم ضريبة القيمة المضافة IT13105910015 · السجل التجاري REA TO-1339467<br>البريد الإلكتروني: <a href='mailto:info@nexushub.trade'>info@nexushub.trade</a>",
};

/* Renderer condiviso: selettore lingua, rilevamento automatico dal browser,
   memoria della scelta e supporto RTL per l'arabo. */
window.renderLegal = function (docKey, opts) {
  opts = opts || {};
  var bar = document.getElementById("langbar");
  var out = document.getElementById("doc");
  var doc = window.LEGAL[docKey];

  function pick() {
    var h = (location.hash || "").replace("#", "");
    if (doc[h]) return h;
    try {
      var saved = localStorage.getItem("nh_lang");
      if (saved && doc[saved]) return saved;
    } catch (e) {}
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return doc[nav] ? nav : "en";
  }

  function render(lang) {
    var d = doc[lang];
    var meta = window.LEGAL_LANGS.filter(function (l) { return l.k === lang; })[0] || { dir: "ltr" };
    document.documentElement.lang = lang;
    document.title = d.title + " — NexusHub";
    out.setAttribute("dir", meta.dir);
    var html = "<h1>" + d.title + "</h1><div class='upd'>" + d.updated + "</div>";
    /* Il contratto quadro riporta già l'anagrafica nell'articolo "Le parti". */
    if (opts.co !== false) html += "<div class='box'>" + window.LEGAL_CO[lang] + "</div>";
    d.sections.forEach(function (s) { html += "<h2>" + s[0] + "</h2>" + s[1]; });
    out.innerHTML = html;
    try { localStorage.setItem("nh_lang", lang); } catch (e) {}
    Array.prototype.forEach.call(bar.children, function (b) {
      b.className = b.dataset.k === lang ? "on" : "";
    });
  }

  window.LEGAL_LANGS.forEach(function (l) {
    if (!doc[l.k]) return;
    var b = document.createElement("button");
    b.textContent = l.name;
    b.dataset.k = l.k;
    b.onclick = function () { location.hash = l.k; render(l.k); };
    bar.appendChild(b);
  });
  render(pick());
  window.addEventListener("hashchange", function () { render(pick()); });
};
