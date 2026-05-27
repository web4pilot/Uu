"use client";

import React, { useState, useEffect } from "react";

/* ============================================================
   CASHTA — Trusted Value Movement
   Two paths. One settlement.
   Brand-matched build (forest green + Satoshi + bowtie mark).
   Fixes: real BUY vs SELL direction, USDT/USDC asset toggle,
   escrow + handshake adapt to trade direction.
   ============================================================ */

const AED = "د.إ";

// brand palette — LIGHT THEME (retuned so brand greens stay legible on white)
// Token names kept stable; only values remapped. Handshake uses the D.* dark set below.
const C = {
  bgDeep: "#FFFFFF",     // app background (white)
  bg: "#F4F7F3",         // subtle off-white surface / page tint
  card: "#FFFFFF",       // raised surface
  cardLine: "#E4EAE3",   // hairline on light
  green: "#0E9E68",      // primary green, darkened from #16C285 to read on white
  greenBright: "#16C285",// original brand green — for fills/icons on dark chips
  mint: "#0B7F52",       // "mint" role now a deep green for TEXT legibility on white
  mintFill: "#7DE0B2",   // original mint — only for fills/badges, never text on white
  paper: "#0A2F22",      // primary text = deep forest (was the off-white)
  slate: "#6B7B73",      // muted text
  textHi: "#0A2F22",     // high-contrast text
  textLo: "#7C8B83",     // secondary text
};

// DARK tokens — used only inside the handshake "live session" screen
const D = {
  bg: "#0A2F22", bgDeep: "#06160F", card: "#0E3A2B", cardLine: "#1C4A38",
  green: "#16C285", mint: "#7DE0B2", paper: "#F2F5EE", slate: "#48524D", textLo: "#8FA89B",
};

const FONT = "'Satoshi','Inter Tight',system-ui,sans-serif";


// assets the user can swap into / out of
const ASSETS = {
  USDT: { sym: "USDT", name: "Tether", color: "#26A17B", peg: 1.0 },
  USDC: { sym: "USDC", name: "USD Coin", color: "#2775CA", peg: 1.0 },
};

// 10 Dubai merchants. rates keyed per asset (AED per 1 unit). x/y normalized on stylized map.
const MERCHANTS = [
  { id: "m1", name: "RAHEEM-TRADER", initial: "R", tier: "gold", trades: 1422, completion: 100, likes: 92.65, rates: { USDT: 3.679, USDC: 3.681 }, min: 500, max: 25000, liq: { USDT: 8714.87, USDC: 5210.0 }, zone: "Business Bay", eta: 10, hours: "24h", x: 0.46, y: 0.52 },
  { id: "m2", name: "Mina520", initial: "M", tier: "silver", trades: 25, completion: 100, likes: 100, rates: { USDT: 3.683, USDC: 3.686 }, min: 500, max: 25000, liq: { USDT: 15907.28, USDC: 9100.0 }, zone: "Deira", eta: 15, hours: "9am–11pm", x: 0.62, y: 0.30 },
  { id: "m3", name: "iddyXchange", initial: "I", tier: "silver", trades: 93, completion: 92.1, likes: 95.06, rates: { USDT: 3.683, USDC: 3.688 }, min: 200, max: 5000, liq: { USDT: 508.5, USDC: 1200.0 }, zone: "Al Barsha", eta: 20, hours: "10am–10pm", x: 0.30, y: 0.46 },
  { id: "m4", name: "Ntrujillo", initial: "N", tier: "gold", trades: 66, completion: 100, likes: 99.22, rates: { USDT: 3.690, USDC: 3.692 }, min: 2500, max: 25000, liq: { USDT: 22140.0, USDC: 14000.0 }, zone: "JLT", eta: 12, hours: "24h", x: 0.22, y: 0.62 },
  { id: "m5", name: "DubaiCashKing", initial: "D", tier: "gold", trades: 3104, completion: 99.8, likes: 98.4, rates: { USDT: 3.677, USDC: 3.679 }, min: 1000, max: 50000, liq: { USDT: 61200.5, USDC: 40300.0 }, zone: "Downtown", eta: 8, hours: "24h", x: 0.50, y: 0.44 },
  { id: "m6", name: "AishaLiquidity", initial: "A", tier: "silver", trades: 211, completion: 99.1, likes: 97.2, rates: { USDT: 3.685, USDC: 3.687 }, min: 300, max: 15000, liq: { USDT: 9420.0, USDC: 6100.0 }, zone: "Marina", eta: 14, hours: "8am–12am", x: 0.16, y: 0.54 },
  { id: "m7", name: "SharafExchange", initial: "S", tier: "gold", trades: 884, completion: 100, likes: 99.0, rates: { USDT: 3.681, USDC: 3.683 }, min: 500, max: 30000, liq: { USDT: 33010.0, USDC: 21000.0 }, zone: "Bur Dubai", eta: 11, hours: "24h", x: 0.55, y: 0.38 },
  { id: "m8", name: "Khalid_OTC", initial: "K", tier: "silver", trades: 47, completion: 97.8, likes: 96.3, rates: { USDT: 3.688, USDC: 3.690 }, min: 1000, max: 10000, liq: { USDT: 4200.0, USDC: 2800.0 }, zone: "Jumeirah", eta: 18, hours: "10am–9pm", x: 0.38, y: 0.40 },
  { id: "m9", name: "RoyalDirham", initial: "R", tier: "gold", trades: 1520, completion: 99.9, likes: 98.9, rates: { USDT: 3.679, USDC: 3.681 }, min: 2000, max: 40000, liq: { USDT: 28800.0, USDC: 19500.0 }, zone: "DIFC", eta: 9, hours: "24h", x: 0.52, y: 0.49 },
  { id: "m10", name: "FatimaFX", initial: "F", tier: "silver", trades: 132, completion: 98.5, likes: 97.8, rates: { USDT: 3.686, USDC: 3.689 }, min: 400, max: 12000, liq: { USDT: 6750.0, USDC: 4300.0 }, zone: "Al Quoz", eta: 16, hours: "9am–10pm", x: 0.34, y: 0.58 },
];

