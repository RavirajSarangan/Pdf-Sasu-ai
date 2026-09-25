"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Layers,
  Scissors,
  Minimize2,
  FileImage,
  PenTool,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Hash,
  QrCode,
  Stamp,
  ArrowUpRight,
} from "lucide-react";
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  // In editor page, we use custom minimalist top toolbar instead of general landing navbar
  if (pathname.startsWith("/editor")) {
    return null;
  }

  const toolsList = [
    { name: "Visual Studio", href: "/editor", icon: PenTool, desc: "Full-featured visual PDF editor" },
    { name: "Merge PDF", href: "/tools/merge", icon: Layers, desc: "Combine multiple PDFs in order" },
    { name: "Split PDF", href: "/tools/split", icon: Scissors, desc: "Extract pages or separate ranges" },
    { name: "Compress PDF", href: "/tools/compress", icon: Minimize2, desc: "Reduce PDF size locally" },
    { name: "Client-Side OCR", href: "/tools/ocr", icon: Sparkles, desc: "Extract text from scanned PDFs" },
    { name: "Watermark PDF", href: "/tools/watermark", icon: Stamp, desc: "Stamp confidential notices" },
    { name: "Page Numbers", href: "/tools/page-numbers", icon: Hash, desc: "Add page numbering & footers" },
    { name: "QR & Barcode", href: "/tools/barcode", icon: QrCode, desc: "2D QR & 1D Barcode generator" },
    { name: "PDF to Images", href: "/tools/pdf-to-image", icon: FileImage, desc: "Convert PDF pages to PNG/JPG" },
    { name: "Images to PDF", href: "/tools/images-to-pdf", icon: FileText, desc: "Convert JPG/PNG to clean PDF" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e5e3]">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#0f0e0d] flex items-center justify-center text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold text-[#0f0e0d] tracking-[-0.015em]">SASU PDF</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/editor"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
          >
            Studio Editor
          </Link>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
            >
              Tools Suite
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {toolsDropdownOpen && (
              <div
                onMouseLeave={() => setToolsDropdownOpen(false)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 rounded-xl bg-white border border-[#e5e5e3] shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150 z-50"
              >
                <div className="grid grid-cols-2 gap-1.5">
                  {toolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex flex-col p-2.5 rounded-lg hover:bg-[#f2f1f0] transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon className="h-3.5 w-3.5 text-[#0f0e0d]" />
                          <span className="text-xs font-semibold text-[#0f0e0d]">
                            {tool.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#524f49] leading-tight">
                          {tool.desc}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-[#e5e5e3] text-center">
                  <Link
                    href="/tools"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="text-xs font-medium text-[#0f0e0d] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Tools</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
          >
            Workspace
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
          >
            About
          </Link>
          <Link
            href="/security"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
          >
            Security
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right CTA (Direct Launch without Login) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#524f49] hover:text-[#0f0e0d] transition-colors px-3 py-2"
          >
            My Workspace
          </Link>
          <Link
            href="/editor"
            className="rounded-lg bg-[#0f0e0d] px-4 py-2 text-sm font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Launch Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#524f49] hover:bg-[#f2f1f0] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 sm:px-6 pt-2 pb-6 space-y-3 bg-white border-t border-[#e5e5e3]">
          <Link
            href="/editor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            Studio Editor
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            My Workspace
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            All 10 Tools
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            Security & Privacy
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] rounded-md"
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-[#e5e5e3]">
            <Link
              href="/editor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block rounded-lg bg-[#0f0e0d] px-4 py-2.5 text-sm font-medium text-[#fafaf9]"
            >
              Open Visual Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
