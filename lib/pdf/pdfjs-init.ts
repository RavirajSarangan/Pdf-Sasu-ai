/**
 * Client-side PDF.js initialisation and helpers.
 */

let pdfjsLibInstance: any = null;

export async function getPdfjs() {
  if (typeof window === "undefined") {
    return null;
  }

  if (pdfjsLibInstance) {
    return pdfjsLibInstance;
  }

  const pdfjs = await import("pdfjs-dist");

  if (pdfjs.GlobalWorkerOptions) {
    // Prefer local worker if available, fallback to CDN
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }

  pdfjsLibInstance = pdfjs;
  return pdfjs;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array | string) {
  const pdfjs = await getPdfjs();
  if (!pdfjs) throw new Error("PDF.js cannot run on server");

  let loadingTask;
  if (typeof data === "string") {
    loadingTask = pdfjs.getDocument(data);
  } else {
    // Copy the ArrayBuffer/Uint8Array to prevent detached buffer errors
    const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data);
    loadingTask = pdfjs.getDocument({ data: uint8.slice() });
  }

  return await loadingTask.promise;
}

export interface RenderPageOptions {
  pdfDoc: any;
  pageIndex: number; // 0-based
  canvas: HTMLCanvasElement;
  scale?: number;
  rotation?: number;
}

export function cancelCanvasRender(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const currentTask = (canvas as any)._currentRenderTask;
  if (currentTask) {
    try {
      currentTask.cancel();
    } catch {
      // Ignore cancellation errors
    }
    (canvas as any)._currentRenderTask = null;
  }
}

export async function renderPdfPageToCanvas({
  pdfDoc,
  pageIndex,
  canvas,
  scale = 1.0,
  rotation = 0,
}: RenderPageOptions) {
  if (!canvas || !pdfDoc) return null;

  // Cancel any active render task currently running on this canvas
  cancelCanvasRender(canvas);

  const pageNumber = pageIndex + 1;
  const page = await pdfDoc.getPage(pageNumber);

  // Handle HiDPI / Retina displays cleanly by scaling the viewport directly
  const outputScale = window.devicePixelRatio || 1;
  const actualScale = (scale || 1.0) * outputScale;
  const totalRotation = (page.rotate + (rotation || 0)) % 360;
  const viewport = page.getViewport({ scale: actualScale, rotation: totalRotation });

  // CSS display dimensions
  const cssWidth = Math.floor(viewport.width / outputScale);
  const cssHeight = Math.floor(viewport.height / outputScale);

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Could not get 2D canvas context");

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  const renderTask = page.render(renderContext);
  (canvas as any)._currentRenderTask = renderTask;

  try {
    await renderTask.promise;

    return {
      width: cssWidth,
      height: cssHeight,
      originalWidth: page.view[2] - page.view[0],
      originalHeight: page.view[3] - page.view[1],
    };
  } catch (err: any) {
    if (err?.name === "RenderingCancelledException" || err?.message?.includes("cancelled")) {
      // Normal when user zooms or switches pages quickly
      return null;
    }
    throw err;
  } finally {
    if ((canvas as any)._currentRenderTask === renderTask) {
      (canvas as any)._currentRenderTask = null;
    }
  }
}

export async function generatePageThumbnail(
  pdfDoc: any,
  pageIndex: number,
  targetWidth = 140
): Promise<string> {
  try {
    const pageNumber = pageIndex + 1;
    const page = await pdfDoc.getPage(pageNumber);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return "";

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    return canvas.toDataURL("image/jpeg", 0.75);
  } catch (e) {
    return "";
  }
}

export async function extractTextFromPdf(pdfDoc: any): Promise<{ pageIndex: number; text: string }[]> {
  const numPages = pdfDoc.numPages;
  const results: { pageIndex: number; text: string }[] = [];

  for (let i = 1; i <= numPages; i++) {
    try {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      results.push({
        pageIndex: i - 1,
        text: pageText,
      });
    } catch {
      // ignore
    }
  }

  return results;
}

export interface DetailedTextItem {
  id: string;
  str: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  fontSize: number;
  fontFamily: string;
  pageIndex: number;
}

