"use client";

import React from "react";
import {
  RotateCw,
  Trash2,
  Copy,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Info,
  Layers,
} from "lucide-react";
import { PageMetadata } from "@/types/pdf";
import { formatBytes, cn } from "@/lib/utils";

interface EditorLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  pages: PageMetadata[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onDuplicatePage: (pageIndex: number) => void;
  onInsertBlankPage: (pageIndex: number) => void;
  fileSizeBytes: number;
}

export function EditorLeftSidebar({
  isOpen,
  onToggle,
  pages,
  activePageIndex,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onInsertBlankPage,
  fileSizeBytes,
}: EditorLeftSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"pages" | "info">("pages");

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute left-2 top-28 z-20 p-2 rounded-xl bg-white border border-neutral-200 shadow-md text-neutral-600 hover:text-neutral-900 transition-all hover:scale-105"
        title="Open Pages Sidebar"
      >
        <Layers className="w-4 h-4" />
      </button>
    );
  }

  const activePages = pages.filter((p) => !p.isDeleted);

  return (
    <aside className="w-64 h-full bg-white border-r border-neutral-200 flex flex-col z-20 select-none">
      {/* Sidebar Header with Tabs */}
      <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab("pages")}
            className={cn(
              "px-3 py-1 rounded-md font-semibold transition-colors",
              activeTab === "pages"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            Pages ({activePages.length})
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "px-3 py-1 rounded-md font-semibold transition-colors",
              activeTab === "info"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            Info
          </button>
        </div>

        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Pages List View */}
      {activeTab === "pages" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {pages.map((page, idx) => {
            if (page.isDeleted) return null;
            const isSelected = activePageIndex === page.pageIndex;

            return (
              <div
                key={page.pageIndex + "_" + idx}
                className={cn(
                  "group relative border-2 rounded-xl p-2 bg-neutral-50 hover:bg-white transition-all cursor-pointer",
                  isSelected
                    ? "border-blue-600 shadow-sm ring-2 ring-blue-500/20"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
                onClick={() => onSelectPage(page.pageIndex)}
              >
                {/* Page number badge */}
                <div className="flex items-center justify-between mb-1.5 px-1 text-[11px] font-semibold text-neutral-400">
                  <span className={isSelected ? "text-blue-600 font-bold" : ""}>
                    Page {idx + 1}
                  </span>
                  {page.rotation !== 0 && (
                    <span className="text-[10px] text-amber-500 font-mono">{page.rotation}°</span>
                  )}
                </div>

                {/* Thumbnail container */}
                <div
                  className="w-full h-36 bg-white rounded-lg border border-neutral-200 flex items-center justify-center overflow-hidden transition-transform"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                >
                  {page.thumbnailUrl ? (
                    <img
                      src={page.thumbnailUrl}
                      alt={`Page ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-neutral-400 font-mono">Page {page.pageIndex + 1}</div>
                  )}
                </div>

                {/* Quick Page Actions */}
                <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-around opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(page.pageIndex);
                    }}
                    title="Rotate 90°"
                    className="p-1 rounded text-neutral-500 hover:text-blue-600 hover:bg-neutral-100"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(page.pageIndex);
                    }}
                    title="Duplicate"
                    className="p-1 rounded text-neutral-500 hover:text-blue-600 hover:bg-neutral-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInsertBlankPage(page.pageIndex);
                    }}
                    title="Insert Page"
                    className="p-1 rounded text-neutral-500 hover:text-blue-600 hover:bg-neutral-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.pageIndex);
                    }}
                    title="Delete"
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === "info" && (
        <div className="flex-1 p-4 space-y-4 text-xs text-neutral-600">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% Private Sandbox
            </div>
            <p className="text-[11px] leading-relaxed">
              This document is processed entirely in your web browser memory.
            </p>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3">
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Pages:</span>
              <span className="font-semibold text-neutral-800">
                {activePages.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">File Size:</span>
              <span className="font-semibold text-neutral-800">
                {formatBytes(fileSizeBytes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Renderer:</span>
              <span className="font-mono text-[10px] text-blue-600">PDF.js + pdf-lib</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
