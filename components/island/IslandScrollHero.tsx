import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { HeroOceanScene } from './HeroOceanScene';
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

  const sandMix = useTransform(scrollYProgress, [0, 0.45, 0.72, 1], [0, 0.08, 0.38, 0.68]);
  const beachGlow = useTransform(scrollYProgress, [0.5, 0.9, 1], [0, 0.25, 0.42]);
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
        <HeroOceanScene progress={scrollYProgress} lite={lite} perf={perf} />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#c5e4f0]/20 to-[#F4E8D8]"
          style={{ opacity: sandMix }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#F4E8D8]/55 via-[#E8D5BC]/18 to-transparent"
          style={{ opacity: beachGlow }}
          aria-hidden
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
          <div className="island-hero-copy max-w-lg rounded-3xl px-6 py-8 md:max-w-xl md:px-10 md:py-10">
          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="island-hero-copy__label mb-4 font-display text-[10px] tracking-[0.4em] md:text-xs"
          >
            WEDDING INVITATION
          </motion.p>

          <motion.h1
            initial={lite ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="island-hero-copy__title font-serif text-4xl font-light tracking-[0.08em] md:text-6xl"
          >
            Yu{' '}
            <span className="font-script text-[1.15em]">&</span>{' '}
            Rong
          </motion.h1>

          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="island-hero-copy__subtitle mt-3 font-serif text-lg md:text-xl"
          >
            {APP_CONTENT.chineseNames}
          </motion.p>

          <motion.p
            initial={lite ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="island-hero-copy__intro island-heading-pretty mt-8 font-serif text-sm leading-[1.9] tracking-wide md:text-base"
          >
            {APP_CONTENT.intro}
          </motion.p>

          <motion.div
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="island-hero-copy__meta mt-10 flex flex-col items-center gap-1"
          >
            <p className="font-display text-xs tracking-[0.25em]">
              {APP_CONTENT.date}
            </p>
            <p className="font-serif text-sm">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </motion.div>
          </div>

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
