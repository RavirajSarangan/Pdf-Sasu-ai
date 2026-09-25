import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ServerOff,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers,
  Lock,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "About PDFForge — The Browser-Native PDF Studio",
  description: "Learn about the mission, engineering principles, and client-side WebAssembly architecture behind PDFForge.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-20">
        
        {/* Header Section (Radius 12-col split) */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-12 border-b border-[#e5e5e3]">
          <p className="col-span-12 text-xs font-mono uppercase tracking-wider text-[#524f49]">About / Architecture</p>
          <h1 className="col-span-12 text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d] sm:text-4xl md:col-span-6 md:text-5xl lg:text-[3.2rem]">
            Built for privacy,<br />engineered for speed
          </h1>
          <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
            PDFForge is an open-standard, browser-native document workspace created to replace bloated desktop software and untrusted cloud converter services with 100% local WebAssembly computation.
          </p>
        </header>

        {/* System Visual Story Grid with High-Fidelity Unsplash Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="group rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80"
                  alt="Cryptographic local sandbox representing air-gapped document privacy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="text-xl font-normal text-[#0f0e0d]">Why Local Execution Matters</h2>
              <p className="text-xs sm:text-sm text-[#524f49] leading-relaxed">
                Traditional PDF editors upload your sensitive legal, medical, and financial documents to remote cloud servers. PDFForge processes every byte strictly in your browser tab's RAM sandbox, keeping your documents confidential by physical impossibility of cloud exposure.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e5e5e3] flex items-center gap-2 text-xs font-mono text-[#524f49]">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Zero external server telemetry</span>
            </div>
          </article>

          <article className="group rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
                  alt="WebAssembly compiled PDF bytecode parser and vector engine"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="text-xl font-normal text-[#0f0e0d]">WASM & Open PDF Standards</h2>
              <p className="text-xs sm:text-sm text-[#524f49] leading-relaxed">
                By leveraging compiled WebAssembly binaries (`pdf-lib`, `PDF.js 3.11`, `tesseract.js`, `perfect-freehand`), we achieve sub-millisecond document manipulation, vector rasterization, and OCR text extraction directly on your local CPU.
              </p>
            </div>
            <div className="pt-4 border-t border-[#e5e5e3] flex items-center gap-2 text-xs font-mono text-[#524f49]">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span>Native WebAssembly compilation</span>
            </div>
          </article>
        </div>

        {/* Comparison Architecture Matrix */}
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[#524f49]">Architecture Comparison</p>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#0f0e0d]">Cloud-Based vs. PDFForge</h2>
          </header>

          <div className="rounded-xl border border-[#e5e5e3] bg-white overflow-hidden">
            <div className="grid grid-cols-12 bg-[#f2f1f0] p-4 text-xs font-mono text-[#0f0e0d] border-b border-[#e5e5e3] font-bold">
              <div className="col-span-4">Capability / Dimension</div>
              <div className="col-span-4">Legacy Cloud PDF SaaS</div>
              <div className="col-span-4">PDFForge WebAssembly Suite</div>
            </div>

            <div className="divide-y divide-[#e5e5e3] text-xs text-[#524f49]">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-4 font-medium text-[#0f0e0d]">Data Transmission</div>
                <div className="col-span-4 text-red-600">Uploaded to third-party cloud</div>
                <div className="col-span-4 text-emerald-700 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> 100% In-Memory Local RAM
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-4 font-medium text-[#0f0e0d]">OCR Recognition</div>
                <div className="col-span-4">Metered per-page cloud API</div>
                <div className="col-span-4 text-emerald-700 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Tesseract WebWorker (Free)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-4 font-medium text-[#0f0e0d]">Offline Capability</div>
                <div className="col-span-4 text-red-600">Fails without internet</div>
                <div className="col-span-4 text-emerald-700 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> 100% Air-Gapped Ready
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-4 font-medium text-[#0f0e0d]">Pricing Model</div>
                <div className="col-span-4">$15-$30 / user / month</div>
                <div className="col-span-4 text-emerald-700 font-bold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> 100% Free & Open Suite
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl border border-[#e5e5e3] bg-white text-[#0f0e0d] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#0f0e0d]">Experience PDFForge Studio</h2>
            <p className="text-xs sm:text-sm text-[#524f49]">
              Edit, annotate, sign, and convert PDF documents directly in your browser.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/editor"
              className="rounded-lg bg-[#0f0e0d] px-5 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Launch Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
