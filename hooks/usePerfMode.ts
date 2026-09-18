import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type PerfMode = 'high' | 'medium' | 'low';

/**
 * high   — 桌機、效能充足：完整 3D 月曆、跑馬燈、完整 Hero
 * medium — 一般手機：捲動海浪、淡入月曆、輕量動效
 * low    — 省流量 / 弱機 / prefers-reduced-motion：靜態降級
 */
export function usePerfMode(): PerfMode {
  const reducedMotion = useReducedMotion();
  const [hardwareTier, setHardwareTier] = useState<'strong' | 'medium' | 'weak'>('strong');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(mq.matches);
    updateMobile();
    mq.addEventListener('change', updateMobile);
    return () => mq.removeEventListener('change', updateMobile);
  }, []);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;

    if (saveData || cores <= 2 || (typeof memory === 'number' && memory <= 2)) {
      setHardwareTier('weak');
    } else if (cores <= 4 || (typeof memory === 'number' && memory <= 4)) {
      setHardwareTier('medium');
    } else {
      setHardwareTier('strong');
    }
  }, []);

  if (reducedMotion || hardwareTier === 'weak') return 'low';
  if (isMobile || hardwareTier === 'medium') return 'medium';
  return 'high';
}

export function isLowPerf(mode: PerfMode): boolean {
  return mode === 'low';
}

export function allowsMotion(mode: PerfMode): boolean {
  return mode !== 'low';
}

export function isHighPerf(mode: PerfMode): boolean {
  return mode === 'high';
}
