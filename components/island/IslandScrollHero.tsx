import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { RouteLine } from './RouteLine';
import { usePerfMode } from '../../hooks/usePerfMode';

/**
 * Hero uses plain CSS for the visible “first screen”.
 * Scroll-linked motion only nudges decorative waves — never hides the text.
 */
export const IslandScrollHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lite = usePerfMode() === 'low';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const waveY = useTransform(scrollYProgress, [0, 1], [0, lite ? -40 : -90]);

  return (
    <section
      ref={containerRef}
      className={`relative ${lite ? 'h-[130vh]' : 'h-[160vh] md:h-[180vh]'}`}
    >
      {/*
        Critical: min-height via vh (not only dvh), solid ocean bg on the sticky
        itself — so even if motion/layers fail, the first viewport is never blank sand.
      */}
      <div
        className="sticky top-0 flex min-h-[100vh] h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{
          background:
            'linear-gradient(180deg, #0f3550 0%, #1B4D6E 45%, #2a6f94 78%, #3A8FB7 100%)',
        }}
      >
        {/* Decorative waves — non-essential */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] overflow-hidden"
          style={{ y: waveY }}
          aria-hidden
        >
          <svg
            className="absolute bottom-[10%] left-[-6%] h-[24vh] w-[120%] opacity-45"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#1B4D6E"
              d="M0,192L80,176C160,160,320,128,480,133C640,138,800,180,960,186C1120,192,1280,160,1360,144L1440,128L1440,320L0,320Z"
            />
          </svg>
          <svg
            className="absolute bottom-0 left-0 h-[28vh] w-full opacity-80"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#7EC8E3"
              d="M0,224L60,208C120,192,240,160,360,154C480,149,600,171,720,186C840,202,960,210,1080,192C1200,174,1320,128,1380,106L1440,85L1440,320L0,320Z"
            />
          </svg>
        </motion.div>

        <div className="relative z-10 flex max-w-lg flex-col items-center">
          <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/85 md:text-xs">
            WEDDING INVITATION
          </p>

          <h1 className="font-serif text-4xl font-light tracking-wide text-white md:text-6xl">
            {APP_CONTENT.coupleName}
          </h1>

          <p className="mt-3 font-serif text-lg text-white md:text-xl">
            {APP_CONTENT.chineseNames}
          </p>

          <div className="mt-8">
            <RouteLine light className="mb-4" />
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
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
          <span className="block text-[10px] tracking-[0.3em] text-white/75">往下滑</span>
          <div className="mx-auto mt-2 h-7 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </div>
    </section>
  );
};
