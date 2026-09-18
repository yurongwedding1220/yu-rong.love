import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { WaveLayers } from './WaveLayers';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

export const IslandScrollHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const perf = usePerfMode();
  const lite = isLowPerf(perf);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const sandMix = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 0.15, 0.85, 1]);
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

  const sectionHeight =
    perf === 'low' ? 'h-[160vh]' : perf === 'medium' ? 'h-[185vh]' : 'h-[200vh] md:h-[220vh]';

  return (
    <section ref={containerRef} className={`relative ${sectionHeight}`}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f3550] via-[#1B4D6E] to-[#3A8FB7]" />

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5e4f0]/40 to-[#F4E8D8] will-change-transform"
          style={{ opacity: sandMix }}
        />

        <WaveLayers progress={scrollYProgress} mode={perf} />

        {!lite && (
          <div
            className={`pointer-events-none absolute -top-16 right-[-8%] rounded-full bg-[#E8A87C]/20 ${
              perf === 'medium' ? 'h-[24vh] w-[24vh]' : 'h-[32vh] w-[32vh]'
            }`}
            style={{ filter: perf === 'medium' ? 'blur(32px)' : 'blur(48px)' }}
            aria-hidden
          />
        )}

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-transform"
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
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
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
