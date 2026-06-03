import { useState } from "react";

const C = {
  bg: "#08080f", surface: "#0f1018", surface2: "#151720", surface3: "#1c1f2e",
  border: "#252838", gold: "#c9a84c", goldLight: "#e2bc6a", goldDim: "#7a5e28",
  text: "#ede9e3", textMuted: "#8890aa", textDim: "#4a4e68",
  green: "#27ae60", red: "#c0392b", blue: "#3d8ef0", purple: "#8e44ad",
};

const BRANDS = [
  { id: "lattafa", name: "Lattafa Perfumes", origin: "Dubai, UAE", logo: "ل", category: "Fine Fragrance", skus: 87, distributors: 34, description: "One of the most recognized Middle Eastern fragrance houses globally, known for rich oud-based compositions and accessible luxury." },
  { id: "rasasi", name: "Rasasi Perfumes", origin: "Dubai, UAE", logo: "ر", category: "Fine Fragrance", skus: 62, distributors: 18, description: "Heritage fragrance house with over 40 years of craftsmanship in Arabic perfumery." },
  { id: "ajmal", name: "Ajmal Perfumes", origin: "Dubai, UAE", logo: "ع", category: "Fine Fragrance & Oud", skus: 94, distributors: 22, description: "Premium Arabic perfume brand with a legacy of rare oud ingredients and Eastern luxury." },
  { id: "armaf", name: "Armaf", origin: "Dubai, UAE", logo: "A", category: "Accessible Luxury", skus: 78, distributors: 29, description: "Fast-growing fragrance brand offering European-inspired luxury at accessible price points." },
];

const PENDING_DISTRIBUTORS = [
  { id: "pd1", company: "Balkan Beauty Group", country: "Albania", flag: "🇦🇱", contact: "Artan Koci", email: "artan@balkanbeauty.al", type: "Regional Distributor", territory: "Albania, Kosovo, North Macedonia", annualRevenue: "€ 2.1M", yearsActivity: 8, requestedBrands: ["lattafa", "rasasi"], submittedDate: "May 27, 2024", documents: ["Company Registration", "Tax Certificate", "Bank Reference"], status: "pending" },
  { id: "pd2", company: "Nordic Scent AB", country: "Sweden", flag: "🇸🇪", contact: "Erik Lindström", email: "erik@nordicscent.se", type: "National Distributor", territory: "Sweden, Norway, Denmark", annualRevenue: "€ 5.8M", yearsActivity: 12, requestedBrands: ["lattafa", "ajmal", "armaf"], submittedDate: "May 25, 2024", documents: ["Company Registration", "Tax Certificate", "Bank Reference", "Insurance Certificate"], status: "pending" },
  { id: "pd3", company: "Iberian Luxury SL", country: "Portugal", flag: "🇵🇹", contact: "Carlos Mendes", email: "carlos@iberianluxury.pt", type: "Regional Distributor", territory: "Portugal", annualRevenue: "€ 1.4M", yearsActivity: 5, requestedBrands: ["lattafa"], submittedDate: "May 23, 2024", documents: ["Company Registration", "Tax Certificate"], status: "under_review" },
];

const ACTIVE_DISTRIBUTORS = [
  { id: "d1", company: "GigaTrade S.R.L.", country: "Italy", flag: "🇮🇹", territory: "Italy", brands: ["lattafa", "rasasi"], orders: 23, revenue: "€ 412K", status: "active" },
  { id: "d2", company: "Deutsche Aromas GmbH", country: "Germany", flag: "🇩🇪", territory: "Germany, Austria", brands: ["lattafa", "ajmal"], orders: 31, revenue: "€ 538K", status: "active" },
  { id: "d3", company: "Marian Distribution SRL", country: "Romania", flag: "🇷🇴", territory: "Romania, Moldova", brands: ["lattafa"], orders: 19, revenue: "€ 187K", status: "active" },
  { id: "d4", company: "Maison Orient SARL", country: "France", flag: "🇫🇷", territory: "France, Belgium", brands: ["lattafa", "armaf"], orders: 18, revenue: "€ 298K", status: "active" },
  { id: "d5", company: "London Luxe Trading", country: "UK", flag: "🇬🇧", territory: "United Kingdom", brands: ["lattafa", "rasasi", "ajmal"], orders: 12, revenue: "€ 310K", status: "active" },
  { id: "d6", company: "Hellas Beauty Ltd", country: "Greece", flag: "🇬🇷", territory: "Greece, Cyprus", brands: ["lattafa"], orders: 4, revenue: "€ 62K", status: "pending" },
];

