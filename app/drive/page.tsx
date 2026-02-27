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
    setLoading(true)
    setError(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token;

      if (!token) {
        throw new Error("No Google access token found. Please sign in again.");
      }

      const mimeTypes = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.google-apps.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.google-apps.presentation"
      ];

      const query = mimeTypes.map(type => `mimeType = '${type}'`).join(' or ');

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name, mimeType, iconLink, webViewLink)`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch files");
      }

      const data = await response.json();
      console.log("Files found:", data.files);
      
      // CRITICAL: Update the state with the fetched files
      setFiles(data.files || []);
      
    } catch (err: any) {
      setError(err.message);
      console.error("Drive Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Correct: useEffect is called at the top level of the component
  useEffect(() => {
    fetchFabelyFiles();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left side: Text Editor */}
      <div className="w-1/2 p-4">
        <textarea
          className="w-full h-full border border-border rounded-lg p-2 resize-none"
          placeholder="Start writing here..."
        />
      </div>

      {/* Right side: Drive listing */}
      <div className="w-1/2 border-l border-border overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Google Drive Files</h2>
          <button 
            onClick={fetchFabelyFiles}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading files…</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : files.length === 0 ? (
          <p>No compatible files found in your Drive.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50">
                <img src={file.iconLink} alt="icon" className="w-4 h-4" />
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