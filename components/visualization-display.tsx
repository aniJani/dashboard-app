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
import { cn } from "@/lib/utils";

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
    // For 1 visualization
    if (totalItems === 1) {
      return "col-span-2 row-span-2 h-[600px]";
    }
    // For 2 visualizations
    if (totalItems === 2) {
      return "col-span-1 row-span-2 h-[600px]";
    }
    // For 3 visualizations
    if (totalItems === 3) {
      if (index === 2) {
        return "col-span-2 h-[300px]"; // Bottom visualization spans full width
      }
      return "col-span-1 h-[300px]"; // Top two visualizations take half width each
    }
    // For 4 or more visualizations
    return "col-span-1 h-[300px]"; // Each visualization takes a quarter of the space
  };

  return (
    <div className="h-full flex flex-col gap-4">
      

      {/* Content Area */}
      <div className="flex-1 grid grid-cols-[60%_40%] gap-4">
        {/* Visualizations */}
        <div className="h-full">
          <h2 className="text-2xl font-bold text-center text-gradient-to-r from-[#00caeb] to-[#df3f8b]">Visualizations</h2>
          <ScrollArea className="h-full rounded-lg border border-accent/20 p-4">
            <div className={cn(
              "grid gap-4",
              visualizations.length <= 1 ? "grid-cols-1" : "grid-cols-2",
              "auto-rows-min" // Allow rows to adjust based on content
            )}>
              {visualizations.map((viz, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 3) * 0.1 }}
                  className={cn("relative", getGridItemClass(index, visualizations.length))}
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
        </div>

        {/* Insights */}
        <div className="h-full">
          <h2 className="text-2xl font-bold text-center text-gradient-to-r from-[#00caeb] to-[#df3f8b]">Insights</h2>
          <ScrollArea className="h-full rounded-lg border border-accent/20 p-4">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 3) * 0.1 }}
                  className="p-4 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <p className="text-sm">{insight}</p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

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
  );
}
