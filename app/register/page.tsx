
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

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", auto: "name" },
    { name: "username", label: "Username", type: "text", auto: "username" },
    { name: "phone", label: "Mobile Number", type: "tel", auto: "tel" },
    { name: "password", label: "Password", type: "password", auto: "new-password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", auto: "new-password" },
  ] as const;

  return (
    <main
      style={{
        minHeight: "100svh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 14px",
        position: "relative",
        overflow: "auto",
        backgroundImage:
          "linear-gradient(rgba(3,17,48,0.72), rgba(3,17,48,0.82)), url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section style={{ width: "100%", maxWidth: "500px", margin: "auto", position: "relative", zIndex: 1 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "13px",
            marginBottom: "22px",
            color: "#ffffff",
          }}
        >
          <img
            src="/customer-logo.png"
            alt="Real Home Service Logo"
            style={{
              width: "76px",
              height: "76px",
              objectFit: "contain",
              borderRadius: "15px",
              background: "#ffffff",
              padding: "5px",
              boxSizing: "border-box",
              border: "2px solid #e7bd62",
              boxShadow: "0 5px 20px rgba(0,0,0,0.35)",
            }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(21px, 5vw, 29px)", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }}>
              Real Home Service
            </h1>
            <p style={{ margin: "6px 0 0", color: "#f6d68a", fontSize: "11px", letterSpacing: "2px", fontWeight: 700 }}>
              FIND YOUR DREAM PROPERTY
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "linear-gradient(145deg, #ffffff, #f2f6ff)",
            border: "3px solid #d9ad50",
            borderRadius: "22px",
            overflow: "hidden",
            boxShadow: "0 18px 55px rgba(0,0,0,0.42)",
          }}
        >
          <div style={{ background: "linear-gradient(90deg, #071d49, #174b91)", padding: "21px 15px", textAlign: "center", borderBottom: "3px solid #d9ad50" }}>
            <h2 style={{ margin: 0, color: "#ffffff", fontSize: "27px", fontWeight: 900 }}>
              CUSTOMER REGISTER
            </h2>
            <p style={{ margin: "7px 0 0", color: "#f6d68a", fontSize: "13px" }}>
              Create your Real Home Service account
            </p>
          </div>

          <div style={{ padding: "clamp(22px, 6vw, 34px)" }}>
            <p style={{ textAlign: "center", color: "#475569", margin: "0 0 22px", fontSize: "14px" }}>
              अपना अकाउंट बनाने के लिए जानकारी भरें
            </p>

            {fields.map((field) => (
              <div key={field.name} style={{ marginBottom: "16px" }}>
                <label htmlFor={field.name} style={{ display: "block", marginBottom: "8px", fontWeight: 800, color: "#102b59", fontSize: "14px" }}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={updateField}
                  required
                  autoComplete={field.auto}
                  placeholder={field.label === "Mobile Number" ? "अपना मोबाइल नंबर डालें" : field.label + " डालें"}
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: "2px solid #cbd5e1",
                    borderRadius: "12px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: "16px",
                    outlineColor: "#1d4ed8",
                  }}
                />
              </div>
            ))}

            {message && (
              <p style={{ color: message.includes("सफल") ? "#166534" : "#b91c1c", background: message.includes("सफल") ? "#dcfce7" : "#fee2e2", padding: "12px", borderRadius: "9px", margin: "0 0 16px", fontSize: "14px" }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "17px",
                background: loading ? "#64748b" : "linear-gradient(90deg, #123e86, #1766c5)",
                color: "#ffffff",
                border: "2px solid #d9ad50",
                borderRadius: "13px",
                fontWeight: 900,
                fontSize: "18px",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 7px 18px rgba(18,62,134,0.25)",
              }}
            >
              {loading ? "Please wait..." : "REGISTER"}
            </button>

            <p style={{ textAlign: "center", margin: "22px 0 0", color: "#475569", fontSize: "14px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#174b91", fontWeight: 900, textDecoration: "underline" }}>
                Login Here
              </Link>
            </p>
          </div>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 8px", marginTop: "24px", padding: "15px 10px", background: "rgba(5,22,55,0.78)", border: "1px solid rgba(246,214,138,0.65)", borderRadius: "15px" }}>
          {["🏠 Home Services", "🛡️ Trusted Services", "👨‍🔧 Professional Team", "🕒 24/7 Support"].map((service) => (
            <div key={service} style={{ textAlign: "center", color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>
              {service}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#f6d68a", fontSize: "13px", fontWeight: 700, margin: "17px 0 0" }}>
          Your Dream Home, Our Responsibility
        </p>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.75)", fontSize: "11px", marginTop: "10px" }}>
          © {new Date().getFullYear()} Real Home Service. All Rights Reserved.
        </p>
      </section>
    </main>
  );
}
