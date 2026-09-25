"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PenTool,
  Sparkles,
  QrCode,
  Stamp,
  Hash,
  Layers,
  Scissors,
  Minimize2,
  FileImage,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function ToolsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const tools = [
    {
      id: "editor",
      name: "Visual Studio Editor",
      category: "edit",
      description: "Draw fluid signatures with pressure smoothing, add text layers, stamps, shapes, and redact confidential data.",
      icon: PenTool,
      badge: "WASM Vector Canvas",
      href: "/editor",
    },
    {
      id: "ocr",
      name: "Client-Side OCR",
      category: "intelligence",
      description: "Extract text from scanned PDF pages directly inside a WebAssembly background worker with zero data transfer.",
      icon: Sparkles,
      badge: "Tesseract.js Engine",
      href: "/tools/ocr",
    },
    {
      id: "barcode",
      name: "QR & Barcode Studio",
      category: "utility",
      description: "Generate 2D QR codes and enterprise 1D Barcodes (Code128, EAN-13, UPC) directly onto PDF documents.",
      icon: QrCode,
      badge: "Vector Native",
      href: "/tools/barcode",
    },
    {
      id: "watermark",
      name: "Watermark PDF",
      category: "security",
      description: "Apply custom repeating diagonal or centered text and image watermarks across all document pages.",
      icon: Stamp,
      badge: "Multi-Page Stream",
      href: "/tools/watermark",
    },
    {
      id: "page-numbers",
      name: "Page Numbering",
      category: "organization",
      description: "Automate dynamic page numbering with customizable positions, offsets, and formats (Page X of Y).",
      icon: Hash,
      badge: "FontKit Embedded",
      href: "/tools/page-numbers",
    },
    {
      id: "merge",
      name: "Merge PDF",
      category: "organization",
      description: "Combine multiple PDF documents into an ordered, unified document buffer in milliseconds.",
      icon: Layers,
      badge: "ArrayBuffer Concat",
      href: "/tools/merge",
    },
    {
      id: "split",
      name: "Split PDF",
      category: "organization",
      description: "Extract specific page ranges, split by individual pages, or delete unneeded pages seamlessly.",
      icon: Scissors,
      badge: "Lossless Extraction",
      href: "/tools/split",
    },
    {
      id: "compress",
      name: "Compress PDF",
      category: "utility",
      description: "Optimize PDF objects and raster assets to significantly reduce file size without losing readability.",
      icon: Minimize2,
      badge: "Stream Optimization",
      href: "/tools/compress",
    },
    {
      id: "pdf-to-image",
      name: "PDF to High-DPI Images",
      category: "utility",
      description: "Render and export PDF pages as high-resolution PNG or JPEG image sets at custom DPI scales.",
      icon: FileImage,
      badge: "Canvas Rasterizer",
      href: "/tools/pdf-to-image",
    },
    {
      id: "images-to-pdf",
      name: "Images to PDF",
      category: "utility",
      description: "Convert photos, JPGs, and PNGs into a structured, multi-page vector-aligned PDF document.",
      icon: FileImage,
      badge: "Smart DPI Fit",
      href: "/tools/images-to-pdf",
    },
  ];

  const categories = [
    { id: "all", label: "All Tools (10)" },
    { id: "edit", label: "Editing & Signing" },
    { id: "intelligence", label: "Intelligence & OCR" },
    { id: "organization", label: "Page Organization" },
    { id: "security", label: "Security & Stamps" },
    { id: "utility", label: "Utilities & Conversion" },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-12 sm:py-20">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
        
        {/* Header Section */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-10 border-b border-[#e5e5e3]">
          <div className="col-span-12 space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[#524f49]">Suite Catalog</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d]">
              Browser-Native PDF Tools
            </h1>
            <p className="text-sm text-[#524f49] max-w-2xl">
              Ten production-grade PDF tools running 100% in your local WebAssembly sandbox with zero cloud uploads or metered fees.
            </p>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#0f0e0d] text-[#fafaf9]"
                    : "bg-white border border-[#e5e5e3] text-[#524f49] hover:text-[#0f0e0d] hover:bg-[#f2f1f0]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#524f49]" />
            <input
              type="text"
              placeholder="Search tools & features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e5e5e3] bg-white text-xs text-[#0f0e0d] placeholder:text-[#524f49] focus:outline-none focus:border-[#0f0e0d]"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group flex flex-col justify-between rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-7 hover:border-[#0f0e0d] transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-lg bg-[#f2f1f0] text-[#0f0e0d] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2f1f0] text-[#524f49] border border-[#e5e5e3]">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-base font-medium text-[#0f0e0d] group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-xs text-[#524f49] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e5e5e3] flex items-center justify-between text-xs font-medium text-[#0f0e0d]">
                  <span>Launch Tool</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Architecture Banner */}
        <div className="rounded-2xl border border-[#e5e5e3] bg-white text-[#0f0e0d] p-8 sm:p-10 space-y-6 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#716e68]">WASM Pipeline Guarantee</div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#0f0e0d]">
              Zero telemetry. Zero network latency.
            </h2>
            <p className="text-xs sm:text-sm text-[#524f49] leading-relaxed">
              Every tool executes in your browser&apos;s dedicated WebAssembly worker thread. No data packets leave your device, ensuring maximum confidentiality and compliance with enterprise security standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1 font-mono text-xs">
              <div className="text-emerald-700 font-bold">100% In-Browser</div>
              <div className="text-[11px] text-[#524f49]">Runs on local device CPU</div>
            </div>
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1 font-mono text-xs">
              <div className="text-blue-700 font-bold">PDF.js + pdf-lib</div>
              <div className="text-[11px] text-[#524f49]">Standardized PDF specs</div>
            </div>
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1 font-mono text-xs">
              <div className="text-amber-700 font-bold">IndexedDB Cache</div>
              <div className="text-[11px] text-[#524f49]">Same-origin persistence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
