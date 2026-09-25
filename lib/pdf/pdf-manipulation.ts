import {
  PDFDocument,
  rgb,
  StandardFonts,
  degrees,
  PDFPage,
  PDFFont,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  Annotation,
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
  PDFDocMetadata,
  PDFProjectJSON,
  WatermarkOptions,
  PageNumberOptions,
} from "@/types/pdf";
import { hexToRgb, sanitizeForWinAnsi, validatePdfHeader } from "@/lib/utils";

/**
 * Maps standard CSS fonts to pdf-lib StandardFonts
 */
async function getEmbeddedFont(doc: PDFDocument, fontFamily: string, bold = false, italic = false): Promise<PDFFont> {
  const fontLower = (fontFamily || "").toLowerCase();
  
  if (fontLower.includes("times") || fontLower.includes("serif")) {
    if (bold && italic) return await doc.embedFont(StandardFonts.TimesRomanBoldItalic);
    if (bold) return await doc.embedFont(StandardFonts.TimesRomanBold);
    if (italic) return await doc.embedFont(StandardFonts.TimesRomanItalic);
    return await doc.embedFont(StandardFonts.TimesRoman);
  }

  if (fontLower.includes("courier") || fontLower.includes("mono")) {
    if (bold && italic) return await doc.embedFont(StandardFonts.CourierBoldOblique);
    if (bold) return await doc.embedFont(StandardFonts.CourierBold);
    if (italic) return await doc.embedFont(StandardFonts.CourierOblique);
    return await doc.embedFont(StandardFonts.Courier);
  }

  // Default to Helvetica
  if (bold && italic) return await doc.embedFont(StandardFonts.HelveticaBoldOblique);
  if (bold) return await doc.embedFont(StandardFonts.HelveticaBold);
  if (italic) return await doc.embedFont(StandardFonts.HelveticaOblique);
  return await doc.embedFont(StandardFonts.Helvetica);
}

/**
 * Converts data URL (base64) into Uint8Array
 */
function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const parts = (dataUrl || "").split(",");
  const base64 = parts.length > 1 ? parts[1] : parts[0];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Export a PDF with all baked annotations, page modifications, and metadata
 */
export async function exportPdfWithAnnotations({
  originalPdfBytes,
  pages,
  annotations,
  metadata,
}: {
  originalPdfBytes: Uint8Array | ArrayBuffer;
  pages: PageMetadata[];
  annotations: Annotation[];
  metadata?: PDFDocMetadata;
}): Promise<Uint8Array> {
  if (!originalPdfBytes || !validatePdfHeader(originalPdfBytes)) {
    throw new Error("Cannot export: Source is not a valid PDF document");
  }

  // Load original PDF
  const originalDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });
  
  // Create a clean destination document
  const outDoc = await PDFDocument.create();

  // Apply Document Metadata if provided
  if (metadata) {
    if (metadata.title) outDoc.setTitle(sanitizeForWinAnsi(metadata.title));
    if (metadata.author) outDoc.setAuthor(sanitizeForWinAnsi(metadata.author));
    if (metadata.subject) outDoc.setSubject(sanitizeForWinAnsi(metadata.subject));
    if (metadata.keywords) outDoc.setKeywords(metadata.keywords.map(sanitizeForWinAnsi));
    outDoc.setProducer(sanitizeForWinAnsi(metadata.producer || "PDFForge Web Studio (100% Client-Side)"));
    outDoc.setCreator(sanitizeForWinAnsi(metadata.creator || "PDFForge"));
  } else {
    outDoc.setProducer("PDFForge Web Studio (100% Client-Side)");
    outDoc.setCreator("PDFForge");
  }

  // Filter out deleted pages and sort by their new order
  const activePages = pages.filter((p) => !p.isDeleted);

  // Copy active pages into outDoc in order
  for (let newIndex = 0; newIndex < activePages.length; newIndex++) {
    const pageMeta = activePages[newIndex];
    if (pageMeta.isBlank || pageMeta.originalIndex < 0) {
      outDoc.addPage([pageMeta.width || 595.28, pageMeta.height || 841.89]);
    } else {
      const [copiedPage] = await outDoc.copyPages(originalDoc, [pageMeta.originalIndex]);

      // Apply rotation
      if (pageMeta.rotation !== 0) {
        copiedPage.setRotation(degrees((copiedPage.getRotation().angle + pageMeta.rotation) % 360));
      }

      outDoc.addPage(copiedPage);
    }
  }

  // Now apply annotations to corresponding destination pages
  for (let newIndex = 0; newIndex < activePages.length; newIndex++) {
    const pageMeta = activePages[newIndex];
    const targetPage = outDoc.getPage(newIndex);
    const { width: pageWidth, height: pageHeight } = targetPage.getSize();

    // Get annotations for this original or mapped page index
    const pageAnnotations = annotations.filter((ann) => ann.pageIndex === pageMeta.pageIndex);

    for (const ann of pageAnnotations) {
      try {
        await applyAnnotationToPdfPage(outDoc, targetPage, ann, pageWidth, pageHeight);
      } catch (err) {
        console.error("Error applying annotation to PDF:", ann, err);
      }
    }
  }

  return await outDoc.save();
}

