// Government Color Palette
export const COLORS = {
  primary: "#0F4C81",
  secondary: "#1E3A8A",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  background: "#F8FAFC",
  card: "#FFFFFF",
} as const

// Violation Types
export const VIOLATION_TYPES = {
  MRP_MISSING: "MRP Missing",
  MANUFACTURER_MISSING: "Manufacturer Missing",
  FONT_SIZE_TOO_SMALL: "Font Size Too Small",
  DATE_MISSING: "Date Missing",
  NET_QUANTITY_FORMAT_ERROR: "Net Quantity Format Error",
  CONSUMER_CARE_MISSING: "Consumer Care Missing",
} as const

// Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const

// Compliance Status
export const COMPLIANCE_STATUS = {
  COMPLIANT: "Compliant",
  PARTIALLY_COMPLIANT: "Partially Compliant",
  NON_COMPLIANT: "Non-Compliant",
} as const

// Product Categories
export const PRODUCT_CATEGORIES = [
  "Dairy",
  "Food",
  "Personal Care",
  "Household",
  "Beverages",
  "Pharmaceuticals",
  "Electronics",
  "Textiles",
] as const

// Legal Metrology Rules
export const LEGAL_METROLOGY_RULES = {
  RULE_5: "Rule 5 - Manufacturer Details",
  RULE_6: "Rule 6 - Mandatory Declarations",
  RULE_7: "Rule 7 - Font Size Requirements",
} as const

// Dashboard KPI Labels
export const KPI_LABELS = {
  TOTAL_INSPECTIONS: "Total Inspections",
  COMPLIANCE_RATE: "Compliance Rate",
  VIOLATIONS_DETECTED: "Violations Detected",
  REPORTS_GENERATED: "Reports Generated",
  AVG_PROCESSING_TIME: "Average Processing Time",
  MODEL_ACCURACY: "Model Accuracy",
} as const
