import React from "react";
import Link from "next/link";
import { FileCheck, Shield, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — PDFForge",
  description: "Terms and conditions governing the use of the PDFForge browser-native document suite.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-16">
        
        {/* Header Section */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-12 border-b border-[#e5e5e3]">
          <p className="col-span-12 text-xs font-mono uppercase tracking-wider text-[#524f49]">Legal / Terms</p>
          <h1 className="col-span-12 text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d] sm:text-4xl md:col-span-6 md:text-5xl lg:text-[3.2rem]">
            Terms of service
          </h1>
          <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
            Clear, transparent, and fair terms for using PDFForge's client-side suite. Free to use with zero hidden export watermarks or lock-in.
          </p>
        </header>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-3 font-mono text-xs text-[#524f49]">
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">License Type:</div>
              <div>Free Client-Side Utility</div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">Document Ownership:</div>
              <div>100% Retained by User</div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-[#e5e5e3] space-y-1">
              <div className="text-[#0f0e0d] font-bold">Commercial Use:</div>
              <div>Permitted Without Royalties</div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8 text-xs sm:text-sm text-[#524f49] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">1. Acceptance of Terms</h2>
              <p>
                By accessing and using PDFForge, you agree to these Terms of Service. If you do not agree, you should refrain from using the application.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">2. Document Ownership & Intellectual Property</h2>
              <p>
                You retain complete, unencumbered ownership and all copyright rights over any documents, files, images, vector strokes, signatures, and annotations created or modified with PDFForge. PDFForge claims zero rights over your processed files.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">3. Local Execution & Liability</h2>
              <p>
                PDFForge executes entirely on your device's browser runtime. We do not maintain copies of your files. Consequently, you are responsible for maintaining backups of your original documents prior to performing destructive operations like page deletion or redaction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-medium text-[#0f0e0d]">4. Acceptable Use</h2>
              <p>
                You agree not to use PDFForge to forge fraudulent documents or create malicious payloads designed to exploit vulnerabilities in legacy PDF viewers.
              </p>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
