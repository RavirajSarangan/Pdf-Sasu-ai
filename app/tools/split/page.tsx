import { SplitPdfTool } from "@/components/tools/SplitPdfTool";

export const metadata = {
  title: "Split PDF & Extract Pages Online Free — SASU PDF",
  description: "Extract specific pages or separate page ranges from your PDF document for free with 100% local privacy.",
};

export default function SplitToolPage() {
  return (
    <div className="py-12 px-4">
      <SplitPdfTool />
    </div>
  );
}
