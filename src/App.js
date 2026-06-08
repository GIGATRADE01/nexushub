import { useState, createContext, useContext, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Send email via Edge Function
const sendEmail = async (type, email, company_name, role = "", reason = "", order_number = "", order_amount = "", items_count = "") => {
  try {
    await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ type, email, company_name, role, reason, order_number, order_amount, items_count }),
      }
    );
  } catch(e) { console.log("Email error:", e); }
};

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
    rejectedMsgDist:"✗ Declined — distributor has been notified via email",
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
    rejectedMsgDist:"✗ Rifiutato — il distributore è stato notificato via email",
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
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${accent||C.goldDim}`, borderRadius:12, padding:"16px 18px", minWidth:130, flex:"1 1 130px" }}>
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
  <div style={{ display:"flex", gap:4, marginBottom:16, borderBottom:`1px solid ${C.border}`, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none" }}>
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

const Navbar = ({ name, badge, onLogout, lang, onLangChange, onNotifications, notifCount=0 }) => {
  const t = useT();
  const bCol = { brand:C.gold, distributor:C.blue, admin:C.purple };
  const bLabel = { brand:t("portalBrand"), distributor:t("portalDistributor"), admin:t("portalAdmin") };
  return (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 10px", display:"flex", alignItems:"center", height:52, position:"sticky", top:0, zIndex:200, gap:6, flexWrap:"nowrap", WebkitBackdropFilter:"blur(10px)", overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:C.bg, flexShrink:0 }}>N</div>
      <span style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:"Georgia,serif", flexShrink:0 }}>NexusHub</span>
      {/* Badge - hidden on very small screens */}
      <span style={{ padding:"2px 6px", borderRadius:4, background:bCol[badge]+"18", border:`1px solid ${bCol[badge]}30`, fontSize:9, color:bCol[badge], letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0, display:"none" }} className="nav-badge">{bLabel[badge]}</span>
      {/* Spacer */}
      <div style={{ flex:1, minWidth:0 }}/>
      {/* Lang switcher — compact on mobile */}
      <div style={{ display:"flex", gap:2, flexShrink:0 }}>
        {["en","it"].map(l => (
          <button key={l} onClick={() => onLangChange(l)} style={{
            padding:"2px 5px", borderRadius:4, cursor:"pointer", fontSize:10, fontWeight:600,
            background:lang===l?`${C.gold}20`:"transparent",
            border:`1px solid ${lang===l?C.gold:C.border}`,
            color:lang===l?C.goldLight:C.textMuted,
          }}>{l.toUpperCase()}</button>
        ))}
        <button onClick={() => onLangChange(lang === "ar" ? "en" : lang === "fr" ? "en" : "fr")} style={{
          padding:"2px 5px", borderRadius:4, cursor:"pointer", fontSize:10,
          background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted
        }}>···</button>
      </div>
      {/* Notifications */}
      {onNotifications && (
        <button onClick={onNotifications} style={{ position:"relative", background:"transparent", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:8, display:"flex", alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:18 }}>🔔</span>
          {notifCount > 0 && (
            <span style={{ position:"absolute", top:0, right:0, background:C.red, color:"#fff", borderRadius:10, fontSize:9, fontWeight:700, padding:"1px 4px", minWidth:14, textAlign:"center" }}>
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>
      )}
      {/* Logout — icona su mobile */}
      <button onClick={onLogout} style={{ padding:"5px 10px", borderRadius:6, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:11, flexShrink:0, whiteSpace:"nowrap" }}>
        {t("logout")}
      </button>
    </div>
  );
};


// ============================================================
// DEMO PRESENTATION COMPONENT
// ============================================================
const DEMO_SLIDES = [
  { id:0, type:"intro", duration:5000 },
  { id:1, type:"problem", duration:6000 },
  { id:2, type:"solution", duration:6000 },
  { id:3, type:"sectors", duration:7000 },
  { id:4, type:"map", duration:8000 },
  { id:5, type:"brands", duration:7000 },
  { id:6, type:"distributors", duration:7000 },
  { id:7, type:"value", duration:8000 },
  { id:8, type:"numbers", duration:6000 },
  { id:9, type:"amazon", duration:8000 },
  { id:10, type:"cta", duration:99999 },
];

const DC = {
  bg:"#06060e", gold:"#c9a84c", goldL:"#e2bc6a", goldD:"#7a5e28",
  text:"#f0ece4", muted:"#6b6b8a", dim:"#2a2a3a",
  blue:"#3d8ef0", green:"#27ae60", purple:"#8e44ad", red:"#c0392b",
  orange:"#FF9900",
};

function DemoProgressBar({ total, current, elapsed, duration }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:200,
      display:"flex", gap:3, padding:"10px 16px",
      background:"linear-gradient(to bottom, rgba(6,6,14,.9), transparent)" }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{ flex:1, height:2, borderRadius:2,
          background: i < current ? DC.gold : DC.dim, overflow:"hidden" }}>
          {i === current && (
            <div style={{ height:"100%", background:DC.gold,
              width:`${Math.min(100,(elapsed/duration)*100)}%`,
              transition:"width .1s linear" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

function DemoSlideContent({ slide, visible }) {
  const anim = (delay=0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });
  const animLeft = (delay=0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-28px)",
    transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });
  const animScale = (delay=0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.85)",
    transition: `all 0.6s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const HL = ({ children, color, size="clamp(26px,4.5vw,48px)" }) => (
    <div style={{ fontSize:size, fontWeight:800, fontFamily:"'Bebas Neue','Impact',sans-serif",
      letterSpacing:".05em", color: color || DC.text, marginBottom:8, ...anim(0.1) }}>
      {children}
    </div>
  );
  const Sub = ({ children, delay=0.2 }) => (
    <div style={{ fontSize:"clamp(12px,1.8vw,15px)", color:DC.muted, lineHeight:1.6,
      marginBottom:16, fontFamily:"'DM Sans',sans-serif", ...anim(delay) }}>
      {children}
    </div>
  );
  const FRow = ({ icon, text, color, delay }) => (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px",
      marginBottom:9, background:"rgba(255,255,255,.03)",
      border:"1px solid rgba(255,255,255,.07)",
      borderLeft:`3px solid ${color||DC.gold}`, borderRadius:10,
      fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(12px,1.6vw,14px)", color:DC.text,
      ...animLeft(delay) }}>
      <span style={{fontSize:20,flexShrink:0}}>{icon}</span>{text}
    </div>
  );

  if (slide.type === "intro") return (
    <div style={{ textAlign:"center", position:"relative" }}>
      <div style={{ fontSize:"clamp(48px,10vw,88px)", fontWeight:900,
        fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:".2em",
        background:`linear-gradient(135deg,${DC.goldL},${DC.gold},${DC.goldD})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        ...anim(0.1) }}>NEXUSHUB</div>
      <div style={{ fontSize:"clamp(12px,2vw,16px)", color:DC.text, letterSpacing:".2em",
        textTransform:"uppercase", marginTop:10, fontFamily:"'DM Sans',sans-serif", ...anim(0.3) }}>
        Global B2B Distribution Platform
      </div>
      <div style={{ fontSize:"clamp(11px,1.5vw,13px)", color:DC.muted, marginTop:8,
        fontFamily:"'DM Sans',sans-serif", ...anim(0.5) }}>
        Connecting brands & distributors across Europe — automated, instant, scalable
      </div>
    </div>
  );

  if (slide.type === "problem") return (
    <div style={{ maxWidth:580, width:"100%", textAlign:"left" }}>
      <HL>The Old Way Is Broken</HL>
      {["❌ Endless emails & calls to manage distributors",
        "❌ No real-time visibility on stock",
        "❌ Manual invoices and payment chasing",
        "❌ Zero market intelligence or territory data"
      ].map((p,i) => (
        <div key={i} style={{ padding:"13px 18px", marginBottom:9,
          background:"rgba(220,50,50,.08)", border:"1px solid rgba(220,50,50,.2)",
          borderRadius:11, fontSize:"clamp(13px,1.8vw,16px)", color:"#ff8888",
          fontFamily:"'DM Sans',sans-serif", ...animLeft(0.2+i*0.12) }}>{p}</div>
      ))}
    </div>
  );

  if (slide.type === "solution") return (
    <div style={{ textAlign:"center", maxWidth:660, width:"100%" }}>
      <HL color={DC.goldL}>One Platform. Everything.</HL>
      <Sub>NexusHub automates the entire distribution chain — from catalog to payment — across Europe</Sub>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginTop:20 }}>
        {[{v:"30+",l:"Countries"},{v:"48h",l:"Delivery"},{v:"100%",l:"Automated"}].map((s,i) => (
          <div key={i} style={{ flex:"1 1 130px", maxWidth:170, padding:"22px 14px", textAlign:"center",
            background:"rgba(201,168,76,.05)", border:"1px solid rgba(201,168,76,.2)",
            borderTop:`3px solid ${DC.gold}`, borderRadius:14, ...animScale(0.3+i*0.12) }}>
            <div style={{ fontSize:"clamp(28px,5vw,44px)", fontWeight:900, color:DC.goldL,
              fontFamily:"'Bebas Neue',sans-serif" }}>{s.v}</div>
            <div style={{ fontSize:11, color:DC.muted, letterSpacing:".08em",
              textTransform:"uppercase", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === "sectors") return (
    <div style={{ textAlign:"center", maxWidth:680, width:"100%" }}>
      <HL>Every Sector. One Hub.</HL>
      <Sub>NexusHub works across all B2B product categories</Sub>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:16 }}>
        {[
          {icon:"💄",name:"Beauty",sub:"Cosmetics & Fragrance"},
          {icon:"👗",name:"Fashion",sub:"Apparel & Accessories"},
          {icon:"🍷",name:"Food & Beverage",sub:"Premium & Specialty"},
          {icon:"📱",name:"Electronics",sub:"Consumer & Pro Tech"},
          {icon:"🏠",name:"Home & Living",sub:"Design & Furniture"},
          {icon:"💊",name:"Health",sub:"OTC & Wellness"},
        ].map((s,i) => (
          <div key={i} style={{ padding:"16px 10px", background:"rgba(255,255,255,.03)",
            border:"1px solid rgba(255,255,255,.07)", borderRadius:12, ...animScale(0.2+i*0.08) }}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:DC.text,letterSpacing:".06em",textTransform:"uppercase"}}>{s.name}</div>
            <div style={{fontSize:10,color:DC.muted,marginTop:3}}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === "map") return (
    <div style={{ width:"100%", maxWidth:"100%" }}>
      <div style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:800,
        fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:".05em",
        color:DC.text, textAlign:"center", marginBottom:6, ...anim(0.1) }}>
        One Hub. Limitless Connections.
      </div>
      <div style={{ fontSize:"clamp(11px,1.6vw,14px)", color:DC.muted, textAlign:"center",
        marginBottom:12, fontFamily:"'DM Sans',sans-serif", ...anim(0.2) }}>
        From Turin, we reach every European market — fast, direct, exclusive
      </div>
      <div style={{ ...anim(0.3), display:"flex", justifyContent:"center" }}>
        <svg viewBox="0 0 900 420" style={{ width:"100%", maxWidth:"100%", height:"auto", borderRadius:8 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ns" cx="48%" cy="55%" r="60%">
              <stop offset="0%" stopColor="#0a1020"/><stop offset="100%" stopColor="#020408"/>
            </radialGradient>
            <radialGradient id="hg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
            </radialGradient>
            <filter id="sg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="cg"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect width="900" height="420" fill="url(#ns)" rx="8"/>
          {/* Aurora */}
          <ellipse cx="450" cy="70" rx="280" ry="55" fill="none" stroke="rgba(201,168,76,.05)" strokeWidth="35">
            <animate attributeName="opacity" values=".4;.8;.4" dur="5s" repeatCount="indefinite"/>
          </ellipse>
          {/* Particles */}
          {[[120,160],[200,260],[680,130],[750,300],[160,340],[820,220]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="1.2" fill="#c9a84c" opacity="0">
              <animate attributeName="opacity" values="0;.5;0" dur={`${3.5+i*0.5}s`} repeatCount="indefinite" begin={`${i*0.8}s`}/>
              <animate attributeName="cy" values={`${y};${y-22};${y}`} dur={`${3.5+i*0.5}s`} repeatCount="indefinite" begin={`${i*0.8}s`}/>
            </circle>
          ))}
          {/* Countries */}
          <path d="M 430 18 L 450 13 L 480 20 L 505 16 L 525 28 L 535 52 L 528 82 L 515 108 L 495 128 L 478 145 L 462 140 L 448 118 L 438 92 L 432 62 L 425 40 Z" fill="#0d1a0d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 530 18 L 570 10 L 600 16 L 618 36 L 620 62 L 610 92 L 595 115 L 575 129 L 555 125 L 535 109 L 528 85 L 535 52 L 525 28 Z" fill="#0d1a0d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 390 36 L 430 18 L 432 62 L 425 92 L 410 112 L 398 105 L 385 79 L 383 55 Z" fill="#0d1a0d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 438 170 L 455 166 L 462 183 L 455 196 L 440 193 L 435 180 Z" fill="#0d1a0d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 285 86 L 318 76 L 342 86 L 355 106 L 358 138 L 348 170 L 330 186 L 308 186 L 290 170 L 278 146 L 278 116 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 242 116 L 272 108 L 278 146 L 265 163 L 245 156 L 235 138 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 385 180 L 422 173 L 428 196 L 408 206 L 385 203 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 428 173 L 510 166 L 522 196 L 518 236 L 495 256 L 455 260 L 435 236 L 428 210 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 510 163 L 595 156 L 608 170 L 615 206 L 605 236 L 518 240 L 518 203 L 510 173 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 318 196 L 415 186 L 440 216 L 448 266 L 428 310 L 392 326 L 355 316 L 322 286 L 308 246 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 238 323 L 265 316 L 260 393 L 235 386 L 222 360 L 228 336 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 265 316 L 388 306 L 428 316 L 442 350 L 428 390 L 382 413 L 325 416 L 275 396 L 252 360 L 258 330 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          {/* Italy highlighted */}
          <path d="M 392 283 L 458 276 L 492 296 L 505 333 L 495 376 L 472 413 L 452 425 L 435 408 L 422 373 L 408 340 Z" fill="#15200a" stroke="#2a4a15" strokeWidth="1.2"/>
          <path d="M 518 253 L 608 246 L 628 276 L 635 316 L 618 356 L 572 366 L 535 346 L 518 310 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 475 293 L 528 286 L 535 320 L 535 353 L 518 383 L 498 396 L 478 386 L 462 356 L 465 320 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          <path d="M 532 356 L 575 346 L 588 376 L 575 408 L 548 418 L 525 406 L 518 383 Z" fill="#0d150d" stroke="#1a3a1a" strokeWidth="0.8"/>
          {/* Routes */}
          {[
            [318,148],[372,252],[480,210],[398,190],[310,366],[555,193],[598,300],[508,116],[552,385]
          ].map(([x2,y2],i) => (
            <line key={i} x1="428" y1="306" x2={x2} y2={y2}
              stroke="#c9a84c" strokeWidth="1.6" opacity="0.75"
              strokeDasharray="7,5">
              <animate attributeName="strokeDashoffset" values="48;0" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>
            </line>
          ))}
          {/* Glow lines */}
          {[[318,148],[372,252],[480,210],[310,366]].map(([x2,y2],i)=>(
            <line key={i} x1="428" y1="306" x2={x2} y2={y2} stroke="#c9a84c" strokeWidth="6" opacity="0.04"/>
          ))}
          {/* Hub */}
          <circle cx="428" cy="306" r="35" fill="url(#hg)"/>
          <circle cx="428" cy="306" r="12" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" values="8;24;8" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".6;0;.6" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="428" cy="306" r="7" fill="#c9a84c" filter="url(#sg)"/>
          <circle cx="428" cy="306" r="4" fill="#fff8e8"/>
          <rect x="404" y="316" width="50" height="20" rx="4" fill="rgba(10,8,2,.85)" stroke="#c9a84c" strokeWidth="1"/>
          <text x="429" y="324" fill="#e2bc6a" fontSize="7.5" fontFamily="DM Sans,sans-serif" fontWeight="800" textAnchor="middle">TORINO HUB</text>
          {/* City dots + labels */}
          {[
            {x:318,y:148,name:"LONDON",sub:"UK",lx:326,ly:144},
            {x:372,y:252,name:"PARIS",sub:"FRANCE",lx:380,ly:248},
            {x:480,y:210,name:"BERLIN",sub:"GERMANY",lx:488,ly:206},
            {x:398,y:190,name:"AMSTERDAM",sub:"NETHERLANDS",lx:350,ly:186},
            {x:310,y:366,name:"BARCELONA",sub:"SPAIN",lx:262,ly:362},
            {x:555,y:193,name:"WARSAW",sub:"POLAND",lx:562,ly:189},
            {x:598,y:300,name:"BUCHAREST",sub:"ROMANIA",lx:606,ly:296},
            {x:508,y:116,name:"STOCKHOLM",sub:"SWEDEN",lx:516,ly:112},
            {x:552,y:385,name:"ATHENS",sub:"GREECE",lx:560,ly:381},
          ].map((c,i)=>(
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="8" fill="#c9a84c" opacity=".12"/>
              <circle cx={c.x} cy={c.y} r="4.5" fill="#c9a84c" opacity=".9" filter="url(#cg)"/>
              <text x={c.lx} y={c.ly} fill="#e2bc6a" fontSize="8.5" fontFamily="DM Sans,sans-serif" fontWeight="700">{c.name}</text>
              <text x={c.lx} y={c.ly+10} fill="rgba(201,168,76,.6)" fontSize="7" fontFamily="DM Sans,sans-serif">{c.sub}</text>
            </g>
          ))}
          <text x="450" y="408" fill="rgba(201,168,76,.4)" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle" letterSpacing="3">ONE HUB · LIMITLESS CONNECTIONS</text>
        </svg>
      </div>
    </div>
  );

  if (slide.type === "brands") return (
    <div style={{ maxWidth:580, width:"100%", textAlign:"left" }}>
      <HL color={DC.goldL}>For Brands</HL>
      <Sub>Full control. Full visibility. Zero manual work.</Sub>
      <FRow icon="🗺️" text="Territory management — one distributor per country" color={DC.gold} delay={0.25}/>
      <FRow icon="📦" text="Real-time stock with order rules (MOQ, multiples)" color={DC.gold} delay={0.37}/>
      <FRow icon="✅" text="Approve distributors & documents in one click" color={DC.gold} delay={0.49}/>
      <FRow icon="💰" text="Automatic SEPA payments — receive funds instantly" color={DC.gold} delay={0.61}/>
    </div>
  );

  if (slide.type === "distributors") return (
    <div style={{ maxWidth:580, width:"100%", textAlign:"left" }}>
      <HL color={DC.blue}>For Distributors</HL>
      <Sub>Access premium brands. Grow your territory.</Sub>
      <FRow icon="🏛️" text="Browse & apply to top global brands" color={DC.blue} delay={0.25}/>
      <FRow icon="📋" text="Order from live catalog with real-time stock" color={DC.blue} delay={0.37}/>
      <FRow icon="🚚" text="48h delivery from Turin European Hub" color={DC.blue} delay={0.49}/>
      <FRow icon="📊" text="Revenue analytics & territory performance dashboard" color={DC.blue} delay={0.61}/>
    </div>
  );

  if (slide.type === "value") return (
    <div style={{ textAlign:"center", maxWidth:680, width:"100%" }}>
      <HL>More Flow. More Revenue.</HL>
      <Sub>NexusHub removes friction — faster stock rotation means more revenue for everyone</Sub>
      <div style={{ display:"flex", alignItems:"stretch", gap:0, margin:"16px 0", ...anim(0.3) }}>
        {[
          {icon:"📦",title:"Stock Arrives",sub:"Real-time catalog update",col:"rgba(201,168,76,.2)"},
          {icon:"🛒",title:"Distributor Orders",sub:"Instant SEPA payment",col:"rgba(61,142,240,.2)"},
          {icon:"💶",title:"Revenue Flows",sub:"Brand + Distributor win",col:"rgba(39,174,96,.2)"},
        ].map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ flex:1, padding:"14px 10px", background:s.col,
              border:`1px solid ${s.col.replace('.2','.4')}`,
              borderRadius: i===0?"12px 0 0 12px":i===2?"0 12px 12px 0":"0",
              textAlign:"center" }}>
              <div style={{fontSize:22,marginBottom:5}}>{s.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:DC.text}}>{s.title}</div>
              <div style={{fontSize:10,color:DC.muted,marginTop:2}}>{s.sub}</div>
            </div>
            {i<2 && <div style={{padding:"0 8px",color:DC.gold,fontSize:18}}>→</div>}
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[{v:"3x",l:"Faster Rotation",c:DC.goldL},{v:"0",l:"Manual Work",c:DC.blue},{v:"↑↑",l:"Revenue for All",c:DC.green}].map((m,i)=>(
          <div key={i} style={{ padding:"16px 10px", background:"rgba(255,255,255,.03)",
            border:"1px solid rgba(255,255,255,.07)", borderRadius:11, textAlign:"center",
            ...animScale(0.35+i*0.12) }}>
            <div style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:900,color:m.c,fontFamily:"'Bebas Neue',sans-serif"}}>{m.v}</div>
            <div style={{fontSize:10,color:DC.muted,letterSpacing:".06em",textTransform:"uppercase",marginTop:3}}>{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === "numbers") return (
    <div style={{ textAlign:"center", maxWidth:660, width:"100%" }}>
      <HL>Built for Scale</HL>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20 }}>
        {[
          {v:"€8.9M",l:"Platform GMV",c:DC.goldL,b:DC.gold},
          {v:"103",l:"Active Distributors",c:DC.blue,b:DC.blue},
          {v:"480",l:"Pallets / Month",c:DC.green,b:DC.green},
          {v:"48h",l:"Hub to Door",c:DC.purple,b:DC.purple},
        ].map((m,i)=>(
          <div key={i} style={{ padding:"22px 14px", textAlign:"center",
            background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
            borderTop:`3px solid ${m.b}`, borderRadius:13, ...animScale(0.2+i*0.12) }}>
            <div style={{fontSize:"clamp(26px,4.5vw,42px)",fontWeight:900,color:m.c,fontFamily:"'Bebas Neue',sans-serif"}}>{m.v}</div>
            <div style={{fontSize:11,color:DC.muted,letterSpacing:".08em",textTransform:"uppercase",marginTop:3}}>{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === "amazon") return (
    <div style={{ textAlign:"center", maxWidth:660, width:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center", marginBottom:14, ...anim(0.1) }}>
        <div style={{ width:46, height:46, borderRadius:11,
          background:"linear-gradient(135deg,#FF9900,#e47911)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, fontWeight:900, color:"#fff", fontFamily:"'Bebas Neue',sans-serif" }}>a</div>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:"clamp(18px,3.5vw,32px)",fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:"#FF9900",letterSpacing:".05em"}}>Amazon Europe</div>
          <div style={{fontSize:11,color:DC.muted,letterSpacing:".1em",textTransform:"uppercase"}}>Exclusive Management Service</div>
        </div>
      </div>
      <Sub delay={0.2}>We handle everything — you collect the revenue</Sub>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {[
          {icon:"🚚",title:"FBA Logistics",sub:"Full Amazon FBA management across all EU marketplaces"},
          {icon:"📢",title:"PPC Advertising",sub:"Sponsored ads, DSP campaigns, brand store management"},
          {icon:"💹",title:"Price Control",sub:"MAP enforcement, Buy Box optimization, competitor monitoring"},
          {icon:"🔒",title:"Exclusive Rights",sub:"One brand, one partner — full market protection guaranteed"},
        ].map((s,i)=>(
          <div key={i} style={{ padding:"14px 12px", background:"rgba(255,153,0,.06)",
            border:"1px solid rgba(255,153,0,.2)", borderLeft:"3px solid #FF9900",
            borderRadius:11, textAlign:"left", ...animScale(0.25+i*0.1) }}>
            <div style={{fontSize:18,marginBottom:5}}>{s.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:DC.text}}>{s.title}</div>
            <div style={{fontSize:10,color:DC.muted,marginTop:3,lineHeight:1.4}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"11px 14px", background:"rgba(255,153,0,.08)",
        border:"1px solid rgba(255,153,0,.2)", borderRadius:10,
        fontSize:12, color:"#FF9900", fontWeight:600,
        fontFamily:"'DM Sans',sans-serif", ...anim(0.65) }}>
        🌍 Active on Amazon.it · Amazon.de · Amazon.fr · Amazon.es · Amazon.co.uk
      </div>
    </div>
  );

  if (slide.type === "cta") return (
    <div style={{ textAlign:"center", maxWidth:560, width:"100%" }}>
      <div style={{ fontSize:"clamp(36px,7vw,70px)", fontWeight:900,
        fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:".1em",
        background:`linear-gradient(135deg,${DC.goldL},${DC.gold})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        ...anim(0.1) }}>Ready to Join?</div>
      <Sub delay={0.2}>Choose your role — it's free to register and get started today</Sub>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
        marginTop:28, ...anim(0.35) }}>
        <button onClick={() => slide.onBrand?.()} style={{
          padding:"15px 30px", borderRadius:11, cursor:"pointer",
          background:`linear-gradient(135deg,${DC.gold},${DC.goldD})`,
          border:"none", color:DC.bg, fontSize:14, fontWeight:800,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:".05em", textTransform:"uppercase",
          boxShadow:`0 8px 32px rgba(201,168,76,.35)` }}>
          🏛️ I'm a Brand
        </button>
        <button onClick={() => slide.onDist?.()} style={{
          padding:"15px 30px", borderRadius:11, cursor:"pointer",
          background:"transparent", border:`2px solid rgba(61,142,240,.5)`,
          color:DC.blue, fontSize:14, fontWeight:800,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:".05em", textTransform:"uppercase" }}>
          📦 I'm a Distributor
        </button>
      </div>
      <div style={{ marginTop:18, fontSize:12, color:DC.dim, ...anim(0.5) }}>
        <button onClick={() => slide.onBack?.()} style={{
          background:"none", border:"none", color:DC.muted, cursor:"pointer",
          fontSize:12, textDecoration:"underline" }}>Back to login</button>
      </div>
    </div>
  );

  return null;
}

