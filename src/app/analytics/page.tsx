"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Badge } from "@/components/ui"
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">
            Comprehensive compliance analysis and performance metrics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Total Inspections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">1,234</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Compliance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">87.5%</div>
              <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Violations Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">156</div>
              <p className="text-xs text-red-600 mt-1">-5% from last month</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">2.4h</div>
              <p className="text-xs text-green-600 mt-1">-15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Trend */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
              Compliance Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "Aug", rate: 82, color: "bg-blue-500" },
                { month: "Sep", rate: 84, color: "bg-blue-500" },
                { month: "Oct", rate: 85, color: "bg-blue-500" },
                { month: "Nov", rate: 86, color: "bg-blue-500" },
                { month: "Dec", rate: 87, color: "bg-blue-500" },
                { month: "Jan", rate: 87.5, color: "bg-green-500" },
              ].map((item) => (
                <div key={item.month} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-slate-700">{item.month}</div>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div
                      className={`${item.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm font-bold text-slate-900 text-right">{item.rate}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Violation Categories */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-slate-600" />
              Violation Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { category: "MRP Issues", count: 45, percentage: 29, color: "bg-red-500" },
                { category: "Font Size", count: 38, percentage: 24, color: "bg-orange-500" },
                { category: "Manufacturer Missing", count: 32, percentage: 21, color: "bg-yellow-500" },
                { category: "Date Missing", count: 25, percentage: 16, color: "bg-blue-500" },
                { category: "Net Quantity", count: 12, percentage: 8, color: "bg-green-500" },
                { category: "Consumer Care", count: 4, percentage: 2, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.category} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{item.category}</span>
                    <Badge variant="outline">{item.count} cases</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-slate-600" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "Gujarat", compliance: 92, factories: 45 },
                { region: "Maharashtra", compliance: 88, factories: 38 },
                { region: "Punjab", compliance: 85, factories: 32 },
                { region: "West Bengal", compliance: 82, factories: 28 },
                { region: "Tamil Nadu", compliance: 90, factories: 25 },
              ].map((item) => (
                <div key={item.region} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{item.region}</p>
                    <p className="text-sm text-slate-600">{item.factories} factories</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.compliance >= 90
                            ? "bg-green-500"
                            : item.compliance >= 85
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${item.compliance}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.compliance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
