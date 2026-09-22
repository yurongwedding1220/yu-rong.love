/** 與 CalendarRevealSection useScroll offset 一致 */
export const CALENDAR_SCROLL_OFFSET: ['start start', 'end end'] = ['start start', 'end end'];

/** 封面揭開完成（scroll progress） */
export const CALENDAR_REVEAL_COMPLETE = 0.92;

/** 對應 framer useScroll offset 的 scrollY */
export function getCalendarRevealScrollY(el: HTMLElement, progress: number): number {
  const rect = el.getBoundingClientRect();
  const top = window.scrollY + rect.top;
  const height = el.offsetHeight;
  const vh = window.innerHeight;
  const startY = top;
  const endY = top + height - vh;
  const span = Math.max(0, endY - startY);
  const clamped = Math.min(1, Math.max(0, progress));
  return startY + clamped * span;
}
