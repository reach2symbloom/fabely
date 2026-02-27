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
      
      // Fallback: Check localStorage if the session provider_token is null
      const token = session?.provider_token || window.localStorage.getItem('google_provider_token');

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
      setFiles(data.files || []);
      
    } catch (err: any) {
      setError(err.message);
      console.error("Drive Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to handle copying a file to Fabely
  const handleCopyFile = (file: DriveFile) => {
    console.log(`Copying ${file.name} to Fabely Drive...`);
    // This is where you will later add the fetch call to download from Google 
    // and upload to Supabase Storage.
    alert(`Coming soon: ${file.name} will be synced to your Fabely workspace.`);
  };

  useEffect(() => {
    fetchFabelyFiles();
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left side: Text Editor */}
      <div className="w-1/2 p-6 flex flex-col">
        <h1 className="font-playfair text-2xl mb-4">Manuscript</h1>
        <textarea
          className="w-full flex-1 border border-border rounded-lg p-4 resize-none bg-card focus:outline-none focus:ring-1 focus:ring-primary/20 font-serif text-lg"
          placeholder="Start writing here..."
        />
      </div>

      {/* Right side: Drive listing */}
      <div className="w-1/2 border-l border-border overflow-auto p-6 bg-slate-50/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-playfair">Google Drive Resources</h2>
          <button 
            onClick={fetchFabelyFiles}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Refresh Drive
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
             <p className="text-muted-foreground animate-pulse">Scanning your Drive...</p>
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
            <p className="text-destructive text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs underline mt-2"
            >
              Re-authenticate
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No manuscripts or notes found in your Drive.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li 
                key={file.id} 
                className="group flex items-center justify-between p-3 border border-border bg-card rounded-lg hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={file.iconLink} alt="icon" className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate text-sm font-medium">{file.name}</span>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={file.webViewLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    View
                  </a>
                  <button 
                    onClick={() => handleCopyFile(file)}
                    className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                  >
                    Copy to Fabely
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}