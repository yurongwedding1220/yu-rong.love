import type { WeddingStage } from '../types';

/** Placeholder album — replace after 政憲 & 幸容 photos are ready. */
export const WEDDING_STAGES: WeddingStage[] = [];

export const ALL_WEDDING_PHOTOS = WEDDING_STAGES.flatMap((s) => s.photos);

export const STAGE_NAV_ITEMS = WEDDING_STAGES.map((s) => ({
  id: s.id,
  time: s.time,
  title: s.title,
}));

export const HERO_COVER_PUBLIC_ID = '';

export const HERO_COVER_PUBLIC_IDS: readonly string[] = [];
