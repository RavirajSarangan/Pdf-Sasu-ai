"use client";

import React, { useState } from "react";
import {
  Scissors,
  Upload,
  Download,
  FileText,
  Check,
  Sparkles,
  Archive,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { splitPdf } from "@/lib/pdf/pdf-manipulation";
import { loadPdfDocument, generatePageThumbnail } from "@/lib/pdf/pdfjs-init";
import { useToast } from "@/components/ui/ToastProvider";
import { downloadArrayBuffer, downloadBlob, formatBytes } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import JSZip from "jszip";
import confetti from "canvas-confetti";

export function SplitPdfTool() {
  const { success, error } = useToast();
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitMode, setSplitMode] = useState<"extract" | "range" | "all">("extract");
  const [rangeString, setRangeString] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      error("Invalid File", "Please select a valid PDF document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      setPdfBytes(uint8);
      setFileName(file.name);

      const doc = await loadPdfDocument(uint8);
      setTotalPages(doc.numPages);
      setSelectedPages([0]); // Default select first page

      // Generate thumbnails
      const thumbs: string[] = [];
      for (let i = 0; i < doc.numPages; i++) {
        const t = await generatePageThumbnail(doc, i, 120);
        thumbs.push(t);
      }
      setThumbnails(thumbs);
      success("PDF Loaded", `${doc.numPages} pages ready to split`);
    } catch (err: any) {
      error("Failed to load PDF", err.message);
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

  const togglePageSelect = (pageIndex: number) => {
    if (selectedPages.includes(pageIndex)) {
      if (selectedPages.length === 1) return; // Keep at least one
      setSelectedPages((prev) => prev.filter((p) => p !== pageIndex));
    } else {
      setSelectedPages((prev) => [...prev, pageIndex].sort((a, b) => a - b));
    }
  };

  const handleSplit = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);

    try {
      if (splitMode === "extract") {
        if (selectedPages.length === 0) {
          error("No pages selected", "Please choose at least one page to extract.");
          return;
        }

        const splitResult = await splitPdf({
          pdfBytes,
          pageIndices: selectedPages,
        });

        const outName = `${fileName.replace(".pdf", "")}-extracted-pages.pdf`;
        downloadArrayBuffer(splitResult, outName);
        confetti({ particleCount: 60, spread: 50 });
        success("Extraction Complete!", `Saved ${selectedPages.length} pages as ${outName}`);
      } else if (splitMode === "all") {
        // Create a ZIP with each page as separate PDF
        const zip = new JSZip();

        for (let i = 0; i < totalPages; i++) {
          const singlePageBytes = await splitPdf({
            pdfBytes,
            pageIndices: [i],
          });
          zip.file(`page-${i + 1}.pdf`, singlePageBytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${fileName.replace(".pdf", "")}-all-pages.zip`);
        confetti({ particleCount: 80, spread: 70 });
        success("Split All Pages Complete!", `Downloaded zip archive with ${totalPages} PDFs`);
      } else if (splitMode === "range") {
        // Parse range string like "1-3, 5"
        const parts = rangeString.split(",").map((s) => s.trim());
        const indices: number[] = [];

        for (const p of parts) {
          if (p.includes("-")) {
            const [start, end] = p.split("-").map((n) => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= totalPages) indices.push(i - 1);
              }
            }
          } else {
            const num = parseInt(p);
            if (!isNaN(num) && num >= 1 && num <= totalPages) {
              indices.push(num - 1);
            }
          }
        }

        const uniqueIndices = Array.from(new Set(indices)).sort((a, b) => a - b);
        if (uniqueIndices.length === 0) {
          error("Invalid Range", "Please enter valid page numbers (e.g. 1-3, 5)");
          return;
        }

        const splitResult = await splitPdf({
          pdfBytes,
          pageIndices: uniqueIndices,
        });

        downloadArrayBuffer(splitResult, `${fileName.replace(".pdf", "")}-range.pdf`);
        success("Range Extracted!", `Extracted ${uniqueIndices.length} pages successfully.`);
      }

      trackEvent("split_completed", { mode: splitMode });
    } catch (err: any) {
      console.error(err);
      error("Split Failed", err.message || "An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium">
          <Scissors className="w-3.5 h-3.5 text-blue-600" /> 100% Client-Side Processing
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Split & Extract PDF Pages
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Extract specific pages, separate page ranges, or split every page into standalone documents.
        </p>
      </div>

      {!pdfBytes ? (
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
            Select or drop a PDF document to split
          </h3>
          <p className="text-xs text-[#524f49] mt-1">Processed locally in your browser memory</p>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Split Mode Selector */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSplitMode("extract")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                splitMode === "extract"
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="font-bold text-sm text-neutral-900">
                Extract Selected Pages
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Click thumbnails to choose which pages to export
              </div>
            </button>

            <button
              onClick={() => setSplitMode("all")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                splitMode === "all"
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="font-bold text-sm text-neutral-900">
                Split Every Page
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Download a ZIP containing each page as an individual PDF
              </div>
            </button>

            <button
              onClick={() => setSplitMode("range")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                splitMode === "range"
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="font-bold text-sm text-neutral-900">
                Custom Page Range
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Specify ranges (e.g. 1-3, 5-8)
              </div>
            </button>
          </div>

          {/* Range Input if range mode */}
          {splitMode === "range" && (
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2">
              <label className="text-xs font-semibold text-neutral-700">
                Enter Page Ranges (e.g., 1-2, 4)
              </label>
              <input
                type="text"
                value={rangeString}
                onChange={(e) => setRangeString(e.target.value)}
                placeholder={`1-${Math.min(totalPages, 3)}`}
                className="w-full px-4 py-2 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Visual Thumbnails Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>
                Document: <strong className="text-neutral-800">{fileName}</strong> ({totalPages} pages)
              </span>
              {splitMode === "extract" && (
                <span>
                  Selected: <strong>{selectedPages.length}</strong> of {totalPages} pages
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-neutral-50 rounded-2xl border border-neutral-200">
              {thumbnails.map((thumb, idx) => {
                const isSelected = selectedPages.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => splitMode === "extract" && togglePageSelect(idx)}
                    className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer bg-white ${
                      isSelected && splitMode === "extract"
                        ? "border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-md bg-neutral-100">
                      <img src={thumb} alt={`Page ${idx + 1}`} className="max-h-full object-contain" />
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-500">
                      Page {idx + 1}
                    </div>

                    {splitMode === "extract" && isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPdfBytes(null);
                setThumbnails([]);
              }}
            >
              Choose Different File
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSplit}
              isLoading={isProcessing}
              className="gap-2 shadow-lg shadow-blue-500/25"
            >
              <Scissors className="w-4 h-4" />
              {splitMode === "extract"
                ? `Extract ${selectedPages.length} Pages`
                : splitMode === "all"
                ? `Split All ${totalPages} Pages (ZIP)`
                : "Extract Range"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
