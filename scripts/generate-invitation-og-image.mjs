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
    <radialGradient id="navy" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#06356a"/>
      <stop offset="42%" stop-color="#00224c"/>
      <stop offset="100%" stop-color="#001531"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#navy)"/>
  <circle cx="160" cy="80" r="4" fill="#d6e4f5" opacity="0.35"/>
  <circle cx="1000" cy="110" r="3" fill="#d6e4f5" opacity="0.28"/>
  <circle cx="1120" cy="430" r="4" fill="#d6e4f5" opacity="0.22"/>
  <circle cx="120" cy="520" r="3" fill="#d6e4f5" opacity="0.3"/>
  <circle cx="880" cy="570" r="5" fill="#c9a24a" opacity="0.32"/>

  <!-- cream cover card -->
  <rect x="200" y="72" width="800" height="486" rx="28" fill="#f7f5ee"/>
  <rect x="214" y="86" width="772" height="458" rx="22" fill="none" stroke="#00224c" stroke-width="1.5" opacity="0.12"/>

  <!-- corner floral clusters (left) -->
  <g transform="translate(250 150)" fill="#7a98be" opacity="0.72">
    <circle cx="0" cy="0" r="16"/>
    <circle cx="22" cy="-10" r="13"/>
    <circle cx="20" cy="14" r="12"/>
    <circle cx="-16" cy="16" r="11"/>
    <circle cx="-18" cy="-14" r="10"/>
    <circle cx="6" cy="24" r="9"/>
    <circle cx="4" cy="-2" r="6" fill="#c5d4e8"/>
  </g>
  <g transform="translate(292 188)" fill="#9eb4d4" opacity="0.55">
    <circle cx="0" cy="0" r="10"/>
    <circle cx="14" cy="8" r="8"/>
    <circle cx="-8" cy="10" r="7"/>
  </g>

  <!-- corner floral clusters (right) -->
  <g transform="translate(950 470)" fill="#7a98be" opacity="0.72">
    <circle cx="0" cy="0" r="16"/>
    <circle cx="-22" cy="10" r="13"/>
    <circle cx="-18" cy="-16" r="12"/>
    <circle cx="16" cy="-14" r="11"/>
    <circle cx="18" cy="14" r="10"/>
    <circle cx="-6" cy="-24" r="9"/>
    <circle cx="-4" cy="2" r="6" fill="#c5d4e8"/>
  </g>
  <g transform="translate(908 430)" fill="#9eb4d4" opacity="0.55">
    <circle cx="0" cy="0" r="10"/>
    <circle cx="-14" cy="-8" r="8"/>
    <circle cx="8" cy="-10" r="7"/>
  </g>

  <circle cx="600" cy="160" r="34" fill="#00224c"/>
  <path d="M600 174s-13-8-17-16c-3-5.5 1-12 6.5-12 3.8 0 6.6 2 8.5 4.8 1.9-2.8 4.7-4.8 8.5-4.8 5.5 0 9.5 6.5 6.5 12-4 8-17 16-17 16z" fill="#f7f5ee"/>

  <text x="600" y="248" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="62" font-weight="500" fill="#00224c" letter-spacing="0.18em">政憲</text>
  <text x="600" y="298" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="36" fill="#00224c" opacity="0.55">&amp;</text>
  <text x="600" y="362" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="62" font-weight="500" fill="#00224c" letter-spacing="0.18em">幸容</text>

  <line x1="460" y1="396" x2="740" y2="396" stroke="#00224c" stroke-width="1" opacity="0.22"/>
  <circle cx="600" cy="396" r="3" fill="#c9a24a"/>

  <text x="600" y="440" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="24" fill="#00224c" opacity="0.8" letter-spacing="0.14em">2026年12月20日 星期日 12:00</text>
  <text x="600" y="478" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="20" fill="#00224c" opacity="0.62" letter-spacing="0.16em">緻麗伯爵酒店 · 皇家宴</text>
  <text x="600" y="516" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, Songti TC, serif" font-size="20" fill="#00224c" opacity="0.58" letter-spacing="0.32em">誠摯邀請</text>
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
const outPath = join(root, 'public/invitation-og-image.png');
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.byteLength} bytes)`);
