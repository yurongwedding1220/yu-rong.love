import { Resvg } from '@resvg/resvg-js';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const bundledFont = join(__dirname, 'fonts/NotoSerifTC-Medium.ttf');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1B4D6E"/>
      <stop offset="72%" stop-color="#3A8FB7"/>
      <stop offset="100%" stop-color="#4A9FC5"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="18%" r="28%">
      <stop offset="0%" stop-color="#F4E8D8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#F4E8D8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#sky)"/>
  <rect width="1200" height="630" fill="url(#sunGlow)"/>

  <circle cx="600" cy="112" r="26" fill="#E8A87C" opacity="0.92"/>

  <path
    d="M0,392 C180,352 360,430 600,398 C840,366 1020,348 1200,388 L1200,630 L0,630 Z"
    fill="#F4E8D8"
  />
  <path
    d="M0,418 C220,388 420,452 620,424 C820,396 1000,404 1200,432 L1200,630 L0,630 Z"
    fill="#E8D5BC"
    opacity="0.55"
  />

  <text
    x="600"
    y="252"
    text-anchor="middle"
    font-family="PingFang TC, Noto Serif TC, Heiti TC, sans-serif"
    font-size="74"
    font-weight="500"
    fill="#F4E8D8"
    letter-spacing="0.08em"
  >政憲 &amp; 幸容</text>

  <text
    x="600"
    y="322"
    text-anchor="middle"
    font-family="PingFang TC, Noto Serif TC, Heiti TC, sans-serif"
    font-size="34"
    font-weight="400"
    fill="#F4E8D8"
    opacity="0.92"
    letter-spacing="0.22em"
  >2026.12.20</text>

  <text
    x="600"
    y="500"
    text-anchor="middle"
    font-family="PingFang TC, Noto Serif TC, Heiti TC, sans-serif"
    font-size="30"
    font-weight="400"
    fill="#1B4D6E"
    letter-spacing="0.14em"
  >斗六 · 緻麗伯爵酒店</text>
</svg>`;

const fontOptions = existsSync(bundledFont)
  ? {
      fontFiles: [bundledFont],
      loadSystemFonts: false,
      defaultFontFamily: 'Noto Serif TC',
    }
  : {
      loadSystemFonts: true,
      defaultFontFamily: 'PingFang TC',
    };

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: fontOptions,
});

const png = resvg.render().asPng();
const outPath = join(root, 'public/og-image.png');
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.byteLength} bytes)`);
