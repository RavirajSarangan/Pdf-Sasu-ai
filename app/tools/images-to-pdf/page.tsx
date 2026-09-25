import { ImagesToPdfTool } from "@/components/tools/ImagesToPdfTool";

export const metadata = {
  title: "Convert JPG & PNG Images to PDF Free — PDFForge",
  description: "Combine multiple photos and image files into a single PDF document in your browser.",
};

export default function ImagesToPdfPage() {
  return (
    <div className="py-12 px-4">
      <ImagesToPdfTool />
    </div>
  );
}
