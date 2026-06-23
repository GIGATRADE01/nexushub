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
T.fr = {
  loginSubtitle:"Plateforme mondiale de distribution B2B",accessAs:"Se connecter en tant que",
  roleBrandLabel:"Marque",roleBrandDesc:"Visibilité totale du marché et contrôle des distributeurs",
  roleDistLabel:"Distributeur",roleDistDesc:"Vos marques autorisées et votre territoire",
  roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervision de toute la plateforme",
  demoMode:"Démo",demoTryAs:"— Accès invité",enterPlatform:"Entrer dans la plateforme →",authenticating:"Authentification…",
  emailLabel:"E-mail",passwordLabel:"Mot de passe",loginBtn:"Se connecter",
  loggingIn:"Connexion…",loginError:"E-mail ou mot de passe invalide",
  pendingTitle:"Compte en attente d'approbation",pendingMsg:"Vos documents ont été reçus. Vous serez notifié par e-mail dès l'approbation de votre compte.",
  rejectedTitle:"Compte non approuvé",rejectedMsg:"Votre demande d'accès a été refusée.",
  registerBrand:"S'inscrire comme Marque",registerDist:"S'inscrire comme Distributeur",
  alreadyAccount:"Vous avez déjà un compte ?",backToLogin:"Retour à la connexion",
  registerTitle:"Inscription",step1:"Compte",step2:"Entreprise et documents",
  fullName:"Nom du contact",companyName:"Raison sociale",phone:"Téléphone",country:"Pays",
  confirmPassword:"Confirmer le mot de passe",passwordMismatch:"Les mots de passe ne correspondent pas",passwordShort:"Le mot de passe doit comporter au moins 8 caractères",
  docsRequired:"Documents requis",clickToUpload:"Cliquez pour téléverser un PDF ou une image",
  submitRequest:"Envoyer la demande",sending:"Envoi…",
  successTitle:"Inscription terminée",successMsg:"Votre demande a été envoyée. Notre équipe vérifiera vos documents et vous notifiera par e-mail sous 24 à 48 heures.",
  portalBrand:"Portail Marque",portalDistributor:"Portail Distributeur",portalAdmin:"Admin",logout:"Déconnexion",
  tabOverview:"Aperçu",tabApplications:"Candidatures",tabDistributors:"Distributeurs",
  tabCatalog:"Catalogue",tabOrders:"Commandes",tabPayments:"Paiements",
  tabBrandMarket:"Place de marché des marques",tabMyCatalog:"Mon catalogue",tabMyOrders:"Mes commandes",
  overviewTitle:"Aperçu du marché européen",overviewSub:"Visibilité en temps réel · Hub : Turin, Italie · 400–500 palettes/mois",
  statTerritories:"Territoires actifs",statTerritoriesSub:"Toute l'Europe",
  statDistributors:"Distributeurs",statDistributorsSub:"en attente d'approbation",
  statRevenue:"Chiffre d'affaires mensuel",statRevenueSub:"↑ 18 % vs mois dernier",
  statPallets:"Palettes / mois",statPalletsSub:"Moy. hub de Turin",
  statAlerts:"Alertes prix",statAlertsSub:"2 de gravité élevée",
  priceAlertsTitle:"Alertes d'intégrité des prix",actBtn:"Agir",
  hubStockTitle:"État du stock du hub · Turin",
  hubTotalSkus:"SKU totaux au hub",hubTotalSkusVal:"87 références",
  hubTotalUnits:"Unités totales en stock",hubTotalUnitsVal:"18 430 unités",
  hubPallets:"Palettes occupées",hubPalletsVal:"312 / 500 emplacements",
  hubNextContainer:"Prochain conteneur (ETA)",hubNextContainerVal:"4 juin depuis Dubaï",
  hubOrdersToday:"Commandes traitées aujourd'hui",hubOrdersTodayVal:"7 actives",
  hubConsignment:"Valeur du dépôt",hubConsignmentVal:"1,84 M€",
  appTitle:"Candidatures de distributeurs",appSub:"Examinez, approuvez ou refusez les entreprises demandant l'accès à votre catalogue",
  submitted:"Soumise",territory:"Territoire",type:"Type",annualRevenue:"Chiffre d'affaires annuel",yearsActive:"Années d'activité",years:"ans",
  requestedBrands:"Marques demandées :",documentsUploaded:"Documents téléversés :",
  approveBtn:"✓ Approuver et activer l'accès",declineBtn:"✗ Refuser",askMoreBtn:"Demander plus d'informations",
  approvedMsg:"✓ Approuvé — identifiants envoyés automatiquement au distributeur",
  rejectedMsgDist:"✗ Refusé — le distributeur a été notifié par e-mail",
  distTitle:"Distributeurs actifs",distSub:"Un partenaire autorisé par territoire · Aucun chevauchement garanti par la plateforme",
  colFlag:"Drapeau",colCompany:"Entreprise",colTerritory:"Territoire",colBrands:"Marques autorisées",
  colOrders:"Commandes",colRevenue:"Chiffre d'affaires",colStatus:"Statut",
  catTitle:"Catalogue produits",catSub:"Tous les SKU disponibles au hub européen de Turin · Stock en dépôt · Quantités en temps réel",
  colSku:"SKU",colProduct:"Produit",colSize:"Format",colCategory:"Catégorie",colPrice:"Prix unitaire",
  colStock:"Stock",colPerPallet:"Par palette",colMoq:"MOQ",
  ordersTitle:"Toutes les commandes européennes",ordersSub:"Chaque commande passe par le hub NexusHub · Turin, Italie · Objectif : expédition sous 48 h",
  statOrdersMonth:"Commandes ce mois-ci",statOrdersMonthSub:"↑ 23 vs mois dernier",
  statPalletsShipped:"Palettes expédiées",statPalletsShippedSub:"Mai 2024",
  statTotalValue:"Valeur totale",statTotalValueSub:"Mai 2024",
  statAvgDispatch:"Expédition moy.",statAvgDispatchVal:"1,4 jour",statAvgDispatchSub:"Depuis la confirmation",
  colOrderId:"N° de commande",colDistributor:"Distributeur",colCountry:"Pays",colItems:"Articles",
  colPallets:"Palettes",colValue:"Valeur",colDate:"Date",colEta:"ETA",delivered:"Livré",
  paymentsTitle:"Flux de paiement",paymentsSub:"Le distributeur paie la marque directement via SEPA Instant · Commission NexusHub répartie automatiquement via DSP2",
  payArchLabel:"Architecture de paiement automatisée · Zéro intervention manuelle",
  payTransLog:"Journal des transactions — Répartition automatique par commande",
  colGross:"Montant brut",colBrandShare:"→ La marque reçoit",colNexusFee:"→ Commission NexusHub",
  colFeePercent:"% commission",colMethod:"Méthode",colTime:"Heure",
  nodeDistributor:"Distributeur",nodeDistributorSub:"Passe commande sur NexusHub",
  nodeSepa:"SEPA Instant",nodeSepaSub:"Virement direct à la marque",
  nodeLattafa:"Compte de la marque",nodeLattafaSub:"Reçoit le paiement intégral",
  nodeWebhook:"Webhook DSP2",nodeWebhookSub:"Notification automatique en quelques secondes",
  nodeNexus:"NexusHub",nodeNexusSub:"Calcule la commission automatiquement",
  nodeGiga:"GigaTrade",nodeGigaSub:"Commission ~11,4 % créditée",
  marketTitle:"Place de marché des marques",marketSub:"Toutes les marques disponibles sur NexusHub · Vert = déjà autorisées pour votre territoire",
  skusLabel:"SKU",euDistLabel:"Dist. UE",categoryLabel:"Catégorie",
  viewCatalogBtn:"Voir mon catalogue →",requestSentMsg:"⏳ Demande envoyée — en attente d'approbation de la marque",requestAccessBtn:"+ Demander l'accès",
  myCatTitle:"Mon catalogue autorisé",myCatSub:"Marques autorisées pour votre territoire · Stock prêt au hub de Turin · Livraison 48 h",
  colBrand:"Marque",colAction:"Action",addBtn:"+ Ajouter",cartLabel:"Passer commande",cartSub1:"48 h depuis Turin · Paiement via SEPA Instant",
  myOrdersTitle:"Mes commandes",myOrdersSub:"Toutes les commandes traitées depuis le hub européen NexusHub · Turin, Italie",
  statMyOrders:"Commandes ce mois-ci",statMyOrdersSub:"Mai 2024",statMySpent:"Total dépensé",statMySpentSub:"Mai 2024",
  statMyDelivery:"Livraison moy.",statMyDeliveryVal:"1,6 jour",statMyPallets:"Palettes reçues",statMyPalletsSub:"Mai 2024",
  colPayment:"Paiement",deliveredCheck:"✓ Livré",
  adminTitle:"Aperçu de la plateforme",adminSub:"Vue globale sur toutes les marques, distributeurs et transactions",
  statBrands:"Marques actives",statBrandsSub:"2 en intégration",statAllDist:"Distributeurs totaux",statAllDistSub:"Toute l'Europe",
  statGmv:"GMV de la plateforme",statGmvSub:"Mai 2024",statNexusRev:"Revenus NexusHub",statNexusRevSub:"~11,4 % commission moy.",
  statAllPallets:"Palettes / mois",statAllPalletsSub:"Toutes les marques",
  adminBrandsTitle:"Marques actives sur la plateforme",adminRevenueTitle:"Revenus NexusHub par marque (mai)",distributorsLabel:"distributeurs",
};
T.es = {
  loginSubtitle:"Plataforma global de distribución B2B",accessAs:"Acceder como",
  roleBrandLabel:"Marca",roleBrandDesc:"Visibilidad total del mercado y control de distribuidores",
  roleDistLabel:"Distribuidor",roleDistDesc:"Tus marcas autorizadas y tu territorio",
  roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervisión de toda la plataforma",
  demoMode:"Demo",demoTryAs:"— Acceso como invitado",enterPlatform:"Entrar a la plataforma →",authenticating:"Autenticando…",
  emailLabel:"Correo",passwordLabel:"Contraseña",loginBtn:"Iniciar sesión",
  loggingIn:"Iniciando sesión…",loginError:"Correo o contraseña no válidos",
  pendingTitle:"Cuenta pendiente de aprobación",pendingMsg:"Hemos recibido tus documentos. Recibirás una notificación por correo cuando tu cuenta sea aprobada.",
  rejectedTitle:"Cuenta no aprobada",rejectedMsg:"Tu solicitud de acceso fue rechazada.",
  registerBrand:"Registrarse como Marca",registerDist:"Registrarse como Distribuidor",
  alreadyAccount:"¿Ya tienes una cuenta?",backToLogin:"Volver al inicio de sesión",
  registerTitle:"Registro",step1:"Cuenta",step2:"Empresa y documentos",
  fullName:"Nombre de contacto",companyName:"Razón social",phone:"Teléfono",country:"País",
  confirmPassword:"Confirmar contraseña",passwordMismatch:"Las contraseñas no coinciden",passwordShort:"La contraseña debe tener al menos 8 caracteres",
  docsRequired:"Documentos requeridos",clickToUpload:"Haz clic para subir un PDF o imagen",
  submitRequest:"Enviar solicitud",sending:"Enviando…",
  successTitle:"Registro completado",successMsg:"Tu solicitud ha sido enviada. Nuestro equipo verificará tus documentos y te notificará por correo en 24-48 horas.",
  portalBrand:"Portal de Marca",portalDistributor:"Portal de Distribuidor",portalAdmin:"Admin",logout:"Salir",
  tabOverview:"Resumen",tabApplications:"Solicitudes",tabDistributors:"Distribuidores",
  tabCatalog:"Catálogo",tabOrders:"Pedidos",tabPayments:"Pagos",
  tabBrandMarket:"Mercado de marcas",tabMyCatalog:"Mi catálogo",tabMyOrders:"Mis pedidos",
  overviewTitle:"Resumen del mercado europeo",overviewSub:"Visibilidad en tiempo real · Hub: Turín, Italia · 400–500 palés/mes",
  statTerritories:"Territorios activos",statTerritoriesSub:"Toda Europa",
  statDistributors:"Distribuidores",statDistributorsSub:"pendientes de aprobación",
  statRevenue:"Ingresos mensuales",statRevenueSub:"↑ 18 % vs mes anterior",
  statPallets:"Palés / mes",statPalletsSub:"Media hub de Turín",
  statAlerts:"Alertas de precio",statAlertsSub:"2 de gravedad alta",
  priceAlertsTitle:"Alertas de integridad de precios",actBtn:"Actuar",
  hubStockTitle:"Estado del stock del hub · Turín",
  hubTotalSkus:"SKU totales en el hub",hubTotalSkusVal:"87 referencias",
  hubTotalUnits:"Unidades totales en stock",hubTotalUnitsVal:"18.430 unidades",
  hubPallets:"Palés ocupados",hubPalletsVal:"312 / 500 espacios",
  hubNextContainer:"Próximo contenedor (ETA)",hubNextContainerVal:"4 de junio desde Dubái",
  hubOrdersToday:"Pedidos procesando hoy",hubOrdersTodayVal:"7 activos",
  hubConsignment:"Valor en depósito",hubConsignmentVal:"1,84 M€",
  appTitle:"Solicitudes de distribuidores",appSub:"Revisa, aprueba o rechaza las empresas que solicitan acceso a tu catálogo",
  submitted:"Enviada",territory:"Territorio",type:"Tipo",annualRevenue:"Ingresos anuales",yearsActive:"Años activos",years:"años",
  requestedBrands:"Marcas solicitadas:",documentsUploaded:"Documentos subidos:",
  approveBtn:"✓ Aprobar y habilitar acceso",declineBtn:"✗ Rechazar",askMoreBtn:"Pedir más información",
  approvedMsg:"✓ Aprobado — credenciales enviadas automáticamente al distribuidor",
  rejectedMsgDist:"✗ Rechazado — el distribuidor ha sido notificado por correo",
  distTitle:"Distribuidores activos",distSub:"Un socio autorizado por territorio · Cero solapamiento garantizado por la plataforma",
  colFlag:"Bandera",colCompany:"Empresa",colTerritory:"Territorio",colBrands:"Marcas autorizadas",
  colOrders:"Pedidos",colRevenue:"Ingresos",colStatus:"Estado",
  catTitle:"Catálogo de productos",catSub:"Todos los SKU disponibles en el hub europeo de Turín · Stock en depósito · Cantidades en tiempo real",
  colSku:"SKU",colProduct:"Producto",colSize:"Formato",colCategory:"Categoría",colPrice:"Precio unitario",
  colStock:"Stock",colPerPallet:"Por palé",colMoq:"MOQ",
  ordersTitle:"Todos los pedidos europeos",ordersSub:"Cada pedido enrutado por el hub NexusHub · Turín, Italia · Objetivo: envío en 48 h",
  statOrdersMonth:"Pedidos este mes",statOrdersMonthSub:"↑ 23 vs mes anterior",
  statPalletsShipped:"Palés enviados",statPalletsShippedSub:"Mayo 2024",
  statTotalValue:"Valor total",statTotalValueSub:"Mayo 2024",
  statAvgDispatch:"Envío medio",statAvgDispatchVal:"1,4 días",statAvgDispatchSub:"Desde la confirmación",
  colOrderId:"ID de pedido",colDistributor:"Distribuidor",colCountry:"País",colItems:"Artículos",
  colPallets:"Palés",colValue:"Valor",colDate:"Fecha",colEta:"ETA",delivered:"Entregado",
  paymentsTitle:"Flujo de pagos",paymentsSub:"El distribuidor paga a la marca directamente vía SEPA Instant · Comisión NexusHub dividida automáticamente vía PSD2",
  payArchLabel:"Arquitectura de pago automatizada · Cero intervención manual",
  payTransLog:"Registro de transacciones — División automática por pedido",
  colGross:"Importe bruto",colBrandShare:"→ La marca recibe",colNexusFee:"→ Comisión NexusHub",
  colFeePercent:"% comisión",colMethod:"Método",colTime:"Hora",
  nodeDistributor:"Distribuidor",nodeDistributorSub:"Realiza el pedido en NexusHub",
  nodeSepa:"SEPA Instant",nodeSepaSub:"Transferencia directa a la marca",
  nodeLattafa:"Cuenta de la marca",nodeLattafaSub:"Recibe el pago completo",
  nodeWebhook:"Webhook PSD2",nodeWebhookSub:"Notificación automática en segundos",
  nodeNexus:"NexusHub",nodeNexusSub:"Calcula la comisión automáticamente",
  nodeGiga:"GigaTrade",nodeGigaSub:"Comisión ~11,4 % acreditada",
  marketTitle:"Mercado de marcas",marketSub:"Todas las marcas disponibles en NexusHub · Verde = ya autorizadas para tu territorio",
  skusLabel:"SKU",euDistLabel:"Dist. UE",categoryLabel:"Categoría",
  viewCatalogBtn:"Ver mi catálogo →",requestSentMsg:"⏳ Solicitud enviada — esperando aprobación de la marca",requestAccessBtn:"+ Solicitar acceso",
  myCatTitle:"Mi catálogo autorizado",myCatSub:"Marcas autorizadas para tu territorio · Stock listo en el hub de Turín · Entrega 48 h",
  colBrand:"Marca",colAction:"Acción",addBtn:"+ Añadir",cartLabel:"Realizar pedido",cartSub1:"48 h desde Turín · Paga vía SEPA Instant",
  myOrdersTitle:"Mis pedidos",myOrdersSub:"Todos los pedidos atendidos desde el hub europeo NexusHub · Turín, Italia",
  statMyOrders:"Pedidos este mes",statMyOrdersSub:"Mayo 2024",statMySpent:"Total gastado",statMySpentSub:"Mayo 2024",
  statMyDelivery:"Entrega media",statMyDeliveryVal:"1,6 días",statMyPallets:"Palés recibidos",statMyPalletsSub:"Mayo 2024",
  colPayment:"Pago",deliveredCheck:"✓ Entregado",
  adminTitle:"Resumen de la plataforma",adminSub:"Vista global de todas las marcas, distribuidores y transacciones",
  statBrands:"Marcas activas",statBrandsSub:"2 en incorporación",statAllDist:"Distribuidores totales",statAllDistSub:"Toda Europa",
  statGmv:"GMV de la plataforma",statGmvSub:"Mayo 2024",statNexusRev:"Ingresos NexusHub",statNexusRevSub:"~11,4 % comisión media",
  statAllPallets:"Palés / mes",statAllPalletsSub:"Todas las marcas",
  adminBrandsTitle:"Marcas activas en la plataforma",adminRevenueTitle:"Ingresos NexusHub por marca (mayo)",distributorsLabel:"distribuidores",
};
T.de = {
  loginSubtitle:"Globale B2B-Vertriebsplattform",accessAs:"Anmelden als",
  roleBrandLabel:"Marke",roleBrandDesc:"Volle Marktsicht und Händlersteuerung",
  roleDistLabel:"Händler",roleDistDesc:"Ihre autorisierten Marken und Ihr Gebiet",
  roleAdminLabel:"NexusHub Admin",roleAdminDesc:"Plattformweite Aufsicht",
  demoMode:"Demo",demoTryAs:"— Als Gast testen",enterPlatform:"Plattform betreten →",authenticating:"Authentifizierung…",
  emailLabel:"E-Mail",passwordLabel:"Passwort",loginBtn:"Anmelden",
  loggingIn:"Anmeldung…",loginError:"Ungültige E-Mail oder Passwort",
  pendingTitle:"Konto wartet auf Freigabe",pendingMsg:"Ihre Dokumente sind eingegangen. Sie werden per E-Mail benachrichtigt, sobald Ihr Konto freigegeben ist.",
  rejectedTitle:"Konto nicht freigegeben",rejectedMsg:"Ihre Zugangsanfrage wurde abgelehnt.",
  registerBrand:"Als Marke registrieren",registerDist:"Als Händler registrieren",
  alreadyAccount:"Haben Sie bereits ein Konto?",backToLogin:"Zurück zur Anmeldung",
  registerTitle:"Registrierung",step1:"Konto",step2:"Unternehmen und Dokumente",
  fullName:"Ansprechpartner",companyName:"Firmenname",phone:"Telefon",country:"Land",
  confirmPassword:"Passwort bestätigen",passwordMismatch:"Die Passwörter stimmen nicht überein",passwordShort:"Das Passwort muss mindestens 8 Zeichen lang sein",
  docsRequired:"Erforderliche Dokumente",clickToUpload:"Zum Hochladen von PDF oder Bild klicken",
  submitRequest:"Anfrage senden",sending:"Senden…",
  successTitle:"Registrierung abgeschlossen",successMsg:"Ihre Anfrage wurde gesendet. Unser Team prüft Ihre Dokumente und benachrichtigt Sie innerhalb von 24-48 Stunden per E-Mail.",
  portalBrand:"Marken-Portal",portalDistributor:"Händler-Portal",portalAdmin:"Admin",logout:"Abmelden",
  tabOverview:"Übersicht",tabApplications:"Bewerbungen",tabDistributors:"Händler",
  tabCatalog:"Katalog",tabOrders:"Bestellungen",tabPayments:"Zahlungen",
  tabBrandMarket:"Marken-Marktplatz",tabMyCatalog:"Mein Katalog",tabMyOrders:"Meine Bestellungen",
  overviewTitle:"Übersicht europäischer Markt",overviewSub:"Echtzeit-Sicht · Hub: Turin, Italien · 400–500 Paletten/Monat",
  statTerritories:"Aktive Gebiete",statTerritoriesSub:"Europaweit",
  statDistributors:"Händler",statDistributorsSub:"wartend auf Freigabe",
  statRevenue:"Monatsumsatz",statRevenueSub:"↑ 18 % vs Vormonat",
  statPallets:"Paletten / Monat",statPalletsSub:"Ø Hub Turin",
  statAlerts:"Preisalarme",statAlertsSub:"2 mit hoher Priorität",
  priceAlertsTitle:"Preisintegritäts-Alarme",actBtn:"Handeln",
  hubStockTitle:"Hub-Bestandsstatus · Turin",
  hubTotalSkus:"SKUs gesamt im Hub",hubTotalSkusVal:"87 Referenzen",
  hubTotalUnits:"Einheiten gesamt auf Lager",hubTotalUnitsVal:"18.430 Einheiten",
  hubPallets:"Belegte Paletten",hubPalletsVal:"312 / 500 Plätze",
  hubNextContainer:"Nächster Container (ETA)",hubNextContainerVal:"4. Juni aus Dubai",
  hubOrdersToday:"Heute bearbeitete Bestellungen",hubOrdersTodayVal:"7 aktiv",
  hubConsignment:"Konsignationswert",hubConsignmentVal:"1,84 Mio. €",
  appTitle:"Händlerbewerbungen",appSub:"Prüfen, genehmigen oder ablehnen Sie Unternehmen, die Zugang zu Ihrem Katalog beantragen",
  submitted:"Eingereicht",territory:"Gebiet",type:"Typ",annualRevenue:"Jahresumsatz",yearsActive:"Jahre aktiv",years:"Jahre",
  requestedBrands:"Angefragte Marken:",documentsUploaded:"Hochgeladene Dokumente:",
  approveBtn:"✓ Genehmigen und Zugang aktivieren",declineBtn:"✗ Ablehnen",askMoreBtn:"Weitere Informationen anfordern",
  approvedMsg:"✓ Genehmigt — Zugangsdaten automatisch an den Händler gesendet",
  rejectedMsgDist:"✗ Abgelehnt — der Händler wurde per E-Mail benachrichtigt",
  distTitle:"Aktive Händler",distSub:"Ein autorisierter Partner pro Gebiet · Keine Überschneidung, von der Plattform garantiert",
  colFlag:"Flagge",colCompany:"Unternehmen",colTerritory:"Gebiet",colBrands:"Autorisierte Marken",
  colOrders:"Bestellungen",colRevenue:"Umsatz",colStatus:"Status",
  catTitle:"Produktkatalog",catSub:"Alle SKUs im europäischen Hub Turin verfügbar · Konsignationslager · Mengen in Echtzeit",
  colSku:"SKU",colProduct:"Produkt",colSize:"Format",colCategory:"Kategorie",colPrice:"Stückpreis",
  colStock:"Bestand",colPerPallet:"Pro Palette",colMoq:"MBM",
  ordersTitle:"Alle europäischen Bestellungen",ordersSub:"Jede Bestellung über den NexusHub-Hub · Turin, Italien · Ziel: Versand in 48 Std.",
  statOrdersMonth:"Bestellungen diesen Monat",statOrdersMonthSub:"↑ 23 vs Vormonat",
  statPalletsShipped:"Versandte Paletten",statPalletsShippedSub:"Mai 2024",
  statTotalValue:"Gesamtwert",statTotalValueSub:"Mai 2024",
  statAvgDispatch:"Ø Versand",statAvgDispatchVal:"1,4 Tage",statAvgDispatchSub:"Ab Bestätigung",
  colOrderId:"Bestell-Nr.",colDistributor:"Händler",colCountry:"Land",colItems:"Artikel",
  colPallets:"Paletten",colValue:"Wert",colDate:"Datum",colEta:"ETA",delivered:"Geliefert",
  paymentsTitle:"Zahlungsfluss",paymentsSub:"Der Händler zahlt die Marke direkt via SEPA Instant · NexusHub-Gebühr automatisch via PSD2 aufgeteilt",
  payArchLabel:"Automatisierte Zahlungsarchitektur · Kein manueller Eingriff",
  payTransLog:"Transaktionsprotokoll — Automatische Aufteilung pro Bestellung",
  colGross:"Bruttobetrag",colBrandShare:"→ Marke erhält",colNexusFee:"→ NexusHub-Gebühr",
  colFeePercent:"Gebühr %",colMethod:"Methode",colTime:"Zeit",
  nodeDistributor:"Händler",nodeDistributorSub:"Gibt Bestellung auf NexusHub auf",
  nodeSepa:"SEPA Instant",nodeSepaSub:"Direktüberweisung an die Marke",
  nodeLattafa:"Markenkonto",nodeLattafaSub:"Erhält die volle Zahlung",
  nodeWebhook:"PSD2-Webhook",nodeWebhookSub:"Automatische Benachrichtigung in Sekunden",
  nodeNexus:"NexusHub",nodeNexusSub:"Berechnet die Gebühr automatisch",
  nodeGiga:"GigaTrade",nodeGigaSub:"Gebühr ~11,4 % gutgeschrieben",
  marketTitle:"Marken-Marktplatz",marketSub:"Alle Marken auf NexusHub verfügbar · Grün = bereits für Ihr Gebiet autorisiert",
  skusLabel:"SKUs",euDistLabel:"EU-Händler",categoryLabel:"Kategorie",
  viewCatalogBtn:"Meinen Katalog ansehen →",requestSentMsg:"⏳ Anfrage gesendet — wartet auf Markenfreigabe",requestAccessBtn:"+ Zugang anfragen",
  myCatTitle:"Mein autorisierter Katalog",myCatSub:"Autorisierte Marken für Ihr Gebiet · Bestand bereit im Hub Turin · Lieferung 48 Std.",
  colBrand:"Marke",colAction:"Aktion",addBtn:"+ Hinzufügen",cartLabel:"Bestellung aufgeben",cartSub1:"48 Std. ab Turin · Zahlung via SEPA Instant",
  myOrdersTitle:"Meine Bestellungen",myOrdersSub:"Alle Bestellungen vom europäischen NexusHub-Hub · Turin, Italien",
  statMyOrders:"Bestellungen diesen Monat",statMyOrdersSub:"Mai 2024",statMySpent:"Gesamtausgaben",statMySpentSub:"Mai 2024",
  statMyDelivery:"Ø Lieferung",statMyDeliveryVal:"1,6 Tage",statMyPallets:"Erhaltene Paletten",statMyPalletsSub:"Mai 2024",
  colPayment:"Zahlung",deliveredCheck:"✓ Geliefert",
  adminTitle:"Plattform-Übersicht",adminSub:"Globale Sicht über alle Marken, Händler und Transaktionen",
  statBrands:"Aktive Marken",statBrandsSub:"2 im Onboarding",statAllDist:"Händler gesamt",statAllDistSub:"Europaweit",
  statGmv:"Plattform-GMV",statGmvSub:"Mai 2024",statNexusRev:"NexusHub-Umsatz",statNexusRevSub:"~11,4 % Ø Gebühr",
  statAllPallets:"Paletten / Monat",statAllPalletsSub:"Alle Marken",
  adminBrandsTitle:"Aktive Marken auf der Plattform",adminRevenueTitle:"NexusHub-Umsatz nach Marke (Mai)",distributorsLabel:"Händler",
};
T.zh = {
  loginSubtitle:"全球B2B分销平台",accessAs:"登录身份",
  roleBrandLabel:"品牌",roleBrandDesc:"全面的市场可见性与分销商管理",
  roleDistLabel:"分销商",roleDistDesc:"您授权的品牌与区域",
  roleAdminLabel:"NexusHub 管理员",roleAdminDesc:"全平台监管",
  demoMode:"演示",demoTryAs:"— 以访客身份体验",enterPlatform:"进入平台 →",authenticating:"正在验证…",
  emailLabel:"邮箱",passwordLabel:"密码",loginBtn:"登录",
  loggingIn:"登录中…",loginError:"邮箱或密码无效",
  pendingTitle:"账户待审批",pendingMsg:"我们已收到您的文件。账户通过审批后将通过邮件通知您。",
  rejectedTitle:"账户未通过",rejectedMsg:"您的访问申请已被拒绝。",
  registerBrand:"注册为品牌",registerDist:"注册为分销商",
  alreadyAccount:"已有账户？",backToLogin:"返回登录",
  registerTitle:"注册",step1:"账户",step2:"公司与文件",
  fullName:"联系人姓名",companyName:"公司名称",phone:"电话",country:"国家",
  confirmPassword:"确认密码",passwordMismatch:"两次密码不一致",passwordShort:"密码至少需8个字符",
  docsRequired:"所需文件",clickToUpload:"点击上传PDF或图片",
  submitRequest:"提交申请",sending:"发送中…",
  successTitle:"注册完成",successMsg:"您的申请已提交。我们的团队将核实您的文件，并在24-48小时内通过邮件通知您。",
  portalBrand:"品牌门户",portalDistributor:"分销商门户",portalAdmin:"管理员",logout:"退出",
  tabOverview:"概览",tabApplications:"申请",tabDistributors:"分销商",
  tabCatalog:"目录",tabOrders:"订单",tabPayments:"付款",
  tabBrandMarket:"品牌市场",tabMyCatalog:"我的目录",tabMyOrders:"我的订单",
  overviewTitle:"欧洲市场概览",overviewSub:"实时可见 · 中心：意大利都灵 · 每月400–500托盘",
  statTerritories:"活跃区域",statTerritoriesSub:"覆盖全欧洲",
  statDistributors:"分销商",statDistributorsSub:"待审批",
  statRevenue:"月营收",statRevenueSub:"↑ 较上月18%",
  statPallets:"托盘/月",statPalletsSub:"都灵中心均值",
  statAlerts:"价格警报",statAlertsSub:"2项高严重度",
  priceAlertsTitle:"价格完整性警报",actBtn:"处理",
  hubStockTitle:"中心库存状态 · 都灵",
  hubTotalSkus:"中心SKU总数",hubTotalSkusVal:"87个条目",
  hubTotalUnits:"库存总件数",hubTotalUnitsVal:"18,430件",
  hubPallets:"已占用托盘",hubPalletsVal:"312 / 500 位",
  hubNextContainer:"下一集装箱(预计)",hubNextContainerVal:"6月4日 自迪拜",
  hubOrdersToday:"今日处理订单",hubOrdersTodayVal:"7个进行中",
  hubConsignment:"寄售价值",hubConsignmentVal:"€184万",
  appTitle:"分销商申请",appSub:"审核、批准或拒绝申请访问您目录的公司",
  submitted:"已提交",territory:"区域",type:"类型",annualRevenue:"年营收",yearsActive:"经营年数",years:"年",
  requestedBrands:"申请的品牌：",documentsUploaded:"已上传文件：",
  approveBtn:"✓ 批准并开通访问",declineBtn:"✗ 拒绝",askMoreBtn:"索取更多信息",
  approvedMsg:"✓ 已批准 — 登录凭证已自动发送给分销商",
  rejectedMsgDist:"✗ 已拒绝 — 已通过邮件通知分销商",
  distTitle:"活跃分销商",distSub:"每个区域一个授权伙伴 · 平台保证零重叠",
  colFlag:"国旗",colCompany:"公司",colTerritory:"区域",colBrands:"授权品牌",
  colOrders:"订单",colRevenue:"营收",colStatus:"状态",
  catTitle:"产品目录",catSub:"都灵欧洲中心的所有SKU · 寄售库存 · 实时数量",
  colSku:"SKU",colProduct:"产品",colSize:"规格",colCategory:"类别",colPrice:"单价",
  colStock:"库存",colPerPallet:"每托盘",colMoq:"起订量",
  ordersTitle:"所有欧洲订单",ordersSub:"每笔订单经NexusHub中心 · 意大利都灵 · 目标：48小时发货",
  statOrdersMonth:"本月订单",statOrdersMonthSub:"↑ 较上月23",
  statPalletsShipped:"已发托盘",statPalletsShippedSub:"2024年5月",
  statTotalValue:"总价值",statTotalValueSub:"2024年5月",
  statAvgDispatch:"平均发货",statAvgDispatchVal:"1.4天",statAvgDispatchSub:"自确认起",
  colOrderId:"订单编号",colDistributor:"分销商",colCountry:"国家",colItems:"件数",
  colPallets:"托盘",colValue:"价值",colDate:"日期",colEta:"预计到达",delivered:"已送达",
  paymentsTitle:"付款流程",paymentsSub:"分销商通过SEPA Instant直接付款给品牌 · NexusHub费用通过PSD2自动分账",
  payArchLabel:"自动化付款架构 · 零人工干预",
  payTransLog:"交易日志 — 每笔订单自动分账",
  colGross:"总金额",colBrandShare:"→ 品牌收到",colNexusFee:"→ NexusHub费用",
  colFeePercent:"费率%",colMethod:"方式",colTime:"时间",
  nodeDistributor:"分销商",nodeDistributorSub:"在NexusHub下单",
  nodeSepa:"SEPA Instant",nodeSepaSub:"直接转账给品牌",
  nodeLattafa:"品牌账户",nodeLattafaSub:"收到全额付款",
  nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"数秒内自动通知",
  nodeNexus:"NexusHub",nodeNexusSub:"自动计算费用",
  nodeGiga:"GigaTrade",nodeGigaSub:"约11.4%费用已入账",
  marketTitle:"品牌市场",marketSub:"NexusHub上的所有品牌 · 绿色=已为您的区域授权",
  skusLabel:"SKU",euDistLabel:"欧盟分销商",categoryLabel:"类别",
  viewCatalogBtn:"查看我的目录 →",requestSentMsg:"⏳ 申请已发送 — 等待品牌批准",requestAccessBtn:"+ 申请访问",
  myCatTitle:"我的授权目录",myCatSub:"为您区域授权的品牌 · 库存在都灵中心备妥 · 48小时送达",
  colBrand:"品牌",colAction:"操作",addBtn:"+ 添加",cartLabel:"下单",cartSub1:"都灵48小时发货 · 通过SEPA Instant付款",
  myOrdersTitle:"我的订单",myOrdersSub:"所有订单由NexusHub欧洲中心履行 · 意大利都灵",
  statMyOrders:"本月订单",statMyOrdersSub:"2024年5月",statMySpent:"总支出",statMySpentSub:"2024年5月",
  statMyDelivery:"平均送达",statMyDeliveryVal:"1.6天",statMyPallets:"已收托盘",statMyPalletsSub:"2024年5月",
  colPayment:"付款",deliveredCheck:"✓ 已送达",
  adminTitle:"平台概览",adminSub:"所有品牌、分销商和交易的全局视图",
  statBrands:"活跃品牌",statBrandsSub:"2个入驻中",statAllDist:"分销商总数",statAllDistSub:"覆盖全欧洲",
  statGmv:"平台GMV",statGmvSub:"2024年5月",statNexusRev:"NexusHub营收",statNexusRevSub:"约11.4%平均费率",
  statAllPallets:"托盘/月",statAllPalletsSub:"所有品牌",
  adminBrandsTitle:"平台上的活跃品牌",adminRevenueTitle:"按品牌划分的NexusHub营收(5月)",distributorsLabel:"分销商",
};
T.ar = {
  loginSubtitle:"منصة التوزيع العالمية بين الشركات",accessAs:"الدخول بصفة",
  roleBrandLabel:"علامة تجارية",roleBrandDesc:"رؤية كاملة للسوق والتحكم في الموزعين",
  roleDistLabel:"موزّع",roleDistDesc:"علاماتك المعتمدة ومنطقتك",
  roleAdminLabel:"مشرف NexusHub",roleAdminDesc:"إشراف على كامل المنصة",
  demoMode:"عرض",demoTryAs:"— الدخول كضيف",enterPlatform:"الدخول إلى المنصة ←",authenticating:"جارٍ التحقق…",
  emailLabel:"البريد الإلكتروني",passwordLabel:"كلمة المرور",loginBtn:"تسجيل الدخول",
  loggingIn:"جارٍ تسجيل الدخول…",loginError:"البريد الإلكتروني أو كلمة المرور غير صحيحة",
  pendingTitle:"الحساب بانتظار الموافقة",pendingMsg:"تم استلام مستنداتك. سيتم إشعارك عبر البريد الإلكتروني عند الموافقة على حسابك.",
  rejectedTitle:"الحساب غير معتمد",rejectedMsg:"تم رفض طلب وصولك.",
  registerBrand:"التسجيل كعلامة تجارية",registerDist:"التسجيل كموزّع",
  alreadyAccount:"هل لديك حساب بالفعل؟",backToLogin:"العودة إلى تسجيل الدخول",
  registerTitle:"التسجيل",step1:"الحساب",step2:"الشركة والمستندات",
  fullName:"اسم جهة الاتصال",companyName:"اسم الشركة",phone:"الهاتف",country:"الدولة",
  confirmPassword:"تأكيد كلمة المرور",passwordMismatch:"كلمتا المرور غير متطابقتين",passwordShort:"يجب أن تتكوّن كلمة المرور من 8 أحرف على الأقل",
  docsRequired:"المستندات المطلوبة",clickToUpload:"انقر لرفع ملف PDF أو صورة",
  submitRequest:"إرسال الطلب",sending:"جارٍ الإرسال…",
  successTitle:"اكتمل التسجيل",successMsg:"تم إرسال طلبك بنجاح. سيتحقق فريقنا من مستنداتك ويُشعرك عبر البريد الإلكتروني خلال 24-48 ساعة.",
  portalBrand:"بوابة العلامة التجارية",portalDistributor:"بوابة الموزّع",portalAdmin:"المشرف",logout:"تسجيل الخروج",
  tabOverview:"نظرة عامة",tabApplications:"الطلبات",tabDistributors:"الموزّعون",
  tabCatalog:"الكتالوج",tabOrders:"الطلبات",tabPayments:"المدفوعات",
  tabBrandMarket:"سوق العلامات التجارية",tabMyCatalog:"كتالوجي",tabMyOrders:"طلباتي",
  overviewTitle:"نظرة عامة على السوق الأوروبية",overviewSub:"رؤية فورية · المركز: تورينو، إيطاليا · 400–500 منصة شهريًا",
  statTerritories:"المناطق النشطة",statTerritoriesSub:"في كل أوروبا",
  statDistributors:"الموزّعون",statDistributorsSub:"بانتظار الموافقة",
  statRevenue:"الإيراد الشهري",statRevenueSub:"↑ 18% مقارنة بالشهر الماضي",
  statPallets:"المنصّات / الشهر",statPalletsSub:"متوسط مركز تورينو",
  statAlerts:"تنبيهات الأسعار",statAlertsSub:"2 بخطورة عالية",
  priceAlertsTitle:"تنبيهات سلامة الأسعار",actBtn:"إجراء",
  hubStockTitle:"حالة مخزون المركز · تورينو",
  hubTotalSkus:"إجمالي وحدات SKU في المركز",hubTotalSkusVal:"87 مرجعًا",
  hubTotalUnits:"إجمالي الوحدات في المخزون",hubTotalUnitsVal:"18,430 وحدة",
  hubPallets:"المنصّات المشغولة",hubPalletsVal:"312 / 500 موضع",
  hubNextContainer:"الحاوية التالية (الوصول المتوقع)",hubNextContainerVal:"4 يونيو من دبي",
  hubOrdersToday:"الطلبات قيد المعالجة اليوم",hubOrdersTodayVal:"7 نشطة",
  hubConsignment:"قيمة البضاعة بالأمانة",hubConsignmentVal:"1.84 مليون €",
  appTitle:"طلبات الموزّعين",appSub:"راجع واعتمد أو ارفض الشركات التي تطلب الوصول إلى كتالوجك",
  submitted:"أُرسلت",territory:"المنطقة",type:"النوع",annualRevenue:"الإيراد السنوي",yearsActive:"سنوات النشاط",years:"سنوات",
  requestedBrands:"العلامات المطلوبة:",documentsUploaded:"المستندات المرفوعة:",
  approveBtn:"✓ الموافقة وتفعيل الوصول",declineBtn:"✗ رفض",askMoreBtn:"طلب مزيد من المعلومات",
  approvedMsg:"✓ تمت الموافقة — أُرسلت بيانات الدخول تلقائيًا إلى الموزّع",
  rejectedMsgDist:"✗ مرفوض — تم إشعار الموزّع عبر البريد الإلكتروني",
  distTitle:"الموزّعون النشطون",distSub:"شريك معتمد واحد لكل منطقة · لا تداخل، مضمون من المنصة",
  colFlag:"العلم",colCompany:"الشركة",colTerritory:"المنطقة",colBrands:"العلامات المعتمدة",
  colOrders:"الطلبات",colRevenue:"الإيراد",colStatus:"الحالة",
  catTitle:"كتالوج المنتجات",catSub:"جميع وحدات SKU المتاحة في مركز تورينو الأوروبي · مخزون بالأمانة · كميات فورية",
  colSku:"SKU",colProduct:"المنتج",colSize:"الحجم",colCategory:"الفئة",colPrice:"سعر الوحدة",
  colStock:"المخزون",colPerPallet:"لكل منصة",colMoq:"الحد الأدنى للطلب",
  ordersTitle:"جميع الطلبات الأوروبية",ordersSub:"كل طلب يمر عبر مركز NexusHub · تورينو، إيطاليا · الهدف: الشحن خلال 48 ساعة",
  statOrdersMonth:"طلبات هذا الشهر",statOrdersMonthSub:"↑ 23 مقارنة بالشهر الماضي",
  statPalletsShipped:"المنصّات المشحونة",statPalletsShippedSub:"مايو 2024",
  statTotalValue:"القيمة الإجمالية",statTotalValueSub:"مايو 2024",
  statAvgDispatch:"متوسط الشحن",statAvgDispatchVal:"1.4 يوم",statAvgDispatchSub:"من تأكيد الطلب",
  colOrderId:"رقم الطلب",colDistributor:"الموزّع",colCountry:"الدولة",colItems:"العناصر",
  colPallets:"المنصّات",colValue:"القيمة",colDate:"التاريخ",colEta:"الوصول المتوقع",delivered:"تم التسليم",
  paymentsTitle:"تدفق المدفوعات",paymentsSub:"يدفع الموزّع للعلامة مباشرة عبر SEPA Instant · تُقسَّم عمولة NexusHub تلقائيًا عبر PSD2",
  payArchLabel:"بنية دفع مؤتمتة · بدون تدخل يدوي",
  payTransLog:"سجل المعاملات — تقسيم تلقائي لكل طلب",
  colGross:"المبلغ الإجمالي",colBrandShare:"← تستلم العلامة",colNexusFee:"← عمولة NexusHub",
  colFeePercent:"% العمولة",colMethod:"الطريقة",colTime:"الوقت",
  nodeDistributor:"الموزّع",nodeDistributorSub:"يقدّم الطلب على NexusHub",
  nodeSepa:"SEPA Instant",nodeSepaSub:"تحويل مباشر إلى العلامة",
  nodeLattafa:"حساب العلامة",nodeLattafaSub:"يستلم كامل المبلغ",
  nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"إشعار تلقائي خلال ثوانٍ",
  nodeNexus:"NexusHub",nodeNexusSub:"يحسب العمولة تلقائيًا",
  nodeGiga:"GigaTrade",nodeGigaSub:"عمولة ~11.4% مُضافة",
  marketTitle:"سوق العلامات التجارية",marketSub:"جميع العلامات المتاحة على NexusHub · الأخضر = معتمدة بالفعل لمنطقتك",
  skusLabel:"SKU",euDistLabel:"موزّع الاتحاد الأوروبي",categoryLabel:"الفئة",
  viewCatalogBtn:"عرض كتالوجي ←",requestSentMsg:"⏳ تم إرسال الطلب — بانتظار موافقة العلامة",requestAccessBtn:"+ طلب الوصول",
  myCatTitle:"كتالوجي المعتمد",myCatSub:"العلامات المعتمدة لمنطقتك · المخزون جاهز في مركز تورينو · التسليم خلال 48 ساعة",
  colBrand:"العلامة",colAction:"إجراء",addBtn:"+ إضافة",cartLabel:"تقديم الطلب",cartSub1:"48 ساعة من تورينو · ادفع عبر SEPA Instant",
  myOrdersTitle:"طلباتي",myOrdersSub:"جميع الطلبات تُنفَّذ من مركز NexusHub الأوروبي · تورينو، إيطاليا",
  statMyOrders:"طلبات هذا الشهر",statMyOrdersSub:"مايو 2024",statMySpent:"إجمالي الإنفاق",statMySpentSub:"مايو 2024",
  statMyDelivery:"متوسط التسليم",statMyDeliveryVal:"1.6 يوم",statMyPallets:"المنصّات المستلمة",statMyPalletsSub:"مايو 2024",
  colPayment:"الدفع",deliveredCheck:"✓ تم التسليم",
  adminTitle:"نظرة عامة على المنصة",adminSub:"رؤية شاملة لكل العلامات والموزّعين والمعاملات",
  statBrands:"العلامات النشطة",statBrandsSub:"2 قيد الإعداد",statAllDist:"إجمالي الموزّعين",statAllDistSub:"في كل أوروبا",
  statGmv:"إجمالي قيمة البضائع للمنصة",statGmvSub:"مايو 2024",statNexusRev:"إيراد NexusHub",statNexusRevSub:"~11.4% متوسط العمولة",
  statAllPallets:"المنصّات / الشهر",statAllPalletsSub:"كل العلامات",
  adminBrandsTitle:"العلامات النشطة على المنصة",adminRevenueTitle:"إيراد NexusHub حسب العلامة (مايو)",distributorsLabel:"موزّعون",
};
// Safety net: any key missing in a language falls back to EN at lookup time (see t()).
Object.assign(T.en, { payReceivedKpi:"Total received", payFeeKpi:"Total fees", payCountKpi:"Payments", payEmptyTitle:"No payments yet", payEmptyMsg:"Settled payments for your orders will appear here." });
Object.assign(T.it, { payReceivedKpi:"Totale ricevuto", payFeeKpi:"Totale commissioni", payCountKpi:"Pagamenti", payEmptyTitle:"Nessun pagamento ancora", payEmptyMsg:"Qui compariranno i pagamenti liquidati per i tuoi ordini." });
Object.assign(T.fr, { payReceivedKpi:"Total reçu", payFeeKpi:"Total commissions", payCountKpi:"Paiements", payEmptyTitle:"Aucun paiement pour le moment", payEmptyMsg:"Les paiements réglés pour vos commandes apparaîtront ici." });
Object.assign(T.es, { payReceivedKpi:"Total recibido", payFeeKpi:"Total comisiones", payCountKpi:"Pagos", payEmptyTitle:"Aún no hay pagos", payEmptyMsg:"Aquí aparecerán los pagos liquidados de tus pedidos." });
Object.assign(T.de, { payReceivedKpi:"Erhalten gesamt", payFeeKpi:"Gebühren gesamt", payCountKpi:"Zahlungen", payEmptyTitle:"Noch keine Zahlungen", payEmptyMsg:"Abgewickelte Zahlungen für Ihre Bestellungen erscheinen hier." });
Object.assign(T.zh, { payReceivedKpi:"已收总额", payFeeKpi:"费用总额", payCountKpi:"付款笔数", payEmptyTitle:"暂无付款", payEmptyMsg:"您订单的已结算付款将显示在此处。" });
Object.assign(T.ar, { payReceivedKpi:"إجمالي المستلَم", payFeeKpi:"إجمالي العمولات", payCountKpi:"المدفوعات", payEmptyTitle:"لا توجد مدفوعات بعد", payEmptyMsg:"ستظهر هنا المدفوعات المسددة لطلباتك." });







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

