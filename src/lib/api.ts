import type { Report } from "./types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth";
import {
  fetchSupabaseReports,
  isSupabaseConfigured,
  signInWithPassword,
} from "./supabase";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export function getRealtimeUrl(path: string): string {
  const url = new URL(API_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = path;
  return url.toString();
}

interface ReportsResponse {
  reports?: Report[];
}

interface BackendInspection {
  inspection_id: string;
  product_id: string;
  product_name: string;
  detection_source: string;
  detection_confidence: number;
  timestamp: string;
  status: string;
  processing_stage: string;
  overall_compliance: string;
  images: string[];
  declarations: Array<{
    field: string;
    value?: string;
    normalised_value?: string;
    confidence?: number;
  }>;
  rule_results: Array<{
    rule_id: string;
    rule_name: string;
    requirement: string;
    detected_value?: string;
    expected_value?: string;
    result: string;
    explanation: string;
    confidence?: number;
    rule_version?: string;
  }>;
  violations: string[];
  warnings: string[];
  evidence: Array<{
    field: string;
    bbox?: number[];
    text?: string;
    confidence?: number;
    rule_id?: string;
    result?: string;
  }>;
  report?: { inspection_id?: string; status?: string; generated_at?: string };
}

interface LoginResponse {
  accessToken?: string;
  token?: string;
}

export interface DashboardOverview {
  stats: {
    total_inspections: number;
    pass_count: number;
    violation_count: number;
    warning_count: number;
    review_count: number;
    compliance_rate: number;
  };
  reports: Report[];
}

function normalizeComplianceStatus(status: string): Report["status"] {
  switch (status) {
    case "PASS":
      return "Compliant";
    case "WARNING":
      return "Partially Compliant";
    case "REQUIRES_REVIEW":
      return "Partially Compliant";
    case "VIOLATION":
    default:
      return "Non-Compliant";
  }
}

function mapInspectionToReport(inspection: BackendInspection): Report {
  const ruleViolations = (inspection.rule_results ?? []).filter(
    (item) => item.result === "VIOLATION" || item.result === "REQUIRES_REVIEW",
  );
  const scaledScore =
    inspection.overall_compliance === "PASS"
      ? 96
      : inspection.overall_compliance === "WARNING"
        ? 82
        : inspection.overall_compliance === "REQUIRES_REVIEW"
          ? 68
          : 41;

  return {
    id: inspection.inspection_id,
    productName: inspection.product_name,
    productId: inspection.product_id,
    category: inspection.declarations.find((d) => d.field === "product_name")
      ? "Packaged Commodity"
      : "General",
    complianceScore: scaledScore,
    status: normalizeComplianceStatus(inspection.overall_compliance),
    date: inspection.timestamp
      ? inspection.timestamp.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    violations: ruleViolations.map((rule, index) => ({
      id: `${inspection.inspection_id}-${rule.rule_id || index}`,
      type: rule.rule_name,
      severity: rule.result === "VIOLATION" ? "critical" : "medium",
      description: rule.explanation,
    })),
    factoryInfo: {
      factoryName: "Automated Detection Source",
      city: "Demo City",
      region: "Demo Region",
      manufacturingDate: new Date().toISOString().slice(0, 10),
      destination: "Inspection Hub",
    },
    lawViolations: ruleViolations.map((rule) => ({
      law: "Legal Metrology (Packaged Commodities) Rules, 2011",
      section: rule.rule_id,
      description: rule.explanation,
    })),
  };
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

export async function fetchReports(signal?: AbortSignal): Promise<Report[]> {
  if (isSupabaseConfigured()) {
    return fetchSupabaseReports();
  }

  const response = await apiFetch("/api/inspections", {
    method: "GET",
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Reports request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as
    | BackendInspection[]
    | ReportsResponse;
  const inspections: BackendInspection[] = Array.isArray(payload)
    ? payload
    : ((payload.reports ?? []) as unknown as BackendInspection[]);

  return inspections.map(mapInspectionToReport);
}

export async function fetchDashboardStats(): Promise<{
  total_inspections: number;
  pass_count: number;
  violation_count: number;
  warning_count: number;
  review_count: number;
  compliance_rate: number;
}> {
  const response = await apiFetch("/api/dashboard/stats", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Dashboard stats request failed with status ${response.status}`,
    );
  }

  return (await response.json()) as {
    total_inspections: number;
    pass_count: number;
    violation_count: number;
    warning_count: number;
    review_count: number;
    compliance_rate: number;
  };
}

export async function fetchDashboardOverview(
  signal?: AbortSignal,
): Promise<DashboardOverview> {
  const response = await apiFetch("/api/dashboard/overview", {
    method: "GET",
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Dashboard overview request failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    stats: DashboardOverview["stats"];
    inspections: BackendInspection[];
  };

  return {
    stats: payload.stats,
    reports: payload.inspections.map(mapInspectionToReport),
  };
}

export async function simulateDetection(
  payload: Record<string, unknown>,
): Promise<Report> {
  const response = await apiFetch("/api/detections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Detection failed with status ${response.status}`);
  }

  const inspection = (await response.json()) as BackendInspection;
  return mapInspectionToReport(inspection);
}

export async function uploadInspection(
  file: File,
  productName: string,
  context: {
    jurisdiction?: string;
    productType?: string;
    isImported?: boolean;
  } = {},
): Promise<{
  inspection_id: string;
  status: string;
  processing_stage: string;
  image_url: string;
}> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("product_name", productName);
  formData.append("jurisdiction", context.jurisdiction ?? "IN");
  formData.append("product_type", context.productType ?? "packaged_commodity");
  formData.append("is_imported", String(context.isImported ?? false));

  const response = await apiFetch("/api/inspections/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed with status ${response.status}`);
  }

  return (await response.json()) as {
    inspection_id: string;
    status: string;
    processing_stage: string;
    image_url: string;
  };
}

export async function login(email: string, password: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await signInWithPassword(email, password);
    return;
  }

  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  const payload = (await response.json()) as LoginResponse;
  const accessToken = payload.accessToken ?? payload.token;

  if (!accessToken) {
    throw new Error("Login response did not include an access token");
  }

  setAccessToken(accessToken);
}

export function logout(): void {
  clearAccessToken();
}
