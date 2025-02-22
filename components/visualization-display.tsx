import type { VisualizationResponse } from "@/lib/api"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VisualizationDisplayProps {
  visualizations: VisualizationResponse[]
  insights: string[]
}

export function VisualizationDisplay({ visualizations, insights }: VisualizationDisplayProps) {
  return (
    <div className="flex h-full">
      <ScrollArea className="flex-1 pr-4">
        <h2 className="text-2xl font-bold mb-4">Visualizations</h2>
        <div className="grid grid-cols-2 gap-4">
          {visualizations.map((viz, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Image
                src={`data:image/png;base64,${viz.image_base64}`}
                alt={`Visualization ${index + 1}`}
                width={400}
                height={300}
                layout="responsive"
              />
              {viz.description && <p className="mt-2 text-sm text-gray-600">{viz.description}</p>}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className="w-1/3 pl-4 border-l">
        <h2 className="text-2xl font-bold mb-4">Insights</h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