const CATALOG = [
  { sku: "LT-KHM-100", name: "Khamrah EDP", brand: "lattafa", size: "100ml", category: "Premium", price: 91.00, stock: 310, pallet: 240, moq: 48 },
  { sku: "LT-OOM-100", name: "Oud Mood EDP", brand: "lattafa", size: "100ml", category: "Signature", price: 84.00, stock: 240, pallet: 240, moq: 48 },
  { sku: "LT-AAO-80", name: "Ameer Al Oud", brand: "lattafa", size: "80ml", category: "Oud Collection", price: 67.50, stock: 180, pallet: 288, moq: 48 },
  { sku: "LT-RMS-100", name: "Ramz Silver EDP", brand: "lattafa", size: "100ml", category: "Signature", price: 72.00, stock: 95, pallet: 240, moq: 48 },
  { sku: "LT-WRD-60", name: "Warde EDP", brand: "lattafa", size: "60ml", category: "Floral", price: 54.00, stock: 420, pallet: 360, moq: 72 },
  { sku: "LT-BAB-100", name: "Bab Al Fazza EDP", brand: "lattafa", size: "100ml", category: "Premium", price: 95.00, stock: 60, pallet: 200, moq: 24 },
  { sku: "RS-DAR-100", name: "Daarej EDP", brand: "rasasi", size: "100ml", category: "Heritage", price: 78.00, stock: 160, pallet: 240, moq: 48 },
  { sku: "RS-HUM-100", name: "Humoori EDP", brand: "rasasi", size: "100ml", category: "Signature", price: 65.00, stock: 200, pallet: 240, moq: 48 },
  { sku: "AJ-OUD-50", name: "Ajmal Oud", brand: "ajmal", size: "50ml", category: "Pure Oud", price: 145.00, stock: 80, pallet: 180, moq: 24 },
  { sku: "AM-CLG-100", name: "Club De Nuit", brand: "armaf", size: "100ml", category: "Bestseller", price: 38.00, stock: 520, pallet: 360, moq: 72 },
];

const ORDERS = [
  { id: "NH-2024-1847", distributor: "GigaTrade S.R.L.", country: "Italy", flag: "🇮🇹", items: 340, pallets: 2, value: 28400, status: "shipped", date: "Today 09:14", eta: "Tomorrow" },
  { id: "NH-2024-1846", distributor: "Deutsche Aromas GmbH", country: "Germany", flag: "🇩🇪", items: 520, pallets: 3, value: 43680, status: "processing", date: "Today 07:33", eta: "Jun 1" },
  { id: "NH-2024-1845", distributor: "Marian Distribution SRL", country: "Romania", flag: "🇷🇴", items: 180, pallets: 1, value: 15120, status: "delivered", date: "Yesterday", eta: "Delivered" },
  { id: "NH-2024-1844", distributor: "London Luxe Trading", country: "UK", flag: "🇬🇧", items: 290, pallets: 2, value: 32480, status: "shipped", date: "Yesterday", eta: "Jun 2" },
  { id: "NH-2024-1843", distributor: "Maison Orient SARL", country: "France", flag: "🇫🇷", items: 155, pallets: 1, value: 13020, status: "delivered", date: "May 27", eta: "Delivered" },
];

const PAYMENTS = [
  { id: "NH-2024-1847", distributor: "GigaTrade S.R.L.", country: "Italy", flag: "🇮🇹", gross: 28400, brandShare: 25160, nexusFee: 3240, feePercent: "11.4%", method: "SEPA Instant", time: "Today 09:14:32", status: "settled" },
  { id: "NH-2024-1846", distributor: "Deutsche Aromas GmbH", country: "Germany", flag: "🇩🇪", gross: 43680, brandShare: 38692, nexusFee: 4988, feePercent: "11.4%", method: "SEPA Instant", time: "Today 07:33:18", status: "settled" },
  { id: "NH-2024-1845", distributor: "Marian Distribution SRL", country: "Romania", flag: "🇷🇴", gross: 15120, brandShare: 13396, nexusFee: 1724, feePercent: "11.4%", method: "Wire Transfer", time: "May 28 14:22", status: "settled" },
  { id: "NH-2024-1844", distributor: "London Luxe Trading", country: "UK", flag: "🇬🇧", gross: 32480, brandShare: 28777, nexusFee: 3703, feePercent: "11.4%", method: "SEPA Instant", time: "May 28 11:05", status: "settled" },
];

