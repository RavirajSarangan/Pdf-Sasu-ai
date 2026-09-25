"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 bg-[#fafaf9]">
      <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-xl p-8 shadow-xl space-y-6 text-center">
        {/* Brand */}
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-[#0f0e0d] flex items-center justify-center text-white mx-auto shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-normal text-[#0f0e0d]">
            No Login Required
          </h1>
          <p className="text-xs text-[#524f49] leading-relaxed max-w-xs mx-auto">
            PDFForge is 100% free and client-side. We do not require accounts, signups, passwords, or subscriptions.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#f2f1f0] font-mono text-xs text-[#524f49] space-y-2 text-left">
          <div className="flex items-center gap-2 text-[#0f0e0d] font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Zero-Friction Access</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All tools, visual editing, and OCR run directly in your browser with no cloud accounts needed.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/editor"
            className="w-full block rounded-lg bg-[#0f0e0d] px-5 py-3 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors"
          >
            Launch Visual Studio Editor
          </Link>

          <Link
            href="/dashboard"
            className="w-full block rounded-lg border border-[#e5e5e3] bg-white px-5 py-2.5 text-xs font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] transition-colors"
          >
            Go to My Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
