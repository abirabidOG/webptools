export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is WebP?",
    answer:
      "WebP is a modern open image format developed by Google that provides superior lossless and lossy compression for images on the web. Using WebP, webmasters, bloggers, and developers can create smaller, richer images that make websites load up to 30% faster than traditional JPG or PNG images, while retaining full transparency and high visual fidelity.",
  },
  {
    question: "Why convert JPG to WebP?",
    answer:
      "Converting JPG to WebP drastically shrinks file size—typically by 25% to 35% without visible loss in quality. Lighter images directly improve your website's Google Core Web Vitals (such as Largest Contentful Paint / LCP), lower mobile bounce rates, reduce cloud hosting and CDN bandwidth costs, and help pages rank higher on search engines.",
  },
  {
    question: "Is WEBPTools free?",
    answer:
      "Yes, WEBPTools is 100% free with no limits, no subscriptions, no sign-up, and no watermarks. It is a client-side utility built by Abid Mahmud to give founders, designers, and marketers high-performance design tools without paywalls.",
  },
  {
    question: "Are my images uploaded?",
    answer:
      "No. Your images are never uploaded to any remote server or cloud database. All conversions and rasterizations happen locally inside your web browser using the HTML5 Canvas API. Your photos, private documents, and brand assets stay 100% on your device, making WEBPTools entirely private and compliant with sensitive data workflows.",
  },
  {
    question: "Does it work for WordPress / Shopify / Blogger?",
    answer:
      "Yes! Modern versions of WordPress (version 5.8 and later), Shopify, Webflow, Squarespace, and Blogger natively accept WebP uploads. You can drop your converted WebP files directly into your media library or product catalogs with zero special plugins required.",
  },
];
