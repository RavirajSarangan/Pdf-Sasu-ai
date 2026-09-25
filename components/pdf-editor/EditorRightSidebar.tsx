"use client";

import React from "react";
import {
  Type,
  Pen,
  Square,
  Circle,
  Highlighter,
  Trash2,
  Copy,
  ChevronRight,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  Annotation,
  TextAnnotation,
  DrawAnnotation,
  ShapeAnnotation,
  SignatureAnnotation,
  StampAnnotation,
  ImageAnnotation,
  StickyNoteAnnotation,
  ToolType,
} from "@/types/pdf";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EditorRightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTool: ToolType;
  selectedAnnotation: Annotation | null;
  onUpdateAnnotation: (updated: Annotation) => void;
  onDeleteAnnotation: (id: string) => void;
  onDuplicateAnnotation: (ann: Annotation) => void;
  // Default styling state for tools
  activeColor: string;
  onChangeActiveColor: (color: string) => void;
  activeStrokeWidth: number;
  onChangeActiveStrokeWidth: (width: number) => void;
  activeFontSize: number;
  onChangeActiveFontSize: (size: number) => void;
  activeFontFamily: string;
  onChangeActiveFontFamily: (font: string) => void;
  activeOpacity: number;
  onChangeActiveOpacity: (opacity: number) => void;
}

const FONT_OPTIONS = [
  { id: "Helvetica", name: "Helvetica (Modern)" },
  { id: "Times-Roman", name: "Times New Roman (Classic)" },
  { id: "Courier", name: "Courier (Monospace)" },
];

const NOTE_COLORS = ["#fef08a", "#bae6fd", "#bbf7d0", "#fbcfe8", "#e9d5ff"];

