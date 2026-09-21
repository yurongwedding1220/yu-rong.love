/** 全頁深度相位 — 對應捲動敘事 */
export type DepthPhase =
  | 'daylight'
  | 'surface'
  | 'shallow'
  | 'harbor'
  | 'descent'
  | 'underwater'
  | 'deeper'
  | 'abyss';

export const DEPTH_PHASE_TARGET: Record<DepthPhase, number> = {
  daylight: 0.02,
  surface: 0.18,
  shallow: 0.34,
  harbor: 0.36,
  descent: 0.46,
  underwater: 0.56,
  deeper: 0.72,
  abyss: 0.95,
};
