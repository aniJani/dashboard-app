"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DatasetUpload } from "@/components/dataset-upload"
import { ChatInterface } from "@/components/chat-interface"
import { generateVisualization, getPastVisualizations, addToPastDatasets } from "@/lib/api"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VisualizationPage() {
  const searchParams = useSearchParams()
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [visualizations, setVisualizations] = useState<
    { code: string; image_base64: string; description: string | null }[]
  >([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlDatasetId = searchParams.get("datasetId")
    if (urlDatasetId) {
      setDatasetId(urlDatasetId)
      addToPastDatasets(urlDatasetId)
      fetchPastVisualizations(urlDatasetId)
    }
  }, [searchParams])

  const fetchPastVisualizations = async (id: string) => {
    try {
      const pastVisualizations = await getPastVisualizations(id)
      setVisualizations(pastVisualizations)
    } catch (error) {
      console.error("Error fetching past visualizations:", error)
      setError("Failed to fetch past visualizations. Please try again.")
    }
  }

  const handleVisualizationRequest = async (prompt: string) => {
    if (!datasetId) return "Please upload a dataset first."

    try {
      const result = await generateVisualization(datasetId, prompt)
      setVisualizations((prev) => [result, ...prev])
      return "Visualization generated successfully. You can see it below the chat."
    } catch (error) {
      console.error("Error generating visualization:", error)
      return "An error occurred while generating the visualization."
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Visualization Chat</h1>
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
            fetchPastVisualizations(id)
          }}
        />
      ) : (
        <>
          <ChatInterface
            onSendMessage={handleVisualizationRequest}
            placeholder="Describe the visualization you want..."
          />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Visualizations</h2>
            {visualizations.map((viz, index) => (
              <div key={index} className="mb-8 p-4 border rounded-lg">
                <Image
                  src={`data:image/png;base64,${viz.image_base64}`}
                  alt={`Visualization ${index + 1}`}
                  width={600}
                  height={400}
                />
                {viz.description && <p className="mt-2 text-sm text-gray-600">{viz.description}</p>}
                <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                  <code>{viz.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

