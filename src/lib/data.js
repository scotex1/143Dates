// ─── SHARED DATA — food, activities, themes ───────────────────────────────────

export const FOOD_CATEGORIES = [
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
      { id: "coffee",     name: "Coffee",          img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80" },
      { id: "bubble_tea", name: "Bubble Tea",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
      { id: "croissant",  name: "Croissant",       img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80" },
      { id: "smoothie",   name: "Smoothie",        img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80" },
      { id: "pancakes",   name: "Pancakes",        img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&q=80" },
      { id: "waffles_b",  name: "Belgian Waffles", img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&q=80" },
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

export const ACTIVITIES = [
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

export const THEMES = [
  { id: "rose",     label: "Rose",     primary: "#FF6B8A", secondary: "#FF9BB5", accent: "#D63060", bg1: "#fff0f3", bg2: "#ffe4ec", text: "#7C2D3E" },
  { id: "violet",   label: "Violet",   primary: "#8B5CF6", secondary: "#A78BFA", accent: "#6D28D9", bg1: "#f5f3ff", bg2: "#ede9fe", text: "#4C1D95" },
  { id: "gold",     label: "Gold",     primary: "#F59E0B", secondary: "#FCD34D", accent: "#D97706", bg1: "#fffbeb", bg2: "#fef3c7", text: "#78350F" },
  { id: "teal",     label: "Teal",     primary: "#0D9488", secondary: "#34D399", accent: "#047857", bg1: "#f0fdfa", bg2: "#ccfbf1", text: "#134E4A" },
  { id: "midnight", label: "Midnight", primary: "#818CF8", secondary: "#A5B4FC", accent: "#6366F1", bg1: "#1e1b4b", bg2: "#312e81", text: "#E0E7FF", dark: true },
  { id: "sunset",   label: "Sunset",   primary: "#F97316", secondary: "#FB923C", accent: "#EA580C", bg1: "#fff7ed", bg2: "#ffedd5", text: "#7C2D12" },
];

export const PLANS = [
  { id: "free",    name: "Free",    price: "₹0",      color: "#6B7280", features: ["5 proposals/month", "3 food categories", "Basic themes", "Shareable link"], limit: 5 },
  { id: "lover",   name: "Lover",   price: "₹199/mo", color: "#FF6B8A", features: ["Unlimited proposals", "All food + photos", "All 6 themes", "Live checklist", "WhatsApp share"], popular: true, limit: Infinity },
  { id: "premium", name: "Premium", price: "₹499/mo", color: "#8B5CF6", features: ["Everything in Lover", "Custom branding", "Analytics", "Priority support"], limit: Infinity },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const G = {
  fontSerif: "Georgia, serif",
  fontSans:  "system-ui, -apple-system, sans-serif",
  radius:    { sm: "8px", md: "16px", lg: "24px", full: "999px" },
  shadow:    { sm: "0 2px 8px rgba(0,0,0,0.08)", md: "0 4px 24px rgba(0,0,0,0.10)", lg: "0 12px 48px rgba(0,0,0,0.14)" },
};

export const S = {
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
    border: "2px solid #E5E7EB", fontSize: "15px",
    outline: "none", boxSizing: "border-box", background: "#fff",
  },
  label: {
    fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em",
    textTransform: "uppercase", color: "#6B7280", marginBottom: "6px", display: "block",
  },
};

export function foodLabel(key) { return key.split("__")[1]; }
export function foodImg(key) {
  const id = key.split("__")[0];
  for (const cat of FOOD_CATEGORIES) {
    const f = cat.items.find(i => i.id === id);
    if (f) return f.img;
  }
  return null;
}
export function actLabel(key) { return key.split("__")[1]; }
export function actEmoji(key) { return ACTIVITIES.find(a => a.id === key.split("__")[0])?.emoji || "🎉"; }
