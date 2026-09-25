"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Annotation,
  ToolType,
  PageMetadata,
  PDFDocMetadata,
  EditorHistoryState,
  StampAnnotation,
  BarcodeAnnotation,
  WatermarkOptions,
  PageNumberOptions,
} from "@/types/pdf";
import { loadPdfDocument, extractTextFromPdf, generatePageThumbnail } from "@/lib/pdf/pdfjs-init";
import { exportPdfWithAnnotations, printPdfBuffer, watermarkPdf, addPageNumbersToPdf } from "@/lib/pdf/pdf-manipulation";
import { documentStore } from "@/lib/storage/document-store";
import { useToast } from "@/components/ui/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { downloadArrayBuffer, cn } from "@/lib/utils";
import confetti from "canvas-confetti";

import { EditorToolbar } from "./EditorToolbar";
import { EditorLeftSidebar } from "./EditorLeftSidebar";
import { EditorRightSidebar } from "./EditorRightSidebar";
import { EditorCanvas } from "./EditorCanvas";
import { SignatureModal } from "./SignatureModal";
import { ImageUploadModal } from "./ImageUploadModal";
import { StampModal } from "./StampModal";
import { BarcodeModal } from "./BarcodeModal";
import { WatermarkModal } from "./WatermarkModal";
import { PageNumbersModal } from "./PageNumbersModal";
import { DocMetadataModal } from "./DocMetadataModal";
import { PageManagerModal } from "./PageManagerModal";
import { SearchModal } from "./SearchModal";
import { Upload, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PDFEditorViewProps {
  initialPdfUrl?: string;
  initialDocumentId?: string;
}

export function PDFEditorView({ initialPdfUrl, initialDocumentId }: PDFEditorViewProps) {
  const { success, error, info } = useToast();

  // Document Raw State
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [documentTitle, setDocumentTitle] = useState("Untitled-Document.pdf");
  const [fileSizeBytes, setFileSizeBytes] = useState(0);
  const [docMetadata, setDocMetadata] = useState<PDFDocMetadata>({});

  // Editor Navigation & Pages
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoom, setZoom] = useState(1.0);

  // Tool State
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  // Default styling for new objects
  const [activeColor, setActiveColor] = useState("#2563eb");
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(3);
  const [activeFontSize, setActiveFontSize] = useState(16);
  const [activeFontFamily, setActiveFontFamily] = useState("Helvetica");
  const [activeOpacity, setActiveOpacity] = useState(1.0);

  // Modals & Panels
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isPageNumbersModalOpen, setIsPageNumbersModalOpen] = useState(false);
  const [isProcessingDocAction, setIsProcessingDocAction] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isPageManagerOpen, setIsPageManagerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Text search data
  const [pdfTextData, setPdfTextData] = useState<{ pageIndex: number; text: string }[]>([]);

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<EditorHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Loading & Export state
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Record History State
  const pushHistory = useCallback(
    (newAnnotations: Annotation[], newPages: PageMetadata[]) => {
      const state: EditorHistoryState = {
        annotations: JSON.parse(JSON.stringify(newAnnotations)),
        pages: JSON.parse(JSON.stringify(newPages)),
        activePageIndex,
      };

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, state];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [activePageIndex, historyIndex]
  );

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetState = history[prevIndex];
      setAnnotations(targetState.annotations);
      setPages(targetState.pages);
      setHistoryIndex(prevIndex);
      info("Undo");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = history[nextIndex];
      setAnnotations(targetState.annotations);
      setPages(targetState.pages);
      setHistoryIndex(nextIndex);
      info("Redo");
    }
  };

  // Load PDF Buffer
  const loadPdfBytesIntoEditor = async (bytes: Uint8Array, fileName: string) => {
    setIsLoadingDoc(true);
    try {
      setPdfBytes(bytes);
      setDocumentTitle(fileName);
      setFileSizeBytes(bytes.byteLength);

      const doc = await loadPdfDocument(bytes);
      setPdfDoc(doc);

      const numPages = doc.numPages;
      const initialPages: PageMetadata[] = [];

      for (let i = 0; i < numPages; i++) {
        const page = await doc.getPage(i + 1);
        initialPages.push({
          pageIndex: i,
          originalIndex: i,
          rotation: 0,
          width: page.view[2] - page.view[0],
          height: page.view[3] - page.view[1],
          scale: 1.0,
          thumbnailUrl: "",
        });
      }

      setPages(initialPages);
      setActivePageIndex(0);
      setAnnotations([]);
      setSelectedAnnotationId(null);

      setHistory([{ annotations: [], pages: initialPages, activePageIndex: 0 }]);
      setHistoryIndex(0);

      extractTextFromPdf(doc).then(setPdfTextData).catch(console.error);

      // Generate thumbnails sequentially in the background without blocking main canvas
      (async () => {
        for (let i = 0; i < initialPages.length; i++) {
          try {
            // Small pause between thumbnail generation to yield to main UI thread
            await new Promise((r) => setTimeout(r, 60 * i + 50));
            const thumb = await generatePageThumbnail(doc, i);
            if (thumb) {
              setPages((prev) =>
                prev.map((p) => (p.pageIndex === i ? { ...p, thumbnailUrl: thumb } : p))
              );
            }
          } catch (e) {
            console.error("Thumbnail error:", e);
          }
        }
      })();

      documentStore.saveDocument(
        {
          id: "doc_" + Date.now(),
          name: fileName,
          sizeBytes: bytes.byteLength,
          totalPages: numPages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        bytes
      );

      trackEvent("pdf_uploaded", { pageCount: numPages });
      success("PDF Loaded successfully", `${fileName} (${numPages} pages)`);
    } catch (err: any) {
      console.error("Failed to load PDF:", err);
      error("Unable to open PDF", err.message || "File might be encrypted or corrupted.");
    } finally {
      setIsLoadingDoc(false);
    }
  };

  // Initial Load from URL or Demo
  useEffect(() => {
    async function loadInitial() {
      if (initialPdfUrl) {
        setIsLoadingDoc(true);
        try {
          const res = await fetch(initialPdfUrl);
          const buf = await res.arrayBuffer();
          const name = initialPdfUrl.split("/").pop() || "sample.pdf";
          await loadPdfBytesIntoEditor(new Uint8Array(buf), name);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingDoc(false);
        }
      }
    }
    loadInitial();
  }, [initialPdfUrl]);

  // Load from File picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      error("Invalid File Type", "Please select a standard PDF document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        await loadPdfBytesIntoEditor(new Uint8Array(buffer), file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Drag & Drop Handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        if (buffer) {
          await loadPdfBytesIntoEditor(new Uint8Array(buffer), file.name);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Annotation Manipulation
  const handleAddAnnotation = (ann: Annotation) => {
    const updated = [...annotations, ann];
    setAnnotations(updated);
    pushHistory(updated, pages);
  };

  const handleUpdateAnnotation = (updated: Annotation) => {
    const next = annotations.map((a) => (a.id === updated.id ? updated : a));
    setAnnotations(next);
  };

  const handleDeleteAnnotation = (id: string) => {
    const next = annotations.filter((a) => a.id !== id);
    setAnnotations(next);
    setSelectedAnnotationId(null);
    pushHistory(next, pages);
    info("Annotation deleted");
  };

  const handleDuplicateAnnotation = (ann: Annotation) => {
    const copy: Annotation = {
      ...ann,
      id: Math.random().toString(36).substring(2, 9),
      x: Math.min(85, ann.x + 3),
      y: Math.min(85, ann.y + 3),
      createdAt: Date.now(),
    };
    const updated = [...annotations, copy];
    setAnnotations(updated);
    setSelectedAnnotationId(copy.id);
    pushHistory(updated, pages);
    success("Object duplicated");
  };

  // Page Operations
  const handleRotatePage = (pageIndex: number) => {
    const updated = pages.map((p) =>
      p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    );
    setPages(updated);
    pushHistory(annotations, updated);
    trackEvent("page_reordered");
  };

  const handleDeletePage = (pageIndex: number) => {
    const active = pages.filter((p) => !p.isDeleted);
    if (active.length <= 1) {
      error("Cannot delete", "Document must contain at least 1 page.");
      return;
    }
    const updated = pages.map((p) => (p.pageIndex === pageIndex ? { ...p, isDeleted: true } : p));
    setPages(updated);
    pushHistory(annotations, updated);
    trackEvent("page_deleted");
    info("Page removed");
  };

  const handleDuplicatePage = (pageIndex: number) => {
    const target = pages.find((p) => p.pageIndex === pageIndex);
    if (!target) return;
    const newPage: PageMetadata = {
      ...target,
      pageIndex: pages.length,
    };
    const targetIdx = pages.findIndex((p) => p.pageIndex === pageIndex);
    const updated = [...pages];
    updated.splice(targetIdx + 1, 0, newPage);
    setPages(updated);
    pushHistory(annotations, updated);
    success("Page duplicated");
  };

  const handleInsertBlankPage = (pageIndex: number) => {
    const newPage: PageMetadata = {
      pageIndex: pages.length,
      originalIndex: -1,
      isBlank: true,
      rotation: 0,
      width: 595.28,
      height: 841.89,
      scale: 1.0,
    };
    const targetIdx = pages.findIndex((p) => p.pageIndex === pageIndex);
    const updated = [...pages];
    updated.splice(targetIdx + 1, 0, newPage);
    setPages(updated);
    pushHistory(annotations, updated);
    success("Blank page added");
  };

  // Export and Download Baked PDF
  const handleExportPdf = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);
    try {
      const bakedBytes = await exportPdfWithAnnotations({
        originalPdfBytes: pdfBytes,
        pages,
        annotations,
        metadata: docMetadata,
      });

      const outName = documentTitle.replace(/\.pdf$/i, "") + "-edited.pdf";
      downloadArrayBuffer(bakedBytes, outName);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      trackEvent("pdf_exported", { originalSizeBytes: fileSizeBytes, newSizeBytes: bakedBytes.byteLength });
      success("Export Complete! 🎉", `Saved as ${outName}`);
    } catch (err: any) {
      console.error("Export error:", err);
      error("Export Failed", err.message || "Could not generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print PDF
  const handlePrintPdf = async () => {
    if (!pdfBytes) return;
    try {
      const bakedBytes = await exportPdfWithAnnotations({
        originalPdfBytes: pdfBytes,
        pages,
        annotations,
        metadata: docMetadata,
      });
      printPdfBuffer(bakedBytes);
    } catch (err: any) {
      error("Print Failed", err.message);
    }
  };

  // Save to Local Workspace
  const handleSaveToWorkspace = async () => {
    if (!pdfBytes) return;
    await documentStore.saveDraft({
      id: "draft_" + documentTitle,
      name: documentTitle,
      pdfData: pdfBytes.buffer as ArrayBuffer,
      annotations,
      pages,
      updatedAt: Date.now(),
    });
    success("Draft Saved", "Persisted to local browser storage.");
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleExportPdf();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrintPdf();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedAnnotationId) {
          e.preventDefault();
          handleDeleteAnnotation(selectedAnnotationId);
        }
      } else if (e.key.toLowerCase() === "v") {
        setActiveTool("select");
      } else if (e.key.toLowerCase() === "h") {
        setActiveTool("hand");
      } else if (e.key.toLowerCase() === "t") {
        setActiveTool("text");
      } else if (e.key.toLowerCase() === "p" && !e.metaKey && !e.ctrlKey) {
        setActiveTool("pen");
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(3.0, z + 0.15));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(0.4, z - 0.15));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAnnotationId, historyIndex, history, pdfBytes, pages, annotations, documentTitle, docMetadata]);

  const activePages = pages.filter((p) => !p.isDeleted);
  const currentMeta = pages.find((p) => p.pageIndex === activePageIndex) || pages[0];

  // Empty State
  if (!pdfDoc) {
    return (
      <div
        className={cn(
          "min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 transition-all duration-200 bg-[#fafaf9]",
          isDragOver ? "bg-amber-500/5 ring-2 ring-inset ring-black" : ""
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="max-w-lg w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 p-8 sm:p-12 rounded-3xl bg-white border border-[#e5e5e3] shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
            <FileText className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight text-[#0f0e0d]">
              Open a PDF to start editing
            </h2>
            <p className="text-sm text-[#524f49] max-w-sm mx-auto">
              Drag & drop your document here or select from your device. 100% private WebAssembly processing.
            </p>
          </div>

          <div className="flex items-center justify-center pt-2">
            <label className="w-full sm:w-auto cursor-pointer">
              <span className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-md">
                <Upload className="w-4 h-4" />
                Select PDF File
              </span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
            </label>
          </div>

          <div className="text-xs text-[#716e68] flex items-center justify-center gap-4 pt-6 border-t border-[#e5e5e3]">
            <span>✓ Zero file size limits</span>
            <span>✓ No server uploads</span>
            <span>✓ 100% Free</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-0rem)] w-full flex flex-col bg-white overflow-hidden">
      {/* Top Toolbar */}
      <EditorToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3.0, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.15))}
        onZoomFit={() => setZoom(1.0)}
        currentPage={activePages.findIndex((p) => p.pageIndex === activePageIndex) + 1}
        totalPages={activePages.length}
        onPrevPage={() => {
          const currentIdx = activePages.findIndex((p) => p.pageIndex === activePageIndex);
          if (currentIdx > 0) setActivePageIndex(activePages[currentIdx - 1].pageIndex);
        }}
        onNextPage={() => {
          const currentIdx = activePages.findIndex((p) => p.pageIndex === activePageIndex);
          if (currentIdx < activePages.length - 1) setActivePageIndex(activePages[currentIdx + 1].pageIndex);
        }}
        onPageChange={(num) => {
          if (num >= 1 && num <= activePages.length) {
            setActivePageIndex(activePages[num - 1].pageIndex);
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onOpenStampModal={() => setIsStampModalOpen(true)}
        onOpenBarcodeModal={() => setIsBarcodeModalOpen(true)}
        onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
        onOpenPageNumbersModal={() => setIsPageNumbersModalOpen(true)}
        onOpenMetadataModal={() => setIsMetadataModalOpen(true)}
        onOpenPageManager={() => setIsPageManagerOpen(true)}
        onPrintPdf={handlePrintPdf}
        onExportPdf={handleExportPdf}
        onSaveToWorkspace={handleSaveToWorkspace}
        isExporting={isExporting}
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Pages & Thumbnails */}
        <EditorLeftSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          pages={pages}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          onRotatePage={handleRotatePage}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
          onInsertBlankPage={handleInsertBlankPage}
          fileSizeBytes={fileSizeBytes}
        />

        {/* Center: Canvas Viewport */}
        {currentMeta && (
          <EditorCanvas
            pdfDoc={pdfDoc}
            activePageIndex={activePageIndex}
            pageMeta={currentMeta}
            zoom={zoom}
            activeTool={activeTool}
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId}
            onSelectAnnotation={setSelectedAnnotationId}
            onAddAnnotation={handleAddAnnotation}
            onUpdateAnnotation={handleUpdateAnnotation}
            onDeleteAnnotation={handleDeleteAnnotation}
            activeColor={activeColor}
            activeStrokeWidth={activeStrokeWidth}
            activeFontSize={activeFontSize}
            activeFontFamily={activeFontFamily}
            activeOpacity={activeOpacity}
          />
        )}

        {/* Right Sidebar: Contextual Properties */}
        <EditorRightSidebar
          isOpen={isRightSidebarOpen}
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          activeTool={activeTool}
          selectedAnnotation={annotations.find((a) => a.id === selectedAnnotationId) || null}
          onUpdateAnnotation={handleUpdateAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          onDuplicateAnnotation={handleDuplicateAnnotation}
          activeColor={activeColor}
          onChangeActiveColor={setActiveColor}
          activeStrokeWidth={activeStrokeWidth}
          onChangeActiveStrokeWidth={setActiveStrokeWidth}
          activeFontSize={activeFontSize}
          onChangeActiveFontSize={setActiveFontSize}
          activeFontFamily={activeFontFamily}
          onChangeActiveFontFamily={setActiveFontFamily}
          activeOpacity={activeOpacity}
          onChangeActiveOpacity={setActiveOpacity}
        />

        {/* In-Document Search Box Overlay */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          pdfTextData={pdfTextData}
          onJumpToPage={(pIdx) => {
            setActivePageIndex(pIdx);
          }}
          activePageIndex={activePageIndex}
        />
      </div>

      {/* Modals */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onAddSignature={(dataUrl) => {
          const newSig: Annotation = {
            id: Math.random().toString(36).substring(2, 9),
            type: "signature",
            pageIndex: activePageIndex,
            x: 35,
            y: 40,
            width: 30,
            height: 12,
            dataUrl,
            opacity: 1,
            createdAt: Date.now(),
          };
          handleAddAnnotation(newSig);
          setSelectedAnnotationId(newSig.id);
          success("Signature added to page");
        }}
      />

      <BarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onAddCode={(dataUrl, format, val) => {
          const isQr = format === "qr";
          const newCode: BarcodeAnnotation = {
            id: Math.random().toString(36).substring(2, 9),
            type: "barcode",
            format,
            value: val,
            dataUrl,
            pageIndex: activePageIndex,
            x: 35,
            y: 35,
            width: isQr ? 18 : 28,
            height: isQr ? 18 : 10,
            opacity: 1,
            createdAt: Date.now(),
          };
          handleAddAnnotation(newCode);
          setSelectedAnnotationId(newCode.id);
          success(`${isQr ? "QR Code" : "Barcode"} inserted on page`);
        }}
      />

      <WatermarkModal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        isProcessing={isProcessingDocAction}
        onApplyWatermark={async (options) => {
          if (!pdfBytes) return;
          setIsProcessingDocAction(true);
          try {
            const updated = await watermarkPdf({ pdfBytes, options });
            await loadPdfBytesIntoEditor(updated, documentTitle);
            setIsWatermarkModalOpen(false);
            success("Watermark Applied", "Watermark applied successfully across pages.");
          } catch (err: any) {
            error("Watermark Failed", err?.message || "Could not apply watermark.");
          } finally {
            setIsProcessingDocAction(false);
          }
        }}
      />

      <PageNumbersModal
        isOpen={isPageNumbersModalOpen}
        onClose={() => setIsPageNumbersModalOpen(false)}
        totalPages={activePages.length}
        isProcessing={isProcessingDocAction}
        onApplyPageNumbers={async (options) => {
          if (!pdfBytes) return;
          setIsProcessingDocAction(true);
          try {
            const updated = await addPageNumbersToPdf({ pdfBytes, options });
            await loadPdfBytesIntoEditor(updated, documentTitle);
            setIsPageNumbersModalOpen(false);
            success("Page Numbers Added", "Formatted numbering applied to document.");
          } catch (err: any) {
            error("Page Numbering Failed", err?.message || "Could not apply page numbers.");
          } finally {
            setIsProcessingDocAction(false);
          }
        }}
      />

      <StampModal
        isOpen={isStampModalOpen}
        onClose={() => setIsStampModalOpen(false)}
        onAddStamp={(stampText, color) => {
          const newStamp: StampAnnotation = {
            id: Math.random().toString(36).substring(2, 9),
            type: "stamp",
            pageIndex: activePageIndex,
            x: 35,
            y: 35,
            width: 32,
            height: 10,
            stampText,
            color,
            borderColor: color,
            opacity: 0.9,
            createdAt: Date.now(),
          };
          handleAddAnnotation(newStamp);
          setSelectedAnnotationId(newStamp.id);
          success(`Stamp "${stampText}" placed on page`);
        }}
      />

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onAddImage={(dataUrl, width, height, fileName) => {
          const aspect = width / height;
          const newImg: Annotation = {
            id: Math.random().toString(36).substring(2, 9),
            type: "image",
            pageIndex: activePageIndex,
            x: 30,
            y: 35,
            width: 35,
            height: 35 / aspect,
            dataUrl,
            aspectRatio: aspect,
            originalFileName: fileName,
            opacity: 1,
            createdAt: Date.now(),
          };
          handleAddAnnotation(newImg);
          setSelectedAnnotationId(newImg.id);
          success("Image inserted into page");
        }}
      />

      <DocMetadataModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        documentTitle={documentTitle}
        fileSizeBytes={fileSizeBytes}
        pages={pages}
        annotations={annotations}
        metadata={docMetadata}
        onUpdateMetadata={setDocMetadata}
        onImportAnnotations={(importedAnns, importedPages) => {
          setAnnotations(importedAnns);
          if (importedPages && importedPages.length > 0) {
            setPages(importedPages);
          }
          pushHistory(importedAnns, importedPages || pages);
        }}
      />

      <PageManagerModal
        isOpen={isPageManagerOpen}
        onClose={() => setIsPageManagerOpen(false)}
        pages={pages}
        onUpdatePages={(newPages) => {
          setPages(newPages);
          pushHistory(annotations, newPages);
          success("Page layout updated");
        }}
        onSelectPage={setActivePageIndex}
      />
    </div>
  );
}
