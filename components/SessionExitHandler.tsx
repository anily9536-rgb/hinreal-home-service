"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SessionExitHandler() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!url) return;

    const projectRef = new URL(url).hostname.split(".")[0];
    const storageKey = `sb-${projectRef}-auth-token`;

    const handlePageHide = () => {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Storage may be unavailable.
      }

      fetch("/api/logout", {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
