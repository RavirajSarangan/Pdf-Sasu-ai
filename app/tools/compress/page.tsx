import { CompressPdfTool } from "@/components/tools/CompressPdfTool";

export const metadata = {
  title: "Compress PDF Online Free — SASU PDF",
  description: "Reduce PDF file size locally without uploading your documents to cloud servers.",
};

export default function CompressToolPage() {
  return (
    <div className="py-12 px-4">
      <CompressPdfTool />
    </div>
  );
}
