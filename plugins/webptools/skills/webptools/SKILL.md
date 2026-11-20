---
name: webptools
description: Convert JPG, JPEG, PNG, SVG and WebP images to optimised WebP, locally, with sharp. Use when the user asks to convert, compress, or optimise images to WebP, shrink image files, or when they invoke /webptools.
license: MIT
version: 0.1.0
tags: [webp, image, convert, compress, optimise, jpg, png, svg]
---

# WEBPTools

Convert images to optimised WebP without uploading anything. Everything runs
locally on the user's machine. There is no sign-in, no credit system, and no
watermark.

## First run setup

The conversion script lives in this plugin at `scripts/convert.cjs` and needs
the `sharp` package. On first use in a project, install it once from the
plugin directory:

```bash
cd <plugin-dir>
npm install
```

`<plugin-dir>` is the installed plugin folder, for example
`~/.claude/plugins/webptools/webptools` or the `plugins/webptools` folder of
the cloned repo. If `node_modules/sharp` already exists, skip the install.

## How to convert

Run the script with the image path. It writes a `.webp` next to the input
unless `--out-dir` is given:

```bash
node scripts/convert.cjs photo.jpg
node scripts/convert.cjs logo.png --quality 90 --out-dir converted
node scripts/convert.cjs a.jpg b.png c.svg --quality 80
```

Accepted inputs: JPG, JPEG, PNG, SVG, WebP. One image per run, or several
for a batch.

### Options

| Flag | What it does |
| --- | --- |
| `--quality 0-100` | WebP quality. Higher keeps more detail and makes a larger file. Default 80, the same default as the web tool. |
| `--out-dir dir` | Folder for the converted files. Created if it does not exist. |

## After converting

1. Confirm each `.webp` file exists and is not empty.
2. Report the before and after size for each file, with the percentage saved
   that the script prints. Those are real measured numbers for those files.
3. If a converted file looks wrong, retry with a higher `--quality`. If the
   user needs a different size, point them to the web tool, which offers
   resize widths of 800, 1200, 1600, 1920 and 2400 px.

## What never to claim

Never promise a fixed size saving. The live page states images can shrink by
up to 35%. Report only the measured saving for the files just converted, and
say plainly that results vary by image.

## What this skill does not do

- No resize presets in v1. The web tool has them; the script converts at the
  original size.
- No ZIP export in v1. Outputs are individual `.webp` files.
- No accounts, no history, no server. The script is the whole engine.

## Web version

The same conversion with a visual interface, batch mode up to 20 images
(up to 10 MB each), a live quality slider, resize options, and Download All
as ZIP: https://tools.abidmahmud.cv/webptools
