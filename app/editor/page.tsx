"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PDFEditorView } from "@/components/pdf-editor/PDFEditorView";
import { documentStore } from "@/lib/storage/document-store";

function EditorContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const docId = searchParams.get("id");

  const [initialPdfUrl, setInitialPdfUrl] = React.useState<string | undefined>(
    isDemo ? "/sample.pdf" : undefined
  );

  React.useEffect(() => {
    if (docId) {
      documentStore.getDocument(docId).then((doc) => {
        if (doc && doc.pdfData) {
          // Convert arrayBuffer to blob URL
          const blob = new Blob([doc.pdfData as any], { type: "application/pdf" });
          setInitialPdfUrl(URL.createObjectURL(blob));
        }
      });
    } else if (isDemo) {
      setInitialPdfUrl("/sample.pdf");
    }
  }, [docId, isDemo]);

  return <PDFEditorView initialPdfUrl={initialPdfUrl} initialDocumentId={docId || undefined} />;
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-white text-sm text-neutral-500 font-medium">
          Loading SASU PDF Studio...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
