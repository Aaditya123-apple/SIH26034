"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Save
} from "lucide-react"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">
            Configure system preferences and notification settings
          </p>
        </div>

        {/* Notification Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-slate-600" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive email alerts for new violations</p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-600">Receive push notifications on your device</p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Daily Reports</p>
                <p className="text-sm text-slate-600">Receive daily summary reports</p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-slate-600" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" className="w-full max-w-xs" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">Add an extra layer of security</p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-slate-600" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention Period (days)</Label>
              <Input id="data-retention" type="number" defaultValue="365" className="w-full max-w-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <select id="backup-frequency" className="w-full max-w-xs h-10 px-3 rounded-md border border-slate-300">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <Button variant="outline" className="mr-2">
                Export Data
              </Button>
              <Button variant="destructive">
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-slate-600" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select id="timezone" className="w-full max-w-xs h-10 px-3 rounded-md border border-slate-300">
                <option value="asia/kolkata">Asia/Kolkata (IST)</option>
                <option value="asia/dubai">Asia/Dubai (GST)</option>
                <option value="utc">UTC</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select id="language" className="w-full max-w-xs h-10 px-3 rounded-md border border-slate-300">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
