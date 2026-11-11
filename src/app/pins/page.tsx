"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Copy, Check, Download, Calendar, ExternalLink, Sparkles, Image as ImageIcon } from "lucide-react";

export interface PinItem {
  id: number;
  day: number;
  postNumber: number;
  title: string;
  description: string;
  board: string;
  beforeSize: string;
  afterSize: string;
  metricLabel: string;
  badge: string;
}

export const PINS_DATA: PinItem[] = [
  {
    id: 1,
    day: 1,
    postNumber: 1,
    title: "Convert JPG to WebP in Seconds, Free",
    description: "Free JPG to WebP converter online. No upload, no sign up. Smaller images, faster website. Try WEBPTools.",
    board: "Make Your Website Faster",
    beforeSize: "2.4 MB",
    afterSize: "380 KB",
    metricLabel: "84% Smaller File Size",
    badge: "Instant In-Browser",
  },
  {
    id: 2,
    day: 1,
    postNumber: 2,
    title: "Make Your Blog Load Faster With WebP",
    description: "WebP images are up to 30% smaller than JPG with the same quality. Convert yours free with WEBPTools.",
    board: "Image Optimization for Bloggers",
    beforeSize: "3.8 MB",
    afterSize: "620 KB",
    metricLabel: "Boosts PageSpeed Score",
    badge: "For Bloggers & Creators",
  },
  {
    id: 3,
    day: 2,
    postNumber: 1,
    title: "Compress Images for WordPress Without Losing Quality",
    description: "Upload JPG or PNG, choose quality, download as WebP. Perfect for WordPress, Shopify and Blogger.",
    board: "Make Your Website Faster",
    beforeSize: "4.2 MB",
    afterSize: "710 KB",
    metricLabel: "Zero Quality Degradation",
    badge: "WordPress 5.8+ Native",
  },
  {
    id: 4,
    day: 2,
    postNumber: 2,
    title: "JPG vs WebP: See the Size Difference",
    description: "Same photo, much smaller file. Convert JPG to WebP free in your browser with WEBPTools.",
    board: "Free Design Tools",
    beforeSize: "5.6 MB",
    afterSize: "840 KB",
    metricLabel: "Same Resolution, 1/6th Weight",
    badge: "Direct Comparison",
  },
  {
    id: 5,
    day: 3,
    postNumber: 1,
    title: "Convert PNG to WebP Free, Keep Transparency",
    description: "PNG to WebP converter that keeps transparency. No upload, files stay in your browser.",
    board: "Free Design Tools",
    beforeSize: "2.1 MB",
    afterSize: "290 KB",
    metricLabel: "Preserves 100% Alpha Channel",
    badge: "Logos & Graphics",
  },
  {
    id: 6,
    day: 3,
    postNumber: 2,
    title: "SVG to WebP Converter, Free Online",
    description: "Turn SVG logos and graphics into WebP for fast websites. Free, no sign up, with WEBPTools.",
    board: "Make Your Website Faster",
    beforeSize: "1.2 MB",
    afterSize: "95 KB",
    metricLabel: "Vector to Ultra-Fast WebP",
    badge: "Crisp High-DPI",
  },
  {
    id: 7,
    day: 4,
    postNumber: 1,
    title: "How to Speed Up Your Etsy Shop Images",
    description: "Smaller images load faster and look better. Convert and compress your product photos to WebP free.",
    board: "Image Optimization for Bloggers",
    beforeSize: "4.8 MB",
    afterSize: "540 KB",
    metricLabel: "Faster Listings & Checkouts",
    badge: "eCommerce Optimization",
  },
  {
    id: 8,
    day: 4,
    postNumber: 2,
    title: "Free Image Converter for Bloggers",
    description: "JPG, PNG, SVG to WebP in one click. Batch convert up to 20 images at once with WEBPTools.",
    board: "Image Optimization for Bloggers",
    beforeSize: "18.4 MB (Batch)",
    afterSize: "3.2 MB (ZIP)",
    metricLabel: "Batch Convert 20 Images",
    badge: "One-Click ZIP Export",
  },
  {
    id: 9,
    day: 5,
    postNumber: 1,
    title: "Stop Uploading Heavy JPGs to Your Website",
    description: "Convert to WebP before you upload. Faster pages, better SEO, happier visitors. Free tool, no upload.",
    board: "Make Your Website Faster",
    beforeSize: "3.5 MB",
    afterSize: "490 KB",
    metricLabel: "Save Bandwidth & Rank Higher",
    badge: "SEO & Core Web Vitals",
  },
  {
    id: 10,
    day: 5,
    postNumber: 2,
    title: "WebP Converter That Does Not Upload Your Photos",
    description: "Your files never leave your browser. Private, free JPG to WebP converter by WEBPTools.",
    board: "Free Design Tools",
    beforeSize: "100% In-Browser",
    afterSize: "0 Bytes Uploaded",
    metricLabel: "Zero Cloud Logging",
    badge: "100% Private & Client-Side",
  },
];

