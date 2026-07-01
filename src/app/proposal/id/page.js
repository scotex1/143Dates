'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

// ─── FOOD DATA ────────────────────────────────────────────────────────────────
const FOOD_CATEGORIES = [
  { id: "fastfood", items: [{ id: "burger", name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" }, { id: "pizza", name: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" }, { id: "fries", name: "French Fries", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" }, { id: "hotdog", name: "Hot Dog", img: "https://images.unsplash.com/photo-1612392062631-94b9e307c2a2?w=300&q=80" }, { id: "wrap", name: "Wrap", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&q=80" }, { id: "tacos", name: "Tacos", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80" }] },
  { id: "icecream", items: [{ id: "icecream_cone", name: "Ice Cream Cone", img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&q=80" }, { id: "sundae", name: "Sundae", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80" }, { id: "gelato", name: "Gelato", img: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&q=80" }, { id: "popsicle", name: "Popsicle", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=80" }, { id: "waffle", name: "Waffle Cone", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=300&q=80" }, { id: "milkshake", name: "Milkshake", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80" }] },
  { id: "sweets", items: [{ id: "cake", name: "Cake", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80" }, { id: "macaron", name: "Macarons", img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300&q=80" }, { id: "chocolate", name: "Chocolate", img: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&q=80" }, { id: "donut", name: "Donuts", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" }, { id: "brownie", name: "Brownies", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80" }, { id: "cheesecake", name: "Cheesecake", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&q=80" }] },
  { id: "finedine", items: [{ id: "sushi", name: "Sushi", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80" }, { id: "pasta", name: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80" }, { id: "steak", name: "Steak", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80" }, { id: "lobster", name: "Lobster", img: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=300&q=80" }, { id: "biryani", name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80" }, { id: "fondue", name: "Fondue", img: "https://images.unsplash.com/photo-1637806931073-b18efd43ccb1?w=300&q=80" }] },
  { id: "cafe", items: [{ id: "coffee", name: "Coffee", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80" }, { id: "bubble_tea", name: "Bubble Tea", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" }, { id: "croissant", name: "Croissant", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80" }, { id: "smoothie", name: "Smoothie", img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80" }, { id: "pancakes", name: "Pancakes", img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&q=80" }, { id: "waffles_b", name: "Belgian Waffles", img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&q=80" }] },
  { id: "streetfood", items: [{ id: "pani_puri", name: "Pani Puri", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80" }, { id: "chaat", name: "Chaat", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80" }, { id: "samosa", name: "Samosa", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80" }, { id: "noodles", name: "Noodles", img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&q=80" }, { id: "momos", name: "Momos", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&q=80" }, { id: "kebab", name: "Kebab", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80" }] },
];

const ACTIVITIES = [
  { id: "movie", emoji: "🎬", label: "Movie Night" }, { id: "stars", emoji: "🌃", label: "Stargazing" },
  { id: "amusement", emoji: "🎢", label: "Amusement Park" }, { id: "beach", emoji: "🏖️", label: "Beach Walk" },
  { id: "theatre", emoji: "🎭", label: "Theatre Show" }, { id: "art", emoji: "🖼️", label: "Art Gallery" },
  { id: "hike", emoji: "🧗", label: "Hiking" }, { id: "gaming", emoji: "🎮", label: "Gaming Night" },
  { id: "music", emoji: "🎶", label: "Live Music" }, { id: "boat", emoji: "🚣", label: "Boat Ride" },
  { id: "bowling", emoji: "🎳", label: "Bowling" }, { id: "garden", emoji: "🌸", label: "Garden Stroll" },
  { id: "cook", emoji: "🍳", label: "Cook Together" }, { id: "photo", emoji: "📸", label: "Photo Walk" },
  { id: "baking", emoji: "🧁", label: "Baking Together" }, { id: "spa", emoji: "🧖", label: "Spa Day" },
  { id: "picnic", emoji: "🧺", label: "Picnic" }, { id: "dance", emoji: "💃", label: "Dance Night" },
];

const THEMES = [
  { id: "rose",     primary: "#FF6B8A", secondary: "#FF9BB5", accent: "#D63060", bg1: "#fff0f3", bg2: "#ffe4ec", text: "#7C2D3E" },
  { id: "violet",   primary: "#8B5CF6", secondary: "#A78BFA", accent: "#6D28D9", bg1: "#f5f3ff", bg2: "#ede9fe", text: "#4C1D95" },
  { id: "gold",     primary: "#F59E0B", secondary: "#FCD34D", accent: "#D97706", bg1: "#fffbeb", bg2: "#fef3c7", text: "#78350F" },
  { id: "teal",     primary: "#0D9488", secondary: "#34D399", accent: "#047857", bg1: "#f0fdfa", bg2: "#ccfbf1", text: "#134E4A" },
  { id: "midnight", primary: "#818CF8", secondary: "#A5B4FC", accent: "#6366F1", bg1: "#1e1b4b", bg2: "#312e81", text: "#E0E7FF" },
  { id: "sunset",   primary: "#F97316", secondary: "#FB923C", accent: "#EA580C", bg1: "#fff7ed", bg2: "#ffedd5", text: "#7C2D12" },
];

const G = { fontSerif: "Georgia, serif", fontSans: "system-ui,-apple-system,sans-serif", radius: { md: "16px", lg: "24px", full: "999px" }, shadow: { md: "0 4px 24px rgba(0,0,0,0.10)" } };
const S = {
  card: (extra = {}) => ({ background: "#fff", borderRadius: G.radius.lg, padding: "24px", boxShadow: G.shadow.md, border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px", ...extra }),
  btn: (color, outline = false) => ({ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", borderRadius: G.radius.full, fontWeight: 600, fontSize: "14px", cursor: "pointer", border: outline ? `2px solid ${color}` : "none", background: outline ? "transparent" : color, color: outline ? color : "#fff", fontFamily: G.fontSans }),
};

function foodImg(key) {
  const id = key.split("__")[0];
  for (const cat of FOOD_CATEGORIES) { const f = cat.items.find(i => i.id === id); if (f) return f.img; }
  return null;
}
function foodLabel(key) { return key.split("__")[1]; }
function actEmoji(key) { return ACTIVITIES.find(a => a.id === key.split("__")[0])?.emoji || "🎉"; }
function actLabel(key) { return key.split("__")[1]; }

function FloatingHearts({ color }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", bottom: "-40px", left: `${10 + i * 11}%`, fontSize: `${1 + (i % 3) * 0.6}rem`, animation: `fh ${4 + i * 0.7}s ease-in ${i * 0.5}s infinite`, opacity: 0.35, color }}>💖</div>
      ))}
      <style>{`@keyframes fh{0%{transform:translateY(0);opacity:.35}100%{transform:translateY(-110vh) rotate(25deg);opacity:0}}`}</style>
    </div>
  );
}

export default function ProposalPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [response, setResponse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // ✅ Real-time listener — Firebase onSnapshot
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "proposals", id), (snap) => {
      if (!snap.exists()) { setNotFound(true); return; }
      const data = { id: snap.id, ...snap.data() };
      setProposal(data);
      setCheckedItems(data.checkedItems || []);
      setResponse(data.response ?? null);
    });
    return () => unsub();
  }, [id]);

  const toggleCheck = async (key) => {
    const updated = checkedItems.includes(key)
      ? checkedItems.filter(x => x !== key)
      : [...checkedItems, key];
    setCheckedItems(updated);
    await updateDoc(doc(db, "proposals", id), { checkedItems: updated });
  };

  const respond = async (ans) => {
    setSaving(true);
    await updateDoc(doc(db, "proposals", id), { response: ans });
    setSaving(false);
  };

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: G.fontSans }}>
      <div><div style={{ fontSize: "4rem" }}>😢</div><h2 style={{ fontFamily: G.fontSerif }}>Proposal nahi mila</h2><p style={{ color: "#6B7280" }}>Link galat hai ya proposal delete ho gaya</p><a href="/" style={{ ...S.btn("#FF6B8A"), textDecoration: "none", marginTop: "16px", display: "inline-flex" }}>Home Pe Jao</a></div>
    </div>
  );

  if (!proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", fontFamily: G.fontSans }}>
      <div style={{ fontSize: "3rem", animation: "spin 1.5s linear infinite" }}>💌</div>
      <p style={{ color: "#6B7280" }}>Tumhara surprise load ho raha hai...</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const t = THEMES.find(th => th.id === proposal.theme) || THEMES[0];
  const allItems = [...(proposal.foods || []), ...(proposal.activities || [])];
  const checkedCount = checkedItems.filter(x => allItems.includes(x)).length;
  const responded = response !== null;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${t.bg1},${t.bg2})`, fontFamily: G.fontSans, position: "relative" }}>
      <FloatingHearts color={t.primary} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "24px" }}>

        {/* HERO */}
        <div style={{ textAlign: "center", padding: "48px 20px 32px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>{responded && response ? "🥰" : "💌"}</div>
          <h1 style={{ fontFamily: G.fontSerif, fontSize: "clamp(2rem,6vw,3.2rem)", color: t.accent, marginBottom: "8px", lineHeight: 1.1 }}>
            Dear {proposal.girlfriendName}...
          </h1>
          <p style={{ color: t.text, opacity: 0.75, fontSize: "15px" }}>
            {proposal.senderName} ne tumhare liye kuch bahut khaas plan kiya hai 🌹
          </p>
        </div>

        {/* RESPONSE BANNER */}
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
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "16px" }}>📅 Date Ka Plan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "12px" }}>
            {proposal.date && <div style={{ textAlign: "center", padding: "16px", background: `${t.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.4rem" }}>📅</div><div style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 700, textTransform: "uppercase" }}>Date</div><div style={{ fontWeight: 700, color: t.accent }}>{proposal.date}</div></div>}
            {proposal.time && <div style={{ textAlign: "center", padding: "16px", background: `${t.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.4rem" }}>⏰</div><div style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 700, textTransform: "uppercase" }}>Time</div><div style={{ fontWeight: 700, color: t.accent }}>{proposal.time}</div></div>}
            {proposal.location && <div style={{ textAlign: "center", padding: "16px", background: `${t.primary}10`, borderRadius: G.radius.md }}><div style={{ fontSize: "1.4rem" }}>📍</div><div style={{ fontSize: "10px", color: "#6B7280", margin: "4px 0 2px", fontWeight: 700, textTransform: "uppercase" }}>Jagah</div><div style={{ fontWeight: 700, color: t.accent, fontSize: "13px" }}>{proposal.location}</div></div>}
          </div>
        </div>

        {/* FOOD */}
        {proposal.foods?.length > 0 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "6px" }}>🍽️ Khaana — Tick Karo Jo Pasand Aaye</h2>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>Photos pe click karo ✨</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: "10px" }}>
              {proposal.foods.map(key => {
                const img = foodImg(key);
                const sel = checkedItems.includes(key);
                return (
                  <div key={key} onClick={() => toggleCheck(key)} style={{ borderRadius: G.radius.md, overflow: "hidden", cursor: "pointer", border: `2px solid ${sel ? t.primary : "#E5E7EB"}`, transition: "all 0.15s", position: "relative", background: "#fff" }}>
                    {sel && <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 2, background: t.primary, borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700 }}>✓</div>}
                    <div style={{ height: "100px", background: "#F3F4F6", overflow: "hidden" }}>
                      {img
                        ? <img src={img} alt={foodLabel(key)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🍽️</div>}
                    </div>
                    <div style={{ padding: "8px 10px", fontSize: "12px", fontWeight: 600, color: sel ? t.primary : "#374151", textDecoration: sel ? "line-through" : "none", opacity: sel ? 0.7 : 1 }}>{foodLabel(key)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {proposal.activities?.length > 0 && (
          <div style={S.card()}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "16px" }}>🎉 Activities — Tick Karo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {proposal.activities.map(key => {
                const sel = checkedItems.includes(key);
                return (
                  <div key={key} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: G.radius.md, cursor: "pointer", background: sel ? `${t.primary}10` : "#F9FAFB", border: `1px solid ${sel ? t.primary : "transparent"}`, transition: "all 0.15s" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${sel ? t.primary : "#D1D5DB"}`, background: sel ? t.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {sel && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "1.1rem" }}>{actEmoji(key)}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: sel ? t.primary : "#374151", textDecoration: sel ? "line-through" : "none", opacity: sel ? 0.7 : 1 }}>{actLabel(key)}</span>
                  </div>
                );
              })}
            </div>
            {allItems.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}><span>Progress</span><span>{checkedCount}/{allItems.length}</span></div>
                <div style={{ height: "6px", background: "#E5E7EB", borderRadius: G.radius.full }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg,${t.primary},${t.secondary})`, borderRadius: G.radius.full, width: `${allItems.length ? (checkedCount / allItems.length) * 100 : 0}%`, transition: "width 0.4s" }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGE */}
        {proposal.message && (
          <div style={S.card({ textAlign: "center", padding: "32px 24px" })}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>💝</div>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.4rem", color: t.accent, marginBottom: "16px" }}>{proposal.senderName} ka message</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#374151", fontStyle: "italic" }}>"{proposal.message}"</p>
            <p style={{ marginTop: "12px", color: "#9CA3AF", fontSize: "14px" }}>— {proposal.senderName} 🌹</p>
          </div>
        )}

        {/* RESPONSE CTA */}
        {!responded && (
          <div style={S.card({ textAlign: "center", padding: "40px 24px" })}>
            <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.8rem", color: t.accent, marginBottom: "8px" }}>
              {proposal.girlfriendName}, kya tum aogi? 🌹
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>{proposal.senderName} tumhara jawab ka intezaar kar raha hai 💌</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ ...S.btn("#10B981"), padding: "14px 28px", fontSize: "15px", opacity: saving ? 0.7 : 1 }} onClick={() => respond(true)} disabled={saving}>💚 Haan! Main Aaungi</button>
              <button style={{ ...S.btn("#EF4444"), padding: "14px 28px", fontSize: "15px", opacity: saving ? 0.7 : 1 }} onClick={() => respond(false)} disabled={saving}>💔 Abhi Nahi</button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "24px", fontSize: "12px", color: "#9CA3AF" }}>
          Made with 💖 · <a href="/" style={{ color: t.primary }}>LoveDate SaaS</a> · Powered by Firebase
        </div>
      </div>
    </div>
  );
}
