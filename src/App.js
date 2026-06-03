import { useState, createContext, useContext } from "react";

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
    loginSubtitle:"Global Brand Distribution Platform",accessAs:"Access as",
    roleBrandLabel:"Brand House",roleBrandDesc:"Full market visibility & distributor control",
    roleDistLabel:"Distributor",roleDistDesc:"Your authorized brands & territory",
    roleAdminLabel:"NexusHub Admin",roleAdminDesc:"Platform-wide oversight",
    demoMode:"Demo mode",demoTryAs:"— Try as Guest",enterPlatform:"Enter Platform →",authenticating:"Authenticating…",
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
    hubConsignment:"Consignment Value",hubConsignmentVal:"€ 1.84M (Lattafa)",
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
    paymentsTitle:"Payment Flow",paymentsSub:"Distributor pays Lattafa directly via SEPA Instant · NexusHub fee auto-split via PSD2",
    payArchLabel:"Automated Payment Architecture · Zero manual intervention",
    payTransLog:"Transaction Log — Automatic Split per Order",
    colGross:"Gross Amount",colBrandShare:"→ Lattafa Receives",colNexusFee:"→ NexusHub Fee",
    colFeePercent:"Fee %",colMethod:"Method",colTime:"Time",
    nodeDistributor:"Distributor",nodeDistributorSub:"Places order on NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Direct transfer to Lattafa",
    nodeLattafa:"Lattafa Account",nodeLattafaSub:"Receives full payment",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Auto notification in seconds",
    nodeNexus:"NexusHub",nodeNexusSub:"Calculates fee automatically",
    nodeGiga:"GigaTrade",nodeGigaSub:"Fee ~11.4% credited",
    marketTitle:"Brand Marketplace",marketSub:"All brands available on NexusHub · Green = already authorized for your territory",
    skusLabel:"SKUs",euDistLabel:"EU Dist.",categoryLabel:"Category",
    viewCatalogBtn:"View My Catalog →",requestSentMsg:"⏳ Request sent — awaiting brand approval",requestAccessBtn:"+ Request Access",
    myCatTitle:"My Authorized Catalog",myCatSub:"Authorized brands for Italy territory · All stock ready in Turin hub · Delivery 48h",
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
    loginSubtitle:"Piattaforma Globale di Distribuzione Brand",accessAs:"Accedi come",
    roleBrandLabel:"Casa Brand",roleBrandDesc:"Visibilità completa del mercato e controllo distributori",
    roleDistLabel:"Distributore",roleDistDesc:"I tuoi brand autorizzati e territorio",
    roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervisione dell'intera piattaforma",
    demoMode:"Demo",demoTryAs:"— Accedi come ospite",enterPlatform:"Entra nella Piattaforma →",authenticating:"Autenticazione…",
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
    hubConsignment:"Valore Consegne",hubConsignmentVal:"€ 1,84M (Lattafa)",
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
    paymentsTitle:"Flusso Pagamenti",paymentsSub:"Il distributore paga Lattafa direttamente via SEPA Instant · Fee NexusHub split automatico via PSD2",
    payArchLabel:"Architettura Pagamenti Automatizzata · Zero interventi manuali",
    payTransLog:"Log Transazioni — Split Automatico per Ordine",
    colGross:"Importo Lordo",colBrandShare:"→ Lattafa Riceve",colNexusFee:"→ Fee NexusHub",
    colFeePercent:"Fee %",colMethod:"Metodo",colTime:"Ora",
    nodeDistributor:"Distributore",nodeDistributorSub:"Effettua ordine su NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Bonifico diretto a Lattafa",
    nodeLattafa:"Conto Lattafa",nodeLattafaSub:"Riceve il pagamento completo",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Notifica automatica in secondi",
    nodeNexus:"NexusHub",nodeNexusSub:"Calcola fee automaticamente",
    nodeGiga:"GigaTrade",nodeGigaSub:"Fee ~11,4% accreditata",
    marketTitle:"Marketplace Brand",marketSub:"Tutti i brand disponibili su NexusHub · Verde = già autorizzati per il tuo territorio",
    skusLabel:"SKU",euDistLabel:"Dist. EU",categoryLabel:"Categoria",
    viewCatalogBtn:"Vai al Mio Catalogo →",requestSentMsg:"⏳ Richiesta inviata — in attesa di approvazione brand",requestAccessBtn:"+ Richiedi Accesso",
    myCatTitle:"Il Mio Catalogo Autorizzato",myCatSub:"Brand autorizzati per il territorio Italia · Stock pronto nell'hub di Torino · Consegna 48h",
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
  fr: {
    loginSubtitle:"Plateforme Mondiale de Distribution de Marques",accessAs:"Accéder en tant que",
    roleBrandLabel:"Maison de Marque",roleBrandDesc:"Visibilité totale du marché et contrôle des distributeurs",
    roleDistLabel:"Distributeur",roleDistDesc:"Vos marques autorisées et territoire",
    roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervision globale de la plateforme",
    demoMode:"Mode démo",demoTryAs:"— Essayer en tant qu'invité",enterPlatform:"Accéder à la Plateforme →",authenticating:"Authentification…",
    portalBrand:"Portail Marque",portalDistributor:"Portail Distributeur",portalAdmin:"Admin",logout:"Déconnexion",
    tabOverview:"Vue d'ensemble",tabApplications:"Candidatures",tabDistributors:"Distributeurs",
    tabCatalog:"Catalogue",tabOrders:"Commandes",tabPayments:"Paiements",
    tabBrandMarket:"Marketplace Marques",tabMyCatalog:"Mon Catalogue",tabMyOrders:"Mes Commandes",
    overviewTitle:"Vue d'ensemble du Marché Européen",overviewSub:"Visibilité en temps réel · Hub : Turin, Italie · 400–500 palettes/mois",
    statTerritories:"Territoires Actifs",statTerritoriesSub:"À l'échelle européenne",
    statDistributors:"Distributeurs",statDistributorsSub:"en attente d'approbation",
    statRevenue:"Chiffre d'affaires mensuel",statRevenueSub:"↑ 18% vs mois dernier",
    statPallets:"Palettes / Mois",statPalletsSub:"Moyenne hub Turin",
    statAlerts:"Alertes Prix",statAlertsSub:"2 haute sévérité",
    priceAlertsTitle:"Alertes Intégrité des Prix",actBtn:"Agir",
    hubStockTitle:"État du Stock Hub · Turin",
    hubTotalSkus:"Total SKU dans le Hub",hubTotalSkusVal:"87 références",
    hubTotalUnits:"Total Unités en Stock",hubTotalUnitsVal:"18 430 unités",
    hubPallets:"Palettes Occupées",hubPalletsVal:"312 / 500 emplacements",
    hubNextContainer:"Prochain Conteneur ETA",hubNextContainerVal:"4 juin depuis Dubaï",
    hubOrdersToday:"Commandes en cours aujourd'hui",hubOrdersTodayVal:"7 actives",
    hubConsignment:"Valeur du Dépôt",hubConsignmentVal:"€ 1,84M (Lattafa)",
    appTitle:"Candidatures Distributeurs",appSub:"Examinez, approuvez ou refusez les entreprises demandant l'accès à votre catalogue",
    submitted:"Soumis le",territory:"Territoire",type:"Type",annualRevenue:"Chiffre d'affaires annuel",yearsActive:"Années d'activité",years:"ans",
    requestedBrands:"Marques demandées :",documentsUploaded:"Documents téléchargés :",
    approveBtn:"✓ Approuver et Activer l'Accès",declineBtn:"✗ Refuser",askMoreBtn:"Demander plus d'informations",
    approvedMsg:"✓ Approuvé — identifiants envoyés automatiquement au distributeur",
    rejectedMsg:"✗ Refusé — le distributeur a été notifié par email",
    distTitle:"Distributeurs Actifs",distSub:"Un partenaire autorisé par territoire · Zéro chevauchement garanti par la plateforme",
    colFlag:"Drapeau",colCompany:"Société",colTerritory:"Territoire",colBrands:"Marques Autorisées",
    colOrders:"Commandes",colRevenue:"CA",colStatus:"Statut",
    catTitle:"Catalogue Produits",catSub:"Tous les SKU disponibles au Hub Européen de Turin · Stock en dépôt · Quantités en temps réel",
    colSku:"SKU",colProduct:"Produit",colSize:"Format",colCategory:"Catégorie",colPrice:"Prix Unitaire",
    colStock:"Stock",colPerPallet:"Par Palette",colMoq:"QMC",
    ordersTitle:"Toutes les Commandes Européennes",ordersSub:"Chaque commande routée via NexusHub Hub · Turin, Italie · Objectif : expédition 48h",
    statOrdersMonth:"Commandes ce mois",statOrdersMonthSub:"↑ 23 vs mois dernier",
    statPalletsShipped:"Palettes Expédiées",statPalletsShippedSub:"Mai 2024",
    statTotalValue:"Valeur Totale",statTotalValueSub:"Mai 2024",
    statAvgDispatch:"Expédition Moy.",statAvgDispatchVal:"1,4 jours",statAvgDispatchSub:"Depuis confirmation commande",
    colOrderId:"N° Commande",colDistributor:"Distributeur",colCountry:"Pays",colItems:"Articles",
    colPallets:"Palettes",colValue:"Valeur",colDate:"Date",colEta:"ETA",delivered:"Livré",
    paymentsTitle:"Flux de Paiement",paymentsSub:"Le distributeur paie Lattafa directement via SEPA Instant · Frais NexusHub répartis automatiquement via PSD2",
    payArchLabel:"Architecture de Paiement Automatisée · Zéro intervention manuelle",
    payTransLog:"Journal des Transactions — Répartition Automatique par Commande",
    colGross:"Montant Brut",colBrandShare:"→ Lattafa Reçoit",colNexusFee:"→ Frais NexusHub",
    colFeePercent:"Frais %",colMethod:"Méthode",colTime:"Heure",
    nodeDistributor:"Distributeur",nodeDistributorSub:"Passe commande sur NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Virement direct à Lattafa",
    nodeLattafa:"Compte Lattafa",nodeLattafaSub:"Reçoit le paiement complet",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Notification automatique en secondes",
    nodeNexus:"NexusHub",nodeNexusSub:"Calcule les frais automatiquement",
    nodeGiga:"GigaTrade",nodeGigaSub:"Frais ~11,4% crédités",
    marketTitle:"Marketplace Marques",marketSub:"Toutes les marques disponibles sur NexusHub · Vert = déjà autorisé pour votre territoire",
    skusLabel:"SKU",euDistLabel:"Dist. EU",categoryLabel:"Catégorie",
    viewCatalogBtn:"Voir Mon Catalogue →",requestSentMsg:"⏳ Demande envoyée — en attente d'approbation",requestAccessBtn:"+ Demander l'Accès",
    myCatTitle:"Mon Catalogue Autorisé",myCatSub:"Marques autorisées pour le territoire France · Stock prêt au hub de Turin · Livraison 48h",
    colBrand:"Marque",colAction:"Action",addBtn:"+ Ajouter",cartLabel:"Passer Commande",cartSub1:"48h depuis Turin · Payer via SEPA Instant",
    myOrdersTitle:"Mes Commandes",myOrdersSub:"Toutes les commandes exécutées depuis NexusHub Hub Européen · Turin, Italie",
    statMyOrders:"Commandes ce mois",statMyOrdersSub:"Mai 2024",statMySpent:"Total Dépensé",statMySpentSub:"Mai 2024",
    statMyDelivery:"Livraison Moy.",statMyDeliveryVal:"1,6 jours",statMyPallets:"Palettes Reçues",statMyPalletsSub:"Mai 2024",
    colPayment:"Paiement",deliveredCheck:"✓ Livré",
    adminTitle:"Vue d'ensemble de la Plateforme",adminSub:"Vue globale sur toutes les marques, distributeurs et transactions",
    statBrands:"Marques Actives",statBrandsSub:"2 en intégration",statAllDist:"Total Distributeurs",statAllDistSub:"À l'échelle européenne",
    statGmv:"GMV Plateforme",statGmvSub:"Mai 2024",statNexusRev:"Revenus NexusHub",statNexusRevSub:"~11,4% frais moyen",
    statAllPallets:"Palettes / Mois",statAllPalletsSub:"Toutes marques",
    adminBrandsTitle:"Marques Actives sur la Plateforme",adminRevenueTitle:"Revenus NexusHub par Marque (Mai)",distributorsLabel:"distributeurs",
  },
  es: {
    loginSubtitle:"Plataforma Global de Distribución de Marcas",accessAs:"Acceder como",
    roleBrandLabel:"Casa de Marca",roleBrandDesc:"Visibilidad total del mercado y control de distribuidores",
    roleDistLabel:"Distribuidor",roleDistDesc:"Tus marcas autorizadas y territorio",
    roleAdminLabel:"Admin NexusHub",roleAdminDesc:"Supervisión global de la plataforma",
    demoMode:"Modo demo",demoTryAs:"— Probar como invitado",enterPlatform:"Acceder a la Plataforma →",authenticating:"Autenticando…",
    portalBrand:"Portal de Marca",portalDistributor:"Portal de Distribuidor",portalAdmin:"Admin",logout:"Cerrar sesión",
    tabOverview:"Resumen",tabApplications:"Solicitudes",tabDistributors:"Distribuidores",
    tabCatalog:"Catálogo",tabOrders:"Pedidos",tabPayments:"Pagos",
    tabBrandMarket:"Mercado de Marcas",tabMyCatalog:"Mi Catálogo",tabMyOrders:"Mis Pedidos",
    overviewTitle:"Resumen del Mercado Europeo",overviewSub:"Visibilidad en tiempo real · Hub: Turín, Italia · 400–500 palés/mes",
    statTerritories:"Territorios Activos",statTerritoriesSub:"En toda Europa",
    statDistributors:"Distribuidores",statDistributorsSub:"pendientes de aprobación",
    statRevenue:"Ingresos Mensuales",statRevenueSub:"↑ 18% vs mes anterior",
    statPallets:"Palés / Mes",statPalletsSub:"Media hub Turín",
    statAlerts:"Alertas de Precio",statAlertsSub:"2 alta severidad",
    priceAlertsTitle:"Alertas de Integridad de Precios",actBtn:"Actuar",
    hubStockTitle:"Estado del Stock Hub · Turín",
    hubTotalSkus:"Total SKU en Hub",hubTotalSkusVal:"87 referencias",
    hubTotalUnits:"Total Unidades en Stock",hubTotalUnitsVal:"18.430 unidades",
    hubPallets:"Palés Ocupados",hubPalletsVal:"312 / 500 espacios",
    hubNextContainer:"Próximo Contenedor ETA",hubNextContainerVal:"4 de junio desde Dubái",
    hubOrdersToday:"Pedidos en Proceso Hoy",hubOrdersTodayVal:"7 activos",
    hubConsignment:"Valor de Consignación",hubConsignmentVal:"€ 1,84M (Lattafa)",
    appTitle:"Solicitudes de Distribuidores",appSub:"Revisa, aprueba o rechaza empresas que solicitan acceso a tu catálogo",
    submitted:"Enviado el",territory:"Territorio",type:"Tipo",annualRevenue:"Ingresos Anuales",yearsActive:"Años de Actividad",years:"años",
    requestedBrands:"Marcas solicitadas:",documentsUploaded:"Documentos subidos:",
    approveBtn:"✓ Aprobar y Habilitar Acceso",declineBtn:"✗ Rechazar",askMoreBtn:"Solicitar Más Información",
    approvedMsg:"✓ Aprobado — credenciales enviadas automáticamente al distribuidor",
    rejectedMsg:"✗ Rechazado — el distribuidor ha sido notificado por email",
    distTitle:"Distribuidores Activos",distSub:"Un socio autorizado por territorio · Sin solapamientos garantizado por la plataforma",
    colFlag:"Bandera",colCompany:"Empresa",colTerritory:"Territorio",colBrands:"Marcas Autorizadas",
    colOrders:"Pedidos",colRevenue:"Ingresos",colStatus:"Estado",
    catTitle:"Catálogo de Productos",catSub:"Todos los SKU disponibles en el Hub Europeo de Turín · Stock en consignación · Cantidades en tiempo real",
    colSku:"SKU",colProduct:"Producto",colSize:"Tamaño",colCategory:"Categoría",colPrice:"Precio Unitario",
    colStock:"Stock",colPerPallet:"Por Palé",colMoq:"MOQ",
    ordersTitle:"Todos los Pedidos Europeos",ordersSub:"Cada pedido enrutado a través de NexusHub Hub · Turín, Italia · Objetivo: envío en 48h",
    statOrdersMonth:"Pedidos Este Mes",statOrdersMonthSub:"↑ 23 vs mes anterior",
    statPalletsShipped:"Palés Enviados",statPalletsShippedSub:"Mayo 2024",
    statTotalValue:"Valor Total",statTotalValueSub:"Mayo 2024",
    statAvgDispatch:"Envío Prom.",statAvgDispatchVal:"1,4 días",statAvgDispatchSub:"Desde confirmación del pedido",
    colOrderId:"ID Pedido",colDistributor:"Distribuidor",colCountry:"País",colItems:"Artículos",
    colPallets:"Palés",colValue:"Valor",colDate:"Fecha",colEta:"ETA",delivered:"Entregado",
    paymentsTitle:"Flujo de Pagos",paymentsSub:"El distribuidor paga a Lattafa directamente vía SEPA Instant · Comisión NexusHub repartida automáticamente vía PSD2",
    payArchLabel:"Arquitectura de Pago Automatizada · Cero intervención manual",
    payTransLog:"Registro de Transacciones — División Automática por Pedido",
    colGross:"Importe Bruto",colBrandShare:"→ Lattafa Recibe",colNexusFee:"→ Comisión NexusHub",
    colFeePercent:"Com. %",colMethod:"Método",colTime:"Hora",
    nodeDistributor:"Distribuidor",nodeDistributorSub:"Realiza pedido en NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Transferencia directa a Lattafa",
    nodeLattafa:"Cuenta Lattafa",nodeLattafaSub:"Recibe el pago completo",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Notificación automática en segundos",
    nodeNexus:"NexusHub",nodeNexusSub:"Calcula comisión automáticamente",
    nodeGiga:"GigaTrade",nodeGigaSub:"Comisión ~11,4% acreditada",
    marketTitle:"Mercado de Marcas",marketSub:"Todas las marcas disponibles en NexusHub · Verde = ya autorizado para tu territorio",
    skusLabel:"SKU",euDistLabel:"Dist. EU",categoryLabel:"Categoría",
    viewCatalogBtn:"Ver Mi Catálogo →",requestSentMsg:"⏳ Solicitud enviada — esperando aprobación de marca",requestAccessBtn:"+ Solicitar Acceso",
    myCatTitle:"Mi Catálogo Autorizado",myCatSub:"Marcas autorizadas para el territorio España · Stock listo en hub de Turín · Entrega 48h",
    colBrand:"Marca",colAction:"Acción",addBtn:"+ Añadir",cartLabel:"Realizar Pedido",cartSub1:"48h desde Turín · Pagar vía SEPA Instant",
    myOrdersTitle:"Mis Pedidos",myOrdersSub:"Todos los pedidos cumplidos desde NexusHub Hub Europeo · Turín, Italia",
    statMyOrders:"Pedidos Este Mes",statMyOrdersSub:"Mayo 2024",statMySpent:"Total Gastado",statMySpentSub:"Mayo 2024",
    statMyDelivery:"Entrega Prom.",statMyDeliveryVal:"1,6 días",statMyPallets:"Palés Recibidos",statMyPalletsSub:"Mayo 2024",
    colPayment:"Pago",deliveredCheck:"✓ Entregado",
    adminTitle:"Resumen de la Plataforma",adminSub:"Vista global de todas las marcas, distribuidores y transacciones",
    statBrands:"Marcas Activas",statBrandsSub:"2 en incorporación",statAllDist:"Total Distribuidores",statAllDistSub:"En toda Europa",
    statGmv:"GMV Plataforma",statGmvSub:"Mayo 2024",statNexusRev:"Ingresos NexusHub",statNexusRevSub:"~11,4% comisión media",
    statAllPallets:"Palés / Mes",statAllPalletsSub:"Todas las marcas",
    adminBrandsTitle:"Marcas Activas en la Plataforma",adminRevenueTitle:"Ingresos NexusHub por Marca (Mayo)",distributorsLabel:"distribuidores",
  },
  de: {
    loginSubtitle:"Globale Marken-Distributions-Plattform",accessAs:"Anmelden als",
    roleBrandLabel:"Markenhaus",roleBrandDesc:"Vollständige Marktsicht und Händlerkontrolle",
    roleDistLabel:"Händler",roleDistDesc:"Ihre autorisierten Marken und Gebiet",
    roleAdminLabel:"NexusHub Admin",roleAdminDesc:"Plattformweite Übersicht",
    demoMode:"Demo-Modus",demoTryAs:"— Als Gast ausprobieren",enterPlatform:"Plattform betreten →",authenticating:"Authentifizierung…",
    portalBrand:"Marken-Portal",portalDistributor:"Händler-Portal",portalAdmin:"Admin",logout:"Abmelden",
    tabOverview:"Übersicht",tabApplications:"Bewerbungen",tabDistributors:"Händler",
    tabCatalog:"Katalog",tabOrders:"Bestellungen",tabPayments:"Zahlungen",
    tabBrandMarket:"Marken-Marktplatz",tabMyCatalog:"Mein Katalog",tabMyOrders:"Meine Bestellungen",
    overviewTitle:"Europäische Marktübersicht",overviewSub:"Echtzeit-Sicht · Hub: Turin, Italien · 400–500 Paletten/Monat",
    statTerritories:"Aktive Gebiete",statTerritoriesSub:"Europaweit",
    statDistributors:"Händler",statDistributorsSub:"warten auf Genehmigung",
    statRevenue:"Monatsumsatz",statRevenueSub:"↑ 18% ggü. Vormonat",
    statPallets:"Paletten / Monat",statPalletsSub:"Durchschnitt Hub Turin",
    statAlerts:"Preisalarme",statAlertsSub:"2 hohe Dringlichkeit",
    priceAlertsTitle:"Preisintegrität-Alarme",actBtn:"Handeln",
    hubStockTitle:"Hub-Lagerbestand · Turin",
    hubTotalSkus:"Gesamt-SKU im Hub",hubTotalSkusVal:"87 Referenzen",
    hubTotalUnits:"Gesamteinheiten auf Lager",hubTotalUnitsVal:"18.430 Einheiten",
    hubPallets:"Belegte Paletten",hubPalletsVal:"312 / 500 Stellplätze",
    hubNextContainer:"Nächster Container ETA",hubNextContainerVal:"4. Juni aus Dubai",
    hubOrdersToday:"Heute in Bearbeitung",hubOrdersTodayVal:"7 aktiv",
    hubConsignment:"Konsignationswert",hubConsignmentVal:"€ 1,84M (Lattafa)",
    appTitle:"Händler-Bewerbungen",appSub:"Prüfen, genehmigen oder ablehnen Sie Unternehmen, die Zugang zu Ihrem Katalog beantragen",
    submitted:"Eingereicht am",territory:"Gebiet",type:"Typ",annualRevenue:"Jahresumsatz",yearsActive:"Jahre Tätigkeit",years:"Jahre",
    requestedBrands:"Angeforderte Marken:",documentsUploaded:"Hochgeladene Dokumente:",
    approveBtn:"✓ Genehmigen und Zugang aktivieren",declineBtn:"✗ Ablehnen",askMoreBtn:"Weitere Informationen anfordern",
    approvedMsg:"✓ Genehmigt — Zugangsdaten automatisch an den Händler gesendet",
    rejectedMsg:"✗ Abgelehnt — Händler wurde per E-Mail benachrichtigt",
    distTitle:"Aktive Händler",distSub:"Ein autorisierter Partner pro Gebiet · Keine Überschneidungen durch Plattform garantiert",
    colFlag:"Flagge",colCompany:"Unternehmen",colTerritory:"Gebiet",colBrands:"Autorisierte Marken",
    colOrders:"Bestellungen",colRevenue:"Umsatz",colStatus:"Status",
    catTitle:"Produktkatalog",catSub:"Alle SKU im Europäischen Hub Turin verfügbar · Konsignationslager · Echtzeitmengen",
    colSku:"SKU",colProduct:"Produkt",colSize:"Größe",colCategory:"Kategorie",colPrice:"Stückpreis",
    colStock:"Bestand",colPerPallet:"Pro Palette",colMoq:"MBM",
    ordersTitle:"Alle Europäischen Bestellungen",ordersSub:"Jede Bestellung über NexusHub Hub · Turin, Italien · Ziel: Versand in 48h",
    statOrdersMonth:"Bestellungen diesen Monat",statOrdersMonthSub:"↑ 23 ggü. Vormonat",
    statPalletsShipped:"Versendete Paletten",statPalletsShippedSub:"Mai 2024",
    statTotalValue:"Gesamtwert",statTotalValueSub:"Mai 2024",
    statAvgDispatch:"Ø Versanddauer",statAvgDispatchVal:"1,4 Tage",statAvgDispatchSub:"Ab Bestellbestätigung",
    colOrderId:"Bestell-ID",colDistributor:"Händler",colCountry:"Land",colItems:"Artikel",
    colPallets:"Paletten",colValue:"Wert",colDate:"Datum",colEta:"ETA",delivered:"Geliefert",
    paymentsTitle:"Zahlungsfluss",paymentsSub:"Händler zahlt Lattafa direkt per SEPA Instant · NexusHub-Gebühr automatisch aufgeteilt per PSD2",
    payArchLabel:"Automatisierte Zahlungsarchitektur · Null manuelle Eingriffe",
    payTransLog:"Transaktionsprotokoll — Automatische Aufteilung pro Bestellung",
    colGross:"Bruttobetrag",colBrandShare:"→ Lattafa erhält",colNexusFee:"→ NexusHub-Gebühr",
    colFeePercent:"Gebühr %",colMethod:"Methode",colTime:"Uhrzeit",
    nodeDistributor:"Händler",nodeDistributorSub:"Gibt Bestellung auf NexusHub auf",
    nodeSepa:"SEPA Instant",nodeSepaSub:"Direktüberweisung an Lattafa",
    nodeLattafa:"Lattafa-Konto",nodeLattafaSub:"Erhält vollständige Zahlung",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"Auto-Benachrichtigung in Sekunden",
    nodeNexus:"NexusHub",nodeNexusSub:"Berechnet Gebühr automatisch",
    nodeGiga:"GigaTrade",nodeGigaSub:"Gebühr ~11,4% gutgeschrieben",
    marketTitle:"Marken-Marktplatz",marketSub:"Alle Marken auf NexusHub · Grün = bereits für Ihr Gebiet autorisiert",
    skusLabel:"SKU",euDistLabel:"EU-Händ.",categoryLabel:"Kategorie",
    viewCatalogBtn:"Meinen Katalog ansehen →",requestSentMsg:"⏳ Anfrage gesendet — warte auf Markengenehmigung",requestAccessBtn:"+ Zugang beantragen",
    myCatTitle:"Mein Autorisierter Katalog",myCatSub:"Autorisierte Marken für Deutschland · Lager bereit in Turin · Lieferung 48h",
    colBrand:"Marke",colAction:"Aktion",addBtn:"+ Hinzufügen",cartLabel:"Bestellung aufgeben",cartSub1:"48h ab Turin · Zahlen per SEPA Instant",
    myOrdersTitle:"Meine Bestellungen",myOrdersSub:"Alle Bestellungen vom NexusHub Europäischen Hub · Turin, Italien",
    statMyOrders:"Bestellungen diesen Monat",statMyOrdersSub:"Mai 2024",statMySpent:"Gesamt ausgegeben",statMySpentSub:"Mai 2024",
    statMyDelivery:"Ø Lieferzeit",statMyDeliveryVal:"1,6 Tage",statMyPallets:"Erhaltene Paletten",statMyPalletsSub:"Mai 2024",
    colPayment:"Zahlung",deliveredCheck:"✓ Geliefert",
    adminTitle:"Plattformübersicht",adminSub:"Globale Sicht auf alle Marken, Händler und Transaktionen",
    statBrands:"Aktive Marken",statBrandsSub:"2 im Onboarding",statAllDist:"Händler gesamt",statAllDistSub:"Europaweit",
    statGmv:"Plattform GMV",statGmvSub:"Mai 2024",statNexusRev:"NexusHub-Umsatz",statNexusRevSub:"~11,4% Ø Gebühr",
    statAllPallets:"Paletten / Monat",statAllPalletsSub:"Alle Marken",
    adminBrandsTitle:"Aktive Marken auf der Plattform",adminRevenueTitle:"NexusHub-Umsatz nach Marke (Mai)",distributorsLabel:"Händler",
  },
  zh: {
    loginSubtitle:"全球品牌分销平台",accessAs:"登录身份",
    roleBrandLabel:"品牌商",roleBrandDesc:"完整市场可视性与分销商管理",
    roleDistLabel:"分销商",roleDistDesc:"您的授权品牌与区域",
    roleAdminLabel:"NexusHub 管理员",roleAdminDesc:"全平台监督",
    demoMode:"演示模式",demoTryAs:"— 以访客身份体验",enterPlatform:"进入平台 →",authenticating:"正在验证…",
    portalBrand:"品牌门户",portalDistributor:"分销商门户",portalAdmin:"管理员",logout:"退出",
    tabOverview:"概览",tabApplications:"申请",tabDistributors:"分销商",
    tabCatalog:"产品目录",tabOrders:"订单",tabPayments:"付款",
    tabBrandMarket:"品牌市场",tabMyCatalog:"我的目录",tabMyOrders:"我的订单",
    overviewTitle:"欧洲市场概览",overviewSub:"实时可视 · 枢纽：意大利都灵 · 每月 400–500 托盘",
    statTerritories:"活跃区域",statTerritoriesSub:"覆盖全欧洲",
    statDistributors:"分销商",statDistributorsSub:"待审批",
    statRevenue:"月度收入",statRevenueSub:"↑ 较上月增长 18%",
    statPallets:"托盘 / 月",statPalletsSub:"都灵枢纽平均",
    statAlerts:"价格预警",statAlertsSub:"2 项高严重级别",
    priceAlertsTitle:"价格完整性预警",actBtn:"处理",
    hubStockTitle:"枢纽库存状态 · 都灵",
    hubTotalSkus:"枢纽总 SKU",hubTotalSkusVal:"87 个品种",
    hubTotalUnits:"库存总单位",hubTotalUnitsVal:"18,430 件",
    hubPallets:"已占托盘位",hubPalletsVal:"312 / 500 个",
    hubNextContainer:"下一批货柜预计到达",hubNextContainerVal:"6月4日 来自迪拜",
    hubOrdersToday:"今日处理中订单",hubOrdersTodayVal:"7 个活跃",
    hubConsignment:"寄售库存价值",hubConsignmentVal:"€ 184万 (Lattafa)",
    appTitle:"分销商申请",appSub:"审核、批准或拒绝申请访问您产品目录的公司",
    submitted:"提交日期",territory:"区域",type:"类型",annualRevenue:"年营业额",yearsActive:"运营年限",years:"年",
    requestedBrands:"申请品牌：",documentsUploaded:"已上传文件：",
    approveBtn:"✓ 批准并开通访问权限",declineBtn:"✗ 拒绝",askMoreBtn:"请求补充信息",
    approvedMsg:"✓ 已批准 — 登录凭证已自动发送给分销商",
    rejectedMsg:"✗ 已拒绝 — 分销商已通过电子邮件收到通知",
    distTitle:"活跃分销商",distSub:"每个区域一个授权合作伙伴 · 平台保证零重叠",
    colFlag:"国旗",colCompany:"公司",colTerritory:"区域",colBrands:"授权品牌",
    colOrders:"订单",colRevenue:"收入",colStatus:"状态",
    catTitle:"产品目录",catSub:"都灵欧洲枢纽全部 SKU · 寄售库存 · 实时数量",
    colSku:"SKU",colProduct:"产品",colSize:"规格",colCategory:"类别",colPrice:"单价",
    colStock:"库存",colPerPallet:"每托盘",colMoq:"最小起订量",
    ordersTitle:"全部欧洲订单",ordersSub:"所有订单经由 NexusHub 枢纽 · 都灵，意大利 · 目标：48小时发货",
    statOrdersMonth:"本月订单",statOrdersMonthSub:"↑ 较上月增加 23 单",
    statPalletsShipped:"已发托盘",statPalletsShippedSub:"2024年5月",
    statTotalValue:"总价值",statTotalValueSub:"2024年5月",
    statAvgDispatch:"平均发货时间",statAvgDispatchVal:"1.4 天",statAvgDispatchSub:"自订单确认起",
    colOrderId:"订单编号",colDistributor:"分销商",colCountry:"国家",colItems:"商品",
    colPallets:"托盘",colValue:"金额",colDate:"日期",colEta:"预计到达",delivered:"已送达",
    paymentsTitle:"付款流程",paymentsSub:"分销商通过 SEPA Instant 直接向 Lattafa 付款 · NexusHub 佣金通过 PSD2 自动分账",
    payArchLabel:"自动化付款架构 · 零人工干预",
    payTransLog:"交易记录 — 每单自动分账",
    colGross:"总金额",colBrandShare:"→ Lattafa 收取",colNexusFee:"→ NexusHub 佣金",
    colFeePercent:"佣金 %",colMethod:"付款方式",colTime:"时间",
    nodeDistributor:"分销商",nodeDistributorSub:"在 NexusHub 下单",
    nodeSepa:"SEPA Instant",nodeSepaSub:"直接转账给 Lattafa",
    nodeLattafa:"Lattafa 账户",nodeLattafaSub:"收到全额付款",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"秒级自动通知",
    nodeNexus:"NexusHub",nodeNexusSub:"自动计算佣金",
    nodeGiga:"GigaTrade",nodeGigaSub:"佣金约 11.4% 入账",
    marketTitle:"品牌市场",marketSub:"NexusHub 上所有可用品牌 · 绿色 = 已为您的区域授权",
    skusLabel:"SKU",euDistLabel:"欧洲经销",categoryLabel:"类别",
    viewCatalogBtn:"查看我的目录 →",requestSentMsg:"⏳ 申请已发送 — 等待品牌审批",requestAccessBtn:"+ 申请访问权限",
    myCatTitle:"我的授权目录",myCatSub:"意大利区域授权品牌 · 都灵枢纽库存就绪 · 48小时配送",
    colBrand:"品牌",colAction:"操作",addBtn:"+ 添加",cartLabel:"提交订单",cartSub1:"都灵发出 48小时 · 通过 SEPA Instant 付款",
    myOrdersTitle:"我的订单",myOrdersSub:"所有订单由 NexusHub 欧洲枢纽 · 都灵发出",
    statMyOrders:"本月订单",statMyOrdersSub:"2024年5月",statMySpent:"累计支出",statMySpentSub:"2024年5月",
    statMyDelivery:"平均配送时间",statMyDeliveryVal:"1.6 天",statMyPallets:"已收托盘",statMyPalletsSub:"2024年5月",
    colPayment:"付款",deliveredCheck:"✓ 已送达",
    adminTitle:"平台概览",adminSub:"所有品牌、分销商和交易的全局视图",
    statBrands:"活跃品牌",statBrandsSub:"2 个正在入驻",statAllDist:"分销商总数",statAllDistSub:"覆盖全欧洲",
    statGmv:"平台 GMV",statGmvSub:"2024年5月",statNexusRev:"NexusHub 收入",statNexusRevSub:"平均佣金约 11.4%",
    statAllPallets:"托盘 / 月",statAllPalletsSub:"所有品牌",
    adminBrandsTitle:"平台活跃品牌",adminRevenueTitle:"NexusHub 各品牌收入（5月）",distributorsLabel:"分销商",
  },
  ar: {
    loginSubtitle:"منصة توزيع العلامات التجارية العالمية",accessAs:"الدخول بصفة",
    roleBrandLabel:"دار العلامة التجارية",roleBrandDesc:"رؤية كاملة للسوق والتحكم في الموزعين",
    roleDistLabel:"موزع",roleDistDesc:"علاماتك التجارية المعتمدة وإقليمك",
    roleAdminLabel:"مدير NexusHub",roleAdminDesc:"الإشراف على المنصة بأكملها",
    demoMode:"وضع تجريبي",demoTryAs:"— جرّب كضيف",enterPlatform:"← دخول المنصة",authenticating:"جارٍ التحقق…",
    portalBrand:"بوابة العلامة التجارية",portalDistributor:"بوابة الموزع",portalAdmin:"المدير",logout:"خروج",
    tabOverview:"نظرة عامة",tabApplications:"الطلبات",tabDistributors:"الموزعون",
    tabCatalog:"الكتالوج",tabOrders:"الطلبيات",tabPayments:"المدفوعات",
    tabBrandMarket:"سوق العلامات",tabMyCatalog:"كتالوجي",tabMyOrders:"طلبياتي",
    overviewTitle:"نظرة عامة على السوق الأوروبية",overviewSub:"رؤية فورية · المركز: تورين، إيطاليا · 400–500 بليت/شهر",
    statTerritories:"المناطق النشطة",statTerritoriesSub:"على مستوى أوروبا",
    statDistributors:"الموزعون",statDistributorsSub:"في انتظار الموافقة",
    statRevenue:"الإيراد الشهري",statRevenueSub:"↑ 18% مقارنة بالشهر الماضي",
    statPallets:"بليت / شهر",statPalletsSub:"متوسط مركز تورين",
    statAlerts:"تنبيهات الأسعار",statAlertsSub:"2 عالية الخطورة",
    priceAlertsTitle:"تنبيهات سلامة الأسعار",actBtn:"تصرف",
    hubStockTitle:"حالة المخزون · تورين",
    hubTotalSkus:"إجمالي SKU في المركز",hubTotalSkusVal:"87 مرجعاً",
    hubTotalUnits:"إجمالي الوحدات في المخزون",hubTotalUnitsVal:"18,430 وحدة",
    hubPallets:"البليتات المشغولة",hubPalletsVal:"312 / 500 مكان",
    hubNextContainer:"موعد الحاوية القادمة",hubNextContainerVal:"4 يونيو من دبي",
    hubOrdersToday:"الطلبيات قيد المعالجة اليوم",hubOrdersTodayVal:"7 نشطة",
    hubConsignment:"قيمة البضاعة الأمانة",hubConsignmentVal:"€ 1.84M (لطافة)",
    appTitle:"طلبات الموزعين",appSub:"راجع واعتمد أو ارفض الشركات التي تطلب الوصول إلى كتالوجك",
    submitted:"تاريخ التقديم",territory:"الإقليم",type:"النوع",annualRevenue:"الإيراد السنوي",yearsActive:"سنوات النشاط",years:"سنوات",
    requestedBrands:"العلامات المطلوبة:",documentsUploaded:"الوثائق المرفوعة:",
    approveBtn:"✓ اعتماد وتفعيل الوصول",declineBtn:"✗ رفض",askMoreBtn:"طلب مزيد من المعلومات",
    approvedMsg:"✓ تمت الموافقة — تم إرسال بيانات الدخول تلقائياً للموزع",
    rejectedMsg:"✗ تم الرفض — تم إشعار الموزع عبر البريد الإلكتروني",
    distTitle:"الموزعون النشطون",distSub:"شريك معتمد واحد لكل إقليم · لا تداخل مضمون من المنصة",
    colFlag:"العلم",colCompany:"الشركة",colTerritory:"الإقليم",colBrands:"العلامات المعتمدة",
    colOrders:"الطلبيات",colRevenue:"الإيراد",colStatus:"الحالة",
    catTitle:"كتالوج المنتجات",catSub:"جميع SKU المتاحة في المركز الأوروبي بتورين · مخزون أمانة · كميات فورية",
    colSku:"SKU",colProduct:"المنتج",colSize:"الحجم",colCategory:"الفئة",colPrice:"سعر الوحدة",
    colStock:"المخزون",colPerPallet:"لكل بليت",colMoq:"الحد الأدنى للطلب",
    ordersTitle:"جميع الطلبيات الأوروبية",ordersSub:"كل طلبية تمر عبر NexusHub Hub · تورين، إيطاليا · هدف: شحن خلال 48 ساعة",
    statOrdersMonth:"الطلبيات هذا الشهر",statOrdersMonthSub:"↑ 23 مقارنة بالشهر الماضي",
    statPalletsShipped:"البليتات المشحونة",statPalletsShippedSub:"مايو 2024",
    statTotalValue:"إجمالي القيمة",statTotalValueSub:"مايو 2024",
    statAvgDispatch:"متوسط الشحن",statAvgDispatchVal:"1.4 أيام",statAvgDispatchSub:"من تأكيد الطلبية",
    colOrderId:"رقم الطلبية",colDistributor:"الموزع",colCountry:"الدولة",colItems:"المنتجات",
    colPallets:"البليتات",colValue:"القيمة",colDate:"التاريخ",colEta:"موعد التسليم",delivered:"تم التسليم",
    paymentsTitle:"تدفق المدفوعات",paymentsSub:"الموزع يدفع لطافة مباشرة عبر SEPA Instant · رسوم NexusHub تُقسم تلقائياً عبر PSD2",
    payArchLabel:"بنية المدفوعات الآلية · صفر تدخل يدوي",
    payTransLog:"سجل المعاملات — تقسيم تلقائي لكل طلبية",
    colGross:"المبلغ الإجمالي",colBrandShare:"← ما تستلمه لطافة",colNexusFee:"← رسوم NexusHub",
    colFeePercent:"نسبة الرسوم",colMethod:"طريقة الدفع",colTime:"الوقت",
    nodeDistributor:"الموزع",nodeDistributorSub:"يضع الطلبية على NexusHub",
    nodeSepa:"SEPA Instant",nodeSepaSub:"تحويل مباشر للطافة",
    nodeLattafa:"حساب لطافة",nodeLattafaSub:"يستلم الدفعة كاملة",
    nodeWebhook:"PSD2 Webhook",nodeWebhookSub:"إشعار تلقائي في ثوانٍ",
    nodeNexus:"NexusHub",nodeNexusSub:"يحسب الرسوم تلقائياً",
    nodeGiga:"GigaTrade",nodeGigaSub:"رسوم ~11.4% مُضافة",
    marketTitle:"سوق العلامات التجارية",marketSub:"جميع العلامات المتاحة على NexusHub · الخضراء = معتمدة لإقليمك",
    skusLabel:"SKU",euDistLabel:"موزعو EU",categoryLabel:"الفئة",
    viewCatalogBtn:"← عرض كتالوجي",requestSentMsg:"⏳ تم الإرسال — في انتظار موافقة العلامة التجارية",requestAccessBtn:"+ طلب وصول",
    myCatTitle:"كتالوجي المعتمد",myCatSub:"علامات معتمدة لإقليم إيطاليا · جميع المخزون جاهز في مركز تورين · تسليم 48 ساعة",
    colBrand:"العلامة",colAction:"إجراء",addBtn:"+ إضافة",cartLabel:"تقديم الطلبية",cartSub1:"48 ساعة من تورين · الدفع عبر SEPA Instant",
    myOrdersTitle:"طلبياتي",myOrdersSub:"جميع الطلبيات مُنفَّذة من NexusHub Hub الأوروبي · تورين، إيطاليا",
    statMyOrders:"الطلبيات هذا الشهر",statMyOrdersSub:"مايو 2024",statMySpent:"إجمالي الإنفاق",statMySpentSub:"مايو 2024",
    statMyDelivery:"متوسط التسليم",statMyDeliveryVal:"1.6 أيام",statMyPallets:"البليتات المستلمة",statMyPalletsSub:"مايو 2024",
    colPayment:"الدفع",deliveredCheck:"✓ تم التسليم",
    adminTitle:"نظرة عامة على المنصة",adminSub:"رؤية شاملة عبر جميع العلامات والموزعين والمعاملات",
    statBrands:"العلامات النشطة",statBrandsSub:"2 في مرحلة الإعداد",statAllDist:"إجمالي الموزعين",statAllDistSub:"على مستوى أوروبا",
    statGmv:"GMV المنصة",statGmvSub:"مايو 2024",statNexusRev:"إيراد NexusHub",statNexusRevSub:"~11.4% متوسط الرسوم",
    statAllPallets:"بليت / شهر",statAllPalletsSub:"جميع العلامات",
    adminBrandsTitle:"العلامات النشطة على المنصة",adminRevenueTitle:"إيراد NexusHub حسب العلامة (مايو)",distributorsLabel:"موزعون",
  },
};

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
        fontFamily:l.key==="ar"||l.key==="zh"?"Arial, sans-serif":"inherit",
        letterSpacing:l.key==="zh"?"0.05em":"inherit",
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

