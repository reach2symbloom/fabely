import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  modifiedTime?: string
}

/**
 * GET /api/drive
 * Fetches specific file types from the user's Google Drive 
 * using the provider token managed by Supabase.
 */
export async function GET() {
  const supabase = await createClient()
  
  // 1. Get the session to retrieve the Google Provider Token
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Supabase stores the Google Access Token in 'provider_token'
  const accessToken = session.provider_token

  if (!accessToken) {
    return NextResponse.json(
      { 
        error: "Missing Google Provider Token",
        details: "Ensure you requested 'https://www.googleapis.com/auth/drive.readonly' during sign-in."
      },
      { status: 401 }
    )
  }

  // 2. Construct the Google Drive API Query
  const mimeTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.google-apps.document"
  ]
  
  const mimeQuery = mimeTypes.map(type => `mimeType='${type}'`).join(" or ")
  const q = `(${mimeQuery}) and trashed=false`

  const params = new URLSearchParams({
    q,
    fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: "50", // Adjusted for better performance
  })

  // 3. Fetch from Google Drive REST API
  try {
    const driveResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!driveResponse.ok) {
      const errorData = await driveResponse.json()
      console.error("Google Drive API Error:", errorData)
      
      return NextResponse.json(
        { 
          error: "Google Drive fetch failed", 
          details: errorData.error?.message || "Unknown error" 
        },
        { status: driveResponse.status }
      )
    }

    const data = await driveResponse.json()
    const files: DriveFile[] = data.files ?? []

    return NextResponse.json({ files })

  } catch (error) {
    console.error("Internal Server Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
