"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DatasetUpload } from "@/components/dataset-upload"
import { ChatInterface } from "@/components/chat-interface"
import { getBusinessInsights, addToPastDatasets } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InsightsPage() {
  const searchParams = useSearchParams()
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlDatasetId = searchParams.get("datasetId")
    if (urlDatasetId) {
      setDatasetId(urlDatasetId)
      addToPastDatasets(urlDatasetId)
    }
  }, [searchParams])

  const handleInsightsRequest = async (query: string) => {
    if (!datasetId) return "Please upload a dataset first."

    try {
      const insights = await getBusinessInsights(datasetId, query)
      return insights
    } catch (error) {
      console.error("Error getting business insights:", error)
      return "An error occurred while fetching business insights."
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Insights Chat</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!datasetId ? (
        <DatasetUpload
          onUploadSuccess={(id) => {
            setDatasetId(id)
            addToPastDatasets(id)
          }}
        />
      ) : (
        <ChatInterface onSendMessage={handleInsightsRequest} placeholder="Ask for business insights..." selectedDataset={null} />
      )}
    </div>
  )
}

