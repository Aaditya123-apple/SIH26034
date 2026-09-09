"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  Scan, 
  FileText, 
  CheckCircle, 
  Scale, 
  FileCheck, 
  Award,
  X
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AIAnalysisOverlayProps {
  isOpen: boolean
  onComplete: () => void
}

const analysisSteps = [
  {
    id: 1,
    title: "Uploading Image",
    description: "Processing product image for analysis",
    icon: Upload,
    duration: 1500,
  },
  {
    id: 2,
    title: "Detecting Package Regions",
    description: "Identifying label areas and packaging zones",
    icon: Scan,
    duration: 2000,
  },
  {
    id: 3,
    title: "OCR Extraction",
    description: "Extracting text from product labels",
    icon: FileText,
    duration: 2500,
  },
  {
    id: 4,
    title: "Extracting Label Information",
    description: "Parsing MRP, manufacturer, and product details",
    icon: FileText,
    duration: 2000,
  },
  {
    id: 5,
    title: "Checking Legal Metrology Rules",
    description: "Validating against Legal Metrology (Packaged Commodities) Rules, 2011",
    icon: Scale,
    duration: 2500,
  },
  {
    id: 6,
    title: "Validating Font Sizes",
    description: "Ensuring minimum font size requirements",
    icon: FileText,
    duration: 2000,
  },
  {
    id: 7,
    title: "Generating Compliance Report",
    description: "Creating detailed violation analysis",
    icon: FileCheck,
    duration: 2000,
  },
  {
    id: 8,
    title: "Producing Final Score",
    description: "Calculating overall compliance score",
    icon: Award,
    duration: 1500,
  },
]

export function AIAnalysisOverlay({ isOpen, onComplete }: AIAnalysisOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let stepIndex = 0
    let stepProgress = 0
    let animationFrame: number

    const animate = () => {
      if (stepIndex >= analysisSteps.length) {
        onComplete()
        return
      }

      stepProgress += 16 // ~60fps
      const stepDuration = analysisSteps[stepIndex].duration
      const stepProgressPercent = (stepProgress / stepDuration) * 100

      if (stepProgress >= stepDuration) {
        stepIndex++
        stepProgress = 0
        setCurrentStep(stepIndex)
      }

      const totalProgress = ((stepIndex * 100) + stepProgressPercent) / analysisSteps.length
      setProgress(Math.min(totalProgress, 100))

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl p-8 bg-white shadow-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900"
            >
              AI-Powered Compliance Analysis
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Analyzing product label against Legal Metrology Rules
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            {currentStep < analysisSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-200"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  {React.createElement(analysisSteps[currentStep].icon, {
                    className: "h-8 w-8 text-primary",
                  })}
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {analysisSteps[currentStep].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {analysisSteps[currentStep].description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Steps Overview */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Analysis Steps</h4>
            <div className="space-y-2">
              {analysisSteps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isCompleted
                        ? "bg-green-50"
                        : isCurrent
                        ? "bg-blue-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-success"
                          : isCurrent
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs font-medium text-white">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "text-gray-700 line-through"
                            : isCurrent
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {isCurrent && (
                      <motion.div
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // Handle cancel - would need to pass this up
                console.log("Analysis cancelled")
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Analysis
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