const fmt = (n, d = 2) => n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d === 0 ? 0 : undefined });
// readable accent for an asset name against the dark theme (USDC blue is too dark, use mint)
const assetText = (a) => (a === "USDC" ? C.mint : C.green);

// ============================================================
//  ROOT
// ============================================================
export default function Cashta() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState(null);
  const [side, setSide] = useState("buy");       // buy = pay cash, get crypto | sell = give crypto, get cash
  const [asset, setAsset] = useState("USDT");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(3500);     // always entered in AED

  return (
    <div style={{ minHeight: "100vh", background: "#D7DDD6", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <FontLoader />
      <div style={{
        width: 393, height: 852, background: C.bgDeep, borderRadius: 54, position: "relative", overflow: "hidden",
        boxShadow: "0 40px 120px -20px rgba(20,40,30,.45), 0 0 0 11px #0a0a0a, 0 0 0 13px #2a2a2e",
      }}>
        <StatusBar />
        <div style={{ position: "absolute", inset: 0, paddingTop: 54, display: "flex", flexDirection: "column" }}>
          {screen === "login" && <Login onNext={() => setScreen("role")} />}
          {screen === "role" && (
            <RoleSelect
              onUser={() => { setRole("user"); setScreen("market"); }}
              onMerchant={() => { setRole("merchant"); setScreen("merchantDash"); }}
            />
          )}
          {screen === "market" && (
            <MarketView
              side={side} setSide={setSide} asset={asset} setAsset={setAsset}
              onBack={() => setScreen("role")}
              onPick={(m) => { setSelected(m); setScreen("merchant"); }}
            />
          )}
          {screen === "merchant" && selected && (
            <MerchantDetail
              m={selected} side={side} asset={asset} amount={amount} setAmount={setAmount}
              onBack={() => setScreen("market")} onStart={() => setScreen("handshake")}
            />
          )}
          {screen === "handshake" && selected && (
            <Handshake m={selected} side={side} asset={asset} amount={amount}
              onDone={() => setScreen("market")} onCancel={() => setScreen("merchant")} />
          )}
          {screen === "merchantDash" && <MerchantDash asset={asset} onBack={() => setScreen("role")} />}
        </div>
        <HomeIndicator />
      </div>
    </div>
  );
}

// ============================================================
//  CHROME
// ============================================================
function FontLoader() {
  useEffect(() => {
    const f = document.createElement("link");
    f.rel = "stylesheet";
    f.href = "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap";
    document.head.appendChild(f);
  }, []);
  return null;
}
function StatusBar() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 54, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 30px 8px", pointerEvents: "none" }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: C.textHi }}>10:50</span>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        <svg width="18" height="12" viewBox="0 0 18 12"><g fill={C.textHi}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></g></svg>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.textHi }}>5G</span>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke={C.textHi} strokeOpacity="0.4" /><rect x="2" y="2" width="19" height="9" rx="2" fill={C.textHi} /><rect x="24" y="4" width="2" height="5" rx="1" fill={C.textHi} fillOpacity="0.4" /></svg>
      </div>
    </div>
  );
}
const HomeIndicator = () => <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 3, background: C.textHi, opacity: 0.6, zIndex: 60 }} />;

