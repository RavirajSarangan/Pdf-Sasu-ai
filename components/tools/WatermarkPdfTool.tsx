"use client";

import React, { useState } from "react";
import { Stamp, Download, FileUp, Sparkles, Check, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { watermarkPdf } from "@/lib/pdf/pdf-manipulation";
import { downloadArrayBuffer, formatFileSize } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";
import confetti from "canvas-confetti";

export function WatermarkPdfTool() {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [color, setColor] = useState("#94a3b8");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [layout, setLayout] = useState<"diagonal" | "center" | "tiled">("diagonal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

  const presets = ["CONFIDENTIAL", "DO NOT COPY", "DRAFT", "ORIGINAL", "SAMPLE", "TOP SECRET"];

  const processFile = (selected: File) => {
    if (selected && (selected.type === "application/pdf" || selected.name.endsWith(".pdf"))) {
      setFile(selected);
      setResultBytes(null);
      success("PDF Loaded", `Selected ${selected.name}`);
    } else {
      error("Invalid File", "Please select a valid PDF document.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = async () => {
    if (!file || !text.trim()) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const output = await watermarkPdf({
        pdfBytes: new Uint8Array(buffer),
        options: {
          text: text.trim(),
          color,
          opacity,
          fontSize,
          rotation,
          layout,
          pageRange: "all",
        },
      });

      setResultBytes(output);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      success("Watermark applied successfully!");
    } catch (err: any) {
      console.error(err);
      error("Watermark failed", err?.message || "Could not process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes || !file) return;
    const newName = file.name.replace(/\.pdf$/i, "-watermarked.pdf");
    downloadArrayBuffer(resultBytes, newName, "application/pdf");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
          <Stamp className="w-3.5 h-3.5 text-neutral-900" /> 100% Client-Side Processing
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Watermark PDF Online
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Stamp text watermarks, confidentiality notices, and copyright marks across all PDF pages. 100% client-side privacy.
        </p>
      </div>

      {!resultBytes ? (
        <div className="space-y-6">
          {/* File input */}
          {!file ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-white cursor-pointer transition-all ${
                isDragOver
                  ? "border-black bg-amber-500/5"
                  : "border-[#e5e5e3] hover:border-neutral-400"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                <FileUp className="w-8 h-8" />
              </div>
              <p className="font-medium text-[#0f0e0d]">
                Click to upload PDF or drag and drop
              </p>
              <p className="text-xs text-[#524f49] mt-1">PDF documents up to any size</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
            </label>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{file.name}</p>
                <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Change File
              </Button>
            </div>
          )}

          {file && (
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6">
              {/* Presets */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setText(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                        text === p
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                          : "border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark text */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Custom Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-semibold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. STRICTLY CONFIDENTIAL"
                />
              </div>

              {/* Layout & Font controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Layout
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => {
                      const v = e.target.value as any;
                      setLayout(v);
                      if (v === "center") setRotation(0);
                      else if (v === "diagonal") setRotation(45);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="diagonal">Diagonal (45°)</option>
                    <option value="center">Horizontal Center</option>
                    <option value="tiled">Tiled Multi-Grid</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                    <span>Opacity</span>
                    <span className="text-neutral-500">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                    <span>Font Size</span>
                    <span className="text-neutral-500">{fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>
              </div>

              <ColorPicker label="Watermark Color" value={color} onChange={setColor} />

              <Button
                variant="primary"
                size="lg"
                onClick={handleApply}
                isLoading={isProcessing}
                disabled={!text.trim()}
                className="w-full gap-2 font-semibold"
              >
                <Stamp className="w-5 h-5" />
                Apply Watermark to PDF
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Download Success Card */
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">
              PDF Watermarked Successfully!
            </h3>
            <p className="text-sm text-neutral-500">
              Your document has been stamped and is ready for download.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25"
            >
              <Download className="w-4 h-4" />
              Download Watermarked PDF
            </Button>
            <Button variant="outline" size="lg" onClick={() => setResultBytes(null)}>
              Watermark Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
