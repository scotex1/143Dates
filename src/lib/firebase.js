// ─────────────────────────────────────────────────────────────────────────────
// 🔥 FIREBASE CONFIG — Yahan apni Firebase keys daalo
// ─────────────────────────────────────────────────────────────────────────────
// Step 1: https://console.firebase.google.com
// Step 2: New Project → Authentication → Email/Password Enable
// Step 3: Firestore Database → Start in test mode
// Step 4: Project Settings → Your Apps → Web App → Config copy karo
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
