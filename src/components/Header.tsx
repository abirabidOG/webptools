import Link from "next/link";
import { Shield, ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E1D6] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="WEBPTools Homepage"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F8C7F] text-white shadow-xs font-bold tracking-tight text-base">
              W
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#0B0B0D]">
                WEBPTools
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1F8C7F]">
                Free WebP Converter
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4F4E55]">
          <Link
            href="/"
            className="text-[#1F8C7F] font-semibold transition-colors hover:text-[#0B0B0D]"
          >
            Converter
          </Link>
          <a
            href="#why-webp"
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Why WebP
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-[#0B0B0D]"
          >
            FAQ
          </a>
        </nav>

        {/* Creator Attribution Link */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#1F8C7F] bg-[#EBF7F5] px-2.5 py-1 rounded-full border border-[#B6E2DC]">
            <Shield className="h-3 w-3" />
            <span>100% In-Browser</span>
          </div>

          <a
            href="https://www.abidmahmud.cv"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 rounded-xl border border-[#E5E1D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B0B0D] shadow-2xs transition-all hover:border-[#1F8C7F] hover:bg-[#F4F2EC]"
          >
            <span>by Abid Mahmud</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#4F4E55] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1F8C7F]" />
          </a>
        </div>
      </div>
    </header>
  );
}
