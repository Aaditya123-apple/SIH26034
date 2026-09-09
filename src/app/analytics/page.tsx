"use client"

import * as React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
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

// Mock data for analytics charts
const categoryComplianceData = [
  { category: "Dairy", compliant: 450, partially: 35, nonCompliant: 15 },
  { category: "Food", compliant: 890, partially: 120, nonCompliant: 45 },
  { category: "Personal Care", compliant: 320, partially: 50, nonCompliant: 20 },
  { category: "Household", compliant: 280, partially: 40, nonCompliant: 18 },
  { category: "Beverages", compliant: 210, partially: 30, nonCompliant: 12 },
]

const monthlyTrendData = [
  { month: "Jan", inspections: 1200, violations: 98, avgScore: 89.2 },
  { month: "Feb", inspections: 1350, violations: 112, avgScore: 90.1 },
  { month: "Mar", inspections: 1480, violations: 125, avgScore: 89.8 },
  { month: "Apr", inspections: 1420, violations: 118, avgScore: 91.2 },
  { month: "May", inspections: 1650, violations: 142, avgScore: 90.8 },
  { month: "Jun", inspections: 1890, violations: 156, avgScore: 91.5 },
  { month: "Jul", inspections: 2100, violations: 178, avgScore: 92.1 },
  { month: "Aug", inspections: 1950, violations: 165, avgScore: 91.8 },
  { month: "Sep", inspections: 2200, violations: 185, avgScore: 92.5 },
  { month: "Oct", inspections: 2400, violations: 198, avgScore: 93.1 },
  { month: "Nov", inspections: 2350, violations: 192, avgScore: 92.8 },
  { month: "Dec", inspections: 2600, violations: 215, avgScore: 91.8 },
]

const violationTypeData = [
  { name: "MRP Issues", value: 35, color: "#DC2626" },
  { name: "Font Size", value: 25, color: "#F59E0B" },
  { name: "Manufacturer", value: 18, color: "#16A34A" },
  { name: "Net Quantity", value: 12, color: "#0F4C81" },
  { name: "Date Issues", value: 6, color: "#1E3A8A" },
  { name: "Consumer Care", value: 4, color: "#6B7280" },
]

const officerPerformanceData = [
  { officer: "Sharma", inspections: 2450, avgScore: 92.5, violations: 145 },
  { officer: "Patel", inspections: 2100, avgScore: 91.8, violations: 168 },
  { officer: "Singh", inspections: 1980, avgScore: 93.2, violations: 125 },
  { officer: "Kumar", inspections: 1850, avgScore: 90.5, violations: 195 },
  { officer: "Verma", inspections: 1750, avgScore: 91.0, violations: 178 },
]

const regionalData = [
  { region: "North", inspections: 4200, complianceRate: 92.1 },
  { region: "South", inspections: 3800, complianceRate: 93.5 },
  { region: "East", inspections: 3500, complianceRate: 90.8 },
  { region: "West", inspections: 4100, complianceRate: 91.2 },
  { region: "Central", inspections: 2823, complianceRate: 89.5 },
]

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Comprehensive insights and trends from compliance inspections
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Inspections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">18,423</div>
              <p className="text-xs text-success mt-1">+12.5% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">91.8%</div>
              <p className="text-xs text-success mt-1">+2.3% improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2,164</div>
              <p className="text-xs text-success mt-1">-5.2% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Officers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">156</div>
              <p className="text-xs text-gray-500 mt-1">Across 5 regions</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Inspection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="inspections"
                  stroke="#0F4C81"
                  fill="#0F4C81"
                  fillOpacity={0.3}
                  name="Inspections"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#16A34A"
                  strokeWidth={2}
                  name="Avg Score (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Compliance and Violation Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryComplianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="compliant" stackId="a" fill="#16A34A" name="Compliant" />
                  <Bar dataKey="partially" stackId="a" fill="#F59E0B" name="Partially" />
                  <Bar dataKey="nonCompliant" stackId="a" fill="#DC2626" name="Non-Compliant" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Violation Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={violationTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {violationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Officer Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Officer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={officerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="officer" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="inspections" fill="#0F4C81" name="Inspections" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#16A34A"
                  strokeWidth={2}
                  name="Avg Score (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={regionalData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="region" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="inspections" fill="#0F4C81" name="Inspections" />
                <Bar dataKey="complianceRate" fill="#16A34A" name="Compliance Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
