"use client"

import * as React from "react"
import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle, FileText, Download, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Issue {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  rule: string
  recommendation: string
}

interface ComplianceAnalysisPanelProps {
  hasAnalyzed: boolean
  complianceScore?: number
  onGenerateReport?: () => void
}

const mockIssues: Issue[] = [
  {
    id: "1",
    severity: "critical",
    title: "MRP Missing",
    description: "Maximum Retail Price not displayed on the package",
    rule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6",
    recommendation: "Display MRP in bold letters as 'MRP: ₹XXX'",
  },
  {
    id: "2",
    severity: "critical",
    title: "Manufacturer Details Missing",
    description: "Manufacturer name and complete address not visible",
    rule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 5",
    recommendation: "Include manufacturer name, address, and contact details",
  },
  {
    id: "3",
    severity: "high",
    title: "Font Size Below Minimum",
    description: "Font size for mandatory declarations is below 1.2mm",
    rule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 7",
    recommendation: "Increase font size to minimum 1.2mm height",
  },
  {
    id: "4",
    severity: "high",
    title: "Manufacturing Date Missing",
    description: "Date of manufacturing or packaging not displayed",
    rule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6",
    recommendation: "Display date in DD/MM/YYYY format",
  },
  {
    id: "5",
    severity: "medium",
    title: "Net Quantity Format Error",
    description: "Net quantity not in standard numerical + unit format",
    rule: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6",
    recommendation: "Format as 'Net Wt: 500g' or 'Net Vol: 1L'",
  },
]

export function ComplianceAnalysisPanel({ 
  hasAnalyzed, 
  complianceScore = 83,
  onGenerateReport 
}: ComplianceAnalysisPanelProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const getSeverityColor = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-danger"
      case "high":
        return "bg-warning"
      case "medium":
        return "bg-primary"
      case "low":
        return "bg-success"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityBadgeVariant = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "warning"
      case "medium":
        return "default"
      case "low":
        return "success"
      default:
        return "outline"
    }
  }

  const getStatus = (score: number) => {
    if (score >= 90) return { text: "Fully Compliant", color: "success", risk: "Low" }
    if (score >= 70) return { text: "Partially Compliant", color: "warning", risk: "Medium" }
    return { text: "Non-Compliant", color: "destructive", risk: "High" }
  }

  const status = getStatus(complianceScore)

  if (!hasAnalyzed) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Compliance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Awaiting Analysis</p>
            <p className="text-sm mt-2">
              Upload an image and click "Analyze" to check compliance
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Compliance Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Score Circle */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={complianceScore >= 90 ? "#16A34A" : complianceScore >= 70 ? "#F59E0B" : "#DC2626"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - complianceScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {complianceScore}%
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <Badge variant={status.color as any} className="text-sm px-4 py-1">
              {status.text}
            </Badge>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-600">Risk Level:</span>
              <Badge variant="outline" className="text-xs">
                {status.risk}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issues Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Issues Detected</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 p-2 rounded bg-red-50">
              <XCircle className="h-4 w-4 text-danger" />
              <span className="text-xs font-medium text-gray-900">Critical: 2</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium text-gray-900">High: 2</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-gray-900">Medium: 1</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded bg-green-50">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-gray-900">Low: 0</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issues List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Detailed Issues</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mockIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIssue?.id === issue.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${getSeverityColor(issue.severity)}`}
                      />
                      <h4 className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {issue.description}
                    </p>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(issue.severity) as any} className="text-xs">
                    {issue.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Issue Details */}
        {selectedIssue && (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                {selectedIssue.title}
              </h4>
              <Badge variant={getSeverityBadgeVariant(selectedIssue.severity) as any}>
                {selectedIssue.severity}
              </Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-gray-900">Description:</span>
                <p className="text-gray-600 mt-1">{selectedIssue.description}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Rule Reference:</span>
                <p className="text-gray-600 mt-1">{selectedIssue.rule}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Recommendation:</span>
                <p className="text-gray-600 mt-1">{selectedIssue.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={onGenerateReport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Compliance Report
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
