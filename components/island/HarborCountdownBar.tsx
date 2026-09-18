import React from 'react';
import { APP_CONTENT, VOYAGE_NARRATIVE } from '../../constants';
import type { PerfMode } from '../../hooks/usePerfMode';

type HarborCountdownBarProps = {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  lite: boolean;
  perf: PerfMode;
};

export const HarborCountdownBar: React.FC<HarborCountdownBarProps> = ({
  timeLeft,
  lite,
  perf,
}) => (
  <div
    id="sticky-marquee"
    className="island-blur sticky top-0 z-30 overflow-hidden border-b border-[#3A8FB7]/15"
  >
    {lite ? (
      <div className="flex justify-center gap-3 px-4 py-2.5 text-center text-xs tracking-wider text-[#1B4D6E] font-display">
        <span>{VOYAGE_NARRATIVE.countdownLabel}</span>
        <span className="text-[#E8A87C]">✦</span>
        <span>{timeLeft.days} 天</span>
        <span className="text-[#E8A87C]">✦</span>
        <span>{APP_CONTENT.venueName}</span>
      </div>
    ) : (
      <div
        className={`flex whitespace-nowrap py-2.5 text-xs tracking-widest text-[#1B4D6E] ${
          perf === 'medium'
            ? 'animate-[marquee_48s_linear_infinite]'
            : 'animate-[marquee_36s_linear_infinite]'
        }`}
      >
        {Array.from({ length: perf === 'medium' ? 3 : 4 }).map((_, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-3 font-display">
            <span>{VOYAGE_NARRATIVE.countdownLabel}</span>
            <span>
              {String(timeLeft.days).padStart(2, '0')}天{' '}
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[#E8A87C]">✦</span>
            <span>{APP_CONTENT.date}</span>
            <span className="text-[#E8A87C]">✦</span>
            <span>
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </span>
          </span>
        ))}
      </div>
    )}
  </div>
);
