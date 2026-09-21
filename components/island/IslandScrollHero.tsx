import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { WaveLayers } from './WaveLayers';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

/**
 * Sticky hero 用 svh（small viewport）鎖定高度，避免 Chrome 手機網址列
 * 收合時 dvh／vh 跳動 → sticky 區重排 → useScroll 進度跳針 → 海浪卡頓。
 */
export const IslandScrollHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const perf = usePerfMode();
  const lite = isLowPerf(perf);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const sandMix = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, 0, 0.35, 0.65]);
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.7],
    [0, lite ? -16 : perf === 'medium' ? -28 : -36]
  );
  const contentFade = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 1, lite ? 0.55 : 0.4]
  );
  const foamOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.85, 0.45, 0]);

  const sectionHeight =
    perf === 'low'
      ? 'h-[160svh]'
      : perf === 'medium'
        ? 'h-[185svh]'
        : 'h-[200svh] md:h-[220svh]';

  return (
    <section
      ref={containerRef}
      data-depth-phase="daylight"
      className={`island-scroll-hero relative ${sectionHeight}`}
    >
      <div className="island-scroll-hero__sticky sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* 白天晴空 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #B8E4F5 0%, #87CEEB 28%, rgba(126,200,227,0.15) 55%, transparent 72%)',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A9EC4] via-[#3A8FB7] to-[#7EC8E3] opacity-95" />

        {!lite && (
          <div
            className="pointer-events-none absolute right-[14%] top-[12%] h-12 w-12 rounded-full md:h-14 md:w-14"
            style={{
              background: 'radial-gradient(circle, #FFFEF5 0%, #FFEAA0 45%, transparent 72%)',
              boxShadow: '0 0 40px 14px rgba(255, 234, 160, 0.25)',
            }}
            aria-hidden
          />
        )}

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5e4f0]/25 to-[#F4E8D8]"
          style={{ opacity: sandMix }}
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[18%] h-16 md:h-20"
          style={{ opacity: foamOpacity }}
          aria-hidden
        >
          <div className="h-full bg-gradient-to-b from-white/40 to-transparent" />
          <svg className="absolute bottom-0 h-8 w-full" viewBox="0 0 1440 32" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.45)" d="M0,16 C240,4 480,28 720,14 C960,0 1200,24 1440,12 L1440,32 L0,32 Z" />
          </svg>
        </motion.div>

        <WaveLayers progress={scrollYProgress} mode={perf} />

        {!lite && (
          <>
            <span className="island-bubble-drift pointer-events-none absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white/25" style={{ animationDelay: '0s' }} aria-hidden />
            <span className="island-bubble-drift pointer-events-none absolute left-[78%] top-[30%] h-1.5 w-1.5 rounded-full bg-white/20" style={{ animationDelay: '1.4s' }} aria-hidden />
            <span className="island-bubble-drift pointer-events-none absolute left-[22%] top-[55%] h-2.5 w-2.5 rounded-full bg-[#7EC8E3]/35" style={{ animationDelay: '0.8s' }} aria-hidden />
            <span className="island-bubble-drift pointer-events-none absolute left-[65%] top-[48%] h-1 w-1 rounded-full bg-white/30" style={{ animationDelay: '2.1s' }} aria-hidden />
          </>
        )}

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ y: contentY, opacity: contentFade }}
        >
          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/80 md:text-xs"
          >
            WEDDING INVITATION
          </motion.p>

          <motion.h1
            initial={lite ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl font-light tracking-[0.08em] text-white md:text-6xl"
          >
            Yu{' '}
            <span className="font-script text-[1.15em] text-white/90">&</span>{' '}
            Rong
          </motion.h1>

          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-3 font-serif text-lg text-white/90 md:text-xl"
          >
            {APP_CONTENT.chineseNames}
          </motion.p>

          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="island-heading-pretty mt-8 max-w-md font-serif text-sm leading-[1.9] tracking-wide text-white/85 md:text-base"
          >
            {APP_CONTENT.intro}
          </motion.p>

          <motion.div
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-10 flex flex-col items-center gap-1"
          >
            <p className="font-display text-xs tracking-[0.25em] text-white/75">
              {APP_CONTENT.date}
            </p>
            <p className="font-serif text-sm text-white/80">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </motion.div>

          {!lite && (
            <motion.div
              animate={{ opacity: [0.45, 0.85, 0.45], y: [0, 6, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: 'max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom)))' }}
            >
              <span className="block text-[10px] tracking-[0.3em] text-white/70">SCROLL</span>
              <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
