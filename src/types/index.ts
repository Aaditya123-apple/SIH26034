// User Types
export interface User {
  id: string
  name: string
  email: string
  employeeId: string
  phone?: string
  region: string
  designation: string
  department: string
  avatar?: string
}

// Inspection Types
export interface Inspection {
  id: string
  productName: string
  category: string
  imageUrl: string
  complianceScore: number
  status: "Compliant" | "Partially Compliant" | "Non-Compliant"
  date: string
  officer: string
  officerId: string
  annotations: Annotation[]
  analysisResult?: AnalysisResult
}

export interface Annotation {
  id: string
  type: "violation" | "warning" | "info"
  label: string
  x: number
  y: number
  width: number
  height: number
  description: string
  severity: "critical" | "high" | "medium" | "low"
}

export interface AnalysisResult {
  id: string
  inspectionId: string
  complianceScore: number
  status: string
  issues: Issue[]
  detectedText: string
  processingTime: number
  timestamp: string
}

export interface Issue {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  rule: string
  recommendation: string
  category: string
}

// Report Types
export interface Report {
  id: string
  inspectionId: string
  productName: string
  category: string
  complianceScore: number
  status: string
  date: string
  officer: string
  pdfUrl?: string
  violations: Issue[]
  recommendations: string[]
}

// Dashboard Types
export interface DashboardStats {
  totalInspections: number
  complianceRate: number
  violationsDetected: number
  reportsGenerated: number
  avgProcessingTime: number
  modelAccuracy: number
}

export interface ChartData {
  month: string
  inspections: number
  violations: number
  compliance: number
}

// Analytics Types
export interface ComplianceTrend {
  month: string
  complianceRate: number
  inspections: number
  violations: number
}

export interface ViolationDistribution {
  name: string
  value: number
  color: string
}

export interface OfficerPerformance {
  officer: string
  inspections: number
  avgScore: number
  violations: number
}

// Settings Types
export interface UserSettings {
  profile: {
    fullName: string
    email: string
    phone: string
    region: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsAlerts: boolean
    weeklyReports: boolean
  }
  security: {
    twoFactorAuth: boolean
    loginAlerts: boolean
    sessionTimeout: string
  }
  system: {
    theme: "light" | "dark" | "system"
    language: string
    dateFormat: string
    timezone: string
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form Types
export interface LoginForm {
  employeeId: string
  password: string
}

export interface InspectionForm {
  productName: string
  category: string
  imageUrl: string
  notes?: string
}
