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

      window.location.href = "/property";
    } catch {
      setMessage("Network error। दोबारा कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      background: "#f1f5f9"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "420px",
        background: "white",
        padding: "28px",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
          Customer Login
        </h1>

        <p style={{
          textAlign: "center",
          color: "#64748b",
          marginBottom: "24px"
        }}>
          Real Home Service
        </p>

        <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginBottom: "16px"
          }}
        />

        <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginBottom: "16px"
          }}
        />

        {message && (
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          New customer?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
