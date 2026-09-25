"use client";

import React, { useState } from "react";
import {
  Minimize2,
  Upload,
  Download,
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { compressPdf } from "@/lib/pdf/pdf-manipulation";
import { useToast } from "@/components/ui/ToastProvider";
import { formatBytes, downloadArrayBuffer } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";

export function CompressPdfTool() {
  const { success, error } = useToast();
  const [fileName, setFileName] = useState("");
  const [originalBytes, setOriginalBytes] = useState<Uint8Array | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState<{
    compressedBytes: Uint8Array;
    originalSize: number;
    newSize: number;
    savedPercent: number;
  } | null>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      error("Invalid File", "Please select a valid PDF document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      setOriginalBytes(uint8);
      setFileName(file.name);
      setResult(null);
      success("PDF Loaded", `Ready to compress: ${file.name}`);
    } catch (err: any) {
      error("Failed to read PDF", err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const handleCompress = async () => {
    if (!originalBytes) return;
    setIsCompressing(true);

    try {
      const { data, originalSize, newSize } = await compressPdf(originalBytes);
      const savedBytes = Math.max(0, originalSize - newSize);
      const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

      setResult({
        compressedBytes: data,
        originalSize,
        newSize,
        savedPercent,
      });

      trackEvent("compress_completed", { originalSizeBytes: originalSize, newSizeBytes: newSize });
      confetti({ particleCount: 70, spread: 60 });
      success("Compression Complete!", `Optimized PDF streams with 100% privacy`);
    } catch (err: any) {
      console.error(err);
      error("Compression failed", err.message || "Could not optimize PDF");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadArrayBuffer(result.compressedBytes, fileName.replace(".pdf", "-compressed.pdf"));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
          <Minimize2 className="w-3.5 h-3.5 text-neutral-900" /> 100% Client-Side Compression
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Compress PDF Document
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Reduce PDF file size by reorganizing cross-reference tables and deflating binary streams.
        </p>
      </div>

      {!originalBytes ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 bg-white cursor-pointer shadow-sm hover:shadow-md transition-all text-center ${
            isDragOver
              ? "border-black bg-amber-500/5"
              : "border-[#e5e5e3] hover:border-neutral-400"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-[#0f0e0d]">
            Select or drop a PDF document to compress
          </h3>
          <p className="text-xs text-[#524f49] mt-1">Zero cloud uploads. Real client-side deflating.</p>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* File Card */}
          <div className="p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 text-sm">
                  {fileName}
                </h4>
                <p className="text-xs text-neutral-500">
                  Original Size: {formatBytes(originalBytes.byteLength)}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setOriginalBytes(null);
                setResult(null);
              }}
            >
              Change File
            </Button>
          </div>

          {/* Compression Results Box */}
          {result && (
            <div className="p-6 bg-emerald-50/50 border-2 border-emerald-500/30 rounded-3xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <Zap className="w-3.5 h-3.5" /> Stream Optimization Complete
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                <div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                    Original
                  </div>
                  <div className="text-xl font-bold text-neutral-800">
                    {formatBytes(result.originalSize)}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-emerald-500" />

                <div>
                  <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">
                    Optimized
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {formatBytes(result.newSize)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-500">
                Reduced binary footprint without degrading vector resolution or fonts.
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end gap-3">
            {!result ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompress}
                isLoading={isCompressing}
                className="gap-2 shadow-lg shadow-blue-500/25"
              >
                <Minimize2 className="w-4 h-4" />
                Compress PDF Now
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
              >
                <Download className="w-4 h-4" />
                Download Compressed PDF
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
