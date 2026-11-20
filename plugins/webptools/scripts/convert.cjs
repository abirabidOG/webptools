#!/usr/bin/env node
/**
 * WEBPTools CLI: convert images to optimised WebP, locally.
 *
 * Usage:
 *   node scripts/convert.cjs <image...> [--quality 0-100] [--out-dir dir]
 *
 * Engine: sharp (libvips), runs fully offline. Nothing is uploaded.
 * Default quality is 80, the same default as the web tool.
 * Outputs are written next to each input unless --out-dir is given.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ACCEPTED = new Set([".jpg", ".jpeg", ".png", ".svg", ".webp"]);

function parseArgs(argv) {
  const inputs = [];
  const opts = { quality: 80, outDir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--quality") opts.quality = Number(argv[++i]);
    else if (a === "--out-dir") opts.outDir = argv[++i];
    else if (a.startsWith("--")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else inputs.push(a);
  }
  return { inputs, opts };
}

async function convertOne(input, outPath, quality) {
  const before = fs.statSync(input).size;
  await sharp(input).webp({ quality }).toFile(outPath);
  const after = fs.statSync(outPath).size;
  const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0;
  console.log(
    `${path.basename(input)} -> ${path.basename(outPath)} ` +
      `(${before} bytes -> ${after} bytes, ${saved}% smaller, quality ${quality})`
  );
}

async function main() {
  const { inputs, opts } = parseArgs(process.argv.slice(2));
  if (inputs.length === 0) {
    console.error(
      "Usage: node scripts/convert.cjs <image...> [--quality 0-100] [--out-dir dir]"
    );
    process.exit(2);
  }
  if (!Number.isInteger(opts.quality) || opts.quality < 0 || opts.quality > 100) {
    console.error("--quality must be a whole number from 0 to 100.");
    process.exit(2);
  }
  if (opts.outDir) fs.mkdirSync(opts.outDir, { recursive: true });
  for (const input of inputs) {
    if (!fs.existsSync(input)) {
      console.error(`Not found: ${input}`);
      process.exit(1);
    }
    const ext = path.extname(input).toLowerCase();
    if (!ACCEPTED.has(ext)) {
      console.error(`Skipped ${input}: ${ext || "no extension"} is not an accepted format (jpg, jpeg, png, svg, webp).`);
      process.exit(1);
    }
    const outPath = path.join(
      opts.outDir || path.dirname(input),
      `${path.parse(input).name}.webp`
    );
    try {
      await convertOne(input, outPath, opts.quality);
    } catch (err) {
      console.error(`Failed to convert ${input}: ${err.message}`);
      process.exit(1);
    }
  }
}

main();
