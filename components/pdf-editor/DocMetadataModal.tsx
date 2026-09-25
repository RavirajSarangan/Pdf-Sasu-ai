"use client";

import React, { useState } from "react";
import { FileCode, Download, Upload, Info, Check, Copy, Tag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PDFDocMetadata, Annotation, PageMetadata } from "@/types/pdf";
import { exportProjectJSON, importProjectJSON } from "@/lib/pdf/pdf-manipulation";
import { downloadBlob } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";

interface DocMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  fileSizeBytes: number;
  pages: PageMetadata[];
  annotations: Annotation[];
  metadata: PDFDocMetadata;
  onUpdateMetadata: (meta: PDFDocMetadata) => void;
  onImportAnnotations: (importedAnnotations: Annotation[], importedPages?: PageMetadata[]) => void;
}

export function DocMetadataModal({
  isOpen,
  onClose,
  documentTitle,
  fileSizeBytes,
  pages,
  annotations,
  metadata,
  onUpdateMetadata,
  onImportAnnotations,
}: DocMetadataModalProps) {
  const { success, error, info } = useToast();
  const [activeTab, setActiveTab] = useState<"metadata" | "json">("metadata");

  const [title, setTitle] = useState(metadata.title || documentTitle.replace(/\.pdf$/i, ""));
  const [author, setAuthor] = useState(metadata.author || "SASU PDF User");
  const [subject, setSubject] = useState(metadata.subject || "");
  const [keywordsStr, setKeywordsStr] = useState((metadata.keywords || ["SASU PDF", "Document"]).join(", "));

  const handleSaveMetadata = () => {
    const updated: PDFDocMetadata = {
      title: title.trim(),
      author: author.trim(),
      subject: subject.trim(),
      keywords: keywordsStr.split(",").map((k) => k.trim()).filter(Boolean),
    };
    onUpdateMetadata(updated);
    success("Metadata Saved", "Properties will be embedded during PDF export.");
    onClose();
  };

  const handleExportJSON = () => {
    const jsonString = exportProjectJSON({
      documentName: documentTitle,
      fileSizeBytes,
      pages,
      annotations,
      metadata: {
        title,
        author,
        subject,
        keywords: keywordsStr.split(",").map((k) => k.trim()).filter(Boolean),
      },
    });

    const blob = new Blob([jsonString], { type: "application/json" });
    const outName = `${documentTitle.replace(/\.pdf$/i, "")}-annotations.pdfforge.json`;
    downloadBlob(blob, outName);
    success("JSON Exported", outName);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const project = importProjectJSON(text);
        onImportAnnotations(project.annotations, project.pages);
        success("JSON Imported Successfully!", `Loaded ${project.annotations.length} annotation layers`);
        onClose();
      } catch (err: any) {
        error("Import Failed", err.message || "Invalid JSON schema");
      }
    };
    reader.readAsText(file);
  };

  const currentJsonPreview = exportProjectJSON({
    documentName: documentTitle,
    fileSizeBytes,
    pages,
    annotations,
    metadata,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Properties & JSON Studio"
      description="Manage embedded PDF metadata and export/import annotation JSON projects."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("metadata")}
            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === "metadata"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Info className="w-4 h-4" />
            PDF Metadata
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === "json"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <FileCode className="w-4 h-4" />
            Project JSON (.pdfforge)
          </button>
        </div>

        {/* Tab 1: Metadata Form */}
        {activeTab === "metadata" && (
          <div className="space-y-3.5">
            <Input
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Services Agreement"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Author / Signer"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
              />
              <Input
                label="Subject / Topic"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Legal Contract"
              />
            </div>
            <Input
              label="Keywords / Tags (comma separated)"
              value={keywordsStr}
              onChange={(e) => setKeywordsStr(e.target.value)}
              placeholder="Contract, Confidential, Signed"
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveMetadata} className="gap-1.5">
                <Check className="w-4 h-4" />
                Apply Metadata
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: JSON Export & Import */}
        {activeTab === "json" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">
                JSON Preview ({annotations.length} active annotations):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentJsonPreview);
                    info("Copied JSON to clipboard");
                  }}
                  className="text-xs text-neutral-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>

            <pre className="p-3 bg-neutral-50 text-neutral-800 text-[11px] font-mono rounded-xl max-h-52 overflow-y-auto border border-neutral-200 leading-relaxed select-all">
              {currentJsonPreview}
            </pre>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-100">
              <label>
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import JSON Project
                </Button>
                <input
                  type="file"
                  accept=".json, .pdfforge"
                  onChange={handleImportJSON}
                  className="sr-only"
                />
              </label>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExportJSON}
                className="gap-2 shadow-md shadow-blue-500/20"
              >
                <Download className="w-4 h-4" />
                Export Project JSON
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
