
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const linkStyle = {
    color: "#222",
    textDecoration: "none",
    fontWeight: 600,
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
      zIndex: 1000
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12
      }}>

        <Link href="/admin" style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          color: "#102b55",
          textDecoration: "none",
          fontWeight: 800,
          fontSize: 20
        }}>
          <img
            src="/logo.png"
            alt="Real Home Service"
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #d6a52c"
            }}
          />
          Real Home Service
        </Link>

        <div className="desktop-links">
          <Link href="/admin" style={linkStyle}>
            Admin Home
          </Link>

          <Link href="/admin/about" style={linkStyle}>
            Admin About
          </Link>

          <Link href="/admin/contact" style={linkStyle}>
            Admin Contact
          </Link>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle admin menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: 15,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 10,
          position: "absolute",
          right: 12,
          top: 65,
          width: 210,
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)"
        }}>
          <Link
            href="/admin"
            style={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Admin Home
          </Link>

          <Link
            href="/admin/about"
            style={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Admin About
          </Link>

          <Link
            href="/admin/contact"
            style={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Admin Contact
          </Link>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <style jsx>{`
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 18px;
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
