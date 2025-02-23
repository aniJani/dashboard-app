// lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Helper function that retrieves the cached user ID from localStorage.
 * (localStorage is only available on the client side.)
 */
function getUserID(): string | null {
  // Check if window is defined (client side)
  if (typeof window !== "undefined") {
    return localStorage.getItem("userID");
  }
  return null;
}

export async function uploadDataset(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const userID = getUserID();
  if (userID) {
    formData.append("user_id", userID);
  }

  const response = await fetch(`${API_BASE_URL}/api/dataset/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to upload dataset: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error("Server response did not include a dataset_id");
  }
  return data.dataset_id;
}

export async function listDatasets(): Promise<DatasetInfo[]> {
  const userID = getUserID();
  const response = await fetch(
    `${API_BASE_URL}/api/dataset/list?user_id=${userID}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch datasets");
  }

  const data = await response.json();
  return data.datasets;
}

export async function generateVisualization(
  datasetId: string,
  prompt: string
): Promise<VisualizationResponse> {
  const userID = getUserID();
  const response = await fetch(
    `${API_BASE_URL}/api/visualization/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset_id: datasetId,
        prompt,
        user_id: userID,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate visualization");
  }

  return response.json();
}

export async function rerunVisualizations(
  datasetId: string
): Promise<VisualizationResponse[]> {
  const userID = getUserID();
  const response = await fetch(
    `${API_BASE_URL}/api/visualization/rerun?dataset_id=${datasetId}&user_id=${userID}`
  );

  if (!response.ok) {
    throw new Error("Failed to rerun visualizations");
  }

  const data = await response.json();
  return data.visualizations;
}

export async function getBusinessInsights(
  datasetId: string,
  query: string
): Promise<string> {
  const userID = getUserID();
  const response = await fetch(`${API_BASE_URL}/api/insights/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      query,
      user_id: userID,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get business insights");
  }

  const data = await response.json();
  return data.insights;
}

// Type definitions for dataset and visualization responses
export interface DatasetInfo {
  id: string;
  file_path: string;
  filename: string;
  user_id: string;
}

export interface VisualizationResponse {
  code: string;
  image_base64: string;
  description: string | null;
}

// Add this interface
export interface DatasetSummary {
  columns: string[];
  rows: number;
  data_types: Record<string, string>;
  sample: Record<string, Record<number, any>>;
}

// Add this function
export async function getDatasetHead(datasetId: string): Promise<DatasetSummary> {
  const response = await fetch(`${API_BASE_URL}/api/dataset/head?dataset_id=${datasetId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dataset head');
  }
  return response.json();
}

// Add these functions
export async function getPastVisualizations(datasetId: string): Promise<VisualizationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/dataset/visualizations?dataset_id=${datasetId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch past visualizations');
  }
  return response.json();
}

export async function addToPastDatasets(datasetId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/dataset/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: datasetId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add dataset to history');
  }
}
