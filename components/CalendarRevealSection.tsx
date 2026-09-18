import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { APP_CONTENT, CALENDAR_COVER_IMAGE } from '../constants';
import { usePerfMode } from '../hooks/usePerfMode';

/** December 2026: 1st is Tuesday → 2 empty slots. Wedding day = 20 */
const CalendarBase = ({ pulseHeart }: { pulseHeart: boolean }) => {
  const emptyDays = 2;
  const totalDays = 31;
  const days: (number | null)[] = [];
  for (let i = 0; i < emptyDays; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#fcfaf7] p-5 shadow-inner md:p-8">
      <div className="absolute top-2 left-0 right-0 z-20 flex justify-evenly px-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-[#eaddcf] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
          />
        ))}
      </div>

      <div className="relative z-10 mt-6 mb-4 flex items-baseline justify-between text-[#1B4D6E]">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-5xl leading-none font-medium">12</span>
          <span className="font-serif text-2xl font-medium opacity-90">/ 20</span>
        </div>
        <span className="font-serif text-sm tracking-[0.2em]">2026</span>
      </div>

      <div className="relative z-10 mb-4 h-px w-full bg-stone-200" />

      <div className="relative z-10 mb-3 grid grid-cols-7 text-center">
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <span key={d} className="font-serif text-xs font-medium text-[#3A8FB7] md:text-sm">
            {d}
          </span>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-7 gap-x-1 gap-y-3 text-center font-serif text-stone-600">
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
                <span className="text-sm font-medium text-stone-600">{d}</span>
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
  <div className="relative h-full w-full overflow-hidden rounded-[2px] border-[0.5px] border-white/20 bg-[#1B4D6E]">
    <div className="absolute inset-0">
      {CALENDAR_COVER_IMAGE ? (
        <img
          src={CALENDAR_COVER_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-b from-[#1B4D6E] via-[#3A8FB7] to-[#F4E8D8]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
      <p className="font-display text-[10px] tracking-[0.35em] text-white/70">DECEMBER</p>
      <p className="mt-2 font-serif text-4xl">{APP_CONTENT.coupleName}</p>
      <p className="mt-3 text-sm text-white/80">{APP_CONTENT.date}</p>
    </div>
  </div>
);

/** Low-end: no scroll theatre — just show the calendar page */
const SimpleCalendar = () => (
  <div className="mx-auto w-full max-w-[320px] aspect-[3/4.2] overflow-hidden rounded-xl border border-[#3A8FB7]/20 bg-white shadow-md">
    <CalendarBase pulseHeart={false} />
  </div>
);

const FlippingCalendar = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.12], [0.6, 1]);
  const rotateX = useTransform(scrollYProgress, [0.35, 0.7], [0, 175]);
  const coverOpacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 1]);

  return (
    <div className="perspective-[1600px] mx-auto aspect-[3/4.2] w-full max-w-[340px]">
      <motion.div
        style={{ scale, opacity, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        <div className="absolute inset-0 origin-bottom rounded-[6px] bg-[#fdfbf7]">
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
            className="absolute inset-0 flex items-center justify-center rounded-[6px] border border-stone-200 bg-[#f4f1ea]"
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
              <span className="font-serif text-sm italic text-[#3A8FB7]">Island Route</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const CalendarRevealSection: React.FC<{ isMobile?: boolean }> = () => {
  const perf = usePerfMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  if (perf === 'low') {
    return (
      <div className="relative w-full bg-transparent py-16 md:py-20">
        <div className="w-full px-6">
          <SimpleCalendar />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[160vh] w-full bg-transparent">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full px-6">
          <FlippingCalendar scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
};