export async function extractDetailedPageText(
  pdfDoc: any,
  pageIndex: number
): Promise<DetailedTextItem[]> {
  if (!pdfDoc) return [];
  try {
    const pageNumber = pageIndex + 1;
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    const rawItems: {
      str: string;
      xPx: number;
      yPx: number;
      widthPx: number;
      heightPx: number;
      fontSize: number;
      fontFamily: string;
      bold: boolean;
      italic: boolean;
    }[] = [];

    for (let i = 0; i < textContent.items.length; i++) {
      const item = textContent.items[i];
      if (!item.str || !item.str.trim()) continue;

      const tx = item.transform[4];
      const ty = item.transform[5];
      const fontHeight = Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || item.height || 12;
      const fontWidth = item.width || (item.str.length * fontHeight * 0.55);

      const fontName = item.fontName || "";
      let fontObj: any = null;
      if (page.commonObjs) {
        try {
          if (typeof page.commonObjs.has === "function" && page.commonObjs.has(fontName)) {
            fontObj = page.commonObjs.get(fontName);
          }
        } catch {}
      }
      if (!fontObj && page.objs) {
        try {
          if (typeof page.objs.has === "function" && page.objs.has(fontName)) {
            fontObj = page.objs.get(fontName);
          }
        } catch {}
      }

      const rawFontName =
        fontObj?.name ||
        fontObj?.loadedName ||
        fontObj?.fallbackName ||
        textContent.styles?.[fontName]?.fontFamily ||
        fontName ||
        "";

      const cleanName = rawFontName.replace(/^[A-Z]{6}\+/, "").toLowerCase();

      const isSerif =
        fontObj?.serif ||
        fontObj?.isSerifFont ||
        /times|roman|serif|georgia|cambria|garamond|baskerville|palatino|century|bookman|charter|minion|pt serif|liberation serif/i.test(cleanName) ||
        (textContent.styles?.[fontName]?.fontFamily && /serif/i.test(textContent.styles[fontName].fontFamily)) ||
        // Default to Serif if descent is characteristic of serif text or document body style
        (!/sans|helvetica|arial|mono/i.test(cleanName) && textContent.styles?.[fontName]?.descent && Math.abs(textContent.styles[fontName].descent) > 0.15);

      const isMono =
        fontObj?.monospace ||
        fontObj?.isMonospace ||
        /courier|mono|consolas|code|menlo|source code|fira code|liberation mono/i.test(cleanName) ||
        (textContent.styles?.[fontName]?.fontFamily && /monospace/i.test(textContent.styles[fontName].fontFamily));

      let standardFont = "Times-Roman";
      if (isMono) {
        standardFont = "Courier";
      } else if (isSerif) {
        standardFont = "Times-Roman";
      } else if (/arial|helvetica|sans|calibri|roboto|open sans|inter|verdana|tahoma/i.test(cleanName)) {
        standardFont = "Helvetica";
      } else {
        standardFont = "Times-Roman";
      }

      // Detect bold and italic
      const isBold =
        fontObj?.bold ||
        fontObj?.isBold ||
        fontObj?.black ||
        /bold|black|heavy|demi|b(?=[0-9_\-\.]|$)|700|800|900/i.test(cleanName);

      const isItalic =
        fontObj?.italic ||
        fontObj?.isItalic ||
        /italic|oblique|it(?=[0-9_\-\.]|$)/i.test(cleanName);

      // Convert PDF bottom-left origin to viewport top-left origin
      const xPx = tx;
      const yPx = viewport.height - ty - fontHeight * 0.88;

      rawItems.push({
        str: item.str,
        xPx,
        yPx,
        widthPx: fontWidth,
        heightPx: fontHeight * 1.05,
        fontSize: Math.max(8, Math.round(fontHeight)),
        fontFamily: standardFont,
        bold: !!isBold,
        italic: !!isItalic,
      });
    }

    // Sort by Y (top to bottom), then by X (left to right)
    rawItems.sort((a, b) => {
      if (Math.abs(a.yPx - b.yPx) < 4) {
        return a.xPx - b.xPx;
      }
      return a.yPx - b.yPx;
    });

    // Group contiguous items on the same line ONLY if they have the same style and weight
    const grouped: {
      str: string;
      xPx: number;
      yPx: number;
      widthPx: number;
      heightPx: number;
      fontSize: number;
      fontFamily: string;
      bold: boolean;
      italic: boolean;
    }[] = [];

    for (const item of rawItems) {
      const last = grouped[grouped.length - 1];
      // Only merge if on same line (Y within 4px), close gap (< 15px), SAME font family, SAME bold, and SAME fontSize
      if (
        last &&
        Math.abs(last.yPx - item.yPx) < 4 &&
        item.xPx >= last.xPx &&
        item.xPx - (last.xPx + last.widthPx) < 15 &&
        last.fontFamily === item.fontFamily &&
        last.bold === item.bold &&
        last.italic === item.italic &&
        Math.abs(last.fontSize - item.fontSize) <= 1
      ) {
        const gap = item.xPx - (last.xPx + last.widthPx);
        last.str += (gap > 1.5 ? " " : "") + item.str;
        last.widthPx = item.xPx + item.widthPx - last.xPx;
        last.heightPx = Math.max(last.heightPx, item.heightPx);
      } else {
        grouped.push({ ...item });
      }
    }

    const items: DetailedTextItem[] = grouped.map((item, idx) => {
      const x = Math.max(0, Math.min(100, (item.xPx / viewport.width) * 100));
      const y = Math.max(0, Math.min(100, (item.yPx / viewport.height) * 100));
      const width = Math.max(1, Math.min(100 - x, (item.widthPx / viewport.width) * 100));
      const height = Math.max(1, Math.min(100 - y, (item.heightPx / viewport.height) * 100));

      return {
        id: `pdf_txt_${pageIndex}_${idx}`,
        str: item.str,
        x,
        y,
        width,
        height,
        fontSize: item.fontSize,
        fontFamily: item.fontFamily,
        bold: item.bold,
        italic: item.italic,
        pageIndex,
      };
    });

    return items;
  } catch (err) {
    console.error("Failed to extract detailed page text:", err);
    return [];
  }
}
