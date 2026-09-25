import { StoredDocument } from "@/types/auth";
import { Annotation, PageMetadata } from "@/types/pdf";

const DB_NAME = "pdfforge_db";
const DB_VERSION = 1;
const DOCS_STORE = "documents";
const DRAFTS_STORE = "drafts";
const SIGNATURES_STORE = "signatures";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DOCS_STORE)) {
        db.createObjectStore(DOCS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SIGNATURES_STORE)) {
        db.createObjectStore(SIGNATURES_STORE, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface DocumentDraft {
  id: string;
  name: string;
  pdfData: ArrayBuffer;
  annotations: Annotation[];
  pages: PageMetadata[];
  updatedAt: number;
}

export interface SavedSignature {
  id?: number;
  dataUrl: string;
  createdAt: number;
  title?: string;
}

export const documentStore = {
  async saveDocument(doc: StoredDocument, rawData?: ArrayBuffer | Uint8Array): Promise<void> {
    try {
      const db = await openDb();
      const tx = db.transaction(DOCS_STORE, "readwrite");
      const store = tx.objectStore(DOCS_STORE);

      const toSave = {
        ...doc,
        pdfData: rawData || doc.pdfData,
        updatedAt: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const req = store.put(toSave);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      // Update local storage metadata index
      this.updateMetadataList(doc);
    } catch (err) {
      console.warn("Falling back to localStorage metadata only", err);
      this.updateMetadataList(doc);
    }
  },

  async getDocument(id: string): Promise<StoredDocument | null> {
    try {
      const db = await openDb();
      const tx = db.transaction(DOCS_STORE, "readonly");
      const store = tx.objectStore(DOCS_STORE);

      return await new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error("Failed to load document from IndexedDB", err);
      return null;
    }
  },

  async listDocuments(): Promise<StoredDocument[]> {
    try {
      const db = await openDb();
      const tx = db.transaction(DOCS_STORE, "readonly");
      const store = tx.objectStore(DOCS_STORE);

      const docs: StoredDocument[] = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      // Strip large pdfData when returning list to conserve UI memory
      return docs
        .map(({ pdfData, ...meta }) => meta as StoredDocument)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      // Fallback to localStorage metadata list
      return this.getLocalMetadataList();
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const db = await openDb();
      const tx = db.transaction(DOCS_STORE, "readwrite");
      tx.objectStore(DOCS_STORE).delete(id);
    } catch (e) {
      console.error(e);
    }

    // Also remove from localStorage metadata list
    const list = this.getLocalMetadataList().filter((d) => d.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("pdfforge_recent_meta", JSON.stringify(list));
    }
  },

  async saveDraft(draft: DocumentDraft): Promise<void> {
    try {
      const db = await openDb();
      const tx = db.transaction(DRAFTS_STORE, "readwrite");
      tx.objectStore(DRAFTS_STORE).put(draft);
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  },

  async getDraft(id: string): Promise<DocumentDraft | null> {
    try {
      const db = await openDb();
      const tx = db.transaction(DRAFTS_STORE, "readonly");
      return await new Promise((resolve, reject) => {
        const req = tx.objectStore(DRAFTS_STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  },

  // Saved Signatures
  async saveSignature(dataUrl: string, title?: string): Promise<void> {
    try {
      const db = await openDb();
      const tx = db.transaction(SIGNATURES_STORE, "readwrite");
      tx.objectStore(SIGNATURES_STORE).add({
        dataUrl,
        createdAt: Date.now(),
        title: title || "Signature " + new Date().toLocaleDateString(),
      });
    } catch (e) {
      console.error("Failed to save signature", e);
    }
  },

  async getSavedSignatures(): Promise<SavedSignature[]> {
    try {
      const db = await openDb();
      const tx = db.transaction(SIGNATURES_STORE, "readonly");
      return await new Promise((resolve, reject) => {
        const req = tx.objectStore(SIGNATURES_STORE).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  updateMetadataList(doc: StoredDocument) {
    if (typeof window === "undefined") return;
    const list = this.getLocalMetadataList().filter((d) => d.id !== doc.id);
    const { pdfData, ...cleanMeta } = doc;
    list.unshift(cleanMeta as StoredDocument);
    localStorage.setItem("pdfforge_recent_meta", JSON.stringify(list.slice(0, 50)));
  },

  getLocalMetadataList(): StoredDocument[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("pdfforge_recent_meta");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
};
