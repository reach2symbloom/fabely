"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DriveFile } from "@/components/landing/drive-files-dialog"

export default function DrivePage() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [copiedFiles, setCopiedFiles] = useState<DriveFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchDriveFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token || window.localStorage.getItem('google_provider_token');

      if (!token) {
        throw new Error("No Google access token found. Please sign in again.");
      }

      const response = await fetch('/drive/files', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const contentType = response.headers.get("content-type") || ''
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned invalid response; expected JSON.")
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.details || data.error || 'Failed to fetch files')

      setFiles(data.files || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load Drive files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDriveFiles()
  }, [])

  const handleCopyToFabely = (file: DriveFile) => {
    // Move file from right list to left "Fabely" list (client-side)
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
    setCopiedFiles((prev) => [file, ...prev])
    setActiveFileId(file.id)
    fetchFileContent(file)
  }

  const fetchFileContent = async (file: DriveFile) => {
    setLoadingContent(true)
    setFileContent(null)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token || window.localStorage.getItem('google_provider_token');
      if (!token) throw new Error('Missing Google token for fetching file content')

      // For Google Docs, use export endpoint to get plain text.
      if (file.mimeType === 'application/vnd.google-apps.document') {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to export Google Doc')
        const text = await res.text()
        setFileContent(text)
        return
      }

      // For PDFs and other media we won't fetch text; user can Preview which opens Google viewer
      if (file.mimeType === 'application/pdf') {
        setFileContent(null)
        return
      }

      // For plain text and docx we try to fetch the file contents via alt=media
      try {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const text = await res.text()
          setFileContent(text)
          return
        }
      } catch (e) {
        // fallthrough
      }

      setFileContent(null)
    } catch (e: any) {
      console.error('Content fetch error', e)
      setFileContent(null)
    } finally {
      setLoadingContent(false)
    }
  }

  const handleSelectCopied = (id: string) => {
    setActiveFileId(id)
    const file = copiedFiles.find((f) => f.id === id)
    if (file) fetchFileContent(file)
  }

  const handleRemoveFromFabely = (id: string) => {
    setCopiedFiles((prev) => prev.filter((f) => f.id !== id))
    // optionally put it back to the Drive list
    const removed = copiedFiles.find((f) => f.id === id)
    if (removed) setFiles((prev) => [removed, ...prev])
    if (activeFileId === id) {
      setActiveFileId(null)
      setFileContent(null)
    }
  }

  const activeFile = copiedFiles.find((f) => f.id === activeFileId) || copiedFiles[0] || null

  useEffect(() => {
    // ensure some active selected file when copiedFiles changes
    if (!activeFileId && copiedFiles.length > 0) {
      setActiveFileId(copiedFiles[0].id)
      fetchFileContent(copiedFiles[0])
    }
  }, [copiedFiles])

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left pane: Read-only Fabely Drive */}
      <div className="w-1/2 p-6 flex flex-col border-r border-border">
        <div className="flex items-center justify-between mb-4">
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
            Save In Fabely Storage
          </button>
          <p className="text-sm text-muted-foreground">{copiedFiles.length} item(s)</p>
        </div>

        <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List of copied files */}
          <div className="md:col-span-1 space-y-2">
            {copiedFiles.length === 0 ? (
              <div className="p-4 border border-dashed rounded-lg text-sm text-muted-foreground">No files in Fabely yet. Click "Copy to Fabely" on the right.</div>
            ) : (
              copiedFiles.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectCopied(f.id)}
                  className={`w-full text-left p-3 rounded-md border ${f.id === activeFileId ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover:shadow-sm`}
                >
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.mimeType}</div>
                </button>
              ))
            )}
          </div>

          {/* Preview area */}
          <div className="md:col-span-2 p-3 border border-border rounded-md bg-card flex flex-col">
            {activeFile ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{activeFile.name}</h3>
                    <div className="text-xs text-muted-foreground">{activeFile.mimeType}</div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={activeFile.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm"
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => handleRemoveFromFabely(activeFile.id)}
                      className="px-3 py-1 rounded-md border text-sm"
                    >
                      Remove From Fabely
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-white p-4 rounded-md">
                  {loadingContent ? (
                    <p className="text-muted-foreground">Loading content…</p>
                  ) : fileContent ? (
                    <pre className="whitespace-pre-wrap text-sm font-serif">{fileContent}</pre>
                  ) : activeFile.mimeType === 'application/pdf' ? (
                    <iframe src={`https://drive.google.com/file/d/${activeFile.id}/preview`} className="w-full h-96" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Preview unavailable inline. Use the Preview button to open in Google Drive.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-muted-foreground">Select a file from the left to view details.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right pane: Drive listing (source) */}
      <div className="w-1/2 border-l border-border overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Google Drive Resources</h2>
          <div className="flex gap-2">
            <button onClick={fetchDriveFiles} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Refresh Drive</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
             <p className="text-muted-foreground animate-pulse">Scanning your Drive...</p>
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
            <p className="text-destructive text-sm font-medium">Error: {error}</p>
            <button onClick={() => window.location.reload()} className="text-xs underline mt-2 text-destructive hover:no-underline">Re-authenticate and try again</button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg bg-white">
            <p className="text-muted-foreground">No compatible files found in your Drive.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li key={file.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-card">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xl">📄</span>
                  <div className="flex flex-col">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{file.mimeType}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={file.webViewLink || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">Preview</a>
                  <button onClick={() => handleCopyToFabely(file)} className="px-3 py-1 rounded-md bg-slate-900 text-white text-sm">Copy to Fabely</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
