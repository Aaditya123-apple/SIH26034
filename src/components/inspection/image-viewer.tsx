"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface ImageViewerProps {
  image: string | null
  annotations?: Annotation[]
  onAnnotationClick?: (annotation: Annotation) => void
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

export function ImageViewer({ 
  image, 
  annotations = mockAnnotations,
  onAnnotationClick 
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<Annotation | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation)
    onAnnotationClick?.(annotation)
  }

  const getAnnotationColor = (type: Annotation["type"]) => {
    switch (type) {
      case "violation":
        return "#DC2626"
      case "warning":
        return "#F59E0B"
      case "info":
        return "#16A34A"
      default:
        return "#0F4C81"
    }
  }

  if (!image) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Image Viewer</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No image selected</p>
            <p className="text-sm mt-2">Upload a product image to begin analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Image Viewer</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetZoom}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-gray-100 cursor-move"
          style={{ height: isFullscreen ? 'calc(100vh - 80px)' : '500px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Product image"
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
            
            {/* Annotation Overlays */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`,
                  width: `${annotation.width}%`,
                  height: `${annotation.height}%`,
                  border: `3px solid ${getAnnotationColor(annotation.type)}`,
                  backgroundColor: `${getAnnotationColor(annotation.type)}20`,
                  transition: 'all 0.2s',
                }}
                onClick={() => handleAnnotationClick(annotation)}
                onMouseEnter={() => setHoveredAnnotation(annotation)}
                onMouseLeave={() => setHoveredAnnotation(null)}
              >
                {/* Tooltip */}
                {hoveredAnnotation?.id === annotation.id && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {annotation.label}
                  </div>
                )}
                
                {/* Label */}
                <div className="absolute -top-6 left-0 bg-white px-2 py-0.5 rounded text-xs font-medium shadow-sm">
                  {annotation.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Annotation Legend */}
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Violation Legend</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-danger bg-danger/20"></div>
              <span className="text-xs text-gray-700">Violation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-warning bg-warning/20"></div>
              <span className="text-xs text-gray-700">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded border-2 border-success bg-success/20"></div>
              <span className="text-xs text-gray-700">Info</span>
            </div>
          </div>
        </div>

        {/* Selected Annotation Details */}
        {selectedAnnotation && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {selectedAnnotation.label}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedAnnotation.description}
                </p>
              </div>
              <Badge
                variant={
                  selectedAnnotation.type === "violation"
                    ? "destructive"
                    : selectedAnnotation.type === "warning"
                    ? "warning"
                    : "success"
                }
              >
                {selectedAnnotation.type}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