// ── PRIMITIVES ─────────────────────────────────────────────────────────────────

const fmt = n => "€ " + n.toLocaleString("it-IT");

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
      <span style={{ width:5, height:5, borderRadius:"50%", background:col, display:"inline-block" }} />{label}
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

// Scrollable table wrapper
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
        {rows.map((row, ri) => (
          <tr key={ri} style={{ background: ri%2===0 ? "transparent" : C.surface2+"50", borderTop:`1px solid ${C.border}` }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding:"13px 16px", verticalAlign:"middle", whiteSpace:"nowrap" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Top tab navigation
const TabNav = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", gap:4, marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:0, overflowX:"auto" }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding:"10px 18px", cursor:"pointer", background:"transparent",
        border:"none", borderBottom:`2px solid ${active===t.key ? C.gold : "transparent"}`,
        color: active===t.key ? C.goldLight : C.textMuted,
        fontSize:13, fontWeight: active===t.key ? 600 : 400,
        display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap",
        transition:"all 0.15s", marginBottom:-1,
      }}>
        <span>{t.icon}</span> {t.label}
        {t.badge > 0 && <span style={{ background:C.red, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{t.badge}</span>}
      </button>
    ))}
  </div>
);

// Top navbar
const Navbar = ({ name, badge, onLogout }) => {
  const bCol = { brand:C.gold, distributor:C.blue, admin:C.purple };
  const bLabel = { brand:"Brand Portal", distributor:"Distributor Portal", admin:"Admin" };
  return (
    <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", height:56, position:"sticky", top:0, zIndex:100, gap:10 }}>
      <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.bg }}>N</div>
      <span style={{ fontSize:16, fontWeight:700, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</span>
      <span style={{ padding:"2px 8px", borderRadius:4, background:bCol[badge]+"18", border:`1px solid ${bCol[badge]}30`, fontSize:10, color:bCol[badge], letterSpacing:"0.1em", textTransform:"uppercase" }}>{bLabel[badge]}</span>
      <div style={{ flex:1 }} />
      <span style={{ fontSize:12, color:C.textMuted, marginRight:4 }}>{name}</span>
      <button onClick={onLogout} style={{ padding:"5px 12px", borderRadius:6, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:11 }}>Logout</button>
    </div>
  );
};

// ── LOGIN ──────────────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [role, setRole] = useState("brand");
  const [loading, setLoading] = useState(false);
  const roles = [
    { key:"brand", icon:"🏛️", label:"Brand House", desc:"Full market visibility & distributor control", col:C.gold },
    { key:"distributor", icon:"📦", label:"Distributor", desc:"Your authorized brands & territory", col:C.blue },
    { key:"admin", icon:"⚙️", label:"NexusHub Admin", desc:"Platform-wide oversight", col:C.purple },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Trebuchet MS',sans-serif", backgroundImage:`radial-gradient(ellipse at 20% 50%,${C.gold}08 0%,transparent 60%)` }}>
      <div style={{ width:"100%", maxWidth:420, padding:40, background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, fontSize:24, fontWeight:900, color:C.bg, marginBottom:12, boxShadow:`0 8px 24px ${C.gold}35` }}>N</div>
          <div style={{ fontSize:24, fontWeight:800, color:C.text, fontFamily:"Georgia,serif" }}>NexusHub</div>
          <div style={{ fontSize:11, color:C.textMuted, marginTop:4, letterSpacing:"0.12em", textTransform:"uppercase" }}>B2B Fragrance Distribution Platform</div>
        </div>
        <div style={{ fontSize:11, color:C.textMuted, marginBottom:8, letterSpacing:"0.08em", textTransform:"uppercase" }}>Access as</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
          {roles.map(r => (
            <button key={r.key} onClick={() => setRole(r.key)} style={{ padding:"12px 16px", borderRadius:10, cursor:"pointer", background:role===r.key ? r.col+"15" : "transparent", border:`1.5px solid ${role===r.key ? r.col : C.border}`, color:role===r.key ? r.col : C.textMuted, textAlign:"left", display:"flex", alignItems:"center", gap:12, transition:"all 0.18s" }}>
              <span style={{ fontSize:20 }}>{r.icon}</span>
              <div><div style={{ fontSize:13, fontWeight:600 }}>{r.label}</div><div style={{ fontSize:11, opacity:0.7, marginTop:1 }}>{r.desc}</div></div>
            </button>
          ))}
        </div>
        <div style={{ background:`${C.gold}08`, border:`1px solid ${C.gold}20`, borderRadius:8, padding:"8px 12px", marginBottom:16, fontSize:11, color:C.textMuted }}>
          <span style={{ color:C.gold }}>Demo mode</span> — logging in as {role==="brand" ? "Lattafa Perfumes" : role==="distributor" ? "GigaTrade S.R.L." : "NexusHub Admin"}
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin(role); }, 900); }} style={{ width:"100%", padding:"13px", borderRadius:10, cursor:"pointer", background:loading ? C.goldDim : `linear-gradient(135deg,${C.gold},${C.goldDim})`, border:"none", color:C.bg, fontSize:14, fontWeight:700, boxShadow:`0 4px 20px ${C.gold}35` }}>
          {loading ? "Authenticating…" : "Enter Platform →"}
        </button>
      </div>
    </div>
  );
};