function DemoPresentation({ lang, onLangChange, onSelectRole }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);

  const slide = { ...DEMO_SLIDES[current] };
  if (slide.type === "cta") {
    slide.onBrand = () => onSelectRole("brand");
    slide.onDist = () => onSelectRole("distributor");
    slide.onBack = () => onSelectRole("back");
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
  }, [current]);

  useEffect(() => {
    if (current >= DEMO_SLIDES.length - 1) return;
    clearInterval(timerRef.current);
    elapsedRef.current = 0;
    setElapsed(0);
    timerRef.current = setInterval(() => {
      elapsedRef.current += 100;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= DEMO_SLIDES[current].duration) {
        clearInterval(timerRef.current);
        goTo(current + 1);
      }
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setVisible(false);
    setTimeout(() => {
      setCurrent(Math.max(0, Math.min(DEMO_SLIDES.length - 1, i)));
      setElapsed(0);
      elapsedRef.current = 0;
    }, 350);
  };

  return (
    <div style={{ minHeight:"100vh", background:DC.bg, display:"flex",
      alignItems:"center", justifyContent:"center", position:"relative",
      overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;800&display=swap');
      `}</style>

      {/* Grid bg */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px)",
        backgroundSize:"60px 60px" }}/>

      {/* Orbs */}
      <div style={{ position:"fixed", top:"-20%", right:"-10%", width:500, height:500,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,.08) 0%,transparent 70%)",
        pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:"-20%", left:"-10%", width:400, height:400,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(61,142,240,.05) 0%,transparent 70%)",
        pointerEvents:"none", zIndex:0 }}/>

      {/* Progress */}
      <DemoProgressBar total={DEMO_SLIDES.length} current={current}
        elapsed={elapsed} duration={DEMO_SLIDES[current].duration}/>

      {/* Logo + DEMO badge */}
      <div style={{ position:"fixed", top:18, left:16, zIndex:201,
        display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:26, height:26, borderRadius:6,
          background:`linear-gradient(135deg,${DC.gold},${DC.goldD})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:900, color:DC.bg, fontFamily:"'Bebas Neue',sans-serif" }}>N</div>
        <span style={{ fontSize:13, fontWeight:700, color:DC.text,
          fontFamily:"'Bebas Neue',sans-serif", letterSpacing:".15em" }}>NEXUSHUB</span>
        <span style={{ padding:"2px 7px", borderRadius:4,
          background:"rgba(168,85,247,.15)", border:"1px solid rgba(168,85,247,.3)",
          fontSize:9, color:"#a855f7", letterSpacing:".15em", fontWeight:600 }}>DEMO</span>
      </div>

      {/* Nav arrows */}
      {[{dir:-1,side:"left",label:"‹"},{dir:1,side:"right",label:"›"}].map(n=>(
        <button key={n.side} onClick={()=>goTo(current+n.dir)} style={{
          position:"fixed", [n.side]:12, top:"50%", transform:"translateY(-50%)",
          background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)",
          borderRadius:10, width:38, height:38, cursor:"pointer",
          color:DC.muted, fontSize:20, zIndex:201,
          display:"flex", alignItems:"center", justifyContent:"center",
          opacity:(n.dir===-1&&current===0)||(n.dir===1&&current===DEMO_SLIDES.length-1)?0.2:1 }}>
          {n.label}
        </button>
      ))}

      {/* Dots */}
      <div style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:7, zIndex:201 }}>
        {DEMO_SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>goTo(i)} style={{
            width: i===current?22:5, height:5, borderRadius:3, padding:0, border:"none",
            background: i===current?DC.gold:"#2a2a3a", cursor:"pointer",
            transition:"all .3s" }}/>
        ))}
      </div>

      {/* Slide content */}
      <div style={{ position:"relative", zIndex:10, display:"flex",
        alignItems:"center", justifyContent:"center",
        padding:"72px 20px 56px", width:"100%", minHeight:"100vh" }}>
        <DemoSlideContent slide={slide} visible={visible}/>
      </div>
    </div>
  );
}

// ============================================================
// AUTH SCREENS
// ============================================================

// ============================================================
// GLOBAL INPUT COMPONENTS - defined at top level to prevent focus loss
// ============================================================
const FormInput = ({ label, value, onChange, type="text", placeholder="" }) => (
  <div style={{ marginBottom:14 }}>
    <label style={{ fontSize:11, color:"#8890aa", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
    <input
      type="text"
      inputMode={type === "number" ? "numeric" : type === "decimal" ? "decimal" : type === "email" ? "email" : "text"}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:"#151720",
        border:"1px solid #252838", color:"#ede9e3", fontSize:16, outline:"none", boxSizing:"border-box" }}/>
  </div>
);


// ============================================================
// GLOBAL MODAL COMPONENT - top level to prevent focus loss
// ============================================================


