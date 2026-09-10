import type { Report } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

interface ReportsResponse {
  reports?: Report[]
}

export async function fetchReports(signal?: AbortSignal): Promise<Report[]> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }

  const response = await fetch(`${API_URL}/reports`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Reports request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as Report[] | ReportsResponse
  return Array.isArray(payload) ? payload : payload.reports ?? []
}
