import { Button } from "@/components/ui/button"
import type { DatasetInfo } from "@/lib/api"

interface DatasetListProps {
  datasets: DatasetInfo[]
  onSelect: (dataset: DatasetInfo) => void
  selectedDataset: DatasetInfo | null
}

export function DatasetList({ datasets, onSelect, selectedDataset }: DatasetListProps) {
  return (
    <div className="space-y-2">
      {datasets.map((dataset) => (
        <Button
          key={dataset.id}
          variant={selectedDataset?.id === dataset.id ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onSelect(dataset)}
        >
          {dataset.filename}
        </Button>
      ))}
    </div>
  )
}

