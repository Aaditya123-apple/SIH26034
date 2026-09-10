"use client"

import * as React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { LoadingSpinner } from "@/components/ui"
import { fetchReports } from "@/lib/api"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { Report } from "@/lib/types"
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Scale,
  Filter
} from "lucide-react"
import { downloadPDF } from "@/lib/pdf-generator"

const mockReports: Report[] = [
  {
    id: "RPT-2024-001",
    productName: "Amul Taaza Milk",
    productId: "PROD-001",
    category: "Dairy",
    complianceScore: 95,
    status: "Compliant",
    date: "2024-01-15",
    violations: [],
    factoryInfo: {
      factoryName: "Amul Dairy Plant",
      city: "Anand",
      region: "Gujarat",
      manufacturingDate: "2024-01-10",
      destination: "Mumbai"
    },
    lawViolations: []
  },
  {
    id: "RPT-2024-002",
    productName: "Nestle Maggi Noodles",
    productId: "PROD-002",
    category: "Food",
    complianceScore: 78,
    status: "Partially Compliant",
    date: "2024-01-15",
    violations: [
      {
        id: "V1",
        type: "Font Size Issue",
        severity: "medium",
        description: "Font size below minimum requirement of 1.2mm"
      }
    ],
    factoryInfo: {
      factoryName: "Nestle India Ltd",
      city: "Moga",
      region: "Punjab",
      manufacturingDate: "2024-01-08",
      destination: "Delhi"
    },
    lawViolations: [
      {
        law: "Legal Metrology (Packaged Commodities) Rules, 2011",
        section: "Rule 7",
        description: "Font size not meeting minimum requirements"
      }
    ]
  },
  {
    id: "RPT-2024-003",
    productName: "Colgate Toothpaste",
    productId: "PROD-003",
    category: "Personal Care",
    complianceScore: 88,
    status: "Compliant",
    date: "2024-01-14",
    violations: [],
    factoryInfo: {
      factoryName: "Colgate Palmolive India",
      city: "Baddi",
      region: "Himachal Pradesh",
      manufacturingDate: "2024-01-05",
      destination: "Chennai"
    },
    lawViolations: []
  },
  {
    id: "RPT-2024-004",
    productName: "Tata Salt",
    productId: "PROD-004",
    category: "Food",
    complianceScore: 92,
    status: "Compliant",
    date: "2024-01-14",
    violations: [],
    factoryInfo: {
      factoryName: "Tata Chemicals",
      city: "Mithapur",
      region: "Gujarat",
      manufacturingDate: "2024-01-12",
      destination: "Kolkata"
    },
    lawViolations: []
  },
  {
    id: "RPT-2024-005",
    productName: "Surf Excel Detergent",
    productId: "PROD-005",
    category: "Household",
    complianceScore: 65,
    status: "Non-Compliant",
    date: "2024-01-13",
    violations: [
      {
        id: "V2",
        type: "MRP Missing",
        severity: "critical",
        description: "Maximum Retail Price not displayed"
      },
      {
        id: "V3",
        type: "Manufacturer Missing",
        severity: "critical",
        description: "Manufacturer name and address not visible"
      }
    ],
    factoryInfo: {
      factoryName: "HUL Manufacturing Unit",
      city: "Kolkata",
      region: "West Bengal",
      manufacturingDate: "2024-01-01",
      destination: "Bangalore"
    },
    lawViolations: [
      {
        law: "Legal Metrology (Packaged Commodities) Rules, 2011",
        section: "Rule 6",
        description: "MRP not displayed as per legal requirements"
      },
      {
        law: "Legal Metrology (Packaged Commodities) Rules, 2011",
        section: "Rule 5",
        description: "Manufacturer details not provided"
      }
    ]
  }
]

