# -*- coding: utf-8 -*-
"""Genera le pagine pubbliche per marchio: lattafa-ingrosso.html e compagnia.

PERCHE' (26/10/2026). Tutti e tre i cervelli, interrogati separatamente sul
marketing, hanno messo queste pagine fra le prime tre cose da fare, e per lo
stesso motivo: un negoziante non cerca "piattaforma di distribuzione B2B".
Cerca IL MARCHIO PIU' LA PAROLA INGROSSO - "lattafa ingrosso", "armaf
ingrosso" - e su quelle parole, in italiano, la concorrenza e' quasi zero.
Una pagina scritta bene si posiziona in un mese o due e poi lavora da sola,
gratis, per sempre. E' l'opposto di Google Ads, dove si smette di esistere il
giorno che si smette di pagare.

Fino al 25/10 non si potevano fare: il sito non mostrava i prezzi, e una
pagina senza numeri non si posiziona e non converte. Da quando i prezzi sono
in chiaro, si puo'.

PERCHE' UN GENERATORE E NON QUATTRO FILE SCRITTI A MANO. I prezzi cambiano, le
giacenze cambiano ogni mattina alle 6. Una pagina con dentro numeri scritti a
mano e' una bugia che invecchia da sola - e' esattamente l'errore che questo
progetto ha gia' pagato con le "48-72 ore" rimaste in 51 punti. Qui si rilancia
lo script e le pagine tornano vere.

I prezzi si leggono da v_vetrina_pubblica, la stessa vista che alimenta la
vetrina del sito: espone solo referenze attive, con foto, davvero ordinabili,
col prezzo netto al rivenditore e il consigliato al pubblico. Il costo
d'acquisto non c'e' e non deve entrarci.

USO:
    python genera_pagine_marchio.py          mostra cosa farebbe
    python genera_pagine_marchio.py --scrivi scrive le pagine e la sitemap
"""
import io, json, os, re, sys, urllib.request

QUI = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(QUI, "public")
SITO = "https://nexushub.trade"

# I marchi che un negoziante italiano cerca per nome. Entra un marchio solo se
# ha abbastanza referenze ordinabili da reggere una pagina: su due bottiglie
# non si costruisce niente, e una pagina vuota fa piu' danno che bene.
MARCHI = [
    {"file": "lattafa-ingrosso.html", "cerca": "lattafa",
     "nome": "Lattafa", "chiave": "Lattafa ingrosso",
     "occhiello": "LATTAFA ALL'INGROSSO",
     "attacco": "Lattafa è il marchio che i tuoi clienti ti chiedono per nome. "
                "Khamrah, Asad, Yara, Badee al Oud: li hanno visti su TikTok e li "
                "vogliono in vetrina da te."},
    {"file": "maison-alhambra-ingrosso.html", "cerca": "alhambra",
     "nome": "Maison Alhambra", "chiave": "Maison Alhambra ingrosso",
     "occhiello": "MAISON ALHAMBRA ALL'INGROSSO",
     "attacco": "Maison Alhambra fa le alternative alle grandi maison francesi a "
                "un quarto del prezzo. È la referenza che il cliente prova per "
                "curiosità e poi ricompra."},
    {"file": "armaf-ingrosso.html", "cerca": "armaf",
     "nome": "Armaf", "chiave": "Armaf ingrosso",
     "occhiello": "ARMAF ALL'INGROSSO",
     "attacco": "Armaf è Club de Nuit, cioè il profumo arabo che ha sfondato in "
                "Europa prima di tutti gli altri. Chi entra in profumeria lo "
                "conosce già."},
]

