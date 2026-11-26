import { useEffect } from 'react';

export const useScrollReveal = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      document.querySelectorAll('.inv-reveal-item').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const items = Array.from(document.querySelectorAll('.inv-reveal-item'));
    if (items.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [enabled]);
};
