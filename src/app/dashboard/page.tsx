"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ScanLine,
} from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { fetchDashboardOverview, simulateDetection } from "@/lib/api";

function statusVariant(status: string) {
  if (status === "Compliant") return "success" as const;
  if (status === "Partially Compliant") return "warning" as const;
  return "destructive" as const;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_inspections: 0,
    pass_count: 0,
    violation_count: 0,
    warning_count: 0,
    review_count: 0,
    compliance_rate: 0,
  });
  const [recentInspections, setRecentInspections] = useState<
    Array<{
      product: string;
      id: string;
      status: string;
      date: string;
      score: number;
    }>
  >([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const refreshDashboard = async () => {
    try {
      const overview = await fetchDashboardOverview();
      setStats(overview.stats);
      setRecentInspections(
        overview.reports.slice(0, 3).map((report) => ({
          product: report.productName,
          id: report.id,
          status: report.status,
          date: report.date,
          score: report.complianceScore,
        })),
      );
    } catch {
      setRecentInspections([]);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleSimulateDetection = async () => {
    setIsSimulating(true);

    try {
      const productNames = [
        "Aashirvaad Atta",
        "Milky Mist Milk",
        "Parle Premium Biscuit",
        "Saffola Gold Oil",
        "Johnson & Johnson Baby Powder",
      ];
      const chosenProduct =
        productNames[Math.floor(Math.random() * productNames.length)];
      await simulateDetection({
        product_id: `PROD-${Date.now()}`,
        product_name: chosenProduct,
        confidence: 0.96,
        source: "cnn",
        category: "Food",
        manufacturer: "Demo Manufacturer Pvt Ltd",
        country_of_origin: "India",
        images: ["demo-image.jpg"],
      });
      await refreshDashboard();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-xl md:flex-row md:items-end md:justify-between md:px-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              <ScanLine className="h-4 w-4" />
              Evidence-backed compliance
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Legal Metrology AI
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Automated detections, OCR extraction, rule evaluation, and
              explainable compliance evidence for packaged commodities.
            </p>
          </div>
          <Button
            onClick={handleSimulateDetection}
            disabled={isSimulating}
            className="bg-amber-400 text-slate-950 hover:bg-amber-300"
          >
            {isSimulating ? "Simulating..." : "Simulate Detection"}
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total inspections
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {stats.total_inspections}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  CNN detection feed
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Compliance rate
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {stats.compliance_rate.toFixed(1)}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {stats.pass_count} passed
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Needs review
                </p>
                <p className="mt-2 text-3xl font-bold text-rose-600">
                  {stats.review_count + stats.violation_count}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Rule violations and review items
                </p>
              </div>
              <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent inspections</CardTitle>
                <p className="mt-1 text-sm text-slate-500">
                  Live event stream from the automated detection pipeline
                </p>
              </div>
              <Link
                href="/reports"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentInspections.length === 0 ? (
                  <div className="px-6 py-6 text-sm text-slate-500">
                    No recent inspections yet. Trigger a demo detection to
                    create one.
                  </div>
                ) : (
                  recentInspections.map((inspection) => (
                    <Link
                      key={inspection.id}
                      href="/reports"
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {inspection.product}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {inspection.id} · {inspection.date}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">
                          {inspection.score}%
                        </span>
                        <Badge variant={statusVariant(inspection.status)}>
                          {inspection.status}
                        </Badge>
                        <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-amber-300" />
                Automatic detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                CNN detection active
              </div>
              <p className="text-sm leading-6 text-slate-300">
                The backend simulates a real product detection event, then runs
                OCR, declaration extraction, rule checks, evidence generation,
                and report creation automatically.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}
