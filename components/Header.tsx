
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header>
      <nav>
        <Link href="/">Real Home Service</Link>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "15px"
        }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sell">Sell Property</Link>

          {user ? (
            <>
              <Link href="/sell">My Account</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}

          <Link
            href="/admin/login"
            style={{
              background: "#111827",
              color: "white",
              padding: "10px 15px",
              borderRadius: "6px",
              fontWeight: "bold"
            }}
          >
            Admin Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
