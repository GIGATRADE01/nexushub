import { useState, createContext, useContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const C = {
  bg: "#08080f", surface: "#0f1018", surface2: "#151720", surface3: "#1c1f2e",
  border: "#252838", gold: "#c9a84c", goldLight: "#e2bc6a", goldDim: "#7a5e28",
  text: "#ede9e3", textMuted: "#8890aa", textDim: "#4a4e68",
  green: "#27ae60", red: "#c0392b", blue: "#3d8ef0", purple: "#8e44ad",
};

const LANGS = [
  { key: "en", label: "EN", name: "English",    dir: "ltr" },
  { key: "it", label: "IT", name: "Italiano",   dir: "ltr" },
  { key: "fr", label: "FR", name: "Français",   dir: "ltr" },
  { key: "es", label: "ES", name: "Español",    dir: "ltr" },
  { key: "de", label: "DE", name: "Deutsch",    dir: "ltr" },
  { key: "zh", label: "中文", name: "中文",      dir: "ltr" },
  { key: "ar", label: "AR", name: "العربية",    dir: "rtl" },
];

const T = {
  en: {
    loginSubtitle:"Global B2B Distribution Platform",accessAs:"Access as",
    roleBrandLabel:"Brand",roleBrandDesc:"Full market visibility & distributor control",
    roleDistLabel:"Distributor",roleDistDesc:"Your authorized brands & territory",
    roleAdminLabel:"NexusHub Admin",roleAdminDesc:"Platform-wide oversight",
    demoMode:"Demo mode",demoTryAs:"— Try as Guest",enterPlatform:"Enter Platform →",authenticating:"Authenticating…",
    // Auth
    emailLabel:"Email",passwordLabel:"Password",loginBtn:"Sign In",
    loggingIn:"Signing in…",loginError:"Invalid email or password",
    pendingTitle:"Account Pending Approval",pendingMsg:"Your documents have been received. You will be notified by email once your account is approved.",
    rejectedTitle:"Account Not Approved",rejectedMsg:"Your access request was declined.",
    registerBrand:"Register as Brand",registerDist:"Register as Distributor",
    alreadyAccount:"Already have an account?",backToLogin:"Back to login",
    registerTitle:"Registration",step1:"Account",step2:"Company & Documents",
    fullName:"Contact Name",companyName:"Company Name",phone:"Phone",country:"Country",
    confirmPassword:"Confirm Password",passwordMismatch:"Passwords do not match",passwordShort:"Password must be at least 8 characters",
    docsRequired:"Required documents",clickToUpload:"Click to upload PDF or image",
    submitRequest:"Submit Request",sending:"Sending…",
    successTitle:"Registration Complete",successMsg:"Your request has been submitted. Our team will verify your documents and notify you by email within 24-48 hours.",
    //
    portalBrand:"Brand Portal",portalDistributor:"Distributor Portal",portalAdmin:"Admin",logout:"Logout",
    tabOverview:"Overview",tabApplications:"Applications",tabDistributors:"Distributors",
    tabCatalog:"Catalog",tabOrders:"Orders",tabPayments:"Payments",
    tabBrandMarket:"Brand Marketplace",tabMyCatalog:"My Catalog",tabMyOrders:"My Orders",
    overviewTitle:"European Market Overview",overviewSub:"Real-time visibility · Hub: Turin, Italy · 400–500 pallets/month",
    statTerritories:"Active Territories",statTerritoriesSub:"Europe-wide",
    statDistributors:"Distributors",statDistributorsSub:"pending approval",
    statRevenue:"Monthly Revenue",statRevenueSub:"↑ 18% vs last month",
    statPallets:"Pallets / Month",statPalletsSub:"Turin hub avg.",
    statAlerts:"Price Alerts",statAlertsSub:"2 high severity",
    priceAlertsTitle:"Price Integrity Alerts",actBtn:"Act",
    hubStockTitle:"Hub Stock Status · Turin",
    hubTotalSkus:"Total SKUs in Hub",hubTotalSkusVal:"87 references",
    hubTotalUnits:"Total Units in Stock",hubTotalUnitsVal:"18,430 units",
    hubPallets:"Pallets Occupied",hubPalletsVal:"312 / 500 slots",
    hubNextContainer:"Next Container ETA",hubNextContainerVal:"June 4 from Dubai",
    hubOrdersToday:"Orders Processing Today",hubOrdersTodayVal:"7 active",
    hubConsignment:"Consignment Value",hubConsignmentVal:"€ 1.84M",
    appTitle:"Distributor Applications",appSub:"Review, approve or decline companies requesting access to your catalog",
    submitted:"Submitted",territory:"Territory",type:"Type",annualRevenue:"Annual Revenue",yearsActive:"Years Active",years:"years",
    requestedBrands:"Requested brands:",documentsUploaded:"Documents uploaded:",
    approveBtn:"✓ Approve & Enable Access",declineBtn:"✗ Decline",askMoreBtn:"Ask for More Info",
    approvedMsg:"✓ Approved — login credentials sent automatically to distributor",
    rejectedMsg:"✗ Declined — distributor has been notified via email",
    distTitle:"Active Distributors",distSub:"One authorized partner per territory · Zero overlap guaranteed by platform",
    colFlag:"Flag",colCompany:"Company",colTerritory:"Territory",colBrands:"Authorized Brands",
    colOrders:"Orders",colRevenue:"Revenue",colStatus:"Status",
    catTitle:"Product Catalog",catSub:"All SKUs available in Turin European Hub · Consignment stock · Real-time quantities",
    colSku:"SKU",colProduct:"Product",colSize:"Size",colCategory:"Category",colPrice:"Unit Price",
    colStock:"Stock",colPerPallet:"Per Pallet",colMoq:"MOQ",
    ordersTitle:"All European Orders",ordersSub:"Every order routed through NexusHub Hub · Turin, Italy · Target: 48h dispatch",
    statOrdersMonth:"Orders This Month",statOrdersMonthSub:"↑ 23 vs last month",
    statPalletsShipped:"Pallets Shipped",statPalletsShippedSub:"May 2024",
    statTotalValue:"Total Value",statTotalValueSub:"May 2024",
    statAvgDispatch:"Avg. Dispatch",statAvgDispatchVal:"1.4 days",statAvgDispatchSub:"From order confirmation",
    colOrderId:"Order ID",colDistributor:"Distributor",colCountry:"Country",colItems:"Items",
    colPallets:"Pallets",colValue:"Value",colDate:"Date",colEta:"ETA",delivered:"Delivered",
    paymentsTitle:"Payment Flow",paymentsSub:"Distributor pays brand directly via SEPA Instant · NexusHub fee auto-split via PSD2",
    payArchLabel:"Automated Payment Architecture · Zero manual intervention",
    payTransLog:"Transaction Log — Automatic Split per Order",
    colGross:"Gross Amount",colBrandShare:"→ Brand Receives",colNexusFee:"→ NexusHub Fee",
    colFeePercent:"Fee %",colMethod:"Method",colTime:"Time",
    nodeDistributor:"Distributor",nodeDistributorSub:"Places order on NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Direct transfer to Brand",
    nodeLattafa:"Brand Account",nodeLattafaSub:"Receives full payment",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Auto notification in seconds",
    nodeNexus:"NexusHub",nodeNexusSub:"Calculates fee automatically",
    nodeGiga:"GigaTrade",nodeGigaSub:"Fee ~11.4% credited",
    marketTitle:"Brand Marketplace",marketSub:"All brands available on NexusHub · Green = already authorized for your territory",
    skusLabel:"SKUs",euDistLabel:"EU Dist.",categoryLabel:"Category",
    viewCatalogBtn:"View My Catalog →",requestSentMsg:"⏳ Request sent — awaiting brand approval",requestAccessBtn:"+ Request Access",
    myCatTitle:"My Authorized Catalog",myCatSub:"Authorized brands for your territory · All stock ready in Turin hub · Delivery 48h",
    colBrand:"Brand",colAction:"Action",addBtn:"+ Add",cartLabel:"Place Order",cartSub1:"48h from Turin · Pay via SEPA Instant",
    myOrdersTitle:"My Orders",myOrdersSub:"All orders fulfilled from NexusHub European Hub · Turin, Italy",
    statMyOrders:"Orders This Month",statMyOrdersSub:"May 2024",statMySpent:"Total Spent",statMySpentSub:"May 2024",
    statMyDelivery:"Avg. Delivery",statMyDeliveryVal:"1.6 days",statMyPallets:"Pallets Received",statMyPalletsSub:"May 2024",
    colPayment:"Payment",deliveredCheck:"✓ Delivered",
    adminTitle:"Platform Overview",adminSub:"Global view across all brands, distributors and transactions",
    statBrands:"Active Brands",statBrandsSub:"2 in onboarding",statAllDist:"Total Distributors",statAllDistSub:"Europe-wide",
    statGmv:"Platform GMV",statGmvSub:"May 2024",statNexusRev:"NexusHub Revenue",statNexusRevSub:"~11.4% avg fee",
    statAllPallets:"Pallets / Month",statAllPalletsSub:"All brands",
    adminBrandsTitle:"Active Brands on Platform",adminRevenueTitle:"NexusHub Revenue by Brand (May)",distributorsLabel:"distributors",
  },
  it: {
    loginSubtitle:"Piattaforma B2B di Distribuzione Globale",accessAs:"Accedi come",
    roleBrandLabel:"Brand",roleBrandDesc:"Visibilità completa del mercato e controllo distributori",
    roleDistLabel:"Distributore",roleDistDesc:"I tuoi brand autorizzati e territorio",
    roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervisione dell'intera piattaforma",
    demoMode:"Demo",demoTryAs:"— Accedi come ospite",enterPlatform:"Entra nella Piattaforma →",authenticating:"Autenticazione…",
    emailLabel:"Email",passwordLabel:"Password",loginBtn:"Accedi",
    loggingIn:"Accesso in corso…",loginError:"Email o password non validi",
    pendingTitle:"Account in attesa di approvazione",pendingMsg:"I tuoi documenti sono stati ricevuti. Riceverai una notifica via email quando il tuo account sarà approvato.",
    rejectedTitle:"Account non approvato",rejectedMsg:"La tua richiesta di accesso è stata rifiutata.",
    registerBrand:"Registrati come Brand",registerDist:"Registrati come Distributore",
    alreadyAccount:"Hai già un account?",backToLogin:"Torna al login",
    registerTitle:"Registrazione",step1:"Account",step2:"Azienda e Documenti",
    fullName:"Nome referente",companyName:"Ragione sociale",phone:"Telefono",country:"Paese",
    confirmPassword:"Conferma password",passwordMismatch:"Le password non coincidono",passwordShort:"La password deve essere di almeno 8 caratteri",
    docsRequired:"Documenti richiesti",clickToUpload:"Clicca per caricare PDF o immagine",
    submitRequest:"Invia richiesta",sending:"Invio in corso…",
    successTitle:"Registrazione completata",successMsg:"La tua richiesta è stata inviata con successo. Il nostro team verificherà i tuoi documenti e riceverai una notifica via email entro 24-48 ore.",
    portalBrand:"Portale Brand",portalDistributor:"Portale Distributore",portalAdmin:"Admin",logout:"Esci",
    tabOverview:"Panoramica",tabApplications:"Candidature",tabDistributors:"Distributori",
    tabCatalog:"Catalogo",tabOrders:"Ordini",tabPayments:"Pagamenti",
    tabBrandMarket:"Marketplace Brand",tabMyCatalog:"Il Mio Catalogo",tabMyOrders:"I Miei Ordini",
    overviewTitle:"Panoramica Mercato Europeo",overviewSub:"Visibilità in tempo reale · Hub: Torino, Italia · 400–500 pallet/mese",
    statTerritories:"Territori Attivi",statTerritoriesSub:"In tutta Europa",
    statDistributors:"Distributori",statDistributorsSub:"in attesa di approvazione",
    statRevenue:"Fatturato Mensile",statRevenueSub:"↑ 18% rispetto al mese scorso",
    statPallets:"Pallet / Mese",statPalletsSub:"Media hub Torino",
    statAlerts:"Avvisi Prezzi",statAlertsSub:"2 alta severità",
    priceAlertsTitle:"Avvisi Integrità Prezzi",actBtn:"Intervieni",
    hubStockTitle:"Stato Stock Hub · Torino",
    hubTotalSkus:"SKU Totali in Hub",hubTotalSkusVal:"87 riferimenti",
    hubTotalUnits:"Unità Totali in Stock",hubTotalUnitsVal:"18.430 unità",
    hubPallets:"Pallet Occupati",hubPalletsVal:"312 / 500 slot",
    hubNextContainer:"Prossimo Container ETA",hubNextContainerVal:"4 Giugno da Dubai",
    hubOrdersToday:"Ordini in Elaborazione Oggi",hubOrdersTodayVal:"7 attivi",
    hubConsignment:"Valore Consegne",hubConsignmentVal:"€ 1,84M",
    appTitle:"Candidature Distributori",appSub:"Esamina, approva o rifiuta le aziende che richiedono accesso al tuo catalogo",
    submitted:"Inviata",territory:"Territorio",type:"Tipo",annualRevenue:"Fatturato Annuo",yearsActive:"Anni di Attività",years:"anni",
    requestedBrands:"Brand richiesti:",documentsUploaded:"Documenti caricati:",
    approveBtn:"✓ Approva e Abilita Accesso",declineBtn:"✗ Rifiuta",askMoreBtn:"Richiedi Ulteriori Informazioni",
    approvedMsg:"✓ Approvato — credenziali inviate automaticamente al distributore",
    rejectedMsg:"✗ Rifiutato — il distributore è stato notificato via email",
    distTitle:"Distributori Attivi",distSub:"Un partner autorizzato per territorio · Nessuna sovrapposizione garantita dalla piattaforma",
    colFlag:"Bandiera",colCompany:"Azienda",colTerritory:"Territorio",colBrands:"Brand Autorizzati",
    colOrders:"Ordini",colRevenue:"Fatturato",colStatus:"Stato",
    catTitle:"Catalogo Prodotti",catSub:"Tutti gli SKU disponibili nell'Hub Europeo di Torino · Stock in conto deposito · Quantità in tempo reale",
    colSku:"SKU",colProduct:"Prodotto",colSize:"Formato",colCategory:"Categoria",colPrice:"Prezzo Unitario",
    colStock:"Stock",colPerPallet:"Per Pallet",colMoq:"MOQ",
    ordersTitle:"Tutti gli Ordini Europei",ordersSub:"Ogni ordine instradato tramite NexusHub Hub · Torino, Italia · Obiettivo: spedizione in 48h",
    statOrdersMonth:"Ordini Questo Mese",statOrdersMonthSub:"↑ 23 rispetto al mese scorso",
    statPalletsShipped:"Pallet Spediti",statPalletsShippedSub:"Maggio 2024",
    statTotalValue:"Valore Totale",statTotalValueSub:"Maggio 2024",
    statAvgDispatch:"Media Spedizione",statAvgDispatchVal:"1,4 giorni",statAvgDispatchSub:"Dalla conferma ordine",
    colOrderId:"ID Ordine",colDistributor:"Distributore",colCountry:"Paese",colItems:"Articoli",
    colPallets:"Pallet",colValue:"Valore",colDate:"Data",colEta:"ETA",delivered:"Consegnato",
    paymentsTitle:"Flusso Pagamenti",paymentsSub:"Il distributore paga il brand direttamente via SEPA Instant · Fee NexusHub split automatico via PSD2",
    payArchLabel:"Architettura Pagamenti Automatizzata · Zero interventi manuali",
    payTransLog:"Log Transazioni — Split Automatico per Ordine",
    colGross:"Importo Lordo",colBrandShare:"→ Brand Riceve",colNexusFee:"→ Fee NexusHub",
    colFeePercent:"Fee %",colMethod:"Metodo",colTime:"Ora",
    nodeDistributor:"Distributore",nodeDistributorSub:"Effettua ordine su NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Bonifico diretto al Brand",
    nodeLattafa:"Conto Brand",nodeLattafaSub:"Riceve il pagamento completo",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Notifica automatica in secondi",
    nodeNexus:"NexusHub",nodeNexusSub:"Calcola fee automaticamente",
    nodeGiga:"GigaTrade",nodeGigaSub:"Fee ~11,4% accreditata",
    marketTitle:"Marketplace Brand",marketSub:"Tutti i brand disponibili su NexusHub · Verde = già autorizzati per il tuo territorio",
    skusLabel:"SKU",euDistLabel:"Dist. EU",categoryLabel:"Categoria",
    viewCatalogBtn:"Vai al Mio Catalogo →",requestSentMsg:"⏳ Richiesta inviata — in attesa di approvazione brand",requestAccessBtn:"+ Richiedi Accesso",
    myCatTitle:"Il Mio Catalogo Autorizzato",myCatSub:"Brand autorizzati per il tuo territorio · Stock pronto nell'hub di Torino · Consegna 48h",
    colBrand:"Brand",colAction:"Azione",addBtn:"+ Aggiungi",cartLabel:"Effettua Ordine",cartSub1:"48h da Torino · Paga via SEPA Instant",
    myOrdersTitle:"I Miei Ordini",myOrdersSub:"Tutti gli ordini evasi dall'Hub Europeo NexusHub · Torino, Italia",
    statMyOrders:"Ordini Questo Mese",statMyOrdersSub:"Maggio 2024",statMySpent:"Totale Speso",statMySpentSub:"Maggio 2024",
    statMyDelivery:"Media Consegna",statMyDeliveryVal:"1,6 giorni",statMyPallets:"Pallet Ricevuti",statMyPalletsSub:"Maggio 2024",
    colPayment:"Pagamento",deliveredCheck:"✓ Consegnato",
    adminTitle:"Panoramica Piattaforma",adminSub:"Vista globale su tutti i brand, distributori e transazioni",
    statBrands:"Brand Attivi",statBrandsSub:"2 in onboarding",statAllDist:"Distributori Totali",statAllDistSub:"In tutta Europa",
    statGmv:"GMV Piattaforma",statGmvSub:"Maggio 2024",statNexusRev:"Fatturato NexusHub",statNexusRevSub:"~11,4% fee media",
    statAllPallets:"Pallet / Mese",statAllPalletsSub:"Tutti i brand",
    adminBrandsTitle:"Brand Attivi sulla Piattaforma",adminRevenueTitle:"Fatturato NexusHub per Brand (Maggio)",distributorsLabel:"distributori",
  },
};
// Fill missing langs with EN fallback
["fr","es","de","zh","ar"].forEach(k => { T[k] = T[k] || {}; });

const BRANDS = [
  { id:"lattafa", name:"Lattafa Perfumes", origin:"Dubai, UAE", logo:"ل", category:"Fine Fragrance", skus:87, distributors:34, description:"One of the most recognized Middle Eastern fragrance houses globally, known for rich oud-based compositions and accessible luxury." },
  { id:"rasasi", name:"Rasasi Perfumes", origin:"Dubai, UAE", logo:"ر", category:"Fine Fragrance", skus:62, distributors:18, description:"Heritage fragrance house with over 40 years of craftsmanship in Arabic perfumery." },
  { id:"ajmal", name:"Ajmal Perfumes", origin:"Dubai, UAE", logo:"ع", category:"Fine Fragrance & Oud", skus:94, distributors:22, description:"Premium Arabic perfume brand with a legacy of rare oud ingredients and Eastern luxury." },
  { id:"armaf", name:"Armaf", origin:"Dubai, UAE", logo:"A", category:"Accessible Luxury", skus:78, distributors:29, description:"Fast-growing fragrance brand offering European-inspired luxury at accessible price points." },
];

const PENDING_DISTRIBUTORS = [
  { id:"pd1", company:"Balkan Beauty Group", country:"Albania", flag:"🇦🇱", contact:"Artan Koci", email:"artan@balkanbeauty.al", type:"Regional Distributor", territory:"Albania, Kosovo, North Macedonia", annualRevenue:"€ 2.1M", yearsActivity:8, requestedBrands:["lattafa","rasasi"], submittedDate:"May 27, 2024", documents:["Company Registration","Tax Certificate","Bank Reference"], status:"pending" },
  { id:"pd2", company:"Nordic Scent AB", country:"Sweden", flag:"🇸🇪", contact:"Erik Lindström", email:"erik@nordicscent.se", type:"National Distributor", territory:"Sweden, Norway, Denmark", annualRevenue:"€ 5.8M", yearsActivity:12, requestedBrands:["lattafa","ajmal","armaf"], submittedDate:"May 25, 2024", documents:["Company Registration","Tax Certificate","Bank Reference","Insurance Certificate"], status:"pending" },
  { id:"pd3", company:"Iberian Luxury SL", country:"Portugal", flag:"🇵🇹", contact:"Carlos Mendes", email:"carlos@iberianluxury.pt", type:"Regional Distributor", territory:"Portugal", annualRevenue:"€ 1.4M", yearsActivity:5, requestedBrands:["lattafa"], submittedDate:"May 23, 2024", documents:["Company Registration","Tax Certificate"], status:"under_review" },
];

const ACTIVE_DISTRIBUTORS = [
  { id:"d1", company:"GigaTrade S.R.L.", country:"Italy", flag:"🇮🇹", territory:"Italy", brands:["lattafa","rasasi"], orders:23, revenue:"€ 412K", status:"active" },
  { id:"d2", company:"Deutsche Aromas GmbH", country:"Germany", flag:"🇩🇪", territory:"Germany, Austria", brands:["lattafa","ajmal"], orders:31, revenue:"€ 538K", status:"active" },
  { id:"d3", company:"Marian Distribution SRL", country:"Romania", flag:"🇷🇴", territory:"Romania, Moldova", brands:["lattafa"], orders:19, revenue:"€ 187K", status:"active" },
  { id:"d4", company:"Maison Orient SARL", country:"France", flag:"🇫🇷", territory:"France, Belgium", brands:["lattafa","armaf"], orders:18, revenue:"€ 298K", status:"active" },
  { id:"d5", company:"London Luxe Trading", country:"UK", flag:"🇬🇧", territory:"United Kingdom", brands:["lattafa","rasasi","ajmal"], orders:12, revenue:"€ 310K", status:"active" },
  { id:"d6", company:"Hellas Beauty Ltd", country:"Greece", flag:"🇬🇷", territory:"Greece, Cyprus", brands:["lattafa"], orders:4, revenue:"€ 62K", status:"pending" },
];

const CATALOG = [
  { sku:"LT-KHM-100", name:"Khamrah EDP", brand:"lattafa", size:"100ml", category:"Premium", price:91.00, stock:310, pallet:240, moq:48 },
  { sku:"LT-OOM-100", name:"Oud Mood EDP", brand:"lattafa", size:"100ml", category:"Signature", price:84.00, stock:240, pallet:240, moq:48 },
  { sku:"LT-AAO-80", name:"Ameer Al Oud", brand:"lattafa", size:"80ml", category:"Oud Collection", price:67.50, stock:180, pallet:288, moq:48 },
  { sku:"LT-RMS-100", name:"Ramz Silver EDP", brand:"lattafa", size:"100ml", category:"Signature", price:72.00, stock:95, pallet:240, moq:48 },
  { sku:"LT-WRD-60", name:"Warde EDP", brand:"lattafa", size:"60ml", category:"Floral", price:54.00, stock:420, pallet:360, moq:72 },
  { sku:"LT-BAB-100", name:"Bab Al Fazza EDP", brand:"lattafa", size:"100ml", category:"Premium", price:95.00, stock:60, pallet:200, moq:24 },
  { sku:"RS-DAR-100", name:"Daarej EDP", brand:"rasasi", size:"100ml", category:"Heritage", price:78.00, stock:160, pallet:240, moq:48 },
  { sku:"RS-HUM-100", name:"Humoori EDP", brand:"rasasi", size:"100ml", category:"Signature", price:65.00, stock:200, pallet:240, moq:48 },
  { sku:"AJ-OUD-50", name:"Ajmal Oud", brand:"ajmal", size:"50ml", category:"Pure Oud", price:145.00, stock:80, pallet:180, moq:24 },
  { sku:"AM-CLG-100", name:"Club De Nuit", brand:"armaf", size:"100ml", category:"Bestseller", price:38.00, stock:520, pallet:360, moq:72 },
];

const ORDERS = [
  { id:"NH-2024-1847", distributor:"GigaTrade S.R.L.", country:"Italy", flag:"🇮🇹", items:340, pallets:2, value:28400, status:"shipped", date:"Today 09:14", eta:"Tomorrow" },
  { id:"NH-2024-1846", distributor:"Deutsche Aromas GmbH", country:"Germany", flag:"🇩🇪", items:520, pallets:3, value:43680, status:"processing", date:"Today 07:33", eta:"Jun 1" },
  { id:"NH-2024-1845", distributor:"Marian Distribution SRL", country:"Romania", flag:"🇷🇴", items:180, pallets:1, value:15120, status:"delivered", date:"Yesterday", eta:"Delivered" },
  { id:"NH-2024-1844", distributor:"London Luxe Trading", country:"UK", flag:"🇬🇧", items:290, pallets:2, value:32480, status:"shipped", date:"Yesterday", eta:"Jun 2" },
  { id:"NH-2024-1843", distributor:"Maison Orient SARL", country:"France", flag:"🇫🇷", items:155, pallets:1, value:13020, status:"delivered", date:"May 27", eta:"Delivered" },
];

const PAYMENTS = [
  { id:"NH-2024-1847", distributor:"GigaTrade S.R.L.", country:"Italy", flag:"🇮🇹", gross:28400, brandShare:25160, nexusFee:3240, feePercent:"11.4%", method:"SEPA Instant", time:"Today 09:14:32", status:"settled" },
  { id:"NH-2024-1846", distributor:"Deutsche Aromas GmbH", country:"Germany", flag:"🇩🇪", gross:43680, brandShare:38692, nexusFee:4988, feePercent:"11.4%", method:"SEPA Instant", time:"Today 07:33:18", status:"settled" },
  { id:"NH-2024-1845", distributor:"Marian Distribution SRL", country:"Romania", flag:"🇷🇴", gross:15120, brandShare:13396, nexusFee:1724, feePercent:"11.4%", method:"Wire Transfer", time:"May 28 14:22", status:"settled" },
  { id:"NH-2024-1844", distributor:"London Luxe Trading", country:"UK", flag:"🇬🇧", gross:32480, brandShare:28777, nexusFee:3703, feePercent:"11.4%", method:"SEPA Instant", time:"May 28 11:05", status:"settled" },
];

const fmt = n => "€ " + n.toLocaleString("it-IT");
const LangCtx = createContext({ lang:"en", t: k=>k, dir:"ltr" });
const useT = () => useContext(LangCtx).t;

// ============================================================
// SHARED UI COMPONENTS (unchanged)
// ============================================================
const Badge = ({ status }) => {
  const map = {
    active:[C.green,"Active"], pending:[C.gold,"Pending"], under_review:[C.blue,"Under Review"],
    approved:[C.green,"Approved"], rejected:[C.red,"Rejected"], shipped:[C.blue,"Shipped"],
    processing:[C.gold,"Processing"], delivered:[C.green,"Delivered"], settled:[C.green,"Settled"],
    high:[C.red,"High"], medium:[C.gold,"Medium"],
  };
  const [col, label] = map[status] || [C.textMuted, status];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, background:col+"18", border:`1px solid ${col}40`, color:col, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:col, display:"inline-block" }}/>{label}
    </span>
  );
};

