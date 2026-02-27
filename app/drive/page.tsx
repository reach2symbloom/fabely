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
      const token = session?.provider_token || window.localStorage.getItem('google_provider_token');

      if (!token) {
        throw new Error("No Google access token found. Please sign in again.");
      }

      // FIXED: Changed '/api/drive' to '/drive/files' to match your app/drive/files/route.ts
      const response = await fetch('/drive/files', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
      });

      // Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response (HTML instead of JSON). Check your API route path.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to fetch files");
      }
      
      setFiles(data.files || []);
      
    } catch (err: any) {
      setError(err.message);
      console.error("Drive Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFile = (file: DriveFile) => {
    console.log(`Copying ${file.name} to Fabely Drive...`);
    alert(`Syncing ${file.name} to your workspace...`);
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
          <h2 className="text-xl font-semibold font-playfair text-slate-800">Google Drive Resources</h2>
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
            <p className="text-destructive text-sm font-medium">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs underline mt-2 text-destructive hover:no-underline"
            >
              Re-authenticate and try again
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg bg-white">
            <p className="text-muted-foreground">No compatible manuscripts or notes found.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li 
                key={file.id} 
                className="group flex items-center justify-between p-3 border border-border bg-card rounded-lg hover:shadow-md transition-all border-slate-200"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xl">📄</span>
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-semibold text-slate-700">{file.name}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">
                      {file.mimeType.split('.').pop()?.replace('document', 'doc')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={file.webViewLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
                  >
                    Preview
                  </a>
                  <button 
                    onClick={() => handleCopyFile(file)}
                    className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
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