import { Metadata } from "next";
import { BarcodeTool } from "@/components/tools/BarcodeTool";

export const metadata: Metadata = {
  title: "Free QR Code & Barcode Generator | PDFForge",
  description: "Create scannable 2D QR codes and enterprise 1D Barcodes (Code128, EAN13, UPC, Code39) with custom colors and instant download.",
};

export default function BarcodeSeoPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <BarcodeTool />
    </div>
  );
}
