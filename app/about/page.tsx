
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function AboutPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        if (active) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (active) {
        setIsAdmin(profile?.role === "admin");
        setChecking(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {!checking && (
        isAdmin ? <AdminHeader /> : <Header />
      )}

      <main className="container">
        <h1>About Real Home Service</h1>

        <p>
          Welcome to Real Home Service, your trusted
          platform for buying, selling and renting
          properties.
        </p>

        <h2>Who We Are</h2>
        <p>
          We help customers find their dream homes,
          residential properties and commercial spaces
          with an easy and reliable property platform.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to make property buying,
          selling and renting simple, transparent
          and convenient for everyone.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Easy property search</li>
          <li>Simple property posting</li>
          <li>Customer enquiry support</li>
          <li>Reliable property information</li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