// ---- THE BRAND MARK: two converging paths / bowtie ----
function CashtaMark({ size = 44, dark = false }) {
  // left path = green, right path = mint, meeting at a center knot
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 100 78" fill="none">
      {/* left wing (top + bottom) converging to center */}
      <path d="M6 6 C30 14, 38 30, 50 39 C38 48, 30 64, 6 72 C6 50, 16 39, 22 39 C16 39, 6 28, 6 6 Z" fill={C.green} />
      {/* right wing */}
      <path d="M94 6 C70 14, 62 30, 50 39 C62 48, 70 64, 94 72 C94 50, 84 39, 78 39 C84 39, 94 28, 94 6 Z" fill={C.mint} />
    </svg>
  );
}
function MarkTile({ size = 40, radius }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius ?? size * 0.28, background: C.bg, border: `1px solid ${C.cardLine}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CashtaMark size={size * 0.62} />
    </div>
  );
}

// ============================================================
//  1. LOGIN
// ============================================================
function Login({ onNext }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -120, width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${C.mintFill}33, transparent 68%)` }} />
      <div style={{ position: "absolute", bottom: 30, left: -130, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.greenBright}14, transparent 70%)` }} />
      {/* faint guilloche lines like the card */}
      <svg style={{ position: "absolute", top: 120, left: 0, opacity: .35 }} width="393" height="200" viewBox="0 0 393 200" fill="none">
        {[...Array(7)].map((_, i) => <path key={i} d={`M-20 ${40 + i * 22} Q196 ${i * 18} 420 ${60 + i * 20}`} stroke={C.mintFill} strokeWidth="1" fill="none" />)}
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <CashtaMark size={72} />
        <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, lineHeight: 0.95, letterSpacing: "-.04em", color: C.paper, margin: "24px 0 0" }}>Cashta</h1>
        <p style={{ fontWeight: 500, fontSize: 13, color: C.green, margin: "12px 0 0", letterSpacing: "0.32em", textTransform: "uppercase" }}>Trusted Value Movement</p>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: C.textLo, margin: "20px 0 0", maxWidth: 300 }}>
          Two paths, one settlement. Swap physical cash and stablecoins through verified local merchants — escrow-protected, reputation-scored.
        </p>
      </div>

      <div style={{ paddingBottom: 46, position: "relative" }}>
        <AuthButton onClick={onNext} variant="google" />
        <div style={{ height: 12 }} />
        <AuthButton onClick={onNext} variant="privy" />
        <p style={{ textAlign: "center", fontSize: 11.5, color: C.slate, marginTop: 18, lineHeight: 1.5 }}>By continuing you agree to Cashta's Terms &amp; KYC policy.</p>
      </div>
    </div>
  );
}
function AuthButton({ onClick, variant }) {
  const google = variant === "google";
  return (
    <button onClick={onClick} style={{
      width: "100%", height: 56, borderRadius: 16, border: google ? `1.5px solid ${C.cardLine}` : "none",
      background: google ? "#fff" : C.green, color: google ? C.textHi : "#fff",
      boxShadow: google ? "0 1px 2px rgba(20,40,30,.05)" : `0 12px 30px -10px ${C.green}88`,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "transform .12s",
    }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(.98)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      {google
        ? <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" /><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" /><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.97 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z" /></svg>
        : <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.7" /><path d="M9 8h4.2a3 3 0 0 1 0 6H11v2.5H9V8zm2 1.8v2.4h2a1.2 1.2 0 0 0 0-2.4h-2z" fill="#fff" /></svg>}
      {google ? "Continue with Google" : "Continue with Privy"}
    </button>
  );
}

// ============================================================
//  2. ROLE SELECT
// ============================================================
function RoleSelect({ onUser, onMerchant }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 28px 46px" }}>
      <div style={{ marginTop: 22 }}>
        <CashtaMark size={40} />
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, letterSpacing: "-.035em", color: C.paper, margin: "20px 0 6px", lineHeight: 1.02 }}>How will you<br />use Cashta?</h2>
        <p style={{ fontSize: 14.5, color: C.textLo, margin: 0 }}>Switch roles anytime in settings.</p>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <RoleCard onClick={onUser} accent={C.green} title="I'm a User" desc="Find nearby merchants and swap cash ⇄ stablecoins, escrow-protected." icon={<UserIcon />} chips={["Buy & sell USDT / USDC", "Cash pickup near me"]} />
        <RoleCard onClick={onMerchant} accent={C.mint} title="Become a Merchant" desc="Provide liquidity, set your spread, earn on every verified swap." icon={<ShopIcon />} chips={["Set your own rate", "Stake to earn trust"]} />
      </div>
    </div>
  );
}
function RoleCard({ onClick, title, desc, icon, chips, accent }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left", border: `1.5px solid ${C.cardLine}`, background: C.card, borderRadius: 24, padding: 22, cursor: "pointer", transition: "transform .14s, box-shadow .14s, border-color .14s",
      boxShadow: "0 4px 16px -8px rgba(20,40,30,.12)",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 18px 44px -16px ${accent}66`; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(20,40,30,.12)"; e.currentTarget.style.borderColor = C.cardLine; }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(.985)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: `${accent}1f`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: C.paper, letterSpacing: "-.02em" }}>{title}</span>
        <span style={{ marginLeft: "auto", color: accent, fontSize: 22 }}>→</span>
      </div>
      <p style={{ fontSize: 14, color: C.textLo, margin: "0 0 14px", lineHeight: 1.45 }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chips.map((c) => <span key={c} style={{ fontSize: 11.5, fontWeight: 600, color: accent, background: `${accent}18`, padding: "5px 10px", borderRadius: 8 }}>{c}</span>)}
      </div>
    </button>
  );
}
const UserIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" /></svg>;
const ShopIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9l1.2-4.5h13.6L20 9M4 9v10h16V9M4 9h16M9 19v-5h6v5" strokeLinejoin="round" strokeLinecap="round" /></svg>;

