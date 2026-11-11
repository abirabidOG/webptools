import JSZip from "jszip";
import { ImageItem } from "./converter";
import { trackDownloadAll } from "./analytics";

/**
 * Strips the extension from a filename and appends .webp
 */
export function getWebPFileName(originalName: string): string {
  const lastDot = originalName.lastIndexOf(".");
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  return `${base}.webp`;
}

/**
 * Downloads a single converted image
 */
export function downloadSingleFile(item: ImageItem): void {
  if (!item.convertedBlob || !item.convertedUrl) return;

  const fileName = getWebPFileName(item.name);
  const link = document.createElement("a");
  link.href = item.convertedUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Packs all completed WebP images into a single ZIP file and triggers download
 */
export async function downloadAllAsZip(
  items: ImageItem[],
  zipFileName = "webptools-converted-images.zip"
): Promise<{ success: boolean; count: number; totalSaved: number }> {
  const doneItems = items.filter(
    (item) => item.status === "done" && item.convertedBlob
  );

  if (doneItems.length === 0) {
    return { success: false, count: 0, totalSaved: 0 };
  }

  const zip = new JSZip();
  const nameOccurrences = new Map<string, number>();

  let totalOriginal = 0;
  let totalConverted = 0;

  for (const item of doneItems) {
    if (!item.convertedBlob) continue;

    totalOriginal += item.originalSize;
    totalConverted += item.convertedSize || item.convertedBlob.size;

    let targetName = getWebPFileName(item.name);

    // Deduplicate names if multiple files have the exact same name
    if (nameOccurrences.has(targetName)) {
      const count = nameOccurrences.get(targetName)! + 1;
      nameOccurrences.set(targetName, count);
      const dotIndex = targetName.lastIndexOf(".");
      targetName = `${targetName.slice(0, dotIndex)}-${count}.webp`;
    } else {
      nameOccurrences.set(targetName, 1);
    }

    zip.file(targetName, item.convertedBlob);
  }

  const zipContent = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  // Trigger download in browser
  const zipUrl = URL.createObjectURL(zipContent);
  const link = document.createElement("a");
  link.href = zipUrl;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(zipUrl), 2000);

  const totalSavedPercent =
    totalOriginal > 0
      ? ((totalOriginal - totalConverted) / totalOriginal) * 100
      : 0;

  // Track the critical Key Event in Google Analytics 4
  trackDownloadAll({
    fileCount: doneItems.length,
    totalOriginalSize: totalOriginal,
    totalConvertedSize: totalConverted,
    totalSavedPercent,
  });

  return {
    success: true,
    count: doneItems.length,
    totalSaved: totalOriginal - totalConverted,
  };
}
