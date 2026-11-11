const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'test-assets');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Create a clean SVG file with transparency and vector shapes
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F8C7F" />
      <stop offset="100%" stop-color="#0B0B0D" />
    </linearGradient>
  </defs>
  <!-- Transparent background -->
  <rect width="1000" height="1000" fill="none" />
  <circle cx="500" cy="500" r="400" fill="url(#tealGrad)" />
  <path d="M350 500 L450 600 L680 370" stroke="#FFFFFF" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <text x="500" y="740" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Transparent Vector</text>
</svg>`;

fs.writeFileSync(path.join(dir, 'test-vector.svg'), svgContent, 'utf-8');
console.log('Created test-vector.svg');
