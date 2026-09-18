import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { RouteLine } from './RouteLine';
import { WaveLayers } from './WaveLayers';
import { usePerfMode } from '../../hooks/usePerfMode';

export const IslandScrollHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const perf = usePerfMode();
  const lite = perf === 'low';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // One composite layer opacity instead of three competing full-screen fades
  const sandMix = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 0.15, 0.85, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, lite ? -16 : -36]);
  const contentFade = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, lite ? 0.55 : 0.4]);

  return (
    <section
      ref={containerRef}
      className={`relative ${lite ? 'h-[160vh]' : 'h-[200vh] md:h-[220vh]'}`}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Base ocean — static paint, GPU-cheap */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f3550] via-[#1B4D6E] to-[#3A8FB7]" />

        {/* Sand wash overlays as single opacity channel */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c5e4f0]/40 to-[#F4E8D8] will-change-transform"
          style={{ opacity: sandMix }}
        />

        <WaveLayers progress={scrollYProgress} lite={lite} />

        {!lite && (
          <div
            className="pointer-events-none absolute -top-16 right-[-8%] h-[32vh] w-[32vh] rounded-full bg-[#E8A87C]/20"
            style={{ filter: 'blur(48px)' }}
            aria-hidden
          />
        )}

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-transform"
          style={{ y: contentY, opacity: contentFade }}
        >
          <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/80 md:text-xs">
            WEDDING INVITATION
          </p>

          <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-6xl">
            {APP_CONTENT.coupleName}
          </h1>

          <p className="mt-3 font-serif text-lg text-white/90 md:text-xl">
            {APP_CONTENT.chineseNames}
          </p>

          <div className="mt-8 max-w-md">
            <RouteLine light className="mb-4 justify-center" />
            <p className="font-serif text-sm leading-relaxed text-white/85 md:text-base">
              {APP_CONTENT.quote}
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-1">
            <p className="font-display text-xs tracking-[0.25em] text-white/75">
              {APP_CONTENT.date}
            </p>
            <p className="font-serif text-sm text-white/80">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-60">
            <span className="block text-[10px] tracking-[0.3em] text-white/70">SCROLL</span>
            <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
