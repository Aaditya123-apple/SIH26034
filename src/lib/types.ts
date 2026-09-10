export type ReportStatus = "Compliant" | "Partially Compliant" | "Non-Compliant"

export type ViolationSeverity = "critical" | "high" | "medium" | "low"

export interface Violation {
  id: string
  type: string
  severity: ViolationSeverity
  description: string
}

export interface FactoryInfo {
  factoryName: string
  city: string
  region: string
  manufacturingDate: string
  destination: string
}

export interface LawViolation {
  law: string
  section: string
  description: string
}

export interface Report {
  id: string
  productName: string
  productId: string
  category: string
  complianceScore: number
  status: ReportStatus
  date: string
  violations: Violation[]
  factoryInfo: FactoryInfo
  lawViolations: LawViolation[]
}
