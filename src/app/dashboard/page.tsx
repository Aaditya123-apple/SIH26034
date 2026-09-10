import Link from "next/link"
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Plus, ScanLine } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { demoInspectionResult } from "@/lib/demo-inspection"

const recentInspections = [
  { product: "Harvest Gold Basmati Rice", id: "LM-2026-000128", status: "Non-Compliant", date: "10 Sep 2026", score: 78 },
  { product: "AshaCare Herbal Shampoo", id: "LM-2026-000127", status: "Compliant", date: "09 Sep 2026", score: 96 },
  { product: "Sunrise Premium Biscuits", id: "LM-2026-000126", status: "Partially Compliant", date: "09 Sep 2026", score: 84 },
]

function statusVariant(status: string) {
  if (status === "Compliant") return "success" as const
  if (status === "Partially Compliant") return "warning" as const
  return "destructive" as const
}

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-xl md:flex-row md:items-end md:justify-between md:px-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              <ScanLine className="h-4 w-4" />
              Evidence-backed inspection
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Legal Metrology AI</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Turn package images into structured declarations, rule checks, visual evidence, and an auditable report.
            </p>
          </div>
          <Button asChild size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
            <Link href="/inspections/new">
              <Plus className="mr-2 h-5 w-5" />
              New inspection
            </Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Products scanned</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">128</p>
                <p className="mt-1 text-xs text-slate-500">Across 42 inspections</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><ClipboardCheck className="h-5 w-5" /></div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Compliant</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">91</p>
                <p className="mt-1 text-xs text-slate-500">71% of scanned products</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Needs review</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">37</p>
                <p className="mt-1 text-xs text-slate-500">With evidence attached</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-3 text-rose-700"><AlertTriangle className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent inspections</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Latest evidence-backed product checks</p>
              </div>
              <Link href="/reports" className="text-sm font-semibold text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentInspections.map((inspection) => (
                  <Link key={inspection.id} href={inspection.id === demoInspectionResult.report.id ? "/inspections/new?demo=result" : "/reports"} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{inspection.product}</p>
                      <p className="mt-1 text-xs text-slate-500">{inspection.id} · {inspection.date}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-sm font-bold text-slate-700">{inspection.score}%</span>
                      <Badge variant={statusVariant(inspection.status)}>{inspection.status}</Badge>
                      <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5 text-amber-700" />Presentation demo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-700">Use the synthetic rice package to demonstrate the complete inspection loop without depending on a live OCR service.</p>
              <Button asChild variant="outline" className="mt-5 border-amber-300 bg-white hover:bg-amber-100">
                <Link href="/inspections/new?demo=ready">Open demo inspection</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  )
}
