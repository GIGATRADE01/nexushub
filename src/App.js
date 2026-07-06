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
Object.assign(T.en, { azTitle:"Your products on Amazon EU", azSub:"Managed by NexusHub · logistics + FBA · sales and coverage", azLoading:"Loading Amazon data…", azEmptyT:"No products on Amazon yet", azEmptyM:"When your partner activates your products on Amazon EU, you'll see sales, stock and coverage here.", azOn:"On Amazon", azLaunch:"To launch", azCat:"Catalog", azRev:"Amazon revenue (30d)", azSold:"Units sold (30d)", azStockKpi:"Stock on Amazon", azMkts:"Active marketplaces", azColMkt:"Marketplace", azColPrice:"Amazon price", azColSold:"Sold (30d)", azNoneActive:"None of your products are active on Amazon yet. Launch candidates below.", azNotYet:"Not yet on Amazon", azNotYetMsg:"of your products are not yet on the shelf on Amazon EU — potential launches to evaluate with your partner.", azBadge:"to launch", azFooter:"Prices, sponsorships and logistics are managed by your distribution partner (NexusHub). Sales data is updated periodically." });
Object.assign(T.it, { azTitle:"I tuoi prodotti su Amazon EU", azSub:"Gestito da NexusHub · logistica + FBA · vendite e copertura", azLoading:"Caricamento dati Amazon…", azEmptyT:"Nessun prodotto ancora su Amazon", azEmptyM:"Quando il tuo partner attiva i tuoi prodotti su Amazon EU, qui vedrai vendite, stock e copertura.", azOn:"Su Amazon", azLaunch:"Da lanciare", azCat:"Catalogo", azRev:"Fatturato Amazon (30gg)", azSold:"Unità vendute (30gg)", azStockKpi:"Stock su Amazon", azMkts:"Marketplace attivi", azColMkt:"Marketplace", azColPrice:"Prezzo Amazon", azColSold:"Venduti (30gg)", azNoneActive:"Nessuno dei tuoi prodotti è ancora attivo su Amazon. Qui sotto i candidati al lancio.", azNotYet:"Non ancora su Amazon", azNotYetMsg:"tuoi prodotti non sono ancora a scaffale su Amazon EU — potenziali lanci da valutare col partner.", azBadge:"da lanciare", azFooter:"Prezzi, sponsorizzazioni e logistica sono gestiti dal tuo partner di distribuzione (NexusHub). I dati di vendita vengono aggiornati periodicamente." });
Object.assign(T.fr, { azTitle:"Vos produits sur Amazon EU", azSub:"Géré par NexusHub · logistique + FBA · ventes et couverture", azLoading:"Chargement des données Amazon…", azEmptyT:"Aucun produit sur Amazon pour le moment", azEmptyM:"Lorsque votre partenaire activera vos produits sur Amazon EU, vous verrez ici les ventes, le stock et la couverture.", azOn:"Sur Amazon", azLaunch:"À lancer", azCat:"Catalogue", azRev:"Chiffre d'affaires Amazon (30 j)", azSold:"Unités vendues (30 j)", azStockKpi:"Stock sur Amazon", azMkts:"Places de marché actives", azColMkt:"Place de marché", azColPrice:"Prix Amazon", azColSold:"Vendus (30 j)", azNoneActive:"Aucun de vos produits n'est encore actif sur Amazon. Candidats au lancement ci-dessous.", azNotYet:"Pas encore sur Amazon", azNotYetMsg:"de vos produits ne sont pas encore en rayon sur Amazon EU — lancements potentiels à évaluer avec votre partenaire.", azBadge:"à lancer", azFooter:"Les prix, les sponsorisations et la logistique sont gérés par votre partenaire de distribution (NexusHub). Les données de vente sont mises à jour périodiquement." });
Object.assign(T.es, { azTitle:"Tus productos en Amazon EU", azSub:"Gestionado por NexusHub · logística + FBA · ventas y cobertura", azLoading:"Cargando datos de Amazon…", azEmptyT:"Aún no hay productos en Amazon", azEmptyM:"Cuando tu socio active tus productos en Amazon EU, aquí verás ventas, stock y cobertura.", azOn:"En Amazon", azLaunch:"Por lanzar", azCat:"Catálogo", azRev:"Ingresos Amazon (30 d)", azSold:"Unidades vendidas (30 d)", azStockKpi:"Stock en Amazon", azMkts:"Mercados activos", azColMkt:"Mercado", azColPrice:"Precio Amazon", azColSold:"Vendidos (30 d)", azNoneActive:"Ninguno de tus productos está activo aún en Amazon. Candidatos al lanzamiento abajo.", azNotYet:"Aún no en Amazon", azNotYetMsg:"de tus productos aún no están en el estante en Amazon EU — posibles lanzamientos a evaluar con tu socio.", azBadge:"por lanzar", azFooter:"Los precios, las promociones y la logística los gestiona tu socio de distribución (NexusHub). Los datos de ventas se actualizan periódicamente." });
Object.assign(T.de, { azTitle:"Ihre Produkte auf Amazon EU", azSub:"Verwaltet von NexusHub · Logistik + FBA · Verkäufe und Abdeckung", azLoading:"Amazon-Daten werden geladen…", azEmptyT:"Noch keine Produkte auf Amazon", azEmptyM:"Sobald Ihr Partner Ihre Produkte auf Amazon EU aktiviert, sehen Sie hier Verkäufe, Bestand und Abdeckung.", azOn:"Auf Amazon", azLaunch:"Zu starten", azCat:"Katalog", azRev:"Amazon-Umsatz (30 T)", azSold:"Verkaufte Einheiten (30 T)", azStockKpi:"Bestand auf Amazon", azMkts:"Aktive Marktplätze", azColMkt:"Marktplatz", azColPrice:"Amazon-Preis", azColSold:"Verkauft (30 T)", azNoneActive:"Noch keines Ihrer Produkte ist auf Amazon aktiv. Startkandidaten unten.", azNotYet:"Noch nicht auf Amazon", azNotYetMsg:"Ihrer Produkte sind noch nicht im Regal auf Amazon EU — mögliche Markteinführungen, mit Ihrem Partner zu prüfen.", azBadge:"zu starten", azFooter:"Preise, Sponsoring und Logistik werden von Ihrem Vertriebspartner (NexusHub) verwaltet. Verkaufsdaten werden regelmäßig aktualisiert." });
Object.assign(T.zh, { azTitle:"您在 Amazon EU 上的产品", azSub:"由 NexusHub 管理 · 物流 + FBA · 销售与覆盖", azLoading:"正在加载 Amazon 数据…", azEmptyT:"暂无 Amazon 产品", azEmptyM:"当您的合作伙伴在 Amazon EU 上激活您的产品后，您将在此看到销售、库存和覆盖情况。", azOn:"已在 Amazon", azLaunch:"待上架", azCat:"目录", azRev:"Amazon 营收(30天)", azSold:"已售件数(30天)", azStockKpi:"Amazon 库存", azMkts:"活跃市场", azColMkt:"市场", azColPrice:"Amazon 价格", azColSold:"已售(30天)", azNoneActive:"您的产品尚未在 Amazon 上架。以下为上架候选。", azNotYet:"尚未在 Amazon", azNotYetMsg:"个产品尚未在 Amazon EU 上架 — 可与合作伙伴评估的潜在上架。", azBadge:"待上架", azFooter:"价格、推广和物流由您的分销合作伙伴(NexusHub)管理。销售数据定期更新。" });
Object.assign(T.ar, { azTitle:"منتجاتك على Amazon EU", azSub:"تُدار بواسطة NexusHub · الخدمات اللوجستية + FBA · المبيعات والتغطية", azLoading:"جارٍ تحميل بيانات Amazon…", azEmptyT:"لا توجد منتجات على Amazon بعد", azEmptyM:"عندما يقوم شريكك بتفعيل منتجاتك على Amazon EU، سترى هنا المبيعات والمخزون والتغطية.", azOn:"على Amazon", azLaunch:"للإطلاق", azCat:"الكتالوج", azRev:"إيراد Amazon (30 يومًا)", azSold:"الوحدات المباعة (30 يومًا)", azStockKpi:"المخزون على Amazon", azMkts:"الأسواق النشطة", azColMkt:"السوق", azColPrice:"سعر Amazon", azColSold:"المباعة (30 يومًا)", azNoneActive:"لا يوجد أي من منتجاتك نشطًا على Amazon بعد. المرشحون للإطلاق أدناه.", azNotYet:"ليست بعد على Amazon", azNotYetMsg:"من منتجاتك ليست بعد على الرفوف في Amazon EU — عمليات إطلاق محتملة لتقييمها مع شريكك.", azBadge:"للإطلاق", azFooter:"تُدار الأسعار والرعايات والخدمات اللوجستية من قِبل شريك التوزيع (NexusHub). تُحدَّث بيانات المبيعات دوريًا." });
Object.assign(T.en, { ovProducts:"Products", ovOrders:"Orders", ovDistAuth:"Authorized distributors", ovNoDist:"No authorized distributors yet. When you approve a request in the Applications tab, the distributor appears here and on the map.", ovEuMap:"European distribution map", ovYourProd:"Your products", ovCatProd:"Catalog products", ovTotOrders:"Total orders", ovActiveDist:"Active distributors", ovRevenue:"Revenue" });
Object.assign(T.it, { ovProducts:"Prodotti", ovOrders:"Ordini", ovDistAuth:"Distributori autorizzati", ovNoDist:"Nessun distributore autorizzato ancora. Quando approvi una richiesta nella tab Richieste, il distributore compare qui e sulla mappa.", ovEuMap:"Mappa distribuzione europea", ovYourProd:"I tuoi prodotti", ovCatProd:"Prodotti a catalogo", ovTotOrders:"Ordini totali", ovActiveDist:"Distributori attivi", ovRevenue:"Fatturato" });
Object.assign(T.fr, { ovProducts:"Produits", ovOrders:"Commandes", ovDistAuth:"Distributeurs autorisés", ovNoDist:"Aucun distributeur autorisé pour le moment. Lorsque vous approuvez une demande dans l'onglet Candidatures, le distributeur apparaît ici et sur la carte.", ovEuMap:"Carte de distribution européenne", ovYourProd:"Vos produits", ovCatProd:"Produits au catalogue", ovTotOrders:"Commandes totales", ovActiveDist:"Distributeurs actifs", ovRevenue:"Chiffre d'affaires" });
Object.assign(T.es, { ovProducts:"Productos", ovOrders:"Pedidos", ovDistAuth:"Distribuidores autorizados", ovNoDist:"Aún no hay distribuidores autorizados. Cuando apruebas una solicitud en la pestaña Solicitudes, el distribuidor aparece aquí y en el mapa.", ovEuMap:"Mapa de distribución europea", ovYourProd:"Tus productos", ovCatProd:"Productos en catálogo", ovTotOrders:"Pedidos totales", ovActiveDist:"Distribuidores activos", ovRevenue:"Ingresos" });
Object.assign(T.de, { ovProducts:"Produkte", ovOrders:"Bestellungen", ovDistAuth:"Autorisierte Händler", ovNoDist:"Noch keine autorisierten Händler. Wenn Sie eine Anfrage im Tab Bewerbungen genehmigen, erscheint der Händler hier und auf der Karte.", ovEuMap:"Europäische Vertriebskarte", ovYourProd:"Ihre Produkte", ovCatProd:"Produkte im Katalog", ovTotOrders:"Bestellungen gesamt", ovActiveDist:"Aktive Händler", ovRevenue:"Umsatz" });
Object.assign(T.zh, { ovProducts:"产品", ovOrders:"订单", ovDistAuth:"授权分销商", ovNoDist:"暂无授权分销商。当您在「申请」标签中批准请求后，该分销商将显示在此处和地图上。", ovEuMap:"欧洲分销地图", ovYourProd:"您的产品", ovCatProd:"目录产品", ovTotOrders:"订单总数", ovActiveDist:"活跃分销商", ovRevenue:"营收" });
Object.assign(T.ar, { ovProducts:"المنتجات", ovOrders:"الطلبات", ovDistAuth:"الموزّعون المعتمدون", ovNoDist:"لا يوجد موزّعون معتمدون بعد. عند الموافقة على طلب في تبويب الطلبات، يظهر الموزّع هنا وعلى الخريطة.", ovEuMap:"خريطة التوزيع الأوروبية", ovYourProd:"منتجاتك", ovCatProd:"منتجات الكتالوج", ovTotOrders:"إجمالي الطلبات", ovActiveDist:"الموزّعون النشطون", ovRevenue:"الإيراد" });
Object.assign(T.en, { diNoBrands:"No brands available yet", diNoBrandsMsg:"As soon as a brand registers and is approved on the platform, it will appear here and you'll be able to request access to its products.", diReqAccess:"Request access to view and order this brand's catalog in your territory.", diNoDocs:"No documents available for this product.", diDownload:"Download", diOutStock:"Out of Stock", diAddCart:"Add to cart", diInvoicesSub:"Purchase invoices received from brands for your orders.", diNoInvoices:"No invoices yet.", diView:"View", diWishTitle:"Wishlist", diWishSub:"The products you've saved. Add them to the cart whenever you want.", diNoWish:"No saved wishes", diNoWishMsg:"Go to the catalog and tap the heart on the products you're interested in.", diGoCatalog:"Go to catalog →", diNoOrders:"No orders yet", diNoOrdersMsg:"Go to My Catalog to place your first order", diBrowse:"Browse Catalog →", diReorder:"Reorder", diReport:"Report a problem", diTrack:"Track", diRatingDone:"Your rating:", diRateOrder:"Rate this order:", diProblemAlert:"Describe the problem before sending.", diProblemDesc:"Describe the problem (damaged goods, wrong quantity, wrong product...). The report is tracked and you will be contacted back.", diReason:"Reason *" });
Object.assign(T.it, { diNoBrands:"Nessun brand disponibile al momento", diNoBrandsMsg:"Appena un brand si registra e viene approvato sulla piattaforma comparirà qui, e potrai richiedere l'accesso ai suoi prodotti.", diReqAccess:"Richiedi l'accesso per visualizzare e ordinare il catalogo di questo brand nel tuo territorio.", diNoDocs:"Nessun documento disponibile per questo prodotto.", diDownload:"Scarica", diOutStock:"Out of Stock", diAddCart:"Aggiungi al carrello", diInvoicesSub:"Fatture di acquisto ricevute dai brand per i tuoi ordini.", diNoInvoices:"Nessuna fattura ancora.", diView:"Vedi", diWishTitle:"Lista desideri", diWishSub:"I prodotti che hai salvato. Aggiungili al carrello quando vuoi.", diNoWish:"Nessun desiderio salvato", diNoWishMsg:"Vai al catalogo e tocca il cuore sui prodotti che ti interessano.", diGoCatalog:"Vai al catalogo →", diNoOrders:"Nessun ordine ancora", diNoOrdersMsg:"Vai al tuo catalogo per fare il primo ordine", diBrowse:"Sfoglia il catalogo →", diReorder:"Riordina", diReport:"Segnala problema", diTrack:"Traccia", diRatingDone:"La tua valutazione:", diRateOrder:"Valuta questo ordine:", diProblemAlert:"Descrivi il problema prima di inviare.", diProblemDesc:"Descrivi il problema (merce danneggiata, quantità errata, prodotto sbagliato...). La segnalazione resta tracciata e verrai ricontattato.", diReason:"Motivo *" });
Object.assign(T.fr, { diNoBrands:"Aucune marque disponible pour le moment", diNoBrandsMsg:"Dès qu'une marque s'inscrit et est approuvée sur la plateforme, elle apparaîtra ici et vous pourrez demander l'accès à ses produits.", diReqAccess:"Demandez l'accès pour consulter et commander le catalogue de cette marque sur votre territoire.", diNoDocs:"Aucun document disponible pour ce produit.", diDownload:"Télécharger", diOutStock:"Rupture de stock", diAddCart:"Ajouter au panier", diInvoicesSub:"Factures d'achat reçues des marques pour vos commandes.", diNoInvoices:"Aucune facture pour le moment.", diView:"Voir", diWishTitle:"Liste de souhaits", diWishSub:"Les produits que vous avez enregistrés. Ajoutez-les au panier quand vous voulez.", diNoWish:"Aucun souhait enregistré", diNoWishMsg:"Allez au catalogue et touchez le cœur sur les produits qui vous intéressent.", diGoCatalog:"Aller au catalogue →", diNoOrders:"Aucune commande pour le moment", diNoOrdersMsg:"Allez dans Mon catalogue pour passer votre première commande", diBrowse:"Parcourir le catalogue →", diReorder:"Recommander", diReport:"Signaler un problème", diTrack:"Suivre", diRatingDone:"Votre évaluation :", diRateOrder:"Évaluez cette commande :", diProblemAlert:"Décrivez le problème avant d'envoyer.", diProblemDesc:"Décrivez le problème (marchandise endommagée, quantité erronée, mauvais produit...). Le signalement est suivi et vous serez recontacté.", diReason:"Motif *" });
Object.assign(T.es, { diNoBrands:"Aún no hay marcas disponibles", diNoBrandsMsg:"En cuanto una marca se registre y sea aprobada en la plataforma, aparecerá aquí y podrás solicitar acceso a sus productos.", diReqAccess:"Solicita acceso para ver y pedir el catálogo de esta marca en tu territorio.", diNoDocs:"No hay documentos disponibles para este producto.", diDownload:"Descargar", diOutStock:"Sin stock", diAddCart:"Añadir al carrito", diInvoicesSub:"Facturas de compra recibidas de las marcas por tus pedidos.", diNoInvoices:"Aún no hay facturas.", diView:"Ver", diWishTitle:"Lista de deseos", diWishSub:"Los productos que has guardado. Añádelos al carrito cuando quieras.", diNoWish:"No hay deseos guardados", diNoWishMsg:"Ve al catálogo y toca el corazón en los productos que te interesen.", diGoCatalog:"Ir al catálogo →", diNoOrders:"Aún no hay pedidos", diNoOrdersMsg:"Ve a Mi catálogo para hacer tu primer pedido", diBrowse:"Explorar catálogo →", diReorder:"Volver a pedir", diReport:"Reportar un problema", diTrack:"Rastrear", diRatingDone:"Tu valoración:", diRateOrder:"Valora este pedido:", diProblemAlert:"Describe el problema antes de enviar.", diProblemDesc:"Describe el problema (mercancía dañada, cantidad incorrecta, producto equivocado...). El reporte queda registrado y te volveremos a contactar.", diReason:"Motivo *" });
Object.assign(T.de, { diNoBrands:"Noch keine Marken verfügbar", diNoBrandsMsg:"Sobald sich eine Marke registriert und auf der Plattform freigegeben wird, erscheint sie hier und Sie können Zugang zu ihren Produkten anfragen.", diReqAccess:"Fordern Sie Zugang an, um den Katalog dieser Marke in Ihrem Gebiet zu sehen und zu bestellen.", diNoDocs:"Keine Dokumente für dieses Produkt verfügbar.", diDownload:"Herunterladen", diOutStock:"Nicht auf Lager", diAddCart:"In den Warenkorb", diInvoicesSub:"Eingangsrechnungen der Marken für Ihre Bestellungen.", diNoInvoices:"Noch keine Rechnungen.", diView:"Ansehen", diWishTitle:"Wunschliste", diWishSub:"Die von Ihnen gespeicherten Produkte. Fügen Sie sie jederzeit dem Warenkorb hinzu.", diNoWish:"Keine gespeicherten Wünsche", diNoWishMsg:"Gehen Sie zum Katalog und tippen Sie bei den interessanten Produkten auf das Herz.", diGoCatalog:"Zum Katalog →", diNoOrders:"Noch keine Bestellungen", diNoOrdersMsg:"Gehen Sie zu Mein Katalog, um Ihre erste Bestellung aufzugeben", diBrowse:"Katalog durchsuchen →", diReorder:"Nachbestellen", diReport:"Problem melden", diTrack:"Verfolgen", diRatingDone:"Ihre Bewertung:", diRateOrder:"Bewerten Sie diese Bestellung:", diProblemAlert:"Beschreiben Sie das Problem vor dem Senden.", diProblemDesc:"Beschreiben Sie das Problem (beschädigte Ware, falsche Menge, falsches Produkt...). Die Meldung wird verfolgt und Sie werden zurückkontaktiert.", diReason:"Grund *" });
Object.assign(T.zh, { diNoBrands:"暂无可用品牌", diNoBrandsMsg:"一旦有品牌注册并通过平台审核，它将显示在此处，您即可申请访问其产品。", diReqAccess:"申请访问以在您的区域查看并订购该品牌的目录。", diNoDocs:"该产品暂无可用文件。", diDownload:"下载", diOutStock:"缺货", diAddCart:"加入购物车", diInvoicesSub:"您订单收到的来自品牌的采购发票。", diNoInvoices:"暂无发票。", diView:"查看", diWishTitle:"心愿单", diWishSub:"您保存的产品。随时可加入购物车。", diNoWish:"暂无收藏", diNoWishMsg:"前往目录，点按您感兴趣产品上的爱心。", diGoCatalog:"前往目录 →", diNoOrders:"暂无订单", diNoOrdersMsg:"前往「我的目录」下第一笔订单", diBrowse:"浏览目录 →", diReorder:"再次订购", diReport:"报告问题", diTrack:"追踪", diRatingDone:"您的评分：", diRateOrder:"为此订单评分：", diProblemAlert:"发送前请描述问题。", diProblemDesc:"描述问题（货物损坏、数量错误、产品错误……）。该报告会被跟踪，我们将回复您。", diReason:"原因 *" });
Object.assign(T.ar, { diNoBrands:"لا توجد علامات متاحة بعد", diNoBrandsMsg:"بمجرد أن تسجّل علامة تجارية وتُعتمد على المنصة، ستظهر هنا وسيمكنك طلب الوصول إلى منتجاتها.", diReqAccess:"اطلب الوصول لعرض وطلب كتالوج هذه العلامة في منطقتك.", diNoDocs:"لا توجد مستندات متاحة لهذا المنتج.", diDownload:"تنزيل", diOutStock:"نفد المخزون", diAddCart:"أضف إلى السلة", diInvoicesSub:"فواتير الشراء المستلمة من العلامات لطلباتك.", diNoInvoices:"لا توجد فواتير بعد.", diView:"عرض", diWishTitle:"قائمة الرغبات", diWishSub:"المنتجات التي حفظتها. أضفها إلى السلة متى شئت.", diNoWish:"لا توجد رغبات محفوظة", diNoWishMsg:"انتقل إلى الكتالوج وانقر على القلب في المنتجات التي تهمّك.", diGoCatalog:"اذهب إلى الكتالوج ←", diNoOrders:"لا توجد طلبات بعد", diNoOrdersMsg:"انتقل إلى كتالوجي لتقديم أول طلب لك", diBrowse:"تصفح الكتالوج ←", diReorder:"إعادة الطلب", diReport:"الإبلاغ عن مشكلة", diTrack:"تتبّع", diRatingDone:"تقييمك:", diRateOrder:"قيّم هذا الطلب:", diProblemAlert:"صف المشكلة قبل الإرسال.", diProblemDesc:"صف المشكلة (بضاعة تالفة، كمية خاطئة، منتج خاطئ...). يبقى البلاغ متتبَّعًا وسيتم التواصل معك.", diReason:"السبب *" });
Object.assign(T.en, { aiIntro:"Hi! I'm Nexus AI. I answer on your real data: tap a question below or type to me.", aiSub:"Assistant on your real data · instant answers", aiSearching:"Nexus AI is searching…", aiPlaceholder:"Type a question…", aiSend:"Send", aiFooter:"Nexus AI only answers on data you have access to. Free-form language is coming soon (AI upgrade).", aiNoUnderstand:"I'm not sure I understood. Try one of these:", aiError:"Oops, I couldn't retrieve the data. Try again.", aiNoOrders:"no orders", aiStDraft:"draft", aiStPending:"pending", aiStConfirmed:"confirmed", aiStShipped:"shipped", aiStDelivered:"delivered", aiStCancelled:"cancelled", aiBChipSales:"My sales", aiBChipOrders:"Orders by status", aiBChipRating:"Average rating", aiBChipProducts:"My products", aiBSales:"Total sales (gross): {gmv}\nOrders: {n}\nEstimated payout (net of platform fee): {payout}", aiBOrdersTitle:"Your orders by status:", aiBNoRatings:"You haven't received any ratings yet.", aiBRating:"Average rating: {avg}/5 across {n} rated orders.", aiBProducts:"Active products: {act} of {tot}.", aiBLow:"Low stock (<50): {list}", aiBStockOk:"Stock ok.", aiDChipOrders:"My orders", aiDChipTrack:"Where is my order", aiDChipWish:"My wishlist", aiDChipCatalog:"Available catalog", aiDSpent:"Total spent: {spent}", aiDNoShip:"No order shipped yet.", aiDTrack:"Last shipped order: {num}\nStatus: {status}\nCourier: {courier}\nTracking: {track}", aiDTrackLink:"Link: {url}", aiDWish:"You have {n} products in your wishlist.", aiDCatalog:"You have access to {n} active products from approved brands." });
Object.assign(T.it, { aiIntro:"Ciao! Sono Nexus AI. Rispondo sui tuoi dati reali: tocca una domanda qui sotto o scrivimi.", aiSub:"Assistente sui tuoi dati reali · risposte istantanee", aiSearching:"Nexus AI sta cercando…", aiPlaceholder:"Scrivi una domanda…", aiSend:"Invia", aiFooter:"Nexus AI risponde solo sui dati a cui hai accesso. Presto capirà anche il linguaggio libero (upgrade AI).", aiNoUnderstand:"Non sono sicuro di aver capito. Prova una di queste:", aiError:"Ops, non sono riuscito a recuperare il dato. Riprova.", aiNoOrders:"nessun ordine", aiStDraft:"bozza", aiStPending:"in attesa", aiStConfirmed:"confermato", aiStShipped:"spedito", aiStDelivered:"consegnato", aiStCancelled:"annullato", aiBChipSales:"Le mie vendite", aiBChipOrders:"Ordini per stato", aiBChipRating:"Rating medio", aiBChipProducts:"I miei prodotti", aiBSales:"Vendite totali (lordo): {gmv}\nOrdini: {n}\nPayout stimato (al netto fee piattaforma): {payout}", aiBOrdersTitle:"I tuoi ordini per stato:", aiBNoRatings:"Non hai ancora ricevuto valutazioni.", aiBRating:"Rating medio: {avg}/5 su {n} ordini valutati.", aiBProducts:"Prodotti attivi: {act} su {tot}.", aiBLow:"Sotto scorta (<50): {list}", aiBStockOk:"Scorte ok.", aiDChipOrders:"I miei ordini", aiDChipTrack:"Dov'è il mio ordine", aiDChipWish:"La mia wishlist", aiDChipCatalog:"Catalogo disponibile", aiDSpent:"Spesa totale: {spent}", aiDNoShip:"Nessun ordine ancora spedito.", aiDTrack:"Ultimo ordine spedito: {num}\nStato: {status}\nCorriere: {courier}\nTracking: {track}", aiDTrackLink:"Link: {url}", aiDWish:"Hai {n} prodotti nella wishlist.", aiDCatalog:"Hai accesso a {n} prodotti attivi dai brand approvati." });
Object.assign(T.fr, { aiIntro:"Bonjour ! Je suis Nexus AI. Je réponds sur vos données réelles : touchez une question ci-dessous ou écrivez-moi.", aiSub:"Assistant sur vos données réelles · réponses instantanées", aiSearching:"Nexus AI recherche…", aiPlaceholder:"Écrivez une question…", aiSend:"Envoyer", aiFooter:"Nexus AI ne répond que sur les données auxquelles vous avez accès. Le langage libre arrive bientôt (mise à niveau IA).", aiNoUnderstand:"Je ne suis pas sûr d'avoir compris. Essayez l'une de celles-ci :", aiError:"Oups, je n'ai pas pu récupérer la donnée. Réessayez.", aiNoOrders:"aucune commande", aiStDraft:"brouillon", aiStPending:"en attente", aiStConfirmed:"confirmé", aiStShipped:"expédié", aiStDelivered:"livré", aiStCancelled:"annulé", aiBChipSales:"Mes ventes", aiBChipOrders:"Commandes par statut", aiBChipRating:"Note moyenne", aiBChipProducts:"Mes produits", aiBSales:"Ventes totales (brut) : {gmv}\nCommandes : {n}\nPaiement estimé (net des frais de plateforme) : {payout}", aiBOrdersTitle:"Vos commandes par statut :", aiBNoRatings:"Vous n'avez pas encore reçu d'évaluations.", aiBRating:"Note moyenne : {avg}/5 sur {n} commandes évaluées.", aiBProducts:"Produits actifs : {act} sur {tot}.", aiBLow:"Stock faible (<50) : {list}", aiBStockOk:"Stock ok.", aiDChipOrders:"Mes commandes", aiDChipTrack:"Où est ma commande", aiDChipWish:"Ma liste de souhaits", aiDChipCatalog:"Catalogue disponible", aiDSpent:"Total dépensé : {spent}", aiDNoShip:"Aucune commande encore expédiée.", aiDTrack:"Dernière commande expédiée : {num}\nStatut : {status}\nTransporteur : {courier}\nSuivi : {track}", aiDTrackLink:"Lien : {url}", aiDWish:"Vous avez {n} produits dans votre liste de souhaits.", aiDCatalog:"Vous avez accès à {n} produits actifs des marques approuvées." });
Object.assign(T.es, { aiIntro:"¡Hola! Soy Nexus AI. Respondo sobre tus datos reales: toca una pregunta abajo o escríbeme.", aiSub:"Asistente sobre tus datos reales · respuestas instantáneas", aiSearching:"Nexus AI está buscando…", aiPlaceholder:"Escribe una pregunta…", aiSend:"Enviar", aiFooter:"Nexus AI solo responde sobre los datos a los que tienes acceso. El lenguaje libre llegará pronto (mejora de IA).", aiNoUnderstand:"No estoy seguro de haber entendido. Prueba una de estas:", aiError:"Vaya, no pude recuperar el dato. Inténtalo de nuevo.", aiNoOrders:"sin pedidos", aiStDraft:"borrador", aiStPending:"pendiente", aiStConfirmed:"confirmado", aiStShipped:"enviado", aiStDelivered:"entregado", aiStCancelled:"cancelado", aiBChipSales:"Mis ventas", aiBChipOrders:"Pedidos por estado", aiBChipRating:"Valoración media", aiBChipProducts:"Mis productos", aiBSales:"Ventas totales (bruto): {gmv}\nPedidos: {n}\nPago estimado (neto de comisión de plataforma): {payout}", aiBOrdersTitle:"Tus pedidos por estado:", aiBNoRatings:"Aún no has recibido valoraciones.", aiBRating:"Valoración media: {avg}/5 en {n} pedidos valorados.", aiBProducts:"Productos activos: {act} de {tot}.", aiBLow:"Bajo stock (<50): {list}", aiBStockOk:"Stock ok.", aiDChipOrders:"Mis pedidos", aiDChipTrack:"Dónde está mi pedido", aiDChipWish:"Mi lista de deseos", aiDChipCatalog:"Catálogo disponible", aiDSpent:"Total gastado: {spent}", aiDNoShip:"Aún no hay pedidos enviados.", aiDTrack:"Último pedido enviado: {num}\nEstado: {status}\nTransportista: {courier}\nSeguimiento: {track}", aiDTrackLink:"Enlace: {url}", aiDWish:"Tienes {n} productos en tu lista de deseos.", aiDCatalog:"Tienes acceso a {n} productos activos de marcas aprobadas." });
Object.assign(T.de, { aiIntro:"Hallo! Ich bin Nexus AI. Ich antworte auf Basis Ihrer echten Daten: Tippen Sie unten auf eine Frage oder schreiben Sie mir.", aiSub:"Assistent für Ihre echten Daten · sofortige Antworten", aiSearching:"Nexus AI sucht…", aiPlaceholder:"Frage eingeben…", aiSend:"Senden", aiFooter:"Nexus AI antwortet nur auf Daten, auf die Sie Zugriff haben. Freie Spracheingabe folgt bald (KI-Upgrade).", aiNoUnderstand:"Ich bin nicht sicher, ob ich das verstanden habe. Versuchen Sie eine davon:", aiError:"Ups, ich konnte die Daten nicht abrufen. Versuchen Sie es erneut.", aiNoOrders:"keine Bestellungen", aiStDraft:"Entwurf", aiStPending:"ausstehend", aiStConfirmed:"bestätigt", aiStShipped:"versandt", aiStDelivered:"geliefert", aiStCancelled:"storniert", aiBChipSales:"Meine Verkäufe", aiBChipOrders:"Bestellungen nach Status", aiBChipRating:"Durchschnittsbewertung", aiBChipProducts:"Meine Produkte", aiBSales:"Gesamtverkäufe (brutto): {gmv}\nBestellungen: {n}\nGeschätzte Auszahlung (abzüglich Plattformgebühr): {payout}", aiBOrdersTitle:"Ihre Bestellungen nach Status:", aiBNoRatings:"Sie haben noch keine Bewertungen erhalten.", aiBRating:"Durchschnittsbewertung: {avg}/5 über {n} bewertete Bestellungen.", aiBProducts:"Aktive Produkte: {act} von {tot}.", aiBLow:"Geringer Bestand (<50): {list}", aiBStockOk:"Bestand ok.", aiDChipOrders:"Meine Bestellungen", aiDChipTrack:"Wo ist meine Bestellung", aiDChipWish:"Meine Wunschliste", aiDChipCatalog:"Verfügbarer Katalog", aiDSpent:"Gesamtausgaben: {spent}", aiDNoShip:"Noch keine Bestellung versandt.", aiDTrack:"Letzte versandte Bestellung: {num}\nStatus: {status}\nKurier: {courier}\nSendungsverfolgung: {track}", aiDTrackLink:"Link: {url}", aiDWish:"Sie haben {n} Produkte in Ihrer Wunschliste.", aiDCatalog:"Sie haben Zugriff auf {n} aktive Produkte von freigegebenen Marken." });
Object.assign(T.zh, { aiIntro:"你好！我是 Nexus AI。我基于您的真实数据回答：点按下方问题或直接输入。", aiSub:"基于您真实数据的助手 · 即时回答", aiSearching:"Nexus AI 正在查找…", aiPlaceholder:"输入问题…", aiSend:"发送", aiFooter:"Nexus AI 仅回答您有权访问的数据。自由语言输入即将推出（AI 升级）。", aiNoUnderstand:"我不确定是否理解。请尝试以下之一：", aiError:"哎呀，无法获取数据。请重试。", aiNoOrders:"无订单", aiStDraft:"草稿", aiStPending:"待处理", aiStConfirmed:"已确认", aiStShipped:"已发货", aiStDelivered:"已送达", aiStCancelled:"已取消", aiBChipSales:"我的销售", aiBChipOrders:"按状态查看订单", aiBChipRating:"平均评分", aiBChipProducts:"我的产品", aiBSales:"总销售额(毛额)：{gmv}\n订单：{n}\n预计支付(扣除平台费用后)：{payout}", aiBOrdersTitle:"您的订单按状态：", aiBNoRatings:"您尚未收到评分。", aiBRating:"平均评分：{avg}/5，共 {n} 个已评订单。", aiBProducts:"活跃产品：{act} / {tot}。", aiBLow:"低库存(<50)：{list}", aiBStockOk:"库存正常。", aiDChipOrders:"我的订单", aiDChipTrack:"我的订单在哪", aiDChipWish:"我的心愿单", aiDChipCatalog:"可用目录", aiDSpent:"总支出：{spent}", aiDNoShip:"尚无已发货订单。", aiDTrack:"最近发货订单：{num}\n状态：{status}\n快递：{courier}\n物流单号：{track}", aiDTrackLink:"链接：{url}", aiDWish:"您的心愿单中有 {n} 个产品。", aiDCatalog:"您可访问 {n} 个来自已批准品牌的活跃产品。" });
Object.assign(T.ar, { aiIntro:"مرحبًا! أنا Nexus AI. أجيب استنادًا إلى بياناتك الحقيقية: انقر سؤالًا بالأسفل أو اكتب لي.", aiSub:"مساعد قائم على بياناتك الحقيقية · إجابات فورية", aiSearching:"يبحث Nexus AI…", aiPlaceholder:"اكتب سؤالًا…", aiSend:"إرسال", aiFooter:"يجيب Nexus AI فقط على البيانات التي تملك صلاحية الوصول إليها. ستتوفر قريبًا اللغة الحرة (ترقية الذكاء الاصطناعي).", aiNoUnderstand:"لست متأكدًا أنني فهمت. جرّب إحدى هذه:", aiError:"عذرًا، تعذّر عليّ جلب البيانات. حاول مرة أخرى.", aiNoOrders:"لا توجد طلبات", aiStDraft:"مسودة", aiStPending:"قيد الانتظار", aiStConfirmed:"مؤكَّد", aiStShipped:"تم الشحن", aiStDelivered:"تم التسليم", aiStCancelled:"ملغى", aiBChipSales:"مبيعاتي", aiBChipOrders:"الطلبات حسب الحالة", aiBChipRating:"متوسط التقييم", aiBChipProducts:"منتجاتي", aiBSales:"إجمالي المبيعات (الإجمالي): {gmv}\nالطلبات: {n}\nالدفعة المقدّرة (بعد خصم رسوم المنصة): {payout}", aiBOrdersTitle:"طلباتك حسب الحالة:", aiBNoRatings:"لم تتلقَّ أي تقييمات بعد.", aiBRating:"متوسط التقييم: {avg}/5 على {n} طلبات مُقيَّمة.", aiBProducts:"المنتجات النشطة: {act} من {tot}.", aiBLow:"مخزون منخفض (<50): {list}", aiBStockOk:"المخزون جيد.", aiDChipOrders:"طلباتي", aiDChipTrack:"أين طلبي", aiDChipWish:"قائمة رغباتي", aiDChipCatalog:"الكتالوج المتاح", aiDSpent:"إجمالي الإنفاق: {spent}", aiDNoShip:"لم يتم شحن أي طلب بعد.", aiDTrack:"آخر طلب تم شحنه: {num}\nالحالة: {status}\nشركة الشحن: {courier}\nرقم التتبّع: {track}", aiDTrackLink:"الرابط: {url}", aiDWish:"لديك {n} منتجات في قائمة الرغبات.", aiDCatalog:"لديك صلاحية الوصول إلى {n} منتجات نشطة من العلامات المعتمدة." });
Object.assign(T.en, { invFallback:"Invoice", invComm:"Commission invoice", invSale:"Sales invoice", invFrom:"From", invTo:"To", invDate:"Date", invSubtotal:"Taxable amount", invVat:"VAT", invTotal:"Total", invDownloadPdf:"Download uploaded PDF", invPrint:"Print / Save PDF", invDraftNote:"Document generated by NexusHub — draft, to be validated with your accountant.", invVatNo:"VAT no.", conTitle:"Distribution Agreement", conAcceptedBy:"Accepted by", conConsent:"I have read and accept this distribution agreement on behalf of {company}.", conSignph:"Full name of signatory", conAcceptSign:"Accept & Sign", conWaiting:"Awaiting acceptance by the distributor." });
Object.assign(T.it, { invFallback:"Fattura", invComm:"Fattura commissione", invSale:"Fattura di vendita", invFrom:"Da", invTo:"A", invDate:"Data", invSubtotal:"Imponibile", invVat:"IVA", invTotal:"Totale", invDownloadPdf:"Scarica PDF caricato", invPrint:"Stampa / Salva PDF", invDraftNote:"Documento generato da NexusHub — bozza, da validare con il commercialista.", invVatNo:"P.IVA", conTitle:"Contratto di distribuzione", conAcceptedBy:"Accettato da", conConsent:"Ho letto e accetto questo contratto di distribuzione per conto di {company}.", conSignph:"Nome e cognome del firmatario", conAcceptSign:"Accetta e firma", conWaiting:"In attesa di accettazione da parte del distributore." });
Object.assign(T.fr, { invFallback:"Facture", invComm:"Facture de commission", invSale:"Facture de vente", invFrom:"De", invTo:"À", invDate:"Date", invSubtotal:"Montant HT", invVat:"TVA", invTotal:"Total", invDownloadPdf:"Télécharger le PDF", invPrint:"Imprimer / Enregistrer PDF", invDraftNote:"Document généré par NexusHub — brouillon, à valider avec votre comptable.", invVatNo:"N° TVA", conTitle:"Contrat de distribution", conAcceptedBy:"Accepté par", conConsent:"J'ai lu et j'accepte ce contrat de distribution au nom de {company}.", conSignph:"Nom complet du signataire", conAcceptSign:"Accepter et signer", conWaiting:"En attente d'acceptation par le distributeur." });
Object.assign(T.es, { invFallback:"Factura", invComm:"Factura de comisión", invSale:"Factura de venta", invFrom:"De", invTo:"A", invDate:"Fecha", invSubtotal:"Base imponible", invVat:"IVA", invTotal:"Total", invDownloadPdf:"Descargar PDF", invPrint:"Imprimir / Guardar PDF", invDraftNote:"Documento generado por NexusHub — borrador, a validar con tu asesor fiscal.", invVatNo:"NIF/CIF", conTitle:"Contrato de distribución", conAcceptedBy:"Aceptado por", conConsent:"He leído y acepto este contrato de distribución en nombre de {company}.", conSignph:"Nombre completo del firmante", conAcceptSign:"Aceptar y firmar", conWaiting:"A la espera de aceptación por parte del distribuidor." });
Object.assign(T.de, { invFallback:"Rechnung", invComm:"Provisionsrechnung", invSale:"Verkaufsrechnung", invFrom:"Von", invTo:"An", invDate:"Datum", invSubtotal:"Nettobetrag", invVat:"MwSt.", invTotal:"Gesamt", invDownloadPdf:"PDF herunterladen", invPrint:"Drucken / PDF speichern", invDraftNote:"Von NexusHub erstelltes Dokument — Entwurf, mit Ihrem Steuerberater zu prüfen.", invVatNo:"USt-IdNr.", conTitle:"Vertriebsvertrag", conAcceptedBy:"Angenommen von", conConsent:"Ich habe diesen Vertriebsvertrag gelesen und akzeptiere ihn im Namen von {company}.", conSignph:"Vollständiger Name des Unterzeichners", conAcceptSign:"Annehmen & unterzeichnen", conWaiting:"Warten auf Annahme durch den Händler." });
Object.assign(T.zh, { invFallback:"发票", invComm:"佣金发票", invSale:"销售发票", invFrom:"来自", invTo:"至", invDate:"日期", invSubtotal:"应税金额", invVat:"增值税", invTotal:"合计", invDownloadPdf:"下载已上传 PDF", invPrint:"打印 / 保存 PDF", invDraftNote:"由 NexusHub 生成的文件 — 草稿，需与会计师核实。", invVatNo:"税号", conTitle:"分销协议", conAcceptedBy:"接受人", conConsent:"我已阅读并代表 {company} 接受本分销协议。", conSignph:"签署人全名", conAcceptSign:"接受并签署", conWaiting:"等待分销商接受。" });
Object.assign(T.ar, { invFallback:"فاتورة", invComm:"فاتورة عمولة", invSale:"فاتورة بيع", invFrom:"من", invTo:"إلى", invDate:"التاريخ", invSubtotal:"المبلغ الخاضع للضريبة", invVat:"ضريبة القيمة المضافة", invTotal:"الإجمالي", invDownloadPdf:"تنزيل ملف PDF", invPrint:"طباعة / حفظ PDF", invDraftNote:"مستند صادر عن NexusHub — مسودة، يجب التحقق منها مع محاسبك.", invVatNo:"الرقم الضريبي", conTitle:"اتفاقية التوزيع", conAcceptedBy:"قُبِل بواسطة", conConsent:"لقد قرأت وأوافق على اتفاقية التوزيع هذه نيابةً عن {company}.", conSignph:"الاسم الكامل للموقّع", conAcceptSign:"قبول وتوقيع", conWaiting:"في انتظار قبول الموزّع." });
Object.assign(T.en, { lgReset:"Reset password", lgResetSub:"We'll send you a link by email", lgSent:"Email sent!", lgSentPre:"Check your email", lgSentPost:"and click the link to reset your password.", lgBackLogin:"← Back to login", lgResetPh:"Your registered email", lgSending:"Sending...", lgSendReset:"Send reset link", lgForgot:"Forgot your password?", lgNew:"new?", watchDemo:"Watch Platform Demo", rgContinue:"Continue →", rgVatPh:"e.g. IT12345678901 / DE123456789", rgSdi:"SDI Code", rgSdiPh:"e.g. ABCDEFG (7 characters)", rgPec:"PEC (optional)", rgPecPh:"e.g. company@pec.it", rgBack:"← Back" });
Object.assign(T.it, { lgReset:"Reset Password", lgResetSub:"Ti invieremo un link via email", lgSent:"Email inviata!", lgSentPre:"Controlla la tua email", lgSentPost:"e clicca sul link per reimpostare la password.", lgBackLogin:"← Torna al login", lgResetPh:"La tua email registrata", lgSending:"Invio in corso...", lgSendReset:"Invia link di reset", lgForgot:"Hai dimenticato la password?", lgNew:"new?", watchDemo:"Guarda la demo della piattaforma", rgContinue:"Continua →", rgVatPh:"es. IT12345678901 / DE123456789", rgSdi:"Codice SDI", rgSdiPh:"es. ABCDEFG (7 caratteri)", rgPec:"PEC (opzionale)", rgPecPh:"es. azienda@pec.it", rgBack:"← Indietro" });
Object.assign(T.fr, { lgReset:"Réinitialiser le mot de passe", lgResetSub:"Nous vous enverrons un lien par e-mail", lgSent:"E-mail envoyé !", lgSentPre:"Vérifiez votre e-mail", lgSentPost:"et cliquez sur le lien pour réinitialiser votre mot de passe.", lgBackLogin:"← Retour à la connexion", lgResetPh:"Votre e-mail enregistré", lgSending:"Envoi...", lgSendReset:"Envoyer le lien", lgForgot:"Mot de passe oublié ?", lgNew:"nouveau ?", watchDemo:"Voir la démo de la plateforme", rgContinue:"Continuer →", rgVatPh:"ex. IT12345678901 / DE123456789", rgSdi:"Code SDI", rgSdiPh:"ex. ABCDEFG (7 caractères)", rgPec:"PEC (facultatif)", rgPecPh:"ex. societe@pec.it", rgBack:"← Retour" });
Object.assign(T.es, { lgReset:"Restablecer contraseña", lgResetSub:"Te enviaremos un enlace por correo", lgSent:"¡Correo enviado!", lgSentPre:"Revisa tu correo", lgSentPost:"y haz clic en el enlace para restablecer tu contraseña.", lgBackLogin:"← Volver al inicio de sesión", lgResetPh:"Tu correo registrado", lgSending:"Enviando...", lgSendReset:"Enviar enlace", lgForgot:"¿Olvidaste tu contraseña?", lgNew:"¿nuevo?", watchDemo:"Ver demo de la plataforma", rgContinue:"Continuar →", rgVatPh:"ej. IT12345678901 / DE123456789", rgSdi:"Código SDI", rgSdiPh:"ej. ABCDEFG (7 caracteres)", rgPec:"PEC (opcional)", rgPecPh:"ej. empresa@pec.it", rgBack:"← Volver" });
Object.assign(T.de, { lgReset:"Passwort zurücksetzen", lgResetSub:"Wir senden Ihnen einen Link per E-Mail", lgSent:"E-Mail gesendet!", lgSentPre:"Prüfen Sie Ihre E-Mail", lgSentPost:"und klicken Sie auf den Link, um Ihr Passwort zurückzusetzen.", lgBackLogin:"← Zurück zur Anmeldung", lgResetPh:"Ihre registrierte E-Mail", lgSending:"Senden...", lgSendReset:"Link senden", lgForgot:"Passwort vergessen?", lgNew:"neu?", watchDemo:"Plattform-Demo ansehen", rgContinue:"Weiter →", rgVatPh:"z. B. IT12345678901 / DE123456789", rgSdi:"SDI-Code", rgSdiPh:"z. B. ABCDEFG (7 Zeichen)", rgPec:"PEC (optional)", rgPecPh:"z. B. firma@pec.it", rgBack:"← Zurück" });
Object.assign(T.zh, { lgReset:"重置密码", lgResetSub:"我们将通过邮件向您发送链接", lgSent:"邮件已发送！", lgSentPre:"请查收您的邮箱", lgSentPost:"并点击链接重置密码。", lgBackLogin:"← 返回登录", lgResetPh:"您注册的邮箱", lgSending:"发送中...", lgSendReset:"发送重置链接", lgForgot:"忘记密码？", lgNew:"新用户？", watchDemo:"观看平台演示", rgContinue:"继续 →", rgVatPh:"例如 IT12345678901 / DE123456789", rgSdi:"SDI 代码", rgSdiPh:"例如 ABCDEFG（7 个字符）", rgPec:"PEC（可选）", rgPecPh:"例如 company@pec.it", rgBack:"← 返回" });
Object.assign(T.ar, { lgReset:"إعادة تعيين كلمة المرور", lgResetSub:"سنرسل لك رابطًا عبر البريد الإلكتروني", lgSent:"تم إرسال البريد!", lgSentPre:"تحقق من بريدك الإلكتروني", lgSentPost:"وانقر على الرابط لإعادة تعيين كلمة المرور.", lgBackLogin:"← العودة إلى تسجيل الدخول", lgResetPh:"بريدك المسجَّل", lgSending:"جارٍ الإرسال...", lgSendReset:"إرسال رابط إعادة التعيين", lgForgot:"هل نسيت كلمة المرور؟", lgNew:"جديد؟", watchDemo:"مشاهدة عرض المنصة", rgContinue:"متابعة →", rgVatPh:"مثال IT12345678901 / DE123456789", rgSdi:"رمز SDI", rgSdiPh:"مثال ABCDEFG (7 أحرف)", rgPec:"PEC (اختياري)", rgPecPh:"مثال company@pec.it", rgBack:"← رجوع" });
Object.assign(T.en, { rgFiscalHint:"VAT Number required for everyone · SDI Code and PEC only for Italian companies" });
Object.assign(T.it, { rgFiscalHint:"VAT Number obbligatorio per tutti · Codice SDI e PEC solo per aziende italiane" });
Object.assign(T.fr, { rgFiscalHint:"Numéro de TVA obligatoire pour tous · Code SDI et PEC uniquement pour les entreprises italiennes" });
Object.assign(T.es, { rgFiscalHint:"Número de IVA obligatorio para todos · Código SDI y PEC solo para empresas italianas" });
Object.assign(T.de, { rgFiscalHint:"USt-IdNr. für alle erforderlich · SDI-Code und PEC nur für italienische Unternehmen" });
Object.assign(T.zh, { rgFiscalHint:"所有人均需增值税号 · SDI 代码和 PEC 仅适用于意大利公司" });
Object.assign(T.ar, { rgFiscalHint:"رقم ضريبة القيمة المضافة مطلوب من الجميع · رمز SDI وPEC للشركات الإيطالية فقط" });
Object.assign(T.en, { bNoReq:"No requests at the moment", bNoReqMsg:"When a distributor requests access to your products, it will appear here for approval or blocking.", bApproveExcl:"Approve exclusively", bApproveShared:"Approve (shared)", bBlock:"Block", bBlockAccess:"Block access", bUnblock:"Unblock", bDistSub:"Your authorized distributors · orders and revenue in real time", bNoDist:"No active distributors", bNoDistMsg:"When you approve a request in the Applications tab, the distributor will appear here with their real orders and revenue.", bSave:"Save", bpPricePre:"Base price:", bpPricePost:". Set a different price for the markets you want (e.g. Germany higher). The distributor will automatically see the price for their country.", bChooseCountry:"- Choose -", bPriceEur:"Price €", bNoPriceList:"No per-country price list. The base price applies everywhere.", bDelete:"Delete", bDocsMsg:"Data sheets, certificates, ingredients. Distributors can download them from the catalog.", bNoDocs:"No documents yet.", bOpen:"Open", bDesc:"Description", bProdImg:"Product Image", bOrExtUrl:"or external URL:", bNewProduct:"+ New Product", bCsvCols:"CSV columns: name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"No products in the catalog", bNoProductsMsg:"Add your first product with + New Product, or import an Excel/CSV file.", bEdit:"Edit", bDoc:"Doc", bPrices:"Prices", bNoOrders:"No orders yet.", bInvoices:"Invoices", bInvoicesMsg:"Sales invoices to distributors and NexusHub commission invoices. You can also upload your official invoice as PDF.", bAiTitle:"AI Brand Analytics", bAiSub:"Distributor performance, top products, seasonality and growth opportunities" });
Object.assign(T.it, { bNoReq:"Nessuna richiesta al momento", bNoReqMsg:"Quando un distributore richiederà l'accesso ai tuoi prodotti, comparirà qui per l'approvazione o il blocco.", bApproveExcl:"Approva in esclusiva", bApproveShared:"Approva (condiviso)", bBlock:"Blocca", bBlockAccess:"Blocca accesso", bUnblock:"Sblocca", bDistSub:"I tuoi distributori autorizzati · ordini e fatturato in tempo reale", bNoDist:"Nessun distributore attivo", bNoDistMsg:"Quando approvi una richiesta nella tab Candidature, il distributore comparirà qui con i suoi ordini e il fatturato reali.", bSave:"Salva", bpPricePre:"Prezzo base:", bpPricePost:". Imposta un prezzo diverso per i mercati che vuoi (es. Germania più alto). Il distributore vedrà automaticamente il prezzo del suo paese.", bChooseCountry:"- Scegli -", bPriceEur:"Prezzo €", bNoPriceList:"Nessun listino per paese. Vale il prezzo base ovunque.", bDelete:"Elimina", bDocsMsg:"Schede tecniche, certificati, ingredienti. I distributori potranno scaricarli dal catalogo.", bNoDocs:"Nessun documento ancora.", bOpen:"Apri", bDesc:"Descrizione", bProdImg:"Immagine Prodotto", bOrExtUrl:"oppure URL esterno:", bNewProduct:"+ Nuovo Prodotto", bCsvCols:"Colonne CSV: name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"Nessun prodotto nel catalogo", bNoProductsMsg:"Aggiungi il tuo primo prodotto con + Nuovo Prodotto, oppure importa un file Excel/CSV.", bEdit:"Modifica", bDoc:"Doc", bPrices:"Prezzi", bNoOrders:"Nessun ordine ancora.", bInvoices:"Fatture", bInvoicesMsg:"Fatture di vendita ai distributori e fatture di commissione NexusHub. Puoi anche caricare la tua fattura ufficiale in PDF.", bAiTitle:"AI Brand Analytics", bAiSub:"Performance distributori, top prodotti, stagionalità e opportunità di crescita" });
Object.assign(T.fr, { bNoReq:"Aucune demande pour le moment", bNoReqMsg:"Lorsqu'un distributeur demande l'accès à vos produits, cela apparaît ici pour approbation ou blocage.", bApproveExcl:"Approuver en exclusivité", bApproveShared:"Approuver (partagé)", bBlock:"Bloquer", bBlockAccess:"Bloquer l'accès", bUnblock:"Débloquer", bDistSub:"Vos distributeurs autorisés · commandes et chiffre d'affaires en temps réel", bNoDist:"Aucun distributeur actif", bNoDistMsg:"Lorsque vous approuvez une demande dans l'onglet Candidatures, le distributeur apparaît ici avec ses commandes et son chiffre d'affaires réels.", bSave:"Enregistrer", bpPricePre:"Prix de base :", bpPricePost:". Définissez un prix différent pour les marchés souhaités (ex. Allemagne plus élevé). Le distributeur verra automatiquement le prix de son pays.", bChooseCountry:"- Choisir -", bPriceEur:"Prix €", bNoPriceList:"Aucune liste de prix par pays. Le prix de base s'applique partout.", bDelete:"Supprimer", bDocsMsg:"Fiches techniques, certificats, ingrédients. Les distributeurs peuvent les télécharger depuis le catalogue.", bNoDocs:"Aucun document pour le moment.", bOpen:"Ouvrir", bDesc:"Description", bProdImg:"Image du produit", bOrExtUrl:"ou URL externe :", bNewProduct:"+ Nouveau produit", bCsvCols:"Colonnes CSV : name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"Aucun produit dans le catalogue", bNoProductsMsg:"Ajoutez votre premier produit avec + Nouveau produit, ou importez un fichier Excel/CSV.", bEdit:"Modifier", bDoc:"Doc", bPrices:"Prix", bNoOrders:"Aucune commande pour le moment.", bInvoices:"Factures", bInvoicesMsg:"Factures de vente aux distributeurs et factures de commission NexusHub. Vous pouvez aussi téléverser votre facture officielle en PDF.", bAiTitle:"AI Brand Analytics", bAiSub:"Performance des distributeurs, meilleurs produits, saisonnalité et opportunités de croissance" });
Object.assign(T.es, { bNoReq:"No hay solicitudes por el momento", bNoReqMsg:"Cuando un distribuidor solicite acceso a tus productos, aparecerá aquí para aprobación o bloqueo.", bApproveExcl:"Aprobar en exclusiva", bApproveShared:"Aprobar (compartido)", bBlock:"Bloquear", bBlockAccess:"Bloquear acceso", bUnblock:"Desbloquear", bDistSub:"Tus distribuidores autorizados · pedidos e ingresos en tiempo real", bNoDist:"No hay distribuidores activos", bNoDistMsg:"Cuando apruebas una solicitud en la pestaña Solicitudes, el distribuidor aparece aquí con sus pedidos e ingresos reales.", bSave:"Guardar", bpPricePre:"Precio base:", bpPricePost:". Establece un precio diferente para los mercados que quieras (p. ej. Alemania más alto). El distribuidor verá automáticamente el precio de su país.", bChooseCountry:"- Elegir -", bPriceEur:"Precio €", bNoPriceList:"No hay lista de precios por país. El precio base se aplica en todas partes.", bDelete:"Eliminar", bDocsMsg:"Fichas técnicas, certificados, ingredientes. Los distribuidores pueden descargarlos del catálogo.", bNoDocs:"Aún no hay documentos.", bOpen:"Abrir", bDesc:"Descripción", bProdImg:"Imagen del producto", bOrExtUrl:"o URL externa:", bNewProduct:"+ Nuevo producto", bCsvCols:"Columnas CSV: name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"No hay productos en el catálogo", bNoProductsMsg:"Añade tu primer producto con + Nuevo producto, o importa un archivo Excel/CSV.", bEdit:"Editar", bDoc:"Doc", bPrices:"Precios", bNoOrders:"Aún no hay pedidos.", bInvoices:"Facturas", bInvoicesMsg:"Facturas de venta a distribuidores y facturas de comisión NexusHub. También puedes subir tu factura oficial en PDF.", bAiTitle:"AI Brand Analytics", bAiSub:"Rendimiento de distribuidores, productos top, estacionalidad y oportunidades de crecimiento" });
Object.assign(T.de, { bNoReq:"Derzeit keine Anfragen", bNoReqMsg:"Wenn ein Händler Zugang zu Ihren Produkten anfragt, erscheint dies hier zur Genehmigung oder Sperrung.", bApproveExcl:"Exklusiv genehmigen", bApproveShared:"Genehmigen (geteilt)", bBlock:"Sperren", bBlockAccess:"Zugang sperren", bUnblock:"Entsperren", bDistSub:"Ihre autorisierten Händler · Bestellungen und Umsatz in Echtzeit", bNoDist:"Keine aktiven Händler", bNoDistMsg:"Wenn Sie eine Anfrage im Tab Bewerbungen genehmigen, erscheint der Händler hier mit seinen echten Bestellungen und Umsätzen.", bSave:"Speichern", bpPricePre:"Basispreis:", bpPricePost:". Legen Sie für gewünschte Märkte einen anderen Preis fest (z. B. Deutschland höher). Der Händler sieht automatisch den Preis für sein Land.", bChooseCountry:"- Wählen -", bPriceEur:"Preis €", bNoPriceList:"Keine länderspezifische Preisliste. Der Basispreis gilt überall.", bDelete:"Löschen", bDocsMsg:"Datenblätter, Zertifikate, Inhaltsstoffe. Händler können sie aus dem Katalog herunterladen.", bNoDocs:"Noch keine Dokumente.", bOpen:"Öffnen", bDesc:"Beschreibung", bProdImg:"Produktbild", bOrExtUrl:"oder externe URL:", bNewProduct:"+ Neues Produkt", bCsvCols:"CSV-Spalten: name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"Keine Produkte im Katalog", bNoProductsMsg:"Fügen Sie Ihr erstes Produkt mit + Neues Produkt hinzu oder importieren Sie eine Excel/CSV-Datei.", bEdit:"Bearbeiten", bDoc:"Doc", bPrices:"Preise", bNoOrders:"Noch keine Bestellungen.", bInvoices:"Rechnungen", bInvoicesMsg:"Verkaufsrechnungen an Händler und NexusHub-Provisionsrechnungen. Sie können auch Ihre offizielle Rechnung als PDF hochladen.", bAiTitle:"AI Brand Analytics", bAiSub:"Händler-Performance, Top-Produkte, Saisonalität und Wachstumschancen" });
Object.assign(T.zh, { bNoReq:"目前没有请求", bNoReqMsg:"当分销商请求访问您的产品时，将在此显示以供批准或屏蔽。", bApproveExcl:"独家批准", bApproveShared:"批准（共享）", bBlock:"屏蔽", bBlockAccess:"屏蔽访问", bUnblock:"取消屏蔽", bDistSub:"您的授权分销商 · 实时订单与营收", bNoDist:"暂无活跃分销商", bNoDistMsg:"当您在「申请」标签中批准请求后，分销商将连同其真实订单和营收显示在此处。", bSave:"保存", bpPricePre:"基础价格：", bpPricePost:"。为您想要的市场设置不同价格（例如德国更高）。分销商将自动看到其所在国家/地区的价格。", bChooseCountry:"- 选择 -", bPriceEur:"价格 €", bNoPriceList:"没有按国家/地区的价目表。基础价格适用于所有地区。", bDelete:"删除", bDocsMsg:"技术规格、证书、成分。分销商可从目录下载。", bNoDocs:"暂无文件。", bOpen:"打开", bDesc:"描述", bProdImg:"产品图片", bOrExtUrl:"或外部 URL：", bNewProduct:"+ 新产品", bCsvCols:"CSV 列：name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"目录中暂无产品", bNoProductsMsg:"使用 + 新产品 添加您的第一个产品，或导入 Excel/CSV 文件。", bEdit:"编辑", bDoc:"文件", bPrices:"价格", bNoOrders:"暂无订单。", bInvoices:"发票", bInvoicesMsg:"向分销商开具的销售发票和 NexusHub 佣金发票。您也可以上传 PDF 格式的正式发票。", bAiTitle:"AI 品牌分析", bAiSub:"分销商业绩、热销产品、季节性与增长机会" });
Object.assign(T.ar, { bNoReq:"لا توجد طلبات حاليًا", bNoReqMsg:"عندما يطلب موزّع الوصول إلى منتجاتك، سيظهر هنا للموافقة أو الحظر.", bApproveExcl:"موافقة حصرية", bApproveShared:"موافقة (مشتركة)", bBlock:"حظر", bBlockAccess:"حظر الوصول", bUnblock:"إلغاء الحظر", bDistSub:"موزّعوك المعتمدون · الطلبات والإيرادات في الوقت الفعلي", bNoDist:"لا يوجد موزّعون نشطون", bNoDistMsg:"عند الموافقة على طلب في تبويب الطلبات، يظهر الموزّع هنا مع طلباته وإيراداته الحقيقية.", bSave:"حفظ", bpPricePre:"السعر الأساسي:", bpPricePost:". حدّد سعرًا مختلفًا للأسواق التي تريدها (مثل ألمانيا أعلى). سيرى الموزّع تلقائيًا سعر بلده.", bChooseCountry:"- اختر -", bPriceEur:"السعر €", bNoPriceList:"لا توجد قائمة أسعار حسب البلد. يُطبَّق السعر الأساسي في كل مكان.", bDelete:"حذف", bDocsMsg:"أوراق البيانات والشهادات والمكونات. يمكن للموزّعين تنزيلها من الكتالوج.", bNoDocs:"لا توجد مستندات بعد.", bOpen:"فتح", bDesc:"الوصف", bProdImg:"صورة المنتج", bOrExtUrl:"أو رابط خارجي:", bNewProduct:"+ منتج جديد", bCsvCols:"أعمدة CSV: name, sku, category, price, order_multiple, min_order_qty, description, image_url", bNoProducts:"لا توجد منتجات في الكتالوج", bNoProductsMsg:"أضف أول منتج لك عبر + منتج جديد، أو استورد ملف Excel/CSV.", bEdit:"تعديل", bDoc:"مستند", bPrices:"الأسعار", bNoOrders:"لا توجد طلبات بعد.", bInvoices:"الفواتير", bInvoicesMsg:"فواتير البيع للموزّعين وفواتير عمولة NexusHub. يمكنك أيضًا رفع فاتورتك الرسمية بصيغة PDF.", bAiTitle:"تحليلات العلامة بالذكاء الاصطناعي", bAiSub:"أداء الموزّعين، أفضل المنتجات، الموسمية وفرص النمو" });
Object.assign(T.en, { ckBlocked:"Access blocked by the brand", ckDocsTab:"Documents / sheets", ckInvoicesTab:"My invoices", ckTotalOrders:"Total Orders", ckTotalSpent:"Total Spent", ckPending:"Pending", ckDelivered:"Delivered", ckAllTime:"All time", ckAllOrders:"All orders", ckStShipped:"Shipped — delivery 48h", ckStDelivered:"Delivered", ckStWaiting:"Awaiting confirmation", ckStConfirmed:"Confirmed — preparing at the Turin hub", ckDisputePh:"Describe what happened...", ckConfirmOrder:"Confirm Order", ckTotal:"Total", ckChoosePayment:"Choose Payment Method", ckSepaName:"SEPA Bank Transfer", ckFree12:"Free · 1-2 business days", ckUnits:"units", ckPaySepaTo:"Make the transfer directly to the brand:", ckAccountHolder:"Account holder", ckBank:"Bank", ckCausale:"Reference:", ckReserveInfo:"Stock reserved instantly · Automatic invoice via email · Delivery:", ck48Torino:"48h from Turin", ckCardName:"Credit / Debit Card", ckInstant:"Instant · Powered by Stripe", ckSddDesc:"Automatic debit · Free", ckNoteOpt:"Note (optional)", ckNotePh:"Special delivery instructions...", ckOrderSent:"Order Sent!", ckOrderSentPre:"Your order has been ", ckOrderSentStrong:"confirmed automatically", ckOrderSentPost:". Your stock has been reserved for you. You'll receive an email with the order details and the bank details for payment via SEPA transfer.", ckDeliveryEst:"Estimated delivery: 48h from the Turin hub" });
Object.assign(T.it, { ckBlocked:"Accesso bloccato dal brand", ckDocsTab:"Documenti / schede", ckInvoicesTab:"Le mie fatture", ckTotalOrders:"Ordini totali", ckTotalSpent:"Totale speso", ckPending:"In attesa", ckDelivered:"Consegnati", ckAllTime:"Da sempre", ckAllOrders:"Tutti gli ordini", ckStShipped:"Spedito — consegna 48h", ckStDelivered:"Consegnato", ckStWaiting:"In attesa di conferma", ckStConfirmed:"Confermato — in preparazione all'hub di Torino", ckDisputePh:"Descrivi cosa e successo...", ckConfirmOrder:"Conferma Ordine", ckTotal:"Totale", ckChoosePayment:"Scegli Metodo di Pagamento", ckSepaName:"Bonifico SEPA", ckFree12:"Gratuito · 1-2 giorni lavorativi", ckUnits:"unità", ckPaySepaTo:"Effettua il bonifico direttamente al brand:", ckAccountHolder:"Intestatario", ckBank:"Banca", ckCausale:"Causale:", ckReserveInfo:"Stock riservato subito · Fattura automatica via email · Consegna:", ck48Torino:"48h da Torino", ckCardName:"Carta di Credito / Debito", ckInstant:"Istantaneo · Powered by Stripe", ckSddDesc:"Addebito automatico · Gratuito", ckNoteOpt:"Note (opzionale)", ckNotePh:"Istruzioni speciali per la consegna...", ckOrderSent:"Ordine Inviato!", ckOrderSentPre:"Il tuo ordine è stato ", ckOrderSentStrong:"confermato automaticamente", ckOrderSentPost:". Lo stock è stato riservato per te. Riceverai una email con i dettagli dell'ordine e le coordinate bancarie per il pagamento via bonifico SEPA.", ckDeliveryEst:"Consegna stimata: 48h dall'hub di Torino" });
Object.assign(T.fr, { ckBlocked:"Accès bloqué par la marque", ckDocsTab:"Documents / fiches", ckInvoicesTab:"Mes factures", ckTotalOrders:"Commandes totales", ckTotalSpent:"Total dépensé", ckPending:"En attente", ckDelivered:"Livrées", ckAllTime:"Depuis toujours", ckAllOrders:"Toutes les commandes", ckStShipped:"Expédié — livraison 48h", ckStDelivered:"Livré", ckStWaiting:"En attente de confirmation", ckStConfirmed:"Confirmé — en préparation au hub de Turin", ckDisputePh:"Décrivez ce qui s'est passé...", ckConfirmOrder:"Confirmer la commande", ckTotal:"Total", ckChoosePayment:"Choisissez le mode de paiement", ckSepaName:"Virement SEPA", ckFree12:"Gratuit · 1-2 jours ouvrés", ckUnits:"unités", ckPaySepaTo:"Effectuez le virement directement à la marque :", ckAccountHolder:"Titulaire", ckBank:"Banque", ckCausale:"Référence :", ckReserveInfo:"Stock réservé immédiatement · Facture automatique par e-mail · Livraison :", ck48Torino:"48h depuis Turin", ckCardName:"Carte de crédit / débit", ckInstant:"Instantané · Powered by Stripe", ckSddDesc:"Prélèvement automatique · Gratuit", ckNoteOpt:"Note (facultatif)", ckNotePh:"Instructions de livraison spéciales...", ckOrderSent:"Commande envoyée !", ckOrderSentPre:"Votre commande a été ", ckOrderSentStrong:"confirmée automatiquement", ckOrderSentPost:". Votre stock a été réservé pour vous. Vous recevrez un e-mail avec les détails de la commande et les coordonnées bancaires pour le paiement par virement SEPA.", ckDeliveryEst:"Livraison estimée : 48h depuis le hub de Turin" });
Object.assign(T.es, { ckBlocked:"Acceso bloqueado por la marca", ckDocsTab:"Documentos / fichas", ckInvoicesTab:"Mis facturas", ckTotalOrders:"Pedidos totales", ckTotalSpent:"Total gastado", ckPending:"Pendiente", ckDelivered:"Entregados", ckAllTime:"Histórico", ckAllOrders:"Todos los pedidos", ckStShipped:"Enviado — entrega 48h", ckStDelivered:"Entregado", ckStWaiting:"Esperando confirmación", ckStConfirmed:"Confirmado — en preparación en el hub de Turín", ckDisputePh:"Describe qué ha pasado...", ckConfirmOrder:"Confirmar pedido", ckTotal:"Total", ckChoosePayment:"Elige método de pago", ckSepaName:"Transferencia SEPA", ckFree12:"Gratis · 1-2 días hábiles", ckUnits:"unidades", ckPaySepaTo:"Realiza la transferencia directamente a la marca:", ckAccountHolder:"Titular", ckBank:"Banco", ckCausale:"Concepto:", ckReserveInfo:"Stock reservado al instante · Factura automática por correo · Entrega:", ck48Torino:"48h desde Turín", ckCardName:"Tarjeta de crédito / débito", ckInstant:"Instantáneo · Powered by Stripe", ckSddDesc:"Adeudo automático · Gratis", ckNoteOpt:"Nota (opcional)", ckNotePh:"Instrucciones especiales de entrega...", ckOrderSent:"¡Pedido enviado!", ckOrderSentPre:"Tu pedido ha sido ", ckOrderSentStrong:"confirmado automáticamente", ckOrderSentPost:". Tu stock ha sido reservado. Recibirás un correo con los detalles del pedido y los datos bancarios para el pago por transferencia SEPA.", ckDeliveryEst:"Entrega estimada: 48h desde el hub de Turín" });
Object.assign(T.de, { ckBlocked:"Zugang von der Marke gesperrt", ckDocsTab:"Dokumente / Datenblätter", ckInvoicesTab:"Meine Rechnungen", ckTotalOrders:"Bestellungen gesamt", ckTotalSpent:"Gesamtausgaben", ckPending:"Ausstehend", ckDelivered:"Geliefert", ckAllTime:"Gesamt", ckAllOrders:"Alle Bestellungen", ckStShipped:"Versandt — Lieferung 48h", ckStDelivered:"Geliefert", ckStWaiting:"Warten auf Bestätigung", ckStConfirmed:"Bestätigt — Vorbereitung im Turin-Hub", ckDisputePh:"Beschreiben Sie, was passiert ist...", ckConfirmOrder:"Bestellung bestätigen", ckTotal:"Gesamt", ckChoosePayment:"Zahlungsmethode wählen", ckSepaName:"SEPA-Überweisung", ckFree12:"Kostenlos · 1-2 Werktage", ckUnits:"Einheiten", ckPaySepaTo:"Überweisen Sie direkt an die Marke:", ckAccountHolder:"Kontoinhaber", ckBank:"Bank", ckCausale:"Verwendungszweck:", ckReserveInfo:"Bestand sofort reserviert · Automatische Rechnung per E-Mail · Lieferung:", ck48Torino:"48h ab Turin", ckCardName:"Kredit-/Debitkarte", ckInstant:"Sofort · Powered by Stripe", ckSddDesc:"Automatische Abbuchung · Kostenlos", ckNoteOpt:"Notiz (optional)", ckNotePh:"Besondere Lieferhinweise...", ckOrderSent:"Bestellung gesendet!", ckOrderSentPre:"Ihre Bestellung wurde ", ckOrderSentStrong:"automatisch bestätigt", ckOrderSentPost:". Ihr Bestand wurde für Sie reserviert. Sie erhalten eine E-Mail mit den Bestelldetails und den Bankdaten für die Zahlung per SEPA-Überweisung.", ckDeliveryEst:"Voraussichtliche Lieferung: 48h ab dem Turin-Hub" });
Object.assign(T.zh, { ckBlocked:"已被品牌屏蔽访问", ckDocsTab:"文件 / 规格", ckInvoicesTab:"我的发票", ckTotalOrders:"总订单数", ckTotalSpent:"总支出", ckPending:"待处理", ckDelivered:"已送达", ckAllTime:"全部时间", ckAllOrders:"所有订单", ckStShipped:"已发货 — 48小时送达", ckStDelivered:"已送达", ckStWaiting:"等待确认", ckStConfirmed:"已确认 — 正在都灵中心备货", ckDisputePh:"描述发生了什么...", ckConfirmOrder:"确认订单", ckTotal:"合计", ckChoosePayment:"选择支付方式", ckSepaName:"SEPA 银行转账", ckFree12:"免费 · 1-2 个工作日", ckUnits:"件", ckPaySepaTo:"直接向品牌转账：", ckAccountHolder:"账户持有人", ckBank:"银行", ckCausale:"汇款附言：", ckReserveInfo:"库存即时预留 · 邮件自动开票 · 交付：", ck48Torino:"都灵发货48小时", ckCardName:"信用卡 / 借记卡", ckInstant:"即时 · 由 Stripe 提供", ckSddDesc:"自动扣款 · 免费", ckNoteOpt:"备注（可选）", ckNotePh:"特殊配送说明...", ckOrderSent:"订单已提交！", ckOrderSentPre:"您的订单已", ckOrderSentStrong:"自动确认", ckOrderSentPost:"。库存已为您预留。您将收到一封包含订单详情和 SEPA 转账付款银行信息的邮件。", ckDeliveryEst:"预计交付：都灵中心发货48小时" });
Object.assign(T.ar, { ckBlocked:"الوصول محظور من قِبل العلامة", ckDocsTab:"المستندات / البطاقات", ckInvoicesTab:"فواتيري", ckTotalOrders:"إجمالي الطلبات", ckTotalSpent:"إجمالي الإنفاق", ckPending:"قيد الانتظار", ckDelivered:"تم التسليم", ckAllTime:"كل الأوقات", ckAllOrders:"كل الطلبات", ckStShipped:"تم الشحن — التسليم خلال 48 ساعة", ckStDelivered:"تم التسليم", ckStWaiting:"بانتظار التأكيد", ckStConfirmed:"تم التأكيد — قيد التجهيز في مركز تورينو", ckDisputePh:"صف ما حدث...", ckConfirmOrder:"تأكيد الطلب", ckTotal:"الإجمالي", ckChoosePayment:"اختر طريقة الدفع", ckSepaName:"تحويل بنكي SEPA", ckFree12:"مجاني · 1-2 يوم عمل", ckUnits:"وحدة", ckPaySepaTo:"قم بالتحويل مباشرةً إلى العلامة:", ckAccountHolder:"صاحب الحساب", ckBank:"البنك", ckCausale:"البيان:", ckReserveInfo:"المخزون محجوز فورًا · فاتورة تلقائية عبر البريد · التسليم:", ck48Torino:"48 ساعة من تورينو", ckCardName:"بطاقة ائتمان / خصم", ckInstant:"فوري · مدعوم من Stripe", ckSddDesc:"خصم تلقائي · مجاني", ckNoteOpt:"ملاحظة (اختياري)", ckNotePh:"تعليمات تسليم خاصة...", ckOrderSent:"تم إرسال الطلب!", ckOrderSentPre:"لقد تم ", ckOrderSentStrong:"تأكيد طلبك تلقائيًا", ckOrderSentPost:". تم حجز المخزون لك. ستتلقى بريدًا إلكترونيًا بتفاصيل الطلب والبيانات المصرفية للدفع عبر تحويل SEPA.", ckDeliveryEst:"التسليم المتوقع: 48 ساعة من مركز تورينو" });
Object.assign(T.en, { ifTitle:"AI Inventory Forecast", ifSub:"Forecast based on last 90 days of sales · real orders", ifLeadTime:"Lead time", ifDays:"days", ifReorderMsg:"products to reorder within 30 days", ifAllOk:"All under control — no imminent stockouts", ifNoProducts:"No products to analyze.", ifhProduct:"Product", ifhStock:"Stock", ifhSalesWk:"Sales/wk", ifhDaysLeft:"Days left", ifhStockout:"Stockout", ifhReorderBy:"Reorder by", ifhStatus:"Status", ifhReorder:"Reorder", baTitle:"Brand Intelligence", baSub:"Distributor, product and European market analysis", baBtnLoading:"🤖 Analyzing...", baBtnRefresh:"🔄 Refresh", baBtnGenerate:"✨ Generate Report", baReportTitle:"Brand Intelligence Report", baReportDesc:"Complete analysis of your distributors' performance, bestselling products, seasonality and growth opportunities in the European market.", baLoadingData:"Analyzing data...", baProcessing:"Processing distributor performance, product sales and European trends", baTopDist:"Top Distributors by Revenue", baTopProd:"Top Products by Sales", baUnitsSold:"units sold", baSeasonality:"Sales Seasonality — Annual Projection", mAbbr:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", seasonWinter:"Winter", seasonSpring:"Spring", seasonSummer:"Summer", seasonAutumn:"Autumn" });
Object.assign(T.it, { ifTitle:"Forecast Inventario AI", ifSub:"Previsione su vendite ultimi 90 giorni · ordini reali", ifLeadTime:"Tempi di rifornimento", ifDays:"giorni", ifReorderMsg:"prodotti da riordinare entro 30 giorni", ifAllOk:"Tutto sotto controllo — nessun esaurimento imminente", ifNoProducts:"Nessun prodotto da analizzare.", ifhProduct:"Prodotto", ifhStock:"Stock", ifhSalesWk:"Vendite/sett.", ifhDaysLeft:"Giorni residui", ifhStockout:"Esaurimento", ifhReorderBy:"Riordina entro", ifhStatus:"Stato", ifhReorder:"Riordino", baTitle:"Brand Intelligence", baSub:"Analisi distributor, prodotti e mercato europeo", baBtnLoading:"🤖 Analisi...", baBtnRefresh:"🔄 Aggiorna", baBtnGenerate:"✨ Genera Report", baReportTitle:"Brand Intelligence Report", baReportDesc:"Analisi completa delle performance dei tuoi distributori, prodotti bestseller, stagionalità e opportunità di crescita nel mercato europeo.", baLoadingData:"Analisi dati in corso...", baProcessing:"Elaborazione performance distributori, vendite prodotti e trend europei", baTopDist:"Top Distributori per Fatturato", baTopProd:"Top Prodotti per Vendite", baUnitsSold:"u. vendute", baSeasonality:"Stagionalità Vendite — Proiezione Annuale", mAbbr:"Gen,Feb,Mar,Apr,Mag,Giu,Lug,Ago,Set,Ott,Nov,Dic", seasonWinter:"Inverno", seasonSpring:"Primavera", seasonSummer:"Estate", seasonAutumn:"Autunno" });
Object.assign(T.fr, { ifTitle:"Prévision d'inventaire IA", ifSub:"Prévision sur les ventes des 90 derniers jours · commandes réelles", ifLeadTime:"Délai de réapprovisionnement", ifDays:"jours", ifReorderMsg:"produits à recommander sous 30 jours", ifAllOk:"Tout est sous contrôle — aucune rupture imminente", ifNoProducts:"Aucun produit à analyser.", ifhProduct:"Produit", ifhStock:"Stock", ifhSalesWk:"Ventes/sem.", ifhDaysLeft:"Jours restants", ifhStockout:"Rupture", ifhReorderBy:"Recommander avant", ifhStatus:"Statut", ifhReorder:"Réappro", baTitle:"Brand Intelligence", baSub:"Analyse des distributeurs, produits et marché européen", baBtnLoading:"🤖 Analyse...", baBtnRefresh:"🔄 Actualiser", baBtnGenerate:"✨ Générer le rapport", baReportTitle:"Rapport Brand Intelligence", baReportDesc:"Analyse complète des performances de vos distributeurs, produits phares, saisonnalité et opportunités de croissance sur le marché européen.", baLoadingData:"Analyse des données...", baProcessing:"Traitement des performances des distributeurs, ventes de produits et tendances européennes", baTopDist:"Meilleurs distributeurs par chiffre d'affaires", baTopProd:"Meilleurs produits par ventes", baUnitsSold:"u. vendues", baSeasonality:"Saisonnalité des ventes — projection annuelle", mAbbr:"Jan,Fév,Mar,Avr,Mai,Jui,Jul,Aoû,Sep,Oct,Nov,Déc", seasonWinter:"Hiver", seasonSpring:"Printemps", seasonSummer:"Été", seasonAutumn:"Automne" });
Object.assign(T.es, { ifTitle:"Pronóstico de inventario IA", ifSub:"Previsión sobre ventas de los últimos 90 días · pedidos reales", ifLeadTime:"Plazo de reabastecimiento", ifDays:"días", ifReorderMsg:"productos para reordenar en 30 días", ifAllOk:"Todo bajo control — sin agotamientos inminentes", ifNoProducts:"No hay productos para analizar.", ifhProduct:"Producto", ifhStock:"Stock", ifhSalesWk:"Ventas/sem.", ifhDaysLeft:"Días restantes", ifhStockout:"Agotamiento", ifhReorderBy:"Reordenar antes", ifhStatus:"Estado", ifhReorder:"Reorden", baTitle:"Brand Intelligence", baSub:"Análisis de distribuidores, productos y mercado europeo", baBtnLoading:"🤖 Analizando...", baBtnRefresh:"🔄 Actualizar", baBtnGenerate:"✨ Generar informe", baReportTitle:"Informe Brand Intelligence", baReportDesc:"Análisis completo del rendimiento de tus distribuidores, productos más vendidos, estacionalidad y oportunidades de crecimiento en el mercado europeo.", baLoadingData:"Analizando datos...", baProcessing:"Procesando rendimiento de distribuidores, ventas de productos y tendencias europeas", baTopDist:"Top distribuidores por facturación", baTopProd:"Top productos por ventas", baUnitsSold:"u. vendidas", baSeasonality:"Estacionalidad de ventas — proyección anual", mAbbr:"Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic", seasonWinter:"Invierno", seasonSpring:"Primavera", seasonSummer:"Verano", seasonAutumn:"Otoño" });
Object.assign(T.de, { ifTitle:"KI-Bestandsprognose", ifSub:"Prognose auf Basis der letzten 90 Verkaufstage · echte Bestellungen", ifLeadTime:"Wiederbeschaffungszeit", ifDays:"Tage", ifReorderMsg:"Produkte in 30 Tagen nachzubestellen", ifAllOk:"Alles unter Kontrolle — keine baldigen Engpässe", ifNoProducts:"Keine Produkte zu analysieren.", ifhProduct:"Produkt", ifhStock:"Bestand", ifhSalesWk:"Verkäufe/Wo.", ifhDaysLeft:"Verbleibende Tage", ifhStockout:"Ausverkauf", ifhReorderBy:"Nachbestellen bis", ifhStatus:"Status", ifhReorder:"Nachbestellung", baTitle:"Brand Intelligence", baSub:"Analyse von Händlern, Produkten und europäischem Markt", baBtnLoading:"🤖 Analyse...", baBtnRefresh:"🔄 Aktualisieren", baBtnGenerate:"✨ Bericht erstellen", baReportTitle:"Brand-Intelligence-Bericht", baReportDesc:"Vollständige Analyse der Leistung Ihrer Händler, Bestseller-Produkte, Saisonalität und Wachstumschancen im europäischen Markt.", baLoadingData:"Daten werden analysiert...", baProcessing:"Verarbeitung von Händlerleistung, Produktverkäufen und europäischen Trends", baTopDist:"Top-Händler nach Umsatz", baTopProd:"Top-Produkte nach Verkäufen", baUnitsSold:"Einh. verkauft", baSeasonality:"Verkaufssaisonalität — Jahresprognose", mAbbr:"Jan,Feb,Mär,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez", seasonWinter:"Winter", seasonSpring:"Frühling", seasonSummer:"Sommer", seasonAutumn:"Herbst" });
Object.assign(T.zh, { ifTitle:"AI 库存预测", ifSub:"基于过去90天销售的预测 · 真实订单", ifLeadTime:"补货周期", ifDays:"天", ifReorderMsg:"个产品需在30天内补货", ifAllOk:"一切正常 — 近期无缺货风险", ifNoProducts:"没有可分析的产品。", ifhProduct:"产品", ifhStock:"库存", ifhSalesWk:"销量/周", ifhDaysLeft:"剩余天数", ifhStockout:"缺货日", ifhReorderBy:"补货截止", ifhStatus:"状态", ifhReorder:"补货", baTitle:"品牌智能", baSub:"分销商、产品与欧洲市场分析", baBtnLoading:"🤖 分析中...", baBtnRefresh:"🔄 刷新", baBtnGenerate:"✨ 生成报告", baReportTitle:"品牌智能报告", baReportDesc:"全面分析您的分销商业绩、畅销产品、季节性以及欧洲市场的增长机会。", baLoadingData:"正在分析数据...", baProcessing:"正在处理分销商业绩、产品销售和欧洲趋势", baTopDist:"按营收排名的顶级分销商", baTopProd:"按销量排名的顶级产品", baUnitsSold:"件已售", baSeasonality:"销售季节性 — 年度预测", mAbbr:"1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月", seasonWinter:"冬季", seasonSpring:"春季", seasonSummer:"夏季", seasonAutumn:"秋季" });
Object.assign(T.ar, { ifTitle:"توقّع المخزون بالذكاء الاصطناعي", ifSub:"توقّع بناءً على مبيعات آخر 90 يومًا · طلبات حقيقية", ifLeadTime:"مدة إعادة التوريد", ifDays:"أيام", ifReorderMsg:"منتجات يجب إعادة طلبها خلال 30 يومًا", ifAllOk:"كل شيء تحت السيطرة — لا نفاد وشيك", ifNoProducts:"لا توجد منتجات للتحليل.", ifhProduct:"المنتج", ifhStock:"المخزون", ifhSalesWk:"مبيعات/أسبوع", ifhDaysLeft:"الأيام المتبقية", ifhStockout:"نفاد المخزون", ifhReorderBy:"إعادة الطلب قبل", ifhStatus:"الحالة", ifhReorder:"إعادة الطلب", baTitle:"ذكاء العلامة التجارية", baSub:"تحليل الموزّعين والمنتجات والسوق الأوروبية", baBtnLoading:"🤖 جارٍ التحليل...", baBtnRefresh:"🔄 تحديث", baBtnGenerate:"✨ إنشاء التقرير", baReportTitle:"تقرير ذكاء العلامة", baReportDesc:"تحليل كامل لأداء موزّعيك، والمنتجات الأكثر مبيعًا، والموسمية وفرص النمو في السوق الأوروبية.", baLoadingData:"جارٍ تحليل البيانات...", baProcessing:"معالجة أداء الموزّعين ومبيعات المنتجات والاتجاهات الأوروبية", baTopDist:"أفضل الموزّعين حسب الإيرادات", baTopProd:"أفضل المنتجات حسب المبيعات", baUnitsSold:"وحدة مُباعة", baSeasonality:"موسمية المبيعات — التوقّع السنوي", mAbbr:"ينا,فبر,مار,أبر,ماي,يون,يول,أغس,سبت,أكت,نوف,ديس", seasonWinter:"الشتاء", seasonSpring:"الربيع", seasonSummer:"الصيف", seasonAutumn:"الخريف" });
Object.assign(T.en, { insStrategy:"Strategy", insWinter:"Winter is the peak for oud and oriental perfumes. Make sure distributors have adequate stock.", insSummer:"Summer favors fresh and floral perfumes. Prepare promotions for Southern European distributors.", insSpring:"Spring is ideal for launching new products: distributors are more open to testing new SKUs.", insAutumn:"Autumn prepares for the warm season: anticipate winter reorders now.", insDistTitle:"Top Distributor", insDistText:"{company} ({territory}) is your highest-revenue distributor: €{rev} across {orders} orders.", insProdTitle:"Best-selling Product", insProdText:"{name} is the best seller with {units} units. Consider a bundle with {name2} to increase order value.", insAnotherSku:"another SKU", insNoDataTitle:"Not enough data yet", insNoDataText:"There aren't enough orders yet for a complete analysis. Data will appear here as distributors place orders." });
Object.assign(T.it, { insStrategy:"Strategia", insWinter:"L'inverno è il picco per i profumi oud e orientali. Assicurati che i distributori abbiano stock adeguato.", insSummer:"L'estate favorisce profumi freschi e floreali. Prepara promozioni per i distributori del Sud Europa.", insSpring:"La primavera è ideale per lanciare nuovi prodotti: i distributori sono più aperti a testare SKU nuovi.", insAutumn:"L'autunno prepara alla stagione calda: anticipa i riordini invernali ora.", insDistTitle:"Distributore Top", insDistText:"{company} ({territory}) è il tuo distributore con il fatturato più alto: €{rev} su {orders} ordini.", insProdTitle:"Prodotto Bestseller", insProdText:"{name} è il più venduto con {units} unità. Considera un bundle con {name2} per aumentare l'order value.", insAnotherSku:"un altro SKU", insNoDataTitle:"Ancora pochi dati", insNoDataText:"Non ci sono ancora abbastanza ordini per un'analisi completa. I dati appariranno qui man mano che i distributori ordinano." });
Object.assign(T.fr, { insStrategy:"Stratégie", insWinter:"L'hiver est le pic pour les parfums oud et orientaux. Assurez-vous que les distributeurs disposent d'un stock suffisant.", insSummer:"L'été favorise les parfums frais et floraux. Préparez des promotions pour les distributeurs d'Europe du Sud.", insSpring:"Le printemps est idéal pour lancer de nouveaux produits : les distributeurs sont plus ouverts à tester de nouveaux SKU.", insAutumn:"L'automne prépare la saison chaude : anticipez les réassorts d'hiver dès maintenant.", insDistTitle:"Meilleur distributeur", insDistText:"{company} ({territory}) est votre distributeur au chiffre d'affaires le plus élevé : €{rev} sur {orders} commandes.", insProdTitle:"Produit le plus vendu", insProdText:"{name} est le plus vendu avec {units} unités. Envisagez un lot avec {name2} pour augmenter la valeur des commandes.", insAnotherSku:"un autre SKU", insNoDataTitle:"Pas encore assez de données", insNoDataText:"Il n'y a pas encore assez de commandes pour une analyse complète. Les données apparaîtront ici au fur et à mesure que les distributeurs commandent." });
Object.assign(T.es, { insStrategy:"Estrategia", insWinter:"El invierno es el pico para los perfumes oud y orientales. Asegúrate de que los distribuidores tengan stock suficiente.", insSummer:"El verano favorece los perfumes frescos y florales. Prepara promociones para los distribuidores del sur de Europa.", insSpring:"La primavera es ideal para lanzar nuevos productos: los distribuidores están más abiertos a probar nuevos SKU.", insAutumn:"El otoño prepara la temporada cálida: anticipa ahora los pedidos de invierno.", insDistTitle:"Distribuidor top", insDistText:"{company} ({territory}) es tu distribuidor con mayor facturación: €{rev} en {orders} pedidos.", insProdTitle:"Producto más vendido", insProdText:"{name} es el más vendido con {units} unidades. Considera un paquete con {name2} para aumentar el valor del pedido.", insAnotherSku:"otro SKU", insNoDataTitle:"Aún faltan datos", insNoDataText:"Aún no hay suficientes pedidos para un análisis completo. Los datos aparecerán aquí a medida que los distribuidores realicen pedidos." });
Object.assign(T.de, { insStrategy:"Strategie", insWinter:"Der Winter ist der Höhepunkt für Oud- und orientalische Düfte. Sorgen Sie dafür, dass Händler ausreichend Bestand haben.", insSummer:"Der Sommer begünstigt frische und blumige Düfte. Bereiten Sie Aktionen für südeuropäische Händler vor.", insSpring:"Der Frühling ist ideal für Produkteinführungen: Händler sind offener für neue SKUs.", insAutumn:"Der Herbst bereitet auf die warme Saison vor: Planen Sie Winter-Nachbestellungen jetzt.", insDistTitle:"Top-Händler", insDistText:"{company} ({territory}) ist Ihr umsatzstärkster Händler: €{rev} bei {orders} Bestellungen.", insProdTitle:"Bestseller-Produkt", insProdText:"{name} ist der Bestseller mit {units} Einheiten. Erwägen Sie ein Bundle mit {name2}, um den Bestellwert zu steigern.", insAnotherSku:"eine andere SKU", insNoDataTitle:"Noch zu wenige Daten", insNoDataText:"Es gibt noch nicht genügend Bestellungen für eine vollständige Analyse. Die Daten erscheinen hier, sobald Händler bestellen." });
Object.assign(T.zh, { insStrategy:"策略", insWinter:"冬季是沉香和东方香水的高峰期。请确保分销商备货充足。", insSummer:"夏季适合清新和花香型香水。为南欧分销商准备促销活动。", insSpring:"春季适合推出新产品：分销商更愿意试销新的 SKU。", insAutumn:"秋季为暖季做准备：现在就提前安排冬季补货。", insDistTitle:"顶级分销商", insDistText:"{company}（{territory}）是您营收最高的分销商：€{rev}，共 {orders} 笔订单。", insProdTitle:"畅销产品", insProdText:"{name} 是销量最高的产品，共 {units} 件。可考虑与 {name2} 组合销售以提升订单价值。", insAnotherSku:"另一个 SKU", insNoDataTitle:"数据仍不足", insNoDataText:"目前订单数量不足以进行完整分析。随着分销商下单，数据将显示在此处。" });
Object.assign(T.ar, { insStrategy:"الاستراتيجية", insWinter:"الشتاء هو ذروة عطور العود والعطور الشرقية. تأكد من توفر مخزون كافٍ لدى الموزّعين.", insSummer:"الصيف يفضّل العطور المنعشة والزهرية. جهّز عروضًا لموزّعي جنوب أوروبا.", insSpring:"الربيع مثالي لإطلاق منتجات جديدة: الموزّعون أكثر انفتاحًا لتجربة أصناف جديدة.", insAutumn:"الخريف يهيّئ للموسم الدافئ: قدّم طلبات إعادة التوريد الشتوية الآن.", insDistTitle:"أفضل موزّع", insDistText:"{company} ({territory}) هو موزّعك الأعلى إيرادًا: €{rev} عبر {orders} طلبًا.", insProdTitle:"المنتج الأكثر مبيعًا", insProdText:"{name} هو الأكثر مبيعًا بـ {units} وحدة. فكّر في حزمة مع {name2} لزيادة قيمة الطلب.", insAnotherSku:"صنف آخر", insNoDataTitle:"البيانات غير كافية بعد", insNoDataText:"لا توجد طلبات كافية بعد لإجراء تحليل كامل. ستظهر البيانات هنا مع قيام الموزّعين بالطلب." });
Object.assign(T.en, { atabOverview:"Overview", atabUsers:"Users", atabBrands:"Brands", atabCatalog:"Catalog", atabInventory:"Inventory", atabLogistics:"Logistics", atabRetail:"Retail", atabCompliance:"Compliance", atabMargins:"Margins", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"Orders", atabInvoices:"Invoices", atabContracts:"Contracts", atabCommissions:"Commissions", atabIncassi:"Collections", atabFinance:"Finance", atabAudit:"Audit", atabIssues:"Issues", atabPayments:"Payments", atabSettings:"Settings" });
Object.assign(T.it, { atabOverview:"Panoramica", atabUsers:"Utenti", atabBrands:"Brand", atabCatalog:"Catalogo", atabInventory:"Inventario", atabLogistics:"Logistica", atabRetail:"Retail", atabCompliance:"Compliance", atabMargins:"Margini", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"Ordini", atabInvoices:"Fatture", atabContracts:"Contratti", atabCommissions:"Provvigioni", atabIncassi:"Incassi", atabFinance:"Finanze", atabAudit:"Audit", atabIssues:"Segnalazioni", atabPayments:"Pagamenti", atabSettings:"Impostazioni" });
Object.assign(T.fr, { atabOverview:"Aperçu", atabUsers:"Utilisateurs", atabBrands:"Marques", atabCatalog:"Catalogue", atabInventory:"Inventaire", atabLogistics:"Logistique", atabRetail:"Vente au détail", atabCompliance:"Conformité", atabMargins:"Marges", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"Commandes", atabInvoices:"Factures", atabContracts:"Contrats", atabCommissions:"Commissions", atabIncassi:"Encaissements", atabFinance:"Finances", atabAudit:"Audit", atabIssues:"Signalements", atabPayments:"Paiements", atabSettings:"Paramètres" });
Object.assign(T.es, { atabOverview:"Resumen", atabUsers:"Usuarios", atabBrands:"Marcas", atabCatalog:"Catálogo", atabInventory:"Inventario", atabLogistics:"Logística", atabRetail:"Retail", atabCompliance:"Cumplimiento", atabMargins:"Márgenes", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"Pedidos", atabInvoices:"Facturas", atabContracts:"Contratos", atabCommissions:"Comisiones", atabIncassi:"Cobros", atabFinance:"Finanzas", atabAudit:"Auditoría", atabIssues:"Incidencias", atabPayments:"Pagos", atabSettings:"Ajustes" });
Object.assign(T.de, { atabOverview:"Übersicht", atabUsers:"Benutzer", atabBrands:"Marken", atabCatalog:"Katalog", atabInventory:"Bestand", atabLogistics:"Logistik", atabRetail:"Einzelhandel", atabCompliance:"Compliance", atabMargins:"Margen", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"Bestellungen", atabInvoices:"Rechnungen", atabContracts:"Verträge", atabCommissions:"Provisionen", atabIncassi:"Zahlungseingänge", atabFinance:"Finanzen", atabAudit:"Audit", atabIssues:"Meldungen", atabPayments:"Zahlungen", atabSettings:"Einstellungen" });
Object.assign(T.zh, { atabOverview:"概览", atabUsers:"用户", atabBrands:"品牌", atabCatalog:"目录", atabInventory:"库存", atabLogistics:"物流", atabRetail:"零售", atabCompliance:"合规", atabMargins:"利润", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"订单", atabInvoices:"发票", atabContracts:"合同", atabCommissions:"佣金", atabIncassi:"收款", atabFinance:"财务", atabAudit:"审计", atabIssues:"问题反馈", atabPayments:"支付", atabSettings:"设置" });
Object.assign(T.ar, { atabOverview:"نظرة عامة", atabUsers:"المستخدمون", atabBrands:"العلامات", atabCatalog:"الكتالوج", atabInventory:"المخزون", atabLogistics:"اللوجستيات", atabRetail:"التجزئة", atabCompliance:"الامتثال", atabMargins:"الهوامش", atabNexusAI:"Nexus AI", atabAmazon:"Amazon", atabOrders:"الطلبات", atabInvoices:"الفواتير", atabContracts:"العقود", atabCommissions:"العمولات", atabIncassi:"التحصيلات", atabFinance:"المالية", atabAudit:"التدقيق", atabIssues:"البلاغات", atabPayments:"المدفوعات", atabSettings:"الإعدادات" });
Object.assign(T.en, { aoTitle:"Platform Overview", aoSub:"Real-time view across all brands, distributors and inventory", aoActiveBrands:"Active Brands", aoTotalUsers:"Total Users", aoPendingApproval:"Pending Approval", aoTotalProducts:"Total Products", aoTotalOrders:"Total Orders", aoEuroNetwork:"European Distribution Network" });
Object.assign(T.it, { aoTitle:"Panoramica Piattaforma", aoSub:"Vista in tempo reale su tutti i brand, distributori e inventario", aoActiveBrands:"Brand Attivi", aoTotalUsers:"Utenti Totali", aoPendingApproval:"In Attesa di Approvazione", aoTotalProducts:"Prodotti Totali", aoTotalOrders:"Ordini Totali", aoEuroNetwork:"Rete di Distribuzione Europea" });
Object.assign(T.fr, { aoTitle:"Aperçu de la plateforme", aoSub:"Vue en temps réel sur toutes les marques, distributeurs et l'inventaire", aoActiveBrands:"Marques actives", aoTotalUsers:"Utilisateurs totaux", aoPendingApproval:"En attente d'approbation", aoTotalProducts:"Produits totaux", aoTotalOrders:"Commandes totales", aoEuroNetwork:"Réseau de distribution européen" });
Object.assign(T.es, { aoTitle:"Resumen de la plataforma", aoSub:"Vista en tiempo real de todas las marcas, distribuidores e inventario", aoActiveBrands:"Marcas activas", aoTotalUsers:"Usuarios totales", aoPendingApproval:"Pendiente de aprobación", aoTotalProducts:"Productos totales", aoTotalOrders:"Pedidos totales", aoEuroNetwork:"Red de distribución europea" });
Object.assign(T.de, { aoTitle:"Plattform-Übersicht", aoSub:"Echtzeit-Ansicht über alle Marken, Händler und den Bestand", aoActiveBrands:"Aktive Marken", aoTotalUsers:"Benutzer gesamt", aoPendingApproval:"Genehmigung ausstehend", aoTotalProducts:"Produkte gesamt", aoTotalOrders:"Bestellungen gesamt", aoEuroNetwork:"Europäisches Vertriebsnetz" });
Object.assign(T.zh, { aoTitle:"平台概览", aoSub:"实时查看所有品牌、分销商和库存", aoActiveBrands:"活跃品牌", aoTotalUsers:"用户总数", aoPendingApproval:"待审批", aoTotalProducts:"产品总数", aoTotalOrders:"订单总数", aoEuroNetwork:"欧洲分销网络" });
Object.assign(T.ar, { aoTitle:"نظرة عامة على المنصة", aoSub:"عرض فوري لجميع العلامات والموزّعين والمخزون", aoActiveBrands:"العلامات النشطة", aoTotalUsers:"إجمالي المستخدمين", aoPendingApproval:"بانتظار الموافقة", aoTotalProducts:"إجمالي المنتجات", aoTotalOrders:"إجمالي الطلبات", aoEuroNetwork:"شبكة التوزيع الأوروبية" });
Object.assign(T.en, { auTitle:"User Management", auSub:"Approve or reject brand and distributor registrations", auLoading:"Loading...", auAllUsers:"All Users", auhCompany:"Company", auhEmail:"Email", auhRole:"Role", auhCountry:"Country", auhStatus:"Status", auhTrust:"Trust", auhJoined:"Joined", auhActions:"Actions", auApprove:"Approve", auReject:"Reject", auContact:"Contact", auAddPoints:"Add points", auRemovePoints:"Remove points", auReactivate:"Reactivate", auSuspend:"Suspend", auImpersonate:"Enter as this user" });
Object.assign(T.it, { auTitle:"Gestione Utenti", auSub:"Approva o rifiuta le registrazioni di brand e distributori", auLoading:"Caricamento...", auAllUsers:"Tutti gli Utenti", auhCompany:"Azienda", auhEmail:"Email", auhRole:"Ruolo", auhCountry:"Paese", auhStatus:"Stato", auhTrust:"Fiducia", auhJoined:"Iscritto", auhActions:"Azioni", auApprove:"Approva", auReject:"Rifiuta", auContact:"Contatta", auAddPoints:"Aggiungi punti", auRemovePoints:"Togli punti", auReactivate:"Riattiva", auSuspend:"Sospendi", auImpersonate:"Entra come questo utente" });
Object.assign(T.fr, { auTitle:"Gestion des utilisateurs", auSub:"Approuvez ou rejetez les inscriptions de marques et distributeurs", auLoading:"Chargement...", auAllUsers:"Tous les utilisateurs", auhCompany:"Entreprise", auhEmail:"E-mail", auhRole:"Rôle", auhCountry:"Pays", auhStatus:"Statut", auhTrust:"Confiance", auhJoined:"Inscrit", auhActions:"Actions", auApprove:"Approuver", auReject:"Rejeter", auContact:"Contacter", auAddPoints:"Ajouter des points", auRemovePoints:"Retirer des points", auReactivate:"Réactiver", auSuspend:"Suspendre", auImpersonate:"Entrer en tant que cet utilisateur" });
Object.assign(T.es, { auTitle:"Gestión de usuarios", auSub:"Aprueba o rechaza los registros de marcas y distribuidores", auLoading:"Cargando...", auAllUsers:"Todos los usuarios", auhCompany:"Empresa", auhEmail:"Correo", auhRole:"Rol", auhCountry:"País", auhStatus:"Estado", auhTrust:"Confianza", auhJoined:"Registrado", auhActions:"Acciones", auApprove:"Aprobar", auReject:"Rechazar", auContact:"Contactar", auAddPoints:"Añadir puntos", auRemovePoints:"Quitar puntos", auReactivate:"Reactivar", auSuspend:"Suspender", auImpersonate:"Entrar como este usuario" });
Object.assign(T.de, { auTitle:"Benutzerverwaltung", auSub:"Registrierungen von Marken und Händlern genehmigen oder ablehnen", auLoading:"Wird geladen...", auAllUsers:"Alle Benutzer", auhCompany:"Unternehmen", auhEmail:"E-Mail", auhRole:"Rolle", auhCountry:"Land", auhStatus:"Status", auhTrust:"Vertrauen", auhJoined:"Beigetreten", auhActions:"Aktionen", auApprove:"Genehmigen", auReject:"Ablehnen", auContact:"Kontaktieren", auAddPoints:"Punkte hinzufügen", auRemovePoints:"Punkte entfernen", auReactivate:"Reaktivieren", auSuspend:"Sperren", auImpersonate:"Als dieser Benutzer anmelden" });
Object.assign(T.zh, { auTitle:"用户管理", auSub:"批准或拒绝品牌和分销商的注册", auLoading:"加载中...", auAllUsers:"所有用户", auhCompany:"公司", auhEmail:"邮箱", auhRole:"角色", auhCountry:"国家", auhStatus:"状态", auhTrust:"信任", auhJoined:"加入时间", auhActions:"操作", auApprove:"批准", auReject:"拒绝", auContact:"联系", auAddPoints:"增加积分", auRemovePoints:"减少积分", auReactivate:"重新激活", auSuspend:"暂停", auImpersonate:"以该用户身份进入" });
Object.assign(T.ar, { auTitle:"إدارة المستخدمين", auSub:"الموافقة على تسجيلات العلامات والموزّعين أو رفضها", auLoading:"جارٍ التحميل...", auAllUsers:"جميع المستخدمين", auhCompany:"الشركة", auhEmail:"البريد", auhRole:"الدور", auhCountry:"الدولة", auhStatus:"الحالة", auhTrust:"الثقة", auhJoined:"تاريخ الانضمام", auhActions:"الإجراءات", auApprove:"موافقة", auReject:"رفض", auContact:"تواصل", auAddPoints:"إضافة نقاط", auRemovePoints:"خصم نقاط", auReactivate:"إعادة التفعيل", auSuspend:"تعليق", auImpersonate:"الدخول بصفة هذا المستخدم" });
Object.assign(T.en, { abTitle:"Brand Management", abAddBrand:"+ Add Brand", abCode:"Code", abNoBrands:"No brands yet. Add the first one!", acTitle:"Product Catalog", acAddProduct:"+ Add Product", achBrand:"Brand", achProduct:"Product", achCategory:"Category", achPrice:"Price", achStock:"Stock", achMultiple:"Multiple", acEdit:"Edit", acActivate:"Activate", acDeactivate:"Deactivate" });
Object.assign(T.it, { abTitle:"Gestione Brand", abAddBrand:"+ Aggiungi Brand", abCode:"Codice", abNoBrands:"Nessun brand ancora. Aggiungi il primo!", acTitle:"Catalogo Prodotti", acAddProduct:"+ Aggiungi Prodotto", achBrand:"Brand", achProduct:"Prodotto", achCategory:"Categoria", achPrice:"Prezzo", achStock:"Stock", achMultiple:"Multiplo", acEdit:"Modifica", acActivate:"Attiva", acDeactivate:"Disattiva" });
Object.assign(T.fr, { abTitle:"Gestion des marques", abAddBrand:"+ Ajouter une marque", abCode:"Code", abNoBrands:"Aucune marque pour l'instant. Ajoutez la première !", acTitle:"Catalogue de produits", acAddProduct:"+ Ajouter un produit", achBrand:"Marque", achProduct:"Produit", achCategory:"Catégorie", achPrice:"Prix", achStock:"Stock", achMultiple:"Multiple", acEdit:"Modifier", acActivate:"Activer", acDeactivate:"Désactiver" });
Object.assign(T.es, { abTitle:"Gestión de marcas", abAddBrand:"+ Añadir marca", abCode:"Código", abNoBrands:"Aún no hay marcas. ¡Añade la primera!", acTitle:"Catálogo de productos", acAddProduct:"+ Añadir producto", achBrand:"Marca", achProduct:"Producto", achCategory:"Categoría", achPrice:"Precio", achStock:"Stock", achMultiple:"Múltiplo", acEdit:"Editar", acActivate:"Activar", acDeactivate:"Desactivar" });
Object.assign(T.de, { abTitle:"Markenverwaltung", abAddBrand:"+ Marke hinzufügen", abCode:"Code", abNoBrands:"Noch keine Marken. Fügen Sie die erste hinzu!", acTitle:"Produktkatalog", acAddProduct:"+ Produkt hinzufügen", achBrand:"Marke", achProduct:"Produkt", achCategory:"Kategorie", achPrice:"Preis", achStock:"Bestand", achMultiple:"Vielfaches", acEdit:"Bearbeiten", acActivate:"Aktivieren", acDeactivate:"Deaktivieren" });
Object.assign(T.zh, { abTitle:"品牌管理", abAddBrand:"+ 添加品牌", abCode:"代码", abNoBrands:"还没有品牌。添加第一个吧！", acTitle:"产品目录", acAddProduct:"+ 添加产品", achBrand:"品牌", achProduct:"产品", achCategory:"类别", achPrice:"价格", achStock:"库存", achMultiple:"倍数", acEdit:"编辑", acActivate:"启用", acDeactivate:"停用" });
Object.assign(T.ar, { abTitle:"إدارة العلامات", abAddBrand:"+ إضافة علامة", abCode:"الرمز", abNoBrands:"لا توجد علامات بعد. أضِف الأولى!", acTitle:"كتالوج المنتجات", acAddProduct:"+ إضافة منتج", achBrand:"العلامة", achProduct:"المنتج", achCategory:"الفئة", achPrice:"السعر", achStock:"المخزون", achMultiple:"المضاعف", acEdit:"تعديل", acActivate:"تفعيل", acDeactivate:"إلغاء التفعيل" });
Object.assign(T.en, { aordTitle:"Order Management", aordExport:"Export for ShippyPro (CSV)", aordDelReview:"Delete review (brand appeal)", aordDelReviewConfirm:"Delete the review and reverse the brand's points?", aordReviewDeleted:"Review deleted", aordRemove:"remove", aordCourierPh:"Courier (e.g. BRT)", aordTrackingPh:"Tracking no.", aordSaveNotify:"Save + notify", aordNoOrders:"No orders yet", ainvTitle:"Automatic Invoicing", ainvSub:"Invoices generated automatically when orders are completed", ainvNoInvoices:"No invoices yet", ainvNoInvoicesMsg:"Invoices are generated automatically when an order is delivered", ainvView:"View", ainvSend:"Send", ainvCardTotal:"Total Invoices", ainvCardComm:"NH Commissions", ainvCardToday:"Issued today", ainvhNumber:"Number", ainvhType:"Type", ainvhFrom:"From", ainvhTo:"To", ainvhTaxable:"Taxable", ainvhVat:"VAT", ainvhTotal:"Total", ainvhCommNH:"NH Commission", ainvhDate:"Date", ainvtypeComm:"NH Commission", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.it, { aordTitle:"Gestione Ordini", aordExport:"Esporta per ShippyPro (CSV)", aordDelReview:"Cancella recensione (appello brand)", aordDelReviewConfirm:"Cancellare la recensione e stornare i punti al brand?", aordReviewDeleted:"Recensione cancellata", aordRemove:"togli", aordCourierPh:"Corriere (es. BRT)", aordTrackingPh:"N. tracking", aordSaveNotify:"Salva + notifica", aordNoOrders:"Nessun ordine ancora", ainvTitle:"Fatturazione Automatica", ainvSub:"Fatture generate automaticamente al completamento degli ordini", ainvNoInvoices:"Nessuna fattura ancora", ainvNoInvoicesMsg:"Le fatture vengono generate automaticamente quando un ordine viene consegnato", ainvView:"Vedi", ainvSend:"Invia", ainvCardTotal:"Totale Fatture", ainvCardComm:"Commissioni NH", ainvCardToday:"Emesse oggi", ainvhNumber:"Numero", ainvhType:"Tipo", ainvhFrom:"Da", ainvhTo:"A", ainvhTaxable:"Imponibile", ainvhVat:"IVA", ainvhTotal:"Totale", ainvhCommNH:"Commissione NH", ainvhDate:"Data", ainvtypeComm:"NH Commission", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.fr, { aordTitle:"Gestion des commandes", aordExport:"Exporter pour ShippyPro (CSV)", aordDelReview:"Supprimer l'avis (recours marque)", aordDelReviewConfirm:"Supprimer l'avis et annuler les points de la marque ?", aordReviewDeleted:"Avis supprimé", aordRemove:"retirer", aordCourierPh:"Transporteur (ex. BRT)", aordTrackingPh:"N° de suivi", aordSaveNotify:"Enregistrer + notifier", aordNoOrders:"Aucune commande pour l'instant", ainvTitle:"Facturation automatique", ainvSub:"Factures générées automatiquement à la finalisation des commandes", ainvNoInvoices:"Aucune facture pour l'instant", ainvNoInvoicesMsg:"Les factures sont générées automatiquement lorsqu'une commande est livrée", ainvView:"Voir", ainvSend:"Envoyer", ainvCardTotal:"Total factures", ainvCardComm:"Commissions NH", ainvCardToday:"Émises aujourd'hui", ainvhNumber:"Numéro", ainvhType:"Type", ainvhFrom:"De", ainvhTo:"À", ainvhTaxable:"Base imposable", ainvhVat:"TVA", ainvhTotal:"Total", ainvhCommNH:"Commission NH", ainvhDate:"Date", ainvtypeComm:"Commission NH", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.es, { aordTitle:"Gestión de pedidos", aordExport:"Exportar para ShippyPro (CSV)", aordDelReview:"Eliminar reseña (apelación marca)", aordDelReviewConfirm:"¿Eliminar la reseña y revertir los puntos de la marca?", aordReviewDeleted:"Reseña eliminada", aordRemove:"quitar", aordCourierPh:"Transportista (p. ej. BRT)", aordTrackingPh:"N.º de seguimiento", aordSaveNotify:"Guardar + notificar", aordNoOrders:"Aún no hay pedidos", ainvTitle:"Facturación automática", ainvSub:"Facturas generadas automáticamente al completar los pedidos", ainvNoInvoices:"Aún no hay facturas", ainvNoInvoicesMsg:"Las facturas se generan automáticamente cuando se entrega un pedido", ainvView:"Ver", ainvSend:"Enviar", ainvCardTotal:"Total facturas", ainvCardComm:"Comisiones NH", ainvCardToday:"Emitidas hoy", ainvhNumber:"Número", ainvhType:"Tipo", ainvhFrom:"De", ainvhTo:"A", ainvhTaxable:"Base imponible", ainvhVat:"IVA", ainvhTotal:"Total", ainvhCommNH:"Comisión NH", ainvhDate:"Fecha", ainvtypeComm:"Comisión NH", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.de, { aordTitle:"Bestellverwaltung", aordExport:"Für ShippyPro exportieren (CSV)", aordDelReview:"Bewertung löschen (Marken-Einspruch)", aordDelReviewConfirm:"Bewertung löschen und die Punkte der Marke zurückbuchen?", aordReviewDeleted:"Bewertung gelöscht", aordRemove:"entfernen", aordCourierPh:"Kurier (z. B. BRT)", aordTrackingPh:"Sendungsnr.", aordSaveNotify:"Speichern + benachrichtigen", aordNoOrders:"Noch keine Bestellungen", ainvTitle:"Automatische Rechnungsstellung", ainvSub:"Rechnungen werden bei Abschluss der Bestellungen automatisch erstellt", ainvNoInvoices:"Noch keine Rechnungen", ainvNoInvoicesMsg:"Rechnungen werden automatisch erstellt, wenn eine Bestellung geliefert wird", ainvView:"Ansehen", ainvSend:"Senden", ainvCardTotal:"Rechnungen gesamt", ainvCardComm:"NH-Provisionen", ainvCardToday:"Heute ausgestellt", ainvhNumber:"Nummer", ainvhType:"Typ", ainvhFrom:"Von", ainvhTo:"An", ainvhTaxable:"Nettobetrag", ainvhVat:"USt.", ainvhTotal:"Gesamt", ainvhCommNH:"NH-Provision", ainvhDate:"Datum", ainvtypeComm:"NH-Provision", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.zh, { aordTitle:"订单管理", aordExport:"导出到 ShippyPro (CSV)", aordDelReview:"删除评价（品牌申诉）", aordDelReviewConfirm:"删除评价并撤销该品牌的积分？", aordReviewDeleted:"评价已删除", aordRemove:"移除", aordCourierPh:"快递（例如 BRT）", aordTrackingPh:"追踪号", aordSaveNotify:"保存并通知", aordNoOrders:"还没有订单", ainvTitle:"自动开票", ainvSub:"订单完成时自动生成发票", ainvNoInvoices:"还没有发票", ainvNoInvoicesMsg:"订单送达时会自动生成发票", ainvView:"查看", ainvSend:"发送", ainvCardTotal:"发票总数", ainvCardComm:"NH 佣金", ainvCardToday:"今日开具", ainvhNumber:"编号", ainvhType:"类型", ainvhFrom:"来自", ainvhTo:"至", ainvhTaxable:"应税额", ainvhVat:"增值税", ainvhTotal:"合计", ainvhCommNH:"NH 佣金", ainvhDate:"日期", ainvtypeComm:"NH 佣金", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.ar, { aordTitle:"إدارة الطلبات", aordExport:"تصدير إلى ShippyPro (CSV)", aordDelReview:"حذف المراجعة (استئناف العلامة)", aordDelReviewConfirm:"حذف المراجعة وعكس نقاط العلامة؟", aordReviewDeleted:"تم حذف المراجعة", aordRemove:"إزالة", aordCourierPh:"شركة الشحن (مثل BRT)", aordTrackingPh:"رقم التتبع", aordSaveNotify:"حفظ + إشعار", aordNoOrders:"لا توجد طلبات بعد", ainvTitle:"الفوترة التلقائية", ainvSub:"تُنشأ الفواتير تلقائيًا عند اكتمال الطلبات", ainvNoInvoices:"لا توجد فواتير بعد", ainvNoInvoicesMsg:"تُنشأ الفواتير تلقائيًا عند تسليم الطلب", ainvView:"عرض", ainvSend:"إرسال", ainvCardTotal:"إجمالي الفواتير", ainvCardComm:"عمولات NH", ainvCardToday:"الصادرة اليوم", ainvhNumber:"الرقم", ainvhType:"النوع", ainvhFrom:"من", ainvhTo:"إلى", ainvhTaxable:"الخاضع للضريبة", ainvhVat:"ض.ق.م", ainvhTotal:"الإجمالي", ainvhCommNH:"عمولة NH", ainvhDate:"التاريخ", ainvtypeComm:"عمولة NH", ainvtypeToDist:"NH → Dist.", ainvtypeBrandNH:"Brand → NH" });
Object.assign(T.en, { acomTitle:"Automatic Commissions", acomSub:"Tiers on real annual revenue · up to €10M = 11.4% · €10–15M = 10% · over €15M = 9%", acomNoBrands:"No brands registered.", acomLocked:"locked", acomUpdated:"updated", acomHistory:"Change history", acomNoHistory:"No changes recorded so far.", aconTitle:"Digital Contracts", aconSub:"Exclusive distribution contracts by territory", aconFilterActive:"Active", aconFilterDrafts:"Drafts", aconFilterExpiring:"Expiring (30d)", aconFilterExpired:"Expired", aconNoContracts:"No contracts yet", aconNoContractsMsg:"Contracts are created when you approve a distributor for a brand", aconExpired:"expired", aconView:"View", aconActivate:"Activate", aconTerminate:"Terminate", aconNewTitle:"New distribution contract", aconBrandLbl:"Brand *", aconChooseBrand:"— Choose brand —", aconDistLbl:"Distributor *", aconChooseDist:"— Choose distributor —", aconTerritory:"Territory", aconTerritoryPh:"e.g. Italy, EU, Romania...", aconCommission:"Commission (%)", aconMOQ:"MOQ per order", aconPayTerms:"Payment terms (days)", aconValidFrom:"Valid from", aconValidUntil:"Valid until" });
Object.assign(T.it, { acomTitle:"Provvigioni automatiche", acomSub:"Scaglioni sul fatturato annuo reale · fino a 10M€ = 11,4% · 10–15M€ = 10% · oltre 15M€ = 9%", acomNoBrands:"Nessun brand registrato.", acomLocked:"bloccata", acomUpdated:"aggiornato", acomHistory:"Storico modifiche", acomNoHistory:"Nessuna modifica registrata finora.", aconTitle:"Contratti Digitali", aconSub:"Contratti di distribuzione esclusiva per territorio", aconFilterActive:"Attivi", aconFilterDrafts:"Bozze", aconFilterExpiring:"In scadenza (30gg)", aconFilterExpired:"Scaduti", aconNoContracts:"Nessun contratto ancora", aconNoContractsMsg:"I contratti vengono creati quando approvi un distributore per un brand", aconExpired:"scaduto", aconView:"Vedi", aconActivate:"Attiva", aconTerminate:"Termina", aconNewTitle:"Nuovo contratto di distribuzione", aconBrandLbl:"Brand *", aconChooseBrand:"— Scegli brand —", aconDistLbl:"Distributore *", aconChooseDist:"— Scegli distributore —", aconTerritory:"Territorio", aconTerritoryPh:"es. Italia, UE, Romania...", aconCommission:"Commissione (%)", aconMOQ:"MOQ per ordine", aconPayTerms:"Termini pagamento (giorni)", aconValidFrom:"Valido dal", aconValidUntil:"Valido fino al" });
Object.assign(T.fr, { acomTitle:"Commissions automatiques", acomSub:"Paliers sur le chiffre d'affaires annuel réel · jusqu'à 10M€ = 11,4% · 10–15M€ = 10% · au-delà de 15M€ = 9%", acomNoBrands:"Aucune marque enregistrée.", acomLocked:"verrouillée", acomUpdated:"mis à jour", acomHistory:"Historique des modifications", acomNoHistory:"Aucune modification enregistrée jusqu'à présent.", aconTitle:"Contrats numériques", aconSub:"Contrats de distribution exclusive par territoire", aconFilterActive:"Actifs", aconFilterDrafts:"Brouillons", aconFilterExpiring:"Expirent (30j)", aconFilterExpired:"Expirés", aconNoContracts:"Aucun contrat pour l'instant", aconNoContractsMsg:"Les contrats sont créés lorsque vous approuvez un distributeur pour une marque", aconExpired:"expiré", aconView:"Voir", aconActivate:"Activer", aconTerminate:"Résilier", aconNewTitle:"Nouveau contrat de distribution", aconBrandLbl:"Marque *", aconChooseBrand:"— Choisir une marque —", aconDistLbl:"Distributeur *", aconChooseDist:"— Choisir un distributeur —", aconTerritory:"Territoire", aconTerritoryPh:"ex. Italie, UE, Roumanie...", aconCommission:"Commission (%)", aconMOQ:"MOQ par commande", aconPayTerms:"Délais de paiement (jours)", aconValidFrom:"Valable du", aconValidUntil:"Valable jusqu'au" });
Object.assign(T.es, { acomTitle:"Comisiones automáticas", acomSub:"Tramos sobre la facturación anual real · hasta 10M€ = 11,4% · 10–15M€ = 10% · más de 15M€ = 9%", acomNoBrands:"No hay marcas registradas.", acomLocked:"bloqueada", acomUpdated:"actualizado", acomHistory:"Historial de cambios", acomNoHistory:"No hay cambios registrados hasta ahora.", aconTitle:"Contratos digitales", aconSub:"Contratos de distribución exclusiva por territorio", aconFilterActive:"Activos", aconFilterDrafts:"Borradores", aconFilterExpiring:"Por vencer (30d)", aconFilterExpired:"Vencidos", aconNoContracts:"Aún no hay contratos", aconNoContractsMsg:"Los contratos se crean cuando apruebas un distribuidor para una marca", aconExpired:"vencido", aconView:"Ver", aconActivate:"Activar", aconTerminate:"Terminar", aconNewTitle:"Nuevo contrato de distribución", aconBrandLbl:"Marca *", aconChooseBrand:"— Elegir marca —", aconDistLbl:"Distribuidor *", aconChooseDist:"— Elegir distribuidor —", aconTerritory:"Territorio", aconTerritoryPh:"p. ej. Italia, UE, Rumanía...", aconCommission:"Comisión (%)", aconMOQ:"MOQ por pedido", aconPayTerms:"Plazos de pago (días)", aconValidFrom:"Válido desde", aconValidUntil:"Válido hasta" });
Object.assign(T.de, { acomTitle:"Automatische Provisionen", acomSub:"Staffeln auf den echten Jahresumsatz · bis 10 Mio.€ = 11,4% · 10–15 Mio.€ = 10% · über 15 Mio.€ = 9%", acomNoBrands:"Keine Marken registriert.", acomLocked:"gesperrt", acomUpdated:"aktualisiert", acomHistory:"Änderungsverlauf", acomNoHistory:"Bisher keine Änderungen erfasst.", aconTitle:"Digitale Verträge", aconSub:"Exklusive Vertriebsverträge nach Gebiet", aconFilterActive:"Aktiv", aconFilterDrafts:"Entwürfe", aconFilterExpiring:"Läuft ab (30T)", aconFilterExpired:"Abgelaufen", aconNoContracts:"Noch keine Verträge", aconNoContractsMsg:"Verträge werden erstellt, wenn Sie einen Händler für eine Marke genehmigen", aconExpired:"abgelaufen", aconView:"Ansehen", aconActivate:"Aktivieren", aconTerminate:"Beenden", aconNewTitle:"Neuer Vertriebsvertrag", aconBrandLbl:"Marke *", aconChooseBrand:"— Marke wählen —", aconDistLbl:"Händler *", aconChooseDist:"— Händler wählen —", aconTerritory:"Gebiet", aconTerritoryPh:"z. B. Italien, EU, Rumänien...", aconCommission:"Provision (%)", aconMOQ:"MOQ pro Bestellung", aconPayTerms:"Zahlungsziel (Tage)", aconValidFrom:"Gültig ab", aconValidUntil:"Gültig bis" });
Object.assign(T.zh, { acomTitle:"自动佣金", acomSub:"基于真实年营收的分级 · 最高 1000万€ = 11.4% · 1000–1500万€ = 10% · 超过 1500万€ = 9%", acomNoBrands:"没有已注册的品牌。", acomLocked:"已锁定", acomUpdated:"已更新", acomHistory:"变更历史", acomNoHistory:"目前尚无变更记录。", aconTitle:"数字合同", aconSub:"按区域划分的独家分销合同", aconFilterActive:"生效中", aconFilterDrafts:"草稿", aconFilterExpiring:"即将到期（30天）", aconFilterExpired:"已过期", aconNoContracts:"还没有合同", aconNoContractsMsg:"当您为某品牌批准分销商时会创建合同", aconExpired:"已过期", aconView:"查看", aconActivate:"激活", aconTerminate:"终止", aconNewTitle:"新分销合同", aconBrandLbl:"品牌 *", aconChooseBrand:"— 选择品牌 —", aconDistLbl:"分销商 *", aconChooseDist:"— 选择分销商 —", aconTerritory:"区域", aconTerritoryPh:"例如 意大利、欧盟、罗马尼亚...", aconCommission:"佣金 (%)", aconMOQ:"每单最小起订量", aconPayTerms:"付款期限（天）", aconValidFrom:"生效日期", aconValidUntil:"有效至" });
Object.assign(T.ar, { acomTitle:"العمولات التلقائية", acomSub:"شرائح على الإيرادات السنوية الفعلية · حتى 10 مليون€ = 11.4% · 10–15 مليون€ = 10% · أكثر من 15 مليون€ = 9%", acomNoBrands:"لا توجد علامات مسجّلة.", acomLocked:"مقفلة", acomUpdated:"محدّث", acomHistory:"سجل التغييرات", acomNoHistory:"لا توجد تغييرات مسجّلة حتى الآن.", aconTitle:"العقود الرقمية", aconSub:"عقود التوزيع الحصري حسب المنطقة", aconFilterActive:"نشطة", aconFilterDrafts:"مسودات", aconFilterExpiring:"تنتهي قريبًا (30 يومًا)", aconFilterExpired:"منتهية", aconNoContracts:"لا توجد عقود بعد", aconNoContractsMsg:"تُنشأ العقود عند الموافقة على موزّع لعلامة ما", aconExpired:"منتهٍ", aconView:"عرض", aconActivate:"تفعيل", aconTerminate:"إنهاء", aconNewTitle:"عقد توزيع جديد", aconBrandLbl:"العلامة *", aconChooseBrand:"— اختر علامة —", aconDistLbl:"الموزّع *", aconChooseDist:"— اختر موزّعًا —", aconTerritory:"المنطقة", aconTerritoryPh:"مثل إيطاليا، الاتحاد الأوروبي، رومانيا...", aconCommission:"العمولة (%)", aconMOQ:"الحد الأدنى للطلب", aconPayTerms:"شروط الدفع (أيام)", aconValidFrom:"صالح من", aconValidUntil:"صالح حتى" });
Object.assign(T.en,{ afinTitle:"Financial Dashboard", afinSub:"Revenue, fees and margins calculated from the platform's real data.", afinGmv:"Sales volume (GMV)", afinFeeGross:"Your fee (gross)", afinFeeColl:"Fee collected", afinFeePend:"Fee to collect", afinToBrand:"To remit to brands", afinIva:"VAT invoiced", afinBrands:"Active brands", afinDist:"Active distributors", afinTrend:"Last 6 months trend", afinLegFee:"Your fee" });
Object.assign(T.it,{ afinTitle:"Dashboard Finanziaria", afinSub:"Ricavi, fee e margini calcolati dai dati reali della piattaforma.", afinGmv:"Volume venduto (GMV)", afinFeeGross:"Fee tua (lorda)", afinFeeColl:"Fee incassata", afinFeePend:"Fee da incassare", afinToBrand:"Da girare ai brand", afinIva:"IVA fatturata", afinBrands:"Brand attivi", afinDist:"Distributori attivi", afinTrend:"Andamento ultimi 6 mesi", afinLegFee:"Fee tua" });
Object.assign(T.fr,{ afinTitle:"Tableau de bord financier", afinSub:"Revenus, commissions et marges calculés à partir des données réelles de la plateforme.", afinGmv:"Volume des ventes (GMV)", afinFeeGross:"Votre commission (brute)", afinFeeColl:"Commission encaissée", afinFeePend:"Commission à encaisser", afinToBrand:"À reverser aux marques", afinIva:"TVA facturée", afinBrands:"Marques actives", afinDist:"Distributeurs actifs", afinTrend:"Tendance des 6 derniers mois", afinLegFee:"Votre commission" });
Object.assign(T.es,{ afinTitle:"Panel financiero", afinSub:"Ingresos, comisiones y márgenes calculados a partir de los datos reales de la plataforma.", afinGmv:"Volumen vendido (GMV)", afinFeeGross:"Tu comisión (bruta)", afinFeeColl:"Comisión cobrada", afinFeePend:"Comisión por cobrar", afinToBrand:"A transferir a las marcas", afinIva:"IVA facturado", afinBrands:"Marcas activas", afinDist:"Distribuidores activos", afinTrend:"Tendencia últimos 6 meses", afinLegFee:"Tu comisión" });
Object.assign(T.de,{ afinTitle:"Finanz-Dashboard", afinSub:"Umsätze, Gebühren und Margen, berechnet aus den realen Plattformdaten.", afinGmv:"Verkaufsvolumen (GMV)", afinFeeGross:"Deine Gebühr (brutto)", afinFeeColl:"Vereinnahmte Gebühr", afinFeePend:"Ausstehende Gebühr", afinToBrand:"An Marken weiterzuleiten", afinIva:"Fakturierte MwSt.", afinBrands:"Aktive Marken", afinDist:"Aktive Händler", afinTrend:"Trend der letzten 6 Monate", afinLegFee:"Deine Gebühr" });
Object.assign(T.zh,{ afinTitle:"财务仪表板", afinSub:"根据平台真实数据计算的收入、费用和利润。", afinGmv:"销售额 (GMV)", afinFeeGross:"你的费用（毛）", afinFeeColl:"已收取费用", afinFeePend:"待收费用", afinToBrand:"应转付给品牌", afinIva:"已开票增值税", afinBrands:"活跃品牌", afinDist:"活跃分销商", afinTrend:"近6个月趋势", afinLegFee:"你的费用" });
Object.assign(T.ar,{ afinTitle:"لوحة المعلومات المالية", afinSub:"الإيرادات والرسوم والهوامش محسوبة من بيانات المنصة الحقيقية.", afinGmv:"حجم المبيعات (GMV)", afinFeeGross:"رسومك (إجمالي)", afinFeeColl:"الرسوم المحصّلة", afinFeePend:"رسوم مستحقة التحصيل", afinToBrand:"لتحويلها إلى العلامات", afinIva:"ضريبة القيمة المضافة المفوترة", afinBrands:"العلامات النشطة", afinDist:"الموزّعون النشطون", afinTrend:"اتجاه آخر 6 أشهر", afinLegFee:"رسومك" });
Object.assign(T.en,{ aincTitle:"Collections & Split", aincSub:"For each order: brand share + your fee. You collect from the distributor and remit to the brand. The distributor doesn't see the fee.", aincFeeColl:"Your fee (collected)", aincToBrand:"To remit to brands", aincToCollect:"To collect", aincRemitTitle:"To remit to brands (orders already collected)", aincNoIban:"IBAN not set", ainchOrder:"Order", ainchDist:"Distributor", ainchBrand:"Brand", ainchTotal:"Total", ainchYourFee:"Your fee", ainchToBrand:"To brand", ainchStatus:"Status", ainchAction:"Action", aincStDone:"Completed", aincStColl:"Collected", aincStPending:"Pending", aincEmpty:"No orders to manage.", aincBtnPaid:"Remitted" });
Object.assign(T.it,{ aincTitle:"Incassi & Split", aincSub:"Per ogni ordine: quota brand + tua fee. Incassi dal distributore e bonifichi al brand. Il distributore non vede la fee.", aincFeeColl:"Fee tua (incassata)", aincToBrand:"Da bonificare ai brand", aincToCollect:"Da incassare", aincRemitTitle:"Da bonificare ai brand (ordini già incassati)", aincNoIban:"IBAN non impostato", ainchOrder:"Ordine", ainchDist:"Distributore", ainchBrand:"Brand", ainchTotal:"Totale", ainchYourFee:"Tua fee", ainchToBrand:"Al brand", ainchStatus:"Stato", ainchAction:"Azione", aincStDone:"Completato", aincStColl:"Incassato", aincStPending:"In attesa", aincEmpty:"Nessun ordine da gestire.", aincBtnPaid:"Bonificato" });
Object.assign(T.fr,{ aincTitle:"Encaissements & Répartition", aincSub:"Pour chaque commande : part de la marque + votre commission. Vous encaissez auprès du distributeur et reversez à la marque. Le distributeur ne voit pas la commission.", aincFeeColl:"Votre commission (encaissée)", aincToBrand:"À reverser aux marques", aincToCollect:"À encaisser", aincRemitTitle:"À reverser aux marques (commandes déjà encaissées)", aincNoIban:"IBAN non défini", ainchOrder:"Commande", ainchDist:"Distributeur", ainchBrand:"Marque", ainchTotal:"Total", ainchYourFee:"Votre comm.", ainchToBrand:"À la marque", ainchStatus:"Statut", ainchAction:"Action", aincStDone:"Terminé", aincStColl:"Encaissé", aincStPending:"En attente", aincEmpty:"Aucune commande à gérer.", aincBtnPaid:"Reversé" });
Object.assign(T.es,{ aincTitle:"Cobros y reparto", aincSub:"Por cada pedido: parte de la marca + tu comisión. Cobras al distribuidor y transfieres a la marca. El distribuidor no ve la comisión.", aincFeeColl:"Tu comisión (cobrada)", aincToBrand:"A transferir a las marcas", aincToCollect:"Por cobrar", aincRemitTitle:"A transferir a las marcas (pedidos ya cobrados)", aincNoIban:"IBAN no configurado", ainchOrder:"Pedido", ainchDist:"Distribuidor", ainchBrand:"Marca", ainchTotal:"Total", ainchYourFee:"Tu comisión", ainchToBrand:"A la marca", ainchStatus:"Estado", ainchAction:"Acción", aincStDone:"Completado", aincStColl:"Cobrado", aincStPending:"Pendiente", aincEmpty:"Ningún pedido que gestionar.", aincBtnPaid:"Transferido" });
Object.assign(T.de,{ aincTitle:"Inkasso & Aufteilung", aincSub:"Für jede Bestellung: Markenanteil + deine Gebühr. Du kassierst beim Händler und überweist an die Marke. Der Händler sieht die Gebühr nicht.", aincFeeColl:"Deine Gebühr (vereinnahmt)", aincToBrand:"An Marken zu überweisen", aincToCollect:"Zu kassieren", aincRemitTitle:"An Marken zu überweisen (bereits kassierte Bestellungen)", aincNoIban:"IBAN nicht festgelegt", ainchOrder:"Bestellung", ainchDist:"Händler", ainchBrand:"Marke", ainchTotal:"Gesamt", ainchYourFee:"Deine Gebühr", ainchToBrand:"An Marke", ainchStatus:"Status", ainchAction:"Aktion", aincStDone:"Abgeschlossen", aincStColl:"Kassiert", aincStPending:"Ausstehend", aincEmpty:"Keine Bestellungen zu verwalten.", aincBtnPaid:"Überwiesen" });
Object.assign(T.zh,{ aincTitle:"收款与分账", aincSub:"每笔订单：品牌份额 + 你的费用。你向分销商收款并转付给品牌。分销商看不到费用。", aincFeeColl:"你的费用（已收）", aincToBrand:"应转付给品牌", aincToCollect:"待收款", aincRemitTitle:"应转付给品牌（已收款订单）", aincNoIban:"未设置 IBAN", ainchOrder:"订单", ainchDist:"分销商", ainchBrand:"品牌", ainchTotal:"总计", ainchYourFee:"你的费用", ainchToBrand:"给品牌", ainchStatus:"状态", ainchAction:"操作", aincStDone:"已完成", aincStColl:"已收款", aincStPending:"待处理", aincEmpty:"没有需要管理的订单。", aincBtnPaid:"已转付" });
Object.assign(T.ar,{ aincTitle:"التحصيلات والتقسيم", aincSub:"لكل طلب: حصة العلامة + رسومك. تُحصّل من الموزّع وتحوّل إلى العلامة. الموزّع لا يرى الرسوم.", aincFeeColl:"رسومك (محصّلة)", aincToBrand:"لتحويلها إلى العلامات", aincToCollect:"مستحق التحصيل", aincRemitTitle:"لتحويلها إلى العلامات (طلبات محصّلة بالفعل)", aincNoIban:"لم يتم تعيين IBAN", ainchOrder:"الطلب", ainchDist:"الموزّع", ainchBrand:"العلامة", ainchTotal:"الإجمالي", ainchYourFee:"رسومك", ainchToBrand:"للعلامة", ainchStatus:"الحالة", ainchAction:"إجراء", aincStDone:"مكتمل", aincStColl:"محصّل", aincStPending:"قيد الانتظار", aincEmpty:"لا توجد طلبات لإدارتها.", aincBtnPaid:"تم التحويل" });
Object.assign(T.en,{ apayTitle:"Payment Overview", apaySub:"Global revenue across all brands and distributors", apayGmv:"Platform GMV", apayRevenue:"NexusHub Revenue (11.4%)", apayTotalOrders:"Total Orders", apayAov:"Avg Order Value", apayTxLog:"Transaction Log", apayNoTx:"No transactions yet", apayhOrder:"Order", apayhAmount:"Amount", apayhFee:"NexusHub Fee", apayhBrandShare:"Brand Share", apayhDate:"Date", apayhStatus:"Status" });
Object.assign(T.it,{ apayTitle:"Panoramica pagamenti", apaySub:"Ricavi globali su tutti i brand e distributori", apayGmv:"GMV piattaforma", apayRevenue:"Ricavi NexusHub (11,4%)", apayTotalOrders:"Ordini totali", apayAov:"Valore medio ordine", apayTxLog:"Registro transazioni", apayNoTx:"Nessuna transazione ancora", apayhOrder:"Ordine", apayhAmount:"Importo", apayhFee:"Fee NexusHub", apayhBrandShare:"Quota brand", apayhDate:"Data", apayhStatus:"Stato" });
Object.assign(T.fr,{ apayTitle:"Aperçu des paiements", apaySub:"Revenus globaux sur toutes les marques et distributeurs", apayGmv:"GMV plateforme", apayRevenue:"Revenus NexusHub (11,4 %)", apayTotalOrders:"Commandes totales", apayAov:"Valeur moy. commande", apayTxLog:"Journal des transactions", apayNoTx:"Aucune transaction pour l'instant", apayhOrder:"Commande", apayhAmount:"Montant", apayhFee:"Commission NexusHub", apayhBrandShare:"Part marque", apayhDate:"Date", apayhStatus:"Statut" });
Object.assign(T.es,{ apayTitle:"Resumen de pagos", apaySub:"Ingresos globales de todas las marcas y distribuidores", apayGmv:"GMV plataforma", apayRevenue:"Ingresos NexusHub (11,4 %)", apayTotalOrders:"Pedidos totales", apayAov:"Valor medio pedido", apayTxLog:"Registro de transacciones", apayNoTx:"Aún no hay transacciones", apayhOrder:"Pedido", apayhAmount:"Importe", apayhFee:"Comisión NexusHub", apayhBrandShare:"Parte marca", apayhDate:"Fecha", apayhStatus:"Estado" });
Object.assign(T.de,{ apayTitle:"Zahlungsübersicht", apaySub:"Gesamtumsatz über alle Marken und Händler", apayGmv:"Plattform-GMV", apayRevenue:"NexusHub-Umsatz (11,4 %)", apayTotalOrders:"Bestellungen gesamt", apayAov:"Ø Bestellwert", apayTxLog:"Transaktionsprotokoll", apayNoTx:"Noch keine Transaktionen", apayhOrder:"Bestellung", apayhAmount:"Betrag", apayhFee:"NexusHub-Gebühr", apayhBrandShare:"Markenanteil", apayhDate:"Datum", apayhStatus:"Status" });
Object.assign(T.zh,{ apayTitle:"支付概览", apaySub:"所有品牌和分销商的总收入", apayGmv:"平台 GMV", apayRevenue:"NexusHub 收入 (11.4%)", apayTotalOrders:"订单总数", apayAov:"平均订单价值", apayTxLog:"交易记录", apayNoTx:"暂无交易", apayhOrder:"订单", apayhAmount:"金额", apayhFee:"NexusHub 费用", apayhBrandShare:"品牌份额", apayhDate:"日期", apayhStatus:"状态" });
Object.assign(T.ar,{ apayTitle:"نظرة عامة على المدفوعات", apaySub:"الإيرادات الإجمالية عبر جميع العلامات والموزّعين", apayGmv:"إجمالي مبيعات المنصة (GMV)", apayRevenue:"إيرادات NexusHub (11.4%)", apayTotalOrders:"إجمالي الطلبات", apayAov:"متوسط قيمة الطلب", apayTxLog:"سجل المعاملات", apayNoTx:"لا توجد معاملات بعد", apayhOrder:"الطلب", apayhAmount:"المبلغ", apayhFee:"رسوم NexusHub", apayhBrandShare:"حصة العلامة", apayhDate:"التاريخ", apayhStatus:"الحالة" });
Object.assign(T.en,{ aissTitle:"Order issues", aissSub:"Issues reported by distributors (damaged goods, delivery errors). All tracked.", aissEmpty:"No issues.", aissDistFallback:"Distributor", aissOpen:"Open", aissClosed:"Closed", aissViewPhoto:"View photo", aissResolve:"Mark as resolved", aaudTitle:"Audit Log", aaudSub:"Automatic log of important actions: orders, collections, logins, invoices, products, contracts.", aaudhDateTime:"Date & time", aaudhUser:"User", aaudhAction:"Action", aaudhDetail:"Detail", aaudEmpty:"No actions recorded yet. They'll appear here as you use the platform.", aaudActorSystem:"System" });
Object.assign(T.it,{ aissTitle:"Segnalazioni ordini", aissSub:"Problemi segnalati dai distributori (merce danneggiata, errori di consegna). Tutto tracciato.", aissEmpty:"Nessuna segnalazione.", aissDistFallback:"Distributore", aissOpen:"Aperta", aissClosed:"Chiusa", aissViewPhoto:"Vedi foto", aissResolve:"Segna come risolta", aaudTitle:"Log attività", aaudSub:"Registro automatico delle azioni importanti: ordini, incassi, accessi, fatture, prodotti, contratti.", aaudhDateTime:"Data e ora", aaudhUser:"Utente", aaudhAction:"Azione", aaudhDetail:"Dettaglio", aaudEmpty:"Nessuna azione registrata ancora. Compariranno qui man mano che usi la piattaforma.", aaudActorSystem:"Sistema" });
Object.assign(T.fr,{ aissTitle:"Signalements de commandes", aissSub:"Problèmes signalés par les distributeurs (marchandises endommagées, erreurs de livraison). Tout est tracé.", aissEmpty:"Aucun signalement.", aissDistFallback:"Distributeur", aissOpen:"Ouverte", aissClosed:"Fermée", aissViewPhoto:"Voir la photo", aissResolve:"Marquer comme résolue", aaudTitle:"Journal d'audit", aaudSub:"Journal automatique des actions importantes : commandes, encaissements, connexions, factures, produits, contrats.", aaudhDateTime:"Date et heure", aaudhUser:"Utilisateur", aaudhAction:"Action", aaudhDetail:"Détail", aaudEmpty:"Aucune action enregistrée pour l'instant. Elles apparaîtront ici au fur et à mesure que vous utilisez la plateforme.", aaudActorSystem:"Système" });
Object.assign(T.es,{ aissTitle:"Incidencias de pedidos", aissSub:"Problemas reportados por los distribuidores (mercancía dañada, errores de entrega). Todo registrado.", aissEmpty:"Sin incidencias.", aissDistFallback:"Distribuidor", aissOpen:"Abierta", aissClosed:"Cerrada", aissViewPhoto:"Ver foto", aissResolve:"Marcar como resuelta", aaudTitle:"Registro de auditoría", aaudSub:"Registro automático de acciones importantes: pedidos, cobros, accesos, facturas, productos, contratos.", aaudhDateTime:"Fecha y hora", aaudhUser:"Usuario", aaudhAction:"Acción", aaudhDetail:"Detalle", aaudEmpty:"Aún no hay acciones registradas. Aparecerán aquí a medida que uses la plataforma.", aaudActorSystem:"Sistema" });
Object.assign(T.de,{ aissTitle:"Bestellmeldungen", aissSub:"Von Händlern gemeldete Probleme (beschädigte Ware, Lieferfehler). Alles nachverfolgt.", aissEmpty:"Keine Meldungen.", aissDistFallback:"Händler", aissOpen:"Offen", aissClosed:"Geschlossen", aissViewPhoto:"Foto ansehen", aissResolve:"Als gelöst markieren", aaudTitle:"Audit-Protokoll", aaudSub:"Automatisches Protokoll wichtiger Aktionen: Bestellungen, Inkasso, Anmeldungen, Rechnungen, Produkte, Verträge.", aaudhDateTime:"Datum & Uhrzeit", aaudhUser:"Benutzer", aaudhAction:"Aktion", aaudhDetail:"Detail", aaudEmpty:"Noch keine Aktionen erfasst. Sie erscheinen hier, während du die Plattform nutzt.", aaudActorSystem:"System" });
Object.assign(T.zh,{ aissTitle:"订单问题", aissSub:"分销商报告的问题（货物损坏、配送错误）。全部有记录。", aissEmpty:"没有问题。", aissDistFallback:"分销商", aissOpen:"未解决", aissClosed:"已关闭", aissViewPhoto:"查看照片", aissResolve:"标记为已解决", aaudTitle:"审计日志", aaudSub:"重要操作的自动日志：订单、收款、登录、发票、产品、合同。", aaudhDateTime:"日期和时间", aaudhUser:"用户", aaudhAction:"操作", aaudhDetail:"详情", aaudEmpty:"尚未记录任何操作。使用平台时会显示在此处。", aaudActorSystem:"系统" });
Object.assign(T.ar,{ aissTitle:"بلاغات الطلبات", aissSub:"مشكلات أبلغ عنها الموزّعون (بضائع تالفة، أخطاء تسليم). كل شيء مُتتبَّع.", aissEmpty:"لا توجد بلاغات.", aissDistFallback:"موزّع", aissOpen:"مفتوح", aissClosed:"مغلق", aissViewPhoto:"عرض الصورة", aissResolve:"وضع كمحلول", aaudTitle:"سجل التدقيق", aaudSub:"سجل تلقائي للإجراءات المهمة: الطلبات، التحصيلات، تسجيلات الدخول، الفواتير، المنتجات، العقود.", aaudhDateTime:"التاريخ والوقت", aaudhUser:"المستخدم", aaudhAction:"الإجراء", aaudhDetail:"التفاصيل", aaudEmpty:"لم يتم تسجيل أي إجراءات بعد. ستظهر هنا أثناء استخدامك للمنصة.", aaudActorSystem:"النظام" });
Object.assign(T.en,{ asetTitle:"Platform Settings", asetSub:"Configure NexusHub platform behaviour", asetDemoT:"Demo Mode", asetDemoD:"Show 'Watch Demo' button on login page — disable when platform is live", asetRegT:"Public Registration", asetRegD:"Allow brands and distributors to self-register", asetSepaT:"SEPA Payments", asetSepaD:"Enable automatic payment processing via SEPA Instant", asetEmailT:"Email Notifications", asetEmailD:"Send automatic emails on approval/rejection", asetScanT:"Scanner Integration", asetScanD:"Enable barcode scanner for inventory updates (mobile app)", asetUpdated:'Setting "{name}" updated', asetDanger:"Danger Zone", asetDangerD:"These actions are irreversible", asetReset:"Reset Demo Data", asetComingSoon:"Feature coming soon" });
Object.assign(T.it,{ asetTitle:"Impostazioni piattaforma", asetSub:"Configura il comportamento della piattaforma NexusHub", asetDemoT:"Modalità demo", asetDemoD:"Mostra il pulsante 'Guarda demo' nella pagina di login — disattiva quando la piattaforma è live", asetRegT:"Registrazione pubblica", asetRegD:"Permetti a brand e distributori di registrarsi da soli", asetSepaT:"Pagamenti SEPA", asetSepaD:"Abilita l'elaborazione automatica dei pagamenti tramite SEPA Instant", asetEmailT:"Notifiche email", asetEmailD:"Invia email automatiche in caso di approvazione/rifiuto", asetScanT:"Integrazione scanner", asetScanD:"Abilita lo scanner di codici a barre per aggiornare l'inventario (app mobile)", asetUpdated:'Impostazione "{name}" aggiornata', asetDanger:"Zona pericolosa", asetDangerD:"Queste azioni sono irreversibili", asetReset:"Reimposta dati demo", asetComingSoon:"Funzione in arrivo" });
Object.assign(T.fr,{ asetTitle:"Paramètres de la plateforme", asetSub:"Configurez le comportement de la plateforme NexusHub", asetDemoT:"Mode démo", asetDemoD:"Afficher le bouton « Voir la démo » sur la page de connexion — désactivez lorsque la plateforme est en ligne", asetRegT:"Inscription publique", asetRegD:"Permettre aux marques et distributeurs de s'inscrire eux-mêmes", asetSepaT:"Paiements SEPA", asetSepaD:"Activer le traitement automatique des paiements via SEPA Instant", asetEmailT:"Notifications par e-mail", asetEmailD:"Envoyer des e-mails automatiques lors de l'approbation/du rejet", asetScanT:"Intégration du scanner", asetScanD:"Activer le scanner de codes-barres pour les mises à jour d'inventaire (application mobile)", asetUpdated:'Paramètre « {name} » mis à jour', asetDanger:"Zone sensible", asetDangerD:"Ces actions sont irréversibles", asetReset:"Réinitialiser les données démo", asetComingSoon:"Fonctionnalité à venir" });
Object.assign(T.es,{ asetTitle:"Ajustes de la plataforma", asetSub:"Configura el comportamiento de la plataforma NexusHub", asetDemoT:"Modo demo", asetDemoD:"Mostrar el botón 'Ver demo' en la página de inicio de sesión — desactívalo cuando la plataforma esté en producción", asetRegT:"Registro público", asetRegD:"Permitir que marcas y distribuidores se registren por sí mismos", asetSepaT:"Pagos SEPA", asetSepaD:"Habilitar el procesamiento automático de pagos mediante SEPA Instant", asetEmailT:"Notificaciones por correo", asetEmailD:"Enviar correos automáticos en aprobación/rechazo", asetScanT:"Integración de escáner", asetScanD:"Habilitar el escáner de códigos de barras para actualizar el inventario (app móvil)", asetUpdated:'Ajuste "{name}" actualizado', asetDanger:"Zona peligrosa", asetDangerD:"Estas acciones son irreversibles", asetReset:"Restablecer datos demo", asetComingSoon:"Función próximamente" });
Object.assign(T.de,{ asetTitle:"Plattform-Einstellungen", asetSub:"Konfiguriere das Verhalten der NexusHub-Plattform", asetDemoT:"Demo-Modus", asetDemoD:"'Demo ansehen'-Button auf der Login-Seite anzeigen — deaktivieren, wenn die Plattform live ist", asetRegT:"Öffentliche Registrierung", asetRegD:"Marken und Händlern die Selbstregistrierung erlauben", asetSepaT:"SEPA-Zahlungen", asetSepaD:"Automatische Zahlungsabwicklung über SEPA Instant aktivieren", asetEmailT:"E-Mail-Benachrichtigungen", asetEmailD:"Automatische E-Mails bei Genehmigung/Ablehnung senden", asetScanT:"Scanner-Integration", asetScanD:"Barcode-Scanner für Bestandsaktualisierungen aktivieren (mobile App)", asetUpdated:'Einstellung "{name}" aktualisiert', asetDanger:"Gefahrenzone", asetDangerD:"Diese Aktionen sind unumkehrbar", asetReset:"Demo-Daten zurücksetzen", asetComingSoon:"Funktion folgt in Kürze" });
Object.assign(T.zh,{ asetTitle:"平台设置", asetSub:"配置 NexusHub 平台行为", asetDemoT:"演示模式", asetDemoD:"在登录页显示'观看演示'按钮 — 平台上线后请关闭", asetRegT:"公开注册", asetRegD:"允许品牌和分销商自行注册", asetSepaT:"SEPA 支付", asetSepaD:"启用通过 SEPA Instant 的自动支付处理", asetEmailT:"电子邮件通知", asetEmailD:"在批准/拒绝时发送自动电子邮件", asetScanT:"扫描仪集成", asetScanD:"启用条形码扫描仪以更新库存（移动应用）", asetUpdated:'设置"{name}"已更新', asetDanger:"危险区域", asetDangerD:"这些操作不可逆。", asetReset:"重置演示数据", asetComingSoon:"功能即将推出" });
Object.assign(T.ar,{ asetTitle:"إعدادات المنصة", asetSub:"اضبط سلوك منصة NexusHub", asetDemoT:"وضع العرض التجريبي", asetDemoD:"إظهار زر 'مشاهدة العرض' في صفحة تسجيل الدخول — عطّله عندما تصبح المنصة مباشرة", asetRegT:"التسجيل العام", asetRegD:"السماح للعلامات والموزّعين بالتسجيل الذاتي", asetSepaT:"مدفوعات SEPA", asetSepaD:"تفعيل معالجة المدفوعات تلقائيًا عبر SEPA Instant", asetEmailT:"إشعارات البريد الإلكتروني", asetEmailD:"إرسال رسائل بريد تلقائية عند الموافقة/الرفض", asetScanT:"تكامل الماسح", asetScanD:"تفعيل ماسح الباركود لتحديث المخزون (تطبيق الجوال)", asetUpdated:'تم تحديث الإعداد "{name}"', asetDanger:"منطقة خطرة", asetDangerD:"هذه الإجراءات لا رجعة فيها", asetReset:"إعادة تعيين بيانات العرض", asetComingSoon:"الميزة قادمة قريبًا" });
Object.assign(T.en,{ aumFullName:"Full Name", aumPhFullName:"Contact name", aumCompany:"Company Name", aumPhCompany:"Company name", aumPhone:"Phone", aumCountry:"Country", aumPhCountry:"Country", aumBankTitle:"Banking Details", aumHolder:"Account Holder", aumBank:"Bank", aumFiscalTitle:"Tax Details", aumVat:"VAT Number", aumSdi:"SDI Code", aumPayTitle:"Accepted Payment Methods", aumPaySepa:"SEPA Transfer", aumPaySepaD:"Free · 1-2 business days", aumPayCard:"Credit Card", aumPayCardD:"Fee ~1.4% · Instant", aumPaySdd:"SEPA Direct Debit", aumPaySddD:"Automatic debit · Free", aumPayUpdated:"✓ Payment method updated!", aumPayInfo:"Distributors will only see the methods the brand accepts. Click to toggle.", aumCommTitle:"Platform commission (paid by brand)", aumCommRate:"Commission % (9–11.4)", aumCommUpdated:"✓ Commission updated!", aumRevenue:"Estimated annual revenue (€)", aumRevUpdated:"✓ Estimated revenue updated!", aumCommInfo:"You set it (admin). The brand pays it, doesn't choose it. Used in contracts generated when distributors are approved.", aumBrandCode:"Brand Code", aumBrandCodeDesc:"Unique code for invoices and transfers", aumRole:"Role", aumRoleBrand:"Brand", aumRoleDist:"Distributor", aumRoleAdmin:"Admin", aumStatus:"Status", aumStPending:"Pending", aumStApproved:"Approved", aumStRejected:"Rejected", aumDocs:"Documents", aumNoDocs:"No documents uploaded yet", aumVerified:"Verified", aumUnverify:"Unverify", aumVerify:"Verify", aumDocUnverified:"Document unverified", aumDocVerified:"✓ Document verified!", aumCancel:"Cancel", aumSave:"Save Changes", aumView:"View" });
Object.assign(T.it,{ aumFullName:"Nome completo", aumPhFullName:"Nome referente", aumCompany:"Ragione sociale", aumPhCompany:"Ragione sociale", aumPhone:"Telefono", aumCountry:"Paese", aumPhCountry:"Italia", aumBankTitle:"Dati Bancari", aumHolder:"Intestatario", aumBank:"Banca", aumFiscalTitle:"Dati Fiscali", aumVat:"Partita IVA", aumSdi:"Codice SDI", aumPayTitle:"Metodi di Pagamento Accettati", aumPaySepa:"Bonifico SEPA", aumPaySepaD:"Gratuito · 1-2 giorni lavorativi", aumPayCard:"Carta di Credito", aumPayCardD:"Commissione ~1.4% · Istantaneo", aumPaySdd:"SEPA Direct Debit", aumPaySddD:"Addebito automatico · Gratuito", aumPayUpdated:"✓ Metodo pagamento aggiornato!", aumPayInfo:"I distributori vedranno solo i metodi che il brand accetta. Clicca per attivare/disattivare.", aumCommTitle:"Commissione piattaforma (a carico del brand)", aumCommRate:"Commissione % (9–11,4)", aumCommUpdated:"✓ Commissione aggiornata!", aumRevenue:"Fatturato annuo stimato (€)", aumRevUpdated:"✓ Fatturato stimato aggiornato!", aumCommInfo:"La imposti tu (admin). Il brand la paga, non la sceglie. Usata nei contratti generati all'approvazione dei distributori.", aumBrandCode:"Codice Brand", aumBrandCodeDesc:"Codice univoco per fatture e bonifici", aumRole:"Ruolo", aumRoleBrand:"Brand", aumRoleDist:"Distributore", aumRoleAdmin:"Admin", aumStatus:"Stato", aumStPending:"In attesa", aumStApproved:"Approvato", aumStRejected:"Rifiutato", aumDocs:"Documenti", aumNoDocs:"Nessun documento caricato", aumVerified:"Verificato", aumUnverify:"Annulla verifica", aumVerify:"Verifica", aumDocUnverified:"Documento non verificato", aumDocVerified:"✓ Documento verificato!", aumCancel:"Annulla", aumSave:"Salva modifiche", aumView:"Vedi" });
Object.assign(T.fr,{ aumFullName:"Nom complet", aumPhFullName:"Nom du contact", aumCompany:"Raison sociale", aumPhCompany:"Raison sociale", aumPhone:"Téléphone", aumCountry:"Pays", aumPhCountry:"Pays", aumBankTitle:"Coordonnées bancaires", aumHolder:"Titulaire", aumBank:"Banque", aumFiscalTitle:"Données fiscales", aumVat:"N° TVA", aumSdi:"Code SDI", aumPayTitle:"Moyens de paiement acceptés", aumPaySepa:"Virement SEPA", aumPaySepaD:"Gratuit · 1-2 jours ouvrés", aumPayCard:"Carte de crédit", aumPayCardD:"Frais ~1,4 % · Instantané", aumPaySdd:"Prélèvement SEPA", aumPaySddD:"Débit automatique · Gratuit", aumPayUpdated:"✓ Moyen de paiement mis à jour !", aumPayInfo:"Les distributeurs ne verront que les moyens acceptés par la marque. Cliquez pour activer/désactiver.", aumCommTitle:"Commission de la plateforme (à la charge de la marque)", aumCommRate:"Commission % (9–11,4)", aumCommUpdated:"✓ Commission mise à jour !", aumRevenue:"Chiffre d'affaires annuel estimé (€)", aumRevUpdated:"✓ Chiffre d'affaires estimé mis à jour !", aumCommInfo:"C'est vous (admin) qui la définissez. La marque la paie, ne la choisit pas. Utilisée dans les contrats générés à l'approbation des distributeurs.", aumBrandCode:"Code marque", aumBrandCodeDesc:"Code unique pour factures et virements", aumRole:"Rôle", aumRoleBrand:"Marque", aumRoleDist:"Distributeur", aumRoleAdmin:"Admin", aumStatus:"Statut", aumStPending:"En attente", aumStApproved:"Approuvé", aumStRejected:"Rejeté", aumDocs:"Documents", aumNoDocs:"Aucun document téléversé", aumVerified:"Vérifié", aumUnverify:"Annuler", aumVerify:"Vérifier", aumDocUnverified:"Document non vérifié", aumDocVerified:"✓ Document vérifié !", aumCancel:"Annuler", aumSave:"Enregistrer", aumView:"Voir" });
Object.assign(T.es,{ aumFullName:"Nombre completo", aumPhFullName:"Nombre de contacto", aumCompany:"Razón social", aumPhCompany:"Razón social", aumPhone:"Teléfono", aumCountry:"País", aumPhCountry:"País", aumBankTitle:"Datos bancarios", aumHolder:"Titular", aumBank:"Banco", aumFiscalTitle:"Datos fiscales", aumVat:"N.º de IVA", aumSdi:"Código SDI", aumPayTitle:"Métodos de pago aceptados", aumPaySepa:"Transferencia SEPA", aumPaySepaD:"Gratis · 1-2 días hábiles", aumPayCard:"Tarjeta de crédito", aumPayCardD:"Comisión ~1,4 % · Instantáneo", aumPaySdd:"Adeudo directo SEPA", aumPaySddD:"Adeudo automático · Gratis", aumPayUpdated:"✓ ¡Método de pago actualizado!", aumPayInfo:"Los distribuidores solo verán los métodos que acepta la marca. Haz clic para activar/desactivar.", aumCommTitle:"Comisión de la plataforma (a cargo de la marca)", aumCommRate:"Comisión % (9–11,4)", aumCommUpdated:"✓ ¡Comisión actualizada!", aumRevenue:"Facturación anual estimada (€)", aumRevUpdated:"✓ ¡Facturación estimada actualizada!", aumCommInfo:"La estableces tú (admin). La marca la paga, no la elige. Se usa en los contratos generados al aprobar distribuidores.", aumBrandCode:"Código de marca", aumBrandCodeDesc:"Código único para facturas y transferencias", aumRole:"Rol", aumRoleBrand:"Marca", aumRoleDist:"Distribuidor", aumRoleAdmin:"Admin", aumStatus:"Estado", aumStPending:"Pendiente", aumStApproved:"Aprobado", aumStRejected:"Rechazado", aumDocs:"Documentos", aumNoDocs:"Ningún documento subido aún", aumVerified:"Verificado", aumUnverify:"Quitar verificación", aumVerify:"Verificar", aumDocUnverified:"Documento no verificado", aumDocVerified:"✓ ¡Documento verificado!", aumCancel:"Cancelar", aumSave:"Guardar cambios", aumView:"Ver" });
Object.assign(T.de,{ aumFullName:"Vollständiger Name", aumPhFullName:"Ansprechpartner", aumCompany:"Firmenname", aumPhCompany:"Firmenname", aumPhone:"Telefon", aumCountry:"Land", aumPhCountry:"Land", aumBankTitle:"Bankdaten", aumHolder:"Kontoinhaber", aumBank:"Bank", aumFiscalTitle:"Steuerdaten", aumVat:"USt-IdNr.", aumSdi:"SDI-Code", aumPayTitle:"Akzeptierte Zahlungsmethoden", aumPaySepa:"SEPA-Überweisung", aumPaySepaD:"Kostenlos · 1-2 Werktage", aumPayCard:"Kreditkarte", aumPayCardD:"Gebühr ~1,4 % · Sofort", aumPaySdd:"SEPA-Lastschrift", aumPaySddD:"Automatischer Einzug · Kostenlos", aumPayUpdated:"✓ Zahlungsmethode aktualisiert!", aumPayInfo:"Händler sehen nur die vom Brand akzeptierten Methoden. Zum Umschalten klicken.", aumCommTitle:"Plattformprovision (zu Lasten des Brands)", aumCommRate:"Provision % (9–11,4)", aumCommUpdated:"✓ Provision aktualisiert!", aumRevenue:"Geschätzter Jahresumsatz (€)", aumRevUpdated:"✓ Geschätzter Umsatz aktualisiert!", aumCommInfo:"Du (Admin) legst sie fest. Der Brand zahlt sie, wählt sie nicht. Wird in Verträgen verwendet, die bei der Genehmigung von Händlern erstellt werden.", aumBrandCode:"Marken-Code", aumBrandCodeDesc:"Eindeutiger Code für Rechnungen und Überweisungen", aumRole:"Rolle", aumRoleBrand:"Marke", aumRoleDist:"Händler", aumRoleAdmin:"Admin", aumStatus:"Status", aumStPending:"Ausstehend", aumStApproved:"Genehmigt", aumStRejected:"Abgelehnt", aumDocs:"Dokumente", aumNoDocs:"Noch keine Dokumente hochgeladen", aumVerified:"Verifiziert", aumUnverify:"Verifizierung aufheben", aumVerify:"Verifizieren", aumDocUnverified:"Dokument nicht verifiziert", aumDocVerified:"✓ Dokument verifiziert!", aumCancel:"Abbrechen", aumSave:"Änderungen speichern", aumView:"Ansehen" });
Object.assign(T.zh,{ aumFullName:"全名", aumPhFullName:"联系人", aumCompany:"公司名称", aumPhCompany:"公司名称", aumPhone:"电话", aumCountry:"国家", aumPhCountry:"国家", aumBankTitle:"银行信息", aumHolder:"账户持有人", aumBank:"银行", aumFiscalTitle:"税务信息", aumVat:"增值税号", aumSdi:"SDI 代码", aumPayTitle:"接受的支付方式", aumPaySepa:"SEPA 转账", aumPaySepaD:"免费 · 1-2 个工作日", aumPayCard:"信用卡", aumPayCardD:"手续费 ~1.4% · 即时", aumPaySdd:"SEPA 直接借记", aumPaySddD:"自动扣款 · 免费", aumPayUpdated:"✓ 支付方式已更新！", aumPayInfo:"分销商只会看到品牌接受的方式。点击以启用/禁用。", aumCommTitle:"平台佣金（由品牌承担）", aumCommRate:"佣金 % (9–11.4)", aumCommUpdated:"✓ 佣金已更新！", aumRevenue:"预计年营收 (€)", aumRevUpdated:"✓ 预计营收已更新！", aumCommInfo:"由你（管理员）设定。品牌支付，不由其选择。用于批准分销商时生成的合同。", aumBrandCode:"品牌代码", aumBrandCodeDesc:"用于发票和转账的唯一代码", aumRole:"角色", aumRoleBrand:"品牌", aumRoleDist:"分销商", aumRoleAdmin:"管理员", aumStatus:"状态", aumStPending:"待处理", aumStApproved:"已批准", aumStRejected:"已拒绝", aumDocs:"文件", aumNoDocs:"尚未上传任何文件", aumVerified:"已验证", aumUnverify:"取消验证", aumVerify:"验证", aumDocUnverified:"文件未验证", aumDocVerified:"✓ 文件已验证！", aumCancel:"取消", aumSave:"保存更改", aumView:"查看" });
Object.assign(T.ar,{ aumFullName:"الاسم الكامل", aumPhFullName:"اسم جهة الاتصال", aumCompany:"اسم الشركة", aumPhCompany:"اسم الشركة", aumPhone:"الهاتف", aumCountry:"الدولة", aumPhCountry:"الدولة", aumBankTitle:"البيانات المصرفية", aumHolder:"صاحب الحساب", aumBank:"البنك", aumFiscalTitle:"البيانات الضريبية", aumVat:"الرقم الضريبي", aumSdi:"رمز SDI", aumPayTitle:"طرق الدفع المقبولة", aumPaySepa:"تحويل SEPA", aumPaySepaD:"مجاني · 1-2 يوم عمل", aumPayCard:"بطاقة ائتمان", aumPayCardD:"رسوم ~1.4% · فوري", aumPaySdd:"خصم مباشر SEPA", aumPaySddD:"خصم تلقائي · مجاني", aumPayUpdated:"✓ تم تحديث طريقة الدفع!", aumPayInfo:"سيرى الموزّعون فقط الطرق التي تقبلها العلامة. انقر للتفعيل/الإلغاء.", aumCommTitle:"عمولة المنصة (على حساب العلامة)", aumCommRate:"العمولة % (9–11.4)", aumCommUpdated:"✓ تم تحديث العمولة!", aumRevenue:"الإيراد السنوي المقدّر (€)", aumRevUpdated:"✓ تم تحديث الإيراد المقدّر!", aumCommInfo:"أنت (المسؤول) من يحدّدها. العلامة تدفعها ولا تختارها. تُستخدم في العقود المُنشأة عند الموافقة على الموزّعين.", aumBrandCode:"رمز العلامة", aumBrandCodeDesc:"رمز فريد للفواتير والتحويلات", aumRole:"الدور", aumRoleBrand:"علامة", aumRoleDist:"موزّع", aumRoleAdmin:"مسؤول", aumStatus:"الحالة", aumStPending:"قيد الانتظار", aumStApproved:"موافق عليه", aumStRejected:"مرفوض", aumDocs:"المستندات", aumNoDocs:"لم يتم رفع أي مستندات بعد", aumVerified:"موثّق", aumUnverify:"إلغاء التوثيق", aumVerify:"توثيق", aumDocUnverified:"المستند غير موثّق", aumDocVerified:"✓ تم توثيق المستند!", aumCancel:"إلغاء", aumSave:"حفظ التغييرات", aumView:"عرض" });
Object.assign(T.en,{ amrgTitle:"Margins · internal view", amrgSub:"NexusHub's real economics: commissions collected minus costs. Net margin and ROI per order.", amrgLockPre:"GigaTrade internal data. Costs and net margin ", amrgLockBold:"are never visible", amrgLockPost:" to brands or distributors (separate table, admin-only access).", amrgGmv:"GMV (transacted)", amrgFee:"Commission revenue", amrgCosts:"Costs (Stripe + op.)", amrgNet:"Net margin", amrgAvg:"Average margin", amrgFeeEst:"Estimated fee on orders without split:", amrgFeeEstNote:"(orders with a real split use the actual values)", amrgLoading:"Loading...", amrgEmpty:"No orders to analyze.", amrghOrder:"Order", amrghBrand:"Brand", amrghComm:"Commission", amrghOpCost:"Operating cost", amrgSave:"Save", alogTitle:"European Logistics Control Tower", alogSub:"Turin Hub · stock, preparation, shipments and alerts", alogStock:"Units in stock", alogReserved:"Reserved", alogToPrep:"To prepare", alogTransit:"In transit", alogDelivered:"Delivered", alogLowOut:"Low/out", alogPipeline:"Orders in progress", alogNoPipeline:"No orders to prepare or in transit.", alogh1Order:"Order", alogh1Status:"Status", alogh1Courier:"Courier", alogh1Value:"Value", alogWhHealth:"Warehouse health", alogh2Product:"Product", alogh2Brand:"Brand", alogh2Avail:"Available", alogh2Reserved:"Reserved", alogh2Status:"Status", alogNoProducts:"No products in the warehouse.", alogStOut:"Out of stock", alogStLow:"Low" });
Object.assign(T.it,{ amrgTitle:"Margini · vista interna", amrgSub:"Economia reale di NexusHub: commissioni incassate meno costi. Margine netto e ROI per ordine.", amrgLockPre:"Dati interni GigaTrade. Costi e margine netto ", amrgLockBold:"non sono mai visibili", amrgLockPost:" a brand o distributori (tabella separata, accesso solo admin).", amrgGmv:"GMV (transato)", amrgFee:"Ricavo commissioni", amrgCosts:"Costi (Stripe + op.)", amrgNet:"Margine netto", amrgAvg:"Margine medio", amrgFeeEst:"Fee stimata su ordini senza split:", amrgFeeEstNote:"(gli ordini con split reale usano i valori effettivi)", amrgLoading:"Caricamento...", amrgEmpty:"Nessun ordine da analizzare.", amrghOrder:"Ordine", amrghBrand:"Brand", amrghComm:"Commissione", amrghOpCost:"Costo operativo", amrgSave:"Salva", alogTitle:"Torre di controllo logistica europea", alogSub:"Hub Torino · stock, preparazione, spedizioni e allerte", alogStock:"Unità in stock", alogReserved:"Riservate", alogToPrep:"Da preparare", alogTransit:"In transito", alogDelivered:"Consegnati", alogLowOut:"Basso/esaurito", alogPipeline:"Ordini in lavorazione", alogNoPipeline:"Nessun ordine da preparare o in transito.", alogh1Order:"Ordine", alogh1Status:"Stato", alogh1Courier:"Corriere", alogh1Value:"Valore", alogWhHealth:"Salute magazzino", alogh2Product:"Prodotto", alogh2Brand:"Brand", alogh2Avail:"Disponibili", alogh2Reserved:"Riservate", alogh2Status:"Stato", alogNoProducts:"Nessun prodotto a magazzino.", alogStOut:"Esaurito", alogStLow:"Basso" });
Object.assign(T.fr,{ amrgTitle:"Marges · vue interne", amrgSub:"L'économie réelle de NexusHub : commissions encaissées moins les coûts. Marge nette et ROI par commande.", amrgLockPre:"Données internes GigaTrade. Les coûts et la marge nette ", amrgLockBold:"ne sont jamais visibles", amrgLockPost:" pour les marques ou distributeurs (table séparée, accès admin uniquement).", amrgGmv:"GMV (transigé)", amrgFee:"Revenus de commissions", amrgCosts:"Coûts (Stripe + op.)", amrgNet:"Marge nette", amrgAvg:"Marge moyenne", amrgFeeEst:"Commission estimée sur les commandes sans répartition :", amrgFeeEstNote:"(les commandes avec répartition réelle utilisent les valeurs effectives)", amrgLoading:"Chargement...", amrgEmpty:"Aucune commande à analyser.", amrghOrder:"Commande", amrghBrand:"Marque", amrghComm:"Commission", amrghOpCost:"Coût opérationnel", amrgSave:"Enregistrer", alogTitle:"Tour de contrôle logistique européenne", alogSub:"Hub de Turin · stock, préparation, expéditions et alertes", alogStock:"Unités en stock", alogReserved:"Réservées", alogToPrep:"À préparer", alogTransit:"En transit", alogDelivered:"Livrés", alogLowOut:"Bas/épuisé", alogPipeline:"Commandes en cours", alogNoPipeline:"Aucune commande à préparer ou en transit.", alogh1Order:"Commande", alogh1Status:"Statut", alogh1Courier:"Transporteur", alogh1Value:"Valeur", alogWhHealth:"Santé de l'entrepôt", alogh2Product:"Produit", alogh2Brand:"Marque", alogh2Avail:"Disponibles", alogh2Reserved:"Réservées", alogh2Status:"Statut", alogNoProducts:"Aucun produit en entrepôt.", alogStOut:"Épuisé", alogStLow:"Bas" });
Object.assign(T.es,{ amrgTitle:"Márgenes · vista interna", amrgSub:"La economía real de NexusHub: comisiones cobradas menos costes. Margen neto y ROI por pedido.", amrgLockPre:"Datos internos de GigaTrade. Los costes y el margen neto ", amrgLockBold:"nunca son visibles", amrgLockPost:" para marcas o distribuidores (tabla separada, acceso solo admin).", amrgGmv:"GMV (transaccionado)", amrgFee:"Ingresos por comisiones", amrgCosts:"Costes (Stripe + op.)", amrgNet:"Margen neto", amrgAvg:"Margen medio", amrgFeeEst:"Comisión estimada en pedidos sin reparto:", amrgFeeEstNote:"(los pedidos con reparto real usan los valores efectivos)", amrgLoading:"Cargando...", amrgEmpty:"Ningún pedido que analizar.", amrghOrder:"Pedido", amrghBrand:"Marca", amrghComm:"Comisión", amrghOpCost:"Coste operativo", amrgSave:"Guardar", alogTitle:"Torre de control logística europea", alogSub:"Hub de Turín · stock, preparación, envíos y alertas", alogStock:"Unidades en stock", alogReserved:"Reservadas", alogToPrep:"Por preparar", alogTransit:"En tránsito", alogDelivered:"Entregados", alogLowOut:"Bajo/agotado", alogPipeline:"Pedidos en curso", alogNoPipeline:"Ningún pedido por preparar o en tránsito.", alogh1Order:"Pedido", alogh1Status:"Estado", alogh1Courier:"Transportista", alogh1Value:"Valor", alogWhHealth:"Salud del almacén", alogh2Product:"Producto", alogh2Brand:"Marca", alogh2Avail:"Disponibles", alogh2Reserved:"Reservadas", alogh2Status:"Estado", alogNoProducts:"Ningún producto en el almacén.", alogStOut:"Agotado", alogStLow:"Bajo" });
Object.assign(T.de,{ amrgTitle:"Margen · interne Ansicht", amrgSub:"Die echte Wirtschaftlichkeit von NexusHub: vereinnahmte Provisionen minus Kosten. Nettomarge und ROI pro Bestellung.", amrgLockPre:"GigaTrade-interne Daten. Kosten und Nettomarge ", amrgLockBold:"sind niemals sichtbar", amrgLockPost:" für Marken oder Händler (separate Tabelle, nur Admin-Zugriff).", amrgGmv:"GMV (Umsatz)", amrgFee:"Provisionsumsatz", amrgCosts:"Kosten (Stripe + Betr.)", amrgNet:"Nettomarge", amrgAvg:"Durchschnittsmarge", amrgFeeEst:"Geschätzte Gebühr bei Bestellungen ohne Split:", amrgFeeEstNote:"(Bestellungen mit echtem Split verwenden die tatsächlichen Werte)", amrgLoading:"Wird geladen...", amrgEmpty:"Keine Bestellungen zu analysieren.", amrghOrder:"Bestellung", amrghBrand:"Marke", amrghComm:"Provision", amrghOpCost:"Betriebskosten", amrgSave:"Speichern", alogTitle:"Europäischer Logistik-Kontrollturm", alogSub:"Hub Turin · Bestand, Vorbereitung, Versand und Warnungen", alogStock:"Einheiten auf Lager", alogReserved:"Reserviert", alogToPrep:"Vorzubereiten", alogTransit:"Unterwegs", alogDelivered:"Zugestellt", alogLowOut:"Niedrig/leer", alogPipeline:"Bestellungen in Bearbeitung", alogNoPipeline:"Keine Bestellungen vorzubereiten oder unterwegs.", alogh1Order:"Bestellung", alogh1Status:"Status", alogh1Courier:"Kurier", alogh1Value:"Wert", alogWhHealth:"Lager-Zustand", alogh2Product:"Produkt", alogh2Brand:"Marke", alogh2Avail:"Verfügbar", alogh2Reserved:"Reserviert", alogh2Status:"Status", alogNoProducts:"Keine Produkte im Lager.", alogStOut:"Ausverkauft", alogStLow:"Niedrig" });
Object.assign(T.zh,{ amrgTitle:"利润 · 内部视图", amrgSub:"NexusHub 的真实经济：已收佣金减去成本。每单净利润和 ROI。", amrgLockPre:"GigaTrade 内部数据。成本和净利润 ", amrgLockBold:"永远不可见", amrgLockPost:" 给品牌或分销商（独立表，仅管理员访问）。", amrgGmv:"GMV（交易额）", amrgFee:"佣金收入", amrgCosts:"成本（Stripe + 运营）", amrgNet:"净利润", amrgAvg:"平均利润率", amrgFeeEst:"无分账订单的预估费用：", amrgFeeEstNote:"（有真实分账的订单使用实际值）", amrgLoading:"加载中...", amrgEmpty:"没有可分析的订单。", amrghOrder:"订单", amrghBrand:"品牌", amrghComm:"佣金", amrghOpCost:"运营成本", amrgSave:"保存", alogTitle:"欧洲物流控制塔", alogSub:"都灵枢纽 · 库存、备货、发货和警报", alogStock:"库存单位", alogReserved:"已预留", alogToPrep:"待备货", alogTransit:"运输中", alogDelivered:"已送达", alogLowOut:"低/缺货", alogPipeline:"处理中的订单", alogNoPipeline:"没有待备货或运输中的订单。", alogh1Order:"订单", alogh1Status:"状态", alogh1Courier:"快递", alogh1Value:"价值", alogWhHealth:"仓库健康度", alogh2Product:"产品", alogh2Brand:"品牌", alogh2Avail:"可用", alogh2Reserved:"已预留", alogh2Status:"状态", alogNoProducts:"仓库中没有产品。", alogStOut:"缺货", alogStLow:"低" });
Object.assign(T.ar,{ amrgTitle:"الهوامش · عرض داخلي", amrgSub:"الاقتصاد الحقيقي لـ NexusHub: العمولات المحصّلة ناقص التكاليف. صافي الهامش والعائد لكل طلب.", amrgLockPre:"بيانات GigaTrade الداخلية. التكاليف وصافي الهامش ", amrgLockBold:"غير مرئية أبدًا", amrgLockPost:" للعلامات أو الموزّعين (جدول منفصل، وصول للمسؤول فقط).", amrgGmv:"GMV (المتداول)", amrgFee:"إيراد العمولات", amrgCosts:"التكاليف (Stripe + تشغيلية)", amrgNet:"صافي الهامش", amrgAvg:"متوسط الهامش", amrgFeeEst:"الرسوم المقدّرة على الطلبات دون تقسيم:", amrgFeeEstNote:"(الطلبات ذات التقسيم الحقيقي تستخدم القيم الفعلية)", amrgLoading:"جارٍ التحميل...", amrgEmpty:"لا توجد طلبات لتحليلها.", amrghOrder:"الطلب", amrghBrand:"العلامة", amrghComm:"العمولة", amrghOpCost:"التكلفة التشغيلية", amrgSave:"حفظ", alogTitle:"برج التحكم اللوجستي الأوروبي", alogSub:"مركز تورينو · المخزون، التحضير، الشحنات والتنبيهات", alogStock:"الوحدات في المخزون", alogReserved:"محجوزة", alogToPrep:"قيد التحضير", alogTransit:"قيد النقل", alogDelivered:"تم التسليم", alogLowOut:"منخفض/نفد", alogPipeline:"الطلبات قيد المعالجة", alogNoPipeline:"لا توجد طلبات للتحضير أو قيد النقل.", alogh1Order:"الطلب", alogh1Status:"الحالة", alogh1Courier:"شركة الشحن", alogh1Value:"القيمة", alogWhHealth:"حالة المستودع", alogh2Product:"المنتج", alogh2Brand:"العلامة", alogh2Avail:"المتاح", alogh2Reserved:"محجوزة", alogh2Status:"الحالة", alogNoProducts:"لا توجد منتجات في المستودع.", alogStOut:"نفد", alogStLow:"منخفض" });
Object.assign(T.en,{ acmpTitle:"Compliance & Documents Vault", acmpSub:"Central archive: company documents, certificates, authorizations, customs, quality", acmpUpload:"Upload document", acmpTotal:"Total documents", acmpExpiring:"Expiring (30d)", acmpExpired:"Expired", acmpEmptyTitle:"Empty vault", acmpEmptyMsg:"Upload the first document (registration, certificate, authorization...).", acmphDoc:"Document", acmphOwner:"Owner", acmphCat:"Category", acmphExpiry:"Expiry", acmphUploaded:"Uploaded", acmphActions:"Actions", acmpDownload:"Download", acmpDelete:"Delete", acmpStExpired:"Expired", acmpStExpiring:"Expiring", acmpStValid:"Valid", acmpCatCompany:"Company documents", acmpCatCert:"Certificates", acmpCatSafety:"Safety sheets", acmpCatImport:"Import / Customs", acmpCatAuth:"Authorizations", acmpCatPrice:"Price lists", acmpCatMkt:"Marketing", acmpCatQuality:"Quality reports", acmpCatArrival:"Goods photos", acmpCatAmazon:"Amazon / Retail", acmpCatOther:"Other", acmpModalTitle:"Upload document to vault", acmpLoading:"Loading...", acmpSave:"Upload", acmpFOwner:"Owner (account) *", acmpFChooseAccount:"— Choose account —", acmpFCategory:"Category", acmpFName:"Document name (optional)", acmpFNamePh:"e.g. Company registration 2026", acmpFFile:"File *", acmpFExpiry:"Expiry date (optional)", acmpFNotes:"Notes (optional)" });
Object.assign(T.it,{ acmpTitle:"Compliance & Archivio documenti", acmpSub:"Archivio centrale: documenti aziendali, certificati, autorizzazioni, dogana, qualità", acmpUpload:"Carica documento", acmpTotal:"Documenti totali", acmpExpiring:"In scadenza (30gg)", acmpExpired:"Scaduti", acmpEmptyTitle:"Vault vuoto", acmpEmptyMsg:"Carica il primo documento (visura, certificato, autorizzazione...).", acmphDoc:"Documento", acmphOwner:"Titolare", acmphCat:"Categoria", acmphExpiry:"Scadenza", acmphUploaded:"Caricato", acmphActions:"Azioni", acmpDownload:"Scarica", acmpDelete:"Elimina", acmpStExpired:"Scaduto", acmpStExpiring:"In scadenza", acmpStValid:"Valido", acmpCatCompany:"Documenti aziendali", acmpCatCert:"Certificati", acmpCatSafety:"Schede sicurezza", acmpCatImport:"Import / Dogana", acmpCatAuth:"Autorizzazioni", acmpCatPrice:"Listini", acmpCatMkt:"Marketing", acmpCatQuality:"Report qualità", acmpCatArrival:"Foto merce", acmpCatAmazon:"Amazon / Retail", acmpCatOther:"Altro", acmpModalTitle:"Carica documento nel vault", acmpLoading:"Caricamento...", acmpSave:"Carica", acmpFOwner:"Titolare (account) *", acmpFChooseAccount:"— Scegli account —", acmpFCategory:"Categoria", acmpFName:"Nome documento (opzionale)", acmpFNamePh:"es. Visura camerale 2026", acmpFFile:"File *", acmpFExpiry:"Data scadenza (opzionale)", acmpFNotes:"Note (opzionale)" });
Object.assign(T.fr,{ acmpTitle:"Conformité & Coffre de documents", acmpSub:"Archive centrale : documents d'entreprise, certificats, autorisations, douane, qualité", acmpUpload:"Téléverser un document", acmpTotal:"Documents au total", acmpExpiring:"Expirant (30j)", acmpExpired:"Expirés", acmpEmptyTitle:"Coffre vide", acmpEmptyMsg:"Téléversez le premier document (extrait, certificat, autorisation...).", acmphDoc:"Document", acmphOwner:"Titulaire", acmphCat:"Catégorie", acmphExpiry:"Expiration", acmphUploaded:"Téléversé", acmphActions:"Actions", acmpDownload:"Télécharger", acmpDelete:"Supprimer", acmpStExpired:"Expiré", acmpStExpiring:"Expire bientôt", acmpStValid:"Valide", acmpCatCompany:"Documents d'entreprise", acmpCatCert:"Certificats", acmpCatSafety:"Fiches de sécurité", acmpCatImport:"Import / Douane", acmpCatAuth:"Autorisations", acmpCatPrice:"Tarifs", acmpCatMkt:"Marketing", acmpCatQuality:"Rapports qualité", acmpCatArrival:"Photos marchandise", acmpCatAmazon:"Amazon / Retail", acmpCatOther:"Autre", acmpModalTitle:"Téléverser un document dans le coffre", acmpLoading:"Chargement...", acmpSave:"Téléverser", acmpFOwner:"Titulaire (compte) *", acmpFChooseAccount:"— Choisir un compte —", acmpFCategory:"Catégorie", acmpFName:"Nom du document (facultatif)", acmpFNamePh:"ex. Extrait Kbis 2026", acmpFFile:"Fichier *", acmpFExpiry:"Date d'expiration (facultatif)", acmpFNotes:"Notes (facultatif)" });
Object.assign(T.es,{ acmpTitle:"Cumplimiento y bóveda de documentos", acmpSub:"Archivo central: documentos de empresa, certificados, autorizaciones, aduana, calidad", acmpUpload:"Subir documento", acmpTotal:"Documentos totales", acmpExpiring:"Por vencer (30d)", acmpExpired:"Vencidos", acmpEmptyTitle:"Bóveda vacía", acmpEmptyMsg:"Sube el primer documento (registro, certificado, autorización...).", acmphDoc:"Documento", acmphOwner:"Titular", acmphCat:"Categoría", acmphExpiry:"Vencimiento", acmphUploaded:"Subido", acmphActions:"Acciones", acmpDownload:"Descargar", acmpDelete:"Eliminar", acmpStExpired:"Vencido", acmpStExpiring:"Por vencer", acmpStValid:"Válido", acmpCatCompany:"Documentos de empresa", acmpCatCert:"Certificados", acmpCatSafety:"Fichas de seguridad", acmpCatImport:"Importación / Aduana", acmpCatAuth:"Autorizaciones", acmpCatPrice:"Listas de precios", acmpCatMkt:"Marketing", acmpCatQuality:"Informes de calidad", acmpCatArrival:"Fotos de mercancía", acmpCatAmazon:"Amazon / Retail", acmpCatOther:"Otro", acmpModalTitle:"Subir documento a la bóveda", acmpLoading:"Cargando...", acmpSave:"Subir", acmpFOwner:"Titular (cuenta) *", acmpFChooseAccount:"— Elegir cuenta —", acmpFCategory:"Categoría", acmpFName:"Nombre del documento (opcional)", acmpFNamePh:"ej. Registro mercantil 2026", acmpFFile:"Archivo *", acmpFExpiry:"Fecha de vencimiento (opcional)", acmpFNotes:"Notas (opcional)" });
Object.assign(T.de,{ acmpTitle:"Compliance & Dokumententresor", acmpSub:"Zentrales Archiv: Firmendokumente, Zertifikate, Genehmigungen, Zoll, Qualität", acmpUpload:"Dokument hochladen", acmpTotal:"Dokumente gesamt", acmpExpiring:"Läuft ab (30 Tg.)", acmpExpired:"Abgelaufen", acmpEmptyTitle:"Tresor leer", acmpEmptyMsg:"Lade das erste Dokument hoch (Auszug, Zertifikat, Genehmigung...).", acmphDoc:"Dokument", acmphOwner:"Inhaber", acmphCat:"Kategorie", acmphExpiry:"Ablauf", acmphUploaded:"Hochgeladen", acmphActions:"Aktionen", acmpDownload:"Herunterladen", acmpDelete:"Löschen", acmpStExpired:"Abgelaufen", acmpStExpiring:"Läuft ab", acmpStValid:"Gültig", acmpCatCompany:"Firmendokumente", acmpCatCert:"Zertifikate", acmpCatSafety:"Sicherheitsdatenblätter", acmpCatImport:"Import / Zoll", acmpCatAuth:"Genehmigungen", acmpCatPrice:"Preislisten", acmpCatMkt:"Marketing", acmpCatQuality:"Qualitätsberichte", acmpCatArrival:"Warenfotos", acmpCatAmazon:"Amazon / Retail", acmpCatOther:"Sonstiges", acmpModalTitle:"Dokument in den Tresor hochladen", acmpLoading:"Wird geladen...", acmpSave:"Hochladen", acmpFOwner:"Inhaber (Konto) *", acmpFChooseAccount:"— Konto wählen —", acmpFCategory:"Kategorie", acmpFName:"Dokumentname (optional)", acmpFNamePh:"z.B. Handelsregisterauszug 2026", acmpFFile:"Datei *", acmpFExpiry:"Ablaufdatum (optional)", acmpFNotes:"Notizen (optional)" });
Object.assign(T.zh,{ acmpTitle:"合规与文档库", acmpSub:"中央档案库：公司文档、证书、授权、海关、质量", acmpUpload:"上传文档", acmpTotal:"文档总数", acmpExpiring:"即将到期（30天）", acmpExpired:"已过期", acmpEmptyTitle:"库为空", acmpEmptyMsg:"上传第一个文档（登记、证书、授权……）。", acmphDoc:"文档", acmphOwner:"持有人", acmphCat:"类别", acmphExpiry:"到期", acmphUploaded:"上传时间", acmphActions:"操作", acmpDownload:"下载", acmpDelete:"删除", acmpStExpired:"已过期", acmpStExpiring:"即将到期", acmpStValid:"有效", acmpCatCompany:"公司文档", acmpCatCert:"证书", acmpCatSafety:"安全表", acmpCatImport:"进口/海关", acmpCatAuth:"授权", acmpCatPrice:"价目表", acmpCatMkt:"营销", acmpCatQuality:"质量报告", acmpCatArrival:"货品照片", acmpCatAmazon:"Amazon / 零售", acmpCatOther:"其他", acmpModalTitle:"上传文档到库", acmpLoading:"加载中...", acmpSave:"上传", acmpFOwner:"持有人（账户）*", acmpFChooseAccount:"— 选择账户 —", acmpFCategory:"类别", acmpFName:"文档名称（可选）", acmpFNamePh:"例如 2026 公司登记", acmpFFile:"文件 *", acmpFExpiry:"到期日期（可选）", acmpFNotes:"备注（可选）" });
Object.assign(T.ar,{ acmpTitle:"الامتثال وخزنة المستندات", acmpSub:"الأرشيف المركزي: مستندات الشركة، الشهادات، التصاريح، الجمارك، الجودة", acmpUpload:"رفع مستند", acmpTotal:"إجمالي المستندات", acmpExpiring:"تنتهي قريبًا (30 يومًا)", acmpExpired:"منتهية", acmpEmptyTitle:"الخزنة فارغة", acmpEmptyMsg:"ارفع أول مستند (سجل، شهادة، تصريح...).", acmphDoc:"المستند", acmphOwner:"المالك", acmphCat:"الفئة", acmphExpiry:"تاريخ الانتهاء", acmphUploaded:"تاريخ الرفع", acmphActions:"إجراءات", acmpDownload:"تنزيل", acmpDelete:"حذف", acmpStExpired:"منتهٍ", acmpStExpiring:"تنتهي قريبًا", acmpStValid:"صالح", acmpCatCompany:"مستندات الشركة", acmpCatCert:"الشهادات", acmpCatSafety:"صحائف السلامة", acmpCatImport:"الاستيراد / الجمارك", acmpCatAuth:"التصاريح", acmpCatPrice:"قوائم الأسعار", acmpCatMkt:"التسويق", acmpCatQuality:"تقارير الجودة", acmpCatArrival:"صور البضائع", acmpCatAmazon:"Amazon / التجزئة", acmpCatOther:"أخرى", acmpModalTitle:"رفع مستند إلى الخزنة", acmpLoading:"جارٍ التحميل...", acmpSave:"رفع", acmpFOwner:"المالك (الحساب) *", acmpFChooseAccount:"— اختر حسابًا —", acmpFCategory:"الفئة", acmpFName:"اسم المستند (اختياري)", acmpFNamePh:"مثال: سجل تجاري 2026", acmpFFile:"ملف *", acmpFExpiry:"تاريخ الانتهاء (اختياري)", acmpFNotes:"ملاحظات (اختياري)" });
Object.assign(T.en,{ aretTitle:"Retail Expansion Desk", aretSub:"Pipeline toward Sephora, Douglas, perfumeries and European retail", aretAdd:"Add target", aretTotal:"Total targets", aretActive:"In negotiation", aretWon:"Closed", aretAvgProb:"Avg prob.", aretEmptyTitle:"No retail targets", aretEmptyMsg:"Add the first retailer to contact (e.g. Sephora Italy).", arethRetailer:"Retailer", arethCountry:"Country", arethBuyer:"Buyer", arethBrand:"Brand", arethStatus:"Status", arethProb:"Prob.", arethFollowup:"Follow-up", arethActions:"Actions", aretEdit:"Edit", aretDelete:"Delete", aretStLead:"Lead", aretStContacted:"Contacted", aretStSamples:"Samples", aretStMeeting:"Meeting", aretStNego:"Negotiation", aretStWon:"Won ✓", aretStLost:"Lost", aretModalEdit:"Edit retail target", aretModalNew:"New retail target", aretSave:"Save", aretFRetailer:"Retailer *", aretFRetailerPh:"e.g. Sephora Italy", aretFCountry:"Country", aretFCountryPh:"e.g. Italy", aretFBuyer:"Buyer / contact", aretFBuyerEmail:"Buyer email", aretFBrand:"Candidate brand", aretFNone:"— None —", aretFProducts:"Candidate products", aretFStage:"Status", aretFProb:"Closing probability (%)", aretFFollowup:"Next follow-up", aretFSamples:"Samples sent", aretFNotes:"Notes" });
Object.assign(T.it,{ aretTitle:"Desk espansione retail", aretSub:"Pipeline verso Sephora, Douglas, profumerie e retail europeo", aretAdd:"Aggiungi target", aretTotal:"Target totali", aretActive:"In trattativa", aretWon:"Chiusi", aretAvgProb:"Prob. media", aretEmptyTitle:"Nessun target retail", aretEmptyMsg:"Aggiungi il primo retailer da contattare (es. Sephora Italia).", arethRetailer:"Retailer", arethCountry:"Paese", arethBuyer:"Buyer", arethBrand:"Brand", arethStatus:"Stato", arethProb:"Prob.", arethFollowup:"Follow-up", arethActions:"Azioni", aretEdit:"Modifica", aretDelete:"Elimina", aretStLead:"Lead", aretStContacted:"Contattato", aretStSamples:"Campioni", aretStMeeting:"Meeting", aretStNego:"Trattativa", aretStWon:"Chiuso ✓", aretStLost:"Perso", aretModalEdit:"Modifica target retail", aretModalNew:"Nuovo target retail", aretSave:"Salva", aretFRetailer:"Retailer *", aretFRetailerPh:"es. Sephora Italia", aretFCountry:"Paese", aretFCountryPh:"es. Italia", aretFBuyer:"Buyer / contatto", aretFBuyerEmail:"Email buyer", aretFBrand:"Brand candidato", aretFNone:"— Nessuno —", aretFProducts:"Prodotti candidati", aretFStage:"Stato", aretFProb:"Probabilità chiusura (%)", aretFFollowup:"Prossimo follow-up", aretFSamples:"Campioni inviati", aretFNotes:"Note" });
Object.assign(T.fr,{ aretTitle:"Bureau d'expansion retail", aretSub:"Pipeline vers Sephora, Douglas, parfumeries et retail européen", aretAdd:"Ajouter une cible", aretTotal:"Cibles totales", aretActive:"En négociation", aretWon:"Conclus", aretAvgProb:"Prob. moy.", aretEmptyTitle:"Aucune cible retail", aretEmptyMsg:"Ajoutez le premier détaillant à contacter (ex. Sephora Italie).", arethRetailer:"Détaillant", arethCountry:"Pays", arethBuyer:"Acheteur", arethBrand:"Marque", arethStatus:"Statut", arethProb:"Prob.", arethFollowup:"Relance", arethActions:"Actions", aretEdit:"Modifier", aretDelete:"Supprimer", aretStLead:"Piste", aretStContacted:"Contacté", aretStSamples:"Échantillons", aretStMeeting:"Réunion", aretStNego:"Négociation", aretStWon:"Conclu ✓", aretStLost:"Perdu", aretModalEdit:"Modifier la cible retail", aretModalNew:"Nouvelle cible retail", aretSave:"Enregistrer", aretFRetailer:"Détaillant *", aretFRetailerPh:"ex. Sephora Italie", aretFCountry:"Pays", aretFCountryPh:"ex. Italie", aretFBuyer:"Acheteur / contact", aretFBuyerEmail:"E-mail acheteur", aretFBrand:"Marque candidate", aretFNone:"— Aucun —", aretFProducts:"Produits candidats", aretFStage:"Statut", aretFProb:"Probabilité de conclusion (%)", aretFFollowup:"Prochaine relance", aretFSamples:"Échantillons envoyés", aretFNotes:"Notes" });
Object.assign(T.es,{ aretTitle:"Mesa de expansión retail", aretSub:"Pipeline hacia Sephora, Douglas, perfumerías y retail europeo", aretAdd:"Añadir objetivo", aretTotal:"Objetivos totales", aretActive:"En negociación", aretWon:"Cerrados", aretAvgProb:"Prob. media", aretEmptyTitle:"Sin objetivos retail", aretEmptyMsg:"Añade el primer retailer a contactar (ej. Sephora Italia).", arethRetailer:"Retailer", arethCountry:"País", arethBuyer:"Comprador", arethBrand:"Marca", arethStatus:"Estado", arethProb:"Prob.", arethFollowup:"Seguimiento", arethActions:"Acciones", aretEdit:"Editar", aretDelete:"Eliminar", aretStLead:"Lead", aretStContacted:"Contactado", aretStSamples:"Muestras", aretStMeeting:"Reunión", aretStNego:"Negociación", aretStWon:"Cerrado ✓", aretStLost:"Perdido", aretModalEdit:"Editar objetivo retail", aretModalNew:"Nuevo objetivo retail", aretSave:"Guardar", aretFRetailer:"Retailer *", aretFRetailerPh:"ej. Sephora Italia", aretFCountry:"País", aretFCountryPh:"ej. Italia", aretFBuyer:"Comprador / contacto", aretFBuyerEmail:"Email comprador", aretFBrand:"Marca candidata", aretFNone:"— Ninguno —", aretFProducts:"Productos candidatos", aretFStage:"Estado", aretFProb:"Probabilidad de cierre (%)", aretFFollowup:"Próximo seguimiento", aretFSamples:"Muestras enviadas", aretFNotes:"Notas" });
Object.assign(T.de,{ aretTitle:"Retail-Expansion-Desk", aretSub:"Pipeline zu Sephora, Douglas, Parfümerien und europäischem Retail", aretAdd:"Ziel hinzufügen", aretTotal:"Ziele gesamt", aretActive:"In Verhandlung", aretWon:"Abgeschlossen", aretAvgProb:"Ø Wahrsch.", aretEmptyTitle:"Keine Retail-Ziele", aretEmptyMsg:"Füge den ersten zu kontaktierenden Händler hinzu (z.B. Sephora Italien).", arethRetailer:"Händler", arethCountry:"Land", arethBuyer:"Einkäufer", arethBrand:"Marke", arethStatus:"Status", arethProb:"Wahrsch.", arethFollowup:"Nachfassen", arethActions:"Aktionen", aretEdit:"Bearbeiten", aretDelete:"Löschen", aretStLead:"Lead", aretStContacted:"Kontaktiert", aretStSamples:"Muster", aretStMeeting:"Meeting", aretStNego:"Verhandlung", aretStWon:"Gewonnen ✓", aretStLost:"Verloren", aretModalEdit:"Retail-Ziel bearbeiten", aretModalNew:"Neues Retail-Ziel", aretSave:"Speichern", aretFRetailer:"Händler *", aretFRetailerPh:"z.B. Sephora Italien", aretFCountry:"Land", aretFCountryPh:"z.B. Italien", aretFBuyer:"Einkäufer / Kontakt", aretFBuyerEmail:"Einkäufer-E-Mail", aretFBrand:"Kandidaten-Marke", aretFNone:"— Keiner —", aretFProducts:"Kandidaten-Produkte", aretFStage:"Status", aretFProb:"Abschlusswahrscheinlichkeit (%)", aretFFollowup:"Nächstes Nachfassen", aretFSamples:"Muster gesendet", aretFNotes:"Notizen" });
Object.assign(T.zh,{ aretTitle:"零售拓展台", aretSub:"面向 Sephora、Douglas、香水店及欧洲零售的管道", aretAdd:"添加目标", aretTotal:"目标总数", aretActive:"谈判中", aretWon:"已成交", aretAvgProb:"平均概率", aretEmptyTitle:"没有零售目标", aretEmptyMsg:"添加第一个要联系的零售商（例如 Sephora 意大利）。", arethRetailer:"零售商", arethCountry:"国家", arethBuyer:"采购", arethBrand:"品牌", arethStatus:"状态", arethProb:"概率", arethFollowup:"跟进", arethActions:"操作", aretEdit:"编辑", aretDelete:"删除", aretStLead:"线索", aretStContacted:"已联系", aretStSamples:"样品", aretStMeeting:"会议", aretStNego:"谈判", aretStWon:"成交 ✓", aretStLost:"失去", aretModalEdit:"编辑零售目标", aretModalNew:"新建零售目标", aretSave:"保存", aretFRetailer:"零售商 *", aretFRetailerPh:"例如 Sephora 意大利", aretFCountry:"国家", aretFCountryPh:"例如 意大利", aretFBuyer:"采购/联系人", aretFBuyerEmail:"采购邮箱", aretFBrand:"候选品牌", aretFNone:"— 无 —", aretFProducts:"候选产品", aretFStage:"状态", aretFProb:"成交概率 (%)", aretFFollowup:"下次跟进", aretFSamples:"已寄送样品", aretFNotes:"备注" });
Object.assign(T.ar,{ aretTitle:"مكتب التوسّع في التجزئة", aretSub:"خط الأعمال نحو Sephora وDouglas ومتاجر العطور والتجزئة الأوروبية", aretAdd:"إضافة هدف", aretTotal:"إجمالي الأهداف", aretActive:"قيد التفاوض", aretWon:"مغلقة", aretAvgProb:"احتمال متوسط", aretEmptyTitle:"لا توجد أهداف تجزئة", aretEmptyMsg:"أضف أول بائع تجزئة للتواصل معه (مثال: Sephora إيطاليا).", arethRetailer:"بائع التجزئة", arethCountry:"الدولة", arethBuyer:"المشتري", arethBrand:"العلامة", arethStatus:"الحالة", arethProb:"الاحتمال", arethFollowup:"متابعة", arethActions:"إجراءات", aretEdit:"تعديل", aretDelete:"حذف", aretStLead:"عميل محتمل", aretStContacted:"تم التواصل", aretStSamples:"عينات", aretStMeeting:"اجتماع", aretStNego:"تفاوض", aretStWon:"مغلق ✓", aretStLost:"خسر", aretModalEdit:"تعديل هدف التجزئة", aretModalNew:"هدف تجزئة جديد", aretSave:"حفظ", aretFRetailer:"بائع التجزئة *", aretFRetailerPh:"مثال: Sephora إيطاليا", aretFCountry:"الدولة", aretFCountryPh:"مثال: إيطاليا", aretFBuyer:"المشتري / جهة الاتصال", aretFBuyerEmail:"بريد المشتري", aretFBrand:"العلامة المرشّحة", aretFNone:"— لا شيء —", aretFProducts:"المنتجات المرشّحة", aretFStage:"الحالة", aretFProb:"احتمال الإغلاق (%)", aretFFollowup:"المتابعة التالية", aretFSamples:"تم إرسال العينات", aretFNotes:"ملاحظات" });
Object.assign(T.en,{ aamzTitle:"Amazon Operating Partner", aamzSub:"Amazon EU cockpit: listings, fees, net margin and real ROI per product", aamzAdd:"Add listing", aamzStListing:"Listings", aamzStStockVal:"FBA stock value (cost)", aamzStPotential:"Potential profit on stock", aamzStAvgMargin:"Avg net margin", aamzStAds:"Ad spend (30d)", aamzEmptyTitle:"No Amazon listings", aamzEmptyMsg:"Add the first product you sell on Amazon (e.g. Lattafa Khamrah).", aamzhProduct:"Product", aamzhMkt:"Mkt", aamzhPrice:"Price", aamzhCost:"Cost", aamzhCostU:"Costs/u (fee+ads)", aamzhMarginU:"Margin €/u", aamzhMarginPct:"Margin %", aamzhRoi:"ROI %", aamzhStock:"Stock", aamzhActions:"Actions", aamzEdit:"Edit", aamzDelete:"Delete", aamzQuickAddTitle:"Quick add from catalog", aamzQuickAddMsg:"catalog products not yet on Amazon. One click creates the linked listing — then you fill in price and fees.", aamzQuickAddBtn:"Push to Amazon", aamzModalEdit:"Edit Amazon listing", aamzModalNew:"New Amazon listing", aamzSave:"Save", aamzFLinkCatalog:"Link to catalog product (optional)", aamzFManual:"— Manual / no link —", aamzFName:"Product name *", aamzFNamePh:"e.g. Lattafa Khamrah EDP 100ml", aamzFBrand:"Brand (optional)", aamzFNone:"— None —", aamzFMarketplace:"Marketplace", aamzFFulfillment:"Fulfillment", aamzFCost:"Cost / unit (€)", aamzFPrice:"Amazon price (€)", aamzFReferral:"Referral fee (%)", aamzFFba:"FBA fee / unit (€)", aamzFAds:"Amazon Ads spend last 30d (€) · internal only", aamzFStock:"FBA stock (units)", aamzFSold:"Sold (30d)", aamzFNotes:"Notes" });
Object.assign(T.it,{ aamzTitle:"Amazon Operating Partner", aamzSub:"Cockpit Amazon EU: listing, fee, margine netto e ROI reali per prodotto", aamzAdd:"Aggiungi listing", aamzStListing:"Listing", aamzStStockVal:"Valore stock FBA (costo)", aamzStPotential:"Profitto potenziale su stock", aamzStAvgMargin:"Margine netto medio", aamzStAds:"Spesa Ads (30gg)", aamzEmptyTitle:"Nessun listing Amazon", aamzEmptyMsg:"Aggiungi il primo prodotto che vendi su Amazon (es. Lattafa Khamrah).", aamzhProduct:"Prodotto", aamzhMkt:"Mkt", aamzhPrice:"Prezzo", aamzhCost:"Costo", aamzhCostU:"Costi/u (fee+ads)", aamzhMarginU:"Margine €/u", aamzhMarginPct:"Margine %", aamzhRoi:"ROI %", aamzhStock:"Stock", aamzhActions:"Azioni", aamzEdit:"Modifica", aamzDelete:"Elimina", aamzQuickAddTitle:"Aggiungi rapido dal catalogo", aamzQuickAddMsg:"prodotti a catalogo non ancora su Amazon. Un clic crea il listing collegato — poi completi prezzo e fee.", aamzQuickAddBtn:"Porta su Amazon", aamzModalEdit:"Modifica listing Amazon", aamzModalNew:"Nuovo listing Amazon", aamzSave:"Salva", aamzFLinkCatalog:"Collega a prodotto del catalogo (opzionale)", aamzFManual:"— Manuale / nessun collegamento —", aamzFName:"Nome prodotto *", aamzFNamePh:"es. Lattafa Khamrah EDP 100ml", aamzFBrand:"Brand (opzionale)", aamzFNone:"— Nessuno —", aamzFMarketplace:"Marketplace", aamzFFulfillment:"Fulfillment", aamzFCost:"Costo / unità (€)", aamzFPrice:"Prezzo Amazon (€)", aamzFReferral:"Referral fee (%)", aamzFFba:"Fee FBA / unità (€)", aamzFAds:"Spesa Amazon Ads ultimi 30gg (€) · solo interno", aamzFStock:"Stock FBA (unità)", aamzFSold:"Venduti (30 gg)", aamzFNotes:"Note" });
Object.assign(T.fr,{ aamzTitle:"Partenaire opérationnel Amazon", aamzSub:"Cockpit Amazon EU : listings, frais, marge nette et ROI réels par produit", aamzAdd:"Ajouter un listing", aamzStListing:"Listings", aamzStStockVal:"Valeur stock FBA (coût)", aamzStPotential:"Profit potentiel sur stock", aamzStAvgMargin:"Marge nette moyenne", aamzStAds:"Dépense Ads (30j)", aamzEmptyTitle:"Aucun listing Amazon", aamzEmptyMsg:"Ajoutez le premier produit que vous vendez sur Amazon (ex. Lattafa Khamrah).", aamzhProduct:"Produit", aamzhMkt:"Mkt", aamzhPrice:"Prix", aamzhCost:"Coût", aamzhCostU:"Coûts/u (frais+ads)", aamzhMarginU:"Marge €/u", aamzhMarginPct:"Marge %", aamzhRoi:"ROI %", aamzhStock:"Stock", aamzhActions:"Actions", aamzEdit:"Modifier", aamzDelete:"Supprimer", aamzQuickAddTitle:"Ajout rapide depuis le catalogue", aamzQuickAddMsg:"produits du catalogue pas encore sur Amazon. Un clic crée le listing lié — vous complétez ensuite prix et frais.", aamzQuickAddBtn:"Envoyer sur Amazon", aamzModalEdit:"Modifier le listing Amazon", aamzModalNew:"Nouveau listing Amazon", aamzSave:"Enregistrer", aamzFLinkCatalog:"Lier à un produit du catalogue (facultatif)", aamzFManual:"— Manuel / aucun lien —", aamzFName:"Nom du produit *", aamzFNamePh:"ex. Lattafa Khamrah EDP 100ml", aamzFBrand:"Marque (facultatif)", aamzFNone:"— Aucun —", aamzFMarketplace:"Marketplace", aamzFFulfillment:"Fulfillment", aamzFCost:"Coût / unité (€)", aamzFPrice:"Prix Amazon (€)", aamzFReferral:"Frais de référence (%)", aamzFFba:"Frais FBA / unité (€)", aamzFAds:"Dépense Amazon Ads 30 derniers jours (€) · interne", aamzFStock:"Stock FBA (unités)", aamzFSold:"Vendus (30 j)", aamzFNotes:"Notes" });
Object.assign(T.es,{ aamzTitle:"Socio operativo de Amazon", aamzSub:"Cockpit Amazon EU: listings, comisiones, margen neto y ROI reales por producto", aamzAdd:"Añadir listing", aamzStListing:"Listings", aamzStStockVal:"Valor stock FBA (coste)", aamzStPotential:"Beneficio potencial sobre stock", aamzStAvgMargin:"Margen neto medio", aamzStAds:"Gasto Ads (30d)", aamzEmptyTitle:"Sin listings de Amazon", aamzEmptyMsg:"Añade el primer producto que vendes en Amazon (ej. Lattafa Khamrah).", aamzhProduct:"Producto", aamzhMkt:"Mkt", aamzhPrice:"Precio", aamzhCost:"Coste", aamzhCostU:"Costes/u (fee+ads)", aamzhMarginU:"Margen €/u", aamzhMarginPct:"Margen %", aamzhRoi:"ROI %", aamzhStock:"Stock", aamzhActions:"Acciones", aamzEdit:"Editar", aamzDelete:"Eliminar", aamzQuickAddTitle:"Añadir rápido desde el catálogo", aamzQuickAddMsg:"productos del catálogo aún no en Amazon. Un clic crea el listing vinculado — luego completas precio y comisiones.", aamzQuickAddBtn:"Llevar a Amazon", aamzModalEdit:"Editar listing de Amazon", aamzModalNew:"Nuevo listing de Amazon", aamzSave:"Guardar", aamzFLinkCatalog:"Vincular a producto del catálogo (opcional)", aamzFManual:"— Manual / sin vínculo —", aamzFName:"Nombre del producto *", aamzFNamePh:"ej. Lattafa Khamrah EDP 100ml", aamzFBrand:"Marca (opcional)", aamzFNone:"— Ninguno —", aamzFMarketplace:"Marketplace", aamzFFulfillment:"Fulfillment", aamzFCost:"Coste / unidad (€)", aamzFPrice:"Precio Amazon (€)", aamzFReferral:"Referral fee (%)", aamzFFba:"Fee FBA / unidad (€)", aamzFAds:"Gasto Amazon Ads últimos 30d (€) · solo interno", aamzFStock:"Stock FBA (unidades)", aamzFSold:"Vendidos (30 d)", aamzFNotes:"Notas" });
Object.assign(T.de,{ aamzTitle:"Amazon Operating Partner", aamzSub:"Amazon-EU-Cockpit: Listings, Gebühren, Nettomarge und echter ROI pro Produkt", aamzAdd:"Listing hinzufügen", aamzStListing:"Listings", aamzStStockVal:"FBA-Bestandswert (Kosten)", aamzStPotential:"Potenzieller Gewinn auf Bestand", aamzStAvgMargin:"Ø Nettomarge", aamzStAds:"Ad-Ausgaben (30 Tg.)", aamzEmptyTitle:"Keine Amazon-Listings", aamzEmptyMsg:"Füge das erste Produkt hinzu, das du auf Amazon verkaufst (z.B. Lattafa Khamrah).", aamzhProduct:"Produkt", aamzhMkt:"Mkt", aamzhPrice:"Preis", aamzhCost:"Kosten", aamzhCostU:"Kosten/E (Geb.+Ads)", aamzhMarginU:"Marge €/E", aamzhMarginPct:"Marge %", aamzhRoi:"ROI %", aamzhStock:"Bestand", aamzhActions:"Aktionen", aamzEdit:"Bearbeiten", aamzDelete:"Löschen", aamzQuickAddTitle:"Schnell aus dem Katalog hinzufügen", aamzQuickAddMsg:"Katalogprodukte noch nicht auf Amazon. Ein Klick erstellt das verknüpfte Listing — dann ergänzt du Preis und Gebühren.", aamzQuickAddBtn:"Zu Amazon bringen", aamzModalEdit:"Amazon-Listing bearbeiten", aamzModalNew:"Neues Amazon-Listing", aamzSave:"Speichern", aamzFLinkCatalog:"Mit Katalogprodukt verknüpfen (optional)", aamzFManual:"— Manuell / keine Verknüpfung —", aamzFName:"Produktname *", aamzFNamePh:"z.B. Lattafa Khamrah EDP 100ml", aamzFBrand:"Marke (optional)", aamzFNone:"— Keiner —", aamzFMarketplace:"Marktplatz", aamzFFulfillment:"Fulfillment", aamzFCost:"Kosten / Einheit (€)", aamzFPrice:"Amazon-Preis (€)", aamzFReferral:"Referral-Gebühr (%)", aamzFFba:"FBA-Gebühr / Einheit (€)", aamzFAds:"Amazon-Ads-Ausgaben letzte 30 Tg. (€) · nur intern", aamzFStock:"FBA-Bestand (Einheiten)", aamzFSold:"Verkauft (30 Tg.)", aamzFNotes:"Notizen" });
Object.assign(T.zh,{ aamzTitle:"亚马逊运营伙伴", aamzSub:"亚马逊欧洲驾驶舱：每个产品的listing、费用、净利润和真实ROI", aamzAdd:"添加listing", aamzStListing:"Listing 数", aamzStStockVal:"FBA库存价值（成本）", aamzStPotential:"库存潜在利润", aamzStAvgMargin:"平均净利润率", aamzStAds:"广告花费（30天）", aamzEmptyTitle:"没有亚马逊listing", aamzEmptyMsg:"添加你在亚马逊上销售的第一个产品（例如 Lattafa Khamrah）。", aamzhProduct:"产品", aamzhMkt:"市场", aamzhPrice:"价格", aamzhCost:"成本", aamzhCostU:"成本/件（费用+广告）", aamzhMarginU:"利润 €/件", aamzhMarginPct:"利润 %", aamzhRoi:"ROI %", aamzhStock:"库存", aamzhActions:"操作", aamzEdit:"编辑", aamzDelete:"删除", aamzQuickAddTitle:"从目录快速添加", aamzQuickAddMsg:"目录中尚未上架亚马逊的产品。一键创建关联listing —— 然后你填写价格和费用。", aamzQuickAddBtn:"上架到亚马逊", aamzModalEdit:"编辑亚马逊listing", aamzModalNew:"新建亚马逊listing", aamzSave:"保存", aamzFLinkCatalog:"关联到目录产品（可选）", aamzFManual:"— 手动 / 无关联 —", aamzFName:"产品名称 *", aamzFNamePh:"例如 Lattafa Khamrah EDP 100ml", aamzFBrand:"品牌（可选）", aamzFNone:"— 无 —", aamzFMarketplace:"市场", aamzFFulfillment:"配送方式", aamzFCost:"成本/件 (€)", aamzFPrice:"亚马逊价格 (€)", aamzFReferral:"推荐费 (%)", aamzFFba:"FBA费用/件 (€)", aamzFAds:"亚马逊广告最近30天花费 (€) · 仅内部", aamzFStock:"FBA库存（件）", aamzFSold:"已售（30天）", aamzFNotes:"备注" });
Object.assign(T.ar,{ aamzTitle:"شريك تشغيل أمازون", aamzSub:"قمرة أمازون الأوروبية: القوائم والرسوم وصافي الهامش والعائد الحقيقي لكل منتج", aamzAdd:"إضافة قائمة", aamzStListing:"القوائم", aamzStStockVal:"قيمة مخزون FBA (التكلفة)", aamzStPotential:"الربح المحتمل على المخزون", aamzStAvgMargin:"متوسط صافي الهامش", aamzStAds:"إنفاق الإعلانات (30 يومًا)", aamzEmptyTitle:"لا توجد قوائم أمازون", aamzEmptyMsg:"أضف أول منتج تبيعه على أمازون (مثال: Lattafa Khamrah).", aamzhProduct:"المنتج", aamzhMkt:"السوق", aamzhPrice:"السعر", aamzhCost:"التكلفة", aamzhCostU:"التكاليف/وحدة (رسوم+إعلانات)", aamzhMarginU:"الهامش €/وحدة", aamzhMarginPct:"الهامش %", aamzhRoi:"ROI %", aamzhStock:"المخزون", aamzhActions:"إجراءات", aamzEdit:"تعديل", aamzDelete:"حذف", aamzQuickAddTitle:"إضافة سريعة من الكتالوج", aamzQuickAddMsg:"منتجات في الكتالوج ليست بعد على أمازون. نقرة واحدة تُنشئ القائمة المرتبطة — ثم تكمل السعر والرسوم.", aamzQuickAddBtn:"نقل إلى أمازون", aamzModalEdit:"تعديل قائمة أمازون", aamzModalNew:"قائمة أمازون جديدة", aamzSave:"حفظ", aamzFLinkCatalog:"الربط بمنتج من الكتالوج (اختياري)", aamzFManual:"— يدوي / بلا ربط —", aamzFName:"اسم المنتج *", aamzFNamePh:"مثال: Lattafa Khamrah EDP 100ml", aamzFBrand:"العلامة (اختياري)", aamzFNone:"— لا شيء —", aamzFMarketplace:"السوق", aamzFFulfillment:"التنفيذ", aamzFCost:"التكلفة / وحدة (€)", aamzFPrice:"سعر أمازون (€)", aamzFReferral:"رسوم الإحالة (%)", aamzFFba:"رسوم FBA / وحدة (€)", aamzFAds:"إنفاق إعلانات أمازون آخر 30 يومًا (€) · داخلي فقط", aamzFStock:"مخزون FBA (وحدات)", aamzFSold:"المُباع (30 يومًا)", aamzFNotes:"ملاحظات" });
Object.assign(T.en,{ astkTitle:"Inventory Management", astkSub:"Update stock levels — changes reflect immediately for all users", astkScannerOn:"✓ Scanner Mode ON", astkScannerOff:"Scanner Mode", astkTotalProducts:"Total Products", astkInStock:"In Stock", astkLowStock:"Low Stock (<20)", astkOutStock:"Out of Stock", astkScannerActive:"Scanner Mode active", astkScannerDesc:"Connect your USB/Bluetooth scanner or enter the barcode/SKU manually", astkScanPh:"🔍 Scan the barcode (EAN) or type SKU + Enter...", astkLoad:"Stock in", astkUnload:"Stock out", astkNotLinked:"Unlinked code:", astkLinkDesc:"Link this code to a catalog product. You do it once: from the next scan, stock-in is automatic.", astkChooseProduct:"— Choose the product —", astkLinkedNotify:"✓ Code linked to {name}", astkProductFallback:"product", astkLinkBtn:"Link code", astkCurrentStock:"Current stock:", astkUnits:"units", astkQtyAddPh:"Quantity to add...", astkQtyRemovePh:"Quantity to remove...", astkAddedNotify:"✓ +{qty} units added to {name}", astkRemovedNotify:"✓ -{qty} units removed from {name}", astkAddBtn:"+ Add", astkRemoveBtn:"- Remove", astkScanInfo:"💡 Scan with the gun: the field reads it on its own and fires on Enter. The first time a code is new, you link it to the product once — then it's automatic.", astkhProduct:"Product", astkhBrand:"Brand", astkhCurrent:"Current Stock", astkhReserved:"Reserved", astkhUpdate:"Update Stock", astkhLastRestock:"Last Restock", astkUpdateBtn:"Update", astkNever:"Never" });
Object.assign(T.it,{ astkTitle:"Gestione inventario", astkSub:"Aggiorna le giacenze — le modifiche sono immediate per tutti gli utenti", astkScannerOn:"✓ Modalità scanner ON", astkScannerOff:"Modalità scanner", astkTotalProducts:"Prodotti totali", astkInStock:"Disponibili", astkLowStock:"Scorta bassa (<20)", astkOutStock:"Esauriti", astkScannerActive:"Modalità scanner attiva", astkScannerDesc:"Connetti il tuo scanner USB/Bluetooth oppure inserisci il barcode/SKU manualmente", astkScanPh:"🔍 Spara il codice a barre (EAN) o digita SKU + Invio...", astkLoad:"Carico", astkUnload:"Scarico", astkNotLinked:"Codice non collegato:", astkLinkDesc:"Collega questo codice a un prodotto del catalogo. Lo fai una sola volta: dalla prossima scansione il carico sarà automatico.", astkChooseProduct:"— Scegli il prodotto —", astkLinkedNotify:"✓ Codice collegato a {name}", astkProductFallback:"prodotto", astkLinkBtn:"Collega codice", astkCurrentStock:"Stock attuale:", astkUnits:"unità", astkQtyAddPh:"Quantità da aggiungere...", astkQtyRemovePh:"Quantità da rimuovere...", astkAddedNotify:"✓ +{qty} unità aggiunte a {name}", astkRemovedNotify:"✓ -{qty} unità rimosse da {name}", astkAddBtn:"+ Aggiungi", astkRemoveBtn:"- Rimuovi", astkScanInfo:"💡 Spara il codice con la pistola: il campo lo legge da solo e parte con Invio. La prima volta che un codice è nuovo, lo colleghi al prodotto una volta sola — poi è automatico.", astkhProduct:"Prodotto", astkhBrand:"Brand", astkhCurrent:"Stock attuale", astkhReserved:"Riservate", astkhUpdate:"Aggiorna stock", astkhLastRestock:"Ultimo carico", astkUpdateBtn:"Aggiorna", astkNever:"Mai" });
Object.assign(T.fr,{ astkTitle:"Gestion de l'inventaire", astkSub:"Mettez à jour les stocks — les changements sont immédiats pour tous les utilisateurs", astkScannerOn:"✓ Mode scanner activé", astkScannerOff:"Mode scanner", astkTotalProducts:"Produits au total", astkInStock:"En stock", astkLowStock:"Stock faible (<20)", astkOutStock:"En rupture", astkScannerActive:"Mode scanner actif", astkScannerDesc:"Connectez votre scanner USB/Bluetooth ou saisissez le code-barres/SKU manuellement", astkScanPh:"🔍 Scannez le code-barres (EAN) ou tapez le SKU + Entrée...", astkLoad:"Entrée", astkUnload:"Sortie", astkNotLinked:"Code non lié :", astkLinkDesc:"Liez ce code à un produit du catalogue. Vous le faites une seule fois : dès la prochaine lecture, l'entrée est automatique.", astkChooseProduct:"— Choisir le produit —", astkLinkedNotify:"✓ Code lié à {name}", astkProductFallback:"produit", astkLinkBtn:"Lier le code", astkCurrentStock:"Stock actuel :", astkUnits:"unités", astkQtyAddPh:"Quantité à ajouter...", astkQtyRemovePh:"Quantité à retirer...", astkAddedNotify:"✓ +{qty} unités ajoutées à {name}", astkRemovedNotify:"✓ -{qty} unités retirées de {name}", astkAddBtn:"+ Ajouter", astkRemoveBtn:"- Retirer", astkScanInfo:"💡 Scannez avec la douchette : le champ le lit tout seul et valide avec Entrée. La première fois qu'un code est nouveau, vous le liez au produit une seule fois — ensuite c'est automatique.", astkhProduct:"Produit", astkhBrand:"Marque", astkhCurrent:"Stock actuel", astkhReserved:"Réservé", astkhUpdate:"Mettre à jour", astkhLastRestock:"Dernier réappro", astkUpdateBtn:"Mettre à jour", astkNever:"Jamais" });
Object.assign(T.es,{ astkTitle:"Gestión de inventario", astkSub:"Actualiza las existencias — los cambios se reflejan de inmediato para todos los usuarios", astkScannerOn:"✓ Modo escáner ON", astkScannerOff:"Modo escáner", astkTotalProducts:"Productos totales", astkInStock:"En stock", astkLowStock:"Stock bajo (<20)", astkOutStock:"Agotados", astkScannerActive:"Modo escáner activo", astkScannerDesc:"Conecta tu escáner USB/Bluetooth o introduce el código de barras/SKU manualmente", astkScanPh:"🔍 Escanea el código de barras (EAN) o escribe el SKU + Intro...", astkLoad:"Entrada", astkUnload:"Salida", astkNotLinked:"Código no vinculado:", astkLinkDesc:"Vincula este código a un producto del catálogo. Lo haces una sola vez: desde el próximo escaneo, la entrada es automática.", astkChooseProduct:"— Elegir el producto —", astkLinkedNotify:"✓ Código vinculado a {name}", astkProductFallback:"producto", astkLinkBtn:"Vincular código", astkCurrentStock:"Stock actual:", astkUnits:"unidades", astkQtyAddPh:"Cantidad a añadir...", astkQtyRemovePh:"Cantidad a quitar...", astkAddedNotify:"✓ +{qty} unidades añadidas a {name}", astkRemovedNotify:"✓ -{qty} unidades quitadas de {name}", astkAddBtn:"+ Añadir", astkRemoveBtn:"- Quitar", astkScanInfo:"💡 Escanea con la pistola: el campo lo lee solo y se activa con Intro. La primera vez que un código es nuevo, lo vinculas al producto una sola vez — luego es automático.", astkhProduct:"Producto", astkhBrand:"Marca", astkhCurrent:"Stock actual", astkhReserved:"Reservado", astkhUpdate:"Actualizar stock", astkhLastRestock:"Última reposición", astkUpdateBtn:"Actualizar", astkNever:"Nunca" });
Object.assign(T.de,{ astkTitle:"Bestandsverwaltung", astkSub:"Bestände aktualisieren — Änderungen gelten sofort für alle Nutzer", astkScannerOn:"✓ Scanner-Modus AN", astkScannerOff:"Scanner-Modus", astkTotalProducts:"Produkte gesamt", astkInStock:"Auf Lager", astkLowStock:"Niedriger Bestand (<20)", astkOutStock:"Nicht auf Lager", astkScannerActive:"Scanner-Modus aktiv", astkScannerDesc:"Verbinde deinen USB-/Bluetooth-Scanner oder gib den Barcode/SKU manuell ein", astkScanPh:"🔍 Barcode (EAN) scannen oder SKU eingeben + Enter...", astkLoad:"Zugang", astkUnload:"Abgang", astkNotLinked:"Code nicht verknüpft:", astkLinkDesc:"Verknüpfe diesen Code mit einem Katalogprodukt. Du machst das einmal: ab dem nächsten Scan ist der Zugang automatisch.", astkChooseProduct:"— Produkt wählen —", astkLinkedNotify:"✓ Code verknüpft mit {name}", astkProductFallback:"Produkt", astkLinkBtn:"Code verknüpfen", astkCurrentStock:"Aktueller Bestand:", astkUnits:"Einheiten", astkQtyAddPh:"Hinzuzufügende Menge...", astkQtyRemovePh:"Zu entfernende Menge...", astkAddedNotify:"✓ +{qty} Einheiten zu {name} hinzugefügt", astkRemovedNotify:"✓ -{qty} Einheiten von {name} entfernt", astkAddBtn:"+ Hinzufügen", astkRemoveBtn:"- Entfernen", astkScanInfo:"💡 Mit der Scanner-Pistole scannen: Das Feld liest ihn selbst und löst mit Enter aus. Wenn ein Code neu ist, verknüpfst du ihn einmal mit dem Produkt — danach ist es automatisch.", astkhProduct:"Produkt", astkhBrand:"Marke", astkhCurrent:"Aktueller Bestand", astkhReserved:"Reserviert", astkhUpdate:"Bestand aktualisieren", astkhLastRestock:"Letzte Auffüllung", astkUpdateBtn:"Aktualisieren", astkNever:"Nie" });
Object.assign(T.zh,{ astkTitle:"库存管理", astkSub:"更新库存水平 —— 更改立即对所有用户生效", astkScannerOn:"✓ 扫描模式开启", astkScannerOff:"扫描模式", astkTotalProducts:"产品总数", astkInStock:"有货", astkLowStock:"低库存 (<20)", astkOutStock:"缺货", astkScannerActive:"扫描模式已激活", astkScannerDesc:"连接你的 USB/蓝牙扫描仪，或手动输入条形码/SKU", astkScanPh:"🔍 扫描条形码 (EAN) 或输入 SKU + 回车...", astkLoad:"入库", astkUnload:"出库", astkNotLinked:"未关联的代码：", astkLinkDesc:"将此代码关联到目录产品。只需一次：从下次扫描起，入库将自动完成。", astkChooseProduct:"— 选择产品 —", astkLinkedNotify:"✓ 代码已关联到 {name}", astkProductFallback:"产品", astkLinkBtn:"关联代码", astkCurrentStock:"当前库存：", astkUnits:"件", astkQtyAddPh:"要添加的数量...", astkQtyRemovePh:"要移除的数量...", astkAddedNotify:"✓ 已向 {name} 添加 +{qty} 件", astkRemovedNotify:"✓ 已从 {name} 移除 -{qty} 件", astkAddBtn:"+ 添加", astkRemoveBtn:"- 移除", astkScanInfo:"💡 用扫描枪扫描：字段会自动读取并按回车触发。当代码是新的时，只需将其与产品关联一次 —— 之后就是自动的。", astkhProduct:"产品", astkhBrand:"品牌", astkhCurrent:"当前库存", astkhReserved:"已预留", astkhUpdate:"更新库存", astkhLastRestock:"上次补货", astkUpdateBtn:"更新", astkNever:"从不" });
Object.assign(T.ar,{ astkTitle:"إدارة المخزون", astkSub:"حدّث مستويات المخزون — تنعكس التغييرات فورًا لجميع المستخدمين", astkScannerOn:"✓ وضع الماسح مُفعّل", astkScannerOff:"وضع الماسح", astkTotalProducts:"إجمالي المنتجات", astkInStock:"متوفر", astkLowStock:"مخزون منخفض (<20)", astkOutStock:"نفد المخزون", astkScannerActive:"وضع الماسح نشط", astkScannerDesc:"وصّل ماسح USB/Bluetooth أو أدخل الباركود/SKU يدويًا", astkScanPh:"🔍 امسح الباركود (EAN) أو اكتب SKU + إدخال...", astkLoad:"إدخال", astkUnload:"إخراج", astkNotLinked:"رمز غير مرتبط:", astkLinkDesc:"اربط هذا الرمز بمنتج من الكتالوج. تفعلها مرة واحدة: من المسح التالي يصبح الإدخال تلقائيًا.", astkChooseProduct:"— اختر المنتج —", astkLinkedNotify:"✓ تم ربط الرمز بـ {name}", astkProductFallback:"منتج", astkLinkBtn:"ربط الرمز", astkCurrentStock:"المخزون الحالي:", astkUnits:"وحدة", astkQtyAddPh:"الكمية المراد إضافتها...", astkQtyRemovePh:"الكمية المراد إزالتها...", astkAddedNotify:"✓ تمت إضافة +{qty} وحدة إلى {name}", astkRemovedNotify:"✓ تمت إزالة -{qty} وحدة من {name}", astkAddBtn:"+ إضافة", astkRemoveBtn:"- إزالة", astkScanInfo:"💡 امسح بالمسدس: يقرأه الحقل تلقائيًا ويُفعّل بالضغط على إدخال. أول مرة يكون الرمز جديدًا تربطه بالمنتج مرة واحدة — ثم يصبح تلقائيًا.", astkhProduct:"المنتج", astkhBrand:"العلامة", astkhCurrent:"المخزون الحالي", astkhReserved:"محجوز", astkhUpdate:"تحديث المخزون", astkhLastRestock:"آخر تعبئة", astkUpdateBtn:"تحديث", astkNever:"أبدًا" });
Object.assign(T.en,{ abrmTitle:"Add New Brand", abrmName:"Brand Name", abrmNamePh:"e.g. Lattafa Perfumes", abrmOrigin:"Origin Country", abrmOriginPh:"e.g. Dubai, UAE", abrmCategory:"Category", abrmCategoryPh:"e.g. Fine Fragrance", aprmTitleEdit:"Edit Product", aprmTitleNew:"Add New Product", aprmName:"Product Name *", aprmNamePh:"e.g. Khamrah EDP", aprmSkuPh:"e.g. LT-KHM-100", aprmCategory:"Category", aprmCategoryPh:"e.g. Premium", aprmSize:"Size", aprmSizePh:"e.g. 100ml", aprmPrice:"Unit Price (€) *", aprmBrand:"Brand", aprmSelectBrand:"Select brand...", aprmOrderMult:"Order Multiple", aprmOrderMultPh:"e.g. 12", aprmMoq:"Min Order Qty (MOQ)", aprmMoqPh:"e.g. 24", aprmMaxQty:"Max Order Qty (empty = unlimited)", aprmMaxQtyPh:"e.g. 500", aprmImage:"Product Image", aprmUploadImg:"Upload image", aprmOrUrl:"or external URL:", amodDesc:"Description", aprmImportPre:"To import many products use the button", aprmImportPost:"in the catalog.", aprmImportCols:"Supported columns" });
Object.assign(T.it,{ abrmTitle:"Aggiungi nuovo brand", abrmName:"Nome brand", abrmNamePh:"es. Lattafa Perfumes", abrmOrigin:"Paese d'origine", abrmOriginPh:"es. Dubai, EAU", abrmCategory:"Categoria", abrmCategoryPh:"es. Fine Fragrance", aprmTitleEdit:"Modifica prodotto", aprmTitleNew:"Aggiungi nuovo prodotto", aprmName:"Nome prodotto *", aprmNamePh:"es. Khamrah EDP", aprmSkuPh:"es. LT-KHM-100", aprmCategory:"Categoria", aprmCategoryPh:"es. Premium", aprmSize:"Formato", aprmSizePh:"es. 100ml", aprmPrice:"Prezzo unitario (€) *", aprmBrand:"Brand", aprmSelectBrand:"Seleziona brand...", aprmOrderMult:"Multiplo d'ordine", aprmOrderMultPh:"es. 12", aprmMoq:"Qtà minima ordine (MOQ)", aprmMoqPh:"es. 24", aprmMaxQty:"Qtà massima ordine (vuoto = illimitato)", aprmMaxQtyPh:"es. 500", aprmImage:"Immagine Prodotto", aprmUploadImg:"Carica immagine", aprmOrUrl:"oppure URL esterno:", amodDesc:"Descrizione", aprmImportPre:"Per importare molti prodotti usa il pulsante", aprmImportPost:"nel catalogo.", aprmImportCols:"Colonne supportate" });
Object.assign(T.fr,{ abrmTitle:"Ajouter une marque", abrmName:"Nom de la marque", abrmNamePh:"ex. Lattafa Perfumes", abrmOrigin:"Pays d'origine", abrmOriginPh:"ex. Dubaï, EAU", abrmCategory:"Catégorie", abrmCategoryPh:"ex. Parfum fin", aprmTitleEdit:"Modifier le produit", aprmTitleNew:"Ajouter un produit", aprmName:"Nom du produit *", aprmNamePh:"ex. Khamrah EDP", aprmSkuPh:"ex. LT-KHM-100", aprmCategory:"Catégorie", aprmCategoryPh:"ex. Premium", aprmSize:"Taille", aprmSizePh:"ex. 100ml", aprmPrice:"Prix unitaire (€) *", aprmBrand:"Marque", aprmSelectBrand:"Sélectionner une marque...", aprmOrderMult:"Multiple de commande", aprmOrderMultPh:"ex. 12", aprmMoq:"Qté min. commande (MOQ)", aprmMoqPh:"ex. 24", aprmMaxQty:"Qté max. commande (vide = illimité)", aprmMaxQtyPh:"ex. 500", aprmImage:"Image du produit", aprmUploadImg:"Téléverser une image", aprmOrUrl:"ou URL externe :", amodDesc:"Description", aprmImportPre:"Pour importer de nombreux produits, utilisez le bouton", aprmImportPost:"dans le catalogue.", aprmImportCols:"Colonnes prises en charge" });
Object.assign(T.es,{ abrmTitle:"Añadir marca", abrmName:"Nombre de marca", abrmNamePh:"ej. Lattafa Perfumes", abrmOrigin:"País de origen", abrmOriginPh:"ej. Dubái, EAU", abrmCategory:"Categoría", abrmCategoryPh:"ej. Alta perfumería", aprmTitleEdit:"Editar producto", aprmTitleNew:"Añadir producto", aprmName:"Nombre del producto *", aprmNamePh:"ej. Khamrah EDP", aprmSkuPh:"ej. LT-KHM-100", aprmCategory:"Categoría", aprmCategoryPh:"ej. Premium", aprmSize:"Tamaño", aprmSizePh:"ej. 100ml", aprmPrice:"Precio unitario (€) *", aprmBrand:"Marca", aprmSelectBrand:"Seleccionar marca...", aprmOrderMult:"Múltiplo de pedido", aprmOrderMultPh:"ej. 12", aprmMoq:"Cant. mín. pedido (MOQ)", aprmMoqPh:"ej. 24", aprmMaxQty:"Cant. máx. pedido (vacío = ilimitado)", aprmMaxQtyPh:"ej. 500", aprmImage:"Imagen del producto", aprmUploadImg:"Subir imagen", aprmOrUrl:"o URL externa:", amodDesc:"Descripción", aprmImportPre:"Para importar muchos productos usa el botón", aprmImportPost:"en el catálogo.", aprmImportCols:"Columnas admitidas" });
Object.assign(T.de,{ abrmTitle:"Neue Marke hinzufügen", abrmName:"Markenname", abrmNamePh:"z.B. Lattafa Perfumes", abrmOrigin:"Herkunftsland", abrmOriginPh:"z.B. Dubai, VAE", abrmCategory:"Kategorie", abrmCategoryPh:"z.B. Feine Düfte", aprmTitleEdit:"Produkt bearbeiten", aprmTitleNew:"Neues Produkt hinzufügen", aprmName:"Produktname *", aprmNamePh:"z.B. Khamrah EDP", aprmSkuPh:"z.B. LT-KHM-100", aprmCategory:"Kategorie", aprmCategoryPh:"z.B. Premium", aprmSize:"Größe", aprmSizePh:"z.B. 100ml", aprmPrice:"Stückpreis (€) *", aprmBrand:"Marke", aprmSelectBrand:"Marke auswählen...", aprmOrderMult:"Bestellvielfaches", aprmOrderMultPh:"z.B. 12", aprmMoq:"Mindestbestellmenge (MOQ)", aprmMoqPh:"z.B. 24", aprmMaxQty:"Max. Bestellmenge (leer = unbegrenzt)", aprmMaxQtyPh:"z.B. 500", aprmImage:"Produktbild", aprmUploadImg:"Bild hochladen", aprmOrUrl:"oder externe URL:", amodDesc:"Beschreibung", aprmImportPre:"Um viele Produkte zu importieren, nutze die Schaltfläche", aprmImportPost:"im Katalog.", aprmImportCols:"Unterstützte Spalten" });
Object.assign(T.zh,{ abrmTitle:"添加新品牌", abrmName:"品牌名称", abrmNamePh:"例如 Lattafa Perfumes", abrmOrigin:"原产国", abrmOriginPh:"例如 迪拜，阿联酋", abrmCategory:"类别", abrmCategoryPh:"例如 高级香水", aprmTitleEdit:"编辑产品", aprmTitleNew:"添加新产品", aprmName:"产品名称 *", aprmNamePh:"例如 Khamrah EDP", aprmSkuPh:"例如 LT-KHM-100", aprmCategory:"类别", aprmCategoryPh:"例如 高端", aprmSize:"规格", aprmSizePh:"例如 100ml", aprmPrice:"单价 (€) *", aprmBrand:"品牌", aprmSelectBrand:"选择品牌...", aprmOrderMult:"订购倍数", aprmOrderMultPh:"例如 12", aprmMoq:"最小起订量 (MOQ)", aprmMoqPh:"例如 24", aprmMaxQty:"最大订购量（空 = 不限）", aprmMaxQtyPh:"例如 500", aprmImage:"产品图片", aprmUploadImg:"上传图片", aprmOrUrl:"或外部 URL：", amodDesc:"描述", aprmImportPre:"要批量导入产品，请使用按钮", aprmImportPost:"（在目录中）。", aprmImportCols:"支持的列" });
Object.assign(T.ar,{ abrmTitle:"إضافة علامة جديدة", abrmName:"اسم العلامة", abrmNamePh:"مثال: Lattafa Perfumes", abrmOrigin:"بلد المنشأ", abrmOriginPh:"مثال: دبي، الإمارات", abrmCategory:"الفئة", abrmCategoryPh:"مثال: عطور فاخرة", aprmTitleEdit:"تعديل المنتج", aprmTitleNew:"إضافة منتج جديد", aprmName:"اسم المنتج *", aprmNamePh:"مثال: Khamrah EDP", aprmSkuPh:"مثال: LT-KHM-100", aprmCategory:"الفئة", aprmCategoryPh:"مثال: Premium", aprmSize:"الحجم", aprmSizePh:"مثال: 100 مل", aprmPrice:"سعر الوحدة (€) *", aprmBrand:"العلامة", aprmSelectBrand:"اختر العلامة...", aprmOrderMult:"مضاعف الطلب", aprmOrderMultPh:"مثال: 12", aprmMoq:"الحد الأدنى للطلب (MOQ)", aprmMoqPh:"مثال: 24", aprmMaxQty:"الحد الأقصى للطلب (فارغ = غير محدود)", aprmMaxQtyPh:"مثال: 500", aprmImage:"صورة المنتج", aprmUploadImg:"رفع صورة", aprmOrUrl:"أو رابط خارجي:", amodDesc:"الوصف", aprmImportPre:"لاستيراد العديد من المنتجات استخدم الزر", aprmImportPost:"في الكتالوج.", aprmImportCols:"الأعمدة المدعومة" });
Object.assign(T.en,{ aconCreateDraft:"Create draft" });
Object.assign(T.it,{ aconCreateDraft:"Crea bozza" });
Object.assign(T.fr,{ aconCreateDraft:"Créer un brouillon" });
Object.assign(T.es,{ aconCreateDraft:"Crear borrador" });
Object.assign(T.de,{ aconCreateDraft:"Entwurf erstellen" });
Object.assign(T.zh,{ aconCreateDraft:"创建草稿" });
Object.assign(T.ar,{ aconCreateDraft:"إنشاء مسودة" });
Object.assign(T.en,{ dmoIntroTag:"Global B2B Distribution Platform", dmoIntroSub:"Connecting brands & distributors across Europe — automated, instant, scalable", dmoProbTitle:"The Old Way Is Broken", dmoProb1:"Endless emails & calls to manage distributors", dmoProb2:"No real-time visibility on stock", dmoProb3:"Manual invoices and payment chasing", dmoProb4:"Zero market intelligence or territory data", dmoSolTitle:"One Platform. Everything.", dmoSolSub:"NexusHub automates the entire distribution chain — from catalog to payment — across Europe", dmoSolCountries:"Countries", dmoSolDelivery:"Delivery", dmoSolAutomated:"Automated", dmoSecTitle:"Every Sector. One Hub.", dmoSecSub:"NexusHub works across all B2B product categories", dmoSecBeauty:"Beauty", dmoSecBeautyS:"Cosmetics & Fragrance", dmoSecFashion:"Fashion", dmoSecFashionS:"Apparel & Accessories", dmoSecFood:"Food & Beverage", dmoSecFoodS:"Premium & Specialty", dmoSecElec:"Electronics", dmoSecElecS:"Consumer & Pro Tech", dmoSecHome:"Home & Living", dmoSecHomeS:"Design & Furniture", dmoSecHealth:"Health", dmoSecHealthS:"OTC & Wellness", dmoMapTitle:"One Hub. Limitless Connections.", dmoMapSub:"From Turin, we reach every European market — fast, direct, exclusive", dmoBrTitle:"For Brands", dmoBrSub:"Full control. Full visibility. Zero manual work.", dmoBr1:"Territory management — one distributor per country", dmoBr2:"Real-time stock with order rules (MOQ, multiples)", dmoBr3:"Approve distributors & documents in one click", dmoBr4:"Automatic SEPA payments — receive funds instantly", dmoDiTitle:"For Distributors", dmoDiSub:"Access premium brands. Grow your territory.", dmoDi1:"Browse & apply to top global brands", dmoDi2:"Order from live catalog with real-time stock", dmoDi3:"48h delivery from Turin European Hub", dmoDi4:"Revenue analytics & territory performance dashboard", dmoValTitle:"More Flow. More Revenue.", dmoValSub:"NexusHub removes friction — faster stock rotation means more revenue for everyone", dmoValStock:"Stock Arrives", dmoValStockS:"Real-time catalog update", dmoValOrders:"Distributor Orders", dmoValOrdersS:"Instant SEPA payment", dmoValRev:"Revenue Flows", dmoValRevS:"Brand + Distributor win", dmoValM1:"Faster Rotation", dmoValM2:"Manual Work", dmoValM3:"Revenue for All", dmoNumTitle:"Built for Scale", dmoNum1:"Platform GMV", dmoNum2:"Active Distributors", dmoNum3:"Pallets / Month", dmoNum4:"Hub to Door", dmoAmzService:"Exclusive Management Service", dmoAmzSub:"We handle everything — you collect the revenue", dmoAmzC1:"FBA Logistics", dmoAmzC1S:"Full Amazon FBA management across all EU marketplaces", dmoAmzC2:"PPC Advertising", dmoAmzC2S:"Sponsored ads, DSP campaigns, brand store management", dmoAmzC3:"Price Control", dmoAmzC3S:"MAP enforcement, Buy Box optimization, competitor monitoring", dmoAmzC4:"Exclusive Rights", dmoAmzC4S:"One brand, one partner — full market protection guaranteed", dmoAmzActiveOn:"Active on", dmoCtaTitle:"Ready to Join?", dmoCtaSub:"Choose your role — it's free to register and get started today", dmoCtaBrand:"I'm a Brand", dmoCtaDist:"I'm a Distributor", dmoCtaBack:"Back to login" });
Object.assign(T.it,{ dmoIntroTag:"Piattaforma globale di distribuzione B2B", dmoIntroSub:"Colleghiamo brand e distributori in tutta Europa — automatico, istantaneo, scalabile", dmoProbTitle:"Il vecchio metodo non funziona", dmoProb1:"Email e telefonate infinite per gestire i distributori", dmoProb2:"Nessuna visibilità in tempo reale sulle giacenze", dmoProb3:"Fatture manuali e solleciti di pagamento", dmoProb4:"Zero market intelligence o dati sui territori", dmoSolTitle:"Una piattaforma. Tutto.", dmoSolSub:"NexusHub automatizza l'intera catena distributiva — dal catalogo al pagamento — in tutta Europa", dmoSolCountries:"Paesi", dmoSolDelivery:"Consegna", dmoSolAutomated:"Automatizzato", dmoSecTitle:"Ogni settore. Un solo hub.", dmoSecSub:"NexusHub funziona in tutte le categorie di prodotti B2B", dmoSecBeauty:"Beauty", dmoSecBeautyS:"Cosmetici e profumi", dmoSecFashion:"Moda", dmoSecFashionS:"Abbigliamento e accessori", dmoSecFood:"Food & Beverage", dmoSecFoodS:"Premium e specialità", dmoSecElec:"Elettronica", dmoSecElecS:"Tech consumer e pro", dmoSecHome:"Casa e living", dmoSecHomeS:"Design e arredamento", dmoSecHealth:"Salute", dmoSecHealthS:"OTC e benessere", dmoMapTitle:"Un hub. Connessioni illimitate.", dmoMapSub:"Da Torino raggiungiamo ogni mercato europeo — veloce, diretto, esclusivo", dmoBrTitle:"Per i brand", dmoBrSub:"Controllo totale. Visibilità totale. Zero lavoro manuale.", dmoBr1:"Gestione dei territori — un distributore per paese", dmoBr2:"Stock in tempo reale con regole d'ordine (MOQ, multipli)", dmoBr3:"Approva distributori e documenti con un clic", dmoBr4:"Pagamenti SEPA automatici — ricevi i fondi all'istante", dmoDiTitle:"Per i distributori", dmoDiSub:"Accedi a brand premium. Fai crescere il tuo territorio.", dmoDi1:"Sfoglia e candidati ai migliori brand globali", dmoDi2:"Ordina dal catalogo live con stock in tempo reale", dmoDi3:"Consegna in 48h dall'hub europeo di Torino", dmoDi4:"Analytics dei ricavi e dashboard performance territorio", dmoValTitle:"Più flusso. Più ricavi.", dmoValSub:"NexusHub elimina gli attriti — una rotazione più veloce dello stock significa più ricavi per tutti", dmoValStock:"Arriva lo stock", dmoValStockS:"Aggiornamento catalogo in tempo reale", dmoValOrders:"Il distributore ordina", dmoValOrdersS:"Pagamento SEPA istantaneo", dmoValRev:"I ricavi scorrono", dmoValRevS:"Vincono brand + distributore", dmoValM1:"Rotazione più veloce", dmoValM2:"Lavoro manuale", dmoValM3:"Ricavi per tutti", dmoNumTitle:"Costruito per scalare", dmoNum1:"GMV della piattaforma", dmoNum2:"Distributori attivi", dmoNum3:"Pallet / mese", dmoNum4:"Dall'hub alla porta", dmoAmzService:"Servizio di gestione esclusivo", dmoAmzSub:"Gestiamo tutto noi — tu incassi i ricavi", dmoAmzC1:"Logistica FBA", dmoAmzC1S:"Gestione FBA Amazon completa su tutti i marketplace UE", dmoAmzC2:"Advertising PPC", dmoAmzC2S:"Sponsored ads, campagne DSP, gestione brand store", dmoAmzC3:"Controllo prezzi", dmoAmzC3S:"Applicazione MAP, ottimizzazione Buy Box, monitoraggio concorrenza", dmoAmzC4:"Diritti esclusivi", dmoAmzC4S:"Un brand, un partner — protezione totale del mercato garantita", dmoAmzActiveOn:"Attivi su", dmoCtaTitle:"Pronto a entrare?", dmoCtaSub:"Scegli il tuo ruolo — registrarsi è gratis, inizia oggi", dmoCtaBrand:"Sono un brand", dmoCtaDist:"Sono un distributore", dmoCtaBack:"Torna al login" });
Object.assign(T.fr,{ dmoIntroTag:"Plateforme mondiale de distribution B2B", dmoIntroSub:"Nous connectons marques et distributeurs dans toute l'Europe — automatisé, instantané, évolutif", dmoProbTitle:"L'ancienne méthode est dépassée", dmoProb1:"E-mails et appels sans fin pour gérer les distributeurs", dmoProb2:"Aucune visibilité en temps réel sur les stocks", dmoProb3:"Factures manuelles et relances de paiement", dmoProb4:"Aucune intelligence de marché ni données territoriales", dmoSolTitle:"Une plateforme. Tout.", dmoSolSub:"NexusHub automatise toute la chaîne de distribution — du catalogue au paiement — dans toute l'Europe", dmoSolCountries:"Pays", dmoSolDelivery:"Livraison", dmoSolAutomated:"Automatisé", dmoSecTitle:"Chaque secteur. Un seul hub.", dmoSecSub:"NexusHub fonctionne dans toutes les catégories de produits B2B", dmoSecBeauty:"Beauté", dmoSecBeautyS:"Cosmétiques et parfums", dmoSecFashion:"Mode", dmoSecFashionS:"Vêtements et accessoires", dmoSecFood:"Alimentation et boissons", dmoSecFoodS:"Premium et spécialités", dmoSecElec:"Électronique", dmoSecElecS:"Tech grand public et pro", dmoSecHome:"Maison et décoration", dmoSecHomeS:"Design et mobilier", dmoSecHealth:"Santé", dmoSecHealthS:"OTC et bien-être", dmoMapTitle:"Un hub. Des connexions illimitées.", dmoMapSub:"Depuis Turin, nous atteignons chaque marché européen — rapide, direct, exclusif", dmoBrTitle:"Pour les marques", dmoBrSub:"Contrôle total. Visibilité totale. Zéro travail manuel.", dmoBr1:"Gestion des territoires — un distributeur par pays", dmoBr2:"Stock en temps réel avec règles de commande (MOQ, multiples)", dmoBr3:"Approuvez distributeurs et documents en un clic", dmoBr4:"Paiements SEPA automatiques — recevez les fonds instantanément", dmoDiTitle:"Pour les distributeurs", dmoDiSub:"Accédez à des marques premium. Développez votre territoire.", dmoDi1:"Parcourez et postulez auprès des meilleures marques mondiales", dmoDi2:"Commandez depuis le catalogue en direct avec stock en temps réel", dmoDi3:"Livraison en 48h depuis le hub européen de Turin", dmoDi4:"Analytique des revenus et tableau de bord de performance territoriale", dmoValTitle:"Plus de flux. Plus de revenus.", dmoValSub:"NexusHub supprime les frictions — une rotation des stocks plus rapide, c'est plus de revenus pour tous", dmoValStock:"Le stock arrive", dmoValStockS:"Mise à jour du catalogue en temps réel", dmoValOrders:"Le distributeur commande", dmoValOrdersS:"Paiement SEPA instantané", dmoValRev:"Les revenus circulent", dmoValRevS:"Marque + distributeur gagnent", dmoValM1:"Rotation plus rapide", dmoValM2:"Travail manuel", dmoValM3:"Des revenus pour tous", dmoNumTitle:"Conçu pour l'échelle", dmoNum1:"GMV de la plateforme", dmoNum2:"Distributeurs actifs", dmoNum3:"Palettes / mois", dmoNum4:"Du hub à la porte", dmoAmzService:"Service de gestion exclusif", dmoAmzSub:"Nous gérons tout — vous encaissez les revenus", dmoAmzC1:"Logistique FBA", dmoAmzC1S:"Gestion complète Amazon FBA sur toutes les places de marché UE", dmoAmzC2:"Publicité PPC", dmoAmzC2S:"Publicités sponsorisées, campagnes DSP, gestion de la boutique de marque", dmoAmzC3:"Contrôle des prix", dmoAmzC3S:"Application MAP, optimisation de la Buy Box, surveillance des concurrents", dmoAmzC4:"Droits exclusifs", dmoAmzC4S:"Une marque, un partenaire — protection totale du marché garantie", dmoAmzActiveOn:"Actifs sur", dmoCtaTitle:"Prêt à nous rejoindre ?", dmoCtaSub:"Choisissez votre rôle — l'inscription est gratuite, commencez aujourd'hui", dmoCtaBrand:"Je suis une marque", dmoCtaDist:"Je suis un distributeur", dmoCtaBack:"Retour à la connexion" });
Object.assign(T.es,{ dmoIntroTag:"Plataforma global de distribución B2B", dmoIntroSub:"Conectamos marcas y distribuidores en toda Europa — automático, instantáneo, escalable", dmoProbTitle:"La vieja forma está rota", dmoProb1:"Correos y llamadas interminables para gestionar distribuidores", dmoProb2:"Sin visibilidad en tiempo real del stock", dmoProb3:"Facturas manuales y persecución de pagos", dmoProb4:"Cero inteligencia de mercado o datos de territorio", dmoSolTitle:"Una plataforma. Todo.", dmoSolSub:"NexusHub automatiza toda la cadena de distribución — del catálogo al pago — en toda Europa", dmoSolCountries:"Países", dmoSolDelivery:"Entrega", dmoSolAutomated:"Automatizado", dmoSecTitle:"Cada sector. Un solo hub.", dmoSecSub:"NexusHub funciona en todas las categorías de productos B2B", dmoSecBeauty:"Belleza", dmoSecBeautyS:"Cosmética y perfumería", dmoSecFashion:"Moda", dmoSecFashionS:"Ropa y accesorios", dmoSecFood:"Alimentos y bebidas", dmoSecFoodS:"Premium y especialidades", dmoSecElec:"Electrónica", dmoSecElecS:"Tecnología de consumo y pro", dmoSecHome:"Hogar y decoración", dmoSecHomeS:"Diseño y mobiliario", dmoSecHealth:"Salud", dmoSecHealthS:"OTC y bienestar", dmoMapTitle:"Un hub. Conexiones ilimitadas.", dmoMapSub:"Desde Turín llegamos a cada mercado europeo — rápido, directo, exclusivo", dmoBrTitle:"Para marcas", dmoBrSub:"Control total. Visibilidad total. Cero trabajo manual.", dmoBr1:"Gestión de territorios — un distribuidor por país", dmoBr2:"Stock en tiempo real con reglas de pedido (MOQ, múltiplos)", dmoBr3:"Aprueba distribuidores y documentos con un clic", dmoBr4:"Pagos SEPA automáticos — recibe los fondos al instante", dmoDiTitle:"Para distribuidores", dmoDiSub:"Accede a marcas premium. Haz crecer tu territorio.", dmoDi1:"Explora y postúlate a las mejores marcas globales", dmoDi2:"Pide desde el catálogo en vivo con stock en tiempo real", dmoDi3:"Entrega en 48h desde el hub europeo de Turín", dmoDi4:"Analítica de ingresos y panel de rendimiento del territorio", dmoValTitle:"Más flujo. Más ingresos.", dmoValSub:"NexusHub elimina la fricción — una rotación de stock más rápida significa más ingresos para todos", dmoValStock:"Llega el stock", dmoValStockS:"Actualización del catálogo en tiempo real", dmoValOrders:"El distribuidor pide", dmoValOrdersS:"Pago SEPA instantáneo", dmoValRev:"Fluyen los ingresos", dmoValRevS:"Ganan marca + distribuidor", dmoValM1:"Rotación más rápida", dmoValM2:"Trabajo manual", dmoValM3:"Ingresos para todos", dmoNumTitle:"Diseñado para escalar", dmoNum1:"GMV de la plataforma", dmoNum2:"Distribuidores activos", dmoNum3:"Palés / mes", dmoNum4:"Del hub a la puerta", dmoAmzService:"Servicio de gestión exclusivo", dmoAmzSub:"Nos encargamos de todo — tú cobras los ingresos", dmoAmzC1:"Logística FBA", dmoAmzC1S:"Gestión completa de Amazon FBA en todos los marketplaces de la UE", dmoAmzC2:"Publicidad PPC", dmoAmzC2S:"Anuncios patrocinados, campañas DSP, gestión de la tienda de marca", dmoAmzC3:"Control de precios", dmoAmzC3S:"Aplicación de MAP, optimización de Buy Box, monitoreo de competidores", dmoAmzC4:"Derechos exclusivos", dmoAmzC4S:"Una marca, un socio — protección total del mercado garantizada", dmoAmzActiveOn:"Activos en", dmoCtaTitle:"¿Listo para unirte?", dmoCtaSub:"Elige tu rol — registrarse es gratis, empieza hoy", dmoCtaBrand:"Soy una marca", dmoCtaDist:"Soy un distribuidor", dmoCtaBack:"Volver al inicio de sesión" });
Object.assign(T.de,{ dmoIntroTag:"Globale B2B-Distributionsplattform", dmoIntroSub:"Wir verbinden Marken und Händler in ganz Europa — automatisiert, sofort, skalierbar", dmoProbTitle:"Der alte Weg funktioniert nicht mehr", dmoProb1:"Endlose E-Mails und Anrufe zur Händlerverwaltung", dmoProb2:"Keine Echtzeit-Sicht auf den Bestand", dmoProb3:"Manuelle Rechnungen und Zahlungsverfolgung", dmoProb4:"Keine Marktdaten oder Gebietsdaten", dmoSolTitle:"Eine Plattform. Alles.", dmoSolSub:"NexusHub automatisiert die gesamte Vertriebskette — vom Katalog bis zur Zahlung — in ganz Europa", dmoSolCountries:"Länder", dmoSolDelivery:"Lieferung", dmoSolAutomated:"Automatisiert", dmoSecTitle:"Jede Branche. Ein Hub.", dmoSecSub:"NexusHub funktioniert in allen B2B-Produktkategorien", dmoSecBeauty:"Beauty", dmoSecBeautyS:"Kosmetik & Düfte", dmoSecFashion:"Mode", dmoSecFashionS:"Bekleidung & Accessoires", dmoSecFood:"Food & Beverage", dmoSecFoodS:"Premium & Spezialitäten", dmoSecElec:"Elektronik", dmoSecElecS:"Consumer- & Pro-Technik", dmoSecHome:"Wohnen & Living", dmoSecHomeS:"Design & Möbel", dmoSecHealth:"Gesundheit", dmoSecHealthS:"OTC & Wellness", dmoMapTitle:"Ein Hub. Grenzenlose Verbindungen.", dmoMapSub:"Von Turin aus erreichen wir jeden europäischen Markt — schnell, direkt, exklusiv", dmoBrTitle:"Für Marken", dmoBrSub:"Volle Kontrolle. Volle Transparenz. Null Handarbeit.", dmoBr1:"Gebietsverwaltung — ein Händler pro Land", dmoBr2:"Echtzeit-Bestand mit Bestellregeln (MOQ, Vielfache)", dmoBr3:"Händler & Dokumente mit einem Klick freigeben", dmoBr4:"Automatische SEPA-Zahlungen — Gelder sofort erhalten", dmoDiTitle:"Für Händler", dmoDiSub:"Zugang zu Premium-Marken. Erweitere dein Gebiet.", dmoDi1:"Top-Weltmarken durchsuchen & bewerben", dmoDi2:"Aus Live-Katalog mit Echtzeit-Bestand bestellen", dmoDi3:"48h-Lieferung vom europäischen Hub in Turin", dmoDi4:"Umsatzanalysen & Gebiets-Performance-Dashboard", dmoValTitle:"Mehr Fluss. Mehr Umsatz.", dmoValSub:"NexusHub beseitigt Reibung — schnellere Lagerrotation bedeutet mehr Umsatz für alle", dmoValStock:"Bestand kommt an", dmoValStockS:"Echtzeit-Katalogaktualisierung", dmoValOrders:"Händler bestellt", dmoValOrdersS:"Sofortige SEPA-Zahlung", dmoValRev:"Umsatz fließt", dmoValRevS:"Marke + Händler gewinnen", dmoValM1:"Schnellere Rotation", dmoValM2:"Handarbeit", dmoValM3:"Umsatz für alle", dmoNumTitle:"Für Skalierung gebaut", dmoNum1:"Plattform-GMV", dmoNum2:"Aktive Händler", dmoNum3:"Paletten / Monat", dmoNum4:"Vom Hub zur Tür", dmoAmzService:"Exklusiver Management-Service", dmoAmzSub:"Wir kümmern uns um alles — du kassierst den Umsatz", dmoAmzC1:"FBA-Logistik", dmoAmzC1S:"Vollständiges Amazon-FBA-Management auf allen EU-Marktplätzen", dmoAmzC2:"PPC-Werbung", dmoAmzC2S:"Sponsored Ads, DSP-Kampagnen, Brand-Store-Verwaltung", dmoAmzC3:"Preiskontrolle", dmoAmzC3S:"MAP-Durchsetzung, Buy-Box-Optimierung, Wettbewerbsbeobachtung", dmoAmzC4:"Exklusivrechte", dmoAmzC4S:"Eine Marke, ein Partner — voller Marktschutz garantiert", dmoAmzActiveOn:"Aktiv auf", dmoCtaTitle:"Bereit mitzumachen?", dmoCtaSub:"Wähle deine Rolle — die Registrierung ist kostenlos, starte noch heute", dmoCtaBrand:"Ich bin eine Marke", dmoCtaDist:"Ich bin ein Händler", dmoCtaBack:"Zurück zum Login" });
Object.assign(T.zh,{ dmoIntroTag:"全球 B2B 分销平台", dmoIntroSub:"连接全欧洲的品牌与经销商 —— 自动化、即时、可扩展", dmoProbTitle:"旧模式已经失灵", dmoProb1:"为管理经销商而无休止地发邮件、打电话", dmoProb2:"无法实时掌握库存", dmoProb3:"手动开票、追讨付款", dmoProb4:"毫无市场情报或区域数据", dmoSolTitle:"一个平台，包揽一切。", dmoSolSub:"NexusHub 自动化整个分销链 —— 从目录到付款 —— 覆盖全欧洲", dmoSolCountries:"国家", dmoSolDelivery:"交付", dmoSolAutomated:"自动化", dmoSecTitle:"每个行业，一个枢纽。", dmoSecSub:"NexusHub 适用于所有 B2B 产品类别", dmoSecBeauty:"美妆", dmoSecBeautyS:"化妆品与香水", dmoSecFashion:"时尚", dmoSecFashionS:"服装与配饰", dmoSecFood:"食品与饮料", dmoSecFoodS:"高端与特色", dmoSecElec:"电子产品", dmoSecElecS:"消费与专业科技", dmoSecHome:"家居生活", dmoSecHomeS:"设计与家具", dmoSecHealth:"健康", dmoSecHealthS:"非处方药与健康", dmoMapTitle:"一个枢纽，无限连接。", dmoMapSub:"从都灵出发，直达每一个欧洲市场 —— 快速、直接、专属", dmoBrTitle:"面向品牌", dmoBrSub:"完全掌控。完全可见。零手动操作。", dmoBr1:"区域管理 —— 每个国家一个经销商", dmoBr2:"实时库存与订购规则（MOQ、倍数）", dmoBr3:"一键批准经销商与文件", dmoBr4:"自动 SEPA 付款 —— 即时到账", dmoDiTitle:"面向经销商", dmoDiSub:"接触高端品牌。拓展你的区域。", dmoDi1:"浏览并申请全球顶级品牌", dmoDi2:"从实时目录下单，库存实时更新", dmoDi3:"从都灵欧洲枢纽 48 小时送达", dmoDi4:"营收分析与区域业绩仪表盘", dmoValTitle:"更多流动，更多营收。", dmoValSub:"NexusHub 消除摩擦 —— 库存周转更快，人人营收更高", dmoValStock:"库存到货", dmoValStockS:"实时更新目录", dmoValOrders:"经销商下单", dmoValOrdersS:"即时 SEPA 付款", dmoValRev:"营收流动", dmoValRevS:"品牌与经销商双赢", dmoValM1:"更快周转", dmoValM2:"手动工作", dmoValM3:"人人营收", dmoNumTitle:"为规模而生", dmoNum1:"平台 GMV", dmoNum2:"活跃经销商", dmoNum3:"托盘 / 月", dmoNum4:"从枢纽到家门", dmoAmzService:"独家管理服务", dmoAmzSub:"一切由我们打理 —— 营收归你", dmoAmzC1:"FBA 物流", dmoAmzC1S:"在所有欧盟站点全面管理亚马逊 FBA", dmoAmzC2:"PPC 广告", dmoAmzC2S:"赞助广告、DSP 活动、品牌旗舰店管理", dmoAmzC3:"价格管控", dmoAmzC3S:"执行 MAP、优化 Buy Box、竞品监控", dmoAmzC4:"独家权益", dmoAmzC4S:"一个品牌，一个伙伴 —— 保障全面的市场保护", dmoAmzActiveOn:"已上线", dmoCtaTitle:"准备好加入了吗？", dmoCtaSub:"选择你的角色 —— 注册免费，今天就开始", dmoCtaBrand:"我是品牌方", dmoCtaDist:"我是经销商", dmoCtaBack:"返回登录" });
Object.assign(T.ar,{ dmoIntroTag:"منصة توزيع B2B عالمية", dmoIntroSub:"نربط العلامات والموزّعين في جميع أنحاء أوروبا — آلي وفوري وقابل للتوسّع", dmoProbTitle:"الطريقة القديمة لم تعد تعمل", dmoProb1:"رسائل ومكالمات لا تنتهي لإدارة الموزّعين", dmoProb2:"لا رؤية آنية للمخزون", dmoProb3:"فواتير يدوية ومطاردة للمدفوعات", dmoProb4:"صفر معلومات سوقية أو بيانات عن المناطق", dmoSolTitle:"منصة واحدة. كل شيء.", dmoSolSub:"يُؤتمت NexusHub سلسلة التوزيع بالكامل — من الكتالوج إلى الدفع — في أنحاء أوروبا", dmoSolCountries:"دولة", dmoSolDelivery:"توصيل", dmoSolAutomated:"آلي", dmoSecTitle:"كل قطاع. مركز واحد.", dmoSecSub:"يعمل NexusHub في جميع فئات منتجات B2B", dmoSecBeauty:"الجمال", dmoSecBeautyS:"مستحضرات التجميل والعطور", dmoSecFashion:"الموضة", dmoSecFashionS:"الملابس والإكسسوارات", dmoSecFood:"الأغذية والمشروبات", dmoSecFoodS:"بريميوم وتخصصية", dmoSecElec:"الإلكترونيات", dmoSecElecS:"تقنية استهلاكية واحترافية", dmoSecHome:"المنزل والمعيشة", dmoSecHomeS:"التصميم والأثاث", dmoSecHealth:"الصحة", dmoSecHealthS:"الأدوية دون وصفة والعافية", dmoMapTitle:"مركز واحد. اتصالات لا حدود لها.", dmoMapSub:"من تورينو نصل إلى كل سوق أوروبي — سريع ومباشر وحصري", dmoBrTitle:"للعلامات التجارية", dmoBrSub:"تحكّم كامل. رؤية كاملة. صفر عمل يدوي.", dmoBr1:"إدارة المناطق — موزّع واحد لكل دولة", dmoBr2:"مخزون آني مع قواعد الطلب (MOQ، مضاعفات)", dmoBr3:"اعتمد الموزّعين والمستندات بنقرة واحدة", dmoBr4:"مدفوعات SEPA تلقائية — استلم الأموال فورًا", dmoDiTitle:"للموزّعين", dmoDiSub:"احصل على علامات بريميوم. وسّع منطقتك.", dmoDi1:"تصفّح وقدّم لأفضل العلامات العالمية", dmoDi2:"اطلب من كتالوج حيّ بمخزون آني", dmoDi3:"توصيل خلال 48 ساعة من مركز تورينو الأوروبي", dmoDi4:"تحليلات الإيرادات ولوحة أداء المنطقة", dmoValTitle:"تدفّق أكثر. إيرادات أكثر.", dmoValSub:"يزيل NexusHub الاحتكاك — دوران أسرع للمخزون يعني إيرادات أكثر للجميع", dmoValStock:"يصل المخزون", dmoValStockS:"تحديث الكتالوج آنيًا", dmoValOrders:"يطلب الموزّع", dmoValOrdersS:"دفع SEPA فوري", dmoValRev:"تتدفّق الإيرادات", dmoValRevS:"تفوز العلامة + الموزّع", dmoValM1:"دوران أسرع", dmoValM2:"عمل يدوي", dmoValM3:"إيرادات للجميع", dmoNumTitle:"مبني للتوسّع", dmoNum1:"إجمالي مبيعات المنصة (GMV)", dmoNum2:"موزّعون نشطون", dmoNum3:"منصات نقالة / شهر", dmoNum4:"من المركز إلى الباب", dmoAmzService:"خدمة إدارة حصرية", dmoAmzSub:"نتولّى كل شيء — وأنت تحصّل الإيرادات", dmoAmzC1:"لوجستيات FBA", dmoAmzC1S:"إدارة كاملة لـ Amazon FBA في جميع أسواق الاتحاد الأوروبي", dmoAmzC2:"إعلانات PPC", dmoAmzC2S:"إعلانات ممولة، حملات DSP، إدارة متجر العلامة", dmoAmzC3:"التحكّم بالأسعار", dmoAmzC3S:"فرض MAP، تحسين Buy Box، مراقبة المنافسين", dmoAmzC4:"حقوق حصرية", dmoAmzC4S:"علامة واحدة، شريك واحد — حماية كاملة للسوق مضمونة", dmoAmzActiveOn:"نشط على", dmoCtaTitle:"جاهز للانضمام؟", dmoCtaSub:"اختر دورك — التسجيل مجاني، ابدأ اليوم", dmoCtaBrand:"أنا علامة تجارية", dmoCtaDist:"أنا موزّع", dmoCtaBack:"العودة لتسجيل الدخول" });
Object.assign(T.en,{ rgBankHdrBrand:"Banking Details for Receiving Payments", rgBankHdrDist:"Shipping Address and Banking Details", rgBankInfoBrand:"Distributors will use these details to send you payments via SEPA transfer", rgBankInfoDist:"These details will be used for order payments", rgAddr:"Address (Street/Square)", rgAddrPh:"e.g. Via Roma 1", rgCity:"City", rgCityPh:"e.g. Bucharest", rgZip:"Postal Code", rgZipPh:"e.g. 010101", rgProvince:"Province/Region", rgProvincePh:"e.g. Sector 1", rgAcctHolder:"Account Holder", rgAcctHolderPh:"Name/Company Name", rgBank:"Bank", rgBankPh:"e.g. Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (optional)", rgSwiftPh:"e.g. UNCRITMM", rgFiscalHdr:"Tax Details", rgVatNumber:"VAT Number" });
Object.assign(T.it,{ rgBankHdrBrand:"Dati Bancari per Ricezione Pagamenti", rgBankHdrDist:"Indirizzo di Spedizione e Dati Bancari", rgBankInfoBrand:"I distributori useranno questi dati per inviarti i pagamenti via bonifico SEPA", rgBankInfoDist:"Questi dati saranno usati per i pagamenti degli ordini", rgAddr:"Indirizzo (Via/Piazza)", rgAddrPh:"es. Via Roma 1", rgCity:"Città", rgCityPh:"es. Bucarest", rgZip:"CAP", rgZipPh:"es. 010101", rgProvince:"Provincia/Regione", rgProvincePh:"es. Sector 1", rgAcctHolder:"Intestatario Conto", rgAcctHolderPh:"Nome/Ragione Sociale", rgBank:"Banca", rgBankPh:"es. Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (opzionale)", rgSwiftPh:"es. UNCRITMM", rgFiscalHdr:"Dati Fiscali", rgVatNumber:"Partita IVA" });
Object.assign(T.fr,{ rgBankHdrBrand:"Coordonnées bancaires pour recevoir les paiements", rgBankHdrDist:"Adresse de livraison et coordonnées bancaires", rgBankInfoBrand:"Les distributeurs utiliseront ces informations pour vous envoyer les paiements par virement SEPA", rgBankInfoDist:"Ces informations serviront aux paiements des commandes", rgAddr:"Adresse (rue/place)", rgAddrPh:"ex. Via Roma 1", rgCity:"Ville", rgCityPh:"ex. Bucarest", rgZip:"Code postal", rgZipPh:"ex. 010101", rgProvince:"Province/Région", rgProvincePh:"ex. Sector 1", rgAcctHolder:"Titulaire du compte", rgAcctHolderPh:"Nom/Raison sociale", rgBank:"Banque", rgBankPh:"ex. Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (optionnel)", rgSwiftPh:"ex. UNCRITMM", rgFiscalHdr:"Données fiscales", rgVatNumber:"Numéro de TVA" });
Object.assign(T.es,{ rgBankHdrBrand:"Datos bancarios para recibir pagos", rgBankHdrDist:"Dirección de envío y datos bancarios", rgBankInfoBrand:"Los distribuidores usarán estos datos para enviarte pagos por transferencia SEPA", rgBankInfoDist:"Estos datos se usarán para los pagos de los pedidos", rgAddr:"Dirección (calle/plaza)", rgAddrPh:"ej. Via Roma 1", rgCity:"Ciudad", rgCityPh:"ej. Bucarest", rgZip:"Código postal", rgZipPh:"ej. 010101", rgProvince:"Provincia/Región", rgProvincePh:"ej. Sector 1", rgAcctHolder:"Titular de la cuenta", rgAcctHolderPh:"Nombre/Razón social", rgBank:"Banco", rgBankPh:"ej. Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (opcional)", rgSwiftPh:"ej. UNCRITMM", rgFiscalHdr:"Datos fiscales", rgVatNumber:"Número de IVA" });
Object.assign(T.de,{ rgBankHdrBrand:"Bankdaten für den Zahlungseingang", rgBankHdrDist:"Lieferadresse und Bankdaten", rgBankInfoBrand:"Händler nutzen diese Daten, um dir Zahlungen per SEPA-Überweisung zu senden", rgBankInfoDist:"Diese Daten werden für Bestellzahlungen verwendet", rgAddr:"Adresse (Straße/Platz)", rgAddrPh:"z.B. Via Roma 1", rgCity:"Stadt", rgCityPh:"z.B. Bukarest", rgZip:"PLZ", rgZipPh:"z.B. 010101", rgProvince:"Provinz/Region", rgProvincePh:"z.B. Sector 1", rgAcctHolder:"Kontoinhaber", rgAcctHolderPh:"Name/Firmenname", rgBank:"Bank", rgBankPh:"z.B. Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (optional)", rgSwiftPh:"z.B. UNCRITMM", rgFiscalHdr:"Steuerdaten", rgVatNumber:"USt-IdNr." });
Object.assign(T.zh,{ rgBankHdrBrand:"收款银行信息", rgBankHdrDist:"收货地址与银行信息", rgBankInfoBrand:"经销商将使用这些信息通过 SEPA 转账向你付款", rgBankInfoDist:"这些信息将用于订单付款", rgAddr:"地址（街道/广场）", rgAddrPh:"例如 Via Roma 1", rgCity:"城市", rgCityPh:"例如 布加勒斯特", rgZip:"邮编", rgZipPh:"例如 010101", rgProvince:"省/地区", rgProvincePh:"例如 Sector 1", rgAcctHolder:"账户持有人", rgAcctHolderPh:"姓名/公司名称", rgBank:"银行", rgBankPh:"例如 Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC（可选）", rgSwiftPh:"例如 UNCRITMM", rgFiscalHdr:"税务信息", rgVatNumber:"增值税号" });
Object.assign(T.ar,{ rgBankHdrBrand:"بيانات البنك لاستلام المدفوعات", rgBankHdrDist:"عنوان الشحن والبيانات المصرفية", rgBankInfoBrand:"سيستخدم الموزّعون هذه البيانات لإرسال المدفوعات إليك عبر تحويل SEPA", rgBankInfoDist:"ستُستخدم هذه البيانات لمدفوعات الطلبات", rgAddr:"العنوان (شارع/ميدان)", rgAddrPh:"مثال: Via Roma 1", rgCity:"المدينة", rgCityPh:"مثال: بوخارست", rgZip:"الرمز البريدي", rgZipPh:"مثال: 010101", rgProvince:"المحافظة/المنطقة", rgProvincePh:"مثال: Sector 1", rgAcctHolder:"صاحب الحساب", rgAcctHolderPh:"الاسم/اسم الشركة", rgBank:"البنك", rgBankPh:"مثال: Unicredit, Intesa...", rgIbanLbl:"IBAN", rgSwift:"SWIFT/BIC (اختياري)", rgSwiftPh:"مثال: UNCRITMM", rgFiscalHdr:"البيانات الضريبية", rgVatNumber:"الرقم الضريبي (VAT)" });
Object.assign(T.en,{ ddIssueSent:"Issue submitted. It stays tracked and you'll be contacted back.", ddIssueErr:"Error submitting the issue.", ddOrderErr:"Order error:", ddNoProdAvail:"No product from this order is available in your catalog yet.", ddStripeNotCfg:"⚙️ Stripe not configured yet. Contact NexusHub to enable card payments.", ddStripeErr:"Stripe error:", ddRetry:"Try again", ddError:"Error:", ddDocs:"Documents", ddClose:"Close", ddReportIssue:"Report a problem", ddSave:"Save", ddNewAccessReq:"New access request", ddWishlist:"Wishlist", ddInvoices:"Invoices", ddAISuggest:"AI Suggestions", ddAttachPhoto:"Attach photo (optional)", ddViewAgreement:"📄 View signed agreement", ddSignAgreement:"✍️ Review & sign agreement", ddInWishlist:"♥ In wishlist", ddAddWishlist:"♡ Add to wishlist", ddSending:"Sending...", ddSendIssue:"Send report", ddConfirmWire:"🏦 Confirm Order — Pay via Bank Transfer", ddConfirmSepa:"⚡ Confirm Order — SEPA Debit", ddPayCard:"Pay by Card via Stripe", ddCancel:"Cancel", ddSeeOrders:"See my orders →", noNotif:"No notifications" });
Object.assign(T.it,{ ddIssueSent:"Segnalazione inviata. Resta tracciata e verrai ricontattato.", ddIssueErr:"Errore nell'invio della segnalazione.", ddOrderErr:"Errore nell'ordine:", ddNoProdAvail:"Nessun prodotto di questo ordine è ancora disponibile nel tuo catalogo.", ddStripeNotCfg:"⚙️ Stripe non ancora configurato. Contatta NexusHub per abilitare i pagamenti con carta.", ddStripeErr:"Errore Stripe:", ddRetry:"Riprova", ddError:"Errore:", ddDocs:"Documenti", ddClose:"Chiudi", ddReportIssue:"Segnala un problema", ddSave:"Salva", ddNewAccessReq:"Nuova richiesta di accesso", ddWishlist:"Desideri", ddInvoices:"Fatture", ddAISuggest:"Suggerimenti AI", ddAttachPhoto:"Allega foto (opzionale)", ddViewAgreement:"📄 Vedi contratto firmato", ddSignAgreement:"✍️ Rivedi e firma il contratto", ddInWishlist:"♥ Nei desideri", ddAddWishlist:"♡ Aggiungi ai desideri", ddSending:"Invio...", ddSendIssue:"Invia segnalazione", ddConfirmWire:"🏦 Conferma Ordine — Paga via Bonifico", ddConfirmSepa:"⚡ Conferma Ordine — SEPA Debit", ddPayCard:"Paga con Carta via Stripe", ddCancel:"Annulla", ddSeeOrders:"Vedi i miei ordini →", noNotif:"Nessuna notifica" });
Object.assign(T.fr,{ ddIssueSent:"Signalement envoyé. Il reste suivi et vous serez recontacté.", ddIssueErr:"Erreur lors de l'envoi du signalement.", ddOrderErr:"Erreur de commande :", ddNoProdAvail:"Aucun produit de cette commande n'est encore disponible dans votre catalogue.", ddStripeNotCfg:"⚙️ Stripe pas encore configuré. Contactez NexusHub pour activer les paiements par carte.", ddStripeErr:"Erreur Stripe :", ddRetry:"Réessayer", ddError:"Erreur :", ddDocs:"Documents", ddClose:"Fermer", ddReportIssue:"Signaler un problème", ddSave:"Enregistrer", ddNewAccessReq:"Nouvelle demande d'accès", ddWishlist:"Favoris", ddInvoices:"Factures", ddAISuggest:"Suggestions IA", ddAttachPhoto:"Joindre une photo (facultatif)", ddViewAgreement:"📄 Voir l'accord signé", ddSignAgreement:"✍️ Vérifier et signer l'accord", ddInWishlist:"♥ Dans les favoris", ddAddWishlist:"♡ Ajouter aux favoris", ddSending:"Envoi...", ddSendIssue:"Envoyer le signalement", ddConfirmWire:"🏦 Confirmer la commande — Payer par virement", ddConfirmSepa:"⚡ Confirmer la commande — Prélèvement SEPA", ddPayCard:"Payer par carte via Stripe", ddCancel:"Annuler", ddSeeOrders:"Voir mes commandes →", noNotif:"Aucune notification" });
Object.assign(T.es,{ ddIssueSent:"Incidencia enviada. Queda registrada y te contactaremos.", ddIssueErr:"Error al enviar la incidencia.", ddOrderErr:"Error en el pedido:", ddNoProdAvail:"Ningún producto de este pedido está aún disponible en tu catálogo.", ddStripeNotCfg:"⚙️ Stripe aún no configurado. Contacta a NexusHub para habilitar pagos con tarjeta.", ddStripeErr:"Error de Stripe:", ddRetry:"Reintentar", ddError:"Error:", ddDocs:"Documentos", ddClose:"Cerrar", ddReportIssue:"Reportar un problema", ddSave:"Guardar", ddNewAccessReq:"Nueva solicitud de acceso", ddWishlist:"Deseos", ddInvoices:"Facturas", ddAISuggest:"Sugerencias de IA", ddAttachPhoto:"Adjuntar foto (opcional)", ddViewAgreement:"📄 Ver acuerdo firmado", ddSignAgreement:"✍️ Revisar y firmar el acuerdo", ddInWishlist:"♥ En deseos", ddAddWishlist:"♡ Añadir a deseos", ddSending:"Enviando...", ddSendIssue:"Enviar reporte", ddConfirmWire:"🏦 Confirmar pedido — Pagar por transferencia", ddConfirmSepa:"⚡ Confirmar pedido — Adeudo SEPA", ddPayCard:"Pagar con tarjeta vía Stripe", ddCancel:"Cancelar", ddSeeOrders:"Ver mis pedidos →", noNotif:"Sin notificaciones" });
Object.assign(T.de,{ ddIssueSent:"Meldung gesendet. Sie bleibt nachverfolgt und du wirst kontaktiert.", ddIssueErr:"Fehler beim Senden der Meldung.", ddOrderErr:"Bestellfehler:", ddNoProdAvail:"Noch kein Produkt aus dieser Bestellung ist in deinem Katalog verfügbar.", ddStripeNotCfg:"⚙️ Stripe noch nicht konfiguriert. Kontaktiere NexusHub, um Kartenzahlungen zu aktivieren.", ddStripeErr:"Stripe-Fehler:", ddRetry:"Erneut versuchen", ddError:"Fehler:", ddDocs:"Dokumente", ddClose:"Schließen", ddReportIssue:"Problem melden", ddSave:"Speichern", ddNewAccessReq:"Neue Zugangsanfrage", ddWishlist:"Wunschliste", ddInvoices:"Rechnungen", ddAISuggest:"KI-Vorschläge", ddAttachPhoto:"Foto anhängen (optional)", ddViewAgreement:"📄 Signierte Vereinbarung ansehen", ddSignAgreement:"✍️ Vereinbarung prüfen & unterschreiben", ddInWishlist:"♥ In Wunschliste", ddAddWishlist:"♡ Zur Wunschliste", ddSending:"Senden...", ddSendIssue:"Meldung senden", ddConfirmWire:"🏦 Bestellung bestätigen — Per Überweisung zahlen", ddConfirmSepa:"⚡ Bestellung bestätigen — SEPA-Lastschrift", ddPayCard:"Mit Karte via Stripe zahlen", ddCancel:"Abbrechen", ddSeeOrders:"Meine Bestellungen ansehen →", noNotif:"Keine Benachrichtigungen" });
Object.assign(T.zh,{ ddIssueSent:"问题已提交。将持续跟踪并回访你。", ddIssueErr:"提交问题时出错。", ddOrderErr:"订单错误：", ddNoProdAvail:"此订单中的产品尚未出现在你的目录中。", ddStripeNotCfg:"⚙️ Stripe 尚未配置。请联系 NexusHub 以启用银行卡支付。", ddStripeErr:"Stripe 错误：", ddRetry:"重试", ddError:"错误：", ddDocs:"文件", ddClose:"关闭", ddReportIssue:"报告问题", ddSave:"保存", ddNewAccessReq:"新的访问请求", ddWishlist:"心愿单", ddInvoices:"发票", ddAISuggest:"AI 建议", ddAttachPhoto:"附上照片（可选）", ddViewAgreement:"📄 查看已签协议", ddSignAgreement:"✍️ 审阅并签署协议", ddInWishlist:"♥ 已在心愿单", ddAddWishlist:"♡ 加入心愿单", ddSending:"发送中...", ddSendIssue:"发送报告", ddConfirmWire:"🏦 确认订单 —— 通过银行转账支付", ddConfirmSepa:"⚡ 确认订单 —— SEPA 直接扣款", ddPayCard:"通过 Stripe 用银行卡支付", ddCancel:"取消", ddSeeOrders:"查看我的订单 →", noNotif:"暂无通知" });
Object.assign(T.ar,{ ddIssueSent:"تم إرسال البلاغ. يبقى متابَعًا وسيتم التواصل معك.", ddIssueErr:"خطأ في إرسال البلاغ.", ddOrderErr:"خطأ في الطلب:", ddNoProdAvail:"لا يوجد منتج من هذا الطلب متاح بعد في كتالوجك.", ddStripeNotCfg:"⚙️ لم يُهيّأ Stripe بعد. تواصل مع NexusHub لتفعيل الدفع بالبطاقة.", ddStripeErr:"خطأ Stripe:", ddRetry:"أعد المحاولة", ddError:"خطأ:", ddDocs:"المستندات", ddClose:"إغلاق", ddReportIssue:"الإبلاغ عن مشكلة", ddSave:"حفظ", ddNewAccessReq:"طلب وصول جديد", ddWishlist:"المفضلة", ddInvoices:"الفواتير", ddAISuggest:"اقتراحات الذكاء الاصطناعي", ddAttachPhoto:"إرفاق صورة (اختياري)", ddViewAgreement:"📄 عرض الاتفاقية الموقعة", ddSignAgreement:"✍️ مراجعة وتوقيع الاتفاقية", ddInWishlist:"♥ في المفضلة", ddAddWishlist:"♡ أضف إلى المفضلة", ddSending:"جارٍ الإرسال...", ddSendIssue:"إرسال البلاغ", ddConfirmWire:"🏦 تأكيد الطلب — الدفع عبر التحويل البنكي", ddConfirmSepa:"⚡ تأكيد الطلب — خصم SEPA", ddPayCard:"الدفع بالبطاقة عبر Stripe", ddCancel:"إلغاء", ddSeeOrders:"عرض طلباتي →", noNotif:"لا إشعارات" });
Object.assign(T.en,{ bdPriceLists:"Price lists by country", bdDone:"Done", bdTerrNA:"Territory not available", bdAIAnalytics:"AI Analytics", bdAccessApproved:"Access approved ✓", bdAccessBlocked:"Access blocked", bdAccessExclMsg:"A brand has approved you EXCLUSIVELY for your territory: you are the only distributor in your country for this brand.", bdAccessSharedMsg:"A brand has approved your request: you can now view and order its products.", bdAccessOkOrder:"✓ Access approved — can order your products", bdAccessBlockedIcon:"🚫 Access blocked", bdExclusive:"🔒 Exclusive", bdShared:"Shared", bdLoading:"Loading...", bdImporting:"Importing...", bdDeactivate:"Deactivate", bdActivate:"Activate", bdCommission:"Commission", bdSale:"Sale", bdUploadPdf:"Upload PDF", hdrProduct:"Product", hdrPrice:"Price", hdrStock:"Stock", hdrMultiple:"Multiple", hdrStatus:"Status", hdrActions:"Actions", hdrAction:"Action", hdrDistributor:"Distributor", hdrCountry:"Country", hdrOrders:"Orders", hdrRevenue:"Revenue", hdrDiscount:"Discount", hdrOrder:"Order", hdrItems:"Items", hdrValue:"Value", hdrTracking:"Tracking", hdrRating:"Rating", hdrDate:"Date", hdrNumber:"Number", hdrType:"Type", hdrCounterparty:"Counterparty", hdrTotal:"Total" });
Object.assign(T.it,{ bdPriceLists:"Listini per paese", bdDone:"Fatto", bdTerrNA:"Territorio non disponibile", bdAIAnalytics:"AI Analytics", bdAccessApproved:"Accesso approvato ✓", bdAccessBlocked:"Accesso bloccato", bdAccessExclMsg:"Un brand ti ha approvato IN ESCLUSIVA per il tuo territorio: sei l'unico distributore del tuo paese per questo brand.", bdAccessSharedMsg:"Un brand ha approvato la tua richiesta: ora puoi vedere e ordinare i suoi prodotti.", bdAccessOkOrder:"✓ Accesso approvato — può ordinare i tuoi prodotti", bdAccessBlockedIcon:"🚫 Accesso bloccato", bdExclusive:"🔒 Esclusiva", bdShared:"Condiviso", bdLoading:"Caricamento...", bdImporting:"Importando...", bdDeactivate:"Disattiva", bdActivate:"Attiva", bdCommission:"Commissione", bdSale:"Vendita", bdUploadPdf:"Carica PDF", hdrProduct:"Prodotto", hdrPrice:"Prezzo", hdrStock:"Stock", hdrMultiple:"Multiplo", hdrStatus:"Stato", hdrActions:"Azioni", hdrAction:"Azione", hdrDistributor:"Distributore", hdrCountry:"Paese", hdrOrders:"Ordini", hdrRevenue:"Fatturato", hdrDiscount:"Sconto", hdrOrder:"Ordine", hdrItems:"Articoli", hdrValue:"Valore", hdrTracking:"Tracking", hdrRating:"Voto", hdrDate:"Data", hdrNumber:"Numero", hdrType:"Tipo", hdrCounterparty:"Controparte", hdrTotal:"Totale" });
Object.assign(T.fr,{ bdPriceLists:"Tarifs par pays", bdDone:"Terminé", bdTerrNA:"Territoire non disponible", bdAIAnalytics:"Analytique IA", bdAccessApproved:"Accès approuvé ✓", bdAccessBlocked:"Accès bloqué", bdAccessExclMsg:"Une marque vous a approuvé EN EXCLUSIVITÉ pour votre territoire : vous êtes le seul distributeur de votre pays pour cette marque.", bdAccessSharedMsg:"Une marque a approuvé votre demande : vous pouvez désormais voir et commander ses produits.", bdAccessOkOrder:"✓ Accès approuvé — peut commander vos produits", bdAccessBlockedIcon:"🚫 Accès bloqué", bdExclusive:"🔒 Exclusif", bdShared:"Partagé", bdLoading:"Chargement...", bdImporting:"Importation...", bdDeactivate:"Désactiver", bdActivate:"Activer", bdCommission:"Commission", bdSale:"Vente", bdUploadPdf:"Téléverser le PDF", hdrProduct:"Produit", hdrPrice:"Prix", hdrStock:"Stock", hdrMultiple:"Multiple", hdrStatus:"Statut", hdrActions:"Actions", hdrAction:"Action", hdrDistributor:"Distributeur", hdrCountry:"Pays", hdrOrders:"Commandes", hdrRevenue:"Chiffre d'affaires", hdrDiscount:"Remise", hdrOrder:"Commande", hdrItems:"Articles", hdrValue:"Valeur", hdrTracking:"Suivi", hdrRating:"Note", hdrDate:"Date", hdrNumber:"Numéro", hdrType:"Type", hdrCounterparty:"Contrepartie", hdrTotal:"Total" });
Object.assign(T.es,{ bdPriceLists:"Listas de precios por país", bdDone:"Hecho", bdTerrNA:"Territorio no disponible", bdAIAnalytics:"Analítica de IA", bdAccessApproved:"Acceso aprobado ✓", bdAccessBlocked:"Acceso bloqueado", bdAccessExclMsg:"Una marca te ha aprobado EN EXCLUSIVA para tu territorio: eres el único distribuidor de tu país para esta marca.", bdAccessSharedMsg:"Una marca aprobó tu solicitud: ahora puedes ver y pedir sus productos.", bdAccessOkOrder:"✓ Acceso aprobado — puede pedir tus productos", bdAccessBlockedIcon:"🚫 Acceso bloqueado", bdExclusive:"🔒 Exclusiva", bdShared:"Compartido", bdLoading:"Cargando...", bdImporting:"Importando...", bdDeactivate:"Desactivar", bdActivate:"Activar", bdCommission:"Comisión", bdSale:"Venta", bdUploadPdf:"Subir PDF", hdrProduct:"Producto", hdrPrice:"Precio", hdrStock:"Stock", hdrMultiple:"Múltiplo", hdrStatus:"Estado", hdrActions:"Acciones", hdrAction:"Acción", hdrDistributor:"Distribuidor", hdrCountry:"País", hdrOrders:"Pedidos", hdrRevenue:"Facturación", hdrDiscount:"Descuento", hdrOrder:"Pedido", hdrItems:"Artículos", hdrValue:"Valor", hdrTracking:"Seguimiento", hdrRating:"Valoración", hdrDate:"Fecha", hdrNumber:"Número", hdrType:"Tipo", hdrCounterparty:"Contraparte", hdrTotal:"Total" });
Object.assign(T.de,{ bdPriceLists:"Preislisten pro Land", bdDone:"Fertig", bdTerrNA:"Gebiet nicht verfügbar", bdAIAnalytics:"KI-Analytik", bdAccessApproved:"Zugang genehmigt ✓", bdAccessBlocked:"Zugang gesperrt", bdAccessExclMsg:"Eine Marke hat dich EXKLUSIV für dein Gebiet freigegeben: Du bist der einzige Händler deines Landes für diese Marke.", bdAccessSharedMsg:"Eine Marke hat deine Anfrage genehmigt: Du kannst jetzt ihre Produkte sehen und bestellen.", bdAccessOkOrder:"✓ Zugang genehmigt — kann deine Produkte bestellen", bdAccessBlockedIcon:"🚫 Zugang gesperrt", bdExclusive:"🔒 Exklusiv", bdShared:"Geteilt", bdLoading:"Laden...", bdImporting:"Importieren...", bdDeactivate:"Deaktivieren", bdActivate:"Aktivieren", bdCommission:"Provision", bdSale:"Verkauf", bdUploadPdf:"PDF hochladen", hdrProduct:"Produkt", hdrPrice:"Preis", hdrStock:"Bestand", hdrMultiple:"Vielfaches", hdrStatus:"Status", hdrActions:"Aktionen", hdrAction:"Aktion", hdrDistributor:"Händler", hdrCountry:"Land", hdrOrders:"Bestellungen", hdrRevenue:"Umsatz", hdrDiscount:"Rabatt", hdrOrder:"Bestellung", hdrItems:"Artikel", hdrValue:"Wert", hdrTracking:"Sendungsverfolgung", hdrRating:"Bewertung", hdrDate:"Datum", hdrNumber:"Nummer", hdrType:"Typ", hdrCounterparty:"Gegenpartei", hdrTotal:"Gesamt" });
Object.assign(T.zh,{ bdPriceLists:"各国价目表", bdDone:"完成", bdTerrNA:"区域不可用", bdAIAnalytics:"AI 分析", bdAccessApproved:"访问已批准 ✓", bdAccessBlocked:"访问已阻止", bdAccessExclMsg:"某品牌已为你的区域授予独家授权：你是本国该品牌的唯一经销商。", bdAccessSharedMsg:"某品牌已批准你的请求：现在你可以查看并订购其产品。", bdAccessOkOrder:"✓ 访问已批准 —— 可订购你的产品", bdAccessBlockedIcon:"🚫 访问已阻止", bdExclusive:"🔒 独家", bdShared:"共享", bdLoading:"加载中...", bdImporting:"导入中...", bdDeactivate:"停用", bdActivate:"启用", bdCommission:"佣金", bdSale:"销售", bdUploadPdf:"上传 PDF", hdrProduct:"产品", hdrPrice:"价格", hdrStock:"库存", hdrMultiple:"倍数", hdrStatus:"状态", hdrActions:"操作", hdrAction:"操作", hdrDistributor:"经销商", hdrCountry:"国家", hdrOrders:"订单", hdrRevenue:"营收", hdrDiscount:"折扣", hdrOrder:"订单", hdrItems:"商品", hdrValue:"金额", hdrTracking:"物流跟踪", hdrRating:"评分", hdrDate:"日期", hdrNumber:"编号", hdrType:"类型", hdrCounterparty:"对方", hdrTotal:"合计" });
Object.assign(T.ar,{ bdPriceLists:"قوائم الأسعار حسب الدولة", bdDone:"تم", bdTerrNA:"المنطقة غير متاحة", bdAIAnalytics:"تحليلات الذكاء الاصطناعي", bdAccessApproved:"تمت الموافقة على الوصول ✓", bdAccessBlocked:"الوصول محظور", bdAccessExclMsg:"اعتمدتك إحدى العلامات بشكل حصري لمنطقتك: أنت الموزّع الوحيد في بلدك لهذه العلامة.", bdAccessSharedMsg:"وافقت إحدى العلامات على طلبك: يمكنك الآن عرض منتجاتها وطلبها.", bdAccessOkOrder:"✓ تمت الموافقة على الوصول — يمكنه طلب منتجاتك", bdAccessBlockedIcon:"🚫 الوصول محظور", bdExclusive:"🔒 حصري", bdShared:"مشترك", bdLoading:"جارٍ التحميل...", bdImporting:"جارٍ الاستيراد...", bdDeactivate:"إلغاء التفعيل", bdActivate:"تفعيل", bdCommission:"العمولة", bdSale:"بيع", bdUploadPdf:"رفع PDF", hdrProduct:"المنتج", hdrPrice:"السعر", hdrStock:"المخزون", hdrMultiple:"المضاعف", hdrStatus:"الحالة", hdrActions:"الإجراءات", hdrAction:"إجراء", hdrDistributor:"الموزّع", hdrCountry:"الدولة", hdrOrders:"الطلبات", hdrRevenue:"الإيرادات", hdrDiscount:"الخصم", hdrOrder:"الطلب", hdrItems:"العناصر", hdrValue:"القيمة", hdrTracking:"التتبّع", hdrRating:"التقييم", hdrDate:"التاريخ", hdrNumber:"الرقم", hdrType:"النوع", hdrCounterparty:"الطرف المقابل", hdrTotal:"الإجمالي" });
Object.assign(T.en,{ auiEnterRetailer:"Enter the retailer name", auiTargetSaved:"Target saved", auiChooseDocOwner:"Choose the document owner", auiChooseFile:"Choose a file", auiUploadErr:"Upload error", auiDocUploaded:"Document uploaded to vault", auiErr:"Error", auiOpCostSaved:"Operating cost saved", auiEnterProdName:"Enter the product name", auiListingSaved:"Listing saved", auiNoOrdersExport:"No orders to export.", auiExportErr:"Export error.", auiChooseBrandDist:"Choose brand and distributor", auiContractDraft:"Contract created as draft", auiInvoiceGenErr:"Invoice generation error", auiInvoiceSent:"✓ Invoice sent by email!", auiEmailErr:"Email sending error", auiProfileUpdated:"✓ Profile updated!", auiRecalcErr:"Recalculation error:", auiRecalcDone:"✓ Recalculation done", auiUserApproved:"✓ User approved!", auiUserRejected:"User rejected", auiBrandAdded:"Brand added!", auiProductUpdated:"Product updated!", auiProductAdded:"Product added!", auiFileEmpty:"Empty or invalid file", auiImportErr:"Error during import", auiStockUpdated:"Stock updated!", auiEnterTracking:"Enter the tracking number", auiTrackingSaved:"📦 Tracking saved — distributor notified", auiPointsUpdated:"Points updated", auiAccountUpdated:"Account status updated", auiContractActivated:"✓ Contract activated!", auiContractTerminated:"Contract terminated", auiCommissionUpdated:"Commission updated", auiExported:"Exported", auiImported:"✓ Imported", auiError:"Error:", auiDelTarget:"Delete the target", auiDelDoc:"Delete the document", auiDelete:"Delete", auiReactivate:"Reactivate", auiPtsAdd:"How many points to ADD to", auiPtsRemove:"How many points to REMOVE from", auiOrder:"Order", auiBonusManual:"Manual bonus", auiPenaltyManual:"Manual penalty", auiRecalcing:"Recalculating...", auiRecalcNow:"🔄 Recalculate now", auiUnlockFee:"Unlock fee", auiLockFeeHint:"Lock fee: the automation won't change it", auiLocked:"🔒 Locked", auiFree:"🔓 Free", auiExclusive:"✓ Exclusive", auiNonExclusive:"Non-exclusive", auiBackAdmin:"Back to Admin", auiMarkAllRead:"Mark all as read", auiNewContract:"New Contract", auiTerrExclusivity:"Territorial exclusivity", hdrOrderNum:"Order #", hdrBrand:"Brand", hdrShipTo:"Ship to", hdrAmount:"Amount", hdrEstRevenue:"Estimated revenue", hdrRealRevenue:"Yearly revenue (actual)", hdrCurrentPct:"Current %", hdrTierPct:"Actual tier %", hdrLocked:"Locked", hdrFromTo:"From → To", hdrReason:"Reason", hdrTerritory:"Territory", hdrExclusivity:"Exclusivity", hdrValidity:"Validity" });
Object.assign(T.it,{ auiEnterRetailer:"Inserisci il nome del retailer", auiTargetSaved:"Target salvato", auiChooseDocOwner:"Scegli il titolare del documento", auiChooseFile:"Scegli un file", auiUploadErr:"Errore nel caricamento", auiDocUploaded:"Documento caricato nel vault", auiErr:"Errore", auiOpCostSaved:"Costo operativo salvato", auiEnterProdName:"Inserisci il nome prodotto", auiListingSaved:"Listing salvato", auiNoOrdersExport:"Nessun ordine da esportare.", auiExportErr:"Errore nell'esportazione.", auiChooseBrandDist:"Scegli brand e distributore", auiContractDraft:"Contratto creato in bozza", auiInvoiceGenErr:"Errore generazione fattura", auiInvoiceSent:"✓ Fattura inviata via email!", auiEmailErr:"Errore invio email", auiProfileUpdated:"✓ Profilo aggiornato!", auiRecalcErr:"Errore ricalcolo:", auiRecalcDone:"✓ Ricalcolo eseguito", auiUserApproved:"✓ Utente approvato!", auiUserRejected:"Utente rifiutato", auiBrandAdded:"Brand aggiunto!", auiProductUpdated:"Prodotto aggiornato!", auiProductAdded:"Prodotto aggiunto!", auiFileEmpty:"File vuoto o non valido", auiImportErr:"Errore durante l'importazione", auiStockUpdated:"Stock aggiornato!", auiEnterTracking:"Inserisci il numero di tracking", auiTrackingSaved:"📦 Tracking salvato — distributore notificato", auiPointsUpdated:"Punti aggiornati", auiAccountUpdated:"Stato account aggiornato", auiContractActivated:"✓ Contratto attivato!", auiContractTerminated:"Contratto terminato", auiCommissionUpdated:"Provvigione aggiornata", auiExported:"Esportati", auiImported:"✓ Importati", auiError:"Errore:", auiDelTarget:"Eliminare il target", auiDelDoc:"Eliminare il documento", auiDelete:"Eliminare", auiReactivate:"Riattivare", auiPtsAdd:"Quanti punti AGGIUNGERE a", auiPtsRemove:"Quanti punti TOGLIERE a", auiOrder:"Ordine", auiBonusManual:"Bonus manuale", auiPenaltyManual:"Penalità manuale", auiRecalcing:"Ricalcolo...", auiRecalcNow:"🔄 Ricalcola ora", auiUnlockFee:"Sblocca tariffa", auiLockFeeHint:"Blocca tariffa: l'automatismo non la modificherà", auiLocked:"🔒 Bloccata", auiFree:"🔓 Libera", auiExclusive:"✓ Esclusivo", auiNonExclusive:"Non esclusivo", auiBackAdmin:"Torna ad Admin", auiMarkAllRead:"Segna tutte lette", auiNewContract:"Nuovo Contratto", auiTerrExclusivity:"Esclusiva territoriale", hdrOrderNum:"Ordine #", hdrBrand:"Brand", hdrShipTo:"Spedire a", hdrAmount:"Importo", hdrEstRevenue:"Fatturato stimato", hdrRealRevenue:"Fatturato anno (reale)", hdrCurrentPct:"% attuale", hdrTierPct:"% scaglione reale", hdrLocked:"Bloccata", hdrFromTo:"Da → A", hdrReason:"Motivo", hdrTerritory:"Territorio", hdrExclusivity:"Esclusiva", hdrValidity:"Validità" });
Object.assign(T.fr,{ auiEnterRetailer:"Saisissez le nom du revendeur", auiTargetSaved:"Objectif enregistré", auiChooseDocOwner:"Choisissez le titulaire du document", auiChooseFile:"Choisissez un fichier", auiUploadErr:"Erreur de téléversement", auiDocUploaded:"Document téléversé dans le coffre", auiErr:"Erreur", auiOpCostSaved:"Coût opérationnel enregistré", auiEnterProdName:"Saisissez le nom du produit", auiListingSaved:"Listing enregistré", auiNoOrdersExport:"Aucune commande à exporter.", auiExportErr:"Erreur d'exportation.", auiChooseBrandDist:"Choisissez la marque et le distributeur", auiContractDraft:"Contrat créé en brouillon", auiInvoiceGenErr:"Erreur de génération de facture", auiInvoiceSent:"✓ Facture envoyée par e-mail !", auiEmailErr:"Erreur d'envoi de l'e-mail", auiProfileUpdated:"✓ Profil mis à jour !", auiRecalcErr:"Erreur de recalcul :", auiRecalcDone:"✓ Recalcul effectué", auiUserApproved:"✓ Utilisateur approuvé !", auiUserRejected:"Utilisateur rejeté", auiBrandAdded:"Marque ajoutée !", auiProductUpdated:"Produit mis à jour !", auiProductAdded:"Produit ajouté !", auiFileEmpty:"Fichier vide ou invalide", auiImportErr:"Erreur lors de l'importation", auiStockUpdated:"Stock mis à jour !", auiEnterTracking:"Saisissez le numéro de suivi", auiTrackingSaved:"📦 Suivi enregistré — distributeur notifié", auiPointsUpdated:"Points mis à jour", auiAccountUpdated:"Statut du compte mis à jour", auiContractActivated:"✓ Contrat activé !", auiContractTerminated:"Contrat résilié", auiCommissionUpdated:"Commission mise à jour", auiExported:"Exportés", auiImported:"✓ Importés", auiError:"Erreur :", auiDelTarget:"Supprimer l'objectif", auiDelDoc:"Supprimer le document", auiDelete:"Supprimer", auiReactivate:"Réactiver", auiPtsAdd:"Combien de points AJOUTER à", auiPtsRemove:"Combien de points RETIRER à", auiOrder:"Commande", auiBonusManual:"Bonus manuel", auiPenaltyManual:"Pénalité manuelle", auiRecalcing:"Recalcul...", auiRecalcNow:"🔄 Recalculer maintenant", auiUnlockFee:"Débloquer le tarif", auiLockFeeHint:"Verrouiller le tarif : l'automatisme ne le modifiera pas", auiLocked:"🔒 Verrouillé", auiFree:"🔓 Libre", auiExclusive:"✓ Exclusif", auiNonExclusive:"Non exclusif", auiBackAdmin:"Retour à l'admin", auiMarkAllRead:"Tout marquer comme lu", auiNewContract:"Nouveau contrat", auiTerrExclusivity:"Exclusivité territoriale", hdrOrderNum:"Commande n°", hdrBrand:"Marque", hdrShipTo:"Livrer à", hdrAmount:"Montant", hdrEstRevenue:"CA estimé", hdrRealRevenue:"CA annuel (réel)", hdrCurrentPct:"% actuel", hdrTierPct:"% palier réel", hdrLocked:"Verrouillé", hdrFromTo:"De → À", hdrReason:"Motif", hdrTerritory:"Territoire", hdrExclusivity:"Exclusivité", hdrValidity:"Validité" });
Object.assign(T.es,{ auiEnterRetailer:"Introduce el nombre del retailer", auiTargetSaved:"Objetivo guardado", auiChooseDocOwner:"Elige el titular del documento", auiChooseFile:"Elige un archivo", auiUploadErr:"Error de carga", auiDocUploaded:"Documento subido a la bóveda", auiErr:"Error", auiOpCostSaved:"Costo operativo guardado", auiEnterProdName:"Introduce el nombre del producto", auiListingSaved:"Listing guardado", auiNoOrdersExport:"Sin pedidos para exportar.", auiExportErr:"Error de exportación.", auiChooseBrandDist:"Elige marca y distribuidor", auiContractDraft:"Contrato creado como borrador", auiInvoiceGenErr:"Error al generar la factura", auiInvoiceSent:"✓ ¡Factura enviada por correo!", auiEmailErr:"Error al enviar el correo", auiProfileUpdated:"✓ ¡Perfil actualizado!", auiRecalcErr:"Error de recálculo:", auiRecalcDone:"✓ Recálculo realizado", auiUserApproved:"✓ ¡Usuario aprobado!", auiUserRejected:"Usuario rechazado", auiBrandAdded:"¡Marca añadida!", auiProductUpdated:"¡Producto actualizado!", auiProductAdded:"¡Producto añadido!", auiFileEmpty:"Archivo vacío o no válido", auiImportErr:"Error durante la importación", auiStockUpdated:"¡Stock actualizado!", auiEnterTracking:"Introduce el número de seguimiento", auiTrackingSaved:"📦 Seguimiento guardado — distribuidor notificado", auiPointsUpdated:"Puntos actualizados", auiAccountUpdated:"Estado de la cuenta actualizado", auiContractActivated:"✓ ¡Contrato activado!", auiContractTerminated:"Contrato terminado", auiCommissionUpdated:"Comisión actualizada", auiExported:"Exportados", auiImported:"✓ Importados", auiError:"Error:", auiDelTarget:"Eliminar el objetivo", auiDelDoc:"Eliminar el documento", auiDelete:"Eliminar", auiReactivate:"Reactivar", auiPtsAdd:"Cuántos puntos AÑADIR a", auiPtsRemove:"Cuántos puntos QUITAR a", auiOrder:"Pedido", auiBonusManual:"Bono manual", auiPenaltyManual:"Penalización manual", auiRecalcing:"Recalculando...", auiRecalcNow:"🔄 Recalcular ahora", auiUnlockFee:"Desbloquear tarifa", auiLockFeeHint:"Bloquear tarifa: la automatización no la modificará", auiLocked:"🔒 Bloqueada", auiFree:"🔓 Libre", auiExclusive:"✓ Exclusivo", auiNonExclusive:"No exclusivo", auiBackAdmin:"Volver a Admin", auiMarkAllRead:"Marcar todas como leídas", auiNewContract:"Nuevo contrato", auiTerrExclusivity:"Exclusividad territorial", hdrOrderNum:"Pedido n.º", hdrBrand:"Marca", hdrShipTo:"Enviar a", hdrAmount:"Importe", hdrEstRevenue:"Facturación estimada", hdrRealRevenue:"Facturación anual (real)", hdrCurrentPct:"% actual", hdrTierPct:"% de tramo real", hdrLocked:"Bloqueada", hdrFromTo:"De → A", hdrReason:"Motivo", hdrTerritory:"Territorio", hdrExclusivity:"Exclusiva", hdrValidity:"Validez" });
Object.assign(T.de,{ auiEnterRetailer:"Namen des Händlers eingeben", auiTargetSaved:"Ziel gespeichert", auiChooseDocOwner:"Dokumentinhaber auswählen", auiChooseFile:"Datei auswählen", auiUploadErr:"Fehler beim Hochladen", auiDocUploaded:"Dokument in den Tresor hochgeladen", auiErr:"Fehler", auiOpCostSaved:"Betriebskosten gespeichert", auiEnterProdName:"Produktnamen eingeben", auiListingSaved:"Listing gespeichert", auiNoOrdersExport:"Keine Bestellungen zum Exportieren.", auiExportErr:"Exportfehler.", auiChooseBrandDist:"Marke und Händler auswählen", auiContractDraft:"Vertrag als Entwurf erstellt", auiInvoiceGenErr:"Fehler bei der Rechnungserstellung", auiInvoiceSent:"✓ Rechnung per E-Mail gesendet!", auiEmailErr:"Fehler beim E-Mail-Versand", auiProfileUpdated:"✓ Profil aktualisiert!", auiRecalcErr:"Neuberechnungsfehler:", auiRecalcDone:"✓ Neuberechnung ausgeführt", auiUserApproved:"✓ Benutzer genehmigt!", auiUserRejected:"Benutzer abgelehnt", auiBrandAdded:"Marke hinzugefügt!", auiProductUpdated:"Produkt aktualisiert!", auiProductAdded:"Produkt hinzugefügt!", auiFileEmpty:"Leere oder ungültige Datei", auiImportErr:"Fehler beim Import", auiStockUpdated:"Bestand aktualisiert!", auiEnterTracking:"Tracking-Nummer eingeben", auiTrackingSaved:"📦 Tracking gespeichert — Händler benachrichtigt", auiPointsUpdated:"Punkte aktualisiert", auiAccountUpdated:"Kontostatus aktualisiert", auiContractActivated:"✓ Vertrag aktiviert!", auiContractTerminated:"Vertrag beendet", auiCommissionUpdated:"Provision aktualisiert", auiExported:"Exportiert", auiImported:"✓ Importiert", auiError:"Fehler:", auiDelTarget:"Ziel löschen", auiDelDoc:"Dokument löschen", auiDelete:"Löschen", auiReactivate:"Reaktivieren", auiPtsAdd:"Wie viele Punkte HINZUFÜGEN zu", auiPtsRemove:"Wie viele Punkte ENTFERNEN von", auiOrder:"Bestellung", auiBonusManual:"Manueller Bonus", auiPenaltyManual:"Manuelle Strafe", auiRecalcing:"Neuberechnung...", auiRecalcNow:"🔄 Jetzt neu berechnen", auiUnlockFee:"Gebühr entsperren", auiLockFeeHint:"Gebühr sperren: die Automatik ändert sie nicht", auiLocked:"🔒 Gesperrt", auiFree:"🔓 Frei", auiExclusive:"✓ Exklusiv", auiNonExclusive:"Nicht exklusiv", auiBackAdmin:"Zurück zu Admin", auiMarkAllRead:"Alle als gelesen markieren", auiNewContract:"Neuer Vertrag", auiTerrExclusivity:"Gebietsexklusivität", hdrOrderNum:"Bestellung Nr.", hdrBrand:"Marke", hdrShipTo:"Versand an", hdrAmount:"Betrag", hdrEstRevenue:"Geschätzter Umsatz", hdrRealRevenue:"Jahresumsatz (real)", hdrCurrentPct:"Aktueller %", hdrTierPct:"Tatsächlicher Staffel-%", hdrLocked:"Gesperrt", hdrFromTo:"Von → An", hdrReason:"Grund", hdrTerritory:"Gebiet", hdrExclusivity:"Exklusivität", hdrValidity:"Gültigkeit" });
Object.assign(T.zh,{ auiEnterRetailer:"请输入零售商名称", auiTargetSaved:"目标已保存", auiChooseDocOwner:"选择文件归属人", auiChooseFile:"选择文件", auiUploadErr:"上传出错", auiDocUploaded:"文件已上传到保险库", auiErr:"错误", auiOpCostSaved:"运营成本已保存", auiEnterProdName:"请输入产品名称", auiListingSaved:"商品信息已保存", auiNoOrdersExport:"没有可导出的订单。", auiExportErr:"导出出错。", auiChooseBrandDist:"选择品牌和经销商", auiContractDraft:"合同已创建为草稿", auiInvoiceGenErr:"发票生成出错", auiInvoiceSent:"✓ 发票已通过邮件发送！", auiEmailErr:"邮件发送出错", auiProfileUpdated:"✓ 资料已更新！", auiRecalcErr:"重新计算出错：", auiRecalcDone:"✓ 已重新计算", auiUserApproved:"✓ 用户已批准！", auiUserRejected:"用户已拒绝", auiBrandAdded:"品牌已添加！", auiProductUpdated:"产品已更新！", auiProductAdded:"产品已添加！", auiFileEmpty:"文件为空或无效", auiImportErr:"导入时出错", auiStockUpdated:"库存已更新！", auiEnterTracking:"请输入物流单号", auiTrackingSaved:"📦 物流单号已保存 —— 已通知经销商", auiPointsUpdated:"积分已更新", auiAccountUpdated:"账户状态已更新", auiContractActivated:"✓ 合同已激活！", auiContractTerminated:"合同已终止", auiCommissionUpdated:"佣金已更新", auiExported:"已导出", auiImported:"✓ 已导入", auiError:"错误：", auiDelTarget:"删除该目标", auiDelDoc:"删除该文件", auiDelete:"删除", auiReactivate:"重新激活", auiPtsAdd:"为其增加多少积分", auiPtsRemove:"从其扣除多少积分", auiOrder:"订单", auiBonusManual:"手动奖励", auiPenaltyManual:"手动扣分", auiRecalcing:"重新计算中...", auiRecalcNow:"🔄 立即重新计算", auiUnlockFee:"解锁费率", auiLockFeeHint:"锁定费率：自动机制将不再修改它", auiLocked:"🔒 已锁定", auiFree:"🔓 未锁定", auiExclusive:"✓ 独家", auiNonExclusive:"非独家", auiBackAdmin:"返回管理后台", auiMarkAllRead:"全部标为已读", auiNewContract:"新建合同", auiTerrExclusivity:"区域独家", hdrOrderNum:"订单号", hdrBrand:"品牌", hdrShipTo:"收货至", hdrAmount:"金额", hdrEstRevenue:"预计营收", hdrRealRevenue:"年度营收（实际）", hdrCurrentPct:"当前 %", hdrTierPct:"实际档位 %", hdrLocked:"已锁定", hdrFromTo:"从 → 到", hdrReason:"原因", hdrTerritory:"区域", hdrExclusivity:"独家", hdrValidity:"有效期" });
Object.assign(T.ar,{ auiEnterRetailer:"أدخل اسم المتجر", auiTargetSaved:"تم حفظ الهدف", auiChooseDocOwner:"اختر صاحب المستند", auiChooseFile:"اختر ملفًا", auiUploadErr:"خطأ في الرفع", auiDocUploaded:"تم رفع المستند إلى الخزنة", auiErr:"خطأ", auiOpCostSaved:"تم حفظ التكلفة التشغيلية", auiEnterProdName:"أدخل اسم المنتج", auiListingSaved:"تم حفظ القائمة", auiNoOrdersExport:"لا طلبات للتصدير.", auiExportErr:"خطأ في التصدير.", auiChooseBrandDist:"اختر العلامة والموزّع", auiContractDraft:"تم إنشاء العقد كمسودة", auiInvoiceGenErr:"خطأ في إنشاء الفاتورة", auiInvoiceSent:"✓ تم إرسال الفاتورة عبر البريد!", auiEmailErr:"خطأ في إرسال البريد", auiProfileUpdated:"✓ تم تحديث الملف!", auiRecalcErr:"خطأ في إعادة الحساب:", auiRecalcDone:"✓ تمت إعادة الحساب", auiUserApproved:"✓ تمت الموافقة على المستخدم!", auiUserRejected:"تم رفض المستخدم", auiBrandAdded:"تمت إضافة العلامة!", auiProductUpdated:"تم تحديث المنتج!", auiProductAdded:"تمت إضافة المنتج!", auiFileEmpty:"ملف فارغ أو غير صالح", auiImportErr:"خطأ أثناء الاستيراد", auiStockUpdated:"تم تحديث المخزون!", auiEnterTracking:"أدخل رقم التتبّع", auiTrackingSaved:"📦 تم حفظ التتبّع — تم إخطار الموزّع", auiPointsUpdated:"تم تحديث النقاط", auiAccountUpdated:"تم تحديث حالة الحساب", auiContractActivated:"✓ تم تفعيل العقد!", auiContractTerminated:"تم إنهاء العقد", auiCommissionUpdated:"تم تحديث العمولة", auiExported:"تم تصدير", auiImported:"✓ تم استيراد", auiError:"خطأ:", auiDelTarget:"حذف الهدف", auiDelDoc:"حذف المستند", auiDelete:"حذف", auiReactivate:"إعادة التفعيل", auiPtsAdd:"كم نقطة تُضاف إلى", auiPtsRemove:"كم نقطة تُخصم من", auiOrder:"الطلب", auiBonusManual:"مكافأة يدوية", auiPenaltyManual:"عقوبة يدوية", auiRecalcing:"جارٍ إعادة الحساب...", auiRecalcNow:"🔄 أعد الحساب الآن", auiUnlockFee:"فتح التعرفة", auiLockFeeHint:"قفل التعرفة: لن يغيّرها النظام الآلي", auiLocked:"🔒 مقفلة", auiFree:"🔓 حرة", auiExclusive:"✓ حصري", auiNonExclusive:"غير حصري", auiBackAdmin:"العودة إلى الإدارة", auiMarkAllRead:"تعليم الكل كمقروء", auiNewContract:"عقد جديد", auiTerrExclusivity:"الحصرية الإقليمية", hdrOrderNum:"رقم الطلب", hdrBrand:"العلامة", hdrShipTo:"الشحن إلى", hdrAmount:"المبلغ", hdrEstRevenue:"الإيرادات المقدّرة", hdrRealRevenue:"الإيراد السنوي (الفعلي)", hdrCurrentPct:"النسبة الحالية %", hdrTierPct:"نسبة الشريحة الفعلية %", hdrLocked:"مقفلة", hdrFromTo:"من → إلى", hdrReason:"السبب", hdrTerritory:"المنطقة", hdrExclusivity:"الحصرية", hdrValidity:"الصلاحية" });
Object.assign(T.en,{ tmTurinHub:"Turin Hub", tmActiveDist:"Active Distributors", tmCovered:"Covered Territory", seaSpring:"Spring", seaSummer:"Summer", seaAutumn:"Autumn", seaWinter:"Winter" });
Object.assign(T.it,{ tmTurinHub:"Hub di Torino", tmActiveDist:"Distributori attivi", tmCovered:"Territorio coperto", seaSpring:"Primavera", seaSummer:"Estate", seaAutumn:"Autunno", seaWinter:"Inverno" });
Object.assign(T.fr,{ tmTurinHub:"Hub de Turin", tmActiveDist:"Distributeurs actifs", tmCovered:"Territoire couvert", seaSpring:"Printemps", seaSummer:"Été", seaAutumn:"Automne", seaWinter:"Hiver" });
Object.assign(T.es,{ tmTurinHub:"Hub de Turín", tmActiveDist:"Distribuidores activos", tmCovered:"Territorio cubierto", seaSpring:"Primavera", seaSummer:"Verano", seaAutumn:"Otoño", seaWinter:"Invierno" });
Object.assign(T.de,{ tmTurinHub:"Turin-Hub", tmActiveDist:"Aktive Händler", tmCovered:"Abgedecktes Gebiet", seaSpring:"Frühling", seaSummer:"Sommer", seaAutumn:"Herbst", seaWinter:"Winter" });
Object.assign(T.zh,{ tmTurinHub:"都灵枢纽", tmActiveDist:"活跃经销商", tmCovered:"覆盖区域", seaSpring:"春季", seaSummer:"夏季", seaAutumn:"秋季", seaWinter:"冬季" });
Object.assign(T.ar,{ tmTurinHub:"مركز تورينو", tmActiveDist:"الموزّعون النشطون", tmCovered:"المنطقة المغطاة", seaSpring:"الربيع", seaSummer:"الصيف", seaAutumn:"الخريف", seaWinter:"الشتاء" });
Object.assign(T.en,{ tbPlatinum:"Platinum", tbGold:"Gold", tbSilver:"Silver", tbBronze:"Bronze", tbWatched:"Watched", tbAtRisk:"At risk", tbSuspended:"SUSPENDED", tbAtRiskBadge:"AT RISK", ddBankMissing:"Brand banking details not entered yet. Contact NexusHub." });
Object.assign(T.it,{ tbPlatinum:"Platino", tbGold:"Oro", tbSilver:"Argento", tbBronze:"Bronzo", tbWatched:"Osservato", tbAtRisk:"A rischio", tbSuspended:"SOSPESO", tbAtRiskBadge:"A RISCHIO", ddBankMissing:"Dati bancari del brand non ancora inseriti. Contatta NexusHub." });
Object.assign(T.fr,{ tbPlatinum:"Platine", tbGold:"Or", tbSilver:"Argent", tbBronze:"Bronze", tbWatched:"Surveillé", tbAtRisk:"À risque", tbSuspended:"SUSPENDU", tbAtRiskBadge:"À RISQUE", ddBankMissing:"Coordonnées bancaires de la marque pas encore renseignées. Contactez NexusHub." });
Object.assign(T.es,{ tbPlatinum:"Platino", tbGold:"Oro", tbSilver:"Plata", tbBronze:"Bronce", tbWatched:"Observado", tbAtRisk:"En riesgo", tbSuspended:"SUSPENDIDO", tbAtRiskBadge:"EN RIESGO", ddBankMissing:"Datos bancarios de la marca aún no introducidos. Contacta a NexusHub." });
Object.assign(T.de,{ tbPlatinum:"Platin", tbGold:"Gold", tbSilver:"Silber", tbBronze:"Bronze", tbWatched:"Beobachtet", tbAtRisk:"Gefährdet", tbSuspended:"GESPERRT", tbAtRiskBadge:"GEFÄHRDET", ddBankMissing:"Bankdaten der Marke noch nicht hinterlegt. Kontaktiere NexusHub." });
Object.assign(T.zh,{ tbPlatinum:"白金", tbGold:"黄金", tbSilver:"白银", tbBronze:"青铜", tbWatched:"观察中", tbAtRisk:"有风险", tbSuspended:"已暂停", tbAtRiskBadge:"有风险", ddBankMissing:"该品牌的银行信息尚未填写。请联系 NexusHub。" });
Object.assign(T.ar,{ tbPlatinum:"بلاتيني", tbGold:"ذهبي", tbSilver:"فضي", tbBronze:"برونزي", tbWatched:"تحت المراقبة", tbAtRisk:"في خطر", tbSuspended:"موقوف", tbAtRiskBadge:"في خطر", ddBankMissing:"لم تُدخل بيانات البنك للعلامة بعد. تواصل مع NexusHub." });
Object.assign(T.en,{ registerChain:"Retail chain / European e-commerce", rgAccTypeLabel:"Business type", rgAccChain:"Retail chain", rgAccEcom:"Large e-commerce" });
Object.assign(T.it,{ registerChain:"Catena / E-commerce europeo", rgAccTypeLabel:"Tipo di attività", rgAccChain:"Catena retail", rgAccEcom:"Grande e-commerce" });
Object.assign(T.fr,{ registerChain:"Chaîne / E-commerce européen", rgAccTypeLabel:"Type d'activité", rgAccChain:"Chaîne de magasins", rgAccEcom:"Grand e-commerce" });
Object.assign(T.es,{ registerChain:"Cadena / E-commerce europeo", rgAccTypeLabel:"Tipo de actividad", rgAccChain:"Cadena retail", rgAccEcom:"Gran e-commerce" });
Object.assign(T.de,{ registerChain:"Kette / Europäischer E-Commerce", rgAccTypeLabel:"Art des Unternehmens", rgAccChain:"Einzelhandelskette", rgAccEcom:"Großer E-Commerce" });
Object.assign(T.zh,{ registerChain:"连锁 / 欧洲电商", rgAccTypeLabel:"业务类型", rgAccChain:"零售连锁", rgAccEcom:"大型电商" });
Object.assign(T.ar,{ registerChain:"سلسلة متاجر / تجارة إلكترونية أوروبية", rgAccTypeLabel:"نوع النشاط", rgAccChain:"سلسلة متاجر", rgAccEcom:"تجارة إلكترونية كبيرة" });
Object.assign(T.en,{ atabKeyAccount:"Key Account", kaTitle:"Key Accounts — Chains & E-commerce", kaSubtitle:"Manage chains and large e-commerce supplied directly by NexusHub", kaEmpty:"No chains or e-commerce registered yet.", kaApprove:"Approve account", kaManageBrands:"Manage brands", kaHideBrands:"Hide", kaAuthorizeBrands:"Authorize brand sales", kaNoBrands:"No brands available.", kaAuthorize:"Authorize", kaRevoke:"Revoke", kaAccessGranted:"Brand authorized", kaAccessRevoked:"Authorization revoked" });
Object.assign(T.it,{ atabKeyAccount:"Key Account", kaTitle:"Key Account — Catene & E-commerce", kaSubtitle:"Gestisci catene e grandi e-commerce riforniti direttamente da NexusHub", kaEmpty:"Nessuna catena o e-commerce registrato al momento.", kaApprove:"Approva account", kaManageBrands:"Gestisci brand", kaHideBrands:"Nascondi", kaAuthorizeBrands:"Autorizza alla vendita dei brand", kaNoBrands:"Nessun brand disponibile.", kaAuthorize:"Autorizza", kaRevoke:"Revoca", kaAccessGranted:"Brand autorizzato", kaAccessRevoked:"Autorizzazione revocata" });
Object.assign(T.fr,{ atabKeyAccount:"Grands comptes", kaTitle:"Grands comptes — Chaînes & E-commerce", kaSubtitle:"Gérez les chaînes et grands e-commerce approvisionnés directement par NexusHub", kaEmpty:"Aucune chaîne ou e-commerce enregistré pour le moment.", kaApprove:"Approuver le compte", kaManageBrands:"Gérer les marques", kaHideBrands:"Masquer", kaAuthorizeBrands:"Autoriser la vente des marques", kaNoBrands:"Aucune marque disponible.", kaAuthorize:"Autoriser", kaRevoke:"Révoquer", kaAccessGranted:"Marque autorisée", kaAccessRevoked:"Autorisation révoquée" });
Object.assign(T.es,{ atabKeyAccount:"Grandes cuentas", kaTitle:"Grandes cuentas — Cadenas y E-commerce", kaSubtitle:"Gestiona cadenas y grandes e-commerce suministrados directamente por NexusHub", kaEmpty:"Ninguna cadena o e-commerce registrado por ahora.", kaApprove:"Aprobar cuenta", kaManageBrands:"Gestionar marcas", kaHideBrands:"Ocultar", kaAuthorizeBrands:"Autorizar la venta de marcas", kaNoBrands:"Ninguna marca disponible.", kaAuthorize:"Autorizar", kaRevoke:"Revocar", kaAccessGranted:"Marca autorizada", kaAccessRevoked:"Autorización revocada" });
Object.assign(T.de,{ atabKeyAccount:"Key Account", kaTitle:"Key Accounts — Ketten & E-Commerce", kaSubtitle:"Verwalte Ketten und große E-Commerce, die direkt von NexusHub beliefert werden", kaEmpty:"Noch keine Ketten oder E-Commerce registriert.", kaApprove:"Konto genehmigen", kaManageBrands:"Marken verwalten", kaHideBrands:"Ausblenden", kaAuthorizeBrands:"Markenverkauf autorisieren", kaNoBrands:"Keine Marken verfügbar.", kaAuthorize:"Autorisieren", kaRevoke:"Widerrufen", kaAccessGranted:"Marke autorisiert", kaAccessRevoked:"Autorisierung widerrufen" });
Object.assign(T.zh,{ atabKeyAccount:"大客户", kaTitle:"大客户 — 连锁与电商", kaSubtitle:"管理由 NexusHub 直接供货的连锁店和大型电商", kaEmpty:"目前没有注册的连锁店或电商。", kaApprove:"批准账户", kaManageBrands:"管理品牌", kaHideBrands:"隐藏", kaAuthorizeBrands:"授权品牌销售", kaNoBrands:"没有可用品牌。", kaAuthorize:"授权", kaRevoke:"撤销", kaAccessGranted:"品牌已授权", kaAccessRevoked:"授权已撤销" });
Object.assign(T.ar,{ atabKeyAccount:"حسابات رئيسية", kaTitle:"الحسابات الرئيسية — سلاسل المتاجر والتجارة الإلكترونية", kaSubtitle:"إدارة السلاسل والتجارة الإلكترونية الكبيرة المزوَّدة مباشرة من NexusHub", kaEmpty:"لا توجد سلاسل أو متاجر إلكترونية مسجلة حتى الآن.", kaApprove:"الموافقة على الحساب", kaManageBrands:"إدارة العلامات", kaHideBrands:"إخفاء", kaAuthorizeBrands:"تفويض بيع العلامات", kaNoBrands:"لا توجد علامات متاحة.", kaAuthorize:"تفويض", kaRevoke:"إلغاء", kaAccessGranted:"تم تفويض العلامة", kaAccessRevoked:"تم إلغاء التفويض" });
Object.assign(T.en,{ kaPrices:"Prices", kaHidePrices:"Close prices", kaNoProducts:"No products for this brand.", kaBrandPrice:"Brand price", kaResaleHint:"Set the price this account sees and pays to NexusHub. Without a price the product isn't orderable.", kaSavePrice:"Save", kaPriceSaved:"Price saved", kaPriceCleared:"Price removed" });
Object.assign(T.it,{ kaPrices:"Prezzi", kaHidePrices:"Chiudi prezzi", kaNoProducts:"Nessun prodotto per questo brand.", kaBrandPrice:"Prezzo brand", kaResaleHint:"Imposta il prezzo che questa catena vedrà e pagherà a NexusHub. Senza prezzo il prodotto non è ordinabile.", kaSavePrice:"Salva", kaPriceSaved:"Prezzo salvato", kaPriceCleared:"Prezzo rimosso" });
Object.assign(T.fr,{ kaPrices:"Prix", kaHidePrices:"Fermer les prix", kaNoProducts:"Aucun produit pour cette marque.", kaBrandPrice:"Prix marque", kaResaleHint:"Définissez le prix que ce compte voit et paie à NexusHub. Sans prix, le produit n'est pas commandable.", kaSavePrice:"Enregistrer", kaPriceSaved:"Prix enregistré", kaPriceCleared:"Prix supprimé" });
Object.assign(T.es,{ kaPrices:"Precios", kaHidePrices:"Cerrar precios", kaNoProducts:"Ningún producto para esta marca.", kaBrandPrice:"Precio marca", kaResaleHint:"Define el precio que esta cuenta ve y paga a NexusHub. Sin precio el producto no se puede pedir.", kaSavePrice:"Guardar", kaPriceSaved:"Precio guardado", kaPriceCleared:"Precio eliminado" });
Object.assign(T.de,{ kaPrices:"Preise", kaHidePrices:"Preise schließen", kaNoProducts:"Keine Produkte für diese Marke.", kaBrandPrice:"Markenpreis", kaResaleHint:"Lege den Preis fest, den dieses Konto sieht und an NexusHub zahlt. Ohne Preis ist das Produkt nicht bestellbar.", kaSavePrice:"Speichern", kaPriceSaved:"Preis gespeichert", kaPriceCleared:"Preis entfernt" });
Object.assign(T.zh,{ kaPrices:"价格", kaHidePrices:"关闭价格", kaNoProducts:"该品牌没有产品。", kaBrandPrice:"品牌价格", kaResaleHint:"设置此客户看到并支付给 NexusHub 的价格。没有价格则无法下单。", kaSavePrice:"保存", kaPriceSaved:"价格已保存", kaPriceCleared:"价格已删除" });
Object.assign(T.ar,{ kaPrices:"الأسعار", kaHidePrices:"إغلاق الأسعار", kaNoProducts:"لا توجد منتجات لهذه العلامة.", kaBrandPrice:"سعر العلامة", kaResaleHint:"حدد السعر الذي يراه هذا الحساب ويدفعه إلى NexusHub. بدون سعر لا يمكن طلب المنتج.", kaSavePrice:"حفظ", kaPriceSaved:"تم حفظ السعر", kaPriceCleared:"تم حذف السعر" });
Object.assign(T.en,{ diNoPrice:"Price not available" });
Object.assign(T.it,{ diNoPrice:"Prezzo non disponibile" });
Object.assign(T.fr,{ diNoPrice:"Prix non disponible" });
Object.assign(T.es,{ diNoPrice:"Precio no disponible" });
Object.assign(T.de,{ diNoPrice:"Preis nicht verfügbar" });
Object.assign(T.zh,{ diNoPrice:"价格不可用" });
Object.assign(T.ar,{ diNoPrice:"السعر غير متوفر" });
Object.assign(T.en,{ kaViesCheck:"Check VIES", kaViesChecking:"Checking VAT on VIES…", kaViesValid:"VAT valid on VIES", kaViesInvalid:"VAT not valid on VIES", kaViesError:"VIES check failed" });
Object.assign(T.it,{ kaViesCheck:"Verifica VIES", kaViesChecking:"Verifica P.IVA su VIES…", kaViesValid:"P.IVA valida su VIES", kaViesInvalid:"P.IVA non valida su VIES", kaViesError:"Verifica VIES fallita" });
Object.assign(T.fr,{ kaViesCheck:"Vérifier VIES", kaViesChecking:"Vérification TVA sur VIES…", kaViesValid:"TVA valide sur VIES", kaViesInvalid:"TVA non valide sur VIES", kaViesError:"Échec de la vérification VIES" });
Object.assign(T.es,{ kaViesCheck:"Verificar VIES", kaViesChecking:"Verificando IVA en VIES…", kaViesValid:"IVA válido en VIES", kaViesInvalid:"IVA no válido en VIES", kaViesError:"Error en la verificación VIES" });
Object.assign(T.de,{ kaViesCheck:"VIES prüfen", kaViesChecking:"USt-IdNr. wird über VIES geprüft…", kaViesValid:"USt-IdNr. gültig (VIES)", kaViesInvalid:"USt-IdNr. ungültig (VIES)", kaViesError:"VIES-Prüfung fehlgeschlagen" });
Object.assign(T.zh,{ kaViesCheck:"验证 VIES", kaViesChecking:"正在 VIES 验证增值税号…", kaViesValid:"增值税号在 VIES 有效", kaViesInvalid:"增值税号在 VIES 无效", kaViesError:"VIES 验证失败" });
Object.assign(T.ar,{ kaViesCheck:"التحقق من VIES", kaViesChecking:"جارٍ التحقق من الرقم الضريبي عبر VIES…", kaViesValid:"الرقم الضريبي صالح على VIES", kaViesInvalid:"الرقم الضريبي غير صالح على VIES", kaViesError:"فشل التحقق من VIES" });
Object.assign(T.en,{ aretConvert:"Create Key Account", aretConverted:"Key Account", aretConverting:"Creating account…", aretConvertOk:"Key Account created — invite sent", aretConvertErr:"Conversion failed", aretNoEmail:"Add the buyer's email first" });
Object.assign(T.it,{ aretConvert:"Crea Key Account", aretConverted:"Key Account", aretConverting:"Creazione account…", aretConvertOk:"Key Account creato — invito inviato", aretConvertErr:"Conversione fallita", aretNoEmail:"Aggiungi prima l'email del buyer" });
Object.assign(T.fr,{ aretConvert:"Créer un grand compte", aretConverted:"Grand compte", aretConverting:"Création du compte…", aretConvertOk:"Grand compte créé — invitation envoyée", aretConvertErr:"Échec de la conversion", aretNoEmail:"Ajoutez d'abord l'e-mail de l'acheteur" });
Object.assign(T.es,{ aretConvert:"Crear Key Account", aretConverted:"Key Account", aretConverting:"Creando cuenta…", aretConvertOk:"Key Account creado — invitación enviada", aretConvertErr:"Error en la conversión", aretNoEmail:"Añade primero el email del comprador" });
Object.assign(T.de,{ aretConvert:"Key Account anlegen", aretConverted:"Key Account", aretConverting:"Konto wird erstellt…", aretConvertOk:"Key Account erstellt — Einladung gesendet", aretConvertErr:"Umwandlung fehlgeschlagen", aretNoEmail:"Zuerst die E-Mail des Käufers hinzufügen" });
Object.assign(T.zh,{ aretConvert:"创建大客户", aretConverted:"大客户", aretConverting:"正在创建账户…", aretConvertOk:"已创建大客户 — 已发送邀请", aretConvertErr:"转换失败", aretNoEmail:"请先添加买家邮箱" });
Object.assign(T.ar,{ aretConvert:"إنشاء حساب رئيسي", aretConverted:"حساب رئيسي", aretConverting:"جارٍ إنشاء الحساب…", aretConvertOk:"تم إنشاء الحساب — تم إرسال الدعوة", aretConvertErr:"فشل التحويل", aretNoEmail:"أضف بريد المشتري أولاً" });
Object.assign(T.en,{ ckBonificoName:"Bank transfer", ckBonificoDesc:"Normal or instant · SEPA", ckBonificoInfo:"After confirming you'll get the IBAN to send the transfer to. The order starts once payment is received.", ddPayBonifico:"Pay by bank transfer" });
Object.assign(T.it,{ ckBonificoName:"Bonifico bancario", ckBonificoDesc:"Normale o istantaneo · SEPA", ckBonificoInfo:"Dopo la conferma riceverai l'IBAN a cui fare il bonifico. L'ordine parte quando l'incasso è confermato.", ddPayBonifico:"Paga con bonifico" });
Object.assign(T.fr,{ ckBonificoName:"Virement bancaire", ckBonificoDesc:"Normal ou instantané · SEPA", ckBonificoInfo:"Après confirmation, vous recevrez l'IBAN pour le virement. La commande démarre à réception du paiement.", ddPayBonifico:"Payer par virement" });
Object.assign(T.es,{ ckBonificoName:"Transferencia bancaria", ckBonificoDesc:"Normal o instantáneo · SEPA", ckBonificoInfo:"Tras confirmar recibirás el IBAN para la transferencia. El pedido inicia al recibirse el pago.", ddPayBonifico:"Pagar por transferencia" });
Object.assign(T.de,{ ckBonificoName:"Überweisung", ckBonificoDesc:"Normal oder sofort · SEPA", ckBonificoInfo:"Nach der Bestätigung erhältst du die IBAN für die Überweisung. Die Bestellung startet bei Zahlungseingang.", ddPayBonifico:"Per Überweisung zahlen" });
Object.assign(T.zh,{ ckBonificoName:"银行转账", ckBonificoDesc:"普通或即时 · SEPA", ckBonificoInfo:"确认后你将收到用于转账的 IBAN。收到款项后订单开始。", ddPayBonifico:"通过银行转账支付" });
Object.assign(T.ar,{ ckBonificoName:"تحويل بنكي", ckBonificoDesc:"عادي أو فوري · SEPA", ckBonificoInfo:"بعد التأكيد ستحصل على الآيبان للتحويل. يبدأ الطلب عند استلام الدفع.", ddPayBonifico:"الدفع بالتحويل" });
Object.assign(T.en,{ bStripeTitle:"Receive payments (Stripe)", bStripeDesc:"Connect your Stripe account to automatically receive your share of every order. NexusHub only keeps the agreed commission.", bStripeConnect:"Connect Stripe", bStripeResume:"Finish onboarding", bStripeCheck:"Check status", bStripeActive:"Stripe connected", bStripePending:"Awaiting completion", bStripeErr:"Stripe error, try again" });
Object.assign(T.it,{ bStripeTitle:"Ricevi i pagamenti (Stripe)", bStripeDesc:"Collega il tuo conto Stripe per ricevere automaticamente la tua quota su ogni ordine. NexusHub trattiene solo la commissione concordata.", bStripeConnect:"Collega Stripe", bStripeResume:"Completa onboarding", bStripeCheck:"Verifica stato", bStripeActive:"Stripe collegato", bStripePending:"In attesa di completamento", bStripeErr:"Errore Stripe, riprova" });
Object.assign(T.fr,{ bStripeTitle:"Recevoir les paiements (Stripe)", bStripeDesc:"Connectez votre compte Stripe pour recevoir automatiquement votre part sur chaque commande. NexusHub ne garde que la commission convenue.", bStripeConnect:"Connecter Stripe", bStripeResume:"Terminer l'inscription", bStripeCheck:"Vérifier le statut", bStripeActive:"Stripe connecté", bStripePending:"En attente de finalisation", bStripeErr:"Erreur Stripe, réessayez" });
Object.assign(T.es,{ bStripeTitle:"Recibir pagos (Stripe)", bStripeDesc:"Conecta tu cuenta Stripe para recibir automáticamente tu parte de cada pedido. NexusHub solo se queda con la comisión acordada.", bStripeConnect:"Conectar Stripe", bStripeResume:"Completar registro", bStripeCheck:"Verificar estado", bStripeActive:"Stripe conectado", bStripePending:"Pendiente de completar", bStripeErr:"Error de Stripe, inténtalo de nuevo" });
Object.assign(T.de,{ bStripeTitle:"Zahlungen erhalten (Stripe)", bStripeDesc:"Verbinde dein Stripe-Konto, um deinen Anteil an jeder Bestellung automatisch zu erhalten. NexusHub behält nur die vereinbarte Provision.", bStripeConnect:"Stripe verbinden", bStripeResume:"Onboarding abschließen", bStripeCheck:"Status prüfen", bStripeActive:"Stripe verbunden", bStripePending:"Abschluss ausstehend", bStripeErr:"Stripe-Fehler, bitte erneut versuchen" });
Object.assign(T.zh,{ bStripeTitle:"接收付款（Stripe）", bStripeDesc:"连接你的 Stripe 账户，自动收取每笔订单中属于你的部分。NexusHub 仅保留约定的佣金。", bStripeConnect:"连接 Stripe", bStripeResume:"完成开通", bStripeCheck:"检查状态", bStripeActive:"Stripe 已连接", bStripePending:"等待完成", bStripeErr:"Stripe 错误，请重试" });
Object.assign(T.ar,{ bStripeTitle:"استلام المدفوعات (Stripe)", bStripeDesc:"اربط حساب Stripe لتستلم حصتك تلقائيًا من كل طلب. يحتفظ NexusHub بالعمولة المتفق عليها فقط.", bStripeConnect:"ربط Stripe", bStripeResume:"إكمال التسجيل", bStripeCheck:"التحقق من الحالة", bStripeActive:"تم ربط Stripe", bStripePending:"بانتظار الإكمال", bStripeErr:"خطأ Stripe، حاول مجددًا" });
Object.assign(T.en,{ ckOnlyBonifico:"Over \\u20ac15,000 only bank transfer is available (lower fees, safer for large amounts). You'll get the IBAN after confirming; the order starts on receipt." });
Object.assign(T.it,{ ckOnlyBonifico:"Sopra i \\u20ac15.000 \\u00e8 disponibile solo il bonifico (commissioni pi\\u00f9 basse e pi\\u00f9 sicuro sui grandi importi). Riceverai l'IBAN dopo la conferma; l'ordine parte all'incasso." });
Object.assign(T.fr,{ ckOnlyBonifico:"Au-del\\u00e0 de 15\\u202f000\\u202f\\u20ac, seul le virement est disponible (frais r\\u00e9duits, plus s\\u00fbr). Vous recevrez l'IBAN apr\\u00e8s confirmation ; la commande d\\u00e9marre \\u00e0 r\\u00e9ception." });
Object.assign(T.es,{ ckOnlyBonifico:"Por encima de 15.000\\u202f\\u20ac solo est\\u00e1 disponible la transferencia (comisiones m\\u00e1s bajas, m\\u00e1s seguro). Recibir\\u00e1s el IBAN tras confirmar; el pedido inicia al cobro." });
Object.assign(T.de,{ ckOnlyBonifico:"\\u00dcber 15.000\\u202f\\u20ac ist nur \\u00dcberweisung verf\\u00fcgbar (niedrigere Geb\\u00fchren, sicherer). Du erh\\u00e4ltst die IBAN nach der Best\\u00e4tigung; die Bestellung startet bei Zahlungseingang." });
Object.assign(T.zh,{ ckOnlyBonifico:"\\u8d85\\u8fc7 15,000 \\u6b27\\u5143\\u4ec5\\u53ef\\u7528\\u94f6\\u884c\\u8f6c\\u8d26\\uff08\\u8d39\\u7528\\u66f4\\u4f4e\\u3001\\u5927\\u989d\\u66f4\\u5b89\\u5168\\uff09\\u3002\\u786e\\u8ba4\\u540e\\u83b7\\u5f97 IBAN\\uff1b\\u6536\\u6b3e\\u540e\\u8ba2\\u5355\\u5f00\\u59cb\\u3002" });
Object.assign(T.ar,{ ckOnlyBonifico:"\\u0644\\u0644\\u0645\\u0628\\u0627\\u0644\\u063a \\u0623\\u0643\\u0628\\u0631 \\u0645\\u0646 15,000 \\u064a\\u0648\\u0631\\u0648 \\u064a\\u062a\\u0648\\u0641\\u0631 \\u0627\\u0644\\u062a\\u062d\\u0648\\u064a\\u0644 \\u0627\\u0644\\u0628\\u0646\\u0643\\u064a \\u0641\\u0642\\u0637 (\\u0631\\u0633\\u0648\\u0645 \\u0623\\u0642\\u0644 \\u0648\\u0623\\u0643\\u062b\\u0631 \\u0623\\u0645\\u0627\\u0646\\u064b\\u0627). \\u0633\\u062a\\u062d\\u0635\\u0644 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0622\\u064a\\u0628\\u0627\\u0646 \\u0628\\u0639\\u062f \\u0627\\u0644\\u062a\\u0623\\u0643\\u064a\\u062f\\u061b \\u064a\\u0628\\u062f\\u0623 \\u0627\\u0644\\u0637\\u0644\\u0628 \\u0639\\u0646\\u062f \\u0627\\u0644\\u0627\\u0633\\u062a\\u0644\\u0627\\u0645." });
Object.assign(T.en,{ diProducts:"products" });
Object.assign(T.it,{ diProducts:"prodotti" });
Object.assign(T.fr,{ diProducts:"produits" });
Object.assign(T.es,{ diProducts:"productos" });
Object.assign(T.de,{ diProducts:"Produkte" });
Object.assign(T.zh,{ diProducts:"产品" });
Object.assign(T.ar,{ diProducts:"منتجات" });
Object.assign(T.en,{ bFindDistTitle:"Find distributors", bFindDistSub:"Invite distributors on the platform to sell your products", bNoDistDir:"No distributors on the platform yet.", bDistActive:"Active", bDistPending:"Request pending", bInvite:"Invite", bInviteSent:"Invitation sent", bInviteNotifTitle:"A brand invited you", bInviteNotifMsg:"A brand gave you access to its catalog. You'll find its products in your catalog." });
Object.assign(T.it,{ bFindDistTitle:"Trova distributori", bFindDistSub:"Invita i distributori presenti sulla piattaforma a vendere i tuoi prodotti", bNoDistDir:"Nessun distributore sulla piattaforma al momento.", bDistActive:"Attivo", bDistPending:"Richiesta in attesa", bInvite:"Invita", bInviteSent:"Invito inviato", bInviteNotifTitle:"Un brand ti ha invitato", bInviteNotifMsg:"Un brand ti ha dato accesso al suo catalogo. Trovi i suoi prodotti nel tuo catalogo." });
Object.assign(T.fr,{ bFindDistTitle:"Trouver des distributeurs", bFindDistSub:"Invitez les distributeurs de la plateforme à vendre vos produits", bNoDistDir:"Aucun distributeur sur la plateforme pour le moment.", bDistActive:"Actif", bDistPending:"Demande en attente", bInvite:"Inviter", bInviteSent:"Invitation envoyée", bInviteNotifTitle:"Une marque vous a invité", bInviteNotifMsg:"Une marque vous a donné accès à son catalogue. Vous trouverez ses produits dans votre catalogue." });
Object.assign(T.es,{ bFindDistTitle:"Buscar distribuidores", bFindDistSub:"Invita a los distribuidores de la plataforma a vender tus productos", bNoDistDir:"Ningún distribuidor en la plataforma por ahora.", bDistActive:"Activo", bDistPending:"Solicitud pendiente", bInvite:"Invitar", bInviteSent:"Invitación enviada", bInviteNotifTitle:"Una marca te ha invitado", bInviteNotifMsg:"Una marca te dio acceso a su catálogo. Encontrarás sus productos en tu catálogo." });
Object.assign(T.de,{ bFindDistTitle:"Distributoren finden", bFindDistSub:"Lade Distributoren der Plattform ein, deine Produkte zu verkaufen", bNoDistDir:"Noch keine Distributoren auf der Plattform.", bDistActive:"Aktiv", bDistPending:"Anfrage ausstehend", bInvite:"Einladen", bInviteSent:"Einladung gesendet", bInviteNotifTitle:"Eine Marke hat dich eingeladen", bInviteNotifMsg:"Eine Marke hat dir Zugang zu ihrem Katalog gegeben. Du findest ihre Produkte in deinem Katalog." });
Object.assign(T.zh,{ bFindDistTitle:"查找分销商", bFindDistSub:"邀请平台上的分销商销售你的产品", bNoDistDir:"平台上暂无分销商。", bDistActive:"活跃", bDistPending:"请求待处理", bInvite:"邀请", bInviteSent:"邀请已发送", bInviteNotifTitle:"一个品牌邀请了你", bInviteNotifMsg:"一个品牌授予你访问其目录的权限。你将在目录中找到其产品。" });
Object.assign(T.ar,{ bFindDistTitle:"البحث عن الموزعين", bFindDistSub:"ادعُ الموزعين على المنصة لبيع منتجاتك", bNoDistDir:"لا يوجد موزعون على المنصة حاليًا.", bDistActive:"نشط", bDistPending:"طلب قيد الانتظار", bInvite:"دعوة", bInviteSent:"تم إرسال الدعوة", bInviteNotifTitle:"دعتك إحدى العلامات", bInviteNotifMsg:"منحتك علامة تجارية الوصول إلى كتالوجها. ستجد منتجاتها في كتالوجك." });
Object.assign(T.en,{ diSearchPh:"Search a product…" });
Object.assign(T.it,{ diSearchPh:"Cerca un prodotto…" });
Object.assign(T.fr,{ diSearchPh:"Rechercher un produit…" });
Object.assign(T.es,{ diSearchPh:"Buscar un producto…" });
Object.assign(T.de,{ diSearchPh:"Produkt suchen…" });
Object.assign(T.zh,{ diSearchPh:"搜索产品…" });
Object.assign(T.ar,{ diSearchPh:"ابحث عن منتج…" });







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
  const t = useT();
  const s = (score===null||score===undefined) ? 200 : score;
  let tier, col;
  if (s >= 1000) { tier=t("tbPlatinum"); col=C.blue; }
  else if (s >= 700) { tier=t("tbGold"); col=C.gold; }
  else if (s >= 400) { tier=t("tbSilver"); col=C.textMuted; }
  else if (s >= 200) { tier=t("tbBronze"); col=C.goldDim; }
  else if (s >= 100) { tier=t("tbWatched"); col=C.gold; }
  else { tier=t("tbAtRisk"); col=C.red; }
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
      <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, background:col+"22", color:col, border:`1px solid ${col}55`, whiteSpace:"nowrap" }}>{tier} · {s}</span>
      {state==="suspended" && <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:5, background:C.red+"22", color:C.red, border:`1px solid ${C.red}55` }}>{t("tbSuspended")}</span>}
      {state==="at_risk" && <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:5, background:C.gold+"22", color:C.gold }}>{t("tbAtRiskBadge")}</span>}
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
      {/* Lang switcher — all 7 languages */}
      <select value={lang} onChange={e => onLangChange(e.target.value)} title="Language" style={{ padding:"3px 6px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:600, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, flexShrink:0, outline:"none", maxWidth:150 }}>
        {LANGS.map(l => (<option key={l.key} value={l.key} style={{ background:C.surface, color:C.text }}>{l.name}</option>))}
      </select>
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
  const t = useT();
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
        {t("dmoIntroTag")}
      </div>
      <div style={{ fontSize:"clamp(11px,1.5vw,13px)", color:DC.muted, marginTop:8,
        fontFamily:"'DM Sans',sans-serif", ...anim(0.5) }}>
        {t("dmoIntroSub")}
      </div>
    </div>
  );

  if (slide.type === "problem") return (
    <div style={{ maxWidth:580, width:"100%", textAlign:"left" }}>
      <HL>{t("dmoProbTitle")}</HL>
      {["❌ "+t("dmoProb1"),
        "❌ "+t("dmoProb2"),
        "❌ "+t("dmoProb3"),
        "❌ "+t("dmoProb4")
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
      <HL color={DC.goldL}>{t("dmoSolTitle")}</HL>
      <Sub>{t("dmoSolSub")}</Sub>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginTop:20 }}>
        {[{v:"30+",l:t("dmoSolCountries")},{v:"48h",l:t("dmoSolDelivery")},{v:"100%",l:t("dmoSolAutomated")}].map((s,i) => (
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
      <HL>{t("dmoSecTitle")}</HL>
      <Sub>{t("dmoSecSub")}</Sub>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:16 }}>
        {[
          {icon:"💄",name:t("dmoSecBeauty"),sub:t("dmoSecBeautyS")},
          {icon:"👗",name:t("dmoSecFashion"),sub:t("dmoSecFashionS")},
          {icon:"🍷",name:t("dmoSecFood"),sub:t("dmoSecFoodS")},
          {icon:"📱",name:t("dmoSecElec"),sub:t("dmoSecElecS")},
          {icon:"🏠",name:t("dmoSecHome"),sub:t("dmoSecHomeS")},
          {icon:"💊",name:t("dmoSecHealth"),sub:t("dmoSecHealthS")},
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
        {t("dmoMapTitle")}
      </div>
      <div style={{ fontSize:"clamp(11px,1.6vw,14px)", color:DC.muted, textAlign:"center",
        marginBottom:12, fontFamily:"'DM Sans',sans-serif", ...anim(0.2) }}>
        {t("dmoMapSub")}
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
      <HL color={DC.goldL}>{t("dmoBrTitle")}</HL>
      <Sub>{t("dmoBrSub")}</Sub>
      <FRow icon="🗺️" text={t("dmoBr1")} color={DC.gold} delay={0.25}/>
      <FRow icon="📦" text={t("dmoBr2")} color={DC.gold} delay={0.37}/>
      <FRow icon="✅" text={t("dmoBr3")} color={DC.gold} delay={0.49}/>
      <FRow icon="💰" text={t("dmoBr4")} color={DC.gold} delay={0.61}/>
    </div>
  );

  if (slide.type === "distributors") return (
    <div style={{ maxWidth:580, width:"100%", textAlign:"left" }}>
      <HL color={DC.blue}>{t("dmoDiTitle")}</HL>
      <Sub>{t("dmoDiSub")}</Sub>
      <FRow icon="🏛️" text={t("dmoDi1")} color={DC.blue} delay={0.25}/>
      <FRow icon="📋" text={t("dmoDi2")} color={DC.blue} delay={0.37}/>
      <FRow icon="🚚" text={t("dmoDi3")} color={DC.blue} delay={0.49}/>
      <FRow icon="📊" text={t("dmoDi4")} color={DC.blue} delay={0.61}/>
    </div>
  );

  if (slide.type === "value") return (
    <div style={{ textAlign:"center", maxWidth:680, width:"100%" }}>
      <HL>{t("dmoValTitle")}</HL>
      <Sub>{t("dmoValSub")}</Sub>
      <div style={{ display:"flex", alignItems:"stretch", gap:0, margin:"16px 0", ...anim(0.3) }}>
        {[
          {icon:"📦",title:t("dmoValStock"),sub:t("dmoValStockS"),col:"rgba(201,168,76,.2)"},
          {icon:"🛒",title:t("dmoValOrders"),sub:t("dmoValOrdersS"),col:"rgba(61,142,240,.2)"},
          {icon:"💶",title:t("dmoValRev"),sub:t("dmoValRevS"),col:"rgba(39,174,96,.2)"},
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
        {[{v:"3x",l:t("dmoValM1"),c:DC.goldL},{v:"0",l:t("dmoValM2"),c:DC.blue},{v:"↑↑",l:t("dmoValM3"),c:DC.green}].map((m,i)=>(
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
      <HL>{t("dmoNumTitle")}</HL>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20 }}>
        {[
          {v:"€8.9M",l:t("dmoNum1"),c:DC.goldL,b:DC.gold},
          {v:"103",l:t("dmoNum2"),c:DC.blue,b:DC.blue},
          {v:"480",l:t("dmoNum3"),c:DC.green,b:DC.green},
          {v:"48h",l:t("dmoNum4"),c:DC.purple,b:DC.purple},
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
          <div style={{fontSize:11,color:DC.muted,letterSpacing:".1em",textTransform:"uppercase"}}>{t("dmoAmzService")}</div>
        </div>
      </div>
      <Sub delay={0.2}>{t("dmoAmzSub")}</Sub>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {[
          {icon:"🚚",title:t("dmoAmzC1"),sub:t("dmoAmzC1S")},
          {icon:"📢",title:t("dmoAmzC2"),sub:t("dmoAmzC2S")},
          {icon:"💹",title:t("dmoAmzC3"),sub:t("dmoAmzC3S")},
          {icon:"🔒",title:t("dmoAmzC4"),sub:t("dmoAmzC4S")},
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
        🌍 {t("dmoAmzActiveOn")} Amazon.it · Amazon.de · Amazon.fr · Amazon.es · Amazon.co.uk
      </div>
    </div>
  );

  if (slide.type === "cta") return (
    <div style={{ textAlign:"center", maxWidth:560, width:"100%" }}>
      <div style={{ fontSize:"clamp(36px,7vw,70px)", fontWeight:900,
        fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:".1em",
        background:`linear-gradient(135deg,${DC.goldL},${DC.gold})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        ...anim(0.1) }}>{t("dmoCtaTitle")}</div>
      <Sub delay={0.2}>{t("dmoCtaSub")}</Sub>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
        marginTop:28, ...anim(0.35) }}>
        <button onClick={() => slide.onBrand?.()} style={{
          padding:"15px 30px", borderRadius:11, cursor:"pointer",
          background:`linear-gradient(135deg,${DC.gold},${DC.goldD})`,
          border:"none", color:DC.bg, fontSize:14, fontWeight:800,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:".05em", textTransform:"uppercase",
          boxShadow:`0 8px 32px rgba(201,168,76,.35)` }}>
          🏛️ {t("dmoCtaBrand")}
        </button>
        <button onClick={() => slide.onDist?.()} style={{
          padding:"15px 30px", borderRadius:11, cursor:"pointer",
          background:"transparent", border:`2px solid rgba(61,142,240,.5)`,
          color:DC.blue, fontSize:14, fontWeight:800,
          fontFamily:"'DM Sans',sans-serif", letterSpacing:".05em", textTransform:"uppercase" }}>
          📦 {t("dmoCtaDist")}
        </button>
      </div>
      <div style={{ marginTop:18, fontSize:12, color:DC.dim, ...anim(0.5) }}>
        <button onClick={() => slide.onBack?.()} style={{
          background:"none", border:"none", color:DC.muted, cursor:"pointer",
          fontSize:12, textDecoration:"underline" }}>{t("dmoCtaBack")}</button>
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
  if (view === "register-chain") return <RegisterScreen role="distributor" accountType="chain" lang={lang} onLangChange={onLangChange} onBack={() => setView("login")} />;
  if (view === "demo") return <DemoPresentation lang={lang} onLangChange={onLangChange} onSelectRole={(role) => { if (role === "back") setView("login"); else setView("register-" + role); }} />;

  if (view === "reset") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)`, padding:"20px 12px", overflowY:"auto" }}>
      <div style={{ width:"100%", maxWidth:420, padding:"32px 20px", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:52, height:52, borderRadius:13, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, fontSize:22, fontWeight:900, color:C.bg, marginBottom:12 }}>N</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>{t("lgReset")}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>{t("lgResetSub")}</div>
        </div>

        {resetSent ? (
          <div>
            <div style={{ background:`${C.green}15`, border:`1px solid ${C.green}40`, borderRadius:10, padding:"18px 20px", textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📧</div>
              <div style={{ fontSize:15, fontWeight:700, color:C.green, marginBottom:6 }}>{t("lgSent")}</div>
              <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>
                {t("lgSentPre")} <strong style={{ color:C.text }}>{resetEmail}</strong> {t("lgSentPost")}
              </div>
            </div>
            <button onClick={() => { setView("login"); setResetSent(false); setResetEmail(""); }}
              style={{ width:"100%", padding:"13px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
              {t("lgBackLogin")}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{t("emailLabel")}</label>
              <input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)}
                placeholder={t("lgResetPh")}
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
              {resetLoading ? t("lgSending") : t("lgSendReset")}
            </button>
            <button onClick={() => setView("login")}
              style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>
              {t("lgBackLogin")}
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
              {t("lgForgot")}
            </button>
          </div>
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ fontSize:11, color:C.textDim }}>{t("lgNew")}</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={() => setView("register-brand")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.gold}40`, color:C.gold, fontSize:13, fontWeight:500 }}>{t("registerBrand")}</button>
          <button onClick={() => setView("register-dist")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("registerDist")}</button>
          <button onClick={() => setView("register-chain")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.blue}40`, color:C.blue, fontSize:13 }}>{t("registerChain")}</button>
          <button onClick={() => setView("demo")} style={{ padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.purple}10`, border:`1px solid ${C.purple}40`, color:"#a855f7", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span>▶</span> {t("watchDemo") || "Watch Platform Demo"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ role, accountType, lang, onLangChange, onBack }) => {
  const t = useT();
  const isBrand = role === "brand";
  const isManaged = accountType === "chain" || accountType === "ecommerce";
  const [acctType, setAcctType] = useState(accountType || "distributor");
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
        options: { data: { role, company_name: companyName, full_name: fullName, account_type: acctType } }
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        const isItaly = country === "Italia" || country === "Italy" || country === "IT";
        await supabase.from("profiles").update({
          full_name: fullName, company_name: companyName, phone, country, account_type: acctType,
          vat_number: vatNumber || null,
          ...(isBrand ? {} : { shipping_address: accountHolder || null, shipping_city: bankName || null, shipping_zip: iban || null, shipping_region: swiftBic || null }),
        }).eq("id", data.user.id);
        await supabase.from("profile_billing").upsert({
          id: data.user.id,
          ...(isBrand ? { iban: iban || null, bank_name: bankName || null, account_holder: accountHolder || null, swift_bic: swiftBic || null } : {}),
          sdi_code: isItaly ? (sdiCode || null) : null,
          pec_email: isItaly ? (pecEmail || null) : null,
        }, { onConflict: "id" });
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
          {isBrand ? t("registerBrand") : isManaged ? t("registerChain") : t("registerDist")}
        </h2>
        <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 24px" }}>{step===1 ? t("step1") : t("step2")}</p>

        {isManaged && step===1 && (
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>{t("rgAccTypeLabel")}</label>
            <div style={{ display:"flex", gap:8 }}>
              {[{v:"chain",l:t("rgAccChain")},{v:"ecommerce",l:t("rgAccEcom")}].map(o => (
                <button key={o.v} type="button" onClick={() => setAcctType(o.v)} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", background: acctType===o.v ? `${C.blue}20` : "transparent", border:`1px solid ${acctType===o.v ? C.blue : C.border}`, color: acctType===o.v ? C.blue : C.textMuted, fontSize:12, fontWeight:600 }}>{o.l}</button>
              ))}
            </div>
          </div>
        )}

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
            <button type="submit" style={{ padding:"13px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, marginTop:4 }}>{t("rgContinue")}</button>
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
                💳 {isBrand ? t("rgBankHdrBrand") : t("rgBankHdrDist")}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {(!isBrand ? [
                  { label:t("rgAddr"), val:accountHolder, set:setAccountHolder, placeholder:t("rgAddrPh") },
                  { label:t("rgCity"), val:bankName, set:setBankName, placeholder:t("rgCityPh") },
                  { label:t("rgZip"), val:iban, set:setIban, placeholder:t("rgZipPh") },
                  { label:t("rgProvince"), val:swiftBic, set:setSwiftBic, placeholder:t("rgProvincePh") },
                ] : [
                  { label:t("rgAcctHolder"), val:accountHolder, set:setAccountHolder, placeholder:t("rgAcctHolderPh") },
                  { label:t("rgBank"), val:bankName, set:setBankName, placeholder:t("rgBankPh") },
                  { label:t("rgIbanLbl"), val:iban, set:setIban, placeholder:"IT60 X054 2811 1010 0000 0123 456" },
                  { label:t("rgSwift"), val:swiftBic, set:setSwiftBic, placeholder:t("rgSwiftPh") },
                ]).map(({label,val,set,placeholder}) => (
                  <div key={label}>
                    <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>{label}</label>
                    <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={placeholder}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:8, padding:"8px 12px", background:`${C.gold}08`, border:`1px solid ${C.gold}20`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                💡 {isBrand ? t("rgBankInfoBrand") : t("rgBankInfoDist")}
              </div>
            </div>

            {/* VAT + SDI Section */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                🧾 {t("rgFiscalHdr")}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>
                    {t("rgVatNumber")} <span style={{ color:C.red }}>*</span>
                  </label>
                  <input type="text" value={vatNumber} onChange={e=>setVatNumber(e.target.value)}
                    placeholder={t("rgVatPh")}
                    style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                </div>
                {/* SDI solo per Italia */}
                {(country === "Italia" || country === "Italy" || country === "IT") && (
                  <>
                    <div>
                      <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>{t("rgSdi")}</label>
                      <input type="text" value={sdiCode} onChange={e=>setSdiCode(e.target.value)}
                        placeholder={t("rgSdiPh")}
                        style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>{t("rgPec")}</label>
                      <input type="email" value={pecEmail} onChange={e=>setPecEmail(e.target.value)}
                        placeholder={t("rgPecPh")}
                        style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                  </>
                )}
              </div>
              <div style={{ marginTop:8, padding:"8px 12px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                💡 {t("rgFiscalHint")}
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
              <button type="button" onClick={() => setStep(1)} style={{ padding:"12px 18px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("rgBack")}</button>
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
  const t = useT();
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
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#c9a84c" }}/>{t("tmTurinHub")}
        </div>
        {distributors.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#6b6b8a" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(201,168,76,0.7)" }}/>{t("tmActiveDist")} ({distributors.length})
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#6b6b8a" }}>
          <div style={{ width:12, height:8, borderRadius:2, background:"rgba(201,168,76,0.15)", border:"1px solid rgba(201,168,76,0.4)" }}/>{t("tmCovered")}
        </div>
      </div>
    </div>
  );
};


// ============================================================
// AI SUGGESTIONS COMPONENT
// ============================================================
const InventoryForecast = ({ products = [], orders = [] }) => {
  const t = useT();
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
  const head = [t("ifhProduct"),t("ifhStock"),t("ifhSalesWk"),t("ifhDaysLeft"),t("ifhStockout"),t("ifhReorderBy"),t("ifhStatus"),t("ifhReorder")];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:24, marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📦</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{t("ifTitle")}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{t("ifSub")}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:C.textMuted }}>{t("ifLeadTime")}</span>
          <input type="number" min="0" max="120" value={leadDays} onChange={e => setLeadDays(Math.max(0, parseInt(e.target.value) || 0))} style={{ width:64, padding:"6px 8px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
          <span style={{ fontSize:12, color:C.textMuted }}>{t("ifDays")}</span>
        </div>
      </div>
      <div style={{ margin:"10px 0 16px", fontSize:13, color: needReorder>0 ? C.gold : C.green }}>
        {needReorder>0 ? ("⚠ " + needReorder + " " + t("ifReorderMsg")) : ("✓ " + t("ifAllOk"))}
      </div>
      {rows.length === 0 ? (
        <div style={{ color:C.textMuted, fontSize:13, padding:"12px 0" }}>{t("ifNoProducts")}</div>
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
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [topDistributors, setTopDistributors] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [insights, setInsights] = useState([]);

  const season = () => {
    const m = new Date().getMonth() + 1;
    if (m>=3&&m<=5) return {name:t("seaSpring"),icon:"🌸"};
    if (m>=6&&m<=8) return {name:t("seaSummer"),icon:"☀️"};
    if (m>=9&&m<=11) return {name:t("seaAutumn"),icon:"🍂"};
    return {name:t("seaWinter"),icon:"❄️"};
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
    const seasonL = ({Winter:t("seasonWinter"),Spring:t("seasonSpring"),Summer:t("seasonSummer"),Autumn:t("seasonAutumn")})[s.name] || s.name;
    const aiInsights = [];
    aiInsights.push({
      icon:"📈",
      title:`${s.icon} ${seasonL} — ${t("insStrategy")}`,
      text: s.name === "Winter"
        ? t("insWinter")
        : s.name === "Summer"
        ? t("insSummer")
        : s.name === "Spring"
        ? t("insSpring")
        : t("insAutumn"),
      color:"#c9a84c"
    });
    if (distStats[0]) aiInsights.push({
      icon:"🏆", title:t("insDistTitle"),
      text:t("insDistText").replace("{company}",distStats[0].company).replace("{territory}",distStats[0].territory).replace("{rev}",Number(distStats[0].totalRevenue).toLocaleString("it-IT",{maximumFractionDigits:0})).replace("{orders}",distStats[0].totalOrders),
      color:"#27ae60"
    });
    if (prodStats[0]) aiInsights.push({
      icon:"📦", title:t("insProdTitle"),
      text:t("insProdText").replace("{name}",prodStats[0].name).replace("{units}",Number(prodStats[0].unitsSold).toLocaleString("it-IT")).replace("{name2}",prodStats[1]?.name || t("insAnotherSku")),
      color:"#3d8ef0"
    });
    if (!hasData) aiInsights.push({
      icon:"ℹ️", title:t("insNoDataTitle"),
      text:t("insNoDataText"),
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
            <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{t("baTitle")}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{s.icon} {s.name} · {t("baSub")}</div>
          </div>
        </div>
        <button onClick={generate} disabled={loading} style={{
          padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
          background: loading ? C.surface2 : "linear-gradient(135deg,#8e44ad,#5b2c8d)",
          border:"none", color:"#fff", opacity: loading ? 0.7 : 1 }}>
          {loading ? t("baBtnLoading") : generated ? t("baBtnRefresh") : t("baBtnGenerate")}
        </button>
      </div>

      {!generated && !loading && (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{t("baReportTitle")}</div>
          <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.7, maxWidth:480, margin:"0 auto" }}>
            {t("baReportDesc")}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:15, color:"#a855f7" }}>{t("baLoadingData")}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:6 }}>{t("baProcessing")}</div>
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
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>🏆 {t("baTopDist")}</h3>
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
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>📦 {t("baTopProd")}</h3>
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
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{p.unitsSold?.toLocaleString("it-IT")} {t("baUnitsSold")}</div>
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
            <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>📅 {t("baSeasonality")}</h3>
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
                    <div style={{ fontSize:9, color: isCurrentMonth?color:C.textDim, fontWeight:isCurrentMonth?700:400 }}>{t("mAbbr").split(",")[i]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:10, justifyContent:"center", flexWrap:"wrap" }}>
              {[{c:"#3d8ef0",l:t("seasonWinter")},{"c":"#27ae60",l:t("seasonSpring")},{"c":"#e67e22",l:t("seasonSummer")},{"c":"#c9a84c",l:t("seasonAutumn")}].map(({c,l}) => (
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
  const t = useT();
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
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:0 }}>{t("azTitle")}</h2>
          <p style={{ color:C.textMuted, fontSize:12.5, margin:"2px 0 0" }}>{t("azSub")}</p>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign:"center", padding:48, color:C.textMuted, fontSize:14 }}>{t("azLoading")}</div>
      ) : !hasAny ? (
        <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, marginTop:14 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{t("azEmptyT")}</div>
          <div style={{ fontSize:13, color:C.textMuted }}>{t("azEmptyM")}</div>
        </div>
      ) : (
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>✓ {t("azOn")}: {onCatalog}</span>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:`${C.gold}12`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>{t("azLaunch")}: {notOnAmazon.length}</span>
            <span style={{ padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700, background:C.surface2, border:`1px solid ${C.border}`, color:C.textMuted }}>{t("azCat")}: {catalog.length}</span>
          </div>
          {rows.length>0 && (
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
              <Stat icon="💶" label={t("azRev")} value={eur(rev30)} accent={C.green}/>
              <Stat icon="📦" label={t("azSold")} value={sold30} accent={C.gold}/>
              <Stat icon="🏦" label={t("azStockKpi")} value={stock} accent={C.blue}/>
              <Stat icon="🌍" label={t("azMkts")} value={mkts.length}/>
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
                  {[t("colProduct"),t("azColMkt"),t("azColPrice"),t("colStock"),t("azColSold")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign: i>=2?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
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
            <div style={{ padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.textMuted }}>{t("azNoneActive")}</div>
          )}
          {notOnAmazon.length>0 && (
            <div style={{ marginTop:28 }}>
              <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.text }}>{t("azNotYet")}</h3>
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 12px" }}>{notOnAmazon.length} {t("azNotYetMsg")}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {notOnAmazon.map(p=>(<span key={p.id} style={{ padding:"7px 12px", borderRadius:9, fontSize:12.5, background:C.surface2, border:`1px dashed ${C.border}`, color:C.text }}>{p.name} <span style={{ color:C.gold, fontSize:10, fontWeight:700 }}>· {t("azBadge")}</span></span>))}
              </div>
            </div>
          )}
          <p style={{ fontSize:11, color:C.textDim, marginTop:18 }}>{t("azFooter")}</p>
        </div>
      )}
    </div>
  );
};

const NexusAI = ({ role }) => {
  const t = useT();
  const eur = (n) => "€" + Number(n||0).toLocaleString("it-IT", { minimumFractionDigits:2, maximumFractionDigits:2 });
  const num = (x) => Number(x||0);
  const qa = (inv) => Array.isArray(inv) ? num(inv[0] && inv[0].quantity_available) : num(inv && inv.quantity_available);
  const ST = { draft:"aiStDraft", pending:"aiStPending", confirmed:"aiStConfirmed", shipped:"aiStShipped", delivered:"aiStDelivered", cancelled:"aiStCancelled" };
  const stt = (k) => ST[k] ? t(ST[k]) : k;
  const countByStatus = (rows) => { const m={}; (rows||[]).forEach(r=>{ m[r.status]=(m[r.status]||0)+1; }); const ks=Object.keys(m); return ks.length ? ks.map(k=>"• "+stt(k)+": "+m[k]).join("\n") : t("aiNoOrders"); };

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
      { chip:t("aiBChipSales"), keys:["vendit","fatturat","venduto","gmv"], run: async () => {
        const { data:o } = await supabase.from("orders").select("total_amount,status");
        const ok=(o||[]).filter(x=>x.status!=="cancelled");
        const gmv=ok.reduce((a,x)=>a+num(x.total_amount),0);
        return t("aiBSales").replace("{gmv}",eur(gmv)).replace("{n}",ok.length).replace("{payout}",eur(gmv*0.886));
      }},
      { chip:t("aiBChipOrders"), keys:["ordini","stato"], run: async () => {
        const { data:o } = await supabase.from("orders").select("status");
        return t("aiBOrdersTitle")+"\n" + countByStatus(o);
      }},
      { chip:t("aiBChipRating"), keys:["rating","recension","valutaz","stelle"], run: async () => {
        const { data:o } = await supabase.from("orders").select("rating").not("rating","is",null);
        if(!o||!o.length) return t("aiBNoRatings");
        const avg=o.reduce((a,x)=>a+num(x.rating),0)/o.length;
        return t("aiBRating").replace("{avg}",avg.toFixed(2)).replace("{n}",o.length);
      }},
      { chip:t("aiBChipProducts"), keys:["prodott","catalog","scort","stock"], run: async () => {
        const { data:p } = await supabase.from("products").select("name,is_active,inventory(*)");
        const act=(p||[]).filter(x=>x.is_active).length;
        const low=(p||[]).filter(x=>qa(x.inventory)<50);
        return t("aiBProducts").replace("{act}",act).replace("{tot}",(p||[]).length) + (low.length?"\n"+t("aiBLow").replace("{list}",low.map(x=>x.name).join(", ")):"\n"+t("aiBStockOk"));
      }}
    ],
    distributor: [
      { chip:t("aiDChipOrders"), keys:["ordini","stato","ordine"], run: async () => {
        const { data:o } = await supabase.from("orders").select("status,total_amount");
        const spent=(o||[]).filter(x=>x.status!=="cancelled").reduce((a,x)=>a+num(x.total_amount),0);
        return t("aiBOrdersTitle")+"\n" + countByStatus(o) + "\n"+t("aiDSpent").replace("{spent}",eur(spent));
      }},
      { chip:t("aiDChipTrack"), keys:["tracking","spedizion","traccia","dov","corriere"], run: async () => {
        const { data:o } = await supabase.from("orders").select("order_number,status,courier,tracking_number,tracking_url,shipped_at").in("status",["shipped","delivered"]).order("shipped_at",{ascending:false}).limit(1);
        if(!o||!o.length) return t("aiDNoShip");
        const x=o[0];
        let out=t("aiDTrack").replace("{num}",x.order_number).replace("{status}",stt(x.status)).replace("{courier}",x.courier||"—").replace("{track}",x.tracking_number||"—");
        if(x.tracking_url) out+="\n"+t("aiDTrackLink").replace("{url}",x.tracking_url);
        return out;
      }},
      { chip:t("aiDChipWish"), keys:["wishlist","desideri","preferit"], run: async () => {
        const { data:w } = await supabase.from("wishlist_items").select("id");
        return t("aiDWish").replace("{n}",(w||[]).length);
      }},
      { chip:t("aiDChipCatalog"), keys:["catalog","prodott","disponib"], run: async () => {
        const { data:p } = await supabase.from("products").select("id").eq("is_active",true);
        return t("aiDCatalog").replace("{n}",(p||[]).length);
      }}
    ]
  };

  const intents = INTENTS[role] || INTENTS.distributor;
  const [msgs, setMsgs] = useState([{ who:"ai", text:t("aiIntro") }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const ask = async (q) => {
    const query=(q||"").trim(); if(!query||busy) return;
    setMsgs(m=>[...m,{ who:"user", text:query }]); setInput(""); setBusy(true);
    const ql=query.toLowerCase();
    const hit=intents.find(it=>it.keys.some(k=>ql.includes(k)) || ql.includes((it.chip||"").toLowerCase()));
    let ans;
    try { ans = hit ? await hit.run() : (t("aiNoUnderstand")+"\n"+intents.map(i=>"• "+i.chip).join("\n")); }
    catch(e){ console.error(e); ans=t("aiError"); }
    setMsgs(m=>[...m,{ who:"ai", text:ans }]); setBusy(false);
  };
  const runIntent = async (it) => {
    if(busy) return;
    setMsgs(m=>[...m,{ who:"user", text:it.chip }]); setBusy(true);
    let ans; try { ans = await it.run(); } catch(e){ console.error(e); ans=t("aiError"); }
    setMsgs(m=>[...m,{ who:"ai", text:ans }]); setBusy(false);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:"linear-gradient(135deg,#8e44ad,#5b2c8d)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:0 }}>Nexus AI</h2>
          <p style={{ color:C.textMuted, fontSize:12.5, margin:"2px 0 0" }}>{t("aiSub")}</p>
        </div>
      </div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginTop:14 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:340, overflowY:"auto", marginBottom:14 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ alignSelf: m.who==="user"?"flex-end":"flex-start", maxWidth:"85%", padding:"10px 13px", borderRadius:12, fontSize:13, lineHeight:1.5, whiteSpace:"pre-wrap", background: m.who==="user"?`linear-gradient(135deg,${C.gold},${C.goldDim})`:C.surface2, color: m.who==="user"?C.bg:C.text, border: m.who==="user"?"none":`1px solid ${C.border}` }}>{m.text}</div>
          ))}
          {busy && <div style={{ alignSelf:"flex-start", fontSize:12, color:C.textMuted, padding:"6px 4px" }}>{t("aiSearching")}</div>}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
          {intents.map((it,i)=>(
            <button key={i} onClick={()=>runIntent(it)} disabled={busy} style={{ padding:"6px 12px", borderRadius:20, cursor:busy?"default":"pointer", fontSize:12, background:`${C.gold}12`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>{it.chip}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") ask(input); }} placeholder={t("aiPlaceholder")} style={{ flex:1, padding:"10px 13px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }}/>
          <button onClick={()=>ask(input)} disabled={busy} style={{ padding:"10px 18px", borderRadius:9, cursor:busy?"default":"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>{t("aiSend")}</button>
        </div>
      </div>
      <p style={{ fontSize:11, color:C.textDim, marginTop:10 }}>{t("aiFooter")}</p>
    </div>
  );
};

const BrandDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [accessReqs, setAccessReqs] = useState([]);
  const [dbDistributors, setDbDistributors] = useState([]);
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
  const [bMe, setBMe] = useState(null);
  const [bStripeBusy, setBStripeBusy] = useState(false);
  const bNotify = (m) => { setBToast(m); setTimeout(() => setBToast(""), 2600); };
  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("id, company_name, email, country, stripe_connect_id, stripe_connect_status").eq("id", user.id).single();
    setBMe(data);
  })(); }, []);
  const connectStripe = async () => {
    setBStripeBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/stripe-connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ action: "create_brand_account", brand_id: user.id, brand_email: bMe && bMe.email, brand_name: bMe && bMe.company_name, brand_country: (bMe && bMe.country) || "IT" })
      });
      const data = await res.json();
      if (data.onboarding_url) { window.location.href = data.onboarding_url; return; }
      bNotify(data.error || t("bStripeErr"));
    } catch (e) { bNotify(t("bStripeErr")); }
    setBStripeBusy(false);
  };
  const refreshStripe = async () => {
    if (!bMe || !bMe.stripe_connect_id) return;
    setBStripeBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/stripe-connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ action: "check_account", stripe_connect_id: bMe.stripe_connect_id, brand_id: user.id })
      });
      const data = await res.json();
      setBMe(m => m ? { ...m, stripe_connect_status: data.active ? "active" : "pending" } : m);
      bNotify(data.active ? t("bStripeActive") : t("bStripePending"));
    } catch (e) { bNotify(t("bStripeErr")); }
    setBStripeBusy(false);
  };
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
    supabase.from("profiles").select("id, company_name, email, country, trust_score, account_state").eq("role","distributor").eq("account_type","distributor").eq("status","approved").then(({ data }) => setDbDistributors(data || []));
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
  const inviteDistributor = async (dist) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("brand_access_requests").upsert({ distributor_id: dist.id, brand_id: user.id, status: "approved", updated_at: new Date().toISOString() }, { onConflict: "distributor_id,brand_id" });
    await supabase.from("notifications").insert({ user_id: dist.id, type: "access_update", title: t("bInviteNotifTitle"), message: t("bInviteNotifMsg") });
    setAccessReqs(prev => prev.some(r => r.distributor_id === dist.id) ? prev.map(r => r.distributor_id === dist.id ? { ...r, status: "approved" } : r) : [...prev, { id: "tmp-"+dist.id, distributor_id: dist.id, brand_id: user.id, status: "approved", distributor: dist }]);
    bNotify(t("bInviteSent"));
  };
  const handleAccess = async (req, newStatus, exclusive = false) => {
    setAccessReqs(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus, exclusive: newStatus === "approved" ? exclusive : r.exclusive } : r));
    const upd = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === "approved") upd.exclusive = exclusive;
    await supabase.from("brand_access_requests").update(upd).eq("id", req.id);
    await supabase.from("notifications").insert({
      user_id: req.distributor_id,
      title: newStatus === "approved" ? t("bdAccessApproved") : t("bdAccessBlocked"),
      message: newStatus === "approved"
        ? (exclusive
            ? t("bdAccessExclMsg")
            : t("bdAccessSharedMsg"))
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
              title: t("bdTerrNA"),
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
    { key:"fatture", icon:"🧾", label:t("ddInvoices") },
    { key:"payments", icon:"€", label:t("tabPayments") },
    { key:"analytics", icon:"🤖", label:t("bdAIAnalytics") },
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
                <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>{t("noNotif")}
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
              <Stat icon="📦" label={t("ovProducts")} value={brandProducts.length} accent={C.green}/>
              <Stat icon="🧾" label={t("ovOrders")} value={brandOrders.length}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>⬡ {t("ovDistAuth")}</h3>
                {approved.length===0 ? (
                  <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{t("ovNoDist")}</div>
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
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>🗺️ {t("ovEuMap")}</h3>
                <EuropeMap distributors={mapDist}/>
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>📦 {t("ovYourProd")}</h3>
                {[[t("ovCatProd"), brandProducts.length],[t("ovTotOrders"), brandOrders.length],[t("ovActiveDist"), approved.length],[t("ovRevenue"), eur(revenue)]].map(([k,v],i)=>(
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
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>{t("bNoReq")}</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>{t("bNoReqMsg")}</div>
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
                    <button onClick={() => handleAccess(r, "approved", true)} style={{ padding:"10px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.gold}20`, border:`1px solid ${C.gold}55`, color:C.gold }}>🔒 {t("bApproveExcl")}</button>
                    <button onClick={() => handleAccess(r, "approved", false)} style={{ padding:"10px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>✓ {t("bApproveShared")}</button>
                    <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>✗ {t("bBlock")}</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <div style={{ padding:"11px 16px", borderRadius:8, background:r.status==="approved"?`${C.green}12`:`${C.red}12`, border:`1px solid ${r.status==="approved"?C.green:C.red}30`, fontSize:13, color:r.status==="approved"?C.green:C.red, fontWeight:600 }}>
                      {r.status==="approved"?t("bdAccessOkOrder"):t("bdAccessBlockedIcon")}
                    </div>
                    {r.status==="approved" && <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.red}40`, color:C.red }}>{t("bBlockAccess")}</button>}
                    {r.status==="blocked" && <button onClick={() => handleAccess(r, "approved")} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.green}40`, color:C.green }}>{t("bUnblock")}</button>}
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
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("bDistSub")}</p>
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
                  <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>{t("bNoDist")}</div>
                  <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>{t("bNoDistMsg")}</div>
                </div>
              );
              return (
                <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {[t("hdrDistributor"),t("hdrCountry"),t("hdrOrders"),t("hdrRevenue"),t("hdrStatus"),t("hdrDiscount"),t("hdrAction")].map((h,i) => (
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
                                <span style={{ padding:"2px 8px", borderRadius:5, fontSize:10, fontWeight:600, background:r.exclusive?`${C.gold}15`:`${C.blue}12`, border:`1px solid ${(r.exclusive?C.gold:C.blue)}30`, color:r.exclusive?C.gold:C.blue }}>{r.exclusive?t("bdExclusive"):t("bdShared")}</span>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px", whiteSpace:"nowrap" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <input type="number" min={0} max={90} value={r.discount_pct == null ? 0 : r.discount_pct}
                                  onChange={e => { const v = e.target.value; setAccessReqs(prev => prev.map(x => x.id===r.id ? { ...x, discount_pct: v } : x)); }}
                                  style={{ width:60, padding:"6px 8px", borderRadius:7, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
                                <span style={{ fontSize:12, color:C.textMuted }}>%</span>
                                <button onClick={() => saveDiscount(r, r.discount_pct)} style={{ padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background:`${C.green}15`, border:`1px solid ${C.green}45`, color:C.green }}>{t("bSave")}</button>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <button onClick={() => handleAccess(r, "blocked")} style={{ padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, background:"transparent", border:`1px solid ${C.red}40`, color:C.red, whiteSpace:"nowrap" }}>{t("bBlock")}</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            {/* Directory: invita distributori presenti sulla piattaforma */}
            <div style={{ marginTop:28 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:C.text, margin:"0 0 4px" }}>{t("bFindDistTitle")}</h3>
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>{t("bFindDistSub")}</p>
              {(() => {
                const reqByDist = {}; accessReqs.forEach(r => { reqByDist[r.distributor_id] = r.status; });
                if (dbDistributors.length === 0) return <div style={{ color:C.textDim, fontSize:13 }}>{t("bNoDistDir")}</div>;
                return (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap:12 }}>
                    {dbDistributors.map(dist => {
                      const rst = reqByDist[dist.id];
                      return (
                        <div key={dist.id} style={{ background:C.surface, border:`1px solid ${rst==="approved"?C.goldDim:C.border}`, borderRadius:12, padding:14 }}>
                          <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{dist.company_name || dist.email || "Distributore"}</div>
                          <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>{dist.country || "\u2014"}</div>
                          {rst === "approved" ? (
                            <span style={{ fontSize:12, fontWeight:600, color:C.green }}>{"\u2713 " + t("bDistActive")}</span>
                          ) : rst === "pending" ? (
                            <span style={{ fontSize:12, fontWeight:600, color:C.gold }}>{t("bDistPending")}</span>
                          ) : (
                            <button onClick={() => inviteDistributor(dist)} style={{ padding:"7px 14px", borderRadius:7, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:12, fontWeight:700 }}>{t("bInvite")}</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {bToast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:1100, background:C.surface, border:`1px solid ${C.gold}55`, color:C.text, padding:"12px 20px", borderRadius:10, fontSize:13, boxShadow:"0 8px 30px rgba(0,0,0,.4)" }}>{bToast}</div>
        )}
        {bPricesProduct && (
          <Modal title={(t("bdPriceLists")+" - ") + (bPricesProduct.name || "")} onClose={() => setBPricesProduct(null)} onSave={() => setBPricesProduct(null)} saveLabel={t("bdDone")}>
            <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 6px" }}>{t("bpPricePre")} <b style={{ color:C.goldLight }}>€{Number(bPricesProduct.unit_price||0).toFixed(2)}</b>{t("bpPricePost")}</p>
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", margin:"14px 0 16px" }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:5 }}>{t("country")}</label>
                <select value={bPriceForm.country} onChange={e => setBPriceForm(f => ({...f, country:e.target.value}))} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="">{t("bChooseCountry")}</option>
                  {[["IT","Italia"],["DE","Germania"],["FR","Francia"],["ES","Spagna"],["RO","Romania"],["NL","Paesi Bassi"],["BE","Belgio"],["PT","Portogallo"],["AT","Austria"],["PL","Polonia"],["GR","Grecia"],["BG","Bulgaria"],["HU","Ungheria"],["CZ","Rep. Ceca"],["HR","Croazia"],["SE","Svezia"],["DK","Danimarca"],["FI","Finlandia"],["IE","Irlanda"],["AL","Albania"],["CH","Svizzera"],["GB","Regno Unito"]].map(([c,l]) => <option key={c} value={c}>{l} ({c})</option>)}
                </select>
              </div>
              <div style={{ width:120 }}>
                <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:5 }}>{t("bPriceEur")}</label>
                <input type="text" inputMode="decimal" value={bPriceForm.price} onChange={e => setBPriceForm(f => ({...f, price:e.target.value}))} placeholder="0.00" style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
              <button onClick={bSavePrice} style={{ padding:"10px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>{t("bSave")}</button>
            </div>
            {bPrices.length === 0 ? (
              <div style={{ textAlign:"center", padding:12, color:C.textMuted, fontSize:13 }}>{t("bNoPriceList")}</div>
            ) : bPrices.map(pr => (
              <div key={pr.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:7 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.text, width:60 }}>{pr.country}</span>
                <span style={{ flex:1, fontSize:13, color:C.goldLight, fontWeight:700 }}>€{Number(pr.price).toFixed(2)}</span>
                <button onClick={() => bDeletePrice(pr.id)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>{t("bDelete")}</button>
              </div>
            ))}
          </Modal>
        )}
        {bDocsProduct && (
          <Modal title={(t("ddDocs")+" · ") + (bDocsProduct.name || "Prodotto")} onClose={() => { setBDocsProduct(null); setBDocs([]); }} onSave={() => { setBDocsProduct(null); setBDocs([]); }} saveLabel={t("bdDone")}>
            <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>{t("bDocsMsg")}</p>
            <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"18px 12px", borderRadius:10, cursor:"pointer", background:C.surface2, border:`1px dashed ${C.gold}55`, textAlign:"center", marginBottom:16 }}>
              <input type="file" style={{ display:"none" }} disabled={bDocsBusy} onChange={e => { const f=e.target.files&&e.target.files[0]; if(f) bUploadDoc(f); if(e.target) e.target.value=""; }}/>
              <span style={{ fontSize:22 }}>{bDocsBusy ? "⏳" : "📎"}</span>
              <span style={{ fontSize:12, color:C.textMuted }}>{bDocsBusy ? t("bdLoading") : "Carica un documento (PDF, immagine, ecc.)"}</span>
            </label>
            {bDocs.length === 0 ? (
              <div style={{ textAlign:"center", padding:16, color:C.textMuted, fontSize:13 }}>{t("bNoDocs")}</div>
            ) : bDocs.map(d => (
              <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>📄</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{new Date(d.created_at).toLocaleDateString("it-IT")}</div>
                </div>
                <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"4px 10px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>{t("bOpen")}</a>
                <button onClick={() => bDeleteDoc(d.id)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>{t("bDelete")}</button>
              </div>
            ))}
          </Modal>
        )}
        {bShowAddProduct && (
          <Modal title={bEditingProduct ? t("aprmTitleEdit") : t("aprmTitleNew")} onClose={() => { setBShowAddProduct(false); setBEditingProduct(null); }} onSave={bSaveProduct}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { label:t("aprmName"), key:"name", placeholder:t("aprmNamePh"), mode:"text" },
                { label:"SKU", key:"sku", placeholder:t("aprmSkuPh"), mode:"text" },
                { label:t("aprmCategory"), key:"category", placeholder:t("aprmCategoryPh"), mode:"text" },
                { label:t("aprmSize"), key:"size", placeholder:t("aprmSizePh"), mode:"text" },
                { label:t("aprmPrice"), key:"price", placeholder:"0.00", mode:"decimal" },
                { label:t("aprmOrderMult"), key:"order_multiple", placeholder:t("aprmOrderMultPh"), mode:"numeric" },
                { label:t("aprmMoq"), key:"min_order_qty", placeholder:t("aprmMoqPh"), mode:"numeric" },
                { label:t("aprmMaxQty"), key:"max_order_qty", placeholder:t("aprmMaxQtyPh"), mode:"numeric" },
              ].map(({label, key, placeholder, mode}) => (
                <div key={key} style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{label}</label>
                  <input type="text" inputMode={mode} value={bProductForm[key]} onChange={e => setBProductForm(f => ({...f, [key]: e.target.value}))} placeholder={placeholder} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("bDesc")}</label>
              <textarea value={bProductForm.description} onChange={e => setBProductForm(f => ({...f, description: e.target.value}))} rows={2} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical" }}/>
            </div>
            <div style={{ marginBottom:4 }}>
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:8 }}>{t("bProdImg")}</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"16px 12px", borderRadius:10, cursor:"pointer", background: bProductForm.image_file ? `${C.green}10` : C.surface2, border:`1px dashed ${bProductForm.image_file ? C.green : C.border}`, textAlign:"center" }}>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files?.[0]; if(f) setBProductForm(p=>({...p,image_file:f,image_url:""})); }}/>
                  <span style={{ fontSize:22 }}>{bProductForm.image_file ? "✓" : "📁"}</span>
                  <span style={{ fontSize:11, color: bProductForm.image_file ? C.green : C.textMuted }}>{bProductForm.image_file ? bProductForm.image_file.name : t("aprmUploadImg")}</span>
                </label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <span style={{ fontSize:11, color:C.textMuted }}>{t("bOrExtUrl")}</span>
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
                  📊 {bImportLoading ? t("bdImporting") : "Import Excel/CSV"}
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if(f) bImportProducts(f); e.target.value=""; }}/>
                </label>
                <button onClick={() => { setBEditingProduct(null); setBProductForm({ name:"", sku:"", category:"", size:"", price:"", order_multiple:"", min_order_qty:"", max_order_qty:"", description:"", image_url:"", image_file:null }); setBShowAddProduct(true); }} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>{t("bNewProduct")}</button>
              </div>
            </div>
            {bImportResults && (
              <div style={{ padding:"12px 16px", background:`${C.green}12`, border:`1px solid ${C.green}30`, borderRadius:10, marginBottom:16, fontSize:13, color:C.green }}>
                ✓ Import completato: {bImportResults.success} prodotti{bImportResults.errors > 0 ? `, ${bImportResults.errors} errori` : ""}
                <button onClick={() => setBImportResults(null)} style={{ marginLeft:12, background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12 }}>×</button>
                <div style={{ marginTop:6, fontSize:11, color:C.textMuted }}>{t("bCsvCols")}</div>
              </div>
            )}
            {brandProducts.length === 0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>{t("bNoProducts")}</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>{t("bNoProductsMsg")}</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {["SKU",t("hdrProduct"),t("aprmCategory"),t("hdrPrice"),t("hdrStock"),"MOQ",t("hdrMultiple"),t("hdrStatus"),t("hdrActions")].map((h,i) => (
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
                            <button onClick={() => { setBEditingProduct(p); setBProductForm({ name:p.name||"", sku:p.sku||"", category:p.category||"", size:"", price:p.unit_price?.toString()||"", order_multiple:p.order_multiple||"", min_order_qty:p.min_order_qty||"", max_order_qty:p.max_order_qty||"", description:p.description||"", image_url:p.image_url||"", image_file:null }); setBShowAddProduct(true); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>{t("bEdit")}</button>
                            <button onClick={() => openBDocs(p)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>📎 {t("bDoc")}</button>
                            <button onClick={() => openBPrices(p)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>€ {t("bPrices")}</button>
                            <button onClick={async () => { await supabase.from("products").update({ is_active:!p.is_active }).eq("id",p.id); reloadBrandProducts(); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>{p.is_active?t("bdDeactivate"):t("bdActivate")}</button>
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
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>{t("bNoOrders")}</div>
            ) : (
              <Table minWidth={900}
                headers={[t("hdrOrder"),t("hdrDistributor"),t("hdrItems"),t("hdrValue"),t("hdrStatus"),t("hdrTracking"),t("hdrRating"),t("hdrDate")]}
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 {t("bInvoices")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("bInvoicesMsg")}</p>
            {brandInvoices.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>{t("diNoInvoices")}</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                  <thead><tr style={{ background:C.surface2 }}>{[t("hdrNumber"),t("hdrType"),t("hdrCounterparty"),t("hdrTotal"),"PDF",t("hdrAction")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}</tr></thead>
                  <tbody>
                    {brandInvoices.map((inv,i)=>{ const isComm = inv.type==="nexushub_commission"; return (
                      <tr key={inv.id} style={{ background:i%2===0?"transparent":C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{inv.invoice_number}</span></td>
                        <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, fontWeight:600, color:isComm?C.gold:C.green }}>{isComm?t("bdCommission"):t("bdSale")}</span></td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.text }}>{isComm?inv.from_entity:inv.to_entity}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.goldLight }}>€{Number(inv.total||0).toLocaleString("it-IT")}</td>
                        <td style={{ padding:"11px 14px" }}>
                          {inv.pdf_url ? (<a href={inv.pdf_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue }}>📎 PDF</a>) : (!isComm ? (
                            <label style={{ fontSize:11, color:C.textMuted, cursor:"pointer", textDecoration:"underline" }}>{t("bdUploadPdf")}
                              <input type="file" accept="application/pdf" style={{ display:"none" }} onChange={async e=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; const path="invoices/"+inv.id+"_"+f.name; const up=await supabase.storage.from("documents").upload(path,f,{upsert:true}); if(up&&up.data){ const u=supabase.storage.from("documents").getPublicUrl(path); const url=u.data.publicUrl; await supabase.from("invoices").update({ pdf_url:url }).eq("id",inv.id); setBrandInvoices(prev=>prev.map(x=>x.id===inv.id?{...x,pdf_url:url}:x)); } if(e.target) e.target.value=""; }}/>
                            </label>
                          ) : <span style={{ fontSize:11, color:C.textDim }}>—</span>)}
                        </td>
                        <td style={{ padding:"11px 14px" }}><button onClick={()=>setBrandInvoiceView(inv)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>{t("diView")}</button></td>
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🤖 {t("bAiTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("bAiSub")}</p>
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
            {/* Stripe Connect onboarding */}
            <div style={{ background:C.surface, border:`1px solid ${bMe && bMe.stripe_connect_status==="active" ? C.green+"55" : C.gold+"40"}`, borderRadius:14, padding:22, marginBottom:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>{t("bStripeTitle")}</div>
                  <div style={{ fontSize:12, color:C.textMuted, maxWidth:440, lineHeight:1.5 }}>{t("bStripeDesc")}</div>
                </div>
                <div>
                  {bMe && bMe.stripe_connect_status==="active" ? (
                    <span style={{ fontSize:13, fontWeight:700, color:C.green }}>{"\u2713 " + t("bStripeActive")}</span>
                  ) : bMe && bMe.stripe_connect_id ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                      <span style={{ fontSize:12, fontWeight:600, color:C.gold }}>{t("bStripePending")}</span>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={connectStripe} disabled={bStripeBusy} style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.gold}`, color:C.gold, fontSize:12, fontWeight:600 }}>{t("bStripeResume")}</button>
                        <button onClick={refreshStripe} disabled={bStripeBusy} style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:12, fontWeight:600 }}>{t("bStripeCheck")}</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={connectStripe} disabled={bStripeBusy} style={{ padding:"10px 18px", borderRadius:8, cursor:"pointer", background:"linear-gradient(135deg,#635bff,#4b44cc)", border:"none", color:"#fff", fontSize:13, fontWeight:700 }}>{bStripeBusy ? "\u2026" : t("bStripeConnect")}</button>
                  )}
                </div>
              </div>
            </div>
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
  "china":"zh","cina":"zh","cn":"zh",
  "united arab emirates":"ar","uae":"ar","emirati arabi uniti":"ar","ae":"ar","saudi arabia":"ar","arabia saudita":"ar","sa":"ar","qatar":"ar","qa":"ar","kuwait":"ar","kw":"ar","bahrain":"ar","bh":"ar","oman":"ar","om":"ar","egypt":"ar","egitto":"ar","eg":"ar","jordan":"ar","jo":"ar","morocco":"ar","marocco":"ar","ma":"ar","lebanon":"ar","libano":"ar","lb":"ar",
};
const CONTRACT_LANG_NAME = { it:"Italiano", fr:"Francais", es:"Espanol", de:"Deutsch", zh:"中文", ar:"العربية" };

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
By accepting electronically, the Distributor confirms that it has read, understood and agreed to this Agreement. The electronic acceptance, together with the recorded name and timestamp, evidences the Distributor's assent.`;

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
Accettando per via elettronica, il Distributore conferma di aver letto, compreso e approvato il presente contratto. L'accettazione elettronica, unitamente al nominativo e alla data/ora registrati, costituisce prova del consenso del Distributore.`;
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
En acceptant par voie electronique, le Distributeur confirme avoir lu, compris et approuve le present contrat. L'acceptation electronique, ainsi que le nom et l'horodatage enregistres, attestent du consentement du Distributeur.`;
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
Al aceptar por via electronica, el Distribuidor confirma haber leido, comprendido y aprobado el presente contrato. La aceptacion electronica, junto con el nombre y la marca de tiempo registrados, acredita el consentimiento del Distribuidor.`;
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
Mit der elektronischen Annahme bestatigt der Vertriebspartner, diesen Vertrag gelesen, verstanden und genehmigt zu haben. Die elektronische Annahme bildet zusammen mit dem erfassten Namen und Zeitstempel den Nachweis der Zustimmung des Vertriebspartners.`;
  } else if (sec === "zh") {
    secText = `国际分销协议
协议编号：${contractNumber}

签约双方
${brandName}（"授权方"）
与
${distCompany}（"分销商"）

1. 委任与范围
授权方委任分销商在区域内推广、营销并转售授权方的产品（"产品"），分销商接受该项委任。

2. 区域
本协议所涵盖的区域为：${territory}。

3. 独家性
${exclusive ? "分销商被委任为该区域内产品的独家分销商。在协议期限内，授权方不得在该区域内委任其他产品分销商。" : "分销商以非独家方式被委任。授权方可在该区域内委任其他产品分销商。"}

4. 期限
本协议自 ${validFrom} 起至 ${validUntil} 止有效，除非依据其条款提前终止。经双方书面约定可予以续期。

5. 订单与供应
分销商通过 NexusHub 平台下达订单以采购产品。授权方将尽合理努力，在有货情况下履行已接受的订单。供应的商业与经济条件由双方另行约定，不构成本文件的组成部分。

6. 商标与知识产权
分销商仅可在协议期限内为营销和转售产品之目的使用授权方的商标及品牌资料，且不因此取得任何所有权。因该等使用而产生的一切商誉均归属授权方。

7. 分销商的义务
分销商应：(a) 在区域内勤勉推广产品；(b) 遵守所有适用的法律法规；(c) 维护产品及授权方品牌的声誉与完整；及 (d) 未经授权方事先书面同意，不得主动在区域外招揽销售。

8. 保密
各方应对自另一方获得的所有非公开信息予以保密，并仅将其用于履行本协议。

9. 终止
任何一方均可在对方发生重大违约且未能于书面通知后三十(30)日内予以纠正时，或在对方资不抵债时，终止本协议。协议届满或终止不影响在该日期之前已产生的权利与义务。

10. 适用法律
本协议受授权方营业地所适用的法律管辖。双方应在将争议提交有管辖权的法院之前，努力友好解决。

11. 语言
本协议以英文和中文订立。如有歧义或解释冲突，以英文版本为准。

12. 接受
通过电子方式接受，即表示分销商确认已阅读、理解并同意本协议。电子接受连同所记录的姓名及时间戳，构成分销商同意的证据。`;
  } else if (sec === "ar") {
    secText = `اتفاقية توزيع دولية
رقم الاتفاقية: ${contractNumber}

بين
${brandName} ("الموكِّل")
و
${distCompany} ("الموزِّع")

1. التعيين والنطاق
يعيّن الموكِّل الموزِّع للترويج لمنتجات الموكِّل ("المنتجات") وتسويقها وإعادة بيعها داخل الإقليم، ويقبل الموزِّع هذا التعيين.

2. الإقليم
الإقليم المشمول بهذه الاتفاقية هو: ${territory}.

3. الحصرية
${exclusive ? "يُعيَّن الموزِّع موزِّعًا حصريًا للمنتجات داخل الإقليم. وخلال مدة الاتفاقية، لا يجوز للموكِّل تعيين موزّعين آخرين للمنتجات داخل الإقليم." : "يُعيَّن الموزِّع على أساس غير حصري. ويجوز للموكِّل تعيين موزّعين آخرين للمنتجات داخل الإقليم."}

4. المدة
تسري هذه الاتفاقية من ${validFrom} إلى ${validUntil}، ما لم تُنهَ قبل ذلك وفقًا لأحكامها. ويجوز تجديدها باتفاق كتابي بين الطرفين.

5. الطلبات والتوريد
يشتري الموزِّع المنتجات بتقديم الطلبات عبر منصة NexusHub. ويبذل الموكِّل جهودًا معقولة لتنفيذ الطلبات المقبولة رهنًا بالتوافر. ويُتَّفق على الشروط التجارية والاقتصادية للتوريد بشكل منفصل بين الطرفين، ولا تُشكِّل جزءًا من هذه الوثيقة.

6. العلامات التجارية والملكية الفكرية
يجوز للموزِّع استخدام العلامات التجارية ومواد الموكِّل حصريًا لتسويق المنتجات وإعادة بيعها خلال مدة الاتفاقية، دون اكتساب أي حق ملكية فيها. وتعود كل شهرة تنشأ عن هذا الاستخدام لمصلحة الموكِّل.

7. التزامات الموزِّع
يلتزم الموزِّع بما يلي: (أ) الترويج للمنتجات بعناية داخل الإقليم؛ (ب) الامتثال لجميع القوانين واللوائح المعمول بها؛ (ج) حماية سمعة ونزاهة المنتجات وعلامة الموكِّل؛ (د) عدم السعي الفعّال للبيع خارج الإقليم دون موافقة كتابية مسبقة من الموكِّل.

8. السرية
يحافظ كل طرف على سرية جميع المعلومات غير العلنية التي يتلقاها من الطرف الآخر، ويستخدمها حصريًا لتنفيذ هذه الاتفاقية.

9. الإنهاء
يجوز لأي من الطرفين إنهاء هذه الاتفاقية في حال وقوع إخلال جوهري لم يُصحَّح خلال ثلاثين (30) يومًا من الإشعار الكتابي، أو عند إعسار الطرف الآخر. ولا يؤثر انتهاء المدة أو الإنهاء على الحقوق والالتزامات المستحقة قبل ذلك التاريخ.

10. القانون الواجب التطبيق
تخضع هذه الاتفاقية للقانون المعمول به في مقر عمل الموكِّل. ويسعى الطرفان إلى تسوية أي نزاع وديًا قبل عرضه على المحاكم المختصة.

11. اللغة
حُرِّرت هذه الاتفاقية باللغتين الإنجليزية والعربية. وفي حال وجود أي تعارض أو اختلاف في التفسير، تكون النسخة الإنجليزية هي المرجِّحة.

12. القبول
بالقبول إلكترونيًا، يؤكد الموزِّع أنه قرأ هذه الاتفاقية وفهمها ووافق عليها. ويُشكِّل القبول الإلكتروني، مع الاسم والطابع الزمني المسجَّلين، دليلًا على موافقة الموزِّع.`;
  }

  return { en: en, sec: sec, secName: secName, secText: secText };
}

const ContractModal = ({ contract, brandName, distCompany, distName, distCountry, viewerRole, onClose, onAccepted }) => {
  const t = useT();
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
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>📄 {t("conTitle")} · {contract.contract_number}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.textMuted, fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px 22px", overflowY:"auto" }}>
          {signed && (
            <div style={{ marginBottom:16, padding:"10px 14px", borderRadius:8, background:`${C.green}12`, border:`1px solid ${C.green}40`, color:C.green, fontSize:12.5 }}>
              ✓ {t("conAcceptedBy")} {contract.acceptance_name || "—"} · {new Date(contract.signed_at).toLocaleString("it-IT")}
            </div>
          )}
          <pre style={preStyle}>{doc.en}</pre>
          {doc.secText && (
            <div>
              <div style={{ margin:"22px 0 10px", borderTop:`1px dashed ${C.border}`, paddingTop:16, fontSize:11, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{doc.secName}</div>
              <pre style={preStyle} dir={doc.sec==="ar"?"rtl":"ltr"}>{doc.secText}</pre>
            </div>
          )}
        </div>
        {canSign && (
          <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.border}` }}>
            <label style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:12.5, color:C.textMuted, marginBottom:12, cursor:"pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:3 }}/>
              <span>{t("conConsent").replace("{company}", distCompany)}</span>
            </label>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <input value={signName} onChange={e=>setSignName(e.target.value)} placeholder={t("conSignph")}
                style={{ flex:1, minWidth:200, padding:"10px 12px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}`, color:C.text, fontSize:13 }}/>
              <button disabled={!agreed || !signName.trim() || saving} onClick={handleAccept}
                style={{ padding:"10px 22px", borderRadius:8, cursor:(!agreed||!signName.trim()||saving)?"not-allowed":"pointer", background:(!agreed||!signName.trim())?C.surface2:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:(!agreed||!signName.trim())?C.textDim:C.bg, fontSize:13, fontWeight:700 }}>
                {saving?"...":t("conAcceptSign")}
              </button>
            </div>
          </div>
        )}
        {viewerRole==="admin" && !signed && (
          <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, fontSize:12, color:C.textMuted }}>{t("conWaiting")}</div>
        )}
      </div>
    </div>
  );
};


function printInvoice(inv, L){
  const w = window.open("", "_blank", "width=820,height=900");
  if(!w) return;
  const fmt = (n)=>"\u20ac"+Number(n||0).toLocaleString("it-IT",{minimumFractionDigits:2});
  const html = "<html><head><title>"+(inv.invoice_number||L.inv)+"</title>"+
    "<style>body{font-family:Georgia,serif;color:#111;padding:40px;max-width:680px;margin:auto}h1{font-size:20px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:18px}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left;font-size:13px}.r{text-align:right}.tot td{font-weight:bold;font-size:16px}.muted{color:#666;font-size:12px}</style></head><body>"+
    "<h1>"+L.inv+" "+(inv.invoice_number||"")+"</h1>"+
    "<div class='muted'>"+(inv.type==="nexushub_commission"?L.comm:L.sale)+" \u00b7 "+new Date(inv.created_at).toLocaleDateString("it-IT")+"</div>"+
    "<table><tr><th>"+L.from+"</th><td>"+(inv.from_entity||"")+(inv.from_vat?(" \u00b7 "+L.vatno+" "+inv.from_vat):"")+"</td></tr>"+
    "<tr><th>"+L.to+"</th><td>"+(inv.to_entity||"")+(inv.to_vat?(" \u00b7 "+L.vatno+" "+inv.to_vat):"")+"</td></tr></table>"+
    "<table><tr><th>"+L.sub+"</th><td class='r'>"+fmt(inv.subtotal)+"</td></tr>"+
    "<tr><th>"+L.vat+" ("+Number(inv.vat_rate||0)+"%)</th><td class='r'>"+fmt(inv.vat_amount)+"</td></tr>"+
    "<tr class='tot'><td>"+L.total+"</td><td class='r'>"+fmt(inv.total)+"</td></tr></table>"+
    (inv.notes?("<p class='muted'>"+inv.notes+"</p>"):"")+
    "<p class='muted'>"+L.draft+"</p>"+
    "</body></html>";
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 300);
}

const InvoiceModal = ({ inv, onClose }) => {
  const t = useT();
  if (!inv) return null;
  const fmt = (n) => "\u20ac" + Number(n||0).toLocaleString("it-IT",{minimumFractionDigits:2});
  const isComm = inv.type === "nexushub_commission";
  const row = { display:"flex", justifyContent:"space-between", padding:"8px 0", borderTop:`1px solid ${C.border}`, fontSize:13, gap:12 };
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"min(560px,100%)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>🧾 {inv.invoice_number || t("invFallback")}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.textMuted, fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"inline-block", padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:600, marginBottom:16, background:isComm?`${C.gold}15`:`${C.green}15`, color:isComm?C.gold:C.green, border:`1px solid ${isComm?C.gold:C.green}30` }}>{isComm?t("invComm"):t("invSale")}</div>
          <div style={{ ...row, borderTop:"none" }}><span style={{ color:C.textMuted }}>{t("invFrom")}</span><span style={{ color:C.text, textAlign:"right" }}>{inv.from_entity}{inv.from_vat?` · ${t("invVatNo")} ${inv.from_vat}`:""}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>{t("invTo")}</span><span style={{ color:C.text, textAlign:"right" }}>{inv.to_entity}{inv.to_vat?` · ${t("invVatNo")} ${inv.to_vat}`:""}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>{t("invDate")}</span><span style={{ color:C.text }}>{new Date(inv.created_at).toLocaleDateString("it-IT")}</span></div>
          <div style={{ height:8 }}/>
          <div style={row}><span style={{ color:C.textMuted }}>{t("invSubtotal")}</span><span style={{ color:C.text }}>{fmt(inv.subtotal)}</span></div>
          <div style={row}><span style={{ color:C.textMuted }}>{t("invVat")} ({Number(inv.vat_rate||0)}%)</span><span style={{ color:C.text }}>{fmt(inv.vat_amount)}</span></div>
          <div style={{ ...row, fontWeight:800, fontSize:16 }}><span style={{ color:C.text }}>{t("invTotal")}</span><span style={{ color:C.goldLight }}>{fmt(inv.total)}</span></div>
          {inv.notes && <div style={{ marginTop:14, fontSize:11, color:C.textMuted, lineHeight:1.5 }}>{inv.notes}</div>}
          {inv.pdf_url && <a href={inv.pdf_url} target="_blank" rel="noreferrer" style={{ display:"inline-block", marginTop:14, fontSize:12, color:C.blue }}>📎 {t("invDownloadPdf")}</a>}
        </div>
        <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"flex-end" }}>
          <button onClick={()=>printInvoice(inv, { inv:t("invFallback"), comm:t("invComm"), sale:t("invSale"), from:t("invFrom"), to:t("invTo"), sub:t("invSubtotal"), vat:t("invVat"), total:t("invTotal"), vatno:t("invVatNo"), draft:t("invDraftNote") })} style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>🖨️ {t("invPrint")}</button>
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
  const [catSearch, setCatSearch] = useState("");
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
    if (!issueOrder || !issueForm.reason.trim()) { window.alert(t("diProblemAlert")); return; }
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
      window.alert(t("ddIssueSent"));
    } catch(e) { console.error(e); window.alert(t("ddIssueErr")); }
    setIssueBusy(false);
  };
  const [orderNote, setOrderNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("bonifico"); // bonifico, card
  const [currentUser, setCurrentUser] = useState(null);
  const [countryPrices, setCountryPrices] = useState({});
  const [resalePrices, setResalePrices] = useState({});
  const [distContracts, setDistContracts] = useState([]);
  const [distInvoices, setDistInvoices] = useState([]);
  const [invoiceView, setInvoiceView] = useState(null);
  const [viewContract, setViewContract] = useState(null);
  const approvedBrandIds = Object.keys(accessRequests).filter(id => accessRequests[id] === "approved");
  const visibleProducts = realProducts.filter(p => approvedBrandIds.includes(p.brand_id));
  const discPct = (brandId) => Number(brandDiscounts[brandId] || 0);
  const basePrice = (p) => { const cp = p && countryPrices[p.id]; return cp != null ? Number(cp) : Number((p && p.unit_price) || 0); };
  const isManaged = currentUser?.account_type === "chain" || currentUser?.account_type === "ecommerce";
  const resalePrice = (p) => { const rp = p && resalePrices[p.id]; return rp != null ? Number(rp) : null; };
  const effPrice = (p) => { if (isManaged) { const rp = resalePrice(p); return rp != null ? rp : 0; } const base = basePrice(p); const d = discPct(p && p.brand_id); return d > 0 ? Math.round(base * (1 - d/100) * 100) / 100 : base; };
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

  const BONIFICO_ONLY_THRESHOLD = 15000;
  const onlyBonifico = cartValue > BONIFICO_ONLY_THRESHOLD;
  const effPay = onlyBonifico ? "bonifico" : selectedPayment;
  const payWithStripe = async (method) => {
    if (cartCount === 0) return;
    setOrderLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const items = Object.entries(cart).filter(([,qty])=>qty>0).map(([pid,qty]) => {
        const product = realProducts.find(p=>p.id===pid);
        return { product_id:pid, quantity:qty, product_name:product?.name||"", sku:product?.sku||"", unit_price:effPrice(product) };
      });
      const total = items.reduce((s,i)=>s+(i.unit_price*i.quantity),0);
      const brandId = items[0] ? realProducts.find(p=>p.id===items[0].product_id)?.brand_id : null;
      const { data: order } = await supabase.from("orders").insert({
        distributor_id: user.id, brand_id: brandId, total_amount: total, status: "pending",
        payment_method: method === "bonifico" ? "bonifico" : "card", notes: orderNote,
        shipping_address: (currentUser && currentUser.shipping_address) || null,
        shipping_city: (currentUser && currentUser.shipping_city) || null,
        shipping_zip: (currentUser && currentUser.shipping_zip) || null,
        shipping_country: (currentUser && currentUser.country) || null,
      }).select().single();
      if (!order) throw new Error("order");
      await supabase.from("order_items").insert(items.map(i=>({ ...i, order_id: order.id })));
      const res = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/stripe-connect`, {
        method: "POST",
        headers: { "Content-Type":"application/json", "Authorization":`Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ action:"create_checkout", order_id: order.id, method: method === "bonifico" ? "bank_transfer" : "card" })
      });
      const data = await res.json();
      if (data.checkout_url) { window.location.href = data.checkout_url; return; }
      if (data.error && String(data.error).includes("configurato")) alert(t("ddStripeNotCfg"));
      else alert((t("ddStripeErr")+" ") + (data.error || t("ddRetry")));
    } catch(e) { alert((t("ddError")+" ") + e.message); }
    setOrderLoading(false);
  };

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
            const { data: rp } = await supabase.from("nexus_resale_prices").select("product_id, price, customer_id");
            const rDef = {}, rCust = {}; (rp||[]).forEach(r => { if (r.customer_id) rCust[r.product_id] = r.price; else rDef[r.product_id] = r.price; });
            setResalePrices({ ...rDef, ...rCust });
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
      const { data } = await supabase.from("invoices").select("*").in("order_id", ids).in("type",["brand_to_distributor","nexushub_to_customer"]).order("created_at",{ascending:false});
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
      title: t("ddNewAccessReq"),
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
  const tabs = [
    { key:"brands", icon:"◈", label:t("tabBrandMarket") },
    { key:"catalog", icon:"◻", label:t("tabMyCatalog") },
    { key:"wishlist", icon:"♥", label:t("ddWishlist") },
    { key:"orders", icon:"↗", label:t("tabMyOrders") },
    { key:"fatture", icon:"🧾", label:t("ddInvoices") },
    { key:"ai", icon:"🤖", label:t("ddAISuggest") },
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
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>{t("diNoBrands")}</div>
                <div style={{ fontSize:13, lineHeight:1.6, maxWidth:420, margin:"0 auto" }}>{t("diNoBrandsMsg")}</div>
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
                    <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.55 }}>{t("diReqAccess")}</p>
                    {status==="approved" ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}><button onClick={() => setTab("catalog")} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:13, fontWeight:600 }}>{t("viewCatalogBtn")}</button>{(() => { const ctr = distContracts.find(c => c.brand_id === brand.id); if (!ctr) return null; const sg = !!ctr.signed_at; return (<button onClick={() => setViewContract(ctr)} style={{ width:"100%", padding:"10px", borderRadius:8, cursor:"pointer", background: sg?`${C.green}12`:`${C.blue}12`, border:`1px solid ${sg?C.green:C.blue}40`, color: sg?C.green:C.blue, fontSize:12.5, fontWeight:600 }}>{sg ? t("ddViewAgreement") : t("ddSignAgreement")}</button>); })()}</div>
                    ) : status==="pending" ? (
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.blue}10`, border:`1px solid ${C.blue}30`, color:C.blue, fontSize:13 }}>{t("requestSentMsg")}</div>
                    ) : status==="blocked" ? (
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red, fontSize:13 }}>🚫 {t("ckBlocked")}</div>
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
              <Modal title={(t("ddDocs")+" · ") + (distDocsProduct.name || "Prodotto")} onClose={() => { setDistDocsProduct(null); setDistDocs([]); }} onSave={() => { setDistDocsProduct(null); setDistDocs([]); }} saveLabel={t("ddClose")}>
                {distDocs.length === 0 ? (
                  <div style={{ textAlign:"center", padding:20, color:C.textMuted, fontSize:13 }}>{t("diNoDocs")}</div>
                ) : distDocs.map(d => (
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, marginBottom:8 }}>
                    <span style={{ fontSize:18 }}>📄</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>{new Date(d.created_at).toLocaleDateString("it-IT")}</div>
                    </div>
                    <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"5px 12px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>{t("diDownload")}</a>
                  </div>
                ))}
              </Modal>
            )}
            {visibleProducts.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <input type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder={t("diSearchPh")} style={{ width:"100%", maxWidth:360, padding:"10px 14px", borderRadius:10, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none" }}/>
              </div>
            )}
            {/* Products grouped by brand */}
            {visibleProducts.length === 0 ? (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:C.textMuted }}>
                  Non hai ancora accesso a nessun brand. Vai su "Marketplace Brand" e richiedi l'accesso per vedere i prodotti.
                </div>
              ) : approvedBrandIds.map(bid => {
              const bprods = visibleProducts.filter(p => p.brand_id === bid && (!catSearch || (p.name||"").toLowerCase().includes(catSearch.toLowerCase()) || (p.sku||"").toLowerCase().includes(catSearch.toLowerCase())));
              if (bprods.length === 0) return null;
              const bInfo = dbBrands.find(b => b.id === bid);
              const bLabel = (bInfo && (bInfo.company_name || bInfo.email)) || "Brand";
              return (
              <div key={bid} style={{ marginBottom:28 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:16, fontWeight:700, color:C.gold, fontFamily:"Georgia,serif" }}>{bLabel}</span>
                  <span style={{ fontSize:11, color:C.textMuted, background:C.surface2, padding:"2px 8px", borderRadius:20 }}>{bprods.length} {t("diProducts")}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px,100%), 1fr))", gap:14 }}>
                  {bprods.map(p => {
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
                      <div style={{ textAlign:"right" }}>{(() => { if (isManaged) { const rp = resalePrice(p); return rp != null ? (<div style={{ fontSize:16, fontWeight:800, color:C.goldLight }}>€{rp.toFixed(2)}</div>) : (<div style={{ fontSize:12, color:C.textDim }}>{t("diNoPrice")}</div>); } const lp = basePrice(p); const ep = effPrice(p); const d = discPct(p.brand_id); const hasC = countryPrices[p.id] != null && Number(countryPrices[p.id]) !== Number(p.unit_price||0); return (<div>{d > 0 && <div style={{ fontSize:11, color:C.textMuted, textDecoration:"line-through" }}>€{lp.toFixed(2)}</div>}<div style={{ fontSize:16, fontWeight:800, color:d>0?C.green:C.goldLight }}>€{ep.toFixed(2)}</div>{d > 0 && <div style={{ fontSize:10, color:C.green, fontWeight:700 }}>-{d}%</div>}{hasC && <div style={{ fontSize:9, color:C.blue, fontWeight:700 }}>listino {(currentUser?.country||"").toUpperCase()}</div>}</div>); })()}</div>
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
                    <button onClick={() => toggleWishlist(p.id)} style={{ width:"100%", marginBottom:8, padding:"7px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background: wishlist.includes(p.id)?`${C.red}15`:"transparent", border:`1px solid ${wishlist.includes(p.id)?C.red:C.border}`, color: wishlist.includes(p.id)?C.red:C.textMuted }}>{wishlist.includes(p.id) ? t("ddInWishlist") : t("ddAddWishlist")}</button><button onClick={() => openDistDocs(p)} style={{ width:"100%", marginBottom:12, padding:"7px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.gold}10`, border:`1px solid ${C.gold}35`, color:C.goldLight }}>📎 {t("ckDocsTab")}</button>
                    {(isManaged && resalePrice(p) == null) ? (
                      <div style={{ padding:"8px", borderRadius:7, textAlign:"center", background:`${C.blue}08`, border:`1px solid ${C.blue}25`, color:C.textMuted, fontSize:12 }}>{t("diNoPrice")}</div>
                    ) : stock > 0 ? (
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
                      <div style={{ padding:"8px", borderRadius:7, textAlign:"center", background:`${C.red}08`, border:`1px solid ${C.red}20`, color:C.red, fontSize:12 }}>{t("diOutStock")}</div>
                    )}
                  </div>
                );
                  })}
                </div>
              </div>
              );
            })}
          </div>
        )}
        {invoiceView && <InvoiceModal inv={invoiceView} onClose={()=>setInvoiceView(null)}/>}
        {tab==="fatture" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 {t("ckInvoicesTab")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("diInvoicesSub")}</p>
            {distInvoices.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>{t("diNoInvoices")}</div>
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
                        <td style={{ padding:"11px 14px" }}><button onClick={()=>setInvoiceView(inv)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>{t("diView")}</button></td>
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("diWishTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("diWishSub")}</p>
            {(() => {
              const wp = visibleProducts.filter(p => wishlist.includes(p.id));
              if (wp.length === 0) return (
                <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>♡</div>
                  <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:8 }}>{t("diNoWish")}</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>{t("diNoWishMsg")}</div>
                  <button onClick={() => setTab("catalog")} style={{ padding:"10px 24px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>{t("diGoCatalog")}</button>
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
                          <button disabled={stock<=0} onClick={() => { const moq=p.min_order_qty||1, mult=p.order_multiple||1; setCart(c => ({ ...c, [p.id]: Math.min(stock, Math.max(moq,mult)) })); setTab("catalog"); window.scrollTo(0,0); }} style={{ flex:1, padding:"8px 10px", borderRadius:7, cursor: stock>0?"pointer":"not-allowed", background: stock>0?`${C.gold}20`:C.surface2, border:`1px solid ${stock>0?C.gold:C.border}`, color: stock>0?C.goldLight:C.textMuted, fontSize:12, fontWeight:600 }}>{t("diAddCart")}</button>
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
              <Stat icon="◻" label={t("ckTotalOrders")} value={realOrders.length} sub={t("ckAllTime")}/>
              <Stat icon="↗" label={t("ckTotalSpent")} value={`€${realOrders.reduce((s,o)=>s+(o.total_amount||0),0).toLocaleString("it-IT")}`} sub={t("ckAllOrders")}/>
              <Stat icon="⚡" label={t("ckPending")} value={realOrders.filter(o=>o.status==="pending").length} accent={C.gold}/>
              <Stat icon="📦" label={t("ckDelivered")} value={realOrders.filter(o=>o.status==="delivered").length} accent={C.green}/>
            </div>
            {realOrders.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:8 }}>{t("diNoOrders")}</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:20 }}>{t("diNoOrdersMsg")}</div>
                <button onClick={() => setTab("catalog")} style={{ padding:"10px 24px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>{t("diBrowse")}</button>
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
                      {o.status === "shipped" && <span style={{ fontSize:12, color:C.blue }}>🚚 {t("ckStShipped")}</span>}
                      {o.status === "delivered" && <span style={{ fontSize:12, color:C.green }}>✓ {t("ckStDelivered")}</span>}
                      {o.status === "pending" && <span style={{ fontSize:12, color:C.gold }}>⏳ {t("ckStWaiting")}</span>}
                      {o.status === "confirmed" && <span style={{ fontSize:12, color:C.blue }}>📦 {t("ckStConfirmed")}</span>}
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
                        if (Object.keys(next).length === 0) { window.alert(t("ddNoProdAvail")); return; }
                        setCart(next);
                        setTab("catalog");
                        window.scrollTo(0,0);
                        if (skipped > 0) window.alert(skipped + " prodotto/i non piu disponibili sono stati saltati. Gli altri sono nel carrello.");
                      }} style={{ marginLeft:"auto", fontSize:11, color:C.goldLight, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>🔁 {t("diReorder")}</button>
                      <button onClick={() => openIssue(o)} style={{ fontSize:11, color:C.red, background:"transparent", border:`1px solid ${C.red}40`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>🚩 {t("diReport")}</button>
                    </div>
                    {o.tracking_number && (
                      <div style={{ marginTop:8, fontSize:12, color:C.blue }}>
                        🚚 {o.courier||"Corriere"} · Tracking: <span style={{ fontFamily:"monospace" }}>{o.tracking_number}</span>
                        {o.tracking_url && <> · <a href={o.tracking_url} target="_blank" rel="noreferrer" style={{ color:C.blue, textDecoration:"underline" }}>{t("diTrack")}</a></>}
                      </div>
                    )}
                    {(o.status === "delivered" || o.rating) && (
                      <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, color:C.textMuted, marginRight:4 }}>{o.rating ? t("diRatingDone") : t("diRateOrder")}</span>
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
      <Modal title={(t("ddReportIssue")+" - ") + (issueOrder.order_number || "")} onClose={() => setIssueOrder(null)} onSave={submitIssue} saveLabel={issueBusy ? t("ddSending") : t("ddSendIssue")}>
        <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>{t("diProblemDesc")}</p>
        <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("diReason")}</label>
        <textarea value={issueForm.reason} onChange={e => setIssueForm(f => ({...f, reason:e.target.value}))} rows={4} placeholder={t("ckDisputePh")} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", marginBottom:14 }}/>
        <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"16px 12px", borderRadius:10, cursor:"pointer", background: issueForm.photo_file ? `${C.green}10` : C.surface2, border:`1px dashed ${issueForm.photo_file ? C.green : C.border}`, textAlign:"center" }}>
          <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files&&e.target.files[0]; if(f) setIssueForm(p=>({...p, photo_file:f})); }}/>
          <span style={{ fontSize:22 }}>{issueForm.photo_file ? "✓" : "📷"}</span>
          <span style={{ fontSize:11, color: issueForm.photo_file ? C.green : C.textMuted }}>{issueForm.photo_file ? issueForm.photo_file.name : t("ddAttachPhoto")}</span>
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
              <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>{t("noNotif")}
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
            <h3 style={{ color:C.text, fontFamily:"Georgia,serif", fontSize:18, margin:0 }}>🛒 {t("ckConfirmOrder")}</h3>
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
                    <div style={{ fontSize:11, color:C.textMuted }}>{p.sku} · {qty} {t("ckUnits")}</div>
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
            <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{t("ckTotal")}</span>
            <span style={{ fontSize:20, fontWeight:900, color:C.goldLight }}>€{cartValue.toLocaleString("it-IT", {minimumFractionDigits:2})}</span>
          </div>

          {/* Payment method selection */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>{t("ckChoosePayment")}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>

              {/* Bonifico via Stripe */}
              <div onClick={() => setSelectedPayment("bonifico")}
                style={{ padding:"14px 16px", background: (selectedPayment==="bonifico"||onlyBonifico) ? `${C.gold}12` : C.surface2,
                  border:`2px solid ${(selectedPayment==="bonifico"||onlyBonifico) ? C.gold : C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: (selectedPayment==="bonifico"||onlyBonifico) ? 10 : 0 }}>
                  <span style={{ fontSize:22 }}>🏦</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{t("ckBonificoName")}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{t("ckBonificoDesc")}</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${(selectedPayment==="bonifico"||onlyBonifico)?C.gold:C.border}`,
                    background: (selectedPayment==="bonifico"||onlyBonifico) ? C.gold : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {(selectedPayment==="bonifico"||onlyBonifico) && <div style={{ width:8, height:8, borderRadius:"50%", background:C.bg }}/>}
                  </div>
                </div>
                {(selectedPayment==="bonifico"||onlyBonifico) && (
                  <div style={{ padding:"10px 12px", background:`${C.gold}10`, border:`1px solid ${C.gold}25`, borderRadius:8, fontSize:11, color:C.gold, lineHeight:1.5 }}>
                    {onlyBonifico ? t("ckOnlyBonifico") : t("ckBonificoInfo")}
                  </div>
                )}
              </div>

              {/* Carta via Stripe (nascosta sopra la soglia) */}
              {!onlyBonifico && (
              <div onClick={() => setSelectedPayment("card")}
                style={{ padding:"14px 16px", background: selectedPayment==="card" ? `#635bff15` : C.surface2,
                  border:`2px solid ${selectedPayment==="card" ? "#635bff" : C.border}`,
                  borderRadius:10, cursor:"pointer", transition:"all .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>💳</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{t("ckCardName")}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{t("ckInstant")}</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selectedPayment==="card"?"#635bff":C.border}`,
                    background: selectedPayment==="card" ? "#635bff" : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {selectedPayment==="card" && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                  </div>
                </div>
              </div>
              )}

            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 }}>{t("ckNoteOpt")}</label>
            <textarea value={orderNote} onChange={e=>setOrderNote(e.target.value)}
              placeholder={t("ckNotePh")}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2,
                border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none",
                boxSizing:"border-box", minHeight:70, resize:"vertical" }}/>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {/* Pagamento via Stripe (carta o bonifico) */}
            <button onClick={() => payWithStripe(effPay)} disabled={orderLoading}
              style={{ width:"100%", padding:"14px", borderRadius:10, cursor:"pointer",
                background: effPay==="card" ? "linear-gradient(135deg,#635bff,#4b44cc)" : `linear-gradient(135deg,${C.gold},${C.goldDim})`,
                border:"none", color: effPay==="card" ? "#fff" : C.bg, fontSize:14, fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              {orderLoading ? t("ddSending") : effPay==="card" ? ("💳 " + t("ddPayCard")) : ("🏦 " + t("ddPayBonifico"))}
            </button>
            <button onClick={() => setShowCheckout(false)} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>
              {t("ddCancel")}
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
          <h3 style={{ color:C.green, fontFamily:"Georgia,serif", fontSize:22, marginBottom:8 }}>{t("ckOrderSent")}</h3>
          <div style={{ fontFamily:"monospace", fontSize:16, color:C.goldLight, fontWeight:700, marginBottom:12 }}>{orderSuccess.order_number}</div>
          <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6, marginBottom:24 }}>
            {t("ckOrderSentPre")}<strong style={{ color:C.green }}>{t("ckOrderSentStrong")}</strong>{t("ckOrderSentPost")}
            <br/><br/><strong style={{ color:C.text }}>📦 {t("ckDeliveryEst")}</strong>
          </p>
          <button onClick={() => { setOrderSuccess(null); setTab("orders"); }}
            style={{ padding:"12px 28px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700 }}>
            {t("ddSeeOrders")}
          </button>
        </div>
      </div>
    )}
    </div>
  );
};



const Modal = ({ title, onClose, onSave, children, saveLabel="Save" }) => {
  const t = useT();
  return (
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
        <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:"1px solid #252838", color:"#8890aa", fontSize:13 }}>{t("ddCancel")}</button>
        <button onClick={onSave} style={{ flex:2, padding:"11px", borderRadius:10, cursor:"pointer", background:"linear-gradient(135deg,#c9a84c,#7a5e28)", border:"none", color:"#08080f", fontSize:13, fontWeight:700 }}>{saveLabel}</button>
      </div>
    </div>
  </div>
  );
};


const AdminDashboard = ({ onLogout, lang, onLangChange }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [kaSel, setKaSel] = useState(null);
  const [kaAccess, setKaAccess] = useState([]);
  const [kaPriceBrand, setKaPriceBrand] = useState(null);
  const [kaProducts, setKaProducts] = useState([]);
  const [kaPriceInput, setKaPriceInput] = useState({});
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
        .select("*, profile_billing(iban, bank_name, account_holder, swift_bic, sdi_code, pec_email)").neq("role","admin").order("created_at", { ascending: false });
      const flat = (data || []).map(u => { const pb = Array.isArray(u.profile_billing) ? (u.profile_billing[0] || {}) : (u.profile_billing || {}); return { ...u, iban: pb.iban ?? null, bank_name: pb.bank_name ?? null, account_holder: pb.account_holder ?? null, swift_bic: pb.swift_bic ?? null, sdi_code: pb.sdi_code ?? null, pec_email: pb.pec_email ?? null }; });
      setUsers(flat);
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
    if (!f.retailer_name || !f.retailer_name.trim()) { notify(t("auiEnterRetailer"), "error"); return; }
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
    notify(t("auiTargetSaved"));
    setRetailModal(null);
    loadRetail();
  };
  const setRetailStage = async (t, stage) => {
    await supabase.from("retail_targets").update({ stage, updated_at:new Date().toISOString() }).eq("id", t.id);
    setRetailTargets(prev => prev.map(x => x.id===t.id ? { ...x, stage } : x));
  };
  const deleteRetail = async (row) => {
    if (!window.confirm((t("auiDelTarget")+" ") + row.retailer_name + "?")) return;
    await supabase.from("retail_targets").delete().eq("id", row.id);
    setRetailTargets(prev => prev.filter(x => x.id !== row.id));
  };
  const convertRetail = async (row) => {
    if (!row.buyer_email) { notify(t("aretNoEmail"), "error"); return; }
    notify(t("aretConverting"));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/convert-retail-to-keyaccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session ? session.access_token : ""}` },
        body: JSON.stringify({ retail_target_id: row.id, account_type: "chain" })
      });
      const data = await res.json();
      if (data && data.success) { notify(t("aretConvertOk")); loadRetail(); loadUsers(); }
      else notify(t("aretConvertErr") + (data && data.error ? ": " + data.error : ""), "error");
    } catch (e) { notify(t("aretConvertErr"), "error"); }
  };
  const loadCompliance = async () => {
    const { data } = await supabase.from("compliance_documents").select("*").order("created_at", { ascending:false });
    setComplianceDocs(data || []);
  };
  const uploadCompliance = async () => {
    const f = compForm;
    if (!f.owner_id) { notify(t("auiChooseDocOwner"), "error"); return; }
    if (!f.file) { notify(t("auiChooseFile"), "error"); return; }
    setCompBusy(true);
    try {
      const path = "compliance/" + f.owner_id + "/" + Date.now() + "_" + f.file.name;
      const up = await supabase.storage.from("documents").upload(path, f.file, { upsert:true });
      if (!up || up.error) { notify(t("auiUploadErr"), "error"); setCompBusy(false); return; }
      const url = supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compliance_documents").insert({
        owner_id: f.owner_id, category: f.category||"other", name: (f.name||f.file.name),
        file_url: url, file_type: f.file.type||null, expires_at: f.expires_at||null,
        notes: f.notes||null, uploaded_by: user?.id||null
      });
      notify(t("auiDocUploaded"));
      setCompModal(false); setCompForm({}); loadCompliance();
    } catch(e) { console.error(e); notify(t("auiErr"), "error"); }
    setCompBusy(false);
  };
  const deleteCompliance = async (d) => {
    if (!window.confirm((t("auiDelDoc")+" ") + d.name + "?")) return;
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
    notify(t("auiOpCostSaved"));
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
    if (!f.product_name || !f.product_name.trim()) { notify(t("auiEnterProdName"), "error"); return; }
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
    notify(t("auiListingSaved"));
    setAmazonModal(false); loadAmazon();
  };
  const deleteAmazon = async (t) => {
    if (!window.confirm((t("auiDelete")+" ") + t.product_name + "?")) return;
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
      if (rows.length === 0) { window.alert(t("auiNoOrdersExport")); return; }
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
      window.alert((t("auiExported")+" ") + rows.length + " ordini. Ora importa il file in ShippyPro con \"Importa Excel/CSV/TXT\".");
    } catch(e) { console.error(e); window.alert(t("auiExportErr")); }
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
    if (!f.brand_id || !f.distributor_id) { notify(t("auiChooseBrandDist"), "error"); return; }
    const num = "CT-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2,7).toUpperCase();
    const { error } = await supabase.from("contracts").insert({
      contract_number: num, brand_id: f.brand_id, distributor_id: f.distributor_id,
      territory: f.territory||null, commission_rate: Number(f.commission_rate)||0,
      moq_per_order: Number(f.moq_per_order)||0, payment_terms: Number(f.payment_terms)||30,
      exclusivity: !!f.exclusivity, status: "draft",
      valid_from: f.valid_from||null, valid_until: f.valid_until||null
    });
    if (error) { notify((t("auiError")+" ") + error.message, "error"); return; }
    notify(t("auiContractDraft"));
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
    } catch(e) { notify(t("auiInvoiceGenErr"), "error"); }
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
      notify(t("auiInvoiceSent"));
    } catch(e) { notify(t("auiEmailErr"), "error"); }
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
    notify(t("auiProfileUpdated"));
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
        const { data: pros } = await supabase.from("profiles").select("id, company_name, profile_billing(iban)").in("id", pids);
        (pros||[]).forEach(p => { proMap[p.id] = p; });
      }
      setPaySplits(sp.map(s => {
        const o = ordMap[s.order_id] || {};
        const b = proMap[o.brand_id] || {};
        const d = proMap[o.distributor_id] || {};
        return { ...s, order_number: o.order_number, brand_name: b.company_name, brand_iban: (Array.isArray(b.profile_billing) ? (b.profile_billing[0] && b.profile_billing[0].iban) : (b.profile_billing && b.profile_billing.iban)) || null, distributor_name: d.company_name };
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
      title: t("auiCommissionUpdated"),
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
    if (error) { notify((t("auiRecalcErr")+" ") + error.message); }
    else { notify(t("auiRecalcDone")); await loadCommissions(); await loadCommissionLog(); }
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
    notify(t("auiUserApproved"));
    // Send approval email
    const user = users.find(u => u.id === id);
    if (user) await sendEmail("approved", user.email, user.company_name || user.email, user.role);
    loadUsers();
  };

  const rejectUser = async (id, reason="Application declined") => {
    await supabase.from("profiles").update({ status:"rejected", rejection_reason: reason }).eq("id", id);
    notify(t("auiUserRejected"), "error");
    // Send rejection email
    const user = users.find(u => u.id === id);
    if (user) await sendEmail("rejected", user.email, user.company_name || user.email, user.role, reason);
    loadUsers();
  };

  // Key Account (chains / e-commerce): admin authorizes brand access directly (no exclusivity / one-per-country check)
  const loadKaAccess = async (customerId) => {
    const { data } = await supabase.from("brand_access_requests").select("brand_id, status").eq("distributor_id", customerId);
    setKaAccess(data || []);
  };
  const selectKa = async (u) => {
    setKaPriceBrand(null); setKaProducts([]); setKaPriceInput({});
    if (kaSel === u.id) { setKaSel(null); setKaAccess([]); return; }
    setKaSel(u.id); await loadKaAccess(u.id);
  };
  const grantBrand = async (customerId, brandId) => {
    await supabase.from("brand_access_requests").upsert({ distributor_id: customerId, brand_id: brandId, status: "approved", updated_at: new Date().toISOString() }, { onConflict: "distributor_id,brand_id" });
    notify(t("kaAccessGranted"));
    loadKaAccess(customerId);
  };
  const revokeBrand = async (customerId, brandId) => {
    await supabase.from("brand_access_requests").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("distributor_id", customerId).eq("brand_id", brandId);
    notify(t("kaAccessRevoked"), "error");
    loadKaAccess(customerId);
  };

  const openBrandPrices = async (customerId, brandId) => {
    if (kaPriceBrand === brandId) { setKaPriceBrand(null); setKaProducts([]); setKaPriceInput({}); return; }
    setKaPriceBrand(brandId);
    const { data: prods } = await supabase.from("products").select("id,name,sku,unit_price").eq("brand_id",brandId).eq("is_active",true).order("name");
    setKaProducts(prods || []);
    const { data: rp } = await supabase.from("nexus_resale_prices").select("product_id,price,customer_id").eq("brand_id",brandId);
    const inputs = {}; (rp || []).forEach(r => { if (r.customer_id === customerId) inputs[r.product_id] = String(r.price); });
    setKaPriceInput(inputs);
  };
  const saveResalePrice = async (customerId, brandId, productId, priceStr) => {
    const price = parseFloat(String(priceStr == null ? "" : priceStr).replace(",", "."));
    const { data: existing } = await supabase.from("nexus_resale_prices").select("id").eq("product_id", productId).eq("customer_id", customerId).maybeSingle();
    if (!priceStr || isNaN(price)) {
      if (existing) await supabase.from("nexus_resale_prices").delete().eq("id", existing.id);
      notify(t("kaPriceCleared"), "error");
    } else if (existing) {
      await supabase.from("nexus_resale_prices").update({ price, is_active: true, updated_at: new Date().toISOString() }).eq("id", existing.id);
      notify(t("kaPriceSaved"));
    } else {
      await supabase.from("nexus_resale_prices").insert({ product_id: productId, brand_id: brandId, customer_id: customerId, price, currency: "EUR", is_active: true });
      notify(t("kaPriceSaved"));
    }
  };

  const checkVies = async (u) => {
    notify(t("kaViesChecking"));
    try {
      const res = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/vies-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ profile_id: u.id })
      });
      const data = await res.json();
      if (data && data.valid) notify(t("kaViesValid") + (data.name ? " \u2014 " + data.name : ""));
      else notify(t("kaViesInvalid") + (data && data.error ? " (" + data.error + ")" : ""), "error");
      loadUsers();
    } catch (e) { notify(t("kaViesError"), "error"); }
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
    notify(t("auiBrandAdded"));
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
      notify(t("auiProductUpdated"));
    } else {
      await supabase.from("products").insert(payload);
      notify(t("auiProductAdded"));
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
      if (lines.length < 2) { notify(t("auiFileEmpty"), "error"); setImportLoading(false); return; }
      
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
      notify((t("auiImported")+" ") + success + " prodotti" + (errors > 0 ? ", " + errors + " errori" : ""));
      loadProducts();
    } catch(e) {
      notify(t("auiImportErr"), "error");
    }
    setImportLoading(false);
  };

  // Update inventory
  const updateStock = async (productId, qty) => {
    await supabase.from("inventory")
      .update({ quantity_available: parseInt(qty), last_restock_at: new Date().toISOString(), last_restock_qty: parseInt(qty) })
      .eq("product_id", productId);
    notify(t("auiStockUpdated"));
    loadProducts();
  };

  // Update order status
  const [trackEdits, setTrackEdits] = useState({});
  const saveTracking = async (o) => {
    const e = trackEdits[o.id] || {};
    const courier = (e.courier || "").trim();
    const tracking = (e.tracking_number || "").trim();
    if (!tracking) { notify(t("auiEnterTracking"), "error"); return; }
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
    notify(t("auiTrackingSaved"));
    setTrackEdits(prev => { const n = { ...prev }; delete n[o.id]; return n; });
    loadOrders();
  };
  const adjustTrust = async (u, sign) => {
    const amtStr = window.prompt((sign>0?(t("auiPtsAdd")+" "):(t("auiPtsRemove")+" "))+(u.company_name||u.email)+"?", "10");
    if (amtStr===null) return;
    const amt = Math.abs(parseInt(amtStr,10)); if (!amt) return;
    const reason = window.prompt("Motivo?", sign>0?t("auiBonusManual"):t("auiPenaltyManual"));
    if (reason===null) return;
    await supabase.rpc("admin_adjust_trust", { p_profile: u.id, p_delta: sign*amt, p_reason: reason });
    notify(t("auiPointsUpdated"));
    loadUsers();
  };
  const toggleSuspend = async (u) => {
    if (u.account_state==="suspended") {
      if (!window.confirm((t("auiReactivate")+" ")+(u.company_name||u.email)+"?")) return;
      await supabase.rpc("admin_set_account_state", { p_profile:u.id, p_state:"active", p_reason:"Riattivato da admin" });
    } else {
      const reason = window.prompt("Motivo sospensione (violazione grave):", "");
      if (reason===null) return;
      await supabase.rpc("admin_set_account_state", { p_profile:u.id, p_state:"suspended", p_reason: reason||"Sospeso da admin" });
    }
    notify(t("auiAccountUpdated"));
    loadUsers();
  };
  const updateOrderStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    notify((t("auiOrder")+" ") + status + "!");
    
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
  const managedUsers = users.filter(u => u.account_type === "chain" || u.account_type === "ecommerce");

  const tabs = [
    { key:"overview", icon:"◈", label:t("atabOverview") },
    { key:"users", icon:"👥", label:t("atabUsers"), badge: pendingUsers.length },
    { key:"keyaccount", icon:"🔑", label:t("atabKeyAccount"), badge: managedUsers.filter(u=>u.status==="pending").length },
    { key:"brands", icon:"🏛️", label:t("atabBrands") },
    { key:"catalog", icon:"📦", label:t("atabCatalog") },
    { key:"inventory", icon:"🏭", label:t("atabInventory") },
    { key:"logistics", icon:"🚛", label:t("atabLogistics") },
    { key:"retail", icon:"🏬", label:t("atabRetail") },
    { key:"compliance", icon:"🗂️", label:t("atabCompliance") },
    { key:"margini", icon:"📈", label:t("atabMargins") },
    { key:"nexusai", icon:"🤖", label:t("atabNexusAI") },
    { key:"amazon", icon:"🛒", label:t("atabAmazon") },
    { key:"orders", icon:"📋", label:t("atabOrders") },
    { key:"invoices", icon:"🧾", label:t("atabInvoices") },
    { key:"contracts", icon:"📝", label:t("atabContracts") },
    { key:"commissions", icon:"📊", label:t("atabCommissions") },
    { key:"incassi", icon:"💸", label:t("atabIncassi") },
    { key:"finanze", icon:"💶", label:t("atabFinance") },
    { key:"audit", icon:"📋", label:t("atabAudit") },
    { key:"issues", icon:"🚩", label:t("atabIssues") },
    { key:"payments", icon:"💰", label:t("atabPayments") },
    { key:"settings", icon:"⚙️", label:t("atabSettings") },
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
            ← {t("auiBackAdmin")}
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
              {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize:11, color:C.textMuted, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>{t("auiMarkAllRead")}</button>}
              <button onClick={() => setShowNotifPanel(false)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20 }}>×</button>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {pushNotifs.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:C.textMuted }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🔔</div>
                {t("noNotif")}
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("aoTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("aoSub")}</p>
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[
                { label:t("aoActiveBrands"), value:brands.length, color:C.gold },
                { label:t("aoTotalUsers"), value:users.length, color:C.blue },
                { label:t("aoPendingApproval"), value:pendingUsers.length, color:C.red },
                { label:t("aoTotalProducts"), value:products.length, color:C.green },
                { label:t("aoTotalOrders"), value:orders.length, color:C.purple },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 140px", padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:12 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:14 }}>🗺️ {t("aoEuroNetwork")}</h3>
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
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("auTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("auSub")}</p>
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

            {loading ? <div style={{ color:C.textMuted, padding:40, textAlign:"center" }}>{t("auLoading")}</div> : (
              <>
                {pendingUsers.length > 0 && (
                  <div style={{ marginBottom:28 }}>
                    <h3 style={{ fontSize:14, color:C.gold, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>⏳ {t("aoPendingApproval")}</h3>
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
                          <button onClick={() => approveUser(u.id)} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>✓ {t("auApprove")}</button>
                          <button onClick={() => rejectUser(u.id)} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>✗ {t("auReject")}</button>
                          <a href={`mailto:${u.email}`} style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", fontSize:13, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, textDecoration:"none", display:"inline-flex", alignItems:"center" }}>✉ {t("auContact")}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize:14, color:C.textMuted, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>{t("auAllUsers")} ({users.length})</h3>
                <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {[t("auhCompany"),t("auhEmail"),t("auhRole"),t("auhCountry"),t("auhStatus"),t("auhTrust"),t("auhJoined"),t("auhActions")].map((h,i) => (
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
                                <button onClick={()=>adjustTrust(u,1)} title={t("auAddPoints")} style={{ padding:"2px 7px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>+</button>
                                <button onClick={()=>adjustTrust(u,-1)} title={t("auRemovePoints")} style={{ padding:"2px 7px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>−</button>
                                <button onClick={()=>toggleSuspend(u)} style={{ padding:"2px 8px", borderRadius:5, cursor:"pointer", fontSize:10, fontWeight:600, background: u.account_state==="suspended"?`${C.green}15`:`${C.gold}12`, border:`1px solid ${u.account_state==="suspended"?C.green:C.gold}40`, color: u.account_state==="suspended"?C.green:C.gold }}>{u.account_state==="suspended"?t("auReactivate"):t("auSuspend")}</button>
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
                              <button onClick={() => setImpersonating(u)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, color:"#a855f7", whiteSpace:"nowrap" }} title={t("auImpersonate")}>👁️</button>
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
        {tab === "keyaccount" && (
          <div>
            <div style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:C.text, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("kaTitle")}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("kaSubtitle")}</p>
            </div>
            {managedUsers.length === 0 ? (
              <div style={{ padding:"40px 20px", textAlign:"center", color:C.textDim, fontSize:14, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>{t("kaEmpty")}</div>
            ) : managedUsers.map(u => {
              const accMap = {}; if (kaSel === u.id) kaAccess.forEach(a => { accMap[a.brand_id] = a.status; });
              return (
                <div key={u.id} style={{ background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      <span style={{ fontSize:15, fontWeight:600, color:C.text }}>{u.company_name || u.email}</span>
                      <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", padding:"3px 8px", borderRadius:6, background:`${C.blue}20`, color:C.blue }}>{u.account_type === "chain" ? t("rgAccChain") : t("rgAccEcom")}</span>
                      {u.country && <span style={{ fontSize:12, color:C.textMuted }}>{u.country}</span>}
                      <span style={{ fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:6, background: u.status==="approved" ? `${C.green}20` : u.status==="pending" ? `${C.gold}20` : `${C.red}20`, color: u.status==="approved" ? C.green : u.status==="pending" ? C.gold : C.red }}>{u.status}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6, background: u.vies_valid===true ? `${C.green}20` : u.vies_valid===false ? `${C.red}20` : `${C.textDim}20`, color: u.vies_valid===true ? C.green : u.vies_valid===false ? C.red : C.textDim }}>{u.vies_valid===true ? "VIES \u2713" : u.vies_valid===false ? "VIES \u2717" : "VIES \u2014"}</span>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      {u.status === "pending" && <button onClick={()=>approveUser(u.id)} style={{ padding:"7px 14px", borderRadius:7, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:"#08080f", fontSize:12, fontWeight:700 }}>{t("kaApprove")}</button>}
                      <button onClick={()=>checkVies(u)} style={{ padding:"7px 14px", borderRadius:7, cursor:"pointer", background:"transparent", border:`1px solid ${C.green}`, color:C.green, fontSize:12, fontWeight:600 }}>{t("kaViesCheck")}</button>
                      <button onClick={()=>selectKa(u)} style={{ padding:"7px 14px", borderRadius:7, cursor:"pointer", background:"transparent", border:`1px solid ${C.blue}`, color:C.blue, fontSize:12, fontWeight:600 }}>{kaSel===u.id ? t("kaHideBrands") : t("kaManageBrands")}</button>
                    </div>
                  </div>
                  {kaSel === u.id && (
                    <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t("kaAuthorizeBrands")}</div>
                      {brands.length === 0 ? (
                        <div style={{ color:C.textDim, fontSize:13 }}>{t("kaNoBrands")}</div>
                      ) : brands.map(b => {
                        const authorized = accMap[b.id] === "approved";
                        return (
                          <div key={b.id} style={{ background:C.surface2, borderRadius:8, marginBottom:6, overflow:"hidden" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px" }}>
                              <span style={{ fontSize:13, color:C.text }}>{b.company_name || b.email}</span>
                              <div style={{ display:"flex", gap:6 }}>
                                {authorized ? (
                                  <>
                                    <button onClick={()=>openBrandPrices(u.id,b.id)} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:`${C.blue}18`, border:`1px solid ${C.blue}55`, color:C.blue, fontSize:11, fontWeight:600 }}>{kaPriceBrand===b.id ? t("kaHidePrices") : t("kaPrices")}</button>
                                    <button onClick={()=>revokeBrand(u.id,b.id)} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:`${C.red}18`, border:`1px solid ${C.red}55`, color:C.red, fontSize:11, fontWeight:600 }}>{t("kaRevoke")}</button>
                                  </>
                                ) : (
                                  <button onClick={()=>grantBrand(u.id,b.id)} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:`${C.green}18`, border:`1px solid ${C.green}55`, color:C.green, fontSize:11, fontWeight:600 }}>{t("kaAuthorize")}</button>
                                )}
                              </div>
                            </div>
                            {authorized && kaPriceBrand === b.id && (
                              <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.border}` }}>
                                <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>{t("kaResaleHint")}</div>
                                {kaProducts.length === 0 ? (
                                  <div style={{ color:C.textDim, fontSize:12 }}>{t("kaNoProducts")}</div>
                                ) : kaProducts.map(p => (
                                  <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, padding:"6px 0", flexWrap:"wrap" }}>
                                    <div style={{ minWidth:140, flex:1 }}>
                                      <div style={{ fontSize:13, color:C.text }}>{p.name}</div>
                                      <div style={{ fontSize:10, color:C.textDim }}>{t("kaBrandPrice")}: €{p.unit_price ?? "\u2014"}</div>
                                    </div>
                                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                      <span style={{ fontSize:12, color:C.textMuted }}>€</span>
                                      <input type="number" step="0.01" min="0" value={kaPriceInput[p.id] ?? ""} onChange={e=>setKaPriceInput(prev=>({ ...prev, [p.id]: e.target.value }))} placeholder={p.unit_price ? String(p.unit_price) : "0.00"} style={{ width:90, padding:"6px 8px", borderRadius:6, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none" }}/>
                                      <button onClick={()=>saveResalePrice(u.id,b.id,p.id,kaPriceInput[p.id])} style={{ padding:"6px 12px", borderRadius:6, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:"#08080f", fontSize:11, fontWeight:700 }}>{t("kaSavePrice")}</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "brands" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("abTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{brands.length} brands on platform</p>
              </div>
              <button onClick={() => setShowAddBrand(true)} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>{t("abAddBrand")}</button>
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
                      <span style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".06em" }}>{t("abCode")}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:C.goldLight, fontFamily:"monospace" }}>{b.brand_code}</span>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8 }}>
                    {b.status !== "approved" && <button onClick={() => approveUser(b.id)} style={{ flex:1, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:11, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green, fontWeight:600 }}>✓ {t("auApprove")}</button>}
                    {b.status !== "rejected" && <button onClick={() => rejectUser(b.id)} style={{ flex:1, padding:"7px", borderRadius:7, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>✗ {t("auReject")}</button>}
                  </div>
                </div>
              ))}
              {brands.length === 0 && <div style={{ color:C.textMuted, padding:40, textAlign:"center", gridColumn:"1/-1" }}>{t("abNoBrands")}</div>}
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {tab === "catalog" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("acTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{products.length} products</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <label style={{ padding:"10px 16px", borderRadius:10, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  📊 {importLoading ? t("bdImporting") : "Import Excel/CSV"}
                  <input type="file" accept=".csv,.xlsx,.xls,.tsv" style={{ display:"none" }}
                    onChange={e => { const f = e.target.files?.[0]; if(f) importProducts(f); e.target.value=""; }}/>
                </label>
                <button onClick={() => setShowAddProduct(true)} style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>{t("acAddProduct")}</button>
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
                    {[t("achBrand"),"SKU",t("achProduct"),t("achCategory"),t("achPrice"),t("achStock"),"MOQ",t("achMultiple"),t("auhStatus"),t("auhActions")].map((h,i) => (
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
                          <button onClick={() => { setEditingProduct(p); setProductForm({ name:p.name, sku:p.sku||"", category:p.category||"", size:"", price:p.unit_price?.toString()||"", brand_id:p.brand_id, order_multiple:p.order_multiple, min_order_qty:p.min_order_qty, max_order_qty:p.max_order_qty||"", description:p.description||"" }); setShowAddProduct(true); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>{t("acEdit")}</button>
                          <button onClick={async () => { await supabase.from("products").update({ is_active:!p.is_active }).eq("id",p.id); loadProducts(); }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>
                            {p.is_active?t("acDeactivate"):t("acActivate")}
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
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🛒 {t("aamzTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("aamzSub")}</p>
              </div>
              <button onClick={()=>openAmazon(null)} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ {t("aamzAdd")}</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="📦" label={t("aamzStListing")} value={amazonRows.length}/>
              <Stat icon="🏦" label={t("aamzStStockVal")} value={eur(tot.stockCost)} accent={C.blue}/>
              <Stat icon="✅" label={t("aamzStPotential")} value={eur(tot.potential)} accent={C.green}/>
              <Stat icon="📊" label={t("aamzStAvgMargin")} value={avgPct.toFixed(1)+"%"} accent={C.gold}/>
              <Stat icon="📣" label={t("aamzStAds")} value={eur(tot.ads)} accent={C.red}/>
            </div>
            {amazonRows.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{t("aamzEmptyTitle")}</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>{t("aamzEmptyMsg")}</div>
                <button onClick={()=>openAmazon(null)} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ {t("aamzAdd")}</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:920 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("aamzhProduct"),t("aamzhMkt"),t("aamzhPrice"),t("aamzhCost"),t("aamzhCostU"),t("aamzhMarginU"),t("aamzhMarginPct"),t("aamzhRoi"),t("aamzhStock"),t("aamzhActions")].map((h,i)=>(<th key={i} style={{ padding:"10px 12px", textAlign: (i>=2&&i<=7)?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
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
                          <button onClick={()=>openAmazon(r)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}12`, border:`1px solid ${C.blue}40`, color:C.blue, marginRight:6 }}>{t("aamzEdit")}</button>
                          <button onClick={()=>deleteAmazon(r)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>{t("aamzDelete")}</button>
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
                  <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.text }}>{t("aamzQuickAddTitle")}</h3>
                  <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 12px" }}>{notListed.length} {t("aamzQuickAddMsg")}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {notListed.map(p=>(
                      <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                          <div style={{ fontSize:11, color:C.textDim }}>{(p.profiles&&p.profiles.company_name)||brandName(p.brand_id)}</div>
                        </div>
                        <button onClick={()=>quickAddAmazon(p)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, background:`${C.gold}15`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>+ {t("aamzQuickAddBtn")}</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {amazonModal && (
              <Modal title={amazonForm.id ? t("aamzModalEdit") : t("aamzModalNew")} onClose={()=>setAmazonModal(false)} onSave={saveAmazon} saveLabel={t("aamzSave")}>
                <label style={lbl}>{t("aamzFLinkCatalog")}</label>
                <select value={amazonForm._catalog||""} onChange={e=>{ const pid=e.target.value; const p=products.find(z=>z.id===pid); setAmazonForm(f=>({ ...f, _catalog:pid, ...(p?{ product_name:p.name||f.product_name, brand_id:p.brand_id||f.brand_id, sku:p.sku||f.sku, product_id:p.id }:{ product_id:null }) })); }} style={fld}>
                  <option value="">{t("aamzFManual")}</option>
                  {products.map(p=>(<option key={p.id} value={p.id}>{(p.name||"Prodotto")+(p.profiles&&p.profiles.company_name?(" · "+p.profiles.company_name):"")}</option>))}
                </select>
                <label style={lbl}>{t("aamzFName")}</label>
                <input value={amazonForm.product_name||""} onChange={e=>setAmazonForm(f=>({...f, product_name:e.target.value}))} placeholder={t("aamzFNamePh")} style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>ASIN</label><input value={amazonForm.asin||""} onChange={e=>setAmazonForm(f=>({...f, asin:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>SKU</label><input value={amazonForm.sku||""} onChange={e=>setAmazonForm(f=>({...f, sku:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>{t("aamzFBrand")}</label>
                <select value={amazonForm.brand_id||""} onChange={e=>setAmazonForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">{t("aamzFNone")}</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFMarketplace")}</label>
                    <select value={amazonForm.marketplace||"IT"} onChange={e=>setAmazonForm(f=>({...f, marketplace:e.target.value}))} style={fld}>
                      {MKTS.map(m=>(<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFFulfillment")}</label>
                    <select value={amazonForm.fulfillment||"FBA"} onChange={e=>setAmazonForm(f=>({...f, fulfillment:e.target.value}))} style={fld}>
                      <option value="FBA">FBA</option><option value="FBM">FBM</option>
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFCost")}</label><input type="number" step="0.01" value={amazonForm.cost_price} onChange={e=>setAmazonForm(f=>({...f, cost_price:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFPrice")}</label><input type="number" step="0.01" value={amazonForm.sell_price} onChange={e=>setAmazonForm(f=>({...f, sell_price:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFReferral")}</label><input type="number" step="0.1" value={amazonForm.referral_fee_pct} onChange={e=>setAmazonForm(f=>({...f, referral_fee_pct:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFFba")}</label><input type="number" step="0.01" value={amazonForm.fba_fee} onChange={e=>setAmazonForm(f=>({...f, fba_fee:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>{t("aamzFAds")}</label>
                <input type="number" step="0.01" value={amazonForm.ad_spend_30d} onChange={e=>setAmazonForm(f=>({...f, ad_spend_30d:e.target.value}))} style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFStock")}</label><input type="number" value={amazonForm.units_in_stock} onChange={e=>setAmazonForm(f=>({...f, units_in_stock:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aamzFSold")}</label><input type="number" value={amazonForm.units_sold_30d} onChange={e=>setAmazonForm(f=>({...f, units_sold_30d:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>{t("aamzFNotes")}</label>
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
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📈 {t("amrgTitle")}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("amrgSub")}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:`${C.red}10`, border:`1px solid ${C.red}35`, borderRadius:10, padding:"10px 14px", marginBottom:20 }}>
              <span style={{ fontSize:18 }}>🔒</span>
              <span style={{ fontSize:12.5, color:C.text }}>{t("amrgLockPre")}<b>{t("amrgLockBold")}</b>{t("amrgLockPost")}</span>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
              <Stat icon="💶" label={t("amrgGmv")} value={eur(tot.gmv)}/>
              <Stat icon="💰" label={t("amrgFee")} value={eur(tot.fee)} accent={C.gold}/>
              <Stat icon="💳" label={t("amrgCosts")} value={eur(tot.stripe+tot.op)} accent={C.red}/>
              <Stat icon="✅" label={t("amrgNet")} value={eur(tot.net)} accent={C.green}/>
              <Stat icon="📊" label={t("amrgAvg")} value={avgPct.toFixed(1)+"%"} accent={C.blue}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, fontSize:12, color:C.textMuted }}>
              <span>{t("amrgFeeEst")}</span>
              <input type="number" step="0.1" value={feeRate} onChange={e=>setFeeRate(Number(e.target.value)||0)} style={{ width:70, padding:"5px 8px", borderRadius:6, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:12, outline:"none" }}/>
              <span>%</span>
              <span style={{ color:C.textDim }}>{t("amrgFeeEstNote")}</span>
            </div>
            {marginRows.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted, fontSize:14 }}>{marginBusy ? t("amrgLoading") : t("amrgEmpty")}</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:880 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("amrghOrder"),t("amrghBrand"),"GMV",t("amrghComm"),"Stripe",t("amrghOpCost"),t("amrgNet"),"%"].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign: i>=2&&i<7?"right":"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
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
                          <button onClick={()=>saveOpCost(r.id, edit)} style={{ marginLeft:6, padding:"5px 9px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.gold}18`, border:`1px solid ${C.gold}40`, color:C.goldLight }}>{t("amrgSave")}</button>
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
          const CATS = [["company",t("acmpCatCompany")],["certificate",t("acmpCatCert")],["safety_sheet",t("acmpCatSafety")],["import",t("acmpCatImport")],["authorization",t("acmpCatAuth")],["price_list",t("acmpCatPrice")],["marketing",t("acmpCatMkt")],["quality",t("acmpCatQuality")],["arrival_photo",t("acmpCatArrival")],["amazon",t("acmpCatAmazon")],["other",t("acmpCatOther")]];
          const catLabel = (k)=>{ const f=CATS.find(z=>z[0]===k); return f?f[1]:k; };
          const ownerName = (id)=>{ const u=users.find(z=>z.id===id); return u?(u.company_name||u.email):"\u2014"; };
          const today = new Date(); const soon = new Date(); soon.setDate(soon.getDate()+30);
          const expState = (d)=>{ if(!d.expires_at) return null; const e=new Date(d.expires_at); if(e<today) return [t("acmpStExpired"),C.red]; if(e<soon) return [t("acmpStExpiring"),C.gold]; return [t("acmpStValid"),C.green]; };
          const expired = complianceDocs.filter(d=>d.expires_at && new Date(d.expires_at)<today).length;
          const expiring = complianceDocs.filter(d=>d.expires_at && new Date(d.expires_at)>=today && new Date(d.expires_at)<soon).length;
          const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
          const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
          return (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🗂️ {t("acmpTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("acmpSub")}</p>
              </div>
              <button onClick={()=>{ setCompForm({ category:"company" }); setCompModal(true); }} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ {t("acmpUpload")}</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="🗂️" label={t("acmpTotal")} value={complianceDocs.length}/>
              <Stat icon="⏳" label={t("acmpExpiring")} value={expiring} accent={C.gold}/>
              <Stat icon="⚠️" label={t("acmpExpired")} value={expired} accent={C.red}/>
            </div>
            {complianceDocs.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🗂️</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{t("acmpEmptyTitle")}</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>{t("acmpEmptyMsg")}</div>
                <button onClick={()=>{ setCompForm({ category:"company" }); setCompModal(true); }} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ {t("acmpUpload")}</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("acmphDoc"),t("acmphOwner"),t("acmphCat"),t("acmphExpiry"),t("acmphUploaded"),t("acmphActions")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
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
                          <a href={d.file_url} target="_blank" rel="noreferrer" style={{ padding:"4px 10px", borderRadius:6, fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue, textDecoration:"none", marginRight:6 }}>{t("acmpDownload")}</a>
                          <button onClick={()=>deleteCompliance(d)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>{t("acmpDelete")}</button>
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}

            {compModal && (
              <Modal title={t("acmpModalTitle")} onClose={()=>{ setCompModal(false); setCompForm({}); }} onSave={uploadCompliance} saveLabel={compBusy ? t("acmpLoading") : t("acmpSave")}>
                <label style={lbl}>{t("acmpFOwner")}</label>
                <select value={compForm.owner_id||""} onChange={e=>setCompForm(f=>({...f, owner_id:e.target.value}))} style={fld}>
                  <option value="">{t("acmpFChooseAccount")}</option>
                  {users.map(u=>(<option key={u.id} value={u.id}>{(u.company_name||u.email)+" ("+u.role+")"}</option>))}
                </select>
                <label style={lbl}>{t("acmpFCategory")}</label>
                <select value={compForm.category||"company"} onChange={e=>setCompForm(f=>({...f, category:e.target.value}))} style={fld}>
                  {CATS.map(z=>(<option key={z[0]} value={z[0]}>{z[1]}</option>))}
                </select>
                <label style={lbl}>{t("acmpFName")}</label>
                <input value={compForm.name||""} onChange={e=>setCompForm(f=>({...f, name:e.target.value}))} placeholder={t("acmpFNamePh")} style={fld}/>
                <label style={lbl}>{t("acmpFFile")}</label>
                <input type="file" onChange={e=>setCompForm(f=>({...f, file:(e.target.files&&e.target.files[0])||null}))} style={{...fld, padding:"8px 12px"}}/>
                <label style={lbl}>{t("acmpFExpiry")}</label>
                <input type="date" value={compForm.expires_at||""} onChange={e=>setCompForm(f=>({...f, expires_at:e.target.value}))} style={fld}/>
                <label style={lbl}>{t("acmpFNotes")}</label>
                <textarea value={compForm.notes||""} onChange={e=>setCompForm(f=>({...f, notes:e.target.value}))} rows={2} style={{...fld, resize:"vertical"}}/>
              </Modal>
            )}
          </div>
          );
        })()}
        {tab === "retail" && (() => {
          const STAGES = [["lead",t("aretStLead"),C.textMuted],["contacted",t("aretStContacted"),C.blue],["samples",t("aretStSamples"),C.blue],["meeting",t("aretStMeeting"),C.gold],["negotiation",t("aretStNego"),C.gold],["won",t("aretStWon"),C.green],["lost",t("aretStLost"),C.red]];
          const stColor = (k)=>{ const f=STAGES.find(z=>z[0]===k); return f?f[2]:C.textMuted; };
          const brandName = (id)=>{ const b=brands.find(z=>z.id===id); return b?(b.company_name||"\u2014"):"\u2014"; };
          const won = retailTargets.filter(t=>t.stage==="won").length;
          const convLabel = t("aretConvert"); const convDoneLabel = t("aretConverted");
          const active = retailTargets.filter(t=>!["won","lost"].includes(t.stage)).length;
          const avgProb = retailTargets.length ? Math.round(retailTargets.reduce((a,t)=>a+Number(t.probability||0),0)/retailTargets.length) : 0;
          const fld = { padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, width:"100%", boxSizing:"border-box", outline:"none" };
          const lbl = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, marginTop:12 };
          return (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🏬 {t("aretTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("aretSub")}</p>
              </div>
              <button onClick={()=>openRetail(null)} style={{ padding:"10px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>+ {t("aretAdd")}</button>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="🎯" label={t("aretTotal")} value={retailTargets.length}/>
              <Stat icon="🔥" label={t("aretActive")} value={active} accent={C.gold}/>
              <Stat icon="✅" label={t("aretWon")} value={won} accent={C.green}/>
              <Stat icon="📊" label={t("aretAvgProb")} value={avgProb+"%"} accent={C.blue}/>
            </div>
            {retailTargets.length===0 ? (
              <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🏬</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:8 }}>{t("aretEmptyTitle")}</div>
                <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>{t("aretEmptyMsg")}</div>
                <button onClick={()=>openRetail(null)} style={{ padding:"10px 22px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>+ {t("aretAdd")}</button>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("arethRetailer"),t("arethCountry"),t("arethBuyer"),t("arethBrand"),t("arethStatus"),t("arethProb"),t("arethFollowup"),t("arethActions")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>))}
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
                          {t.stage === "won" && (t.converted_profile_id
                            ? <span style={{ padding:"4px 10px", borderRadius:6, fontSize:11, background:`${C.green}18`, color:C.green, fontWeight:600, marginRight:6 }}>{"\u2713 " + convDoneLabel}</span>
                            : <button onClick={()=>convertRetail(t)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.gold}18`, border:`1px solid ${C.gold}55`, color:C.goldLight, fontWeight:600, marginRight:6 }}>{convLabel}</button>)}
                          <button onClick={()=>openRetail(t)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue, marginRight:6 }}>{t("aretEdit")}</button>
                          <button onClick={()=>deleteRetail(t)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>{t("aretDelete")}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {retailModal && (
              <Modal title={retailForm.id ? t("aretModalEdit") : t("aretModalNew")} onClose={()=>setRetailModal(null)} onSave={saveRetail} saveLabel={t("aretSave")}>
                <label style={lbl}>{t("aretFRetailer")}</label>
                <input value={retailForm.retailer_name||""} onChange={e=>setRetailForm(f=>({...f, retailer_name:e.target.value}))} placeholder={t("aretFRetailerPh")} style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aretFCountry")}</label><input value={retailForm.country||""} onChange={e=>setRetailForm(f=>({...f, country:e.target.value}))} placeholder={t("aretFCountryPh")} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aretFBuyer")}</label><input value={retailForm.buyer_name||""} onChange={e=>setRetailForm(f=>({...f, buyer_name:e.target.value}))} style={fld}/></div>
                </div>
                <label style={lbl}>{t("aretFBuyerEmail")}</label>
                <input value={retailForm.buyer_email||""} onChange={e=>setRetailForm(f=>({...f, buyer_email:e.target.value}))} style={fld}/>
                <label style={lbl}>{t("aretFBrand")}</label>
                <select value={retailForm.brand_id||""} onChange={e=>setRetailForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">{t("aretFNone")}</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <label style={lbl}>{t("aretFProducts")}</label>
                <textarea value={retailForm.candidate_products||""} onChange={e=>setRetailForm(f=>({...f, candidate_products:e.target.value}))} rows={2} style={{...fld, resize:"vertical"}}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aretFStage")}</label>
                    <select value={retailForm.stage||"lead"} onChange={e=>setRetailForm(f=>({...f, stage:e.target.value}))} style={fld}>
                      {STAGES.map(z=>(<option key={z[0]} value={z[0]}>{z[1]}</option>))}
                    </select>
                  </div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aretFProb")}</label><input type="number" min="0" max="100" value={retailForm.probability||0} onChange={e=>setRetailForm(f=>({...f, probability:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aretFFollowup")}</label><input type="date" value={retailForm.next_followup||""} onChange={e=>setRetailForm(f=>({...f, next_followup:e.target.value}))} style={fld}/></div>
                  <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.text, marginTop:24, flex:1, cursor:"pointer" }}>
                    <input type="checkbox" checked={!!retailForm.samples_sent} onChange={e=>setRetailForm(f=>({...f, samples_sent:e.target.checked}))}/> {t("aretFSamples")}
                  </label>
                </div>
                <label style={lbl}>{t("aretFNotes")}</label>
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
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🚛 {t("alogTitle")}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("alogSub")}</p>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
              <Stat icon="📦" label={t("alogStock")} value={unitsStock.toLocaleString("it-IT")} sub={`${wi.length} SKU`}/>
              <Stat icon="🔒" label={t("alogReserved")} value={unitsReserved.toLocaleString("it-IT")}/>
              <Stat icon="🛠️" label={t("alogToPrep")} value={prep.length} accent={C.gold}/>
              <Stat icon="🚚" label={t("alogTransit")} value={transit.length} accent={C.blue}/>
              <Stat icon="✅" label={t("alogDelivered")} value={delivered.length} accent={C.green}/>
              <Stat icon="⚠️" label={t("alogLowOut")} value={low.length+out.length} accent={C.red}/>
            </div>

            <h3 style={{ fontSize:14, color:C.gold, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>{t("alogPipeline")}</h3>
            {pipeline.length===0 ? (
              <div style={{ padding:24, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:13, marginBottom:28 }}>{t("alogNoPipeline")}</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}`, marginBottom:28 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("alogh1Order"),t("alogh1Status"),t("alogh1Courier"),"Tracking",t("alogh1Value")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>))}
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

            <h3 style={{ fontSize:14, color:C.textMuted, letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>{t("alogWhHealth")}</h3>
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                <thead><tr style={{ background:C.surface2 }}>
                  {[t("alogh2Product"),t("alogh2Brand"),t("alogh2Avail"),t("alogh2Reserved"),t("alogh2Status")].map((h,i)=>(<th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:".08em", textTransform:"uppercase" }}>{h}</th>))}
                </tr></thead>
                <tbody>
                  {wi.length===0 ? (
                    <tr><td colSpan={5} style={{ padding:24, textAlign:"center", color:C.textMuted, fontSize:13 }}>{t("alogNoProducts")}</td></tr>
                  ) : wi.map((x,i)=>{
                    const q=Number(x.inv.quantity_available||0);
                    const stt = q===0 ? [t("alogStOut"),C.red] : q<=50 ? [t("alogStLow"),C.gold] : ["OK",C.green];
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
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("astkTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("astkSub")}</p>
              </div>
              <button onClick={() => setScannerMode(m => !m)} style={{
                padding:"12px 18px", borderRadius:10, cursor:"pointer",
                background: scannerMode ? "#a855f7" : `${C.purple}15`,
                border:`1px solid ${C.purple}40`,
                color: scannerMode ? "#fff" : "#a855f7",
                fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                📱 {scannerMode ? t("astkScannerOn") : t("astkScannerOff")}
              </button>
            </div>

            <InventoryForecast products={products} orders={orders}/>

            {/* Stock summary */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[
                { label:t("astkTotalProducts"), value:products.length, color:C.gold },
                { label:t("astkInStock"), value:products.filter(p=>(p.inventory?.quantity_available||0)>0).length, color:C.green },
                { label:t("astkLowStock"), value:products.filter(p=>(p.inventory?.quantity_available||0)<20&&(p.inventory?.quantity_available||0)>0).length, color:C.gold },
                { label:t("astkOutStock"), value:products.filter(p=>(p.inventory?.quantity_available||0)===0).length, color:C.red },
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
                    <div style={{ fontSize:15, fontWeight:700, color:"#a855f7" }}>{t("astkScannerActive")}</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>{t("astkScannerDesc")}</div>
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
                    placeholder={t("astkScanPh")}
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
                      ↑ {t("astkLoad")}
                    </button>
                    <button onClick={() => setScanType("out")} style={{
                      padding:"12px 18px", borderRadius:9, cursor:"pointer", fontSize:13, fontWeight:700,
                      background: scanType==="out" ? `${C.red}20` : "transparent",
                      border:`2px solid ${scanType==="out" ? C.red : C.border}`,
                      color: scanType==="out" ? C.red : C.textMuted }}>
                      ↓ {t("astkUnload")}
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
                        <div style={{ color:C.gold, fontWeight:700, marginBottom:6 }}>🔗 {t("astkNotLinked")} <span style={{ fontFamily:"monospace" }}>{scanResult.query}</span></div>
                        <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>{t("astkLinkDesc")}</div>
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                          <select value={linkProductId} onChange={e=>setLinkProductId(e.target.value)} style={{ flex:1, minWidth:240, padding:"12px 14px", borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:14, outline:"none" }}>
                            <option value="">{t("astkChooseProduct")}</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}{p.sku?` · ${p.sku}`:""}</option>
                            ))}
                          </select>
                          <button onClick={async () => {
                            if (!linkProductId) return;
                            await supabase.from("products").update({ barcode: scanResult.query }).eq("id", linkProductId);
                            const { data } = await supabase.from("products").select("*, inventory(*)").eq("id", linkProductId).maybeSingle();
                            notify(t("astkLinkedNotify").replace("{name}", (data?.name||t("astkProductFallback"))));
                            setScanResult(data || null);
                            setLinkProductId("");
                            setScanQty("");
                          }} style={{ padding:"12px 20px", borderRadius:9, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, whiteSpace:"nowrap" }}>
                            🔗 {t("astkLinkBtn")}
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
                              {t("astkCurrentStock")} <span style={{ color: (scanResult.inventory?.quantity_available||0)>20?C.green:C.red }}>
                                {scanResult.inventory?.quantity_available || 0} {t("astkUnits")}
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
                            placeholder={scanType==="in" ? t("astkQtyAddPh") : t("astkQtyRemovePh")}
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
                              ? t("astkAddedNotify").replace("{qty}", qty).replace("{name}", scanResult.name)
                              : t("astkRemovedNotify").replace("{qty}", qty).replace("{name}", scanResult.name));

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
                            {scanType==="in" ? t("astkAddBtn") : t("astkRemoveBtn")}
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
                  💡 {t("astkScanInfo")}
                </div>
              </div>
            )}

            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {[t("astkhProduct"),"SKU",t("astkhBrand"),t("astkhCurrent"),t("astkhReserved"),t("astkhUpdate"),t("astkhLastRestock")].map((h,i) => (
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
                              style={{ padding:"6px 12px", borderRadius:7, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{t("astkUpdateBtn")}</button>
                          </div>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim }}>
                          {p.inventory?.last_restock_at ? new Date(p.inventory.last_restock_at).toLocaleDateString() : t("astkNever")}
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
              <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("aordTitle")}</h2>
              <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{orders.length} orders total</p>
            </div>
            <button onClick={exportShippyPro} style={{ marginBottom:20, padding:"10px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg }}>📦 {t("aordExport")}</button>
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
                    {[t("hdrOrderNum"),t("hdrDistributor"),t("hdrBrand"),t("hdrShipTo"),t("hdrAmount"),t("hdrStatus"),t("hdrDate"),t("hdrTracking"),t("hdrActions")].map((h,i) => (
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
                      <td style={{ padding:"11px 14px" }}><Badge status={o.status}/>{o.rating ? <div style={{ fontSize:12, color:C.gold, marginTop:3 }}>{"★".repeat(o.rating)}<span style={{ color:C.border }}>{"★".repeat(5-o.rating)}</span> <span title={t("aordDelReview")} onClick={async()=>{ if(!window.confirm(t("aordDelReviewConfirm"))) return; await supabase.rpc("admin_delete_review",{p_order:o.id}); notify(t("aordReviewDeleted")); loadOrders(); }} style={{ cursor:"pointer", color:C.red, fontSize:11, marginLeft:6 }}>✕ {t("aordRemove")}</span></div> : null}</td>
                      <td style={{ padding:"11px 14px", fontSize:11, color:C.textDim }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td style={{ padding:"11px 14px" }}>
                        {o.tracking_number ? (
                          <div style={{ fontSize:11 }}>
                            <div style={{ color:C.text, fontWeight:600 }}>{o.courier||"—"}</div>
                            <div style={{ color:C.blue, fontFamily:"monospace" }}>{o.tracking_number}</div>
                          </div>
                        ) : (
                          <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:140 }}>
                            <input value={trackEdits[o.id]?.courier ?? ""} onChange={ev=>setTrackEdits(p=>({ ...p, [o.id]:{ ...p[o.id], courier:ev.target.value } }))} placeholder={t("aordCourierPh")} style={{ padding:"4px 6px", borderRadius:5, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:11 }}/>
                            <input value={trackEdits[o.id]?.tracking_number ?? ""} onChange={ev=>setTrackEdits(p=>({ ...p, [o.id]:{ ...p[o.id], tracking_number:ev.target.value } }))} placeholder={t("aordTrackingPh")} style={{ padding:"4px 6px", borderRadius:5, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:11 }}/>
                            <button onClick={()=>saveTracking(o)} style={{ padding:"4px 8px", borderRadius:5, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}20`, border:`1px solid ${C.blue}50`, color:C.blue }}>{t("aordSaveNotify")}</button>
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
                    <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.textMuted }}>{t("aordNoOrders")}</td></tr>
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
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🧾 {t("ainvTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("ainvSub")}</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { label:t("ainvCardTotal"), value:invoices.length, color:C.gold },
                  { label:t("ainvCardComm"), value:`€${invoices.filter(i=>i.type==="nexushub_commission").reduce((s,i)=>s+(i.commission_amount||0),0).toFixed(0)}`, color:C.green },
                  { label:t("ainvCardToday"), value:invoices.filter(i=>new Date(i.created_at).toDateString()===new Date().toDateString()).length, color:C.blue },
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
                <div style={{ fontSize:15, color:C.text, marginBottom:8 }}>{t("ainvNoInvoices")}</div>
                <div style={{ fontSize:13, color:C.textMuted }}>{t("ainvNoInvoicesMsg")}</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {[t("ainvhNumber"),t("ainvhType"),t("ainvhFrom"),t("ainvhTo"),t("ainvhTaxable"),t("ainvhVat"),t("ainvhTotal"),t("ainvhCommNH"),t("ainvhDate"),t("auhActions")].map((h,i) => (
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
                            {inv.type==="nexushub_commission"?t("ainvtypeComm"):inv.type==="nexushub_to_distributor"?t("ainvtypeToDist"):t("ainvtypeBrandNH")}
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
                            <button onClick={() => viewInvoice(inv.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue }}>👁 {t("ainvView")}</button>
                            <button onClick={() => sendInvoiceEmail(inv.id)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.green}10`, border:`1px solid ${C.green}30`, color:C.green }}>✉ {t("ainvSend")}</button>
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📊 {t("acomTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 16px" }}>{t("acomSub")}</p>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
              <button onClick={recalcNow} disabled={recalcing} style={{ padding:"9px 18px", borderRadius:9, cursor: recalcing?"default":"pointer", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, opacity: recalcing?0.6:1 }}>{recalcing ? t("auiRecalcing") : t("auiRecalcNow")}</button>
            </div>
            <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {[t("hdrBrand"),t("hdrEstRevenue"),t("hdrRealRevenue"),t("hdrCurrentPct"),t("hdrTierPct"),t("hdrLocked"),t("hdrAction")].map((h,i) => (
                      <th key={i} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commissionRows.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:28, textAlign:"center", color:C.textMuted, fontSize:13 }}>{t("acomNoBrands")}</td></tr>
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
                          <button onClick={() => toggleLock(row)} title={row.locked ? t("auiUnlockFee") : t("auiLockFeeHint")} style={{ padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background: row.locked ? `${C.gold}18` : "transparent", border:`1px solid ${row.locked ? C.gold : C.border}`, color: row.locked ? C.goldLight : C.textMuted, whiteSpace:"nowrap" }}>{row.locked ? t("auiLocked") : t("auiFree")}</button>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          {row.locked
                            ? <span style={{ fontSize:12, color:C.textDim }}>{t("acomLocked")}</span>
                            : changed
                            ? <button onClick={() => applyCommission(row, due)} style={{ padding:"7px 16px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green, whiteSpace:"nowrap" }}>Applica {due}%</button>
                            : <span style={{ fontSize:12, color:C.textDim }}>{t("acomUpdated")}</span>}
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
            <h3 style={{ fontSize:15, fontWeight:700, fontFamily:"Georgia,serif", margin:"24px 0 10px" }}>{t("acomHistory")}</h3>
            {commissionLog.length === 0 ? (
              <div style={{ color:C.textMuted, fontSize:13 }}>{t("acomNoHistory")}</div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:680 }}>
                  <thead><tr style={{ background:C.surface2 }}>
                    {[t("hdrDate"),t("hdrBrand"),t("hdrFromTo"),t("hdrReason"),t("hdrRevenue")].map((h,i) => (<th key={i} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>))}
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
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📝 {t("aconTitle")}</h2>
                <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{t("aconSub")}</p>
              </div>
              <button onClick={openNewContract}
                style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>
                + {t("auiNewContract")}
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
                  <Stat icon="✅" label={t("aconFilterActive")} value={act} accent={C.green}/>
                  <Stat icon="📝" label={t("aconFilterDrafts")} value={dr} accent={C.gold}/>
                  <Stat icon="⏳" label={t("aconFilterExpiring")} value={soonN} accent={C.gold}/>
                  <Stat icon="⚠️" label={t("aconFilterExpired")} value={expd} accent={C.red}/>
                </div>
              );
            })()}

            {contracts.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.surface, borderRadius:12, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
                <div style={{ fontSize:15, color:C.text, marginBottom:8 }}>{t("aconNoContracts")}</div>
                <div style={{ fontSize:13, color:C.textMuted }}>{t("aconNoContractsMsg")}</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
                  <thead>
                    <tr style={{ background:C.surface2 }}>
                      {[t("hdrNumber"),t("hdrBrand"),t("hdrDistributor"),t("hdrTerritory"),t("hdrExclusivity"),t("hdrValidity"),t("hdrStatus"),t("hdrActions")].map((h,i) => (
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
                          <span style={{ fontSize:11, color:c.exclusivity?C.green:C.textMuted }}>{c.exclusivity?t("auiExclusive"):t("auiNonExclusive")}</span>
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.textMuted }}>
                          {c.valid_from} → {c.valid_until}
                          {c.valid_until && new Date(c.valid_until) < new Date() && <span style={{ marginLeft:6, padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:700, background:`${C.red}18`, color:C.red, border:`1px solid ${C.red}40` }}>{t("aconExpired")}</span>}
                        </td>
                        <td style={{ padding:"11px 14px" }}><Badge status={c.status}/></td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => setAdminViewContract(c)} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.blue}12`, border:`1px solid ${C.blue}40`, color:C.blue }}>{t("aconView")}</button>
                            <button onClick={async () => {
                              await supabase.from("contracts").update({ status:"active" }).eq("id", c.id);
                              notify(t("auiContractActivated"));
                              loadContracts();
                            }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.green}15`, border:`1px solid ${C.green}40`, color:C.green }}>{t("aconActivate")}</button>
                            <button onClick={async () => {
                              await supabase.from("contracts").update({ status:"terminated" }).eq("id", c.id);
                              notify(t("auiContractTerminated"));
                              loadContracts();
                            }} style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}10`, border:`1px solid ${C.red}30`, color:C.red }}>{t("aconTerminate")}</button>
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
              <Modal title={t("aconNewTitle")} onClose={()=>setContractCreate(false)} onSave={saveNewContract} saveLabel={t("aconCreateDraft")}>
                <label style={lbl}>{t("aconBrandLbl")}</label>
                <select value={contractForm.brand_id||""} onChange={e=>setContractForm(f=>({...f, brand_id:e.target.value}))} style={fld}>
                  <option value="">{t("aconChooseBrand")}</option>
                  {brands.map(b=>(<option key={b.id} value={b.id}>{b.company_name||b.email}</option>))}
                </select>
                <label style={lbl}>{t("aconDistLbl")}</label>
                <select value={contractForm.distributor_id||""} onChange={e=>setContractForm(f=>({...f, distributor_id:e.target.value}))} style={fld}>
                  <option value="">{t("aconChooseDist")}</option>
                  {users.filter(u=>u.role==="distributor").map(u=>(<option key={u.id} value={u.id}>{u.company_name||u.email}</option>))}
                </select>
                <label style={lbl}>{t("aconTerritory")}</label>
                <input value={contractForm.territory||""} onChange={e=>setContractForm(f=>({...f, territory:e.target.value}))} placeholder={t("aconTerritoryPh")} style={fld}/>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aconCommission")}</label><input type="number" step="0.1" value={contractForm.commission_rate} onChange={e=>setContractForm(f=>({...f, commission_rate:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aconMOQ")}</label><input type="number" value={contractForm.moq_per_order} onChange={e=>setContractForm(f=>({...f, moq_per_order:e.target.value}))} style={fld}/></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aconPayTerms")}</label><input type="number" value={contractForm.payment_terms} onChange={e=>setContractForm(f=>({...f, payment_terms:e.target.value}))} style={fld}/></div>
                  <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.text, marginTop:24, flex:1, cursor:"pointer" }}>
                    <input type="checkbox" checked={!!contractForm.exclusivity} onChange={e=>setContractForm(f=>({...f, exclusivity:e.target.checked}))}/> {t("auiTerrExclusivity")}
                  </label>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aconValidFrom")}</label><input type="date" value={contractForm.valid_from||""} onChange={e=>setContractForm(f=>({...f, valid_from:e.target.value}))} style={fld}/></div>
                  <div style={{ flex:1 }}><label style={lbl}>{t("aconValidUntil")}</label><input type="date" value={contractForm.valid_until||""} onChange={e=>setContractForm(f=>({...f, valid_until:e.target.value}))} style={fld}/></div>
                </div>
              </Modal>
              );
            })()}
          </div>
        )}

        {/* SEGNALAZIONI TAB */}
        {tab === "issues" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>🚩 {t("aissTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("aissSub")}</p>
            {orderIssues.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.textMuted, fontSize:13 }}>{t("aissEmpty")}</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {orderIssues.map(it => (
                  <div key={it.id} style={{ background:C.surface, border:`1px solid ${it.status==="open"?C.red+"55":C.border}`, borderRadius:12, padding:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontFamily:"monospace", fontSize:13, color:C.gold, fontWeight:700 }}>{it.order?.order_number || "-"}</div>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{it.dist_info?.company_name || t("aissDistFallback")}{it.dist_info?.country ? " - " + it.dist_info.country : ""} - {new Date(it.created_at).toLocaleString("it-IT")}</div>
                      </div>
                      <span style={{ padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, background: it.status==="open"?`${C.red}15`:`${C.green}15`, color: it.status==="open"?C.red:C.green, border:`1px solid ${it.status==="open"?C.red:C.green}40` }}>{it.status==="open"?t("aissOpen"):t("aissClosed")}</span>
                    </div>
                    <div style={{ fontSize:13, color:C.text, marginBottom:10, whiteSpace:"pre-wrap" }}>{it.reason}</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      {it.photo_url && <a href={it.photo_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:C.blue, textDecoration:"none", padding:"5px 12px", border:`1px solid ${C.blue}40`, borderRadius:6 }}>📷 {t("aissViewPhoto")}</a>}
                      {it.status==="open" && <button onClick={() => closeIssue(it.id)} style={{ fontSize:11, color:C.green, background:"transparent", border:`1px solid ${C.green}40`, borderRadius:6, padding:"5px 12px", cursor:"pointer" }}>✓ {t("aissResolve")}</button>}
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>📋 {t("aaudTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("aaudSub")}</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>{t("aaudhDateTime")}</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>{t("aaudhUser")}</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>{t("aaudhAction")}</th>
                    <th style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>{t("aaudhDetail")}</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.length === 0 && (
                    <tr><td colSpan={4} style={{ padding:24, textAlign:"center", color:C.textMuted, fontSize:13 }}>{t("aaudEmpty")}</td></tr>
                  )}
                  {auditLog.map(a => (
                    <tr key={a.id} style={{ borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.textMuted, whiteSpace:"nowrap" }}>{new Date(a.created_at).toLocaleString("it-IT")}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.text }}>{a.actor_info?.company_name || a.actor_info?.email || (a.actor ? t("aaudhUser") : t("aaudActorSystem"))}{a.actor_info?.role ? " · " + a.actor_info.role : ""}</td>
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>💶 {t("afinTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("afinSub")}</p>
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
              const loc={en:"en-US",it:"it-IT",fr:"fr-FR",es:"es-ES",de:"de-DE",zh:"zh-CN",ar:"ar"}[lang]||"en-US";
              const months = [];
              for(let k=5;k>=0;k--){ const d=new Date(now.getFullYear(), now.getMonth()-k, 1); months.push({ key:d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"), label:d.toLocaleDateString(loc,{month:"short"}), gmv:0, fee:0 }); }
              const mi={}; months.forEach(m=>{mi[m.key]=m;});
              valid.forEach(o=>{ const d=new Date(o.created_at); const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); if(mi[k]) mi[k].gmv+=Number(o.total_amount||0); });
              paySplits.forEach(x=>{ const d=new Date(x.created_at); const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); if(mi[k]) mi[k].fee+=Number(x.nexushub_amount||0); });
              const maxVal = Math.max(1, ...months.map(m=>m.gmv), ...months.map(m=>m.fee));
              return (
                <div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
                    <Stat icon="📊" label={t("afinGmv")} value={fmt(gmv)} accent={C.blue}/>
                    <Stat icon="↗" label={t("afinFeeGross")} value={fmt(feeGross)} accent={C.gold}/>
                    <Stat icon="✓" label={t("afinFeeColl")} value={fmt(feeCollected)} accent={C.green}/>
                    <Stat icon="⏳" label={t("afinFeePend")} value={fmt(feePending)}/>
                  </div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:22 }}>
                    <Stat icon="💸" label={t("afinToBrand")} value={fmt(toBrand)}/>
                    <Stat icon="🧾" label={t("afinIva")} value={fmt(ivaInvoiced)}/>
                    <Stat icon="🏛️" label={t("afinBrands")} value={nBrands}/>
                    <Stat icon="⬡" label={t("afinDist")} value={nDist}/>
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:16 }}>{t("afinTrend")}</div>
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
                      <span><span style={{ display:"inline-block", width:10, height:10, background:C.gold, borderRadius:2, marginRight:5 }}/>{t("afinLegFee")}</span>
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>💸 {t("aincTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("aincSub")}</p>
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
                    <Stat icon="↗" label={t("aincFeeColl")} value={"€"+feeTot.toLocaleString("it-IT",{minimumFractionDigits:2})} accent={C.gold}/>
                    <Stat icon="💸" label={t("aincToBrand")} value={"€"+toBrand.toLocaleString("it-IT",{minimumFractionDigits:2})} accent={C.blue}/>
                    <Stat icon="⏳" label={t("aincToCollect")} value={"€"+toCollect.toLocaleString("it-IT",{minimumFractionDigits:2})}/>
                  </div>
                  {Object.keys(byBrand).length > 0 && (
                    <div style={{ background:C.surface, border:`1px solid ${C.gold}40`, borderRadius:12, padding:16, marginBottom:20 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.goldLight, marginBottom:10 }}>💸 {t("aincRemitTitle")}</div>
                      {Object.entries(byBrand).map(([name, info]) => (
                        <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop:`1px solid ${C.border}`, gap:10, flexWrap:"wrap" }}>
                          <div>
                            <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{name}</div>
                            <div style={{ fontSize:11, color:C.textMuted, fontFamily:"monospace" }}>{info.iban || t("aincNoIban")}</div>
                          </div>
                          <div style={{ fontSize:15, fontWeight:800, color:C.goldLight }}>€{info.amount.toLocaleString("it-IT",{minimumFractionDigits:2})}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {paySplits.length === 0 ? (
                    <div style={{ textAlign:"center", padding:48, background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.textMuted }}>{t("aincEmpty")}</div>
                  ) : (
                    <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.border}` }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:880 }}>
                        <thead>
                          <tr style={{ background:C.surface2 }}>
                            {[t("ainchOrder"),t("ainchDist"),t("ainchBrand"),t("ainchTotal"),t("ainchYourFee"),t("ainchToBrand"),t("ainchStatus"),t("ainchAction")].map((h,i)=>(
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
                                  {x.split_status==="paid_brand"?"✓ "+t("aincStDone"):x.split_status==="collected"?t("aincStColl"):t("aincStPending")}
                                </span>
                              </td>
                              <td style={{ padding:"11px 14px" }}>
                                {x.split_status==="pending" && <button onClick={()=>markCollected(x)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.blue}15`, border:`1px solid ${C.blue}45`, color:C.blue }}>✓ {t("aincStColl")}</button>}
                                {x.split_status==="collected" && <button onClick={()=>markPaidBrand(x)} style={{ padding:"5px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:600, background:`${C.green}15`, border:`1px solid ${C.green}45`, color:C.green }}>💸 {t("aincBtnPaid")}</button>}
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("apayTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>{t("apaySub")}</p>
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              {[
                { label:t("apayGmv"), value:`€${orders.reduce((s,o)=>s+(o.total_amount||0),0).toLocaleString("it-IT")}`, color:C.gold },
                { label:t("apayRevenue"), value:`€${(orders.reduce((s,o)=>s+(o.total_amount||0),0)*0.114).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`, color:C.green },
                { label:t("apayTotalOrders"), value:orders.length, color:C.blue },
                { label:t("apayAov"), value:orders.length>0?`€${(orders.reduce((s,o)=>s+(o.total_amount||0),0)/orders.length).toFixed(0)}`:"—", color:C.purple },
              ].map((s,i) => (
                <div key={i} style={{ flex:"1 1 160px", padding:"18px 20px", background:C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, borderRadius:12 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <h3 style={{ fontSize:14, color:C.text, marginBottom:16 }}>{t("apayTxLog")}</h3>
              {orders.length === 0 ? (
                <div style={{ color:C.textMuted, textAlign:"center", padding:30 }}>{t("apayNoTx")}</div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
                    <thead>
                      <tr style={{ background:C.surface2 }}>
                        {[t("apayhOrder"),t("apayhAmount"),t("apayhFee"),t("apayhBrandShare"),t("apayhDate"),t("apayhStatus")].map((h,i) => (
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
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>{t("asetTitle")}</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 24px" }}>{t("asetSub")}</p>

            {[
              { title:t("asetDemoT"), desc:t("asetDemoD"), key:"demo" },
              { title:t("asetRegT"), desc:t("asetRegD"), key:"registration" },
              { title:t("asetSepaT"), desc:t("asetSepaD"), key:"payments" },
              { title:t("asetEmailT"), desc:t("asetEmailD"), key:"emails" },
              { title:t("asetScanT"), desc:t("asetScanD"), key:"scanner" },
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
                  onClick={() => notify(t("asetUpdated").replace("{name}", s.title))}>
                  <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%",
                    background:"#fff", transition:"left .2s",
                    left: i===0||i===1 ? 23 : 3 }}/>
                </div>
              </div>
            ))}

            <div style={{ marginTop:24, padding:"18px 20px", background:`${C.red}08`, border:`1px solid ${C.red}20`, borderRadius:12 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.red, marginBottom:6 }}>⚠️ {t("asetDanger")}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>{t("asetDangerD")}</div>
              <button style={{ padding:"9px 18px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.red}50`, color:C.red, fontSize:12 }}
                onClick={() => notify(t("asetComingSoon"), "error")}>
                {t("asetReset")}
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
                { label:t("aumFullName"), key:"full_name", placeholder:t("aumPhFullName") },
                { label:t("aumCompany"), key:"company_name", placeholder:t("aumPhCompany") },
                { label:t("aumPhone"), key:"phone", placeholder:"+39..." },
                { label:t("aumCountry"), key:"country", placeholder:t("aumPhCountry") },
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
                <div style={{ fontSize:12, color:C.gold, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>💳 {t("aumBankTitle")}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    [t("aumHolder"), editingUser.account_holder],
                    [t("aumBank"), editingUser.bank_name],
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
                <div style={{ fontSize:12, color:C.blue, fontWeight:600, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>🧾 {t("aumFiscalTitle")}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    [t("aumVat"), editingUser.vat_number],
                    [t("aumSdi"), editingUser.sdi_code],
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
                <div style={{ fontSize:12, color:C.green, fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>💳 {t("aumPayTitle")}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { key:"sepa", label:t("aumPaySepa"), desc:t("aumPaySepaD"), icon:"🏦" },
                    { key:"card", label:t("aumPayCard"), desc:t("aumPayCardD"), icon:"💳" },
                    { key:"sepa_debit", label:t("aumPaySdd"), desc:t("aumPaySddD"), icon:"⚡" },
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
                          notify(t("aumPayUpdated"));
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
                  💡 {t("aumPayInfo")}
                </div>
              </div>
            )}

            {editingUser.role === "brand" && (
              <div style={{ marginBottom:16, padding:"14px 16px", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:12, color:C.gold, fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>📊 {t("aumCommTitle")}</div>
                <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                  <div>
                    <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:6 }}>{t("aumCommRate")}</label>
                    <input type="number" min={9} max={11.4} step={0.1} defaultValue={editingUser.commission_rate ?? 11.4}
                      onBlur={async (e) => {
                        const v = Math.min(11.4, Math.max(9, Number(e.target.value) || 11.4));
                        await supabase.from("profiles").update({ commission_rate: v }).eq("id", editingUser.id);
                        setEditingUser(u => ({ ...u, commission_rate: v }));
                        notify(t("aumCommUpdated"));
                      }}
                      style={{ width:110, padding:"10px 12px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:14 }} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.textMuted, display:"block", marginBottom:6 }}>{t("aumRevenue")}</label>
                    <input type="number" min={0} step={10000} defaultValue={editingUser.estimated_annual_revenue ?? 0}
                      onBlur={async (e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        await supabase.from("profiles").update({ estimated_annual_revenue: v }).eq("id", editingUser.id);
                        setEditingUser(u => ({ ...u, estimated_annual_revenue: v }));
                        notify(t("aumRevUpdated"));
                      }}
                      style={{ width:180, padding:"10px 12px", borderRadius:8, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:14 }} />
                  </div>
                </div>
                <div style={{ marginTop:10, padding:"8px 12px", background:`${C.gold}08`, border:`1px solid ${C.gold}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
                  💡 {t("aumCommInfo")}
                </div>
              </div>
            )}
            {/* Brand Code - only for brands */}
            {editingUser.role === "brand" && editingUser.brand_code && (
              <div style={{ marginBottom:16, padding:"12px 16px",
                background:`${C.gold}08`, border:`1px solid ${C.gold}25`, borderRadius:10,
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:".08em" }}>{t("aumBrandCode")}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.goldLight, fontFamily:"monospace", marginTop:3 }}>{editingUser.brand_code}</div>
                </div>
                <div style={{ fontSize:10, color:C.textMuted, maxWidth:200, textAlign:"right", lineHeight:1.5 }}>
                  {t("aumBrandCodeDesc")}
                </div>
              </div>
            )}

            {/* Role + Status */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("aumRole")}</label>
                <select value={userEditForm.role||""} onChange={e=>setUserEditForm(f=>({...f,role:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="brand">{t("aumRoleBrand")}</option>
                  <option value="distributor">{t("aumRoleDist")}</option>
                  <option value="admin">{t("aumRoleAdmin")}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("aumStatus")}</label>
                <select value={userEditForm.status||""} onChange={e=>setUserEditForm(f=>({...f,status:e.target.value}))}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="pending">{t("aumStPending")}</option>
                  <option value="approved">{t("aumStApproved")}</option>
                  <option value="rejected">{t("aumStRejected")}</option>
                </select>
              </div>
            </div>

            {/* Documents section */}
            <div style={{ marginBottom:20 }}>
              <h4 style={{ fontSize:13, color:C.text, marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>
                📄 {t("aumDocs")} ({userDocs.length})
              </h4>
              {userDocs.length === 0 ? (
                <div style={{ padding:"16px", background:C.surface2, borderRadius:10, fontSize:13, color:C.textMuted, textAlign:"center" }}>
                  {t("aumNoDocs")}
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
                          {doc.verified ? "✓ "+t("aumVerified") : t("aumStPending")}
                        </span>
                        <a href={doc.file_url} target="_blank" rel="noreferrer"
                          style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600,
                            background:`${C.blue}15`, border:`1px solid ${C.blue}40`, color:C.blue,
                            textDecoration:"none", cursor:"pointer" }}>{t("aumView")}</a>
                        <button onClick={async () => {
                          await supabase.from("documents").update({ verified: !doc.verified }).eq("id", doc.id);
                          const docs = await loadDocuments(editingUser.id);
                          setUserDocs(docs);
                          notify(doc.verified ? t("aumDocUnverified") : t("aumDocVerified"));
                        }} style={{ padding:"5px 12px", borderRadius:6, fontSize:11,
                          background:`${C.green}10`, border:`1px solid ${C.green}30`, color:C.green, cursor:"pointer" }}>
                          {doc.verified ? t("aumUnverify") : t("aumVerify")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowUserModal(false)} style={{ flex:1, padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>{t("aumCancel")}</button>
              <button onClick={async () => {
                await updateUserProfile(editingUser.id, userEditForm);
                setShowUserModal(false);
              }} style={{ flex:2, padding:"11px", borderRadius:8, cursor:"pointer", background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:13, fontWeight:700 }}>
                {t("aumSave")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      {showAddBrand && (
        <Modal title={t("abrmTitle")} onClose={() => setShowAddBrand(false)} onSave={addBrand}>
          <FormInput label={t("abrmName")} value={brandForm.name} onChange={v=>setBrandForm(f=>({...f,name:v}))} placeholder={t("abrmNamePh")}/>
          <FormInput label={t("abrmOrigin")} value={brandForm.origin} onChange={v=>setBrandForm(f=>({...f,origin:v}))} placeholder={t("abrmOriginPh")}/>
          <FormInput label={t("abrmCategory")} value={brandForm.category} onChange={v=>setBrandForm(f=>({...f,category:v}))} placeholder={t("abrmCategoryPh")}/>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("amodDesc")}</label>
            <textarea value={brandForm.description} onChange={e=>setBrandForm(f=>({...f,description:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", minHeight:80, resize:"vertical" }}/>
          </div>
        </Modal>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <Modal title={editingProduct ? t("aprmTitleEdit") : t("aprmTitleNew")} onClose={() => { setShowAddProduct(false); setEditingProduct(null); }} onSave={saveProduct}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { label:t("aprmName"), key:"name", placeholder:t("aprmNamePh"), mode:"text" },
              { label:"SKU", key:"sku", placeholder:t("aprmSkuPh"), mode:"text" },
              { label:t("aprmCategory"), key:"category", placeholder:t("aprmCategoryPh"), mode:"text" },
              { label:t("aprmSize"), key:"size", placeholder:t("aprmSizePh"), mode:"text" },
              { label:t("aprmPrice"), key:"price", placeholder:"0.00", mode:"decimal" },
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
              <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("aprmBrand")}</label>
              <select value={productForm.brand_id} onChange={e=>setProductForm(f=>({...f,brand_id:e.target.value}))}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                <option value="">{t("aprmSelectBrand")}</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.company_name||b.email}</option>)}
              </select>
            </div>
            {[
              { label:t("aprmOrderMult"), key:"order_multiple", placeholder:t("aprmOrderMultPh") },
              { label:t("aprmMoq"), key:"min_order_qty", placeholder:t("aprmMoqPh") },
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
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("aprmMaxQty")}</label>
            <input
              type="text"
              inputMode="numeric"
              value={productForm.max_order_qty}
              onChange={e => setProductForm(f => ({...f, max_order_qty: e.target.value}))}
              placeholder={t("aprmMaxQtyPh")}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
          
          {/* Image section */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:8 }}>{t("aprmImage")}</label>
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
                  {productForm.image_file ? productForm.image_file.name : t("aprmUploadImg")}
                </span>
              </label>
              {/* URL esterno */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ fontSize:11, color:C.textMuted }}>{t("aprmOrUrl")}</span>
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
            <label style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:5 }}>{t("amodDesc")}</label>
            <textarea value={productForm.description} onChange={e=>setProductForm(f=>({...f,description:e.target.value}))}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", minHeight:70, resize:"vertical" }}/>
          </div>

          <div style={{ padding:"10px 14px", background:`${C.blue}08`, border:`1px solid ${C.blue}15`, borderRadius:8, fontSize:11, color:C.textMuted }}>
            💡 {t("aprmImportPre")} <strong style={{color:C.text}}>Import Excel/CSV</strong> {t("aprmImportPost")}<br/>
            {t("aprmImportCols")}: name, sku, category, price, brand, order_multiple, min_order_qty, description, image_url
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
