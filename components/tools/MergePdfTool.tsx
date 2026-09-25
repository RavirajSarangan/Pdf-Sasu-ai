"use client";

import React, { useState } from "react";
import {
  Layers,
  Upload,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mergePdfs } from "@/lib/pdf/pdf-manipulation";
import { loadPdfDocument, generatePageThumbnail } from "@/lib/pdf/pdfjs-init";
import { useToast } from "@/components/ui/ToastProvider";
import { formatBytes, downloadArrayBuffer } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";

interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount: number;
  thumbnailUrl: string;
}

export function MergePdfTool() {
  const { success, error } = useToast();
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mergedResult, setMergedResult] = useState<{ bytes: Uint8Array; totalPages: number } | null>(
    null
  );

  const processIncomingFiles = async (fileList: FileList | File[]) => {
    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) continue;

      try {
        const buffer = await file.arrayBuffer();
        const doc = await loadPdfDocument(new Uint8Array(buffer));
        const thumbnail = await generatePageThumbnail(doc, 0, 120);

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          buffer,
          pageCount: doc.numPages,
          thumbnailUrl: thumbnail,
        });
      } catch (err) {
        console.error("Failed to read PDF for merge:", err);
      }
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
      setMergedResult(null);
      success("Files Added", `Added ${newItems.length} PDF(s) to queue`);
    } else {
      error("Invalid Files", "Please drop valid PDF documents.");
    }
  };

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    await processIncomingFiles(selectedFiles);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processIncomingFiles(e.dataTransfer.files);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFiles(updated);
    setMergedResult(null);
  };

  const removeItem = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      error("Need more files", "Please add at least 2 PDF documents to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const buffers = files.map((f) => f.buffer);
      const mergedBytes = await mergePdfs(buffers);
      const totalPages = files.reduce((acc, f) => acc + f.pageCount, 0);

      setMergedResult({
        bytes: mergedBytes,
        totalPages,
      });

      trackEvent("merge_completed", { fileCount: files.length, pageCount: totalPages });
      confetti({ particleCount: 70, spread: 60 });
      success("PDFs Merged Successfully!", `Combined ${files.length} documents (${totalPages} pages)`);
    } catch (err: any) {
      console.error(err);
      error("Merge failed", err.message || "An error occurred while merging PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedResult) return;
    downloadArrayBuffer(mergedResult.bytes, "merged-document.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
          <Layers className="w-3.5 h-3.5 text-neutral-900" /> 100% Client-Side Processing
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Merge PDF Documents
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Combine multiple PDF files in your preferred sequence into a single, organized document.
        </p>
      </div>

      {/* Upload Zone */}
      {files.length === 0 ? (
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
            Select or drop multiple PDF files
          </h3>
          <p className="text-xs text-[#524f49] mt-1">
            Files remain strictly inside your browser memory
          </p>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleAddFiles}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* File cards list */}
          <div className="space-y-2.5">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 bg-white border border-neutral-200/80 rounded-2xl shadow-xs hover:border-neutral-300 transition-all"
              >
                {/* File Thumbnail & Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-14 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-200 shrink-0">
                    {file.thumbnailUrl ? (
                      <img src={file.thumbnailUrl} alt="Thumb" className="max-h-full object-contain" />
                    ) : (
                      <FileText className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 truncate">
                      {idx + 1}. {file.name}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{file.pageCount} page(s)</span>
                      <span>•</span>
                      <span>{formatBytes(file.size)}</span>
                    </div>
                  </div>
                </div>

                {/* Reorder & Remove Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, "up")}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === files.length - 1}
                    onClick={() => moveItem(idx, "down")}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(file.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more files & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <label>
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Add More PDFs
              </Button>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleAddFiles}
                className="sr-only"
              />
            </label>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiles([]);
                  setMergedResult(null);
                }}
                className="text-neutral-500"
              >
                Clear All
              </Button>

              {!mergedResult ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleMerge}
                  isLoading={isMerging}
                  disabled={files.length < 2}
                  className="gap-2 shadow-lg shadow-blue-500/25"
                >
                  <Layers className="w-4 h-4" />
                  Merge {files.length} PDFs
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownload}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4" />
                  Download Merged PDF ({mergedResult.totalPages} pages)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
