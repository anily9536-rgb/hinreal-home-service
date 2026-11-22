
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

  const linkStyle = {
    color: "#222",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500
  };

  return (
    <header style={{
      width: "100%",
      padding: "14px 20px",
      background: "#fff",
      borderBottom: "1px solid #ddd",
      boxSizing: "border-box"
    }}>
      <style jsx>{`
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .mobile-links {
          display: none;
        }

        @media (max-width: 700px) {
          .desktop-links {
            display: none;
          }

          .mobile-links {
            display: flex;
          }
        }
      `}</style>

      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
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
          gap: "20px"
        }}>
          <div className="desktop-links">
            <Link href="/" style={linkStyle}>Home</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/contact" style={linkStyle}>Contact</Link>

            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link href="/register" style={linkStyle}>Register</Link>
                <Link href="/login" style={linkStyle}>Login</Link>
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
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#111"
            }}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-links" style={{
            position: "absolute",
            right: 0,
            top: "55px",
            width: "210px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
            zIndex: 1000,
            flexDirection: "column",
            gap: "16px"
          }}>
            <Link href="/" style={linkStyle} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" style={linkStyle} onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" style={linkStyle} onClick={() => setMenuOpen(false)}>Contact</Link>
            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link href="/register" style={linkStyle} onClick={() => setMenuOpen(false)}>Register</Link>
                <Link href="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
              </>
            )}
            <hr />
            <Link
              href="/admin/login"
              style={{ ...linkStyle, color: "#0b57d0", fontWeight: "bold" }}
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