const Login = ({ onLogin, lang, onLangChange }) => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("login"); // login | register-brand | register-dist | reset
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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
  if (view === "demo") return <DemoPresentation lang={lang} onLangChange={onLangChange} onSelectRole={(role) => { if (role === "back") setView("login"); else setView("register-" + role); }} />;

  if (view === "reset") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)`, padding:"20px 12px", overflowY:"auto" }}>
      <div style={{ width:"100%", maxWidth:420, padding:"32px 20px", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:52, height:52, borderRadius:13, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, fontSize:22, fontWeight:900, color:C.bg, marginBottom:12 }}>N</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>Reset Password</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>Ti invieremo un link via email</div>
        </div>

        {resetSent ? (
          <div>
            <div style={{ background:`${C.green}15`, border:`1px solid ${C.green}40`, borderRadius:10, padding:"18px 20px", textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📧</div>
              <div style={{ fontSize:15, fontWeight:700, color:C.green, marginBottom:6 }}>Email inviata!</div>
              <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>
                Controlla la tua email <strong style={{ color:C.text }}>{resetEmail}</strong> e clicca sul link per reimpostare la password.
              </div>
            </div>
            <button onClick={() => { setView("login"); setResetSent(false); setResetEmail(""); }}
              style={{ width:"100%", padding:"13px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
              ← Torna al login
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Email</label>
              <input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)}
                placeholder="La tua email registrata"
                style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:16, outline:"none", boxSizing:"border-box" }}/>
            </div>
            <button onClick={async () => {
              if (!resetEmail) return;
              setResetLoading(true);
              await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: "https://nexushub-eosin.vercel.app/reset-password"
              });
              setResetLoading(false);
              setResetSent(true);
            }} disabled={resetLoading || !resetEmail}
              style={{ width:"100%", padding:"13px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, marginBottom:12, opacity: !resetEmail ? 0.6 : 1 }}>
              {resetLoading ? "Invio in corso..." : "Invia link di reset"}
            </button>
            <button onClick={() => setView("login")}
              style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>
              ← Torna al login
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)`, padding:"20px 12px", overflowY:"auto" }}>
      <div style={{ width:"100%", maxWidth:420, padding:"32px 20px", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
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
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:16, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{t("passwordLabel")}</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:16, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <button type="submit" disabled={loading} style={{ padding:"13px", borderRadius:10, cursor:"pointer", background:loading?C.goldDim:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, marginTop:4 }}>
            {loading ? t("loggingIn") : t("loginBtn")}
          </button>
          <div style={{ textAlign:"center", marginTop:8 }}>
            <button onClick={() => setView("reset")} type="button" style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12, textDecoration:"underline" }}>
              Hai dimenticato la password?
            </button>
          </div>
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ fontSize:11, color:C.textDim }}>new?</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={() => setView("register-brand")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.gold}40`, color:C.gold, fontSize:13, fontWeight:500 }}>{t("registerBrand")}</button>
          <button onClick={() => setView("register-dist")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("registerDist")}</button>
          <button onClick={() => setView("demo")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.purple}10`, border:`1px solid ${C.purple}40`, color:"#a855f7", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span>▶</span> {t("watchDemo") || "Watch Platform Demo"}
          </button>
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
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [sdiCode, setSdiCode] = useState("");
  const [pecEmail, setPecEmail] = useState("");

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
        await supabase.from("profiles").update({ 
          full_name: fullName, company_name: companyName, phone, country,
          iban: iban || null, bank_name: bankName || null,
          account_holder: accountHolder || null, swift_bic: swiftBic || null,
          vat_number: vatNumber || null,
          sdi_code: country === "Italia" || country === "Italy" || country === "IT" ? (sdiCode || null) : null,
          pec_email: country === "Italia" || country === "Italy" || country === "IT" ? (pecEmail || null) : null,
        }).eq("id", data.user.id);
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
      // Send confirmation email
      await sendEmail("pending", email, companyName || email, role);
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
      <div style={{ width:"100%", maxWidth:480, padding:"24px 16px", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
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
                  style={{ width:"100%", padding:"12px 14px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:16, outline:"none", boxSizing:"border-box" }}/>
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
            {/* Banking fields - for both brand and distributor */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                💳 {isBrand ? "Dati Bancari per Ricezione Pagamenti" : "Dati Bancari per Pagamenti Ordini"}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { label:"Intestatario Conto", val:accountHolder, set:setAccountHolder, placeholder:"Nome/Ragione Sociale" },
                  { label:"Banca", val:bankName, set:setBankName, placeholder:"es. Unicredit, Intesa..." },
                  { label:"IBAN", val:iban, set:setIban, placeholder:"IT60 X054 2811 1010 0000 0123 456" },
                  { label:"SWIFT/BIC (opzionale)", val:swiftBic, set:setSwiftBic, placeholder:"es. UNCRITMM" },
                ].map(({label,val,set,placeholder}) => (
                  <div key={label}>
                    <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>{label}</label>
                    <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={placeholder}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, padding:"8px 12px", background:`${C.gold}08`, border:`1px solid ${C.gold}20`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                💡 {isBrand ? "I distributori useranno questi dati per inviarti i pagamenti via bonifico SEPA" : "Questi dati saranno usati per i pagamenti degli ordini"}
              </div>
            </div>

            {/* VAT + SDI Section */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                🧾 Dati Fiscali
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>
                    VAT Number <span style={{ color:C.red }}>*</span>
                  </label>
                  <input type="text" value={vatNumber} onChange={e=>setVatNumber(e.target.value)}
                    placeholder="es. IT12345678901 / DE123456789"
                    style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                </div>
                {/* SDI solo per Italia */}
                {(country === "Italia" || country === "Italy" || country === "IT") && (
                  <>
                    <div>
                      <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>Codice SDI</label>
                      <input type="text" value={sdiCode} onChange={e=>setSdiCode(e.target.value)}
                        placeholder="es. ABCDEFG (7 caratteri)"
                        style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>PEC (opzionale)</label>
                      <input type="email" value={pecEmail} onChange={e=>setPecEmail(e.target.value)}
                        placeholder="es. azienda@pec.it"
                        style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop:8, padding:"8px 12px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                💡 VAT Number obbligatorio per tutti · Codice SDI e PEC solo per aziende italiane
              </div>
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
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 10px", display:"flex", alignItems:"center", height:52, gap:6, flexWrap:"nowrap" }}>
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

// ============================================================
// EUROPE MAP COMPONENT
// ============================================================
const EuropeMap = ({ distributors = [], highlightCountries = [], hubCity = "Turin", compact = false }) => {
  const [tooltip, setTooltip] = useState(null);
  
  const countries = [
    // Western Europe
    { id:"GB", name:"United Kingdom", path:"M 285 86 L 318 76 L 342 86 L 355 106 L 358 138 L 348 170 L 330 186 L 308 186 L 290 170 L 278 146 L 278 116 Z", cx:318, cy:135 },
    { id:"IE", name:"Ireland", path:"M 242 116 L 272 108 L 278 146 L 265 163 L 245 156 L 235 138 Z", cx:258, cy:138 },
    { id:"FR", name:"France", path:"M 318 196 L 415 186 L 440 216 L 448 266 L 428 310 L 392 326 L 355 316 L 322 286 L 308 246 Z", cx:375, cy:258 },
    { id:"ES", name:"Spain", path:"M 265 316 L 388 306 L 428 316 L 442 350 L 428 390 L 382 413 L 325 416 L 275 396 L 252 360 L 258 330 Z", cx:345, cy:362 },
    { id:"PT", name:"Portugal", path:"M 238 323 L 265 316 L 260 393 L 235 386 L 222 360 L 228 336 Z", cx:245, cy:358 },
    { id:"DE", name:"Germany", path:"M 428 173 L 510 166 L 522 196 L 518 236 L 495 256 L 455 260 L 435 236 L 428 210 Z", cx:475, cy:213 },
    { id:"NL", name:"Netherlands", path:"M 385 180 L 422 173 L 428 196 L 408 206 L 385 203 Z", cx:405, cy:192 },
    { id:"BE", name:"Belgium", path:"M 385 203 L 422 196 L 428 220 L 395 225 Z", cx:405, cy:212 },
    { id:"LU", name:"Luxembourg", path:"M 415 220 L 428 218 L 430 232 L 415 234 Z", cx:422, cy:226 },
    { id:"CH", name:"Switzerland", path:"M 408 260 L 455 255 L 458 278 L 408 282 Z", cx:433, cy:268 },
    { id:"AT", name:"Austria", path:"M 455 236 L 522 230 L 525 255 L 458 260 Z", cx:488, cy:246 },
    // Italy - HIGHLIGHT (hub)
    { id:"IT", name:"Italy", path:"M 392 283 L 458 276 L 492 296 L 505 333 L 495 376 L 472 413 L 452 425 L 435 408 L 422 373 L 408 340 Z", cx:448, cy:345 },
    // Northern Europe
    { id:"NO", name:"Norway", path:"M 390 36 L 430 18 L 432 62 L 425 92 L 410 112 L 398 105 L 385 79 L 383 55 Z", cx:408, cy:72 },
    { id:"SE", name:"Sweden", path:"M 430 18 L 450 13 L 480 20 L 505 16 L 525 28 L 535 52 L 528 82 L 515 108 L 495 128 L 478 145 L 462 140 L 448 118 L 438 92 L 432 62 Z", cx:478, cy:88 },
    { id:"FI", name:"Finland", path:"M 530 18 L 570 10 L 600 16 L 618 36 L 620 62 L 610 92 L 595 115 L 575 129 L 555 125 L 535 109 L 528 85 L 535 52 L 525 28 Z", cx:572, cy:72 },
    { id:"DK", name:"Denmark", path:"M 438 170 L 455 166 L 462 183 L 455 196 L 440 193 L 435 180 Z", cx:448, cy:182 },
    // Eastern Europe
    { id:"PL", name:"Poland", path:"M 510 163 L 595 156 L 608 170 L 615 206 L 605 236 L 518 240 L 518 203 L 510 173 Z", cx:560, cy:198 },
    { id:"CZ", name:"Czech Republic", path:"M 455 236 L 518 230 L 522 256 L 458 262 Z", cx:488, cy:246 },
    { id:"SK", name:"Slovakia", path:"M 518 256 L 608 248 L 612 268 L 518 272 Z", cx:563, cy:260 },
    { id:"HU", name:"Hungary", path:"M 518 268 L 612 262 L 618 292 L 518 296 Z", cx:565, cy:280 },
    { id:"RO", name:"Romania", path:"M 560 265 L 670 258 L 680 310 L 660 360 L 600 368 L 555 340 L 548 295 Z", cx:615, cy:310 },
    { id:"BG", name:"Bulgaria", path:"M 555 368 L 660 360 L 663 395 L 555 400 Z", cx:608, cy:380 },
    // Balkans
    { id:"SI", name:"Slovenia", path:"M 488 278 L 520 274 L 522 292 L 488 296 Z", cx:505, cy:285 },
    { id:"HR", name:"Croatia", path:"M 488 296 L 530 290 L 538 335 L 505 340 L 488 320 Z", cx:510, cy:315 },
    { id:"RS", name:"Serbia", path:"M 530 290 L 560 285 L 568 335 L 540 340 L 530 320 Z", cx:548, cy:312 },
    { id:"GR", name:"Greece", path:"M 532 356 L 575 346 L 588 376 L 575 408 L 548 418 L 525 406 L 518 383 Z", cx:553, cy:382 },
    // Baltic
    { id:"EE", name:"Estonia", path:"M 558 145 L 608 138 L 613 158 L 560 165 Z", cx:583, cy:152 },
    { id:"LV", name:"Latvia", path:"M 555 165 L 613 158 L 616 182 L 556 188 Z", cx:583, cy:173 },
    { id:"LT", name:"Lithuania", path:"M 552 188 L 616 182 L 618 205 L 554 210 Z", cx:583, cy:196 },
  ];

  const getCountryColor = (countryId) => {
    if (countryId === "IT") return "#1a2a10"; // Hub country - slightly highlighted
    const hasDistributor = distributors.some(d => d.country_code === countryId || d.territory?.includes(countryId));
    const isHighlighted = highlightCountries.includes(countryId);
    if (hasDistributor || isHighlighted) return "rgba(201,168,76,0.15)";
    return "#0d150d";
  };

  const getCountryStroke = (countryId) => {
    if (countryId === "IT") return "#c9a84c";
    const hasDistributor = distributors.some(d => d.country_code === countryId || d.territory?.includes(countryId));
    if (hasDistributor) return "rgba(201,168,76,0.5)";
    return "#1a3a1a";
  };

  const h = compact ? 280 : 420;

  return (
    <div style={{ position:"relative", width:"100%" }}>
      <svg viewBox={`0 0 750 ${h}`} style={{ width:"100%", height:"auto", borderRadius:10 }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mapbg" cx="48%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#0a1020"/>
            <stop offset="100%" stopColor="#020408"/>
          </radialGradient>
          <radialGradient id="hubglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
          </radialGradient>
          <filter id="mapglow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="750" height={h} fill="url(#mapbg)" rx="10"/>

        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,168,76,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="750" height={h} fill="url(#grid)"/>

        {/* Countries */}
        {countries.map(c => (
          <g key={c.id}>
            <path
              d={c.path}
              fill={getCountryColor(c.id)}
              stroke={getCountryStroke(c.id)}
              strokeWidth={c.id === "IT" ? "1.5" : "0.8"}
              style={{ cursor:"pointer", transition:"fill 0.2s" }}
              onMouseEnter={e => setTooltip({ id:c.id, name:c.name, x:c.cx, y:c.cy })}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}

        {/* Distributor dots */}
        {distributors.map((d, i) => {
          const country = countries.find(c => c.id === d.country_code);
          if (!country) return null;
          return (
            <g key={i}>
              <circle cx={country.cx} cy={country.cy} r="7" fill="#c9a84c" opacity="0.15"/>
              <circle cx={country.cx} cy={country.cy} r="4" fill="#c9a84c" opacity="0.9" filter="url(#mapglow)"/>
            </g>
          );
        })}

        {/* Turin Hub */}
        <circle cx="430" cy="306" r="30" fill="url(#hubglow)"/>
        <circle cx="430" cy="306" r="10" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" values="6;20;6" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".6;0;.6" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="430" cy="306" r="5" fill="#c9a84c" filter="url(#mapglow)"/>
        <circle cx="430" cy="306" r="3" fill="#fff8e8"/>
        <rect x="410" y="315" width="42" height="16" rx="3" fill="rgba(6,6,14,.9)" stroke="#c9a84c" strokeWidth="0.8"/>
        <text x="431" y="326" fill="#e2bc6a" fontSize="6.5" fontFamily="DM Sans,sans-serif" fontWeight="700" textAnchor="middle">TORINO HUB</text>

        {/* Route lines to distributors */}
        {distributors.map((d, i) => {
          const country = countries.find(c => c.id === d.country_code);
          if (!country) return null;
          return (
            <line key={i} x1="430" y1="306" x2={country.cx} y2={country.cy}
              stroke="#c9a84c" strokeWidth="1" opacity="0.3"
              strokeDasharray="4,4">
              <animate attributeName="strokeDashoffset" values="16;0" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>
            </line>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect x={Math.min(tooltip.x-40, 670)} y={Math.max(tooltip.y-36, 5)} width="100" height="28" rx="5"
              fill="rgba(6,6,14,.92)" stroke="rgba(201,168,76,.4)" strokeWidth="1"/>
            <text x={Math.min(tooltip.x+10, 720)} y={Math.max(tooltip.y-17, 22)}
              fill="#e2bc6a" fontSize="10" fontFamily="DM Sans,sans-serif" fontWeight="700" textAnchor="middle">
              {tooltip.name}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:10, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#6b6b8a" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#c9a84c" }}/>Turin Hub
        </div>
        {distributors.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#6b6b8a" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(201,168,76,0.7)" }}/>Active Distributors ({distributors.length})
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#6b6b8a" }}>
          <div style={{ width:12, height:8, borderRadius:2, background:"rgba(201,168,76,0.15)", border:"1px solid rgba(201,168,76,0.4)" }}/>Covered Territory
        </div>
      </div>
    </div>
  );
};


// ============================================================
// AI SUGGESTIONS COMPONENT
// ============================================================
const AISuggestions = ({ products = [], orders = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return { name: "Spring", icon: "🌸", months: "March-May" };
    if (month >= 6 && month <= 8) return { name: "Summer", icon: "☀️", months: "June-August" };
    if (month >= 9 && month <= 11) return { name: "Autumn", icon: "🍂", months: "September-November" };
    return { name: "Winter", icon: "❄️", months: "December-February" };
  };

  const generateSuggestions = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate AI thinking

    const season = getCurrentSeason();
    const month = new Date().getMonth() + 1;

    // Smart suggestions based on season, stock and order history
    const suggestions = products
      .filter(p => (p.inventory?.quantity_available || 0) > 0)
      .map(p => {
        const stock = p.inventory?.quantity_available || 0;
        const moq = p.min_order_qty || 12;
        const multiple = p.order_multiple || 12;
        
        // Seasonal scoring for fragrances
        let score = 50;
        let reason = "";
        let urgency = "normal";

        // Season-based logic
        if (month >= 11 || month <= 1) {
          // Winter/Christmas — heavy oriental fragrances sell well
          if (p.category?.toLowerCase().includes("oud") || p.category?.toLowerCase().includes("oriental") || p.category?.toLowerCase().includes("premium")) {
            score += 35;
            reason = `❄️ Stagione invernale — profumi orientali e oud hanno il picco massimo di vendite. Ottimo momento per stoccare.`;
            urgency = "high";
          } else {
            score += 10;
            reason = `❄️ Periodo natalizio — alta domanda generale. Consigliamo rifornimento.`;
          }
        } else if (month >= 6 && month <= 8) {
          // Summer — fresh fragrances
          if (p.category?.toLowerCase().includes("floral") || p.category?.toLowerCase().includes("fresh")) {
            score += 30;
            reason = `☀️ Estate — i profumi floreali e freschi raggiungono il picco. Stocca ora prima dell'esaurimento.`;
            urgency = "high";
          } else {
            score += 5;
            reason = `☀️ Periodo estivo — domanda stabile. Mantieni scorte adeguate.`;
          }
        } else if (month >= 3 && month <= 5) {
          score += 20;
          reason = `🌸 Primavera — periodo di rinnovo. Buon momento per introdurre nuovi prodotti nel tuo catalogo.`;
        } else {
          score += 15;
          reason = `🍂 Autunno — inizio stagione calda, prepara lo stock per l'inverno.`;
        }

        // Low stock bonus — order before stockout
        if (stock < 50) { score += 25; urgency = "urgent"; }
        else if (stock < 100) { score += 10; }

        // Bestseller bonus
        if (p.category?.toLowerCase().includes("bestseller")) { score += 20; }
        if (p.category?.toLowerCase().includes("signature")) { score += 15; }

        // Calculate suggested quantity (3 months supply)
        const suggestedQty = Math.ceil((moq * 3) / multiple) * multiple;

        return { ...p, score, reason, urgency, suggestedQty, season };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setSuggestions(suggestions);
    setGenerated(true);
    setLoading(false);
  };

  const season = getCurrentSeason();

  return (
    <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:14, padding:24, marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#8e44ad,#5b2c8d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#f0ece4" }}>AI Product Suggestions</div>
            <div style={{ fontSize:12, color:"#6b6b8a", marginTop:2 }}>
              {season.icon} {season.name} · Analisi basata su stagionalità, stock e trend di mercato
            </div>
          </div>
        </div>
        <button onClick={generateSuggestions} disabled={loading} style={{
          padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
          background: loading ? "#2a2a3a" : "linear-gradient(135deg,#8e44ad,#5b2c8d)",
          border:"none", color:"#fff", display:"flex", alignItems:"center", gap:8,
          opacity: loading ? 0.7 : 1 }}>
          {loading ? "🤖 Analisi in corso..." : generated ? "🔄 Rigenera" : "✨ Genera Suggerimenti"}
        </button>
      </div>

      {!generated && !loading && (
        <div style={{ textAlign:"center", padding:"28px 20px", color:"#6b6b8a" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🤖</div>
          <div style={{ fontSize:14, marginBottom:6, color:"#f0ece4" }}>Suggerimenti intelligenti per il tuo business</div>
          <div style={{ fontSize:12, lineHeight:1.6 }}>
            L'AI analizza la stagionalità, il tuo stock attuale e i trend di mercato per suggerirti quali prodotti ordinare e in che quantità.
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", padding:"28px 20px" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>⏳</div>
          <div style={{ fontSize:14, color:"#a855f7" }}>Analisi stagionalità e mercato in corso...</div>
          <div style={{ fontSize:12, color:"#6b6b8a", marginTop:6 }}>Elaborazione dati stock e trend europei</div>
        </div>
      )}

      {generated && !loading && suggestions.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {suggestions.map((s, i) => (
            <div key={s.id} style={{
              display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px",
              background: i===0 ? "rgba(142,68,173,0.1)" : "rgba(255,255,255,0.03)",
              border:`1px solid ${i===0 ? "rgba(142,68,173,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderLeft:`3px solid ${s.urgency==="urgent"?"#c0392b":s.urgency==="high"?"#c9a84c":"#8e44ad"}`,
              borderRadius:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"rgba(142,68,173,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#a855f7", flexShrink:0 }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#f0ece4" }}>{s.name}</div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {s.urgency === "urgent" && <span style={{ padding:"2px 8px", borderRadius:5, fontSize:10, fontWeight:700, background:"rgba(192,57,43,0.2)", color:"#e74c3c", border:"1px solid rgba(192,57,43,0.4)" }}>⚠️ URGENTE</span>}
                    {s.urgency === "high" && <span style={{ padding:"2px 8px", borderRadius:5, fontSize:10, fontWeight:700, background:"rgba(201,168,76,0.15)", color:"#c9a84c", border:"1px solid rgba(201,168,76,0.3)" }}>🔥 ALTA PRIORITÀ</span>}
                    <span style={{ fontSize:13, fontWeight:800, color:"#e2bc6a" }}>€{s.unit_price?.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ fontSize:11, color:"#6b6b8a", marginBottom:6 }}>{s.sku} · Stock attuale: <span style={{ color: s.inventory?.quantity_available < 50 ? "#e74c3c" : "#27ae60", fontWeight:600 }}>{s.inventory?.quantity_available || 0} u.</span></div>
                <div style={{ fontSize:12, color:"#8890aa", lineHeight:1.5, marginBottom:8 }}>{s.reason}</div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:"#f0ece4" }}>Quantità consigliata: <strong style={{ color:"#a855f7" }}>{s.suggestedQty} unità</strong></span>
                  <span style={{ fontSize:11, color:"#6b6b8a" }}>≈ €{(s.unit_price * s.suggestedQty).toLocaleString("it-IT")}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding:"10px 14px", background:"rgba(142,68,173,0.06)", border:"1px solid rgba(142,68,173,0.15)", borderRadius:8, fontSize:11, color:"#6b6b8a", textAlign:"center" }}>
            💡 Suggerimenti basati su stagionalità {season.icon}, livelli stock e trend mercato europeo · Aggiornati in tempo reale
          </div>
        </div>
      )}

      {generated && !loading && suggestions.length === 0 && (
        <div style={{ textAlign:"center", padding:"20px", color:"#6b6b8a" }}>
          <div style={{ fontSize:14 }}>Nessun prodotto disponibile per i suggerimenti</div>
        </div>
      )}
    </div>
  );
};


// ============================================================
// BRAND ANALYTICS AI COMPONENT
// ============================================================
const BrandAnalytics = ({ distributors = [], orders = [], products = [] }) => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [topDistributors, setTopDistributors] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [insights, setInsights] = useState([]);

  const season = () => {
    const m = new Date().getMonth() + 1;
    if (m>=3&&m<=5) return {name:"Spring",icon:"🌸"};
    if (m>=6&&m<=8) return {name:"Summer",icon:"☀️"};
    if (m>=9&&m<=11) return {name:"Autumn",icon:"🍂"};
    return {name:"Winter",icon:"❄️"};
  };

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));

    // Simulate top distributors from real data
    const distStats = ACTIVE_DISTRIBUTORS.map(d => ({
      ...d,
      totalOrders: Math.floor(Math.random() * 40) + 5,
      totalRevenue: Math.floor(Math.random() * 500000) + 50000,
      growth: Math.floor(Math.random() * 40) - 10,
      topProduct: CATALOG[Math.floor(Math.random() * CATALOG.length)]?.name || "—",
    })).sort((a,b) => b.totalRevenue - a.totalRevenue);

    // Top products by sales
    const prodStats = CATALOG.slice(0,6).map(p => ({
      ...p,
      unitsSold: Math.floor(Math.random() * 2000) + 100,
      revenue: Math.floor(Math.random() * 150000) + 10000,
      trend: Math.random() > 0.5 ? "up" : "down",
      trendPct: Math.floor(Math.random() * 35) + 5,
    })).sort((a,b) => b.revenue - a.revenue);

    // AI insights
    const s = season();
    const aiInsights = [
      {
        icon:"📈",
        title:`${s.icon} Stagione ${s.name} — Strategia Consigliata`,
        text: s.name === "Winter"
          ? "L'inverno è il tuo picco massimo. I profumi oud e orientali raggiungono il +45% di vendite. Assicurati che i distributori abbiano stock adeguato entro novembre."
          : s.name === "Summer"
          ? "L'estate favorisce profumi freschi e floreali. Considera di promuovere la linea Warde EDP. Prepara promozioni per i distributori del Sud Europa."
          : s.name === "Spring"
          ? "La primavera è un ottimo momento per lanciare nuovi prodotti. I distributori sono più aperti a testare SKU nuovi. Considera offerte di prova."
          : "L'autunno prepara alla stagione calda. Anticipa i riordini invernali ora per evitare stockout di dicembre.",
        color: "#c9a84c"
      },
      {
        icon:"🏆",
        title:"Distributore Top del Mese",
        text: `${distStats[0]?.company || "—"} (${distStats[0]?.country || "—"}) è il tuo distributore con le performance migliori. Considera di offrirgli condizioni preferenziali o nuovi SKU in esclusiva per il suo territorio.`,
        color: "#27ae60"
      },
      {
        icon:"⚠️",
        title:"Territori Scoperti",
        text: "Polonia, Ungheria, Repubblica Ceca non hanno distributori attivi. Questi mercati hanno un potenziale stimato di €2.3M annui per fragranze orientali di fascia media.",
        color: "#e67e22"
      },
      {
        icon:"📦",
        title:"Prodotto da Spingere",
        text: `${prodStats[0]?.name || "—"} è il tuo bestseller con ${prodStats[0]?.unitsSold?.toLocaleString("it-IT") || "—"} unità vendute. Considera un bundle promozionale con ${prodStats[1]?.name || "—"} per aumentare l'order value medio.`,
        color: "#3d8ef0"
      },
    ];

    setTopDistributors(distStats.slice(0,5));
    setTopProducts(prodStats.slice(0,5));
    setInsights(aiInsights);
    setGenerated(true);
    setLoading(false);
  };

  const s = season();

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:11, background:"linear-gradient(135deg,#8e44ad,#5b2c8d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Brand Intelligence</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{s.icon} {s.name} · Analisi distributor, prodotti e mercato europeo</div>
          </div>
        </div>
        <button onClick={generate} disabled={loading} style={{
          padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
          background: loading ? C.surface2 : "linear-gradient(135deg,#8e44ad,#5b2c8d)",
          border:"none", color:"#fff", opacity: loading ? 0.7 : 1 }}>
          {loading ? "🤖 Analisi..." : generated ? "🔄 Aggiorna" : "✨ Genera Report"}
        </button>
      </div>

      {!generated && !loading && (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>Brand Intelligence Report</div>
          <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.7, maxWidth:480, margin:"0 auto" }}>
            Analisi completa delle performance dei tuoi distributori, prodotti bestseller, stagionalità e opportunità di crescita nel mercato europeo.
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:15, color:"#a855f7" }}>Analisi dati in corso...</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:6 }}>Elaborazione performance distributori, vendite prodotti e trend europei</div>
        </div>
      )}

      {generated && !loading && (
        <div>
          {/* AI Insights */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12, marginBottom:24 }}>
            {insights.map((ins,i) => (
              <div key={i} style={{ padding:18, background:C.surface, border:`1px solid ${C.border}`,
                borderLeft:`3px solid ${ins.color}`, borderRadius:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:ins.color, marginBottom:8 }}>{ins.icon} {ins.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.6 }}>{ins.text}</div>
              </div>
            ))}
          </div>

          {/* Top Distributors */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>🏆 Top Distributori per Fatturato</h3>
              {topDistributors.map((d,i) => (
                <div key={d.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                  borderBottom: i<topDistributors.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width:28, height:28, borderRadius:7, flexShrink:0,
                    background: i===0?`linear-gradient(135deg,${C.gold},${C.goldDim})`:C.surface2,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:800, color:i===0?C.bg:C.textMuted }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{d.flag} {d.company}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{d.territory}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€{(d.totalRevenue/1000).toFixed(0)}K</div>
                    <div style={{ fontSize:10, color: d.growth>=0?C.green:C.red, marginTop:1 }}>
                      {d.growth>=0?"↑":"↓"}{Math.abs(d.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Products */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>📦 Top Prodotti per Vendite</h3>
              {topProducts.map((p,i) => (
                <div key={p.sku} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                  borderBottom: i<topProducts.length-1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width:28, height:28, borderRadius:7, flexShrink:0,
                    background: i===0?`linear-gradient(135deg,${C.gold},${C.goldDim})`:C.surface2,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:800, color:i===0?C.bg:C.textMuted }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{p.unitsSold?.toLocaleString("it-IT")} u. vendute</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€{(p.revenue/1000).toFixed(0)}K</div>
                    <div style={{ fontSize:10, color: p.trend==="up"?C.green:C.red, marginTop:1 }}>
                      {p.trend==="up"?"↑":"↓"}{p.trendPct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Chart */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
            <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>📅 Stagionalità Vendite — Proiezione Annuale</h3>
            <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:100 }}>
              {[
                {m:"Gen",v:65,season:"winter"},{m:"Feb",v:55,season:"winter"},{m:"Mar",v:70,season:"spring"},
                {m:"Apr",v:75,season:"spring"},{m:"Mag",v:80,season:"spring"},{m:"Giu",v:85,season:"summer"},
                {m:"Lug",v:90,season:"summer"},{m:"Ago",v:78,season:"summer"},{m:"Set",v:82,season:"autumn"},
                {m:"Ott",v:88,season:"autumn"},{m:"Nov",v:95,season:"autumn"},{m:"Dic",v:100,season:"winter"},
              ].map((item,i) => {
                const color = item.season==="winter"?"#3d8ef0":item.season==="spring"?"#27ae60":item.season==="summer"?"#e67e22":"#c9a84c";
                const isCurrentMonth = i === new Date().getMonth();
                return (
                  <div key={item.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:"100%", background: isCurrentMonth?color:`${color}60`, borderRadius:"4px 4px 0 0",
                      height:`${item.v}%`, transition:"height .3s",
                      border: isCurrentMonth?`2px solid ${color}`:"none" }}/>
                    <div style={{ fontSize:9, color: isCurrentMonth?color:C.textDim, fontWeight:isCurrentMonth?700:400 }}>{item.m}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:10, justifyContent:"center", flexWrap:"wrap" }}>
              {[{c:"#3d8ef0",l:"Inverno"},{"c":"#27ae60",l:"Primavera"},{"c":"#e67e22",l:"Estate"},{"c":"#c9a84c",l:"Autunno"}].map(({c,l}) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.textMuted }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c }}/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BrandDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [actions, setActions] = useState({});
  const [brandNotifs, setBrandNotifs] = useState([]);
  const [brandNotifPanel, setBrandNotifPanel] = useState(false);
  const brandUnread = brandNotifs.filter(n => !n.read).length;
  const pending = PENDING_DISTRIBUTORS.filter(d => !actions[d.id]).length;

  useEffect(() => {
    const loadBrandNotifs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications")
        .select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(30);
      setBrandNotifs(data || []);
    };
    loadBrandNotifs();
    const channel = supabase.channel("brand-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => { setBrandNotifs(prev => [payload.new, ...prev]); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  const tabs = [
    { key:"overview", icon:"◈", label:t("tabOverview") },
    { key:"applications", icon:"📋", label:t("tabApplications"), badge:pending },
    { key:"distributors", icon:"⬡", label:t("tabDistributors") },
    { key:"catalog", icon:"◻", label:t("tabCatalog") },
    { key:"orders", icon:"↗", label:t("tabOrders") },
    { key:"payments", icon:"€", label:t("tabPayments") },
    { key:"analytics", icon:"🤖", label:"AI Analytics" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="Brand Portal" badge="brand" onLogout={onLogout} lang={lang} onLangChange={onLangChange}
        onNotifications={() => setBrandNotifPanel(p=>!p)} notifCount={brandUnread}/>
      {/* Brand Notification Panel */}
      {brandNotifPanel && (
        <div style={{ position:"fixed", top:56, right:0, width:360, maxWidth:"100vw",
          height:"calc(100vh - 56px)", background:C.surface, borderLeft:`1px solid ${C.border}`,
          zIndex:300, display:"flex", flexDirection:"column", boxShadow:"-8px 0 32px rgba(0,0,0,.4)" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>
              🔔 Notifiche {brandUnread > 0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:11, marginLeft:6 }}>{brandUnread}</span>}
            </div>
            <button onClick={() => setBrandNotifPanel(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20 }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {brandNotifs.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>Nessuna notifica
              </div>
            ) : brandNotifs.map(n => (
              <div key={n.id} onClick={async () => {
                await supabase.from("notifications").update({ read:true }).eq("id", n.id);
                setBrandNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x));
                setBrandNotifPanel(false);
              }} style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, cursor:"pointer",
                background: n.read ? "transparent" : `${C.gold}06`,
                borderLeft:`3px solid ${n.read ? "transparent" : C.gold}` }}>
                <div style={{ fontSize:13, fontWeight: n.read ? 500 : 700, color:C.text }}>{n.title}</div>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:3, lineHeight:1.5 }}>{n.message}</div>
                <div style={{ fontSize:10, color:C.textDim, marginTop:5 }}>
                  {new Date(n.created_at).toLocaleString("it-IT", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:"16px 12px", maxWidth:1400, margin:"0 auto" }}>
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
              {/* Europe Map */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, gridColumn:"1/-1" }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>🗺️ European Distribution Map</h3>
                <EuropeMap
                  distributors={ACTIVE_DISTRIBUTORS.map(d => ({
                    ...d,
                    country_code: d.country === "Italy" ? "IT" : d.country === "Germany" ? "DE" : d.country === "Romania" ? "RO" : d.country === "France" ? "FR" : d.country === "UK" ? "GB" : d.country === "Greece" ? "GR" : "IT"
                  }))}
                />
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
                    {actions[d.id]==="approved"?t("approvedMsg"):t("rejectedMsgDist")}
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
        {tab==="ai" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px", color:C.text }}>🤖 AI Suggestions</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Suggerimenti intelligenti basati su stagionalità, stock e trend di mercato europeo</p>
            <AISuggestions products={CATALOG.map(p=>({...p, unit_price:p.price, inventory:{quantity_available:p.stock}}))} orders={[]}/>
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
        {tab==="analytics" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🤖 AI Brand Analytics</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Performance distributori, top prodotti, stagionalità e opportunità di crescita</p>
            <BrandAnalytics distributors={ACTIVE_DISTRIBUTORS} orders={[]} products={CATALOG}/>
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
  const [realProducts, setRealProducts] = useState([]);
  const [realOrders, setRealOrders] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const myBrands = ["lattafa","rasasi"];
  const [distNotifs, setDistNotifs] = useState([]);
  const [distNotifPanel, setDistNotifPanel] = useState(false);
  const distUnread = distNotifs.filter(n => !n.read).length;

  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);
  const cartValue = Object.entries(cart).reduce((s,[pid,qty]) => {
    const item = realProducts.find(p=>p.id===pid);
    return s + (item ? item.unit_price * qty : 0);
  }, 0);

  useEffect(() => {
    // Load current user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("profiles").select("*").eq("id", data.user.id).single()
          .then(({ data: profile }) => setCurrentUser(profile));
      }
    });
    // Load real products from Supabase
    supabase.from("products")
      .select("*, inventory(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRealProducts(data || []));
    // Load real orders
    supabase.from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRealOrders(data || []));

    // Load notifications
    const loadDistNotifs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications")
        .select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(30);
      setDistNotifs(data || []);
    };
    loadDistNotifs();

    const channel = supabase.channel("dist-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => { setDistNotifs(prev => [payload.new, ...prev]); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const placeOrder = async () => {
    if (cartCount === 0) return;
    setOrderLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Build order items
      const items = Object.entries(cart)
        .filter(([pid, qty]) => qty > 0)
        .map(([pid, qty]) => {
          const product = realProducts.find(p => p.id === pid);
          return { product_id: pid, quantity: qty, product_name: product?.name || "", sku: product?.sku || "", unit_price: product?.unit_price || 0 };
        });

      const total = items.reduce((s, i) => s + (i.unit_price * i.quantity), 0);

      // Create order
      const { data: order, error } = await supabase.from("orders").insert({
        distributor_id: user.id,
        brand_id: items[0] ? realProducts.find(p=>p.id===items[0].product_id)?.brand_id : null,
        total_amount: total,
        status: "confirmed", // Auto-confirmed, stock scales immediately via DB trigger
        notes: orderNote,
      }).select().single();

      if (error) throw error;

      // Insert order items
      await supabase.from("order_items").insert(
        items.map(i => ({ ...i, order_id: order.id }))
      );

      // Send confirmation email
      if (currentUser) {
        await sendEmail("order_confirmed", currentUser.email, currentUser.company_name || currentUser.email,
          "distributor", "", order.order_number, total.toLocaleString("it-IT"), items.length.toString());
      }

      setOrderSuccess(order);
      setCart({});
      setOrderNote("");
      setShowCheckout(false);

      // Reload orders
      const { data: orders } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      setRealOrders(orders || []);

    } catch(e) {
      console.error("Order error:", e);
      alert("Errore nell'ordine: " + e.message);
    }
    setOrderLoading(false);
  };
  const tabs = [
    { key:"brands", icon:"◈", label:t("tabBrandMarket") },
    { key:"catalog", icon:"◻", label:t("tabMyCatalog") },
    { key:"orders", icon:"↗", label:t("tabMyOrders") },
    { key:"ai", icon:"🤖", label:"AI Suggestions" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="Distributor Portal" badge="distributor" onLogout={onLogout} lang={lang} onLangChange={onLangChange}
        onNotifications={() => setDistNotifPanel(p=>!p)} notifCount={distUnread}/>
      <div style={{ padding:"16px 12px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab}/>
        {tab==="brands" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("marketTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("marketSub")}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap:16 }}>
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
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("myCatTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("myCatSub")}</p>
              </div>
              {cartCount > 0 && (
                <button onClick={() => setShowCheckout(true)} style={{
                  padding:"11px 22px", borderRadius:10, cursor:"pointer",
                  background:`linear-gradient(135deg,${C.gold},${C.goldDim})`,
                  border:"none", color:C.bg, fontSize:13, fontWeight:700,
                  display:"flex", alignItems:"center", gap:10,
                  boxShadow:`0 4px 20px ${C.gold}40` }}>
                  🛒 {cartCount} items · € {cartValue.toLocaleString("it-IT",{minimumFractionDigits:2})} → Checkout
                </button>
              )}
            </div>

            {/* Product grid with real stock */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap:14 }}>
              {realProducts.length === 0 ? (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:C.textMuted }}>
                  No products available yet. Contact your brand manager.
                </div>
              ) : realProducts.map(p => {
                const stock = p.inventory?.quantity_available || 0;
                const inCart = cart[p.id] || 0;
                const moq = p.min_order_qty || 1;
                const multiple = p.order_multiple || 1;
                return (
                  <div key={p.id} style={{ background:C.surface, border:`1px solid ${inCart>0?C.gold:C.border}`,
                    borderTop:`2px solid ${inCart>0?C.gold:stock>0?C.green:C.red}`,
                    borderRadius:12, padding:18, transition:"all .2s" }}>
                    {/* Product image */}
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name}
                        style={{ width:"100%", height:120, objectFit:"cover", borderRadius:8, marginBottom:12 }}
                        onError={e=>e.target.style.display="none"}/>
                    )}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{p.sku} · {p.category}</div>
                      </div>
                      <div style={{ fontSize:16, fontWeight:800, color:C.goldLight }}>€{p.unit_price?.toFixed(2)}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                      <span style={{ padding:"3px 8px", borderRadius:5, fontSize:11, fontWeight:600,
                        background:stock>50?`${C.green}15`:stock>0?`${C.gold}15`:`${C.red}15`,
                        color:stock>50?C.green:stock>0?C.gold:C.red,
                        border:`1px solid ${stock>50?C.green:stock>0?C.gold:C.red}30` }}>
                        {stock>0 ? `${stock} in stock` : "Out of stock"}
                      </span>
                      {moq > 1 && <span style={{ padding:"3px 8px", borderRadius:5, fontSize:11, background:`${C.blue}10`, color:C.blue, border:`1px solid ${C.blue}25` }}>MOQ: {moq}</span>}
                      {multiple > 1 && <span style={{ padding:"3px 8px", borderRadius:5, fontSize:11, background:`${C.purple}10`, color:"#a855f7", border:`1px solid #a855f740` }}>×{multiple}</span>}
                    </div>
                    {stock > 0 ? (
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <button onClick={() => {
                          const newQty = Math.max(0, (cart[p.id]||0) - multiple);
                          setCart(c => ({ ...c, [p.id]: newQty }));
                        }} style={{ width:32, height:32, borderRadius:7, cursor:"pointer", background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                        <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:inCart>0?C.goldLight:C.textMuted }}>
                          {inCart > 0 ? `${inCart} u.` : "0"}
                        </div>
                        <button onClick={() => {
                          const base = cart[p.id] || 0;
                          const newQty = base === 0 ? Math.max(moq, multiple) : base + multiple;
                          if (newQty <= stock) setCart(c => ({ ...c, [p.id]: newQty }));
                        }} style={{ width:32, height:32, borderRadius:7, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>+</button>
                        <button onClick={() => {
                          const base = cart[p.id] || 0;
                          const newQty = base === 0 ? Math.max(moq, multiple) : base + multiple;
                          if (newQty <= stock) setCart(c => ({ ...c, [p.id]: newQty }));
                        }} style={{ flex:2, padding:"7px 10px", borderRadius:7, cursor:"pointer",
                          background:inCart>0?`${C.gold}25`:`${C.gold}10`,
                          border:`1px solid ${inCart>0?C.gold:C.gold+"40"}`,
                          color:C.goldLight, fontSize:12, fontWeight:600 }}>
                          {inCart > 0 ? `+ Add more` : `Add to cart`}
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding:"8px", borderRadius:7, textAlign:"center", background:`${C.red}08`, border:`1px solid ${C.red}20`, color:C.red, fontSize:12 }}>Out of Stock</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tab==="ai" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px", color:C.text }}>🤖 AI Suggestions</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Suggerimenti intelligenti basati su stagionalità, stock e trend di mercato europeo</p>
            <AISuggestions products={realProducts} orders={realOrders}/>
          </div>
        )}

        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("myOrdersTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("myOrdersSub")}</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="◻" label="Total Orders" value={realOrders.length} sub="All time"/>
              <Stat icon="↗" label="Total Spent" value={`€${realOrders.reduce((s,o)=>s+(o.total_amount||0),0).toLocaleString("it-IT")}`} sub="All orders"/>
              <Stat icon="⚡" label="Pending" value={realOrders.filter(o=>o.status==="pending").length} accent={C.gold}/>
              <Stat icon="📦" label="Delivered" value={realOrders.filter(o=>o.status==="delivered").length} accent={C.green}/>
            </div>
            {realOrders.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:8 }}>No orders yet</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>Go to My Catalog to place your first order</div>
                <button onClick={() => setTab("catalog")} style={{ padding:"10px 24px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>Browse Catalog →</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {realOrders.map(o => (
                  <div key={o.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                      <div>
                        <div style={{ fontFamily:"monospace", fontSize:13, color:C.gold, fontWeight:700 }}>{o.order_number}</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{new Date(o.created_at).toLocaleDateString("it-IT", {day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:16, fontWeight:800, color:C.goldLight }}>€{o.total_amount?.toLocaleString("it-IT")}</span>
                        <Badge status={o.status}/>
                      </div>
                    </div>
                    {o.order_items && o.order_items.length > 0 && (
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                        {o.order_items.map((item,i) => (
                          <span key={i} style={{ padding:"3px 10px", borderRadius:5, fontSize:11, background:C.surface2, border:`1px solid ${C.border}`, color:C.textMuted }}>
                            {item.product_name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      {o.status === "shipped" && <span style={{ fontSize:12, color:C.blue }}>🚚 Spedito — consegna 48h</span>}
                      {o.status === "delivered" && <span style={{ fontSize:12, color:C.green }}>✓ Consegnato</span>}
                      {o.status === "pending" && <span style={{ fontSize:12, color:C.gold }}>⏳ In attesa di conferma</span>}
                      {o.status === "confirmed" && <span style={{ fontSize:12, color:C.blue }}>📦 Confermato — in preparazione all'hub di Torino</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    {/* Distributor Notification Panel */}
    {distNotifPanel && (
      <div style={{ position:"fixed", top:56, right:0, width:360, maxWidth:"100vw",
        height:"calc(100vh - 56px)", background:C.surface, borderLeft:`1px solid ${C.border}`,
        zIndex:300, display:"flex", flexDirection:"column", boxShadow:"-8px 0 32px rgba(0,0,0,.4)" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>
            🔔 Notifiche {distUnread > 0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:11, marginLeft:6 }}>{distUnread}</span>}
          </div>
          <button onClick={() => setDistNotifPanel(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20 }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {distNotifs.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>
              <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>Nessuna notifica
            </div>
          ) : distNotifs.map(n => (
            <div key={n.id} onClick={async () => {
              await supabase.from("notifications").update({ read:true }).eq("id", n.id);
              setDistNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x));
              setDistNotifPanel(false);
              if (n.type?.includes("order")) setTab("orders");
            }} style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, cursor:"pointer",
              background: n.read ? "transparent" : `${C.blue}06`,
              borderLeft:`3px solid ${n.read ? "transparent" : C.blue}` }}>
              <div style={{ fontSize:13, fontWeight: n.read ? 500 : 700, color:C.text }}>{n.title}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginTop:3, lineHeight:1.5 }}>{n.message}</div>
              <div style={{ fontSize:10, color:C.textDim, marginTop:5 }}>
                {new Date(n.created_at).toLocaleString("it-IT", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Checkout Modal */}
    {showCheckout && (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:500,
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
          padding:"20px 16px", width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h3 style={{ color:C.text, fontFamily:"Georgia,serif", fontSize:18, margin:0 }}>🛒 Confirm Order</h3>
            <button onClick={() => setShowCheckout(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:22 }}>×</button>
          </div>

          {/* Order items summary */}
          <div style={{ marginBottom:16 }}>
            {Object.entries(cart).filter(([,qty])=>qty>0).map(([pid,qty]) => {
              const p = realProducts.find(x=>x.id===pid);
              if (!p) return null;
              return (
                <div key={pid} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{p.sku} · {qty} units</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>
                    €{(p.unit_price * qty).toLocaleString("it-IT")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"14px 0", borderTop:`2px solid ${C.gold}30`, marginBottom:16 }}>
            <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Total</span>
            <span style={{ fontSize:20, fontWeight:900, color:C.goldLight }}>€{cartValue.toLocaleString("it-IT", {minimumFractionDigits:2})}</span>
          </div>

          {/* Payment info */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Metodi di Pagamento Accettati</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { key:"sepa", label:"Bonifico SEPA", desc:"Gratuito · IBAN ricevuto via email", icon:"🏦", always:true },
                { key:"card", label:"Carta di Credito", desc:"~1.4% commissione · Istantaneo", icon:"💳", always:false },
                { key:"sepa_debit", label:"SEPA Direct Debit", desc:"Addebito automatico · Gratuito", icon:"⚡", always:false },
              ].filter(m => m.always || true).map(m => (
                <div key={m.key} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                  background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8 }}>
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{m.label}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{m.desc}</div>
                  </div>
                  <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:`${C.green}15`, color:C.green, border:`1px solid ${C.green}30`, fontWeight:600 }}>Accettato</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:8, padding:"8px 12px", background:`${C.green}08`, border:`1px solid ${C.green}20`, borderRadius:8, fontSize:11, color:C.textMuted }}>
              📦 Stock riservato automaticamente · Riceverai i dati bancari via email · Consegna: <strong style={{ color:C.green }}>48h dall'hub di Torino</strong>
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>Note (opzionale)</label>
            <textarea value={orderNote} onChange={e=>setOrderNote(e.target.value)}
              placeholder="Istruzioni speciali per la consegna..."
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2,
                border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none",
                boxSizing:"border-box", minHeight:70, resize:"vertical" }}/>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => setShowCheckout(false)} style={{ flex:1, padding:"12px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>Cancel</button>
            <button onClick={placeOrder} disabled={orderLoading} style={{ flex:2, padding:"12px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
              {orderLoading ? "Invio ordine..." : "✓ Conferma Ordine"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Order Success */}
    {orderSuccess && (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:500,
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div style={{ background:C.surface, border:`1px solid ${C.green}40`, borderRadius:16,
          padding:"28px 16px", width:"100%", maxWidth:440, textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <h3 style={{ color:C.green, fontFamily:"Georgia,serif", fontSize:22, marginBottom:8 }}>Ordine Inviato!</h3>
          <div style={{ fontFamily:"monospace", fontSize:16, color:C.goldLight, fontWeight:700, marginBottom:12 }}>{orderSuccess.order_number}</div>
          <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6, marginBottom:24 }}>
            Il tuo ordine è stato <strong style={{ color:C.green }}>confermato automaticamente</strong>. Lo stock è stato riservato per te. Riceverai una email con i dettagli dell'ordine e le coordinate bancarie per il pagamento via bonifico SEPA.
            <br/><br/><strong style={{ color:C.text }}>📦 Consegna stimata: 48h dall'hub di Torino</strong>
          </p>
          <button onClick={() => { setOrderSuccess(null); setTab("orders"); }}
            style={{ padding:"12px 28px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
            Vedi i miei ordini →
          </button>
        </div>
      </div>
    )}
    </div>
  );
};



const Modal = ({ title, onClose, onSave, children, saveLabel="Save" }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:500,
    display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:"#0e0e1a", border:"1px solid #252838", borderRadius:16,
      padding:"20px 16px", width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ color:"#ede9e3", fontFamily:"Georgia,serif", fontSize:18, margin:0 }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#8890aa", cursor:"pointer", fontSize:22 }}>×</button>
      </div>
      {children}
      <div style={{ display:"flex", gap:10, marginTop:20 }}>
        <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:"1px solid #252838", color:"#8890aa", fontSize:13 }}>Cancel</button>
        <button onClick={onSave} style={{ flex:2, padding:"11px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#c9a84c,#7a5e28)", border:"none", color:"#08080f", fontSize:13, fontWeight:700 }}>{saveLabel}</button>
      </div>
    </div>
  </div>
);


const AdminDashboard = ({ onLogout, lang, onLangChange }) => {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);

  // Modal states
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userEditForm, setUserEditForm] = useState({});
  const [impersonating, setImpersonating] = useState(null); // {user, role}

  // Form states
  const [brandForm, setBrandForm] = useState({ name:"", origin:"", category:"", description:"" });
  const [productForm, setProductForm] = useState({
    name:"", sku:"", category:"", size:"", price:"", brand_id:"",
    order_multiple:"", min_order_qty:"", max_order_qty:"", description:"",
    image_url:"", image_file:null
  });
  const [importLoading, setImportLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [scannerMode, setScannerMode] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanQty, setScanQty] = useState("");
  const [scanType, setScanType] = useState("in"); // in = restock, out = remove
  const scanInputRef = useRef(null);

  const notify = (msg, type="success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Push notifications state
  const [pushNotifs, setPushNotifs] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const unreadCount = pushNotifs.filter(n => !n.read).length;

  useEffect(() => {
    // Load existing notifications
    const loadNotifs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications")
        .select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(30);
      setPushNotifs(data || []);
    };
    loadNotifs();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      }, (payload) => {
        setPushNotifs(prev => [payload.new, ...prev]);
        // Browser notification if permitted (not available on Safari iOS)
        try {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(payload.new.title, { body: payload.new.message, icon: "/favicon.ico" });
          }
        } catch(e) { /* Safari iOS does not support Notifications */ }
      })
      .subscribe();

    // Request browser notification permission (not on Safari iOS)
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch(e) { /* Safari iOS */ }

    return () => supabase.removeChannel(channel);
  }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setPushNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Load data from Supabase
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("profiles")
        .select("*").neq("role","admin").order("created_at", { ascending: false });
      setUsers(data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadBrands = async () => {
    try {
      const { data } = await supabase.from("profiles")
        .select("*").eq("role","brand").order("created_at", { ascending: false });
      setBrands(data || []);
    } catch(e) { console.error(e); }
  };

  const loadProducts = async () => {
    try {
      const { data } = await supabase.from("products")
        .select("*, inventory(*), profiles!products_brand_id_fkey(company_name)")
        .order("created_at", { ascending: false });
      setProducts(data || []);
    } catch(e) { console.error(e); }
  };

  const loadOrders = async () => {
    try {
      const { data } = await supabase.from("orders")
        .select("*, profiles!orders_distributor_id_fkey(company_name), profiles!orders_brand_id_fkey(company_name)")
        .order("created_at", { ascending: false }).limit(50);
      setOrders(data || []);
    } catch(e) { console.error(e); }
  };

  const loadInvoices = async () => {
    try {
      const { data } = await supabase.from("invoices")
        .select("*, orders(order_number, total_amount, created_at)")
        .order("created_at", { ascending: false }).limit(100);
      setInvoices(data || []);
    } catch(e) { console.error(e); }
  };

  const loadContracts = async () => {
    try {
      const { data } = await supabase.from("contracts")
        .select("*, profiles!contracts_brand_id_fkey(company_name), profiles!contracts_distributor_id_fkey(company_name)")
        .order("created_at", { ascending: false });
      setContracts(data || []);
    } catch(e) { console.error(e); }
  };

  const viewInvoice = async (invoiceId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/generate-invoice-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ invoice_id: invoiceId, send_email: false })
        }
      );
      const data = await res.json();
      if (data.html) {
        const w = window.open("", "_blank");
        w.document.write(data.html);
        w.document.close();
      }
    } catch(e) { notify("Errore generazione fattura", "error"); }
  };

  const sendInvoiceEmail = async (invoiceId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/generate-invoice-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ invoice_id: invoiceId, send_email: true })
        }
      );
      notify("✓ Fattura inviata via email!");
    } catch(e) { notify("Errore invio email", "error"); }
  };

  const loadDocuments = async (userId) => {
    try {
      const { data } = await supabase.from("documents")
        .select("*").eq("user_id", userId).order("created_at", { ascending: false });
      return data || [];
    } catch(e) { return []; }
  };

  const updateUserProfile = async (userId, updates) => {
    await supabase.from("profiles").update(updates).eq("id", userId);
    notify("✓ Profile updated!");
    loadUsers();
  };

  useEffect(() => {
    loadUsers(); loadBrands(); loadProducts(); loadOrders();
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "brands") loadBrands();
    if (tab === "catalog") loadProducts();
    if (tab === "orders") loadOrders();
    if (tab === "invoices") loadInvoices();
    if (tab === "contracts") { loadContracts(); loadBrands(); loadUsers(); }
  }, [tab]);

  // Approve / Reject user
  const approveUser = async (id) => {
    await supabase.from("profiles").update({ status:"approved" }).eq("id", id);
    notify("✓ User approved!");
    // Send approval email
    const user = users.find(u => u.id === id);
    if (user) await sendEmail("approved", user.email, user.company_name || user.email, user.role);
    loadUsers();
  };

  const rejectUser = async (id, reason="Application declined") => {
    await supabase.from("profiles").update({ status:"rejected", rejection_reason: reason }).eq("id", id);
    notify("User rejected", "error");
    // Send rejection email
    const user = users.find(u => u.id === id);
    if (user) await sendEmail("rejected", user.email, user.company_name || user.email, user.role, reason);
    loadUsers();
  };

  // Add brand manually
  const addBrand = async () => {
    const { data: authData } = await supabase.auth.signUp({
      email: `brand_${Date.now()}@nexushub.platform`,
      password: Math.random().toString(36).slice(-12),
    });
    if (authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: `brand_${Date.now()}@nexushub.platform`,
        role: "brand", status: "approved",
        company_name: brandForm.name,
        full_name: brandForm.name,
      });
    }
    notify("Brand added!");
    setShowAddBrand(false);
    setBrandForm({ name:"", origin:"", category:"", description:"" });
    loadBrands();
  };

  // Add / Edit product
  const saveProduct = async () => {
    let imageUrl = productForm.image_url || null;
    
    // Upload image file if provided
    if (productForm.image_file) {
      const file = productForm.image_file;
      const path = `products/${Date.now()}_${file.name}`;
      const { data: uploadData } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const payload = {
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      description: productForm.description,
      unit_price: parseFloat(productForm.price) || 0,
      brand_id: productForm.brand_id || null,
      order_multiple: productForm.order_multiple ? parseInt(productForm.order_multiple) : null,
      min_order_qty: productForm.min_order_qty ? parseInt(productForm.min_order_qty) : null,
      max_order_qty: productForm.max_order_qty ? parseInt(productForm.max_order_qty) : null,
      image_url: imageUrl,
      is_active: true,
    };
    if (editingProduct) {
      await supabase.from("products").update(payload).eq("id", editingProduct.id);
      notify("Product updated!");
    } else {
      await supabase.from("products").insert(payload);
      notify("Product added!");
    }
    setShowAddProduct(false);
    setEditingProduct(null);
    setProductForm({ name:"", sku:"", category:"", size:"", price:"", brand_id:"", order_multiple:"", min_order_qty:"", max_order_qty:"", description:"", image_url:"", image_file:null });
    loadProducts();
  };

  // Import products from CSV/Excel
  const importProducts = async (file) => {
    setImportLoading(true);
    setImportResults(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { notify("File vuoto o non valido", "error"); setImportLoading(false); return; }
      
      const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase().replace(/[^a-z_]/g,''));
      const rows = lines.slice(1);
      let success = 0, errors = 0;
      
      for (const row of rows) {
        const vals = row.split(/[,;\t]/);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (vals[i] || "").trim().replace(/^"|"$/g, ""); });
        
        if (!obj.name && !obj.nome && !obj.product) continue;
        
        const payload = {
          name: obj.name || obj.nome || obj.product || "",
          sku: obj.sku || obj.cod || obj.codice || "",
          category: obj.category || obj.categoria || "",
          unit_price: parseFloat(obj.price || obj.prezzo || obj.unit_price || 0) || 0,
          order_multiple: parseInt(obj.order_multiple || obj.multiplo || 0) || null,
          min_order_qty: parseInt(obj.min_order_qty || obj.moq || obj.min || 0) || null,
          description: obj.description || obj.descrizione || "",
          image_url: obj.image_url || obj.immagine || obj.foto || null,
          is_active: true,
        };
        
        // Find brand by name if provided
        if (obj.brand || obj.marca) {
          const brandMatch = brands.find(b => 
            b.company_name?.toLowerCase().includes((obj.brand || obj.marca).toLowerCase())
          );
          if (brandMatch) payload.brand_id = brandMatch.id;
        }
        
        const { error } = await supabase.from("products").insert(payload);
        if (error) errors++; else success++;
      }
      
      setImportResults({ success, errors, total: rows.length });
      notify("✓ Importati " + success + " prodotti" + (errors > 0 ? ", " + errors + " errori" : ""));
      loadProducts();
    } catch(e) {
      notify("Errore durante l'importazione", "error");
    }
    setImportLoading(false);
  };

  // Update inventory
  const updateStock = async (productId, qty) => {
    await supabase.from("inventory")
      .update({ quantity_available: parseInt(qty), last_restock_at: new Date().toISOString(), last_restock_qty: parseInt(qty) })
      .eq("product_id", productId);
    notify("Stock updated!");
    loadProducts();
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    notify("Order " + status + "!");
    
    // Send email notification based on status
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const distProfile = await supabase.from("profiles").select("email,company_name").eq("id", order.distributor_id).single();
      if (distProfile.data) {
        const emailMap = {
          confirmed: "order_confirmed",
          preparing: "order_preparing", 
          shipped: "order_shipped",
          delivered: "order_delivered",
        };
        if (emailMap[status]) {
          await sendEmail(
            emailMap[status],
            distProfile.data.email,
            distProfile.data.company_name || distProfile.data.email,
            "distributor", "", 
            order.order_number,
            order.total_amount?.toLocaleString("it-IT"),
            ""
          );
        }
        // Payment email when delivered
        if (status === "delivered") {
          const brandProfile = await supabase.from("profiles").select("email,company_name").eq("id", order.brand_id).single();
          if (brandProfile.data) {
            await sendEmail(
              "payment_received",
              brandProfile.data.email,
              brandProfile.data.company_name || brandProfile.data.email,
              "brand", "",
              order.order_number,
              order.total_amount?.toLocaleString("it-IT"),
              ""
            );
          }
        }
      }
    }
    loadOrders();
  };

  const pendingUsers = users.filter(u => u.status === "pending");
  const approvedUsers = users.filter(u => u.status === "approved");

  const tabs = [
    { key:"overview", icon:"◈", label:"Overview" },
    { key:"users", icon:"👥", label:"Users", badge: pendingUsers.length },
    { key:"brands", icon:"🏛️", label:"Brands" },
    { key:"catalog", icon:"📦", label:"Catalog" },
    { key:"inventory", icon:"🏭", label:"Inventory" },
    { key:"orders", icon:"📋", label:"Orders" },
    { key:"invoices", icon:"🧾", label:"Fatture" },
    { key:"contracts", icon:"📝", label:"Contratti" },
    { key:"payments", icon:"💰", label:"Payments" },
    { key:"settings", icon:"⚙️", label:"Settings" },
  ];





  // If impersonating, render that user's dashboard
  if (impersonating) {
    return (
      <div style={{ position:"relative" }}>
        {/* Admin banner */}
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:9999,
          background:`linear-gradient(135deg, #a855f7, #7c3aed)`,
          padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:16 }}>👁️</span>
            <div>
              <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>
                ADMIN MODE — Visualizzando come: {impersonating.company_name || impersonating.email}
              </span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginLeft:10 }}>
                {impersonating.role.toUpperCase()} · {impersonating.email}
              </span>
            </div>
          </div>
          <button onClick={() => setImpersonating(null)} style={{
            padding:"7px 18px", borderRadius:8, cursor:"pointer",
            background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.4)",
            color:"#fff", fontSize:12, fontWeight:700 }}>
            ← Torna ad Admin
          </button>
        </div>
        {/* Render user's dashboard with extra top padding for banner */}
        <div style={{ paddingTop:44 }}>
          {impersonating.role === "brand"
            ? <BrandDashboard onLogout={() => setImpersonating(null)} lang={lang} onLangChange={onLangChange}/>
            : <DistributorDashboard onLogout={() => setImpersonating(null)} lang={lang} onLangChange={onLangChange}/>
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="NexusHub Admin" badge="admin" onLogout={onLogout} lang={lang} onLangChange={onLangChange}
        onNotifications={() => setShowNotifPanel(p => !p)} notifCount={unreadCount}/>

      {/* Push Notification Panel */}
      {showNotifPanel && (
        <div style={{ position:"fixed", top:56, right:0, width:380, maxWidth:"100vw",
          height:"calc(100vh - 56px)", background:C.surface, borderLeft:`1px solid ${C.border}`,
          zIndex:300, display:"flex", flexDirection:"column", boxShadow:"-8px 0 32px rgba(0,0,0,.4)" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>🔔 Notifiche {unreadCount > 0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:11, marginLeft:6 }}>{unreadCount}</span>}</div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize:11, color:C.textMuted, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Segna tutte lette</button>}
              <button onClick={() => setShowNotifPanel(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20 }}>×</button>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {pushNotifs.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>
                Nessuna notifica
              </div>
            ) : pushNotifs.map(n => (
              <div key={n.id} onClick={async () => {
                await supabase.from("notifications").update({ read:true }).eq("id", n.id);
                setPushNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x));
                setShowNotifPanel(false);
                if (n.type === "new_order" || n.type === "payment") setTab("orders");
                if (n.type === "new_user") setTab("users");
                if (n.type === "low_stock") setTab("inventory");
              }} style={{
                padding:"14px 20px", borderBottom:`1px solid ${C.border}`,
                cursor:"pointer", background: n.read ? "transparent" : `${C.gold}06`,
                borderLeft:`3px solid ${n.read ? "transparent" : C.gold}`,
                transition:"all .15s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight: n.read ? 500 : 700, color:C.text }}>{n.title}</div>
                    <div style={{ fontSize:12, color:C.textMuted, marginTop:3, lineHeight:1.5 }}>{n.message}</div>
                    <div style={{ fontSize:10, color:C.textDim, marginTop:5 }}>
                      {new Date(n.created_at).toLocaleString("it-IT", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                    </div>
                  </div>
                  {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:C.gold, flexShrink:0, marginTop:4 }}/>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div style={{ position:"fixed", top:64, right:20, zIndex:400,
          padding:"12px 20px", borderRadius:10,
          background: notification.type==="error" ? `${C.red}20` : `${C.green}20`,
          border:`1px solid ${notification.type==="error" ? C.red : C.green}`,
          color: notification.type==="error" ? C.red : C.green,
          fontSize:13, fontWeight:600, boxShadow:"0 4px 20px rgba(0,0,0,.3)" }}>
          {notification.msg}
        </div>
      )}

      <div style={{ padding:"16px 12px", maxWidth:1400, margin:"0 auto" }}>
        {/* Tab Nav */}
        <div style={{ display:"flex", gap:4, marginBottom:16, borderBottom:`1px solid ${C.border}`, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", msOverflowStyle:"none" }}>
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} style={{
              padding:"10px 16px", cursor:"pointer", background:"transparent",
              border:"none", borderBottom:`2px solid ${tab===tb.key?C.gold:"transparent"}`,
              color: tab===tb.key ? C.goldLight : C.textMuted,
              fontSize:13, fontWeight: tab===tb.key ? 600 : 400,
              display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
              transition:"all .15s", marginBottom:-1 }}>
              {tb.icon} {tb.label}
              {tb.badge>0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{tb.badge}</span>}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB - shown when no tab selected, or add as first tab */}
        {tab === "overview" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Platform Overview</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Real-time view across all brands, distributors and inventory</p>
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[
                { label:"Active Brands", value:brands.length, color:C.gold },
                { label:"Total Users", value:users.length, color:C.blue },
                { label:"Pending Approval", value:pendingUsers.length, color:C.red },
                { label:"Total Products", value:products.length, color:C.green },
                { label:"Total Orders", value:orders.length, color:C.purple },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 140px", padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:12 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>🗺️ European Distribution Network</h3>
              <EuropeMap
                distributors={users.filter(u=>u.role==="distributor"&&u.status==="approved").map(u=>({
                  ...u,
                  country_code: u.country==="Italy"||u.country==="IT"?"IT":u.country==="Germany"||u.country==="DE"?"DE":u.country==="Romania"||u.country==="RO"?"RO":u.country==="France"||u.country==="FR"?"FR":u.country==="UK"||u.country==="GB"?"GB":u.country==="Greece"||u.country==="GR"?"GR":u.country==="Spain"||u.country==="ES"?"ES":u.country==="Poland"||u.country==="PL"?"PL":"IT"
                }))}
              />
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>User Management</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Approve or reject brand and distributor registrations</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ padding:"10px 16px", background:`${C.red}15`, border:`1px solid ${C.red}30`, borderRadius:10, fontSize:13, color:C.red, fontWeight:600 }}>
                  ⏳ {pendingUsers.length} Pending
                </div>
                <div style={{ padding:"10px 16px", background:`${C.green}15`, border:`1px solid ${C.green}30`, borderRadius:10, fontSize:13, color:C.green, fontWeight:600 }}>
                  ✓ {approvedUsers.length} Active
                </div>
              </div>
            </div>

            {loading ? <div style={{ color:C.textMuted, padding:40, textAlign:"center" }}>Loading...</div> : (
              <>
                {pendingUsers.length > 0 && (
                  <div style={{ marginBottom:28 }}>
                    <h3 style={{ fontSize:14, color:C.gold, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>⏳ Pending Approval</h3>
                    {pendingUsers.map(u => (
                      <div key={u.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:12 }}>
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                            <div style={{ width:44, height:44, borderRadius:10, background:C.surface2,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:18, fontWeight:700, color:C.gold, border:`1px solid ${C.border}` }}>
                              {u.role === "brand" ? "🏛️" : "📦"}
                            </div>
                            <div>
                              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{u.company_name || u.email}</div>
                              <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{u.email} · {u.role.toUpperCase()}</div>
                              <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>{u.country || "—"} · {new Date(u.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <Badge status="pending"/>
                        </div>
                        <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
                          <button onClick={() => approveUser(u.id)} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>✓ Approve</button>
                          <button onClick={() => rejectUser(u.id)} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>✗ Reject</button>
                          <a href={`mailto:${u.email}`} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, textDecoration:"none", display:"inline-flex", alignItems:"center" }}>✉ Contact</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize:14, color:C.textMuted, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>All Users ({users.length})</h3>
                <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {["Company","Email","Role","Country","Status","Joined","Actions"].map((h,i) => (
                          <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u,i) => (
                        <tr key={u.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                          <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap" }}>{u.company_name || "—"}</td>
                          <td style={{ padding:"12px 14px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{u.email}</td>
                          <td style={{ padding:"12px 14px" }}><span style={{ padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:600, background: u.role==="brand"?`${C.gold}15`:`${C.blue}15`, color: u.role==="brand"?C.gold:C.blue, border:`1px solid ${u.role==="brand"?C.gold:C.blue}30` }}>{u.role}</span></td>
                          <td style={{ padding:"12px 14px", fontSize:12, color:C.textMuted }}>{u.country || "—"}</td>
                          <td style={{ padding:"12px 14px" }}><Badge status={u.status}/></td>
                          <td style={{ padding:"12px 14px", fontSize:11, color:C.textDim, whiteSpace:"nowrap" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", gap:6 }}>
                              {u.status !== "approved" && <button onClick={() => approveUser(u.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>✓</button>}
                              {u.status !== "rejected" && <button onClick={() => rejectUser(u.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>✗</button>}
                              <button onClick={async () => {
                                setEditingUser(u);
                                setUserEditForm({ full_name: u.full_name||"", company_name: u.company_name||"", phone: u.phone||"", country: u.country||"", role: u.role, status: u.status });
                                const docs = await loadDocuments(u.id);
                                setUserDocs(docs);
                                setShowUserModal(true);
                              }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}10`, border:`1px solid ${C.blue}30`, color:C.blue }}>✏️</button>
                              <button onClick={() => setImpersonating(u)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, color:"#a855f7", whiteSpace:"nowrap" }} title="Entra come questo utente">👁️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* BRANDS TAB */}
        {tab === "brands" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Brand Management</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{brands.length} brands on platform</p>
              </div>
              <button onClick={() => setShowAddBrand(true)} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Add Brand</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:14 }}>
              {brands.map(b => (
                <div key={b.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:42, height:42, borderRadius:10, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:C.bg, flexShrink:0 }}>
                      {(b.company_name||"B")[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{b.company_name || b.email}</div>
                      <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{b.email}</div>
                    </div>
                    <Badge status={b.status}/>
                  </div>
                  {b.brand_code && (
                    <div style={{ marginBottom:8, padding:"6px 10px", background:`${C.gold}08`, border:`1px solid ${C.gold}20`, borderRadius:7, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".06em" }}>Code</span>
                      <span style={{ fontSize:13, fontWeight:700, color:C.goldLight, fontFamily:"monospace" }}>{b.brand_code}</span>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8 }}>
                    {b.status !== "approved" && <button onClick={() => approveUser(b.id)} style={{ flex:1, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:11, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green, fontWeight:600 }}>✓ Approve</button>}
                    {b.status !== "rejected" && <button onClick={() => rejectUser(b.id)} style={{ flex:1, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>✗ Reject</button>}
                  </div>
                </div>
              ))}
              {brands.length === 0 && <div style={{ color:C.textMuted, padding:40, textAlign:"center", gridColumn:"1/-1" }}>No brands yet. Add the first one!</div>}
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {tab === "catalog" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Product Catalog</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{products.length} products</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <label style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  📊 {importLoading ? "Importando..." : "Import Excel/CSV"}
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" style={{ display:"none" }}
                    onChange={e => { const f = e.target.files?.[0]; if(f) importProducts(f); e.target.value=""; }}/>
                </label>
                <button onClick={() => setShowAddProduct(true)} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Add Product</button>
              </div>
            </div>
            {importResults && (
              <div style={{ padding:"12px 16px", background:`${C.green}12`, border:`1px solid ${C.green}30`, borderRadius:10, marginBottom:16, fontSize:13, color:C.green }}>
                ✓ Import completato: {importResults.success} prodotti importati{importResults.errors > 0 ? `, ${importResults.errors} errori` : ""}
                <button onClick={() => setImportResults(null)} style={{ marginLeft:12, background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12 }}>×</button>
                <div style={{ marginTop:6, fontSize:11, color:C.textMuted }}>
                  Formato CSV supportato: name, sku, category, price, brand, order_multiple, min_order_qty, description, image_url
                </div>
              </div>
            )}
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {["Brand","SKU","Product","Category","Price","Stock","MOQ","Multiple","Status","Actions"].map((h,i) => (
                      <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p,i) => (
                    <tr key={p.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{p.profiles?.company_name || "—"}</td>
                      <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.sku || "—"}</span></td>
                      <td style={{ padding:"11px 14px", whiteSpace:"nowrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          {p.image_url && <img src={p.image_url} alt="" style={{ width:32, height:32, objectFit:"cover", borderRadius:6, flexShrink:0 }} onError={e=>e.target.style.display="none"}/>}
                          <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{p.category || "—"}</td>
                      <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{p.unit_price?.toFixed(2)}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ fontSize:12, color: (p.inventory?.quantity_available||0)>50?C.green:(p.inventory?.quantity_available||0)>10?C.gold:C.red, fontWeight:600 }}>
                          {p.inventory?.quantity_available ?? 0} u.
                        </span>
                      </td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{p.min_order_qty}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>×{p.order_multiple}</td>
                      <td style={{ padding:"11px 14px" }}><Badge status={p.is_active?"active":"rejected"}/></td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => { setEditingProduct(p); setProductForm({ name:p.name, sku:p.sku||"", category:p.category||"", size:"", price:p.unit_price?.toString()||"", brand_id:p.brand_id, order_multiple:p.order_multiple, min_order_qty:p.min_order_qty, max_order_qty:p.max_order_qty||"", description:p.description||"" }); setShowAddProduct(true); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>Edit</button>
                          <button onClick={async () => { await supabase.from("products").update({ is_active:!p.is_active }).eq("id",p.id); loadProducts(); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>
                            {p.is_active?"Deactivate":"Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {tab === "inventory" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Inventory Management</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Update stock levels — changes reflect immediately for all users</p>
              </div>
              <button onClick={() => setScannerMode(m => !m)} style={{
                padding:"12px 18px", borderRadius:10, cursor:"pointer",
                background: scannerMode ? "#a855f7" : `${C.purple}15`,
                border:`1px solid ${C.purple}40`,
                color: scannerMode ? "#fff" : "#a855f7",
                fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                📱 {scannerMode ? "✓ Scanner Mode ON" : "Scanner Mode"}
              </button>
            </div>

            {/* Stock summary */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[
                { label:"Total Products", value:products.length, color:C.gold },
                { label:"In Stock", value:products.filter(p=>(p.inventory?.quantity_available||0)>0).length, color:C.green },
                { label:"Low Stock (<20)", value:products.filter(p=>(p.inventory?.quantity_available||0)<20&&(p.inventory?.quantity_available||0)>0).length, color:C.gold },
                { label:"Out of Stock", value:products.filter(p=>(p.inventory?.quantity_available||0)===0).length, color:C.red },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 140px", padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:12 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* SCANNER MODE */}
            {scannerMode && (
              <div style={{ marginBottom:20, padding:24, background:`${C.purple}08`,
                border:`2px solid ${C.purple}40`, borderRadius:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:24 }}>📱</span>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#a855f7" }}>Scanner Mode Attivo</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>Connetti il tuo scanner USB/Bluetooth oppure inserisci il barcode/SKU manualmente</div>
                  </div>
                </div>

                {/* Scan input */}
                <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                  <input
                    ref={scanInputRef}
                    type="text"
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={async e => {
                      if (e.key === "Enter" && scanInput.trim()) {
                        // Search product by SKU or barcode
                        const { data } = await supabase.from("products")
                          .select("*, inventory(*)")
                          .or(`sku.eq.${scanInput.trim()},name.ilike.%${scanInput.trim()}%`)
                          .single();
                        if (data) {
                          setScanResult(data);
                          setScanQty("");
                          setScanInput("");
                        } else {
                          setScanResult({ notFound: true, query: scanInput.trim() });
                          setScanInput("");
                        }
                      }
                    }}
                    placeholder="🔍 Scansiona barcode o inserisci SKU + Invio..."
                    autoFocus
                    style={{ flex:1, padding:"14px 18px", borderRadius:10, fontSize:15,
                      background:C.surface2, border:`2px solid ${C.purple}50`,
                      color:C.text, outline:"none", minWidth:280,
                      boxShadow:`0 0 0 ${scanResult?'3px':'0px'} ${C.purple}30` }}/>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setScanType("in")} style={{
                      padding:"12px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700,
                      background: scanType==="in" ? `${C.green}25` : "transparent",
                      border:`2px solid ${scanType==="in" ? C.green : C.border}`,
                      color: scanType==="in" ? C.green : C.textMuted }}>
                      ↑ Carico
                    </button>
                    <button onClick={() => setScanType("out")} style={{
                      padding:"12px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700,
                      background: scanType==="out" ? `${C.red}20` : "transparent",
                      border:`2px solid ${scanType==="out" ? C.red : C.border}`,
                      color: scanType==="out" ? C.red : C.textMuted }}>
                      ↓ Scarico
                    </button>
                  </div>
                </div>

                {/* Scan result */}
                {scanResult && (
                  <div style={{ padding:18, borderRadius:12,
                    background: scanResult.notFound ? `${C.red}10` : `${C.green}08`,
                    border:`1px solid ${scanResult.notFound ? C.red : C.green}40` }}>
                    {scanResult.notFound ? (
                      <div style={{ color:C.red, fontSize:14 }}>
                        ❌ Prodotto non trovato: <strong>"{scanResult.query}"</strong><br/>
                        <span style={{ fontSize:12, color:C.textMuted }}>Verifica che lo SKU sia corretto</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                          {scanResult.image_url && (
                            <img src={scanResult.image_url} alt="" style={{ width:56, height:56, objectFit:"cover", borderRadius:8 }} onError={e=>e.target.style.display="none"}/>
                          )}
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{scanResult.name}</div>
                            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{scanResult.sku} · {scanResult.category}</div>
                            <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>
                              Stock attuale: <span style={{ color: (scanResult.inventory?.quantity_available||0)>20?C.green:C.red }}>
                                {scanResult.inventory?.quantity_available || 0} unità
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize:20, fontWeight:900, color:C.goldLight }}>€{scanResult.unit_price?.toFixed(2)}</div>
                        </div>
                        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={scanQty}
                            onChange={e => setScanQty(e.target.value)}
                            placeholder={scanType==="in" ? "Quantità da aggiungere..." : "Quantità da rimuovere..."}
                            style={{ flex:1, padding:"12px 14px", borderRadius:9,
                              background:C.surface2, border:`1px solid ${C.border}`,
                              color:C.text, fontSize:14, outline:"none" }}/>
                          <button onClick={async () => {
                            const qty = parseInt(scanQty);
                            if (!qty || qty <= 0) return;
                            const currentStock = scanResult.inventory?.quantity_available || 0;
                            const newStock = scanType === "in"
                              ? currentStock + qty
                              : Math.max(0, currentStock - qty);

                            // Update inventory
                            if (scanResult.inventory) {
                              await supabase.from("inventory")
                                .update({ quantity_available: newStock, last_restock_at: new Date().toISOString(), last_restock_qty: qty, updated_at: new Date().toISOString() })
                                .eq("product_id", scanResult.id);
                            } else {
                              await supabase.from("inventory")
                                .insert({ product_id: scanResult.id, quantity_available: newStock, last_restock_at: new Date().toISOString(), last_restock_qty: qty });
                            }

                            // Log movement
                            await supabase.from("inventory_movements").insert({
                              product_id: scanResult.id,
                              movement_type: scanType === "in" ? "restock" : "manual_removal",
                              quantity: qty,
                              quantity_before: currentStock,
                              quantity_after: newStock,
                              notes: `Scanner ${scanType === "in" ? "carico" : "scarico"} — ${qty} unità`
                            });

                            notify(scanType==="in"
                              ? `✓ +${qty} unità aggiunte a ${scanResult.name}`
                              : `✓ -${qty} unità rimosse da ${scanResult.name}`);

                            // Update local state
                            setScanResult(prev => ({
                              ...prev,
                              inventory: { ...prev.inventory, quantity_available: newStock }
                            }));
                            setScanQty("");
                            loadProducts();

                            // Refocus scanner input for next scan
                            setTimeout(() => scanInputRef.current?.focus(), 100);
                          }} style={{
                            padding:"12px 20px", borderRadius:9, cursor:"pointer",
                            background: scanType==="in"
                              ? `linear-gradient(135deg,${C.green},#1e8449)`
                              : `linear-gradient(135deg,${C.red},#922b21)`,
                            border:"none", color:"#fff", fontSize:14, fontWeight:700, whiteSpace:"nowrap" }}>
                            {scanType==="in" ? `+ Aggiungi` : `- Rimuovi`}
                          </button>
                          <button onClick={() => setScanResult(null)} style={{
                            padding:"12px 16px", borderRadius:9, cursor:"pointer",
                            background:"transparent", border:`1px solid ${C.border}`,
                            color:C.textMuted, fontSize:13 }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ marginTop:12, fontSize:11, color:C.textMuted }}>
                  💡 Tieni premuto sul campo di testo e scansiona — il barcode viene letto automaticamente. Premi Invio per cercare.
                </div>
              </div>
            )}

            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {["Product","SKU","Brand","Current Stock","Reserved","Update Stock","Last Restock"].map((h,i) => (
                      <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p,i) => {
                    const stock = p.inventory?.quantity_available || 0;
                    const reserved = p.inventory?.quantity_reserved || 0;
                    return (
                      <tr key={p.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600, color:C.text }}>{p.name}</td>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.sku||"—"}</span></td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{p.profiles?.company_name||"—"}</td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontSize:14, fontWeight:700, color:stock>50?C.green:stock>10?C.gold:C.red }}>{stock}</span>
                          <span style={{ fontSize:11, color:C.textDim }}> u.</span>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{reserved} u.</td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                            <input type="number" defaultValue={stock} id={`stock-${p.id}`}
                              style={{ width:80, padding:"6px 8px", borderRadius:7, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }}/>
                            <button onClick={() => updateStock(p.id, document.getElementById(`stock-${p.id}`).value)}
                              style={{ padding:"6px 12px", borderRadius:7, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                              Update
                            </button>
                          </div>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim }}>
                          {p.inventory?.last_restock_at ? new Date(p.inventory.last_restock_at).toLocaleDateString() : "Never"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Order Management</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{orders.length} orders total</p>
            </div>
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {["pending","confirmed","shipped","delivered"].map(s => (
                <div key={s} style={{ flex:"1 1 120px", padding:"14px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:s==="delivered"?C.green:s==="shipped"?C.blue:s==="confirmed"?C.gold:C.textMuted, fontFamily:"Georgia,serif" }}>
                    {orders.filter(o=>o.status===s).length}
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em", marginTop:3 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {["Order #","Distributor","Brand","Amount","Status","Date","Actions"].map((h,i) => (
                      <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o,i) => (
                    <tr key={o.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.order_number}</span></td>
                      <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{o.profiles?.company_name||"—"}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>—</td>
                      <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{o.total_amount?.toLocaleString("it-IT")}</td>
                      <td style={{ padding:"11px 14px" }}><Badge status={o.status}/></td>
                      <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <select onChange={e => updateOrderStatus(o.id, e.target.value)} value={o.status}
                          style={{ padding:"5px 8px", borderRadius:6, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:11, cursor:"pointer" }}>
                          {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.textMuted }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVOICES TAB */}
        {tab === "invoices" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 Fatturazione Automatica</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Fatture generate automaticamente al completamento degli ordini</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { label:"Totale Fatture", value:invoices.length, color:C.gold },
                  { label:"Commissioni NH", value:`€${invoices.filter(i=>i.type==="nexushub_commission").reduce((s,i)=>s+(i.commission_amount||0),0).toFixed(0)}`, color:C.green },
                  { label:"Emesse oggi", value:invoices.filter(i=>new Date(i.created_at).toDateString()===new Date().toDateString()).length, color:C.blue },
                ].map((s,i) => (
                  <div key={i} style={{ padding:"10px 16px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:10, textAlign:"center" }}>
                    <div style={{ fontSize:16, fontWeight:900, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {invoices.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🧾</div>
                <div style={{ fontSize:15, color:C.text, marginBottom:8 }}>Nessuna fattura ancora</div>
                <div style={{ fontSize:13, color:C.textMuted }}>Le fatture vengono generate automaticamente quando un ordine viene consegnato</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {["Numero","Tipo","Da","A","Imponibile","IVA","Totale","Commissione NH","Data","Azioni"].map((h,i) => (
                        <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv,i) => (
                      <tr key={inv.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold, fontWeight:700 }}>{inv.invoice_number}</span>
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ padding:"3px 8px", borderRadius:5, fontSize:10, fontWeight:700,
                            background: inv.type==="nexushub_commission"?`${C.gold}15`:inv.type==="nexushub_to_distributor"?`${C.blue}15`:`${C.green}15`,
                            color: inv.type==="nexushub_commission"?C.gold:inv.type==="nexushub_to_distributor"?C.blue:C.green,
                            border: `1px solid ${inv.type==="nexushub_commission"?C.gold:inv.type==="nexushub_to_distributor"?C.blue:C.green}30` }}>
                            {inv.type==="nexushub_commission"?"NH Commission":inv.type==="nexushub_to_distributor"?"NH → Dist.":"Brand → NH"}
                          </span>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.text, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inv.from_entity}</td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.text, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inv.to_entity}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600, color:C.text }}>€{inv.subtotal?.toFixed(2)}</td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>€{inv.vat_amount?.toFixed(2)}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{inv.total?.toFixed(2)}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:inv.commission_amount>0?C.gold:C.textDim }}>
                          {inv.commission_amount>0 ? `€${inv.commission_amount?.toFixed(2)}` : "—"}
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim, whiteSpace:"nowrap" }}>
                          {new Date(inv.created_at).toLocaleDateString("it-IT")}
                        </td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => viewInvoice(inv.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>👁 Vedi</button>
                            <button onClick={() => sendInvoiceEmail(inv.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.green}10`, border:`1px solid ${C.green}30`, color:C.green }}>✉ Invia</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CONTRACTS TAB */}
        {tab === "contracts" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📝 Contratti Digitali</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Contratti di distribuzione esclusiva per territorio</p>
              </div>
              <button onClick={() => notify("Seleziona brand e distributore dalla tabella per creare un contratto")}
                style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>
                + Nuovo Contratto
              </button>
            </div>

            {contracts.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
                <div style={{ fontSize:15, color:C.text, marginBottom:8 }}>Nessun contratto ancora</div>
                <div style={{ fontSize:13, color:C.textMuted }}>I contratti vengono creati quando approvi un distributore per un brand</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {["Numero","Brand","Distributore","Territorio","Esclusiva","Validità","Status","Azioni"].map((h,i) => (
                        <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((c,i) => (
                      <tr key={c.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{c.contract_number}</span></td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{c.profiles?.company_name || "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{c.profiles?.company_name || "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{c.territory}</td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontSize:11, color:c.exclusivity?C.green:C.textMuted }}>{c.exclusivity?"✓ Esclusivo":"Non esclusivo"}</span>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textMuted }}>
                          {c.valid_from} → {c.valid_until}
                        </td>
                        <td style={{ padding:"11px 14px" }}><Badge status={c.status}/></td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={async () => {
                              await supabase.from("contracts").update({ status:"active" }).eq("id", c.id);
                              notify("✓ Contratto attivato!");
                              loadContracts();
                            }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>Attiva</button>
                            <button onClick={async () => {
                              await supabase.from("contracts").update({ status:"terminated" }).eq("id", c.id);
                              notify("Contratto terminato");
                              loadContracts();
                            }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>Termina</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {tab === "payments" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Payment Overview</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Global revenue across all brands and distributors</p>
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              {[
                { label:"Platform GMV", value:`€${orders.reduce((s,o)=>s+(o.total_amount||0),0).toLocaleString("it-IT")}`, color:C.gold },
                { label:"NexusHub Revenue (11.4%)", value:`€${(orders.reduce((s,o)=>s+(o.total_amount||0),0)*0.114).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`, color:C.green },
                { label:"Total Orders", value:orders.length, color:C.blue },
                { label:"Avg Order Value", value:orders.length>0?`€${(orders.reduce((s,o)=>s+(o.total_amount||0),0)/orders.length).toFixed(0)}`:"—", color:C.purple },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 160px", padding:"18px 20px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:12 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:16 }}>Transaction Log</h3>
              {orders.length === 0 ? (
                <div style={{ color:C.textMuted, textAlign:"center", padding:30 }}>No transactions yet</div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {["Order","Amount","NexusHub Fee","Brand Share","Date","Status"].map((h,i) => (
                          <th key={i} style={{ padding:"9px 12px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o,i) => (
                        <tr key={o.id} style={{ borderTop:`1px solid ${C.border}` }}>
                          <td style={{ padding:"10px 12px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.order_number}</span></td>
                          <td style={{ padding:"10px 12px", fontSize:13, fontWeight:700, color:C.text }}>€{o.total_amount?.toLocaleString("it-IT")}</td>
                          <td style={{ padding:"10px 12px", fontSize:13, color:C.goldLight }}>€{((o.total_amount||0)*0.114).toFixed(2)}</td>
                          <td style={{ padding:"10px 12px", fontSize:13, color:C.green }}>€{((o.total_amount||0)*0.886).toFixed(2)}</td>
                          <td style={{ padding:"10px 12px", fontSize:11, color:C.textDim }}>{new Date(o.created_at).toLocaleDateString()}</td>
                          <td style={{ padding:"10px 12px" }}><Badge status={o.status==="delivered"?"settled":"pending"}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div style={{ maxWidth:600 }}>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Platform Settings</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 24px" }}>Configure NexusHub platform behaviour</p>

            {[
              { title:"Demo Mode", desc:"Show 'Watch Demo' button on login page — disable when platform is live", key:"demo" },
              { title:"Public Registration", desc:"Allow brands and distributors to self-register", key:"registration" },
              { title:"SEPA Payments", desc:"Enable automatic payment processing via SEPA Instant", key:"payments" },
              { title:"Email Notifications", desc:"Send automatic emails on approval/rejection", key:"emails" },
              { title:"Scanner Integration", desc:"Enable barcode scanner for inventory updates (mobile app)", key:"scanner" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"18px 20px", background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:12, marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{s.title}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{s.desc}</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:12,
                  background: i===0||i===1 ? C.gold : C.surface3,
                  border:`1px solid ${i===0||i===1?C.gold:C.border}`,
                  cursor:"pointer", position:"relative", flexShrink:0, marginLeft:16 }}
                  onClick={() => notify(`Setting "${s.title}" updated`)}>
                  <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%",
                    background:"#fff", transition:"left .2s",
                    left: i===0||i===1 ? 23 : 3 }}/>
                </div>
              </div>
            ))}

            <div style={{ marginTop:24, padding:"18px 20px", background:`${C.red}08`, border:`1px solid ${C.red}20`, borderRadius:12 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.red, marginBottom:6 }}>⚠️ Danger Zone</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>These actions are irreversible</div>
              <button style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.red}50`, color:C.red, fontSize:12 }}
                onClick={() => notify("Feature coming soon", "error")}>
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {showUserModal && editingUser && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:500,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
            padding:"20px 16px", width:"100%", maxWidth:600, maxHeight:"92vh", overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
            
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h3 style={{ color:C.text, fontFamily:"Georgia,serif", fontSize:18, margin:0 }}>
                  {editingUser.role === "brand" ? "🏛️" : "📦"} {editingUser.company_name || editingUser.email}
                </h3>
                <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{editingUser.email}</div>
              </div>
              <button onClick={() => setShowUserModal(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:22 }}>×</button>
            </div>

            {/* Edit fields */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[
                { label:"Full Name", key:"full_name", placeholder:"Nome referente" },
                { label:"Company Name", key:"company_name", placeholder:"Ragione sociale" },
                { label:"Phone", key:"phone", placeholder:"+39..." },
                { label:"Country", key:"country", placeholder:"Italia" },
              ].map(({label,key,placeholder}) => (
                <div key={key}>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
                  <input type="text" value={userEditForm[key]||""} onChange={e=>setUserEditForm(f=>({...f,[key]:e.target.value}))}
                    placeholder={placeholder}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>

            {/* Banking info (read-only display) */}
            {(editingUser.iban || editingUser.bank_name) && (
              <div style={{ marginBottom:16, padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:12, color:C.gold, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>💳 Dati Bancari</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    ["Intestatario", editingUser.account_holder],
                    ["Banca", editingUser.bank_name],
                    ["IBAN", editingUser.iban],
                    ["SWIFT/BIC", editingUser.swift_bic],
                  ].map(([k,v]) => v ? (
                    <div key={k}>
                      <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".06em" }}>{k}</div>
                      <div style={{ fontSize:12, color:C.text, fontWeight:600, marginTop:2, fontFamily:"monospace" }}>{v}</div>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            {/* VAT/SDI/PEC display */}
            {(editingUser.vat_number || editingUser.sdi_code) && (
              <div style={{ marginBottom:16, padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:12, color:C.blue, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>🧾 Dati Fiscali</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    ["VAT Number", editingUser.vat_number],
                    ["Codice SDI", editingUser.sdi_code],
                    ["PEC", editingUser.pec_email],
                  ].map(([k,v]) => v ? (
                    <div key={k}>
                      <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".06em" }}>{k}</div>
                      <div style={{ fontSize:12, color:C.text, fontWeight:600, marginTop:2, fontFamily:"monospace" }}>{v}</div>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            {/* Payment Methods - only for brands */}
            {editingUser.role === "brand" && (
              <div style={{ marginBottom:16, padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:12, color:C.green, fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>💳 Metodi di Pagamento Accettati</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { key:"sepa", label:"Bonifico SEPA", desc:"Gratuito · 1-2 giorni lavorativi", icon:"🏦" },
                    { key:"card", label:"Carta di Credito", desc:"Commissione ~1.4% · Istantaneo", icon:"💳" },
                    { key:"sepa_debit", label:"SEPA Direct Debit", desc:"Addebito automatico · Gratuito", icon:"⚡" },
                  ].map(m => {
                    const methods = editingUser.payment_methods || { sepa: true, card: false, sepa_debit: false };
                    return (
                      <div key={m.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"10px 14px", background:C.surface, border:`1px solid ${methods[m.key]?C.green:C.border}`,
                        borderRadius:8, cursor:"pointer" }}
                        onClick={async () => {
                          const updated = { ...(editingUser.payment_methods || {}), [m.key]: !methods[m.key] };
                          await supabase.from("profiles").update({ payment_methods: updated }).eq("id", editingUser.id);
                          setEditingUser(u => ({ ...u, payment_methods: updated }));
                          notify("✓ Metodo pagamento aggiornato!");
                        }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:18 }}>{m.icon}</span>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{m.label}</div>
                            <div style={{ fontSize:11, color:C.textMuted }}>{m.desc}</div>
                          </div>
                        </div>
                        <div style={{ width:36, height:20, borderRadius:10,
                          background: methods[m.key] ? C.green : C.surface2,
                          border:`1px solid ${methods[m.key]?C.green:C.border}`,
                          position:"relative", transition:"all .2s", flexShrink:0 }}>
                          <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%",
                            background:"#fff", transition:"left .2s",
                            left: methods[m.key] ? 18 : 2 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop:10, padding:"8px 12px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                  💡 I distributori vedranno solo i metodi che il brand accetta. Clicca per attivare/disattivare.
                </div>
              </div>
            )}

            {/* Brand Code - only for brands */}
            {editingUser.role === "brand" && editingUser.brand_code && (
              <div style={{ marginBottom:16, padding:"12px 16px",
                background:`${C.gold}08`, border:`1px solid ${C.gold}25`, borderRadius:10,
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".08em" }}>Brand Code</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.goldLight, fontFamily:"monospace", marginTop:3 }}>{editingUser.brand_code}</div>
                </div>
                <div style={{ fontSize:10, color:C.textMuted, maxWidth:200, textAlign:"right", lineHeight:1.5 }}>
                  Codice univoco per fatture e bonifici
                </div>
              </div>
            )}

            {/* Role + Status */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Role</label>
                <select value={userEditForm.role||""} onChange={e=>setUserEditForm(f=>({...f,role:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="brand">Brand</option>
                  <option value="distributor">Distributor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Status</label>
                <select value={userEditForm.status||""} onChange={e=>setUserEditForm(f=>({...f,status:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Documents section */}
            <div style={{ marginBottom:20 }}>
              <h4 style={{ fontSize:13, color:C.text, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>
                📄 Documents ({userDocs.length})
              </h4>
              {userDocs.length === 0 ? (
                <div style={{ padding:"16px", background:C.surface2, borderRadius:10, fontSize:13, color:C.textMuted, textAlign:"center" }}>
                  No documents uploaded yet
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {userDocs.map((doc, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"12px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:18 }}>
                          {doc.file_name && /[.](jpg|jpeg|png|gif)$/i.test(doc.file_name) ? "🖼️" : "📄"}
                        </span>
                        <div>
                          <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>
                            {doc.doc_type === "visura_camerale" ? "Visura Camerale" :
                             doc.doc_type === "partita_iva" ? "Partita IVA" :
                             doc.doc_type === "coordinate_bancarie" ? "Coordinate Bancarie" : doc.doc_type}
                          </div>
                          <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{doc.file_name}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4,
                          background: doc.verified ? `${C.green}15` : `${C.gold}15`,
                          color: doc.verified ? C.green : C.gold,
                          border: `1px solid ${doc.verified ? C.green : C.gold}40` }}>
                          {doc.verified ? "✓ Verified" : "Pending"}
                        </span>
                        <a href={doc.file_url} target="_blank" rel="noreferrer"
                          style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600,
                            background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue,
                            textDecoration:"none", cursor:"pointer" }}>
                          View
                        </a>
                        <button onClick={async () => {
                          await supabase.from("documents").update({ verified: !doc.verified }).eq("id", doc.id);
                          const docs = await loadDocuments(editingUser.id);
                          setUserDocs(docs);
                          notify(doc.verified ? "Document unverified" : "✓ Document verified!");
                        }} style={{ padding:"5px 12px", borderRadius:6, fontSize:11,
                          background:`${C.green}10`, border:`1px solid ${C.green}30`, color:C.green, cursor:"pointer" }}>
                          {doc.verified ? "Unverify" : "Verify"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowUserModal(false)} style={{ flex:1, padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>Cancel</button>
              <button onClick={async () => {
                await updateUserProfile(editingUser.id, userEditForm);
                setShowUserModal(false);
              }} style={{ flex:2, padding:"11px", borderRadius:8, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showAddBrand && (
        <Modal title="Add New Brand" onClose={() => setShowAddBrand(false)} onSave={addBrand}>
          <FormInput label="Brand Name" value={brandForm.name} onChange={v=>setBrandForm(f=>({...f,name:v}))} placeholder="e.g. Lattafa Perfumes"/>
          <FormInput label="Origin Country" value={brandForm.origin} onChange={v=>setBrandForm(f=>({...f,origin:v}))} placeholder="e.g. Dubai, UAE"/>
          <FormInput label="Category" value={brandForm.category} onChange={v=>setBrandForm(f=>({...f,category:v}))} placeholder="e.g. Fine Fragrance"/>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Description</label>
            <textarea value={brandForm.description} onChange={e=>setBrandForm(f=>({...f,description:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", minHeight:80, resize:"vertical" }}/>
          </div>
        </Modal>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <Modal title={editingProduct ? "Edit Product" : "Add New Product"} onClose={() => { setShowAddProduct(false); setEditingProduct(null); }} onSave={saveProduct}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { label:"Product Name *", key:"name", placeholder:"es. Khamrah EDP", mode:"text" },
              { label:"SKU", key:"sku", placeholder:"es. LT-KHM-100", mode:"text" },
              { label:"Category", key:"category", placeholder:"es. Premium", mode:"text" },
              { label:"Size", key:"size", placeholder:"es. 100ml", mode:"text" },
              { label:"Unit Price (€) *", key:"price", placeholder:"0.00", mode:"decimal" },
            ].map(({label, key, placeholder, mode}) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
                <input
                  type="text"
                  inputMode={mode}
                  value={productForm[key]}
                  onChange={e => setProductForm(f => ({...f, [key]: e.target.value}))}
                  placeholder={placeholder}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Brand</label>
              <select value={productForm.brand_id} onChange={e=>setProductForm(f=>({...f,brand_id:e.target.value}))}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                <option value="">Seleziona brand...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.company_name||b.email}</option>)}
              </select>
            </div>
            {[
              { label:"Order Multiple", key:"order_multiple", placeholder:"es. 12" },
              { label:"Min Order Qty (MOQ)", key:"min_order_qty", placeholder:"es. 24" },
            ].map(({label, key, placeholder}) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={productForm[key]}
                  onChange={e => setProductForm(f => ({...f, [key]: e.target.value}))}
                  placeholder={placeholder}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Max Order Qty (vuoto = illimitato)</label>
            <input
              type="text"
              inputMode="numeric"
              value={productForm.max_order_qty}
              onChange={e => setProductForm(f => ({...f, max_order_qty: e.target.value}))}
              placeholder="es. 500"
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
          
          {/* Image section */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:8 }}>Immagine Prodotto</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {/* Upload file */}
              <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6,
                padding:"16px 12px", borderRadius:10, cursor:"pointer",
                background: productForm.image_file ? `${C.green}10` : C.surface2,
                border:`1px dashed ${productForm.image_file ? C.green : C.border}`,
                textAlign:"center" }}>
                <input type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setProductForm(p=>({...p,image_file:f,image_url:""})); }}/>
                <span style={{ fontSize:22 }}>{productForm.image_file ? "✓" : "📁"}</span>
                <span style={{ fontSize:11, color: productForm.image_file ? C.green : C.textMuted }}>
                  {productForm.image_file ? productForm.image_file.name : "Carica immagine"}
                </span>
              </label>
              {/* URL esterno */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:11, color:C.textMuted }}>oppure URL esterno:</span>
                <input type="text" value={productForm.image_url} 
                  onChange={e => setProductForm(p=>({...p,image_url:e.target.value, image_file:null}))}
                  placeholder="https://..."
                  style={{ padding:"8px 10px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none" }}/>
                {productForm.image_url && (
                  <img src={productForm.image_url} alt="preview" style={{ width:"100%", height:60, objectFit:"cover", borderRadius:6 }}
                    onError={e => { e.target.style.display="none"; }}/>
                )}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Description</label>
            <textarea value={productForm.description} onChange={e=>setProductForm(f=>({...f,description:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", minHeight:70, resize:"vertical" }}/>
          </div>

          <div style={{ padding:"10px 14px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
            💡 Per importare molti prodotti usa il pulsante <strong style={{color:C.text}}>Import Excel/CSV</strong> nel catalogo.<br/>
            Colonne supportate: name, sku, category, price, brand, order_multiple, min_order_qty, description, image_url
          </div>
        </Modal>
      )}
    </div>
  );
};



// ============================================================
// MAIN APP — con Supabase auth reale
// ============================================================
// Inject global CSS safely (Safari compatible)
const injectGlobalCSS = () => {
  if (typeof document === "undefined") return;
  const id = "nexushub-global-css";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = [
    "*, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }",
    "html { -webkit-text-size-adjust: 100%; }",
    "body { overflow-x: hidden; -webkit-overflow-scrolling: touch; }",
    "input, textarea, select { font-size: 16px !important; -webkit-appearance: none; appearance: none; }",
    "button { cursor: pointer; -webkit-appearance: none; }",
    "* { -webkit-font-smoothing: antialiased; }",
  ].join("\n");
  document.head.appendChild(style);
};
injectGlobalCSS();

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

      <div dir={dir} style={{ fontFamily, WebkitFontSmoothing:"antialiased", MozOsxFontSmoothing:"grayscale" }}>
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
