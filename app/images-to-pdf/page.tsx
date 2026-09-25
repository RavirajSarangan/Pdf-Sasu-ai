import { ImagesToPdfTool } from "@/components/tools/ImagesToPdfTool";

export const metadata = {
  title: "Images to PDF Online Free — Convert JPG & PNG to PDF",
  description: "Merge multiple images into a standard PDF document in seconds.",
};

export default function ImagesToPdfRoute() {
  return (
    <div className="py-12 px-4">
      <ImagesToPdfTool />
    </div>
  );
}
