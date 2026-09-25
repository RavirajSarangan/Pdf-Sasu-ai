import { Metadata } from "next";
import { WatermarkPdfTool } from "@/components/tools/WatermarkPdfTool";

export const metadata: Metadata = {
  title: "Watermark PDF Online - Free & Private | PDFForge",
  description: "Stamp text, confidential watermarks, and copyright marks across all PDF pages. 100% private, client-side, and free.",
};

export default function WatermarkSeoPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <WatermarkPdfTool />
    </div>
  );
}