/**
 * Draw a single annotation onto a pdf-lib PDFPage
 */
async function applyAnnotationToPdfPage(
  doc: PDFDocument,
  page: PDFPage,
  ann: Annotation,
  pageWidth: number,
  pageHeight: number
) {
  const canvasX = (ann.x / 100) * pageWidth;
  const canvasY = (ann.y / 100) * pageHeight;
  const annWidth = (ann.width / 100) * pageWidth;
  const annHeight = (ann.height / 100) * pageHeight;

  // In PDF, Y coordinate goes from bottom to top
  const pdfY = pageHeight - canvasY - annHeight;
  const pdfX = canvasX;

  switch (ann.type) {
    case "text": {
      const textAnn = ann as TextAnnotation;
      const font = await getEmbeddedFont(doc, textAnn.fontFamily, textAnn.bold, textAnn.italic);
      const { r, g, b } = hexToRgb(textAnn.color || "#000000");

      if (textAnn.backgroundColor && textAnn.backgroundColor !== "transparent") {
        const bgRgb = hexToRgb(textAnn.backgroundColor);
        page.drawRectangle({
          x: Math.max(0, pdfX),
          y: Math.max(0, pdfY),
          width: Math.max(annWidth, 30),
          height: Math.max(annHeight, textAnn.fontSize * 1.3),
          color: rgb(bgRgb.r, bgRgb.g, bgRgb.b),
          opacity: textAnn.opacity ?? 1,
        });
      }

      // Draw each line of text with safe WinAnsi character encoding
      const lines = (textAnn.text || "").split("\n");
      const fontSize = Math.max(6, Math.min(textAnn.fontSize || 14, 200));
      const lineHeight = fontSize * (textAnn.lineHeight || 1.25);

      lines.forEach((rawLine, lineIdx) => {
        const line = sanitizeForWinAnsi(rawLine);
        const textY = pageHeight - canvasY - fontSize - (lineIdx * lineHeight);
        let textX = pdfX;

        if (textAnn.align === "center") {
          const textWidth = font.widthOfTextAtSize(line, fontSize);
          textX = pdfX + (annWidth - textWidth) / 2;
        } else if (textAnn.align === "right") {
          const textWidth = font.widthOfTextAtSize(line, fontSize);
          textX = pdfX + annWidth - textWidth;
        }

        page.drawText(line, {
          x: Math.max(0, textX),
          y: Math.max(0, textY),
          size: fontSize,
          font: font,
          color: rgb(r, g, b),
          opacity: Math.max(0, Math.min(1, textAnn.opacity ?? 1)),
        });
      });
      break;
    }

    case "pen":
    case "highlight":
    case "underline":
    case "strikethrough": {
      const drawAnn = ann as DrawAnnotation;
      if (!drawAnn.points || drawAnn.points.length < 2) break;

      const { r, g, b } = hexToRgb(drawAnn.color || "#ffeb3b");
      const isHighlight = drawAnn.type === "highlight";
      const strokeWidth = drawAnn.strokeWidth || (isHighlight ? 14 : 2);
      const opacity = isHighlight ? (drawAnn.opacity ?? 0.35) : (drawAnn.opacity ?? 1);

      for (let i = 0; i < drawAnn.points.length - 1; i++) {
        const p1 = drawAnn.points[i];
        const p2 = drawAnn.points[i + 1];

        const x1 = (p1.x / 100) * pageWidth;
        const y1 = pageHeight - (p1.y / 100) * pageHeight;
        const x2 = (p2.x / 100) * pageWidth;
        const y2 = pageHeight - (p2.y / 100) * pageHeight;

        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: strokeWidth,
          color: rgb(r, g, b),
          opacity: opacity,
        });
      }
      break;
    }

    case "rectangle": {
      const shape = ann as ShapeAnnotation;
      const strokeRgb = hexToRgb(shape.strokeColor || "#000000");
      const hasFill = shape.fillColor && shape.fillColor !== "transparent";
      const fillRgb = hasFill ? hexToRgb(shape.fillColor) : null;

      page.drawRectangle({
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(1, annWidth),
        height: Math.max(1, annHeight),
        borderColor: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
        borderWidth: shape.strokeWidth || 2,
        color: fillRgb ? rgb(fillRgb.r, fillRgb.g, fillRgb.b) : undefined,
        opacity: shape.opacity ?? 1,
      });
      break;
    }

    case "circle": {
      const shape = ann as ShapeAnnotation;
      const strokeRgb = hexToRgb(shape.strokeColor || "#000000");
      const hasFill = shape.fillColor && shape.fillColor !== "transparent";
      const fillRgb = hasFill ? hexToRgb(shape.fillColor) : null;

      page.drawEllipse({
        x: pdfX + annWidth / 2,
        y: pdfY + annHeight / 2,
        xScale: Math.max(1, annWidth / 2),
        yScale: Math.max(1, annHeight / 2),
        borderColor: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
        borderWidth: shape.strokeWidth || 2,
        color: fillRgb ? rgb(fillRgb.r, fillRgb.g, fillRgb.b) : undefined,
        opacity: shape.opacity ?? 1,
      });
      break;
    }

    case "line":
    case "arrow": {
      const shape = ann as ShapeAnnotation;
      const strokeRgb = hexToRgb(shape.strokeColor || "#000000");
      const startX = pdfX;
      const startY = pageHeight - canvasY;
      const endX = pdfX + annWidth;
      const endY = pdfY;

      page.drawLine({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        thickness: shape.strokeWidth || 2,
        color: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
        opacity: shape.opacity ?? 1,
      });

      if (shape.type === "arrow") {
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 12;
        const arrowAngle = Math.PI / 6;

        page.drawLine({
          start: { x: endX, y: endY },
          end: {
            x: endX - headLength * Math.cos(angle - arrowAngle),
            y: endY - headLength * Math.sin(angle - arrowAngle),
          },
          thickness: shape.strokeWidth || 2,
          color: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
          opacity: shape.opacity ?? 1,
        });

        page.drawLine({
          start: { x: endX, y: endY },
          end: {
            x: endX - headLength * Math.cos(angle + arrowAngle),
            y: endY - headLength * Math.sin(angle + arrowAngle),
          },
          thickness: shape.strokeWidth || 2,
          color: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
          opacity: shape.opacity ?? 1,
        });
      }
      break;
    }

    case "stamp": {
      const stamp = ann as StampAnnotation;
      const { r, g, b } = hexToRgb(stamp.color || "#dc2626");
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const safeText = sanitizeForWinAnsi(stamp.stampText || "APPROVED");

      // Draw rounded stamp box
      page.drawRectangle({
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(20, annWidth),
        height: Math.max(10, annHeight),
        borderColor: rgb(r, g, b),
        borderWidth: 3,
        color: rgb(r, g, b),
        opacity: 0.12,
      });

      // Stamp text
      const fontSize = Math.min(annHeight * 0.5, 24);
      const textWidth = font.widthOfTextAtSize(safeText, fontSize);
      const textX = pdfX + (annWidth - textWidth) / 2;
      const textY = pdfY + (annHeight - fontSize) / 2 + 2;

      page.drawText(safeText, {
        x: Math.max(0, textX),
        y: Math.max(0, textY),
        size: fontSize,
        font: font,
        color: rgb(r, g, b),
        opacity: stamp.opacity ?? 0.85,
      });
      break;
    }

    case "signature": {
      const sig = ann as SignatureAnnotation;
      if (!sig.dataUrl) break;
      const imageBytes = dataUrlToUint8Array(sig.dataUrl);
      const embeddedImage = await doc.embedPng(imageBytes);

      page.drawImage(embeddedImage, {
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(5, annWidth),
        height: Math.max(5, annHeight),
        opacity: sig.opacity ?? 1,
      });
      break;
    }

    case "image": {
      const imgAnn = ann as ImageAnnotation;
      if (!imgAnn.dataUrl) break;
      const imageBytes = dataUrlToUint8Array(imgAnn.dataUrl);
      
      let embeddedImage;
      if (imgAnn.dataUrl.includes("image/jpeg") || imgAnn.dataUrl.includes("image/jpg")) {
        embeddedImage = await doc.embedJpg(imageBytes);
      } else {
        embeddedImage = await doc.embedPng(imageBytes);
      }

      page.drawImage(embeddedImage, {
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(5, annWidth),
        height: Math.max(5, annHeight),
        opacity: imgAnn.opacity ?? 1,
      });
      break;
    }

    case "barcode": {
      const barcodeAnn = ann as BarcodeAnnotation;
      if (!barcodeAnn.dataUrl) break;
      const imageBytes = dataUrlToUint8Array(barcodeAnn.dataUrl);
      const embeddedImage = await doc.embedPng(imageBytes);

      page.drawImage(embeddedImage, {
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(5, annWidth),
        height: Math.max(5, annHeight),
        opacity: barcodeAnn.opacity ?? 1,
      });
      break;
    }

    case "redact": {
      const redactAnn = ann as RedactAnnotation;
      const fillRgb = hexToRgb(redactAnn.fillColor || "#000000");

      // Draw opaque blackout rectangle
      page.drawRectangle({
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(2, annWidth),
        height: Math.max(2, annHeight),
        color: rgb(fillRgb.r, fillRgb.g, fillRgb.b),
        opacity: 1,
      });

      if (redactAnn.overlayText) {
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const safeOverlay = sanitizeForWinAnsi(redactAnn.overlayText);
        const fontSize = Math.min(Math.max(annHeight * 0.45, 8), 14);
        const textWidth = font.widthOfTextAtSize(safeOverlay, fontSize);
        const textX = pdfX + Math.max(0, (annWidth - textWidth) / 2);
        const textY = pdfY + Math.max(0, (annHeight - fontSize) / 2 + 1);

        page.drawText(safeOverlay, {
          x: Math.max(0, textX),
          y: Math.max(0, textY),
          size: fontSize,
          font: font,
          color: rgb(1, 0.2, 0.2), // Red warning text
          opacity: 0.9,
        });
      }
      break;
    }

    case "note": {
      const noteAnn = ann as StickyNoteAnnotation;
      const noteRgb = hexToRgb(noteAnn.color || "#fbbf24");
      
      page.drawRectangle({
        x: Math.max(0, pdfX),
        y: Math.max(0, pdfY),
        width: Math.max(annWidth, 120),
        height: Math.max(annHeight, 80),
        color: rgb(noteRgb.r, noteRgb.g, noteRgb.b),
        opacity: 0.92,
      });

      if (noteAnn.text) {
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const lines = noteAnn.text.split("\n");
        lines.forEach((l, idx) => {
          const safeLine = sanitizeForWinAnsi(l.substring(0, 40));
          page.drawText(safeLine, {
            x: pdfX + 8,
            y: pdfY + Math.max(annHeight, 80) - 18 - (idx * 14),
            size: 9,
            font: font,
            color: rgb(0.1, 0.1, 0.1),
          });
        });
      }
      break;
    }
  }
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(pdfBuffers: (Uint8Array | ArrayBuffer)[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    if (!validatePdfHeader(buffer)) continue;
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save();
}

/**
 * Split a PDF by page ranges or extracted page indexes
 */
export async function splitPdf({
  pdfBytes,
  pageIndices,
}: {
  pdfBytes: Uint8Array | ArrayBuffer;
  pageIndices: number[]; // 0-based
}): Promise<Uint8Array> {
  if (!validatePdfHeader(pdfBytes)) throw new Error("Invalid PDF header");
  const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((p) => newDoc.addPage(p));
  return await newDoc.save();
}

/**
 * Compress PDF client-side by optimizing streams and re-saving
 */
export async function compressPdf(pdfBytes: Uint8Array | ArrayBuffer): Promise<{
  data: Uint8Array;
  originalSize: number;
  newSize: number;
}> {
  if (!validatePdfHeader(pdfBytes)) throw new Error("Invalid PDF header");
  const originalSize = pdfBytes.byteLength;
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const data = await doc.save({ useObjectStreams: true });
  const newSize = data.byteLength;

  return {
    data,
    originalSize,
    newSize,
  };
}

/**
 * Convert multiple images to a PDF
 */
export async function imagesToPdf({
  images,
  pageSize = "A4",
  orientation = "portrait",
  margin = 20,
}: {
  images: { dataUrl: string; width: number; height: number }[];
  pageSize?: "A4" | "Letter" | "Fit";
  orientation?: "portrait" | "landscape";
  margin?: number;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const sizes: Record<string, [number, number]> = {
    A4: [595.28, 841.89],
    Letter: [612, 792],
  };

  for (const img of images) {
    if (!img.dataUrl) continue;
    const imageBytes = dataUrlToUint8Array(img.dataUrl);
    let embeddedImg;
    if (img.dataUrl.includes("image/jpeg") || img.dataUrl.includes("image/jpg")) {
      embeddedImg = await doc.embedJpg(imageBytes);
    } else {
      embeddedImg = await doc.embedPng(imageBytes);
    }

    let targetWidth: number;
    let targetHeight: number;

    if (pageSize === "Fit") {
      targetWidth = img.width || 595.28;
      targetHeight = img.height || 841.89;
    } else {
      const [baseW, baseH] = sizes[pageSize] || sizes.A4;
      targetWidth = orientation === "landscape" ? baseH : baseW;
      targetHeight = orientation === "landscape" ? baseW : baseH;
    }

    const page = doc.addPage([targetWidth, targetHeight]);

    const availableW = targetWidth - margin * 2;
    const availableH = targetHeight - margin * 2;
    const imgAspect = (img.width || 1) / (img.height || 1);
    const pageAspect = availableW / availableH;

    let drawW: number;
    let drawH: number;

    if (imgAspect > pageAspect) {
      drawW = availableW;
      drawH = availableW / imgAspect;
    } else {
      drawH = availableH;
      drawW = availableH * imgAspect;
    }

    const drawX = margin + (availableW - drawW) / 2;
    const drawY = margin + (availableH - drawH) / 2;

    page.drawImage(embeddedImg, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  return await doc.save();
}

/**
 * Print a PDF buffer directly in the browser using an iframe
 */
export function printPdfBuffer(pdfBytes: Uint8Array | ArrayBuffer) {
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.src = url;
  
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(url, "_blank");
    }
  };
}

/**
 * Export annotations and layout as standard JSON project format
 */
export function exportProjectJSON({
  documentName,
  fileSizeBytes,
  pages,
  annotations,
  metadata,
}: {
  documentName: string;
  fileSizeBytes: number;
  pages: PageMetadata[];
  annotations: Annotation[];
  metadata?: PDFDocMetadata;
}): string {
  const project: PDFProjectJSON = {
    version: "1.0",
    generator: "PDFForge",
    documentName,
    fileSizeBytes,
    createdAt: Date.now(),
    metadata,
    pages,
    annotations,
  };

  return JSON.stringify(project, null, 2);
}

/**
 * Validate and import a project JSON string safely
 */
export function importProjectJSON(jsonStr: string): PDFProjectJSON {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.annotations) || !Array.isArray(parsed.pages)) {
    throw new Error("Invalid PDFForge project JSON structure");
  }
  return parsed as PDFProjectJSON;
}

