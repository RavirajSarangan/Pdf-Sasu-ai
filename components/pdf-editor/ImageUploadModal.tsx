"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (dataUrl: string, width: number, height: number, fileName: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, onAddImage }: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setPreview(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!preview) return;
    onAddImage(preview, dimensions.width, dimensions.height, fileName);
    setPreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Insert Image into PDF" maxWidth="md">
      <div className="space-y-4">
        {!preview ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-neutral-800">
              Choose an image from your device
            </span>
            <span className="text-xs text-neutral-400 mt-1">Supports PNG, JPG, JPEG, and WebP</span>
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="sr-only" />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="p-3 border rounded-xl bg-neutral-50 flex flex-col items-center justify-center">
              <img src={preview} alt="Preview" className="max-h-56 object-contain rounded-lg shadow-sm" />
              <div className="text-xs text-neutral-400 mt-2">
                {fileName} ({dimensions.width} × {dimensions.height}px)
              </div>
            </div>
            <div className="flex justify-end">
              <label className="text-xs text-blue-600 hover:underline cursor-pointer">
                Change Image
                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" disabled={!preview} onClick={handleApply} className="gap-2">
            <Check className="w-4 h-4" />
            Insert on Page
          </Button>
        </div>
      </div>
    </Modal>
  );
}
