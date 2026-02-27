"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DriveFile } from "@/components/landing/drive-files-dialog"

export default function DrivePage() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchFabelyFiles = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.provider_token;

  // The 'q' parameter must use these specific MIME types
  const mimeTypes = [
    "application/pdf",                                          // PDF
    "text/plain",                                              // TXT
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.google-apps.document",                    // Google Doc
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    "application/vnd.google-apps.presentation"                 // Google Slides
  ];

  // Join them with "or" for the Google query
  const query = mimeTypes.map(type => `mimeType = '${type}'`).join(' or ');

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name, mimeType, iconLink)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

    useEffect(() => {
    fetchFabelyFiles()
  }, [])

  const data = await response.json();
  console.log("Files found:", data.files);
  return <button onClick={fetchFabelyFiles}>Refresh</button>;
};



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
