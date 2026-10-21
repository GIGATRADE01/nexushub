/* Le parole delle due email che escono verso il cliente, in sette lingue.
   Un distributore tedesco che riceve la fattura in italiano capisce solo
   una cosa: che non lo stiamo trattando come un cliente.

   I riferimenti di legge restano in italiano: sono norme italiane, e un
   commercialista straniero le cerca per numero, non per traduzione. */

export type Lingua = "en" | "it" | "fr" | "es" | "de" | "zh" | "ar";

export const lingua = (v: unknown): Lingua => {
  const s = String(v || "").trim().toLowerCase().slice(0, 2);
  return (["en", "it", "fr", "es", "de", "zh", "ar"].includes(s) ? s : "en") as Lingua;
};

type Frasi = {
  spedTitolo: string; spedOrdine: string; spedCorriere: string; spedCodice: string;
  spedDove: string; spedBottone: string; spedNota: string; spedOggetto: string;
  fatTitolo: string; fatData: string; fatOrdine: string; fatA: string;
  fatProdotto: string; fatPezzi: string; fatUnitario: string; fatTotale: string;
  fatImponibile: string; fatIva: string; fatTot: string; fatPiede: string;
  fatOggetto: string; fatVies: string; fatSdi: string; fatPec: string;
  ivaInterna: string; ivaUe: string; ivaUeNoVies: string; ivaExport: string; ivaIgnoto: string;
};

