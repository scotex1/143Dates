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
   apiKey: "AIzaSyD4aN6sNxuY91OpCzRhIslvCXYWSKJ5PNM",
  authDomain: "planning-with-ai-67a76.firebaseapp.com",
  projectId: "planning-with-ai-67a76",
  storageBucket: "planning-with-ai-67a76.firebasestorage.app",
  messagingSenderId: "250873437317",
  appId: "1:250873437317:web:276c5df31d26b399495dec"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
