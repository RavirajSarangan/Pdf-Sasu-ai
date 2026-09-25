import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, ServerOff, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — SASU PDF Zero-Server Privacy",
  description: "Learn how SASU PDF protects your confidentiality by executing all PDF rendering, editing, and conversion locally in your browser memory.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-16">
        
        {/* Header Section */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-12 border-b border-[#e5e5e3]">
          <p className="col-span-12 text-xs font-mono uppercase tracking-wider text-[#524f49]">Legal / Governance</p>
          <h1 className="col-span-12 text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d] sm:text-4xl md:col-span-6 md:text-5xl lg:text-[3.2rem]">
            Zero-server privacy policy
          </h1>
          <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
            SASU PDF is engineered around a zero-knowledge, client-side processing model. We do not upload, read, store, or sell any document data or personal information.
          </p>
        </header>

        {/* Highlight Principle */}
        <div className="rounded-xl bg-[#0f0e0d] text-[#fafaf9] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <Lock className="w-4 h-4" /> CORE ARCHITECTURAL COMMITMENT
          </div>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-4xl">
            <strong>SASU PDF does not upload, read, store, or transmit the contents of your PDF files to external servers.</strong> All document parsing, rendering, text editing, vector drawing, signatures, and file exports are executed locally inside your web browser’s memory sandbox using WebAssembly and PDF.js.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-3 font-mono text-xs text-[#524f49]">
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">Document Ingestion:</div>
              <div>Client-Side Memory Sandbox</div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">Persistence:</div>
              <div>IndexedDB (Local to Browser)</div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">Third-Party Tracking:</div>
              <div>None (0 External Trackers)</div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8 text-xs sm:text-sm text-[#524f49] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">1. Document Processing</h2>
              <p>
                When you load a PDF into SASU PDF, the file bytes are read directly into your browser's JavaScript / WebAssembly runtime heap. No HTTP payloads containing document contents are ever transmitted to any remote servers, cloud functions, or external AI APIs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">2. Local Storage and Drafts</h2>
              <p>
                If you choose to save a document draft or bookmark a signed contract, that data is stored directly in your browser's local IndexedDB database on your hard drive. This storage is strictly subject to browser same-origin policies and cannot be accessed by other websites or remote actors.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">3. Optical Character Recognition (OCR)</h2>
              <p>
                OCR capabilities in SASU PDF are powered by a compiled WebAssembly port of Tesseract.js running in a local WebWorker thread. Image analysis occurs exclusively on your device's CPU.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">4. Regulatory Compliance</h2>
              <p>
                Because SASU PDF never processes or stores personal data on external infrastructure, usage of the platform naturally complies with GDPR, HIPAA, and SOC 2 data boundary requirements.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
