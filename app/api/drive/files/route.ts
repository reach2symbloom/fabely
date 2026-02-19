import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  modifiedTime?: string
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.provider_token) {
    return NextResponse.json(
      { error: "Not authenticated with Google, or Drive scope not granted" },
      { status: 401 }
    )
  }

  const accessToken = session.provider_token

  // Query for txt, pdf, and Google Docs
  // mimeType: text/plain, application/pdf, application/vnd.google-apps.document
  const mimeQuery = [
    "mimeType='text/plain'",
    "mimeType='application/pdf'",
    "mimeType='application/vnd.google-apps.document'",
  ].join(" or ")

  const q = `(${mimeQuery}) and trashed=false`
  const params = new URLSearchParams({
    q,
    fields: "files(id,name,mimeType,webViewLink,modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: "100",
  })

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const err = await response.text()
    console.error("Google Drive API error:", response.status, err)
    return NextResponse.json(
      {
        error: "Failed to fetch Drive files",
        details: response.status === 403 ? "Drive scope may not be granted. Sign out and sign in again." : err,
      },
      { status: response.status }
    )
  }

  const data = (await response.json()) as {
    files?: DriveFile[]
  }
  const files = data.files ?? []

  return NextResponse.json({ files })
}
