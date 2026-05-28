"use client";

import React, { useState, useEffect } from "react";

/* ============================================================
   CASHTA — Trusted Value Movement
   Light theme · winged-money logo · 6 currencies · full-screen map
   Regional merchants per currency. No fake status bar.
   ============================================================ */

// embedded logo (winged money mark)
const LOGO = "data:image/png;base64,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";

const C = {
  bgDeep: "#FFFFFF", bg: "#F4F7F3", card: "#FFFFFF", cardLine: "#E7ECE6",
  green: "#0E9E68", greenBright: "#16C285", mint: "#0B7F52", mintFill: "#7DE0B2",
  paper: "#0A2F22", slate: "#6B7B73", textHi: "#0A2F22", textLo: "#7C8B83",
  yellow: "#F5E663", yellowSoft: "#FBF6C9",
};
const D = { bg: "#0A2F22", bgDeep: "#06160F", card: "#0E3A2B", cardLine: "#1C4A38", green: "#16C285", mint: "#7DE0B2", paper: "#F2F5EE", slate: "#48524D", textLo: "#8FA89B" };

const FONT = "'Satoshi','Inter Tight',system-ui,sans-serif";

const ASSETS = {
  USDT: { sym: "USDT", color: "#26A17B", glyph: "₮" },
  USDC: { sym: "USDC", color: "#2775CA", glyph: "$" },
};

// ---- 6 currencies, each with a city + regionally-styled merchants ----
// Names are inspired-by, intentionally altered from real P2P handles.
const CURRENCIES = {
  AED: { code: "AED", symbol: "د.إ", city: "Dubai", rate: 3.67, flag: "🇦🇪" },
  CNY: { code: "CNY", symbol: "¥", city: "Shenzhen", rate: 7.24, flag: "🇨🇳" },
  VES: { code: "VES", symbol: "Bs", city: "Caracas", rate: 740, flag: "🇻🇪" },
  NGN: { code: "NGN", symbol: "₦", city: "Lagos", rate: 1580, flag: "🇳🇬" },
  VND: { code: "VND", symbol: "₫", city: "Hanoi", rate: 25400, flag: "🇻🇳" },
  INR: { code: "INR", symbol: "₹", city: "Mumbai", rate: 102, flag: "🇮🇳" },
};

// regional merchant pools (10 each). x/y are normalized positions on the city map.
const POOLS = {
  AED: [
    ["RAHEEM-OTC","R","gold"],["MinaDirham","M","silver"],["iddySwap","I","silver"],
    ["NajmTrader","N","gold"],["DubaiCashHub","D","gold"],["AishaLiquidity","A","silver"],
    ["SharafX","S","gold"],["Khalid_Desk","K","silver"],["RoyalDirham","R","gold"],["FatimaFX","F","silver"],
  ],
  CNY: [
    ["二狗商行-极速","二","gold"],["启航优选","启","gold"],["阿拉神灯","阿","silver"],
    ["古天乐安全","古","gold"],["要快乐-沉淀","要","silver"],["老朱实名收付","老","gold"],
    ["钱多多支付","钱","silver"],["稳健通道","稳","gold"],["金牌神盾","金","silver"],["顺丰兑换","顺","gold"],
  ],
  VES: [
    ["FAST-Caracas","F","gold"],["Lmg_traders","L","silver"],["ComercioSeguro","C","gold"],
    ["MaximoPagos","M","silver"],["PagoYa","P","gold"],["EduCambios","E","silver"],
    ["SiSiPay","S","silver"],["BolivarPro","B","gold"],["RapidoVES","R","silver"],["CaracasDesk","C","gold"],
  ],
  NGN: [
    ["NairaKing","N","gold"],["ChiomaPays","C","silver"],["LagosLiquidity","L","gold"],
    ["TundeOTC","T","silver"],["NaijaSwift","N","gold"],["AbujaDesk","A","silver"],
    ["KemiExchange","K","gold"],["FastNaira","F","silver"],["EkoCashHub","E","gold"],["YemiTrades","Y","silver"],
  ],
  VND: [
    ["HanoiFast","H","gold"],["MinhLiquidity","M","silver"],["DongPro","D","gold"],
    ["SaigonDesk","S","silver"],["VietSwift","V","gold"],["LinhExchange","L","silver"],
    ["TuanOTC","T","gold"],["RapidDong","R","silver"],["HaiPhongHub","H","gold"],["AnhTrades","A","silver"],
  ],
  INR: [
    ["CoinLoom","C","gold"],["ZentroPay","Z","silver"],["LedgerTower","L","gold"],
    ["RapidPay","R","silver"],["SmallShark","S","gold"],["RaviTakaTak","R","silver"],
    ["TraderOnDuty","T","silver"],["DipakDesk","D","gold"],["MumbaiSwift","M","gold"],["KiranFX","K","silver"],
  ],
};

const POS = [
  [0.46,0.50],[0.62,0.30],[0.30,0.44],[0.22,0.62],[0.50,0.42],
  [0.16,0.54],[0.55,0.36],[0.38,0.38],[0.52,0.48],[0.34,0.58],
];

