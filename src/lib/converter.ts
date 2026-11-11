// High performance client-side image converter using Canvas API

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalType: string;
  originalWidth: number;
  originalHeight: number;
  convertedBlob?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  previewUrl: string;
  savedPercent?: number;
  targetWidth?: number;
  targetHeight?: number;
  status: "pending" | "converting" | "done" | "error";
  error?: string;
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_BATCH_COUNT = 20;

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

export const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg", ".webp"];

/**
 * Format bytes into human readable KB or MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validates a file before ingestion
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check extension or MIME
  const fileName = file.name.toLowerCase();
  const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const hasValidMime = SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase());

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: `Unsupported format (${file.type || "unknown"}). Only JPG, PNG, SVG, and WebP are supported.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum allowed size is 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Helper to inspect SVG dimensions from text content
 */
async function getSvgDimensions(file: File): Promise<{ width: number; height: number }> {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    if (!svgEl) return { width: 1200, height: 1200 };

    const widthAttr = parseFloat(svgEl.getAttribute("width") || "0");
    const heightAttr = parseFloat(svgEl.getAttribute("height") || "0");

    if (widthAttr > 0 && heightAttr > 0) {
      return { width: widthAttr, height: heightAttr };
    }

    const viewBox = svgEl.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).filter(Boolean).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        return { width: parts[2], height: parts[3] };
      }
    }

    return { width: 1200, height: 1200 };
  } catch (err) {
    return { width: 1200, height: 1200 };
  }
}

/**
 * Loads an image from a blob URL or data URL and returns HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image into canvas"));
    img.src = src;
  });
}

/**
 * Converts any supported image (JPG, PNG, SVG, WebP) to WebP using Canvas API
 */
export async function convertToWebP(
  item: ImageItem,
  quality: number = 80,
  maxWidth: number | null = null
): Promise<{
  blob: Blob;
  size: number;
  url: string;
  savedPercent: number;
  width: number;
  height: number;
}> {
  const isSvg = item.file.type.includes("svg") || item.name.toLowerCase().endsWith(".svg");
  let objectUrlToRevoke: string | null = null;
  let sourceUrl = item.previewUrl;

  let imgNaturalWidth = item.originalWidth;
  let imgNaturalHeight = item.originalHeight;

  if (isSvg && (!imgNaturalWidth || !imgNaturalHeight)) {
    const svgDims = await getSvgDimensions(item.file);
    imgNaturalWidth = svgDims.width;
    imgNaturalHeight = svgDims.height;
  }

  // If previewUrl is not an image object URL, make one
  if (!sourceUrl) {
    sourceUrl = URL.createObjectURL(item.file);
    objectUrlToRevoke = sourceUrl;
  }

  const img = await loadImage(sourceUrl);

  const origW = imgNaturalWidth || img.naturalWidth || img.width || 800;
  const origH = imgNaturalHeight || img.naturalHeight || img.height || 600;

  // Calculate target dimensions keeping aspect ratio
  let targetW = origW;
  let targetH = origH;

  if (maxWidth && targetW > maxWidth) {
    const ratio = maxWidth / targetW;
    targetW = Math.round(maxWidth);
    targetH = Math.max(1, Math.round(origH * ratio));
  } else if (isSvg && origW < 800 && maxWidth && maxWidth > origW) {
    // For vector SVG, if user selected higher max width (e.g. 1200px), rasterize sharply at higher resolution
    const ratio = maxWidth / origW;
    targetW = Math.round(maxWidth);
    targetH = Math.max(1, Math.round(origH * ratio));
  }

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Unable to initialize 2D canvas context");
  }

  // Clear canvas transparently (preserves PNG & SVG transparency)
  ctx.clearRect(0, 0, targetW, targetH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw image
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Clean temporary URL if created
  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke);
  }

  // Convert to WebP blob
  const qualityFactor = Math.min(Math.max(quality / 100, 0.05), 1.0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Browser failed to encode image to WebP"));
      },
      "image/webp",
      qualityFactor
    );
  });

  const convertedSize = blob.size;
  const savedPercent = ((item.originalSize - convertedSize) / item.originalSize) * 100;
  const convertedUrl = URL.createObjectURL(blob);

  return {
    blob,
    size: convertedSize,
    url: convertedUrl,
    savedPercent,
    width: targetW,
    height: targetH,
  };
}

/**
 * Generates an instant high-res sample file in-memory
 * Allows visitors to test the tool with 1-click without uploading files from disk
 */
export async function createSampleFile(): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Elegant photography-like landscape with gradient and geometric shapes
    const grad = ctx.createLinearGradient(0, 0, 1600, 1000);
    grad.addColorStop(0, "#0E2433");
    grad.addColorStop(0.35, "#1F8C7F");
    grad.addColorStop(0.7, "#D97736");
    grad.addColorStop(1, "#F4F2EC");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1000);

    // Decorative transparent elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.arc(800, 450, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.arc(1100, 600, 320, 0, Math.PI * 2);
    ctx.fill();

    // Foreground typography & branding
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WEBPTools Sample Image", 800, 480);

    ctx.font = "500 28px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText("High-Resolution 1600x1000 — 100% Client-Side Conversion", 800, 540);
  }

  // Export as uncompressed JPG to demonstrate massive WebP savings
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", 0.95);
  });

  return new File([blob], "sample-brand-graphic.jpg", { type: "image/jpeg" });
}

/**
 * Creates an instant SVG sample file with transparency
 */
export function createSvgSampleFile(): File {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      <linearGradient id="brandTeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1F8C7F" />
        <stop offset="100%" stop-color="#0B0B0D" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="none" />
    <circle cx="400" cy="400" r="320" fill="url(#brandTeal)" />
    <path d="M260 400 L360 500 L540 320" stroke="#FFFFFF" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <text x="400" y="620" font-family="Inter, sans-serif" font-size="36" font-weight="700" fill="#FFFFFF" text-anchor="middle">WEBPTools Vector</text>
  </svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  return new File([blob], "brand-logo-vector.svg", { type: "image/svg+xml" });
}
