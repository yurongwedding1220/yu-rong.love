import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { computeAnchoredDepth, snapDepthForReducedMotion } from '../utils/scrollDepthMath';

type ScrollJourneyContextValue = {
  depth: number;
  reducedMotion: boolean;
};

const ScrollJourneyContext = createContext<ScrollJourneyContextValue | null>(null);

/** 全站唯一 scroll 監聽：depth + CSS 變數 */
export const ScrollJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reducedMotion = useReducedMotion();
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      let clamped = Math.min(1, Math.max(0, computeAnchoredDepth()));
      if (reducedMotion) {
        clamped = snapDepthForReducedMotion(clamped);
      }
      setDepth(clamped);
      document.documentElement.style.setProperty('--scroll-depth', String(clamped));
      document.documentElement.dataset.depthChrome = clamped >= 0.52 ? 'underwater' : 'surface';
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
  }, [reducedMotion]);

  const value = useMemo(() => ({ depth, reducedMotion }), [depth, reducedMotion]);

  return <ScrollJourneyContext.Provider value={value}>{children}</ScrollJourneyContext.Provider>;
};

export function useScrollJourney(): ScrollJourneyContextValue {
  const ctx = useContext(ScrollJourneyContext);
  if (!ctx) {
    throw new Error('useScrollJourney must be used within ScrollJourneyProvider');
  }
  return ctx;
}

/** 相容舊 API */
export function useScrollDepthValue(): number {
  return useScrollJourney().depth;
}
