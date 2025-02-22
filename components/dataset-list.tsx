import { Button } from "@/components/ui/button"
import type { DatasetInfo } from "@/lib/api"
import { Database } from "lucide-react"

interface DatasetListProps {
  datasets: DatasetInfo[]
  selectedDataset: DatasetInfo | null
  onSelect: (dataset: DatasetInfo) => void
}

export function DatasetList({ datasets, selectedDataset, onSelect }: DatasetListProps) {
  const handleSelect = (dataset: DatasetInfo) => {
    onSelect(dataset)
  }

  return (
    <div className="space-y-2">
      {datasets.map((dataset) => (
        <Button
          key={dataset.id}
          variant={selectedDataset?.id === dataset.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleSelect(dataset)}
        >
          <Database className="mr-2 h-4 w-4" />
          {dataset.filename}
        </Button>
      ))}
    </div>
  )
}

