"use client"

import * as React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ImageUploadPanel } from "@/components/inspection/image-upload-panel"
import { ImageViewer } from "@/components/inspection/image-viewer"
import { ComplianceAnalysisPanel } from "@/components/inspection/compliance-analysis-panel"
import { AIAnalysisOverlay } from "@/components/inspection/ai-analysis-overlay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText } from "lucide-react"

interface Annotation {
  id: string
  type: "violation" | "warning" | "info"
  label: string
  x: number
  y: number
  width: number
  height: number
  description: string
}

const mockAnnotations: Annotation[] = [
  {
    id: "1",
    type: "violation",
    label: "MRP Missing",
    x: 10,
    y: 15,
    width: 25,
    height: 10,
    description: "Maximum Retail Price not displayed as per Legal Metrology Rules",
  },
  {
    id: "2",
    type: "violation",
    label: "Manufacturer Missing",
    x: 40,
    y: 30,
    width: 20,
    height: 15,
    description: "Manufacturer name and address not clearly visible",
  },
  {
    id: "3",
    type: "warning",
    label: "Font Too Small",
    x: 65,
    y: 50,
    width: 15,
    height: 10,
    description: "Font size below minimum requirement of 1.2mm",
  },
  {
    id: "4",
    type: "violation",
    label: "Date Missing",
    x: 20,
    y: 70,
    width: 18,
    height: 8,
    description: "Manufacturing/Packaging date not displayed",
  },
  {
    id: "5",
    type: "warning",
    label: "Net Quantity Format Error",
    x: 50,
    y: 80,
    width: 22,
    height: 12,
    description: "Net quantity not in standard format (number + unit)",
  },
]

export default function InspectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [complianceScore, setComplianceScore] = useState(83)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [showReport, setShowReport] = useState(false)

  const handleAnalyze = () => {
    if (!selectedImage) return
    setIsAnalyzing(true)
  }

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false)
    setHasAnalyzed(true)
    setAnnotations(mockAnnotations)
  }

  const handleGenerateReport = () => {
    setShowReport(true)
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    console.log("Annotation clicked:", annotation)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Inspection</h1>
            <p className="text-gray-600">
              Upload product image and analyze compliance with Legal Metrology Rules
            </p>
          </div>
          {selectedImage && !hasAnalyzed && (
            <Button
              onClick={handleAnalyze}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Analyze Compliance
            </Button>
          )}
        </div>

        {/* Main Content - Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Image Upload */}
          <div className="lg:col-span-3">
            <ImageUploadPanel
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />
          </div>

          {/* Center Panel - Image Viewer */}
          <div className="lg:col-span-6">
            <ImageViewer
              image={selectedImage}
              annotations={hasAnalyzed ? annotations : []}
              onAnnotationClick={handleAnnotationClick}
            />
          </div>

          {/* Right Panel - Compliance Analysis */}
          <div className="lg:col-span-3">
            <ComplianceAnalysisPanel
              hasAnalyzed={hasAnalyzed}
              complianceScore={complianceScore}
              onGenerateReport={handleGenerateReport}
            />
          </div>
        </div>

        {/* Compliance Report Modal */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Compliance Report</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReport(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Product Name</p>
                      <p className="font-medium text-gray-900">Sample Product</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">Food & Beverages</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inspection ID</p>
                      <p className="font-medium text-gray-900">INS-2024-006</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inspection Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Overall Compliance Score
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on Legal Metrology (Packaged Commodities) Rules, 2011
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      {complianceScore}%
                    </div>
                  </div>
                </div>

                {/* Detected Text */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detected Text</h3>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`Net Wt: 500g
MFD: 15/01/2024
Best Before: 15/01/2025
Manufacturer: ABC Foods Pvt Ltd
Address: 123 Industrial Area, Mumbai`}
                    </pre>
                  </div>
                </div>

                {/* Rule Violations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rule Violations</h3>
                  <div className="space-y-3">
                    {mockAnnotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="p-4 rounded-lg border border-red-200 bg-red-50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {annotation.label}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {annotation.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            annotation.type === "violation" ? "bg-danger text-white" : "bg-warning text-white"
                          }`}>
                            {annotation.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-white">1</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Display Maximum Retail Price (MRP) in bold letters as per Rule 6 of
                        Legal Metrology (Packaged Commodities) Rules, 2011
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-white">2</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Include complete manufacturer name and address as per Rule 5
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-white">3</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Increase font size to minimum 1.2mm height for mandatory declarations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowReport(false)}>
                    Close
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Analysis Overlay */}
        <AIAnalysisOverlay
          isOpen={isAnalyzing}
          onComplete={handleAnalysisComplete}
        />
      </div>
    </MainLayout>
  )
}
