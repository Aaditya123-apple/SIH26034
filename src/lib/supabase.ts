import { getAccessToken, setAccessToken } from "./auth"
import type { Report } from "./types"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

interface SupabaseAuthResponse {
  access_token: string
  refresh_token?: string
}

interface SupabaseReportRow {
  id: string
  product_name: string
  product_id: string
  category: string
  compliance_score: number
  status: Report["status"]
  date: string
  violations: Report["violations"]
  factory_info: Report["factoryInfo"]
  law_violations: Report["lawViolations"]
}

function requireSupabaseConfig(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are not configured")
  }

  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY }
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, anonKey } = requireSupabaseConfig()
  const headers = new Headers(init.headers)
  headers.set("apikey", anonKey)
  headers.set("Accept", "application/json")

  const accessToken = getAccessToken()
  headers.set("Authorization", `Bearer ${accessToken ?? anonKey}`)

  const response = await fetch(`${url}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Supabase request failed with status ${response.status}: ${message}`)
  }

  return (await response.json()) as T
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { url, anonKey } = requireSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`Supabase login failed with status ${response.status}`)
  }

  const session = (await response.json()) as SupabaseAuthResponse
  setAccessToken(session.access_token)
}

export async function fetchSupabaseReports(): Promise<Report[]> {
  const rows = await supabaseRequest<SupabaseReportRow[]>(
    "/rest/v1/reports?select=id,product_name,product_id,category,compliance_score,status,date,violations,factory_info,law_violations&order=date.desc"
  )

  return rows.map((row) => ({
    id: row.id,
    productName: row.product_name,
    productId: row.product_id,
    category: row.category,
    complianceScore: row.compliance_score,
    status: row.status,
    date: row.date,
    violations: row.violations ?? [],
    factoryInfo: row.factory_info,
    lawViolations: row.law_violations ?? [],
  }))
}

export async function uploadInspectionImage(file: File): Promise<string> {
  const { url, anonKey } = requireSupabaseConfig()
  const filePath = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
  const headers = new Headers({
    apikey: anonKey,
    "Content-Type": file.type || "application/octet-stream",
    "x-upsert": "false",
  })
  const accessToken = getAccessToken()
  headers.set("Authorization", `Bearer ${accessToken ?? anonKey}`)

  const response = await fetch(`${url}/storage/v1/object/inspection-images/${filePath}`, {
    method: "POST",
    headers,
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Image upload failed with status ${response.status}`)
  }

  return filePath
}
