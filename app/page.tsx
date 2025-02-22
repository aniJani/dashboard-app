"use client";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { ChatInterface } from "@/components/chat-interface";
import { DatasetList } from "@/components/dataset-list";
import { DatasetUpload } from "@/components/dataset-upload";
import { Button } from "@/components/ui/button";
import { VisualizationDisplay } from "@/components/visualization-display";
import {
  type DatasetInfo,
  type VisualizationResponse,
  generateVisualization,
  getBusinessInsights,
  listDatasets,
  rerunVisualizations,
} from "@/lib/api";
import { auth, onAuthStateChanged, signOut } from "@/lib/firebase";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null);
  const [visualizations, setVisualizations] = useState<VisualizationResponse[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

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
      const rerunResults = await rerunVisualizations(dataset.id);
      setVisualizations(rerunResults);
      setInsights([]);
    } catch (error) {
      console.error("Failed to rerun visualizations:", error);
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        {authMode === "login" ? <Login /> : <Signup />}
        <button
          className="text-blue-500 underline"
          onClick={() =>
            setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
          }
        >
          {authMode === "login"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Datasets</h2>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
        {/* Always show the upload component */}
        <DatasetUpload onUploadSuccess={fetchDatasets} />
        {datasetsLoading ? (
          <p>Loading datasets...</p>
        ) : (
          <DatasetList
            datasets={datasets}
            onSelect={handleDatasetSelect}
            selectedDataset={selectedDataset}
          />
        )}
        <Button className="mt-4 w-full" onClick={fetchDatasets}>
          <Upload className="mr-2 h-4 w-4" /> Refresh Datasets
        </Button>
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <VisualizationDisplay
            visualizations={visualizations}
            insights={insights}
          />
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
  );
}
