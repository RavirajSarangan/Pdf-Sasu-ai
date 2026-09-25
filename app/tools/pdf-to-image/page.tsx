import { PdfToImageTool } from "@/components/tools/PdfToImageTool";

export const metadata = {
  title: "Convert PDF to PNG & JPG Images Free — PDFForge",
  description: "Extract PDF pages into high-resolution PNG or JPG image files with instant client-side rendering.",
};

export default function PdfToImagePage() {
  return (
    <div className="py-12 px-4">
      <PdfToImageTool />
    </div>
  );
}
