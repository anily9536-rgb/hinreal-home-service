
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Login authentication will be connected next.");
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

          <button type="submit" style={{ width: "100%" }}>
            Login
          </button>
        </form>

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

