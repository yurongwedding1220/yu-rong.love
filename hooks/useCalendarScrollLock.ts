import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useMotionValueEvent } from 'framer-motion';
import {
  CALENDAR_REVEAL_COMPLETE,
  getCalendarRevealScrollY,
} from '../utils/calendarScrollMath';

type UseCalendarScrollLockOptions = {
  containerRef: React.RefObject<HTMLElement | null>;
  scrollYProgress: MotionValue<number>;
  completeThreshold: number;
  enabled: boolean;
  /** low 模式：需手動揭開後才解鎖 */
  manualUnlocked?: boolean;
  onComplete?: () => void;
};

/**
 * 月曆完整揭開前，阻止繼續往下滑出章節。
 */
export function useCalendarScrollLock({
  containerRef,
  scrollYProgress,
  completeThreshold,
  enabled,
  manualUnlocked = true,
  onComplete,
}: UseCalendarScrollLockOptions) {
  const unlockedRef = useRef(manualUnlocked);

  useEffect(() => {
    unlockedRef.current = manualUnlocked;
  }, [manualUnlocked]);

  const tryUnlock = (progress: number) => {
    if (unlockedRef.current) return true;
    if (progress >= completeThreshold) {
      unlockedRef.current = true;
      onComplete?.();
      return true;
    }
    return false;
  };

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!enabled) return;
    tryUnlock(v);
  });

  useEffect(() => {
    if (!enabled) return;

    const isInCalendarZone = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
    };

    const clamp = () => {
      if (unlockedRef.current) return;
      const el = containerRef.current;
      if (!el || !isInCalendarZone(el)) return;

      const progress = scrollYProgress.get();
      if (tryUnlock(progress)) return;

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY > maxY + 1) {
        window.scrollTo({ top: maxY, behavior: 'auto' });
      }
    };

    const blockWheel = (e: WheelEvent) => {
      if (unlockedRef.current || e.deltaY <= 0) return;
      const el = containerRef.current;
      if (!el || !isInCalendarZone(el)) return;

      const progress = scrollYProgress.get();
      if (tryUnlock(progress)) return;

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY >= maxY - 2) {
        e.preventDefault();
      }
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (unlockedRef.current) return;
      const el = containerRef.current;
      if (!el || !isInCalendarZone(el)) return;

      const touchY = e.touches[0]?.clientY ?? lastTouchY;
      const delta = lastTouchY - touchY;
      lastTouchY = touchY;
      if (delta <= 0) return;

      const progress = scrollYProgress.get();
      if (tryUnlock(progress)) return;

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY >= maxY - 2) {
        e.preventDefault();
      }
    };

    document.documentElement.classList.add('calendar-scroll-locked');

    window.addEventListener('scroll', clamp, { passive: true });
    window.addEventListener('wheel', blockWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.documentElement.classList.remove('calendar-scroll-locked');
      window.removeEventListener('scroll', clamp);
      window.removeEventListener('wheel', blockWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [containerRef, scrollYProgress, completeThreshold, enabled, onComplete]);
}

export { CALENDAR_REVEAL_COMPLETE };
