"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { uploadDataset } from "@/lib/api"

export function DatasetUpload({ onUploadSuccess }: { onUploadSuccess: (datasetId: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const datasetId = await uploadDataset(file)
      onUploadSuccess(datasetId)
    } catch (error) {
      console.error("Error uploading dataset:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="dataset">Dataset</Label>
        <Input id="dataset" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload Dataset"}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

