import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Image, Palette, FileText, CheckCircle2 } from "lucide-react";

export interface ToolItem {
  name: string;
  tagline: string;
  description: string;
  status: "live" | "coming_soon";
  href: string;
  badge: string;
  icon: any;
}

export const TOOLS_CATALOG: ToolItem[] = [
  {
    name: "WEBPTools",
    tagline: "Free JPG, PNG & SVG to WebP Converter",
    description:
      "Batch convert up to 20 images at once entirely in your browser. Real-time quality slider, aspect-ratio preserved resizing, transparency support, and one-click ZIP download.",
    status: "live",
    href: "/webptools",
    badge: "Available Now",
    icon: Image,
  },
  {
    name: "Logo File Kit",
    tagline: "Brand Asset Packaging for Startups",
    description:
      "Generate standard production logo packages in one click: SVG vectors, PNG transparent lockups, dark/light variations, social avatars, and multi-resolution favicon.ico files.",
    status: "coming_soon",
    href: "#",
    badge: "Coming Soon",
    icon: FileText,
  },
  {
    name: "Color Palette Extractor",
    tagline: "Accessible Brand Color Generator",
    description:
      "Extract harmonious hex palettes, dominant brand colors, WCAG AA/AAA contrast ratios, and copy-paste Tailwind CSS configuration directly from any logo or moodboard.",
    status: "coming_soon",
    href: "#",
    badge: "In Development",
    icon: Palette,
  },
];

export default function ToolsHubSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D6] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8C7F]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tools for Founders & Designers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B0B0D]">
            More Free Tools by Abid Mahmud
          </h2>
          <p className="text-xs sm:text-sm text-[#4F4E55]">
            Handcrafted micro-utilities created to simplify brand identity workflows and website operations.
          </p>
        </div>

        <a
          href="https://www.abidmahmud.cv"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8C7F] hover:text-[#176E64] transition-colors self-start sm:self-auto"
        >
          <span>Explore Brand Identity Portfolio</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOOLS_CATALOG.map((tool) => {
          const Icon = tool.icon;
          const isLive = tool.status === "live";

          return (
            <div
              key={tool.name}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                isLive
                  ? "border-[#1F8C7F] bg-white shadow-sm ring-1 ring-[#1F8C7F]/20"
                  : "border-[#E5E1D6] bg-[#F4F2EC]/60 opacity-90"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLive ? "bg-[#EBF7F5] text-[#1F8C7F]" : "bg-white text-[#4F4E55]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isLive
                        ? "bg-[#1F8C7F] text-white"
                        : "bg-[#E5E1D6] text-[#4F4E55]"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B0B0D]">{tool.name}</h3>
                  <p className="text-xs font-medium text-[#1F8C7F]">{tool.tagline}</p>
                </div>

                <p className="text-xs text-[#4F4E55] leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E5E1D6]/80">
                {isLive ? (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8C7F] hover:text-[#176E64]"
                  >
                    <span>Launch WEBPTools</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] font-semibold text-[#4F4E55] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    In active development
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
