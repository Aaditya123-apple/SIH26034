import axios from "axios"

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const apiEndpoints = {
  // Authentication
  login: "/auth/login",
  logout: "/auth/logout",
  refreshToken: "/auth/refresh",
  
  // Inspections
  createInspection: "/inspections",
  getInspections: "/inspections",
  getInspectionById: (id: string) => `/inspections/${id}`,
  updateInspection: (id: string) => `/inspections/${id}`,
  deleteInspection: (id: string) => `/inspections/${id}`,
  
  // Analysis
  analyzeImage: "/analysis/analyze",
  getAnalysisResult: (id: string) => `/analysis/${id}`,
  
  // Reports
  generateReport: "/reports/generate",
  getReports: "/reports",
  getReportById: (id: string) => `/reports/${id}`,
  downloadReport: (id: string) => `/reports/${id}/download`,
  
  // Dashboard
  getDashboardStats: "/dashboard/stats",
  getRecentInspections: "/dashboard/recent",
  
  // Analytics
  getComplianceTrends: "/analytics/trends",
  getViolationDistribution: "/analytics/violations",
  getOfficerPerformance: "/analytics/performance",
  
  // User
  getProfile: "/user/profile",
  updateProfile: "/user/profile",
  changePassword: "/user/password",
  
  // Settings
  getSettings: "/user/settings",
  updateSettings: "/user/settings",
}

export default api
