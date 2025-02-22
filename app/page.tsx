"use client";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { ChatInterface } from "@/components/chat-interface";
import { DatasetList } from "@/components/dataset-list";
import { DatasetUpload } from "@/components/dataset-upload";
import { Button } from "@/components/ui/button";
import { VisualizationDisplay } from "@/components/visualization-display";
import { DatasetPreview } from "@/components/dataset-preview";
import {
  type DatasetInfo,
  type VisualizationResponse,
  generateVisualization,
  getBusinessInsights,
  listDatasets,
  rerunVisualizations,
  getDatasetHead,
} from "@/lib/api";
import {
  Upload,
  LogOut,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { auth, onAuthStateChanged, signOut } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(
    null
  );
  const [visualizations, setVisualizations] = useState<VisualizationResponse[]>(
    []
  );
  const [insights, setInsights] = useState<string[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDatasetPreview, setSelectedDatasetPreview] = useState<DatasetSummary | null>(null);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser);
      if (!currentUser) {
        localStorage.removeItem("userID");
        // Clear dashboard state on logout
        setDatasets([]);
        setSelectedDataset(null);
        setVisualizations([]);
        setInsights([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Automatically fetch datasets when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDatasets();
    }
  }, [isAuthenticated]);

  const fetchDatasets = async () => {
    setDatasetsLoading(true);
    try {
      const fetchedDatasets = await listDatasets();
      setDatasets(fetchedDatasets);
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
    } finally {
      setDatasetsLoading(false);
    }
  };

  const handleDatasetSelect = async (dataset: DatasetInfo) => {
    setSelectedDataset(dataset);
    try {
      // Fetch visualizations
      const rerunResults = await rerunVisualizations(dataset.id);
      setVisualizations(rerunResults);
      setInsights([]); // Clear insights when a new dataset is selected
      
      // Fetch dataset preview
      const previewData = await getDatasetHead(dataset.id);
      setSelectedDatasetPreview(previewData);
    } catch (error) {
      console.error("Failed to fetch dataset data:", error);
    }
  };

  const handleRequest = async (
    type: "visualization" | "insight",
    prompt: string
  ) => {
    if (!selectedDataset) return "Please select a dataset first.";
    try {
      if (type === "visualization") {
        const result = await generateVisualization(selectedDataset.id, prompt);
        setVisualizations((prev) => [result, ...prev]);
        return "Visualization generated successfully. You can see it in the display area.";
      } else {
        const insight = await getBusinessInsights(selectedDataset.id, prompt);
        setInsights((prev) => [insight, ...prev]);
        return insight;
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      return `An error occurred while generating the ${type}.`;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userID");
      setIsAuthenticated(false);
      // Clear all dashboard state
      setDatasets([]);
      setSelectedDataset(null);
      setVisualizations([]);
      setInsights([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-background via-secondary/5 to-background"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="w-full max-w-md p-8 space-y-6"
        >
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Data Visualization Studio
          </h1>
          {authMode === "login" ? <Login /> : <Signup />}
          <button
            className="w-full text-center text-muted-foreground hover:text-primary transition-colors"
            onClick={() =>
              setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
            }
          >
            {authMode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <motion.div
        initial={false}
        animate={{ width: isSidebarCollapsed ? "64px" : "25%" }}
        className="relative border-r bg-card/50 backdrop-blur-sm"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="text-2xl font-bold">Datasets</h2>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="p-3">
                    <DatasetUpload
                      onUploadSuccess={() => {
                        fetchDatasets();
                      }}
                    />
                    {datasetsLoading ? (
                      <p>Loading datasets...</p>
                    ) : (
                      <div className="h-[calc(100vh-500px)] overflow-auto">
                        <DatasetList
                          datasets={datasets}
                          onSelect={handleDatasetSelect}
                          selectedDataset={selectedDataset}
                        />
                      </div>
                    )}

                    {selectedDataset && (
                      <div className="h-[200px] overflow-auto mt-4">
                        <DatasetPreview datasetId={selectedDataset.id} />
                      </div>
                    )}

                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={fetchDatasets}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div layout className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VisualizationDisplay
              visualizations={visualizations}
              insights={insights}
            />
          </motion.div>
        </div>

        <motion.div
          layout
          className="h-1/3 border-t bg-card/50 backdrop-blur-sm"
        >
          <Card className="h-full rounded-none border-0">
            <CardContent className="p-0 h-full">
              <ChatInterface
                onSendMessage={handleRequest}
                placeholder={
                  selectedDataset
                    ? "Ask for a visualization or insight..."
                    : "Select a dataset to begin"
                }
                selectedDataset={selectedDataset}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
