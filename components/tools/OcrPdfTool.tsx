"use client";

import React, { useState } from "react";
import {
  ScanText,
  Upload,
  Download,
  Copy,
  Sparkles,
  FileText,
  Check,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loadPdfDocument } from "@/lib/pdf/pdfjs-init";
import { useToast } from "@/components/ui/ToastProvider";
import { downloadBlob } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { createWorker } from "tesseract.js";

export function OcrPdfTool() {
  const { success, error, info } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const processFile = async (selected: File) => {
    if (!selected) return;

    setFile(selected);
    setExtractedText("");

    if (selected.type === "application/pdf" || selected.name.endsWith(".pdf")) {
      try {
        const buffer = await selected.arrayBuffer();
        const doc = await loadPdfDocument(new Uint8Array(buffer));
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setSelectedPage(0);
        success("PDF Loaded", `${doc.numPages} pages ready for Optical Character Recognition`);
      } catch (err: any) {
        error("PDF Load Failed", err.message);
      }
    } else if (selected.type.startsWith("image/")) {
      setPdfDoc(null);
      setTotalPages(1);
      setSelectedPage(0);
      success("Image Loaded", "Ready for OCR");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) await processFile(selected);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) await processFile(selected);
  };

  const runOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus("Initializing client OCR engine...");

    try {
      let imageSource: string | HTMLCanvasElement = "";

      if (pdfDoc) {
        setProgressStatus(`Rendering PDF Page ${selectedPage + 1} to high-res canvas...`);
        const page = await pdfDoc.getPage(selectedPage + 1);
        const viewport = page.getViewport({ scale: 2.0 }); // High DPI for OCR accuracy
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas");

        await page.render({ canvasContext: ctx, viewport }).promise;
        imageSource = canvas;
      } else {
        // Image file
        imageSource = URL.createObjectURL(file);
      }

      setProgressStatus("Recognizing characters with WebAssembly Worker...");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgressPercent(Math.round(m.progress * 100));
            setProgressStatus(`Extracting text (${Math.round(m.progress * 100)}%)...`);
          }
        },
      });

      const ret = await worker.recognize(imageSource);
      setExtractedText(ret.data.text);
      await worker.terminate();

      trackEvent("tool_opened", { tool: "ocr_pdf" });
      success("OCR Complete!", `Extracted text from page ${selectedPage + 1}`);
    } catch (err: any) {
      console.error("OCR error:", err);
      error("OCR Failed", err.message || "Could not recognize text");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    info("Copied extracted text to clipboard");
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const name = file ? `${file.name.replace(/\.[^/.]+$/, "")}-ocr.txt` : "ocr-text.txt";
    downloadBlob(blob, name);
    success("Downloaded text file");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium">
          <ScanText className="w-3.5 h-3.5 text-blue-600" /> Client-Side WebAssembly OCR
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Extract Text from PDF & Scans (OCR)
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Convert scanned paper documents and image-based PDFs into searchable, editable text entirely inside your browser.
        </p>
      </div>

      {!file ? (
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
            Select or drop a scanned PDF or document image
          </h3>
          <p className="text-xs text-[#524f49] mt-1">
            Supports PDF, PNG, JPG, and WebP. 100% offline & private.
          </p>
          <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="space-y-6">
          {/* File Card & Page Selector */}
          <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-neutral-900">
                  {file.name}
                </h4>
                <p className="text-xs text-neutral-400">
                  {totalPages > 1 ? `${totalPages} Pages` : "Document ready"}
                </p>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Select Page:</span>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(parseInt(e.target.value))}
                  disabled={isProcessing}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 bg-white"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i} value={i}>
                      Page {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={runOcr}
              isLoading={isProcessing}
              className="gap-2 shadow-lg shadow-blue-500/25"
            >
              <Cpu className="w-4 h-4" />
              Run Client OCR
            </Button>
          </div>

          {/* Processing Progress Indicator */}
          {isProcessing && (
            <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-semibold text-blue-900">
                <span>{progressStatus}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-200 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Editor Box */}
          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Extracted OCR Text
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="xs" onClick={handleCopy} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                  <Button variant="primary" size="xs" onClick={handleDownloadTxt} className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Download .TXT
                  </Button>
                </div>
              </div>

              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
