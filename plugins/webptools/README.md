# WEBPTools plugin for Claude Code

Convert JPG, PNG and SVG to optimised WebP without leaving the terminal.
Free, local, no sign-up, nothing uploaded.

## Install

In Claude Code:

```text
/plugin marketplace add abirabidOG/webptools
/plugin install webptools@webptools
```

First run only: the skill installs its conversion engine once, from the
plugin folder:

```bash
cd <plugin-dir>
npm install
```

## Use

```text
/webptools photo.jpg
/webptools logo.png --quality 90 --out-dir converted
```

Or ask Claude in plain words: "convert this photo to WebP". Batch
conversion takes several images at once. Default quality is 80, the same
default as the web tool.

## How it works

The plugin ships a skill (`skills/webptools/SKILL.md`), a slash command
(`/webptools`), and a small Node script (`scripts/convert.cjs`) built on
sharp (libvips). Conversion runs entirely on your machine. The script prints
real numbers only: before and after sizes and the measured saving per file.
It never promises a fixed saving; the live page states images can shrink by
up to 35%.

## What it does not do (v1)

- No resize presets and no ZIP export. Both live in the web tool.
- No accounts, no history, no server.

## Web version

The same conversion with a visual interface, batch mode up to 20 images
(up to 10 MB each), a live quality slider, resize options, and Download All
as ZIP: https://tools.abidmahmud.cv/webptools

## Licence

MIT. By Abid Mahmud, https://www.abidmahmud.cv
