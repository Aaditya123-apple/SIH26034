"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { 
  Factory, 
  MapPin, 
  Calendar,
  Truck,
  Building,
  Filter
} from "lucide-react"

interface FactoryData {
  id: string
  factoryName: string
  city: string
  region: string
  productsManufactured: number
  complianceRate: number
  lastInspection: string
  destinations: string[]
  violations: number
}

const mockFactoryData: FactoryData[] = [
  {
    id: "FAC-001",
    factoryName: "Amul Dairy Plant",
    city: "Anand",
    region: "Gujarat",
    productsManufactured: 1500,
    complianceRate: 95,
    lastInspection: "2024-01-15",
    destinations: ["Mumbai", "Delhi", "Bangalore"],
    violations: 2
  },
  {
    id: "FAC-002",
    factoryName: "Nestle India Ltd",
    city: "Moga",
    region: "Punjab",
    productsManufactured: 2300,
    complianceRate: 88,
    lastInspection: "2024-01-14",
    destinations: ["Delhi", "Chennai", "Kolkata"],
    violations: 8
  },
  {
    id: "FAC-003",
    factoryName: "Colgate Palmolive India",
    city: "Baddi",
    region: "Himachal Pradesh",
    productsManufactured: 1800,
    complianceRate: 92,
    lastInspection: "2024-01-13",
    destinations: ["Chennai", "Hyderabad", "Mumbai"],
    violations: 5
  },
  {
    id: "FAC-004",
    factoryName: "Tata Chemicals",
    city: "Mithapur",
    region: "Gujarat",
    productsManufactured: 2100,
    complianceRate: 94,
    lastInspection: "2024-01-12",
    destinations: ["Kolkata", "Delhi", "Ahmedabad"],
    violations: 3
  },
  {
    id: "FAC-005",
    factoryName: "HUL Manufacturing Unit",
    city: "Kolkata",
    region: "West Bengal",
    productsManufactured: 3200,
    complianceRate: 78,
    lastInspection: "2024-01-11",
    destinations: ["Bangalore", "Mumbai", "Chennai", "Delhi"],
    violations: 15
  }
]

export default function FactoriesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Factory Tracking</h1>
            <p className="text-slate-600">
              Monitor manufacturing facilities and compliance across regions
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Factories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockFactoryData.length}</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg Compliance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(mockFactoryData.reduce((acc, f) => acc + f.complianceRate, 0) / mockFactoryData.length).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {mockFactoryData.reduce((acc, f) => acc + f.productsManufactured, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Active Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockFactoryData.reduce((acc, f) => acc + f.violations, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Region Overview */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-slate-600" />
              Regional Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {["Gujarat", "Punjab", "Himachal Pradesh", "West Bengal"].map((region) => {
                const regionFactories = mockFactoryData.filter(f => f.region === region)
                const avgCompliance = regionFactories.length > 0
                  ? regionFactories.reduce((acc, f) => acc + f.complianceRate, 0) / regionFactories.length
                  : 0
                
                return (
                  <div key={region} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{region}</h4>
                      <Badge variant="outline">{regionFactories.length} factories</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Avg Compliance</span>
                        <span className="font-medium text-slate-900">{avgCompliance.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Products</span>
                        <span className="font-medium text-slate-900">
                          {regionFactories.reduce((acc, f) => acc + f.productsManufactured, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Factory Details Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Factory className="h-5 w-5 mr-2 text-slate-600" />
              Factory Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Factory ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Factory Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      City
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Region
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Products
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Compliance
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Violations
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                      Destinations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockFactoryData.map((factory) => (
                    <tr
                      key={factory.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4 text-sm text-slate-900 font-medium">
                        {factory.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {factory.factoryName}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {factory.city}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        {factory.region}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-900 font-medium">
                        {factory.productsManufactured.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                factory.complianceRate >= 90
                                  ? "bg-green-500"
                                  : factory.complianceRate >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${factory.complianceRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {factory.complianceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={factory.violations > 10 ? "destructive" : factory.violations > 5 ? "warning" : "success"}
                        >
                          {factory.violations}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {factory.destinations.slice(0, 2).map((dest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {dest}
                            </Badge>
                          ))}
                          {factory.destinations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{factory.destinations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Visualization */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-slate-600" />
              Supply Chain Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFactoryData.slice(0, 3).map((factory) => (
                <div key={factory.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">{factory.factoryName}</p>
                        <p className="text-sm text-slate-600">{factory.city}, {factory.region}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{factory.productsManufactured} products</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last inspection: {factory.lastInspection}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-900 mb-2">Destinations:</p>
                    <div className="flex flex-wrap gap-2">
                      {factory.destinations.map((dest, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-slate-400" />
                          <span className="text-sm text-slate-700">{dest}</span>
                        </div>
                      ))}
                    </div>
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
