
"use client";

import { useState } from "react";

export default function Home() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("कृपया सही 10 अंकों का मोबाइल नंबर डालें।");
      return;
    }

    if (isRegister && !name.trim()) {
      setMessage("कृपया अपना पूरा नाम डालें।");
      return;
    }

    if (isRegister && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("कृपया सही Gmail ID / Email डालें।");
      return;
    }

    setMessage(
      "आपकी जानकारी तैयार है। SMS OTP सुविधा सेट होने के बाद Login चालू होगा।"
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #10264A, #1c4770)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 430,
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 15px 45px rgba(0,0,0,0.25)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <div style={{ fontSize: 45 }}>🏠</div>
          <h1 style={{ color: "#10264A", margin: "8px 0" }}>
            Real Home Service
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Find Your Dream Property
          </p>
        </div>

        <div style={{
          display: "flex",
          background: "#eef2f7",
          padding: 5,
          borderRadius: 10,
          marginBottom: 25
        }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: 12,
              border: 0,
              borderRadius: 8,
              background: !isRegister ? "#10264A" : "transparent",
              color: !isRegister ? "#fff" : "#334155",
              fontWeight: "bold"
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: 12,
              border: 0,
              borderRadius: 8,
              background: isRegister ? "#10264A" : "transparent",
              color: isRegister ? "#fff" : "#334155",
              fontWeight: "bold"
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{ color: "#10264A", marginBottom: 8 }}>
          {isRegister ? "Create Customer Account" : "Customer Login"}
        </h2>

        <p style={{ color: "#64748b", fontSize: 14 }}>
          {isRegister
            ? "अपना अकाउंट बनाने के लिए जानकारी भरें।"
            : "अपने मोबाइल नंबर से Login करें।"}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label style={labelStyle}>पूरा नाम</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="अपना पूरा नाम लिखें"
                style={inputStyle}
              />

              <label style={labelStyle}>Gmail ID</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={inputStyle}
              />
            </>
          )}

          <label style={labelStyle}>मोबाइल नंबर</label>
          <div style={{
            display: "flex",
            border: "1px solid #cbd5e1",
            borderRadius: 9,
            overflow: "hidden",
            marginBottom: 20
          }}>
            <span style={{
              padding: 13,
              background: "#eef2f7",
              color: "#10264A",
              fontWeight: "bold"
            }}>
              +91
            </span>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10 अंकों का मोबाइल नंबर"
              style={{
                flex: 1,
                minWidth: 0,
                padding: 13,
                border: 0,
                outline: "none",
                fontSize: 15
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 15,
              background: "#C9A34A",
              color: "#10264A",
              border: 0,
              borderRadius: 9,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isRegister ? "Register" : "Login with Mobile"}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: 18,
            padding: 12,
            borderRadius: 8,
            background: "#fff7e6",
            color: "#805b13",
            fontSize: 14,
            lineHeight: 1.5
          }}>
            {message}
          </p>
        )}

        <p style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: 12,
          marginTop: 25
        }}>
          Secure Customer Access | Real Home Service
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: "bold",
  color: "#334155",
  marginBottom: 7
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 13,
  border: "1px solid #cbd5e1",
  borderRadius: 9,
  marginBottom: 18,
  fontSize: 15
};
