"use client";

import type { VisualizationResponse } from "@/lib/api";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGradientAnimation } from "@/hooks/useGradientAnimation";

interface VisualizationDisplayProps {
  visualizations: VisualizationResponse[];
  insights: string[];
}

export function VisualizationDisplay({ visualizations, insights }: VisualizationDisplayProps) {
  const [selectedViz, setSelectedViz] = useState<number | null>(null);
  const [scales, setScales] = useState<{ [key: number]: number }>({});
  const containerRef = useGradientAnimation();

  const handleDrag = (event: React.MouseEvent, index: number) => {
    const startY = event.clientY;
    const startScale = scales[index] || 1;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newScale = Math.max(0.5, Math.min(3, startScale + deltaY * 0.01));
      setScales(prev => ({ ...prev, [index]: newScale }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getGridItemClass = (index: number, totalItems: number) => {
    // For single visualization
    if (totalItems === 1) {
      return "col-span-2 h-[calc(100vh-250px)]";
    }
    // For two visualizations
    if (totalItems === 2) {
      return "h-[calc(100vh-250px)]";
    }
    // For three visualizations
    if (totalItems === 3) {
      if (index < 2) {
        // First two visualizations take half height
        return "h-[calc((100vh-250px)/2)]";
      } else {
        // Third visualization spans full width but same height as top two
        return "col-span-2 h-[calc((100vh-250px)/2)]";
      }
    }
    // Default height for 4+ visualizations
    return "h-[300px]";
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-full"
    >
      <div className="flex h-full">
        <ScrollArea className="flex-1 pr-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-gradient-to-r from-[#00caeb] to-[#df3f8b]">Visualizations</h2>
          <div className={`grid grid-cols-2 gap-6 ${
            visualizations.length <= 3 ? 'h-[calc(100vh-200px)]' : ''
          }`}>
            {visualizations.map((viz, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 3) * 0.1 }}
                className={`relative ${getGridItemClass(index, visualizations.length)}`}
              >
                <Card className="group relative h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 h-full">
                    <motion.div
                      className="relative cursor-move h-full"
                      style={{
                        scale: scales[index] || 1,
                        transformOrigin: "center center"
                      }}
                      onMouseDown={(e) => handleDrag(e, index)}
                    >
                      <div className="relative h-full flex items-center justify-center">
                        <Image
                          src={`data:image/png;base64,${viz.image_base64}`}
                          alt={`Visualization ${index + 1}`}
                          fill
                          className="object-contain"
                          onClick={() => setSelectedViz(index)}
                        />
                      </div>
                    </motion.div>

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedViz(index)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>

                    {viz.description && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm text-foreground">{viz.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <ScrollArea className="w-1/3 pl-4 border-l">
          <h2 className="text-2xl font-bold mb-4 text-center text-{gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885]}">Insights</h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p>{insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Full Screen Modal */}
        <AnimatePresence>
          {selectedViz !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
              onClick={() => setSelectedViz(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl w-full h-[80vh] bg-card rounded-lg p-4"
                onClick={e => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => setSelectedViz(null)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <motion.div
                  className="relative cursor-move h-full"
                  style={{
                    scale: scales[selectedViz] || 1,
                    transformOrigin: "center center"
                  }}
                  onMouseDown={(e) => handleDrag(e, selectedViz)}
                >
                  <div className="relative h-full flex items-center justify-center">
                    <Image
                      src={`data:image/png;base64,${visualizations[selectedViz].image_base64}`}
                      alt={`Visualization ${selectedViz + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                {visualizations[selectedViz].description && (
                  <motion.p 
                    className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {visualizations[selectedViz].description}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
