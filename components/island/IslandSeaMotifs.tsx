import React from 'react';

export type SeaMotifType = 'anchor' | 'shell' | 'compass' | 'starfish' | 'helm';

const MOTIF_CYCLE: SeaMotifType[] = ['anchor', 'shell', 'compass', 'starfish', 'helm'];

const LINE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** 依章節字串決定不重複的航海圖騰 */
export function motifFromSeed(seed: string): SeaMotifType {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return MOTIF_CYCLE[Math.abs(h) % MOTIF_CYCLE.length];
}

type SeaMotifProps = {
  type: SeaMotifType;
  className?: string;
};

/** iOS / SF Symbols 風格：細線、無填色、圓角端點 */
export const SeaMotif: React.FC<SeaMotifProps> = ({ type, className = 'h-3 w-3' }) => {
  switch (type) {
    case 'anchor':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="5" r="2" {...LINE_PROPS} />
          <path d="M12 7v10" {...LINE_PROPS} />
          <path d="M8 13h8" {...LINE_PROPS} />
          <path d="M8 17c1.6 2 2.6 2.5 4 2.5S16.4 19 18 17" {...LINE_PROPS} />
        </svg>
      );
    case 'shell':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M12 20V9" {...LINE_PROPS} />
          <path d="M12 20C8 16 6 13 6 10a6 6 0 0012 0c0 3-2 6-6 10z" {...LINE_PROPS} />
          <path d="M9.5 14.5c1-1.5 1.5-3 2.5-3s1.5 1.5 2.5 3" {...LINE_PROPS} />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="8.5" {...LINE_PROPS} />
          <path d="M12 4.5V6M12 18v1.5M4.5 12H6M18 12h1.5" {...LINE_PROPS} />
          <path d="M12 8l2.2 4.4L12 14l-2.2.6L12 8z" {...LINE_PROPS} />
        </svg>
      );
    case 'starfish':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M12 5v14" {...LINE_PROPS} />
          <path d="M6.5 8.5L17.5 15.5" {...LINE_PROPS} />
          <path d="M17.5 8.5L6.5 15.5" {...LINE_PROPS} />
          <path d="M5 14.5h14" {...LINE_PROPS} />
          <path d="M7.5 9.5h9" {...LINE_PROPS} />
        </svg>
      );
    case 'helm':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="7.5" {...LINE_PROPS} />
          <circle cx="12" cy="12" r="1.5" {...LINE_PROPS} />
          <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" {...LINE_PROPS} />
          <path d="M7.1 7.1l2.1 2.1M14.8 14.8l2.1 2.1M16.9 7.1l-2.1 2.1M9.2 14.8l-2.1 2.1" {...LINE_PROPS} />
        </svg>
      );
    default:
      return null;
  }
};

/** 浪線接縫上的小氣泡 — 簡化圓點 */
export const WaveBubbles: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
    {[
      [120, 18, 2],
      [380, 24, 1.5],
      [620, 14, 2.5],
      [890, 22, 1.5],
      [1120, 16, 2],
      [1320, 26, 1.5],
    ].map(([cx, cy, r], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#7EC8E3"
        strokeWidth="1"
        strokeOpacity={0.45 + (i % 3) * 0.1}
        className="island-bubble-drift"
        style={{ animationDelay: `${i * 0.7}s` }}
      />
    ))}
  </svg>
);
