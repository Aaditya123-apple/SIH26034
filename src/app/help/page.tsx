"use client"

import * as React from "react"
import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  FileText, 
  Video, 
  MessageCircle, 
  Phone,
  Mail,
  ChevronRight,
  BookOpen,
  AlertCircle
} from "lucide-react"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I upload a product image for inspection?",
        a: "Navigate to the New Inspection page, click on the upload area in the left panel. You can drag and drop an image, browse files, or capture using camera. Ensure the image is clear and shows the product label properly."
      },
      {
        q: "What image formats are supported?",
        a: "We support JPG, PNG, and WEBP formats. The recommended minimum resolution is 800x600 pixels, and maximum file size is 10MB."
      },
      {
        q: "How long does the AI analysis take?",
        a: "The AI analysis typically takes 3-5 seconds to complete, depending on the image complexity and server load. You'll see a progress indicator during the process."
      }
    ]
  },
  {
    category: "Compliance Rules",
    questions: [
      {
        q: "What are the Legal Metrology (Packaged Commodities) Rules, 2011?",
        a: "These are government regulations that mandate specific information to be displayed on packaged commodities, including MRP, net quantity, manufacturer details, manufacturing date, and consumer care information."
      },
      {
        q: "What is the minimum font size requirement?",
        a: "As per the rules, the font size for mandatory declarations should not be less than 1.2mm in height for general packages and specific sizes for different package categories."
      },
      {
        q: "What information must be displayed on product labels?",
        a: "Mandatory information includes: Maximum Retail Price (MRP), Net Quantity, Name of Commodity, Manufacturer Name & Address, Manufacturing/Packaging Date, Best Before/Expiry Date, and Consumer Care Details."
      }
    ]
  },
  {
    category: "Reports & Analytics",
    questions: [
      {
        q: "How do I generate a compliance report?",
        a: "After completing an inspection, click the 'Generate Compliance Report' button in the right panel. You can view the report, download as PDF, or export the data."
      },
      {
        q: "Can I access historical inspection data?",
        a: "Yes, navigate to the Reports section to view all your past inspections. You can filter by date, category, compliance status, and search for specific products."
      },
      {
        q: "How are compliance scores calculated?",
        a: "Compliance scores are calculated based on the presence and correctness of mandatory label elements. Each element has a weight, and violations reduce the overall score."
      }
    ]
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click on 'Forgot password' on the login page or go to Settings > Security > Change Password. Follow the instructions to reset your password."
      },
      {
        q: "Is two-factor authentication available?",
        a: "Yes, you can enable two-factor authentication in Settings > Security. We recommend enabling it for enhanced account security."
      },
      {
        q: "How do I update my profile information?",
        a: "Go to Settings > Profile to update your name, email, phone number, and region. Changes are saved immediately."
      }
    ]
  }
]

const videoTutorials = [
  {
    title: "Getting Started with the Platform",
    duration: "5:30",
    category: "Basics"
  },
  {
    title: "Uploading and Analyzing Product Images",
    duration: "8:15",
    category: "Inspection"
  },
  {
    title: "Understanding Compliance Reports",
    duration: "6:45",
    category: "Reports"
  },
  {
    title: "Using Analytics Dashboard",
    duration: "7:20",
    category: "Analytics"
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState("Getting Started")

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600">
            Find answers, tutorials, and support resources
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for help articles, FAQs, tutorials..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFAQs.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.questions.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <button
                          className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            // In a real implementation, this would expand/collapse
                            console.log("Toggle FAQ:", item.q)
                          }}
                        >
                          <span className="font-medium text-gray-900 text-sm">{item.q}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                        <div className="pl-4 text-sm text-gray-600">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {videoTutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">{tutorial.category}</Badge>
                        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{tutorial.duration}</span>
                      <Button variant="outline" size="sm">
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guides and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-medium text-gray-900">User Manual</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium text-gray-900">Legal Metrology Rules Reference</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium text-gray-900">API Documentation</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Call us for immediate assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">1800-XXX-XXXX</p>
                  <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9AM-6PM IST</p>
                  <Button className="w-full mt-4">Call Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Send us a detailed query</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">support@legalmetrology.gov.in</p>
                  <p className="text-sm text-gray-600 mt-1">Response within 24 hours</p>
                  <Button className="w-full mt-4">Send Email</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mt-1">Available 24/7 for urgent issues</p>
                  <Button className="w-full mt-4">Start Chat</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  For complex issues, submit a detailed support ticket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Technical Issue</option>
                    <option>Account Access</option>
                    <option>Compliance Question</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px]"
                    placeholder="Provide detailed information about your issue..."
                  />
                </div>
                <Button className="w-full">Submit Ticket</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Platform Status</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">AI Analysis Service</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Database</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Report Generation</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">API Services</span>
                    <Badge variant="warning">Degraded</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Incidents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">API Degradation</p>
                        <p className="text-xs text-gray-600 mt-1">Some API endpoints experiencing delays - being investigated</p>
                        <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 rounded-full bg-success flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Scheduled Maintenance</p>
                        <p className="text-xs text-gray-600 mt-1">Completed successfully - All systems operational</p>
                        <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-600">Platform Version</p>
                    <p className="text-lg font-semibold text-gray-900">v2.4.1</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">Jan 15, 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Maintenance</p>
                    <p className="text-lg font-semibold text-gray-900">Feb 1, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
