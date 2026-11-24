"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Registration नहीं हो पाया।");
      } else {
        setMessage("Registration सफल हुआ! अब Login करें।");
        setForm({
          fullName: "",
          username: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch {
      setMessage("Network error। कृपया दोबारा कोशिश करें।");
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
          Create Account
        </h1>

        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px" }}>
          Real Home Service
        </p>

        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "username", label: "Username", type: "text" },
          { name: "phone", label: "Mobile Number", type: "tel" },
          { name: "password", label: "Password", type: "password" },
          { name: "confirmPassword", label: "Confirm Password", type: "password" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              value={form[field.name as keyof typeof form]}
              onChange={updateField}
              required
              autoComplete="off"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box"
              }}
            />
          </div>
        ))}

        {message && (
          <p style={{ color: "#2563eb", marginBottom: "16px" }}>
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
          {loading ? "Please wait..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