function buildMerchants(cur) {
  const base = CURRENCIES[cur].rate;
  return POOLS[cur].map((m, i) => {
    const jitter = 1 + ((i % 5) - 2) * 0.003; // small rate spread
    const rate = +(base * jitter).toFixed(base < 10 ? 3 : base < 1000 ? 2 : 0);
    const trades = [1422,25,93,660,3104,211,884,47,1520,132][i];
    const completion = [100,100,92.1,100,99.8,99.1,100,97.8,99.9,98.5][i];
    const likes = [99.9,100,95.1,99.2,98.4,97.2,99,96.3,98.9,97.8][i];
    return {
      id: cur + i, name: m[0], initial: m[1], tier: m[2],
      trades, completion, likes,
      rates: { USDT: rate, USDC: +(rate * 1.0008).toFixed(base < 10 ? 3 : 0) },
      min: Math.round(base * 100), max: Math.round(base * 6000),
      liq: { USDT: [8714,15907,508,22140,61200,9420,33010,4200,28800,6750][i], USDC: [5210,9100,1200,14000,40300,6100,21000,2800,19500,4300][i] },
      zone: CURRENCIES[cur].city, eta: [10,15,20,12,8,14,11,18,9,16][i], hours: i % 3 === 0 ? "24h" : "9am–11pm",
      x: POS[i][0], y: POS[i][1],
    };
  });
}

const fmt = (n, d = 2) => n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d === 0 ? 0 : undefined });
const assetText = (a) => (a === "USDC" ? C.mint : C.green);

// ============================================================
//  ROOT
// ============================================================
export default function Cashta() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState(null);
  const [side, setSide] = useState("buy");
  const [asset, setAsset] = useState("USDT");
  const [cur, setCur] = useState("AED");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(null);
  const [mobile, setMobile] = useState(false);

  // detect real phone vs desktop. SSR-safe: starts framed, updates on mount.
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const merchants = buildMerchants(cur);

  const screens = (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {screen === "login" && <Login onNext={() => setScreen("role")} />}
      {screen === "role" && <RoleSelect onUser={() => { setRole("user"); setScreen("market"); }} onMerchant={() => { setRole("merchant"); setScreen("merchantDash"); }} />}
      {screen === "market" && <MarketView merchants={merchants} side={side} setSide={setSide} asset={asset} setAsset={setAsset} cur={cur} setCur={setCur} onPick={(m) => { setSelected(m); setAmount(m.min); setScreen("merchant"); }} onBack={() => setScreen("role")} />}
      {screen === "merchant" && selected && <MerchantDetail m={selected} side={side} asset={asset} cur={cur} amount={amount ?? selected.min} setAmount={setAmount} onBack={() => setScreen("market")} onStart={() => setScreen("handshake")} />}
      {screen === "handshake" && selected && <Handshake m={selected} side={side} asset={asset} cur={cur} amount={amount ?? selected.min} onDone={() => setScreen("market")} onCancel={() => setScreen("merchant")} />}
      {screen === "merchantDash" && <MerchantDash cur={cur} onBack={() => setScreen("role")} />}
    </div>
  );

  // PHONE: full-screen, no frame
  if (mobile) {
    return (
      <div style={{ position: "fixed", inset: 0, background: C.bgDeep, fontFamily: FONT, overflow: "hidden" }}>
        <FontLoader />
        {screens}
      </div>
    );
  }

  // DESKTOP: centered phone mockup on a soft backdrop (for demos / investor review)
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% 30%, #E9F0EA, #D2DAD1)", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, padding: 24 }}>
      <FontLoader />
      <div style={{ width: 393, height: 820, background: C.bgDeep, borderRadius: 46, position: "relative", overflow: "hidden", boxShadow: "0 40px 120px -20px rgba(20,40,30,.45), 0 0 0 10px #0c0c0e, 0 0 0 12px #2a2a2e" }}>
        {screens}
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 128, height: 5, borderRadius: 3, background: C.paper, opacity: 0.25, zIndex: 60 }} />
      </div>
    </div>
  );
}

function FontLoader() {
  useEffect(() => {
    const f = document.createElement("link");
    f.rel = "stylesheet";
    f.href = "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap";
    document.head.appendChild(f);
  }, []);
  return null;
}

function Logo({ size = 64 }) {
  return <img src={LOGO} alt="Cashta" width={size} height={size * 0.78} style={{ objectFit: "contain", display: "block" }} />;
}