export default function PinsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyPinText = (pin: PinItem) => {
    const text = `TITLE: ${pin.title}\n\nDESCRIPTION: ${pin.description}\n\nDESTINATION URL: https://tools.abidmahmud.cv/webptools\nBOARD: ${pin.board}`;
    navigator.clipboard.writeText(text);
    setCopiedId(pin.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render pin canvas at 1000x1500 and trigger download
  const downloadPinImage = (pin: PinItem) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background: pure white #FFFFFF
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 1000, 1500);

    // Subtle soft background card in center
    ctx.fillStyle = "#F4F2EC";
    ctx.beginPath();
    ctx.roundRect(60, 60, 880, 1380, 40);
    ctx.fill();

    // Top Brand Badge
    ctx.fillStyle = "#1F8C7F";
    ctx.beginPath();
    ctx.roundRect(100, 110, 220, 50, 25);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WEBPTools.cv", 210, 142);

    // Pin Tagline / Top Title
    ctx.fillStyle = "#0B0B0D";
    ctx.font = "bold 52px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";

    // Multi-line wrap for title
    const words = pin.title.split(" ");
    let line = "";
    let y = 250;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 780 && n > 0) {
        ctx.fillText(line, 100, y);
        line = words[n] + " ";
        y += 66;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // Visual Comparison Card (White inner card)
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(100, y + 60, 800, 480, 32);
    ctx.fill();
    ctx.strokeStyle = "#E5E1D6";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Before/After Giant Text
    ctx.fillStyle = "#4F4E55";
    ctx.font = "bold 28px Inter, system-ui, sans-serif";
    ctx.fillText("ORIGINAL FILE", 140, y + 130);

    ctx.fillStyle = "#0B0B0D";
    ctx.font = "bold 72px Inter, system-ui, sans-serif";
    ctx.fillText(pin.beforeSize, 140, y + 215);

    // Arrow to After
    ctx.fillStyle = "#1F8C7F";
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillText("CONVERTED TO WEBP", 140, y + 330);

    ctx.fillStyle = "#1F8C7F";
    ctx.font = "bold 88px Inter, system-ui, sans-serif";
    ctx.fillText(pin.afterSize, 140, y + 430);

    // Pill badge for metric
    ctx.fillStyle = "#EBF7F5";
    ctx.beginPath();
    ctx.roundRect(140, y + 460, 440, 52, 26);
    ctx.fill();
    ctx.fillStyle = "#1F8C7F";
    ctx.font = "bold 24px Inter, system-ui, sans-serif";
    ctx.fillText(`✓ ${pin.metricLabel}`, 170, y + 495);

    // Footer of Pin
    ctx.fillStyle = "#0B0B0D";
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillText("tools.abidmahmud.cv/webptools", 100, 1360);

    ctx.fillStyle = "#4F4E55";
    ctx.font = "500 24px Inter, system-ui, sans-serif";
    ctx.fillText("Free • No Upload • Files Stay in Your Browser", 100, 1405);

    // Trigger download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `pinterest-pin-${pin.id}-${pin.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-white text-[#0B0B0D]">
      <Header currentPath="/pins" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F5] px-3.5 py-1 text-xs font-bold text-[#1F8C7F] border border-[#B6E2DC]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch Marketing Kit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0D] tracking-tight">
            10 High-Converting Pinterest Pins (1000 × 1500 px)
          </h1>
          <p className="text-sm sm:text-base text-[#4F4E55]">
            Post 2 per day for 5 days. Link every pin to{" "}
            <code className="rounded bg-[#F4F2EC] px-2 py-0.5 font-mono text-xs text-[#1F8C7F]">
              https://tools.abidmahmud.cv/webptools
            </code>
            . Clean, minimal design matching WEBPTools with giant before/after file sizes.
          </p>
        </div>

        {/* Pinterest Strategy Overview Card */}
        <div className="rounded-3xl border border-[#E5E1D6] bg-[#F4F2EC] p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#0B0B0D] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#1F8C7F]" />
            5-Day Pinterest Posting Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="rounded-2xl bg-white p-4 border border-[#E5E1D6] space-y-1">
              <span className="font-bold text-[#1F8C7F]">Board 1: Image Optimization for Bloggers</span>
              <p className="text-[#4F4E55]">
                Target: Food bloggers, lifestyle creators, travel writers using heavy camera JPGs.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#E5E1D6] space-y-1">
              <span className="font-bold text-[#1F8C7F]">Board 2: Make Your Website Faster</span>
              <p className="text-[#4F4E55]">
                Target: WordPress, Webflow, Shopify owners wanting better Google Core Web Vitals.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-[#E5E1D6] space-y-1">
              <span className="font-bold text-[#1F8C7F]">Board 3: Free Design Tools</span>
              <p className="text-[#4F4E55]">
                Target: Graphic designers, startup founders, Figma users exporting assets.
              </p>
            </div>
          </div>
        </div>

        {/* Pins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PINS_DATA.map((pin) => (
            <div
              key={pin.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E5E1D6] bg-white p-6 shadow-sm space-y-6"
            >
              {/* Pin Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="rounded-full bg-[#EBF7F5] px-2.5 py-0.5 text-[#1F8C7F]">
                    Day {pin.day} • Pin #{pin.postNumber}
                  </span>
                  <span className="rounded-full bg-[#F4F2EC] px-2.5 py-0.5 text-[#4F4E55]">
                    {pin.board}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B0B0D] leading-snug">
                  {pin.title}
                </h3>

                <p className="text-xs text-[#4F4E55] leading-relaxed bg-[#F4F2EC] p-3 rounded-xl border border-[#E5E1D6]">
                  &ldquo;{pin.description}&rdquo;
                </p>
              </div>

              {/* Pin Visual Mockup (1000x1500 Aspect Ratio 2:3) */}
              <div className="relative mx-auto w-full max-w-[280px] aspect-[2/3] rounded-2xl border-2 border-[#E5E1D6] bg-white p-4 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#1F8C7F] bg-[#EBF7F5] px-2 py-0.5 rounded-full">
                      WEBPTools
                    </span>
                    <span className="text-[8px] font-semibold text-[#4F4E55]">
                      100% In-Browser
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-[#0B0B0D] leading-tight">
                    {pin.title}
                  </h4>
                </div>

                {/* Big Before/After Size */}
                <div className="rounded-xl bg-[#F4F2EC] p-3 border border-[#E5E1D6] text-center space-y-1">
                  <div className="text-[10px] font-semibold text-[#4F4E55]">Original</div>
                  <div className="text-sm font-bold text-[#0B0B0D] line-through decoration-rose-500">
                    {pin.beforeSize}
                  </div>
                  <div className="text-[10px] font-bold text-[#1F8C7F] pt-1">WebP Converted</div>
                  <div className="text-2xl font-black text-[#1F8C7F] tracking-tight">
                    {pin.afterSize}
                  </div>
                  <div className="text-[9px] font-bold text-[#1F8C7F] bg-white rounded-md py-0.5 mt-1 border border-[#B6E2DC]">
                    {pin.metricLabel}
                  </div>
                </div>

                {/* Pin Bottom */}
                <div className="text-center pt-1 border-t border-[#E5E1D6]">
                  <span className="text-[9px] font-bold text-[#0B0B0D]">
                    tools.abidmahmud.cv
                  </span>
                  <p className="text-[8px] text-[#4F4E55]">Free • No Upload • Instant</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => copyPinText(pin)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E1D6] bg-white px-3.5 py-2 text-xs font-bold text-[#0B0B0D] hover:bg-[#F4F2EC] transition-all shadow-2xs"
                >
                  {copiedId === pin.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[#4F4E55]" />
                      <span>Copy Title & Desc</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => downloadPinImage(pin)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1F8C7F] px-4 py-2 text-xs font-bold text-white hover:bg-[#176E64] transition-all shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Pin (1000×1500)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
