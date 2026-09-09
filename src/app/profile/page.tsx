"use client"

import * as React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Shield
} from "lucide-react"

export default function ProfilePage() {
  const officerData = {
    name: "Officer Sharma",
    employeeId: "LM-2024-001",
    email: "officer.sharma@legalmetrology.gov.in",
    phone: "+91 98765 43210",
    region: "North Zone",
    designation: "Senior Inspector",
    department: "Legal Metrology",
    joiningDate: "15 March 2020",
    totalInspections: 2450,
    avgComplianceScore: 92.5,
    certifications: ["Legal Metrology Certified", "Advanced Inspection Training"],
    achievements: [
      "Best Inspector Award 2023",
      "1000 Inspections Milestone",
      "Zero Error Quarter Q3 2023"
    ]
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            View your profile information and performance metrics
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Officer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">{officerData.name}</h2>
                    <p className="text-sm text-gray-600">{officerData.designation}</p>
                    <Badge variant="outline" className="mt-2">
                      {officerData.employeeId}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{officerData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{officerData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{officerData.region}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Department Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Department</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department</span>
                      <span className="text-gray-900 font-medium">{officerData.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joining Date</span>
                      <span className="text-gray-900 font-medium">{officerData.joiningDate}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Inspections</p>
                        <p className="text-2xl font-bold text-gray-900">{officerData.totalInspections}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Compliance Score</p>
                        <p className="text-2xl font-bold text-gray-900">{officerData.avgComplianceScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officerData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officerData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-warning" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Completed inspection of Amul Taaza Milk
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-success mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Generated compliance report for Nestle Maggi
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-warning mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Updated profile information
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
