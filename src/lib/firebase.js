// ─────────────────────────────────────────────────────────────────────────────
// 🔥 FIREBASE CONFIG — Yahan apni Firebase keys daalo
// ─────────────────────────────────────────────────────────────────────────────
// Step 1: https://console.firebase.google.com pe jao
// Step 2: New Project banao (naam: lovedate)
// Step 3: Project Settings > General > Your Apps > Add Web App
// Step 4: Neeche wali values replace karo apni keys se
// Step 5: Authentication > Sign-in method > Email/Password ENABLE karo
// Step 6: Firestore Database > Create Database > Start in test mode
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyC3sIauDUSY-q7ZWx_n2EpIsctZsWGE6Bs",
  authDomain: "data-credit-a48bd.firebaseapp.com",
  projectId: "data-credit-a48bd",
  storageBucket: "data-credit-a48bd.firebasestorage.app",
  messagingSenderId: "154490671024",
  appId: "1:154490671024:web:e87588a05df41c4c625075",
  measurementId: "G-5E6DF2Y208"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