/**
 * Watermark an entire PDF document with customizable text, angle, opacity, and layout
 */
export async function watermarkPdf({
  pdfBytes,
  options,
}: {
  pdfBytes: Uint8Array | ArrayBuffer;
  options: WatermarkOptions;
}): Promise<Uint8Array> {
  if (!validatePdfHeader(pdfBytes)) throw new Error("Invalid PDF header");
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const totalPages = doc.getPageCount();

  const colorRgb = hexToRgb(options.color || "#94a3b8");
  const fontSize = options.fontSize || 42;
  const opacity = options.opacity ?? 0.25;
  const rotationDeg = options.rotation ?? 45;
  const watermarkColor = rgb(colorRgb.r, colorRgb.g, colorRgb.b);
  const safeText = sanitizeForWinAnsi(options.text || "CONFIDENTIAL");

  for (let i = 0; i < totalPages; i++) {
    // Check page selection criteria
    if (options.pageRange === "odd" && i % 2 !== 0) continue;
    if (options.pageRange === "even" && i % 2 === 0) continue;
    if (options.pageRange === "custom" && options.customPages && !options.customPages.includes(i + 1)) continue;

    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(safeText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    if (options.layout === "tiled") {
      // Repeat across grid
      const stepX = Math.max(textWidth + 80, 200);
      const stepY = 160;
      for (let x = -width / 2; x < width * 1.5; x += stepX) {
        for (let y = -height / 2; y < height * 1.5; y += stepY) {
          page.drawText(safeText, {
            x,
            y,
            size: fontSize * 0.75,
            font,
            color: watermarkColor,
            opacity: opacity * 0.75,
            rotate: degrees(rotationDeg),
          });
        }
      }
    } else {
      // Centered diagonal or straight
      const cx = (width - textWidth) / 2;
      const cy = (height - textHeight) / 2;

      page.drawText(safeText, {
        x: cx,
        y: cy,
        size: fontSize,
        font,
        color: watermarkColor,
        opacity,
        rotate: degrees(rotationDeg),
      });
    }
  }

  return await doc.save();
}

/**
 * Add page numbering / headers / footers to all pages in a PDF
 */
export async function addPageNumbersToPdf({
  pdfBytes,
  options,
}: {
  pdfBytes: Uint8Array | ArrayBuffer;
  options: PageNumberOptions;
}): Promise<Uint8Array> {
  if (!validatePdfHeader(pdfBytes)) throw new Error("Invalid PDF header");
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const totalPages = doc.getPageCount();

  const colorRgb = hexToRgb(options.color || "#475569");
  const fontSize = options.fontSize || 10;
  const textColor = rgb(colorRgb.r, colorRgb.g, colorRgb.b);
  const margin = options.margin || 25;
  const startPage = options.startPage || 1;
  const startNumber = options.startNumber || 1;

  for (let i = startPage - 1; i < totalPages; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const currentNum = startNumber + (i - (startPage - 1));

    let label = "";
    if (options.format === "page_of_total") {
      label = `Page ${currentNum} of ${totalPages}`;
    } else if (options.format === "custom" && options.customFormat) {
      label = options.customFormat
        .replace(/{n}/g, String(currentNum))
        .replace(/{total}/g, String(totalPages));
    } else {
      label = `${currentNum}`;
    }

    const safeLabel = sanitizeForWinAnsi(label);
    const textWidth = font.widthOfTextAtSize(safeLabel, fontSize);
    let x = margin;
    let y = margin;

    // Calculate X coordinate
    if (options.position.includes("center")) {
      x = (width - textWidth) / 2;
    } else if (options.position.includes("right")) {
      x = width - margin - textWidth;
    }

    // Calculate Y coordinate
    if (options.position.startsWith("top")) {
      y = height - margin - fontSize;
    } else {
      y = margin;
    }

    page.drawText(safeLabel, {
      x: Math.max(margin, x),
      y: Math.max(margin, y),
      size: fontSize,
      font,
      color: textColor,
    });
  }

  return await doc.save();
}