CSS = """
:root{--bg:#08080f;--surface:#12131c;--border:#252838;--gold:#c9a84c;--goldL:#e2bc6a;
      --green:#3fb98c;--text:#ede9e3;--muted:#8890aa;--dim:#5a6079}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',-apple-system,Segoe UI,sans-serif;line-height:1.6}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
h1,h2,h3{font-family:'Fraunces',Georgia,serif;margin:0}
a{color:var(--goldL)}
header{padding:56px 0 36px;border-bottom:1px solid var(--border)}
.kicker{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-weight:700}
h1{font-size:clamp(30px,5.4vw,50px);margin:12px 0 14px;letter-spacing:.01em;line-height:1.15}
.sub{color:var(--muted);font-size:17px;max-width:680px}
.cond{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0}
.cond span{background:var(--surface);border:1px solid var(--border);border-radius:999px;
           padding:7px 14px;font-size:13.5px}
.cta{display:inline-block;margin:24px 0 0;padding:14px 26px;border-radius:11px;
     background:linear-gradient(135deg,var(--gold),#a8893c);color:#08080f;
     font-weight:800;text-decoration:none;font-size:15.5px}
.ctan{font-size:13px;color:var(--muted);margin-top:10px}
section{padding:44px 0;border-bottom:1px solid var(--border)}
section h2{font-size:26px;margin-bottom:8px}
section p{color:var(--muted);max-width:720px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr));gap:16px;margin-top:24px}
.p{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.pimg{background:#fff;aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:8px}
.pimg img{width:100%;height:100%;object-fit:contain}
.pb{padding:11px 12px 13px}
.pn{font-size:13.5px;font-weight:600;line-height:1.3;min-height:35px}
.pp{font-size:19px;font-weight:900;color:var(--goldL);margin-top:7px}
.pp small{font-size:11px;color:var(--dim);font-weight:400}
.pr{font-size:12px;color:var(--green);margin-top:3px}
.pr b{color:var(--text)}
.due{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:20px;margin-top:22px}
.box{background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:20px}
.box h3{font-size:17px;margin-bottom:7px}
.box p{font-size:14px;margin:0}
.passi{counter-reset:p;margin-top:20px;padding:0;list-style:none}
.passi li{counter-increment:p;position:relative;padding-left:40px;margin-bottom:13px;color:var(--muted);font-size:15px}
.passi li::before{content:counter(p);position:absolute;left:0;top:1px;width:25px;height:25px;
  border-radius:50%;background:rgba(201,168,76,.16);color:var(--goldL);font-weight:900;
  font-size:13px;display:flex;align-items:center;justify-content:center}
.rimb{margin-top:16px;padding:13px 16px;border-radius:10px;background:rgba(63,185,140,.08);
      border:1px solid rgba(63,185,140,.3);font-size:14.5px;color:var(--text)}
footer{padding:34px 0 56px;color:var(--dim);font-size:13px}
footer a{color:var(--muted)}
.alt{margin-top:14px;font-size:14px;color:var(--muted)}
"""


def chiave_pubblica():
    p = os.path.join(QUI, ".env.local")
    for riga in io.open(p, encoding="utf-8", errors="ignore"):
        if riga.strip().startswith("REACT_APP_SUPABASE_ANON_KEY="):
            return riga.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("REACT_APP_SUPABASE_ANON_KEY non trovata in .env.local")


def vetrina():
    """Legge la vista pubblica: le stesse referenze che vede un visitatore."""
    k = chiave_pubblica()
    url = (SUPA + "/rest/v1/v_vetrina_pubblica"
           "?select=marca,nome,foto,prezzo,pubblico&order=prezzo.desc&limit=2000")
    req = urllib.request.Request(url, headers={"apikey": k, "Authorization": "Bearer " + k})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


SUPA = "https://krojimmlbizxkzbulspm.supabase.co"