export const FRASI: Record<Lingua, Frasi> = {
  en: {
    spedTitolo: "Your order has left our hub", spedOrdine: "Order", spedCorriere: "Carrier",
    spedCodice: "Tracking number", spedDove: "Destination", spedBottone: "Track the shipment",
    spedNota: "The goods leave our Turin hub. If a parcel arrives damaged, photograph it before opening it and write to us: without photos the carrier accepts nothing.",
    spedOggetto: "Shipped — order",
    fatTitolo: "Invoice no.", fatData: "Dated", fatOrdine: "order", fatA: "Billed to",
    fatProdotto: "Product", fatPezzi: "Qty", fatUnitario: "Unit", fatTotale: "Total",
    fatImponibile: "Taxable amount", fatIva: "VAT", fatTot: "Total",
    fatPiede: "Issued by {noi}. Goods supplied from our Turin hub.",
    fatOggetto: "Invoice", fatVies: "verified on VIES", fatSdi: "SDI code", fatPec: "PEC",
    ivaInterna: "VAT 22% — domestic supply",
    ivaUe: "Reverse charge — intra-Community supply, not subject to Italian VAT under art. 41 DL 331/1993. VAT is accounted for by the customer in their own Member State.",
    ivaUeNoVies: "VAT 22% — VAT number not confirmed on VIES: treated as a domestic supply",
    ivaExport: "Not subject to VAT — export, art. 8 DPR 633/1972",
    ivaIgnoto: "VAT 22% — customer country not stated",
  },
  it: {
    spedTitolo: "Il tuo ordine è partito", spedOrdine: "Ordine", spedCorriere: "Corriere",
    spedCodice: "Codice di tracciamento", spedDove: "Destinazione", spedBottone: "Segui la spedizione",
    spedNota: "La merce parte dal nostro hub di Torino. Se all'arrivo trovi un collo danneggiato, fotografalo prima di aprirlo e scrivici: senza foto il corriere non riconosce nulla.",
    spedOggetto: "Spedito — ordine",
    fatTitolo: "Fattura n.", fatData: "Del", fatOrdine: "ordine", fatA: "Intestata a",
    fatProdotto: "Prodotto", fatPezzi: "Pz", fatUnitario: "Unitario", fatTotale: "Totale",
    fatImponibile: "Imponibile", fatIva: "IVA", fatTot: "Totale",
    fatPiede: "Emessa da {noi}. Merce resa dal nostro hub di Torino.",
    fatOggetto: "Fattura", fatVies: "verificata a VIES", fatSdi: "Codice SDI", fatPec: "PEC",
    ivaInterna: "IVA 22% — operazione interna",
    ivaUe: "Inversione contabile — cessione intracomunitaria non imponibile, art. 41 DL 331/1993. L'IVA è assolta dal cessionario nel proprio Stato.",
    ivaUeNoVies: "IVA 22% — partita IVA non confermata a VIES: operazione trattata come interna",
    ivaExport: "Operazione non imponibile — esportazione, art. 8 DPR 633/1972",
    ivaIgnoto: "IVA 22% — paese del cliente non indicato",
  },
  fr: {
    spedTitolo: "Votre commande est partie", spedOrdine: "Commande", spedCorriere: "Transporteur",
    spedCodice: "Numéro de suivi", spedDove: "Destination", spedBottone: "Suivre l'envoi",
    spedNota: "La marchandise part de notre hub de Turin. Si un colis arrive endommagé, photographiez-le avant de l'ouvrir et écrivez-nous : sans photos le transporteur ne reconnaît rien.",
    spedOggetto: "Expédié — commande",
    fatTitolo: "Facture n°", fatData: "Du", fatOrdine: "commande", fatA: "Facturé à",
    fatProdotto: "Produit", fatPezzi: "Qté", fatUnitario: "Unitaire", fatTotale: "Total",
    fatImponibile: "Base imposable", fatIva: "TVA", fatTot: "Total",
    fatPiede: "Émise par {noi}. Marchandise livrée depuis notre hub de Turin.",
    fatOggetto: "Facture", fatVies: "vérifié sur VIES", fatSdi: "Code SDI", fatPec: "PEC",
    ivaInterna: "TVA 22% — opération interne",
    ivaUe: "Autoliquidation — livraison intracommunautaire non imposable, art. 41 DL 331/1993. La TVA est acquittée par l'acquéreur dans son État.",
    ivaUeNoVies: "TVA 22% — numéro de TVA non confirmé sur VIES : opération traitée comme interne",
    ivaExport: "Opération non imposable — exportation, art. 8 DPR 633/1972",
    ivaIgnoto: "TVA 22% — pays du client non indiqué",
  },
  es: {
    spedTitolo: "Tu pedido ha salido", spedOrdine: "Pedido", spedCorriere: "Transportista",
    spedCodice: "Número de seguimiento", spedDove: "Destino", spedBottone: "Seguir el envío",
    spedNota: "La mercancía sale de nuestro hub de Turín. Si un bulto llega dañado, fotografíalo antes de abrirlo y escríbenos: sin fotos el transportista no reconoce nada.",
    spedOggetto: "Enviado — pedido",
    fatTitolo: "Factura n.º", fatData: "Del", fatOrdine: "pedido", fatA: "A nombre de",
    fatProdotto: "Producto", fatPezzi: "Uds", fatUnitario: "Unitario", fatTotale: "Total",
    fatImponibile: "Base imponible", fatIva: "IVA", fatTot: "Total",
    fatPiede: "Emitida por {noi}. Mercancía servida desde nuestro hub de Turín.",
    fatOggetto: "Factura", fatVies: "verificado en VIES", fatSdi: "Código SDI", fatPec: "PEC",
    ivaInterna: "IVA 22% — operación interna",
    ivaUe: "Inversión del sujeto pasivo — entrega intracomunitaria no sujeta, art. 41 DL 331/1993. El IVA lo liquida el cliente en su Estado.",
    ivaUeNoVies: "IVA 22% — NIF-IVA no confirmado en VIES: operación tratada como interna",
    ivaExport: "Operación no sujeta — exportación, art. 8 DPR 633/1972",
    ivaIgnoto: "IVA 22% — país del cliente no indicado",
  },
  de: {
    spedTitolo: "Ihre Bestellung ist unterwegs", spedOrdine: "Bestellung", spedCorriere: "Spediteur",
    spedCodice: "Sendungsnummer", spedDove: "Ziel", spedBottone: "Sendung verfolgen",
    spedNota: "Die Ware verlässt unser Lager in Turin. Kommt ein Paket beschädigt an, fotografieren Sie es vor dem Öffnen und schreiben Sie uns: ohne Fotos erkennt der Spediteur nichts an.",
    spedOggetto: "Versandt — Bestellung",
    fatTitolo: "Rechnung Nr.", fatData: "Vom", fatOrdine: "Bestellung", fatA: "Rechnung an",
    fatProdotto: "Artikel", fatPezzi: "Stk", fatUnitario: "Einzeln", fatTotale: "Gesamt",
    fatImponibile: "Nettobetrag", fatIva: "USt.", fatTot: "Gesamt",
    fatPiede: "Ausgestellt von {noi}. Ware geliefert ab unserem Lager in Turin.",
    fatOggetto: "Rechnung", fatVies: "über VIES geprüft", fatSdi: "SDI-Code", fatPec: "PEC",
    ivaInterna: "USt. 22% — Inlandsumsatz",
    ivaUe: "Reverse Charge — innergemeinschaftliche Lieferung, nicht steuerbar nach Art. 41 DL 331/1993. Die Steuer schuldet der Erwerber in seinem Mitgliedstaat.",
    ivaUeNoVies: "USt. 22% — USt-IdNr. über VIES nicht bestätigt: als Inlandsumsatz behandelt",
    ivaExport: "Nicht steuerbar — Ausfuhr, Art. 8 DPR 633/1972",
    ivaIgnoto: "USt. 22% — Land des Kunden nicht angegeben",
  },
  zh: {
    spedTitolo: "您的订单已发出", spedOrdine: "订单", spedCorriere: "承运商",
    spedCodice: "运单号", spedDove: "目的地", spedBottone: "查询物流",
    spedNota: "货物自我们都灵仓库发出。若包裹到达时有破损，请在拆开前拍照并联系我们：没有照片承运商不予受理。",
    spedOggetto: "已发货 — 订单",
    fatTitolo: "发票号", fatData: "日期", fatOrdine: "订单", fatA: "抬头",
    fatProdotto: "商品", fatPezzi: "件", fatUnitario: "单价", fatTotale: "金额",
    fatImponibile: "不含税金额", fatIva: "增值税", fatTot: "合计",
    fatPiede: "由 {noi} 开具。货物自都灵仓库发出。",
    fatOggetto: "发票", fatVies: "已通过 VIES 验证", fatSdi: "SDI 代码", fatPec: "PEC",
    ivaInterna: "增值税 22% — 意大利境内交易",
    ivaUe: "反向征收 — 欧盟内部供货，依据 art. 41 DL 331/1993 不征税，由买方在其本国申报。",
    ivaUeNoVies: "增值税 22% — 税号未通过 VIES 验证，按境内交易处理",
    ivaExport: "不征税 — 出口，art. 8 DPR 633/1972",
    ivaIgnoto: "增值税 22% — 未填写客户国家",
  },
  ar: {
    spedTitolo: "تم شحن طلبك", spedOrdine: "الطلب", spedCorriere: "شركة الشحن",
    spedCodice: "رقم التتبع", spedDove: "الوجهة", spedBottone: "تتبّع الشحنة",
    spedNota: "تغادر البضاعة مستودعنا في تورينو. إذا وصل الطرد تالفًا فصوّره قبل فتحه وراسلنا: بدون صور لا تعترف شركة الشحن بشيء.",
    spedOggetto: "تم الشحن — الطلب",
    fatTitolo: "فاتورة رقم", fatData: "بتاريخ", fatOrdine: "الطلب", fatA: "باسم",
    fatProdotto: "المنتج", fatPezzi: "الكمية", fatUnitario: "سعر الوحدة", fatTotale: "الإجمالي",
    fatImponibile: "المبلغ الخاضع", fatIva: "ضريبة القيمة المضافة", fatTot: "الإجمالي",
    fatPiede: "صادرة عن {noi}. البضاعة مسلّمة من مستودعنا في تورينو.",
    fatOggetto: "فاتورة", fatVies: "مُتحقَّق منه عبر VIES", fatSdi: "رمز SDI", fatPec: "PEC",
    ivaInterna: "ضريبة 22% — عملية داخلية",
    ivaUe: "الاحتساب العكسي — توريد داخل الاتحاد الأوروبي غير خاضع، المادة 41 DL 331/1993. الضريبة يسددها المشتري في بلده.",
    ivaUeNoVies: "ضريبة 22% — الرقم الضريبي غير مؤكد عبر VIES: تُعامل كعملية داخلية",
    ivaExport: "عملية غير خاضعة — تصدير، المادة 8 DPR 633/1972",
    ivaIgnoto: "ضريبة 22% — بلد العميل غير محدد",
  },
};
