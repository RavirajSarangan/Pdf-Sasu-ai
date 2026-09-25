import { redirect } from "next/navigation";

export const metadata = {
  title: "Online PDF Editor Free — PDFForge",
  description: "Free visual PDF editor with text editing, highlights, signatures, page reorganization, and download.",
};

export default function PdfEditorRedirectPage() {
  redirect("/editor");
}
