import { Button } from "@/components/ui/button"
import type { DatasetInfo } from "@/lib/api"
import { Database, X } from "lucide-react"

interface DatasetListProps {
  datasets: DatasetInfo[]
  selectedDataset: DatasetInfo | null
  onSelect: (dataset: DatasetInfo | null) => void
}

export function DatasetList({ datasets, selectedDataset, onSelect }: DatasetListProps) {
  const handleSelect = (dataset: DatasetInfo) => {
    if (selectedDataset?.id === dataset.id) {
      onSelect(null); // Deselect if clicking the currently selected dataset
    } else {
      onSelect(dataset);
    }
  };

  return (
    <div className="space-y-2">
      {datasets.map((dataset) => (
        <div key={dataset.id} className="flex items-center gap-2">
          <Button
            variant={selectedDataset?.id === dataset.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleSelect(dataset)}
          >
            <Database className="mr-2 h-4 w-4" />
            {dataset.filename}
          </Button>
          {selectedDataset?.id === dataset.id && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => onSelect(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

