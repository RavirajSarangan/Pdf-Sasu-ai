"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Check, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQRCode: (dataUrl: string, qrText: string) => void;
}

export function QRCodeModal({ isOpen, onClose, onAddQRCode }: QRCodeModalProps) {
  const [text, setText] = useState("https://pdfforge.local/verify");
  const [darkColor, setDarkColor] = useState("#000000");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && text.trim()) {
      QRCode.toDataURL(text.trim(), {
        width: 300,
        margin: 2,
        color: {
          dark: darkColor,
          light: "#00000000", // transparent light
        },
      })
        .then(setPreviewUrl)
        .catch(console.error);
    }
  }, [isOpen, text, darkColor]);

  const handleApply = () => {
    if (!previewUrl) return;
    onAddQRCode(previewUrl, text.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Scannable QR Code"
      description="Embed verification links, URLs, or metadata QR codes onto your PDF."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            QR Content / Target URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or Verification ID"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <ColorPicker label="QR Code Foreground Color" value={darkColor} onChange={setDarkColor} />

        {/* Live Preview */}
        {previewUrl && (
          <div className="p-4 bg-neutral-100 rounded-2xl flex flex-col items-center justify-center gap-2">
            <img src={previewUrl} alt="QR Code Preview" className="w-32 h-32 object-contain" />
            <span className="text-[11px] text-neutral-500 truncate max-w-xs font-mono">
              {text}
            </span>
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
            disabled={!previewUrl}
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
