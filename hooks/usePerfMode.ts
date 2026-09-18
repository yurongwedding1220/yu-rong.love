import { useEffect, useState } from 'react';
import { useIsMobile } from './useIsMobile';
import { useReducedMotion } from './useReducedMotion';

export type PerfMode = 'high' | 'low';

/**
 * low：手機、低核心數、或 prefers-reduced-motion
 * → 關掉持續動畫、backdrop-blur、3D 捲動、縮短 Hero
 */
export function usePerfMode(): PerfMode {
  const isMobile = useIsMobile(768);
  const reducedMotion = useReducedMotion();
  const [lowHardware, setLowHardware] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    setLowHardware(cores <= 4 || (typeof memory === 'number' && memory <= 4) || !!saveData);
  }, []);

  if (reducedMotion || isMobile || lowHardware) return 'low';
  return 'high';
}
