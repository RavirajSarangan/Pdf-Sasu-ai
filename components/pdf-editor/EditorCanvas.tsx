"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Annotation,
  ToolType,
  PageMetadata,
  TextAnnotation,
  DrawAnnotation,
  ShapeAnnotation,
  SignatureAnnotation,
  StampAnnotation,
  BarcodeAnnotation,
  RedactAnnotation,
  ImageAnnotation,
  StickyNoteAnnotation,
  Point,
  DetailedTextItem,
} from "@/types/pdf";
import {
  renderPdfPageToCanvas,
  cancelCanvasRender,
  extractDetailedPageText,
} from "@/lib/pdf/pdfjs-init";
import { generateId, cn } from "@/lib/utils";
import { StickyNote as StickyNoteIcon, X, Check, Trash2, RotateCw, EyeOff, QrCode, Edit3 } from "lucide-react";

interface EditorCanvasProps {
  pdfDoc: any;
  activePageIndex: number;
  pageMeta: PageMetadata;
  zoom: number;
  activeTool: ToolType;
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onAddAnnotation: (ann: Annotation) => void;
  onUpdateAnnotation: (ann: Annotation) => void;
  onDeleteAnnotation: (id: string) => void;
  // Active tool settings
  activeColor: string;
  activeStrokeWidth: number;
  activeFontSize: number;
  activeFontFamily: string;
  activeOpacity: number;
}

const getFontFamilyCss = (fontFamily?: string) => {
  if (!fontFamily) return '"Times New Roman", Times, Georgia, serif';
  if (/times|roman|serif|georgia|cambria|garamond/i.test(fontFamily)) {
    return '"Times New Roman", Times, Georgia, serif';
  }
  if (/courier|mono|consolas/i.test(fontFamily)) {
    return '"Courier New", Courier, monospace';
  }
  if (/arial|helvetica|sans/i.test(fontFamily)) {
    return 'Arial, Helvetica, -apple-system, BlinkMacSystemFont, sans-serif';
  }
  return `"${fontFamily}", "Times New Roman", Georgia, serif`;
};