// ── BRAND DASHBOARD ────────────────────────────────────────────────────────────

const BrandDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("overview");
  const [actions, setActions] = useState({});
  const pending = PENDING_DISTRIBUTORS.filter(d => !actions[d.id]).length;

  const tabs = [
    { key:"overview", icon:"◈", label:"Overview" },
    { key:"applications", icon:"📋", label:"Applications", badge:pending },
    { key:"distributors", icon:"⬡", label:"Distributors" },
    { key:"catalog", icon:"◻", label:"Catalog" },
    { key:"orders", icon:"↗", label:"Orders" },
    { key:"payments", icon:"€", label:"Payments" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Trebuchet MS',sans-serif", color:C.text }}>
      <Navbar name="Lattafa Perfumes · Dubai HQ" badge="brand" onLogout={onLogout} />
      <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab} />

        {/* OVERVIEW */}
        {tab==="overview" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>European Market Overview</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Real-time visibility · Hub: Turin, Italy · 400–500 pallets/month</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="⬡" label="Active Territories" value="8" sub="Europe-wide" />
              <Stat icon="◻" label="Distributors" value="34" sub={`${pending} pending approval`} accent={C.blue} />
              <Stat icon="↗" label="Monthly Revenue" value="€ 2.4M" sub="↑ 18% vs last month" />
              <Stat icon="📦" label="Pallets / Month" value="480" sub="Turin hub avg." accent={C.green} />
              <Stat icon="🔔" label="Price Alerts" value="3" sub="2 high severity" accent={C.red} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>🔔 Price Integrity Alerts</h3>
                {[
                  { market:"Amazon.de", product:"Oud Mood EDP 100ml", issue:"Price below MAP", s:"high" },
                  { market:"Amazon.fr", product:"Ameer Al Oud 80ml", issue:"Unauthorized seller", s:"high" },
                  { market:"eBay.it", product:"Ramz Silver EDP", issue:"Possible counterfeit", s:"medium" },
                ].map((a,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:i<2 ? `1px solid ${C.border}` : "none" }}>
                    <Badge status={a.s} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{a.product}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{a.market} · {a.issue}</div>
                    </div>
                    <button style={{ padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:11, background:`${C.red}15`, border:`1px solid ${C.red}40`, color:C.red }}>Act</button>
                  </div>
                ))}
              </div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, color:C.text }}>📦 Hub Stock Status · Turin</h3>
                {[
                  ["Total SKUs in Hub","87 references"],
                  ["Total Units in Stock","18,430 units"],
                  ["Pallets Occupied","312 / 500 slots"],
                  ["Next Container ETA","June 4 from Dubai"],
                  ["Orders Processing Today","7 active"],
                  ["Consignment Value","€ 1.84M (Lattafa)"],
                ].map(([k,v],i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<5 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize:13, color:C.textMuted }}>{k}</span>
                    <span style={{ fontSize:13, color:C.goldLight, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {tab==="applications" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Distributor Applications</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Review, approve or decline companies requesting access to your catalog</p>
            {PENDING_DISTRIBUTORS.map(d => (
              <div key={d.id} style={{ background:C.surface, border:`1px solid ${actions[d.id]==="approved" ? C.green+"60" : actions[d.id]==="rejected" ? C.red+"60" : C.border}`, borderRadius:14, padding:24, marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:50, height:50, borderRadius:12, background:C.surface3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{d.flag}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{d.company}</div>
                      <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{d.contact} · {d.email}</div>
                      <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>Submitted: {d.submittedDate}</div>
                    </div>
                  </div>
                  <Badge status={actions[d.id] || d.status} />
                </div>

                {/* Info grid — scrollable on small screens */}
                <div style={{ overflowX:"auto", marginBottom:14 }}>
                  <div style={{ display:"flex", gap:10, minWidth:500 }}>
                    {[
                      ["Territory", d.territory],
                      ["Type", d.type],
                      ["Annual Revenue", d.annualRevenue],
                      ["Years Active", `${d.yearsActivity} years`],
                    ].map(([k,v],i) => (
                      <div key={i} style={{ background:C.surface2, borderRadius:8, padding:"10px 14px", flex:"1 1 120px", minWidth:120 }}>
                        <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{k}</div>
                        <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>Requested brands:</span>
                  {d.requestedBrands.map(bid => { const b=BRANDS.find(x=>x.id===bid); return b ? <span key={bid} style={{ padding:"3px 10px", borderRadius:6, background:`${C.gold}12`, border:`1px solid ${C.gold}30`, fontSize:12, color:C.gold }}>{b.name}</span> : null; })}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12, color:C.textMuted }}>Documents uploaded:</span>
                  {d.documents.map((doc,i) => <span key={i} style={{ padding:"3px 10px", borderRadius:5, background:`${C.green}10`, border:`1px solid ${C.green}30`, fontSize:12, color:C.green }}>✓ {doc}</span>)}
                </div>

                {!actions[d.id] ? (
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <button onClick={() => setActions(a => ({...a,[d.id]:"approved"}))} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.green}18`, border:`1px solid ${C.green}50`, color:C.green }}>✓ Approve & Enable Access</button>
                    <button onClick={() => setActions(a => ({...a,[d.id]:"rejected"}))} style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, background:`${C.red}12`, border:`1px solid ${C.red}40`, color:C.red }}>✗ Decline</button>
                    <button style={{ padding:"10px 22px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:500, background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted }}>Ask for More Info</button>
                  </div>
                ) : (
                  <div style={{ padding:"11px 16px", borderRadius:8, background:actions[d.id]==="approved" ? `${C.green}12` : `${C.red}12`, border:`1px solid ${actions[d.id]==="approved" ? C.green : C.red}30`, fontSize:13, color:actions[d.id]==="approved" ? C.green : C.red, fontWeight:600 }}>
                    {actions[d.id]==="approved" ? "✓ Approved — login credentials sent automatically to distributor" : "✗ Declined — distributor has been notified via email"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DISTRIBUTORS */}
        {tab==="distributors" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Active Distributors</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>One authorized partner per territory · Zero overlap guaranteed by platform</p>
            <Table
              minWidth={750}
              headers={["Flag", "Company", "Territory", "Authorized Brands", "Orders", "Revenue", "Status"]}
              rows={ACTIVE_DISTRIBUTORS.map(d => [
                <span style={{ fontSize:22 }}>{d.flag}</span>,
                <div><div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{d.company}</div><div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{d.country}</div></div>,
                <span style={{ fontSize:13, color:C.textMuted }}>{d.territory}</span>,
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{d.brands.map(bid => { const b=BRANDS.find(x=>x.id===bid); return b ? <span key={bid} style={{ padding:"2px 8px", borderRadius:5, background:`${C.gold}10`, border:`1px solid ${C.gold}25`, fontSize:11, color:C.gold, whiteSpace:"nowrap" }}>{b.name.split(" ")[0]}</span> : null; })}</div>,
                <span style={{ fontSize:14, fontWeight:700, color:C.goldLight }}>{d.orders}</span>,
                <span style={{ fontSize:14, fontWeight:700, color:C.goldLight }}>{d.revenue}</span>,
                <Badge status={d.status} />,
              ])}
            />
          </div>
        )}

        {/* CATALOG */}
        {tab==="catalog" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Product Catalog</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>All SKUs available in Turin European Hub · Consignment stock · Real-time quantities</p>
            <Table
              minWidth={820}
              headers={["SKU", "Product", "Size", "Category", "Unit Price", "Stock", "Per Pallet", "MOQ"]}
              rows={CATALOG.filter(p=>p.brand==="lattafa").map(p => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{p.sku}</span>,
                <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{p.name}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.size}</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.category}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€ {p.price.toFixed(2)}</span>,
                <span style={{ fontSize:12, color:p.stock>200 ? C.green : p.stock>100 ? C.gold : C.red, fontWeight:600 }}>{p.stock>200?"✓ ":"⚠ "}{p.stock} u.</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.pallet} u.</span>,
                <span style={{ fontSize:12, color:C.textMuted }}>{p.moq} u.</span>,
              ])}
            />
          </div>
        )}

        {/* ORDERS */}
        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>All European Orders</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Every order routed through NexusHub Hub · Turin, Italy · Target: 48h dispatch</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="◻" label="Orders This Month" value="127" sub="↑ 23 vs last month" />
              <Stat icon="📦" label="Pallets Shipped" value="480" sub="May 2024" accent={C.blue} />
              <Stat icon="↗" label="Total Value" value="€ 2.4M" sub="May 2024" />
              <Stat icon="⚡" label="Avg. Dispatch" value="1.4 days" sub="From order confirmation" accent={C.green} />
            </div>
            <Table
              minWidth={900}
              headers={["Order ID", "Distributor", "Country", "Items", "Pallets", "Value", "Status", "Date", "ETA"]}
              rows={ORDERS.map(o => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.id}</span>,
                <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{o.distributor}</span>,
                <span style={{ fontSize:13 }}>{o.flag} {o.country}</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.items} u.</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.pallets}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(o.value)}</span>,
                <Badge status={o.status} />,
                <span style={{ fontSize:12, color:C.textMuted }}>{o.date}</span>,
                <span style={{ fontSize:12, color:o.eta==="Delivered" ? C.green : C.blue, fontWeight:500 }}>{o.eta}</span>,
              ])}
            />
          </div>
        )}

        {/* PAYMENTS */}
        {tab==="payments" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Payment Flow</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Distributor pays Lattafa directly via SEPA Instant · NexusHub fee auto-split via PSD2 open banking</p>

            {/* Architecture diagram */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:22 }}>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.08em" }}>Automated Payment Architecture · Zero manual intervention</div>
              <div style={{ overflowX:"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:700 }}>
                  {[
                    { icon:"🏢", label:"Distributor", sub:"Places order on NexusHub", col:C.blue },
                    "→",
                    { icon:"⚡", label:"SEPA Instant", sub:"Bonifico diretto a Lattafa", col:C.gold },
                    "→",
                    { icon:"🏛️", label:"Lattafa Account", sub:"Riceve il pagamento completo", col:C.green },
                    "→",
                    { icon:"🔔", label:"PSD2 Webhook", sub:"Notifica automatica in secondi", col:C.purple },
                    "→",
                    { icon:"⚙️", label:"NexusHub", sub:"Calcola fee automaticamente", col:C.gold },
                    "→",
                    { icon:"💼", label:"GigaTrade", sub:"Fee ~11.4% accreditata", col:C.goldLight },
                  ].map((s,i) => s==="→" ? (
                    <div key={i} style={{ color:C.textDim, fontSize:18, flexShrink:0 }}>→</div>
                  ) : (
                    <div key={i} style={{ background:C.surface2, border:`1px solid ${s.col}25`, borderRadius:10, padding:"12px 14px", textAlign:"center", flex:"1 1 100px", minWidth:100 }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:s.col }}>{s.label}</div>
                      <div style={{ fontSize:10, color:C.textDim, marginTop:3, lineHeight:1.4 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction log */}
            <h3 style={{ fontSize:14, color:C.text, margin:"0 0 14px" }}>Transaction Log — Automatic Split per Order</h3>
            <Table
              minWidth={900}
              headers={["Order ID", "Distributor", "Country", "Gross Amount", "→ Lattafa Receives", "→ NexusHub Fee", "Fee %", "Method", "Time", "Status"]}
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
                <Badge status={p.status} />,
              ])}
            />
          </div>
        )}

      </div>
    </div>
  );
};

// ── DISTRIBUTOR DASHBOARD ──────────────────────────────────────────────────────

const DistributorDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("brands");
  const [cart, setCart] = useState({});
  const [requested, setRequested] = useState({});
  const myBrands = ["lattafa", "rasasi"];

  const addToCart = sku => setCart(c => ({...c,[sku]:(c[sku]||0)+1}));
  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);
  const cartValue = Object.entries(cart).reduce((s,[sku,qty]) => {
    const item = CATALOG.find(i=>i.sku===sku);
    return s + (item ? item.price * qty : 0);
  }, 0);

  const tabs = [
    { key:"brands", icon:"◈", label:"Brand Marketplace" },
    { key:"catalog", icon:"◻", label:"My Catalog" },
    { key:"orders", icon:"↗", label:"My Orders" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Trebuchet MS',sans-serif", color:C.text }}>
      <Navbar name="GigaTrade S.R.L. · Italy 🇮🇹" badge="distributor" onLogout={onLogout} />
      <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
        <TabNav tabs={tabs} active={tab} onChange={setTab} />

        {/* BRAND MARKETPLACE */}
        {tab==="brands" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Brand Marketplace</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>All brands available on NexusHub · Green brands = already authorized for your territory</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
              {BRANDS.map(brand => {
                const enabled = myBrands.includes(brand.id);
                const req = requested[brand.id];
                return (
                  <div key={brand.id} style={{ background:C.surface, border:`1px solid ${enabled ? C.goldDim : C.border}`, borderTop:`2px solid ${enabled ? C.gold : C.border}`, borderRadius:14, padding:22 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                      <BrandLogo brand={brand} size={46} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{brand.name}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>📍 {brand.origin}</div>
                      </div>
                      {enabled && <Badge status="active" />}
                    </div>
                    <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px", lineHeight:1.55 }}>{brand.description}</p>
                    <div style={{ display:"flex", gap:10, marginBottom:18 }}>
                      {[["SKUs",brand.skus],["EU Dist.",brand.distributors],["Category",brand.category]].map(([k,v],i) => (
                        <div key={i} style={{ background:C.surface2, borderRadius:7, padding:"9px 10px", flex:1, textAlign:"center" }}>
                          <div style={{ fontSize:i<2?15:10, fontWeight:700, color:C.goldLight }}>{v}</div>
                          <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.05em", marginTop:2 }}>{k}</div>
                        </div>
                      ))}
                    </div>
                    {enabled ? (
                      <button onClick={() => setTab("catalog")} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:`${C.gold}20`, border:`1px solid ${C.gold}50`, color:C.goldLight, fontSize:13, fontWeight:600 }}>View My Catalog →</button>
                    ) : req ? (
                      <div style={{ width:"100%", padding:"11px", borderRadius:8, textAlign:"center", background:`${C.blue}10`, border:`1px solid ${C.blue}30`, color:C.blue, fontSize:13 }}>⏳ Request sent — awaiting brand approval</div>
                    ) : (
                      <button onClick={() => setRequested(r=>({...r,[brand.id]:true}))} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:"pointer", background:"transparent", border:`1px solid ${C.border}`, color:C.textMuted, fontSize:13 }}>+ Request Access</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MY CATALOG */}
        {tab==="catalog" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>My Authorized Catalog</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Authorized brands for Italy territory · All stock ready in Turin hub · Delivery 48h</p>
            <Table
              minWidth={850}
              headers={["Brand","SKU","Product","Size","Category","Unit Price","Stock","MOQ","Action"]}
              rows={CATALOG.filter(p=>myBrands.includes(p.brand)).map(item => {
                const brand = BRANDS.find(b=>b.id===item.brand);
                return [
                  brand ? <div style={{ display:"flex", alignItems:"center", gap:7 }}><BrandLogo brand={brand} size={24} /><span style={{ fontSize:12, color:C.textMuted }}>{brand.name.split(" ")[0]}</span></div> : null,
                  <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{item.sku}</span>,
                  <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{item.name}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.size}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.category}</span>,
                  <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>€ {item.price.toFixed(2)}</span>,
                  <span style={{ fontSize:12, color:item.stock>200?C.green:item.stock>100?C.gold:C.red, fontWeight:600 }}>{item.stock>200?"✓ ":"⚠ "}{item.stock}</span>,
                  <span style={{ fontSize:12, color:C.textMuted }}>{item.moq} u.</span>,
                  <button onClick={() => addToCart(item.sku)} style={{ padding:"6px 14px", borderRadius:7, cursor:"pointer", background:cart[item.sku]?`${C.gold}25`:`${C.gold}10`, border:`1px solid ${cart[item.sku]?C.gold:C.gold+"35"}`, color:C.goldLight, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
                    {cart[item.sku] ? `×${cart[item.sku]} · Add` : "+ Add"}
                  </button>,
                ];
              })}
            />
            {cartCount > 0 && (
              <div style={{ position:"fixed", bottom:20, right:24, background:`linear-gradient(135deg,${C.gold},${C.goldDim})`, borderRadius:12, padding:"13px 22px", cursor:"pointer", boxShadow:`0 8px 32px ${C.gold}45`, display:"flex", alignItems:"center", gap:14 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.bg }}>Place Order · {cartCount} items</div>
                  <div style={{ fontSize:12, color:C.bg+"99" }}>€ {cartValue.toLocaleString("it-IT",{minimumFractionDigits:2})} · 48h from Turin · Pay via SEPA Instant</div>
                </div>
                <span style={{ fontSize:18, color:C.bg }}>→</span>
              </div>
            )}
          </div>
        )}

        {/* MY ORDERS */}
        {tab==="orders" && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>My Orders</h2>
            <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>All orders fulfilled from NexusHub European Hub · Turin, Italy</p>
            <div style={{ display:"flex", gap:14, marginBottom:22, flexWrap:"wrap" }}>
              <Stat icon="◻" label="Orders This Month" value="7" sub="May 2024" />
              <Stat icon="↗" label="Total Spent" value="€ 89.2K" sub="May 2024" />
              <Stat icon="⚡" label="Avg. Delivery" value="1.6 days" accent={C.green} />
              <Stat icon="📦" label="Pallets Received" value="12" sub="May 2024" accent={C.blue} />
            </div>
            <Table
              minWidth={800}
              headers={["Order ID","Items","Pallets","Value","Status","Date","ETA","Payment"]}
              rows={ORDERS.slice(0,4).map(o => [
                <span style={{ fontFamily:"monospace", fontSize:11, color:C.gold }}>{o.id}</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.items} units</span>,
                <span style={{ fontSize:13, color:C.textMuted }}>{o.pallets}</span>,
                <span style={{ fontSize:13, fontWeight:700, color:C.goldLight }}>{fmt(o.value)}</span>,
                <Badge status={o.status} />,
                <span style={{ fontSize:12, color:C.textMuted }}>{o.date}</span>,
                <span style={{ fontSize:12, color:o.eta==="Delivered"?C.green:C.blue, fontWeight:500 }}>{o.eta==="Delivered"?"✓ Delivered":`📦 ${o.eta}`}</span>,
                <Badge status="settled" />,
              ])}
            />
          </div>
        )}

      </div>
    </div>
  );
};

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────────

const AdminDashboard = ({ onLogout }) => (
  <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Trebuchet MS',sans-serif", color:C.text }}>
    <Navbar name="NexusHub Admin" badge="admin" onLogout={onLogout} />
    <div style={{ padding:"24px 28px", maxWidth:1400, margin:"0 auto" }}>
      <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"Georgia,serif", margin:"0 0 4px" }}>Platform Overview</h2>
      <p style={{ color:C.textMuted, fontSize:13, margin:"0 0 20px" }}>Global view across all brands, distributors and transactions</p>
      <div style={{ display:"flex", gap:14, marginBottom:26, flexWrap:"wrap" }}>
        <Stat icon="🏛️" label="Active Brands" value="4" sub="2 in onboarding" accent={C.gold} />
        <Stat icon="⬡" label="Total Distributors" value="103" sub="Europe-wide" accent={C.blue} />
        <Stat icon="↗" label="Platform GMV" value="€ 8.9M" sub="May 2024" />
        <Stat icon="💼" label="NexusHub Revenue" value="€ 1.01M" sub="~11.4% avg fee" accent={C.green} />
        <Stat icon="📦" label="Pallets / Month" value="1,840" sub="All brands" accent={C.purple} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:16 }}>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
          <h3 style={{ margin:"0 0 16px", fontSize:14 }}>Active Brands on Platform</h3>
          {BRANDS.map((b,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<BRANDS.length-1?`1px solid ${C.border}`:"none" }}>
              <BrandLogo brand={b} size={34} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{b.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{b.distributors} distributors · {b.skus} SKUs</div>
              </div>
              <Badge status="active" />
            </div>
          ))}
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
          <h3 style={{ margin:"0 0 16px", fontSize:14 }}>NexusHub Revenue by Brand (May)</h3>
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
                <div style={{ height:"100%", width:`${b.pct}%`, background:`linear-gradient(90deg,${C.gold},${C.goldDim})`, borderRadius:3 }} />
              </div>
              <div style={{ fontSize:11, color:C.textDim, marginTop:4 }}>GMV: {b.gmv}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── ROOT ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("login");
  if (screen==="login") return <Login onLogin={setScreen} />;
  if (screen==="brand") return <BrandDashboard onLogout={() => setScreen("login")} />;
  if (screen==="distributor") return <DistributorDashboard onLogout={() => setScreen("login")} />;
  if (screen==="admin") return <AdminDashboard onLogout={() => setScreen("login")} />;
}
