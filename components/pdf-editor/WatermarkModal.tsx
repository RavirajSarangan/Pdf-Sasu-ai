"use client";

import React, { useState } from "react";
import { Stamp, Check, Sliders, Shield } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { WatermarkOptions } from "@/types/pdf";

interface WatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWatermark: (options: WatermarkOptions) => void;
  isProcessing?: boolean;
}

export function WatermarkModal({
  isOpen,
  onClose,
  onApplyWatermark,
  isProcessing = false,
}: WatermarkModalProps) {
  const [text, setText] = useState("CONFIDENTIAL");
  const [color, setColor] = useState("#94a3b8");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [layout, setLayout] = useState<"diagonal" | "center" | "tiled">("diagonal");
  const [pageRange, setPageRange] = useState<"all" | "odd" | "even">("all");

  const presets = [
    "CONFIDENTIAL",
    "DO NOT COPY",
    "DRAFT",
    "INTERNAL ONLY",
    "SAMPLE",
    "URGENT",
  ];

  const handleApply = () => {
    if (!text.trim()) return;
    onApplyWatermark({
      text: text.trim(),
      color,
      opacity,
      fontSize,
      rotation,
      layout,
      pageRange,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add PDF Watermark"
      description="Apply security, confidentiality, or copyright watermarks across your document."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Preset quick buttons */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setText(p)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                  text === p
                    ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                    : "border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Watermark Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Watermark Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. STRICTLY CONFIDENTIAL"
            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium uppercase"
          />
        </div>

        {/* Layout & Angle */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">
              Layout Pattern
            </label>
            <select
              value={layout}
              onChange={(e) => {
                const val = e.target.value as any;
                setLayout(val);
                if (val === "center") setRotation(0);
                else if (val === "diagonal") setRotation(45);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="diagonal">Diagonal Across Page</option>
              <option value="center">Horizontal Centered</option>
              <option value="tiled">Tiled Multi-Grid</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 mb-1 block">
              Target Pages
            </label>
            <select
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Pages</option>
              <option value="odd">Odd Pages Only</option>
              <option value="even">Even Pages Only</option>
            </select>
          </div>
        </div>

        {/* Sliders: Opacity & Font Size */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Opacity</span>
              <span className="text-neutral-500">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
              <span>Font Size</span>
              <span className="text-neutral-500">{fontSize} pt</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <ColorPicker label="Watermark Color" value={color} onChange={setColor} />

        {/* Live Visual Preview Card */}
        <div className="p-6 bg-neutral-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-neutral-200 h-28 select-none">
          <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-30 text-[9px] text-neutral-400 font-serif">
            <div>Document Heading Sample Content...</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod...</div>
          </div>
          <span
            style={{
              color,
              opacity,
              fontSize: `${Math.min(fontSize * 0.4, 28)}px`,
              transform: `rotate(${rotation}deg)`,
            }}
            className="font-black tracking-widest uppercase text-center"
          >
            {text || "CONFIDENTIAL"}
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
            disabled={!text.trim()}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply Watermark
          </Button>
        </div>
      </div>
    </Modal>
  );
}
