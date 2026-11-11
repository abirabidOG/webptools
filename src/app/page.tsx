import type { Metadata } from "next";
import Header from "@/components/Header";
import ConverterTool from "@/components/ConverterTool";
import SeoSection from "@/components/SeoSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "WEBPTools — Free JPG to WebP Converter Online",
  description:
    "Convert JPG, PNG and SVG to WebP free online. Compress images for faster websites, WordPress, Shopify and blogs. No upload, no sign-up.",
  keywords: [
    "JPG to WebP",
    "PNG to WebP",
    "SVG to WebP",
    "free WebP converter",
    "WebP converter online",
    "image compressor",
    "compress images for WordPress",
    "client-side image converter",
    "WEBPTools",
    "Abid Mahmud",
  ],
  authors: [{ name: "Abid Mahmud", url: "https://www.abidmahmud.cv" }],
  creator: "Abid Mahmud",
  publisher: "WEBPTools",
  metadataBase: new URL("https://webptools.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WEBPTools — Free JPG to WebP Converter Online",
    description:
      "Convert JPG, PNG and SVG to WebP free online. Compress images for faster websites, WordPress, Shopify and blogs. No upload, no sign-up.",
    url: "https://webptools.vercel.app",
    siteName: "WEBPTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEBPTools — Free JPG to WebP Converter Online",
    description:
      "Convert JPG, PNG and SVG to WebP in seconds. Free, no upload, your files never leave your browser.",
    creator: "@abidmahmud",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  // Structured Data (JSON-LD) for SEO: FAQPage & WebApplication
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WEBPTools — Free JPG to WebP Converter",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Convert JPG, PNG and SVG to WebP in seconds. Free, no upload, your files never leave your browser. Batch conversion, quality slider, and ZIP export.",
    browserRequirements:
      "Requires HTML5 Canvas capable browser (Chrome, Safari, Firefox, Edge).",
    author: {
      "@type": "Person",
      name: "Abid Mahmud",
      url: "https://www.abidmahmud.cv",
      jobTitle: "Brand Identity Designer",
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0B0B0D] flex flex-col justify-between selection:bg-[#EBF7F5] selection:text-[#1F8C7F]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />

      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="pt-10 sm:pt-14 pb-8 sm:pb-10 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F2EC] px-3.5 py-1 text-xs font-semibold text-[#4F4E55] border border-[#E5E1D6]">
            <span className="h-2 w-2 rounded-full bg-[#1F8C7F]" />
            <span>100% In-Browser • Zero Upload • Privacy First</span>
          </div>

          {/* User-Specified H1 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0B0B0D]">
            Free JPG to WebP Converter
          </h1>

          {/* User-Specified Tagline */}
          <p className="text-sm sm:text-lg md:text-xl text-[#4F4E55] max-w-2xl mx-auto font-medium leading-relaxed">
            Convert JPG, PNG and SVG to WebP in seconds. Free, no upload, your files never leave your browser.
          </p>
        </div>

        {/* Core Converter Tool */}
        <ConverterTool />

        {/* SEO Educational & Format Comparison Section */}
        <SeoSection />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
