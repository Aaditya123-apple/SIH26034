import type { Report, ViolationSeverity } from "./types"

export type FindingState = "pass" | "review" | "fail"

export interface Declaration {
  key: string
  label: string
  value: string
  confidence: number
  state: FindingState
}

export interface InspectionFinding {
  id: string
  ruleId: string
  title: string
  description: string
  state: FindingState
  confidence: number
  evidenceLabel: string
  severity?: ViolationSeverity
}

export interface DemoInspectionResult {
  report: Report
  declarations: Declaration[]
  findings: InspectionFinding[]
  evidenceText: string[]
}

export const demoInspectionResult: DemoInspectionResult = {
  report: {
    id: "LM-2026-000128",
    productName: "Harvest Gold Basmati Rice",
    productId: "PROD-DEMO-001",
    category: "Food grains",
    complianceScore: 78,
    status: "Non-Compliant",
    date: "2026-09-10",
    violations: [
      {
        id: "V-DEMO-001",
        type: "Consumer care declaration",
        severity: "critical",
        description: "A qualifying consumer-care telephone or email declaration was not detected.",
      },
      {
        id: "V-DEMO-002",
        type: "Estimated declaration height",
        severity: "medium",
        description: "The estimated text height is below the configured review threshold.",
      },
    ],
    factoryInfo: {
      factoryName: "Harvest Foods Pvt Ltd",
      city: "Anand",
      region: "Gujarat",
      manufacturingDate: "2026-08-01",
      destination: "Mumbai",
    },
    lawViolations: [
      {
        law: "Legal Metrology (Packaged Commodities) Rules, 2011",
        section: "PCR-6",
        description: "Mandatory consumer-care declaration was not detected.",
      },
      {
        law: "Legal Metrology (Packaged Commodities) Rules, 2011",
        section: "PCR-7",
        description: "Declaration height requires authorised officer verification.",
      },
    ],
  },
  declarations: [
    { key: "manufacturer", label: "Manufacturer", value: "Harvest Foods Pvt Ltd", confidence: 0.96, state: "pass" },
    { key: "quantity", label: "Net quantity", value: "500 g", confidence: 0.98, state: "pass" },
    { key: "mrp", label: "Maximum retail price", value: "Rs. 499", confidence: 0.96, state: "pass" },
    { key: "packingDate", label: "Packing date", value: "08/2026", confidence: 0.95, state: "pass" },
    { key: "consumerCare", label: "Consumer care", value: "Not detected", confidence: 0.94, state: "fail" },
    { key: "fontHeight", label: "Estimated declaration height", value: "2.1 mm - review", confidence: 0.71, state: "review" },
  ],
  findings: [
    {
      id: "finding-consumer-care",
      ruleId: "PCR-6",
      title: "Consumer-care declaration not detected",
      description: "No qualifying consumer-care telephone or email declaration was found in the analysed package images.",
      state: "fail",
      confidence: 0.94,
      evidenceLabel: "Back panel · lower declaration area",
      severity: "critical",
    },
    {
      id: "finding-font-size",
      ruleId: "PCR-7",
      title: "Declaration height requires review",
      description: "The estimated declaration height is 2.1 mm. This is an image-based estimate, not a laboratory measurement.",
      state: "review",
      confidence: 0.71,
      evidenceLabel: "Back panel · quantity declaration",
      severity: "medium",
    },
  ],
  evidenceText: ["Harvest Gold Basmati Rice", "Net Qty 500 g", "MRP Rs. 499", "Packed: 08/2026"],
}

export const inspectionSteps = [
  "Uploading images",
  "Preprocessing package views",
  "Detecting text regions",
  "Running OCR",
  "Extracting declarations",
  "Evaluating versioned rules",
  "Generating visual evidence",
]
