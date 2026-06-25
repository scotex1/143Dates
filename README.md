# 💌 LoveDate — Firebase SaaS Platform

---

## 🔥 Step 1: Firebase Setup (5 minutes)

### 1. Firebase Console pe jao
https://console.firebase.google.com

### 2. New Project banao
- "Add Project" click karo
- Naam: `lovedate` (ya kuch bhi)
- Google Analytics: Skip

### 3. Authentication Enable karo
- Left menu → Authentication → Get Started
- Sign-in method → Email/Password → Enable → Save

### 4. Firestore Database banao
- Left menu → Firestore Database → Create Database
- "Start in test mode" select karo → Next → Done

### 5. Web App Add karo
- Project Settings (gear icon) → General → "Your Apps"
- Web icon (</>)  click karo
- App nickname: `lovedate-web` → Register App
- **Config copy karo** (apiKey, projectId, etc.)

### 6. firebase.js mein config daalo
File: `frontend/src/lib/firebase.js`

```js
const firebaseConfig = {
  apiKey: "AIza...",           // ← apni key
  authDomain: "lovedate-xxx.firebaseapp.com",
  projectId: "lovedate-xxx",
  storageBucket: "lovedate-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123",
};
```

---

## 🚀 Step 2: Run Karo

```bash
cd frontend
npm install
npm run dev
```

http://localhost:3000 pe kholo ✅

---

## ✅ Ab Kya Hoga

| Feature | Pehle (localStorage) | Ab (Firebase) |
|---------|---------------------|---------------|
| Data save | Browser mein | Firebase cloud mein |
| Girlfriend link khule | ❌ Same browser only | ✅ Kisi bhi phone/device |
| Login persist | ❌ Refresh pe logout | ✅ Auto login |
| Data safe | ❌ Clear karo toh gone | ✅ Permanent |
| Real-time sync | ❌ No | ✅ Yes |

---

## 📁 Files

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.js        ← Poora SaaS app
│   │   └── layout.js
│   └── lib/
│       └── firebase.js    ← 🔥 Apni keys yahan daalo
├── package.json
└── next.config.js
```

---

Made with 💖 · Powered by Firebase
