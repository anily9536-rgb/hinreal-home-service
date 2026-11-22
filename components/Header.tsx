
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

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header style={{
      padding: "15px 20px",
      borderBottom: "1px solid #ddd",
      background: "#fff"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative"
      }}>
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#111",
            textDecoration: "none"
          }}
        >
          Real Home Service
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          style={{
            fontSize: "28px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#111"
          }}
        >
          ☰
        </button>

        {menuOpen && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "45px",
            width: "210px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/about" onClick={closeMenu}>About</Link>
            <Link href="/contact" onClick={closeMenu}>Contact</Link>

            {user ? (
              <button onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>Login</Link>
                <Link href="/register" onClick={closeMenu}>Register</Link>
              </>
            )}

            <hr />

            <Link
              href="/admin/login"
              onClick={closeMenu}
              style={{
                color: "#0b57d0",
                fontWeight: "bold",
                textDecoration: "none"
              }}
            >
              🔐 Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
