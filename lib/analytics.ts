/**
 * Privacy-first client-side analytics.
 * Does NOT collect any document contents, passwords, or personal identifying information.
 */

export type AnalyticsEvent =
  | 'pdf_uploaded'
  | 'pdf_exported'
  | 'merge_completed'
  | 'split_completed'
  | 'compress_completed'
  | 'pdf_to_image_completed'
  | 'images_to_pdf_completed'
  | 'signature_added'
  | 'tool_opened'
  | 'page_deleted'
  | 'page_reordered';

export interface AnalyticsPayload {
  tool?: string;
  pageCount?: number;
  durationMs?: number;
  fileCount?: number;
  originalSizeBytes?: number;
  newSizeBytes?: number;
  [key: string]: any;
}

export function trackEvent(eventName: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  try {
    if (typeof window === "undefined") return;

    // Log to development console
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 [Analytics Event]: ${eventName}`, payload);
    }

    // Store anonymous usage counter locally for dashboard display
    const currentStats = getLocalUsageStats();
    currentStats.totalOperations = (currentStats.totalOperations || 0) + 1;
    currentStats.lastActive = Date.now();
    currentStats.eventsCount = currentStats.eventsCount || {};
    currentStats.eventsCount[eventName] = (currentStats.eventsCount[eventName] || 0) + 1;

    localStorage.setItem("pdfforge_usage_stats", JSON.stringify(currentStats));
  } catch (err) {
    // Fail silently without disrupting user flow
  }
}

export function getLocalUsageStats() {
  if (typeof window === "undefined") {
    return { totalOperations: 0, lastActive: 0, eventsCount: {} };
  }
  try {
    const raw = localStorage.getItem("pdfforge_usage_stats");
    return raw ? JSON.parse(raw) : { totalOperations: 0, lastActive: 0, eventsCount: {} };
  } catch {
    return { totalOperations: 0, lastActive: 0, eventsCount: {} };
  }
}
