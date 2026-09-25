"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  label?: string;
  allowTransparent?: boolean;
}

const DEFAULT_PALETTE = [
  "#000000",
  "#374151",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

export function ColorPicker({
  value,
  onChange,
  presetColors = DEFAULT_PALETTE,
  label,
  allowTransparent = false,
}: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-neutral-600">{label}</label>}
      <div className="flex items-center gap-1.5 flex-wrap">
        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange("transparent")}
            title="Transparent"
            className={cn(
              "w-6 h-6 rounded-md border text-[10px] font-bold flex items-center justify-center transition-transform hover:scale-110",
              value === "transparent"
                ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                : "border-neutral-300 bg-neutral-100 text-neutral-500"
            )}
          >
            ∅
          </button>
        )}
        {presetColors.map((color) => {
          const isSelected = value.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                "w-6 h-6 rounded-md border transition-transform hover:scale-110 relative",
                color === "#ffffff" ? "border-neutral-300" : "border-transparent",
                isSelected && "ring-2 ring-blue-500 ring-offset-1 scale-110 z-10"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          );
        })}
        {/* Native color picker for custom Hex */}
        <label
          className="w-6 h-6 rounded-md border border-dashed border-neutral-400 hover:border-neutral-700 flex items-center justify-center cursor-pointer text-xs text-neutral-500 hover:text-neutral-900"
          title="Custom Color"
        >
          +
          <input
            type="color"
            value={value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