// ============================================================
//  3. MARKET VIEW
// ============================================================
function MarketView({ side, setSide, asset, setAsset, onBack, onPick }) {
  const [tab, setTab] = useState("map");
  const [hover, setHover] = useState(null);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep }}>
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={iconBtn}>‹</button>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.paper, letterSpacing: "-.03em", lineHeight: 1 }}>Dubai</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginTop: 2 }}>● 10 verified merchants online</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${C.cardLine}`, borderRadius: 12, padding: "8px 12px", background: C.card, fontWeight: 700, fontSize: 14, color: C.paper }}>
            <span style={{ color: C.mint }}>{AED}</span> AED <span style={{ color: C.slate, fontSize: 11 }}>▼</span>
          </div>
        </div>

        {/* BUY/SELL + asset toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <div style={{ display: "flex", background: C.card, borderRadius: 12, padding: 3, border: `1px solid ${C.cardLine}` }}>
            {["buy", "sell"].map((s) => (
              <button key={s} onClick={() => setSide(s)} style={{
                border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", textTransform: "capitalize", transition: "all .15s",
                background: side === s ? (s === "buy" ? C.green : C.paper) : "transparent",
                color: side === s ? C.bg : C.textLo,
              }}>{s}</button>
            ))}
          </div>
          {/* asset toggle */}
          <div style={{ display: "flex", background: C.card, borderRadius: 12, padding: 3, border: `1px solid ${C.cardLine}` }}>
            {Object.keys(ASSETS).map((a) => (
              <button key={a} onClick={() => setAsset(a)} style={{
                border: "none", borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .15s",
                background: asset === a ? ASSETS[a].color : "transparent", color: asset === a ? "#fff" : C.textLo,
              }}>
                <Coin sym={a} on={asset === a} />{a}
              </button>
            ))}
          </div>
          <button onClick={() => setTab(tab === "map" ? "list" : "map")} style={{ marginLeft: "auto", ...iconBtn, fontSize: 16 }}>
            {tab === "map" ? "≣" : "◎"}
          </button>
        </div>

        {/* direction explainer */}
        <div style={{ marginTop: 12, fontSize: 12.5, color: C.textLo, display: "flex", alignItems: "center", gap: 7 }}>
          {side === "buy"
            ? <>You pay <b style={{ color: C.mint }}>cash (AED)</b> → receive <b style={{ color: assetText(asset) }}>{asset}</b></>
            : <>You give <b style={{ color: assetText(asset) }}>{asset}</b> → receive <b style={{ color: C.mint }}>cash (AED)</b></>}
        </div>
      </div>

      {tab === "map"
        ? <DubaiMap hover={hover} setHover={setHover} onPick={onPick} asset={asset} />
        : <Listings onPick={onPick} side={side} asset={asset} />}

      <TabBar active="market" />
    </div>
  );
}

function Coin({ sym, on }) {
  const col = ASSETS[sym].color;
  return <span style={{ width: 16, height: 16, borderRadius: "50%", background: on ? "#fff" : col, color: on ? col : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900 }}>{sym === "USDT" ? "₮" : "$"}</span>;
}

// ---- Dubai map ----
function DubaiMap({ hover, setHover, onPick, asset }) {
  const W = 353, H = 360;
  return (
    <div style={{ margin: "14px 20px 0", borderRadius: 24, overflow: "hidden", position: "relative", height: H, border: `1.5px solid ${C.cardLine}` }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: "linear-gradient(160deg, #EEF4ED, #E3ECE4)" }}>
        <path d="M0 0 L353 0 L353 90 Q230 120 180 200 Q150 250 60 300 Q20 320 0 360 Z" fill="#CFE3E6" opacity="0.7" />
        <path d="M0 0 L353 0 L353 70 Q240 100 195 185 Q160 245 70 295 Q25 318 0 350 Z" fill="#C2DCE0" opacity="0.6" />
        <path d="M40 340 Q160 200 340 70" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M40 340 Q160 200 340 70" stroke={C.green} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 8" opacity="0.6" />
        <path d="M20 250 Q140 230 320 250" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M120 60 Q150 200 130 350" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
        <circle cx="250" cy="300" r="28" fill="#9FCFA8" opacity="0.35" />
        <text x="294" y="40" fontFamily={FONT} fontSize="9" fill="#7FA0A4" fontWeight="600">PERSIAN GULF</text>
        <text x="150" y="160" fontFamily={FONT} fontSize="8" fill="#A8B6A0" fontWeight="700" transform="rotate(-32 150 160)" opacity="0.9">SHEIKH ZAYED RD</text>
      </svg>

      {MERCHANTS.map((m, i) => {
        const left = m.x * W, top = m.y * H, active = hover === m.id;
        const isGold = m.tier === "gold";
        return (
          <button key={m.id} onClick={() => onPick(m)} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)}
            style={{ position: "absolute", left, top, transform: "translate(-50%,-100%)", border: "none", background: "transparent", cursor: "pointer", zIndex: active ? 30 : 10, animation: "drop .5s cubic-bezier(.2,.9,.3,1.3) both", animationDelay: `${i * 45}ms` }}>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {active && (
                <div style={{ position: "absolute", bottom: 46, whiteSpace: "nowrap", background: C.textHi, color: "#fff", padding: "7px 11px", borderRadius: 10, fontSize: 11.5, fontWeight: 700, boxShadow: "0 8px 20px -6px rgba(20,40,30,.4)" }}>
                  <span style={{ color: C.mintFill }}>{m.rates[asset].toFixed(3)}</span> {AED} · {m.zone}
                  <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: C.textHi }} />
                </div>
              )}
              <div style={{
                width: active ? 42 : 36, height: active ? 42 : 36, borderRadius: "50% 50% 50% 2px", transform: "rotate(45deg)",
                background: isGold ? C.green : "#fff", border: `2px solid ${isGold ? C.greenBright : C.green}`,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all .16s",
                boxShadow: active ? `0 10px 22px -6px ${C.green}cc` : "0 4px 12px rgba(20,40,30,.25)",
              }}>
                <span style={{ transform: "rotate(-45deg)", color: isGold ? "#fff" : C.green, fontWeight: 900, fontSize: active ? 16 : 14, fontFamily: FONT }}>{m.initial}</span>
              </div>
            </div>
          </button>
        );
      })}
      <div style={{ position: "absolute", left: "44%", top: "70%", transform: "translate(-50%,-50%)", zIndex: 5 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#2E7DF6", border: `3px solid #fff`, boxShadow: `0 0 0 6px rgba(46,125,246,.2), 0 2px 6px rgba(0,0,0,.2)` }} />
      </div>
      <style>{`@keyframes drop{0%{opacity:0;transform:translate(-50%,-160%)}100%{opacity:1;transform:translate(-50%,-100%)}}`}</style>
    </div>
  );
}

