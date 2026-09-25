"use client";

import React from "react";
import Link from "next/link";
import {
  MousePointer,
  Hand,
  Type,
  Edit3,
  Highlighter,
  Pen,
  Square,
  Circle,
  Minus,
  MoveUpRight,
  Image as ImageIcon,
  FileSignature,
  Stamp,
  StickyNote,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  Printer,
  FileCode,
  QrCode,
  EyeOff,
  Hash,
} from "lucide-react";
import { ToolType } from "@/types/pdf";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (pageNum: number) => void;
  onOpenSearch: () => void;
  onOpenSignatureModal: () => void;
  onOpenImageModal: () => void;
  onOpenStampModal: () => void;
  onOpenBarcodeModal: () => void;
  onOpenWatermarkModal: () => void;
  onOpenPageNumbersModal: () => void;
  onOpenMetadataModal: () => void;
  onOpenPageManager: () => void;
  onPrintPdf: () => void;
  onExportPdf: () => void;
  onSaveToWorkspace: () => void;
  isExporting: boolean;
  documentTitle: string;
  onTitleChange: (title: string) => void;
}

export function EditorToolbar({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
  onOpenSearch,
  onOpenSignatureModal,
  onOpenImageModal,
  onOpenStampModal,
  onOpenBarcodeModal,
  onOpenWatermarkModal,
  onOpenPageNumbersModal,
  onOpenMetadataModal,
  onOpenPageManager,
  onPrintPdf,
  onExportPdf,
  onSaveToWorkspace,
  isExporting,
  documentTitle,
  onTitleChange,
}: EditorToolbarProps) {
  const tools: { id: ToolType; label: string; icon: React.ElementType }[] = [
    { id: "select", label: "Select (V)", icon: MousePointer },
    { id: "edit-text", label: "Edit PDF Text (E)", icon: Edit3 },
    { id: "text", label: "Add Text (T)", icon: Type },
    { id: "highlight", label: "Highlight", icon: Highlighter },
    { id: "pen", label: "Draw / Pen (P)", icon: Pen },
    { id: "rectangle", label: "Rectangle (R)", icon: Square },
    { id: "circle", label: "Circle (O)", icon: Circle },
    { id: "arrow", label: "Arrow (A)", icon: MoveUpRight },
    { id: "line", label: "Line (L)", icon: Minus },
    { id: "redact", label: "Redact / Blackout", icon: EyeOff },
    { id: "note", label: "Sticky Note (N)", icon: StickyNote },
    { id: "eraser", label: "Eraser", icon: Eraser },
  ];

  return (
    <div className="w-full bg-white border-b border-neutral-200 flex flex-col select-none z-30">
      {/* Top Main Navigation & Document Meta Bar */}
      <div className="h-13 px-4 flex items-center justify-between border-b border-neutral-100 gap-3">
        {/* Left: Back & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="font-semibold text-sm text-neutral-900 bg-transparent hover:bg-neutral-100 px-2 py-1 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 truncate max-w-xs transition-colors"
              title="Click to rename document"
            />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              Local Private
            </span>
          </div>
        </div>

        {/* Center: Quick Page Navigation & Zoom */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Page nav */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs text-neutral-700">
            <button
              onClick={onPrevPage}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="px-2 font-medium flex items-center gap-1">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={Math.max(totalPages, 1)}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) onPageChange(val);
                }}
                className="w-8 text-center bg-white rounded border border-neutral-200 text-xs py-0.5"
              />
              <span>of {totalPages || 1}</span>
            </div>
            <button
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs text-neutral-700">
            <button
              onClick={onZoomOut}
              className="p-1.5 rounded-md hover:bg-white transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onZoomFit}
              className="px-2 py-1 font-medium hover:bg-white rounded transition-colors"
              title="Fit to Width"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="p-1.5 rounded-md hover:bg-white transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            onClick={onOpenSearch}
            className="text-neutral-600"
            title="Search Text in PDF (Cmd+F)"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={onPrintPdf}
            className="text-neutral-600"
            title="Print PDF Document"
          >
            <Printer className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={onOpenMetadataModal}
            className="text-neutral-600"
            title="Properties & JSON Studio"
          >
            <FileCode className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={onOpenPageManager}
            className="hidden sm:inline-flex gap-1.5 text-neutral-700"
          >
            <Layers className="w-3.5 h-3.5" />
            Pages
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={onSaveToWorkspace}
            className="hidden md:inline-flex gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={onExportPdf}
            isLoading={isExporting}
            className="gap-1.5 font-semibold shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Primary Tool Selector Ribbon */}
      <div className="h-11 px-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 bg-white">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-neutral-200 pr-2 shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 transition-colors shrink-0"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 transition-colors shrink-0"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Standard Editor Tools */}
        <div className="flex items-center gap-1 shrink-0">
          {tools.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                title={t.label}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap shrink-0",
                  isSelected
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden xl:inline text-xs">
                  {t.id === "edit-text" ? "Edit Text" : t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Signature, Image, Stamp, Barcode, Watermark, Page Number Modals */}
        <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2 shrink-0">
          <button
            onClick={onOpenSignatureModal}
            className={cn(
              "px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all whitespace-nowrap shrink-0",
              activeTool === "signature"
                ? "bg-blue-50 border-blue-600 text-blue-600"
                : "border-neutral-200 hover:bg-neutral-100 text-neutral-700"
            )}
            title="Insert Digital Signature"
          >
            <FileSignature className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">Signature</span>
          </button>

          <button
            onClick={onOpenBarcodeModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all whitespace-nowrap shrink-0"
            title="Insert QR Code or 1D Barcode"
          >
            <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="whitespace-nowrap">QR / Barcode</span>
          </button>

          <button
            onClick={onOpenStampModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all whitespace-nowrap shrink-0"
            title="Insert Stamp"
          >
            <Stamp className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="whitespace-nowrap">Stamp</span>
          </button>

          <button
            onClick={onOpenImageModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all whitespace-nowrap shrink-0"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="whitespace-nowrap">Image</span>
          </button>

          <button
            onClick={onOpenWatermarkModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium items-center gap-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all hidden md:flex whitespace-nowrap shrink-0"
            title="Add Document Watermark"
          >
            <Stamp className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="whitespace-nowrap">Watermark</span>
          </button>

          <button
            onClick={onOpenPageNumbersModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium items-center gap-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all hidden md:flex whitespace-nowrap shrink-0"
            title="Add Page Numbers & Footers"
          >
            <Hash className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="whitespace-nowrap">Page Numbers</span>
          </button>
        </div>
      </div>
    </div>
  );
}
