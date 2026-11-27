import { useEffect } from 'react';

/**
 * One rAF-throttled scroll listener for the invitation page:
 * castle parallax, floral depth parallax (transform only),
 * bloom-on-enter, and pausing offscreen CSS animations.
 */
export function useInvitationAmbient(enabled: boolean, lite: boolean) {
  useEffect(() => {
    const castle = document.querySelector<HTMLElement>('.inv-header-castle');
    const florals = Array.from(document.querySelectorAll<HTMLElement>('[data-floral-depth]'));
    const pausers = Array.from(document.querySelectorAll<HTMLElement>('[data-anim-pause]'));

    if (!enabled) {
      castle?.style.removeProperty('--inv-castle-y');
      florals.forEach((el) => {
        el.style.removeProperty('--floral-y');
        el.classList.add('is-bloomed');
      });
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;

      if (castle) {
        const factor = lite ? 0.06 : 0.1;
        const cap = lite ? 42 : 70;
        const shift = y < 700 ? Math.round(y * factor) : cap;
        castle.style.setProperty('--inv-castle-y', `${shift}px`);
      }

      florals.forEach((el) => {
        const depth = Number(el.dataset.floralDepth) || 0;
        if (depth === 0) return;
        const amount = (lite ? 0.035 : 0.08) * depth;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 - vh / 2;
        el.style.setProperty('--floral-y', `${Math.round(-mid * amount)}px`);
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    const bloomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-bloomed');
          bloomObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    florals.forEach((el) => bloomObserver.observe(el));

    const pauseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const on = entry.isIntersecting;
          el.classList.toggle('is-offscreen', !on);
          if (on) el.style.willChange = 'transform';
          else el.style.willChange = '';
        });
      },
      { rootMargin: '14% 0px' }
    );
    [...florals, ...pausers].forEach((el) => pauseObserver.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      bloomObserver.disconnect();
      pauseObserver.disconnect();
    };
  }, [enabled, lite]);
}
