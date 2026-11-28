
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SessionExitHandler() {
  useEffect(() => {
    const logoutOnExit = () => {
      fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
        keepalive: true,
      }).catch(() => {});

      supabase.auth.signOut({ scope: "local" }).catch(() => {});
    };

    window.addEventListener("pagehide", logoutOnExit);

    return () => {
      window.removeEventListener("pagehide", logoutOnExit);
    };
  }, []);

  return null;
}
