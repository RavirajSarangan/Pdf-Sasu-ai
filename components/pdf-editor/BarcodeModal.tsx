"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, Barcode as BarcodeIcon, Check, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCode: (dataUrl: string, codeType: "qr" | "code128" | "ean13" | "upc" | "code39", value: string) => void;
}

export function BarcodeModal({ isOpen, onClose, onAddCode }: BarcodeModalProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "barcode">("qr");
  
  // QR state
  const [qrText, setQrText] = useState("https://pdfforge.local/verify");
  const [qrDarkColor, setQrDarkColor] = useState("#000000");
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>("");

  // Barcode 1D state
  const [barcodeFormat, setBarcodeFormat] = useState<"CODE128" | "EAN13" | "UPC" | "CODE39">("CODE128");
  const [barcodeText, setBarcodeText] = useState("PDF-9824-DOC");
  const [barcodeColor, setBarcodeColor] = useState("#000000");
  const [includeText, setIncludeText] = useState(true);
  const [barcodePreviewUrl, setBarcodePreviewUrl] = useState<string>("");
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate QR Code
  useEffect(() => {
    if (isOpen && activeTab === "qr" && qrText.trim()) {
      QRCode.toDataURL(qrText.trim(), {
        width: 400,
        margin: 2,
        color: {
          dark: qrDarkColor,
          light: "#00000000", // transparent light
        },
      })
        .then(setQrPreviewUrl)
        .catch(console.error);
    }
  }, [isOpen, activeTab, qrText, qrDarkColor]);

  // Generate 1D Barcode with JsBarcode
  useEffect(() => {
    if (isOpen && activeTab === "barcode" && barcodeText.trim() && barcodeCanvasRef.current) {
      setBarcodeError(null);
      try {
        const canvas = barcodeCanvasRef.current;
        JsBarcode(canvas, barcodeText.trim(), {
          format: barcodeFormat,
          lineColor: barcodeColor,
          width: 2.5,
          height: 80,
          displayValue: includeText,
          font: "monospace",
          fontSize: 14,
          margin: 10,
          background: "#ffffff00", // transparent
        });
        setBarcodePreviewUrl(canvas.toDataURL("image/png"));
      } catch (err: any) {
        setBarcodeError(err?.message || "Invalid format for selected barcode standard");
        setBarcodePreviewUrl("");
      }
    }
  }, [isOpen, activeTab, barcodeText, barcodeFormat, barcodeColor, includeText]);

  const handleApply = () => {
    if (activeTab === "qr") {
      if (!qrPreviewUrl) return;
      onAddCode(qrPreviewUrl, "qr", qrText.trim());
    } else {
      if (!barcodePreviewUrl) return;
      const fmtMap: Record<string, "code128" | "ean13" | "upc" | "code39"> = {
        CODE128: "code128",
        EAN13: "ean13",
        UPC: "upc",
        CODE39: "code39",
      };
      onAddCode(barcodePreviewUrl, fmtMap[barcodeFormat] || "code128", barcodeText.trim());
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert QR Code or 1D Barcode"
      description="Embed scannable 2D QR codes or enterprise 1D barcodes for inventory, tracking, and verification."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "qr"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Code (2D)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("barcode")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "barcode"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <BarcodeIcon className="w-4 h-4" />
            Barcode (1D)
          </button>
        </div>

        {activeTab === "qr" ? (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                QR Content / Target URL
              </label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://example.com or Doc ID"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <ColorPicker label="QR Color" value={qrDarkColor} onChange={setQrDarkColor} />

            {/* QR Preview */}
            {qrPreviewUrl && (
              <div className="p-4 bg-neutral-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                <img src={qrPreviewUrl} alt="QR Code Preview" className="w-32 h-32 object-contain" />
                <span className="text-[11px] text-neutral-500 truncate max-w-xs font-mono">
                  {qrText}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                  Barcode Standard
                </label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="CODE128">Code 128 (Standard)</option>
                  <option value="CODE39">Code 39</option>
                  <option value="EAN13">EAN-13 (13 Digits)</option>
                  <option value="UPC">UPC (12 Digits)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                  Text Caption
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-700 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeText}
                    onChange={(e) => setIncludeText(e.target.checked)}
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show text value</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Barcode Value / Number
              </label>
              <input
                type="text"
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                placeholder="e.g. PDF-9824-DOC or numbers"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <ColorPicker label="Barcode Color" value={barcodeColor} onChange={setBarcodeColor} />

            {/* Hidden canvas for generation */}
            <canvas ref={barcodeCanvasRef} className="hidden" />

            {barcodeError ? (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                {barcodeError}
              </div>
            ) : (
              barcodePreviewUrl && (
                <div className="p-4 bg-neutral-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <img src={barcodePreviewUrl} alt="Barcode Preview" className="max-h-24 object-contain" />
                </div>
              )
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={activeTab === "qr" ? !qrPreviewUrl : (!barcodePreviewUrl || !!barcodeError)}
            className="gap-1.5"
          >
            <Check className="w-4 h-4" />
            Insert on Page
          </Button>
        </div>
      </div>
    </Modal>
  );
}
