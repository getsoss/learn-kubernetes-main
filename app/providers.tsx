"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase/client";

const STORED_ACCESS_TOKEN_KEY = "sb-access-token";

function clearSupabaseAuthArtifacts(localStorageRef: Storage) {
  const SUPABASE_PREFIX = "sb-";
  const SUPABASE_SUFFIX = "-auth-token";

  const keysToRemove: string[] = [];

  for (let index = 0; index < localStorageRef.length; index += 1) {
    const key = localStorageRef.key(index);

    if (!key) {
      continue;
    }

    if (key.startsWith(SUPABASE_PREFIX) && key.endsWith(SUPABASE_SUFFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    localStorageRef.removeItem(key);
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const localStorageRef = window.localStorage;

    (window as typeof window & { supabase?: typeof supabase }).supabase =
      supabase;

    clearSupabaseAuthArtifacts(localStorageRef);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      clearSupabaseAuthArtifacts(localStorageRef);

      if (session?.access_token) {
        localStorageRef.setItem(STORED_ACCESS_TOKEN_KEY, session.access_token);
        return;
      }

      localStorageRef.removeItem(STORED_ACCESS_TOKEN_KEY);
    });

    return () => {
      clearSupabaseAuthArtifacts(localStorageRef);
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
