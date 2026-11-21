"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) { setNotice("Supabase environment variables are missing."); return; }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) { setNotice(error?.message || "Login failed."); return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (profile?.role === "admin") router.push("/admin");
    else { await supabase.auth.signOut(); setNotice("This account does not have admin access."); }
  }
  return <><Header /><main className="container section"><form className="panel form" onSubmit={login}>
    <h1>Admin Login</h1><p className="muted">Sign in using your authorized admin account.</p>
    <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    <button className="button">Login</button>{notice && <p className="notice" role="status">{notice}</p>}
    <p className="muted">Property owners: <Link href="/sell">Post a property</Link> after signing in.</p>
  </form></main><Footer /></>;
}
