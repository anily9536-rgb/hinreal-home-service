"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      window.location.href = "/admin";
    } else {
      await supabase.auth.signOut();
      setMessage("Access denied. Admin account only.");
    }
  }

  return (
    <main className="wrap section">
      <form className="formbox" onSubmit={handleLogin}>
        <div className="eyebrow">REAL HOME SERVICE</div>
        <h2>Admin Login</h2>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit">
          Login
        </button>

        {message && <p className="notice">{message}</p>}
      </form>
    </main>
  );
}
