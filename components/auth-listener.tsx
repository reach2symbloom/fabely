"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthListener() {
  const supabase = createClient()

  useEffect(() => {
    console.log("🛠️ Fabely AuthListener: Initialized and watching...");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Current Auth Event: ${event}`);

      if (session?.provider_token) {
        console.log("✅ Provider Token Found! Saving to LocalStorage...");
        window.localStorage.setItem('google_provider_token', session.provider_token);
      } else {
        // If the session exists but no provider_token, check if we already have one saved
        const savedToken = window.localStorage.getItem('google_provider_token');
        if (!savedToken) {
          console.warn("⚠️ No Provider Token in session or LocalStorage. You may need to log out and in again with 'prompt=consent'.");
        }
      }

      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('google_provider_token');
        console.log("🧹 Session cleared.");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return null;
}