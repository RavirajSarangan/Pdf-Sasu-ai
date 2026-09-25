import Link from "next/link";
import { PenTool, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Annotate PDF Online Free — Highlights, Drawings & Shapes",
  description: "Highlight text, draw freehand annotations, and insert shapes into PDF documents online.",
};

export default function AnnotatePdfPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
        <PenTool className="w-3.5 h-3.5 text-neutral-900" /> High-Precision Annotations
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#0f0e0d] tracking-tight">
          Annotate & Markup PDFs Online
        </h1>
        <p className="text-sm text-[#524f49]">
          Add highlights, underline, strikethrough, freehand pen sketches, shapes, arrows, and sticky notes.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/editor">
          <Button size="lg" variant="primary" className="gap-2 font-semibold">
            Launch PDF Markup Editor
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