// ============================================================
//  LOGIN
// ============================================================
function Login({ onNext }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 28px", position: "relative", overflow: "hidden", background: "#FFFFFF" }}>
      {/* very subtle single tint, barely there */}
      <div style={{ position: "absolute", top: -140, right: -140, width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${C.mintFill}22, transparent 70%)` }} />

      {/* centered hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", textAlign: "center" }}>
        {/* logo in rounded badge card */}
        <div style={{ width: 116, height: 116, borderRadius: 32, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px -16px rgba(20,80,55,.28), 0 2px 6px rgba(20,80,55,.08)", border: `1px solid ${C.cardLine}` }}>
          <Logo size={84} />
        </div>
        <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, lineHeight: 0.95, letterSpacing: "-.045em", color: C.paper, margin: "26px 0 0" }}>Cashta</h1>
        <p style={{ fontWeight: 600, fontSize: 12.5, color: C.green, margin: "12px 0 0", letterSpacing: "0.28em", textTransform: "uppercase" }}>Trusted Value Movement</p>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: C.textLo, margin: "18px 0 0", maxWidth: 290 }}>Swap physical cash and stablecoins through verified local merchants — escrow-protected, reputation-scored.</p>
      </div>

      <div style={{ paddingBottom: 46, position: "relative" }}>
        <AuthButton onClick={onNext} variant="google" />
        <div style={{ height: 12 }} />
        <AuthButton onClick={onNext} variant="privy" />
      </div>
    </div>
  );
}
function AuthButton({ onClick, variant }) {
  const google = variant === "google";
  return (
    <button onClick={onClick} style={{ width: "100%", height: 56, borderRadius: 16, border: google ? `1.5px solid ${C.cardLine}` : "none", background: google ? "#fff" : C.green, color: google ? C.textHi : "#fff", boxShadow: google ? "0 1px 2px rgba(20,40,30,.05)" : `0 12px 30px -10px ${C.green}88`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "transform .12s" }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"} onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      {google
        ? <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.97 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z"/></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.7"/><path d="M9 8h4.2a3 3 0 0 1 0 6H11v2.5H9V8zm2 1.8v2.4h2a1.2 1.2 0 0 0 0-2.4h-2z" fill="#fff"/></svg>}
      {google ? "Continue with Google" : "Continue with Privy"}
    </button>
  );
}

// ============================================================
//  ROLE SELECT
// ============================================================
function RoleSelect({ onUser, onMerchant }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 28px 46px" }}>
      <div><Logo size={52} />
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: "-.035em", color: C.paper, margin: "18px 0 6px", lineHeight: 1.02 }}>How will you<br/>use Cashta?</h2>
        <p style={{ fontSize: 14.5, color: C.textLo, margin: 0 }}>Switch roles anytime in settings.</p>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <RoleCard onClick={onUser} accent={C.green} title="I'm a User" desc="Find nearby merchants and swap cash ⇄ stablecoins, escrow-protected." emoji="👤" chips={["Buy & sell USDT / USDC","Cash pickup near me"]}/>
        <RoleCard onClick={onMerchant} accent={C.mint} title="Become a Merchant" desc="Provide liquidity, set your spread, earn on every verified swap." emoji="🏪" chips={["Set your own rate","Stake to earn trust"]}/>
      </div>
    </div>
  );
}
function RoleCard({ onClick, title, desc, emoji, chips, accent }) {
  return (
    <button onClick={onClick} style={{ textAlign: "left", border: `1.5px solid ${C.cardLine}`, background: C.card, borderRadius: 24, padding: 22, cursor: "pointer", transition: "transform .14s, box-shadow .14s, border-color .14s", boxShadow: "0 4px 16px -8px rgba(20,40,30,.12)" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 18px 44px -16px ${accent}66`; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(20,40,30,.12)"; e.currentTarget.style.borderColor = C.cardLine; }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(.985)"} onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 12 }}>
        <div style={{ width: 54, height: 54, borderRadius: 17, background: `linear-gradient(145deg, ${accent}22, ${accent}10)`, border: `1px solid ${accent}26`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `inset 0 1px 2px rgba(255,255,255,.7), 0 6px 14px -8px ${accent}80`, lineHeight: 1 }}>{emoji}</div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: C.paper, letterSpacing: "-.02em" }}>{title}</span>
        <span style={{ marginLeft: "auto", color: accent, fontSize: 22 }}>→</span>
      </div>
      <p style={{ fontSize: 14, color: C.textLo, margin: "0 0 14px", lineHeight: 1.45 }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{chips.map((c) => <span key={c} style={{ fontSize: 11.5, fontWeight: 600, color: accent, background: `${accent}18`, padding: "5px 10px", borderRadius: 8 }}>{c}</span>)}</div>
    </button>
  );
}

