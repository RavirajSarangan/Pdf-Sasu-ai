import { OcrPdfTool } from "@/components/tools/OcrPdfTool";

export const metadata = {
  title: "Extract Text from PDF & Scans (OCR Free) — SASU PDF",
  description: "Recognize and extract text from scanned documents and images locally in your browser with zero server uploads.",
};

export default function OcrToolPage() {
  return (
    <div className="py-12 px-4">
      <OcrPdfTool />
    </div>
  );
}
