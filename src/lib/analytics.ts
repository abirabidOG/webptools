// Google Analytics 4 Integration & Event Tracker for WEBPTools

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Helper to send GA events
export function trackEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    // In dev mode or when gtag is blocked, log to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA4 Track Event]: ${action}`, params);
    }
    return;
  }

  try {
    window.gtag("event", action, params);
  } catch (error) {
    console.error("Failed to send GA4 event", error);
  }
}

/**
 * Triggered whenever a single file is converted to WebP
 */
export function trackFileConverted(params: {
  fileName: string;
  fileType: string;
  originalSize: number;
  convertedSize: number;
  savedPercent: number;
  quality: number;
  maxWidth?: number | null;
}) {
  trackEvent("file_converted", {
    file_name: params.fileName,
    file_type: params.fileType,
    original_size_bytes: params.originalSize,
    converted_size_bytes: params.convertedSize,
    saved_percent: Math.round(params.savedPercent),
    compression_quality: params.quality,
    max_width: params.maxWidth || "original",
  });
}

/**
 * Triggered when user clicks "Download All as ZIP"
 * Easily marked as a Key Event (Conversion) in Google Analytics 4
 */
export function trackDownloadAll(params: {
  fileCount: number;
  totalOriginalSize: number;
  totalConvertedSize: number;
  totalSavedPercent: number;
}) {
  trackEvent("download_all", {
    file_count: params.fileCount,
    total_original_bytes: params.totalOriginalSize,
    total_converted_bytes: params.totalConvertedSize,
    total_saved_percent: Math.round(params.totalSavedPercent),
    value: params.fileCount, // numerical value for conversion reporting
  });
}

/**
 * Triggered on single file download
 */
export function trackFileDownload(params: {
  fileName: string;
  fileType: string;
  convertedSize: number;
  savedPercent: number;
}) {
  trackEvent("file_download", {
    file_name: params.fileName,
    file_type: params.fileType,
    converted_size_bytes: params.convertedSize,
    saved_percent: Math.round(params.savedPercent),
  });
}
