import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate cryptographically secure collision-resistant IDs
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "id_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
}

/**
 * Sanitize untrusted filenames to prevent directory traversal or injection
 */
export function sanitizeFileName(name: string, fallback = "document.pdf"): string {
  if (!name || typeof name !== "string") return fallback;
  // Strip control chars, directory traversal markers, and dangerous characters
  let clean = name.replace(/[\x00-\x1f\x7f\\/:\*\?"<>\|]/g, "_").trim();
  // Remove leading dots to prevent hidden files or traversal
  clean = clean.replace(/^\.+/, "");
  if (!clean) return fallback;
  if (!clean.toLowerCase().endsWith(".pdf") && !clean.includes(".")) {
    clean += ".pdf";
  }
  return clean.substring(0, 150); // limit length
}

/**
 * Validates whether binary buffer starts with PDF magic bytes (%PDF-)
 */
export function validatePdfHeader(buffer: ArrayBuffer | Uint8Array): boolean {
  if (!buffer) return false;
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 5) return false;
  // %PDF- magic bytes: 0x25, 0x50, 0x44, 0x46, 0x2D
  return (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

/**
 * Normalizes unicode strings to safe WinAnsi encoding for StandardFonts in pdf-lib
 * to prevent fatal "WinAnsi cannot encode" uncaught exceptions.
 */
export function sanitizeForWinAnsi(text: string): string {
  if (!text) return "";
  return text
    // Replace smart quotes and apostrophes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace various dashes
    .replace(/[\u2013\u2014\u2015]/g, "-")
    // Replace ellipsis
    .replace(/\u2026/g, "...")
    // Replace bullet points
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "•")
    // Replace non-breaking spaces and other special spaces with regular space
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    // Replace common currency symbols if needed
    .replace(/\u20AC/g, "EUR")
    .replace(/\u00A3/g, "GBP")
    .replace(/\u00A5/g, "YEN");
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const formatFileSize = formatBytes;

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function downloadBlob(blob: Blob, filename: string) {
  const safeName = sanitizeFileName(filename);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadArrayBuffer(buffer: Uint8Array | ArrayBuffer, filename: string, mimeType = "application/pdf") {
  const blob = new Blob([buffer as any], { type: mimeType });
  downloadBlob(blob, filename);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const sanitized = (hex || "#000000").replace("#", "");
  const bigint = parseInt(sanitized, 16) || 0;
  if (sanitized.length === 3) {
    const r = parseInt(sanitized[0] + sanitized[0], 16) || 0;
    const g = parseInt(sanitized[1] + sanitized[1], 16) || 0;
    const b = parseInt(sanitized[2] + sanitized[2], 16) || 0;
    return { r: r / 255, g: g / 255, b: b / 255 };
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}
