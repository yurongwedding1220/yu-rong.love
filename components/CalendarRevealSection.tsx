import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { APP_CONTENT, CALENDAR_COVER_IMAGE } from '../constants';
import { usePerfMode, isLowPerf, isHighPerf } from '../hooks/usePerfMode';
import { useCalendarScrollLock } from '../hooks/useCalendarScrollLock';

const REVEAL_COMPLETE = 0.99;

/** December 2026: 1st is Tuesday → 2 empty slots. Wedding day = 20 */
const CalendarBase = ({ pulseHeart }: { pulseHeart: boolean }) => {
  const emptyDays = 2;
  const totalDays = 31;
  const days: (number | null)[] = [];
  for (let i = 0; i < emptyDays; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--island-paper)] p-5 md:p-8">
      <div className="absolute top-2 left-0 right-0 z-20 flex justify-evenly px-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-[#eaddcf] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
          />
        ))}
      </div>

      <div className="relative z-10 mt-6 mb-4 flex items-baseline justify-between text-[#1B4D6E]">
        <div className="island-tabular flex items-baseline gap-2">
          <span className="font-serif text-5xl leading-none font-light">12</span>
          <span className="font-serif text-2xl font-light opacity-90">/ 20</span>
        </div>
        <span className="island-tabular font-serif text-sm tracking-[0.2em]">2026</span>
      </div>

      <div className="relative z-10 mb-4 h-px w-full bg-[#3A8FB7]/15" />

      <div className="relative z-10 mb-3 grid grid-cols-7 text-center">
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <span key={d} className="font-serif text-xs font-medium text-[#3A8FB7] md:text-sm">
            {d}
          </span>
        ))}
      </div>

      <div className="island-tabular relative z-10 grid grid-cols-7 gap-x-1 gap-y-3 text-center font-serif text-[#5A7380]">
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const isWedding = d === 20;
          return (
            <div key={i} className="flex items-center justify-center">
              {isWedding ? (
                <div className="relative flex h-7 w-7 items-center justify-center md:h-8 md:w-8">
                  {pulseHeart ? (
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 text-[#E8A87C]"
                    >
                      <HeartSvg />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 text-[#E8A87C]">
                      <HeartSvg />
                    </div>
                  )}
                  <span className="relative z-10 pb-[1px] text-[10px] font-bold leading-none text-white">
                    {d}
                  </span>
                </div>
              ) : (
                <span className="text-[0.9375rem] font-medium text-[#5A7380] md:text-sm">{d}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mt-auto pt-2 text-center">
        <span className="font-display text-[8px] uppercase tracking-[0.3em] text-[#3A8FB7] md:text-[9px]">
          The Wedding Day
        </span>
      </div>
    </div>
  );
};

const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CalendarCover = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[#0f3550]">
    {/* 實心底，確保不透出底下月曆 */}
    <div className="absolute inset-0 bg-[#0f3550]" aria-hidden />

    {CALENDAR_COVER_IMAGE ? (
      <img
        src={`${import.meta.env.BASE_URL}${CALENDAR_COVER_IMAGE}`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        draggable={false}
      />
    ) : (
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0f3550] via-[#1B4D6E] to-[#3A8FB7]"
        aria-hidden
      />
    )}

    {/* 封面專用活頁孔（與內頁風格一致，避免透出底下孔洞錯位） */}
    <div className="absolute top-2 left-0 right-0 z-20 flex justify-evenly px-6" aria-hidden>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-3 w-3 rounded-full bg-[#0a2a40] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.35)] ring-1 ring-white/15"
        />
      ))}
    </div>

    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center">
      <p className="font-display text-[10px] tracking-[0.4em] text-white/70">DECEMBER</p>
      <p className="mt-4 font-serif text-4xl font-light tracking-[0.06em] text-white md:text-[2.75rem]">
        Yu <span className="font-script text-[1.12em] text-white/95">&</span> Rong
      </p>
      <div className="my-5 h-px w-14 bg-[#E8A87C]/80" aria-hidden />
      <p className="font-serif text-base tracking-wide text-white/90">{APP_CONTENT.date}</p>
      <p className="mt-3 font-display text-[10px] tracking-[0.32em] text-[#E8A87C]">
        SAVE THE DATE
      </p>
    </div>
  </div>
);

/** Low-end: 靜態月曆，輕觸揭開封面 */
const SimpleCalendar = ({ onRevealed }: { onRevealed: () => void }) => {
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    setRevealed(true);
    onRevealed();
  };

  return (
    <div className="island-calendar-card island-card--elevated island-card--sea relative mx-auto aspect-[3/4.2] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#3A8FB7]/15 bg-[var(--island-paper)]">
      <CalendarBase pulseHeart={false} />
      {!revealed && (
        <button
          type="button"
          onClick={reveal}
          className="island-focus absolute inset-0 z-30 overflow-hidden rounded-xl shadow-lg"
          aria-label="揭開月曆封面"
        >
          <CalendarCover />
          <span className="absolute inset-x-0 bottom-5 text-center font-display text-[10px] tracking-[0.28em] text-white/80">
            輕觸揭開
          </span>
        </button>
      )}
    </div>
  );
};

/** Medium: 上滑揭開封面 — 無 3D 翻頁 */
const PeelRevealCalendar = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [18, 0]);
  const coverY = useTransform(scrollYProgress, [0.12, REVEAL_COMPLETE], ['0%', '-108%']);
  const coverRotate = useTransform(scrollYProgress, [0.12, REVEAL_COMPLETE], [0, -6]);
  const coverOpacity = useTransform(scrollYProgress, [0.88, REVEAL_COMPLETE], [1, 0]);

  return (
    <div className="mx-auto aspect-[3/4.2] w-full max-w-[320px]">
      <motion.div style={{ scale, y }} className="relative h-full w-full overflow-hidden rounded-xl">
        <div className="island-calendar-card island-card--elevated island-card--sea absolute inset-0 overflow-hidden rounded-xl border border-[#3A8FB7]/15 bg-[var(--island-paper)]">
          <CalendarBase pulseHeart />
        </div>
        <motion.div
          style={{
            y: coverY,
            rotate: coverRotate,
            opacity: coverOpacity,
            transformOrigin: 'bottom center',
          }}
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl shadow-xl"
        >
          <CalendarCover />
        </motion.div>
      </motion.div>
    </div>
  );
};

