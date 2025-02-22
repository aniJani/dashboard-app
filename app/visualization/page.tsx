"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DatasetUpload } from "@/components/dataset-upload";
import { ChatInterface } from "@/components/chat-interface";
import {
  generateVisualization,
  getPastVisualizations,
  addToPastDatasets,
} from "@/lib/api";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { DatasetPreview } from "@/components/dataset-preview";

export default function VisualizationPage() {
  const searchParams = useSearchParams();
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<
    { code: string; image_base64: string; description: string | null }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedViz, setExpandedViz] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const urlDatasetId = searchParams.get("datasetId");
    if (urlDatasetId) {
      setDatasetId(urlDatasetId);
      fetchPastVisualizations(urlDatasetId);
    }
  }, [searchParams]);

  const fetchPastVisualizations = async (id: string) => {
    try {
      const pastVisualizations = await getPastVisualizations(id);
      setVisualizations(pastVisualizations);
    } catch (error) {
      console.error("Error fetching past visualizations:", error);
      setError("Failed to fetch past visualizations. Please try again.");
    }
  };

  const handleVisualizationRequest = async (prompt: string) => {
    if (!datasetId) return "Please upload a dataset first.";

    try {
      const result = await generateVisualization(datasetId, prompt);
      setVisualizations((prev) => [result, ...prev]);
      return "Visualization generated successfully. You can see it below the chat.";
    } catch (error) {
      console.error("Error generating visualization:", error);
      return "An error occurred while generating the visualization.";
    }
  };

  const handleDatasetSelection = (id: string) => {
    setDatasetId(id);
    fetchPastVisualizations(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/10"
    >
      <div className="container py-8 px-4 md:px-8">
        <motion.h1 
          className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Data Visualization Studio
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {!datasetId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Start Your Visualization Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DatasetUpload
                  onUploadSuccess={handleDatasetSelection}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="chat">Dataset & Chat</TabsTrigger>
                <TabsTrigger value="gallery">Visualization Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="border rounded-lg p-4">
                <div className="mb-6">
                  <DatasetPreview datasetId={datasetId} />
                </div>
                <ChatInterface
                  onSendMessage={handleVisualizationRequest}
                  placeholder="Describe the visualization you want..."
                  selectedDataset={{
                    id: datasetId,
                    filename: "Dataset",
                    file_path: "",
                    user_id: ""
                  }}
                />
              </TabsContent>

              <TabsContent value="gallery">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visualizations.map((viz, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative group">
                            <Image
                              src={`data:image/png;base64,${viz.image_base64}`}
                              alt={`Visualization ${index + 1}`}
                              width={600}
                              height={400}
                              className="w-full transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="outline"
                                className="text-white border-white hover:bg-white/20"
                                onClick={() => setExpandedViz(expandedViz === index ? null : index)}
                              >
                                {expandedViz === index ? <Minimize2 /> : <Maximize2 />}
                              </Button>
                            </div>
                          </div>
                          
                          {viz.description && (
                            <div className="p-4">
                              <p className="text-sm text-muted-foreground">{viz.description}</p>
                            </div>
                          )}

                          <AnimatePresence>
                            {expandedViz === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t"
                              >
                                <pre className="p-4 text-sm overflow-x-auto bg-muted/50">
                                  <code>{viz.code}</code>
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
