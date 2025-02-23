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
  searchDatasets,
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
import type { DatasetSummary } from "@/lib/api";
import { DonutChart } from "@/components/ui/donut-chart";
import { ElevationChart } from "@/components/ui/elevation-chart";

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
  const [selectedDatasetPreview, setSelectedDatasetPreview] =
    useState<DatasetSummary | null>(null);
  const [requestType, setRequestType] = useState<
    "visualization" | "insight" | "search"
  >("visualization");
  const [isInitialView, setIsInitialView] = useState(true);

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

  const handleDatasetSelect = async (dataset: DatasetInfo | null) => {
    // Only allow dataset selection in visualization or insight mode
    if (requestType === "search") {
      return;
    }

    setSelectedDataset(dataset);
    if (dataset) {
      try {
        const rerunResults = await rerunVisualizations(dataset.id);
        setVisualizations(rerunResults);
        setInsights([]);

        const previewData = await getDatasetHead(dataset.id);
        setSelectedDatasetPreview(previewData);
      } catch (error) {
        console.error("Failed to fetch dataset data:", error);
      }
    } else {
      setVisualizations([]);
      setInsights([]);
      setSelectedDatasetPreview(null);
    }
  };

  const handleRequestTypeChange = (
    type: "visualization" | "insight" | "search"
  ) => {
    setRequestType(type);
    // Clear selected dataset when switching to search mode
    if (type === "search") {
      setSelectedDataset(null);
      setVisualizations([]);
      setInsights([]);
      setSelectedDatasetPreview(null);
    }
  };

  const handleRequest = async (
    type: "visualization" | "insight" | "search",
    prompt: string
  ) => {
    setIsInitialView(false);
    if (!selectedDataset && type !== "search") {
      return "Please select a dataset first";
    }

    try {
      if (type === "search") {
        const searchResults = await searchDatasets(prompt);
        return {
          type: "search",
          results: searchResults,
        };
      }

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
      console.error(`Error in ${type} request:`, error);
      return `An error occurred while processing your ${type} request.`;
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

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-background via-secondary/5 to-background p-4">
        <div className="w-full">
          {authMode === "login" ? (
            <Login onModeSwitch={toggleAuthMode} />
          ) : (
            <Signup onModeSwitch={toggleAuthMode} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground relative overflow-hidden font-space-grotesk">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#00caeb] rounded-full animate-ping opacity-25" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#df3f8b] rounded-full animate-ping delay-300 opacity-25" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#060885] rounded-full animate-ping delay-700 opacity-25" />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen overflow-hidden relative z-10">
        {/* Sidebar */}
        <motion.div
          initial={true}
          animate={{
            width: isSidebarCollapsed ? "64px" : "100%",
            flex: isSidebarCollapsed ? "0 0 64px" : "0 0 25%",
          }}
          className="min-h-screen bg-background overflow-hidden relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:flex"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>

          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              {!isSidebarCollapsed && (
                <h1 className="text-3xl font-bold">Infolaya</h1>
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
                  className="flex-1 overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    {/* Neon Glow Effects */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur opacity-75 "></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur-xl opacity-50"></div>
                    <Card className="relative flex-1 overflow-hidden bg-black/90 backdrop-blur-sm border border-accent/20">
                      <CardContent className="p-4 h-full flex flex-col">
                        <DatasetUpload onUploadSuccess={fetchDatasets} />

                        <div className="flex-1 overflow-auto mt-4">
                          {datasetsLoading ? (
                            <p>Loading datasets...</p>
                          ) : (
                            <DatasetList
                              datasets={datasets}
                              onSelect={handleDatasetSelect}
                              selectedDataset={selectedDataset}
                            />
                          )}
                        </div>

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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div layout className="flex-1 flex flex-col overflow-hidden">
          {isInitialView ? (
            <motion.div
              className="flex items-center justify-center h-full w-full max-w-3xl mx-auto p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full relative">
                {/* Neon glow effects - matching login styling */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur opacity-75 group-hover:opacity-100 "></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur-xl opacity-50 group-hover:opacity-75 "></div>
                <Card className="relative bg-black/90 backdrop-blur-sm border border-accent/20">
                  <CardContent className="p-6">
                    <ChatInterface
                      onSendMessage={handleRequest}
                      placeholder="Ask anything..."
                      selectedDataset={selectedDataset}
                      requestType={requestType}
                      onRequestTypeChange={setRequestType}
                      isInitialView={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex-1 p-4 lg:p-6 overflow-auto">
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
                className="h-1/3 border-t border-accent/20 "
              >
                <div className="relative h-full">
                  {/* Neon Glow Effects for Chat Interface */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur opacity-75 "></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur-xl opacity-50  "></div>
                  <Card className="relative h-full rounded-none border-0">
                    <CardContent className="p-0 h-full">
                      <ChatInterface
                        onSendMessage={handleRequest}
                        placeholder={
                          selectedDataset
                            ? "Ask for a visualization or insight or search for a dataset..."
                            : "Select a dataset to begin"
                        }
                        selectedDataset={selectedDataset}
                        requestType={requestType}
                        onRequestTypeChange={handleRequestTypeChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
