"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleDashed,
  FileText,
  ImagePlus,
  Info,
  ScanLine,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { fetchInspection, submitInspection } from "@/lib/api"
import { inspectionSteps, type DemoInspectionResult, type FindingState } from "@/lib/demo-inspection"
import { downloadPDF } from "@/lib/pdf-generator"

function stateStyles(state: FindingState) {
  if (state === "pass") return { icon: CheckCircle2, color: "text-emerald-600", background: "bg-emerald-50 border-emerald-200" }
  if (state === "review") return { icon: AlertTriangle, color: "text-amber-600", background: "bg-amber-50 border-amber-200" }
  return { icon: ShieldAlert, color: "text-rose-600", background: "bg-rose-50 border-rose-200" }
}

export default function NewInspectionPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<DemoInspectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  const addFiles = (incoming: FileList | File[]) => {
    const images = Array.from(incoming).filter((file) => file.type.startsWith("image/"))
    setFiles((current) => [...current, ...images].slice(0, 6))
    setResult(null)
    setError(null)
  }

  const analyse = async () => {
    if (files.length === 0) return

    setIsAnalyzing(true)
    setResult(null)
    setError(null)
    setStepIndex(0)

    try {
      let job = await submitInspection(files)
      while (job.status === "queued" || job.status === "processing") {
        const progress = job.progress ?? 0
        setStepIndex(Math.min(inspectionSteps.length - 1, Math.round((progress / 100) * (inspectionSteps.length - 1))))
        await new Promise((resolve) => window.setTimeout(resolve, 1200))
        job = await fetchInspection(job.id)
      }

      if (job.status === "failed") {
        throw new Error(job.error ?? "The backend inspection failed")
      }
      if (!job.result) {
        throw new Error("The backend completed without returning an inspection result")
      }

      setStepIndex(inspectionSteps.length - 1)
      setResult(job.result)
    } catch (inspectionError) {
      setError(inspectionError instanceof Error ? inspectionError.message : "Unable to analyse the uploaded images")
      setStepIndex(-1)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" aria-label="Back to dashboard">
            <Link href="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Inspection workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">New product inspection</h1>
          </div>
        </div>

        {!result && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Upload package images</CardTitle>
                <p className="text-sm text-slate-500">Add front, back, and side views. Multiple views make declarations easier to verify.</p>
              </CardHeader>
              <CardContent>
                <div
                  className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition-colors hover:border-primary hover:bg-blue-50/40"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    addFiles(event.dataTransfer.files)
                  }}
                >
                  <div className="rounded-full bg-blue-100 p-4 text-primary"><Upload className="h-7 w-7" /></div>
                  <p className="mt-4 font-semibold text-slate-900">Drop product images here</p>
                  <p className="mt-1 text-sm text-slate-500">PNG, JPG, or WEBP · up to 6 images</p>
                  <Button type="button" variant="outline" className="mt-5" onClick={(event) => { event.stopPropagation(); inputRef.current?.click() }}>
                    <ImagePlus className="mr-2 h-4 w-4" />Browse images
                  </Button>
                  <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => event.target.files && addFiles(event.target.files)} />
                </div>

                {files.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {files.map((file) => <FileThumbnail key={`${file.name}-${file.lastModified}`} file={file} onRemove={() => setFiles((current) => current.filter((item) => item !== file))} />)}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-xs leading-5 text-slate-500">Images are sent to the authorised backend CNN. No compliance decision is made in the browser.</p>
                  <Button type="button" size="lg" disabled={files.length === 0 || isAnalyzing} onClick={analyse}><ScanLine className="mr-2 h-5 w-5" />{isAnalyzing ? "Analysing..." : "Analyse product"}</Button>
                </div>
                {error && <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-950 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CircleDashed className="h-5 w-5 text-amber-300" />Inspection pipeline</CardTitle>
                <p className="text-sm text-slate-400">Evidence first. Rules decide.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspectionSteps.map((step, index) => {
                    const complete = stepIndex > index || result !== null
                    const active = isAnalyzing && stepIndex === index
                    return <div key={step} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${complete ? "bg-emerald-400 text-slate-950" : active ? "bg-amber-300 text-slate-950" : "bg-slate-800 text-slate-500"}`}>
                        {complete ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                      </div>
                      <span className={complete || active ? "text-slate-100" : "text-slate-500"}>{step}</span>
                      {active && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-amber-300" />}
                    </div>
                  })}
                </div>
                {isAnalyzing && <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-300 transition-all duration-500" style={{ width: `${((stepIndex + 1) / inspectionSteps.length) * 100}%` }} /></div>}
              </CardContent>
            </Card>
          </div>
        )}

        {result && <InspectionResult result={result} onRestart={() => { setResult(null); setFiles([]); setStepIndex(-1) }} />}
      </div>
    </MainLayout>
  )
}

function FileThumbnail({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string>()
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  return <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="aspect-video bg-slate-100">{preview && <img src={preview} alt={file.name} className="h-full w-full object-cover" />}</div><button type="button" onClick={onRemove} className="absolute right-2 top-2 rounded-full bg-slate-950/75 p-1 text-white" aria-label={`Remove ${file.name}`}><X className="h-3 w-3" /></button><p className="truncate px-3 py-2 text-xs font-medium text-slate-700">{file.name}</p></div>
}

function InspectionResult({ result, onRestart }: { result: DemoInspectionResult; onRestart: () => void }) {
  const failed = result.findings.filter((finding) => finding.state === "fail").length
  const review = result.findings.filter((finding) => finding.state === "review").length
  return <div className="space-y-6">
    <div className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-6 md:flex-row md:items-center md:justify-between">
      <div><div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-rose-700"><ShieldAlert className="h-4 w-4" />Inspection complete</div><h2 className="mt-2 text-3xl font-bold text-slate-950">Potential non-compliance found</h2><p className="mt-1 text-sm text-slate-600">Automated assessment · authorised officer verification required</p></div>
      <div className="flex items-center gap-5"><div className="text-right"><p className="text-sm text-slate-500">Compliance score</p><p className="text-5xl font-black text-rose-600">{result.report.complianceScore}%</p></div><Button onClick={() => downloadPDF(result.report)}><FileText className="mr-2 h-4 w-4" />Download report</Button></div>
    </div>

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass"><CardHeader><CardTitle>Visual evidence</CardTitle><p className="text-sm text-slate-500">Detected declarations are linked to their source region.</p></CardHeader><CardContent><EvidenceCanvas /></CardContent></Card>
      <Card className="glass"><CardHeader><CardTitle>Inspection summary</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3 text-center"><SummaryMetric value={result.declarations.filter((item) => item.state === "pass").length} label="Passed" color="text-emerald-600" /><SummaryMetric value={review} label="Review" color="text-amber-600" /><SummaryMetric value={failed} label="Violations" color="text-rose-600" /></div><div className="mt-6 space-y-3">{result.declarations.map((declaration) => { const style = stateStyles(declaration.state); const Icon = style.icon; return <div key={declaration.key} className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-3 ${style.background}`}><div className="flex min-w-0 items-center gap-3"><Icon className={`h-4 w-4 shrink-0 ${style.color}`} /><span className="truncate text-sm font-medium text-slate-800">{declaration.label}</span></div><span className="shrink-0 text-sm font-semibold text-slate-900">{declaration.value}</span></div> })}</div></CardContent></Card>
    </div>

    <Card className="glass"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Rule findings</CardTitle><p className="mt-1 text-sm text-slate-500">The model extracts evidence; deterministic rules produce findings.</p></div><Badge variant="outline">Ruleset PCR-2011 · v2026.09</Badge></CardHeader><CardContent className="space-y-3">{result.findings.map((finding) => { const style = stateStyles(finding.state); const Icon = style.icon; return <div key={finding.id} className={`rounded-xl border p-4 ${style.background}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.color}`} /><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{finding.title}</h3><Badge variant={finding.state === "fail" ? "destructive" : "warning"}>{finding.ruleId}</Badge></div><p className="mt-1 text-sm leading-6 text-slate-600">{finding.description}</p><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{finding.evidenceLabel} · {Math.round(finding.confidence * 100)}% confidence</p></div></div><Button variant="outline" size="sm"><Info className="mr-2 h-4 w-4" />View evidence</Button></div></div> })}</CardContent></Card>

    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Backend-generated assessment. Final determination requires authorised human verification.</p><Button variant="outline" onClick={onRestart}><ArrowLeft className="mr-2 h-4 w-4" />Start another inspection</Button></div>
  </div>
}

function SummaryMetric({ value, label, color }: { value: number; label: string; color: string }) { return <div className="rounded-lg bg-slate-50 px-2 py-3"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div> }

function EvidenceCanvas() {
  return <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"><div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-200 via-amber-50 to-slate-300 p-8"><div className="relative flex h-full w-2/3 max-w-xs flex-col items-center justify-center rounded-lg bg-gradient-to-b from-amber-300 to-orange-400 p-5 text-center text-slate-950 shadow-2xl"><div className="text-[10px] font-black uppercase tracking-[0.2em]">Harvest Gold</div><div className="mt-2 text-2xl font-black leading-none">Basmati<br />Rice</div><div className="mt-5 text-xs font-bold">Net Qty 500 g</div><div className="mt-1 text-xs font-bold">MRP Rs. 499</div><div className="mt-4 text-[9px] font-semibold">Packed: 08/2026</div><div className="absolute bottom-4 left-3 right-3 rounded border-2 border-dashed border-rose-600 bg-rose-100/30 px-2 py-2 text-[8px] font-bold uppercase text-rose-800">Consumer care not detected</div></div></div><div className="absolute left-3 top-3 rounded-md bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white">Back panel · OCR evidence</div></div>
}
