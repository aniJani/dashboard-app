const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const USER_ID = "user1"

export async function uploadDataset(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("user_id", USER_ID)

  const response = await fetch(`${API_BASE_URL}/api/dataset/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload dataset: ${response.status} ${response.statusText}. ${errorText}`)
  }

  const data = await response.json()
  if (!data.dataset_id) {
    throw new Error("Server response did not include a dataset_id")
  }
  return data.dataset_id
}

export async function listDatasets(): Promise<DatasetInfo[]> {
  const response = await fetch(`${API_BASE_URL}/api/dataset/list?user_id=${USER_ID}`)

  if (!response.ok) {
    throw new Error("Failed to fetch datasets")
  }

  const data = await response.json()
  return data.datasets
}

export async function generateVisualization(datasetId: string, prompt: string): Promise<VisualizationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/visualization/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      prompt,
      user_id: USER_ID,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to generate visualization")
  }

  return response.json()
}

export async function rerunVisualizations(datasetId: string): Promise<VisualizationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/visualization/rerun?dataset_id=${datasetId}&user_id=${USER_ID}`)

  if (!response.ok) {
    throw new Error("Failed to rerun visualizations")
  }

  const data = await response.json()
  return data.visualizations
}

export async function getBusinessInsights(datasetId: string, query: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/insights/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      query,
      user_id: USER_ID,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get business insights")
  }

  const data = await response.json()
  return data.insights
}

export interface DatasetInfo {
  id: string
  file_path: string
  filename: string
  user_id: string
}

export interface VisualizationResponse {
  code: string
  image_base64: string
  description: string | null
}

