"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as typeof window & { supabase?: typeof supabase }).supabase =
        supabase;
    }
  }, []);

  return <>{children}</>;
}
