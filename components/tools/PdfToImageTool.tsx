"use client";

import React, { useState } from "react";
import {
  FileImage,
  Upload,
  Download,
  FileText,
  Sparkles,
  Archive,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loadPdfDocument, renderPdfPageToCanvas } from "@/lib/pdf/pdfjs-init";
import { useToast } from "@/components/ui/ToastProvider";
import { downloadBlob } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import JSZip from "jszip";
import confetti from "canvas-confetti";

export function PdfToImageTool() {
  const { success, error } = useToast();
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedThumbnails, setExtractedThumbnails] = useState<string[]>([]);

  const processFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      error("Invalid File", "Please select a valid PDF document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const doc = await loadPdfDocument(new Uint8Array(buffer));
      setPdfDoc(doc);
      setFileName(file.name);
      setTotalPages(doc.numPages);

      // Render previews
      const previews: string[] = [];
      for (let i = 0; i < Math.min(doc.numPages, 12); i++) {
        const page = await doc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          previews.push(canvas.toDataURL("image/jpeg", 0.8));
        }
      }
      setExtractedThumbnails(previews);
      success("PDF Loaded", `${doc.numPages} pages ready for conversion`);
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

  const handleDownloadSinglePage = async (pageIndex: number) => {
    if (!pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 2.0 }); // High res
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      await page.render({ canvasContext: ctx, viewport }).promise;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadBlob(blob, `${fileName.replace(".pdf", "")}-page-${pageIndex + 1}.${format}`);
            success(`Page ${pageIndex + 1} Downloaded!`);
          }
        },
        `image/${format}`,
        0.95
      );
    } catch (err: any) {
      error("Render Failed", err.message);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!pdfDoc) return;
    setIsConverting(true);

    try {
      const zip = new JSZip();

      for (let i = 0; i < totalPages; i++) {
        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
          const base64Data = dataUrl.split(",")[1];
          zip.file(`page-${i + 1}.${format}`, base64Data, { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${fileName.replace(".pdf", "")}-all-images.zip`);
      confetti({ particleCount: 80, spread: 70 });
      success("All Pages Converted!", `Downloaded ZIP with ${totalPages} high-res images`);
      trackEvent("pdf_to_image_completed", { pageCount: totalPages, format });
    } catch (err: any) {
      console.error(err);
      error("Conversion Failed", err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
          <FileImage className="w-3.5 h-3.5 text-neutral-900" /> High-DPI Image Extractor
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Convert PDF to Images
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Extract each PDF page into high-resolution PNG or JPG images directly in your browser.
        </p>
      </div>

      {!pdfDoc ? (
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
            Select or drop a PDF document
          </h3>
          <p className="text-xs text-[#524f49] mt-1">High-fidelity pixel rendering in local memory</p>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Settings Ribbon */}
          <div className="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-600">
                Image Format:
              </span>
              <div className="flex bg-neutral-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setFormat("png")}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    format === "png"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500"
                  }`}
                >
                  PNG (Lossless)
                </button>
                <button
                  onClick={() => setFormat("jpeg")}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    format === "jpeg"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-500"
                  }`}
                >
                  JPG (Compact)
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadAllZip}
              isLoading={isConverting}
              className="gap-2 font-semibold"
            >
              <Archive className="w-4 h-4" />
              Download All Pages (ZIP)
            </Button>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[55vh] overflow-y-auto p-1">
            {extractedThumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="group relative p-3 bg-white border border-neutral-200/80 rounded-2xl shadow-xs flex flex-col items-center gap-2.5"
              >
                <div className="w-full h-44 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                  <img src={thumb} alt={`Page ${idx + 1}`} className="max-h-full object-contain" />
                </div>
                <div className="w-full flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-700">
                    Page {idx + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDownloadSinglePage(idx)}
                    className="gap-1 text-blue-600"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save {format.toUpperCase()}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
