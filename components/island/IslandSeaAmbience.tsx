import React from 'react';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import { SeaMotif } from './IslandSeaMotifs';

type IslandSeaAmbienceProps = {
  /** sand = 砂色章節；deep = 深藍；harbor = 碼頭淺水登船 */
  variant?: 'sand' | 'deep' | 'harbor';
  className?: string;
};

/**
 * 章節背景氛圍：浮動氣泡 + 淡羅盤水印。low perf 僅留靜態水印。
 */
export const IslandSeaAmbience: React.FC<IslandSeaAmbienceProps> = ({
  variant = 'sand',
  className = '',
}) => {
  const lite = isLowPerf(usePerfMode());
  const isDeep = variant === 'deep';
  const isHarbor = variant === 'harbor';

  const bubbleColor = isDeep
    ? 'bg-white/25'
    : isHarbor
      ? 'bg-[var(--island-shallow)]/35'
      : 'bg-[var(--island-shallow)]/30';
  const compassColor = isDeep
    ? 'text-white/8'
    : isHarbor
      ? 'text-[var(--island-deep)]/[0.09]'
      : 'text-[var(--island-deep)]/[0.07]';

  return (
    <div
      className={`island-sea-ambience pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {isHarbor && (
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'linear-gradient(180deg, rgba(126,200,227,0.22) 0%, rgba(244,232,216,0.55) 48%, rgba(253,248,241,0.85) 100%)',
          }}
        />
      )}

      {/* 羅盤／船舵水印 */}
      <div className={`absolute -right-6 top-8 md:right-4 md:top-12 ${compassColor}`}>
        <SeaMotif type={isHarbor ? 'anchor' : 'compass'} className="h-28 w-28 md:h-36 md:w-36" />
      </div>
      <div className={`absolute -left-4 bottom-16 md:left-6 md:bottom-20 ${compassColor} rotate-12`}>
        <SeaMotif type="helm" className="h-20 w-20 md:h-24 md:w-24" />
      </div>

      {!lite && (
        <>
          {[
            { left: '8%', top: '18%', size: 'h-2 w-2', delay: '0s' },
            { left: '82%', top: '28%', size: 'h-1.5 w-1.5', delay: '1.2s' },
            { left: '15%', top: '62%', size: 'h-2.5 w-2.5', delay: '0.5s' },
            { left: '72%', top: '70%', size: 'h-1.5 w-1.5', delay: '2s' },
            { left: '45%', top: '12%', size: 'h-1 w-1', delay: '1.8s' },
          ].map((b, i) => (
            <span
              key={i}
              className={`island-bubble-drift absolute rounded-full ${bubbleColor} ${b.size}`}
              style={{ left: b.left, top: b.top, animationDelay: b.delay }}
            />
          ))}
        </>
      )}
    </div>
  );
};
