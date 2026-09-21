export type IslandPalette = {
  deep: string;
  sea: string;
  accent: string;
  glow: string;
};

function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw.slice(0, 6);
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** 線性混色兩個 hex 色票 */
export function lerpHex(a: string, b: string, t: number): string {
  const u = Math.min(1, Math.max(0, t));
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(r1 + (r2 - r1) * u);
  const g = Math.round(g1 + (g2 - g1) * u);
  const bl = Math.round(b1 + (b2 - b1) * u);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function blendPalettes(a: IslandPalette, b: IslandPalette, t: number): IslandPalette {
  return {
    deep: lerpHex(a.deep, b.deep, t),
    sea: lerpHex(a.sea, b.sea, t),
    accent: lerpHex(a.accent, b.accent, t),
    glow: lerpHex(a.glow, b.glow, t),
  };
}

/** 章節內三段式混色：前章 → 本章 → 下章 */
export function blendChapterPalette(
  from: IslandPalette,
  current: IslandPalette,
  to: IslandPalette,
  progress: number
): IslandPalette {
  if (progress <= 0.5) {
    return blendPalettes(from, current, progress / 0.5);
  }
  return blendPalettes(current, to, (progress - 0.5) / 0.5);
}

/** 半透明漸層底色 — 讓全頁固定背景透出，只做色調偏移 */
export function chapterTintGradient(palette: IslandPalette, strength = 1): string {
  const glowA = Math.min(255, Math.round(0x1a * strength))
    .toString(16)
    .padStart(2, '0');
  const seaA = Math.min(255, Math.round(0x42 * strength))
    .toString(16)
    .padStart(2, '0');
  const deepA = Math.min(255, Math.round(0x52 * strength))
    .toString(16)
    .padStart(2, '0');
  return `linear-gradient(188deg, ${palette.glow}${glowA} 0%, ${palette.sea}${seaA} 38%, ${palette.deep}${deepA} 88%)`;
}
