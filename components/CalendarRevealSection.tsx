import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { APP_CONTENT, CALENDAR_COVER_IMAGE } from '../constants';

/** December 2026: 1st is Tuesday → 2 empty slots (Sun, Mon). Wedding day = 20 */
const CalendarBase = () => {
  const emptyDays = 2;
  const totalDays = 31;
  const days: (number | null)[] = [];
  for (let i = 0; i < emptyDays; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#fcfaf7] p-5 shadow-inner md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40" />

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
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 text-[#E8A87C] drop-shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.div>
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

const CalendarCover = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[2px] border-[0.5px] border-white/20 bg-[#1B4D6E]">
    <div className="absolute inset-0">
      {CALENDAR_COVER_IMAGE ? (
        <img
          src={CALENDAR_COVER_IMAGE}
          alt="Our Story"
          className="h-full w-full object-cover object-center"
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
    <div className="absolute top-2 left-0 right-0 z-20 flex justify-evenly px-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-3 w-3 rounded-full bg-[#0f3550] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
        />
      ))}
    </div>
  </div>
);

const FlippingCalendar = ({
  scrollYProgress,
  isMobile,
}: {
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}) => {
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0.5, 1]);
  const rotateX = useTransform(scrollYProgress, [0.35, 0.7], isMobile ? [0, 0] : [0, 175]);
  const scaleY = useTransform(scrollYProgress, [0.35, 0.5, 0.7], [1, 0.9, 1]);
  const z = useTransform(scrollYProgress, [0.35, 0.5, 0.7], isMobile ? [0, 0, 0] : [0, 60, 0]);
  const sheenOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6], [0, 0.6, 0]);
  const sheenPosition = useTransform(scrollYProgress, [0.35, 0.65], ['100%', '-20%']);
  const spineShadowOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 0.4, 0]);
  const dropShadowOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0.5, 0]);
  const dropShadowBlur = useTransform(scrollYProgress, [0.35, 0.5], [10, 60]);
  const coverOpacity = useTransform(scrollYProgress, [0.35, 0.55], isMobile ? [1, 0] : [1, 1]);

  return (
    <div className={`${isMobile ? '' : 'perspective-[2000px]'} mx-auto aspect-[3/4.2] w-full max-w-[340px]`}>
      <motion.div
        style={{
          scale,
          opacity,
          transformStyle: isMobile ? 'flat' : 'preserve-3d',
          willChange: isMobile ? 'transform, opacity' : 'auto',
        }}
        className="relative h-full w-full"
      >
        <div
          className="absolute inset-0 rounded-[6px] border border-stone-200 bg-[#f8f6f0]"
          style={{ transform: isMobile ? 'none' : 'translateZ(-2px) translateY(3px) translateX(2px)' }}
        />
        <motion.div
          className="absolute inset-0 origin-bottom rounded-[6px] bg-[#fdfbf7]"
          style={{
            transform: 'translateZ(0px)',
            boxShadow: useTransform(dropShadowBlur, (b) => `0px 25px ${b}px rgba(0,0,0,0.2)`),
          }}
        >
          <CalendarBase />
          <motion.div
            style={{ opacity: dropShadowOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[6px] bg-gradient-to-t from-black/50 to-transparent"
          />
        </motion.div>

        <motion.div
          style={{
            rotateX,
            scaleY,
            z,
            opacity: coverOpacity,
            transformOrigin: 'top center',
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            zIndex: 20,
          }}
          className={`absolute inset-0 rounded-[6px] ${isMobile ? '' : 'transform-gpu'}`}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[6px] bg-stone-900 backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <CalendarCover />
            <motion.div
              style={{
                opacity: sheenOpacity,
                background:
                  'linear-gradient(to top, transparent 0%, rgba(255,255,255,0.0) 20%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.0) 80%, transparent 100%)',
                backgroundSize: '100% 200%',
                backgroundPositionY: sheenPosition,
              }}
              className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay"
            />
            <motion.div
              style={{ opacity: spineShadowOpacity }}
              className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent"
            />
          </motion.div>

          <div
            className="absolute inset-0 flex items-center justify-center rounded-[6px] border border-stone-200 bg-[#f4f1ea]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg) translateZ(0.5px)',
            }}
          >
            <div className="relative z-10 flex flex-col items-center opacity-40" style={{ transform: 'scaleY(-1)' }}>
              <span className="font-display text-5xl tracking-widest text-[#3A8FB7]">Y & R</span>
              <div className="my-4 h-px w-16 bg-[#3A8FB7]" />
              <span className="font-serif text-sm italic text-[#3A8FB7]">Island Route</span>
            </div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute -top-4 left-0 right-0 z-50 flex justify-evenly px-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative h-10 w-4 perspective-[100px]">
              <div
                className="absolute top-0 h-full w-full rounded-full border-[4px] border-stone-400 border-b-transparent"
                style={{ transform: 'rotateX(15deg) translateZ(-5px)' }}
              />
              <div
                className="absolute top-0 h-full w-full rounded-full border-[4px] border-stone-200 border-b-transparent shadow-sm"
                style={{ transform: 'rotateX(-5deg)' }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const CalendarRevealSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-transparent">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full px-6">
          <FlippingCalendar scrollYProgress={scrollYProgress} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};
