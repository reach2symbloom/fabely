import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  modifiedTime?: string
}

export async function GET(request: Request) {
  // 1. Check for the Google Access Token in the request headers
  const authHeader = request.headers.get("Authorization");
  let accessToken = authHeader?.split(" ")[1]; // Grabs the token from "Bearer <token>"

  // Fallback: If not in header, try to get from server session (less reliable)
  if (!accessToken) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    accessToken = session?.provider_token || undefined
  }

  if (!accessToken) {
    return NextResponse.json(
      { 
        error: "Missing Google Provider Token",
        details: "The API did not receive a valid Google Access Token from the client."
      },
      { status: 401 }
    )
  }

  // 2. Construct the Google Drive API Query
  const mimeTypes = [
    "text/plain",
    "application/pdf",
    "application/vnd.google-apps.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Added DOCX
    "application/vnd.google-apps.presentation" // Added Slides
  ]
  
  const mimeQuery = mimeTypes.map(type => `mimeType='${type}'`).join(" or ")
  const q = `(${mimeQuery}) and trashed=false`

  const params = new URLSearchParams({
    q,
    fields: "files(id, name, mimeType, webViewLink, modifiedTime, iconLink)",
    orderBy: "modifiedTime desc",
    pageSize: "50",
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
      return NextResponse.json(
        { error: "Google Drive fetch failed", details: errorData.error?.message },
        { status: driveResponse.status }
      )
    }

    const data = await driveResponse.json()
    return NextResponse.json({ files: data.files ?? [] })

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}