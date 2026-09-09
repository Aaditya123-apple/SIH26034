"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { Upload, Camera, FileImage, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImageUploadPanelProps {
  onImageSelect: (image: string) => void
  selectedImage: string | null
}

const recentUploads = [
  { id: 1, name: "product_001.jpg", date: "2 hours ago", url: "/uploads/product_001.jpg" },
  { id: 2, name: "package_002.jpg", date: "5 hours ago", url: "/uploads/package_002.jpg" },
  { id: 3, name: "label_003.jpg", date: "1 day ago", url: "/uploads/label_003.jpg" },
]

export function ImageUploadPanel({ onImageSelect, selectedImage }: ImageUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // In a real implementation, this would open the camera
    alert("Camera capture would be implemented here")
  }

  const handleClearImage = () => {
    onImageSelect("")
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload Product Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Uploaded product"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleClearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">Image uploaded successfully</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drag and drop your product image here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or use one of the options below
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCameraCapture}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        {/* Recent Uploads */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Recent Uploads</h3>
          <div className="space-y-2">
            {recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onImageSelect(upload.url)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                    <FileImage className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {upload.name}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{upload.date}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Upload Guidelines
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Ensure clear image of product label</li>
            <li>• Minimum resolution: 800x600 pixels</li>
            <li>• Supported formats: JPG, PNG, WEBP</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
