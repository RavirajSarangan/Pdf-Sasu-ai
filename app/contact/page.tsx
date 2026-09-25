"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, CheckCircle2, ArrowRight, Building2, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function ContactPage() {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    success("Message Received", "Thank you for reaching out to the PDFForge team.");
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-16 sm:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-16">
        
        {/* Header Section */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6 md:gap-x-8 pb-12 border-b border-[#e5e5e3]">
          <p className="col-span-12 text-xs font-mono uppercase tracking-wider text-[#524f49]">Contact & Advisory</p>
          <h1 className="col-span-12 text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d] sm:text-4xl md:col-span-6 md:text-5xl lg:text-[3.2rem]">
            Get in touch with<br />the PDFForge team
          </h1>
          <p className="col-span-12 text-sm leading-normal text-[#524f49] sm:text-base md:col-span-6 md:col-start-7">
            Have questions about client-side document processing, enterprise self-hosting, custom tool integrations, or feedback on our visual editor? We're here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Info Column */}
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-normal text-[#0f0e0d]">Enterprise & Community</h2>
              <p className="text-xs sm:text-sm text-[#524f49] leading-relaxed">
                PDFForge is built for high-performance engineering teams, legal departments, and creators who need fast, zero-leak PDF manipulation.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs text-[#524f49]">
              <div className="p-4 rounded-xl border border-[#e5e5e3] bg-white space-y-1">
                <div className="text-[#0f0e0d] font-bold">General Inquiries</div>
                <div>support@pdfforge.local</div>
              </div>

              <div className="p-4 rounded-xl border border-[#e5e5e3] bg-white space-y-1">
                <div className="text-[#0f0e0d] font-bold">Architecture & Security Advisory</div>
                <div>security@pdfforge.local</div>
              </div>

              <div className="p-4 rounded-xl border border-[#e5e5e3] bg-white space-y-1">
                <div className="text-[#0f0e0d] font-bold">Deployment Target</div>
                <div>Static WebAssembly CDN (Zero Backend)</div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 rounded-xl border border-[#e5e5e3] bg-white p-6 sm:p-8 space-y-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#0f0e0d]">
                    Message / Feedback
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Describe your inquiry, bug report, or enterprise requirement..."
                    className="w-full p-3.5 rounded-lg border border-[#e5e5e3] bg-white text-xs text-[#0f0e0d] placeholder:text-[#524f49] focus:outline-none focus:border-[#0f0e0d]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#0f0e0d] px-6 py-3 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-[#0f0e0d]">Message Dispatched</h3>
                  <p className="text-xs text-[#524f49] max-w-sm mx-auto">
                    Thank you for reaching out. We have logged your request and will respond shortly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
