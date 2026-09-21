import { useScrollDepthValue } from './ScrollJourneyContext';

export type { DepthPhase } from '../constants/depthPhases';
export { DEPTH_PHASE_TARGET } from '../constants/depthPhases';
export { depthFade, depthPeak } from '../utils/scrollDepthMath';

/** 保留相容；請優先使用 useScrollJourney */
export function useScrollDepth(): number {
  return useScrollDepthValue();
}
