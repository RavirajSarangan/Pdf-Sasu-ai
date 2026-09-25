"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, Barcode as BarcodeIcon, Download, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { useToast } from "@/components/ui/ToastProvider";
import confetti from "canvas-confetti";

export function BarcodeTool() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"qr" | "barcode">("qr");

  // QR state
  const [qrText, setQrText] = useState("https://pdfforge.local/verify-document");
  const [qrDarkColor, setQrDarkColor] = useState("#000000");
  const [qrSize, setQrSize] = useState(500);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Barcode state
  const [barcodeFormat, setBarcodeFormat] = useState<"CODE128" | "EAN13" | "UPC" | "CODE39">("CODE128");
  const [barcodeText, setBarcodeText] = useState("DOC-9824-SECURE");
  const [barcodeColor, setBarcodeColor] = useState("#000000");
  const [includeText, setIncludeText] = useState(true);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>("");
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate QR
  useEffect(() => {
    if (activeTab === "qr" && qrText.trim()) {
      QRCode.toDataURL(qrText.trim(), {
        width: qrSize,
        margin: 2,
        color: {
          dark: qrDarkColor,
          light: "#ffffffff",
        },
      })
        .then(setQrDataUrl)
        .catch((err) => console.error("QR Error:", err));
    }
  }, [activeTab, qrText, qrDarkColor, qrSize]);

  // Generate Barcode
  useEffect(() => {
    if (activeTab === "barcode" && barcodeText.trim() && barcodeCanvasRef.current) {
      setBarcodeError(null);
      try {
        const canvas = barcodeCanvasRef.current;
        JsBarcode(canvas, barcodeText.trim(), {
          format: barcodeFormat,
          lineColor: barcodeColor,
          width: 3,
          height: 100,
          displayValue: includeText,
          font: "monospace",
          fontSize: 16,
          margin: 15,
          background: "#ffffff",
        });
        setBarcodeDataUrl(canvas.toDataURL("image/png"));
      } catch (err: any) {
        setBarcodeError(err?.message || "Invalid input for selected standard");
        setBarcodeDataUrl("");
      }
    }
  }, [activeTab, barcodeText, barcodeFormat, barcodeColor, includeText]);

  const handleDownloadImage = () => {
    const dataUrl = activeTab === "qr" ? qrDataUrl : barcodeDataUrl;
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${activeTab === "qr" ? "qrcode" : "barcode"}-${Date.now()}.png`;
    link.click();
    confetti({ particleCount: 30, spread: 50 });
    success("Downloaded image successfully!");
  };

  const handleCopyImage = async () => {
    const dataUrl = activeTab === "qr" ? qrDataUrl : barcodeDataUrl;
    if (!dataUrl) return;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      success("Copied to clipboard!");
    } catch {
      error("Clipboard copy not supported in this browser");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-2 border border-indigo-200/60 shadow-inner">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          QR Code & Barcode Studio
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto text-sm">
          Generate high-resolution scannable 2D QR codes and enterprise 1D Barcodes for documents, labels, and inventory.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 space-y-6">
        {/* Tab switch */}
        <div className="flex bg-neutral-100 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "qr"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Code Generator (2D)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("barcode")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "barcode"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <BarcodeIcon className="w-4 h-4" />
            Barcode Generator (1D)
          </button>
        </div>

        {/* Form and Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
          {/* Controls Column */}
          <div className="space-y-4">
            {activeTab === "qr" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Content, URL, or Text
                  </label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="https://example.com or any text"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <ColorPicker label="QR Code Color" value={qrDarkColor} onChange={setQrDarkColor} />
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Barcode Standard
                  </label>
                  <select
                    value={barcodeFormat}
                    onChange={(e) => setBarcodeFormat(e.target.value as any)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CODE128">Code 128 (Standard alphanumeric)</option>
                    <option value="CODE39">Code 39</option>
                    <option value="EAN13">EAN-13 (13 Digits)</option>
                    <option value="UPC">UPC (12 Digits)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Barcode Value
                  </label>
                  <input
                    type="text"
                    value={barcodeText}
                    onChange={(e) => setBarcodeText(e.target.value)}
                    placeholder="e.g. DOC-9824-SECURE"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeText}
                    onChange={(e) => setIncludeText(e.target.checked)}
                    className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Show human-readable text under barcode</span>
                </label>

                <ColorPicker label="Barcode Color" value={barcodeColor} onChange={setBarcodeColor} />
              </>
            )}

            <canvas ref={barcodeCanvasRef} className="hidden" />

            {barcodeError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                {barcodeError}
              </div>
            )}
          </div>

          {/* Preview Column */}
          <div className="flex flex-col items-center justify-center p-6 bg-neutral-100 rounded-2xl border border-neutral-200 space-y-4 min-h-[260px]">
            {activeTab === "qr" ? (
              qrDataUrl ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <img src={qrDataUrl} alt="QR Code Preview" className="w-48 h-48 object-contain" />
                </div>
              ) : (
                <div className="text-xs text-neutral-400">Generating preview...</div>
              )
            ) : barcodeDataUrl ? (
              <div className="bg-white p-4 rounded-2xl shadow-sm w-full flex justify-center">
                <img src={barcodeDataUrl} alt="Barcode Preview" className="max-h-32 object-contain" />
              </div>
            ) : (
              <div className="text-xs text-neutral-400">Enter valid barcode text</div>
            )}

            <div className="flex items-center gap-3 w-full max-w-xs">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadImage}
                disabled={activeTab === "qr" ? !qrDataUrl : !barcodeDataUrl}
                className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
              >
                <Download className="w-4 h-4" />
                Save PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyImage}
                disabled={activeTab === "qr" ? !qrDataUrl : !barcodeDataUrl}
                className="gap-1.5"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
