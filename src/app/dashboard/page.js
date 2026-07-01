'use client';
// Dashboard is handled inside the main app (/) with auth state
// This page just redirects to home where auth is managed
import { useEffect } from "react";
export default function DashboardRedirect() {
  useEffect(() => { window.location.replace("/"); }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <p style={{ color: "#6B7280" }}>⏳ Redirect ho raha hai...</p>
    </div>
  );
}
