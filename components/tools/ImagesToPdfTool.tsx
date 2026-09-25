"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Plus,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { imagesToPdf } from "@/lib/pdf/pdf-manipulation";
import { useToast } from "@/components/ui/ToastProvider";
import { downloadArrayBuffer, formatBytes } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";

interface ImageItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

export function ImagesToPdfTool() {
  const { success, error } = useToast();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Fit">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processImageFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              size: file.size,
              dataUrl,
              width: img.width,
              height: img.height,
            },
          ]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) processImageFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processImageFiles(e.dataTransfer.files);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setImages(updated);
  };

  const removeItem = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfBytes = await imagesToPdf({
        images,
        pageSize,
        orientation,
        margin,
      });

      downloadArrayBuffer(pdfBytes, "converted-images.pdf");
      confetti({ particleCount: 70, spread: 60 });
      success("PDF Created!", `Combined ${images.length} images into clean PDF document`);
      trackEvent("images_to_pdf_completed", { fileCount: images.length });
    } catch (err: any) {
      console.error(err);
      error("Conversion Failed", err.message || "Could not create PDF from images.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
          <FileText className="w-3.5 h-3.5 text-neutral-900" /> Instant Browser PDF Creator
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0f0e0d]">
          Convert Images to PDF
        </h1>
        <p className="text-sm text-[#524f49] max-w-lg mx-auto">
          Convert JPG, PNG, and WebP photos into high-quality PDF documents with customizable page formats and margins.
        </p>
      </div>

      {images.length === 0 ? (
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
            Select or drop images (PNG, JPG, WebP)
          </h3>
          <p className="text-xs text-[#524f49] mt-1">Multi-image selection supported</p>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            multiple
            onChange={handleAddImages}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="space-y-6">
          {/* Format Settings Bar */}
          <div className="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Page Size */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full h-8 px-2 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900"
              >
                <option value="A4">A4 (Standard)</option>
                <option value="Letter">US Letter</option>
                <option value="Fit">Fit to Image</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                disabled={pageSize === "Fit"}
                className="w-full h-8 px-2 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* Margin */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-500">Margins</label>
              <select
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                disabled={pageSize === "Fit"}
                className="w-full h-8 px-2 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 disabled:opacity-50"
              >
                <option value={0}>No Margin (0)</option>
                <option value={10}>Small (10pt)</option>
                <option value={20}>Medium (20pt)</option>
                <option value={40}>Large (40pt)</option>
              </select>
            </div>
          </div>

          {/* Images List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-1">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative p-3 bg-white border border-neutral-200/80 rounded-2xl shadow-xs flex flex-col items-center gap-2"
              >
                <div className="w-full h-36 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
                  <img src={img.dataUrl} alt={img.name} className="max-h-full object-contain" />
                </div>
                <div className="w-full flex items-center justify-between text-xs font-semibold text-neutral-700 truncate">
                  <span className="truncate">{idx + 1}. {img.name}</span>
                </div>

                {/* Card Toolbar */}
                <div className="w-full flex items-center justify-between pt-1 border-t border-neutral-100">
                  <div className="flex gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, "up")}
                      className="p-1 rounded text-neutral-400 hover:text-blue-600 disabled:opacity-30"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === images.length - 1}
                      onClick={() => moveItem(idx, "down")}
                      className="p-1 rounded text-neutral-400 hover:text-blue-600 disabled:opacity-30"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(img.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <label>
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Add More Images
              </Button>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                className="sr-only"
              />
            </label>

            <Button
              variant="primary"
              size="lg"
              onClick={handleGeneratePdf}
              isLoading={isGenerating}
              className="gap-2 shadow-lg shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              Generate & Download PDF ({images.length} pages)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
