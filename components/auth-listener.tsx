"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthListener() {
  const supabase = createClient()

  useEffect(() => {
    // This function runs every time the user's Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      
      // If Supabase finds a Google Provider Token, we grab it immediately
      if (session?.provider_token) {
        window.localStorage.setItem('google_provider_token', session.provider_token)
        console.log("✅ Fabely: Google Drive token captured.")
      }

      // If the user logs out, we clean up the token for security
      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('google_provider_token')
        console.log("white_check_mark Fabely: Session cleared.")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return null // This component doesn't show anything on screen
}