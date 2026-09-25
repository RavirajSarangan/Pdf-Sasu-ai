"use client";

import React, { useState } from "react";
import { Hash, Download, FileUp, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { addPageNumbersToPdf } from "@/lib/pdf/pdf-manipulation";
import { downloadArrayBuffer, formatFileSize } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";
import confetti from "canvas-confetti";

export function PageNumbersTool() {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"number" | "page_of_total" | "custom">("page_of_total");
  const [customFormat, setCustomFormat] = useState("Page {n} of {total}");
  const [position, setPosition] = useState<
    "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  >("bottom-center");
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState("#475569");
  const [startPage, setStartPage] = useState(1);
  const [startNumber, setStartNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);

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
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const output = await addPageNumbersToPdf({
        pdfBytes: new Uint8Array(buffer),
        options: {
          format,
          customFormat: format === "custom" ? customFormat : undefined,
          position,
          fontSize,
          color,
          startPage,
          startNumber,
          margin: 24,
        },
      });

      setResultBytes(output);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      success("Page numbers added successfully!");
    } catch (err: any) {
      console.error(err);
      error("Failed to add page numbers", err?.message || "Could not process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes || !file) return;
    const newName = file.name.replace(/\.pdf$/i, "-numbered.pdf");
    downloadArrayBuffer(resultBytes, newName, "application/pdf");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium">
          <Hash className="w-3.5 h-3.5 text-blue-600" /> 100% Client-Side Processing
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Add Page Numbers to PDF
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Insert automated page numbers, headers, and footers with custom formats and positions.
        </p>
      </div>

      {!resultBytes ? (
        <div className="space-y-6">
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
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between">
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
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-6">
              {/* Format selection */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-2">
                  Numbering Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat("page_of_total")}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      format === "page_of_total"
                        ? "bg-purple-50 border-purple-600 text-purple-600 font-semibold shadow-sm"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Page 1 of N
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("number")}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      format === "number"
                        ? "bg-purple-50 border-purple-600 text-purple-600 font-semibold shadow-sm"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    1, 2, 3...
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("custom")}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      format === "custom"
                        ? "bg-purple-50 border-purple-600 text-purple-600 font-semibold shadow-sm"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {format === "custom" && (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    placeholder="e.g. - {n} - or Document Page {n}"
                    className="w-full px-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-400">Use `&#123;n&#125;` for page number and `&#123;total&#125;` for total count.</p>
                </div>
              )}

              {/* Placement matrix */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-2">
                  Position on Page
                </label>
                <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-100 rounded-2xl">
                  {(
                    [
                      ["top-left", "Top Left"],
                      ["top-center", "Top Center"],
                      ["top-right", "Top Right"],
                      ["bottom-left", "Bottom Left"],
                      ["bottom-center", "Bottom Center"],
                      ["bottom-right", "Bottom Right"],
                    ] as const
                  ).map(([pos, label]) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosition(pos)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                        position === pos
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-white text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <ColorPicker label="Number Font Color" value={color} onChange={setColor} />

              <Button
                variant="primary"
                size="lg"
                onClick={handleApply}
                isLoading={isProcessing}
                className="w-full gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/25"
              >
                <Hash className="w-5 h-5" />
                Add Page Numbers
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Result */
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900">
              Page Numbers Added!
            </h3>
            <p className="text-sm text-neutral-500">
              Your numbered PDF is ready for immediate download.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              className="w-full sm:w-auto gap-2 bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/25"
            >
              <Download className="w-4 h-4" />
              Download Numbered PDF
            </Button>
            <Button variant="outline" size="lg" onClick={() => setResultBytes(null)}>
              Process Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
