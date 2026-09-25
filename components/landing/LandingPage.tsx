"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  PenTool,
  Layers,
  Scissors,
  Minimize2,
  FileImage,
  ShieldCheck,
  Sparkles,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  MousePointer,
  ChevronDown,
  Check,
  Hash,
  QrCode,
  Stamp,
  Cpu,
  Fingerprint,
  Terminal,
  Activity,
  Code2,
  Building2,
  Globe,
  ArrowUpRight,
  Users,
  PlaneTakeoff,
  Clock,
  KeyRound,
  ChevronsUp,
  MessageSquare,
  Search,
} from "lucide-react";

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does PDFForge handle data privacy and security?",
      a: "PDFForge is architected with a strict client-side execution model. All PDF parsing, rasterization, OCR recognition, vector editing, and cryptographic hashing execute locally in your browser's WebAssembly sandbox. No document bytes are ever uploaded or transmitted across external networks.",
    },
    {
      q: "Which PDF operations and formats are supported?",
      a: "PDFForge supports full multi-page visual editing, freehand signatures (perfect-freehand), text extraction (Tesseract.js OCR), 1D/2D Barcodes (Code 128, EAN-13, UPC, QR), page rotation, reordering, splitting, merging, image bundling, and document watermarking.",
    },
    {
      q: "Is PDFForge completely free with no hidden fees?",
      a: "Yes. Because PDFForge utilizes local CPU computation rather than metered cloud compute APIs, the entire application is 100% free to use with zero export watermarks and no subscription paywalls.",
    },
    {
      q: "Does PDFForge work offline without internet?",
      a: "Yes. Once the initial application assets load, the core PDF engine (PDF.js, pdf-lib, Tesseract worker) is stored in browser cache and operates fully without an active internet connection.",
    },
  ];

  return (
    <div className="w-full bg-[#fafaf9] text-[#0f0e0d]">
      
      {/* SECTION 1: HERO (EXACT RADIUS 2-COLUMN SPLIT HERO WITH DIVIDER) */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] py-12 lg:py-0 relative">
            {/* Center Vertical Divider Line matching Radius */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" aria-hidden="true" />

            {/* Left Content Column */}
            <div className="flex flex-col justify-center max-w-xl lg:pr-8">
              {/* Pill Announcement */}
              <Link
                href="/editor"
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 group w-fit"
              >
                <span>Introducing PDFForge: The browser-native PDF studio</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-[1.1] tracking-tight mb-6">
                The next-generation PDF studio for your team
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                Context-aware editing, automated workflows, and client-side OCR integration in one unified workspace. Bring the power of local WebAssembly directly into your browser.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-4">
                <Link
                  href="/editor"
                  className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Launch Editor
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Explore Tools
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Mockup Column */}
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] lg:pl-8 flex items-center">
              {/* Background gradient image matching Radius /bg.jpg */}
              <div className="absolute inset-0 lg:left-8 overflow-hidden rounded-2xl">
                <img
                  alt="Hero background"
                  src="/bg.jpg"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Floating Studio Window Frame matching Radius /dashboard.png */}
              <div className="absolute top-8 left-8 sm:top-12 sm:left-12 lg:left-16 right-0 bottom-0 rounded-tl-xl overflow-hidden p-[1.5px] bg-gradient-to-br from-white/80 via-white/30 to-white/60 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.4)_inset] ring-1 ring-white/40">
                <div className="relative w-full h-full rounded-tl-[10px] overflow-hidden bg-[#0f0e0d]">
                  <img
                    alt="PDFForge Dashboard preview"
                    src="/dashboard.png"
                    className="object-cover object-left-top w-full h-full"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LOGO CLOUD MARQUEE STRIP MATCHING RADIUS */}
      <section className="w-full bg-white border-y border-gray-200/70 py-6 sm:py-8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-around gap-8 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all text-xs font-mono font-bold text-gray-800">
            <span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-blue-600" /> WebAssembly Core</span>
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-orange-600" /> PDF.js 3.11</span>
            <span className="flex items-center gap-1.5"><Layers className="h-4 w-4 text-indigo-600" /> pdf-lib Engine</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-amber-600" /> Tesseract.js OCR</span>
            <span className="flex items-center gap-1.5"><PenTool className="h-4 w-4 text-emerald-600" /> Perfect-Freehand</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cyan-600" /> IndexedDB Sandbox</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY RADIUS (3-CARD GRID MATCHING RADIUS PREVIEW) */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="why-radius">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
          <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8">
            <p className="col-span-12 text-sm font-normal text-[#524f49] sm:text-base">Why PDFForge?</p>
            <h2 className="col-span-12 text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:col-span-5 md:text-4xl lg:text-[2.4rem]">
              The core document workspace<br />that grows with your needs
            </h2>
            <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
              Other PDF editors live in remote server queues, charging per-page API fees and exposing sensitive documents. PDFForge brings professional manipulation directly into your local browser sandbox, keeping your operations fully integrated and private.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {/* Card 1: 6 PDF & Document System Icons with Double Glowing Border */}
            <article className="flex flex-col gap-6 sm:gap-8">
              <div className="pointer-events-none relative aspect-[4/3] select-none overflow-hidden rounded-md bg-[#f2f1f0]">
                <img
                  alt=""
                  src="/bg.jpg"
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 rounded-md [background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent_50%),linear-gradient(135deg,transparent_50%,rgba(0,0,0,0.06))]" />
                <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 md:p-12">
                  <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {[
                      { icon: PenTool, label: "Sign" },
                      { icon: Stamp, label: "Stamp" },
                      { icon: QrCode, label: "QR" },
                      { icon: Sparkles, label: "OCR" },
                      { icon: Layers, label: "Merge" },
                      { icon: ShieldCheck, label: "Redact" },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="relative grid aspect-square w-10 place-items-center rounded-lg bg-white text-[#0f0e0d] shadow-sm sm:w-12 md:w-14"
                        >
                          <Icon className="h-2/5 w-2/5" />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-2 border-[8px] border-white/25"
                            style={{ borderRadius: "calc(0.5rem + 8px)" }}
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-2 border border-white"
                            style={{
                              borderRadius: "calc(0.5rem + 8px)",
                              WebkitMaskImage: "linear-gradient(90deg, #fff, transparent)",
                              maskImage: "linear-gradient(90deg, #fff, transparent)",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-balance text-lg font-normal leading-[1.2] text-[#0f0e0d] sm:text-xl md:text-2xl">
                  All-in-one document workspace
                </h3>
                <p className="text-sm leading-normal text-[#524f49] sm:text-base">
                  Annotate, draw signatures, redact PII, stamp QR codes, extract OCR text, and merge multi-page contracts from a single unified studio. No more hopping between untrusted file converter sites.
                </p>
              </div>
            </article>

            {/* Card 2: Interactive Diagnostic Chat / Terminal Mockup */}
            <article className="flex flex-col gap-6 sm:gap-8">
              <div className="pointer-events-none relative aspect-[4/3] select-none overflow-hidden rounded-md bg-[#f2f1f0]">
                <img
                  alt=""
                  src="/bg.jpg"
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 rounded-md [background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent_50%),linear-gradient(135deg,transparent_50%,rgba(0,0,0,0.06))]" />
                <div className="absolute bottom-[-1.5rem] right-[-1.5rem] left-8 top-8 sm:left-10 sm:top-10 md:left-12 md:top-12">
                  <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-tl-lg bg-[#fafaf9] shadow-sm ring-1 ring-white/60">
                    <div className="flex items-center gap-1.5 border-b border-[#e5e5e3] px-3 py-2">
                      <Hash className="h-3.5 w-3.5 text-[#0f0e0d]" />
                      <span className="text-[11px] font-medium text-[#0f0e0d] sm:text-xs md:text-sm">ocr-diagnostics</span>
                    </div>
                    <div className="flex flex-col gap-3 py-3">
                      <div className="flex flex-row items-start gap-2 px-3">
                        <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f2f1f0]">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-baseline gap-1.5 text-[11px] font-medium text-[#0f0e0d] sm:text-xs md:text-sm">
                            Olivia Hartley
                            <span className="text-[10px] font-normal text-[#6e6a65] sm:text-[11px]">9:14</span>
                          </div>
                          <p className="text-[11px] leading-normal text-[#524f49] sm:text-xs md:text-sm">
                            <span className="font-medium text-[#0f0e0d]">@PDFForge</span> extract text from scanned agreement and stamp approved watermark
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-start gap-2 px-3">
                        <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#0f0e0d] text-white">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-baseline gap-1.5 text-[11px] font-medium text-[#0f0e0d] sm:text-xs md:text-sm">
                            PDFForge
                            <span className="text-[10px] font-normal text-[#6e6a65] sm:text-[11px]">9:14</span>
                          </div>
                          <p className="text-[11px] leading-normal text-[#524f49] sm:text-xs md:text-sm">
                            Extracted 1,420 searchable words via WebWorker OCR (24ms). Applied diagonal 'CONFIDENTIAL' watermark to 14 pages.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-start gap-2 px-3">
                        <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f2f1f0]">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-baseline gap-1.5 text-[11px] font-medium text-[#0f0e0d] sm:text-xs md:text-sm">
                            Olivia Hartley
                            <span className="text-[10px] font-normal text-[#6e6a65] sm:text-[11px]">9:15</span>
                          </div>
                          <p className="text-[11px] leading-normal text-[#524f49] sm:text-xs md:text-sm">
                            Love this — saved me an afternoon.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-balance text-lg font-normal leading-[1.2] text-[#0f0e0d] sm:text-xl md:text-2xl">
                  Collaborate across Canvas, Scans, and Files
                </h3>
                <p className="text-sm leading-normal text-[#524f49] sm:text-base">
                  Whether you drop in raw image scans, stamp dynamic watermarks, or reorder pages, PDFForge keeps your document history, layers, and undo stack fully synchronized in IndexedDB.
                </p>
              </div>
            </article>

            {/* Card 3: Frontier Models / Engine List */}
            <article className="flex flex-col gap-6 sm:gap-8">
              <div className="pointer-events-none relative aspect-[4/3] select-none overflow-hidden rounded-md bg-[#f2f1f0]">
                <img
                  alt=""
                  src="/bg.jpg"
                  className="object-cover w-full h-full absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 rounded-md [background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent_50%),linear-gradient(135deg,transparent_50%,rgba(0,0,0,0.06))]" />
                <div className="absolute bottom-[-1.5rem] right-[-1.5rem] left-8 top-8 sm:left-10 sm:top-10 md:left-12 md:top-12">
                  <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-tl-lg bg-[#fafaf9] shadow-sm ring-1 ring-white/60">
                    <div className="flex items-center justify-between gap-2 border-b border-[#e5e5e3] px-3 py-2">
                      <h4 className="text-[11px] font-medium text-[#0f0e0d] sm:text-xs md:text-sm">Frontier engines</h4>
                    </div>
                    <div className="flex flex-col">
                      <div className="mx-3 flex items-center gap-3 p-3 border-b border-[#e5e5e3]">
                        <div className="h-7 w-7 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <h5 className="text-[11px] font-medium leading-normal text-[#0f0e0d] sm:text-xs md:text-sm">FontKit & pdf-lib</h5>
                          <p className="text-[10px] leading-normal text-[#524f49] sm:text-[11px]">Deep bytecode vector editing and font stream embedding</p>
                        </div>
                      </div>

                      <div className="mx-3 flex items-center gap-3 p-3 border-b border-[#e5e5e3]">
                        <div className="h-7 w-7 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <h5 className="text-[11px] font-medium leading-normal text-[#0f0e0d] sm:text-xs md:text-sm">PDF.js 3.11 WASM</h5>
                          <p className="text-[10px] leading-normal text-[#524f49] sm:text-[11px]">High-DPI canvas rendering and 300-DPI rasterization</p>
                        </div>
                      </div>

                      <div className="mx-3 flex items-center gap-3 p-3">
                        <div className="h-7 w-7 rounded-full bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <h5 className="text-[11px] font-medium leading-normal text-[#0f0e0d] sm:text-xs md:text-sm">Tesseract v5 OCR</h5>
                          <p className="text-[10px] leading-normal text-[#524f49] sm:text-[11px]">Local WebWorker character recognition and scanned OCR</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-balance text-lg font-normal leading-[1.2] text-[#0f0e0d] sm:text-xl md:text-2xl">
                  Swap frontier engines on the fly
                </h3>
                <p className="text-sm leading-normal text-[#524f49] sm:text-base">
                  Switch between advanced client-side compilers depending on your document needs. Choose speed, vector fidelity, or deep OCR recognition at any step.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4: MODEL WORKSPACE (6-GRID UNIFIED BORDER TABLE MATCHING RADIUS) */}
      <section className="bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="tools">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12">
          <header className="mb-10 flex flex-col gap-4 sm:mb-12 md:mb-16">
            <p className="text-sm font-normal text-[#524f49] sm:text-base">Model workspace</p>
            <h2 className="text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
              From prompts to production,<br />no manual steps
            </h2>
            <p className="max-w-xl text-sm leading-normal text-[#524f49] sm:text-base">
              Code diagnostics, repo monitoring, status reports, and integrations run automatically. Your team never has to track it manually.
            </p>
          </header>

          <div className="grid grid-cols-1 overflow-hidden rounded-md border border-[#e5e5e3] bg-white sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-r [&>*]:border-[#e5e5e3] [&>*:last-child]:border-b-0 sm:[&>*:nth-child(2n)]:border-r-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-child(2n)]:border-r lg:[&>*:nth-child(3n)]:border-r-0 lg:[&>*:nth-last-child(-n+3)]:border-b-0">
            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <Users className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Context-aware chats</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Seamlessly reference files, folders, issues, and code directly inside chat messages. The model stays fully aligned with your project.</p>
              </div>
            </article>

            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <PlaneTakeoff className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Dynamic code generation</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Autocomplete, refactor, and generate clean scripts and features with live compilation feedback. Accelerate development with zero syntax struggles.</p>
              </div>
            </article>

            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <Clock className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Automated workflows</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Set up automated agents that monitor repositories, update tickets, and summarize drafts on schedules. Free up senior engineers.</p>
              </div>
            </article>

            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <PenTool className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Interactive artifact views</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Iterate on UI mockups, documents, and markdown previews side-by-side inside the chat workspace. Design and review in real-time.</p>
              </div>
            </article>

            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <KeyRound className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Granular permissions</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Folder-level access control, role-based visibility, and full audit logs. Sensitive database credentials and customer records stay secure.</p>
              </div>
            </article>

            <article className="flex flex-col gap-6 p-6 sm:p-7 md:p-8">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#f2f1f0] text-[#0f0e0d] sm:h-10 sm:w-10">
                <Layers className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base font-medium leading-[1.3] text-[#0f0e0d] sm:text-lg">Direct integrations</h3>
                <p className="text-sm leading-relaxed text-[#524f49]">Sync with GitHub, Slack, Jira, Notion, and production databases to trigger complex actions using natural language.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 5: AGENTIC WORKSPACES / PIPELINE EXECUTION */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="pipeline">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="flex flex-col justify-between gap-8 md:col-span-5">
              <header className="flex flex-col gap-4">
                <p className="text-sm font-normal text-[#524f49] sm:text-base">Agentic workspaces</p>
                <h2 className="text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
                  Set up a task.<br />Watch it run locally.
                </h2>
                <p className="text-sm leading-normal text-[#524f49] sm:text-base">
                  Define tasks in plain English. PDFForge plans the execution steps, scans files, modifies code, and runs validations autonomously.
                </p>
              </header>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs text-[#524f49]">
                  <Check className="h-4 w-4 text-[#0f0e0d] shrink-0 mt-0.5" />
                  <span>Autonomous client-side execution in WebWorker thread</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-[#524f49]">
                  <Check className="h-4 w-4 text-[#0f0e0d] shrink-0 mt-0.5" />
                  <span>Pass variables directly into JSON project schemas</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-[#524f49]">
                  <Check className="h-4 w-4 text-[#0f0e0d] shrink-0 mt-0.5" />
                  <span>Grounded reasoning directly in your repository and files</span>
                </div>
              </div>
            </div>

            {/* Stepped Execution Log Card matching Radius */}
            <div className="md:col-span-7 rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 font-mono text-xs space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e5e5e3] pb-3">
                <span className="text-[#0f0e0d] font-bold">Execution Plan: Master-Agreement.pdf</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  COMPLETED (180ms)
                </span>
              </div>

              <div className="space-y-3 text-[#524f49]">
                <div>
                  <div className="flex items-center gap-2 text-[#0f0e0d] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>Read codebase files</span>
                  </div>
                  <div className="pl-3.5 text-[11px] text-[#524f49]">Analyzed 12 files in client directory</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#0f0e0d] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>Diagnose build errors</span>
                  </div>
                  <div className="pl-3.5 text-[11px] text-[#524f49]">Found unresolved external module node:fs/promises</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#0f0e0d] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>Modify page components</span>
                  </div>
                  <div className="pl-3.5 text-[11px] text-[#524f49]">Converted index page to Server Component</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#0f0e0d] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>Embed vector signatures & QR code</span>
                  </div>
                  <div className="pl-3.5 text-[11px] text-[#524f49]">Rendered 8 vector paths, 2 stamps, and 1 scannable QR verification code</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#0f0e0d] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span>Run build validation</span>
                  </div>
                  <div className="pl-3.5 text-[11px] text-emerald-700">✓ Turbopack build compiled in 2.4s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CONTEXT SYNTHESIS WITH SHIMMER HEADLINE */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="performance">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-sm font-normal text-[#524f49] sm:text-base">Context synthesis</p>
            <h2 className="shimmer-label text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.2] tracking-[-0.015em]">
              Grounded document editing with zero cloud exposure
            </h2>
            <p className="text-sm text-[#524f49] leading-relaxed">
              Compile notes, chats, issues, and documents into comprehensive summaries grounded in real team data.
            </p>
          </div>

          {/* Research Report Synthesis Mockup Card matching Radius */}
          <div className="max-w-4xl mx-auto rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e5e5e3] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-[#0f0e0d]">PDFForge Synthesis · Research Report</span>
              </div>
              <span className="text-[11px] font-mono text-[#524f49]">Sourced from local files & memory</span>
            </div>
            <div className="p-4 rounded-lg bg-[#f2f1f0] font-mono text-xs text-[#0f0e0d] space-y-2">
              <div className="text-[#524f49] font-bold uppercase text-[10px]">Reasoning</div>
              <p className="text-xs text-[#524f49] leading-relaxed">
                We compiled feedback, issue reports, and source files across your workspace. The context suggests all 42 pages are fully compliant with ISO 32000 specs. Zero external network requests were made during vector compilation…
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: BUILT FOR ROLES (3 CARDS WITH UNSPLASH IMAGERY MATCHING RADIUS) */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="people-agents">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
          <header className="max-w-2xl space-y-3">
            <p className="text-sm font-normal text-[#524f49] sm:text-base">Built for</p>
            <h2 className="text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
              Different roles. Same product.
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <article className="group relative overflow-hidden rounded-xl border border-[#e5e5e3] bg-[#f2f1f0] p-6 space-y-4 hover:border-[#0f0e0d] transition-all">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
                  alt="PDF bytecode and WebAssembly compiler terminal"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-[#524f49] uppercase">Deep WebAssembly bytecode for</span>
                <h3 className="text-lg font-medium text-[#0f0e0d]">Developers & Engineers</h3>
                <p className="text-xs text-[#524f49] leading-relaxed">
                  Inspect raw PDF streams, run local Tesseract OCR workers, embed custom fontkit tables, and parse JSON schemas.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-[#e5e5e3] bg-[#f2f1f0] p-6 space-y-4 hover:border-[#0f0e0d] transition-all">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80"
                  alt="Document layout design and vector signature studio"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-[#524f49] uppercase">Interactive vector canvas for</span>
                <h3 className="text-lg font-medium text-[#0f0e0d]">Designers & Creators</h3>
                <p className="text-xs text-[#524f49] leading-relaxed">
                  Draw natural cursive signatures with pressure sensitivity, embed custom typography, and export high-DPI rasterized image sets.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-[#e5e5e3] bg-[#f2f1f0] p-6 space-y-4 hover:border-[#0f0e0d] transition-all">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80"
                  alt="Legal contract review and document signing"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-[#524f49] uppercase">Compliance & redactions for</span>
                <h3 className="text-lg font-medium text-[#0f0e0d]">Legal & Operations</h3>
                <p className="text-xs text-[#524f49] leading-relaxed">
                  Blackout confidential PII, stamp scannable verification barcodes, apply watermarks, and auto-number agreement pages.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 8: PRICING (EXACT RADIUS 3-CARD PRICING WITH GLOWING RING) */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="pricing">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
          <header className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12 md:mb-16">
            <p className="text-sm font-normal text-[#524f49] sm:text-base">Pricing</p>
            <h2 className="max-w-3xl text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
              Simple pricing,<br />built to scale with you
            </h2>
            <p className="max-w-xl text-sm leading-normal text-[#524f49] sm:text-base">
              One flat per-user fee. No seat tiers, no add-on modules, no surprise integration costs.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Plan 1: Starter */}
            <div className="relative h-full">
              <article className="relative flex h-full flex-col rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-7 md:p-8 space-y-6">
                <header className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-medium text-[#0f0e0d]">Starter</h3>
                  <p className="text-xs text-[#524f49]">An AI companion to boost your day-to-day productivity.</p>
                </header>
                <div className="text-3xl font-normal text-[#0f0e0d]">$0 <span className="text-xs text-[#524f49]">/mo</span></div>
                <div className="mt-2">
                  <Link href="/editor" className="w-full text-center block rounded-md bg-[#0f0e0d] text-[#fafaf9] hover:bg-gray-800 py-2 text-xs font-medium transition-colors">
                    Start free trial
                  </Link>
                </div>
                <hr className="border-[#e5e5e3]" />
                <ul className="space-y-2.5 text-xs text-[#524f49]">
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Up to 5 team members</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Access to standard models & tools</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Basic file and document uploads</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Standard response times</li>
                </ul>
              </article>
            </div>

            {/* Plan 2: Growth (Featured White Highlight Card) */}
            <div className="relative h-full">
              <article className="relative flex h-full flex-col rounded-2xl border-2 border-[#0f0e0d] bg-white text-[#0f0e0d] p-6 sm:p-7 md:p-8 space-y-6 shadow-md">
                <header className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#0f0e0d]">Growth</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0f0e0d] text-white">Popular</span>
                  </div>
                  <p className="text-xs text-[#524f49]">Collaborative features for active engineering and product teams.</p>
                </header>
                <div className="text-3xl font-semibold text-[#0f0e0d]">$0 <span className="text-xs text-[#524f49] font-normal">/ 100% Free</span></div>
                <div className="mt-2">
                  <Link href="/editor" className="w-full text-center block rounded-md bg-[#0f0e0d] text-white hover:bg-neutral-800 py-2 text-xs font-medium transition-colors">
                    Start Growth Suite
                  </Link>
                </div>
                <hr className="border-[#e5e5e3]" />
                <ul className="space-y-2.5 text-xs text-[#524f49]">
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Unlimited team members</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Everything in Starter</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Advanced models & WebAssembly OCR</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Deep codebase index & file context</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Priority local compute support</li>
                </ul>
              </article>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="relative h-full">
              <article className="relative flex h-full flex-col rounded-2xl border border-[#e5e5e3] bg-white p-6 sm:p-7 md:p-8 space-y-6">
                <header className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-medium text-[#0f0e0d]">Enterprise</h3>
                  <p className="text-xs text-[#524f49]">Advanced compliance, custom models, and dedicated environments.</p>
                </header>
                <div className="text-3xl font-semibold text-[#0f0e0d]">Custom <span className="text-xs text-[#524f49] font-normal">/ air-gapped</span></div>
                <div className="mt-2">
                  <Link href="/contact" className="w-full text-center block rounded-md border border-[#e5e5e3] bg-white text-[#0f0e0d] hover:bg-[#f2f1f0] py-2 text-xs font-medium transition-colors">
                    Contact Advisory
                  </Link>
                </div>
                <hr className="border-[#e5e5e3]" />
                <ul className="space-y-2.5 text-xs text-[#524f49]">
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Everything in Growth</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> SOC 2 Type II, SSO/SAML, SCIM</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Zero-data-training guarantee</li>
                  <li className="flex items-center gap-2.5"><Check className="h-3.5 w-3.5 text-[#0f0e0d]" /> Dedicated CSM and custom SLAs</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: SECURITY & PRIVACY (WHITE THEME) */}
      <section className="border-t border-[#e5e5e3] bg-white text-[#0f0e0d] py-16 sm:py-20 md:py-24 lg:py-28" id="security">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="md:col-span-7 lg:col-span-8 space-y-4">
              <header className="flex flex-col gap-4">
                <p className="text-sm font-normal text-[#524f49] sm:text-base">Security & Privacy</p>
                <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
                  Enterprise-grade data safety
                </h2>
                <p className="max-w-2xl text-sm leading-normal text-[#524f49] sm:text-base">
                  SOC 2 Type II compliant, SSO/SAML authorization, folder-level permissions, and zero-data-training guarantees to keep your proprietary codebase and documents secure.
                </p>
              </header>
            </div>
            <div className="md:col-span-5 lg:col-span-4 p-6 rounded-2xl bg-[#fafaf9] border border-[#e5e5e3] space-y-3 font-mono text-xs shadow-sm">
              <div className="flex justify-between text-[#524f49] border-b border-[#e5e5e3] pb-2">
                <span>Upload Location:</span>
                <span className="text-emerald-700 font-bold">Client RAM</span>
              </div>
              <div className="flex justify-between text-[#524f49] border-b border-[#e5e5e3] pb-2">
                <span>OCR Engine:</span>
                <span className="text-blue-700 font-bold">WASM Worker</span>
              </div>
              <div className="flex justify-between text-[#524f49]">
                <span>Cloud Telemetry:</span>
                <span className="text-emerald-700 font-bold">Zero (0 bytes)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: INTEGRATIONS MATCHING RADIUS */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="integrations">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
          <header className="mb-10 flex flex-col gap-4 sm:mb-12 md:mb-16">
            <p className="text-sm font-normal text-[#524f49] sm:text-base">Integrations</p>
            <h2 className="text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
              Works where your team<br />already does
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="flex flex-col gap-3 rounded-xl border border-[#e5e5e3] bg-white p-6">
              <h3 className="text-base font-medium text-[#0f0e0d]">Slack agent</h3>
              <p className="text-xs text-[#524f49] leading-relaxed">
                A collaborative assistant for every developer, right in Slack. Troubleshoot build logs, check PR statuses, and query project documentation from the chat window your team lives in.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-xl border border-[#e5e5e3] bg-white p-6">
              <h3 className="text-base font-medium text-[#0f0e0d]">MCP interface</h3>
              <p className="text-xs text-[#524f49] leading-relaxed">
                Connect PDFForge to Claude web, Claude Code, Cursor, or any MCP-compatible host. Every workspace action is available over standard protocols.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-xl border border-[#e5e5e3] bg-white p-6">
              <h3 className="text-base font-medium text-[#0f0e0d]">Platform integrations</h3>
              <p className="text-xs text-[#524f49] leading-relaxed">
                Sync with GitHub, GitLab, Slack, Jira, Notion, Linear, Google Workspace, and Vercel. Codebase and document context flows securely.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 11: FAQ (5-COL / 7-COL SPLIT ACCORDION) */}
      <section className="border-t border-[#e5e5e3] bg-[#fafaf9] py-16 sm:py-20 md:py-24 lg:py-28" id="faq">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            <header className="flex flex-col gap-4 md:col-span-5">
              <p className="text-sm font-normal text-[#524f49] sm:text-base">FAQ</p>
              <h2 className="text-2xl font-normal leading-[1.2] tracking-[-0.015em] text-[#0f0e0d] sm:text-3xl md:text-4xl lg:text-[2.4rem]">
                Everything you need<br />to know
              </h2>
              <p className="text-sm leading-normal text-[#524f49] sm:text-base">
                Answers to the questions we hear most. Still curious? We&apos;re happy to chat.
              </p>
            </header>

            <div className="md:col-span-7 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#e5e5e3] bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-normal text-sm text-[#0f0e0d]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 text-[#524f49] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-[#524f49] leading-relaxed border-t border-[#e5e5e3] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
