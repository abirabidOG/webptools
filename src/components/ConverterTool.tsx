"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileImage,
  Download,
  Trash2,
  RefreshCw,
  Archive,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sliders,
  Maximize2,
  ArrowRight,
  Sparkles,
  Layers,
  X,
} from "lucide-react";
import {
  ImageItem,
  validateFile,
  convertToWebP,
  formatBytes,
  createSampleFile,
  createSvgSampleFile,
  MAX_BATCH_COUNT,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/converter";
import { downloadSingleFile, downloadAllAsZip, getWebPFileName } from "@/lib/zip";
import { trackFileConverted, trackFileDownload } from "@/lib/analytics";

const RESIZE_PRESETS = [
  { label: "Original (No resize)", value: null },
  { label: "800 px (Small / Blog)", value: 800 },
  { label: "1200 px (Standard Web)", value: 1200 },
  { label: "1600 px (HD / Retina)", value: 1600 },
  { label: "1920 px (Full HD)", value: 1920 },
  { label: "2400 px (Ultra / Hero)", value: 2400 },
];

export default function ConverterTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isConvertingBatch, setIsConvertingBatch] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      });
    };
  }, [items]);

  // Convert a single item
  const processItem = useCallback(
    async (item: ImageItem, currentQuality: number, currentMaxWidth: number | null) => {
      try {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: "converting", error: undefined } : it))
        );

        const result = await convertToWebP(item, currentQuality, currentMaxWidth);

        // If previous convertedUrl exists, revoke to prevent memory leak
        if (item.convertedUrl) {
          URL.revokeObjectURL(item.convertedUrl);
        }

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  convertedBlob: result.blob,
                  convertedSize: result.size,
                  convertedUrl: result.url,
                  savedPercent: result.savedPercent,
                  targetWidth: result.width,
                  targetHeight: result.height,
                  status: "done",
                }
              : it
          )
        );

        // Track in GA4
        trackFileConverted({
          fileName: item.name,
          fileType: item.originalType,
          originalSize: item.originalSize,
          convertedSize: result.size,
          savedPercent: result.savedPercent,
          quality: currentQuality,
          maxWidth: currentMaxWidth,
        });
      } catch (err: any) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "error",
                  error: err.message || "Failed to convert image to WebP",
                }
              : it
          )
        );
      }
    },
    []
  );

  // Ingest incoming files (from drop or input)
  const handleFiles = useCallback(
    async (incomingFiles: FileList | File[]) => {
      setErrorMessage(null);
      const filesArray = Array.from(incomingFiles);

      if (filesArray.length === 0) return;

      const currentCount = items.length;
      const allowedCount = Math.max(0, MAX_BATCH_COUNT - currentCount);

      if (allowedCount === 0) {
        setErrorMessage(`Batch limit reached. Maximum ${MAX_BATCH_COUNT} images can be processed at once.`);
        return;
      }

      if (filesArray.length > allowedCount) {
        setErrorMessage(
          `Only the first ${allowedCount} image(s) were added to stay within the ${MAX_BATCH_COUNT} file batch limit.`
        );
      }

      const filesToProcess = filesArray.slice(0, allowedCount);
      const newItems: ImageItem[] = [];

      for (const file of filesToProcess) {
        const validation = validateFile(file);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const previewUrl = URL.createObjectURL(file);

        if (!validation.valid) {
          newItems.push({
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalType: file.type || "unknown",
            originalWidth: 0,
            originalHeight: 0,
            previewUrl,
            status: "error",
            error: validation.error,
          });
          continue;
        }

        // Read dimensions asynchronously
        const isSvg = file.type.includes("svg") || file.name.toLowerCase().endsWith(".svg");
        let initialWidth = 0;
        let initialHeight = 0;

        if (!isSvg) {
          try {
            const img = new Image();
            img.src = previewUrl;
            await new Promise((res) => {
              img.onload = () => {
                initialWidth = img.naturalWidth;
                initialHeight = img.naturalHeight;
                res(true);
              };
              img.onerror = () => res(false);
            });
          } catch (e) {
            // keep 0
          }
        }

        newItems.push({
          id,
          file,
          name: file.name,
          originalSize: file.size,
          originalType: file.type || "image/unknown",
          originalWidth: initialWidth,
          originalHeight: initialHeight,
          previewUrl,
          status: "pending",
        });
      }

      setItems((prev) => [...prev, ...newItems]);

      // Trigger automatic conversion for valid items
      for (const item of newItems) {
        if (item.status === "pending") {
          processItem(item, quality, maxWidth);
        }
      }
    },
    [items.length, quality, maxWidth, processItem]
  );

  // Re-convert all valid items when quality or max width changes (debounced)
  const triggerBatchReconversion = useCallback(
    (newQuality: number, newMaxWidth: number | null) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setItems((currentItems) => {
          currentItems.forEach((item) => {
            if (item.status !== "error") {
              processItem(item, newQuality, newMaxWidth);
            }
          });
          return currentItems;
        });
      }, 250);
    },
    [processItem]
  );

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuality(val);
    triggerBatchReconversion(val, maxWidth);
  };

  const handleResizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "null" ? null : parseInt(e.target.value, 10);
    setMaxWidth(val);
    triggerBatchReconversion(quality, val);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Convert All button click
  const handleConvertAll = async () => {
    setIsConvertingBatch(true);
    for (const item of items) {
      if (item.status !== "error") {
        await processItem(item, quality, maxWidth);
      }
    }
    setIsConvertingBatch(false);
  };

  // Download All as ZIP
  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      await downloadAllAsZip(items);
    } catch (err) {
      console.error("ZIP download failed", err);
    } finally {
      setIsZipping(false);
    }
  };

  // Single file download
  const handleDownloadSingle = (item: ImageItem) => {
    downloadSingleFile(item);
    if (item.convertedSize) {
      trackFileDownload({
        fileName: item.name,
        fileType: item.originalType,
        convertedSize: item.convertedSize,
        savedPercent: item.savedPercent || 0,
      });
    }
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) {
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  // Clear all
  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Try a sample photo image
  const handleTrySamplePhoto = async () => {
    const sample = await createSampleFile();
    handleFiles([sample]);
  };

  // Try a sample SVG image
  const handleTrySampleSvg = () => {
    const sampleSvg = createSvgSampleFile();
    handleFiles([sampleSvg]);
  };

  // Calculate batch statistics
  const doneItems = items.filter((it) => it.status === "done" && it.convertedSize);
  const totalOriginalBytes = doneItems.reduce((acc, it) => acc + it.originalSize, 0);
  const totalConvertedBytes = doneItems.reduce((acc, it) => acc + (it.convertedSize || 0), 0);
  const totalSavedBytes = totalOriginalBytes - totalConvertedBytes;
  const totalSavedPercent =
    totalOriginalBytes > 0 ? (totalSavedBytes / totalOriginalBytes) * 100 : 0;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Main Tool Container */}
      <div className="rounded-3xl border border-[#E5E1D6] bg-white p-4 sm:p-7 md:p-8 shadow-sm">
        {/* Global Conversion Controls Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[#F4F2EC] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Quality Slider */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B0B0D]">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-[#1F8C7F]" />
                WebP Quality
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-[#1F8C7F] shadow-2xs border border-[#E5E1D6]">
                {quality}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-[#4F4E55]">10% (Max small)</span>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={handleQualityChange}
                aria-label="WebP Quality Slider"
                className="h-2 w-full cursor-pointer rounded-lg bg-[#E5E1D6] accent-[#1F8C7F]"
              />
              <span className="text-[11px] font-medium text-[#4F4E55]">100% (High fidelity)</span>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-[#E5E1D6]" />

          {/* Resize Max Width Option */}
          <div className="w-full sm:w-64 space-y-2">
            <label
              htmlFor="resize-select"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B0B0D]"
            >
              <Maximize2 className="h-4 w-4 text-[#1F8C7F]" />
              Resize Max Width
            </label>
            <select
              id="resize-select"
              value={maxWidth === null ? "null" : maxWidth}
              onChange={handleResizeChange}
              aria-label="Max width resize option"
              className="w-full rounded-xl border border-[#E5E1D6] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#0B0B0D] shadow-2xs focus:border-[#1F8C7F] focus:outline-none focus:ring-2 focus:ring-[#1F8C7F]/20"
            >
              {RESIZE_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.value === null ? "null" : preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Drag and drop zone to upload JPG, PNG, SVG or WebP images"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all focus:outline-none focus:ring-3 focus:ring-[#1F8C7F]/30 ${
            isDragging
              ? "border-[#1F8C7F] bg-[#EBF7F5] scale-[1.005]"
              : "border-[#D6D2C4] bg-[#FDFCFA] hover:border-[#1F8C7F] hover:bg-[#F4F2EC]/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />

          <div className="mx-auto flex max-w-md flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF7F5] text-[#1F8C7F] shadow-xs">
              <Upload className="h-7 w-7 transition-transform group-hover:scale-110" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#0B0B0D]">
              Drop your images here, or{" "}
              <span className="text-[#1F8C7F] underline underline-offset-4">browse files</span>
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm text-[#4F4E55]">
              Supports <strong>JPG, PNG, SVG, and WebP</strong> • Up to 20 images • Max 10 MB each
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-[#4F4E55]">
              <span className="rounded-md bg-[#F4F2EC] px-2.5 py-1 border border-[#E5E1D6]">
                PNG & SVG Transparency Kept
              </span>
              <span className="rounded-md bg-[#F4F2EC] px-2.5 py-1 border border-[#E5E1D6]">
                Live Auto-Convert
              </span>
              <span className="rounded-md bg-[#F4F2EC] px-2.5 py-1 border border-[#E5E1D6]">
                Batch ZIP Download
              </span>
            </div>
          </div>
        </div>

        {/* Empty State: Quick Sample Try Buttons */}
        {items.length === 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-center">
            <span className="text-xs font-semibold text-[#4F4E55]">First time here?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrySamplePhoto();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B0B0D] shadow-2xs hover:border-[#1F8C7F] hover:bg-[#F4F2EC] transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#1F8C7F]" />
                Try Photo Sample (.jpg)
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrySampleSvg();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B0B0D] shadow-2xs hover:border-[#1F8C7F] hover:bg-[#F4F2EC] transition-all"
              >
                <Layers className="h-3.5 w-3.5 text-[#1F8C7F]" />
                Try Vector SVG (.svg)
              </button>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 p-3.5 text-xs sm:text-sm text-amber-900 border border-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-800 hover:text-amber-950 p-1"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Action Header When Items Exist */}
        {items.length > 0 && (
          <div className="mt-8 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E1D6] pb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#0B0B0D]">
                  {items.length} {items.length === 1 ? "Image" : "Images"} in Batch
                </h4>
                <span className="rounded-full bg-[#EBF7F5] px-2.5 py-0.5 text-[11px] font-bold text-[#1F8C7F]">
                  {doneItems.length} of {items.length} Converted
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-[#E5E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B0B0D] hover:bg-[#F4F2EC] shadow-2xs transition-all"
                >
                  + Add More
                </button>

                <button
                  type="button"
                  onClick={handleConvertAll}
                  disabled={isConvertingBatch}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B0B0D] hover:bg-[#F4F2EC] shadow-2xs transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-[#1F8C7F] ${isConvertingBatch ? "animate-spin" : ""}`} />
                  Re-convert All
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 shadow-2xs transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Total Compression Savings Banner */}
            {doneItems.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#EBF7F5] p-4 border border-[#B6E2DC]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#1F8C7F] px-2 py-0.5 text-xs font-bold text-white shadow-2xs">
                      {totalSavedPercent >= 0 ? `-${Math.round(totalSavedPercent)}% Saved` : "+0%"}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#0B0B0D]">
                      Total Savings: {formatBytes(totalSavedBytes)}
                    </span>
                  </div>
                  <p className="text-xs text-[#4F4E55]">
                    {formatBytes(totalOriginalBytes)} original reduced down to{" "}
                    <strong>{formatBytes(totalConvertedBytes)}</strong> WebP across {doneItems.length} file(s).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || doneItems.length === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F8C7F] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#176E64] transition-all disabled:opacity-50"
                >
                  <Archive className="h-4 w-4" />
                  {isZipping ? "Creating ZIP..." : `Download All as ZIP (${doneItems.length})`}
                </button>
              </div>
            )}

            {/* Batch Image Cards List */}
            <div className="space-y-3">
              {items.map((item) => {
                const isDone = item.status === "done";
                const isError = item.status === "error";
                const isConverting = item.status === "converting";
                const percent = Math.round(item.savedPercent ?? 0);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#E5E1D6] bg-white p-3.5 sm:p-4 hover:border-[#1F8C7F]/50 transition-all shadow-2xs"
                  >
                    {/* Left: Thumbnail Preview + Metadata */}
                    <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                      {/* Thumbnail with checkerboard background for transparent PNG/SVG */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E5E1D6] bg-transparency-grid flex items-center justify-center">
                        {item.previewUrl ? (
                          <img
                            src={item.convertedUrl || item.previewUrl}
                            alt={`Preview of ${item.name}`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <FileImage className="h-6 w-6 text-[#4F4E55]" />
                        )}

                        {isDone && (
                          <div className="absolute top-1 right-1 rounded-full bg-white shadow-xs p-0.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#1F8C7F]" />
                          </div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className="truncate text-xs sm:text-sm font-bold text-[#0B0B0D] max-w-[200px] sm:max-w-[260px] md:max-w-[340px]"
                            title={item.name}
                          >
                            {item.name}
                          </p>
                          <span className="shrink-0 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#F4F2EC] text-[#4F4E55]">
                            {item.name.split(".").pop()}
                          </span>
                        </div>

                        {/* Size Comparison */}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#4F4E55]">
                          <span>Original: {formatBytes(item.originalSize)}</span>

                          {isDone && item.convertedSize && (
                            <>
                              <ArrowRight className="h-3 w-3 text-[#1F8C7F]" />
                              <span className="font-semibold text-[#0B0B0D]">
                                WebP: {formatBytes(item.convertedSize)}
                              </span>
                            </>
                          )}

                          {item.targetWidth && item.targetHeight ? (
                            <span className="text-[10px] text-[#4F4E55] border-l border-[#E5E1D6] pl-2 hidden md:inline">
                              {item.targetWidth} × {item.targetHeight}px
                            </span>
                          ) : null}
                        </div>

                        {isError && (
                          <p className="mt-1 text-xs font-medium text-rose-600">
                            {item.error || "Conversion failed"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Status / Savings Pill + Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5E1D6]">
                      {/* Savings Percentage Badge */}
                      {isDone && (
                        <div className="flex flex-col items-end">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              percent >= 0
                                ? "bg-[#EBF7F5] text-[#1F8C7F] border border-[#B6E2DC]"
                                : "bg-[#F4F2EC] text-[#4F4E55]"
                            }`}
                          >
                            {percent >= 0 ? `-${percent}%` : "+0%"}
                          </span>
                          <span className="text-[10px] font-medium text-[#4F4E55]">
                            {percent >= 0 ? "Saved" : "Quality 100%"}
                          </span>
                        </div>
                      )}

                      {isConverting && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#1F8C7F]">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Converting...</span>
                        </div>
                      )}

                      {/* Individual Download Button */}
                      {isDone && (
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F8C7F] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#176E64] transition-all"
                          title={`Download ${getWebPFileName(item.name)}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      )}

                      {/* Remove from batch button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="rounded-lg p-1.5 text-[#4F4E55] hover:bg-[#F4F2EC] hover:text-rose-600 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Badge Directly Under the Tool */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#F4F2EC] px-4 py-3 text-center text-xs sm:text-sm font-semibold text-[#0B0B0D] border border-[#E5E1D6]">
        <Shield className="h-4 w-4 text-[#1F8C7F] shrink-0" />
        <span>100% private. Files are processed in your browser and never uploaded.</span>
      </div>
    </section>
  );
}