const TrustBadge = ({ score, state }) => {
  const s = (score===null||score===undefined) ? 200 : score;
  let tier, col;
  if (s >= 1000) { tier="Platinum"; col=C.blue; }
  else if (s >= 700) { tier="Gold"; col=C.gold; }
  else if (s >= 400) { tier="Silver"; col=C.textMuted; }
  else if (s >= 200) { tier="Bronze"; col=C.goldDim; }
  else if (s >= 100) { tier="Osservato"; col=C.gold; }
  else { tier="A rischio"; col=C.red; }
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
      <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, background:col+"22", color:col, border:`1px solid ${col}55`, whiteSpace:"nowrap" }}>{tier} · {s}</span>
      {state==="suspended" && <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:5, background:C.red+"22", color:C.red, border:`1px solid ${C.red}55` }}>SOSPESO</span>}
      {state==="at_risk" && <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:5, background:C.gold+"22", color:C.gold }}>A RISCHIO</span>}
    </span>
  );
};

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
                💳 {isBrand ? "Dati Bancari per Ricezione Pagamenti" : "Indirizzo di Spedizione e Dati Bancari"}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {(!isBrand ? [
                  { label:"Indirizzo (Via/Piazza)", val:accountHolder, set:setAccountHolder, placeholder:"es. Via Roma 1" },
                  { label:"Città", val:bankName, set:setBankName, placeholder:"es. Bucarest" },
                  { label:"CAP", val:iban, set:setIban, placeholder:"es. 010101" },
                  { label:"Provincia/Regione", val:swiftBic, set:setSwiftBic, placeholder:"es. Sector 1" },
                ] : [
                  { label:"Intestatario Conto", val:accountHolder, set:setAccountHolder, placeholder:"Nome/Ragione Sociale" },
                  { label:"Banca", val:bankName, set:setBankName, placeholder:"es. Unicredit, Intesa..." },
                  { label:"IBAN", val:iban, set:setIban, placeholder:"IT60 X054 2811 1010 0000 0123 456" },
                  { label:"SWIFT/BIC (opzionale)", val:swiftBic, set:setSwiftBic, placeholder:"es. UNCRITMM" },
                ]).map(({label,val,set,placeholder}) => (
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
const InventoryForecast = ({ products = [], orders = [] }) => {
  const [leadDays, setLeadDays] = useState(14);
  const today = new Date();
  const cutoff = new Date(today.getTime() - 90 * 86400000);
  let firstInWindow = today;
  const sold = {};
  (orders || []).forEach(o => {
    const d = o.created_at ? new Date(o.created_at) : null;
    if (!d || d < cutoff) return;
    if (d < firstInWindow) firstInWindow = d;
    (o.order_items || []).forEach(it => {
      if (!it.product_id) return;
      sold[it.product_id] = (sold[it.product_id] || 0) + (it.quantity || 0);
    });
  });
  const windowDays = Math.max(7, Math.round((today - firstInWindow) / 86400000));
  const fmt = (dt) => dt.toLocaleDateString("it-IT");
  const rows = (products || []).map(p => {
    const stock = p.inventory?.quantity_available || 0;
    const units = sold[p.id] || 0;
    const velocity = units / windowDays;
    const daysLeft = velocity > 0 ? Math.round(stock / velocity) : null;
    const multiple = p.order_multiple || 12;
    const moq = p.min_order_qty || 12;
    const suggested = velocity > 0 ? Math.max(moq, Math.ceil((velocity * (leadDays + 45)) / multiple) * multiple) : 0;
    let status, color, rank;
    if (units === 0) { status = "Dati insufficienti"; color = C.textDim; rank = 5; }
    else if (stock === 0) { status = "Esaurito"; color = C.red; rank = 0; }
    else if (daysLeft <= 7) { status = "Critico"; color = C.red; rank = 1; }
    else if (daysLeft <= 30) { status = "Riordina presto"; color = C.gold; rank = 2; }
    else { status = "OK"; color = C.green; rank = 4; }
    const soDate = daysLeft != null ? new Date(today.getTime() + daysLeft * 86400000) : null;
    const reorderBy = daysLeft != null ? new Date(Math.max(today.getTime(), today.getTime() + (daysLeft - leadDays) * 86400000)) : null;
    return { id:p.id, name:(p.name || p.sku || "Prodotto"), stock, velocity, daysLeft, suggested, status, color, rank, soDate, reorderBy };
  }).sort((a,b) => a.rank - b.rank || ((a.daysLeft ?? 99999) - (b.daysLeft ?? 99999)));
  const needReorder = rows.filter(r => r.rank <= 2).length;
  const head = ["Prodotto","Stock","Vendite/sett.","Giorni residui","Esaurimento","Riordina entro","Stato","Riordino"];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:24, marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📦</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Forecast Inventario AI</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>Previsione su vendite ultimi 90 giorni · ordini reali</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:C.textMuted }}>Tempi di rifornimento</span>
          <input type="number" min="0" max="120" value={leadDays} onChange={e => setLeadDays(Math.max(0, parseInt(e.target.value) || 0))} style={{ width:64, padding:"6px 8px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
          <span style={{ fontSize:12, color:C.textMuted }}>giorni</span>
        </div>
      </div>
      <div style={{ margin:"10px 0 16px", fontSize:13, color: needReorder>0 ? C.gold : C.green }}>
        {needReorder>0 ? ("⚠ " + needReorder + " prodotti da riordinare entro 30 giorni") : "✓ Tutto sotto controllo — nessun esaurimento imminente"}
      </div>
      {rows.length === 0 ? (
        <div style={{ color:C.textMuted, fontSize:13, padding:"12px 0" }}>Nessun prodotto da analizzare.</div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:780 }}>
            <thead><tr>{head.map((h,i) => (<th key={i} style={{ textAlign:"left", padding:"8px 12px", fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>))}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop:`1px solid ${C.border}` }}>
                  <td style={{ padding:"10px 12px", fontSize:13, color:C.text, fontWeight:600, whiteSpace:"nowrap" }}>{r.name}</td>
                  <td style={{ padding:"10px 12px", fontSize:13, color:C.textMuted }}>{r.stock} u.</td>
                  <td style={{ padding:"10px 12px", fontSize:13, color:C.textMuted }}>{(r.velocity*7).toFixed(1)}</td>
                  <td style={{ padding:"10px 12px", fontSize:13, fontWeight:700, color:r.color }}>{r.daysLeft != null ? (r.daysLeft + " gg") : "—"}</td>
                  <td style={{ padding:"10px 12px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{r.soDate ? fmt(r.soDate) : "—"}</td>
                  <td style={{ padding:"10px 12px", fontSize:12, fontWeight:600, color:r.rank<=2?C.goldLight:C.textMuted, whiteSpace:"nowrap" }}>{r.reorderBy ? fmt(r.reorderBy) : "—"}</td>
                  <td style={{ padding:"10px 12px" }}><span style={{ fontSize:11, fontWeight:600, color:r.color, background:`${r.color}18`, border:`1px solid ${r.color}40`, padding:"3px 9px", borderRadius:20, whiteSpace:"nowrap" }}>{r.status}</span></td>
                  <td style={{ padding:"10px 12px", fontSize:13, fontWeight:600, color:r.suggested>0?C.goldLight:C.textDim, whiteSpace:"nowrap" }}>{r.suggested>0 ? (r.suggested + " u.") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

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

  const flagOf = (cc) => {
    const map = { IT:"🇮🇹", DE:"🇩🇪", FR:"🇫🇷", ES:"🇪🇸", RO:"🇷🇴", NL:"🇳🇱", BE:"🇧🇪", PT:"🇵🇹", AT:"🇦🇹", PL:"🇵🇱", GR:"🇬🇷", AE:"🇦🇪", GB:"🇬🇧", CH:"🇨🇭", AL:"🇦🇱", BG:"🇧🇬", HU:"🇭🇺", CZ:"🇨🇿", HR:"🇭🇷", SE:"🇸🇪", DK:"🇩🇰", FI:"🇫🇮", IE:"🇮🇪" };
    return map[String(cc||"").toUpperCase()] || "🌍";
  };

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const distMap = {};
    distributors.forEach(d => { distMap[d.id] = d; });
    const byDist = {};
    orders.forEach(o => {
      const id = o.distributor_id;
      if (!id) return;
      if (!byDist[id]) byDist[id] = { id, orders:0, revenue:0 };
      byDist[id].orders += 1;
      byDist[id].revenue += Number(o.total_amount||0);
    });
    const distStats = Object.values(byDist).map(v => {
      const info = distMap[v.id] || {};
      return { id:v.id, company:info.company||"Distributore", country:info.country||"",
        flag:flagOf(info.country), territory:info.country||"—",
        totalOrders:v.orders, totalRevenue:v.revenue, growth:0, topProduct:"—" };
    }).sort((a,b) => b.totalRevenue - a.totalRevenue);

    const prodMap = {};
    products.forEach(p => { prodMap[p.id] = p; });
    const byProd = {};
    orders.forEach(o => (o.order_items||[]).forEach(it => {
      const id = it.product_id;
      if (!id) return;
      if (!byProd[id]) byProd[id] = { id, units:0, revenue:0 };
      byProd[id].units += Number(it.quantity||0);
      byProd[id].revenue += Number(it.quantity||0) * Number(it.unit_price||0);
    }));
    const prodStats = Object.values(byProd).map(v => {
      const info = prodMap[v.id] || {};
      return { sku:info.sku||v.id, name:info.name||"Prodotto",
        unitsSold:v.units, revenue:v.revenue, trend:"up", trendPct:0 };
    }).sort((a,b) => b.revenue - a.revenue);

    const hasData = distStats.length > 0 || prodStats.length > 0;
    const s = season();
    const aiInsights = [];
    aiInsights.push({
      icon:"📈",
      title:`${s.icon} Stagione ${s.name} — Strategia`,
      text: s.name === "Winter"
        ? "L'inverno è il picco per i profumi oud e orientali. Assicurati che i distributori abbiano stock adeguato."
        : s.name === "Summer"
        ? "L'estate favorisce profumi freschi e floreali. Prepara promozioni per i distributori del Sud Europa."
        : s.name === "Spring"
        ? "La primavera è ideale per lanciare nuovi prodotti: i distributori sono più aperti a testare SKU nuovi."
        : "L'autunno prepara alla stagione calda: anticipa i riordini invernali ora.",
      color:"#c9a84c"
    });
    if (distStats[0]) aiInsights.push({
      icon:"🏆", title:"Distributore Top",
      text:`${distStats[0].company} (${distStats[0].territory}) è il tuo distributore con il fatturato più alto: €${Number(distStats[0].totalRevenue).toLocaleString("it-IT",{maximumFractionDigits:0})} su ${distStats[0].totalOrders} ordini.`,
      color:"#27ae60"
    });
    if (prodStats[0]) aiInsights.push({
      icon:"📦", title:"Prodotto Bestseller",
      text:`${prodStats[0].name} è il più venduto con ${Number(prodStats[0].unitsSold).toLocaleString("it-IT")} unità. Considera un bundle con ${prodStats[1]?.name || "un altro SKU"} per aumentare l'order value.`,
      color:"#3d8ef0"
    });
    if (!hasData) aiInsights.push({
      icon:"ℹ️", title:"Ancora pochi dati",
      text:"Non ci sono ancora abbastanza ordini per un'analisi completa. I dati appariranno qui man mano che i distributori ordinano.",
      color:"#e67e22"
    });

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

const NEXUS_STATUS_IT = { draft:"bozza", pending:"in attesa", confirmed:"confermato", shipped:"spedito", delivered:"consegnato", cancelled:"annullato" };

const BrandPaymentsPanel = () => {
  const t = useT();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    try { const { data } = await supabase.rpc("brand_payments"); setRows(data || []); }
    catch(e){ console.error(e); }
    setLoading(false);
  })(); }, []);
  const num=(x)=>Number(x||0);
  const totRecv = rows.reduce((a,r)=>a+num(r.brand_amount),0);
  const totFee = rows.reduce((a,r)=>a+num(r.fee),0);
  return (
    <div>
      <h3 style={{ fontSize:14, color:C.text, margin:"0 0 14px" }}>{t("payTransLog")}</h3>
      {loading ? (
        <div style={{ padding:32, textAlign:"center", color:C.textMuted, fontSize:13 }}>…</div>
      ) : rows.length===0 ? (
        <div style={{ textAlign:"center", padding:40, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>💳</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>{t("payEmptyTitle")}</div>
          <div style={{ fontSize:13, color:C.textMuted }}>{t("payEmptyMsg")}</div>
        </div>
      ) : (
        <div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:18 }}>
            <Stat icon="💶" label={t("payReceivedKpi")} value={fmt(totRecv)} accent={C.green}/>
            <Stat icon="🪙" label={t("payFeeKpi")} value={fmt(totFee)} accent={C.gold}/>
            <Stat icon="🧾" label={t("payCountKpi")} value={rows.length}/>
          </div>
          <Table minWidth={760}
            headers={[t("colOrderId"),t("colGross"),t("colBrandShare"),t("colNexusFee"),t("colFeePercent"),t("colDate"),t("colStatus")]}
            rows={rows.map(r=>{ const gross=num(r.gross); const fee=num(r.fee); const pct=gross>0?fee/gross*100:0; return [
              <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{r.order_number}</span>,
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(gross)}</span>,
              <span style={{ fontSize:13, fontWeight:700, color:C.green }}>{fmt(num(r.brand_amount))}</span>,
              <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(fee)}</span>,
              <span style={{ fontSize:12, color:C.textMuted }}>{pct.toFixed(1)}%</span>,
              <span style={{ fontSize:11, color:C.textMuted }}>{new Date(r.created_at).toLocaleDateString("it-IT")}</span>,
              <span style={{ fontSize:12, color:C.text }}>{r.status}</span>,
            ];})}
          />
        </div>
      )}
    </div>
  );
};

const BrandAmazonPanel = () => {
  const [rows, setRows] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    try {
      const [r1, r2] = await Promise.all([
        supabase.rpc("amazon_brand_performance"),
        supabase.from("products").select("id,name,is_active")
      ]);
      setRows(r1.data || []);
      setCatalog((r2.data || []).filter(p => p.is_active !== false));
    } catch(e){ console.error(e); }
    setLoading(false);
  })(); }, []);
  const num = (x) => Number(x||0);
  const eur = (n) => "€" + num(n).toLocaleString("it-IT", { minimumFractionDigits:2, maximumFractionDigits:2 });
  const sold30 = rows.reduce((a,r)=>a+num(r.units_sold_30d),0);
  const stock = rows.reduce((a,r)=>a+num(r.units_in_stock),0);
  const rev30 = rows.reduce((a,r)=>a+num(r.sell_price)*num(r.units_sold_30d),0);
  const mkts = Array.from(new Set(rows.map(r=>r.marketplace))).filter(Boolean);
  const onIds = new Set(rows.map(r=>r.product_id).filter(Boolean));
  const notOnAmazon = catalog.filter(p=>!onIds.has(p.id));
  const onCatalog = catalog.filter(p=>onIds.has(p.id)).length;
  const hasAny = rows.length>0 || catalog.length>0;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <div style={{ width:44, height:44, borderRadius:11, background:"linear-gradient(135deg,#ff9900,#e47911)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🛒</div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:0 }}>I tuoi prodotti su Amazon EU</h2>
          <p style={{ color:C.textMuted, fontSize:12.5, margin:"2px 0 0" }}>Gestito da NexusHub · logistica + FBA · vendite e copertura</p>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign:"center", padding:48, color:C.textMuted, fontSize:14 }}>Caricamento dati Amazon…</div>
      ) : !hasAny ? (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, marginTop:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>Nessun prodotto ancora su Amazon</div>
          <div style={{ fontSize:13, color:C.textMuted }}>Quando il tuo partner attiva i tuoi prodotti su Amazon EU, qui vedrai vendite, stock e copertura.</div>
        </div>
      ) : (
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>✓ Su Amazon: {onCatalog}</span>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:`${C.gold}12`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>Da lanciare: {notOnAmazon.length}</span>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:C.surface2, border:`1px solid ${C.border}`, color:C.textMuted }}>Catalogo: {catalog.length}</span>
          </div>
          {rows.length>0 && (
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
              <Stat icon="💶" label="Fatturato Amazon (30gg)" value={eur(rev30)} accent={C.green}/>
              <Stat icon="📦" label="Unita vendute (30gg)" value={sold30} accent={C.gold}/>
              <Stat icon="🏦" label="Stock su Amazon" value={stock} accent={C.blue}/>
              <Stat icon="🌍" label="Marketplace attivi" value={mkts.length}/>
            </div>
          )}
          {mkts.length>0 && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
              {mkts.map(m=>(<span key={m} style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, background:`${C.gold}12`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>Amazon.{m.toLowerCase()}</span>))}
            </div>
          )}
          {rows.length>0 ? (
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:640 }}>
                <thead><tr style={{ background:C.surface2 }}>
                  {["Prodotto","Marketplace","Prezzo Amazon","Stock","Venduti (30gg)"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign: i>=2?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
                </tr></thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={r.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"10px 14px", fontSize:12.5, color:C.text }}><div style={{ fontWeight:600 }}>{r.product_name}</div>{r.asin?<div style={{ fontSize:10.5, color:C.textDim, fontFamily:"monospace" }}>{r.asin}</div>:null}</td>
                      <td style={{ padding:"10px 14px", fontSize:11, color:C.textMuted }}>{r.marketplace}<span style={{ color:C.textDim }}> · {r.fulfillment}</span></td>
                      <td style={{ padding:"10px 14px", fontSize:12, color:C.text, textAlign:"right", whiteSpace:"nowrap" }}>{eur(r.sell_price)}</td>
                      <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted, textAlign:"right" }}>{num(r.units_in_stock)}</td>
                      <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:700, color:C.green, textAlign:"right" }}>{num(r.units_sold_30d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.textMuted }}>Nessuno dei tuoi prodotti è ancora attivo su Amazon. Qui sotto i candidati al lancio.</div>
          )}
          {notOnAmazon.length>0 && (
            <div style={{ marginTop:28 }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.text }}>Non ancora su Amazon</h3>
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 12px" }}>{notOnAmazon.length} tuoi prodotti non sono ancora a scaffale su Amazon EU — potenziali lanci da valutare col partner.</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {notOnAmazon.map(p=>(<span key={p.id} style={{ padding:"7px 12px", borderRadius:9, fontSize:12.5, background:C.surface2, border:`1px dashed ${C.border}`, color:C.text }}>{p.name} <span style={{ color:C.gold, fontSize:10, fontWeight:700 }}>· da lanciare</span></span>))}
              </div>
            </div>
          )}
          <p style={{ fontSize:11, color:C.textDim, marginTop:18 }}>Prezzi, sponsorizzazioni e logistica sono gestiti dal tuo partner di distribuzione (NexusHub). I dati di vendita vengono aggiornati periodicamente.</p>
        </div>
      )}
    </div>
  );
};

