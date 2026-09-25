import { Metadata } from "next";
import { PageNumbersTool } from "@/components/tools/PageNumbersTool";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF - Free Online | SASU PDF",
  description: "Easily add page numbers, counts, and headers to your PDF documents. Select positions, formatting, and numbering offset.",
};

export default function PageNumbersPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <PageNumbersTool />
    </div>
  );
}
