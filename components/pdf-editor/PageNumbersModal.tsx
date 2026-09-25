"use client";

import React, { useState } from "react";
import { Hash, Check, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { PageNumberOptions } from "@/types/pdf";

interface PageNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPageNumbers: (options: PageNumberOptions) => void;
  totalPages?: number;
  isProcessing?: boolean;
}

export function PageNumbersModal({
  isOpen,
  onClose,
  onApplyPageNumbers,
  totalPages = 1,
  isProcessing = false,
}: PageNumbersModalProps) {
  const [format, setFormat] = useState<"number" | "page_of_total" | "custom">("page_of_total");
  const [customFormat, setCustomFormat] = useState("Page {n} of {total}");
  const [position, setPosition] = useState<
    "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  >("bottom-center");
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState("#475569");
  const [startPage, setStartPage] = useState(1);
  const [startNumber, setStartNumber] = useState(1);

  const handleApply = () => {
    onApplyPageNumbers({
      format,
      customFormat: format === "custom" ? customFormat : undefined,
      position,
      fontSize,
      color,
      startPage,
      startNumber,
      margin: 24,
    });
  };

  const getPreviewText = () => {
    if (format === "number") return `${startNumber}`;
    if (format === "page_of_total") return `Page ${startNumber} of ${totalPages || 1}`;
    return customFormat.replace(/{n}/g, String(startNumber)).replace(/{total}/g, String(totalPages || 1));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Page Numbers & Footers"
      description="Automatically insert formatted page numbers, counts, and headers across all pages."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Numbering Format */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Numbering Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat("page_of_total")}
              className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                format === "page_of_total"
                  ? "bg-blue-50 border-blue-600 text-blue-600 font-semibold"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Page 1 of {totalPages}
            </button>
            <button
              type="button"
              onClick={() => setFormat("number")}
              className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                format === "number"
                  ? "bg-blue-50 border-blue-600 text-blue-600 font-semibold"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              1, 2, 3...
            </button>
            <button
              type="button"
              onClick={() => setFormat("custom")}
              className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                format === "custom"
                  ? "bg-blue-50 border-blue-600 text-blue-600 font-semibold"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {format === "custom" && (
          <div className="space-y-1">
            <input
              type="text"
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              placeholder="e.g. - {n} - or Document Page {n}"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[10px] text-neutral-400">Use `&#123;n&#125;` for page number and `&#123;total&#125;` for total count.</p>
          </div>
        )}

        {/* Position Grid: 3x2 Matrix */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
            Page Placement
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-2 bg-neutral-100 rounded-xl">
            {(
              [
                ["top-left", "Top Left"],
                ["top-center", "Top Center"],
                ["top-right", "Top Right"],
                ["bottom-left", "Bottom Left"],
                ["bottom-center", "Bottom Center"],
                ["bottom-right", "Bottom Right"],
              ] as const
            ).map(([pos, label]) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPosition(pos)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                  position === pos
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Start page & number */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">
              Start on Page
            </label>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={startPage}
              onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-300 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">
              First Number
            </label>
            <input
              type="number"
              min={1}
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-300 bg-white"
            />
          </div>
        </div>

        <ColorPicker label="Text Color" value={color} onChange={setColor} />

        {/* Live Preview Box */}
        <div className="p-3 bg-neutral-100 rounded-xl flex items-center justify-between text-xs border border-neutral-200">
          <span className="text-neutral-500 font-medium">Render Preview:</span>
          <span style={{ color }} className="font-semibold font-mono">
            {getPreviewText()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            isLoading={isProcessing}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply Numbers
          </Button>
        </div>
      </div>
    </Modal>
  );
}
