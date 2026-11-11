"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/data/faqs";

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F5] px-3 py-1 text-xs font-bold text-[#1F8C7F]">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0D]">
          Everything you need to know about WEBPTools
        </h2>
        <p className="text-xs sm:text-sm text-[#4F4E55]">
          Clear answers about WebP format support, privacy, and website integration.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5E1D6] bg-white transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#0B0B0D] hover:text-[#1F8C7F] transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#4F4E55] transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#1F8C7F]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 text-xs sm:text-sm text-[#4F4E55] leading-relaxed border-t border-[#E5E1D6]/60 pt-3"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
