export type ToolType =
  | 'select'
  | 'hand'
  | 'text'
  | 'edit-text'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'pen'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'image'
  | 'signature'
  | 'stamp'
  | 'barcode'
  | 'redact'
  | 'note'
  | 'eraser';

export interface PDFTextItem {
  id: string;
  str: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  fontSize: number;
  fontFamily: string;
  bold?: boolean;
  italic?: boolean;
  pageIndex: number;
}

export type DetailedTextItem = PDFTextItem;

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  type: ToolType;
  pageIndex: number; // 0-based
  x: number; // percentage (0-100) or normalized page coordinate (pt)
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
  lineHeight?: number;
}

export interface DrawAnnotation extends BaseAnnotation {
  type: 'pen' | 'highlight' | 'underline' | 'strikethrough';
  points: Point[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: 'rectangle' | 'circle' | 'line' | 'arrow';
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface SignatureAnnotation extends BaseAnnotation {
  type: 'signature';
  dataUrl: string; // base64 PNG
  strokeColor?: string;
}

export interface StampAnnotation extends BaseAnnotation {
  type: 'stamp';
  stampText: string;
  color: string;
  borderColor: string;
}

export interface BarcodeAnnotation extends BaseAnnotation {
  type: 'barcode';
  format: 'qr' | 'code128' | 'ean13' | 'upc' | 'code39';
  value: string;
  dataUrl: string;
  color?: string;
}

export interface RedactAnnotation extends BaseAnnotation {
  type: 'redact';
  fillColor: string;
  overlayText?: string;
}

export interface ImageAnnotation extends BaseAnnotation {
  type: 'image';
  dataUrl: string; // base64
  aspectRatio: number;
  originalFileName?: string;
}

export interface StickyNoteAnnotation extends BaseAnnotation {
  type: 'note';
  text: string;
  color: string; // yellow, blue, green, pink, purple
  author?: string;
  isOpen?: boolean;
}

export type Annotation =
  | TextAnnotation
  | DrawAnnotation
  | ShapeAnnotation
  | SignatureAnnotation
  | StampAnnotation
  | BarcodeAnnotation
  | RedactAnnotation
  | ImageAnnotation
  | StickyNoteAnnotation;

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotation?: number; // degrees, e.g. 45
  layout?: 'diagonal' | 'center' | 'tiled';
  pageRange?: 'all' | 'odd' | 'even' | 'custom';
  customPages?: number[];
}

export interface PageNumberOptions {
  format: 'number' | 'page_of_total' | 'roman' | 'custom';
  customFormat?: string; // e.g. "Page {n} of {total}" or "- {n} -"
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  fontSize?: number;
  color?: string;
  startPage?: number;
  startNumber?: number;
  margin?: number;
}

export interface PageMetadata {
  pageIndex: number;
  originalIndex: number;
  rotation: number; // 0, 90, 180, 270
  width: number; // pt (e.g. 595.28 for A4)
  height: number; // pt (e.g. 841.89 for A4)
  scale: number;
  isBlank?: boolean;
  isDeleted?: boolean;
  thumbnailUrl?: string;
}

export interface PDFDocMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  producer?: string;
  creator?: string;
}

export interface PDFProjectJSON {
  version: '1.0';
  generator: 'SASU PDF' | 'PDFForge' | string;
  documentName: string;
  fileSizeBytes: number;
  createdAt: number;
  metadata?: PDFDocMetadata;
  pages: PageMetadata[];
  annotations: Annotation[];
}

export interface PDFDocumentInfo {
  id: string;
  name: string;
  sizeBytes: number;
  totalPages: number;
  pages: PageMetadata[];
  createdAt: number;
  updatedAt: number;
}

export interface EditorHistoryState {
  annotations: Annotation[];
  pages: PageMetadata[];
  activePageIndex: number;
}

export interface SearchMatch {
  pageIndex: number;
  text: string;
  bounds?: { x: number; y: number; width: number; height: number };
}

