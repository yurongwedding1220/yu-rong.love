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

/**
 * 依全頁 depth 插值四座小島色票，驅動固定背景主色調。
 * 0.02 白天 → 蔚藍 → 淺灣 → 白沙 → 暮色 → 靠岸 → 入水
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

/** 固定背景主色層的不透明度 */
export function getGalleryLayerOpacity(depth: number): number {
  const rise = depth <= 0.12 ? 0 : Math.min(1, (depth - 0.12) / 0.1);
  const fall = depth >= 0.52 ? 0 : 1 - Math.max(0, (depth - 0.4) / 0.12);
  return rise * fall;
}

/** 夕陽暖色 — 僅白沙／暮色／靠岸（depth 0.28+） */
export function getDuskLayerOpacity(depth: number): number {
  if (depth < 0.28 || depth > 0.44) return 0;
  if (depth <= 0.32) return (depth - 0.28) / 0.04;
  return 1 - (depth - 0.32) / 0.12;
}

export function galleryPaletteGradient(palette: IslandPalette): string {
  return `linear-gradient(180deg, ${palette.glow} 0%, ${palette.sea} 42%, ${palette.deep} 100%)`;
}
