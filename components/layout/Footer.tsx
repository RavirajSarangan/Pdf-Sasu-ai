import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e3] bg-white text-[#0f0e0d]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5 lg:gap-12">
          {/* Brand & Status Column */}
          <div className="md:col-span-2 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-[#0f0e0d] flex items-center justify-center text-white">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <span className="text-lg font-semibold text-[#0f0e0d]">PDFForge</span>
              </Link>
              <p className="text-sm text-[#524f49] max-w-sm leading-relaxed">
                The next-generation browser-native PDF studio and document manipulation suite for modern teams.
              </p>
            </div>

            {/* Live Status indicator pill matching Radius */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e3] bg-[#fafaf9] px-3 py-1.5 text-xs font-normal text-[#524f49] w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>All systems normal • 100% Client-Side</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-[#0f0e0d]">Product</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#524f49]">
              <li>
                <Link href="/editor" className="hover:text-[#0f0e0d] transition-colors">
                  Visual Studio
                </Link>
              </li>
              <li>
                <Link href="/#why-radius" className="hover:text-[#0f0e0d] transition-colors">
                  Why PDFForge
                </Link>
              </li>
              <li>
                <Link href="/#pipeline" className="hover:text-[#0f0e0d] transition-colors">
                  Pipeline Execution
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#0f0e0d] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#0f0e0d] transition-colors">
                  Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-[#0f0e0d]">Tools</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#524f49]">
              <li>
                <Link href="/tools/ocr" className="hover:text-[#0f0e0d] transition-colors">
                  Client-Side OCR
                </Link>
              </li>
              <li>
                <Link href="/tools/barcode" className="hover:text-[#0f0e0d] transition-colors">
                  QR & Barcodes
                </Link>
              </li>
              <li>
                <Link href="/tools/watermark" className="hover:text-[#0f0e0d] transition-colors">
                  Watermark PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/page-numbers" className="hover:text-[#0f0e0d] transition-colors">
                  Page Numbers
                </Link>
              </li>
              <li>
                <Link href="/tools/merge" className="hover:text-[#0f0e0d] transition-colors">
                  Merge & Split
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="hover:text-[#0f0e0d] transition-colors">
                  Compress PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-[#0f0e0d]">Legal & Trust</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#524f49]">
              <li>
                <Link href="/security" className="hover:text-[#0f0e0d] transition-colors">
                  Security Overview
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0f0e0d] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0f0e0d] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0f0e0d] transition-colors">
                  About PDFForge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0f0e0d] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-16 pt-8 border-t border-[#e5e5e3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#524f49]">
          <p>© {new Date().getFullYear()} PDFForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#0f0e0d] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#0f0e0d] transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-[#0f0e0d] transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
