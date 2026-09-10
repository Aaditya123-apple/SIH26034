"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Square,
  Upload,
} from "lucide-react";
import { MainLayout } from "@/components/main-layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { getRealtimeUrl, uploadInspection } from "@/lib/api";

interface LiveUpdate {
  inspection_id: string;
  status: string;
  processing_stage: string;
  overall_compliance: string;
  inspection?: {
    product_name: string;
    detection_confidence: number;
    declarations: Array<{ field: string; value?: string; confidence?: number }>;
    rule_results: Array<{
      rule_id: string;
      rule_name: string;
      result: string;
      explanation: string;
    }>;
    evidence: Array<{ field: string; text?: string; confidence?: number }>;
  };
}

const stageLabels: Record<string, string> = {
  UPLOADED: "Image uploaded",
  DETECTED: "Package detected",
  IMAGE_PROCESSING: "Preparing image",
  OCR_EXTRACTING: "Reading declarations",
  RULE_EVALUATION: "Checking legal rules",
  GENERATING_EVIDENCE: "Generating evidence",
  COMPLETED: "Inspection complete",
  FAILED: "Inspection failed",
};

export default function LiveInspectionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [productName, setProductName] = useState("Live Package");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [update, setUpdate] = useState<LiveUpdate | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeInspectionSocket = () => {
    socketRef.current?.close();
    socketRef.current = null;
  };

  const clearCapturedFrame = () => {
    closeInspectionSocket();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUpdate(null);
    setIsUploading(false);
  };

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current?.close();
    },
    [],
  );

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const startCamera = async () => {
    setError(null);
    clearCapturedFrame();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setError("Camera access was unavailable. Use the image upload instead.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const watchInspection = (inspectionId: string) => {
    closeInspectionSocket();
    const socket = new WebSocket(
      getRealtimeUrl(`/ws/inspections/${inspectionId}`),
    );
    socketRef.current = socket;
    socket.onmessage = (event) =>
      setUpdate(JSON.parse(event.data) as LiveUpdate);
    socket.onerror = () =>
      setError("Live updates disconnected. Refresh the inspection to retry.");
    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        setIsUploading(false);
      }
    };
  };

  const submitImage = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setPreviewUrl((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(file);
    });
    try {
      const result = await uploadInspection(file, productName);
      setUpdate({
        inspection_id: result.inspection_id,
        status: result.status,
        processing_stage: result.processing_stage,
        overall_compliance: "PASS",
      });
      watchInspection(result.inspection_id);
    } catch (uploadError) {
      setIsUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.",
      );
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void submitImage(file);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      setError(
        "Camera is still starting. Wait for the preview before capturing.",
      );
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    stopCamera();
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(
            "The captured frame could not be processed. Please try again.",
          );
          return;
        }

        const captureFile = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });

        void submitImage(captureFile);
      },
      "image/jpeg",
      0.9,
    );
  };

  const completed = update?.processing_stage === "COMPLETED";

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-xl md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Live inspection
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Inspect a package in realtime
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Capture one frame or upload a label. The backend will process it and
            stream each inspection stage back to this screen.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Camera or image source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="product-name">Product label</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="overflow-hidden rounded-xl bg-slate-900 aspect-video">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded package"
                    className="h-full w-full object-contain"
                    onError={() =>
                      setError("The captured image could not be loaded.")
                    }
                  />
                ) : cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-sm text-slate-300">
                    <div>
                      <Camera className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                      Camera preview will appear here
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {!cameraActive ? (
                  <Button onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline">
                    <Square className="mr-2 h-4 w-4" />
                    Stop camera
                  </Button>
                )}
                {cameraActive && (
                  <Button onClick={captureFrame} disabled={isUploading}>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture frame
                  </Button>
                )}
                <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inspection stream</CardTitle>
              {update && (
                <Badge variant={completed ? "success" : "warning"}>
                  {update.status}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {!update ? (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-center text-sm text-slate-500">
                  <ImagePlus className="mb-3 h-8 w-8 text-slate-400" />
                  Capture or upload an image to begin
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-slate-950 p-5 text-white">
                    <div className="flex items-center gap-3 text-sm text-amber-300">
                      <Loader2
                        className={`h-4 w-4 ${completed ? "hidden" : "animate-spin"}`}
                      />
                      <CheckCircle2
                        className={completed ? "h-4 w-4" : "hidden"}
                      />
                      {stageLabels[update.processing_stage] ??
                        update.processing_stage}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      {update.inspection_id}
                    </p>
                    {update.inspection && (
                      <p className="mt-2 text-lg font-semibold">
                        {update.inspection.product_name}
                      </p>
                    )}
                  </div>
                  {update.inspection && (
                    <>
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-900">
                          Declarations
                        </h3>
                        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                          {update.inspection.declarations.map((item) => (
                            <div
                              key={item.field}
                              className="flex justify-between gap-4 px-3 py-2 text-sm"
                            >
                              <span className="text-slate-500">
                                {item.field}
                              </span>
                              <span className="text-right font-medium text-slate-900">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-900">
                          Rule results
                        </h3>
                        <div className="space-y-2">
                          {update.inspection.rule_results.map((rule) => (
                            <div
                              key={rule.rule_id}
                              className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm"
                            >
                              <div>
                                <p className="font-medium text-slate-900">
                                  {rule.rule_id} · {rule.rule_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {rule.explanation}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  rule.result === "PASS"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {rule.result}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