export function EditorRightSidebar({
  isOpen,
  onToggle,
  activeTool,
  selectedAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onDuplicateAnnotation,
  activeColor,
  onChangeActiveColor,
  activeStrokeWidth,
  onChangeActiveStrokeWidth,
  activeFontSize,
  onChangeActiveFontSize,
  activeFontFamily,
  onChangeActiveFontFamily,
  activeOpacity,
  onChangeActiveOpacity,
}: EditorRightSidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute right-2 top-28 z-20 p-2 rounded-xl bg-white border border-neutral-200 shadow-md text-neutral-600 hover:text-neutral-900 transition-all hover:scale-105"
        title="Open Properties Panel"
      >
        <Sliders className="w-4 h-4" />
      </button>
    );
  }

  return (
    <aside className="w-72 h-full bg-white border-l border-neutral-200 flex flex-col z-20 select-none">
      {/* Header */}
      <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-blue-600" />
          {selectedAnnotation ? "Object Properties" : "Tool Settings"}
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
        {/* Scenario 1: Text Annotation selected or Text tool active */}
        {(selectedAnnotation?.type === "text" || (activeTool === "text" && !selectedAnnotation)) && (
          <div className="space-y-4">
            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Font Family</label>
              <select
                value={
                  selectedAnnotation?.type === "text"
                    ? (selectedAnnotation as TextAnnotation).fontFamily
                    : activeFontFamily
                }
                onChange={(e) => {
                  if (selectedAnnotation?.type === "text") {
                    onUpdateAnnotation({
                      ...selectedAnnotation,
                      fontFamily: e.target.value,
                    } as TextAnnotation);
                  } else {
                    onChangeActiveFontFamily(e.target.value);
                  }
                }}
                className="w-full h-8 px-2 rounded-lg border border-neutral-300 bg-white text-xs"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Alignment */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Font Size</label>
                <input
                  type="number"
                  min={8}
                  max={96}
                  value={
                    selectedAnnotation?.type === "text"
                      ? (selectedAnnotation as TextAnnotation).fontSize
                      : activeFontSize
                  }
                  onChange={(e) => {
                    const size = parseInt(e.target.value) || 14;
                    if (selectedAnnotation?.type === "text") {
                      onUpdateAnnotation({
                        ...selectedAnnotation,
                        fontSize: size,
                      } as TextAnnotation);
                    } else {
                      onChangeActiveFontSize(size);
                    }
                  }}
                  className="w-full h-8 px-2 rounded-lg border border-neutral-300 bg-white text-xs"
                />
              </div>

              {/* Align buttons */}
              {selectedAnnotation?.type === "text" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Alignment</label>
                  <div className="flex border border-neutral-300 rounded-lg p-0.5">
                    {(["left", "center", "right"] as const).map((align) => {
                      const textAnn = selectedAnnotation as TextAnnotation;
                      const isAlign = textAnn.align === align;
                      return (
                        <button
                          key={align}
                          onClick={() => onUpdateAnnotation({ ...textAnn, align })}
                          className={cn(
                            "flex-1 p-1 rounded flex items-center justify-center transition-colors",
                            isAlign ? "bg-blue-600 text-white" : "text-neutral-500 hover:text-neutral-900"
                          )}
                        >
                          {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bold / Italic / Underline format toggles */}
            {selectedAnnotation?.type === "text" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Formatting</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const textAnn = selectedAnnotation as TextAnnotation;
                      onUpdateAnnotation({ ...textAnn, bold: !textAnn.bold });
                    }}
                    className={cn(
                      "flex-1 p-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1",
                      (selectedAnnotation as TextAnnotation).bold
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-neutral-300 bg-white"
                    )}
                  >
                    <Bold className="w-3.5 h-3.5" /> Bold
                  </button>
                  <button
                    onClick={() => {
                      const textAnn = selectedAnnotation as TextAnnotation;
                      onUpdateAnnotation({ ...textAnn, italic: !textAnn.italic });
                    }}
                    className={cn(
                      "flex-1 p-1.5 rounded-lg border text-xs italic flex items-center justify-center gap-1",
                      (selectedAnnotation as TextAnnotation).italic
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-neutral-300 bg-white"
                    )}
                  >
                    <Italic className="w-3.5 h-3.5" /> Italic
                  </button>
                </div>
              </div>
            )}

            {/* Text Color */}
            <ColorPicker
              label="Text Color"
              value={
                selectedAnnotation?.type === "text"
                  ? (selectedAnnotation as TextAnnotation).color
                  : activeColor
              }
              onChange={(color) => {
                if (selectedAnnotation?.type === "text") {
                  onUpdateAnnotation({ ...selectedAnnotation, color } as TextAnnotation);
                } else {
                  onChangeActiveColor(color);
                }
              }}
            />

            {/* Background Color */}
            {selectedAnnotation?.type === "text" && (
              <ColorPicker
                label="Background Fill"
                allowTransparent
                value={(selectedAnnotation as TextAnnotation).backgroundColor || "transparent"}
                onChange={(backgroundColor) => {
                  onUpdateAnnotation({ ...selectedAnnotation, backgroundColor } as TextAnnotation);
                }}
              />
            )}
          </div>
        )}

        {/* Scenario 2: Drawing, Pen, Highlight */}
        {(selectedAnnotation?.type === "pen" ||
          selectedAnnotation?.type === "highlight" ||
          ["pen", "highlight", "underline", "strikethrough"].includes(activeTool)) &&
          (!selectedAnnotation || ["pen", "highlight"].includes(selectedAnnotation.type)) && (
            <div className="space-y-4">
              <ColorPicker
                label="Stroke Color"
                presetColors={
                  activeTool === "highlight"
                    ? ["#fef08a", "#a7f3d0", "#bae6fd", "#fbcfe8", "#fed7aa"]
                    : undefined
                }
                value={
                  selectedAnnotation && "color" in selectedAnnotation
                    ? (selectedAnnotation as DrawAnnotation).color
                    : activeColor
                }
                onChange={(color) => {
                  if (selectedAnnotation && "color" in selectedAnnotation) {
                    onUpdateAnnotation({ ...selectedAnnotation, color } as DrawAnnotation);
                  } else {
                    onChangeActiveColor(color);
                  }
                }}
              />

              {/* Stroke Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500 font-medium">
                  <span>Stroke Width</span>
                  <span>
                    {selectedAnnotation && "strokeWidth" in selectedAnnotation
                      ? (selectedAnnotation as DrawAnnotation).strokeWidth
                      : activeStrokeWidth}
                    px
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={activeTool === "highlight" ? 36 : 24}
                  value={
                    selectedAnnotation && "strokeWidth" in selectedAnnotation
                      ? (selectedAnnotation as DrawAnnotation).strokeWidth
                      : activeStrokeWidth
                  }
                  onChange={(e) => {
                    const width = parseInt(e.target.value);
                    if (selectedAnnotation && "strokeWidth" in selectedAnnotation) {
                      onUpdateAnnotation({ ...selectedAnnotation, strokeWidth: width } as DrawAnnotation);
                    } else {
                      onChangeActiveStrokeWidth(width);
                    }
                  }}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500 font-medium">
                  <span>Opacity</span>
                  <span>
                    {Math.round(
                      (selectedAnnotation?.opacity ??
                        (activeTool === "highlight" ? 0.35 : activeOpacity)) * 100
                    )}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(
                    (selectedAnnotation?.opacity ??
                      (activeTool === "highlight" ? 0.35 : activeOpacity)) * 100
                  )}
                  onChange={(e) => {
                    const op = parseInt(e.target.value) / 100;
                    if (selectedAnnotation) {
                      onUpdateAnnotation({ ...selectedAnnotation, opacity: op });
                    } else {
                      onChangeActiveOpacity(op);
                    }
                  }}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

        {/* Scenario 3: Shapes (rectangle, circle, arrow, line) */}
        {(["rectangle", "circle", "arrow", "line"].includes(selectedAnnotation?.type || "") ||
          ["rectangle", "circle", "arrow", "line"].includes(activeTool)) &&
          (!selectedAnnotation ||
            ["rectangle", "circle", "arrow", "line"].includes(selectedAnnotation.type)) && (
            <div className="space-y-4">
              <ColorPicker
                label="Border / Stroke Color"
                value={
                  selectedAnnotation && "strokeColor" in selectedAnnotation
                    ? (selectedAnnotation as ShapeAnnotation).strokeColor
                    : activeColor
                }
                onChange={(strokeColor) => {
                  if (selectedAnnotation && "strokeColor" in selectedAnnotation) {
                    onUpdateAnnotation({ ...selectedAnnotation, strokeColor } as ShapeAnnotation);
                  } else {
                    onChangeActiveColor(strokeColor);
                  }
                }}
              />

              {["rectangle", "circle"].includes(selectedAnnotation?.type || activeTool) && (
                <ColorPicker
                  label="Fill Color"
                  allowTransparent
                  value={
                    selectedAnnotation && "fillColor" in selectedAnnotation
                      ? (selectedAnnotation as ShapeAnnotation).fillColor
                      : "transparent"
                  }
                  onChange={(fillColor) => {
                    if (selectedAnnotation && "fillColor" in selectedAnnotation) {
                      onUpdateAnnotation({ ...selectedAnnotation, fillColor } as ShapeAnnotation);
                    }
                  }}
                />
              )}

              {/* Stroke Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500 font-medium">
                  <span>Border Width</span>
                  <span>
                    {selectedAnnotation && "strokeWidth" in selectedAnnotation
                      ? (selectedAnnotation as ShapeAnnotation).strokeWidth
                      : activeStrokeWidth}
                    px
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={
                    selectedAnnotation && "strokeWidth" in selectedAnnotation
                      ? (selectedAnnotation as ShapeAnnotation).strokeWidth
                      : activeStrokeWidth
                  }
                  onChange={(e) => {
                    const width = parseInt(e.target.value);
                    if (selectedAnnotation && "strokeWidth" in selectedAnnotation) {
                      onUpdateAnnotation({ ...selectedAnnotation, strokeWidth: width } as ShapeAnnotation);
                    } else {
                      onChangeActiveStrokeWidth(width);
                    }
                  }}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

        {/* Scenario 4: Sticky Note */}
        {selectedAnnotation?.type === "note" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Note Color</label>
              <div className="flex gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onUpdateAnnotation({
                        ...selectedAnnotation,
                        color,
                      } as StickyNoteAnnotation);
                    }}
                    className={cn(
                      "w-7 h-7 rounded-lg border transition-transform",
                      (selectedAnnotation as StickyNoteAnnotation).color === color &&
                        "ring-2 ring-blue-500 scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Note Message</label>
              <textarea
                value={(selectedAnnotation as StickyNoteAnnotation).text}
                onChange={(e) => {
                  onUpdateAnnotation({
                    ...selectedAnnotation,
                    text: e.target.value,
                  } as StickyNoteAnnotation);
                }}
                rows={4}
                className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Write your note comments here..."
              />
            </div>
          </div>
        )}

        {/* Scenario 5: Stamp */}
        {selectedAnnotation?.type === "stamp" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Stamp Text</label>
              <input
                type="text"
                value={(selectedAnnotation as StampAnnotation).stampText}
                onChange={(e) => {
                  onUpdateAnnotation({
                    ...selectedAnnotation,
                    stampText: e.target.value.toUpperCase(),
                  } as StampAnnotation);
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold uppercase"
              />
            </div>

            <ColorPicker
              label="Stamp Ink Color"
              value={(selectedAnnotation as StampAnnotation).color}
              onChange={(color) => {
                onUpdateAnnotation({
                  ...selectedAnnotation,
                  color,
                  borderColor: color,
                } as StampAnnotation);
              }}
            />
          </div>
        )}

        {/* Action buttons for Selected Annotation */}
        {selectedAnnotation && (
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicateAnnotation(selectedAnnotation)}
              className="w-full justify-center gap-2 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate Object
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteAnnotation(selectedAnnotation.id)}
              className="w-full justify-center gap-2 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Object
            </Button>
          </div>
        )}

        {/* Default Help & Keyboard Shortcuts when no object selected */}
        {!selectedAnnotation && (
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Keyboard Shortcuts
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Select tool</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">
                  V
                </kbd>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Add Text</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">
                  T
                </kbd>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Freehand Pen</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">
                  P
                </kbd>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Undo / Redo</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">
                  ⌘Z / ⌘⇧Z
                </kbd>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Delete selected</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">
                  Delete / ⌫
                </kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
