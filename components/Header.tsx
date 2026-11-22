
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header style={{
      width: "100%",
      padding: "14px 20px",
      background: "#ffffff",
      borderBottom: "1px solid #ddd",
      boxSizing: "border-box"
    }}>
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
      }}>
        <Link href="/" style={{
          fontSize: "21px",
          fontWeight: "bold",
          color: "#111",
          textDecoration: "none"
        }}>
          Real Home Service
        </Link>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "18px"
        }}>
          <div className="desktop-menu" style={{
            display: "flex",
            alignItems: "center",
            gap: "18px"
          }}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            style={{
              fontSize: "28px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#111",
              padding: 0
            }}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div style={{
            position: "absolute",
            right: "12px",
            top: "65px",
            width: "210px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            <hr />
            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              style={{ color: "#0b57d0", fontWeight: "bold" }}
            >
              🔐 Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