const Login = ({ onLogin, lang, onLangChange }) => {
  const t = useT();
  const [role, setRole] = useState("brand");
  const [loading, setLoading] = useState(false);
  const roles = [
    { key:"brand", icon:"🏛️", label:t("roleBrandLabel"), desc:t("roleBrandDesc"), col:C.gold },
    { key:"distributor", icon:"📦", label:t("roleDistLabel"), desc:t("roleDistDesc"), col:C.blue },
    { key:"admin", icon:"⚙️", label:t("roleAdminLabel"), desc:t("roleAdminDesc"), col:C.purple },
  ];
  const guestNames = { brand:"Lattafa Perfumes", distributor:"GigaTrade S.R.L.", admin:"NexusHub Admin" };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)` }}>
      <div style={{ width:"100%", maxWidth:440, padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div style={{ textAlign:"center", flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, fontSize:24, fontWeight:900, color:C.bg, marginBottom:12, boxShadow:`0 8px 24px ${C.gold}35` }}>N</div>
            <div style={{ fontSize:24, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:4, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t("loginSubtitle")}</div>
          </div>
          <div style={{ marginTop:4 }}><LangSwitcher lang={lang} onChange={onLangChange}/></div>
        </div>
        <div style={{ fontSize:11, color:C.textMuted, marginBottom:8, letterSpacing:"0.08em", textTransform:"uppercase" }}>{t("accessAs")}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {roles.map(r => (
            <button key={r.key} onClick={() => setRole(r.key)} style={{ padding:"12px 16px", borderRadius:10, cursor:"pointer", background:role===r.key?r.col+"15":"transparent", border:`1.5px solid ${role===r.key?r.col:C.border}`, color:role===r.key?r.col:C.textMuted, textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all 0.18s" }}>
              <span style={{ fontSize:20 }}>{r.icon}</span>
              <div><div style={{ fontSize:13, fontWeight:600 }}>{r.label}</div><div style={{ fontSize:11, opacity:0.7, marginTop:1 }}>{r.desc}</div></div>
            </button>
          ))}
        </div>
        <div style={{ background:`${C.gold}08`, border:`1px solid ${C.gold}20`, borderRadius:8, padding:"8px 12px", marginBottom:16, fontSize:11, color:C.textMuted }}>
          <span style={{ color:C.gold }}>{t("demoMode")}</span> {t("demoTryAs")} {guestNames[role]}
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(role); }, 900); }} style={{ width:"100%", padding:"13px", borderRadius:10, cursor:"pointer", background:loading?C.goldDim:`linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, boxShadow:`0 4px 20px ${C.gold}35` }}>
          {loading?t("authenticating"):t("enterPlatform")}
        </button>
      </div>
    </div>
  );
};

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
      <Navbar name="Lattafa Perfumes · Dubai HQ" badge="brand" onLogout={onLogout} lang={lang} onLangChange={onLangChange}/>
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
      <Navbar name="GigaTrade S.R.L. · Italy 🇮🇹" badge="distributor" onLogout={onLogout} lang={lang} onLangChange={onLangChange}/>
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

export default function App() {
  const [screen, setScreen] = useState("login");
  const [lang, setLang] = useState("en");
  const t = key => T[lang]?.[key] ?? T["en"][key] ?? key;
  const dir = LANGS.find(l=>l.key===lang)?.dir ?? "ltr";
  const fontFamily = lang==="ar" ? "'Segoe UI', Tahoma, Arial, sans-serif"
                   : lang==="zh" ? "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
                   : "'Trebuchet MS', sans-serif";
  return (
    <LangCtx.Provider value={{ lang, t, dir }}>
      <div dir={dir} style={{ fontFamily }}>
        {screen==="login"       && <Login onLogin={setScreen} lang={lang} onLangChange={setLang}/>}
        {screen==="brand"       && <BrandDashboard onLogout={()=>setScreen("login")} lang={lang} onLangChange={setLang}/>}
        {screen==="distributor" && <DistributorDashboard onLogout={()=>setScreen("login")} lang={lang} onLangChange={setLang}/>}
        {screen==="admin"       && <AdminDashboard onLogout={()=>setScreen("login")} lang={lang} onLangChange={setLang}/>}
      </div>
    </LangCtx.Provider>
  );
}
