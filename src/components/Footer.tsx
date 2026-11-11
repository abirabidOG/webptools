import React from "react";
import Link from "next/link";
import { ArrowUpRight, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E1D6] bg-[#F4F2EC] mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Main Attribution Line Specified by User */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#0B0B0D]">
              WEBPTools — Free image tools by{" "}
              <a
                href="https://www.abidmahmud.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1F8C7F] hover:underline underline-offset-2 inline-flex items-center gap-0.5"
              >
                <span>Abid Mahmud, Brand Identity Designer</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {" — "}
              <a
                href="https://www.abidmahmud.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B0B0D] hover:text-[#1F8C7F]"
              >
                abidmahmud.cv
              </a>
            </p>
            <p className="text-xs text-[#4F4E55]">
              No server uploads • No watermarks • No tracking • Free for personal and commercial usage.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#4F4E55]">
            <Link href="/webptools" className="hover:text-[#0B0B0D] transition-colors">
              JPG to WebP
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-[#0B0B0D] transition-colors">
              Tools Hub
            </Link>
            <span>•</span>
            <Link href="/pins" className="hover:text-[#0B0B0D] transition-colors">
              Pinterest Pins Kit
            </Link>
            <span>•</span>
            <a
              href="https://www.abidmahmud.cv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1F8C7F] transition-colors"
            >
              abidmahmud.cv
            </a>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 pt-6 border-t border-[#E5E1D6]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4F4E55]">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#1F8C7F]" />
            <span>Built client-side with Next.js & HTML5 Canvas API</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} WEBPTools by Abid Mahmud. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
