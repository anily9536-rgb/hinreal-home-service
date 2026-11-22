
"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const linkStyle = {
    color: "#222",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 500,
    padding: "8px 4px",
  };

  return (
    <header style={{
      width: "100%",
      padding: "10px 20px",
      background: "#fff",
      borderBottom: "1px solid #ddd",
      boxSizing: "border-box",
      position: "relative",
      zIndex: 1000,
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}>
        <Link href="/admin" style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          minWidth: 0,
          color: "#102b55",
          textDecoration: "none",
          fontSize: "clamp(16px, 2.5vw, 21px)",
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}>
          <img src="/logo.png" alt="Real Home Service logo" style={{
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            border: "2px solid #d6a52c",
          }} />
          <span>Real Home Service</span>
        </Link>

        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <div className="desktop-links">
            <Link href="/admin" style={linkStyle}>Admin Dashboard</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/contact" style={linkStyle}>Contact</Link>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <div style={{
        display: menuOpen ? "flex" : "none",
        flexDirection: "column",
        gap: "12px",
        padding: "15px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        position: "absolute",
        right: "12px",
        top: "65px",
        width: "220px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
      }}>
        <Link href="/admin" style={linkStyle} onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
        <Link href="/about" style={linkStyle} onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/contact" style={linkStyle} onClick={() => setMenuOpen(false)}>Contact</Link>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>

      <style jsx>{`
        .desktop-links { display: flex; gap: 18px; align-items: center; }
        .menu-button { display: none; }
        @media (max-width: 700px) {
          .desktop-links { display: none; }
          .menu-button { display: block; }
        }
      `}</style>
    </header>
  );
}
