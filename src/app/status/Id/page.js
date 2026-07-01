'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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
  { id: "rose",     primary: "#FF6B8A", secondary: "#FF9BB5", accent: "#D63060", bg1: "#fff0f3", bg2: "#ffe4ec" },
  { id: "violet",   primary: "#8B5CF6", secondary: "#A78BFA", accent: "#6D28D9", bg1: "#f5f3ff", bg2: "#ede9fe" },
  { id: "gold",     primary: "#F59E0B", secondary: "#FCD34D", accent: "#D97706", bg1: "#fffbeb", bg2: "#fef3c7" },
  { id: "teal",     primary: "#0D9488", secondary: "#34D399", accent: "#047857", bg1: "#f0fdfa", bg2: "#ccfbf1" },
  { id: "midnight", primary: "#818CF8", secondary: "#A5B4FC", accent: "#6366F1", bg1: "#1e1b4b", bg2: "#312e81" },
  { id: "sunset",   primary: "#F97316", secondary: "#FB923C", accent: "#EA580C", bg1: "#fff7ed", bg2: "#ffedd5" },
];

const G = { fontSerif: "Georgia, serif", fontSans: "system-ui,-apple-system,sans-serif", radius: { md: "16px", lg: "24px", full: "999px" }, shadow: { md: "0 4px 24px rgba(0,0,0,0.10)" } };
const S = {
  card: (extra = {}) => ({ background: "#fff", borderRadius: G.radius.lg, padding: "24px", boxShadow: G.shadow.md, border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px", ...extra }),
  btn: (color, outline = false) => ({ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", borderRadius: G.radius.full, fontWeight: 600, fontSize: "14px", cursor: "pointer", border: outline ? `2px solid ${color}` : "none", background: outline ? "transparent" : color, color: outline ? color : "#fff", fontFamily: G.fontSans, textDecoration: "none" }),
};

function foodImg(key) {
  const id = key.split("__")[0];
  for (const cat of FOOD_CATEGORIES) { const f = cat.items.find(i => i.id === id); if (f) return f.img; }
  return null;
}
function foodLabel(key) { return key.split("__")[1]; }
function actEmoji(key) { return ACTIVITIES.find(a => a.id === key.split("__")[0])?.emoji || "🎉"; }
function actLabel(key) { return key.split("__")[1]; }

export default function StatusPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Real-time listener — changes instantly jab girlfriend tick kare ya respond kare
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "proposals", id), (snap) => {
      if (!snap.exists()) { setNotFound(true); return; }
      setProposal({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/proposal/${id}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: G.fontSans }}>
      <div><div style={{ fontSize: "4rem" }}>❌</div><h2 style={{ fontFamily: G.fontSerif }}>Proposal nahi mila</h2><a href="/" style={{ ...S.btn("#FF6B8A"), marginTop: "16px", display: "inline-flex" }}>Dashboard</a></div>
    </div>
  );

  if (!proposal) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", fontFamily: G.fontSans }}>
      <div style={{ fontSize: "3rem", animation: "spin 1.5s linear infinite" }}>📊</div>
      <p style={{ color: "#6B7280" }}>Status load ho raha hai...</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const t = THEMES.find(th => th.id === proposal.theme) || THEMES[0];
  const allItems = [...(proposal.foods || []), ...(proposal.activities || [])];
  const checkedCount = (proposal.checkedItems || []).filter(x => allItems.includes(x)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: G.fontSans }}>
      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E5E7EB", flexWrap: "wrap" }}>
        <a href="/dashboard" style={{ ...S.btn("#6B7280", true), padding: "8px 16px", fontSize: "13px" }}>← Dashboard</a>
        <span style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", color: "#D63060" }}>📊 {proposal.girlfriendName} ka Status</span>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#10B981", fontWeight: 600 }}>🔴 Live — Firebase Real-time</span>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px" }}>

        {/* RESPONSE STATUS */}
        <div style={S.card({ textAlign: "center", padding: "40px", background: proposal.response === true ? "linear-gradient(135deg,#D1FAE5,#A7F3D0)" : proposal.response === false ? "linear-gradient(135deg,#FEE2E2,#FECACA)" : "linear-gradient(135deg,#FEF3C7,#FDE68A)", border: "none" })}>
          <div style={{ fontSize: "4rem", marginBottom: "12px" }}>
            {proposal.response === true ? "🎊" : proposal.response === false ? "💔" : "⏳"}
          </div>
          <h2 style={{ fontFamily: G.fontSerif, fontSize: "1.6rem", marginBottom: "8px", color: proposal.response === true ? "#065F46" : proposal.response === false ? "#991B1B" : "#92400E" }}>
            {proposal.response === true
              ? `${proposal.girlfriendName} ne HAAN bol diya! 🥰`
              : proposal.response === false
              ? `${proposal.girlfriendName} ne na bol diya...`
              : `${proposal.girlfriendName} ka jawab abhi nahi aaya`}
          </h2>
          <div style={{ fontSize: "13px", color: "#6B7280" }}>
            {proposal.response === null ? "Jab woh respond karegi, yahan instantly dikhega 🔴" : ""}
          </div>
        </div>

        {/* DATE DETAILS */}
        <div style={S.card()}>
          <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "16px" }}>📅 Date Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
            {[{ icon: "📅", label: "Date", val: proposal.date }, { icon: "⏰", label: "Time", val: proposal.time }, { icon: "📍", label: "Jagah", val: proposal.location || "—" }].map(d => (
              <div key={d.label} style={{ textAlign: "center", padding: "14px", background: `${t.primary}10`, borderRadius: G.radius.md }}>
                <div style={{ fontSize: "1.3rem" }}>{d.icon}</div>
                <div style={{ fontSize: "10px", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", margin: "4px 0 2px" }}>{d.label}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: t.accent }}>{d.val || "—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GIRLFRIEND KI CHOICES */}
        {allItems.length > 0 && (
          <div style={S.card()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem" }}>✅ {proposal.girlfriendName} ki Choices</h3>
              <span style={{ fontSize: "13px", fontWeight: 700, color: t.primary }}>{checkedCount}/{allItems.length} ticked</span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>Real-time update — jab woh tick kare toh yahan instantly dikhega</p>

            {/* PROGRESS */}
            <div style={{ height: "10px", background: "#E5E7EB", borderRadius: G.radius.full, marginBottom: "20px" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg,${t.primary},${t.secondary})`, borderRadius: G.radius.full, width: `${allItems.length ? (checkedCount / allItems.length) * 100 : 0}%`, transition: "width 0.5s" }} />
            </div>

            {/* FOOD */}
            {proposal.foods?.length > 0 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>🍽️ Food</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                  {proposal.foods.map(key => {
                    const img = foodImg(key);
                    const sel = (proposal.checkedItems || []).includes(key);
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px 6px 6px", borderRadius: G.radius.full, border: `2px solid ${sel ? t.primary : "#E5E7EB"}`, background: sel ? `${t.primary}15` : "#fff", fontSize: "13px", fontWeight: sel ? 700 : 400, color: sel ? t.primary : "#6B7280", transition: "all 0.3s" }}>
                        {img && <img src={img} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />}
                        {sel && <span>✓</span>} {foodLabel(key)}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ACTIVITIES */}
            {proposal.activities?.length > 0 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>🎉 Activities</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {proposal.activities.map(key => {
                    const sel = (proposal.checkedItems || []).includes(key);
                    return (
                      <span key={key} style={{ padding: "6px 14px", borderRadius: G.radius.full, fontSize: "13px", fontWeight: sel ? 700 : 400, background: sel ? `${t.primary}15` : "#F3F4F6", border: `2px solid ${sel ? t.primary : "transparent"}`, color: sel ? t.primary : "#6B7280", transition: "all 0.3s" }}>
                        {actEmoji(key)} {sel && "✓ "}{actLabel(key)}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* SHARE */}
        <div style={S.card()}>
          <h3 style={{ fontFamily: G.fontSerif, fontSize: "1.1rem", marginBottom: "12px" }}>🔗 Proposal Link — {proposal.girlfriendName} ko Bhejo</h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "#F9FAFB", padding: "12px 16px", borderRadius: G.radius.md, marginBottom: "12px", border: "1px solid #E5E7EB" }}>
            <span style={{ flex: 1, fontSize: "13px", color: "#374151", wordBreak: "break-all", fontFamily: "monospace" }}>{shareUrl}</span>
            <button style={{ ...S.btn(t.primary), padding: "8px 16px", fontSize: "13px", flexShrink: 0 }} onClick={copyLink}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(`💌 ${proposal.senderName} ne tumhare liye ek special date plan kiya hai! Dekho: ${shareUrl}`)}`}
              target="_blank" rel="noreferrer" style={{ ...S.btn("#25D366"), display: "inline-flex" }}>
              📱 WhatsApp Pe Bhejo
            </a>
            <a href={`/proposal/${id}`} target="_blank" rel="noreferrer" style={{ ...S.btn(t.primary, true), display: "inline-flex" }}>
              👁️ Preview Dekho
            </a>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "24px", fontSize: "12px", color: "#9CA3AF" }}>
          Made with 💖 · LoveDate SaaS · Powered by Firebase
        </div>
      </div>
    </div>
  );
}
