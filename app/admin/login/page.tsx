
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
      <section
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
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
            src="/admin-logo.png"
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
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(21px, 5vw, 29px)",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              Real Home Service
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#f6d68a",
                fontSize: "11px",
                letterSpacing: "2px",
                fontWeight: 700,
              }}
            >
              FIND YOUR DREAM PROPERTY
            </p>
          </div>
        </header>

        <form
          onSubmit={handleLogin}
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
          <div
            style={{
              background: "linear-gradient(90deg, #071d49, #174b91)",
              padding: "21px 15px",
              textAlign: "center",
              borderBottom: "3px solid #d9ad50",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "27px",
                fontWeight: 900,
              }}
            >
              ADMIN LOGIN
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#f6d68a",
                fontSize: "13px",
              }}
            >
              Secure Administrator Access
            </p>
          </div>

          <div style={{ padding: "clamp(22px, 6vw, 34px)" }}>
            <p
              style={{
                textAlign: "center",
                color: "#475569",
                margin: "0 0 22px",
                fontSize: "14px",
              }}
            >
              Admin account से Login करें
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="admin-email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 800,
                  color: "#102b59",
                  fontSize: "14px",
                }}
              >
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                placeholder="Admin Email डालें"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
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

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="admin-password"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 800,
                  color: "#102b59",
                  fontSize: "14px",
                }}
              >
                Admin Password
              </label>

              <input
                id="admin-password"
                type="password"
                placeholder="Admin Password डालें"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

            {message && (
              <p
                role="status"
                style={{
                  color: "#b91c1c",
                  background: "#fee2e2",
                  padding: "12px",
                  borderRadius: "9px",
                  margin: "0 0 16px",
                  fontSize: "14px",
                  overflowWrap: "anywhere",
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "17px",
                background: loading
                  ? "#64748b"
                  : "linear-gradient(90deg, #123e86, #1766c5)",
                color: "#ffffff",
                border: "2px solid #d9ad50",
                borderRadius: "13px",
                fontWeight: 900,
                fontSize: "18px",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 7px 18px rgba(18,62,134,0.25)",
              }}
            >
              {loading ? "Please Wait..." : "LOGIN AS ADMIN"}
            </button>
          </div>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 8px",
            marginTop: "24px",
            padding: "15px 10px",
            background: "rgba(5,22,55,0.78)",
            border: "1px solid rgba(246,214,138,0.65)",
            borderRadius: "15px",
          }}
        >
          {[
            "🏠 Home Services",
            "🛡️ Trusted Services",
            "👨‍🔧 Professional Team",
            "🕒 24/7 Support",
          ].map((service) => (
            <div
              key={service}
              style={{
                textAlign: "center",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {service}
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#f6d68a",
            fontSize: "13px",
            fontWeight: 700,
            margin: "17px 0 0",
          }}
        >
          Your Dream Home, Our Responsibility
        </p>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.75)",
            fontSize: "11px",
            marginTop: "10px",
          }}
        >
          © {new Date().getFullYear()} Real Home Service. All Rights Reserved.
        </p>
      </section>
    </main>
  );
}
