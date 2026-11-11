import React from "react";
import { Check, Zap, Layers, Image as ImageIcon, Gauge, ShieldCheck, ArrowRight } from "lucide-react";

export default function SeoSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* Section 1: H2 Convert JPG, PNG and SVG to WebP in seconds */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF7F5] px-3.5 py-1 text-xs font-bold text-[#1F8C7F] border border-[#B6E2DC]">
          <Zap className="h-3.5 w-3.5" />
          <span>Next-Gen Image Format</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B0B0D]">
          Convert JPG, PNG and SVG to WebP in seconds
        </h2>
        <p className="text-sm sm:text-base text-[#4F4E55] leading-relaxed">
          WEBPTools runs entirely in your browser using the HTML5 Canvas API. Your images never leave your computer,
          providing instantaneous conversions, absolute data privacy, and zero file size waiting times.
        </p>
      </div>

      {/* Section 2: Why convert to WebP? with 3 short benefits */}
      <div id="why-webp" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B0B0D]">
            Why convert to WebP?
          </h2>
          <p className="text-xs sm:text-sm text-[#4F4E55]">
            Developed by Google, WebP is the modern image format built specifically to accelerate the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#F4F2EC] p-6 sm:p-7 space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1F8C7F] shadow-xs">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B0B0D]">Smaller files</h3>
            <p className="text-xs sm:text-sm text-[#4F4E55] leading-relaxed">
              WebP lossless images are <strong>26% smaller</strong> than PNGs, and lossy images are <strong>25–34% smaller</strong> than comparable JPEGs. Shave megabytes off your bandwidth bills and storage quotas without visual artifacts.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#F4F2EC] p-6 sm:p-7 space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1F8C7F] shadow-xs">
              <Gauge className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B0B0D]">Faster websites</h3>
            <p className="text-xs sm:text-sm text-[#4F4E55] leading-relaxed">
              Heavy uncompressed hero banners and product catalogs ruin Google Core Web Vitals (LCP) and cause high bounce rates. Lightweight WebP files load instantly on mobile 4G/5G networks, boosting your search rankings.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="rounded-2xl border border-[#E5E1D6] bg-[#F4F2EC] p-6 sm:p-7 space-y-3 transition-transform hover:-translate-y-1 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1F8C7F] shadow-xs">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0B0B0D]">Same quality</h3>
            <p className="text-xs sm:text-sm text-[#4F4E55] leading-relaxed">
              Advanced predictive entropy encoding retains sharp lines, deep photographic contrasts, and <strong>transparent alpha channels</strong> for PNG logos and SVG illustrations that standard JPEGs simply cannot support.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Matrix: JPG vs PNG vs SVG vs WebP */}
      <div className="rounded-3xl border border-[#E5E1D6] bg-white p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#0B0B0D]">
            Format Comparison: Which format should you deploy?
          </h3>
          <p className="text-xs sm:text-sm text-[#4F4E55]">
            See why modern developers and eCommerce merchants standardize on WebP.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E5E1D6] text-[#4F4E55]">
                <th className="py-3 px-3 font-semibold">Format</th>
                <th className="py-3 px-3 font-semibold">File Weight</th>
                <th className="py-3 px-3 font-semibold">Alpha Transparency</th>
                <th className="py-3 px-3 font-semibold">Browser Support</th>
                <th className="py-3 px-3 font-semibold">Best Used For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D6]/60">
              <tr className="bg-[#EBF7F5]/50 font-medium">
                <td className="py-3.5 px-3 font-bold text-[#1F8C7F] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1F8C7F]" />
                  WebP (Modern Standard)
                </td>
                <td className="py-3.5 px-3 font-bold text-[#0B0B0D]">Ultra Lightweight (-30% to -80%)</td>
                <td className="py-3.5 px-3 text-[#1F8C7F] font-semibold">Yes (Full 8-bit Alpha)</td>
                <td className="py-3.5 px-3 text-[#0B0B0D]">98%+ (All modern browsers)</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Websites, blogs, Shopify, WordPress</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-semibold text-[#0B0B0D]">JPG / JPEG</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Heavy (Baseline compression)</td>
                <td className="py-3.5 px-3 text-rose-600 font-medium">No (Replaces with white background)</td>
                <td className="py-3.5 px-3 text-[#0B0B0D]">Universal</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Legacy cameras, offline printing</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-semibold text-[#0B0B0D]">PNG</td>
                <td className="py-3.5 px-3 text-rose-600 font-medium">Very Heavy (Large lossless payload)</td>
                <td className="py-3.5 px-3 text-emerald-700 font-medium">Yes</td>
                <td className="py-3.5 px-3 text-[#0B0B0D]">Universal</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Local raw source files, design masters</td>
              </tr>
              <tr>
                <td className="py-3.5 px-3 font-semibold text-[#0B0B0D]">SVG</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Light for simple paths; heavy for complex art</td>
                <td className="py-3.5 px-3 text-emerald-700 font-medium">Yes (Vector)</td>
                <td className="py-3.5 px-3 text-[#0B0B0D]">Universal</td>
                <td className="py-3.5 px-3 text-[#4F4E55]">Vector icons, UI glyphs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Platforms: WordPress, Shopify, Blogger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#E5E1D6] bg-white p-6 space-y-3">
          <div className="font-bold text-sm text-[#0B0B0D] flex items-center justify-between">
            <span>WordPress 5.8+</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Native</span>
          </div>
          <p className="text-xs text-[#4F4E55] leading-relaxed">
            WordPress supports WebP out of the box. Dropping converted WebP files into your Media Library bypasses bloated third-party compression plugins.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-white p-6 space-y-3">
          <div className="font-bold text-sm text-[#0B0B0D] flex items-center justify-between">
            <span>Shopify Stores</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Optimal</span>
          </div>
          <p className="text-xs text-[#4F4E55] leading-relaxed">
            Shopify product catalogs with 50+ gallery photos per collection load dramatically faster when master assets are converted and resized before uploading.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E1D6] bg-white p-6 space-y-3">
          <div className="font-bold text-sm text-[#0B0B0D] flex items-center justify-between">
            <span>Blogger & Ghost</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Supported</span>
          </div>
          <p className="text-xs text-[#4F4E55] leading-relaxed">
            Publish photo-heavy longform tutorials and case studies without sacrificing mobile reader experience or exceeding upload bandwidth limits.
          </p>
        </div>
      </div>
    </section>
  );
}
