
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!/^\d{6}$/.test(customerId)) {
      setMessage("कृपया 6 अंकों की Customer ID डालें।");
      return;
    }

    if (password.length < 8) {
      setMessage("नया Password कम से कम 8 अक्षरों का होना चाहिए।");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("दोनों Password एक जैसे नहीं हैं।");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Password reset नहीं हो पाया।");
      } else {
        setSuccess(true);
        setMessage("आपका Password सफलतापूर्वक बदल गया है।");
        setCustomerId("");
        setPassword("");
        setConfirmPassword("");
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
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #071d49, #174b91)",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "430px",
        padding: "28px",
        boxSizing: "border-box",
        background: "#ffffff",
        border: "3px solid #d9ad50",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
      }}>
        <h1 style={{
          textAlign: "center",
          color: "#102b59",
          fontSize: "25px",
          fontWeight: 900,
        }}>
          FORGOT PASSWORD
        </h1>

        <p style={{ textAlign: "center", color: "#64748b" }}>
          अपनी 6 अंकों की Customer ID डालें
        </p>

        <label style={{ display: "block", marginTop: "22px", fontWeight: 800, color: "#102b59" }}>
          Customer ID
        </label>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="6 Digit Customer ID"
          inputMode="numeric"
          maxLength={6}
          required
          style={inputStyle}
        />

        <label style={{ display: "block", marginTop: "17px", fontWeight: 800, color: "#102b59" }}>
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="नया Password"
          autoComplete="new-password"
          required
          style={inputStyle}
        />

        <label style={{ display: "block", marginTop: "17px", fontWeight: 800, color: "#102b59" }}>
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Password दोबारा डालें"
          autoComplete="new-password"
          required
          style={inputStyle}
        />

        {message && (
          <p style={{
            padding: "12px",
            borderRadius: "9px",
            background: success ? "#dcfce7" : "#fee2e2",
            color: success ? "#166534" : "#b91c1c",
            textAlign: "center",
            fontWeight: 700,
          }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "22px",
            padding: "15px",
            background: "#123e86",
            color: "#ffffff",
            border: "2px solid #d9ad50",
            borderRadius: "11px",
            fontSize: "17px",
            fontWeight: 900,
          }}
        >
          {loading ? "Please Wait..." : "RESET PASSWORD"}
        </button>

        <p style={{ textAlign: "center", marginTop: "22px" }}>
          <Link href="/login" style={{ color: "#174b91", fontWeight: 900 }}>
            Back to Login
          </Link>
        </p>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginTop: "8px",
  border: "2px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "16px",
  color: "#102b59",
  background: "#ffffff",
};