// ---- list view ----
function Listings({ onPick, side, asset }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0 90px" }}>
      {MERCHANTS.map((m) => (
        <button key={m.id} onClick={() => onPick(m)} style={{ width: "100%", textAlign: "left", border: "none", borderBottom: `1px solid ${C.cardLine}`, background: "transparent", padding: "16px 20px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar m={m} />
            <span style={{ fontWeight: 700, fontSize: 15.5, color: C.paper }}>{m.name}</span>
            {m.tier === "gold" && <GoldBadge />}
          </div>
          <div style={{ display: "flex", gap: 8, margin: "7px 0 0 44px", fontSize: 11.5, color: C.textLo }}>
            <span>{m.trades} trades</span><span>·</span><span style={{ color: C.green, fontWeight: 600 }}>{m.completion}%</span><span>·</span><span>👍 {m.likes}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: C.paper, letterSpacing: "-.03em", lineHeight: 1 }}>
                {m.rates[asset].toFixed(3)} <span style={{ fontSize: 12, color: C.textLo, fontWeight: 600 }}>{AED}/{asset}</span>
              </div>
              <div style={{ fontSize: 11.5, color: C.textLo, marginTop: 6 }}>
                Limit {fmt(m.min, 0)}–{fmt(m.max, 0)} · ≤{m.eta} min · 📍{m.zone}
              </div>
            </div>
            <div style={{ background: side === "buy" ? C.green : C.textHi, color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 22px", borderRadius: 12, textTransform: "capitalize" }}>{side}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================
//  4. MERCHANT DETAIL — direction-aware
// ============================================================
function MerchantDetail({ m, side, asset, amount, setAmount, onBack, onStart }) {
  const rate = m.rates[asset];
  const buy = side === "buy";

  // amount is always the AED leg. crypto leg derived.
  const cryptoGross = amount / rate;
  const fee = cryptoGross * 0.01;
  // BUY: user pays AED cash, receives crypto minus fee.
  // SELL: user gives crypto (gross), receives AED cash; fee taken from crypto side.
  const cryptoNet = buy ? cryptoGross - fee : cryptoGross;
  const valid = amount >= m.min && amount <= m.max && amount <= (buy ? Infinity : m.liq[asset] * rate);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep }}>
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>‹</button>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>{buy ? "Buy" : "Sell"} {asset}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: buy ? C.green : C.mint, background: `${buy ? C.green : C.mint}1a`, padding: "5px 11px", borderRadius: 9 }}>
          {buy ? "Cash → Crypto" : "Crypto → Cash"}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
        {/* merchant card */}
        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar m={m} big />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>{m.name}</span>
                {m.tier === "gold" && <GoldBadge />}
              </div>
              <div style={{ fontSize: 12, color: C.textLo, marginTop: 3 }}>📍 {m.zone} · open {m.hours}</div>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 16, borderTop: `1px solid ${C.cardLine}`, paddingTop: 14 }}>
            <Stat label="Rate" value={rate.toFixed(3)} sub={AED} />
            <Stat label="Completion" value={`${m.completion}%`} accent />
            <Stat label={`${asset} liq.`} value={`${(m.liq[asset] / 1000).toFixed(1)}k`} />
            <Stat label="Pickup" value={`${m.eta}m`} />
          </div>
        </div>

        {/* PAY leg */}
        <div style={{ marginTop: 18 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: C.textLo }}>{buy ? "You pay (cash)" : "AED to receive"}</label>
          <div style={{ background: C.card, border: `1.5px solid ${valid ? C.cardLine : "#d98a8a"}`, borderRadius: 18, padding: "16px 18px", marginTop: 8, display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: C.mint, marginRight: 8 }}>{AED}</span>
            <input value={amount} onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value.replace(/\D/g, "") || "0")))} inputMode="numeric"
              style={{ border: "none", outline: "none", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.paper, width: "100%", background: "transparent", letterSpacing: "-.02em" }} />
            <span style={{ fontSize: 13, color: C.textLo, fontWeight: 600 }}>AED</span>
          </div>

          {/* quick amounts (both sides — they're all AED now) */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[m.min, Math.round((m.min + m.max) / 4), Math.min(5000, m.max)].map((q) => (
              <button key={q} onClick={() => setAmount(q)} style={{ flex: 1, border: `1.5px solid ${C.cardLine}`, background: amount === q ? C.green : C.card, color: amount === q ? "#fff" : C.textLo, borderRadius: 10, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{fmt(q, 0)}</button>
            ))}
          </div>

          {/* the crypto leg as a compact computed line */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "12px 14px", background: C.bg, border: `1px solid ${C.cardLine}`, borderRadius: 14 }}>
            <Coin sym={asset} />
            <span style={{ fontSize: 13, color: C.textLo, fontWeight: 600 }}>{buy ? "You receive" : "You send"}</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 18, color: C.paper }}>{(buy ? cryptoNet : cryptoGross).toFixed(2)} {asset}</span>
          </div>
          {!valid && <div style={{ fontSize: 12, color: "#c0593f", marginTop: 8, fontWeight: 600 }}>Enter between {fmt(m.min, 0)} and {fmt(m.max, 0)} AED{!buy ? ` (merchant has ${(m.liq[asset] / 1000).toFixed(1)}k ${asset})` : ""}</div>}
        </div>

        {/* breakdown */}
        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 18, padding: 16, marginTop: 18 }}>
          <Row k={buy ? `You receive (${asset})` : "You receive (cash)"} v={buy ? `${cryptoNet.toFixed(2)} ${asset}` : `${fmt(amount, 0)} AED`} bold />
          <Row k="Platform fee (1%)" v={`${fee.toFixed(2)} ${asset}`} muted />
          <Row k="Settlement" v="On-chain, auto-release" muted />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 12px", background: `${C.green}14`, borderRadius: 12 }}>
            <LockIcon />
            <span style={{ fontSize: 12, color: C.mint, fontWeight: 600, lineHeight: 1.4 }}>
              {buy
                ? `${cryptoNet.toFixed(2)} ${asset} is locked in escrow from ${m.name} until you both confirm the cash handoff.`
                : `Your ${cryptoGross.toFixed(2)} ${asset} is locked in escrow until ${m.name} confirms paying you ${fmt(amount, 0)} AED in cash.`}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 30px", borderTop: `1px solid ${C.cardLine}`, background: "#fff", boxShadow: "0 -8px 24px -12px rgba(20,40,30,.12)" }}>
        <PrimaryButton disabled={!valid} side={side}
          onClick={onStart}
          label={buy ? `Buy ${cryptoNet.toFixed(2)} ${asset}` : `Sell ${cryptoGross.toFixed(2)} ${asset}`} />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 16, color: accent ? C.green : C.paper }}>{value}{sub && <span style={{ fontSize: 9, color: C.slate, marginLeft: 2 }}>{sub}</span>}</div>
      <div style={{ fontSize: 10.5, color: C.textLo, marginTop: 3 }}>{label}</div>
    </div>
  );
}
function Row({ k, v, bold, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontSize: 13.5, color: muted ? C.slate : C.textLo }}>{k}</span>
      <span style={{ fontSize: bold ? 16 : 13.5, fontWeight: bold ? 900 : 600, color: bold ? C.paper : C.textLo, fontFamily: FONT }}>{v}</span>
    </div>
  );
}

