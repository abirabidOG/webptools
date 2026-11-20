# WEBPTools

**Convert JPG, PNG and SVG to optimised WebP in seconds. Free, no upload, your files never leave your browser.**

Live tool: https://tools.abidmahmud.cv/webptools

Smaller images make faster pages. WEBPTools turns your JPG, JPEG, PNG, SVG and WebP files into optimised WebP, entirely in the browser. The live page states images can shrink by up to 35%, with no visible loss at the default quality. Nothing is uploaded, there is no sign-in, no watermark, and no limit on how often you use it.

## What it does

- Converts JPG, JPEG, PNG, SVG and WebP to WebP, 100% client-side with the HTML5 Canvas API
- Batch conversion: up to 20 images at once, up to 10 MB per file
- Keeps transparency for PNG files and SVG graphics
- Sharp SVG rasterisation at the max width you choose
- Live quality slider from 10% to 100% (default 80%) with instant preview
- Resize that keeps the aspect ratio: original size or max widths of 800, 1200, 1600, 1920 and 2400 px
- Download All as ZIP, or download single files
- One-click samples, so you can try a photo or a vector without picking a file first
- Privacy first: files are processed in your browser and never uploaded

## Use it on the web

Open https://tools.abidmahmud.cv/webptools, drop your images in, adjust quality or size if you want, and download the WebP files or the ZIP.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Other commands:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # lint
```

## Tech

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- JSZip for Download All as ZIP
- Lucide React icons
- Google Analytics 4 events: `file_converted` per image, `download_all` on ZIP export

Design tokens match [abidmahmud.cv](https://www.abidmahmud.cv): white `#FFFFFF`, ink `#0B0B0D`, muted `#4F4E55`, teal `#1F8C7F`, soft background `#F4F2EC`, Inter type.

## Claude Code plugin

WEBPTools also ships as a Claude Code plugin in `plugins/webptools/`. It converts images to WebP from the terminal with a bundled script, using the same default quality of 80.

```text
/plugin marketplace add abirabidOG/webptools
/plugin install webptools@webptools
```

See `plugins/webptools/README.md` for usage.

## Author

Built by Abid Mahmud, Brand Identity Designer: https://www.abidmahmud.cv

## Licence

MIT. See `LICENSE`.
