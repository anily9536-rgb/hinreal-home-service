
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
      padding: "14px 20px",
      background: "#fff",
      borderBottom: "1px solid #ddd",
      position: "relative",
      zIndex: 1000
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/admin" style={{
          fontSize: "21px",
          fontWeight: "bold",
          color: "#111",
          textDecoration: "none"
        }}>
          Admin Dashboard
        </Link>

        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <div className="desktop-links">
            <Link href="/admin" style={linkStyle}>Home</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/contact" style={linkStyle}>Contact</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <div style={{
        display: menuOpen ? "flex" : "none",
        flexDirection: "column",
        gap: "12px",
        padding: "15px"
      }}>
        <Link href="/admin" style={linkStyle}>Home</Link>
        <Link href="/about" style={linkStyle}>About</Link>
        <Link href="/contact" style={linkStyle}>Contact</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <style jsx>{`
        .desktop-links {
          display: flex;
          gap: 18px;
          align-items: center;
        }
        .menu-button {
          display: none;
        }
        @media (max-width: 700px) {
          .desktop-links {
            display: none;
          }
          .menu-button {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
