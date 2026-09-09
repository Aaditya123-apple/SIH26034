"use client"

import * as React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  MoreVertical,
  Eye,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockReports = [
  {
    id: "RPT-2024-001",
    productName: "Amul Taaza Milk",
    inspectionId: "INS-2024-001",
    complianceScore: 95,
    status: "Compliant",
    date: "2024-01-15",
    officer: "Officer Sharma",
    category: "Dairy",
  },
  {
    id: "RPT-2024-002",
    productName: "Nestle Maggi Noodles",
    inspectionId: "INS-2024-002",
    complianceScore: 78,
    status: "Partially Compliant",
    date: "2024-01-15",
    officer: "Officer Patel",
    category: "Food",
  },
  {
    id: "RPT-2024-003",
    productName: "Colgate Toothpaste",
    inspectionId: "INS-2024-003",
    complianceScore: 88,
    status: "Compliant",
    date: "2024-01-14",
    officer: "Officer Singh",
    category: "Personal Care",
  },
  {
    id: "RPT-2024-004",
    productName: "Tata Salt",
    inspectionId: "INS-2024-004",
    complianceScore: 92,
    status: "Compliant",
    date: "2024-01-14",
    officer: "Officer Kumar",
    category: "Food",
  },
  {
    id: "RPT-2024-005",
    productName: "Surf Excel Detergent",
    inspectionId: "INS-2024-005",
    complianceScore: 65,
    status: "Non-Compliant",
    date: "2024-01-13",
    officer: "Officer Sharma",
    category: "Household",
  },
  {
    id: "RPT-2024-006",
    productName: "Horlicks Health Drink",
    inspectionId: "INS-2024-006",
    complianceScore: 85,
    status: "Partially Compliant",
    date: "2024-01-12",
    officer: "Officer Patel",
    category: "Food",
  },
  {
    id: "RPT-2024-007",
    productName: "Dettol Hand Wash",
    inspectionId: "INS-2024-007",
    complianceScore: 98,
    status: "Compliant",
    date: "2024-01-11",
    officer: "Officer Singh",
    category: "Personal Care",
  },
  {
    id: "RPT-2024-008",
    productName: "Parle-G Biscuits",
    inspectionId: "INS-2024-008",
    complianceScore: 90,
    status: "Compliant",
    date: "2024-01-10",
    officer: "Officer Kumar",
    category: "Food",
  },
]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = 
      report.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.inspectionId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      selectedCategory === "all" || report.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "Dairy", "Food", "Personal Care", "Household"]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">
              View and manage compliance inspection reports
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">17,310</div>
              <p className="text-xs text-gray-500 mt-1">+8.7% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">14,256</div>
              <p className="text-xs text-gray-500 mt-1">82.3% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Partially Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">2,145</div>
              <p className="text-xs text-gray-500 mt-1">12.4% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Non-Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">909</div>
              <p className="text-xs text-gray-500 mt-1">5.3% of total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search reports by product name, ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Report ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Inspection ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Compliance Score
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Officer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {report.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {report.productName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {report.inspectionId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {report.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {report.complianceScore}%
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {report.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {report.officer}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-danger">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
