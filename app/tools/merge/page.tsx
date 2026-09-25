import { MergePdfTool } from "@/components/tools/MergePdfTool";

export const metadata = {
  title: "Merge PDF Files Online Free — PDFForge",
  description: "Combine multiple PDF documents into one single file directly in your browser with zero server uploads.",
};

export default function MergeToolPage() {
  return (
    <div className="py-12 px-4">
      <MergePdfTool />
    </div>
  );
}
