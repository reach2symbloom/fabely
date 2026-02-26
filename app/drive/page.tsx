"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DriveFile } from "@/components/landing/drive-files-dialog"

export default function DrivePage() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchFiles = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  // This is the specific token for Google, NOT the Supabase JWT
  const googleToken = session?.provider_token; 

  if (!googleToken) {
    console.error("No Google token found. Try logging in again.");
    return;
  }

  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    headers: {
      Authorization: `Bearer ${googleToken}`, // Must be the provider_token
    },
  });
  
  if (response.status === 401) {
    console.log("Token is unauthorized. Scopes might be missing.");
  }
};

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="flex h-screen">
      {/* left editable area */}
      <div className="w-1/2 p-4">
        <textarea
          className="w-full h-full border border-border rounded-lg p-2 resize-none"
          placeholder="Start writing here..."
        />
      </div>

      {/* right drive listing */}
      <div className="w-1/2 border-l border-border overflow-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
        {loading ? (
          <p>Loading files…</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : files.length === 0 ? (
          <p>No compatible files found in your Drive.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-2">
                <a
                  href={file.webViewLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
