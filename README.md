# WEBPTools — Free JPG to WebP Converter

> **"Convert JPG, PNG and SVG to WebP in seconds. Free, no upload, your files never leave your browser."**

WEBPTools is a free, single-page client-side image optimization suite built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed like a professional design tool, it operates 100% in-browser using the HTML5 Canvas API—meaning user files never touch a remote server, zero watermarks, and zero tracking.

---

## 🚀 Key Features

- **100% Client-Side In-Browser Conversion**: Uses HTML5 Canvas API to convert JPG, JPEG, PNG, SVG, and WebP files locally with extreme speed.
- **Batch Processing**: Convert up to 20 images at once (up to 10 MB per file) with intelligent validation.
- **Transparency Preservation**: Retains alpha transparency channels for PNG files and SVG vector graphics.
- **Vector SVG Rasterization**: SVGs are sharply rasterized in the browser at the user-specified max-width.
- **Live Quality Slider**: Adjust WebP compression from 10% to 100% (default: 80%) with instant, debounced preview re-conversion.
- **Aspect-Ratio Preserving Resize**: Choose between original resolution or max widths (800px, 1200px, 1600px, 1920px, 2400px).
- **Batch ZIP & Single Downloads**: One-click "Download All as ZIP" (via JSZip) or download individual converted WebP assets.
- **1-Click Sample Testing**: First-time visitors can test photo or vector conversions in one click without selecting files from their machine.
- **Privacy Badge**: Prominently displays privacy assurance that images never leave the browser.
- **Full SEO & Structured Data**: Built-in FAQPage & WebApplication JSON-LD schema, Open Graph metadata, semantic H1/H2 hierarchy.
- **Google Analytics 4**: Fires `file_converted` per image and `download_all` on ZIP export (ready to be toggled as a GA4 Key Event).
- **Pinterest Marketing Suite (`/pins`)**: Complete 10-pin visual generator and copy kit (1000 × 1500 px) for a 5-day traffic launch.

---

## 🛠️ Tech Stack & Color System

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Packaging**: JSZip (client-side ZIP archive creation)
- **Icons**: Lucide React
- **Design Tokens**:
  - White background: `#FFFFFF`
  - Ink text: `#0B0B0D`
  - Muted text: `#4F4E55`
  - Accent teal: `#1F8C7F` (Hover: `#176E64`, Subtle bg: `#EBF7F5`)
  - Soft section background: `#F4F2EC` (Border: `#E5E1D6`)
  - Typography: Inter

---

## 📁 Routes & Architecture

- `/webptools` (and `/WEBPTools`): Dedicated converter tool page with SEO copy, FAQ, and JSON-LD schema.
- `/`: The **Abid Mahmud Free Tools Hub** (`tools.abidmahmud.cv`) with interactive WEBPTools quick-launcher and roadmap cards for upcoming tools (*Logo File Kit*, *Color Palette Extractor*).
- `/pins`: 10 Pinterest pins (1000 × 1500 px) visual generator, copy-to-clipboard cards, and instant PNG exporter.

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

## 🚢 Vercel Deployment Guide

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/your-username/webptools.git
   git push -u origin master
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your `webptools` repository.
   - Framework preset: **Next.js** (detected automatically).
   - Click **Deploy**.
3. **Connect Custom Domain (`tools.abidmahmud.cv`)**:
   - In your Vercel project dashboard, navigate to **Settings > Domains**.
   - Add `tools.abidmahmud.cv`.
   - Vercel will provide the required CNAME record:
     - Name: `tools`
     - Type: `CNAME`
     - Value: `cname.vercel-dns.com`
   - Add this CNAME in your DNS provider for `abidmahmud.cv`.

---

## 📊 Google Analytics 4 & Key Event Setup

1. **Replace Measurement ID**:
   - In `.env.local` or Vercel Environment Variables, add:
     ```env
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```
     *(Or update `src/lib/analytics.ts` directly).*
2. **Mark `download_all` as a Key Event (Conversion)**:
   - Go to [Google Analytics](https://analytics.google.com).
   - In the left sidebar, click **Admin (gear icon) > Data display > Events**.
   - Trigger a download on your live site once, or click **"Create event"** / find `download_all` in the list.
   - Toggle the switch under **"Mark as key event"** for `download_all`.
   - Now, every batch ZIP download will be tracked as a primary conversion.

---

## 🔍 Google Search Console Verification

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix** and enter `https://tools.abidmahmud.cv/webptools` (or DNS domain property for `abidmahmud.cv`).
3. If using HTML tag verification, add the meta tag to `src/app/layout.tsx`.
4. Submit your canonical sitemap or request indexing for `https://tools.abidmahmud.cv/webptools`.

---

## 📌 Pinterest Business Strategy (First 10 Pins)

Create a Pinterest Business account named **WEBPTools**, claim `tools.abidmahmud.cv`, and set up these 3 boards:
1. `Image Optimization for Bloggers`
2. `Make Your Website Faster`
3. `Free Design Tools`

Visit `https://tools.abidmahmud.cv/pins` in the app to view, copy descriptions, and download ready-to-post 1000 × 1500 px pin graphics.

### 5-Day Posting Schedule (2 per day):
- **Day 1**:
  - Pin 1: *Convert JPG to WebP in Seconds, Free* (Board: Make Your Website Faster)
  - Pin 2: *Make Your Blog Load Faster With WebP* (Board: Image Optimization for Bloggers)
- **Day 2**:
  - Pin 3: *Compress Images for WordPress Without Losing Quality* (Board: Make Your Website Faster)
  - Pin 4: *JPG vs WebP: See the Size Difference* (Board: Free Design Tools)
- **Day 3**:
  - Pin 5: *Convert PNG to WebP Free, Keep Transparency* (Board: Free Design Tools)
  - Pin 6: *SVG to WebP Converter, Free Online* (Board: Make Your Website Faster)
- **Day 4**:
  - Pin 7: *How to Speed Up Your Etsy Shop Images* (Board: Image Optimization for Bloggers)
  - Pin 8: *Free Image Converter for Bloggers* (Board: Image Optimization for Bloggers)
- **Day 5**:
  - Pin 9: *Stop Uploading Heavy JPGs to Your Website* (Board: Make Your Website Faster)
  - Pin 10: *WebP Converter That Does Not Upload Your Photos* (Board: Free Design Tools)

---

## 👤 Author & Attribution

**WEBPTools** — Free image tools by [Abid Mahmud, Brand Identity Designer](https://www.abidmahmud.cv).
Website: [abidmahmud.cv](https://www.abidmahmud.cv) • Tools: [tools.abidmahmud.cv](https://tools.abidmahmud.cv)
