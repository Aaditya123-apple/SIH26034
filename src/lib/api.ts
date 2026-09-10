import type { Report } from "./types"
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth"
import { fetchSupabaseReports, isSupabaseConfigured, signInWithPassword } from "./supabase"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

interface ReportsResponse {
  reports?: Report[]
}

interface LoginResponse {
  accessToken?: string
  token?: string
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }

  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")

  const accessToken = getAccessToken()
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })
}

export async function fetchReports(signal?: AbortSignal): Promise<Report[]> {
  if (isSupabaseConfigured()) {
    return fetchSupabaseReports()
  }

  const response = await apiFetch("/reports", {
    method: "GET",
    signal,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Reports request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as Report[] | ReportsResponse
  return Array.isArray(payload) ? payload : payload.reports ?? []
}

export async function login(email: string, password: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await signInWithPassword(email, password)
    return
  }

  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`)
  }

  const payload = (await response.json()) as LoginResponse
  const accessToken = payload.accessToken ?? payload.token

  if (!accessToken) {
    throw new Error("Login response did not include an access token")
  }

  setAccessToken(accessToken)
}

export function logout(): void {
  clearAccessToken()
}
