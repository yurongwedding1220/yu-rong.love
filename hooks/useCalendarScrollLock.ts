import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { useMotionValueEvent } from 'framer-motion';

const OFFSET_START = 0.82;
const OFFSET_END = 0.18;

/** 對應 CalendarRevealSection 的 useScroll offset */
export function getCalendarRevealScrollY(el: HTMLElement, progress: number): number {
  const top = window.scrollY + el.getBoundingClientRect().top;
  const height = el.offsetHeight;
  const vh = window.innerHeight;
  const startY = top - OFFSET_START * vh;
  const endY = top + height - OFFSET_END * vh;
  return startY + progress * (endY - startY);
}

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
 * 月曆完整揭開前，阻止繼續往下滑。
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

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!enabled || unlockedRef.current) return;
    if (v >= completeThreshold) {
      unlockedRef.current = true;
      onComplete?.();
    }
  });

  useEffect(() => {
    if (!enabled) return;

    const clamp = () => {
      if (unlockedRef.current) return;
      const el = containerRef.current;
      if (!el) return;

      const progress = scrollYProgress.get();
      if (progress >= completeThreshold) {
        unlockedRef.current = true;
        onComplete?.();
        return;
      }

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY > maxY + 1) {
        window.scrollTo({ top: maxY, behavior: 'auto' });
      }
    };

    const blockWheel = (e: WheelEvent) => {
      if (unlockedRef.current) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const inZone = rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * 0.1;
      if (!inZone) return;

      if (scrollYProgress.get() >= completeThreshold) {
        unlockedRef.current = true;
        onComplete?.();
        return;
      }

      if (e.deltaY <= 0) return;

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY >= maxY - 4) {
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
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const inZone = rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * 0.1;
      if (!inZone) return;

      const touchY = e.touches[0]?.clientY ?? lastTouchY;
      const delta = lastTouchY - touchY;
      lastTouchY = touchY;

      if (delta <= 0) return;

      if (scrollYProgress.get() >= completeThreshold) {
        unlockedRef.current = true;
        onComplete?.();
        return;
      }

      const maxY = getCalendarRevealScrollY(el, completeThreshold);
      if (window.scrollY >= maxY - 4) {
        e.preventDefault();
      }
    };

    window.addEventListener('scroll', clamp, { passive: true });
    window.addEventListener('wheel', blockWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('scroll', clamp);
      window.removeEventListener('wheel', blockWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [containerRef, scrollYProgress, completeThreshold, enabled, onComplete]);
}
