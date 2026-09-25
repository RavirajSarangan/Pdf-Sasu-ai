import { PdfToImageTool } from "@/components/tools/PdfToImageTool";

export const metadata = {
  title: "PDF to Image Converter Free — High Resolution PNG & JPG",
  description: "Extract PDF pages to crisp PNG or JPG images with zero server uploads.",
};

export default function PdfToImageRoute() {
  return (
    <div className="py-12 px-4">
      <PdfToImageTool />
    </div>
  );
}
