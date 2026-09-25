export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: 'free';
  createdAt: string;
}

export interface StoredDocument {
  id: string;
  name: string;
  sizeBytes: number;
  totalPages: number;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string; // base64 preview
  pdfData?: ArrayBuffer | Uint8Array; // In-memory / IndexedDB cached data
  tags?: string[];
  isSample?: boolean;
}