// ============================================================
//  5. DUAL-QR ESCROW HANDSHAKE — direction-aware
// ============================================================
function buildSteps(side, asset, m) {
  const buy = side === "buy";
  // BUY: merchant's crypto is escrowed; user pays cash; release crypto to user.
  // SELL: user's crypto is escrowed; merchant pays cash; release crypto to merchant.
  return buy
    ? [
        { key: "locked", label: "Escrow locked", hint: `${asset} from ${m.name} held in Cashta vault`, action: "I'm at the merchant" },
        { key: "scan1", label: "Scan merchant code", hint: "Confirm you're at the right merchant", action: "Scan verification QR" },
        { key: "cash", label: "Hand over cash", hint: "Pay the merchant in AED, in person", action: "Cash handed over" },
        { key: "paid", label: "Confirm payment", hint: "Optional live proof capture", action: "I Paid" },
        { key: "verify", label: "Merchant verifies cash", hint: "Merchant counts & confirms", action: null },
        { key: "scan2", label: "Scan settlement code", hint: "Final two-sided confirmation", action: "Scan settlement QR" },
        { key: "release", label: `${asset} released to you`, hint: "Auto-settled on-chain", action: "Receive stablecoins" },
      ]
    : [
        { key: "locked", label: "Your crypto locked", hint: `Your ${asset} held in Cashta vault until cash received`, action: "I'm at the merchant" },
        { key: "scan1", label: "Scan merchant code", hint: "Confirm you're at the right merchant", action: "Scan verification QR" },
        { key: "cash", label: "Receive cash", hint: "Merchant pays you AED, in person", action: "Cash received" },
        { key: "paid", label: "Confirm receipt", hint: "Optional live proof capture", action: "I got the cash" },
        { key: "verify", label: "Merchant confirms payout", hint: "Merchant marks cash paid", action: null },
        { key: "scan2", label: "Scan settlement code", hint: "Final two-sided confirmation", action: "Scan settlement QR" },
        { key: "release", label: `${asset} released to merchant`, hint: "Auto-settled on-chain", action: "Release stablecoins" },
      ];
}

