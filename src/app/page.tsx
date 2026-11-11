import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ConverterTool from "@/components/ConverterTool";
import ToolsHubSection from "@/components/ToolsHubSection";
import SeoSection from "@/components/SeoSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, Shield, Zap, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Tools for Founders & Designers — Abid Mahmud (tools.abidmahmud.cv)",
  description:
    "Free, fast, client-side web tools for startups and creators. Convert JPG/PNG/SVG to WebP, export logo kits, and extract color palettes. No uploads, 100% private.",
  keywords: [
    "Abid Mahmud tools",
    "free design tools",
    "WEBPTools",
    "JPG to WebP converter",
    "Logo File Kit",
    "Color Palette Extractor",
    "brand identity tools",
  ],
  authors: [{ name: "Abid Mahmud", url: "https://www.abidmahmud.cv" }],
  creator: "Abid Mahmud",
  metadataBase: new URL("https://tools.abidmahmud.cv"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Tools for Founders & Designers — Abid Mahmud",
    description:
      "Handcrafted client-side web tools for founders, designers, and builders. Featuring WEBPTools, Logo File Kit, and Color Palette Extractor.",
    url: "https://tools.abidmahmud.cv",
    siteName: "Abid Mahmud Tools",
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0B0B0D] flex flex-col justify-between">
      <Header currentPath="/" />

      <main className="flex-1">
        {/* Hero Section for Tools Suite */}
        <section className="pt-12 sm:pt-16 pb-10 sm:pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF7F5] px-4 py-1.5 text-xs font-bold text-[#1F8C7F] border border-[#B6E2DC]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Abid Mahmud Tools Suite • Free & Privacy-First</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0B0B0D]">
            Free web tools for founders, designers & builders
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-[#4F4E55] max-w-2xl mx-auto font-medium leading-relaxed">
            Essential utilities designed to accelerate brand launches and website speed. No subscriptions, no ads, no cloud uploads—all processing runs directly in your browser.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/webptools"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1F8C7F] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#176E64] transition-all"
            >
              <span>Launch WEBPTools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/pins"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E1D6] bg-[#F4F2EC] px-5 py-3 text-sm font-bold text-[#0B0B0D] hover:bg-[#EBE8E0] transition-all"
            >
              <span>Pinterest Marketing Kit</span>
            </Link>
          </div>
        </section>

        {/* Featured Tool Spotlight: WEBPTools */}
        <section className="mb-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
            <div className="flex items-center justify-between border-b border-[#E5E1D6] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1F8C7F] animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0D]">
                  Featured Tool: WEBPTools — Free JPG to WebP Converter
                </h2>
              </div>
              <Link
                href="/webptools"
                className="text-xs font-bold text-[#1F8C7F] hover:underline"
              >
                Open Full Dedicated Page →
              </Link>
            </div>
          </div>

          {/* Instant Live Converter */}
          <ConverterTool />
        </section>

        {/* Tools Suite Catalog */}
        <ToolsHubSection />

        {/* Educational Why WebP */}
        <SeoSection />

        {/* FAQs */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