def esc(s):
    return (str(s or "").replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def eur(v):
    return ("%.2f" % float(v)).replace(".", ",") + " &euro;"


def scheda(p):
    ric = ""
    if p.get("pubblico") and float(p["pubblico"]) > float(p["prezzo"]):
        pct = round(100 * (float(p["pubblico"]) - float(p["prezzo"])) / float(p["prezzo"]))
        ric = ('<div class="pr">in vetrina a <b>%s</b> &middot; +%d%%</div>'
               % (eur(p["pubblico"]), pct))
    return ('<div class="p"><div class="pimg"><img src="%s" alt="%s" loading="lazy"></div>'
            '<div class="pb"><div class="pn">%s</div>'
            '<div class="pp">%s <small>tu paghi</small></div>%s</div></div>'
            % (esc(p["foto"]), esc(p["nome"]), esc(p["nome"]), eur(p["prezzo"]), ric))


def pagina(m, prodotti, quante):
    schede = "\n".join(scheda(p) for p in prodotti[:12])
    titolo = "%s all'ingrosso &mdash; prezzi per rivenditori, spedizione da Torino" % esc(m["nome"])
    descr = ("%s all'ingrosso per profumerie e negozi: %d referenze disponibili, prezzi "
             "netti al rivenditore in chiaro, da 6 pezzi per referenza, spedizione da "
             "Torino con fattura italiana in 5-7 giorni lavorativi."
             % (esc(m["nome"]), quante))
    return """<!doctype html>
<html lang="it"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(titolo)s</title>
<meta name="description" content="%(descr)s">
<link rel="canonical" href="%(sito)s/%(file)s">
<meta property="og:title" content="%(titolo)s">
<meta property="og:description" content="%(descr)s">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet">
<style>%(css)s</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WholesaleStore",
 "name":"NexusHub","legalName":"GIGA TRADE S.R.L.S.",
 "url":"%(sito)s/%(file)s","vatID":"IT13105910015",
 "address":{"@type":"PostalAddress","streetAddress":"Via Ottavio Revel 6",
            "postalCode":"10121","addressLocality":"Torino","addressCountry":"IT"},
 "areaServed":"EU","priceRange":"$$",
 "description":"%(descr)s"}
</script>
</head><body>

<header><div class="wrap">
  <div class="kicker">%(occhiello)s</div>
  <h1>%(nome)s all'ingrosso, da 6 pezzi.<br>Spedito da Torino con fattura italiana.</h1>
  <p class="sub">%(attacco)s Qui sotto trovi i prezzi veri al rivenditore, senza registrarti:
     quello che paghi tu e quello a cui lo rivendi.</p>
  <div class="cond">
    <span>%(quante)d referenze disponibili</span>
    <span>da 6 pezzi per referenza, non cartoni da 48</span>
    <span>ordine minimo 250 &euro;</span>
    <span>5-7 giorni lavorativi in tutta l'UE</span>
    <span>fattura italiana</span>
  </div>
  <a class="cta" href="mailto:andrea@nexushub.trade?subject=Richiesta%%20proforma%%20%(nome_url)s&amp;body=Buongiorno%%2C%%20sono%%20un%%20rivenditore.%%20Partita%%20IVA%%3A%%20%%0AReferenze%%20che%%20mi%%20interessano%%3A%%20">Chiedi la proforma &rarr;</a>
  <div class="ctan">Senza registrazione. Mandaci la partita IVA e le referenze che ti interessano.</div>
  <div class="alt"><a href="%(sito)s/">oppure registrati e vedi tutte le %(tutte)d referenze a catalogo &rarr;</a></div>
</div></header>

<section><div class="wrap">
  <h2>Alcune referenze %(nome)s disponibili oggi</h2>
  <p>Prezzo netto al rivenditore, IVA esclusa. Accanto, il prezzo consigliato al pubblico:
     il margine che resta a te. La disponibilit&agrave; la riverifichiamo col fornitore
     ogni mattina alle sei, quindi quello che vedi &egrave; quello che si pu&ograve;
     ordinare davvero oggi.</p>
  <div class="grid">%(schede)s</div>
</div></section>

<section><div class="wrap">
  <h2>Perch&eacute; comprare %(nome)s da noi</h2>
  <div class="due">
    <div class="box"><h3>Da 6 pezzi, non da 48</h3>
      <p>I grossisti impongono cartoni da 48 pezzi, pensati per chi ha un magazzino.
         Da noi ne prendi 6 per referenza: provi dodici profumi invece di tre, e
         scopri cosa vende il tuo negozio senza immobilizzare capitale.</p></div>
    <div class="box"><h3>Fattura italiana, nessuna dogana</h3>
      <p>La merce parte da Torino con fattura italiana. Nessuno sdoganamento, nessuna
         pratica di importazione per il tuo commercialista, nessun container da
         aspettare. Un esportatore di Dubai questo non te lo pu&ograve; dare.</p></div>
    <div class="box"><h3>Non devi cambiare fornitore</h3>
      <p>Tieni i tuoi. Usaci per quello che loro non ti lasciano fare. Al primo ordine
         l'unica cosa che stai provando &egrave; se spediamo e se la fattura si
         registra senza problemi.</p></div>
    <div class="box"><h3>Quello che non ti raccontiamo</h3>
      <p>Non teniamo scorte: compriamo sull'ordine, la merce arriva da noi a Torino e
         da l&igrave; riparte. Per questo 5-7 giorni e non 48 ore &mdash; e per questo
         non ti ritrovi mai i fondi di magazzino di qualcun altro.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <h2>Come funziona il primo ordine</h2>
  <ol class="passi">
    <li>Ci dici le referenze che ti interessano &mdash; da 6 pezzi ciascuna, 250 &euro; di totale.</li>
    <li>Riconfermiamo ogni riga col fornitore e ti mandiamo la proforma. Se manca
        qualcosa lo sai prima di pagare, non dopo.</li>
    <li>Bonifico sul conto intestato a GIGA TRADE S.R.L.S. &mdash; la stessa ragione
        sociale che leggi in visura.</li>
    <li>La merce parte da Torino entro 5-7 giorni lavorativi, con fattura italiana e tracking.</li>
  </ol>
  <div class="rimb">Se non abbiamo spedito entro 10 giorni lavorativi dall'accredito,
    ti riaccreditiamo l'intero importo sullo stesso conto entro 5 giorni lavorativi.</div>
</div></section>

<footer><div class="wrap">
  Controllaci prima di pagare: Registro Imprese, partita IVA, VIES.<br>
  GIGA TRADE S.R.L.S. &middot; Via Ottavio Revel 6, 10121 Torino, Italia &middot;
  P.IVA IT13105910015<br>
  <a href="%(sito)s/">nexushub.trade</a> &middot;
  <a href="%(sito)s/privacy.html">Privacy</a> &middot;
  <a href="%(sito)s/terms.html">Condizioni</a>
</div></footer>
</body></html>
""" % {"titolo": titolo, "descr": descr, "css": CSS, "sito": SITO, "file": m["file"],
       "occhiello": m["occhiello"], "nome": esc(m["nome"]),
       "nome_url": m["nome"].replace(" ", "%20"),
       "attacco": m["attacco"], "quante": quante, "schede": schede, "tutte": 0}


def sitemap(files):
    righe = ['<?xml version="1.0" encoding="UTF-8"?>',
             "<!--",
             "  Le pagine pubbliche di NexusHub. Sono file HTML statici, quindi i motori le",
             "  leggono per intero: la piattaforma vera vive dietro l'accesso e non va",
             "  indicizzata.",
             "  Dal 26/10/2026 ci sono anche le pagine per marchio, generate da",
             "  genera_pagine_marchio.py: sono quelle che un negoziante trova cercando",
             '  "lattafa ingrosso" invece del nome della piattaforma.',
             "-->",
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    fisse = [("", "weekly", "1.0"), ("brands.html", "monthly", "0.9"),
             ("distributori.html", "monthly", "0.9"),
             ("caneza.html", "monthly", "0.8"), ("caneza-en.html", "monthly", "0.7"),
             ("caneza-fr.html", "monthly", "0.7"), ("caneza-de.html", "monthly", "0.7"),
             ("caneza-es.html", "monthly", "0.7"),
             ("privacy.html", "yearly", "0.3"), ("terms.html", "yearly", "0.3")]
    for f, freq, pri in [(f, "weekly", "0.9") for f in files] + fisse:
        righe.append("  <url>")
        righe.append("    <loc>%s/%s</loc>" % (SITO, f))
        righe.append("    <changefreq>%s</changefreq>" % freq)
        righe.append("    <priority>%s</priority>" % pri)
        righe.append("  </url>")
    righe.append("</urlset>")
    return "\n".join(righe) + "\n"


def main():
    scrivi = "--scrivi" in sys.argv
    dati = vetrina()
    sys.stdout.write("referenze lette dalla vetrina pubblica: %d\n\n" % len(dati))
    fatti = []
    for m in MARCHI:
        suoi = [p for p in dati if m["cerca"] in (p.get("marca") or "").lower()]
        suoi.sort(key=lambda p: -float(p.get("prezzo") or 0))
        # Le dodici si prendono A PASSO REGOLARE lungo tutto il listino, non
        # in blocco. Alla prima prova avevo preso una fetta contigua e le prime
        # tre schede mostravano tutte 23,12 euro: sembrava un marchio con un
        # prezzo solo. Cosi' invece si vede la gamma vera - dal piu' caro al
        # piu' economico - e un negoziante capisce in un colpo d'occhio dove
        # si colloca il marchio e cosa puo' mettere a scaffale a quale prezzo.
        passo = max(1, len(suoi) // 12)
        meta = suoi[::passo][:12] or suoi[:12]
        if len(suoi) < 8:
            sys.stdout.write("%-28s solo %d referenze: pagina NON generata\n"
                             % (m["nome"], len(suoi)))
            continue
        html = pagina(m, meta, len(suoi))
        html = html.replace("tutte le 0 referenze", "tutte le %d referenze" % len(dati))
        if scrivi:
            io.open(os.path.join(PUBLIC, m["file"]), "w", encoding="utf-8", newline="").write(html)
        fatti.append(m["file"])
        sys.stdout.write("%-28s %4d referenze  ->  %s\n" % (m["nome"], len(suoi), m["file"]))

    if scrivi and fatti:
        io.open(os.path.join(PUBLIC, "sitemap.xml"), "w", encoding="utf-8", newline="").write(
            sitemap(fatti))
        sys.stdout.write("\nsitemap.xml aggiornata (%d pagine marchio + le fisse)\n" % len(fatti))
    if not scrivi:
        sys.stdout.write("\nPROVA A VUOTO. Per scrivere: --scrivi\n")


if __name__ == "__main__":
    main()
