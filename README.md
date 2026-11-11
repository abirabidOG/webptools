# WEBPTools — Free JPG to WebP Converter

> **"Convert JPG, PNG and SVG to WebP in seconds. Free, no upload, your files never leave your browser."**

WEBPTools is a free, single-page web tool built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed like a professional design tool, it operates 100% client-side in the browser using the HTML5 Canvas API—meaning user files never touch a remote server, zero watermarks, and zero tracking.

---

## 🚀 Core Features

- **100% Client-Side In-Browser Conversion**: Uses HTML5 Canvas API to convert JPG, JPEG, PNG, SVG, and WebP files locally with extreme speed.
- **Batch Processing**: Convert up to 20 images at once (up to 10 MB per file) with intelligent validation and error handling.
- **Transparency Preservation**: Retains alpha transparency channels for PNG files and SVG vector graphics.
- **Vector SVG Rasterization**: SVGs are sharply rasterized in the browser at the user's chosen max-width.
- **Live Quality Slider**: Adjust WebP compression from 10% to 100% (default: 80%) with instant, debounced preview re-conversion.
- **Aspect-Ratio Preserving Resize**: Choose between original resolution or max widths (800px, 1200px, 1600px, 1920px, 2400px).
- **Batch ZIP & Single Downloads**: One-click "Download All as ZIP" (via JSZip) or download individual converted WebP assets.
- **1-Click Sample Testing**: First-time visitors can test photo (.jpg) or vector (.svg) conversions in one click without selecting files from their machine.
- **Privacy Badge**: Prominently displays privacy assurance: *"100% private. Files are processed in your browser and never uploaded."*
- **Full SEO & Structured Data**: Built-in FAQPage & WebApplication JSON-LD schema, Open Graph metadata, semantic H1/H2 hierarchy.
- **Google Analytics 4**: Fires `file_converted` per image and `download_all` on ZIP export (ready to be toggled as a GA4 Key Event).

---

## 🛠️ Tech Stack & Design Tokens

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Packaging**: JSZip (client-side ZIP archive creation)
- **Icons**: Lucide React
- **Design System** (matching [abidmahmud.cv](https://www.abidmahmud.cv)):
  - White background: `#FFFFFF`
  - Ink text: `#0B0B0D`
  - Muted text: `#4F4E55`
  - Accent teal: `#1F8C7F` (Hover: `#176E64`, Subtle bg: `#EBF7F5`)
  - Soft section background: `#F4F2EC` (Border: `#E5E1D6`)
  - Typography: Inter

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🚢 Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git push origin master
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import `abirabidOG/webptools`.
   - Framework preset: **Next.js** (detected automatically).
   - Build Command: `next build --webpack` (configured in `package.json`).
   - Click **Deploy**.

---

## 📊 Google Analytics 4 & Key Event Setup

1. **Set Measurement ID**:
   - In `.env.local` or Vercel Environment Variables, add:
     ```env
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```
     *(Defaults to `G-XXXXXXXXXX` if unset).*
2. **Mark `download_all` as a Key Event (Conversion)**:
   - Go to [Google Analytics](https://analytics.google.com).
   - In the left sidebar, click **Admin > Data display > Events**.
   - Trigger a download on your live site once, or click **"Create event"** / find `download_all` in the list.
   - Toggle the switch under **"Mark as key event"** for `download_all`.
   - Now, every batch ZIP download will be tracked as a primary conversion.

---

## 👤 Author & Attribution

**WEBPTools** — Free image tools by [Abid Mahmud, Brand Identity Designer](https://www.abidmahmud.cv).
Website: [abidmahmud.cv](https://www.abidmahmud.cv)
