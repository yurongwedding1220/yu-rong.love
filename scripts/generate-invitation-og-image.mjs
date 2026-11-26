import { Resvg } from '@resvg/resvg-js';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const bundledFont = join(__dirname, 'fonts/NotoSerifTC-Medium.ttf');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#001531"/>
  <rect width="1200" height="630" fill="#00224c"/>
  <circle cx="180" cy="90" r="4" fill="#d6e4f5" opacity="0.35"/>
  <circle cx="980" cy="130" r="3" fill="#d6e4f5" opacity="0.28"/>
  <circle cx="1100" cy="420" r="4" fill="#d6e4f5" opacity="0.25"/>
  <circle cx="140" cy="500" r="3" fill="#d6e4f5" opacity="0.3"/>
  <circle cx="860" cy="560" r="5" fill="#c9a24a" opacity="0.35"/>

  <rect x="210" y="85" width="780" height="460" rx="28" fill="#f7f5ee"/>
  <rect x="222" y="97" width="756" height="436" rx="22" fill="none" stroke="#00224c" stroke-width="1.5" opacity="0.12"/>

  <circle cx="600" cy="175" r="36" fill="#00224c"/>
  <path d="M600 190s-14-9-18-17c-3-6 1-13 7-13 4 0 7 2 9 5 2-3 5-5 9-5 6 0 10 7 7 13-4 8-18 17-18 17z" fill="#f7f5ee"/>

  <text x="600" y="268" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, serif" font-size="64" font-weight="500" fill="#00224c" letter-spacing="0.18em">政憲</text>
  <text x="600" y="318" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, serif" font-size="36" fill="#00224c" opacity="0.7">&amp;</text>
  <text x="600" y="384" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, serif" font-size="64" font-weight="500" fill="#00224c" letter-spacing="0.18em">幸容</text>

  <line x1="470" y1="418" x2="730" y2="418" stroke="#00224c" stroke-width="1" opacity="0.25"/>
  <circle cx="600" cy="418" r="3" fill="#c9a24a"/>

  <text x="600" y="462" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, serif" font-size="26" fill="#00224c" opacity="0.78" letter-spacing="0.16em">2026年12月20日</text>
  <text x="600" y="504" text-anchor="middle" font-family="Noto Serif TC, PingFang TC, serif" font-size="22" fill="#00224c" opacity="0.62" letter-spacing="0.28em">誠摯邀請</text>
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
