import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { HeroOceanScene } from './HeroOceanScene';
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

  const sandMix = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [0, 0.1, 0.42, 0.72]);
  const beachGlow = useTransform(scrollYProgress, [0.55, 0.92, 1], [0, 0.3, 0.5]);
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.7],
    [0, lite ? -8 : perf === 'medium' ? -12 : -32]
  );
  const contentFade = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 1, lite ? 0.5 : 0.35]
  );

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
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#e8d5bc]/15 to-[#F4E8D8]"
          style={{ opacity: sandMix }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#F4E8D8]/50 via-[#E8D5BC]/12 to-transparent"
          style={{ opacity: beachGlow }}
          aria-hidden
        />

        <motion.div
          className="island-hero-type relative z-10 flex h-full flex-col px-6 text-center"
          style={{ y: contentY, opacity: contentFade }}
        >
          <div className="mx-auto w-full max-w-lg pt-[clamp(3rem,11vh,5.5rem)] md:max-w-xl md:pt-[clamp(3.5rem,12vh,6rem)]">
            <motion.p
              initial={lite ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="island-hero-type__label mb-3 font-display text-[10px] tracking-[0.42em] md:text-xs"
            >
              WEDDING INVITATION
            </motion.p>

            <motion.h1
              initial={lite ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="island-hero-type__title font-serif text-[2.9rem] font-light tracking-[0.06em] md:text-6xl"
            >
              Yu <span className="font-script text-[1.12em]">&</span> Rong
            </motion.h1>

            <motion.p
              initial={lite ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="island-hero-type__subtitle mt-2 font-serif text-xl md:text-xl"
            >
              {APP_CONTENT.chineseNames}
            </motion.p>

            <motion.p
              initial={lite ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="island-hero-type__intro island-heading-pretty mx-auto mt-5 max-w-[18rem] font-serif text-[0.9375rem] leading-[1.9] md:max-w-xs md:text-[0.95rem]"
            >
              {APP_CONTENT.intro}
            </motion.p>
          </div>

          <motion.div
            initial={lite ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52 }}
            className="island-hero-type__sea-meta pointer-events-none absolute inset-x-0 z-10 px-6 text-center"
          >
            <p className="island-hero-type__date font-display text-xs tracking-[0.28em] md:text-xs">
              {APP_CONTENT.date}
            </p>
            <p className="island-hero-type__date mt-1.5 font-serif text-[0.9375rem] md:text-[0.95rem]">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </motion.div>

          <div className="flex-1" aria-hidden />

          <motion.div
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mx-auto pb-[clamp(4.5rem,12vh,6.5rem)]"
          >
            {!lite && (
              <motion.div
                animate={{ opacity: [0.4, 0.75, 0.4], y: [0, 5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-8"
              >
                <span className="island-hero-type__scroll block text-[10px] tracking-[0.32em]">SCROLL</span>
                <div className="island-hero-type__scroll-line mx-auto mt-2 h-7 w-px" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
