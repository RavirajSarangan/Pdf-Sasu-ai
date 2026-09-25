"use client";

import React, { useState } from "react";
import {
  RotateCw,
  Trash2,
  Copy,
  Plus,
  ArrowUpDown,
  MoveLeft,
  MoveRight,
  Check,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageMetadata } from "@/types/pdf";

interface PageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageMetadata[];
  onUpdatePages: (newPages: PageMetadata[]) => void;
  onSelectPage: (index: number) => void;
}

export function PageManagerModal({
  isOpen,
  onClose,
  pages,
  onUpdatePages,
  onSelectPage,
}: PageManagerModalProps) {
  const [localPages, setLocalPages] = useState<PageMetadata[]>(pages);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalPages([...pages]);
    }
  }, [isOpen, pages]);

  const activePages = localPages.filter((p) => !p.isDeleted);

  const rotatePage = (pageIndex: number) => {
    setLocalPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const deletePage = (pageIndex: number) => {
    if (activePages.length <= 1) {
      alert("A document must have at least one page.");
      return;
    }
    setLocalPages((prev) =>
      prev.map((p) => (p.pageIndex === pageIndex ? { ...p, isDeleted: true } : p))
    );
  };

  const duplicatePage = (pageIndex: number) => {
    const target = localPages.find((p) => p.pageIndex === pageIndex);
    if (!target) return;
    const newPage: PageMetadata = {
      ...target,
      pageIndex: localPages.length,
    };
    const targetIdx = localPages.findIndex((p) => p.pageIndex === pageIndex);
    const updated = [...localPages];
    updated.splice(targetIdx + 1, 0, newPage);
    setLocalPages(updated);
  };

  const movePage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= localPages.length) return;
    const updated = [...localPages];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setLocalPages(updated);
  };

  const rotateAll = () => {
    setLocalPages((prev) => prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  };

  const handleSave = () => {
    onUpdatePages(localPages);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Organize & Manage Pages"
      description="Reorder, rotate, delete or duplicate document pages."
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Top Actions bar */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
          <div className="text-xs text-neutral-500 font-medium">
            Total Active Pages: <span className="font-bold text-neutral-900">{activePages.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" onClick={rotateAll} className="gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              Rotate All 90°
            </Button>
          </div>
        </div>

        {/* Visual Grid of Pages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[55vh] overflow-y-auto p-1">
          {localPages.map((page, idx) => {
            if (page.isDeleted) return null;

            return (
              <div
                key={page.pageIndex + "_" + idx}
                className="group relative border-2 border-neutral-200 hover:border-blue-500 rounded-2xl bg-white p-3 flex flex-col items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-full flex items-center justify-between text-xs font-semibold text-neutral-400">
                  <span>Page {idx + 1}</span>
                  {page.rotation !== 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                      {page.rotation}°
                    </span>
                  )}
                </div>

                {/* Page Thumbnail Preview */}
                <div
                  className="w-full h-44 bg-neutral-100 rounded-xl flex items-center justify-center overflow-hidden border border-neutral-200 transition-transform"
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

                {/* Page Actions toolbar */}
                <div className="flex items-center justify-between w-full pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1">
                    <button
                      title="Move Left"
                      disabled={idx === 0}
                      onClick={() => movePage(idx, idx - 1)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Move Right"
                      disabled={idx === activePages.length - 1}
                      onClick={() => movePage(idx, idx + 1)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      title="Rotate 90°"
                      onClick={() => rotatePage(page.pageIndex)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Duplicate Page"
                      onClick={() => duplicatePage(page.pageIndex)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Delete Page"
                      onClick={() => deletePage(page.pageIndex)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="gap-2">
            <Check className="w-4 h-4" />
            Apply Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
