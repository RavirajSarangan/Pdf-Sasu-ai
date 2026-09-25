import { SplitPdfTool } from "@/components/tools/SplitPdfTool";

export const metadata = {
  title: "Split PDF Online Free — Extract Pages Instantly",
  description: "Split PDF files into individual pages or custom ranges without uploading to a server.",
};

export default function SplitPdfRoute() {
  return (
    <div className="py-12 px-4">
      <SplitPdfTool />
    </div>
  );
}
