
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setMessage("Login error: " + (error?.message || "User not found"));
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        setMessage("Profile error: " + profileError.message);
        await supabase.auth.signOut();
        return;
      }

      if (!profile) {
        setMessage("Profile not found for this account.");
        await supabase.auth.signOut();
        return;
      }

      if (profile.role !== "admin") {
        setMessage("Role found: " + profile.role);
        await supabase.auth.signOut();
        return;
      }

      router.replace("/admin");
      router.refresh();

    } catch (err) {
      setMessage(
        "Error: " +
        (err instanceof Error ? err.message : "Unknown error")
      );
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

          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Please Wait..." : "Login as Admin"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "red",
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
