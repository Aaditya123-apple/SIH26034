"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for charts
const monthlyInspectionData = [
  { month: "Jan", inspections: 1200, violations: 98 },
  { month: "Feb", inspections: 1350, violations: 112 },
  { month: "Mar", inspections: 1480, violations: 125 },
  { month: "Apr", inspections: 1420, violations: 118 },
  { month: "May", inspections: 1650, violations: 142 },
  { month: "Jun", inspections: 1890, violations: 156 },
  { month: "Jul", inspections: 2100, violations: 178 },
  { month: "Aug", inspections: 1950, violations: 165 },
  { month: "Sep", inspections: 2200, violations: 185 },
  { month: "Oct", inspections: 2400, violations: 198 },
  { month: "Nov", inspections: 2350, violations: 192 },
  { month: "Dec", inspections: 2600, violations: 215 },
]

const complianceTrendData = [
  { month: "Jan", compliance: 89.2 },
  { month: "Feb", compliance: 90.1 },
  { month: "Mar", compliance: 89.8 },
  { month: "Apr", compliance: 91.2 },
  { month: "May", compliance: 90.8 },
  { month: "Jun", compliance: 91.5 },
  { month: "Jul", compliance: 92.1 },
  { month: "Aug", compliance: 91.8 },
  { month: "Sep", compliance: 92.5 },
  { month: "Oct", compliance: 93.1 },
  { month: "Nov", compliance: 92.8 },
  { month: "Dec", compliance: 91.8 },
]

const violationDistributionData = [
  { name: "MRP Issues", value: 35, color: "#DC2626" },
  { name: "Font Size Issues", value: 25, color: "#F59E0B" },
  { name: "Manufacturer Missing", value: 18, color: "#16A34A" },
  { name: "Net Quantity Missing", value: 12, color: "#0F4C81" },
  { name: "Date Missing", value: 6, color: "#1E3A8A" },
  { name: "Consumer Care Missing", value: 4, color: "#6B7280" },
]

const recentInspections = [
  {
    id: "INS-2024-001",
    productName: "Amul Taaza Milk",
    category: "Dairy",
    complianceScore: 95,
    status: "Compliant",
    date: "2024-01-15",
    officer: "Officer Sharma",
  },
  {
    id: "INS-2024-002",
    productName: "Nestle Maggi Noodles",
    category: "Food",
    complianceScore: 78,
    status: "Partially Compliant",
    date: "2024-01-15",
    officer: "Officer Patel",
  },
  {
    id: "INS-2024-003",
    productName: "Colgate Toothpaste",
    category: "Personal Care",
    complianceScore: 88,
    status: "Compliant",
    date: "2024-01-14",
    officer: "Officer Singh",
  },
  {
    id: "INS-2024-004",
    productName: "Tata Salt",
    category: "Food",
    complianceScore: 92,
    status: "Compliant",
    date: "2024-01-14",
    officer: "Officer Kumar",
  },
  {
    id: "INS-2024-005",
    productName: "Surf Excel Detergent",
    category: "Household",
    complianceScore: 65,
    status: "Non-Compliant",
    date: "2024-01-13",
    officer: "Officer Sharma",
  },
]

const kpiData = [
  {
    title: "Total Inspections",
    value: "18,423",
    change: "+12.5%",
    trend: "up",
    icon: LayoutDashboard,
    color: "bg-primary",
  },
  {
    title: "Compliance Rate",
    value: "91.8%",
    change: "+2.3%",
    trend: "up",
    icon: Target,
    color: "bg-success",
  },
  {
    title: "Violations Detected",
    value: "2,164",
    change: "-5.2%",
    trend: "down",
    icon: AlertTriangle,
    color: "bg-danger",
  },
  {
    title: "Reports Generated",
    value: "17,310",
    change: "+8.7%",
    trend: "up",
    icon: FileText,
    color: "bg-secondary",
  },
  {
    title: "Avg Processing Time",
    value: "3.1 sec",
    change: "-15.3%",
    trend: "down",
    icon: Clock,
    color: "bg-warning",
  },
  {
    title: "Model Accuracy",
    value: "97.3%",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-primary",
  },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of inspection activities and compliance metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-lg ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-success mr-1" />
                  )}
                  <span className={kpi.trend === "up" ? "text-success" : "text-success"}>
                    {kpi.change}
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Monthly Inspection Volume */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Monthly Inspection Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyInspectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inspections"
                    stroke="#0F4C81"
                    strokeWidth={2}
                    name="Inspections"
                  />
                  <Line
                    type="monotone"
                    dataKey="violations"
                    stroke="#DC2626"
                    strokeWidth={2}
                    name="Violations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Violation Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Violation Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={violationDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {violationDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[85, 95]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="compliance"
                  stroke="#16A34A"
                  fill="#16A34A"
                  fillOpacity={0.3}
                  name="Compliance Rate (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Inspections Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Inspection ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Product Name
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
                  </tr>
                </thead>
                <tbody>
                  {recentInspections.map((inspection) => (
                    <tr
                      key={inspection.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {inspection.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {inspection.productName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {inspection.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {inspection.complianceScore}%
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            inspection.status === "Compliant"
                              ? "success"
                              : inspection.status === "Partially Compliant"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {inspection.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {inspection.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {inspection.officer}
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
