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

  // Keep ocean readable under white text; only soft sand near the end
  const sandMix = useTransform(scrollYProgress, [0, 0.55, 0.9, 1], [0, 0.08, 0.35, 0.55]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, lite ? -12 : -28]);
  // Stay fully opaque while sticky — avoid “blank” fade
  const contentFade = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.92]);

  return (
    <section
      ref={containerRef}
      className={`relative ${lite ? 'h-[140vh]' : 'h-[180vh] md:h-[200vh]'}`}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Stay in deep→mid ocean so white text always has contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f3550] via-[#1B4D6E] to-[#2a6f94]" />

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3A8FB7]/25 to-[#7EC8E3]/50 will-change-transform"
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
          <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/85 md:text-xs">
            WEDDING INVITATION
          </p>

          <h1 className="font-serif text-4xl font-light tracking-wide text-white drop-shadow-sm md:text-6xl">
            {APP_CONTENT.coupleName}
          </h1>

          <p className="mt-3 font-serif text-lg text-white md:text-xl">
            {APP_CONTENT.chineseNames}
          </p>

          <div className="mt-8 max-w-md">
            <RouteLine light className="mb-4 justify-center" />
            <p className="font-serif text-sm leading-relaxed text-white/90 md:text-base">
              {APP_CONTENT.quote}
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-1">
            <p className="font-display text-xs tracking-[0.25em] text-white/85">
              {APP_CONTENT.date}
            </p>
            <p className="font-serif text-sm text-white/90">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-70">
            <span className="block text-[10px] tracking-[0.3em] text-white/80">往下看</span>
            <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
