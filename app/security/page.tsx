import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cpu,
  ServerOff,
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Terminal,
  FileCheck,
} from "lucide-react";

export const metadata = {
  title: "Security & Privacy Architecture — SASU PDF",
  description: "Explore the air-gapped technical security architecture and cryptographic sandbox that keeps your documents private in SASU PDF.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-16">
        
        {/* Header Section */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-12 border-b border-[#e5e5e3]">
          <p className="col-span-12 text-xs font-mono uppercase tracking-wider text-[#524f49]">Security & Cryptography</p>
          <h1 className="col-span-12 text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d] sm:text-4xl md:col-span-6 md:text-5xl lg:text-[3.2rem]">
            Air-gapped security by architecture
          </h1>
          <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
            SASU PDF doesn't just promise privacy through legal policies—we enforce it through physical architectural isolation: 100% client-side WebAssembly execution with zero server intermediaries.
          </p>
        </header>

        {/* Security Diagnostics Monitor (Pure White Radius Design) */}
        <div className="rounded-2xl bg-white text-[#0f0e0d] p-6 sm:p-10 space-y-8 shadow-sm border border-[#e5e5e3]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e3] pb-5">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-lg font-medium text-[#0f0e0d]">Client-Side Memory Sandbox Diagnostics</h2>
                <p className="text-xs text-[#524f49] font-mono">Process ID #88491 • WebWorker Thread [WASM_ISOLATED]</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
              AIR-GAPPED ENVIRONMENT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-2">
              <span className="text-[#716e68] block uppercase text-[10px]">Data Ingestion Plane</span>
              <div className="text-emerald-700 font-bold text-sm">Local ArrayBuffer</div>
              <p className="text-[11px] text-[#524f49] leading-relaxed">
                Documents read via FileReader API directly into client heap. 0 bytes written to remote disks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-2">
              <span className="text-[#716e68] block uppercase text-[10px]">Cryptography & Hashing</span>
              <div className="text-blue-700 font-bold text-sm">WebCrypto SHA-256</div>
              <p className="text-[11px] text-[#524f49] leading-relaxed">
                All document verification and digital signature hashes calculated natively in browser crypto APIs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-2">
              <span className="text-[#716e68] block uppercase text-[10px]">Persistence Driver</span>
              <div className="text-amber-700 font-bold text-sm">IndexedDB IDBStore</div>
              <p className="text-[11px] text-[#524f49] leading-relaxed">
                Stored documents isolated under Same-Origin Policy (SOP). Cross-tab isolation guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Core Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-4">
            <div className="h-9 w-9 rounded-lg bg-[#f2f1f0] text-[#0f0e0d] flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-[#0f0e0d]">In-Memory Execution</h3>
            <p className="text-xs text-[#524f49] leading-relaxed">
              All PDF bytecode parsing, vector rasterization, font embedding, and image compression execute inside your browser tab's isolated V8/WASM memory space.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-4">
            <div className="h-9 w-9 rounded-lg bg-[#f2f1f0] text-[#0f0e0d] flex items-center justify-center">
              <ServerOff className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-[#0f0e0d]">Zero Remote Proxies</h3>
            <p className="text-xs text-[#524f49] leading-relaxed">
              Unlike cloud services that proxy your files to remote backends for processing, SASU PDF has zero document upload APIs or external storage buckets.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-4">
            <div className="h-9 w-9 rounded-lg bg-[#f2f1f0] text-[#0f0e0d] flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-normal text-[#0f0e0d]">Compliance & NDA Safe</h3>
            <p className="text-xs text-[#524f49] leading-relaxed">
              Inherently compatible with HIPAA, GDPR, SOC 2, and corporate NDA requirements since no patient or corporate records are ever transmitted over external networks.
            </p>
          </div>
        </div>

        {/* Regulatory Matrix */}
        <div className="rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-normal text-[#0f0e0d]">Regulatory & Compliance Posture</h3>
            <p className="text-xs text-[#524f49]">Why zero-upload architecture makes audits effortless</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#f2f1f0] space-y-1.5 text-xs font-mono">
              <div className="font-bold text-[#0f0e0d]">GDPR Article 25</div>
              <p className="text-[11px] text-[#524f49]">Data protection by design & by default via total local containment.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f2f1f0] space-y-1.5 text-xs font-mono">
              <div className="font-bold text-[#0f0e0d]">HIPAA Safe Harbor</div>
              <p className="text-[11px] text-[#524f49]">PHI never crosses the boundary to unauthorized business associates.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f2f1f0] space-y-1.5 text-xs font-mono">
              <div className="font-bold text-[#0f0e0d]">SOC 2 Type II</div>
              <p className="text-[11px] text-[#524f49]">Eliminates cloud data-at-rest encryption vulnerabilities.</p>
            </div>

            <div className="p-4 rounded-lg bg-[#f2f1f0] space-y-1.5 text-xs font-mono">
              <div className="font-bold text-[#0f0e0d]">Air-Gapped Ready</div>
              <p className="text-[11px] text-[#524f49]">Can run completely offline inside restricted enterprise LANs.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
