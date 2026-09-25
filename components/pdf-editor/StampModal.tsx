"use client";

import React, { useState } from "react";
import { Stamp, Check, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";

interface StampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStamp: (stampText: string, color: string) => void;
}

const PRESET_STAMPS = [
  { text: "APPROVED", color: "#059669" },
  { text: "CONFIDENTIAL", color: "#dc2626" },
  { text: "DRAFT", color: "#d97706" },
  { text: "REJECTED", color: "#e11d48" },
  { text: "FINAL", color: "#2563eb" },
  { text: "VOID", color: "#64748b" },
  { text: "COPY", color: "#7c3aed" },
  { text: "SIGN HERE", color: "#4f46e5" },
];

export function StampModal({ isOpen, onClose, onAddStamp }: StampModalProps) {
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#dc2626");

  const handleSelectPreset = (stamp: { text: string; color: string }) => {
    onAddStamp(stamp.text, stamp.color);
    onClose();
  };

  const handleApplyCustom = () => {
    if (!customText.trim()) return;
    onAddStamp(customText.trim().toUpperCase(), customColor);
    setCustomText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Document Stamp"
      description="Select a business status stamp or create a custom one."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Presets Grid */}
        <div className="grid grid-cols-2 gap-3">
          {PRESET_STAMPS.map((stamp) => (
            <button
              key={stamp.text}
              onClick={() => handleSelectPreset(stamp)}
              className="p-3.5 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 flex items-center justify-center font-black tracking-widest text-xs uppercase"
              style={{
                borderColor: stamp.color,
                color: stamp.color,
                backgroundColor: `${stamp.color}15`,
              }}
            >
              {stamp.text}
            </button>
          ))}
        </div>

        {/* Custom Stamp Section */}
        <div className="pt-3 border-t border-neutral-100 space-y-3">
          <span className="text-xs font-semibold text-neutral-500">Custom Stamp:</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. RECEIVED"
              className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs uppercase font-bold"
            />
            <Button
              variant="primary"
              size="sm"
              disabled={!customText.trim()}
              onClick={handleApplyCustom}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>
          <ColorPicker label="Stamp Ink Color" value={customColor} onChange={setCustomColor} />
        </div>
      </div>
    </Modal>
  );
}
