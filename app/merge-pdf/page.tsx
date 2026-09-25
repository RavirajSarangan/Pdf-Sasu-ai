import { MergePdfTool } from "@/components/tools/MergePdfTool";

export const metadata = {
  title: "Merge PDF Online Free — Fast & Private",
  description: "Combine multiple PDF files into one single document. 100% free and client-side.",
};

export default function MergePdfPage() {
  return (
    <div className="py-12 px-4">
      <MergePdfTool />
    </div>
  );
}
