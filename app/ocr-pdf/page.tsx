import { OcrPdfTool } from "@/components/tools/OcrPdfTool";

export const metadata = {
  title: "Free Online PDF OCR — Convert Scans to Text",
  description: "Extract text from scanned PDFs and photos using client-side WebAssembly Optical Character Recognition.",
};

export default function OcrPdfRoute() {
  return (
    <div className="py-12 px-4">
      <OcrPdfTool />
    </div>
  );
}
