
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.user) {
        setMessage("Login failed. Please try again.");
        return;
      }

      setMessage("Login successful!");

      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div
        style={{
          maxWidth: "420px",
          margin: "60px auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
          User Login
        </h1>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#2874a6" }}>
            Register
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          <Link href="/" style={{ color: "#2874a6" }}>
            Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}
