
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
useEffect(() => {
  document.body.classList.add("public-site");

  return () => {
    document.body.classList.remove("public-site");
  };
}, []);
  
  
async function handleLogout() {
  await fetch("/api/logout", {
    method: "POST",
  });

  await supabase.auth.signOut();
  setUser(null);
  setMenuOpen(false);
  window.location.href = "/login";
}


  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 500,
    padding: "8px 4px",
  };

  const customerLinkStyle = {
    ...linkStyle,
    color: "#f0d58a",
    fontWeight: "bold" as const,
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "10px 20px",
        background: "#fff",
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <style jsx>{`
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-button {
          display: none;
        }

        @media (max-width: 700px) {
          .desktop-links {
            display: none;
          }

          .menu-button {
            display: flex;
          }
        }
      `}</style>

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "12px",
        }}
      >
        {/* Public Website Logo and Home */}
        <a
          href="/"
          onClick={() => setMenuOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            minWidth: 0,
            color: "#102b55",
            textDecoration: "none",
            fontSize: "clamp(16px, 2.5vw, 21px)",
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          <img
            src="/logo.png"
            alt="Real Home Service logo"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              border: "2px solid #d6a52c",
            }}
          />
          <span>Real Home Service</span>
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div className="desktop-links">
            <a href="/" style={linkStyle}>Home</a>

            <Link href="/about" style={linkStyle}>
              About
            </Link>

            <Link href="/contact" style={linkStyle}>
              Contact
            </Link>

            {!user && (
              <>
                <Link href="/login" style={customerLinkStyle}>
                  Customer Login
                </Link>

                <Link href="/register" style={customerLinkStyle}>
                  Register
                </Link>
              </>
            )}

            {user && (
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              fontSize: "26px",
              width: "44px",
              height: "44px",
              border: "none",
              background: "#f3f4f6",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#111",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        style={{
          display: menuOpen ? "flex" : "none",
          position: "absolute",
          right: "12px",
          top: "65px",
          width: "220px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          flexDirection: "column",
          gap: "12px",
          zIndex: 9999,
        }}
      >
        <a
          href="/"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </a>

        <Link
          href="/about"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>

        <Link
          href="/contact"
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

        <hr />

        {!user && (
          <>
            <Link
              href="/login"
              style={customerLinkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Customer Login
            </Link>

            <Link
              href="/register"
              style={customerLinkStyle}
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