export function EditorCanvas({
  pdfDoc,
  activePageIndex,
  pageMeta,
  zoom,
  activeTool,
  annotations,
  selectedAnnotationId,
  onSelectAnnotation,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  activeColor,
  activeStrokeWidth,
  activeFontSize,
  activeFontFamily,
  activeOpacity,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayContainerRef = useRef<HTMLDivElement | null>(null);

  const initialWidth = Math.round((pageMeta.width || 595.28) * zoom * 1.5);
  const initialHeight = Math.round((pageMeta.height || 841.89) * zoom * 1.5);

  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({
    width: initialWidth,
    height: initialHeight,
  });

  // Detailed PDF native text elements on this page
  const [pageTextItems, setPageTextItems] = useState<DetailedTextItem[]>([]);

  // Keep pageDimensions synced when zoom or metadata changes
  useEffect(() => {
    const w = Math.round((pageMeta.width || 595.28) * zoom * 1.5);
    const h = Math.round((pageMeta.height || 841.89) * zoom * 1.5);
    setPageDimensions({ width: w, height: h });
  }, [pageMeta.width, pageMeta.height, zoom]);

  // Extract native text items when PDF doc or active page changes
  useEffect(() => {
    if (pdfDoc && activePageIndex >= 0 && !pageMeta.isBlank) {
      extractDetailedPageText(pdfDoc, activePageIndex).then((items) => {
        setPageTextItems(items);
      });
    } else {
      setPageTextItems([]);
    }
  }, [pdfDoc, activePageIndex, pageMeta.isBlank]);

  // State for in-progress drawings / shapes / drags
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<Point[]>([]);
  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
  const [dragAction, setDragAction] = useState<"move" | "resize" | "create" | "pan" | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Pan tool state
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);

  // Render PDF.js page onto pdfCanvas
  useEffect(() => {
    let isCancelled = false;

    async function render(retries = 2) {
      if (!pdfCanvasRef.current) return;

      if (pageMeta.isBlank || pageMeta.originalIndex < 0) {
        const canvas = pdfCanvasRef.current;
        const width = (pageMeta.width || 595.28) * zoom * 1.5;
        const height = (pageMeta.height || 841.89) * zoom * 1.5;
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * outputScale);
        canvas.height = Math.floor(height * outputScale);
        canvas.style.width = Math.floor(width) + "px";
        canvas.style.height = Math.floor(height) + "px";
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setPageDimensions({ width, height });
        return;
      }

      if (!pdfDoc) return;
      try {
        const targetIndex =
          pageMeta.originalIndex !== undefined && pageMeta.originalIndex >= 0
            ? pageMeta.originalIndex
            : activePageIndex;

        const dims = await renderPdfPageToCanvas({
          pdfDoc,
          pageIndex: targetIndex,
          canvas: pdfCanvasRef.current,
          scale: zoom * 1.5, // 1.5 base scale for crispness
          rotation: pageMeta.rotation,
        });

        if (!isCancelled && dims) {
          setPageDimensions({
            width: dims.width,
            height: dims.height,
          });
        }
      } catch (err: any) {
        if (!isCancelled && retries > 0) {
          setTimeout(() => render(retries - 1), 100);
        } else {
          console.error("PDF page render error:", err);
        }
      }
    }

    render();

    return () => {
      isCancelled = true;
      cancelCanvasRender(pdfCanvasRef.current);
    };
  }, [pdfDoc, activePageIndex, zoom, pageMeta.rotation, pageMeta.isBlank, pageMeta.originalIndex, pageMeta.width, pageMeta.height]);

  // Filter annotations for current page
  const pageAnnotations = annotations.filter((a) => a.pageIndex === activePageIndex);
  const selectedAnnotation = pageAnnotations.find((a) => a.id === selectedAnnotationId) || null;

  // Helper to convert screen mouse event to percentage page coordinates (0-100%)
  const getPageCoords = useCallback(
    (e: React.MouseEvent | MouseEvent): Point => {
      if (!overlayContainerRef.current) return { x: 0, y: 0 };
      const rect = overlayContainerRef.current.getBoundingClientRect();
      const xPx = e.clientX - rect.left;
      const yPx = e.clientY - rect.top;

      const x = Math.max(0, Math.min(100, (xPx / rect.width) * 100));
      const y = Math.max(0, Math.min(100, (yPx / rect.height) * 100));
      return { x, y };
    },
    []
  );

  // Handle Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    const coords = getPageCoords(e);

    if (activeTool === "hand") {
      setDragAction("pan");
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      setIsInteracting(true);
      return;
    }

    if (["pen", "highlight", "underline", "strikethrough"].includes(activeTool)) {
      setDragAction("create");
      setCurrentDrawPoints([coords]);
      setIsInteracting(true);
      return;
    }

    if (["rectangle", "circle", "line", "arrow", "redact"].includes(activeTool)) {
      setDragAction("create");
      setDragStartPoint(coords);
      setIsInteracting(true);
      return;
    }

    if (activeTool === "text") {
      // Create new extra text annotation with transparent background
      const newText: TextAnnotation = {
        id: generateId(),
        type: "text",
        pageIndex: activePageIndex,
        x: coords.x,
        y: coords.y,
        width: 18,
        height: 3.5,
        text: "New Text",
        fontFamily: activeFontFamily || "Helvetica",
        fontSize: activeFontSize || 14,
        color: activeColor || "#0f0e0d",
        backgroundColor: "transparent",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        opacity: activeOpacity,
        createdAt: Date.now(),
      };
      onAddAnnotation(newText);
      onSelectAnnotation(newText.id);
      setEditingTextId(newText.id);
      return;
    }

    if (activeTool === "edit-text") {
      // In edit-text mode, user clicks directly on the dashed highlighted text lines.
      // Clicking empty area deselects.
      onSelectAnnotation(null);
      setEditingTextId(null);
      return;
    }

    if (activeTool === "note") {
      const newNote: StickyNoteAnnotation = {
        id: generateId(),
        type: "note",
        pageIndex: activePageIndex,
        x: coords.x,
        y: coords.y,
        width: 22,
        height: 12,
        text: "New note",
        color: "#fef08a",
        isOpen: true,
        createdAt: Date.now(),
      };
      onAddAnnotation(newNote);
      onSelectAnnotation(newNote.id);
      return;
    }

    // Default select tool clicked background
    if (activeTool === "select") {
      onSelectAnnotation(null);
      setEditingTextId(null);
    }
  };

  // Handle Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteracting) return;

    const coords = getPageCoords(e);

    if (dragAction === "pan" && panStart) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (dragAction === "create") {
      if (["pen", "highlight", "underline", "strikethrough"].includes(activeTool)) {
        setCurrentDrawPoints((prev) => [...prev, coords]);
      }
    } else if (dragAction === "move" && selectedAnnotation && dragStartPoint) {
      const dx = coords.x - dragStartPoint.x;
      const dy = coords.y - dragStartPoint.y;

      onUpdateAnnotation({
        ...selectedAnnotation,
        x: Math.max(0, Math.min(100 - selectedAnnotation.width, selectedAnnotation.x + dx)),
        y: Math.max(0, Math.min(100 - selectedAnnotation.height, selectedAnnotation.y + dy)),
      });
      setDragStartPoint(coords);
    } else if (dragAction === "resize" && selectedAnnotation && dragStartPoint && resizeHandle) {
      const dx = coords.x - dragStartPoint.x;
      const dy = coords.y - dragStartPoint.y;

      let newX = selectedAnnotation.x;
      let newY = selectedAnnotation.y;
      let newW = selectedAnnotation.width;
      let newH = selectedAnnotation.height;

      if (resizeHandle.includes("e")) newW = Math.max(3, selectedAnnotation.width + dx);
      if (resizeHandle.includes("s")) newH = Math.max(3, selectedAnnotation.height + dy);
      if (resizeHandle.includes("w")) {
        newW = Math.max(3, selectedAnnotation.width - dx);
        newX = selectedAnnotation.x + dx;
      }
      if (resizeHandle.includes("n")) {
        newH = Math.max(3, selectedAnnotation.height - dy);
        newY = selectedAnnotation.y + dy;
      }

      onUpdateAnnotation({
        ...selectedAnnotation,
        x: newX,
        y: newY,
        width: newW,
        height: newH,
      });
      setDragStartPoint(coords);
    }
  };

  // Handle Mouse Up / Finish Interaction
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isInteracting) return;

    const coords = getPageCoords(e);

    if (dragAction === "create") {
      if (["pen", "highlight", "underline", "strikethrough"].includes(activeTool)) {
        if (currentDrawPoints.length > 1) {
          const isHighlight = activeTool === "highlight";
          const newDraw: DrawAnnotation = {
            id: generateId(),
            type: isHighlight ? "highlight" : "pen",
            pageIndex: activePageIndex,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            points: [...currentDrawPoints, coords],
            color: activeColor,
            strokeWidth: isHighlight ? 16 : activeStrokeWidth,
            opacity: isHighlight ? 0.35 : activeOpacity,
            createdAt: Date.now(),
          };
          onAddAnnotation(newDraw);
        }
        setCurrentDrawPoints([]);
      } else if (["rectangle", "circle", "line", "arrow"].includes(activeTool) && dragStartPoint) {
        const x = Math.min(dragStartPoint.x, coords.x);
        const y = Math.min(dragStartPoint.y, coords.y);
        const width = Math.max(2, Math.abs(coords.x - dragStartPoint.x));
        const height = Math.max(2, Math.abs(coords.y - dragStartPoint.y));

        if (activeTool === "redact") {
          const newRedact: RedactAnnotation = {
            id: generateId(),
            type: "redact",
            pageIndex: activePageIndex,
            x,
            y,
            width,
            height,
            fillColor: "#000000",
            overlayText: "[REDACTED]",
            createdAt: Date.now(),
          };
          onAddAnnotation(newRedact);
          onSelectAnnotation(newRedact.id);
        } else {
          const newShape: ShapeAnnotation = {
            id: generateId(),
            type: activeTool as "rectangle" | "circle" | "line" | "arrow",
            pageIndex: activePageIndex,
            x,
            y,
            width,
            height,
            strokeColor: activeColor,
            fillColor: "transparent",
            strokeWidth: activeStrokeWidth,
            opacity: activeOpacity,
            createdAt: Date.now(),
          };
          onAddAnnotation(newShape);
          onSelectAnnotation(newShape.id);
        }
      }
    }

    setIsInteracting(false);
    setDragAction(null);
    setDragStartPoint(null);
    setResizeHandle(null);
    setPanStart(null);
  };

  // Start moving an annotation or trigger inline edit for text
  const startMovingAnnotation = (e: React.MouseEvent, ann: Annotation) => {
    e.stopPropagation();
    if (activeTool === "eraser") {
      onDeleteAnnotation(ann.id);
      return;
    }
    if (ann.type === "text" && (activeTool === "edit-text" || activeTool === "text" || activeTool === "select")) {
      onSelectAnnotation(ann.id);
      setEditingTextId(ann.id);
      return;
    }
    if (activeTool !== "select") return;
    onSelectAnnotation(ann.id);
    setDragAction("move");
    setDragStartPoint(getPageCoords(e));
    setIsInteracting(true);
  };

  // Start resizing an annotation
  const startResizingAnnotation = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setDragAction("resize");
    setResizeHandle(handle);
    setDragStartPoint(getPageCoords(e));
    setIsInteracting(true);
  };

  const getCursor = () => {
    if (activeTool === "hand") return isInteracting ? "grabbing" : "grab";
    if (activeTool === "text" || activeTool === "edit-text") return "text";
    if (["pen", "highlight", "rectangle", "circle", "arrow", "line"].includes(activeTool)) return "crosshair";
    if (activeTool === "eraser") return "not-allowed";
    return "default";
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full overflow-auto bg-[#f4f3f0] flex items-start justify-center p-6 sm:p-10 relative select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="m-auto shrink-0 flex items-center justify-center py-4">
        {/* PDF & Annotation Stack Card */}
        <div
          className="relative shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-neutral-300/80 bg-white rounded-xs transition-transform duration-75 ease-out"
          style={{
            width: pageDimensions.width || 600,
            height: pageDimensions.height || 800,
            cursor: getCursor(),
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Layer 1: PDF.js rendered canvas */}
          <canvas ref={pdfCanvasRef} className="block w-full h-full bg-white rounded-xs pointer-events-none" />

          {/* Layer 2: Interactive Live PDF Text Layer (for Edit Text mode) */}
          {activeTool === "edit-text" && pageTextItems.length > 0 && (
            <div className="absolute inset-0 pointer-events-auto z-30">
              {pageTextItems.map((item) => {
                const existingAnn = pageAnnotations.find(
                  (a) =>
                    a.type === "text" &&
                    Math.abs(a.x - item.x) < 3.5 &&
                    Math.abs(a.y - item.y) < 2.5
                );
                const isCurrentlyEditing = existingAnn && editingTextId === existingAnn.id;

                const handleActivate = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (existingAnn) {
                    onSelectAnnotation(existingAnn.id);
                    setEditingTextId(existingAnn.id);
                    return;
                  }
                  const newTextAnn: TextAnnotation = {
                    id: generateId(),
                    type: "text",
                    pageIndex: activePageIndex,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    text: item.str,
                    fontFamily: item.fontFamily || "Times-Roman",
                    fontSize: item.fontSize || 12,
                    color: "#0f0e0d",
                    backgroundColor: "#ffffff",
                    bold: !!item.bold,
                    italic: !!item.italic,
                    underline: false,
                    align: "left",
                    opacity: 1,
                    createdAt: Date.now(),
                  };
                  onAddAnnotation(newTextAnn);
                  onSelectAnnotation(newTextAnn.id);
                  setEditingTextId(newTextAnn.id);
                };

                return (
                  <div
                    key={item.id}
                    onMouseDown={handleActivate}
                    onClick={handleActivate}
                    className={cn(
                      "absolute border border-dashed transition-all cursor-text rounded-xs",
                      isCurrentlyEditing
                        ? "pointer-events-none opacity-0"
                        : existingAnn
                        ? "border-emerald-400/90 bg-emerald-500/10 hover:border-emerald-600 hover:bg-emerald-500/20"
                        : "border-blue-400/80 bg-blue-500/10 hover:border-blue-600 hover:bg-blue-500/20"
                    )}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.width}%`,
                      height: `${item.height}%`,
                    }}
                    title={`Click to edit: "${item.str}"`}
                  />
                );
              })}
            </div>
          )}

          {/* Layer 3: Interactive HTML & SVG Overlay */}
          <div
            ref={overlayContainerRef}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          >
          {/* SVG Vector paths for Freehand & Highlights */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Baked page drawings */}
            {pageAnnotations.map((ann) => {
              if (["pen", "highlight", "underline", "strikethrough"].includes(ann.type)) {
                const draw = ann as DrawAnnotation;
                if (!draw.points || draw.points.length < 2) return null;
                const pathData = draw.points.reduce(
                  (acc, pt, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`,
                  ""
                );
                return (
                  <path
                    key={draw.id}
                    d={pathData}
                    stroke={draw.color}
                    strokeWidth={draw.strokeWidth * 0.25}
                    strokeOpacity={draw.opacity}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="pointer-events-auto cursor-pointer hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeTool === "eraser") {
                        onDeleteAnnotation(draw.id);
                        return;
                      }
                      onSelectAnnotation(draw.id);
                    }}
                  />
                );
              }
              return null;
            })}

            {/* Live in-progress drawing preview */}
            {currentDrawPoints.length > 1 && (
              <path
                d={currentDrawPoints.reduce(
                  (acc, pt, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`,
                  ""
                )}
                stroke={activeColor}
                strokeWidth={activeTool === "highlight" ? 16 * 0.25 : activeStrokeWidth * 0.25}
                strokeOpacity={activeTool === "highlight" ? 0.35 : activeOpacity}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </svg>

          {/* Render All Other Annotation Objects */}
          {pageAnnotations.map((ann) => {
            if (["pen", "highlight"].includes(ann.type)) return null;

            const isSelected = selectedAnnotationId === ann.id;
            const isEditing = editingTextId === ann.id;

            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMovingAnnotation(e, ann)}
                className={cn(
                  "absolute transition-shadow pointer-events-auto",
                  isSelected
                    ? "ring-1 ring-blue-500"
                    : "hover:ring-1 hover:ring-blue-300"
                )}
                style={{
                  left: `${ann.x}%`,
                  top: `${ann.y}%`,
                  width: `${ann.width}%`,
                  minWidth: ann.type === "text" ? "max-content" : undefined,
                  height: `${ann.height}%`,
                  zIndex: isEditing ? 50 : isSelected ? 35 : 25,
                }}
              >
                {/* Text Annotation */}
                {ann.type === "text" && (
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onSelectAnnotation(ann.id);
                      setEditingTextId(ann.id);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAnnotation(ann.id);
                      setEditingTextId(ann.id);
                    }}
                    className="w-full h-full flex items-center relative select-none cursor-text"
                    style={{
                      fontFamily: getFontFamilyCss((ann as TextAnnotation).fontFamily),
                      fontSize: `${(ann as TextAnnotation).fontSize * zoom * 1.5}px`,
                      color: (ann as TextAnnotation).color || "#0f0e0d",
                      backgroundColor:
                        (ann as TextAnnotation).backgroundColor &&
                        (ann as TextAnnotation).backgroundColor !== "transparent"
                          ? (ann as TextAnnotation).backgroundColor
                          : "transparent",
                      fontWeight: (ann as TextAnnotation).bold ? "bold" : "normal",
                      fontStyle: (ann as TextAnnotation).italic ? "italic" : "normal",
                      textDecoration: (ann as TextAnnotation).underline ? "underline" : "none",
                      justifyContent:
                        (ann as TextAnnotation).align === "center"
                          ? "center"
                          : (ann as TextAnnotation).align === "right"
                          ? "flex-end"
                          : "flex-start",
                      opacity: ann.opacity ?? 1,
                      whiteSpace: (ann as TextAnnotation).text.includes("\n") ? "pre-wrap" : "nowrap",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onSelectAnnotation(ann.id);
                      setEditingTextId(ann.id);
                    }}
                  >
                    {/* Floating quick action toolbar when selected in Select mode */}
                    {isSelected && !editingTextId && activeTool === "select" && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute -top-7 left-0 bg-neutral-900 text-white rounded-md px-1.5 py-0.5 flex items-center gap-1.5 shadow-lg z-40 text-[10px] whitespace-nowrap"
                      >
                        <button
                          type="button"
                          onClick={() => setEditingTextId(ann.id)}
                          className="hover:text-blue-400 font-medium px-1"
                          title="Edit text"
                        >
                          Edit
                        </button>
                        <span className="text-neutral-600">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = (ann as TextAnnotation).fontSize || 12;
                            onUpdateAnnotation({ ...ann, fontSize: Math.max(8, cur - 1) } as TextAnnotation);
                          }}
                          className="hover:text-blue-400 font-bold px-1"
                          title="Decrease size"
                        >
                          A-
                        </button>
                        <span className="font-mono text-neutral-300">{(ann as TextAnnotation).fontSize}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = (ann as TextAnnotation).fontSize || 12;
                            onUpdateAnnotation({ ...ann, fontSize: Math.min(72, cur + 1) } as TextAnnotation);
                          }}
                          className="hover:text-blue-400 font-bold px-1"
                          title="Increase size"
                        >
                          A+
                        </button>
                        <span className="text-neutral-600">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateAnnotation({ ...ann, bold: !(ann as TextAnnotation).bold } as TextAnnotation);
                          }}
                          className={cn("px-1 font-bold rounded", (ann as TextAnnotation).bold ? "text-blue-400 bg-neutral-800" : "hover:text-blue-400")}
                          title="Toggle Bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAnnotation(ann.id)}
                          className="text-red-400 hover:text-red-300 p-0.5 ml-0.5"
                          title="Delete text"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {editingTextId === ann.id ? (
                      (ann as TextAnnotation).text.includes("\n") ? (
                        <textarea
                          autoFocus
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            const v = e.target.value;
                            e.target.setSelectionRange(v.length, v.length);
                          }}
                          value={(ann as TextAnnotation).text}
                          onChange={(e) => {
                            onUpdateAnnotation({
                              ...ann,
                              text: e.target.value,
                            } as TextAnnotation);
                          }}
                          onBlur={() => setEditingTextId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              setEditingTextId(null);
                            }
                            if (e.key === "Escape") {
                              setEditingTextId(null);
                            }
                          }}
                          className={cn(
                            "w-full h-full p-0.5 resize-none focus:outline-none border border-blue-500 rounded-xs leading-tight min-w-[60px]",
                            (ann as TextAnnotation).backgroundColor &&
                              (ann as TextAnnotation).backgroundColor !== "transparent"
                              ? "bg-white text-neutral-900 shadow-xs"
                              : "bg-transparent text-inherit"
                          )}
                          style={{
                            fontFamily: getFontFamilyCss((ann as TextAnnotation).fontFamily),
                            fontSize: `${(ann as TextAnnotation).fontSize * zoom * 1.5}px`,
                            color: (ann as TextAnnotation).color || "#0f0e0d",
                            fontWeight: (ann as TextAnnotation).bold ? "bold" : "normal",
                            fontStyle: (ann as TextAnnotation).italic ? "italic" : "normal",
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          autoFocus
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            const v = e.target.value;
                            e.target.setSelectionRange(v.length, v.length);
                          }}
                          value={(ann as TextAnnotation).text}
                          onChange={(e) => {
                            onUpdateAnnotation({
                              ...ann,
                              text: e.target.value,
                            } as TextAnnotation);
                          }}
                          onBlur={() => setEditingTextId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") {
                              setEditingTextId(null);
                            }
                          }}
                          className={cn(
                            "w-full h-full px-0.5 focus:outline-none border border-blue-500 rounded-xs leading-none min-w-[60px]",
                            (ann as TextAnnotation).backgroundColor &&
                              (ann as TextAnnotation).backgroundColor !== "transparent"
                              ? "bg-white text-neutral-900 shadow-xs"
                              : "bg-transparent text-inherit"
                          )}
                          style={{
                            fontFamily: getFontFamilyCss((ann as TextAnnotation).fontFamily),
                            fontSize: `${(ann as TextAnnotation).fontSize * zoom * 1.5}px`,
                            color: (ann as TextAnnotation).color || "#0f0e0d",
                            fontWeight: (ann as TextAnnotation).bold ? "bold" : "normal",
                            fontStyle: (ann as TextAnnotation).italic ? "italic" : "normal",
                          }}
                        />
                      )
                    ) : (
                      <span className="select-none leading-none whitespace-nowrap px-0.5">
                        {(ann as TextAnnotation).text}
                      </span>
                    )}
                  </div>
                )}

                {/* Rectangle */}
                {ann.type === "rectangle" && (
                  <div
                    className="w-full h-full"
                    style={{
                      border: `${(ann as ShapeAnnotation).strokeWidth}px solid ${(ann as ShapeAnnotation).strokeColor}`,
                      backgroundColor: (ann as ShapeAnnotation).fillColor,
                      opacity: ann.opacity ?? 1,
                    }}
                  />
                )}

                {/* Circle */}
                {ann.type === "circle" && (
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      border: `${(ann as ShapeAnnotation).strokeWidth}px solid ${(ann as ShapeAnnotation).strokeColor}`,
                      backgroundColor: (ann as ShapeAnnotation).fillColor,
                      opacity: ann.opacity ?? 1,
                    }}
                  />
                )}

                {/* Line or Arrow */}
                {(ann.type === "line" || ann.type === "arrow") && (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <line
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="100"
                      stroke={(ann as ShapeAnnotation).strokeColor}
                      strokeWidth={(ann as ShapeAnnotation).strokeWidth * 1.5}
                      opacity={ann.opacity ?? 1}
                    />
                    {ann.type === "arrow" && (
                      <polygon
                        points="100,100 85,85 95,75"
                        fill={(ann as ShapeAnnotation).strokeColor}
                        opacity={ann.opacity ?? 1}
                      />
                    )}
                  </svg>
                )}

                {/* Signature */}
                {ann.type === "signature" && (
                  <img
                    src={(ann as SignatureAnnotation).dataUrl}
                    alt="Signature"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    style={{ opacity: ann.opacity ?? 1 }}
                  />
                )}

                {/* Stamp */}
                {ann.type === "stamp" && (
                  <div
                    className="w-full h-full rounded-xl border-3 flex items-center justify-center font-black tracking-widest text-center uppercase select-none shadow-xs"
                    style={{
                      borderColor: (ann as StampAnnotation).color,
                      color: (ann as StampAnnotation).color,
                      backgroundColor: `${(ann as StampAnnotation).color}15`,
                      fontSize: `${Math.max(11, ann.height * zoom * 3.5)}px`,
                      opacity: ann.opacity ?? 0.9,
                    }}
                  >
                    {(ann as StampAnnotation).stampText}
                  </div>
                )}

                {/* Barcode & QR Code */}
                {ann.type === "barcode" && (
                  <img
                    src={(ann as BarcodeAnnotation).dataUrl}
                    alt="Barcode / QR"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    style={{ opacity: ann.opacity ?? 1 }}
                  />
                )}

                {/* Redaction / Blackout */}
                {ann.type === "redact" && (
                  <div
                    className="w-full h-full flex items-center justify-center font-mono font-bold text-red-500 text-[10px] tracking-wider select-none shadow-sm border border-neutral-800"
                    style={{
                      backgroundColor: (ann as RedactAnnotation).fillColor || "#000000",
                    }}
                  >
                    {(ann as RedactAnnotation).overlayText || "[REDACTED]"}
                  </div>
                )}

                {/* Image */}
                {ann.type === "image" && (
                  <img
                    src={(ann as ImageAnnotation).dataUrl}
                    alt="Inserted"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    style={{ opacity: ann.opacity ?? 1 }}
                  />
                )}

                {/* Sticky Note */}
                {ann.type === "note" && (
                  <div
                    className="w-full h-full rounded-xl p-2 shadow-lg border border-amber-300 flex flex-col justify-between"
                    style={{
                      backgroundColor: (ann as StickyNoteAnnotation).color || "#fef08a",
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-neutral-700">
                      <span className="flex items-center gap-1">
                        <StickyNoteIcon className="w-3 h-3" /> Note
                      </span>
                    </div>
                    <textarea
                      value={(ann as StickyNoteAnnotation).text}
                      onChange={(e) => {
                        onUpdateAnnotation({
                          ...ann,
                          text: e.target.value,
                        } as StickyNoteAnnotation);
                      }}
                      className="w-full h-12 bg-transparent text-xs text-neutral-800 placeholder-neutral-500 resize-none focus:outline-none"
                      placeholder="Type note..."
                    />
                  </div>
                )}

                {/* Resizing handles for selected non-text objects */}
                {isSelected && ann.type !== "text" && (
                  <>
                    <div
                      onMouseDown={(e) => startResizingAnnotation(e, "nw")}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize z-30"
                    />
                    <div
                      onMouseDown={(e) => startResizingAnnotation(e, "ne")}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize z-30"
                    />
                    <div
                      onMouseDown={(e) => startResizingAnnotation(e, "se")}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize z-30"
                    />
                    <div
                      onMouseDown={(e) => startResizingAnnotation(e, "sw")}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize z-30"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
}
