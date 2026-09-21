import {
  GALLERY_HARBOR_HANDOFF,
  GALLERY_ISLAND_DEPTHS,
  GALLERY_SURFACE_HANDOFF,
  WEDDING_GALLERY_CHAPTERS,
} from '../constants';
import { blendPalettes, type IslandPalette } from './colorBlend';

/** Hero／啟程 — 白天日光海面（無夕陽暖色） */
export const DAYLIGHT_PALETTE: IslandPalette = {
  deep: '#1B4D6E',
  sea: '#4A9EC4',
  accent: '#7EC8E3',
  glow: '#B8E8F5',
};

/** 入水過渡色 */
const SUBMERGE_PALETTE: IslandPalette = {
  deep: '#1B4D6E',
  sea: '#3A8FB7',
  accent: '#7EC8E3',
  glow: '#E8F4FA',
};

export function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '').trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 依全頁 depth 插值四座小島色票，驅動固定背景主色調。
 */
export function getGalleryPaletteAtDepth(depth: number): IslandPalette {
  if (depth <= 0.18) {
    return blendPalettes(
      DAYLIGHT_PALETTE,
      GALLERY_SURFACE_HANDOFF,
      depth <= 0.02 ? 0 : (depth - 0.02) / 0.16
    );
  }

  const chapters = WEDDING_GALLERY_CHAPTERS;
  const depths = GALLERY_ISLAND_DEPTHS;

  if (depth <= depths[0]) {
    return blendPalettes(
      GALLERY_SURFACE_HANDOFF,
      chapters[0].palette,
      (depth - 0.18) / (depths[0] - 0.18)
    );
  }

  for (let i = 0; i < depths.length - 1; i++) {
    if (depth <= depths[i + 1]) {
      return blendPalettes(
        chapters[i].palette,
        chapters[i + 1].palette,
        (depth - depths[i]) / (depths[i + 1] - depths[i])
      );
    }
  }

  if (depth <= 0.36) {
    return blendPalettes(
      chapters[3].palette,
      GALLERY_HARBOR_HANDOFF,
      (depth - depths[3]) / (0.36 - depths[3])
    );
  }

  if (depth <= 0.46) {
    return blendPalettes(
      GALLERY_HARBOR_HANDOFF,
      SUBMERGE_PALETTE,
      (depth - 0.36) / 0.1
    );
  }

  return SUBMERGE_PALETTE;
}

export function getGalleryLayerOpacity(depth: number): number {
  const rise = depth <= 0.12 ? 0 : Math.min(1, (depth - 0.12) / 0.1);
  const fall = depth >= 0.52 ? 0 : 1 - Math.max(0, (depth - 0.4) / 0.12);
  return rise * fall;
}

export function getDuskLayerOpacity(depth: number): number {
  if (depth < 0.28 || depth > 0.44) return 0;
  if (depth <= 0.32) return (depth - 0.28) / 0.04;
  return 1 - (depth - 0.32) / 0.12;
}

export function galleryPaletteGradient(palette: IslandPalette): string {
  return `linear-gradient(180deg, ${palette.glow} 0%, ${palette.sea} 42%, ${palette.deep} 100%)`;
}

/** 章節接縫浪線 — 依前後 depth 自動取色 */
export function getDividerColors(fromDepth: number, toDepth: number): {
  fill: string;
  toColor: string;
} {
  const from = getGalleryPaletteAtDepth(fromDepth);
  const to = getGalleryPaletteAtDepth(toDepth);
  return {
    fill: hexToRgba(from.sea, 0.48),
    toColor: hexToRgba(to.glow, 0.36),
  };
}

/** 深度導覽字幕 */
export function getDepthCaption(depth: number): string {
  if (depth <= 0.2) return '日光洒落海面';

  const chapters = WEDDING_GALLERY_CHAPTERS;
  const depths = GALLERY_ISLAND_DEPTHS;
  for (let i = 0; i < depths.length; i++) {
    const next = depths[i + 1] ?? 0.38;
    if (depth <= (depths[i] + next) / 2 + 0.01) {
      return `第 ${String(i + 1).padStart(2, '0')} 座島 · ${chapters[i].title}`;
    }
  }

  if (depth <= 0.4) return '浪花輕撫沙灘';
  if (depth <= 0.54) return '緩緩潛入海中';
  if (depth <= 0.76) return '潛入清澈浅海';
  return '深海中有我們的約定';
}

/** 小島天光：①② 日光白，③④ 暖色夕照 */
export function getChapterSunGradient(index: number, palette: IslandPalette): string {
  if (index < 2) {
    return 'radial-gradient(circle, #FFFEF5 0%, #FFEAA0 50%, transparent 72%)';
  }
  return `radial-gradient(circle, ${palette.glow} 0%, ${palette.accent} 50%, transparent 72%)`;
}

export function getChapterSkyAccent(index: number, palette: IslandPalette): string {
  if (index < 2) {
    return 'rgba(184, 232, 245, 0.22)';
  }
  return `${palette.accent}24`;
}
