'use client';
import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ─── FOOD CATEGORIES WITH PHOTOS ─────────────────────────────────────────────
const FOOD_CATEGORIES = [
  {
    id: "fastfood", label: "Fast Food", emoji: "🍔", color: "#FF6B35", bg: "#FFF3EE",
    items: [
      { id: "burger",  name: "Burger",       img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
      { id: "pizza",   name: "Pizza",        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" },
      { id: "fries",   name: "French Fries", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" },
      { id: "hotdog",  name: "Hot Dog",      img: "https://images.unsplash.com/photo-1612392062631-94b9e307c2a2?w=300&q=80" },
      { id: "wrap",    name: "Wrap",         img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&q=80" },
      { id: "tacos",   name: "Tacos",        img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80" },
    ],
  },
  {
    id: "icecream", label: "Ice Cream", emoji: "🍦", color: "#EC4899", bg: "#FDF2F8",
    items: [
      { id: "icecream_cone", name: "Ice Cream Cone", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&q=80" },
      { id: "sundae",        name: "Sundae",         img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80" },
      { id: "gelato",        name: "Gelato",         img: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&q=80" },
      { id: "popsicle",      name: "Popsicle",       img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=80" },
      { id: "waffle",        name: "Waffle Cone",    img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=300&q=80" },
      { id: "milkshake",     name: "Milkshake",      img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80" },
    ],
  },
  {
    id: "sweets", label: "Sweets & Desserts", emoji: "🍰", color: "#8B5CF6", bg: "#F5F3FF",
    items: [
      { id: "cake",       name: "Cake",       img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80" },
      { id: "macaron",    name: "Macarons",   img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300&q=80" },
      { id: "chocolate",  name: "Chocolate",  img: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&q=80" },
      { id: "donut",      name: "Donuts",     img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" },
      { id: "brownie",    name: "Brownies",   img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80" },
      { id: "cheesecake", name: "Cheesecake", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&q=80" },
    ],
  },
  {
    id: "finedine", label: "Fine Dining", emoji: "🍽️", color: "#0D9488", bg: "#F0FDFA",
    items: [
      { id: "sushi",   name: "Sushi",   img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80" },
      { id: "pasta",   name: "Pasta",   img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80" },
      { id: "steak",   name: "Steak",   img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80" },
      { id: "lobster", name: "Lobster", img: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=300&q=80" },
      { id: "biryani", name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80" },
      { id: "fondue",  name: "Fondue",  img: "https://images.unsplash.com/photo-1637806931073-b18efd43ccb1?w=300&q=80" },
    ],
  },
  {
    id: "cafe", label: "Café & Drinks", emoji: "☕", color: "#92400E", bg: "#FFFBEB",
    items: [
      { id: "coffee",     name: "Coffee",         img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80" },
      { id: "bubble_tea", name: "Bubble Tea",     img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
      { id: "croissant",  name: "Croissant",      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80" },
      { id: "smoothie",   name: "Smoothie",       img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80" },
      { id: "pancakes",   name: "Pancakes",       img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&q=80" },
      { id: "waffles_b",  name: "Belgian Waffles",img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&q=80" },
    ],
  },
  {
    id: "streetfood", label: "Street Food", emoji: "🌮", color: "#D97706", bg: "#FFFBEB",
    items: [
      { id: "pani_puri", name: "Pani Puri", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80" },
      { id: "chaat",     name: "Chaat",     img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80" },
      { id: "samosa",    name: "Samosa",    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80" },
      { id: "noodles",   name: "Noodles",   img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&q=80" },
      { id: "momos",     name: "Momos",     img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&q=80" },
      { id: "kebab",     name: "Kebab",     img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80" },
    ],
  },
];

const ACTIVITIES = [
  { id: "movie",     emoji: "🎬", label: "Movie Night",     color: "#6366F1" },
  { id: "stars",     emoji: "🌃", label: "Stargazing",      color: "#1E1B4B" },
  { id: "amusement", emoji: "🎢", label: "Amusement Park",  color: "#EF4444" },
  { id: "beach",     emoji: "🏖️", label: "Beach Walk",      color: "#0EA5E9" },
  { id: "theatre",   emoji: "🎭", label: "Theatre Show",    color: "#7C3AED" },
  { id: "art",       emoji: "🖼️", label: "Art Gallery",     color: "#059669" },
  { id: "hike",      emoji: "🧗", label: "Hiking",          color: "#16A34A" },
  { id: "gaming",    emoji: "🎮", label: "Gaming Night",    color: "#2563EB" },
  { id: "music",     emoji: "🎶", label: "Live Music",      color: "#DC2626" },
  { id: "boat",      emoji: "🚣", label: "Boat Ride",       color: "#0284C7" },
  { id: "bowling",   emoji: "🎳", label: "Bowling",         color: "#D97706" },
  { id: "garden",    emoji: "🌸", label: "Garden Stroll",   color: "#EC4899" },
  { id: "cook",      emoji: "🍳", label: "Cook Together",   color: "#EA580C" },
  { id: "photo",     emoji: "📸", label: "Photo Walk",      color: "#7C3AED" },
  { id: "baking",    emoji: "🧁", label: "Baking Together", color: "#DB2777" },
  { id: "spa",       emoji: "🧖", label: "Spa Day",         color: "#0D9488" },
  { id: "picnic",    emoji: "🧺", label: "Picnic",          color: "#65A30D" },
  { id: "dance",     emoji: "💃", label: "Dance Night",     color: "#C026D3" },
];

const THEMES = [
  { id: "rose",     label: "Rose",     primary: "#FF6B8A", secondary: "#FF9BB5", accent: "#D63060", bg1: "#fff0f3", bg2: "#ffe4ec", text: "#7C2D3E" },
  { id: "violet",   label: "Violet",   primary: "#8B5CF6", secondary: "#A78BFA", accent: "#6D28D9", bg1: "#f5f3ff", bg2: "#ede9fe", text: "#4C1D95" },
  { id: "gold",     label: "Gold",     primary: "#F59E0B", secondary: "#FCD34D", accent: "#D97706", bg1: "#fffbeb", bg2: "#fef3c7", text: "#78350F" },
  { id: "teal",     label: "Teal",     primary: "#0D9488", secondary: "#34D399", accent: "#047857", bg1: "#f0fdfa", bg2: "#ccfbf1", text: "#134E4A" },
  { id: "midnight", label: "Midnight", primary: "#818CF8", secondary: "#A5B4FC", accent: "#6366F1", bg1: "#1e1b4b", bg2: "#312e81", text: "#E0E7FF", dark: true },
  { id: "sunset",   label: "Sunset",   primary: "#F97316", secondary: "#FB923C", accent: "#EA580C", bg1: "#fff7ed", bg2: "#ffedd5", text: "#7C2D12" },
];

const PLANS = [
  { id: "free",    name: "Free",    price: "₹0",      color: "#6B7280", features: ["5 proposals/month", "3 food categories", "Basic themes", "Shareable link"], limit: 5 },
  { id: "lover",   name: "Lover",   price: "₹199/mo", color: "#FF6B8A", features: ["Unlimited proposals", "All food categories + photos", "All 6 themes", "Checklist + Status", "WhatsApp share"], popular: true, limit: Infinity },
  { id: "premium", name: "Premium", price: "₹499/mo", color: "#8B5CF6", features: ["Everything in Lover", "Custom branding", "Analytics", "Priority support"], limit: Infinity },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  fontSerif: "Georgia, serif",
  fontSans:  "system-ui, -apple-system, sans-serif",
  radius:    { sm: "8px", md: "16px", lg: "24px", xl: "32px", full: "999px" },
  shadow:    { sm: "0 2px 8px rgba(0,0,0,0.08)", md: "0 4px 24px rgba(0,0,0,0.10)", lg: "0 12px 48px rgba(0,0,0,0.14)" },
};

const S = {
  btn: (color = "#FF6B8A", outline = false) => ({
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 22px", borderRadius: G.radius.full,
    fontWeight: 600, fontSize: "14px", cursor: "pointer",
    border: outline ? `2px solid ${color}` : "none",
    background: outline ? "transparent" : color,
    color: outline ? color : "#fff",
    transition: "all 0.18s", fontFamily: G.fontSans, whiteSpace: "nowrap",
  }),
  card: (extra = {}) => ({
    background: "#fff", borderRadius: G.radius.lg, padding: "24px",
    boxShadow: G.shadow.md, border: "1px solid rgba(0,0,0,0.06)",
    marginBottom: "16px", ...extra,
  }),
  input: {
    width: "100%", padding: "12px 16px", borderRadius: G.radius.md,
    border: "2px solid #E5E7EB", fontSize: "15px", fontFamily: G.fontSans,
    outline: "none", boxSizing: "border-box", background: "#fff",
  },
  label: {
    fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em",
    textTransform: "uppercase", color: "#6B7280", marginBottom: "6px", display: "block",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 10); }

function foodLabel(key) { return key.split("__")[1]; }
function foodImg(key) {
  const id = key.split("__")[0];
  for (const cat of FOOD_CATEGORIES) {
    const f = cat.items.find(i => i.id === id);
    if (f) return f.img;
  }
  return null;
}
function actLabel(key) { return key.split("__")[1]; }
function actEmoji(key) { return ACTIVITIES.find(a => a.id === key.split("__")[0])?.emoji || "🎉"; }

// ─── FIREBASE HELPERS ─────────────────────────────────────────────────────────
async function createUserDoc(uid, name, email) {
  await setDoc(doc(db, "users", uid), {
    id: uid, name, email, plan: "free", proposalCount: 0,
    createdAt: serverTimestamp(),
  });
}

async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function saveProposal(proposalData) {
  const id = genId();
  await setDoc(doc(db, "proposals", id), {
    ...proposalData, id,
    response: null, checkedItems: [],
    createdAt: serverTimestamp(),
  });
  return id;
}

async function getProposal(id) {
  const snap = await getDoc(doc(db, "proposals", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function getUserProposals(userId) {
  const q = query(collection(db, "proposals"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

async function updateProposalResponse(id, response) {
  await updateDoc(doc(db, "proposals", id), { response });
}

async function updateChecklist(id, checkedItems) {
  await updateDoc(doc(db, "proposals", id), { checkedItems });
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1F2937", color: "#fff", padding: "12px 24px", borderRadius: G.radius.full, fontSize: "14px", fontWeight: 500, zIndex: 9999, boxShadow: G.shadow.lg }}>
      {msg}
    </div>
  );
}

function FloatingHearts({ color = "#FF6B8A" }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", bottom: "-40px", left: `${10 + i * 11}%`, fontSize: `${1 + (i % 3) * 0.6}rem`, animation: `fh ${4 + i * 0.7}s ease-in ${i * 0.5}s infinite`, opacity: 0.35, color }}>💖</div>
      ))}
      <style>{`@keyframes fh{0%{transform:translateY(0) rotate(0);opacity:.35}100%{transform:translateY(-110vh) rotate(25deg);opacity:0}}`}</style>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: "16px", fontFamily: G.fontSans }}>
      <div style={{ fontSize: "3rem", animation: "spin 1.5s linear infinite", display: "inline-block" }}>💌</div>
      <p style={{ color: "#6B7280" }}>Loading...</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function FoodCard({ item, selected, onToggle, color }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onClick={() => onToggle(item)} style={{ borderRadius: G.radius.md, overflow: "hidden", cursor: "pointer", border: selected ? `3px solid ${color}` : "3px solid transparent", boxShadow: selected ? `0 0 0 2px ${color}30` : G.shadow.sm, transition: "all 0.2s", background: "#fff", position: "relative" }}>
      {selected && <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2, background: color, borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 700 }}>✓</div>}
      <div style={{ height: "120px", background: "#F3F4F6", overflow: "hidden" }}>
        {!imgErr
          ? <img src={item.img} alt={item.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} onMouseEnter={e => e.target.style.transform = "scale(1.08)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🍽️</div>}
      </div>
      <div style={{ padding: "10px 12px", fontWeight: 600, fontSize: "13px", color: selected ? color : "#374151" }}>{item.name}</div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLogin, onSignup }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#fff0f3 0%,#f5f3ff 50%,#f0fdfa 100%)", minHeight: "100vh", fontFamily: G.fontSans }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: G.fontSerif, fontSize: "1.5rem", fontWeight: 700, color: "#D63060" }}>💌 LoveDate</div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={S.btn("#FF6B8A", true)} onClick={onLogin}>Login</button>
          <button style={S.btn("#FF6B8A")} onClick={onSignup}>Free Mein Shuru Karo</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* HERO */}
        <div style={{ textAlign: "center", padding: "80px 20px 60px" }}>
          <div style={{ display: "inline-block", background: "#FFF0F3", color: "#D63060", borderRadius: G.radius.full, padding: "6px 18px", fontSize: "13px", fontWeight: 700, marginBottom: "24px" }}>
            ✨ FIREBASE POWERED DATE PROPOSAL SAAS
          </div>
          <h1 style={{ fontFamily: G.fontSerif, fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: 1.08, fontWeight: 700, color: "#1F2937", marginBottom: "20px" }}>
            Plan the perfect date,<br />
            <span style={{ background: "linear-gradient(135deg,#FF6B8A,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>she'll say yes.</span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#6B7280", maxWidth: "560px", margin: "0 auto 36px", lineHeight: 1.7 }}>
            Beautiful date proposal banao — food photos, activities, personal message ke saath. Kisi bhi device pe share karo. Firebase se real-time sync!
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ ...S.btn("#FF6B8A"), padding: "14px 32px", fontSize: "16px" }} onClick={onSignup}>💌 Free Mein Shuru Karo</button>
            <button style={{ ...S.btn("#8B5CF6", true), padding: "14px 32px", fontSize: "16px" }} onClick={onLogin}>Login Karo →</button>
          </div>
          <p style={{ marginTop: "16px", fontSize: "13px", color: "#9CA3AF" }}>Free plan — 5 proposals, no credit card</p>
        </div>

        {/* FEATURES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px", marginBottom: "80px" }}>
          {[
            { emoji: "🔥", title: "Firebase Powered", desc: "Real authentication + Firestore database — data kisi bhi device pe sync hota hai" },
            { emoji: "🍔", title: "6 Food Categories", desc: "36 dishes with real Unsplash photos — Fast Food, Ice Cream, Sweets aur aur bhi" },
            { emoji: "🎨", title: "6 Romantic Themes", desc: "Rose, Violet, Gold, Teal, Midnight, Sunset — har proposal unique" },
            { emoji: "✅", title: "Live Checklist", desc: "Girlfriend tick karti hai — tum real-time status page pe dekh sakte ho" },
            { emoji: "💬", title: "Response System", desc: "Haan ya Nahi — seedha dashboard mein update hota hai" },
            { emoji: "📱", title: "WhatsApp Share", desc: "Link kisi bhi phone pe khulega — Firebase se data real hai" },
          ].map(f => (
            <div key={f.title} style={S.card({ textAlign: "center", padding: "28px 20px" })}>
              <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{f.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px", color: "#1F2937" }}>{f.title}</div>
              <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "2.2rem", fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>Simple Pricing</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px", marginBottom: "80px" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={S.card({ position: "relative", border: plan.popular ? `2px solid ${plan.color}` : "1px solid rgba(0,0,0,0.08)" })}>
              {plan.popular && <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", borderRadius: G.radius.full, padding: "4px 16px", fontSize: "12px", fontWeight: 700 }}>MOST POPULAR</div>}
              <div style={{ fontWeight: 800, fontSize: "18px", color: plan.color, marginBottom: "4px" }}>{plan.name}</div>
              <div style={{ fontFamily: G.fontSerif, fontSize: "2.2rem", fontWeight: 700, color: "#1F2937", marginBottom: "20px" }}>{plan.price}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {plan.features.map(f => <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}><span style={{ color: plan.color, fontWeight: 700 }}>✓</span>{f}</li>)}
              </ul>
              <button style={{ ...S.btn(plan.color), width: "100%", justifyContent: "center" }} onClick={onSignup}>
                {plan.id === "free" ? "Start Free" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "32px", color: "#9CA3AF", fontSize: "13px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        Made with 💖 · LoveDate SaaS · Powered by Firebase
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ mode, onAuth, onSwitch, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.name || !form.email || !form.password) { setErr("Sab fields bharo"); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });
        await createUserDoc(cred.user.uid, form.name, form.email);
        onAuth({ id: cred.user.uid, name: form.name, email: form.email, plan: "free", proposalCount: 0 });
      } else {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const userDoc = await getUserDoc(cred.user.uid);
        onAuth(userDoc || { id: cred.user.uid, name: cred.user.displayName, email: form.email, plan: "free" });
      }
    } catch (e) {
      const msgs = { "auth/email-already-in-use": "Yeh email pehle se registered hai", "auth/wrong-password": "Password galat hai", "auth/user-not-found": "Email nahi mila", "auth/weak-password": "Password kam se kam 6 characters ka hona chahiye", "auth/invalid-email": "Email format sahi nahi hai" };
      setErr(msgs[e.code] || e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fff0f3,#f5f3ff)", padding: "24px", fontFamily: G.fontSans }}>
      <div style={S.card({ maxWidth: "420px", width: "100%", padding: "40px" })}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>💌</div>
          <h1 style={{ fontFamily: G.fontSerif, fontSize: "1.8rem", color: "#1F2937", marginBottom: "4px" }}>
            {mode === "signup" ? "Account Banao" : "Wapas Aao"}
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Firebase se secure login</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <div>
              <label style={S.label}>Tumhara Naam</label>
              <input style={S.input} placeholder="Rahul Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" placeholder="rahul@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {err && <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "10px 14px", borderRadius: G.radius.md, fontSize: "13px" }}>⚠️ {err}</div>}
          <button style={{ ...S.btn("#FF6B8A"), justifyContent: "center", padding: "14px", fontSize: "15px", opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
            {loading ? "⏳ Please wait..." : mode === "signup" ? "Account Banao 🚀" : "Login Karo →"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6B7280" }}>
          {mode === "signup" ? "Pehle se account hai? " : "Naya account? "}
          <span style={{ color: "#FF6B8A", cursor: "pointer", fontWeight: 600 }} onClick={onSwitch}>
            {mode === "signup" ? "Login karo" : "Sign up karo"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onNew, onLogout, onViewProposal, onStatus }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProposals(user.id).then(p => { setProposals(p); setLoading(false); });
  }, [user.id]);

  const responded = proposals.filter(p => p.response !== null).length;
  const accepted  = proposals.filter(p => p.response === true).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: G.fontSans }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", fontWeight: 700, color: "#D63060" }}>💌 LoveDate</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "#6B7280" }}>👤 {user.name} · <span style={{ color: "#FF6B8A", fontWeight: 700 }}>{PLANS.find(p => p.id === user.plan)?.name} Plan</span></div>
          <button style={{ ...S.btn("#FF6B8A"), padding: "8px 20px" }} onClick={onNew}>+ New Proposal</button>
          <button style={{ ...S.btn("#6B7280", true), padding: "8px 16px", fontSize: "13px" }} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Proposals", value: proposals.length, emoji: "💌", color: "#FF6B8A" },
            { label: "Responded",       value: responded,        emoji: "✉️", color: "#8B5CF6" },
            { label: "Accepted 💚",     value: accepted,         emoji: "🥰", color: "#10B981" },
            { label: "Plan Limit",      value: user.plan === "free" ? `${proposals.length}/5` : "∞", emoji: "⭐", color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} style={S.card({ textAlign: "center", padding: "20px" })}>
              <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>{s.emoji}</div>
              <div style={{ fontFamily: G.fontSerif, fontSize: "2rem", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {user.plan === "free" && proposals.length >= 3 && (
          <div style={{ background: "linear-gradient(135deg,#FF6B8A,#8B5CF6)", borderRadius: G.radius.lg, padding: "20px 24px", marginBottom: "20px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>💜 Upgrade to Lover Plan</div>
              <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>Unlimited proposals, all food categories — sirf ₹199/mo</div>
            </div>
            <button style={{ background: "#fff", color: "#FF6B8A", border: "none", borderRadius: G.radius.full, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>Upgrade ✨</button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", color: "#1F2937" }}>Tumhare Proposals</h2>
          <span style={{ fontSize: "13px", color: "#6B7280" }}>{proposals.length} total</span>
        </div>

        {loading ? <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>⏳ Load ho raha hai...</div>
        : proposals.length === 0 ? (
          <div style={S.card({ textAlign: "center", padding: "60px 24px" })}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💌</div>
            <h3 style={{ fontFamily: G.fontSerif, color: "#1F2937", marginBottom: "8px" }}>Pehla Proposal Banao!</h3>
            <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "20px" }}>Apni girlfriend ke liye ek beautiful date plan karo</p>
            <button style={S.btn("#FF6B8A")} onClick={onNew}>+ New Proposal Banao</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {proposals.map(p => {
              const themeObj = THEMES.find(t => t.id === p.theme) || THEMES[0];
              const allItems = [...(p.foods || []), ...(p.activities || [])];
              const checkedCount = (p.checkedItems || []).filter(x => allItems.includes(x)).length;
              return (
                <div key={p.id} style={S.card({ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "20px" })}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg,${themeObj.primary},${themeObj.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>💌</div>
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#1F2937" }}>{p.girlfriendName} ke liye</div>
                    <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
                      {p.date && `📅 ${p.date}`} {p.time && `⏰ ${p.time}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    {allItems.length > 0 && <span style={{ fontSize: "12px", background: "#F3F4F6", padding: "4px 10px", borderRadius: G.radius.full, color: "#6B7280" }}>✅ {checkedCount}/{allItems.length}</span>}
                    <span style={{ fontSize: "12px", padding: "4px 12px", borderRadius: G.radius.full, fontWeight: 600, background: p.response === true ? "#D1FAE5" : p.response === false ? "#FEE2E2" : "#FEF3C7", color: p.response === true ? "#065F46" : p.response === false ? "#991B1B" : "#92400E" }}>
                      {p.response === true ? "✓ Accepted" : p.response === false ? "✗ Declined" : "⏳ Pending"}
                    </span>
                    <button style={{ ...S.btn(themeObj.primary, true), padding: "6px 14px", fontSize: "12px" }} onClick={() => onViewProposal(p.id)}>View</button>
                    <button style={{ ...S.btn(themeObj.primary), padding: "6px 14px", fontSize: "12px" }} onClick={() => onStatus(p.id)}>Status</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROPOSAL CREATOR ─────────────────────────────────────────────────────────
const STEPS = ["Names", "Date & Time", "Food", "Activities", "Message", "Theme"];

function ProposalCreator({ user, onBack, onSave, showToast }) {
  const [step, setStep]         = useState(0);
  const [theme, setTheme]       = useState("rose");
  const [activeCat, setActiveCat] = useState("fastfood");
  const [loading, setLoading]   = useState(false);
  const [saved, setSaved]       = useState(null);
  const [form, setForm]         = useState({
    senderName: user.name, girlfriendName: "", date: "", time: "", location: "",
    foods: [], activities: [], message: "",
  });

  const canNext = () => {
    if (step === 0) return form.senderName.trim() && form.girlfriendName.trim();
    if (step === 1) return form.date && form.time;
    return true;
  };

  const toggleFood = (item) => {
    const key = `${item.id}__${item.name}`;
    setForm(f => ({ ...f, foods: f.foods.includes(key) ? f.foods.filter(x => x !== key) : [...f.foods, key] }));
  };
  const toggleActivity = (item) => {
    const key = `${item.id}__${item.label}`;
    setForm(f => ({ ...f, activities: f.activities.includes(key) ? f.activities.filter(x => x !== key) : [...f.activities, key] }));
  };

  const save = async () => {
    setLoading(true);
    try {
      const id = await saveProposal({ ...form, theme, userId: user.id, userName: user.name });
      setSaved(id);
    } catch (e) {
      showToast("❌ Error: " + e.message);
    }
    setLoading(false);
  };

  const themeObj = THEMES.find(t => t.id === theme);
  const catObj   = FOOD_CATEGORIES.find(c => c.id === activeCat);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/proposal/${saved}` : "";

  if (saved) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#fff0f3,#f5f3ff)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: G.fontSans }}>
      <div style={S.card({ maxWidth: "480px", width: "100%", textAlign: "center", padding: "48px 32px" })}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ fontFamily: G.fontSerif, fontSize: "2rem", color: "#1F2937", marginBottom: "8px" }}>Proposal Ready!</h2>
        <p style={{ color: "#6B7280", marginBottom: "28px" }}>{form.girlfriendName} ko yeh link bhejo 💌<br /><small style={{ color: "#10B981" }}>✅ Firebase mein save ho gaya — kisi bhi device pe khulega!</small></p>
        <div style={{ display: "flex", gap: "8px", background: "#F9FAFB", borderRadius: G.radius.md, padding: "10px 14px", marginBottom: "20px", textAlign: "left" }}>
          <span style={{ flex: 1, fontSize: "13px", color: "#374151", wordBreak: "break-all" }}>{shareUrl}</span>
          <button style={{ ...S.btn("#FF6B8A"), padding: "6px 14px", fontSize: "12px" }} onClick={() => { navigator.clipboard.writeText(shareUrl); showToast("✅ Link copy ho gaya!"); }}>Copy</button>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(`💌 ${form.senderName} ne tumhare liye special date plan kiya! Dekho: ${shareUrl}`)}`} target="_blank" rel="noreferrer" style={{ ...S.btn("#25D366"), textDecoration: "none" }}>📱 WhatsApp</a>
          <button style={S.btn("#8B5CF6")} onClick={() => window.location.href = `/status/${saved}`}>📊 Status Dekho</button>
          <button style={{ ...S.btn("#6B7280", true) }} onClick={onBack}>Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: G.fontSans }}>
      <nav style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <button style={{ ...S.btn("#6B7280", true), padding: "8px 16px", fontSize: "13px" }} onClick={onBack}>← Dashboard</button>
        <span style={{ fontFamily: G.fontSerif, fontSize: "1.2rem", color: "#D63060" }}>💌 New Proposal</span>
      </nav>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}>

        {/* STEP BAR */}
        <div style={{ display: "flex", gap: 0, marginBottom: "32px", alignItems: "center" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0, cursor: i < step ? "pointer" : "default", background: i < step ? "#10B981" : i === step ? themeObj.primary : "#E5E7EB", color: i <= step ? "#fff" : "#6B7280" }} onClick={() => i < step && setStep(i)}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: i < step ? "#10B981" : "#E5E7EB" }} />}
            </div>
          ))}
        </div>
        <div style={{ height: "6px", background: "#E5E7EB", borderRadius: G.radius.full, marginBottom: "24px" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg,${themeObj.primary},${themeObj.secondary})`, borderRadius: G.radius.full, width: `${(step / (STEPS.length - 1)) * 100}%`, transition: "width 0.4s" }} />
        </div>
        <div style={{ fontSize: "13px", color: "#9CA3AF", textAlign: "center", marginBottom: "20px" }}>
          Step {step + 1}/{STEPS.length} — <strong style={{ color: themeObj.primary }}>{STEPS[step]}</strong>
        </div>

        {/* STEP 0 */}
        {step === 0 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "20px" }}>👫 Naam batao</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div><label style={S.label}>Tumhara Naam</label><input style={S.input} value={form.senderName} onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))} placeholder="Rahul" /></div>
              <div><label style={S.label}>Girlfriend Ka Naam</label><input style={S.input} value={form.girlfriendName} onChange={e => setForm(f => ({ ...f, girlfriendName: e.target.value }))} placeholder="Priya" /></div>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "20px" }}>📅 Date, Time & Jagah</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div><label style={S.label}>Date</label><input type="date" style={S.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><label style={S.label}>Time</label><input type="time" style={S.input} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
            </div>
            <div><label style={S.label}>Milne Ki Jagah</label><input style={S.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="CP, Connaught Place ya koi café..." /></div>
          </div>
        )}

        {/* STEP 2: FOOD */}
        {step === 2 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "6px" }}>🍽️ Kya Khana Hai?</h2>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>Category chunno phir photos se dishes select karo</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {FOOD_CATEGORIES.map(cat => {
                const selCount = form.foods.filter(f => cat.items.some(i => f.startsWith(i.id))).length;
                return (
                  <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ padding: "8px 16px", borderRadius: G.radius.full, fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "2px solid", borderColor: activeCat === cat.id ? cat.color : "#E5E7EB", background: activeCat === cat.id ? cat.color : "#fff", color: activeCat === cat.id ? "#fff" : "#374151" }}>
                    {cat.emoji} {cat.label}{selCount > 0 ? ` (${selCount})` : ""}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "12px" }}>
              {catObj.items.map(item => (
                <FoodCard key={item.id} item={item} color={catObj.color} selected={form.foods.some(f => f.startsWith(item.id))} onToggle={() => toggleFood(item)} />
              ))}
            </div>
            {form.foods.length > 0 && (
              <div style={{ marginTop: "16px", padding: "12px", background: "#F9FAFB", borderRadius: G.radius.md }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px", fontWeight: 600 }}>SELECTED ({form.foods.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {form.foods.map(key => {
                    const img = foodImg(key);
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: G.radius.full, padding: "4px 10px 4px 6px", fontSize: "12px" }}>
                        {img && <img src={img} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />}
                        {foodLabel(key)}
                        <span style={{ color: "#9CA3AF", cursor: "pointer" }} onClick={() => toggleFood({ id: key.split("__")[0], name: key.split("__")[1] })}>×</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ACTIVITIES */}
        {step === 3 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "6px" }}>🎉 Kya Karna Hai?</h2>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>Date mein kya activities hongi?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "10px" }}>
              {ACTIVITIES.map(act => {
                const key = `${act.id}__${act.label}`;
                const sel = form.activities.includes(key);
                return (
                  <div key={act.id} onClick={() => toggleActivity(act)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: G.radius.md, cursor: "pointer", border: `2px solid ${sel ? act.color : "#E5E7EB"}`, background: sel ? `${act.color}12` : "#fff", transition: "all 0.15s" }}>
                    <span style={{ fontSize: "1.3rem" }}>{act.emoji}</span>
                    <span style={{ fontSize: "13px", fontWeight: sel ? 700 : 500, color: sel ? act.color : "#374151" }}>{act.label}</span>
                    {sel && <span style={{ marginLeft: "auto", color: act.color }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: MESSAGE */}
        {step === 4 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "6px" }}>💬 Dil Ki Baat</h2>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>Kuch special likho {form.girlfriendName || "uske"} ke liye 🌹</p>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...S.input, minHeight: "180px", resize: "vertical" }} placeholder={`${form.girlfriendName || "Priya"}, tum meri zindagi ki sabse khoobsurat cheez ho...`} />
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>{form.message.length} characters</div>
          </div>
        )}

        {/* STEP 5: THEME */}
        {step === 5 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", marginBottom: "6px" }}>🎨 Rang Chunno</h2>
            <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "20px" }}>Proposal ka theme?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "24px" }}>
              {THEMES.map(t => (
                <div key={t.id} onClick={() => setTheme(t.id)} style={{ borderRadius: G.radius.md, overflow: "hidden", cursor: "pointer", border: `3px solid ${theme === t.id ? t.primary : "transparent"}`, boxShadow: theme === t.id ? `0 0 0 2px ${t.primary}40` : G.shadow.sm }}>
                  <div style={{ height: "60px", background: `linear-gradient(135deg,${t.bg1},${t.bg2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>💌</div>
                  <div style={{ padding: "8px", background: "#fff", fontSize: "12px", fontWeight: 600, textAlign: "center", color: t.primary }}>{t.label}</div>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: G.radius.lg, padding: "24px", background: `linear-gradient(135deg,${themeObj.bg1},${themeObj.bg2})`, textAlign: "center" }}>
              <div style={{ fontFamily: G.fontSerif, fontSize: "1.8rem", color: themeObj.accent }}>💖 {form.girlfriendName || "Priya"}, kya tum aogi?</div>
              <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "6px", color: themeObj.text }}>{form.date && `📅 ${form.date}`} {form.time && `⏰ ${form.time}`}</div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <button style={{ ...S.btn("#6B7280", true), visibility: step === 0 ? "hidden" : "visible" }} onClick={() => setStep(s => s - 1)}>← Back</button>
          {step < STEPS.length - 1
            ? <button style={{ ...S.btn(themeObj.primary), opacity: canNext() ? 1 : 0.5 }} disabled={!canNext()} onClick={() => setStep(s => s + 1)}>Next: {STEPS[step + 1]} →</button>
            : <button style={{ ...S.btn("#FF6B8A"), padding: "12px 28px", fontSize: "15px", opacity: loading ? 0.7 : 1 }} onClick={save} disabled={loading}>{loading ? "⏳ Firebase mein save ho raha hai..." : "🚀 Proposal Bhejo!"}</button>}
        </div>
      </div>
    </div>
  );
}

// ─── PROPOSAL VIEW (Girlfriend's Page) ───────────────────────────────────────
function ProposalView({ proposalId, onBack }) {
  const [proposal, setProposal]     = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [responded, setResponded]   = useState(false);
  const [response, setResponse]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    getProposal(proposalId).then(p => {
      if (p) { setProposal(p); setCheckedItems(p.checkedItems || []); if (p.response !== null) { setResponded(true); setResponse(p.response); } }
      setLoading(false);
    });
  }, [proposalId]);

  const toggleCheck = async (key) => {
    const updated = checkedItems.includes(key) ? checkedItems.filter(x => x !== key) : [...checkedItems, key];
    setCheckedItems(updated);
    await updateChecklist(proposalId, updated);
  };

  const respond = async (ans) => {
    setSaving(true);
    await updateProposalResponse(proposalId, ans);
    setResponse(ans); setResponded(true); setSaving(false);
  };

  if (loading) return <Spinner />;
  if (!proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px", fontFamily: G.fontSans }}>
      <div><div style={{ fontSize: "4rem" }}>😢</div><h2 style={{ fontFamily: G.fontSerif }}>Proposal nahi mila</h2><p style={{ color: "#6B7280" }}>Link galat hai ya proposal delete ho gaya</p></div>
    </div>
  );

  const themeObj = THEMES.find(t => t.id === proposal.theme) || THEMES[0];
  const allItems = [...(proposal.foods || []), ...(proposal.activities || [])];
  const checkedCount = checkedItems.filter(x => allItems.includes(x)).length;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${themeObj.bg1},${themeObj.bg2})`, fontFamily: G.fontSans, position: "relative" }}>
      <FloatingHearts color={themeObj.primary} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "24px" }}>
        {onBack && <button style={{ ...S.btn("#6B7280", true), marginBottom: "16px", padding: "8px 16px", fontSize: "13px" }} onClick={onBack}>← Back</button>}

        {/* HERO */}
        <div style={{ textAlign: "center", padding: "48px 20px 32px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>{responded && response ? "🥰" : "💌"}</div>
          <h1 style={{ fontFamily: G.fontSerif, fontSize: "clamp(2rem,6vw,3.2rem)", color: themeObj.accent, marginBottom: "8px", lineHeight: 1.1 }}>Dear {proposal.girlfriendName}...</h1>
          <p style={{ color: themeObj.text, opacity: 0.7, fontSize: "15px" }}>{proposal.senderName} ne tumhare liye kuch bahut khaas plan kiya hai 🌹</p>
        </div>

        {responded && (
          <div style={S.card({ textAlign: "center", background: response ? "linear-gradient(135deg,#D1FAE5,#A7F3D0)" : "linear-gradient(135deg,#FEE2E2,#FECACA)", border: "none" })}>
            <div style={{ fontSize: "2.5rem" }}>{response ? "🎊" : "💔"}</div>
            <h2 style={{ fontFamily: G.fontSerif, marginTop: "8px", color: response ? "#065F46" : "#991B1B" }}>
              {response ? `Tumne Haan Keh Diya! ${proposal.senderName} bahut khush hai! 🎉` : `Tumne Na Keh Diya... 😢`}
            </h2>
          </div>
        )}

        {/* DATE */}
        <div style={S.card()}>
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.15rem", marginBottom: "16px" }}>📅 Date Ka Plan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px" }}>
            {proposal.date && <div style={{ textAlign: "center", padding: "16px", background: `${themeObj.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.5rem" }}>📅</div><div style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 600, textTransform: "uppercase" }}>Date</div><div style={{ fontWeight: 700, color: themeObj.accent }}>{proposal.date}</div></div>}
            {proposal.time && <div style={{ textAlign: "center", padding: "16px", background: `${themeObj.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.5rem" }}>⏰</div><div style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 600, textTransform: "uppercase" }}>Time</div><div style={{ fontWeight: 700, color: themeObj.accent }}>{proposal.time}</div></div>}
            {proposal.location && <div style={{ textAlign: "center", padding: "16px", background: `${themeObj.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.5rem" }}>📍</div><div style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 600, textTransform: "uppercase" }}>Jagah</div><div style={{ fontWeight: 700, color: themeObj.accent, fontSize: "13px" }}>{proposal.location}</div></div>}
          </div>
        </div>

        {/* FOOD */}
        {proposal.foods?.length > 0 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.15rem", marginBottom: "6px" }}>🍽️ Khaana — Tick Karo Jo Pasand Aaye</h2>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>Jo tumhe pasand aaye usse tick karo!</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: "10px" }}>
              {proposal.foods.map(key => {
                const img = foodImg(key);
                const sel = checkedItems.includes(key);
                return (
                  <div key={key} onClick={() => toggleCheck(key)} style={{ borderRadius: G.radius.md, overflow: "hidden", cursor: "pointer", border: `2px solid ${sel ? themeObj.primary : "#E5E7EB"}`, transition: "all 0.15s", position: "relative" }}>
                    {sel && <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 2, background: themeObj.primary, borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 700 }}>✓</div>}
                    <div style={{ height: "90px", background: "#F3F4F6", overflow: "hidden" }}>
                      {img ? <img src={img} alt={foodLabel(key)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🍽️</div>}
                    </div>
                    <div style={{ padding: "8px", fontSize: "12px", fontWeight: 600, color: sel ? themeObj.primary : "#374151", textDecoration: sel ? "line-through" : "none", opacity: sel ? 0.7 : 1 }}>{foodLabel(key)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {proposal.activities?.length > 0 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.15rem", marginBottom: "16px" }}>🎉 Activities — Tick Karo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {proposal.activities.map(key => {
                const sel = checkedItems.includes(key);
                return (
                  <div key={key} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: G.radius.md, cursor: "pointer", background: sel ? `${themeObj.primary}10` : "#F9FAFB", border: `1px solid ${sel ? themeObj.primary : "transparent"}` }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${sel ? themeObj.primary : "#D1D5DB"}`, background: sel ? themeObj.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{sel && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}</div>
                    <span style={{ fontSize: "1.1rem" }}>{actEmoji(key)}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: sel ? themeObj.primary : "#374151", textDecoration: sel ? "line-through" : "none", opacity: sel ? 0.7 : 1 }}>{actLabel(key)}</span>
                  </div>
                );
              })}
            </div>
            {allItems.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}><span>Tumhari choices</span><span>{checkedCount}/{allItems.length}</span></div>
                <div style={{ height: "6px", background: "#E5E7EB", borderRadius: G.radius.full }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg,${themeObj.primary},${themeObj.secondary})`, borderRadius: G.radius.full, width: `${allItems.length ? (checkedCount / allItems.length) * 100 : 0}%`, transition: "width 0.4s" }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGE */}
        {proposal.message && (
          <div style={S.card({ textAlign: "center", padding: "32px 24px" })}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>💝</div>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", color: themeObj.accent, marginBottom: "16px" }}>{proposal.senderName} ka message</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#374151", fontStyle: "italic" }}>"{proposal.message}"</p>
            <p style={{ marginTop: "12px", color: "#9CA3AF", fontSize: "14px" }}>— {proposal.senderName} 🌹</p>
          </div>
        )}

        {/* CTA */}
        {!responded && (
          <div style={S.card({ textAlign: "center", padding: "40px 24px" })}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.8rem", color: themeObj.accent, marginBottom: "8px" }}>{proposal.girlfriendName}, kya tum aogi? 🌹</h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>{proposal.senderName} tumhara jawab ka intezaar kar raha hai 💌</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ ...S.btn("#10B981"), padding: "14px 28px", fontSize: "15px", opacity: saving ? 0.7 : 1 }} onClick={() => respond(true)} disabled={saving}>💚 Haan! Main Aaungi</button>
              <button style={{ ...S.btn("#EF4444"), padding: "14px 28px", fontSize: "15px", opacity: saving ? 0.7 : 1 }} onClick={() => respond(false)} disabled={saving}>💔 Abhi Nahi</button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "24px", fontSize: "12px", color: "#9CA3AF" }}>Made with 💖 · LoveDate SaaS · Powered by Firebase</div>
      </div>
    </div>
  );
}

// ─── STATUS PAGE ──────────────────────────────────────────────────────────────
function StatusPage({ proposalId, onBack }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    const p = await getProposal(proposalId);
    setProposal(p); setLoading(false);
  }, [proposalId]);

  useEffect(() => { load(); const interval = setInterval(load, 5000); return () => clearInterval(interval); }, [load]);

  if (loading) return <Spinner />;
  if (!proposal) return <div style={{ padding: "40px", textAlign: "center" }}>Proposal nahi mila ❌</div>;

  const themeObj = THEMES.find(t => t.id === proposal.theme) || THEMES[0];
  const allItems = [...(proposal.foods || []), ...(proposal.activities || [])];
  const checkedCount = (proposal.checkedItems || []).filter(x => allItems.includes(x)).length;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/proposal/${proposalId}` : "";

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: G.fontSans }}>
      <nav style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <button style={{ ...S.btn("#6B7280", true), padding: "8px 16px", fontSize: "13px" }} onClick={onBack}>← Dashboard</button>
        <span style={{ fontFamily: G.fontSerif, fontSize: "1.2rem", color: "#D63060" }}>📊 Status — {proposal.girlfriendName}</span>
        <span style={{ fontSize: "12px", color: "#9CA3AF", marginLeft: "auto" }}>🔄 Auto-refresh har 5s</span>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>
        {/* RESPONSE */}
        <div style={S.card({ textAlign: "center", padding: "36px" })}>
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>{proposal.response === true ? "🎊" : proposal.response === false ? "💔" : "⏳"}</div>
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.6rem", color: "#1F2937", marginBottom: "8px" }}>
            {proposal.response === true ? `${proposal.girlfriendName} ne HAAN bol diya! 🥰` : proposal.response === false ? `${proposal.girlfriendName} ne na bol diya...` : `${proposal.girlfriendName} ka jawab abhi nahi aaya`}
          </h2>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: G.radius.full, fontWeight: 700, fontSize: "14px", background: proposal.response === true ? "#D1FAE5" : proposal.response === false ? "#FEE2E2" : "#FEF3C7", color: proposal.response === true ? "#065F46" : proposal.response === false ? "#991B1B" : "#92400E" }}>
            {proposal.response === true ? "✓ Accepted" : proposal.response === false ? "✗ Declined" : "⏳ Pending"}
          </div>
          <div style={{ marginTop: "16px" }}>
            <button style={{ ...S.btn("#6B7280", true), padding: "8px 18px", fontSize: "13px" }} onClick={load}>🔄 Refresh</button>
          </div>
        </div>

        {/* DATE */}
        <div style={S.card()}>
          <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "12px" }}>📅 Date Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {[{ icon: "📅", label: "Date", val: proposal.date }, { icon: "⏰", label: "Time", val: proposal.time }, { icon: "📍", label: "Jagah", val: proposal.location || "—" }].map(d => (
              <div key={d.label} style={{ textAlign: "center", padding: "12px", background: `${themeObj.primary}10`, borderRadius: G.radius.md }}>
                <div style={{ fontSize: "1.3rem" }}>{d.icon}</div>
                <div style={{ fontSize: "10px", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", margin: "4px 0 2px" }}>{d.label}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: themeObj.accent }}>{d.val || "—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CHECKLIST */}
        {allItems.length > 0 && (
          <div style={S.card()}>
            <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "6px" }}>✅ {proposal.girlfriendName} ki Choices</h3>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>Usne kya-kya tick kiya — Firebase se live data</p>
            <div style={{ height: "8px", background: "#E5E7EB", borderRadius: G.radius.full, marginBottom: "8px" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${themeObj.primary},${themeObj.secondary})`, borderRadius: G.radius.full, width: `${allItems.length ? (checkedCount / allItems.length) * 100 : 0}%`, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>{checkedCount}/{allItems.length} ticked</div>

            {proposal.foods?.length > 0 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: "8px" }}>🍽️ Food</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  {proposal.foods.map(key => {
                    const img = foodImg(key); const sel = (proposal.checkedItems || []).includes(key);
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px 4px 6px", borderRadius: G.radius.full, border: `1px solid ${sel ? themeObj.primary : "#E5E7EB"}`, background: sel ? `${themeObj.primary}15` : "#fff", fontSize: "12px", fontWeight: sel ? 700 : 400, color: sel ? themeObj.primary : "#374151" }}>
                        {img && <img src={img} alt="" style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }} />}
                        {sel && "✓ "}{foodLabel(key)}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {proposal.activities?.length > 0 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: "8px" }}>🎉 Activities</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {proposal.activities.map(key => {
                    const sel = (proposal.checkedItems || []).includes(key);
                    return <span key={key} style={{ padding: "4px 12px", borderRadius: G.radius.full, fontSize: "12px", fontWeight: sel ? 700 : 400, background: sel ? `${themeObj.primary}15` : "#F3F4F6", border: `1px solid ${sel ? themeObj.primary : "transparent"}`, color: sel ? themeObj.primary : "#374151" }}>{actEmoji(key)} {sel && "✓ "}{actLabel(key)}</span>;
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* SHARE */}
        <div style={S.card()}>
          <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "12px" }}>🔗 Share Link</h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "#F9FAFB", padding: "10px 14px", borderRadius: G.radius.md, marginBottom: "12px" }}>
            <span style={{ flex: 1, fontSize: "13px", color: "#374151", wordBreak: "break-all" }}>{shareUrl}</span>
            <button style={{ ...S.btn(themeObj.primary), padding: "6px 14px", fontSize: "12px" }} onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
          </div>
          <a href={`https://wa.me/?text=${encodeURIComponent(`💌 Mera proposal dekho: ${shareUrl}`)}`} target="_blank" rel="noreferrer" style={{ ...S.btn("#25D366"), textDecoration: "none", display: "inline-flex" }}>📱 WhatsApp</a>
        </div>

        <div style={{ textAlign: "center", padding: "24px", fontSize: "12px", color: "#9CA3AF" }}>Made with 💖 · LoveDate SaaS · Powered by Firebase</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP — Firebase Auth State Manager
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView]           = useState("loading");
  const [user, setUser]           = useState(null);
  const [toastMsg, setToastMsg]   = useState(null);

  const showToast = (msg) => setToastMsg(msg);

  // Firebase Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getUserDoc(firebaseUser.uid);
        setUser(userDoc || { id: firebaseUser.uid, name: firebaseUser.displayName, email: firebaseUser.email, plan: "free" });
        setView("dashboard");
      } else {
        setView("landing");
      }
    });
    return () => unsub();
  }, []);

  const login  = (u) => { setUser(u); setView("dashboard"); };
  const logout = async () => { await signOut(auth); setUser(null); setView("landing"); };

  // Handle /dashboard route
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/dashboard" && user) {
      setView("dashboard");
    }
  }, [user]);

  if (view === "loading") return <Spinner />;

  return (
    <div style={{ fontFamily: G.fontSans }}>
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}

      {view === "landing"   && <LandingPage onLogin={() => setView("login")} onSignup={() => setView("signup")} />}
      {view === "login"     && <AuthPage mode="login"  onAuth={login} onSwitch={() => setView("signup")} showToast={showToast} />}
      {view === "signup"    && <AuthPage mode="signup" onAuth={login} onSwitch={() => setView("login")}  showToast={showToast} />}
      {view === "dashboard" && user && (
        <Dashboard user={user} onLogout={logout}
          onNew={() => {
            if (user.plan === "free" && (user.proposalCount || 0) >= 5) { showToast("⚠️ Free plan limit! Upgrade karo."); return; }
            setView("create");
          }}
          onViewProposal={(id) => { window.location.href = `/proposal/${id}`; }}
          onStatus={(id) => { window.location.href = `/status/${id}`; }}
        />
      )}
      {view === "create"   && user && <ProposalCreator user={user} onBack={() => setView("dashboard")} onSave={(id) => { window.location.href = `/status/${id}`; }} showToast={showToast} />}

    </div>
  );
}
