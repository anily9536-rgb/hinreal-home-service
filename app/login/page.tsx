
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Login नहीं हो पाया।");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });

      if (error) {
        setMessage("Login session शुरू नहीं हो पाया।");
        return;
      }

      window.location.href = "/";
    } catch {
      setMessage("Network error। दोबारा कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 10px"
      background: "linear-gradient(135deg, #071b49 0%, #123c80 48%, #6d28a8 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        width: "340px",
        height: "340px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        top: "-130px",
        right: "-100px",
        pointerEvents: "none"
      }} />

      <div style={{
        position: "absolute",
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background: "rgba(96,165,250,0.13)",
        bottom: "-120px",
        left: "-90px",
        pointerEvents: "none"
      }} />

      <section style={{
        width: "100%",
        maxWidth: "560px"
        position: "relative",
        zIndex: 1
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "28px",
          color: "#ffffff"
        }}>
          <img
            src="/logo.png"
            alt="Real Home Service Logo"
            style={{
              width: "76px",
              height: "76px",
              objectFit: "contain",
              borderRadius: "16px",
              background: "#ffffff",
              padding: "5px",
              boxSizing: "border-box",
              boxShadow: "0 8px 24px rgba(0,0,0,0.22)"
            }}
          />

          <div>
            <h1 style={{
              margin: 0,
              fontSize: "clamp(21px, 5vw, 27px)",
              lineHeight: 1.15,
              fontWeight: 800
            }}>
              Real Home Service
            </h1>

            <p style={{
              margin: "7px 0 0",
              color: "#dbeafe",
              fontSize: "13px",
              letterSpacing: "1.4px"
            }}>
              FIND YOUR DREAM PROPERTY
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{
          width: "100%",
          boxSizing: "border-box",
          background: "rgba(255,255,255,0.97)",
          padding: "clamp(30px, 8vw, 48px)",
      minHeight: "68vh",
display: "flex",
flexDirection: "column",
justifyContent: "center",
          borderRadius: "22px",
          boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
          border: "1px solid rgba(255,255,255,0.55)"
        }}>
          <h2 style={{
            textAlign: "center",
            margin: "0 0 8px",
            color: "#102b59",
            fontSize: "25px",
            fontWeight: 800
          }}>
            Customer Login
          </h2>

          <p style={{
            textAlign: "center",
            color: "#64748b",
            margin: "0 0 26px",
            fontSize: "14px"
          }}>
            अपने अकाउंट में लॉगिन करें
          </p>

          <label htmlFor="username" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700,
            color: "#243b60"
          }}>
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="अपना username डालें"
            style={{
              width: "100%",
              padding: "14px 15px",
              border: "1px solid #cbd5e1",
              borderRadius: "11px",
              boxSizing: "border-box",
              marginBottom: "19px",
              background: "#f8fafc",
              color: "#0f172a",
              fontSize: "15px"
            }}
          />

          <label htmlFor="password" style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 700,
            color: "#243b60"
          }}>
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="अपना password डालें"
            style={{
              width: "100%",
              padding: "18px 16px",
              border: "1px solid #cbd5e1",
              borderRadius: "11px",
              boxSizing: "border-box",
              marginBottom: "20px",
              background: "#f8fafc",
              color: "#0f172a",
              fontSize: "15px"
            }}
          />

          {message && (
            <p style={{
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "11px 13px",
              borderRadius: "9px",
              margin: "0 0 16px"
            }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              background: loading
                ? "#64748b"
                : "linear-gradient(90deg, #1d4ed8, #6d28d9)",
              color: "white",
              border: "none",
              borderRadius: "11px",
              fontWeight: 800,
              fontSize: "16px",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 8px 18px rgba(37,99,235,0.25)"
            }}
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <p style={{
            textAlign: "center",
            margin: "22px 0 0",
            color: "#64748b",
            fontSize: "14px"
          }}>
            New customer?{" "}
            <Link href="/register" style={{
              color: "#1d4ed8",
              fontWeight: 700
            }}>
              Register
            </Link>
          </p>
        </form>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.72)",
          fontSize: "12px",
          marginTop: "20px"
        }}>
          © {new Date().getFullYear()} Real Home Service
        </p>
      </section>
    </main>
  );
}
