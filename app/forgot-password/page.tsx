"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 bg-[#fafaf9]">
      <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-xl p-8 shadow-xl space-y-6 text-center">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-[#0f0e0d] flex items-center justify-center text-white mx-auto shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-normal text-[#0f0e0d]">
            No Password Required
          </h1>
          <p className="text-xs text-[#524f49] leading-relaxed max-w-xs mx-auto">
            PDFForge does not use passwords or user accounts. You can use all PDF tools freely anytime directly in your browser.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/editor"
            className="w-full block rounded-lg bg-[#0f0e0d] px-5 py-3 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors"
          >
            Launch Visual Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
