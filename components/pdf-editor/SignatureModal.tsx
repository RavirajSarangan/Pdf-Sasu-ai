"use client";

import React, { useState, useRef, useEffect } from "react";
import { PenTool, Type, Upload, RotateCcw, Check, Trash2, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { documentStore, SavedSignature } from "@/lib/storage/document-store";
import { getStroke } from "perfect-freehand";
import { cn } from "@/lib/utils";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSignature: (dataUrl: string) => void;
}

const SIGNATURE_FONTS = [
  { id: "font-caveat", name: "Modern Script", fontStyle: "font-serif italic text-3xl tracking-wide" },
  { id: "font-dancing", name: "Classic Flow", fontStyle: "italic text-3xl font-light" },
  { id: "font-satisfy", name: "Casual Hand", fontStyle: "italic text-3xl font-medium" },
  { id: "font-marck", name: "Formal Executive", fontStyle: "font-serif italic text-3xl font-bold" },
];

export function SignatureModal({ isOpen, onClose, onAddSignature }: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "upload" | "saved">("draw");
  const [inkColor, setInkColor] = useState("#000000");

  // Draw Tab State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [points, setPoints] = useState<number[][]>([]);
  const allStrokes = useRef<number[][][]>([]);

  // Type Tab State
  const [typedName, setTypedName] = useState("");
  const [selectedFontIndex, setSelectedFontIndex] = useState(0);

  // Upload Tab State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [removeBackground, setRemoveBackground] = useState(true);

  // Saved Signatures State
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);

  useEffect(() => {
    if (isOpen) {
      documentStore.getSavedSignatures().then(setSavedSignatures);
      setTimeout(redrawAllStrokes, 50);
    }
  }, [isOpen, activeTab]);

  const redrawAllStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = inkColor;

    for (const strokePts of allStrokes.current) {
      const stroke = getStroke(strokePts, {
        size: 5,
        thinning: 0.6,
        smoothing: 0.65,
        streamline: 0.6,
      });

      if (stroke.length === 0) continue;

      ctx.beginPath();
      ctx.moveTo(stroke[0][0], stroke[0][1]);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0], stroke[i][1]);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0, 0.5];
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const pressure = "touches" in e && (e.touches[0] as any).force ? (e.touches[0] as any).force : 0.5;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY, pressure];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCanvasCoords(e);
    setPoints([pt]);
    allStrokes.current.push([pt]);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    const lastStroke = allStrokes.current[allStrokes.current.length - 1];
    if (lastStroke) {
      lastStroke.push(pt);
      redrawAllStrokes();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    allStrokes.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        if (removeBackground) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 210 && g > 210 && b > 210) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        setUploadedImage(canvas.toDataURL("image/png"));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    let finalDataUrl = "";

    if (activeTab === "draw") {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      finalDataUrl = canvas.toDataURL("image/png");
    } else if (activeTab === "type") {
      if (!typedName.trim()) return;
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.font = `italic 56px ${
        selectedFontIndex === 0 ? "Caveat, cursive" : selectedFontIndex === 1 ? "Georgia, serif" : "cursive"
      }`;
      ctx.fillStyle = inkColor;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(typedName, 300, 100);

      finalDataUrl = canvas.toDataURL("image/png");
    } else if (activeTab === "upload") {
      if (!uploadedImage) return;
      finalDataUrl = uploadedImage;
    }

    if (finalDataUrl) {
      await documentStore.saveSignature(finalDataUrl);
      onAddSignature(finalDataUrl);
      onClose();
    }
  };

  const handleSelectSaved = (dataUrl: string) => {
    onAddSignature(dataUrl);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Digital Signature" maxWidth="lg">
      <div className="space-y-4">
        {/* Tab selection */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("draw")}
            className={cn(
              "flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
              activeTab === "draw"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            )}
          >
            <PenTool className="w-4 h-4" />
            Fluid Pen
          </button>
          <button
            onClick={() => setActiveTab("type")}
            className={cn(
              "flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
              activeTab === "type"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Type className="w-4 h-4" />
            Type
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
              activeTab === "upload"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          {savedSignatures.length > 0 && (
            <button
              onClick={() => setActiveTab("saved")}
              className={cn(
                "flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors",
                activeTab === "saved"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              )}
            >
              Saved ({savedSignatures.length})
            </button>
          )}
        </div>

        {/* Ink Color Selector */}
        {activeTab !== "saved" && activeTab !== "upload" && (
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-medium text-neutral-500">Ink Color:</span>
            <div className="flex items-center gap-2">
              {["#000000", "#1e3a8a", "#047857", "#b91c1c"].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setInkColor(color);
                    setTimeout(redrawAllStrokes, 10);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border transition-transform",
                    inkColor === color && "ring-2 ring-blue-500 scale-110"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Draw with Perfect Freehand */}
        {activeTab === "draw" && (
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-neutral-300 rounded-2xl bg-neutral-50/50 p-2 overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={260}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-52 cursor-crosshair touch-none"
              />
              <div className="absolute bottom-8 left-8 right-8 border-b border-neutral-300 pointer-events-none opacity-40" />
              <div className="absolute bottom-2.5 left-8 text-[10px] text-neutral-400 pointer-events-none flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Sign smoothly on the line above (pressure-sensitive)
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="xs" onClick={clearCanvas} className="gap-1 text-neutral-500">
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Tab Content: Type */}
        {activeTab === "type" && (
          <div className="space-y-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your legal name or initials..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto">
              {SIGNATURE_FONTS.map((font, idx) => (
                <div
                  key={font.id}
                  onClick={() => setSelectedFontIndex(idx)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer text-center transition-all",
                    selectedFontIndex === idx
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div
                    className={font.fontStyle}
                    style={{ color: inkColor, minHeight: "2.5rem" }}
                  >
                    {typedName || "Your Signature"}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-2 font-sans">{font.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Upload */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl p-8 cursor-pointer hover:bg-neutral-50 transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="text-sm font-medium text-neutral-700">
                Click to upload signature image (PNG, JPG)
              </span>
              <span className="text-xs text-neutral-400 mt-1">
                Background will be made transparent automatically
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
            </label>

            {uploadedImage && (
              <div className="p-4 border rounded-xl bg-neutral-100 flex items-center justify-center">
                <img src={uploadedImage} alt="Uploaded signature" className="max-h-24 object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Saved */}
        {activeTab === "saved" && (
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {savedSignatures.map((sig, idx) => (
              <div
                key={sig.id || idx}
                onClick={() => handleSelectSaved(sig.dataUrl)}
                className="p-3 border rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-white flex flex-col items-center justify-center gap-2 group"
              >
                <img src={sig.dataUrl} alt="Saved signature" className="max-h-16 object-contain" />
                <span className="text-[10px] text-neutral-400 group-hover:text-blue-600">
                  {sig.title || "Signature " + (idx + 1)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {activeTab !== "saved" && (
            <Button variant="primary" size="sm" onClick={handleApply} className="gap-2">
              <Check className="w-4 h-4" />
              Place Signature
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
