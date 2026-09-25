import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e3] bg-white text-[#0f0e0d]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20">
        
        {/* AI / LLM & Answer Engine Interactive Launchers (ASO / AEO Functional) */}
        <div className="mb-14 rounded-2xl border border-[#e5e5e3] bg-[#fafaf9] p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
            {/* ChatGPT */}
            <a
              href="https://chatgpt.com/?q=How+to+use+SASU+PDF+for+private+browser+native+pdf+editing+and+ocr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs hover:border-[#10a37f] hover:shadow-xs transition-all group cursor-pointer"
              title="Open SASU PDF prompt in ChatGPT"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#10a37f]/10 flex items-center justify-center text-[#10a37f] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1635a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4023-.6863zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.009 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0568V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813v6.7219zm1.2587-2.7346l2.4346-1.4057 2.4346 1.4057v2.8114l-2.4346 1.4057-2.4346-1.4057z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0f0e0d] group-hover:text-[#10a37f] transition-colors">ChatGPT</span>
                  <span className="block text-[10px] text-[#524f49]">OpenAI Verified</span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#a8a29e] group-hover:text-[#10a37f] transition-colors shrink-0" />
            </a>

            {/* Claude */}
            <a
              href="https://claude.ai/new?q=Tell+me+how+to+use+SASU+PDF+for+private+browser+editing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs hover:border-[#d97706] hover:shadow-xs transition-all group cursor-pointer"
              title="Open SASU PDF prompt in Claude"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#d97706]/10 flex items-center justify-center text-[#d97706] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M4.5 12a7.5 7.5 0 0 1 15 0 7.5 7.5 0 0 1-15 0zm7.5-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-4.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z" />
                    <circle cx="12" cy="12" r="2.2" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0f0e0d] group-hover:text-[#d97706] transition-colors">Claude</span>
                  <span className="block text-[10px] text-[#524f49]">Anthropic AEO</span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#a8a29e] group-hover:text-[#d97706] transition-colors shrink-0" />
            </a>

            {/* Google AI */}
            <a
              href="https://www.google.com/search?q=SASU+PDF+AI+studio+and+pdf+editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all group cursor-pointer"
              title="Search SASU PDF on Google AI"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0f0e0d] group-hover:text-blue-600 transition-colors">Google AI</span>
                  <span className="block text-[10px] text-[#524f49]">Search & Overviews</span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#a8a29e] group-hover:text-blue-600 transition-colors shrink-0" />
            </a>

            {/* Grok */}
            <a
              href="https://x.com/i/grok?text=Explain+how+SASU+PDF+works+with+100%25+browser+native+privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs hover:border-black hover:shadow-xs transition-all group cursor-pointer"
              title="Query SASU PDF in Grok"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0f0e0d]">Grok</span>
                  <span className="block text-[10px] text-[#524f49]">xAI Indexed</span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#a8a29e] group-hover:text-black transition-colors shrink-0" />
            </a>

            {/* Gemini */}
            <a
              href="https://gemini.google.com/app?text=How+does+SASU+PDF+edit+existing+text+in+PDFs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs hover:border-purple-500 hover:shadow-xs transition-all group cursor-pointer"
              title="Prompt SASU PDF in Google Gemini"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#0f0e0d] group-hover:text-purple-600 transition-colors">Gemini</span>
                  <span className="block text-[10px] text-[#524f49]">Google DeepMind</span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#a8a29e] group-hover:text-purple-600 transition-colors shrink-0" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5 lg:gap-12">
          {/* Brand & Status Column */}
          <div className="md:col-span-2 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-[#0f0e0d] flex items-center justify-center text-white">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <span className="text-lg font-semibold text-[#0f0e0d]">SASU PDF</span>
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
                  Why SASU PDF
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
                  About SASU PDF
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
          <p>© {new Date().getFullYear()} SASU PDF. All rights reserved.</p>
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