export default function ReportsPage() {
  const hasDataSource = Boolean(process.env.NEXT_PUBLIC_API_URL) || isSupabaseConfigured()
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filter, setFilter] = useState<"all" | "compliant" | "non-compliant">("all")
  const [isLoading, setIsLoading] = useState(hasDataSource)
  const [apiError, setApiError] = useState<string | null>(null)

  React.useEffect(() => {
    if (!hasDataSource) {
      return
    }

    const controller = new AbortController()

    fetchReports(controller.signal)
      .then((liveReports) => {
        setReports(liveReports)
        setApiError(null)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        setApiError(error instanceof Error ? error.message : "Unable to load live reports")
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [hasDataSource])

  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(r => 
        filter === "compliant" ? r.status === "Compliant" : r.status !== "Compliant"
      )

  const handleDownloadPDF = (report: Report) => {
    downloadPDF(report)
  }

  const getConcernLevel = (violationCount: number, totalReports: number) => {
    const percentage = (violationCount / totalReports) * 100
    if (percentage <= 2) return { level: "Individual", color: "bg-green-100 text-green-800" }
    if (percentage <= 4) return { level: "Concern", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Critical", color: "bg-red-100 text-red-800" }
  }

  const violationByType = reports.reduce((acc, report) => {
    report.violations.forEach(v => {
      acc[v.type] = (acc[v.type] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  return (
    <MainLayout>
      <div className="space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <LoadingSpinner size="sm" />
            Loading reports from the compliance service...
          </div>
        )}
        {apiError && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Live reports are unavailable. Showing demo data. {apiError}
          </div>
        )}
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Reports</h1>
            <p className="text-slate-600">
              View and analyze backend-generated compliance reports
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{reports.length}</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === "Compliant").length}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Partially Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === "Partially Compliant").length}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Non-Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.status === "Non-Compliant").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Violation Analysis */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Violation Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(violationByType).map(([type, count]) => {
                const percentage = reports.length === 0 ? 0 : (count / reports.length) * 100
                const concern = getConcernLevel(count, reports.length)
                
                return (
                  <div key={type} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Scale className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{type}</p>
                        <p className="text-sm text-slate-600">{count} reports ({percentage.toFixed(1)}%)</p>
                      </div>
                    </div>
                    <Badge className={concern.color}>
                      {concern.level}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Report ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Product ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Compliance Score
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="py-4 px-4 text-sm text-slate-900 font-medium">
                        {report.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {report.productName}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {report.productId}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {report.category}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-900 font-bold">
                        {report.complianceScore}%
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            report.status === "Compliant"
                              ? "success"
                              : report.status === "Partially Compliant"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {report.date}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadPDF(report)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Report Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedReport(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Product Name</p>
                      <p className="font-medium text-slate-900">{selectedReport.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Product ID</p>
                      <p className="font-medium text-slate-900">{selectedReport.productId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Category</p>
                      <p className="font-medium text-slate-900">{selectedReport.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Compliance Score</p>
                      <p className="font-medium text-slate-900">{selectedReport.complianceScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Factory Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Factory & Location Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Factory Name</p>
                      <p className="font-medium text-slate-900">{selectedReport.factoryInfo.factoryName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">City</p>
                      <p className="font-medium text-slate-900">{selectedReport.factoryInfo.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Region</p>
                      <p className="font-medium text-slate-900">{selectedReport.factoryInfo.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Manufacturing Date</p>
                      <p className="font-medium text-slate-900">{selectedReport.factoryInfo.manufacturingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Destination</p>
                      <p className="font-medium text-slate-900">{selectedReport.factoryInfo.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Violations */}
                {selectedReport.violations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Violations</h3>
                    <div className="space-y-3">
                      {selectedReport.violations.map((violation) => (
                        <div
                          key={violation.id}
                          className="p-4 rounded-lg border border-red-200 bg-red-50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{violation.type}</p>
                              <p className="text-sm text-slate-600 mt-1">{violation.description}</p>
                            </div>
                            <Badge
                              variant={
                                violation.severity === "critical"
                                  ? "destructive"
                                  : violation.severity === "high"
                                  ? "warning"
                                  : "outline"
                              }
                            >
                              {violation.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Law Violations */}
                {selectedReport.lawViolations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <Scale className="h-5 w-5 mr-2 text-slate-600" />
                      Law Violations
                    </h3>
                    <div className="space-y-3">
                      {selectedReport.lawViolations.map((law, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-slate-200 bg-slate-50"
                        >
                          <div className="space-y-2">
                            <p className="font-medium text-slate-900">{law.law}</p>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Section:</span> {law.section}
                            </p>
                            <p className="text-sm text-slate-600">{law.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <Button variant="outline" onClick={() => setSelectedReport(null)}>
                    Close
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleDownloadPDF(selectedReport)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
