

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // IMPORTANT:
    // Replace this placeholder with a verified server-side admin role check.
    // A successful user login alone does NOT grant admin access.
    if (!data.user) {
      setMessage("Unable to verify account.");
      setLoading(false);
      return;
    }

    setMessage("Login successful. Admin authorization is not configured yet.");
    setLoading(false);
  }

  return (
    <main className="container">
      <div
        style={{
          maxWidth: "420px",
          margin: "60px auto",
          padding: "30px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
          Admin Login
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Please Wait..." : "Login as Admin"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
