import { DEPTH_PHASE_TARGET, type DepthPhase } from '../constants/depthPhases';

const PHASES = Object.keys(DEPTH_PHASE_TARGET) as DepthPhase[];

function isDepthPhase(v: string | null): v is DepthPhase {
  return !!v && (PHASES as string[]).includes(v);
}

/** 依 [data-depth-phase] / [data-depth-value] 章節位置插值深度 */
export function computeAnchoredDepth(): number {
  const nodes = document.querySelectorAll<HTMLElement>('[data-depth-phase], [data-depth-value]');
  if (nodes.length === 0) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  const anchors: { y: number; depth: number }[] = [];
  nodes.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY + rect.height * 0.35;

    const explicit = el.getAttribute('data-depth-value');
    if (explicit != null && explicit !== '') {
      const value = Number.parseFloat(explicit);
      if (!Number.isNaN(value)) {
        anchors.push({ y, depth: Math.min(1, Math.max(0, value)) });
        return;
      }
    }

    const phase = el.getAttribute('data-depth-phase');
    if (!isDepthPhase(phase)) return;
    anchors.push({ y, depth: DEPTH_PHASE_TARGET[phase] });
  });

  if (anchors.length === 0) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  anchors.sort((a, b) => a.y - b.y);
  const focusY = window.scrollY + window.innerHeight * 0.42;

  if (focusY <= anchors[0].y) return anchors[0].depth;
  if (focusY >= anchors[anchors.length - 1].y) return anchors[anchors.length - 1].depth;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (focusY >= a.y && focusY <= b.y) {
      const t = (focusY - a.y) / Math.max(1, b.y - a.y);
      return a.depth + (b.depth - a.depth) * t;
    }
  }

  return anchors[anchors.length - 1].depth;
}

/** reduced-motion：分階段跳色，避免連續暈動 */
const DEPTH_SNAP_STEPS = [
  0.02, 0.18, 0.2, 0.22, 0.26, 0.3, 0.34, 0.36, 0.4, 0.46, 0.52, 0.56, 0.72, 0.82, 0.88, 0.95,
] as const;

export function snapDepthForReducedMotion(depth: number): number {
  let nearest: number = DEPTH_SNAP_STEPS[0];
  let minDist = Math.abs(depth - nearest);
  for (const step of DEPTH_SNAP_STEPS) {
    const dist = Math.abs(depth - step);
    if (dist < minDist) {
      minDist = dist;
      nearest = step;
    }
  }
  return nearest;
}

export function depthFade(depth: number, start: number, end: number): number {
  if (depth <= start) return 0;
  if (depth >= end) return 1;
  return (depth - start) / (end - start);
}

export function depthPeak(depth: number, riseStart: number, peak: number, fallEnd: number): number {
  if (depth <= riseStart || depth >= fallEnd) return 0;
  if (depth <= peak) return (depth - riseStart) / (peak - riseStart);
  return 1 - (depth - peak) / (fallEnd - peak);
}