const BrandLogo = ({ brand, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.25, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.42, fontWeight:900, color:C.bg, flexShrink:0 }}>
    {brand.logo}
  </div>
);

const Stat = ({ icon, label, value, sub, accent }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${accent||C.goldDim}`, borderRadius:12, padding:"16px 18px", minWidth:150, flex:"1 1 150px" }}>
    <div style={{ fontSize:18, marginBottom:6 }}>{icon}</div>
    <div style={{ fontSize:22, fontWeight:700, color:accent||C.goldLight, fontFamily:"Georgia,serif", letterSpacing:"-0.02em" }}>{value}</div>
    <div style={{ fontSize:12, color:C.text, marginTop:2 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{sub}</div>}
  </div>
);

const Table = ({ headers, rows, minWidth=700 }) => (
  <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
    <table style={{ width:"100%", minWidth, borderCollapse:"collapse" }}>
      <thead>
        <tr style={{ background:C.surface2 }}>
          {headers.map((h,i) => (
            <th key={i} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,ri) => (
          <tr key={ri} style={{ background:ri%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
            {row.map((cell,ci) => (
              <td key={ci} style={{ padding:"13px 16px", verticalAlign:"middle", whiteSpace:"nowrap" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TabNav = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", gap:4, marginBottom:24, borderBottom:`1px solid ${C.border}`, overflowX:"auto" }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding:"10px 18px", cursor:"pointer", background:"transparent",
        border:"none", borderBottom:`2px solid ${active===t.key?C.gold:"transparent"}`,
        color:active===t.key?C.goldLight:C.textMuted,
        fontSize:13, fontWeight:active===t.key?600:400,
        display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap",
        transition:"all 0.15s", marginBottom:-1,
      }}>
        <span>{t.icon}</span>{t.label}
        {t.badge>0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{t.badge}</span>}
      </button>
    ))}
  </div>
);

const LangSwitcher = ({ lang, onChange }) => (
  <div style={{ display:"flex", gap:2, flexWrap:"wrap", alignItems:"center" }}>
    {LANGS.map(l => (
      <button key={l.key} onClick={() => onChange(l.key)} title={l.name} style={{
        padding:"3px 8px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:600,
        background:lang===l.key?`${C.gold}20`:"transparent",
        border:`1px solid ${lang===l.key?C.gold:C.border}`,
        color:lang===l.key?C.goldLight:C.textMuted,
        transition:"all 0.15s",
      }}>
        {l.label}
      </button>
    ))}
  </div>
);

const Navbar = ({ name, badge, onLogout, lang, onLangChange }) => {
  const t = useT();
  const bCol = { brand:C.gold, distributor:C.blue, admin:C.purple };
  const bLabel = { brand:t("portalBrand"), distributor:t("portalDistributor"), admin:t("portalAdmin") };
  return (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", height:56, position:"sticky", top:0, zIndex:100, gap:10, flexWrap:"wrap" }}>
      <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.bg }}>N</div>
      <span style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</span>
      <span style={{ padding:"2px 8px", borderRadius:4, background:bCol[badge]+"18", border:`1px solid ${bCol[badge]}30`, fontSize:10, color:bCol[badge], letterSpacing:"0.1em", textTransform:"uppercase" }}>{bLabel[badge]}</span>
      <div style={{ flex:1 }}/>
      <LangSwitcher lang={lang} onChange={onLangChange}/>
      <span style={{ fontSize:12, color:C.textMuted, marginLeft:4 }}>{name}</span>
      <button onClick={onLogout} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:11 }}>{t("logout")}</button>
    </div>
  );
};

// ============================================================
// AUTH SCREENS
// ============================================================

const Login = ({ onLogin, lang, onLangChange }) => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login"); // login | register-brand | register-dist

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("role,status").eq("id", data.user.id).single();
        if (profile) onLogin(profile.role, profile.status, data.user);
        else onLogin("distributor", "pending", data.user);
      }
    } catch (err) {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  if (view === "register-brand") return <RegisterScreen role="brand" lang={lang} onLangChange={onLangChange} onBack={() => setView("login")} />;
  if (view === "register-dist") return <RegisterScreen role="distributor" lang={lang} onLangChange={onLangChange} onBack={() => setView("login")} />;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)` }}>
      <div style={{ width:"100%", maxWidth:420, padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div style={{ textAlign:"center", flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, fontSize:24, fontWeight:900, color:C.bg, marginBottom:12, boxShadow:`0 8px 24px ${C.gold}35` }}>N</div>
            <div style={{ fontSize:24, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:4, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t("loginSubtitle")}</div>
          </div>
          <div style={{ marginTop:4 }}><LangSwitcher lang={lang} onChange={onLangChange}/></div>
        </div>

        {error && (
          <div style={{ background:`${C.red}15`, border:`1px solid ${C.red}40`, borderRadius:8, padding:"10px 14px", color:C.red, fontSize:13, marginBottom:18 }}>{error}</div>
        )}

        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{t("emailLabel")}</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{t("passwordLabel")}</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <button type="submit" disabled={loading} style={{ padding:"13px", borderRadius:10, cursor:"pointer", background:loading?C.goldDim:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, marginTop:4 }}>
            {loading ? t("loggingIn") : t("loginBtn")}
          </button>
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ fontSize:11, color:C.textDim }}>new?</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={() => setView("register-brand")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.gold}40`, color:C.gold, fontSize:13, fontWeight:500 }}>{t("registerBrand")}</button>
          <button onClick={() => setView("register-dist")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("registerDist")}</button>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ role, lang, onLangChange, onBack }) => {
  const t = useT();
  const isBrand = role === "brand";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [docs, setDocs] = useState({});

  const docTypes = isBrand
    ? ["visura_camerale","partita_iva","coordinate_bancarie"]
    : ["visura_camerale","partita_iva"];

  const docLabels = {
    visura_camerale: "Visura Camerale",
    partita_iva: "Partita IVA",
    coordinate_bancarie: "Coordinate Bancarie",
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (password !== confirm) { setError(t("passwordMismatch")); return; }
    if (password.length < 8) { setError(t("passwordShort")); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { role, company_name: companyName, full_name: fullName } }
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from("profiles").update({ full_name: fullName, company_name: companyName, phone, country }).eq("id", data.user.id);
        for (const docType of docTypes) {
          const file = docs[docType];
          if (file) {
            const path = `${data.user.id}/${docType}/${Date.now()}_${file.name}`;
            await supabase.storage.from("documents").upload(path, file);
            const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
            await supabase.from("documents").insert({ user_id: data.user.id, doc_type: docType, file_url: urlData.publicUrl, file_name: file.name });
          }
        }
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ maxWidth:420, width:"100%", padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:C.bg, margin:"0 auto 20px" }}>✓</div>
        <h2 style={{ color:C.text, fontFamily:"Georgia,serif", marginBottom:12 }}>{t("successTitle")}</h2>
        <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6, marginBottom:24 }}>{t("successMsg")}</p>
        <button onClick={onBack} style={{ padding:"12px 28px", borderRadius:8, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>{t("backToLogin")}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
      <div style={{ width:"100%", maxWidth:480, padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:C.bg }}>N</div>
            <span style={{ fontSize:18, fontWeight:700, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</span>
          </div>
          <LangSwitcher lang={lang} onChange={onLangChange}/>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24, justifyContent:"center" }}>
          {[1,2].map(s => (
            <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, background:step>=s?`${C.gold}20`:"transparent", border:`1px solid ${step>=s?C.gold:C.border}`, color:step>=s?C.gold:C.textDim }}>{s}</div>
              {s<2 && <div style={{ width:32, height:1, background:step>1?C.gold:C.border }}/>}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:22, fontWeight:700, color:C.text, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>
          {isBrand ? t("registerBrand") : t("registerDist")}
        </h2>
        <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 24px" }}>{step===1 ? t("step1") : t("step2")}</p>

        {error && <div style={{ background:`${C.red}15`, border:`1px solid ${C.red}40`, borderRadius:8, padding:"10px 14px", color:C.red, fontSize:13, marginBottom:16 }}>{error}</div>}

        {step===1 && (
          <form onSubmit={handleStep1} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { label:t("emailLabel"), val:email, set:setEmail, type:"email" },
              { label:t("passwordLabel"), val:password, set:setPassword, type:"password" },
              { label:t("confirmPassword"), val:confirm, set:setConfirm, type:"password" },
            ].map(({label,val,set,type}) => (
              <div key={label}>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{label}</label>
                <input type={type} value={val} onChange={e=>set(e.target.value)} required
                  style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <button type="submit" style={{ padding:"13px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, marginTop:4 }}>Continua →</button>
          </form>
        )}

        {step===2 && (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                {label:t("fullName"),val:fullName,set:setFullName},
                {label:t("companyName"),val:companyName,set:setCompanyName},
                {label:t("phone"),val:phone,set:setPhone},
                {label:t("country"),val:country,set:setCountry},
              ].map(({label,val,set}) => (
                <div key={label}>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{label}</label>
                  <input type="text" value={val} onChange={e=>set(e.target.value)}
                    style={{ width:"100%", padding:"11px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t("docsRequired")}</div>
              {docTypes.map(docType => (
                <label key={docType} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:C.surface2, border:`1px dashed ${docs[docType]?C.gold:C.border}`, borderRadius:8, cursor:"pointer", marginBottom:8 }}>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:"none" }}
                    onChange={e => { const f=e.target.files?.[0]; if(f) setDocs(d=>({...d,[docType]:f})); }}/>
                  <span style={{ fontSize:16, color:docs[docType]?C.gold:C.textDim }}>{docs[docType]?"✓":"↑"}</span>
                  <div>
                    <div style={{ fontSize:13, color:docs[docType]?C.goldLight:C.textMuted, fontWeight:500 }}>{docLabels[docType]}</div>
                    <div style={{ fontSize:11, color:C.textDim }}>{docs[docType]?docs[docType].name:t("clickToUpload")}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding:"12px 18px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>← Back</button>
              <button type="submit" disabled={loading} style={{ flex:1, padding:"13px", borderRadius:10, cursor:"pointer", background:loading?C.goldDim:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
                {loading ? t("sending") : t("submitRequest")}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign:"center", marginTop:18, fontSize:12, color:C.textDim }}>
          {t("alreadyAccount")} <button onClick={onBack} style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontSize:12 }}>{t("backToLogin")}</button>
        </p>
      </div>
    </div>
  );
};

const PendingScreen = ({ status, profile, onLogout, lang, onLangChange }) => {
  const t = useT();
  const isPending = status === "pending";
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", height:56, gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.bg }}>N</div>
        <span style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</span>
        <div style={{ flex:1 }}/>
        <LangSwitcher lang={lang} onChange={onLangChange}/>
        <button onClick={onLogout} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:11 }}>{t("logout")}</button>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", maxWidth:400, padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:48, marginBottom:16 }}>{isPending ? "⏳" : "✗"}</div>
          <h2 style={{ color:C.text, fontFamily:"Georgia,serif", marginBottom:12 }}>{isPending ? t("pendingTitle") : t("rejectedTitle")}</h2>
          <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6 }}>{isPending ? t("pendingMsg") : t("rejectedMsg")}</p>
          {profile?.rejection_reason && <p style={{ color:C.red, fontSize:13, marginTop:12 }}>{profile.rejection_reason}</p>}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARDS (unchanged from original)
// ============================================================
const BrandDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [actions, setActions] = useState({});
  const pending = PENDING_DISTRIBUTORS.filter(d => !actions[d.id]).length;
  const tabs = [
    { key:"overview", icon:"◈", label:t("tabOverview") },
    { key:"applications", icon:"📋", label:t("tabApplications"), badge:pending },
    { key:"distributors", icon:"⬡", label:t("tabDistributors") },
    { key:"catalog", icon:"◻", label:t("tabCatalog") },
    { key:"orders", icon:"↗", label:t("tabOrders") },
    { key:"payments", icon:"€", label:t("tabPayments") },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="Brand Portal" badge="brand" onLogout={onLogout} lang={lang} onLangChange={onLangChange}/>
      <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab}/>
        {tab==="overview" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("overviewTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("overviewSub")}</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="⬡" label={t("statTerritories")} value="8" sub={t("statTerritoriesSub")}/>
              <Stat icon="◻" label={t("statDistributors")} value="34" sub={`${pending} ${t("statDistributorsSub")}`} accent={C.blue}/>
              <Stat icon="↗" label={t("statRevenue")} value="€ 2.4M" sub={t("statRevenueSub")}/>
              <Stat icon="📦" label={t("statPallets")} value="480" sub={t("statPalletsSub")} accent={C.green}/>
              <Stat icon="🔔" label={t("statAlerts")} value="3" sub={t("statAlertsSub")} accent={C.red}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>🔔 {t("priceAlertsTitle")}</h3>
                {[
                  { market:"Amazon.de", product:"Oud Mood EDP 100ml", issue:"Price below MAP", s:"high" },
                  { market:"Amazon.fr", product:"Ameer Al Oud 80ml", issue:"Unauthorized seller", s:"high" },
                  { market:"eBay.it", product:"Ramz Silver EDP", issue:"Possible counterfeit", s:"medium" },
                ].map((a,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                    <Badge status={a.s}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{a.product}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{a.market} · {a.issue}</div>
                    </div>
                    <button style={{ padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}15`, border:`1px solid ${C.red}40`, color:C.red }}>{t("actBtn")}</button>
                  </div>
                ))}
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>📦 {t("hubStockTitle")}</h3>
                {[
                  [t("hubTotalSkus"),t("hubTotalSkusVal")],[t("hubTotalUnits"),t("hubTotalUnitsVal")],
                  [t("hubPallets"),t("hubPalletsVal")],[t("hubNextContainer"),t("hubNextContainerVal")],
                  [t("hubOrdersToday"),t("hubOrdersTodayVal")],[t("hubConsignment"),t("hubConsignmentVal")],
                ].map(([k,v],i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<5?`1px solid ${C.border}`:"none" }}>
                    <span style={{ fontSize:13, color:C.textMuted }}>{k}</span>
                    <span style={{ fontSize:13, color:C.goldLight, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="applications" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("appTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("appSub")}</p>
            {PENDING_DISTRIBUTORS.map(d => (
              <div key={d.id} style={{ background:C.surface, border:`1px solid ${actions[d.id]==="approved"?C.green+"60":actions[d.id]==="rejected"?C.red+"60":C.border}`, borderRadius:14, padding:24, marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:50, height:50, borderRadius:12, background:C.surface3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{d.flag}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{d.company}</div>
                      <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{d.contact} · {d.email}</div>
                      <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>{t("submitted")}: {d.submittedDate}</div>
                    </div>
                  </div>
                  <Badge status={actions[d.id]||d.status}/>
                </div>
                <div style={{ overflowX:"auto", marginBottom:14 }}>
                  <div style={{ display:"flex", gap:10, minWidth:500 }}>
                    {[[t("territory"),d.territory],[t("type"),d.type],[t("annualRevenue"),d.annualRevenue],[t("yearsActive"),`${d.yearsActivity} ${t("years")}`]].map(([k,v],i) => (
                      <div key={i} style={{ background:C.surface2, borderRadius:8, padding:"10px 14px", flex:"1 1 120px", minWidth:120 }}>
                        <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{k}</div>
                        <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>{t("requestedBrands")}</span>
                  {d.requestedBrands.map(bid => { const b=BRANDS.find(x=>x.id===bid); return b?<span key={bid} style={{ padding:"3px 10px", borderRadius:6, background:`${C.gold}12`, border:`1px solid ${C.gold}30`, fontSize:12, color:C.gold }}>{b.name}</span>:null; })}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>{t("documentsUploaded")}</span>
                  {d.documents.map((doc,i) => <span key={i} style={{ padding:"3px 10px", borderRadius:5, background:`${C.green}10`, border:`1px solid ${C.green}30`, fontSize:12, color:C.green }}>✓ {doc}</span>)}
                </div>
                {!actions[d.id] ? (
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <button onClick={() => setActions(a=>({...a,[d.id]:"approved"}))} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>{t("approveBtn")}</button>
                    <button onClick={() => setActions(a=>({...a,[d.id]:"rejected"}))} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>{t("declineBtn")}</button>
                    <button style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>{t("askMoreBtn")}</button>
                  </div>
                ) : (
                  <div style={{ padding:"11px 16px", borderRadius:8, background:actions[d.id]==="approved"?`${C.green}12`:`${C.red}12`, border:`1px solid ${actions[d.id]==="approved"?C.green:C.red}30`, fontSize:13, color:actions[d.id]==="approved"?C.green:C.red, fontWeight:600 }}>
                    {actions[d.id]==="approved"?t("approvedMsg"):t("rejectedMsg")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab==="distributors" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("distTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("distSub")}</p>
            <Table minWidth={750}
              headers={[t("colFlag"),t("colCompany"),t("colTerritory"),t("colBrands"),t("colOrders"),t("colRevenue"),t("colStatus")]}
              rows={ACTIVE_DISTRIBUTORS.map(d => [
                <span style={{ fontSize:22 }}>{d.flag}</span>,
                <div><div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{d.company}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{d.country}</div></div>,
                <span style={{ fontSize:13, color:C.textMuted }}>{d.territory}</span>,
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{d.brands.map(bid => { const b=BRANDS.find(x=>x.id===bid); return b?<span key={bid} style={{ padding:"2px 8px", borderRadius:5, background:`${C.gold}10`, border:`1px solid ${C.gold}25`, fontSize:11, color:C.gold, whiteSpace:"nowrap" }}>{b.name.split(" ")[0]}</span>:null; })}</div>,
                <span style={{ fontSize:14, fontWeight:700, color:C.goldLight }}>{d.orders}</span>,
                <span style={{ fontSize:14, fontWeight:700, color:C.goldLight }}>{d.revenue}</span>,
                <Badge status={d.status}/>,
              ])}
            />
          </div>
        )}
        {tab==="catalog" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("catTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("catSub")}</p>
            <Table minWidth={820}
              headers={[t("colSku"),t("colProduct"),t("colSize"),t("colCategory"),t("colPrice"),t("colStock"),t("colPerPallet"),t("colMoq")]}
              rows={CATALOG.filter(p=>p.brand==="lattafa").map(p => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.sku}</span>,
                <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{p.name}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.size}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.category}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€ {p.price.toFixed(2)}</span>,
                <span style={{ fontSize:12, color:p.stock>200?C.green:p.stock>100?C.gold:C.red, fontWeight:600 }}>{p.stock>200?"✓ ":"⚠ "}{p.stock} u.</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.pallet} u.</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.moq} u.</span>,
              ])}
            />
          </div>
        )}
        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("ordersTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("ordersSub")}</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="◻" label={t("statOrdersMonth")} value="127" sub={t("statOrdersMonthSub")}/>
              <Stat icon="📦" label={t("statPalletsShipped")} value="480" sub={t("statPalletsShippedSub")} accent={C.blue}/>
              <Stat icon="↗" label={t("statTotalValue")} value="€ 2.4M" sub={t("statTotalValueSub")}/>
              <Stat icon="⚡" label={t("statAvgDispatch")} value={t("statAvgDispatchVal")} sub={t("statAvgDispatchSub")} accent={C.green}/>
            </div>
            <Table minWidth={900}
              headers={[t("colOrderId"),t("colDistributor"),t("colCountry"),t("colItems"),t("colPallets"),t("colValue"),t("colStatus"),t("colDate"),t("colEta")]}
              rows={ORDERS.map(o => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.id}</span>,
                <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{o.distributor}</span>,
                <span style={{ fontSize:13 }}>{o.flag} {o.country}</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.items} u.</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.pallets}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(o.value)}</span>,
                <Badge status={o.status}/>,
                <span style={{ fontSize:12, color:C.textMuted }}>{o.date}</span>,
                <span style={{ fontSize:12, color:o.eta==="Delivered"?C.green:C.blue, fontWeight:500 }}>{o.eta}</span>,
              ])}
            />
          </div>
        )}
        {tab==="payments" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("paymentsTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("paymentsSub")}</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:22 }}>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.08em" }}>{t("payArchLabel")}</div>
              <div style={{ overflowX:"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:700 }}>
                  {[
                    { icon:"🏢", label:t("nodeDistributor"), sub:t("nodeDistributorSub"), col:C.blue },"→",
                    { icon:"⚡", label:t("nodeSepa"), sub:t("nodeSepaSub"), col:C.gold },"→",
                    { icon:"🏛️", label:t("nodeLattafa"), sub:t("nodeLattafaSub"), col:C.green },"→",
                    { icon:"🔔", label:t("nodeWebhook"), sub:t("nodeWebhookSub"), col:C.purple },"→",
                    { icon:"⚙️", label:t("nodeNexus"), sub:t("nodeNexusSub"), col:C.gold },"→",
                    { icon:"💼", label:t("nodeGiga"), sub:t("nodeGigaSub"), col:C.goldLight },
                  ].map((s,i) => s==="→"?(
                    <div key={i} style={{ color:C.textDim, fontSize:18, flexShrink:0 }}>→</div>
                  ):(
                    <div key={i} style={{ background:C.surface2, border:`1px solid ${s.col}25`, borderRadius:10, padding:"12px 14px", textAlign:"center", flex:"1 1 100px", minWidth:100 }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:s.col }}>{s.label}</div>
                      <div style={{ fontSize:10, color:C.textDim, marginTop:3, lineHeight:1.4 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <h3 style={{ fontSize:14, color:C.text, margin:"0 0 14px" }}>{t("payTransLog")}</h3>
            <Table minWidth={900}
              headers={[t("colOrderId"),t("colDistributor"),t("colCountry"),t("colGross"),t("colBrandShare"),t("colNexusFee"),t("colFeePercent"),t("colMethod"),t("colTime"),t("colStatus")]}
              rows={PAYMENTS.map(p => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.id}</span>,
                <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{p.distributor}</span>,
                <span style={{ fontSize:13 }}>{p.flag} {p.country}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(p.gross)}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.green }}>{fmt(p.brandShare)}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(p.nexusFee)}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.feePercent}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.method}</span>,
                <span style={{ fontSize:11, color:C.textMuted }}>{p.time}</span>,
                <Badge status={p.status}/>,
              ])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DistributorDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("brands");
  const [cart, setCart] = useState({});
  const [requested, setRequested] = useState({});
  const myBrands = ["lattafa","rasasi"];
  const addToCart = sku => setCart(c=>({...c,[sku]:(c[sku]||0)+1}));
  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);
  const cartValue = Object.entries(cart).reduce((s,[sku,qty]) => { const item=CATALOG.find(i=>i.sku===sku); return s+(item?item.price*qty:0); },0);
  const tabs = [
    { key:"brands", icon:"◈", label:t("tabBrandMarket") },
    { key:"catalog", icon:"◻", label:t("tabMyCatalog") },
    { key:"orders", icon:"↗", label:t("tabMyOrders") },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="Distributor Portal" badge="distributor" onLogout={onLogout} lang={lang} onLangChange={onLangChange}/>
      <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab}/>
        {tab==="brands" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("marketTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("marketSub")}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
              {BRANDS.map(brand => {
                const enabled=myBrands.includes(brand.id); const req=requested[brand.id];
                return (
                  <div key={brand.id} style={{ background:C.surface, border:`1px solid ${enabled?C.goldDim:C.border}`, borderTop:`2px solid ${enabled?C.gold:C.border}`, borderRadius:14, padding:22 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                      <BrandLogo brand={brand} size={46}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{brand.name}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>📍 {brand.origin}</div>
                      </div>
                      {enabled && <Badge status="active"/>}
                    </div>
                    <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.55 }}>{brand.description}</p>
                    <div style={{ display:"flex", gap:10, marginBottom:18 }}>
                      {[[t("skusLabel"),brand.skus],[t("euDistLabel"),brand.distributors],[t("categoryLabel"),brand.category]].map(([k,v],i) => (
                        <div key={i} style={{ background:C.surface2, borderRadius:7, padding:"9px 10px", flex:1, textAlign:"center" }}>
                          <div style={{ fontSize:i<2?15:10, fontWeight:700, color:C.goldLight }}>{v}</div>
                          <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.05em", marginTop:2 }}>{k}</div>
                        </div>
                      ))}
                    </div>
                    {enabled?(
                      <button onClick={() => setTab("catalog")} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:13, fontWeight:600 }}>{t("viewCatalogBtn")}</button>
                    ):req?(
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.blue}10`, border:`1px solid ${C.blue}30`, color:C.blue, fontSize:13 }}>{t("requestSentMsg")}</div>
                    ):(
                      <button onClick={() => setRequested(r=>({...r,[brand.id]:true}))} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("requestAccessBtn")}</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tab==="catalog" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("myCatTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("myCatSub")}</p>
            <Table minWidth={850}
              headers={[t("colBrand"),t("colSku"),t("colProduct"),t("colSize"),t("colCategory"),t("colPrice"),t("colStock"),t("colMoq"),t("colAction")]}
              rows={CATALOG.filter(p=>myBrands.includes(p.brand)).map(item => {
                const brand=BRANDS.find(b=>b.id===item.brand);
                return [
                  brand?<div style={{ display:"flex", alignItems:"center", gap:7 }}><BrandLogo brand={brand} size={24}/><span style={{ fontSize:12, color:C.textMuted }}>{brand.name.split(" ")[0]}</span></div>:null,
                  <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{item.sku}</span>,
                  <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{item.name}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.size}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.category}</span>,
                  <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€ {item.price.toFixed(2)}</span>,
                  <span style={{ fontSize:12, color:item.stock>200?C.green:item.stock>100?C.gold:C.red, fontWeight:600 }}>{item.stock>200?"✓ ":"⚠ "}{item.stock}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.moq} u.</span>,
                  <button onClick={() => addToCart(item.sku)} style={{ padding:"6px 14px", borderRadius:7, cursor:"pointer", background:cart[item.sku]?`${C.gold}25`:`${C.gold}10`, border:`1px solid ${cart[item.sku]?C.gold:C.gold+"35"}`, color:C.goldLight, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
                    {cart[item.sku]?`×${cart[item.sku]} · Add`:t("addBtn")}
                  </button>,
                ];
              })}
            />
            {cartCount>0 && (
              <div style={{ position:"fixed", bottom:20, right:24, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, borderRadius:12, padding:"13px 22px", cursor:"pointer", boxShadow:`0 8px 32px ${C.gold}45`, display:"flex", alignItems:"center", gap:14 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.bg }}>{t("cartLabel")} · {cartCount} items</div>
                  <div style={{ fontSize:12, color:C.bg+"99" }}>€ {cartValue.toLocaleString("it-IT",{minimumFractionDigits:2})} · {t("cartSub1")}</div>
                </div>
                <span style={{ fontSize:18, color:C.bg }}>→</span>
              </div>
            )}
          </div>
        )}
        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("myOrdersTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("myOrdersSub")}</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="◻" label={t("statMyOrders")} value="7" sub={t("statMyOrdersSub")}/>
              <Stat icon="↗" label={t("statMySpent")} value="€ 89.2K" sub={t("statMySpentSub")}/>
              <Stat icon="⚡" label={t("statMyDelivery")} value={t("statMyDeliveryVal")} accent={C.green}/>
              <Stat icon="📦" label={t("statMyPallets")} value="12" sub={t("statMyPalletsSub")} accent={C.blue}/>
            </div>
            <Table minWidth={800}
              headers={[t("colOrderId"),t("colItems"),t("colPallets"),t("colValue"),t("colStatus"),t("colDate"),t("colEta"),t("colPayment")]}
              rows={ORDERS.slice(0,4).map(o => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.id}</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.items} units</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.pallets}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(o.value)}</span>,
                <Badge status={o.status}/>,
                <span style={{ fontSize:12, color:C.textMuted }}>{o.date}</span>,
                <span style={{ fontSize:12, color:o.eta==="Delivered"?C.green:C.blue, fontWeight:500 }}>{o.eta==="Delivered"?t("deliveredCheck"):`📦 ${o.eta}`}</span>,
                <Badge status="settled"/>,
              ])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="NexusHub Admin" badge="admin" onLogout={onLogout} lang={lang} onLangChange={onLangChange}/>
      <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
        <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("adminTitle")}</h2>
        <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("adminSub")}</p>
        <div style={{ display:"flex", gap:14, marginBottom:26, flexWrap:"wrap" }}>
          <Stat icon="🏛️" label={t("statBrands")} value="4" sub={t("statBrandsSub")} accent={C.gold}/>
          <Stat icon="⬡" label={t("statAllDist")} value="103" sub={t("statAllDistSub")} accent={C.blue}/>
          <Stat icon="↗" label={t("statGmv")} value="€ 8.9M" sub={t("statGmvSub")}/>
          <Stat icon="💼" label={t("statNexusRev")} value="€ 1.01M" sub={t("statNexusRevSub")} accent={C.green}/>
          <Stat icon="📦" label={t("statAllPallets")} value="1,840" sub={t("statAllPalletsSub")} accent={C.purple}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
            <h3 style={{ margin:"0 0 16px", fontSize:14 }}>{t("adminBrandsTitle")}</h3>
            {BRANDS.map((b,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<BRANDS.length-1?`1px solid ${C.border}`:"none" }}>
                <BrandLogo brand={b} size={34}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{b.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{b.distributors} {t("distributorsLabel")} · {b.skus} SKUs</div>
                </div>
                <Badge status="active"/>
              </div>
            ))}
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
            <h3 style={{ margin:"0 0 16px", fontSize:14 }}>{t("adminRevenueTitle")}</h3>
            {[
              { name:"Armaf", gmv:"€ 3.1M", fee:"€ 354K", pct:100 },
              { name:"Lattafa Perfumes", gmv:"€ 2.4M", fee:"€ 274K", pct:77 },
              { name:"Rasasi Perfumes", gmv:"€ 1.8M", fee:"€ 205K", pct:58 },
              { name:"Ajmal Perfumes", gmv:"€ 1.6M", fee:"€ 182K", pct:52 },
            ].map((b,i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, color:C.text }}>{b.name}</span>
                  <span style={{ fontSize:13, color:C.goldLight, fontWeight:600 }}>{b.fee}</span>
                </div>
                <div style={{ height:6, background:C.surface2, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${b.pct}%`, background:`linear-gradient(90deg,${C.gold},${C.goldDim})`, borderRadius:3 }}/>
                </div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:4 }}>GMV: {b.gmv}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP — con Supabase auth reale
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [lang, setLang] = useState("en");

  const t = key => T[lang]?.[key] ?? T["en"][key] ?? key;
  const dir = LANGS.find(l=>l.key===lang)?.dir ?? "ltr";
  const fontFamily = lang==="ar" ? "'Segoe UI', Tahoma, Arial, sans-serif"
                   : lang==="zh" ? "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
                   : "'Trebuchet MS', sans-serif";

  // Controlla sessione esistente all'avvio
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("role,status").eq("id", session.user.id).single();
        if (profile) { setUserRole(profile.role); setUserStatus(profile.status); setScreen("app"); }
        else setScreen("login");
      } else {
        setScreen("login");
      }
    });
  }, []);

  const handleLogin = (role, status) => {
    setUserRole(role); setUserStatus(status); setScreen("app");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null); setUserStatus(null); setScreen("login");
  };

  if (screen === "loading") return (
    <div style={{ minHeight:"100vh", background:"#08080f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#c9a84c", fontSize:20, fontFamily:"Georgia,serif", letterSpacing:"0.2em" }}>NEXUSHUB</div>
    </div>
  );

  const dashboardProps = { onLogout: handleLogout, lang, onLangChange: setLang };

  return (
    <LangCtx.Provider value={{ lang, t, dir }}>
      <div dir={dir} style={{ fontFamily }}>
        {screen === "login" && <Login onLogin={handleLogin} lang={lang} onLangChange={setLang}/>}
        {screen === "app" && userRole === "admin" && <AdminDashboard {...dashboardProps}/>}
        {screen === "app" && userRole === "brand" && (userStatus === "approved"
          ? <BrandDashboard {...dashboardProps}/>
          : <PendingScreen status={userStatus} onLogout={handleLogout} lang={lang} onLangChange={setLang}/>
        )}
        {screen === "app" && userRole === "distributor" && (userStatus === "approved"
          ? <DistributorDashboard {...dashboardProps}/>
          : <PendingScreen status={userStatus} onLogout={handleLogout} lang={lang} onLangChange={setLang}/>
        )}
      </div>
    </LangCtx.Provider>
  );
}
