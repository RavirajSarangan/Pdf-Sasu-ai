"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Layers,
  Scissors,
  Minimize2,
  Trash2,
  Download,
  ExternalLink,
  Edit3,
  Clock,
  HardDrive,
  ShieldCheck,
  Plus,
  Sparkles,
  FileImage,
  FolderOpen,
  QrCode,
  Stamp,
  Hash,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Activity,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { documentStore } from "@/lib/storage/document-store";
import { StoredDocument } from "@/types/auth";
import { useToast } from "@/components/ui/ToastProvider";
import { formatBytes, formatDate, downloadArrayBuffer } from "@/lib/utils";

export function DashboardView() {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Rename modal state
  const [editingDoc, setEditingDoc] = useState<StoredDocument | null>(null);
  const [newName, setNewName] = useState("");

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const list = await documentStore.listDocuments();
      setDocuments(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      error("Invalid File", "Please select a standard PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        const id = "doc_" + Date.now();
        const newDoc: StoredDocument = {
          id,
          name: file.name,
          sizeBytes: file.size,
          totalPages: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await documentStore.saveDocument(newDoc, buffer);
        success("Document Saved", "Opening in PDFForge Studio...");
        router.push(`/editor?id=${id}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await documentStore.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      info("Document deleted");
    }
  };

  const handleRename = async () => {
    if (!editingDoc || !newName.trim()) return;
    const updated = { ...editingDoc, name: newName.trim(), updatedAt: Date.now() };
    await documentStore.saveDocument(updated);
    setDocuments((prev) => prev.map((d) => (d.id === editingDoc.id ? updated : d)));
    setEditingDoc(null);
    success("Document renamed");
  };

  const handleDownloadDoc = async (doc: StoredDocument) => {
    const full = await documentStore.getDocument(doc.id);
    if (full && full.pdfData) {
      downloadArrayBuffer(full.pdfData, doc.name);
      success("Downloaded", doc.name);
    } else {
      error("File not in local cache");
    }
  };

  const totalStorageUsed = documents.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickTools = [
    { name: "Visual Studio", desc: "Annotate, draw & sign", icon: Edit3, href: "/editor", tag: "Editor" },
    { name: "OCR Recognition", desc: "Extract text in WASM", icon: Sparkles, href: "/tools/ocr", tag: "Intelligence" },
    { name: "Barcode Studio", desc: "QR & 1D Barcodes", icon: QrCode, href: "/tools/barcode", tag: "Security" },
    { name: "Watermark PDF", desc: "Security stamps & text", icon: Stamp, href: "/tools/watermark", tag: "Security" },
    { name: "Page Numbering", desc: "Automate page counts", icon: Hash, href: "/tools/page-numbers", tag: "Organization" },
    { name: "Merge PDFs", desc: "Combine multiple files", icon: Layers, href: "/tools/merge", tag: "Organization" },
  ];

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`min-h-screen bg-[#fafaf9] text-[#0f0e0d] py-10 sm:py-16 transition-colors ${
        isDragOver ? "ring-4 ring-inset ring-[#0f0e0d]/20 bg-amber-500/5" : ""
      }`}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-12 space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#e5e5e3]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e3] bg-white px-3 py-1 text-xs font-mono text-[#524f49] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM WORKSPACE • 100% LOCAL WASM SANDBOX</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.1] tracking-[-0.02em] text-[#0f0e0d]">
              Document Studio Workspace
            </h1>
            <p className="text-sm text-[#524f49] max-w-2xl">
              Manage your local document state, launch WebAssembly editing pipelines, and export production PDFs with zero cloud exposure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label>
              <span className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#0f0e0d] px-5 py-2.5 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors shadow-xs">
                <Upload className="h-4 w-4" />
                Upload PDF
              </span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
            </label>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e5e3] bg-white px-4 py-2.5 text-xs font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] transition-colors"
            >
              <FileText className="h-4 w-4 text-neutral-800" />
              Open Studio Editor
            </Link>
          </div>
        </header>

        {/* System Diagnostics & Highlight Card with Pure White Radius Styling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main White System Card */}
          <div className="lg:col-span-8 rounded-2xl bg-white text-[#0f0e0d] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden border border-[#e5e5e3]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e3] pb-5">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#716e68]">Local Compute Engine</div>
                <h2 className="text-xl font-medium text-[#0f0e0d]">Client-Side WebAssembly Stack</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono">
                  <Activity className="w-3.5 h-3.5" /> ONLINE & AIR-GAPPED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1">
                <div className="text-[11px] font-mono text-[#524f49]">Cached Documents</div>
                <div className="text-2xl font-semibold text-[#0f0e0d]">{documents.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1">
                <div className="text-[11px] font-mono text-[#524f49]">Local Storage Used</div>
                <div className="text-2xl font-semibold text-[#0f0e0d]">{formatBytes(totalStorageUsed)}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1">
                <div className="text-[11px] font-mono text-[#524f49]">WASM Rendering</div>
                <div className="text-2xl font-semibold text-[#0f0e0d]">PDF.js 3.11</div>
              </div>
              <div className="p-4 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] space-y-1">
                <div className="text-[11px] font-mono text-[#524f49]">OCR Engine</div>
                <div className="text-2xl font-semibold text-[#0f0e0d]">Tesseract v5</div>
              </div>
            </div>

            <p className="text-xs text-[#524f49] leading-relaxed">
              Every document rendered in PDFForge executes strictly in memory inside your browser. No files, metadata, or telemetry are ever transmitted to any remote cloud servers.
            </p>
          </div>

          {/* Quick System Status Card */}
          <div className="lg:col-span-4 rounded-2xl border border-[#e5e5e3] bg-white p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#524f49] uppercase tracking-wider">System Integrity</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-[#0f0e0d]">Zero-Network Boundary</h3>
              <p className="text-xs text-[#524f49] leading-relaxed">
                IndexedDB storage and WebWorkers operate in full isolation under browser same-origin policies.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafaf9] border border-[#e5e5e3] font-mono text-xs space-y-2 text-[#0f0e0d]">
              <div className="flex justify-between">
                <span className="text-[#524f49]">Storage Driver:</span>
                <span className="font-semibold">IndexedDB IDBStore</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#524f49]">Crypto Hash:</span>
                <span className="font-semibold">WebCrypto SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#524f49]">Outbound Telemetry:</span>
                <span className="text-emerald-700 font-semibold">0 bytes</span>
              </div>
            </div>

            <Link
              href="/security"
              className="inline-flex items-center justify-between text-xs font-medium text-[#0f0e0d] hover:underline"
            >
              <span>View Security Architecture</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Tool Launchers Grid (Radius Style with Tag Badges) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-normal text-[#0f0e0d]">Quick Tools Suite</h2>
              <p className="text-xs text-[#524f49]">Launch dedicated client-side utility workflows</p>
            </div>
            <Link href="/tools" className="text-xs font-medium text-[#0f0e0d] hover:underline inline-flex items-center gap-1">
              <span>View All 10 Tools</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-xl border border-[#e5e5e3] bg-white p-4 hover:border-[#0f0e0d] transition-all space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 rounded-lg bg-[#f2f1f0] text-[#0f0e0d] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-mono text-[#524f49] px-1.5 py-0.5 rounded bg-[#f2f1f0]">
                        {tool.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-[#0f0e0d] group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-[11px] text-[#524f49] truncate mt-0.5">{tool.desc}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5e5e3] flex items-center justify-between text-[10px] font-medium text-[#0f0e0d]">
                    <span>Launch</span>
                    <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-normal text-[#0f0e0d]">Recent Documents</h2>
              <p className="text-xs text-[#524f49]">Locally persisted document records in your browser</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Document Search */}
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#524f49]" />
                <input
                  type="text"
                  placeholder="Filter documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#e5e5e3] bg-white text-xs text-[#0f0e0d] placeholder:text-[#524f49] focus:outline-none focus:border-[#0f0e0d]"
                />
              </div>

              <Link
                href="/editor"
                className="rounded-lg bg-[#0f0e0d] px-3.5 py-2 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Open Studio
              </Link>
            </div>
          </div>

          {/* Empty State */}
          {documents.length === 0 && !isLoading && (
            <div className="p-12 text-center border border-dashed border-[#e5e5e3] rounded-xl bg-white space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f2f1f0] text-[#524f49] flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-[#0f0e0d]">No local documents cached</h3>
                <p className="text-xs text-[#524f49] max-w-sm mx-auto">
                  Upload a PDF from your computer or select a tool to begin editing.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <label>
                  <span className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-[#0f0e0d] px-4 py-2 text-xs font-medium text-[#fafaf9] hover:bg-gray-800 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload PDF
                  </span>
                  <input type="file" accept="application/pdf" onChange={handleFileUpload} className="sr-only" />
                </label>

                <Link
                  href="/editor"
                  className="rounded-md border border-[#e5e5e3] bg-white px-4 py-2 text-xs font-medium text-[#0f0e0d] hover:bg-[#f2f1f0] transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Open Studio
                </Link>
              </div>
            </div>
          )}

          {/* Documents Grid */}
          {filteredDocuments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group rounded-xl border border-[#e5e5e3] bg-white p-5 hover:border-[#0f0e0d] transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-11 bg-[#f2f1f0] rounded border border-[#e5e5e3] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#0f0e0d]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-xs text-[#0f0e0d] truncate group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h4>
                      <div className="text-[11px] font-mono text-[#524f49] mt-1 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#524f49]" />
                          <span>{formatDate(doc.updatedAt)}</span>
                        </div>
                        <div>{formatBytes(doc.sizeBytes)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#e5e5e3] text-xs">
                    <Link
                      href={`/editor?id=${doc.id}`}
                      className="text-[#0f0e0d] font-medium hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Studio</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDoc(doc);
                          setNewName(doc.name);
                        }}
                        className="p-1 rounded text-[#524f49] hover:text-[#0f0e0d] hover:bg-[#f2f1f0] transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(doc)}
                        className="p-1 rounded text-[#524f49] hover:text-[#0f0e0d] hover:bg-[#f2f1f0] transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results from search filter */}
          {documents.length > 0 && filteredDocuments.length === 0 && (
            <div className="p-8 text-center border border-[#e5e5e3] rounded-xl bg-white space-y-2">
              <p className="text-xs text-[#524f49]">No documents match &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#0f0e0d] font-medium underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rename Document Modal */}
      <Modal
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        title="Rename Document"
      >
        <div className="space-y-4">
          <Input
            label="Document Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Master-Service-Agreement.pdf"
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingDoc(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRename}
            >
              Save Name
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