const NexusAI = ({ role }) => {
  const eur = (n) => "€" + Number(n||0).toLocaleString("it-IT", { minimumFractionDigits:2, maximumFractionDigits:2 });
  const num = (x) => Number(x||0);
  const qa = (inv) => Array.isArray(inv) ? num(inv[0] && inv[0].quantity_available) : num(inv && inv.quantity_available);
  const countByStatus = (rows) => { const m={}; (rows||[]).forEach(r=>{ m[r.status]=(m[r.status]||0)+1; }); const ks=Object.keys(m); return ks.length ? ks.map(k=>"• "+(NEXUS_STATUS_IT[k]||k)+": "+m[k]).join("\n") : "nessun ordine"; };

  const INTENTS = {
    admin: [
      { chip:"Fatturato del mese", keys:["fatturat","gmv","vendit","mese","incass"], run: async () => {
        const { data:o } = await supabase.from("orders").select("total_amount,status,created_at").neq("status","cancelled");
        const gmv=(o||[]).reduce((a,x)=>a+num(x.total_amount),0);
        const ms=new Date(); ms.setDate(1); ms.setHours(0,0,0,0);
        const mese=(o||[]).filter(x=>new Date(x.created_at)>=ms).reduce((a,x)=>a+num(x.total_amount),0);
        return "GMV totale (ordini non annullati): "+eur(gmv)+"\nQuesto mese: "+eur(mese)+"\nOrdini totali: "+((o||[]).length);
      }},
      { chip:"Ordini per stato", keys:["ordini","stato","stati"], run: async () => {
        const { data:o } = await supabase.from("orders").select("status");
        return "Ordini per stato:\n" + countByStatus(o);
      }},
      { chip:"Prodotti sotto scorta", keys:["scort","magazzino","esaurit","stock"], run: async () => {
        const { data:p } = await supabase.from("products").select("name, inventory(*)");
        const low=(p||[]).filter(x=>qa(x.inventory)<50);
        if(!low.length) return "Tutti i prodotti hanno scorte sopra le 50 unita.";
        return "Sotto le 50 unita:\n" + low.map(x=>"• "+x.name+": "+qa(x.inventory)+" pz").join("\n");
      }},
      { chip:"Commissioni incassate", keys:["commission","margine","guadagn"], run: async () => {
        const { data:sp } = await supabase.from("payment_splits").select("nexushub_amount");
        const tot=(sp||[]).reduce((a,x)=>a+num(x.nexushub_amount),0);
        return "Commissioni NexusHub incassate (lordo): "+eur(tot)+"\nPer il margine netto vedi la tab Margini.";
      }},
      { chip:"Distributori a basso trust", keys:["trust","distributor","rischio","affidab"], run: async () => {
        const { data:d } = await supabase.from("profiles").select("company_name,trust_score,account_state").eq("role","distributor").order("trust_score",{ascending:true}).limit(5);
        if(!d||!d.length) return "Nessun distributore registrato.";
        return "Distributori con Trust piu basso:\n" + d.map(x=>"• "+(x.company_name||"—")+": "+x.trust_score+" pt"+(x.account_state&&x.account_state!=="active"?" ("+x.account_state+")":"")).join("\n");
      }},
      { chip:"Contratti in scadenza", keys:["contratt","scadenz","autorizz"], run: async () => {
        const { data:c } = await supabase.from("contracts").select("contract_number,valid_until");
        const today=new Date(); const soon=new Date(); soon.setDate(soon.getDate()+30);
        const exp=(c||[]).filter(x=>x.valid_until&&new Date(x.valid_until)<today);
        const sn=(c||[]).filter(x=>x.valid_until&&new Date(x.valid_until)>=today&&new Date(x.valid_until)<soon);
        let out="Contratti scaduti: "+exp.length+"\nIn scadenza (30gg): "+sn.length;
        if(sn.length) out+="\n"+sn.map(x=>"• "+x.contract_number+" → "+x.valid_until).join("\n");
        return out;
      }},
      { chip:"Documenti in scadenza", keys:["document","compliance","certificat"], run: async () => {
        const { data:dd } = await supabase.from("compliance_documents").select("name,expires_at");
        const today=new Date(); const soon=new Date(); soon.setDate(soon.getDate()+30);
        const exp=(dd||[]).filter(x=>x.expires_at&&new Date(x.expires_at)<today);
        const sn=(dd||[]).filter(x=>x.expires_at&&new Date(x.expires_at)>=today&&new Date(x.expires_at)<soon);
        return "Documenti scaduti: "+exp.length+"\nIn scadenza (30gg): "+sn.length + (sn.length?"\n"+sn.map(x=>"• "+x.name+" → "+x.expires_at).join("\n"):"");
      }}
    ],
    brand: [
      { chip:"Le mie vendite", keys:["vendit","fatturat","venduto","gmv"], run: async () => {
        const { data:o } = await supabase.from("orders").select("total_amount,status");
        const ok=(o||[]).filter(x=>x.status!=="cancelled");
        const gmv=ok.reduce((a,x)=>a+num(x.total_amount),0);
        return "Vendite totali (lordo): "+eur(gmv)+"\nOrdini: "+ok.length+"\nPayout stimato (al netto fee piattaforma): "+eur(gmv*0.886);
      }},
      { chip:"Ordini per stato", keys:["ordini","stato"], run: async () => {
        const { data:o } = await supabase.from("orders").select("status");
        return "I tuoi ordini per stato:\n" + countByStatus(o);
      }},
      { chip:"Rating medio", keys:["rating","recension","valutaz","stelle"], run: async () => {
        const { data:o } = await supabase.from("orders").select("rating").not("rating","is",null);
        if(!o||!o.length) return "Non hai ancora ricevuto valutazioni.";
        const avg=o.reduce((a,x)=>a+num(x.rating),0)/o.length;
        return "Rating medio: "+avg.toFixed(2)+"/5 su "+o.length+" ordini valutati.";
      }},
      { chip:"I miei prodotti", keys:["prodott","catalog","scort","stock"], run: async () => {
        const { data:p } = await supabase.from("products").select("name,is_active,inventory(*)");
        const act=(p||[]).filter(x=>x.is_active).length;
        const low=(p||[]).filter(x=>qa(x.inventory)<50);
        return "Prodotti attivi: "+act+" su "+((p||[]).length)+"." + (low.length?"\nSotto scorta (<50): "+low.map(x=>x.name).join(", "):"\nScorte ok.");
      }}
    ],
    distributor: [
      { chip:"I miei ordini", keys:["ordini","stato","ordine"], run: async () => {
        const { data:o } = await supabase.from("orders").select("status,total_amount");
        const spent=(o||[]).filter(x=>x.status!=="cancelled").reduce((a,x)=>a+num(x.total_amount),0);
        return "I tuoi ordini per stato:\n" + countByStatus(o) + "\nSpesa totale: "+eur(spent);
      }},
      { chip:"Dov'e il mio ordine", keys:["tracking","spedizion","traccia","dov","corriere"], run: async () => {
        const { data:o } = await supabase.from("orders").select("order_number,status,courier,tracking_number,tracking_url,shipped_at").in("status",["shipped","delivered"]).order("shipped_at",{ascending:false}).limit(1);
        if(!o||!o.length) return "Nessun ordine ancora spedito.";
        const x=o[0];
        return "Ultimo ordine spedito: "+x.order_number+"\nStato: "+(NEXUS_STATUS_IT[x.status]||x.status)+"\nCorriere: "+(x.courier||"—")+"\nTracking: "+(x.tracking_number||"—") + (x.tracking_url?"\nLink: "+x.tracking_url:"");
      }},
      { chip:"La mia wishlist", keys:["wishlist","desideri","preferit"], run: async () => {
        const { data:w } = await supabase.from("wishlist_items").select("id");
        return "Hai "+((w||[]).length)+" prodotti nella wishlist.";
      }},
      { chip:"Catalogo disponibile", keys:["catalog","prodott","disponib"], run: async () => {
        const { data:p } = await supabase.from("products").select("id").eq("is_active",true);
        return "Hai accesso a "+((p||[]).length)+" prodotti attivi dai brand approvati.";
      }}
    ]
  };

  const intents = INTENTS[role] || INTENTS.distributor;
  const [msgs, setMsgs] = useState([{ who:"ai", text:"Ciao! Sono Nexus AI. Rispondo sui tuoi dati reali: tocca una domanda qui sotto o scrivimi." }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const ask = async (q) => {
    const query=(q||"").trim(); if(!query||busy) return;
    setMsgs(m=>[...m,{ who:"user", text:query }]); setInput(""); setBusy(true);
    const ql=query.toLowerCase();
    const hit=intents.find(it=>it.keys.some(k=>ql.includes(k)));
    let ans;
    try { ans = hit ? await hit.run() : ("Non sono sicuro di aver capito. Prova una di queste:\n"+intents.map(i=>"• "+i.chip).join("\n")); }
    catch(e){ console.error(e); ans="Ops, non sono riuscito a recuperare il dato. Riprova."; }
    setMsgs(m=>[...m,{ who:"ai", text:ans }]); setBusy(false);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:"linear-gradient(135deg,#8e44ad,#5b2c8d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:0 }}>Nexus AI</h2>
          <p style={{ color:C.textMuted, fontSize:12.5, margin:"2px 0 0" }}>Assistente sui tuoi dati reali · risposte istantanee</p>
        </div>
      </div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginTop:14 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:340, overflowY:"auto", marginBottom:14 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ alignSelf: m.who==="user"?"flex-end":"flex-start", maxWidth:"85%", padding:"10px 13px", borderRadius:12, fontSize:13, lineHeight:1.5, whiteSpace:"pre-wrap", background: m.who==="user"?`linear-gradient(135deg,${C.gold},${C.goldDim})`:C.surface2, color: m.who==="user"?C.bg:C.text, border: m.who==="user"?"none":`1px solid ${C.border}` }}>{m.text}</div>
          ))}
          {busy && <div style={{ alignSelf:"flex-start", fontSize:12, color:C.textMuted, padding:"6px 4px" }}>Nexus AI sta cercando…</div>}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
          {intents.map((it,i)=>(
            <button key={i} onClick={()=>ask(it.chip)} disabled={busy} style={{ padding:"6px 12px", borderRadius:20, cursor:busy?"default":"pointer", fontSize:12, background:`${C.gold}12`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>{it.chip}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") ask(input); }} placeholder="Scrivi una domanda…" style={{ flex:1, padding:"10px 13px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }}/>
          <button onClick={()=>ask(input)} disabled={busy} style={{ padding:"10px 18px", borderRadius:9, cursor:busy?"default":"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>Invia</button>
        </div>
      </div>
      <p style={{ fontSize:11, color:C.textDim, marginTop:10 }}>Nexus AI risponde solo sui dati a cui hai accesso. Presto capira anche il linguaggio libero (upgrade AI).</p>
    </div>
  );
};

const BrandDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [accessReqs, setAccessReqs] = useState([]);
  const [brandOrders, setBrandOrders] = useState([]);
  const [brandProducts, setBrandProducts] = useState([]);
  const [brandInvoices, setBrandInvoices] = useState([]);
  const [brandInvoiceView, setBrandInvoiceView] = useState(null);
  const [bShowAddProduct, setBShowAddProduct] = useState(false);
  const [bEditingProduct, setBEditingProduct] = useState(null);
  const [bDocsProduct, setBDocsProduct] = useState(null);
  const [bDocs, setBDocs] = useState([]);
  const [bDocsBusy, setBDocsBusy] = useState(false);
  const [bPricesProduct, setBPricesProduct] = useState(null);
  const [bPrices, setBPrices] = useState([]);
  const [bPriceForm, setBPriceForm] = useState({ country:"", price:"" });
  const [bProductForm, setBProductForm] = useState({ name:"", sku:"", category:"", size:"", price:"", order_multiple:"", min_order_qty:"", max_order_qty:"", description:"", image_url:"", image_file:null });
  const [bImportLoading, setBImportLoading] = useState(false);
  const [bImportResults, setBImportResults] = useState(null);
  const [bToast, setBToast] = useState("");
  const bNotify = (m) => { setBToast(m); setTimeout(() => setBToast(""), 2600); };
  const openBDocs = async (p) => {
    setBDocsProduct(p); setBDocs([]);
    const { data } = await supabase.from("product_documents").select("*").eq("product_id", p.id).order("created_at", { ascending:false });
    setBDocs(data || []);
  };
  const bUploadDoc = async (file) => {
    if (!file || !bDocsProduct) return;
    setBDocsBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const path = "product-docs/" + bDocsProduct.id + "_" + Date.now() + "_" + file.name;
      const up = await supabase.storage.from("documents").upload(path, file, { upsert: true });
      if (up && up.data) {
        const u = supabase.storage.from("documents").getPublicUrl(path);
        const { data: row } = await supabase.from("product_documents").insert({
          product_id: bDocsProduct.id, brand_id: user.id, name: file.name,
          file_url: u.data.publicUrl, file_type: file.type || null
        }).select().single();
        if (row) setBDocs(prev => [row, ...prev]);
        bNotify("Documento caricato");
      }
    } catch(e) { console.error(e); bNotify("Errore nel caricamento"); }
    setBDocsBusy(false);
  };
  const bDeleteDoc = async (id) => {
    await supabase.from("product_documents").delete().eq("id", id);
    setBDocs(prev => prev.filter(d => d.id !== id));
  };
  const openBPrices = async (p) => {
    setBPricesProduct(p); setBPriceForm({ country:"", price:"" });
    const { data } = await supabase.from("product_country_prices").select("*").eq("product_id", p.id).order("country");
    setBPrices(data || []);
  };
  const bSavePrice = async () => {
    if (!bPricesProduct || !bPriceForm.country || !bPriceForm.price) { bNotify("Scegli paese e prezzo"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: row } = await supabase.from("product_country_prices").upsert({
      product_id: bPricesProduct.id, brand_id: user.id, country: bPriceForm.country, price: parseFloat(bPriceForm.price) || 0
    }, { onConflict: "product_id,country" }).select().single();
    if (row) {
      setBPrices(prev => [...prev.filter(x => x.country !== row.country), row].sort((a,b)=>a.country.localeCompare(b.country)));
      setBPriceForm({ country:"", price:"" });
      bNotify("Listino salvato");
    }
  };
  const bDeletePrice = async (id) => {
    await supabase.from("product_country_prices").delete().eq("id", id);
    setBPrices(prev => prev.filter(x => x.id !== id));
  };
  const reloadBrandProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("products").select("*, inventory(*)").eq("brand_id", user.id).order("created_at", { ascending: false });
    setBrandProducts(data || []);
  };
  const bSaveProduct = async () => {
    if (!bProductForm.name) { bNotify("Inserisci il nome del prodotto"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let imageUrl = bProductForm.image_url || null;
    if (bProductForm.image_file) {
      const file = bProductForm.image_file;
      const path = `products/${Date.now()}_${file.name}`;
      const { data: uploadData } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
      if (uploadData) { const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path); imageUrl = urlData.publicUrl; }
    }
    const payload = {
      name: bProductForm.name, sku: bProductForm.sku, category: bProductForm.category, description: bProductForm.description,
      unit_price: parseFloat(bProductForm.price) || 0,
      brand_id: user.id,
      order_multiple: bProductForm.order_multiple ? parseInt(bProductForm.order_multiple) : null,
      min_order_qty: bProductForm.min_order_qty ? parseInt(bProductForm.min_order_qty) : null,
      max_order_qty: bProductForm.max_order_qty ? parseInt(bProductForm.max_order_qty) : null,
      image_url: imageUrl, is_active: true,
    };
    if (bEditingProduct) { await supabase.from("products").update(payload).eq("id", bEditingProduct.id); bNotify("Prodotto aggiornato"); }
    else { await supabase.from("products").insert(payload); bNotify("Prodotto aggiunto"); }
    setBShowAddProduct(false); setBEditingProduct(null);
    setBProductForm({ name:"", sku:"", category:"", size:"", price:"", order_multiple:"", min_order_qty:"", max_order_qty:"", description:"", image_url:"", image_file:null });
    reloadBrandProducts();
  };
  const bImportProducts = async (file) => {
    setBImportLoading(true); setBImportResults(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setBImportLoading(false); return; }
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { bNotify("File vuoto o non valido"); setBImportLoading(false); return; }
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
          brand_id: user.id, is_active: true,
        };
        const { error } = await supabase.from("products").insert(payload);
        if (error) errors++; else success++;
      }
      setBImportResults({ success, errors, total: rows.length });
      bNotify("Importati " + success + " prodotti" + (errors > 0 ? ", " + errors + " errori" : ""));
      reloadBrandProducts();
    } catch(e) { bNotify("Errore durante l'importazione"); }
    setBImportLoading(false);
  };
  const [brandNotifs, setBrandNotifs] = useState([]);
  const [brandNotifPanel, setBrandNotifPanel] = useState(false);
  const brandUnread = brandNotifs.filter(n => !n.read).length;
  const pending = accessReqs.filter(r => r.status === "pending").length;

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
    const loadAccessReqs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("brand_access_requests")
        .select("*, distributor:profiles!brand_access_requests_distributor_id_fkey(company_name, email, country, trust_score, account_state)")
        .eq("brand_id", user.id).order("created_at", { ascending: false });
      setAccessReqs(data || []);
    };
    loadAccessReqs();
    const loadBrandOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("orders")
        .select("*, order_items(*), distributor:profiles!orders_distributor_id_fkey(company_name)").eq("brand_id", user.id);
      setBrandOrders(data || []);
    };
    loadBrandOrders();
    const loadBrandProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("products").select("*, inventory(*)").eq("brand_id", user.id);
      setBrandProducts(data || []);
    };
    loadBrandProducts();
    const loadBrandInvoices = async () => {
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user) return;
      const { data: ords } = await supabase.from("orders").select("id").eq("brand_id", user.id);
      const ids = (ords||[]).map(o=>o.id);
      if(!ids.length){ setBrandInvoices([]); return; }
      const { data } = await supabase.from("invoices").select("*").in("order_id", ids).order("created_at",{ascending:false});
      setBrandInvoices(data||[]);
    };
    loadBrandInvoices();
    const channel = supabase.channel("brand-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => { setBrandNotifs(prev => [payload.new, ...prev]); if (payload.new?.type === "access_request") loadAccessReqs(); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  const saveDiscount = async (req, pct) => {
    const v = Math.max(0, Math.min(90, Number(pct) || 0));
    setAccessReqs(prev => prev.map(r => r.id === req.id ? { ...r, discount_pct: v } : r));
    await supabase.from("brand_access_requests").update({ discount_pct: v, updated_at: new Date().toISOString() }).eq("id", req.id);
    await supabase.from("notifications").insert({
      user_id: req.distributor_id,
      title: v > 0 ? ("Sconto applicato: -" + v + "%") : "Sconto rimosso",
      message: v > 0 ? ("Hai ricevuto uno sconto del " + v + "% su tutto il catalogo di questo brand.") : "Lo sconto sul catalogo di questo brand e stato rimosso.",
      type: "access_update",
    });
  };
  const handleAccess = async (req, newStatus, exclusive = false) => {
    setAccessReqs(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus, exclusive: newStatus === "approved" ? exclusive : r.exclusive } : r));
    const upd = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === "approved") upd.exclusive = exclusive;
    await supabase.from("brand_access_requests").update(upd).eq("id", req.id);
    await supabase.from("notifications").insert({
      user_id: req.distributor_id,
      title: newStatus === "approved" ? "Accesso approvato ✓" : "Accesso bloccato",
      message: newStatus === "approved"
        ? (exclusive
            ? "Un brand ti ha approvato IN ESCLUSIVA per il tuo territorio: sei l'unico distributore del tuo paese per questo brand."
            : "Un brand ha approvato la tua richiesta: ora puoi vedere e ordinare i suoi prodotti.")
        : "Un brand ha bloccato il tuo accesso ai suoi prodotti.",
      type: "access_update",
    });
    // CONTRATTO AUTOMATICO: all'approvazione genera (o aggiorna) il contratto di distribuzione
    if (newStatus === "approved") {
      const { data: bp } = await supabase.from("profiles").select("commission_rate").eq("id", req.brand_id).single();
      const comm = (bp && bp.commission_rate != null) ? bp.commission_rate : 11.4;
      const territory = (req.distributor?.country || "").trim() || "—";
      const today = new Date();
      const vu = new Date(today); vu.setFullYear(vu.getFullYear() + 1);
      const { data: existingC } = await supabase.from("contracts")
        .select("id").eq("brand_id", req.brand_id).eq("distributor_id", req.distributor_id).limit(1);
      if (existingC && existingC.length) {
        await supabase.from("contracts").update({ territory, exclusivity: exclusive, commission_rate: comm }).eq("id", existingC[0].id);
      } else {
        await supabase.from("contracts").insert({
          contract_number: `CT-${today.getFullYear()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,
          brand_id: req.brand_id,
          distributor_id: req.distributor_id,
          territory,
          exclusivity: exclusive,
          commission_rate: comm,
          status: "draft",
          valid_from: today.toISOString().slice(0,10),
          valid_until: vu.toISOString().slice(0,10),
        });
      }
    }
    // ESCLUSIVITÀ TERRITORIALE (scelta del brand): se approvi IN ESCLUSIVA,
    // blocca automaticamente gli altri distributori dello stesso paese per questo brand.
    if (newStatus === "approved" && exclusive) {
      const country = (req.distributor?.country || "").trim().toLowerCase();
      if (country) {
        const conflicts = accessReqs.filter(r =>
          r.id !== req.id &&
          (r.status === "pending" || r.status === "approved") &&
          (r.distributor?.country || "").trim().toLowerCase() === country
        );
        if (conflicts.length) {
          const ids = conflicts.map(c => c.id);
          await supabase.from("brand_access_requests")
            .update({ status: "blocked", updated_at: new Date().toISOString() })
            .in("id", ids);
          for (const c of conflicts) {
            await supabase.from("notifications").insert({
              user_id: c.distributor_id,
              title: "Territorio non disponibile",
              message: "Un altro distributore è stato selezionato in esclusiva per il tuo territorio: l'accesso a questo brand è stato chiuso.",
              type: "access_update",
            });
          }
          setAccessReqs(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: "blocked" } : r));
        }
      }
    }
  };
  const tabs = [
    { key:"overview", icon:"◈", label:t("tabOverview") },
    { key:"applications", icon:"📋", label:t("tabApplications"), badge:pending },
    { key:"distributors", icon:"⬡", label:t("tabDistributors") },
    { key:"catalog", icon:"◻", label:t("tabCatalog") },
    { key:"orders", icon:"↗", label:t("tabOrders") },
    { key:"fatture", icon:"🧾", label:"Fatture" },
    { key:"payments", icon:"€", label:t("tabPayments") },
    { key:"analytics", icon:"🤖", label:"AI Analytics" },
    { key:"amazon", icon:"🛒", label:"Amazon" },
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
        {tab==="overview" && (() => {
          const approved = accessReqs.filter(r => r.status === "approved");
          const territories = new Set(approved.map(r => r.distributor && r.distributor.country).filter(Boolean)).size;
          const revenue = brandOrders.filter(o=>o.status!=="cancelled").reduce((a,o)=>a+Number(o.total_amount||0),0);
          const eur=(n)=>"\u20ac "+Number(n||0).toLocaleString("it-IT",{maximumFractionDigits:0});
          const CC={Italy:"IT",Italia:"IT",Germany:"DE",Germania:"DE",France:"FR",Francia:"FR",Romania:"RO",Spain:"ES",Spagna:"ES","United Kingdom":"GB",UK:"GB",Greece:"GR",Grecia:"GR",Netherlands:"NL",Olanda:"NL",Belgium:"BE",Belgio:"BE",Poland:"PL",Polonia:"PL",Sweden:"SE",Svezia:"SE"};
          const mapDist = approved.map(r=>{ const d=r.distributor||{}; const c=d.country||""; return { id:r.id, company:d.company_name||d.email||"Distributore", country:c, territory:c, country_code:CC[c]||(c?c.slice(0,2).toUpperCase():"IT"), status:"active" }; });
          return (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("overviewTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("overviewSub")}</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="⬡" label={t("statTerritories")} value={territories} sub={t("statTerritoriesSub")}/>
              <Stat icon="◻" label={t("statDistributors")} value={approved.length} sub={`${pending} ${t("statDistributorsSub")}`} accent={C.blue}/>
              <Stat icon="↗" label={t("statRevenue")} value={eur(revenue)} sub={t("statRevenueSub")}/>
              <Stat icon="📦" label="Prodotti" value={brandProducts.length} accent={C.green}/>
              <Stat icon="🧾" label="Ordini" value={brandOrders.length}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>⬡ Distributori autorizzati</h3>
                {approved.length===0 ? (
                  <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>Nessun distributore autorizzato ancora. Quando approvi una richiesta nella tab Richieste, il distributore compare qui e sulla mappa.</div>
                ) : approved.slice(0,6).map((r,i)=>{ const d=r.distributor||{}; return (
                  <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"10px 0", borderBottom:i<Math.min(approved.length,6)-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:13, color:C.text, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.company_name||d.email||"Distributore"}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>📍 {d.country||"—"}</div>
                    </div>
                    <TrustBadge score={d.trust_score} state={d.account_state}/>
                  </div>
                );})}
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, gridColumn:"1/-1" }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>🗺️ Mappa distribuzione europea</h3>
                <EuropeMap distributors={mapDist}/>
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>📦 I tuoi prodotti</h3>
                {[["Prodotti a catalogo", brandProducts.length],["Ordini totali", brandOrders.length],["Distributori attivi", approved.length],["Fatturato", eur(revenue)]].map(([k,v],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                    <span style={{ fontSize:13, color:C.textMuted }}>{k}</span>
                    <span style={{ fontSize:13, color:C.goldLight, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          );
        })()}
        {tab==="applications" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("appTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("appSub")}</p>
            {accessReqs.length === 0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Nessuna richiesta al momento</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>Quando un distributore richiederà l'accesso ai tuoi prodotti, comparirà qui per l'approvazione o il blocco.</div>
              </div>
            ) : accessReqs.map(r => {
              const dist = r.distributor || {};
              const dname = dist.company_name || dist.email || "Distributore";
              return (
              <div key={r.id} style={{ background:C.surface, border:`1px solid ${r.status==="approved"?C.green+"60":r.status==="blocked"?C.red+"60":C.border}`, borderRadius:14, padding:24, marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:50, height:50, borderRadius:12, background:C.surface3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:C.gold }}>{(dname[0]||"D").toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{dname}</div>
                      <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{dist.email || "—"}</div>
                      <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>📍 {dist.country || "—"} · {t("submitted")}: {new Date(r.created_at).toLocaleDateString("it-IT")}</div>
                      <div style={{ marginTop:6 }}><TrustBadge score={dist.trust_score} state={dist.account_state}/></div>
                    </div>
                  </div>
                  <Badge status={r.status==="blocked"?"rejected":r.status==="approved"?"approved":"pending"}/>
                </div>
                {r.status==="pending" ? (
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <button onClick={() => handleAccess(r, "approved", true)} style={{ padding:"10px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.gold}20`, border:`1px solid ${C.gold}55`, color:C.gold }}>🔒 Approva in esclusiva</button>
                    <button onClick={() => handleAccess(r, "approved", false)} style={{ padding:"10px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>✓ Approva (condiviso)</button>
                    <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>✗ Blocca</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <div style={{ padding:"11px 16px", borderRadius:8, background:r.status==="approved"?`${C.green}12`:`${C.red}12`, border:`1px solid ${r.status==="approved"?C.green:C.red}30`, fontSize:13, color:r.status==="approved"?C.green:C.red, fontWeight:600 }}>
                      {r.status==="approved"?"✓ Accesso approvato — può ordinare i tuoi prodotti":"🚫 Accesso bloccato"}
                    </div>
                    {r.status==="approved" && <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.red}40`, color:C.red }}>Blocca accesso</button>}
                    {r.status==="blocked" && <button onClick={() => handleAccess(r, "approved")} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.green}40`, color:C.green }}>Sblocca</button>}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
        {tab==="distributors" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("distTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>I tuoi distributori autorizzati · ordini e fatturato in tempo reale</p>
            {(() => {
              const active = accessReqs.filter(r => r.status === "approved");
              const stats = {};
              brandOrders.forEach(o => {
                if (!o.distributor_id) return;
                if (!stats[o.distributor_id]) stats[o.distributor_id] = { orders: 0, revenue: 0 };
                stats[o.distributor_id].orders += 1;
                stats[o.distributor_id].revenue += (o.total_amount || 0);
              });
              if (active.length === 0) return (
                <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>⬡</div>
                  <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Nessun distributore attivo</div>
                  <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>Quando approvi una richiesta nella tab Candidature, il distributore comparirà qui con i suoi ordini e il fatturato reali.</div>
                </div>
              );
              return (
                <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {["Distributore","Paese","Ordini","Fatturato","Stato","Sconto","Azione"].map((h,i) => (
                          <th key={i} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {active.map((r,i) => {
                        const dist = r.distributor || {};
                        const dname = dist.company_name || dist.email || "Distributore";
                        const st = stats[r.distributor_id] || { orders: 0, revenue: 0 };
                        return (
                          <tr key={r.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                            <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                              <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{dname}</div>
                              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{dist.email || "—"}</div>
                            </td>
                            <td style={{ padding:"13px 16px", fontSize:13, color:C.textMuted, whiteSpace:"nowrap" }}>{dist.country || "—"}</td>
                            <td style={{ padding:"13px 16px", fontSize:14, fontWeight:700, color:C.goldLight }}>{st.orders}</td>
                            <td style={{ padding:"13px 16px", fontSize:14, fontWeight:700, color:C.goldLight }}>€{st.revenue.toLocaleString("it-IT")}</td>
                            <td style={{ padding:"13px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                                <Badge status="active"/>
                                <span style={{ padding:"2px 8px", borderRadius:5, fontSize:10, fontWeight:600, background:r.exclusive?`${C.gold}15`:`${C.blue}12`, border:`1px solid ${(r.exclusive?C.gold:C.blue)}30`, color:r.exclusive?C.gold:C.blue }}>{r.exclusive?"🔒 Esclusiva":"Condiviso"}</span>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <input type="number" min={0} max={90} value={r.discount_pct == null ? 0 : r.discount_pct}
                                  onChange={e => { const v = e.target.value; setAccessReqs(prev => prev.map(x => x.id===r.id ? { ...x, discount_pct: v } : x)); }}
                                  style={{ width:60, padding:"6px 8px", borderRadius:7, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
                                <span style={{ fontSize:12, color:C.textMuted }}>%</span>
                                <button onClick={() => saveDiscount(r, r.discount_pct)} style={{ padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background:`${C.green}15`, border:`1px solid ${C.green}45`, color:C.green }}>Salva</button>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.red}40`, color:C.red, whiteSpace:"nowrap" }}>Blocca</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
        {bToast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:1100, background:C.surface, border:`1px solid ${C.gold}55`, color:C.text, padding:"12px 20px", borderRadius:10, fontSize:13, boxShadow:"0 8px 30px rgba(0,0,0,.4)" }}>{bToast}</div>
        )}
        {bPricesProduct && (
          <Modal title={"Listini per paese - " + (bPricesProduct.name || "")} onClose={() => setBPricesProduct(null)} onSave={() => setBPricesProduct(null)} saveLabel="Fatto">
            <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 6px" }}>Prezzo base: <b style={{ color:C.goldLight }}>€{Number(bPricesProduct.unit_price||0).toFixed(2)}</b>. Imposta un prezzo diverso per i mercati che vuoi (es. Germania piu alto). Il distributore vedra automaticamente il prezzo del suo paese.</p>
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", margin:"14px 0 16px" }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:5 }}>Paese</label>
                <select value={bPriceForm.country} onChange={e => setBPriceForm(f => ({...f, country:e.target.value}))} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="">- Scegli -</option>
                  {[["IT","Italia"],["DE","Germania"],["FR","Francia"],["ES","Spagna"],["RO","Romania"],["NL","Paesi Bassi"],["BE","Belgio"],["PT","Portogallo"],["AT","Austria"],["PL","Polonia"],["GR","Grecia"],["BG","Bulgaria"],["HU","Ungheria"],["CZ","Rep. Ceca"],["HR","Croazia"],["SE","Svezia"],["DK","Danimarca"],["FI","Finlandia"],["IE","Irlanda"],["AL","Albania"],["CH","Svizzera"],["GB","Regno Unito"]].map(([c,l]) => <option key={c} value={c}>{l} ({c})</option>)}
                </select>
              </div>
              <div style={{ width:120 }}>
                <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:5 }}>Prezzo €</label>
                <input type="text" inputMode="decimal" value={bPriceForm.price} onChange={e => setBPriceForm(f => ({...f, price:e.target.value}))} placeholder="0.00" style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
              <button onClick={bSavePrice} style={{ padding:"10px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>Salva</button>
            </div>
            {bPrices.length === 0 ? (
              <div style={{ textAlign:"center", padding:12, color:C.textMuted, fontSize:13 }}>Nessun listino per paese. Vale il prezzo base ovunque.</div>
            ) : bPrices.map(pr => (
              <div key={pr.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:7 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.text, width:60 }}>{pr.country}</span>
                <span style={{ flex:1, fontSize:13, color:C.goldLight, fontWeight:700 }}>€{Number(pr.price).toFixed(2)}</span>
                <button onClick={() => bDeletePrice(pr.id)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Elimina</button>
              </div>
            ))}
          </Modal>
        )}
        {bDocsProduct && (
          <Modal title={"Documenti · " + (bDocsProduct.name || "Prodotto")} onClose={() => { setBDocsProduct(null); setBDocs([]); }} onSave={() => { setBDocsProduct(null); setBDocs([]); }} saveLabel="Fatto">
            <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>Schede tecniche, certificati, ingredienti. I distributori potranno scaricarli dal catalogo.</p>
            <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"18px 12px", borderRadius:10, cursor:"pointer", background:C.surface2, border:`1px dashed ${C.gold}55`, textAlign:"center", marginBottom:16 }}>
              <input type="file" style={{ display:"none" }} disabled={bDocsBusy} onChange={e => { const f=e.target.files&&e.target.files[0]; if(f) bUploadDoc(f); if(e.target) e.target.value=""; }}/>
              <span style={{ fontSize:22 }}>{bDocsBusy ? "⏳" : "📎"}</span>
              <span style={{ fontSize:12, color:C.textMuted }}>{bDocsBusy ? "Caricamento..." : "Carica un documento (PDF, immagine, ecc.)"}</span>
            </label>
            {bDocs.length === 0 ? (
              <div style={{ textAlign:"center", padding:16, color:C.textMuted, fontSize:13 }}>Nessun documento ancora.</div>
            ) : bDocs.map(d => (
              <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>📄</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{new Date(d.created_at).toLocaleDateString("it-IT")}</div>
                </div>
                <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"4px 10px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>Apri</a>
                <button onClick={() => bDeleteDoc(d.id)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Elimina</button>
              </div>
            ))}
          </Modal>
        )}
        {bShowAddProduct && (
          <Modal title={bEditingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"} onClose={() => { setBShowAddProduct(false); setBEditingProduct(null); }} onSave={bSaveProduct}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { label:"Nome Prodotto *", key:"name", placeholder:"es. Khamrah EDP", mode:"text" },
                { label:"SKU", key:"sku", placeholder:"es. LT-KHM-100", mode:"text" },
                { label:"Categoria", key:"category", placeholder:"es. Premium", mode:"text" },
                { label:"Formato", key:"size", placeholder:"es. 100ml", mode:"text" },
                { label:"Prezzo unitario (€) *", key:"price", placeholder:"0.00", mode:"decimal" },
                { label:"Multiplo d'ordine", key:"order_multiple", placeholder:"es. 12", mode:"numeric" },
                { label:"Qta minima (MOQ)", key:"min_order_qty", placeholder:"es. 24", mode:"numeric" },
                { label:"Qta massima (vuoto = illimitato)", key:"max_order_qty", placeholder:"es. 500", mode:"numeric" },
              ].map(({label, key, placeholder, mode}) => (
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
                  <input type="text" inputMode={mode} value={bProductForm[key]} onChange={e => setBProductForm(f => ({...f, [key]: e.target.value}))} placeholder={placeholder} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Descrizione</label>
              <textarea value={bProductForm.description} onChange={e => setBProductForm(f => ({...f, description: e.target.value}))} rows={2} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical" }}/>
            </div>
            <div style={{ marginBottom:4 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:8 }}>Immagine Prodotto</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"16px 12px", borderRadius:10, cursor:"pointer", background: bProductForm.image_file ? `${C.green}10` : C.surface2, border:`1px dashed ${bProductForm.image_file ? C.green : C.border}`, textAlign:"center" }}>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files?.[0]; if(f) setBProductForm(p=>({...p,image_file:f,image_url:""})); }}/>
                  <span style={{ fontSize:22 }}>{bProductForm.image_file ? "✓" : "📁"}</span>
                  <span style={{ fontSize:11, color: bProductForm.image_file ? C.green : C.textMuted }}>{bProductForm.image_file ? bProductForm.image_file.name : "Carica immagine"}</span>
                </label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <span style={{ fontSize:11, color:C.textMuted }}>oppure URL esterno:</span>
                  <input type="text" value={bProductForm.image_url} onChange={e => setBProductForm(p=>({...p,image_url:e.target.value,image_file:null}))} placeholder="https://..." style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {tab==="catalog" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("catTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{brandProducts.length} prodotti nel tuo catalogo</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <label style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  📊 {bImportLoading ? "Importando..." : "Import Excel/CSV"}
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if(f) bImportProducts(f); e.target.value=""; }}/>
                </label>
                <button onClick={() => { setBEditingProduct(null); setBProductForm({ name:"", sku:"", category:"", size:"", price:"", order_multiple:"", min_order_qty:"", max_order_qty:"", description:"", image_url:"", image_file:null }); setBShowAddProduct(true); }} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Nuovo Prodotto</button>
              </div>
            </div>
            {bImportResults && (
              <div style={{ padding:"12px 16px", background:`${C.green}12`, border:`1px solid ${C.green}30`, borderRadius:10, marginBottom:16, fontSize:13, color:C.green }}>
                ✓ Import completato: {bImportResults.success} prodotti{bImportResults.errors > 0 ? `, ${bImportResults.errors} errori` : ""}
                <button onClick={() => setBImportResults(null)} style={{ marginLeft:12, background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12 }}>×</button>
                <div style={{ marginTop:6, fontSize:11, color:C.textMuted }}>Colonne CSV: name, sku, category, price, order_multiple, min_order_qty, description, image_url</div>
              </div>
            )}
            {brandProducts.length === 0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Nessun prodotto nel catalogo</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>Aggiungi il tuo primo prodotto con "+ Nuovo Prodotto" oppure importa un file Excel/CSV.</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {["SKU","Prodotto","Categoria","Prezzo","Stock","MOQ","Multiplo","Stato","Azioni"].map((h,i) => (
                        <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {brandProducts.map((p,i) => (
                      <tr key={p.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.sku || "—"}</span></td>
                        <td style={{ padding:"11px 14px", whiteSpace:"nowrap" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            {p.image_url && <img src={p.image_url} alt="" style={{ width:32, height:32, objectFit:"cover", borderRadius:6, flexShrink:0 }} onError={e=>e.target.style.display="none"}/>}
                            <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{p.category || "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{p.unit_price?.toFixed(2)}</td>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontSize:12, color: (p.inventory?.quantity_available||0)>50?C.green:(p.inventory?.quantity_available||0)>10?C.gold:C.red, fontWeight:600 }}>{p.inventory?.quantity_available ?? 0} u.</span></td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{p.min_order_qty}</td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>×{p.order_multiple}</td>
                        <td style={{ padding:"11px 14px" }}><Badge status={p.is_active?"active":"rejected"}/></td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => { setBEditingProduct(p); setBProductForm({ name:p.name||"", sku:p.sku||"", category:p.category||"", size:"", price:p.unit_price?.toString()||"", order_multiple:p.order_multiple||"", min_order_qty:p.min_order_qty||"", max_order_qty:p.max_order_qty||"", description:p.description||"", image_url:p.image_url||"", image_file:null }); setBShowAddProduct(true); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>Modifica</button>
                            <button onClick={() => openBDocs(p)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>📎 Doc</button>
                            <button onClick={() => openBPrices(p)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>€ Prezzi</button>
                            <button onClick={async () => { await supabase.from("products").update({ is_active:!p.is_active }).eq("id",p.id); reloadBrandProducts(); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>{p.is_active?"Disattiva":"Attiva"}</button>
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
            {brandOrders.length === 0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>Nessun ordine ancora.</div>
            ) : (
              <Table minWidth={900}
                headers={["Ordine","Distributore","Articoli","Valore","Stato","Tracking","Voto","Data"]}
                rows={brandOrders.map(o => [
                  <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.order_number}</span>,
                  <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{o.distributor?.company_name || "—"}</span>,
                  <span style={{ fontSize:13, color:C.textMuted }}>{(o.order_items||[]).reduce((a,it)=>a+Number(it.quantity||0),0)} u.</span>,
                  <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€{Number(o.total_amount||0).toLocaleString("it-IT")}</span>,
                  <Badge status={o.status}/>,
                  o.tracking_number ? <span style={{ fontSize:11 }}>{o.courier||""} <span style={{ fontFamily:"monospace", color:C.blue }}>{o.tracking_number}</span></span> : <span style={{ fontSize:11, color:C.textDim }}>—</span>,
                  o.rating ? <span style={{ fontSize:13, color:C.gold }}>{"★".repeat(o.rating)}</span> : <span style={{ fontSize:11, color:C.textDim }}>—</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{new Date(o.created_at).toLocaleDateString()}</span>,
                ])}
              />
            )}
          </div>
        )}
        {brandInvoiceView && <InvoiceModal inv={brandInvoiceView} onClose={()=>setBrandInvoiceView(null)}/>}
        {tab==="fatture" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 Fatture</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Fatture di vendita ai distributori e fatture di commissione NexusHub. Puoi anche caricare la tua fattura ufficiale in PDF.</p>
            {brandInvoices.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>Nessuna fattura ancora.</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                  <thead><tr style={{ background:C.surface2 }}>{["Numero","Tipo","Controparte","Totale","PDF","Azione"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}</tr></thead>
                  <tbody>
                    {brandInvoices.map((inv,i)=>{ const isComm = inv.type==="nexushub_commission"; return (
                      <tr key={inv.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{inv.invoice_number}</span></td>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, fontWeight:600, color:isComm?C.gold:C.green }}>{isComm?"Commissione":"Vendita"}</span></td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{isComm?inv.from_entity:inv.to_entity}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{Number(inv.total||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"11px 14px" }}>
                          {inv.pdf_url ? (<a href={inv.pdf_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue }}>📎 PDF</a>) : (!isComm ? (
                            <label style={{ fontSize:11, color:C.textMuted, cursor:"pointer", textDecoration:"underline" }}>Carica PDF
                              <input type="file" accept="application/pdf" style={{ display:"none" }} onChange={async e=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; const path="invoices/"+inv.id+"_"+f.name; const up=await supabase.storage.from("documents").upload(path,f,{upsert:true}); if(up&&up.data){ const u=supabase.storage.from("documents").getPublicUrl(path); const url=u.data.publicUrl; await supabase.from("invoices").update({ pdf_url:url }).eq("id",inv.id); setBrandInvoices(prev=>prev.map(x=>x.id===inv.id?{...x,pdf_url:url}:x)); } if(e.target) e.target.value=""; }}/>
                            </label>
                          ) : <span style={{ fontSize:11, color:C.textDim }}>—</span>)}
                        </td>
                        <td style={{ padding:"11px 14px" }}><button onClick={()=>setBrandInvoiceView(inv)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>Vedi</button></td>
                      </tr>
                    ); })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab==="amazon" && <BrandAmazonPanel/>}
        {tab==="analytics" && (
          <div>
            <NexusAI role="brand"/>
            <div style={{ height:1, background:C.border, margin:"28px 0" }}/>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🤖 AI Brand Analytics</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Performance distributori, top prodotti, stagionalità e opportunità di crescita</p>
            <InventoryForecast products={brandProducts} orders={brandOrders}/>
            <BrandAnalytics
              distributors={accessReqs.filter(r=>r.status==="approved").map(r=>({ id:r.distributor_id, company:r.distributor?.company_name||"Distributore", country:r.distributor?.country||"" }))}
              orders={brandOrders}
              products={brandProducts}/>
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
            <BrandPaymentsPanel/>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== CONTRATTO DI DISTRIBUZIONE — bozza professionale (da validare con legale) =====
const CONTRACT_LANG_BY_COUNTRY = {
  "italia":"it","italy":"it","it":"it",
  "france":"fr","francia":"fr","fr":"fr",
  "spain":"es","spagna":"es","espana":"es","es":"es",
  "germany":"de","germania":"de","deutschland":"de","de":"de",
};
const CONTRACT_LANG_NAME = { it:"Italiano", fr:"Francais", es:"Espanol", de:"Deutsch" };

function buildContract(opts) {
  const o = opts || {};
  const contractNumber = o.contractNumber || "—";
  const brandName = o.brandName || "—";
  const distCompany = o.distCompany || "—";
  const territory = o.territory || "—";
  const exclusive = !!o.exclusive;
  const validFrom = o.validFrom || "—";
  const validUntil = o.validUntil || "—";
  const key = (o.distCountry || "").trim().toLowerCase();
  const sec = CONTRACT_LANG_BY_COUNTRY[key] || null;
  const secName = sec ? CONTRACT_LANG_NAME[sec] : null;

  const en = `INTERNATIONAL DISTRIBUTION AGREEMENT
Agreement No. ${contractNumber}

BETWEEN
${brandName} (the "Principal")
AND
${distCompany} (the "Distributor")

1. APPOINTMENT AND SCOPE
The Principal appoints the Distributor to promote, market and resell the Principal's products (the "Products") within the Territory, and the Distributor accepts such appointment.

2. TERRITORY
The territory covered by this Agreement is: ${territory}.

3. EXCLUSIVITY
${exclusive
  ? "The Distributor is appointed as the EXCLUSIVE distributor of the Products within the Territory. During the term, the Principal shall not appoint other distributors for the Products within the Territory."
  : "The Distributor is appointed on a NON-EXCLUSIVE basis. The Principal may appoint other distributors for the Products within the Territory."}

4. TERM
This Agreement is effective from ${validFrom} to ${validUntil}, unless earlier terminated in accordance with its terms. It may be renewed by written agreement of the parties.

5. ORDERS AND SUPPLY
The Distributor shall purchase the Products by placing orders through the NexusHub platform. The Principal shall use reasonable efforts to fulfil accepted orders subject to availability. The commercial and economic conditions of supply are agreed separately between the parties and do not form part of this document.

6. TRADEMARKS AND INTELLECTUAL PROPERTY
The Distributor may use the Principal's trademarks and brand materials solely to market and resell the Products during the term, and acquires no ownership right therein. All goodwill arising from such use shall benefit the Principal.

7. OBLIGATIONS OF THE DISTRIBUTOR
The Distributor shall: (a) promote the Products diligently within the Territory; (b) comply with all applicable laws and regulations; (c) protect the reputation and integrity of the Products and of the Principal's brand; and (d) not actively solicit sales outside the Territory without the Principal's prior written consent.

8. CONFIDENTIALITY
Each party shall keep confidential all non-public information received from the other party and use it solely for the performance of this Agreement.

9. TERMINATION
Either party may terminate this Agreement for a material breach that is not remedied within thirty (30) days of written notice, or upon the insolvency of the other party. Expiry or termination shall not affect rights and obligations accrued before that date.

10. GOVERNING LAW
This Agreement shall be governed by the law applicable at the Principal's place of business. The parties shall endeavour to settle any dispute amicably before submitting it to the competent courts.

11. LANGUAGE
${sec
  ? "This Agreement is provided in English and in " + secName + ". In case of any discrepancy or conflicting interpretation, the English version shall prevail."
  : "This Agreement is provided in English, which shall be the governing language."}

12. ACCEPTANCE
By accepting electronically, the Distributor confirms that it has read, understood and agreed to this Agreement. The electronic acceptance, together with the recorded name and timestamp, evidences the Distributor's assent.

— DRAFT — This document is a template provided for operational convenience and must be reviewed and validated by qualified legal counsel before use. It does not constitute legal advice.`;

  let secText = null;
  if (sec === "it") {
    secText = `CONTRATTO DI DISTRIBUZIONE INTERNAZIONALE
Contratto n. ${contractNumber}

TRA
${brandName} (il "Concedente")
E
${distCompany} (il "Distributore")

1. NOMINA E OGGETTO
Il Concedente nomina il Distributore per promuovere, commercializzare e rivendere i prodotti del Concedente (i "Prodotti") nel Territorio, e il Distributore accetta tale nomina.

2. TERRITORIO
Il territorio oggetto del presente contratto e: ${territory}.

3. ESCLUSIVITA
${exclusive
  ? "Il Distributore e nominato distributore ESCLUSIVO dei Prodotti nel Territorio. Per la durata del contratto, il Concedente non nominera altri distributori dei Prodotti nel Territorio."
  : "Il Distributore e nominato in via NON ESCLUSIVA. Il Concedente potra nominare altri distributori dei Prodotti nel Territorio."}

4. DURATA
Il presente contratto e efficace dal ${validFrom} al ${validUntil}, salvo risoluzione anticipata ai sensi delle presenti clausole. Potra essere rinnovato per accordo scritto tra le parti.

5. ORDINI E FORNITURA
Il Distributore acquista i Prodotti inoltrando gli ordini tramite la piattaforma NexusHub. Il Concedente si impegna a evadere con ragionevole diligenza gli ordini accettati, compatibilmente con la disponibilita. Le condizioni commerciali ed economiche della fornitura sono concordate separatamente tra le parti e non formano parte del presente documento.

6. MARCHI E PROPRIETA INTELLETTUALE
Il Distributore puo utilizzare i marchi e i materiali del Concedente esclusivamente per commercializzare e rivendere i Prodotti durante la durata del contratto, senza acquisire alcun diritto di proprieta sugli stessi. Ogni avviamento derivante da tale uso va a beneficio del Concedente.

7. OBBLIGHI DEL DISTRIBUTORE
Il Distributore si obbliga a: (a) promuovere diligentemente i Prodotti nel Territorio; (b) rispettare tutte le leggi e i regolamenti applicabili; (c) tutelare la reputazione e l'integrita dei Prodotti e del marchio del Concedente; e (d) non promuovere attivamente vendite al di fuori del Territorio senza il preventivo consenso scritto del Concedente.

8. RISERVATEZZA
Ciascuna parte mantiene riservata ogni informazione non pubblica ricevuta dall'altra parte e la utilizza esclusivamente per l'esecuzione del presente contratto.

9. RISOLUZIONE
Ciascuna parte puo risolvere il contratto per inadempimento sostanziale non sanato entro trenta (30) giorni dalla diffida scritta, ovvero in caso di insolvenza dell'altra parte. La scadenza o risoluzione non pregiudica i diritti e gli obblighi maturati prima di tale data.

10. LEGGE APPLICABILE
Il presente contratto e regolato dalla legge applicabile presso la sede del Concedente. Le parti si adoperano per comporre amichevolmente ogni controversia prima di adire il giudice competente.

11. LINGUA
Il presente contratto e redatto in inglese e in italiano. In caso di discrepanza o difformita interpretativa, prevale la versione inglese.

12. ACCETTAZIONE
Accettando per via elettronica, il Distributore conferma di aver letto, compreso e approvato il presente contratto. L'accettazione elettronica, unitamente al nominativo e alla data/ora registrati, costituisce prova del consenso del Distributore.

— BOZZA — Il presente documento e un modello fornito per comodita operativa e deve essere esaminato e validato da un legale qualificato prima dell'uso. Non costituisce consulenza legale.`;
  } else if (sec === "fr") {
    secText = `CONTRAT DE DISTRIBUTION INTERNATIONALE
Contrat n. ${contractNumber}

ENTRE
${brandName} (le "Concedant")
ET
${distCompany} (le "Distributeur")

1. NOMINATION ET OBJET
Le Concedant nomme le Distributeur afin de promouvoir, commercialiser et revendre les produits du Concedant (les "Produits") sur le Territoire, et le Distributeur accepte cette nomination.

2. TERRITOIRE
Le territoire couvert par le present contrat est: ${territory}.

3. EXCLUSIVITE
${exclusive
  ? "Le Distributeur est nomme distributeur EXCLUSIF des Produits sur le Territoire. Pendant la duree du contrat, le Concedant ne nommera pas d'autres distributeurs des Produits sur le Territoire."
  : "Le Distributeur est nomme sur une base NON EXCLUSIVE. Le Concedant pourra nommer d'autres distributeurs des Produits sur le Territoire."}

4. DUREE
Le present contrat prend effet du ${validFrom} au ${validUntil}, sauf resiliation anticipee conformement a ses stipulations. Il pourra etre renouvele par accord ecrit des parties.

5. COMMANDES ET FOURNITURE
Le Distributeur achete les Produits en passant ses commandes via la plateforme NexusHub. Le Concedant s'efforce raisonnablement d'executer les commandes acceptees, sous reserve de disponibilite. Les conditions commerciales et economiques de la fourniture sont convenues separement entre les parties et ne font pas partie du present document.

6. MARQUES ET PROPRIETE INTELLECTUELLE
Le Distributeur peut utiliser les marques et supports du Concedant uniquement pour commercialiser et revendre les Produits pendant la duree du contrat, sans acquerir aucun droit de propriete sur ceux-ci. Toute valeur d'achalandage resultant de cet usage profite au Concedant.

7. OBLIGATIONS DU DISTRIBUTEUR
Le Distributeur s'engage a: (a) promouvoir diligemment les Produits sur le Territoire; (b) respecter toutes les lois et reglementations applicables; (c) preserver la reputation et l'integrite des Produits et de la marque du Concedant; et (d) ne pas solliciter activement de ventes hors du Territoire sans l'accord ecrit prealable du Concedant.

8. CONFIDENTIALITE
Chaque partie conserve confidentielle toute information non publique recue de l'autre partie et ne l'utilise que pour l'execution du present contrat.

9. RESILIATION
Chaque partie peut resilier le contrat en cas de manquement substantiel non repare dans les trente (30) jours suivant une mise en demeure ecrite, ou en cas d'insolvabilite de l'autre partie. L'expiration ou la resiliation n'affecte pas les droits et obligations acquis avant cette date.

10. DROIT APPLICABLE
Le present contrat est regi par le droit applicable au lieu d'etablissement du Concedant. Les parties s'efforcent de resoudre tout litige a l'amiable avant de saisir les juridictions competentes.

11. LANGUE
Le present contrat est etabli en anglais et en francais. En cas de divergence ou de conflit d'interpretation, la version anglaise prevaut.

12. ACCEPTATION
En acceptant par voie electronique, le Distributeur confirme avoir lu, compris et approuve le present contrat. L'acceptation electronique, ainsi que le nom et l'horodatage enregistres, attestent du consentement du Distributeur.

— PROJET — Le present document est un modele fourni pour des raisons pratiques et doit etre examine et valide par un conseil juridique qualifie avant utilisation. Il ne constitue pas un avis juridique.`;
  } else if (sec === "es") {
    secText = `CONTRATO DE DISTRIBUCION INTERNACIONAL
Contrato n. ${contractNumber}

ENTRE
${brandName} (el "Concedente")
Y
${distCompany} (el "Distribuidor")

1. NOMBRAMIENTO Y OBJETO
El Concedente nombra al Distribuidor para promover, comercializar y revender los productos del Concedente (los "Productos") en el Territorio, y el Distribuidor acepta dicho nombramiento.

2. TERRITORIO
El territorio cubierto por el presente contrato es: ${territory}.

3. EXCLUSIVIDAD
${exclusive
  ? "El Distribuidor es nombrado distribuidor EXCLUSIVO de los Productos en el Territorio. Durante la vigencia, el Concedente no nombrara a otros distribuidores de los Productos en el Territorio."
  : "El Distribuidor es nombrado con caracter NO EXCLUSIVO. El Concedente podra nombrar a otros distribuidores de los Productos en el Territorio."}

4. DURACION
El presente contrato es eficaz desde el ${validFrom} hasta el ${validUntil}, salvo resolucion anticipada conforme a sus terminos. Podra renovarse por acuerdo escrito de las partes.

5. PEDIDOS Y SUMINISTRO
El Distribuidor adquiere los Productos cursando los pedidos a traves de la plataforma NexusHub. El Concedente realizara esfuerzos razonables para atender los pedidos aceptados, sujeto a disponibilidad. Las condiciones comerciales y economicas del suministro se acuerdan por separado entre las partes y no forman parte del presente documento.

6. MARCAS Y PROPIEDAD INTELECTUAL
El Distribuidor podra usar las marcas y materiales del Concedente unicamente para comercializar y revender los Productos durante la vigencia, sin adquirir ningun derecho de propiedad sobre los mismos. Todo fondo de comercio derivado de dicho uso beneficia al Concedente.

7. OBLIGACIONES DEL DISTRIBUIDOR
El Distribuidor se obliga a: (a) promover diligentemente los Productos en el Territorio; (b) cumplir todas las leyes y reglamentos aplicables; (c) proteger la reputacion e integridad de los Productos y de la marca del Concedente; y (d) no solicitar activamente ventas fuera del Territorio sin el consentimiento previo y escrito del Concedente.

8. CONFIDENCIALIDAD
Cada parte mantendra confidencial toda informacion no publica recibida de la otra parte y la utilizara solo para la ejecucion del presente contrato.

9. RESOLUCION
Cualquiera de las partes podra resolver el contrato por incumplimiento sustancial no subsanado en el plazo de treinta (30) dias desde el requerimiento escrito, o en caso de insolvencia de la otra parte. El vencimiento o la resolucion no afectaran a los derechos y obligaciones devengados antes de dicha fecha.

10. LEY APLICABLE
El presente contrato se rige por la ley aplicable en el domicilio del Concedente. Las partes procuraran resolver amistosamente cualquier controversia antes de acudir a los tribunales competentes.

11. IDIOMA
El presente contrato se otorga en ingles y en espanol. En caso de discrepancia o conflicto de interpretacion, prevalecera la version inglesa.

12. ACEPTACION
Al aceptar por via electronica, el Distribuidor confirma haber leido, comprendido y aprobado el presente contrato. La aceptacion electronica, junto con el nombre y la marca de tiempo registrados, acredita el consentimiento del Distribuidor.

— BORRADOR — El presente documento es un modelo facilitado por comodidad operativa y debe ser revisado y validado por un asesor juridico cualificado antes de su uso. No constituye asesoramiento juridico.`;
  } else if (sec === "de") {
    secText = `INTERNATIONALER VERTRIEBSVERTRAG
Vertrag Nr. ${contractNumber}

ZWISCHEN
${brandName} (der "Lizenzgeber")
UND
${distCompany} (der "Vertriebspartner")

1. BESTELLUNG UND GEGENSTAND
Der Lizenzgeber bestellt den Vertriebspartner, die Produkte des Lizenzgebers (die "Produkte") im Gebiet zu bewerben, zu vermarkten und weiterzuverkaufen, und der Vertriebspartner nimmt diese Bestellung an.

2. GEBIET
Das von diesem Vertrag erfasste Gebiet ist: ${territory}.

3. EXKLUSIVITAT
${exclusive
  ? "Der Vertriebspartner wird als ALLEINIGER Vertriebspartner der Produkte im Gebiet bestellt. Wahrend der Laufzeit wird der Lizenzgeber keine weiteren Vertriebspartner fur die Produkte im Gebiet bestellen."
  : "Der Vertriebspartner wird auf NICHT-EXKLUSIVER Basis bestellt. Der Lizenzgeber kann weitere Vertriebspartner fur die Produkte im Gebiet bestellen."}

4. LAUFZEIT
Dieser Vertrag gilt vom ${validFrom} bis zum ${validUntil}, sofern er nicht zuvor gemass seinen Bestimmungen beendet wird. Er kann durch schriftliche Vereinbarung der Parteien verlangert werden.

5. BESTELLUNGEN UND LIEFERUNG
Der Vertriebspartner erwirbt die Produkte durch Bestellungen uber die NexusHub-Plattform. Der Lizenzgeber bemuht sich in angemessener Weise, angenommene Bestellungen vorbehaltlich der Verfugbarkeit auszufuhren. Die kommerziellen und wirtschaftlichen Lieferbedingungen werden gesondert zwischen den Parteien vereinbart und sind nicht Bestandteil dieses Dokuments.

6. MARKEN UND GEISTIGES EIGENTUM
Der Vertriebspartner darf die Marken und Materialien des Lizenzgebers ausschliesslich zur Vermarktung und zum Weiterverkauf der Produkte wahrend der Laufzeit verwenden und erwirbt daran keine Eigentumsrechte. Jeder aus dieser Nutzung entstehende Geschaftswert kommt dem Lizenzgeber zugute.

7. PFLICHTEN DES VERTRIEBSPARTNERS
Der Vertriebspartner verpflichtet sich: (a) die Produkte im Gebiet sorgfaltig zu bewerben; (b) alle anwendbaren Gesetze und Vorschriften einzuhalten; (c) den Ruf und die Integritat der Produkte und der Marke des Lizenzgebers zu schutzen; und (d) ausserhalb des Gebiets ohne vorherige schriftliche Zustimmung des Lizenzgebers nicht aktiv um Verkaufe zu werben.

8. VERTRAULICHKEIT
Jede Partei behandelt alle von der anderen Partei erhaltenen nicht offentlichen Informationen vertraulich und verwendet sie ausschliesslich zur Durchfuhrung dieses Vertrags.

9. KUNDIGUNG
Jede Partei kann diesen Vertrag bei einer wesentlichen Vertragsverletzung kundigen, die nicht innerhalb von dreissig (30) Tagen nach schriftlicher Aufforderung behoben wird, oder bei Insolvenz der anderen Partei. Ablauf oder Kundigung beruhren nicht die vor diesem Zeitpunkt entstandenen Rechte und Pflichten.

10. ANWENDBARES RECHT
Dieser Vertrag unterliegt dem am Sitz des Lizenzgebers anwendbaren Recht. Die Parteien bemuhen sich, Streitigkeiten gutlich beizulegen, bevor sie die zustandigen Gerichte anrufen.

11. SPRACHE
Dieser Vertrag wird in englischer und deutscher Sprache erstellt. Bei Abweichungen oder Auslegungskonflikten ist die englische Fassung massgebend.

12. ANNAHME
Mit der elektronischen Annahme bestatigt der Vertriebspartner, diesen Vertrag gelesen, verstanden und genehmigt zu haben. Die elektronische Annahme bildet zusammen mit dem erfassten Namen und Zeitstempel den Nachweis der Zustimmung des Vertriebspartners.

— ENTWURF — Dieses Dokument ist eine zur betrieblichen Vereinfachung bereitgestellte Vorlage und muss vor der Verwendung von qualifizierten Rechtsberatern gepruft und freigegeben werden. Es stellt keine Rechtsberatung dar.`;
  }

  return { en: en, sec: sec, secName: secName, secText: secText };
}

const ContractModal = ({ contract, brandName, distCompany, distName, distCountry, viewerRole, onClose, onAccepted }) => {
  const doc = buildContract({
    contractNumber: contract.contract_number,
    brandName: brandName, distCompany: distCompany,
    territory: contract.territory,
    exclusive: !!contract.exclusivity,
    validFrom: contract.valid_from,
    validUntil: contract.valid_until,
    distCountry: distCountry,
  });
  const [agreed, setAgreed] = useState(false);
  const [signName, setSignName] = useState(distName || distCompany || "");
  const [saving, setSaving] = useState(false);
  const signed = !!contract.signed_at;
  const canSign = viewerRole === "distributor" && !signed;

  const handleAccept = async () => {
    if (!agreed || !signName.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("contracts").update({
        signed_at: new Date().toISOString(),
        acceptance_name: signName.trim(),
        accepted_by: user ? user.id : null,
        status: "active",
      }).eq("id", contract.id);
      if (onAccepted) onAccepted();
      onClose();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const preStyle = { whiteSpace:"pre-wrap", fontFamily:"Georgia,serif", fontSize:12.5, lineHeight:1.65, color:C.text, margin:0 };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"min(780px,100%)", maxHeight:"90vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>📄 Distribution Agreement · {contract.contract_number}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.textMuted, fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px 22px", overflowY:"auto" }}>
          {signed && (
            <div style={{ marginBottom:16, padding:"10px 14px", borderRadius:8, background:`${C.green}12`, border:`1px solid ${C.green}40`, color:C.green, fontSize:12.5 }}>
              ✓ Accepted by {contract.acceptance_name || "—"} · {new Date(contract.signed_at).toLocaleString("it-IT")}
            </div>
          )}
          <pre style={preStyle}>{doc.en}</pre>
          {doc.secText && (
            <div>
              <div style={{ margin:"22px 0 10px", borderTop:`1px dashed ${C.border}`, paddingTop:16, fontSize:11, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{doc.secName}</div>
              <pre style={preStyle}>{doc.secText}</pre>
            </div>
          )}
        </div>
        {canSign && (
          <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}` }}>
            <label style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:12.5, color:C.textMuted, marginBottom:12, cursor:"pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:3 }}/>
              <span>I have read and accept this distribution agreement on behalf of {distCompany}.</span>
            </label>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <input value={signName} onChange={e=>setSignName(e.target.value)} placeholder="Full name of signatory"
                style={{ flex:1, minWidth:200, padding:"10px 12px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
              <button disabled={!agreed || !signName.trim() || saving} onClick={handleAccept}
                style={{ padding:"10px 22px", borderRadius:8, cursor:(!agreed||!signName.trim()||saving)?"not-allowed":"pointer", background:(!agreed||!signName.trim())?C.surface2:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:(!agreed||!signName.trim())?C.textDim:C.bg, fontSize:13, fontWeight:700 }}>
                {saving?"...":"Accept & Sign"}
              </button>
            </div>
          </div>
        )}
        {viewerRole==="admin" && !signed && (
          <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, fontSize:12, color:C.textMuted }}>In attesa di accettazione da parte del distributore.</div>
        )}
      </div>
    </div>
  );
};


function printInvoice(inv){
  const w = window.open("", "_blank", "width=820,height=900");
  if(!w) return;
  const fmt = (n)=>"\u20ac"+Number(n||0).toLocaleString("it-IT",{minimumFractionDigits:2});
  const html = "<html><head><title>"+(inv.invoice_number||"Fattura")+"</title>"+
    "<style>body{font-family:Georgia,serif;color:#111;padding:40px;max-width:680px;margin:auto}h1{font-size:20px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:18px}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left;font-size:13px}.r{text-align:right}.tot td{font-weight:bold;font-size:16px}.muted{color:#666;font-size:12px}</style></head><body>"+
    "<h1>Fattura "+(inv.invoice_number||"")+"</h1>"+
    "<div class='muted'>"+(inv.type==="nexushub_commission"?"Fattura commissione":"Fattura di vendita")+" \u00b7 "+new Date(inv.created_at).toLocaleDateString("it-IT")+"</div>"+
    "<table><tr><th>Da</th><td>"+(inv.from_entity||"")+(inv.from_vat?(" \u00b7 P.IVA "+inv.from_vat):"")+"</td></tr>"+
    "<tr><th>A</th><td>"+(inv.to_entity||"")+(inv.to_vat?(" \u00b7 P.IVA "+inv.to_vat):"")+"</td></tr></table>"+
    "<table><tr><th>Imponibile</th><td class='r'>"+fmt(inv.subtotal)+"</td></tr>"+
    "<tr><th>IVA ("+Number(inv.vat_rate||0)+"%)</th><td class='r'>"+fmt(inv.vat_amount)+"</td></tr>"+
    "<tr class='tot'><td>Totale</td><td class='r'>"+fmt(inv.total)+"</td></tr></table>"+
    (inv.notes?("<p class='muted'>"+inv.notes+"</p>"):"")+
    "<p class='muted'>Documento generato da NexusHub \u2014 bozza, da validare con il commercialista.</p>"+
    "</body></html>";
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 300);
}

const InvoiceModal = ({ inv, onClose }) => {
  if (!inv) return null;
  const fmt = (n) => "\u20ac" + Number(n||0).toLocaleString("it-IT",{minimumFractionDigits:2});
  const isComm = inv.type === "nexushub_commission";
  const row = { display:"flex", justifyContent:"space-between", padding:"8px 0", borderTop:`1px solid ${C.border}`, fontSize:13, gap:12 };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"min(560px,100%)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>🧾 {inv.invoice_number || "Fattura"}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.textMuted, fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"inline-block", padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:600, marginBottom:16, background:isComm?`${C.gold}15`:`${C.green}15`, color:isComm?C.gold:C.green, border:`1px solid ${isComm?C.gold:C.green}30` }}>{isComm?"Fattura commissione":"Fattura di vendita"}</div>
          <div style={{ ...row, borderTop:"none" }}><span style={{ color:C.textMuted }}>Da</span><span style={{ color:C.text, textAlign:"right" }}>{inv.from_entity}{inv.from_vat?` · P.IVA ${inv.from_vat}`:""}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>A</span><span style={{ color:C.text, textAlign:"right" }}>{inv.to_entity}{inv.to_vat?` · P.IVA ${inv.to_vat}`:""}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>Data</span><span style={{ color:C.text }}>{new Date(inv.created_at).toLocaleDateString("it-IT")}</span></div>
          <div style={{ height:8 }}/>
          <div style={row}><span style={{ color:C.textMuted }}>Imponibile</span><span style={{ color:C.text }}>{fmt(inv.subtotal)}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>IVA ({Number(inv.vat_rate||0)}%)</span><span style={{ color:C.text }}>{fmt(inv.vat_amount)}</span></div>
          <div style={{ ...row, fontWeight:800, fontSize:16 }}><span style={{ color:C.text }}>Totale</span><span style={{ color:C.goldLight }}>{fmt(inv.total)}</span></div>
          {inv.notes && <div style={{ marginTop:14, fontSize:11, color:C.textMuted, lineHeight:1.5 }}>{inv.notes}</div>}
          {inv.pdf_url && <a href={inv.pdf_url} target="_blank" rel="noreferrer" style={{ display:"inline-block", marginTop:14, fontSize:12, color:C.blue }}>📎 Scarica PDF caricato</a>}
        </div>
        <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"flex-end" }}>
          <button onClick={()=>printInvoice(inv)} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>🖨️ Stampa / Salva PDF</button>
        </div>
      </div>
    </div>
  );
};

const DistributorDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("brands");
  const [cart, setCart] = useState({});
  const [dbBrands, setDbBrands] = useState([]);
  const [accessRequests, setAccessRequests] = useState({});
  const [brandDiscounts, setBrandDiscounts] = useState({});
  const [realProducts, setRealProducts] = useState([]);
  const [distDocsProduct, setDistDocsProduct] = useState(null);
  const [distDocs, setDistDocs] = useState([]);
  const [issueOrder, setIssueOrder] = useState(null);
  const [issueForm, setIssueForm] = useState({ reason:"", photo_file:null });
  const [issueBusy, setIssueBusy] = useState(false);
  const [realOrders, setRealOrders] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const openDistDocs = async (p) => {
    setDistDocsProduct(p); setDistDocs([]);
    const { data } = await supabase.from("product_documents").select("*").eq("product_id", p.id).order("created_at", { ascending:false });
    setDistDocs(data || []);
  };
  const openIssue = (o) => { setIssueOrder(o); setIssueForm({ reason:"", photo_file:null }); };
  const submitIssue = async () => {
    if (!issueOrder || !issueForm.reason.trim()) { window.alert("Descrivi il problema prima di inviare."); return; }
    setIssueBusy(true);
    try {
      let photoUrl = null;
      if (issueForm.photo_file) {
        const f = issueForm.photo_file;
        const path = "order-issues/" + issueOrder.id + "_" + Date.now() + "_" + f.name;
        const up = await supabase.storage.from("documents").upload(path, f, { upsert: true });
        if (up && up.data) photoUrl = supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
      }
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("order_issues").insert({
        order_id: issueOrder.id, distributor_id: user.id, brand_id: issueOrder.brand_id || null,
        reason: issueForm.reason.trim(), photo_url: photoUrl, status: "open"
      });
      setIssueOrder(null); setIssueForm({ reason:"", photo_file:null });
      window.alert("Segnalazione inviata. Resta tracciata e verrai ricontattato.");
    } catch(e) { console.error(e); window.alert("Errore nell'invio della segnalazione."); }
    setIssueBusy(false);
  };
  const [orderNote, setOrderNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("sepa"); // sepa, card, sepa_debit
  const [currentUser, setCurrentUser] = useState(null);
  const [countryPrices, setCountryPrices] = useState({});
  const [distContracts, setDistContracts] = useState([]);
  const [distInvoices, setDistInvoices] = useState([]);
  const [invoiceView, setInvoiceView] = useState(null);
  const [viewContract, setViewContract] = useState(null);
  const approvedBrandIds = Object.keys(accessRequests).filter(id => accessRequests[id] === "approved");
  const visibleProducts = realProducts.filter(p => approvedBrandIds.includes(p.brand_id));
  const discPct = (brandId) => Number(brandDiscounts[brandId] || 0);
  const basePrice = (p) => { const cp = p && countryPrices[p.id]; return cp != null ? Number(cp) : Number((p && p.unit_price) || 0); };
  const effPrice = (p) => { const base = basePrice(p); const d = discPct(p && p.brand_id); return d > 0 ? Math.round(base * (1 - d/100) * 100) / 100 : base; };
  const [distNotifs, setDistNotifs] = useState([]);
  const [distNotifPanel, setDistNotifPanel] = useState(false);
  const distUnread = distNotifs.filter(n => !n.read).length;
  const toggleWishlist = async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (wishlist.includes(productId)) {
      await supabase.from("wishlist_items").delete().eq("distributor_id", user.id).eq("product_id", productId);
      setWishlist(w => w.filter(id => id !== productId));
    } else {
      await supabase.from("wishlist_items").insert({ distributor_id: user.id, product_id: productId });
      setWishlist(w => [...w, productId]);
    }
  };

  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);
  const cartValue = Object.entries(cart).reduce((s,[pid,qty]) => {
    const item = realProducts.find(p=>p.id===pid);
    return s + (item ? effPrice(item) * qty : 0);
  }, 0);

  useEffect(() => {
    // Load current user
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("profiles").select("*").eq("id", data.user.id).single()
          .then(async ({ data: profile }) => {
            setCurrentUser(profile);
            if (profile && profile.country) {
              const { data: cp } = await supabase.from("product_country_prices").select("product_id, price").eq("country", profile.country);
              const m = {}; (cp||[]).forEach(r => { m[r.product_id] = r.price; }); setCountryPrices(m);
            }
          });
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
    // Load wishlist
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("wishlist_items").select("product_id").eq("distributor_id", data.user.id)
          .then(({ data: w }) => setWishlist((w||[]).map(r => r.product_id)));
      }
    });

    // Load notifications
    // Load real brands (approved) for the marketplace — empty until brands register
    supabase.from("profiles").select("id, company_name, email, country, trust_score, account_state")
      .eq("role", "brand").eq("status", "approved")
      .then(({ data }) => setDbBrands(data || []));
    const loadAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("brand_access_requests")
        .select("brand_id, status, discount_pct").eq("distributor_id", user.id);
      const map = {}; const dmap = {};
      (data || []).forEach(rec => { map[rec.brand_id] = rec.status; dmap[rec.brand_id] = rec.discount_pct || 0; });
      setAccessRequests(map); setBrandDiscounts(dmap);
    };
    loadAccess();
    const loadDistNotifs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications")
        .select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(30);
      setDistNotifs(data || []);
    };
    loadDistNotifs();
    const loadDistContracts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("contracts")
        .select("*, brand:profiles!contracts_brand_id_fkey(company_name, country)")
        .eq("distributor_id", user.id)
        .order("created_at", { ascending: false });
      setDistContracts(data || []);
    };
    loadDistContracts();
    const loadDistInvoices = async () => {
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user) return;
      const { data: ords } = await supabase.from("orders").select("id").eq("distributor_id", user.id);
      const ids = (ords||[]).map(o=>o.id);
      if(!ids.length){ setDistInvoices([]); return; }
      const { data } = await supabase.from("invoices").select("*").in("order_id", ids).eq("type","brand_to_distributor").order("created_at",{ascending:false});
      setDistInvoices(data||[]);
    };
    loadDistInvoices();

    const channel = supabase.channel("dist-notifs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => { setDistNotifs(prev => [payload.new, ...prev]); if (payload.new?.type === "access_update") loadAccess(); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const requestAccess = async (brand) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setAccessRequests(prev => ({ ...prev, [brand.id]: "pending" }));
    const { error } = await supabase.from("brand_access_requests").upsert({
      distributor_id: user.id, brand_id: brand.id, status: "pending", updated_at: new Date().toISOString()
    }, { onConflict: "distributor_id,brand_id" });
    if (error) { console.error("access request error:", error); return; }
    await supabase.from("notifications").insert({
      user_id: brand.id,
      title: "Nuova richiesta di accesso",
      message: `${currentUser?.company_name || "Un distributore"} ha richiesto l'accesso ai tuoi prodotti.`,
      type: "access_request",
    });
    // Se il territorio è già assegnato in ESCLUSIVA per questo brand, blocca subito la richiesta
    const myCountry = (currentUser?.country || "").trim().toLowerCase();
    if (myCountry) {
      const { data: existing } = await supabase.from("brand_access_requests")
        .select("id, distributor:profiles!brand_access_requests_distributor_id_fkey(country)")
        .eq("brand_id", brand.id).eq("status", "approved").eq("exclusive", true);
      const taken = (existing || []).some(e => (e.distributor?.country || "").trim().toLowerCase() === myCountry);
      if (taken) {
        await supabase.from("brand_access_requests")
          .update({ status: "blocked", updated_at: new Date().toISOString() })
          .eq("distributor_id", user.id).eq("brand_id", brand.id);
        setAccessRequests(prev => ({ ...prev, [brand.id]: "blocked" }));
      }
    }
  };
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
          return { product_id: pid, quantity: qty, product_name: product?.name || "", sku: product?.sku || "", unit_price: effPrice(product) };
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
    { key:"wishlist", icon:"♥", label:"Desideri" },
    { key:"orders", icon:"↗", label:t("tabMyOrders") },
    { key:"fatture", icon:"🧾", label:"Fatture" },
    { key:"ai", icon:"🤖", label:"AI Suggestions" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      <Navbar name="Distributor Portal" badge="distributor" onLogout={onLogout} lang={lang} onLangChange={onLangChange}
        onNotifications={() => setDistNotifPanel(p=>!p)} notifCount={distUnread}/>
      {viewContract && (
        <ContractModal
          contract={viewContract}
          brandName={(viewContract.brand && viewContract.brand.company_name) || "Brand"}
          distCompany={(currentUser && currentUser.company_name) || ""}
          distName={(currentUser && currentUser.full_name) || ""}
          distCountry={(currentUser && currentUser.country) || ""}
          viewerRole="distributor"
          onClose={() => setViewContract(null)}
          onAccepted={() => setDistContracts(prev => prev.map(c => c.id===viewContract.id ? { ...c, signed_at: new Date().toISOString(), status:"active" } : c))}
        />
      )}
      <div style={{ padding:"16px 12px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab}/>
        {tab==="brands" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("marketTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("marketSub")}</p>
            {dbBrands.length === 0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🏛️</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Nessun brand disponibile al momento</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:420, margin:"0 auto" }}>Appena un brand si registra e viene approvato sulla piattaforma comparirà qui, e potrai richiedere l'accesso ai suoi prodotti.</div>
              </div>
            ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap:16 }}>
              {dbBrands.map(brand => {
                const status = accessRequests[brand.id];
                const bname = brand.company_name || brand.email || "Brand";
                return (
                  <div key={brand.id} style={{ background:C.surface, border:`1px solid ${status==="approved"?C.goldDim:C.border}`, borderTop:`2px solid ${status==="approved"?C.gold:status==="blocked"?C.red:C.border}`, borderRadius:14, padding:22 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                      <div style={{ width:46, height:46, borderRadius:12, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:C.bg, flexShrink:0 }}>{(bname[0]||"B").toUpperCase()}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{bname}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>📍 {brand.country || "—"}</div>
                        <div style={{ marginTop:6 }}><TrustBadge score={brand.trust_score} state={brand.account_state}/></div>
                      </div>
                      {status==="approved" && <Badge status="active"/>}
                      {status==="blocked" && <Badge status="rejected"/>}
                    </div>
                    <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.55 }}>Richiedi l'accesso per visualizzare e ordinare il catalogo di questo brand nel tuo territorio.</p>
                    {status==="approved" ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}><button onClick={() => setTab("catalog")} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:13, fontWeight:600 }}>{t("viewCatalogBtn")}</button>{(() => { const ctr = distContracts.find(c => c.brand_id === brand.id); if (!ctr) return null; const sg = !!ctr.signed_at; return (<button onClick={() => setViewContract(ctr)} style={{ width:"100%", padding:"10px", borderRadius:8, cursor:"pointer", background: sg?`${C.green}12`:`${C.blue}12`, border:`1px solid ${sg?C.green:C.blue}40`, color: sg?C.green:C.blue, fontSize:12.5, fontWeight:600 }}>{sg ? "📄 View signed agreement" : "✍️ Review & sign agreement"}</button>); })()}</div>
                    ) : status==="pending" ? (
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.blue}10`, border:`1px solid ${C.blue}30`, color:C.blue, fontSize:13 }}>{t("requestSentMsg")}</div>
                    ) : status==="blocked" ? (
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red, fontSize:13 }}>🚫 Accesso bloccato dal brand</div>
                    ) : (
                      <button onClick={() => requestAccess(brand)} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("requestAccessBtn")}</button>
                    )}
                  </div>
                );
              })}
            </div>
            )}
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

            {distDocsProduct && (
              <Modal title={"Documenti · " + (distDocsProduct.name || "Prodotto")} onClose={() => { setDistDocsProduct(null); setDistDocs([]); }} onSave={() => { setDistDocsProduct(null); setDistDocs([]); }} saveLabel="Chiudi">
                {distDocs.length === 0 ? (
                  <div style={{ textAlign:"center", padding:20, color:C.textMuted, fontSize:13 }}>Nessun documento disponibile per questo prodotto.</div>
                ) : distDocs.map(d => (
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:8 }}>
                    <span style={{ fontSize:18 }}>📄</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>{new Date(d.created_at).toLocaleDateString("it-IT")}</div>
                    </div>
                    <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"5px 12px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>Scarica</a>
                  </div>
                ))}
              </Modal>
            )}
            {/* Product grid with real stock */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap:14 }}>
              {visibleProducts.length === 0 ? (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:C.textMuted }}>
                  Non hai ancora accesso a nessun brand. Vai su "Marketplace Brand" e richiedi l'accesso per vedere i prodotti.
                </div>
              ) : visibleProducts.map(p => {
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
                      <div style={{ textAlign:"right" }}>{(() => { const lp = basePrice(p); const ep = effPrice(p); const d = discPct(p.brand_id); const hasC = countryPrices[p.id] != null && Number(countryPrices[p.id]) !== Number(p.unit_price||0); return (<div>{d > 0 && <div style={{ fontSize:11, color:C.textMuted, textDecoration:"line-through" }}>€{lp.toFixed(2)}</div>}<div style={{ fontSize:16, fontWeight:800, color:d>0?C.green:C.goldLight }}>€{ep.toFixed(2)}</div>{d > 0 && <div style={{ fontSize:10, color:C.green, fontWeight:700 }}>-{d}%</div>}{hasC && <div style={{ fontSize:9, color:C.blue, fontWeight:700 }}>listino {(currentUser?.country||"").toUpperCase()}</div>}</div>); })()}</div>
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
                    <button onClick={() => toggleWishlist(p.id)} style={{ width:"100%", marginBottom:8, padding:"7px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background: wishlist.includes(p.id)?`${C.red}15`:"transparent", border:`1px solid ${wishlist.includes(p.id)?C.red:C.border}`, color: wishlist.includes(p.id)?C.red:C.textMuted }}>{wishlist.includes(p.id) ? "♥ Nei desideri" : "♡ Aggiungi ai desideri"}</button><button onClick={() => openDistDocs(p)} style={{ width:"100%", marginBottom:12, padding:"7px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.gold}10`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>📎 Documenti / schede</button>
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
        {invoiceView && <InvoiceModal inv={invoiceView} onClose={()=>setInvoiceView(null)}/>}
        {tab==="fatture" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 Le mie fatture</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Fatture di acquisto ricevute dai brand per i tuoi ordini.</p>
            {distInvoices.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>Nessuna fattura ancora.</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:680 }}>
                  <thead><tr style={{ background:C.surface2 }}>{["Numero","Brand","Imponibile","IVA","Totale","Azione"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}</tr></thead>
                  <tbody>
                    {distInvoices.map((inv,i)=>(
                      <tr key={inv.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{inv.invoice_number}</span></td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{inv.from_entity}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.textMuted }}>€{Number(inv.subtotal||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.textMuted }}>{Number(inv.vat_rate||0)}%</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{Number(inv.total||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"11px 14px" }}><button onClick={()=>setInvoiceView(inv)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>Vedi</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab==="ai" && (
          <NexusAI role="distributor"/>
        )}

        {tab==="wishlist" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Lista desideri</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>I prodotti che hai salvato. Aggiungili al carrello quando vuoi.</p>
            {(() => {
              const wp = visibleProducts.filter(p => wishlist.includes(p.id));
              if (wp.length === 0) return (
                <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>♡</div>
                  <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:8 }}>Nessun desiderio salvato</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>Vai al catalogo e tocca il cuore sui prodotti che ti interessano.</div>
                  <button onClick={() => setTab("catalog")} style={{ padding:"10px 24px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>Vai al catalogo →</button>
                </div>
              );
              return (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap:14 }}>
                  {wp.map(p => {
                    const stock = p.inventory?.quantity_available || 0;
                    const ep = effPrice(p);
                    return (
                      <div key={p.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:16 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>{p.sku} · {p.category}</div>
                        <div style={{ fontSize:16, fontWeight:800, color:C.goldLight, marginBottom:6 }}>€{ep.toFixed(2)}</div>
                        <div style={{ fontSize:11, color: stock>0?C.green:C.red, marginBottom:10 }}>{stock>0 ? `${stock} in stock` : "Esaurito"}</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button disabled={stock<=0} onClick={() => { const moq=p.min_order_qty||1, mult=p.order_multiple||1; setCart(c => ({ ...c, [p.id]: Math.min(stock, Math.max(moq,mult)) })); setTab("catalog"); window.scrollTo(0,0); }} style={{ flex:1, padding:"8px 10px", borderRadius:7, cursor: stock>0?"pointer":"not-allowed", background: stock>0?`${C.gold}20`:C.surface2, border:`1px solid ${stock>0?C.gold:C.border}`, color: stock>0?C.goldLight:C.textMuted, fontSize:12, fontWeight:600 }}>Aggiungi al carrello</button>
                          <button onClick={() => toggleWishlist(p.id)} style={{ padding:"8px 12px", borderRadius:7, cursor:"pointer", background:`${C.red}10`, border:`1px solid ${C.red}40`, color:C.red, fontSize:13 }}>♥</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
                      <button onClick={() => {
                        const items = o.order_items || [];
                        const next = {};
                        let skipped = 0;
                        items.forEach(it => {
                          const p = visibleProducts.find(rp => rp.id === it.product_id);
                          if (!p) { skipped++; return; }
                          const stk = p.inventory?.quantity_available || 0;
                          if (stk <= 0) { skipped++; return; }
                          next[p.id] = Math.min(Number(it.quantity)||1, stk);
                        });
                        if (Object.keys(next).length === 0) { window.alert("Nessun prodotto di questo ordine e ancora disponibile nel tuo catalogo."); return; }
                        setCart(next);
                        setTab("catalog");
                        window.scrollTo(0,0);
                        if (skipped > 0) window.alert(skipped + " prodotto/i non piu disponibili sono stati saltati. Gli altri sono nel carrello.");
                      }} style={{ marginLeft:"auto", fontSize:11, color:C.goldLight, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>🔁 Riordina</button>
                      <button onClick={() => openIssue(o)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>🚩 Segnala problema</button>
                    </div>
                    {o.tracking_number && (
                      <div style={{ marginTop:8, fontSize:12, color:C.blue }}>
                        🚚 {o.courier||"Corriere"} · Tracking: <span style={{ fontFamily:"monospace" }}>{o.tracking_number}</span>
                        {o.tracking_url && <> · <a href={o.tracking_url} target="_blank" rel="noreferrer" style={{ color:C.blue, textDecoration:"underline" }}>Traccia</a></>}
                      </div>
                    )}
                    {(o.status === "delivered" || o.rating) && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, color:C.textMuted, marginRight:4 }}>{o.rating ? "La tua valutazione:" : "Valuta questo ordine:"}</span>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} onClick={async () => {
                            await supabase.from("orders").update({ rating: star, rated_at: new Date().toISOString() }).eq("id", o.id);
                            setRealOrders(prev => prev.map(x => x.id===o.id ? {...x, rating: star} : x));
                          }} style={{ cursor:"pointer", fontSize:18, lineHeight:1, color:(o.rating||0)>=star ? C.gold : C.border }}>★</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    {issueOrder && (
      <Modal title={"Segnala un problema - " + (issueOrder.order_number || "")} onClose={() => setIssueOrder(null)} onSave={submitIssue} saveLabel={issueBusy ? "Invio..." : "Invia segnalazione"}>
        <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>Descrivi il problema (merce danneggiata, quantita errata, prodotto sbagliato...). La segnalazione resta tracciata e verrai ricontattato.</p>
        <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>Motivo *</label>
        <textarea value={issueForm.reason} onChange={e => setIssueForm(f => ({...f, reason:e.target.value}))} rows={4} placeholder="Descrivi cosa e successo..." style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", marginBottom:14 }}/>
        <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"16px 12px", borderRadius:10, cursor:"pointer", background: issueForm.photo_file ? `${C.green}10` : C.surface2, border:`1px dashed ${issueForm.photo_file ? C.green : C.border}`, textAlign:"center" }}>
          <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files&&e.target.files[0]; if(f) setIssueForm(p=>({...p, photo_file:f})); }}/>
          <span style={{ fontSize:22 }}>{issueForm.photo_file ? "✓" : "📷"}</span>
          <span style={{ fontSize:11, color: issueForm.photo_file ? C.green : C.textMuted }}>{issueForm.photo_file ? issueForm.photo_file.name : "Allega foto (opzionale)"}</span>
        </label>
      </Modal>
    )}
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
                    €{(effPrice(p) * qty).toLocaleString("it-IT")}
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

          {/* Payment method selection */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Scegli Metodo di Pagamento</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>

              {/* SEPA Bonifico */}
              <div onClick={() => setSelectedPayment("sepa")}
                style={{ padding:"14px 16px", background: selectedPayment==="sepa" ? `${C.gold}12` : C.surface2,
                  border:`2px solid ${selectedPayment==="sepa" ? C.gold : C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: selectedPayment==="sepa" ? 12 : 0 }}>
                  <span style={{ fontSize:22 }}>🏦</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Bonifico SEPA</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>Gratuito · 1-2 giorni lavorativi</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selectedPayment==="sepa"?C.gold:C.border}`,
                    background: selectedPayment==="sepa" ? C.gold : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {selectedPayment==="sepa" && <div style={{ width:8, height:8, borderRadius:"50%", background:C.bg }}/>}
                  </div>
                </div>
                {/* Mostra IBAN del brand solo se selezionato */}
                {selectedPayment==="sepa" && (
                  <div style={{ padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8 }}>
                    <div style={{ fontSize:11, color:C.textMuted, marginBottom:8, fontWeight:600 }}>
                      💳 Effettua il bonifico direttamente al brand:
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {currentUser?.iban ? [
                        ["Intestatario", currentUser.account_holder || currentUser.company_name],
                        ["Banca", currentUser.bank_name || "—"],
                        ["IBAN", currentUser.iban],
                        ["BIC/SWIFT", currentUser.swift_bic || "—"],
                      ].map(([k,v]) => (
                        <div key={k}>
                          <div style={{ fontSize:9, color:C.textDim, textTransform:"uppercase", letterSpacing:".06em" }}>{k}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:C.goldLight, fontFamily:"monospace", marginTop:1 }}>{v}</div>
                        </div>
                      )) : (
                        <div style={{ gridColumn:"1/-1", fontSize:12, color:C.red }}>
                          ⚠️ Dati bancari del brand non ancora inseriti. Contatta NexusHub.
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop:10, padding:"8px 10px", background:`${C.gold}10`, border:`1px solid ${C.gold}25`, borderRadius:6, fontSize:11, color:C.gold }}>
                      📋 Causale: <strong style={{ fontFamily:"monospace" }}>NEXUSHUB · €{cartValue.toLocaleString("it-IT",{minimumFractionDigits:2})}</strong>
                    </div>
                    <div style={{ marginTop:6, fontSize:11, color:C.textMuted }}>
                      ✅ Stock riservato subito · Fattura automatica via email · Consegna: <strong style={{ color:C.green }}>48h da Torino</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Carta di credito */}
              <div onClick={() => setSelectedPayment("card")}
                style={{ padding:"14px 16px", background: selectedPayment==="card" ? `#635bff15` : C.surface2,
                  border:`2px solid ${selectedPayment==="card" ? "#635bff" : C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>💳</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Carta di Credito / Debito</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>Istantaneo · Powered by Stripe</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selectedPayment==="card"?"#635bff":C.border}`,
                    background: selectedPayment==="card" ? "#635bff" : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {selectedPayment==="card" && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                  </div>
                </div>
              </div>

              {/* SEPA Debit */}
              <div onClick={() => setSelectedPayment("sepa_debit")}
                style={{ padding:"14px 16px", background: selectedPayment==="sepa_debit" ? `${C.blue}12` : C.surface2,
                  border:`2px solid ${selectedPayment==="sepa_debit" ? C.blue : C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>⚡</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>SEPA Direct Debit</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>Addebito automatico · Gratuito</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selectedPayment==="sepa_debit"?C.blue:C.border}`,
                    background: selectedPayment==="sepa_debit" ? C.blue : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {selectedPayment==="sepa_debit" && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                  </div>
                </div>
              </div>

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

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* Bottone dinamico in base al metodo selezionato */}
            {(selectedPayment === "sepa" || selectedPayment === "sepa_debit") && (
              <button onClick={placeOrder} disabled={orderLoading}
                style={{ width:"100%", padding:"14px", borderRadius:10, cursor:"pointer",
                  background:`linear-gradient(135deg,${C.gold},${C.goldDim})`,
                  border:"none", color:C.bg, fontSize:14, fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                {orderLoading ? "⏳ Invio ordine..." : selectedPayment==="sepa" ? "🏦 Conferma Ordine — Paga via Bonifico" : "⚡ Conferma Ordine — SEPA Debit"}
              </button>
            )}
            {/* Paga con Carta via Stripe */}
            {selectedPayment === "card" && (
            <button onClick={async () => {
              if (cartCount === 0) return;
              setOrderLoading(true);
              try {
                // Prima crea l ordine
                const { data: { user } } = await supabase.auth.getUser();
                const items = Object.entries(cart).filter(([,qty])=>qty>0).map(([pid,qty]) => {
                  const product = realProducts.find(p=>p.id===pid);
                  return { product_id:pid, quantity:qty, product_name:product?.name||"", sku:product?.sku||"", unit_price:product?.unit_price||0 };
                });
                const total = items.reduce((s,i)=>s+(i.unit_price*i.quantity),0);
                const { data: order } = await supabase.from("orders").insert({
                  distributor_id: user.id,
                  brand_id: items[0] ? realProducts.find(p=>p.id===items[0].product_id)?.brand_id : null,
                  total_amount: total,
                  status: "pending",
                  payment_method: "card",
                  notes: orderNote,
                }).select().single();
                if (order) {
                  await supabase.from("order_items").insert(items.map(i=>({...i, order_id:order.id})));
                  // Crea sessione Stripe
                  const res = await fetch(
                    `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/stripe-checkout`,
                    {
                      method: "POST",
                      headers: { "Content-Type":"application/json", "Authorization":`Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
                      body: JSON.stringify({
                        order_id: order.id,
                        amount: total,
                        brand_name: realProducts.find(p=>p.id===items[0]?.product_id)?.profiles?.company_name || "Brand",
                        order_number: order.order_number,
                        distributor_email: currentUser?.email,
                        items: items.length,
                      })
                    }
                  );
                  const data = await res.json();
                  if (data.checkout_url) {
                    // Reindirizza a Stripe Checkout
                    window.location.href = data.checkout_url;
                  } else if (data.error && data.error.includes("not configured")) {
                    alert("⚙️ Stripe non ancora configurato. Contatta NexusHub per abilitare i pagamenti con carta.");
                  } else {
                    alert("Errore Stripe: " + (data.error || "Riprova"));
                  }
                }
              } catch(e) {
                alert("Errore: " + e.message);
              }
              setOrderLoading(false);
            }} disabled={orderLoading} style={{ width:"100%", padding:"14px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#635bff,#4b44cc)", border:"none", color:"#fff", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              💳 Paga con Carta via Stripe
            </button>
            )}
            <button onClick={() => setShowCheckout(false)} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>
              Annulla
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
  const [retailTargets, setRetailTargets] = useState([]);
  const [retailModal, setRetailModal] = useState(null);
  const [retailForm, setRetailForm] = useState({});
  const [complianceDocs, setComplianceDocs] = useState([]);
  const [compModal, setCompModal] = useState(false);
  const [compForm, setCompForm] = useState({});
  const [compBusy, setCompBusy] = useState(false);
  const [marginRows, setMarginRows] = useState([]);
  const [marginBusy, setMarginBusy] = useState(false);
  const [feeRate, setFeeRate] = useState(11.4);
  const [opEdits, setOpEdits] = useState({});
  const [amazonRows, setAmazonRows] = useState([]);
  const [amazonModal, setAmazonModal] = useState(false);
  const [amazonForm, setAmazonForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [adminViewContract, setAdminViewContract] = useState(null);
  const [contractCreate, setContractCreate] = useState(false);
  const [contractForm, setContractForm] = useState({});
  const [paySplits, setPaySplits] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [orderIssues, setOrderIssues] = useState([]);
  const [commissionRows, setCommissionRows] = useState([]);
  const [commissionLog, setCommissionLog] = useState([]);
  const [recalcing, setRecalcing] = useState(false);

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
  const [linkProductId, setLinkProductId] = useState("");
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

  const loadRetail = async () => {
    const { data } = await supabase.from("retail_targets").select("*").order("created_at", { ascending:false });
    setRetailTargets(data || []);
  };
  const openRetail = (t) => {
    setRetailForm(t ? { ...t } : { retailer_name:"", country:"", buyer_name:"", buyer_email:"", brand_id:"", candidate_products:"", stage:"lead", probability:0, next_followup:"", notes:"", samples_sent:false });
    setRetailModal(t || { _new:true });
  };
  const saveRetail = async () => {
    const f = retailForm;
    if (!f.retailer_name || !f.retailer_name.trim()) { notify("Inserisci il nome del retailer", "error"); return; }
    const payload = {
      retailer_name: f.retailer_name.trim(), country: f.country||null, buyer_name: f.buyer_name||null,
      buyer_email: f.buyer_email||null, brand_id: f.brand_id||null, candidate_products: f.candidate_products||null,
      stage: f.stage||"lead", probability: Math.max(0, Math.min(100, Number(f.probability)||0)),
      samples_sent: !!f.samples_sent, next_followup: f.next_followup||null, notes: f.notes||null,
      updated_at: new Date().toISOString()
    };
    if (f.id) {
      await supabase.from("retail_targets").update(payload).eq("id", f.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      payload.created_by = user?.id || null;
      await supabase.from("retail_targets").insert(payload);
    }
    notify("Target salvato");
    setRetailModal(null);
    loadRetail();
  };
  const setRetailStage = async (t, stage) => {
    await supabase.from("retail_targets").update({ stage, updated_at:new Date().toISOString() }).eq("id", t.id);
    setRetailTargets(prev => prev.map(x => x.id===t.id ? { ...x, stage } : x));
  };
  const deleteRetail = async (t) => {
    if (!window.confirm("Eliminare il target " + t.retailer_name + "?")) return;
    await supabase.from("retail_targets").delete().eq("id", t.id);
    setRetailTargets(prev => prev.filter(x => x.id !== t.id));
  };
  const loadCompliance = async () => {
    const { data } = await supabase.from("compliance_documents").select("*").order("created_at", { ascending:false });
    setComplianceDocs(data || []);
  };
  const uploadCompliance = async () => {
    const f = compForm;
    if (!f.owner_id) { notify("Scegli il titolare del documento", "error"); return; }
    if (!f.file) { notify("Scegli un file", "error"); return; }
    setCompBusy(true);
    try {
      const path = "compliance/" + f.owner_id + "/" + Date.now() + "_" + f.file.name;
      const up = await supabase.storage.from("documents").upload(path, f.file, { upsert:true });
      if (!up || up.error) { notify("Errore nel caricamento", "error"); setCompBusy(false); return; }
      const url = supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compliance_documents").insert({
        owner_id: f.owner_id, category: f.category||"other", name: (f.name||f.file.name),
        file_url: url, file_type: f.file.type||null, expires_at: f.expires_at||null,
        notes: f.notes||null, uploaded_by: user?.id||null
      });
      notify("Documento caricato nel vault");
      setCompModal(false); setCompForm({}); loadCompliance();
    } catch(e) { console.error(e); notify("Errore", "error"); }
    setCompBusy(false);
  };
  const deleteCompliance = async (d) => {
    if (!window.confirm("Eliminare il documento " + d.name + "?")) return;
    await supabase.from("compliance_documents").delete().eq("id", d.id);
    setComplianceDocs(prev => prev.filter(x => x.id !== d.id));
  };
  const loadMargins = async () => {
    setMarginBusy(true);
    const [r1, r2, r3] = await Promise.all([
      supabase.from("orders").select("id, order_number, total_amount, status, created_at, brand_id, brandp:profiles!orders_brand_id_fkey(company_name)").neq("status","cancelled").order("created_at",{ ascending:false }),
      supabase.from("payment_splits").select("order_id, nexushub_amount, stripe_fee, brand_amount, total_amount"),
      supabase.from("order_economics").select("order_id, operating_cost")
    ]);
    const sMap={}; (r2.data||[]).forEach(x=>{ sMap[x.order_id]=x; });
    const eMap={}; (r3.data||[]).forEach(x=>{ eMap[x.order_id]=x; });
    setMarginRows((r1.data||[]).map(o=>({ ...o, split:sMap[o.id]||null, econ:eMap[o.id]||null })));
    setMarginBusy(false);
  };
  const saveOpCost = async (orderId, val) => {
    const v = Math.max(0, Number(val)||0);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("order_economics").upsert({ order_id:orderId, operating_cost:v, updated_by:user?.id||null, updated_at:new Date().toISOString() }, { onConflict:"order_id" });
    setMarginRows(prev=>prev.map(r=>r.id===orderId?{ ...r, econ:{ order_id:orderId, operating_cost:v } }:r));
    setOpEdits(prev=>{ const n={...prev}; delete n[orderId]; return n; });
    notify("Costo operativo salvato");
  };
  const loadAmazon = async () => {
    const { data } = await supabase.from("amazon_listings").select("*").order("created_at", { ascending:false });
    setAmazonRows(data || []);
  };
  const openAmazon = (t) => {
    setAmazonForm(t ? { ...t } : { product_name:"", asin:"", sku:"", brand_id:"", marketplace:"IT", fulfillment:"FBA", cost_price:0, sell_price:0, referral_fee_pct:15, fba_fee:0, units_in_stock:0, units_sold_30d:0, ad_spend_30d:0, notes:"", _catalog:"" });
    setAmazonModal(t || { _new:true });
  };
  const saveAmazon = async () => {
    const f = amazonForm;
    if (!f.product_name || !f.product_name.trim()) { notify("Inserisci il nome prodotto", "error"); return; }
    const payload = {
      product_name: f.product_name.trim(), asin: f.asin||null, sku: f.sku||null, brand_id: f.brand_id||null, product_id: f.product_id||null,
      marketplace: f.marketplace||"IT", fulfillment: f.fulfillment||"FBA",
      cost_price: Number(f.cost_price)||0, sell_price: Number(f.sell_price)||0,
      referral_fee_pct: Number(f.referral_fee_pct)||0, fba_fee: Number(f.fba_fee)||0, ad_spend_30d: Number(f.ad_spend_30d)||0,
      units_in_stock: Math.max(0, parseInt(f.units_in_stock)||0), units_sold_30d: Math.max(0, parseInt(f.units_sold_30d)||0),
      notes: f.notes||null, updated_at: new Date().toISOString()
    };
    if (f.id) { await supabase.from("amazon_listings").update(payload).eq("id", f.id); }
    else { const { data: { user } } = await supabase.auth.getUser(); payload.created_by = user?.id||null; await supabase.from("amazon_listings").insert(payload); }
    notify("Listing salvato");
    setAmazonModal(false); loadAmazon();
  };
  const deleteAmazon = async (t) => {
    if (!window.confirm("Eliminare " + t.product_name + "?")) return;
    await supabase.from("amazon_listings").delete().eq("id", t.id);
    setAmazonRows(prev => prev.filter(x => x.id !== t.id));
  };
  const quickAddAmazon = (p) => {
    setAmazonForm({ product_name:p.name||"", asin:"", sku:p.sku||"", brand_id:p.brand_id||"", product_id:p.id, _catalog:p.id, marketplace:"IT", fulfillment:"FBA", cost_price:0, sell_price:0, referral_fee_pct:15, fba_fee:0, units_in_stock:0, units_sold_30d:0, ad_spend_30d:0, notes:"" });
    setAmazonModal({ _new:true });
  };
  const loadProducts = async () => {
    try {
      const { data } = await supabase.from("products")
        .select("*, inventory(*), profiles!products_brand_id_fkey(company_name)")
        .order("created_at", { ascending: false });
      setProducts(data || []);
    } catch(e) { console.error(e); }
  };

  const loadOrderIssues = async () => {
    try {
      const { data } = await supabase.from("order_issues")
        .select("*, order:orders(order_number, total_amount)")
        .order("created_at", { ascending:false });
      const rows = data || [];
      const ids = [...new Set(rows.map(r=>r.distributor_id).filter(Boolean))];
      let names = {};
      if (ids.length) {
        const { data: ps } = await supabase.from("profiles").select("id, company_name, country").in("id", ids);
        (ps||[]).forEach(p=>{ names[p.id]=p; });
      }
      setOrderIssues(rows.map(r=>({ ...r, dist_info: names[r.distributor_id] })));
    } catch(e) { console.error(e); }
  };
  const closeIssue = async (id) => {
    await supabase.from("order_issues").update({ status:"closed", closed_at:new Date().toISOString() }).eq("id", id);
    setOrderIssues(prev => prev.map(x => x.id===id ? { ...x, status:"closed" } : x));
  };
  const loadAudit = async () => {
    try {
      const { data } = await supabase.from("audit_log").select("*").order("created_at", { ascending:false }).limit(100);
      const rows = data || [];
      const ids = [...new Set(rows.map(r=>r.actor).filter(Boolean))];
      let names = {};
      if (ids.length) {
        const { data: ps } = await supabase.from("profiles").select("id, company_name, email, role").in("id", ids);
        (ps||[]).forEach(p=>{ names[p.id]=p; });
      }
      setAuditLog(rows.map(r=>({ ...r, actor_info: names[r.actor] })));
    } catch(e) { console.error(e); }
  };
  const exportShippyPro = async () => {
    try {
      const { data: ords } = await supabase
        .from("orders")
        .select("id, order_number, total_amount, status, created_at, distributor_id, order_items(quantity, product_id)")
        .neq("status", "cancelled")
        .order("created_at", { ascending:false });
      const rows = ords || [];
      if (rows.length === 0) { window.alert("Nessun ordine da esportare."); return; }
      const distIds = [...new Set(rows.map(r=>r.distributor_id).filter(Boolean))];
      let profs = {};
      if (distIds.length) {
        const { data: ps } = await supabase
          .from("profiles")
          .select("id, full_name, company_name, shipping_address, shipping_city, shipping_zip, shipping_region, country, phone, email")
          .in("id", distIds);
        (ps||[]).forEach(p=>{ profs[p.id]=p; });
      }
      const prodIds = [...new Set(rows.flatMap(r=>(r.order_items||[]).map(it=>it.product_id)).filter(Boolean))];
      let prods = {};
      if (prodIds.length) {
        const { data: pr } = await supabase.from("products").select("id, name").in("id", prodIds);
        (pr||[]).forEach(p=>{ prods[p.id]=p.name; });
      }
      const headers = ["Name","Company","Street 1","Street 2","City","State","Zip","Country","Phone","Email","Order Number","Currency","Total","Items Count","Content Description","Amount paid for the shipment","Cash on Delivery","Parcels","Weight","Length","Width","Height","Note","Is Return","Date","Shipping Service"];
      const esc = (v) => '"' + ((v===null||v===undefined) ? "" : String(v)).replace(/"/g,'""') + '"';
      const lines = [headers.map(esc).join(",")];
      rows.forEach(o => {
        const d = profs[o.distributor_id] || {};
        const items = o.order_items || [];
        const itemsCount = items.reduce((a,it)=>a+Number(it.quantity||0),0) || items.length || 1;
        const names = [...new Set(items.map(it=>prods[it.product_id]).filter(Boolean))];
        const content = names.length ? names.slice(0,3).join(", ") : "Merce";
        const rec = [
          d.full_name || d.company_name || "",
          d.company_name || "",
          d.shipping_address || "",
          "",
          d.shipping_city || "",
          d.shipping_region || "",
          d.shipping_zip || "",
          d.country || "",
          d.phone || "",
          d.email || "",
          o.order_number || o.id,
          "EUR",
          Number(o.total_amount||0).toFixed(2),
          itemsCount,
          content,
          "0",
          "0",
          "1",
          "1",
          "", "", "",
          "", "", "",
          "Standard"
        ];
        lines.push(rec.map(esc).join(","));
      });
      const csv = "\ufeff" + lines.join("\r\n");
      const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const today = new Date().toISOString().slice(0,10).replace(/-/g,"");
      a.href = url; a.download = "nexushub-shippypro-" + today + ".csv";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.alert("Esportati " + rows.length + " ordini. Ora importa il file in ShippyPro con \"Importa Excel/CSV/TXT\".");
    } catch(e) { console.error(e); window.alert("Errore nell'esportazione."); }
  };
  const loadOrders = async () => {
    try {
      const { data } = await supabase.from("orders")
        .select("*, order_items(*), profiles!orders_distributor_id_fkey(company_name), brand:profiles!orders_brand_id_fkey(company_name)")
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
        .select("*, brand:profiles!contracts_brand_id_fkey(company_name), distributor:profiles!contracts_distributor_id_fkey(company_name, country, full_name)")
        .order("created_at", { ascending: false });
      setContracts(data || []);
    } catch(e) { console.error(e); }
  };

  const openNewContract = () => {
    const today = new Date(); const vu = new Date(); vu.setFullYear(vu.getFullYear()+1);
    setContractForm({ brand_id:"", distributor_id:"", territory:"", commission_rate:11.4, moq_per_order:0, payment_terms:30, exclusivity:true, valid_from:today.toISOString().slice(0,10), valid_until:vu.toISOString().slice(0,10) });
    setContractCreate(true);
  };
  const saveNewContract = async () => {
    const f = contractForm;
    if (!f.brand_id || !f.distributor_id) { notify("Scegli brand e distributore", "error"); return; }
    const num = "CT-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2,7).toUpperCase();
    const { error } = await supabase.from("contracts").insert({
      contract_number: num, brand_id: f.brand_id, distributor_id: f.distributor_id,
      territory: f.territory||null, commission_rate: Number(f.commission_rate)||0,
      moq_per_order: Number(f.moq_per_order)||0, payment_terms: Number(f.payment_terms)||30,
      exclusivity: !!f.exclusivity, status: "draft",
      valid_from: f.valid_from||null, valid_until: f.valid_until||null
    });
    if (error) { notify("Errore: " + error.message, "error"); return; }
    notify("Contratto creato in bozza");
    setContractCreate(false); loadContracts();
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

  const tierRate = (rev) => (rev > 15000000 ? 9 : rev > 10000000 ? 10 : 11.4);
  const loadPaySplits = async () => {
    try {
      const { data: splits } = await supabase.from("payment_splits").select("*").order("created_at", { ascending:false });
      const sp = splits || [];
      const orderIds = [...new Set(sp.map(s => s.order_id).filter(Boolean))];
      let ordMap = {};
      if (orderIds.length) {
        const { data: ords } = await supabase.from("orders").select("id, order_number, brand_id, distributor_id").in("id", orderIds);
        (ords||[]).forEach(o => { ordMap[o.id] = o; });
      }
      const pidSet = new Set();
      Object.values(ordMap).forEach(o => { if(o.brand_id) pidSet.add(o.brand_id); if(o.distributor_id) pidSet.add(o.distributor_id); });
      const pids = [...pidSet];
      let proMap = {};
      if (pids.length) {
        const { data: pros } = await supabase.from("profiles").select("id, company_name, iban").in("id", pids);
        (pros||[]).forEach(p => { proMap[p.id] = p; });
      }
      setPaySplits(sp.map(s => {
        const o = ordMap[s.order_id] || {};
        const b = proMap[o.brand_id] || {};
        const d = proMap[o.distributor_id] || {};
        return { ...s, order_number: o.order_number, brand_name: b.company_name, brand_iban: b.iban, distributor_name: d.company_name };
      }));
    } catch(e) { console.error(e); }
  };
  const markCollected = async (sp) => { await supabase.from("payment_splits").update({ split_status:"collected", nexushub_received_at:new Date().toISOString() }).eq("id", sp.id); loadPaySplits(); };
  const markPaidBrand = async (sp) => { await supabase.from("payment_splits").update({ split_status:"paid_brand", brand_received_at:new Date().toISOString() }).eq("id", sp.id); loadPaySplits(); };
  const loadCommissions = async () => {
    const { data: bs } = await supabase.from("profiles").select("id, company_name, email, commission_rate, estimated_annual_revenue, commission_locked").eq("role", "brand");
    const { data: ords } = await supabase.from("orders").select("brand_id, total_amount, created_at, status");
    const yr = new Date().getFullYear();
    const rev = {};
    (ords || []).forEach(o => {
      if (!o.brand_id || o.status === "cancelled") return;
      const oy = o.created_at ? new Date(o.created_at).getFullYear() : yr;
      if (oy !== yr) return;
      rev[o.brand_id] = (rev[o.brand_id] || 0) + (o.total_amount || 0);
    });
    setCommissionRows((bs || []).map(b => ({
      id: b.id,
      name: b.company_name || b.email || "Brand",
      declared: b.estimated_annual_revenue || 0,
      actual: rev[b.id] || 0,
      current: b.commission_rate ?? 11.4,
      locked: b.commission_locked || false,
    })));
  };
  const applyCommission = async (row, newRate) => {
    await supabase.from("profiles").update({ commission_rate: newRate }).eq("id", row.id);
    await supabase.from("contracts").update({ commission_rate: newRate }).eq("brand_id", row.id);
    await supabase.from("notifications").insert({
      user_id: row.id,
      title: "Provvigione aggiornata",
      message: `La tua provvigione piattaforma è stata aggiornata al ${newRate}% in base al fatturato raggiunto.`,
      type: "commission_update",
    });
    notify(`✓ Provvigione ${row.name} → ${newRate}%`);
    setCommissionRows(prev => prev.map(r => r.id === row.id ? { ...r, current: newRate } : r));
  };

  const toggleLock = async (row) => {
    const nv = !row.locked;
    await supabase.from("profiles").update({ commission_locked: nv }).eq("id", row.id);
    setCommissionRows(prev => prev.map(r => r.id === row.id ? { ...r, locked: nv } : r));
    notify(nv ? ("🔒 " + row.name + ": tariffa bloccata") : ("🔓 " + row.name + ": tariffa sbloccata"));
  };
  const loadCommissionLog = async () => {
    const { data } = await supabase.from("commission_log")
      .select("*, brand:profiles!commission_log_brand_id_fkey(company_name)")
      .order("created_at", { ascending: false }).limit(20);
    setCommissionLog(data || []);
  };
  const recalcNow = async () => {
    setRecalcing(true);
    const { error } = await supabase.rpc("commission_recalc_now");
    if (error) { notify("Errore ricalcolo: " + error.message); }
    else { notify("✓ Ricalcolo eseguito"); await loadCommissions(); await loadCommissionLog(); }
    setRecalcing(false);
  };
  useEffect(() => {
    loadUsers(); loadBrands(); loadProducts(); loadOrders();
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "brands") loadBrands();
    if (tab === "catalog") loadProducts();
    if (tab === "orders") loadOrders();
    if (tab === "logistics") { loadProducts(); loadOrders(); }
    if (tab === "retail") { loadRetail(); loadBrands(); }
    if (tab === "compliance") { loadCompliance(); loadUsers(); }
    if (tab === "margini") loadMargins();
    if (tab === "amazon") { loadAmazon(); loadBrands(); loadProducts(); }
    if (tab === "invoices") loadInvoices();
    if (tab === "contracts") { loadContracts(); loadBrands(); loadUsers(); }
    if (tab === "commissions") { loadCommissions(); loadCommissionLog(); }
    if (tab === "incassi") loadPaySplits();
    if (tab === "finanze") { loadOrders(); loadInvoices(); loadPaySplits(); }
    if (tab === "audit") loadAudit();
    if (tab === "issues") loadOrderIssues();
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
  const [trackEdits, setTrackEdits] = useState({});
  const saveTracking = async (o) => {
    const e = trackEdits[o.id] || {};
    const courier = (e.courier || "").trim();
    const tracking = (e.tracking_number || "").trim();
    if (!tracking) { notify("Inserisci il numero di tracking", "error"); return; }
    const url = courier.toUpperCase().includes("BRT")
      ? "https://vas.brt.it/vas/sped_numspe_par.htm?Nspediz=" + encodeURIComponent(tracking)
      : "";
    const newStatus = (o.status === "pending" || o.status === "confirmed") ? "shipped" : o.status;
    await supabase.from("orders").update({
      courier: courier || null,
      tracking_number: tracking,
      tracking_url: url || null,
      shipped_at: o.shipped_at || new Date().toISOString(),
      status: newStatus
    }).eq("id", o.id);
    notify("📦 Tracking salvato — distributore notificato");
    setTrackEdits(prev => { const n = { ...prev }; delete n[o.id]; return n; });
    loadOrders();
  };
  const adjustTrust = async (u, sign) => {
    const amtStr = window.prompt((sign>0?"Quanti punti AGGIUNGERE a ":"Quanti punti TOGLIERE a ")+(u.company_name||u.email)+"?", "10");
    if (amtStr===null) return;
    const amt = Math.abs(parseInt(amtStr,10)); if (!amt) return;
    const reason = window.prompt("Motivo?", sign>0?"Bonus manuale":"Penalita manuale");
    if (reason===null) return;
    await supabase.rpc("admin_adjust_trust", { p_profile: u.id, p_delta: sign*amt, p_reason: reason });
    notify("Punti aggiornati");
    loadUsers();
  };
  const toggleSuspend = async (u) => {
    if (u.account_state==="suspended") {
      if (!window.confirm("Riattivare "+(u.company_name||u.email)+"?")) return;
      await supabase.rpc("admin_set_account_state", { p_profile:u.id, p_state:"active", p_reason:"Riattivato da admin" });
    } else {
      const reason = window.prompt("Motivo sospensione (violazione grave):", "");
      if (reason===null) return;
      await supabase.rpc("admin_set_account_state", { p_profile:u.id, p_state:"suspended", p_reason: reason||"Sospeso da admin" });
    }
    notify("Stato account aggiornato");
    loadUsers();
  };
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
    { key:"logistics", icon:"🚛", label:"Logistica" },
    { key:"retail", icon:"🏬", label:"Retail" },
    { key:"compliance", icon:"🗂️", label:"Compliance" },
    { key:"margini", icon:"📈", label:"Margini" },
    { key:"nexusai", icon:"🤖", label:"Nexus AI" },
    { key:"amazon", icon:"🛒", label:"Amazon" },
    { key:"orders", icon:"📋", label:"Orders" },
    { key:"invoices", icon:"🧾", label:"Fatture" },
    { key:"contracts", icon:"📝", label:"Contratti" },
    { key:"commissions", icon:"📊", label:"Provvigioni" },
    { key:"incassi", icon:"💸", label:"Incassi" },
    { key:"finanze", icon:"💶", label:"Finanze" },
    { key:"audit", icon:"📋", label:"Audit" },
    { key:"issues", icon:"🚩", label:"Segnalazioni" },
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
        <div style={{ display:"flex", gap:2, marginBottom:16, borderBottom:`1px solid ${C.border}`, overflowX:"auto", overflowY:"hidden", WebkitOverflowScrolling:"touch", paddingBottom:2 }}>
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} style={{
              padding:"7px 10px", cursor:"pointer", background:"transparent",
              border:"none", borderBottom:`2px solid ${tab===tb.key?C.gold:"transparent"}`,
              color: tab===tb.key ? C.goldLight : C.textMuted,
              fontSize:12, fontWeight: tab===tb.key ? 600 : 400,
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
                        {["Company","Email","Role","Country","Status","Trust","Joined","Actions"].map((h,i) => (
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
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-start" }}>
                              <TrustBadge score={u.trust_score} state={u.account_state}/>
                              <div style={{ display:"flex", gap:4 }}>
                                <button onClick={()=>adjustTrust(u,1)} title="Aggiungi punti" style={{ padding:"2px 7px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>+</button>
                                <button onClick={()=>adjustTrust(u,-1)} title="Togli punti" style={{ padding:"2px 7px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>−</button>
                                <button onClick={()=>toggleSuspend(u)} style={{ padding:"2px 8px", borderRadius:5, cursor:"pointer", fontSize:10, fontWeight:600, background: u.account_state==="suspended"?`${C.green}15`:`${C.gold}12`, border:`1px solid ${u.account_state==="suspended"?C.green:C.gold}40`, color: u.account_state==="suspended"?C.green:C.gold }}>{u.account_state==="suspended"?"Riattiva":"Sospendi"}</button>
                              </div>
                            </div>
                          </td>
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
        {tab === "amazon" && (() => {
          const num=(x)=>Number(x||0);
          const MKTS=["IT","DE","FR","ES","NL","SE","PL","BE","UK"];
          const brandName=(id)=>{ const b=brands.find(z=>z.id===id); return b?(b.company_name||"\u2014"):"\u2014"; };
          const calc=(r)=>{ const sell=num(r.sell_price); const cost=num(r.cost_price); const ref=sell*num(r.referral_fee_pct)/100; const fba=num(r.fba_fee); const sold=num(r.units_sold_30d); const adU=sold>0?num(r.ad_spend_30d)/sold:0; const net=sell-cost-fba-ref-adU; const u=num(r.units_in_stock); return { sell, cost, ref, fba, adU, net, u, pct: sell>0?net/sell*100:0, roi: cost>0?net/cost*100:0 }; };
          const tot=amazonRows.reduce((a,r)=>{ const c=calc(r); a.stockCost+=c.cost*c.u; a.potential+=c.net*c.u; a.sellW+=c.sell*c.u; a.netW+=c.net*c.u; a.sold+=num(r.units_sold_30d); a.ads+=num(r.ad_spend_30d); return a; },{stockCost:0,potential:0,sellW:0,netW:0,sold:0,ads:0});
          const avgPct = tot.sellW>0 ? tot.netW/tot.sellW*100 : 0;
          const eur=(n)=>"\u20ac"+num(n).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2});
          const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
          const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
          return (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🛒 Amazon Operating Partner</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Cockpit Amazon EU: listing, fee, margine netto e ROI reali per prodotto</p>
              </div>
              <button onClick={()=>openAmazon(null)} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ Aggiungi listing</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="📦" label="Listing" value={amazonRows.length}/>
              <Stat icon="🏦" label="Valore stock FBA (costo)" value={eur(tot.stockCost)} accent={C.blue}/>
              <Stat icon="✅" label="Profitto potenziale su stock" value={eur(tot.potential)} accent={C.green}/>
              <Stat icon="📊" label="Margine netto medio" value={avgPct.toFixed(1)+"%"} accent={C.gold}/>
              <Stat icon="📣" label="Spesa Ads (30gg)" value={eur(tot.ads)} accent={C.red}/>
            </div>
            {amazonRows.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>Nessun listing Amazon</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Aggiungi il primo prodotto che vendi su Amazon (es. Lattafa Khamrah).</div>
                <button onClick={()=>openAmazon(null)} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Aggiungi listing</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:920 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Prodotto","Mkt","Prezzo","Costo","Costi/u (fee+ads)","Margine €/u","Margine %","ROI %","Stock","Azioni"].map((h,i)=>(<th key={i} style={{ padding:"10px 12px", textAlign: (i>=2&&i<=7)?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {amazonRows.map((r,i)=>{ const c=calc(r); return (
                      <tr key={r.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 12px", fontSize:12.5, color:C.text }}><div style={{ fontWeight:600 }}>{r.product_name}</div><div style={{ fontSize:10.5, color:C.textDim, fontFamily:"monospace" }}>{r.asin||r.sku||""}{r.brand_id?(" · "+brandName(r.brand_id)):""}</div></td>
                        <td style={{ padding:"10px 12px", fontSize:11, color:C.textMuted }}>{r.marketplace}<span style={{ color:C.textDim }}> · {r.fulfillment}</span></td>
                        <td style={{ padding:"10px 12px", fontSize:12, color:C.text, textAlign:"right", whiteSpace:"nowrap" }}>{eur(c.sell)}</td>
                        <td style={{ padding:"10px 12px", fontSize:12, color:C.textMuted, textAlign:"right", whiteSpace:"nowrap" }}>{eur(c.cost)}</td>
                        <td style={{ padding:"10px 12px", fontSize:11.5, color:C.textMuted, textAlign:"right", whiteSpace:"nowrap" }}>{eur(c.fba+c.ref+c.adU)}</td>
                        <td style={{ padding:"10px 12px", fontSize:12.5, fontWeight:700, textAlign:"right", whiteSpace:"nowrap", color: c.net>=0?C.green:C.red }}>{eur(c.net)}</td>
                        <td style={{ padding:"10px 12px", fontSize:12, fontWeight:600, textAlign:"right", color: c.pct>=0?C.green:C.red }}>{c.pct.toFixed(1)}%</td>
                        <td style={{ padding:"10px 12px", fontSize:12, fontWeight:600, textAlign:"right", color: c.roi>=0?C.green:C.red }}>{c.roi.toFixed(0)}%</td>
                        <td style={{ padding:"10px 12px", fontSize:12, color:C.text, textAlign:"right" }}>{c.u}{num(r.units_sold_30d)?<span style={{ color:C.textDim, fontSize:10 }}> ({r.units_sold_30d}/30g)</span>:null}</td>
                        <td style={{ padding:"10px 12px", whiteSpace:"nowrap" }}>
                          <button onClick={()=>openAmazon(r)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}12`, border:`1px solid ${C.blue}40`, color:C.blue, marginRight:6 }}>Modifica</button>
                          <button onClick={()=>deleteAmazon(r)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>Elimina</button>
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}

            {(() => {
              const onIds = new Set(amazonRows.map(r=>r.product_id).filter(Boolean));
              const notListed = products.filter(p=>!onIds.has(p.id) && p.is_active!==false);
              if (!notListed.length) return null;
              return (
                <div style={{ marginTop:28 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.text }}>Aggiungi rapido dal catalogo</h3>
                  <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 12px" }}>{notListed.length} prodotti a catalogo non ancora su Amazon. Un clic crea il listing collegato \u2014 poi completi prezzo e fee.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {notListed.map(p=>(
                      <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                          <div style={{ fontSize:11, color:C.textDim }}>{(p.profiles&&p.profiles.company_name)||brandName(p.brand_id)}</div>
                        </div>
                        <button onClick={()=>quickAddAmazon(p)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>+ Porta su Amazon</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {amazonModal && (
              <Modal title={amazonForm.id ? "Modifica listing Amazon" : "Nuovo listing Amazon"} onClose={()=>setAmazonModal(false)} onSave={saveAmazon} saveLabel="Salva">
                <label style={lbl}>Collega a prodotto del catalogo (opzionale)</label>
                <select value={amazonForm._catalog||""} onChange={e=>{ const pid=e.target.value; const p=products.find(z=>z.id===pid); setAmazonForm(f=>({ ...f, _catalog:pid, ...(p?{ product_name:p.name||f.product_name, brand_id:p.brand_id||f.brand_id, sku:p.sku||f.sku, product_id:p.id }:{ product_id:null }) })); }} style={fld}>
                  <option value="">— Manuale / nessun collegamento —</option>
                  {products.map(p=>(<option key={p.id} value={p.id}>{(p.name||"Prodotto")+(p.profiles&&p.profiles.company_name?(" · "+p.profiles.company_name):"")}</option>))}
                </select>
                <label style={lbl}>Nome prodotto *</label>
                <input value={amazonForm.product_name||""} onChange={e=>setAmazonForm(f=>({...f, product_name:e.target.value}))} placeholder="es. Lattafa Khamrah EDP 100ml" style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>ASIN</label><input value={amazonForm.asin||""} onChange={e=>setAmazonForm(f=>({...f, asin:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>SKU</label><input value={amazonForm.sku||""} onChange={e=>setAmazonForm(f=>({...f, sku:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>Brand (opzionale)</label>
                <select value={amazonForm.brand_id||""} onChange={e=>setAmazonForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">\u2014 Nessuno \u2014</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Marketplace</label>
                    <select value={amazonForm.marketplace||"IT"} onChange={e=>setAmazonForm(f=>({...f, marketplace:e.target.value}))} style={fld}>
                      {MKTS.map(m=>(<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div style={{ flex:1 }}><label style={lbl}>Fulfillment</label>
                    <select value={amazonForm.fulfillment||"FBA"} onChange={e=>setAmazonForm(f=>({...f, fulfillment:e.target.value}))} style={fld}>
                      <option value="FBA">FBA</option><option value="FBM">FBM</option>
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Costo / unita (€)</label><input type="number" step="0.01" value={amazonForm.cost_price} onChange={e=>setAmazonForm(f=>({...f, cost_price:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Prezzo Amazon (€)</label><input type="number" step="0.01" value={amazonForm.sell_price} onChange={e=>setAmazonForm(f=>({...f, sell_price:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Referral fee (%)</label><input type="number" step="0.1" value={amazonForm.referral_fee_pct} onChange={e=>setAmazonForm(f=>({...f, referral_fee_pct:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Fee FBA / unita (€)</label><input type="number" step="0.01" value={amazonForm.fba_fee} onChange={e=>setAmazonForm(f=>({...f, fba_fee:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>Spesa Amazon Ads ultimi 30gg (€) · solo interno</label>
                <input type="number" step="0.01" value={amazonForm.ad_spend_30d} onChange={e=>setAmazonForm(f=>({...f, ad_spend_30d:e.target.value}))} style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Stock FBA (unita)</label><input type="number" value={amazonForm.units_in_stock} onChange={e=>setAmazonForm(f=>({...f, units_in_stock:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Venduti (30 gg)</label><input type="number" value={amazonForm.units_sold_30d} onChange={e=>setAmazonForm(f=>({...f, units_sold_30d:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>Note</label>
                <textarea value={amazonForm.notes||""} onChange={e=>setAmazonForm(f=>({...f, notes:e.target.value}))} rows={2} style={{...fld, resize:"vertical"}}/>
              </Modal>
            )}
          </div>
          );
        })()}
        {tab === "nexusai" && <NexusAI role="admin"/>}
        {tab === "margini" && (() => {
          const num=(x)=>Number(x||0);
          const rowCalc=(r)=>{ const gmv=num(r.total_amount); const fee=r.split?num(r.split.nexushub_amount):gmv*feeRate/100; const stripe=r.split?num(r.split.stripe_fee):0; const op=num(r.econ&&r.econ.operating_cost); const net=fee-stripe-op; return { gmv, fee, stripe, op, net, pct: gmv>0?net/gmv*100:0 }; };
          const tot=marginRows.reduce((a,r)=>{ const c=rowCalc(r); a.gmv+=c.gmv;a.fee+=c.fee;a.stripe+=c.stripe;a.op+=c.op;a.net+=c.net; return a; },{gmv:0,fee:0,stripe:0,op:0,net:0});
          const avgPct = tot.gmv>0 ? tot.net/tot.gmv*100 : 0;
          const eur=(n)=>"€"+num(n).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2});
          return (
          <div>
            <div style={{ marginBottom:14 }}>
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📈 Margini · vista interna</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Economia reale di NexusHub: commissioni incassate meno costi. Margine netto e ROI per ordine.</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:`${C.red}10`, border:`1px solid ${C.red}35`, borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
              <span style={{ fontSize:18 }}>🔒</span>
              <span style={{ fontSize:12.5, color:C.text }}>Dati interni GigaTrade. Costi e margine netto <b>non sono mai visibili</b> a brand o distributori (tabella separata, accesso solo admin).</span>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
              <Stat icon="💶" label="GMV (transato)" value={eur(tot.gmv)}/>
              <Stat icon="💰" label="Ricavo commissioni" value={eur(tot.fee)} accent={C.gold}/>
              <Stat icon="💳" label="Costi (Stripe + op.)" value={eur(tot.stripe+tot.op)} accent={C.red}/>
              <Stat icon="✅" label="Margine netto" value={eur(tot.net)} accent={C.green}/>
              <Stat icon="📊" label="Margine medio" value={avgPct.toFixed(1)+"%"} accent={C.blue}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, fontSize:12, color:C.textMuted }}>
              <span>Fee stimata su ordini senza split:</span>
              <input type="number" step="0.1" value={feeRate} onChange={e=>setFeeRate(Number(e.target.value)||0)} style={{ width:70, padding:"5px 8px", borderRadius:6, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none" }}/>
              <span>%</span>
              <span style={{ color:C.textDim }}>(gli ordini con split reale usano i valori effettivi)</span>
            </div>
            {marginRows.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted, fontSize:14 }}>{marginBusy ? "Caricamento..." : "Nessun ordine da analizzare."}</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:880 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Ordine","Brand","GMV","Commissione","Stripe","Costo operativo","Margine netto","%"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign: i>=2&&i<7?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {marginRows.map((r,i)=>{ const c=rowCalc(r); const edit=(r.id in opEdits)?opEdits[r.id]:(r.econ&&r.econ.operating_cost!=null?r.econ.operating_cost:""); return (
                      <tr key={r.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 14px", fontSize:12, fontWeight:600, color:C.text, whiteSpace:"nowrap" }}>{r.order_number||r.id.slice(0,8)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{(r.brandp&&r.brandp.company_name)||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.text, textAlign:"right", whiteSpace:"nowrap" }}>{eur(c.gmv)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.goldLight, textAlign:"right", whiteSpace:"nowrap" }}>{eur(c.fee)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted, textAlign:"right", whiteSpace:"nowrap" }}>{c.stripe?("-"+eur(c.stripe)):"—"}</td>
                        <td style={{ padding:"10px 14px", textAlign:"right", whiteSpace:"nowrap" }}>
                          <input type="number" step="0.01" placeholder="0" value={edit} onChange={e=>setOpEdits(prev=>({...prev, [r.id]:e.target.value}))} style={{ width:84, padding:"5px 8px", borderRadius:6, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, textAlign:"right", outline:"none" }}/>
                          <button onClick={()=>saveOpCost(r.id, edit)} style={{ marginLeft:6, padding:"5px 9px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.gold}18`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>Salva</button>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12.5, fontWeight:700, textAlign:"right", whiteSpace:"nowrap", color: c.net>=0?C.green:C.red }}>{eur(c.net)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontWeight:600, textAlign:"right", color: c.pct>=0?C.green:C.red }}>{c.pct.toFixed(1)}%</td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          );
        })()}
        {tab === "compliance" && (() => {
          const CATS = [["company","Documenti aziendali"],["certificate","Certificati"],["safety_sheet","Schede sicurezza"],["import","Import / Dogana"],["authorization","Autorizzazioni"],["price_list","Listini"],["marketing","Marketing"],["quality","Report qualita"],["arrival_photo","Foto merce"],["amazon","Amazon / Retail"],["other","Altro"]];
          const catLabel = (k)=>{ const f=CATS.find(z=>z[0]===k); return f?f[1]:k; };
          const ownerName = (id)=>{ const u=users.find(z=>z.id===id); return u?(u.company_name||u.email):"\u2014"; };
          const today = new Date(); const soon = new Date(); soon.setDate(soon.getDate()+30);
          const expState = (d)=>{ if(!d.expires_at) return null; const e=new Date(d.expires_at); if(e<today) return ["Scaduto",C.red]; if(e<soon) return ["In scadenza",C.gold]; return ["Valido",C.green]; };
          const expired = complianceDocs.filter(d=>d.expires_at && new Date(d.expires_at)<today).length;
          const expiring = complianceDocs.filter(d=>d.expires_at && new Date(d.expires_at)>=today && new Date(d.expires_at)<soon).length;
          const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
          const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
          return (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🗂️ Compliance & Documents Vault</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Archivio centrale: documenti aziendali, certificati, autorizzazioni, dogana, qualita</p>
              </div>
              <button onClick={()=>{ setCompForm({ category:"company" }); setCompModal(true); }} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ Carica documento</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="🗂️" label="Documenti totali" value={complianceDocs.length}/>
              <Stat icon="⏳" label="In scadenza (30gg)" value={expiring} accent={C.gold}/>
              <Stat icon="⚠️" label="Scaduti" value={expired} accent={C.red}/>
            </div>
            {complianceDocs.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🗂️</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>Vault vuoto</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Carica il primo documento (visura, certificato, autorizzazione...).</div>
                <button onClick={()=>{ setCompForm({ category:"company" }); setCompModal(true); }} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Carica documento</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Documento","Titolare","Categoria","Scadenza","Caricato","Azioni"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {complianceDocs.map((d,i)=>{ const es=expState(d); return (
                      <tr key={d.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 14px", fontSize:13, color:C.text, fontWeight:600 }}>{d.name}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{ownerName(d.owner_id)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{catLabel(d.category)}</td>
                        <td style={{ padding:"10px 14px", fontSize:12 }}>{es ? <span style={{ fontWeight:700, padding:"2px 8px", borderRadius:20, fontSize:11, background:es[1]+"18", color:es[1], border:`1px solid ${es[1]}40` }}>{new Date(d.expires_at).toLocaleDateString("it-IT")} · {es[0]}</span> : <span style={{ color:C.textDim }}>—</span>}</td>
                        <td style={{ padding:"10px 14px", fontSize:11, color:C.textDim, whiteSpace:"nowrap" }}>{new Date(d.created_at).toLocaleDateString("it-IT")}</td>
                        <td style={{ padding:"10px 14px", whiteSpace:"nowrap" }}>
                          <a href={d.file_url} target="_blank" rel="noreferrer" style={{ padding:"4px 10px", borderRadius:6, fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue, textDecoration:"none", marginRight:6 }}>Scarica</a>
                          <button onClick={()=>deleteCompliance(d)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>Elimina</button>
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}

            {compModal && (
              <Modal title="Carica documento nel vault" onClose={()=>{ setCompModal(false); setCompForm({}); }} onSave={uploadCompliance} saveLabel={compBusy ? "Caricamento..." : "Carica"}>
                <label style={lbl}>Titolare (account) *</label>
                <select value={compForm.owner_id||""} onChange={e=>setCompForm(f=>({...f, owner_id:e.target.value}))} style={fld}>
                  <option value="">\u2014 Scegli account \u2014</option>
                  {users.map(u=>(<option key={u.id} value={u.id}>{(u.company_name||u.email)+" ("+u.role+")"}</option>))}
                </select>
                <label style={lbl}>Categoria</label>
                <select value={compForm.category||"company"} onChange={e=>setCompForm(f=>({...f, category:e.target.value}))} style={fld}>
                  {CATS.map(z=>(<option key={z[0]} value={z[0]}>{z[1]}</option>))}
                </select>
                <label style={lbl}>Nome documento (opzionale)</label>
                <input value={compForm.name||""} onChange={e=>setCompForm(f=>({...f, name:e.target.value}))} placeholder="es. Visura camerale 2026" style={fld}/>
                <label style={lbl}>File *</label>
                <input type="file" onChange={e=>setCompForm(f=>({...f, file:(e.target.files&&e.target.files[0])||null}))} style={{...fld, padding:"8px 12px"}}/>
                <label style={lbl}>Data scadenza (opzionale)</label>
                <input type="date" value={compForm.expires_at||""} onChange={e=>setCompForm(f=>({...f, expires_at:e.target.value}))} style={fld}/>
                <label style={lbl}>Note (opzionale)</label>
                <textarea value={compForm.notes||""} onChange={e=>setCompForm(f=>({...f, notes:e.target.value}))} rows={2} style={{...fld, resize:"vertical"}}/>
              </Modal>
            )}
          </div>
          );
        })()}
        {tab === "retail" && (() => {
          const STAGES = [["lead","Lead",C.textMuted],["contacted","Contattato",C.blue],["samples","Campioni",C.blue],["meeting","Meeting",C.gold],["negotiation","Trattativa",C.gold],["won","Chiuso \u2713",C.green],["lost","Perso",C.red]];
          const stColor = (k)=>{ const f=STAGES.find(z=>z[0]===k); return f?f[2]:C.textMuted; };
          const brandName = (id)=>{ const b=brands.find(z=>z.id===id); return b?(b.company_name||"\u2014"):"\u2014"; };
          const won = retailTargets.filter(t=>t.stage==="won").length;
          const active = retailTargets.filter(t=>!["won","lost"].includes(t.stage)).length;
          const avgProb = retailTargets.length ? Math.round(retailTargets.reduce((a,t)=>a+Number(t.probability||0),0)/retailTargets.length) : 0;
          const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
          const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
          return (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🏬 Retail Expansion Desk</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Pipeline verso Sephora, Douglas, profumerie e retail europeo</p>
              </div>
              <button onClick={()=>openRetail(null)} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ Aggiungi target</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="🎯" label="Target totali" value={retailTargets.length}/>
              <Stat icon="🔥" label="In trattativa" value={active} accent={C.gold}/>
              <Stat icon="✅" label="Chiusi" value={won} accent={C.green}/>
              <Stat icon="📊" label="Prob. media" value={avgProb+"%"} accent={C.blue}/>
            </div>
            {retailTargets.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🏬</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>Nessun target retail</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Aggiungi il primo retailer da contattare (es. Sephora Italia).</div>
                <button onClick={()=>openRetail(null)} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ Aggiungi target</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Retailer","Paese","Buyer","Brand","Stato","Prob.","Follow-up","Azioni"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {retailTargets.map((t,i)=>(
                      <tr key={t.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap" }}>{t.retailer_name}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{t.country||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{t.buyer_name||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{t.brand_id?brandName(t.brand_id):"—"}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <select value={t.stage} onChange={e=>setRetailStage(t, e.target.value)} style={{ padding:"4px 8px", borderRadius:6, background:C.surface2, border:`1px solid ${stColor(t.stage)}55`, color:stColor(t.stage), fontSize:11, fontWeight:700, outline:"none" }}>
                            {STAGES.map(z=>(<option key={z[0]} value={z[0]}>{z[1]}</option>))}
                          </select>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.text }}>{Number(t.probability||0)}%</td>
                        <td style={{ padding:"10px 14px", fontSize:11, color:C.textMuted, whiteSpace:"nowrap" }}>{t.next_followup ? new Date(t.next_followup).toLocaleDateString("it-IT") : "—"}</td>
                        <td style={{ padding:"10px 14px", whiteSpace:"nowrap" }}>
                          <button onClick={()=>openRetail(t)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue, marginRight:6 }}>Modifica</button>
                          <button onClick={()=>deleteRetail(t)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>Elimina</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {retailModal && (
              <Modal title={retailForm.id ? "Modifica target retail" : "Nuovo target retail"} onClose={()=>setRetailModal(null)} onSave={saveRetail} saveLabel="Salva">
                <label style={lbl}>Retailer *</label>
                <input value={retailForm.retailer_name||""} onChange={e=>setRetailForm(f=>({...f, retailer_name:e.target.value}))} placeholder="es. Sephora Italia" style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Paese</label><input value={retailForm.country||""} onChange={e=>setRetailForm(f=>({...f, country:e.target.value}))} placeholder="es. Italia" style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Buyer / contatto</label><input value={retailForm.buyer_name||""} onChange={e=>setRetailForm(f=>({...f, buyer_name:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>Email buyer</label>
                <input value={retailForm.buyer_email||""} onChange={e=>setRetailForm(f=>({...f, buyer_email:e.target.value}))} style={fld}/>
                <label style={lbl}>Brand candidato</label>
                <select value={retailForm.brand_id||""} onChange={e=>setRetailForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">— Nessuno —</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <label style={lbl}>Prodotti candidati</label>
                <textarea value={retailForm.candidate_products||""} onChange={e=>setRetailForm(f=>({...f, candidate_products:e.target.value}))} rows={2} style={{...fld, resize:"vertical"}}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Stato</label>
                    <select value={retailForm.stage||"lead"} onChange={e=>setRetailForm(f=>({...f, stage:e.target.value}))} style={fld}>
                      {STAGES.map(z=>(<option key={z[0]} value={z[0]}>{z[1]}</option>))}
                    </select>
                  </div>
                  <div style={{ flex:1 }}><label style={lbl}>Probabilita chiusura (%)</label><input type="number" min="0" max="100" value={retailForm.probability||0} onChange={e=>setRetailForm(f=>({...f, probability:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ flex:1 }}><label style={lbl}>Prossimo follow-up</label><input type="date" value={retailForm.next_followup||""} onChange={e=>setRetailForm(f=>({...f, next_followup:e.target.value}))} style={fld}/></div>
                  <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.text, marginTop:24, flex:1, cursor:"pointer" }}>
                    <input type="checkbox" checked={!!retailForm.samples_sent} onChange={e=>setRetailForm(f=>({...f, samples_sent:e.target.checked}))}/> Campioni inviati
                  </label>
                </div>
                <label style={lbl}>Note</label>
                <textarea value={retailForm.notes||""} onChange={e=>setRetailForm(f=>({...f, notes:e.target.value}))} rows={3} style={{...fld, resize:"vertical"}}/>
              </Modal>
            )}
          </div>
          );
        })()}
        {tab === "logistics" && (() => {
          const invOf = (p) => Array.isArray(p.inventory) ? (p.inventory[0]||{}) : (p.inventory||{});
          const wi = products.map(p => ({ p, inv: invOf(p) }));
          const unitsStock = wi.reduce((a,x)=>a+Number(x.inv.quantity_available||0),0);
          const unitsReserved = wi.reduce((a,x)=>a+Number(x.inv.quantity_reserved||0),0);
          const low = wi.filter(x => { const q=Number(x.inv.quantity_available||0); return q>0 && q<=50; });
          const out = wi.filter(x => Number(x.inv.quantity_available||0)===0);
          const prep = orders.filter(o=>o.status==="confirmed");
          const transit = orders.filter(o=>o.status==="shipped");
          const delivered = orders.filter(o=>o.status==="delivered");
          const pipeline = [...prep, ...transit];
          return (
          <div>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🚛 European Logistics Control Tower</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Hub Torino · stock, preparazione, spedizioni e allerte</p>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="📦" label="Unita in stock" value={unitsStock.toLocaleString("it-IT")} sub={`${wi.length} SKU`}/>
              <Stat icon="🔒" label="Riservate" value={unitsReserved.toLocaleString("it-IT")}/>
              <Stat icon="🛠️" label="Da preparare" value={prep.length} accent={C.gold}/>
              <Stat icon="🚚" label="In transito" value={transit.length} accent={C.blue}/>
              <Stat icon="✅" label="Consegnati" value={delivered.length} accent={C.green}/>
              <Stat icon="⚠️" label="Basso/esaurito" value={low.length+out.length} accent={C.red}/>
            </div>

            <h3 style={{ fontSize:14, color:C.gold, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Ordini in lavorazione</h3>
            {pipeline.length===0 ? (
              <div style={{ padding:24, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:13, marginBottom:28 }}>Nessun ordine da preparare o in transito.</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}`, marginBottom:28 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Ordine","Stato","Corriere","Tracking","Valore"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {pipeline.map((o,i)=>(
                      <tr key={o.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.order_number}</td>
                        <td style={{ padding:"10px 14px" }}><Badge status={o.status}/></td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.text }}>{o.courier||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:11, fontFamily:"monospace", color:C.blue }}>{o.tracking_number||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:C.goldLight }}>€{Number(o.total_amount||0).toLocaleString("it-IT")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h3 style={{ fontSize:14, color:C.textMuted, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Salute magazzino</h3>
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                <thead><tr style={{ background:C.surface2 }}>
                  {["Prodotto","Brand","Disponibili","Riservate","Stato"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>))}
                </tr></thead>
                <tbody>
                  {wi.length===0 ? (
                    <tr><td colSpan={5} style={{ padding:24, textAlign:"center", color:C.textMuted, fontSize:13 }}>Nessun prodotto a magazzino.</td></tr>
                  ) : wi.map((x,i)=>{
                    const q=Number(x.inv.quantity_available||0);
                    const stt = q===0 ? ["Esaurito",C.red] : q<=50 ? ["Basso",C.gold] : ["OK",C.green];
                    return (
                      <tr key={x.p.id} style={{ background:i%2?C.surface2+"50":"transparent", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 14px", fontSize:13, color:C.text, fontWeight:600 }}>{x.p.name}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:C.textMuted }}>{x.p.profiles?.company_name||"—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:13, color:C.text }}>{q}</td>
                        <td style={{ padding:"10px 14px", fontSize:13, color:C.textMuted }}>{Number(x.inv.quantity_reserved||0)}</td>
                        <td style={{ padding:"10px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:stt[1]+"18", color:stt[1], border:`1px solid ${stt[1]}40` }}>{stt[0]}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}
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

            <InventoryForecast products={products} orders={orders}/>

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
                        const q = scanInput.trim();
                        // Cerca per codice a barre (EAN), poi per SKU
                        const { data } = await supabase.from("products")
                          .select("*, inventory(*)")
                          .or(`barcode.eq.${q},sku.eq.${q}`)
                          .limit(1).maybeSingle();
                        setLinkProductId("");
                        if (data) {
                          setScanResult(data);
                          setScanQty("");
                          setScanInput("");
                        } else {
                          setScanResult({ notFound: true, query: q });
                          setScanInput("");
                        }
                      }
                    }}
                    placeholder="🔍 Spara il codice a barre (EAN) o digita SKU + Invio..."
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
                      <div style={{ fontSize:14 }}>
                        <div style={{ color:C.gold, fontWeight:700, marginBottom:6 }}>🔗 Codice non collegato: <span style={{ fontFamily:"monospace" }}>{scanResult.query}</span></div>
                        <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>Collega questo codice a un prodotto del catalogo. Lo fai una sola volta: dalla prossima scansione il carico sara automatico.</div>
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                          <select value={linkProductId} onChange={e=>setLinkProductId(e.target.value)} style={{ flex:1, minWidth:240, padding:"12px 14px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none" }}>
                            <option value="">— Scegli il prodotto —</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}{p.sku?` · ${p.sku}`:""}</option>
                            ))}
                          </select>
                          <button onClick={async () => {
                            if (!linkProductId) return;
                            await supabase.from("products").update({ barcode: scanResult.query }).eq("id", linkProductId);
                            const { data } = await supabase.from("products").select("*, inventory(*)").eq("id", linkProductId).maybeSingle();
                            notify(`✓ Codice collegato a ${data?.name||"prodotto"}`);
                            setScanResult(data || null);
                            setLinkProductId("");
                            setScanQty("");
                          }} style={{ padding:"12px 20px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, whiteSpace:"nowrap" }}>
                            🔗 Collega codice
                          </button>
                          <button onClick={() => { setScanResult(null); setLinkProductId(""); setTimeout(()=>scanInputRef.current?.focus(),100); }} style={{ padding:"12px 16px", borderRadius:9, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                          {scanResult.image_url && (
                            <img src={scanResult.image_url} alt="" style={{ width:56, height:56, objectFit:"cover", borderRadius:8 }} onError={e=>e.target.style.display="none"}/>
                          )}
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{scanResult.name}</div>
                            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{scanResult.barcode?`EAN ${scanResult.barcode} · `:""}{scanResult.sku} · {scanResult.category}</div>
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
                  💡 Spara il codice con la pistola: il campo lo legge da solo e parte con Invio. La prima volta che un codice e nuovo, lo colleghi al prodotto una volta sola — poi e automatico.
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
            <button onClick={exportShippyPro} style={{ marginBottom:20, padding:"10px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>📦 Esporta per ShippyPro (CSV)</button>
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
                    {["Order #","Distributor","Brand","Spedire a","Amount","Status","Date","Tracking","Actions"].map((h,i) => (
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
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>
                        {o.shipping_city ? (
                          <div>
                            <div style={{ fontWeight:600, color:C.text }}>{o.shipping_city}</div>
                            <div style={{ fontSize:11, color:C.textMuted }}>{o.shipping_address} · {o.shipping_country}</div>
                          </div>
                        ) : "—"}
                      </td>
                      <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{o.total_amount?.toLocaleString("it-IT")}</td>
                      <td style={{ padding:"11px 14px" }}><Badge status={o.status}/>{o.rating ? <div style={{ fontSize:12, color:C.gold, marginTop:3 }}>{"★".repeat(o.rating)}<span style={{ color:C.border }}>{"★".repeat(5-o.rating)}</span> <span title="Cancella recensione (appello brand)" onClick={async()=>{ if(!window.confirm("Cancellare la recensione e stornare i punti al brand?")) return; await supabase.rpc("admin_delete_review",{p_order:o.id}); notify("Recensione cancellata"); loadOrders(); }} style={{ cursor:"pointer", color:C.red, fontSize:11, marginLeft:6 }}>✕ togli</span></div> : null}</td>
                      <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td style={{ padding:"11px 14px" }}>
                        {o.tracking_number ? (
                          <div style={{ fontSize:11 }}>
                            <div style={{ color:C.text, fontWeight:600 }}>{o.courier||"—"}</div>
                            <div style={{ color:C.blue, fontFamily:"monospace" }}>{o.tracking_number}</div>
                          </div>
                        ) : (
                          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:140 }}>
                            <input value={trackEdits[o.id]?.courier ?? ""} onChange={ev=>setTrackEdits(p=>({ ...p, [o.id]:{ ...p[o.id], courier:ev.target.value } }))} placeholder="Corriere (es. BRT)" style={{ padding:"4px 6px", borderRadius:5, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:11 }}/>
                            <input value={trackEdits[o.id]?.tracking_number ?? ""} onChange={ev=>setTrackEdits(p=>({ ...p, [o.id]:{ ...p[o.id], tracking_number:ev.target.value } }))} placeholder="N. tracking" style={{ padding:"4px 6px", borderRadius:5, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:11 }}/>
                            <button onClick={()=>saveTracking(o)} style={{ padding:"4px 8px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}20`, border:`1px solid ${C.blue}50`, color:C.blue }}>Salva + notifica</button>
                          </div>
                        )}
                      </td>
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
        {tab === "commissions" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📊 Provvigioni automatiche</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 16px" }}>Scaglioni sul fatturato annuo reale · fino a 10M€ = 11,4% · 10–15M€ = 10% · oltre 15M€ = 9%</p>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
              <button onClick={recalcNow} disabled={recalcing} style={{ padding:"9px 18px", borderRadius:9, cursor: recalcing?"default":"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, opacity: recalcing?0.6:1 }}>{recalcing ? "Ricalcolo..." : "🔄 Ricalcola ora"}</button>
            </div>
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {["Brand","Fatturato stimato","Fatturato anno (reale)","% attuale","% scaglione reale","Bloccata","Azione"].map((h,i) => (
                      <th key={i} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissionRows.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:28, textAlign:"center", color:C.textMuted, fontSize:13 }}>Nessun brand registrato.</td></tr>
                  )}
                  {commissionRows.map((row,i) => {
                    const due = tierRate(row.actual);
                    const changed = due < (row.current ?? 11.4);
                    return (
                      <tr key={row.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"12px 16px", fontSize:13, color:C.text, fontWeight:600, whiteSpace:"nowrap" }}>{row.name}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:C.textMuted }}>€{(row.declared||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:C.text, fontWeight:600 }}>€{(row.actual||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"12px 16px", fontSize:14, fontWeight:700, color:C.goldLight }}>{(row.current ?? 11.4)}%</td>
                        <td style={{ padding:"12px 16px", fontSize:14, fontWeight:700, color:changed?C.green:C.textMuted }}>{due}%</td>
                        <td style={{ padding:"12px 16px" }}>
                          <button onClick={() => toggleLock(row)} title={row.locked ? "Sblocca tariffa" : "Blocca tariffa: l'automatismo non la modifichera'"} style={{ padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background: row.locked ? `${C.gold}18` : "transparent", border:`1px solid ${row.locked ? C.gold : C.border}`, color: row.locked ? C.goldLight : C.textMuted, whiteSpace:"nowrap" }}>{row.locked ? "🔒 Bloccata" : "🔓 Libera"}</button>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          {row.locked
                            ? <span style={{ fontSize:12, color:C.textDim }}>bloccata</span>
                            : changed
                            ? <button onClick={() => applyCommission(row, due)} style={{ padding:"7px 16px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green, whiteSpace:"nowrap" }}>Applica {due}%</button>
                            : <span style={{ fontSize:12, color:C.textDim }}>aggiornato</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop:12, padding:"10px 14px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:12, color:C.textMuted, lineHeight:1.6 }}>
              💡 Automatico: ogni giorno la provvigione scende da sola al superamento di una soglia; il 1° gennaio si ricalcola sul fatturato dell'anno precedente. Le tariffe bloccate non vengono toccate. Notifica in-app al brand a ogni cambio (email in arrivo).
            </div>
            <h3 style={{ fontSize:15, fontWeight:700, fontFamily:"Georgia,serif", margin:"24px 0 10px" }}>Storico modifiche</h3>
            {commissionLog.length === 0 ? (
              <div style={{ color:C.textMuted, fontSize:13 }}>Nessuna modifica registrata finora.</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:680 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {["Data","Brand","Da → A","Motivo","Fatturato"].map((h,i) => (<th key={i} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {commissionLog.map((l) => (
                      <tr key={l.id} style={{ borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"10px 16px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{l.created_at ? new Date(l.created_at).toLocaleDateString("it-IT") : "—"}</td>
                        <td style={{ padding:"10px 16px", fontSize:13, color:C.text, fontWeight:600, whiteSpace:"nowrap" }}>{l.brand?.company_name || "—"}</td>
                        <td style={{ padding:"10px 16px", fontSize:13, color:C.goldLight, fontWeight:600, whiteSpace:"nowrap" }}>{l.old_rate}% → {l.new_rate}%</td>
                        <td style={{ padding:"10px 16px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{l.reason === "annual_reset" ? "Reset annuale" : l.reason === "intra_year_drop" ? "Calo durante l'anno" : l.reason}</td>
                        <td style={{ padding:"10px 16px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>€{(l.revenue||0).toLocaleString("it-IT")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === "contracts" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📝 Contratti Digitali</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>Contratti di distribuzione esclusiva per territorio</p>
              </div>
              <button onClick={openNewContract}
                style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>
                + Nuovo Contratto
              </button>
            </div>

            {(() => {
              const today=new Date(); const soon=new Date(); soon.setDate(soon.getDate()+30);
              const act=contracts.filter(c=>c.status==="active").length;
              const dr=contracts.filter(c=>c.status==="draft").length;
              const expd=contracts.filter(c=>c.valid_until && new Date(c.valid_until)<today).length;
              const soonN=contracts.filter(c=>c.valid_until && new Date(c.valid_until)>=today && new Date(c.valid_until)<soon).length;
              return (
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
                  <Stat icon="✅" label="Attivi" value={act} accent={C.green}/>
                  <Stat icon="📝" label="Bozze" value={dr} accent={C.gold}/>
                  <Stat icon="⏳" label="In scadenza (30gg)" value={soonN} accent={C.gold}/>
                  <Stat icon="⚠️" label="Scaduti" value={expd} accent={C.red}/>
                </div>
              );
            })()}

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
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{c.brand?.company_name || "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{c.distributor?.company_name || "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{c.territory}</td>
                        <td style={{ padding:"11px 14px" }}>
                          <span style={{ fontSize:11, color:c.exclusivity?C.green:C.textMuted }}>{c.exclusivity?"✓ Esclusivo":"Non esclusivo"}</span>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textMuted }}>
                          {c.valid_from} → {c.valid_until}
                          {c.valid_until && new Date(c.valid_until) < new Date() && <span style={{ marginLeft:6, padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:700, background:`${C.red}18`, color:C.red, border:`1px solid ${C.red}40` }}>scaduto</span>}
                        </td>
                        <td style={{ padding:"11px 14px" }}><Badge status={c.status}/></td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => setAdminViewContract(c)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}12`, border:`1px solid ${C.blue}40`, color:C.blue }}>Vedi</button>
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
            {contractCreate && (() => {
              const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
              const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
              return (
              <Modal title="Nuovo contratto di distribuzione" onClose={()=>setContractCreate(false)} onSave={saveNewContract} saveLabel="Crea bozza">
                <label style={lbl}>Brand *</label>
                <select value={contractForm.brand_id||""} onChange={e=>setContractForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">— Scegli brand —</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <label style={lbl}>Distributore *</label>
                <select value={contractForm.distributor_id||""} onChange={e=>setContractForm(f=>({...f, distributor_id:e.target.value}))} style={fld}>
                  <option value="">— Scegli distributore —</option>
                  {users.filter(u=>u.role==="distributor").map(u=>(<option key={u.id} value={u.id}>{u.company_name||u.email}</option>))}
                </select>
                <label style={lbl}>Territorio</label>
                <input value={contractForm.territory||""} onChange={e=>setContractForm(f=>({...f, territory:e.target.value}))} placeholder="es. Italia, UE, Romania..." style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Commissione (%)</label><input type="number" step="0.1" value={contractForm.commission_rate} onChange={e=>setContractForm(f=>({...f, commission_rate:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>MOQ per ordine</label><input type="number" value={contractForm.moq_per_order} onChange={e=>setContractForm(f=>({...f, moq_per_order:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ flex:1 }}><label style={lbl}>Termini pagamento (giorni)</label><input type="number" value={contractForm.payment_terms} onChange={e=>setContractForm(f=>({...f, payment_terms:e.target.value}))} style={fld}/></div>
                  <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.text, marginTop:24, flex:1, cursor:"pointer" }}>
                    <input type="checkbox" checked={!!contractForm.exclusivity} onChange={e=>setContractForm(f=>({...f, exclusivity:e.target.checked}))}/> Esclusiva territoriale
                  </label>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>Valido dal</label><input type="date" value={contractForm.valid_from||""} onChange={e=>setContractForm(f=>({...f, valid_from:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>Valido fino al</label><input type="date" value={contractForm.valid_until||""} onChange={e=>setContractForm(f=>({...f, valid_until:e.target.value}))} style={fld}/></div>
                </div>
              </Modal>
              );
            })()}
          </div>
        )}

        {/* SEGNALAZIONI TAB */}
        {tab === "issues" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🚩 Segnalazioni ordini</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Problemi segnalati dai distributori (merce danneggiata, errori di consegna). Tutto tracciato.</p>
            {orderIssues.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:13 }}>Nessuna segnalazione.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {orderIssues.map(it => (
                  <div key={it.id} style={{ background:C.surface, border:`1px solid ${it.status==="open"?C.red+"55":C.border}`, borderRadius:12, padding:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontFamily:"monospace", fontSize:13, color:C.gold, fontWeight:700 }}>{it.order?.order_number || "-"}</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{it.dist_info?.company_name || "Distributore"}{it.dist_info?.country ? " - " + it.dist_info.country : ""} - {new Date(it.created_at).toLocaleString("it-IT")}</div>
                      </div>
                      <span style={{ padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, background: it.status==="open"?`${C.red}15`:`${C.green}15`, color: it.status==="open"?C.red:C.green, border:`1px solid ${it.status==="open"?C.red:C.green}40` }}>{it.status==="open"?"Aperta":"Chiusa"}</span>
                    </div>
                    <div style={{ fontSize:13, color:C.text, marginBottom:10, whiteSpace:"pre-wrap" }}>{it.reason}</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      {it.photo_url && <a href={it.photo_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"5px 12px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>📷 Vedi foto</a>}
                      {it.status==="open" && <button onClick={() => closeIssue(it.id)} style={{ fontSize:11, color:C.green, background:"transparent", border:`1px solid ${C.green}40`, borderRadius:6, padding:"5px 12px", cursor:"pointer" }}>✓ Segna come risolta</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {tab === "audit" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📋 Audit Log</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Registro automatico delle azioni importanti: ordini, incassi, accessi, fatture, prodotti, contratti.</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>Data e ora</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>Utente</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>Azione</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>Dettaglio</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.length === 0 && (
                    <tr><td colSpan={4} style={{ padding:24, textAlign:"center", color:C.textMuted, fontSize:13 }}>Nessuna azione registrata ancora. Compariranno qui man mano che usi la piattaforma.</td></tr>
                  )}
                  {auditLog.map(a => (
                    <tr key={a.id} style={{ borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{new Date(a.created_at).toLocaleString("it-IT")}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.text }}>{a.actor_info?.company_name || a.actor_info?.email || (a.actor ? "Utente" : "Sistema")}{a.actor_info?.role ? " · " + a.actor_info.role : ""}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, fontWeight:600, color:C.goldLight }}>{a.action}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>{a.detail || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FINANZE / P&L TAB */}
        {tab === "finanze" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>💶 Dashboard Finanziaria</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Ricavi, fee e margini calcolati dai dati reali della piattaforma.</p>
            {(() => {
              const valid = orders.filter(o => o.status !== "cancelled");
              const gmv = valid.reduce((a,o)=>a+Number(o.total_amount||0),0);
              const feeGross = paySplits.reduce((a,x)=>a+Number(x.nexushub_amount||0),0);
              const feeCollected = paySplits.filter(x=>x.split_status!=="pending").reduce((a,x)=>a+Number(x.nexushub_amount||0),0);
              const feePending = paySplits.filter(x=>x.split_status==="pending").reduce((a,x)=>a+Number(x.nexushub_amount||0),0);
              const toBrand = paySplits.filter(x=>x.split_status==="collected").reduce((a,x)=>a+Number(x.brand_amount||0),0);
              const ivaInvoiced = invoices.reduce((a,i)=>a+Number(i.vat_amount||0),0);
              const nBrands = new Set(valid.map(o=>o.brand_id).filter(Boolean)).size;
              const nDist = new Set(valid.map(o=>o.distributor_id).filter(Boolean)).size;
              const fmt=(n)=>"€"+Number(n||0).toLocaleString("it-IT",{maximumFractionDigits:0});
              const now = new Date();
              const months = [];
              for(let k=5;k>=0;k--){ const d=new Date(now.getFullYear(), now.getMonth()-k, 1); months.push({ key:d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"), label:d.toLocaleDateString("it-IT",{month:"short"}), gmv:0, fee:0 }); }
              const mi={}; months.forEach(m=>{mi[m.key]=m;});
              valid.forEach(o=>{ const d=new Date(o.created_at); const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); if(mi[k]) mi[k].gmv+=Number(o.total_amount||0); });
              paySplits.forEach(x=>{ const d=new Date(x.created_at); const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); if(mi[k]) mi[k].fee+=Number(x.nexushub_amount||0); });
              const maxVal = Math.max(1, ...months.map(m=>m.gmv), ...months.map(m=>m.fee));
              return (
                <div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
                    <Stat icon="📊" label="Volume venduto (GMV)" value={fmt(gmv)} accent={C.blue}/>
                    <Stat icon="↗" label="Fee tua (lorda)" value={fmt(feeGross)} accent={C.gold}/>
                    <Stat icon="✓" label="Fee incassata" value={fmt(feeCollected)} accent={C.green}/>
                    <Stat icon="⏳" label="Fee da incassare" value={fmt(feePending)}/>
                  </div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:22 }}>
                    <Stat icon="💸" label="Da girare ai brand" value={fmt(toBrand)}/>
                    <Stat icon="🧾" label="IVA fatturata" value={fmt(ivaInvoiced)}/>
                    <Stat icon="🏛️" label="Brand attivi" value={nBrands}/>
                    <Stat icon="⬡" label="Distributori attivi" value={nDist}/>
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:16 }}>Andamento ultimi 6 mesi</div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:12 }}>
                      {months.map(m=>(
                        <div key={m.key} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                          <div style={{ fontSize:10, color:C.textMuted }}>{fmt(m.gmv)}</div>
                          <div style={{ width:"100%", display:"flex", alignItems:"flex-end", justifyContent:"center", gap:3, height:120 }}>
                            <div title="GMV" style={{ width:"42%", height:Math.round(m.gmv/maxVal*118)+"px", background:`linear-gradient(180deg,${C.blue},${C.blue}80)`, borderRadius:"4px 4px 0 0", minHeight:2 }}/>
                            <div title="Fee" style={{ width:"42%", height:Math.round(m.fee/maxVal*118)+"px", background:`linear-gradient(180deg,${C.gold},${C.gold}80)`, borderRadius:"4px 4px 0 0", minHeight:2 }}/>
                          </div>
                          <div style={{ fontSize:11, color:C.textMuted }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:16, marginTop:14, fontSize:11, color:C.textMuted }}>
                      <span><span style={{ display:"inline-block", width:10, height:10, background:C.blue, borderRadius:2, marginRight:5 }}/>GMV</span>
                      <span><span style={{ display:"inline-block", width:10, height:10, background:C.gold, borderRadius:2, marginRight:5 }}/>Fee tua</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* INCASSI & SPLIT TAB */}
        {tab === "incassi" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>💸 Incassi & Split</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Per ogni ordine: quota brand + tua fee. Incassi dal distributore e bonifichi al brand. Il distributore non vede la fee.</p>
            {(() => {
              const pend = paySplits.filter(x => x.split_status === "pending");
              const coll = paySplits.filter(x => x.split_status === "collected");
              const feeTot = paySplits.filter(x => x.split_status !== "pending").reduce((a,x)=>a+Number(x.nexushub_amount||0),0);
              const toBrand = coll.reduce((a,x)=>a+Number(x.brand_amount||0),0);
              const toCollect = pend.reduce((a,x)=>a+Number(x.total_amount||0),0);
              const byBrand = {};
              coll.forEach(x => { const k = x.brand_name || "—"; if(!byBrand[k]) byBrand[k]={ amount:0, iban:x.brand_iban }; byBrand[k].amount += Number(x.brand_amount||0); });
              return (
                <div>
                  <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
                    <Stat icon="↗" label="Fee tua (incassata)" value={"€"+feeTot.toLocaleString("it-IT",{minimumFractionDigits:2})} accent={C.gold}/>
                    <Stat icon="💸" label="Da bonificare ai brand" value={"€"+toBrand.toLocaleString("it-IT",{minimumFractionDigits:2})} accent={C.blue}/>
                    <Stat icon="⏳" label="Da incassare" value={"€"+toCollect.toLocaleString("it-IT",{minimumFractionDigits:2})}/>
                  </div>
                  {Object.keys(byBrand).length > 0 && (
                    <div style={{ background:C.surface, border:`1px solid ${C.gold}40`, borderRadius:12, padding:16, marginBottom:20 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.goldLight, marginBottom:10 }}>💸 Da bonificare ai brand (ordini gia incassati)</div>
                      {Object.entries(byBrand).map(([name, info]) => (
                        <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop:`1px solid ${C.border}`, gap:10, flexWrap:"wrap" }}>
                          <div>
                            <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{name}</div>
                            <div style={{ fontSize:11, color:C.textMuted, fontFamily:"monospace" }}>{info.iban || "IBAN non impostato"}</div>
                          </div>
                          <div style={{ fontSize:15, fontWeight:800, color:C.goldLight }}>€{info.amount.toLocaleString("it-IT",{minimumFractionDigits:2})}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {paySplits.length === 0 ? (
                    <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>Nessun ordine da gestire.</div>
                  ) : (
                    <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:880 }}>
                        <thead>
                          <tr style={{ background:C.surface2 }}>
                            {["Ordine","Distributore","Brand","Totale","Tua fee","Al brand","Stato","Azione"].map((h,i)=>(
                              <th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paySplits.map((x,i) => (
                            <tr key={x.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                              <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{x.order_number || "—"}</span></td>
                              <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{x.distributor_name || "—"}</td>
                              <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{x.brand_name || "—"}</td>
                              <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>€{Number(x.total_amount||0).toLocaleString("it-IT")}</td>
                              <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.gold }}>€{Number(x.nexushub_amount||0).toLocaleString("it-IT")}</td>
                              <td style={{ padding:"11px 14px", fontSize:13, color:C.goldLight }}>€{Number(x.brand_amount||0).toLocaleString("it-IT")}</td>
                              <td style={{ padding:"11px 14px" }}>
                                <span style={{ fontSize:11, fontWeight:600, color: x.split_status==="paid_brand"?C.green:x.split_status==="collected"?C.blue:C.textMuted }}>
                                  {x.split_status==="paid_brand"?"✓ Completato":x.split_status==="collected"?"Incassato":"In attesa"}
                                </span>
                              </td>
                              <td style={{ padding:"11px 14px" }}>
                                {x.split_status==="pending" && <button onClick={()=>markCollected(x)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>✓ Incassato</button>}
                                {x.split_status==="collected" && <button onClick={()=>markPaidBrand(x)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.green}15`, border:`1px solid ${C.green}45`, color:C.green }}>💸 Bonificato</button>}
                                {x.split_status==="paid_brand" && <span style={{ fontSize:11, color:C.green }}>✓</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}
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
      {adminViewContract && (
        <ContractModal
          contract={adminViewContract}
          brandName={(adminViewContract.brand && adminViewContract.brand.company_name) || "Brand"}
          distCompany={(adminViewContract.distributor && adminViewContract.distributor.company_name) || ""}
          distName={(adminViewContract.distributor && adminViewContract.distributor.full_name) || ""}
          distCountry={(adminViewContract.distributor && adminViewContract.distributor.country) || ""}
          viewerRole="admin"
          onClose={() => setAdminViewContract(null)}
        />
      )}
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

            {editingUser.role === "brand" && (
              <div style={{ marginBottom:16, padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:12, color:C.gold, fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>📊 Commissione piattaforma (a carico del brand)</div>
                <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                  <div>
                    <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:6 }}>Commissione % (9–11,4)</label>
                    <input type="number" min={9} max={11.4} step={0.1} defaultValue={editingUser.commission_rate ?? 11.4}
                      onBlur={async (e) => {
                        const v = Math.min(11.4, Math.max(9, Number(e.target.value) || 11.4));
                        await supabase.from("profiles").update({ commission_rate: v }).eq("id", editingUser.id);
                        setEditingUser(u => ({ ...u, commission_rate: v }));
                        notify("✓ Commissione aggiornata!");
                      }}
                      style={{ width:110, padding:"10px 12px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:6 }}>Fatturato annuo stimato (€)</label>
                    <input type="number" min={0} step={10000} defaultValue={editingUser.estimated_annual_revenue ?? 0}
                      onBlur={async (e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        await supabase.from("profiles").update({ estimated_annual_revenue: v }).eq("id", editingUser.id);
                        setEditingUser(u => ({ ...u, estimated_annual_revenue: v }));
                        notify("✓ Fatturato stimato aggiornato!");
                      }}
                      style={{ width:180, padding:"10px 12px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:14 }} />
                  </div>
                </div>
                <div style={{ marginTop:10, padding:"8px 12px", background:`${C.gold}08`, border:`1px solid ${C.gold}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                  💡 La imposti tu (admin). Il brand la paga, non la sceglie. Usata nei contratti generati all'approvazione dei distributori.
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
