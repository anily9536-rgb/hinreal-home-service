
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const homeHref = isAdmin ? "/admin" : "/";

  useEffect(() => {
    let requestId = 0;

    async function checkUser(sessionUser: any) {
      const currentRequest = ++requestId;

      setUser(sessionUser ?? null);

      if (!sessionUser) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();

      if (currentRequest === requestId) {
        setIsAdmin(!error && data?.role === "admin");
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      checkUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUser(session?.user ?? null);
    });

    return () => {
      requestId++;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setMenuOpen(false);
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
    <header
      style={{
        width: "100%",
        padding: "14px 20px",
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
        }}
      >
        <Link
          href={homeHref}
          onClick={() => setMenuOpen(false)}
          style={{
            fontSize: "21px",
            fontWeight: "bold",
            color: "#111",
            textDecoration: "none",
          }}
        >
          Real Home Service
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div className="desktop-links">
            <Link href={homeHref} style={linkStyle}>
              Home
            </Link>

            <Link href="/about" style={linkStyle}>
              About
            </Link>

            <Link href="/contact" style={linkStyle}>
              Contact
            </Link>

            <Link
              href="/admin/login"
              style={{ ...linkStyle, color: "#0b57d0", fontWeight: "bold" }}
            >
              Admin Login
            </Link>

            {user && (
              <button onClick={handleLogout}>Logout</button>
            )}
          </div>

          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              fontSize: "28px",
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
        <Link
          href={homeHref}
          style={linkStyle}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

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

        <Link
          href="/admin/login"
          style={{ ...linkStyle, color: "#0b57d0", fontWeight: "bold" }}
          onClick={() => setMenuOpen(false)}
        >
          Admin Login
        </Link>

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            style={{ padding: "9px", cursor: "pointer" }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
