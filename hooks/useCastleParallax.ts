import { useEffect } from 'react';

export const useCastleParallax = (enabled: boolean) => {
  useEffect(() => {
    const castle = document.querySelector<HTMLElement>('.inv-header-castle');
    if (!castle) return undefined;

    if (!enabled) {
      castle.style.removeProperty('--inv-castle-y');
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const shift = y < 700 ? Math.round(y * 0.1) : 70;
      castle.style.setProperty('--inv-castle-y', `${shift}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
};