function Handshake({ m, side, asset, amount, onDone, onCancel }) {
  const steps = buildSteps(side, asset, m);
  const [step, setStep] = useState(0);
  const rate = m.rates[asset];
  const cryptoGross = amount / rate;
  const cryptoNet = side === "buy" ? cryptoGross * 0.99 : cryptoGross;
  const cur = steps[step];
  const done = step === steps.length - 1;
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  useEffect(() => {
    if (cur.key === "verify") { const t = setTimeout(next, 2200); return () => clearTimeout(t); }
  }, [step]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: done ? D.green : D.bg, transition: "background .5s" }}>
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        {!done && <button onClick={onCancel} style={{ ...iconBtn, color: D.paper, borderColor: "rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)" }}>✕</button>}
        <div style={{ color: done ? D.bg : D.paper }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17 }}>{done ? "Swap complete" : `Live ${side} session`}</div>
          <div style={{ fontSize: 12, opacity: .7 }}>with {m.name} · {m.zone}</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 15, color: done ? D.bg : D.paper }}>{cryptoNet.toFixed(2)} <span style={{ fontSize: 10, opacity: .6 }}>{asset}</span></div>
      </div>

      <div style={{ display: "flex", gap: 5, padding: "16px 20px 0" }}>
        {steps.map((s, i) => <div key={s.key} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? (done ? D.bg : D.paper) : "rgba(255,255,255,.18)", transition: "background .3s" }} />)}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center" }}>
        <Stage stepKey={cur.key} done={done} m={m} net={cryptoNet} side={side} asset={asset} />
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: done ? D.bg : D.paper, letterSpacing: "-.03em", margin: "28px 0 8px" }}>{cur.label}</h2>
        <p style={{ fontSize: 14.5, color: done ? D.bg : "rgba(255,255,255,.72)", opacity: done ? .8 : 1, margin: 0, maxWidth: 270, lineHeight: 1.5 }}>{cur.hint}</p>
        <div style={{ fontSize: 12, color: done ? D.bg : "rgba(255,255,255,.45)", opacity: .6, marginTop: 14, fontWeight: 600 }}>Step {step + 1} of {steps.length}</div>
      </div>

      <div style={{ padding: "12px 20px 34px" }}>
        {done ? (
          <button onClick={onDone} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", background: D.bg, color: D.paper, fontWeight: 900, fontSize: 16, fontFamily: FONT, cursor: "pointer" }}>Done</button>
        ) : cur.action === null ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,.7)", fontSize: 14, fontWeight: 600, padding: "18px 0" }}><Spinner /> {cur.label}…</div>
        ) : (
          <button onClick={next} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", background: D.paper, color: D.bg, fontWeight: 900, fontSize: 16, fontFamily: FONT, cursor: "pointer", boxShadow: "0 10px 30px -10px rgba(0,0,0,.6)" }}>{cur.action}</button>
        )}
      </div>
    </div>
  );
}

function Stage({ stepKey, done, m, net, side, asset }) {
  if (done) return (
    <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pop .5s cubic-bezier(.2,.9,.3,1.4) both" }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={D.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <style>{`@keyframes pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
  if (stepKey === "scan1" || stepKey === "scan2") return <QRStage settlement={stepKey === "scan2"} />;
  if (stepKey === "locked") return <VaultStage net={net} asset={asset} />;
  if (stepKey === "cash") return <div style={{ fontSize: 84, animation: "sway 1.8s ease-in-out infinite" }}>💵<style>{`@keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-8px)}}`}</style></div>;
  if (stepKey === "paid") return <ProofStage />;
  if (stepKey === "verify") return <VerifyStage m={m} />;
  return null;
}
function QRStage({ settlement }) {
  const cells = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) {
    const on = (Math.sin(r * 12.9 + c * 78.2 + (settlement ? 3 : 0)) * 43758.5) % 1 > 0.45;
    if (on) cells.push(<rect key={`${r}-${c}`} x={c * 9 + 6} y={r * 9 + 6} width="9" height="9" fill={D.bg} />);
  }
  const finder = (x, y) => <g><rect x={x} y={y} width="27" height="27" fill={D.bg} /><rect x={x + 4.5} y={y + 4.5} width="18" height="18" fill="#fff" /><rect x={x + 9} y={y + 9} width="9" height="9" fill={D.bg} /></g>;
  return (
    <div style={{ position: "relative", padding: 16, background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px -16px rgba(0,0,0,.5)", animation: "pop .4s ease both" }}>
      <svg width="150" height="150" viewBox="0 0 111 111">{cells}{finder(6, 6)}{finder(78, 6)}{finder(6, 78)}</svg>
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: settlement ? D.mint : D.green, boxShadow: `0 0 10px ${settlement ? D.mint : D.green}`, animation: "scan 1.6s ease-in-out infinite" }} />
      <style>{`@keyframes scan{0%,100%{transform:translateY(0)}50%{transform:translateY(116px)}}@keyframes pop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
function VaultStage({ net, asset }) {
  return (
    <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px dashed rgba(255,255,255,.25)", animation: "spin 14s linear infinite" }} />
      <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(255,255,255,.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <LockIcon big />
        <span style={{ fontFamily: FONT, fontWeight: 900, color: D.paper, fontSize: 13 }}>{net.toFixed(0)} {asset}</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
function ProofStage() {
  return (
    <div style={{ width: 130, height: 130, borderRadius: 28, border: "3px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" /><circle cx="12" cy="12.5" r="3.5" /></svg>
    </div>
  );
}
function VerifyStage({ m }) {
  return (
    <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#fff", animation: "spin 1s linear infinite" }} />
      <Avatar m={m} big />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ============================================================
//  6. MERCHANT DASHBOARD
// ============================================================
function MerchantDash({ asset, onBack }) {
  const [spread, setSpread] = useState(0.8);
  const [a, setA] = useState(asset);
  const base = 3.679;
  const me = { rate: base * (1 + spread / 100), liq: 18420, today: 12, earned: 642.18 };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bgDeep }}>
      <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={iconBtn}>‹</button>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.paper }}>Merchant console</span>
        <span style={{ marginLeft: "auto" }}><GoldBadge /></span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px" }}>
        <div style={{ background: D.bg, border: `1.5px solid ${D.cardLine}`, borderRadius: 24, padding: 22, color: D.paper, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -30, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${D.green}55, transparent 70%)` }} />
          <div style={{ fontSize: 12.5, color: D.textLo, fontWeight: 600 }}>Earned today</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: "-.04em", marginTop: 4 }}>{me.earned} <span style={{ fontSize: 15, color: D.textLo }}>{a}</span></div>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <MiniStat label="Swaps today" value={me.today} dark />
            <MiniStat label="Liquidity" value={`${(me.liq / 1000).toFixed(1)}k`} dark />
            <MiniStat label="Your rate" value={me.rate.toFixed(3)} dark />
          </div>
        </div>

        {/* asset selector for merchant */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {Object.keys(ASSETS).map((k) => (
            <button key={k} onClick={() => setA(k)} style={{ flex: 1, border: `1.5px solid ${a === k ? ASSETS[k].color : C.cardLine}`, background: a === k ? `${ASSETS[k].color}22` : C.card, color: C.paper, borderRadius: 14, padding: "12px 0", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Coin sym={k} />{k} liquidity
            </button>
          ))}
        </div>

        <div style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 20, padding: 18, marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: C.paper }}>Your spread</span>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 18, color: C.green }}>{spread.toFixed(1)}%</span>
          </div>
          <input type="range" min="0.2" max="2.5" step="0.1" value={spread} onChange={(e) => setSpread(parseFloat(e.target.value))} style={{ width: "100%", marginTop: 14, accentColor: C.green }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textLo, marginTop: 4 }}><span>More volume</span><span>More margin</span></div>
        </div>

        <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 700, fontSize: 14, color: C.textLo }}>Incoming swap requests</div>
        {[{ n: "Yusuf K.", a: 3500, t: "2 min ago", side: "buy" }, { n: "Lina M.", a: 1200, t: "8 min ago", side: "sell" }, { n: "Omar R.", a: 9000, t: "15 min ago", side: "buy" }].map((r, i) => (
          <div key={i} style={{ background: C.card, border: `1.5px solid ${C.cardLine}`, borderRadius: 16, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: C.mint, fontFamily: FONT }}>{r.n[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.paper }}>{r.n} <span style={{ fontSize: 10, fontWeight: 700, color: r.side === "buy" ? C.green : C.mint, marginLeft: 4 }}>{r.side.toUpperCase()}</span></div>
              <div style={{ fontSize: 11.5, color: C.textLo }}>{fmt(r.a, 0)} AED · {r.t}</div>
            </div>
            <button style={{ border: "none", background: C.green, color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 11, cursor: "pointer" }}>Accept</button>
          </div>
        ))}
      </div>
      <TabBar active="merchant" />
    </div>
  );
}
function MiniStat({ label, value, dark }) {
  return <div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 18, color: dark ? D.paper : C.paper }}>{value}</div><div style={{ fontSize: 10.5, color: dark ? D.textLo : C.textLo, marginTop: 2 }}>{label}</div></div>;
}

