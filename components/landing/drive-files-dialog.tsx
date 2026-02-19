"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, RefreshCw } from "lucide-react"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  modifiedTime?: string
}

interface DriveFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getFileIcon(mimeType: string) {
  if (mimeType === "application/vnd.google-apps.document") return "📄"
  if (mimeType === "application/pdf") return "📕"
  return "📝"
}

function getFileLabel(mimeType: string) {
  if (mimeType === "application/vnd.google-apps.document") return "Google Doc"
  if (mimeType === "application/pdf") return "PDF"
  return "Text"
}

export function DriveFilesDialog({ open, onOpenChange }: DriveFilesDialogProps) {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/drive/files")
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || data.details || "Failed to fetch files")
      }
      setFiles(data.files ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load files")
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchFiles()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import from Google Drive</DialogTitle>
          <DialogDescription>
            Select a manuscript to import. Showing .txt, .pdf, and Google Docs.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0 -mx-2 px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading your Drive files…</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Sign out and sign in again to grant Drive access.
              </p>
              <Button variant="outline" size="sm" onClick={fetchFiles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : files.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No .txt, .pdf, or Google Docs found in your Drive.</p>
            </div>
          ) : (
            <ul className="space-y-1 py-2">
              {files.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-secondary transition-colors"
                  >
                    <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getFileLabel(file.mimeType)}
                        {file.modifiedTime && (
                          <> · {new Date(file.modifiedTime).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        {!loading && files.length > 0 && (
          <div className="flex justify-end pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={fetchFiles}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
