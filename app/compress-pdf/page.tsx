import { CompressPdfTool } from "@/components/tools/CompressPdfTool";

export const metadata = {
  title: "Compress PDF Online Free — Safe & Local",
  description: "Reduce PDF file size locally in your browser with zero data leakage.",
};

export default function CompressPdfRoute() {
  return (
    <div className="py-12 px-4">
      <CompressPdfTool />
    </div>
  );
}
