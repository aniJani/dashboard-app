"use client"

import { ChatInterface } from "@/components/chat-interface"
import { DatasetList } from "@/components/dataset-list"
import { Button } from "@/components/ui/button"
import { VisualizationDisplay } from "@/components/visualization-display"
import {
  type DatasetInfo,
  type VisualizationResponse,
  generateVisualization,
  getBusinessInsights,
  listDatasets,
  rerunVisualizations,
} from "@/lib/api"
import { Upload } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([])
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null)
  const [visualizations, setVisualizations] = useState<VisualizationResponse[]>([])
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      const fetchedDatasets = await listDatasets()
      setDatasets(fetchedDatasets)
    } catch (error) {
      console.error("Failed to fetch datasets:", error)
    }
  }

  const handleDatasetSelect = async (dataset: DatasetInfo) => {
    setSelectedDataset(dataset)
    try {
      const rerunResults = await rerunVisualizations(dataset.id)
      setVisualizations(rerunResults)
      setInsights([]) // Clear insights when a new dataset is selected
    } catch (error) {
      console.error("Failed to rerun visualizations:", error)
    }
  }

  const handleRequest = async (type: "visualization" | "insight", prompt: string) => {
    if (!selectedDataset) return "Please select a dataset first."

    try {
      if (type === "visualization") {
        const result = await generateVisualization(selectedDataset.id, prompt)
        setVisualizations((prev) => [result, ...prev])
        return "Visualization generated successfully. You can see it in the display area."
      } else {
        const insight = await getBusinessInsights(selectedDataset.id, prompt)
        setInsights((prev) => [insight, ...prev])
        return insight
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error)
      return `An error occurred while generating the ${type}.`
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-2xl font-bold mb-4">Datasets</h2>
        <DatasetList datasets={datasets} onSelect={handleDatasetSelect} selectedDataset={selectedDataset} />
        <Button className="mt-4 w-full" onClick={fetchDatasets}>
          <Upload className="mr-2 h-4 w-4" /> Refresh Datasets
        </Button>
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <VisualizationDisplay visualizations={visualizations} insights={insights} />
        </div>
        <div className="h-1/3 border-t">
          <ChatInterface
            onSendMessage={handleRequest}
            placeholder="Ask for a visualization or insight..."
            selectedDataset={selectedDataset}
          />
        </div>
      </div>
    </div>
  )
}

