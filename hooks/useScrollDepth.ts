import { useEffect, useState } from 'react';

/** 章節深度相位 → 目標深度值（對齊 DOM 標記，不單靠全頁比例） */
export type DepthPhase = 'sunset' | 'surface' | 'shallow' | 'underwater' | 'abyss';

export const DEPTH_PHASE_TARGET: Record<DepthPhase, number> = {
  sunset: 0.02,
  surface: 0.18,
  shallow: 0.35,
  underwater: 0.62,
  abyss: 0.95,
};

const PHASES = Object.keys(DEPTH_PHASE_TARGET) as DepthPhase[];

function isDepthPhase(v: string | null): v is DepthPhase {
  return !!v && (PHASES as string[]).includes(v);
}

/** 依 [data-depth-phase] 章節位置插值深度；無標記時退回全頁比例 */
function computeAnchoredDepth(): number {
  const nodes = document.querySelectorAll<HTMLElement>('[data-depth-phase]');
  if (nodes.length === 0) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  const anchors: { y: number; depth: number }[] = [];
  nodes.forEach((el) => {
    const phase = el.getAttribute('data-depth-phase');
    if (!isDepthPhase(phase)) return;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY + rect.height * 0.35;
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

/** 全頁捲動深度 0（頂）→ 1（底），供沉浸背景使用 */
export function useScrollDepth(): number {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const clamped = Math.min(1, Math.max(0, computeAnchoredDepth()));
      setDepth(clamped);
      document.documentElement.style.setProperty('--scroll-depth', String(clamped));
      document.documentElement.dataset.depthChrome =
        clamped >= 0.4 ? 'underwater' : 'surface';
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.documentElement.style.removeProperty('--scroll-depth');
      delete document.documentElement.dataset.depthChrome;
    };
  }, []);

  return depth;
}

/** 線性區段淡入淡出 */
export function depthFade(depth: number, start: number, end: number): number {
  if (depth <= start) return 0;
  if (depth >= end) return 1;
  return (depth - start) / (end - start);
}

/** 區段內峰值（用於水面、泡沫等中段元素） */
export function depthPeak(depth: number, riseStart: number, peak: number, fallEnd: number): number {
  if (depth <= riseStart || depth >= fallEnd) return 0;
  if (depth <= peak) return (depth - riseStart) / (peak - riseStart);
  return 1 - (depth - peak) / (fallEnd - peak);
}