// ============================================================
//  MARKET VIEW — currency switcher + full-screen map / list
// ============================================================
function MarketView({ merchants, side, setSide, asset, setAsset, cur, setCur, onPick, onBack }) {
  const [tab, setTab] = useState("map");
  const [hover, setHover] = useState(null);
  const [curOpen, setCurOpen] = useState(false);
  const CUR = CURRENCIES[cur];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep, position: "relative" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={iconBtn}>‹</button>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.paper, letterSpacing: "-.03em", lineHeight: 1 }}>{CUR.flag} {CUR.city}</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginTop: 3 }}>● 10 verified merchants online</div>
          </div>
          <button onClick={() => setCurOpen(v => !v)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${C.cardLine}`, borderRadius: 12, padding: "8px 12px", background: C.card, fontWeight: 700, fontSize: 14, color: C.paper, cursor: "pointer" }}>
            <span style={{ color: C.green }}>{CUR.symbol}</span> {cur} <span style={{ color: C.slate, fontSize: 11 }}>▾</span>
          </button>
        </div>

        {curOpen && (
          <div style={{ position: "absolute", right: 20, top: 58, zIndex: 80, background: "#fff", border: `1.5px solid ${C.cardLine}`, borderRadius: 16, boxShadow: "0 20px 50px -16px rgba(20,40,30,.3)", overflow: "hidden", width: 180 }}>
            {Object.values(CURRENCIES).map((x) => (
              <button key={x.code} onClick={() => { setCur(x.code); setCurOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: "none", borderBottom: `1px solid ${C.cardLine}`, background: cur === x.code ? `${C.green}12` : "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.paper }}>
                <span style={{ fontSize: 18 }}>{x.flag}</span>
                <span>{x.code}</span>
                <span style={{ marginLeft: "auto", color: C.textLo, fontWeight: 500 }}>{x.city}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 3, border: `1px solid ${C.cardLine}` }}>
            {["buy","sell"].map((s) => (
              <button key={s} onClick={() => setSide(s)} style={{ border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", textTransform: "capitalize", transition: "all .15s", background: side === s ? (s === "buy" ? C.green : C.paper) : "transparent", color: side === s ? "#fff" : C.textLo }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 3, border: `1px solid ${C.cardLine}` }}>
            {Object.keys(ASSETS).map((a) => (
              <button key={a} onClick={() => setAsset(a)} style={{ border: "none", borderRadius: 10, padding: "8px 11px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s", background: asset === a ? ASSETS[a].color : "transparent", color: asset === a ? "#fff" : C.textLo }}>
                <Coin sym={a} on={asset === a}/>{a}
              </button>
            ))}
          </div>
          <button onClick={() => setTab(tab === "map" ? "list" : "map")} style={{ marginLeft: "auto", ...iconBtn, fontSize: 15 }}>{tab === "map" ? "≣" : "◎"}</button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12.5, color: C.textLo }}>
          {side === "buy"
            ? <>You pay <b style={{ color: C.mint }}>cash ({cur})</b> → receive <b style={{ color: assetText(asset) }}>{asset}</b></>
            : <>You give <b style={{ color: assetText(asset) }}>{asset}</b> → receive <b style={{ color: C.mint }}>cash ({cur})</b></>}
        </div>
      </div>

      {tab === "map"
        ? <CityMap merchants={merchants} cur={cur} hover={hover} setHover={setHover} onPick={onPick} asset={asset}/>
        : <Listings merchants={merchants} onPick={onPick} side={side} asset={asset} cur={cur}/>}

      <TabBar active="market"/>
    </div>
  );
}

function Coin({ sym, on }) {
  const col = ASSETS[sym].color;
  return <span style={{ width: 16, height: 16, borderRadius: "50%", background: on ? "#fff" : col, color: on ? col : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900 }}>{ASSETS[sym].glyph}</span>;
}

// ============================================================
//  FULL-SCREEN CITY MAP
// ============================================================
function CityMap({ merchants, cur, hover, setHover, onPick, asset }) {
  const [sel, setSel] = useState(null);
  const active = sel || hover;
  const am = merchants.find(m => m.id === active);

  return (
    <div style={{ flex: 1, position: "relative", margin: "14px 0 0", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 393 560" preserveAspectRatio="xMidYMid slice" style={{ display: "block", position: "absolute", inset: 0, background: "linear-gradient(165deg,#EEF4ED,#E3ECE4)" }}>
        {/* water bodies */}
        <path d="M0 0 L393 0 L393 110 Q250 140 200 230 Q165 290 70 340 Q25 365 0 410 Z" fill="#CFE3E6" opacity="0.7"/>
        <path d="M0 0 L393 0 L393 85 Q260 115 215 215 Q175 285 80 335 Q30 362 0 395 Z" fill="#C2DCE0" opacity="0.55"/>
        {/* major diagonal highway */}
        <path d="M30 540 Q180 320 380 90" stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round"/>
        <path d="M30 540 Q180 320 380 90" stroke={C.green} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="2 9" opacity="0.55"/>
        {/* secondary roads */}
        <path d="M10 380 Q160 350 383 380" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9"/>
        <path d="M120 70 Q150 320 130 545" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85"/>
        <path d="M260 80 Q280 300 300 540" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M10 230 Q200 250 383 210" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7"/>
        {/* parks / blocks */}
        <circle cx="300" cy="430" r="40" fill="#9FCFA8" opacity="0.3"/>
        <rect x="60" y="150" width="70" height="55" rx="12" fill="#9FCFA8" opacity="0.25"/>
        <rect x="200" y="380" width="60" height="50" rx="10" fill="#9FCFA8" opacity="0.22"/>
        <text x="300" y="55" fontFamily={FONT} fontSize="10" fill="#7FA0A4" fontWeight="600">WATERFRONT</text>
        <text x="150" y="250" fontFamily={FONT} fontSize="9" fill="#A8B6A0" fontWeight="700" transform="rotate(-34 150 250)" opacity="0.9">MAIN ROAD</text>
      </svg>

      {/* pins */}
      {merchants.map((m, i) => {
        const left = m.x * 393, top = m.y * 560, isAct = active === m.id, isGold = m.tier === "gold";
        return (
          <button key={m.id} onClick={() => setSel(m.id)} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)}
            style={{ position: "absolute", left, top, transform: "translate(-50%,-100%)", border: "none", background: "transparent", cursor: "pointer", zIndex: isAct ? 30 : 10, animation: "drop .5s cubic-bezier(.2,.9,.3,1.3) both", animationDelay: `${i * 45}ms` }}>
            <div style={{ width: isAct ? 44 : 36, height: isAct ? 44 : 36, borderRadius: "50% 50% 50% 2px", transform: "rotate(45deg)", background: isGold ? C.green : "#fff", border: `2.5px solid ${isGold ? C.greenBright : C.green}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .16s", boxShadow: isAct ? `0 12px 26px -6px ${C.green}cc` : "0 4px 12px rgba(20,40,30,.25)" }}>
              <span style={{ transform: "rotate(-45deg)", color: isGold ? "#fff" : C.green, fontWeight: 900, fontSize: isAct ? 15 : 13, fontFamily: FONT }}>{m.initial}</span>
            </div>
          </button>
        );
      })}

      {/* you-are-here */}
      <div style={{ position: "absolute", left: "44%", top: "72%", transform: "translate(-50%,-50%)", zIndex: 5 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#2E7DF6", border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(46,125,246,.2), 0 2px 6px rgba(0,0,0,.2)" }}/>
      </div>

      {/* floating merchant card */}
      {am && (
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, zIndex: 40, background: "#fff", borderRadius: 22, padding: 16, boxShadow: "0 24px 60px -16px rgba(20,40,30,.4)", border: `1.5px solid ${C.cardLine}`, animation: "rise .25s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar m={am} big/>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.paper }}>{am.name}</span>
                {am.tier === "gold" && <GoldBadge/>}
              </div>
              <div style={{ fontSize: 11.5, color: C.textLo, marginTop: 3 }}>{am.trades} trades · <span style={{ color: C.green, fontWeight: 600 }}>{am.completion}%</span> · ≤{am.eta} min</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: C.paper, letterSpacing: "-.02em" }}>{am.rates[asset]}</div>
              <div style={{ fontSize: 10.5, color: C.textLo }}>{CURRENCIES[cur].symbol}/{asset}</div>
            </div>
          </div>
          <button onClick={() => onPick(am)} style={{ width: "100%", marginTop: 14, height: 48, borderRadius: 14, border: "none", background: C.green, color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: FONT, cursor: "pointer", boxShadow: `0 10px 24px -10px ${C.green}` }}>View swap →</button>
        </div>
      )}

      <style>{`@keyframes drop{0%{opacity:0;transform:translate(-50%,-160%)}100%{opacity:1;transform:translate(-50%,-100%)}}@keyframes rise{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ---- list view ----
function Listings({ merchants, onPick, side, asset, cur }) {
  const sym = CURRENCIES[cur].symbol;
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0 90px" }}>
      {merchants.map((m) => (
        <button key={m.id} onClick={() => onPick(m)} style={{ width: "100%", textAlign: "left", border: "none", borderBottom: `1px solid ${C.cardLine}`, background: "transparent", padding: "16px 20px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar m={m}/>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.paper }}>{m.name}</span>
            {m.tier === "gold" && <GoldBadge/>}
          </div>
          <div style={{ display: "flex", gap: 8, margin: "7px 0 0 44px", fontSize: 11.5, color: C.textLo }}>
            <span>{m.trades} trades</span><span>·</span><span style={{ color: C.green, fontWeight: 600 }}>{m.completion}%</span><span>·</span><span>👍 {m.likes}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 25, color: C.paper, letterSpacing: "-.03em", lineHeight: 1 }}>{m.rates[asset]} <span style={{ fontSize: 12, color: C.textLo, fontWeight: 600 }}>{sym}/{asset}</span></div>
              <div style={{ fontSize: 11.5, color: C.textLo, marginTop: 6 }}>Limit {fmt(m.min,0)}–{fmt(m.max,0)} · ≤{m.eta} min</div>
            </div>
            <div style={{ background: side === "buy" ? C.green : C.paper, color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 22px", borderRadius: 12, textTransform: "capitalize" }}>{side}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================
//  MERCHANT DETAIL
// ============================================================
function MerchantDetail({ m, side, asset, cur, amount, setAmount, onBack, onStart }) {
  const rate = m.rates[asset];
  const buy = side === "buy";
  const sym = CURRENCIES[cur].symbol;
  const cryptoGross = amount / rate;
  const fee = cryptoGross * 0.01;
  const cryptoNet = buy ? cryptoGross - fee : cryptoGross;
  const valid = amount >= m.min && amount <= m.max && amount <= (buy ? Infinity : m.liq[asset] * rate);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>‹</button>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>{buy ? "Buy" : "Sell"} {asset}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: buy ? C.green : C.mint, background: `${buy ? C.green : C.mint}1a`, padding: "5px 11px", borderRadius: 9 }}>{buy ? "Cash → Crypto" : "Crypto → Cash"}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 20, padding: 18, boxShadow: "0 4px 16px -10px rgba(20,40,30,.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar m={m} big/>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>{m.name}</span>{m.tier === "gold" && <GoldBadge/>}</div>
              <div style={{ fontSize: 12, color: C.textLo, marginTop: 3 }}>📍 {m.zone} · open {m.hours}</div>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 16, borderTop: `1px solid ${C.cardLine}`, paddingTop: 14 }}>
            <Stat label="Rate" value={rate} sub={sym}/>
            <Stat label="Completion" value={`${m.completion}%`} accent/>
            <Stat label={`${asset} liq.`} value={`${(m.liq[asset]/1000).toFixed(1)}k`}/>
            <Stat label="Pickup" value={`${m.eta}m`}/>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: C.textLo }}>{buy ? "You pay (cash)" : `${cur} to receive`}</label>
          <div style={{ background: C.card, border: `1.5px solid ${valid ? C.cardLine : "#d98a8a"}`, borderRadius: 18, padding: "16px 18px", marginTop: 8, display: "flex", alignItems: "center", boxShadow: "0 4px 16px -10px rgba(20,40,30,.12)" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.mint, marginRight: 8 }}>{sym}</span>
            <input value={amount} onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value.replace(/\D/g,"") || "0")))} inputMode="numeric" style={{ border: "none", outline: "none", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.paper, width: "100%", background: "transparent", letterSpacing: "-.02em" }}/>
            <span style={{ fontSize: 13, color: C.textLo, fontWeight: 600 }}>{cur}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[m.min, Math.round((m.min+m.max)/4), Math.round(m.max/2)].map((q) => (
              <button key={q} onClick={() => setAmount(q)} style={{ flex: 1, border: `1.5px solid ${C.cardLine}`, background: amount === q ? C.green : C.card, color: amount === q ? "#fff" : C.textLo, borderRadius: 10, padding: "9px 0", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{fmt(q,0)}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "12px 14px", background: C.bg, border: `1px solid ${C.cardLine}`, borderRadius: 14 }}>
            <Coin sym={asset}/>
            <span style={{ fontSize: 13, color: C.textLo, fontWeight: 600 }}>{buy ? "You receive" : "You send"}</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 18, color: C.paper }}>{(buy ? cryptoNet : cryptoGross).toFixed(2)} {asset}</span>
          </div>
          {!valid && <div style={{ fontSize: 12, color: "#c0593f", marginTop: 8, fontWeight: 600 }}>Enter between {fmt(m.min,0)} and {fmt(m.max,0)} {cur}{!buy ? ` (merchant has ${(m.liq[asset]/1000).toFixed(1)}k ${asset})` : ""}</div>}
        </div>

        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 18, padding: 16, marginTop: 18, boxShadow: "0 4px 16px -10px rgba(20,40,30,.12)" }}>
          <Row k={buy ? `You receive (${asset})` : "You receive (cash)"} v={buy ? `${cryptoNet.toFixed(2)} ${asset}` : `${fmt(amount,0)} ${cur}`} bold/>
          <Row k="Platform fee (1%)" v={`${fee.toFixed(2)} ${asset}`} muted/>
          <Row k="Settlement" v="On-chain, auto-release" muted/>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 12px", background: `${C.green}14`, borderRadius: 12 }}>
            <LockIcon/>
            <span style={{ fontSize: 12, color: C.mint, fontWeight: 600, lineHeight: 1.4 }}>{buy ? `${cryptoNet.toFixed(2)} ${asset} is locked in escrow from ${m.name} until you both confirm the cash handoff.` : `Your ${cryptoGross.toFixed(2)} ${asset} is locked in escrow until ${m.name} confirms paying you ${fmt(amount,0)} ${cur} in cash.`}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 28px", borderTop: `1px solid ${C.cardLine}`, background: "#fff", boxShadow: "0 -8px 24px -12px rgba(20,40,30,.12)" }}>
        <PrimaryButton disabled={!valid} side={side} onClick={onStart} label={buy ? `Buy ${cryptoNet.toFixed(2)} ${asset}` : `Sell ${cryptoGross.toFixed(2)} ${asset}`}/>
      </div>
    </div>
  );
}
function Stat({ label, value, sub, accent }) {
  return <div style={{ flex: 1, textAlign: "center" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 16, color: accent ? C.green : C.paper }}>{value}{sub && <span style={{ fontSize: 9, color: C.slate, marginLeft: 2 }}>{sub}</span>}</div><div style={{ fontSize: 10.5, color: C.textLo, marginTop: 3 }}>{label}</div></div>;
}
function Row({ k, v, bold, muted }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ fontSize: 13.5, color: muted ? C.slate : C.textLo }}>{k}</span><span style={{ fontSize: bold ? 16 : 13.5, fontWeight: bold ? 900 : 600, color: bold ? C.paper : C.textLo, fontFamily: FONT }}>{v}</span></div>;
}

// ============================================================
//  DUAL-QR ESCROW HANDSHAKE (dark "live session")
// ============================================================
function buildSteps(side, asset, m, cur) {
  const buy = side === "buy";
  return buy ? [
    { key: "locked", label: "Escrow locked", hint: `${asset} from ${m.name} held in Cashta vault`, action: "I'm at the merchant" },
    { key: "scan1", label: "Scan merchant code", hint: "Confirm you're at the right merchant", action: "Scan verification QR" },
    { key: "cash", label: "Hand over cash", hint: `Pay the merchant in ${cur}, in person`, action: "Cash handed over" },
    { key: "paid", label: "Confirm payment", hint: "Optional live proof capture", action: "I Paid" },
    { key: "verify", label: "Merchant verifies cash", hint: "Merchant counts & confirms", action: null },
    { key: "scan2", label: "Scan settlement code", hint: "Final two-sided confirmation", action: "Scan settlement QR" },
    { key: "release", label: `${asset} released to you`, hint: "Auto-settled on-chain", action: "Receive stablecoins" },
  ] : [
    { key: "locked", label: "Your crypto locked", hint: `Your ${asset} held until cash received`, action: "I'm at the merchant" },
    { key: "scan1", label: "Scan merchant code", hint: "Confirm you're at the right merchant", action: "Scan verification QR" },
    { key: "cash", label: "Receive cash", hint: `Merchant pays you ${cur}, in person`, action: "Cash received" },
    { key: "paid", label: "Confirm receipt", hint: "Optional live proof capture", action: "I got the cash" },
    { key: "verify", label: "Merchant confirms payout", hint: "Merchant marks cash paid", action: null },
    { key: "scan2", label: "Scan settlement code", hint: "Final two-sided confirmation", action: "Scan settlement QR" },
    { key: "release", label: `${asset} released to merchant`, hint: "Auto-settled on-chain", action: "Release stablecoins" },
  ];
}
function Handshake({ m, side, asset, cur, amount, onDone, onCancel }) {
  const steps = buildSteps(side, asset, m, cur);
  const [step, setStep] = useState(0);
  const rate = m.rates[asset];
  const cryptoGross = amount / rate;
  const cryptoNet = side === "buy" ? cryptoGross * 0.99 : cryptoGross;
  const cur_ = steps[step], done = step === steps.length - 1;
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  useEffect(() => { if (cur_.key === "verify") { const t = setTimeout(next, 2200); return () => clearTimeout(t); } }, [step]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: done ? D.green : D.bg, transition: "background .5s" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        {!done && <button onClick={onCancel} style={{ ...iconBtn, color: D.paper, borderColor: "rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)" }}>✕</button>}
        <div style={{ color: done ? D.bg : D.paper }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17 }}>{done ? "Swap complete" : `Live ${side} session`}</div>
          <div style={{ fontSize: 12, opacity: .7 }}>with {m.name} · {m.zone}</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 15, color: done ? D.bg : D.paper }}>{cryptoNet.toFixed(2)} <span style={{ fontSize: 10, opacity: .6 }}>{asset}</span></div>
      </div>
      <div style={{ display: "flex", gap: 5, padding: "16px 20px 0" }}>
        {steps.map((s, i) => <div key={s.key} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? (done ? D.bg : D.paper) : "rgba(255,255,255,.18)", transition: "background .3s" }}/>)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center" }}>
        <Stage stepKey={cur_.key} done={done} m={m} net={cryptoNet} asset={asset}/>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: done ? D.bg : D.paper, letterSpacing: "-.03em", margin: "28px 0 8px" }}>{cur_.label}</h2>
        <p style={{ fontSize: 14.5, color: done ? D.bg : "rgba(255,255,255,.72)", opacity: done ? .8 : 1, margin: 0, maxWidth: 270, lineHeight: 1.5 }}>{cur_.hint}</p>
        <div style={{ fontSize: 12, color: done ? D.bg : "rgba(255,255,255,.45)", opacity: .6, marginTop: 14, fontWeight: 600 }}>Step {step + 1} of {steps.length}</div>
      </div>
      <div style={{ padding: "12px 20px 30px" }}>
        {done ? <button onClick={onDone} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", background: D.bg, color: D.paper, fontWeight: 900, fontSize: 16, fontFamily: FONT, cursor: "pointer" }}>Done</button>
          : cur_.action === null ? <div style={{ textAlign: "center", color: "rgba(255,255,255,.7)", fontSize: 14, fontWeight: 600, padding: "18px 0" }}><Spinner/> {cur_.label}…</div>
          : <button onClick={next} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", background: D.paper, color: D.bg, fontWeight: 900, fontSize: 16, fontFamily: FONT, cursor: "pointer", boxShadow: "0 10px 30px -10px rgba(0,0,0,.6)" }}>{cur_.action}</button>}
      </div>
    </div>
  );
}
function Stage({ stepKey, done, m, net, asset }) {
  if (done) return <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pop .5s cubic-bezier(.2,.9,.3,1.4) both" }}><svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={D.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg><style>{`@keyframes pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}`}</style></div>;
  if (stepKey === "scan1" || stepKey === "scan2") return <QRStage settlement={stepKey === "scan2"}/>;
  if (stepKey === "locked") return <VaultStage net={net} asset={asset}/>;
  if (stepKey === "cash") return <div style={{ fontSize: 84, animation: "sway 1.8s ease-in-out infinite" }}>💵<style>{`@keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-8px)}}`}</style></div>;
  if (stepKey === "paid") return <ProofStage/>;
  if (stepKey === "verify") return <VerifyStage m={m}/>;
  return null;
}
function QRStage({ settlement }) {
  const cells = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) { const on = (Math.sin(r*12.9+c*78.2+(settlement?3:0))*43758.5)%1 > 0.45; if (on) cells.push(<rect key={`${r}-${c}`} x={c*9+6} y={r*9+6} width="9" height="9" fill={D.bg}/>); }
  const finder = (x,y) => <g><rect x={x} y={y} width="27" height="27" fill={D.bg}/><rect x={x+4.5} y={y+4.5} width="18" height="18" fill="#fff"/><rect x={x+9} y={y+9} width="9" height="9" fill={D.bg}/></g>;
  return <div style={{ position: "relative", padding: 16, background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px -16px rgba(0,0,0,.5)", animation: "pop .4s ease both" }}><svg width="150" height="150" viewBox="0 0 111 111">{cells}{finder(6,6)}{finder(78,6)}{finder(6,78)}</svg><div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: settlement ? D.mint : D.green, boxShadow: `0 0 10px ${settlement ? D.mint : D.green}`, animation: "scan 1.6s ease-in-out infinite" }}/><style>{`@keyframes scan{0%,100%{transform:translateY(0)}50%{transform:translateY(116px)}}@keyframes pop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}`}</style></div>;
}
function VaultStage({ net, asset }) {
  return <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px dashed rgba(255,255,255,.25)", animation: "spin 14s linear infinite" }}/><div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(255,255,255,.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}><LockIcon big/><span style={{ fontFamily: FONT, fontWeight: 900, color: D.paper, fontSize: 13 }}>{net.toFixed(0)} {asset}</span></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}
function ProofStage() {
  return <div style={{ width: 130, height: 130, borderRadius: 28, border: "3px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><circle cx="12" cy="12.5" r="3.5"/></svg></div>;
}
function VerifyStage({ m }) {
  return <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#fff", animation: "spin 1s linear infinite" }}/><Avatar m={m} big/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
}

// ============================================================
//  MERCHANT DASHBOARD (yellow highlight card from reference)
// ============================================================
function MerchantDash({ cur, onBack }) {
  const [spread, setSpread] = useState(0.8);
  const [a, setA] = useState("USDT");
  const base = CURRENCIES[cur].rate;
  const sym = CURRENCIES[cur].symbol;
  const me = { rate: +(base * (1 + spread/100)).toFixed(base < 10 ? 3 : 0), liq: 18420, today: 12, earned: 642.18 };
  const reqs = [{ n: "Yusuf K.", a: base*900, t: "2 min ago", side: "buy" }, { n: "Lina M.", a: base*300, t: "8 min ago", side: "sell" }, { n: "Omar R.", a: base*2400, t: "15 min ago", side: "buy" }];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>‹</button>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>Merchant console</span>
        <span style={{ marginLeft: "auto" }}><GoldBadge/></span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px" }}>
        {/* yellow earnings hero (reference aesthetic) */}
        <div style={{ background: C.yellow, borderRadius: 24, padding: 22, position: "relative", overflow: "hidden", boxShadow: "0 14px 36px -14px rgba(214,200,60,.7)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#5c5a1e", fontWeight: 700 }}>Earned today</span>
            <span style={{ fontSize: 11, color: "#5c5a1e", fontWeight: 600, background: "rgba(0,0,0,.06)", padding: "4px 10px", borderRadius: 8 }}>{CURRENCIES[cur].flag} {cur}</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, letterSpacing: "-.04em", marginTop: 6, color: "#2a2906" }}>{me.earned} <span style={{ fontSize: 15, opacity: .55 }}>{a}</span></div>
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            <YStat label="Swaps" value={me.today}/><YStat label="Liquidity" value={`${(me.liq/1000).toFixed(1)}k`}/><YStat label="Your rate" value={me.rate}/>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {Object.keys(ASSETS).map((k) => (
            <button key={k} onClick={() => setA(k)} style={{ flex: 1, border: `1.5px solid ${a === k ? ASSETS[k].color : C.cardLine}`, background: a === k ? `${ASSETS[k].color}18` : C.card, color: C.paper, borderRadius: 14, padding: "12px 0", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><Coin sym={k}/>{k} liquidity</button>
          ))}
        </div>

        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 20, padding: 18, marginTop: 14, boxShadow: "0 4px 16px -10px rgba(20,40,30,.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.paper }}>Your spread</span>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 18, color: C.green }}>{spread.toFixed(1)}%</span>
          </div>
          <input type="range" min="0.2" max="2.5" step="0.1" value={spread} onChange={(e) => setSpread(parseFloat(e.target.value))} style={{ width: "100%", marginTop: 14, accentColor: C.green }}/>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textLo, marginTop: 4 }}><span>More volume</span><span>More margin</span></div>
        </div>

        <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 700, fontSize: 14, color: C.textLo }}>Incoming swap requests</div>
        {reqs.map((r, i) => (
          <div key={i} style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 16, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 16px -12px rgba(20,40,30,.12)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: C.mint, fontFamily: FONT }}>{r.n[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.paper }}>{r.n} <span style={{ fontSize: 10, fontWeight: 700, color: r.side === "buy" ? C.green : C.mint, marginLeft: 4 }}>{r.side.toUpperCase()}</span></div>
              <div style={{ fontSize: 11.5, color: C.textLo }}>{fmt(Math.round(r.a),0)} {cur} · {r.t}</div>
            </div>
            <button style={{ border: "none", background: C.green, color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 11, cursor: "pointer" }}>Accept</button>
          </div>
        ))}
      </div>
      <TabBar active="merchant"/>
    </div>
  );
}
function YStat({ label, value }) { return <div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 17, color: "#2a2906" }}>{value}</div><div style={{ fontSize: 10.5, color: "#5c5a1e", opacity: .8, marginTop: 2 }}>{label}</div></div>; }

// ============================================================
//  SHARED
// ============================================================
function Avatar({ m, big }) {
  const s = big ? 48 : 34, gold = m.tier === "gold";
  return <div style={{ position: "relative", width: s, height: s }}><div style={{ width: s, height: s, borderRadius: "50%", background: gold ? C.green : C.bg, color: gold ? "#fff" : C.mint, border: `1.5px solid ${gold ? C.mintFill : C.cardLine}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: big ? 18 : 13 }}>{m.initial}</div><div style={{ position: "absolute", bottom: 0, right: 0, width: s*0.28, height: s*0.28, borderRadius: "50%", background: C.green, border: "2px solid #fff" }}/></div>;
}
const GoldBadge = () => <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: `${C.green}16`, color: C.green, fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 7 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3 5.5L21 8l-4 4 1 6-6-3-6 3 1-6-4-4 6-1.5z"/></svg>VERIFIED</span>;
const LockIcon = ({ big }) => <svg width={big ? 30 : 16} height={big ? 30 : 16} viewBox="0 0 24 24" fill="none" stroke={big ? "#fff" : C.mint} strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
const Spinner = () => <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", verticalAlign: "middle", marginRight: 8 }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></span>;
function PrimaryButton({ label, onClick, disabled, side }) {
  const bg = disabled ? C.cardLine : (side === "sell" ? C.paper : C.green);
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", background: bg, color: disabled ? C.textLo : "#fff", fontWeight: 900, fontSize: 16, fontFamily: FONT, cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : `0 12px 30px -10px ${bg}66`, transition: "all .15s" }}>{label}</button>;
}
function TabBar({ active }) {
  const tabs = [["market","Market",<MShop/>],["orders","Orders",<MClock/>],["chat","Chat",<MChat/>],["profile","Profile",<MUser/>]];
  return <div style={{ borderTop: `1px solid ${C.cardLine}`, background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", display: "flex", padding: "10px 8px 22px" }}>{tabs.map(([k,lbl,icon]) => <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active === k ? C.green : C.textLo }}>{icon}<span style={{ fontSize: 10.5, fontWeight: active === k ? 700 : 500 }}>{lbl}</span></div>)}</div>;
}
const MShop = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9l1-4h12l1 4M4 9v9h14V9M4 9h14" strokeLinejoin="round"/></svg>;
const MClock = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M11 6v5l3 2" strokeLinecap="round"/></svg>;
const MChat = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h14v10H9l-4 3V5z" strokeLinejoin="round"/></svg>;
const MUser = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="7" r="3.5"/><path d="M4 19c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round"/></svg>;
const iconBtn = { width: 36, height: 36, borderRadius: 11, border: `1.5px solid ${C.cardLine}`, background: C.card, color: C.paper, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 };