const FlippingCalendar = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0.18, REVEAL_COMPLETE], [0, 175]);
  const coverOpacity = useTransform(scrollYProgress, [0.85, REVEAL_COMPLETE], [1, 0]);

  return (
    <div className="perspective-[1600px] mx-auto aspect-[3/4.2] w-full max-w-[340px]">
      <motion.div
        style={{ scale, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <div className="absolute inset-0 origin-bottom rounded-[6px] bg-[var(--island-paper)]">
          <CalendarBase pulseHeart />
        </div>

        <motion.div
          style={{
            rotateX,
            opacity: coverOpacity,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 20,
          }}
          className="absolute inset-0 rounded-[6px] transform-gpu will-change-transform"
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[6px] backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <CalendarCover />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[6px] border border-[#3A8FB7]/15 bg-[var(--island-paper-muted)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg) translateZ(0.5px)',
            }}
          >
            <div
              className="relative z-10 flex flex-col items-center opacity-40"
              style={{ transform: 'scaleY(-1)' }}
            >
              <span className="font-display text-5xl tracking-widest text-[#3A8FB7]">Y & R</span>
              <div className="my-4 h-px w-16 bg-[#3A8FB7]" />
              <span className="font-serif text-sm italic text-[#3A8FB7]">靠岸</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const CalendarRevealHint: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <p className="island-calendar-reveal-hint pointer-events-none mt-5 text-center font-display text-[10px] tracking-[0.28em] text-[#3A8FB7]/80 md:text-xs">
      上滑揭開月曆
    </p>
  );
};

export const CalendarRevealSection: React.FC = () => {
  const perf = usePerfMode();
  const lite = isLowPerf(perf);
  const containerRef = useRef<HTMLDivElement>(null);
  const [manualRevealed, setManualRevealed] = useState(false);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    /* 月曆進入視窗中段才翻頁，避免貼頂時看不到日期 */
    offset: ['start 0.82', 'end 0.18'],
  });

  useCalendarScrollLock({
    containerRef,
    scrollYProgress,
    completeThreshold: REVEAL_COMPLETE,
    enabled: !scrollUnlocked,
    manualUnlocked: lite ? manualRevealed : scrollUnlocked,
    onComplete: () => setScrollUnlocked(true),
  });

  const sectionHeight = lite
    ? 'h-[160vh]'
    : isHighPerf(perf)
      ? 'h-[210vh]'
      : 'h-[190vh]';

  const showHint = lite ? !manualRevealed : !scrollUnlocked;

  return (
    <div ref={containerRef} className={`relative ${sectionHeight} w-full bg-transparent`}>
      <div className="island-calendar-sticky sticky flex flex-col items-center justify-center overflow-visible py-6">
        <div className="relative z-10 w-full px-4 md:px-6">
          {lite ? (
            <SimpleCalendar onRevealed={() => setManualRevealed(true)} />
          ) : isHighPerf(perf) ? (
            <FlippingCalendar scrollYProgress={scrollYProgress} />
          ) : (
            <PeelRevealCalendar scrollYProgress={scrollYProgress} />
          )}
          <CalendarRevealHint visible={showHint} />
        </div>
      </div>
    </div>
  );
};