// ============================================================
//  SHARED
// ============================================================
function Avatar({ m, big }) {
  const s = big ? 48 : 34, gold = m.tier === "gold";
  return (
    <div style={{ position: "relative", width: s, height: s }}>
      <div style={{ width: s, height: s, borderRadius: "50%", background: gold ? C.green : C.bg, color: gold ? C.bg : C.mint, border: `1.5px solid ${gold ? C.mint : C.cardLine}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: big ? 19 : 14 }}>{m.initial}</div>
      <div style={{ position: "absolute", bottom: 0, right: 0, width: s * 0.28, height: s * 0.28, borderRadius: "50%", background: C.green, border: `2px solid ${C.bgDeep}` }} />
    </div>
  );
}
const GoldBadge = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: `${C.mint}1f`, color: C.mint, fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 7 }}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3 5.5L21 8l-4 4 1 6-6-3-6 3 1-6-4-4 6-1.5z" /></svg>VERIFIED
  </span>
);
const LockIcon = ({ big }) => <svg width={big ? 30 : 16} height={big ? 30 : 16} viewBox="0 0 24 24" fill="none" stroke={big ? "#fff" : C.mint} strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
const Spinner = () => <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", verticalAlign: "middle", marginRight: 8 }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></span>;
function PrimaryButton({ label, onClick, disabled, side }) {
  const bg = disabled ? C.cardLine : (side === "sell" ? C.paper : C.green); // sell = deep forest, buy = green
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", height: 56, borderRadius: 16, border: "none", background: bg, color: disabled ? C.textLo : "#fff", fontWeight: 900, fontSize: 16, fontFamily: FONT,
      cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : `0 12px 30px -10px ${bg}66`, transition: "all .15s",
    }}>{label}</button>
  );
}
function TabBar({ active }) {
  const tabs = [["market", "Market", <MShop />], ["orders", "Orders", <MClock />], ["chat", "Chat", <MChat />], ["profile", "Profile", <MUser />]];
  return (
    <div style={{ borderTop: `1px solid ${C.cardLine}`, background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", display: "flex", padding: "10px 8px 24px" }}>
      {tabs.map(([k, lbl, icon]) => (
        <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active === k ? C.green : C.textLo }}>
          {icon}<span style={{ fontSize: 10.5, fontWeight: active === k ? 700 : 500 }}>{lbl}</span>
        </div>
      ))}
    </div>
  );
}
const MShop = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9l1-4h12l1 4M4 9v9h14V9M4 9h14" strokeLinejoin="round" /></svg>;
const MClock = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M11 6v5l3 2" strokeLinecap="round" /></svg>;
const MChat = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h14v10H9l-4 3V5z" strokeLinejoin="round" /></svg>;
const MUser = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="7" r="3.5" /><path d="M4 19c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" /></svg>;
const iconBtn = { width: 36, height: 36, borderRadius: 11, border: `1.5px solid ${C.cardLine}`, background: C.card, color: C.paper, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 };
