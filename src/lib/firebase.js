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
  apiKey: "AIzaSyD4aN6sNxuY91OpCzRhIslvCXYWSKJ5PNM",
  authDomain: "planning-with-ai-67a76.firebaseapp.com",
  projectId: "planning-with-ai-67a76",
  storageBucket: "planning-with-ai-67a76.firebasestorage.app",
  messagingSenderId: "250873437317",
  appId: "1:250873437317:web:276c5df31d26b399495dec"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
