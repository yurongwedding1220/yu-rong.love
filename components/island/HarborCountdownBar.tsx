import React from 'react';
import { APP_CONTENT, VOYAGE_NARRATIVE } from '../../constants';
import type { PerfMode } from '../../hooks/usePerfMode';

type HarborCountdownBarProps = {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  lite: boolean;
  perf: PerfMode;
};

const MarqueeSegment: React.FC<{
  timeLeft: HarborCountdownBarProps['timeLeft'];
}> = ({ timeLeft }) => (
  <span className="mx-8 inline-flex items-center gap-3 font-display">
    <span>{VOYAGE_NARRATIVE.countdownLabel}</span>
    <span>
      {String(timeLeft.days).padStart(2, '0')}天{' '}
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </span>
    <span className="text-[#E8A87C]" aria-hidden>
      ✦
    </span>
    <span>{APP_CONTENT.date}</span>
    <span className="text-[#E8A87C]" aria-hidden>
      ✦
    </span>
    <span>
      {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
    </span>
  </span>
);

export const HarborCountdownBar: React.FC<HarborCountdownBarProps> = ({
  timeLeft,
  lite,
  perf,
}) => (
  <div
    id="sticky-marquee"
    className="island-blur island-countdown-bar relative z-30 overflow-hidden border-b border-[#3A8FB7]/12 md:sticky md:top-0"
    aria-live="polite"
    aria-label={VOYAGE_NARRATIVE.countdownLabel}
  >
    {lite ? (
      <div className="island-tabular flex justify-center gap-3 px-4 py-2.5 text-center text-sm tracking-wider text-[#1B4D6E] font-display">
        <span>{VOYAGE_NARRATIVE.countdownLabel}</span>
        <span className="text-[#E8A87C]" aria-hidden>
          ✦
        </span>
        <span>{timeLeft.days} 天</span>
        <span className="text-[#E8A87C]" aria-hidden>
          ✦
        </span>
        <span>{APP_CONTENT.venueName}</span>
      </div>
    ) : (
      <div
        className={`island-marquee-track island-tabular flex w-max whitespace-nowrap py-2.5 text-sm tracking-[0.18em] text-[#1B4D6E] ${
          perf === 'medium'
            ? 'animate-[marquee_18s_linear_infinite]'
            : 'animate-[marquee_14s_linear_infinite]'
        }`}
      >
        {/* 兩組相同內容 + translateX(-50%) 才會無縫循環 */}
        <div className="flex shrink-0">
          <MarqueeSegment timeLeft={timeLeft} />
          <MarqueeSegment timeLeft={timeLeft} />
        </div>
        <div className="flex shrink-0" aria-hidden>
          <MarqueeSegment timeLeft={timeLeft} />
          <MarqueeSegment timeLeft={timeLeft} />
        </div>
      </div>
    )}
  </div>
);
