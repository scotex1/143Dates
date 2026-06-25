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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
