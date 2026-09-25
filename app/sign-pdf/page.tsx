import Link from "next/link";
import { FileSignature, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Sign PDF Online Free — Legally Binding Digital Signatures",
  description: "Sign PDF documents online with draw, type, and upload signature tools. 100% private and client-side.",
};

export default function SignPdfPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
        <FileSignature className="w-3.5 h-3.5 text-neutral-900" /> Digital Signatures Studio
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#0f0e0d] tracking-tight">
          Sign PDF Documents Online Free
        </h1>
        <p className="text-sm text-[#524f49]">
          Draw with mouse/touch, type with calligraphy script fonts, or upload your signature image. Processed 100% on your device.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/editor">
          <Button size="lg" variant="primary" className="gap-2 font-semibold">
            Open PDF in Editor to Sign
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
          <div className="font-bold text-sm text-[#0f0e0d]">Draw Signature</div>
          <p className="text-xs text-neutral-500">Smooth bezier canvas drawing with mouse, trackpad, or finger.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
          <div className="font-bold text-sm text-[#0f0e0d]">Type Name</div>
          <p className="text-xs text-neutral-500">Choose from curated calligraphy and cursive executive styles.</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
          <div className="font-bold text-sm text-[#0f0e0d]">Upload Image</div>
          <p className="text-xs text-neutral-500">Upload PNG/JPG with automatic background transparency removal.</p>
        </div>
      </div>
    </div>
  );
}
