import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { APP_CONTENT } from '../../constants';
import { RouteLine } from './RouteLine';
import { WaveLayers } from './WaveLayers';

export const IslandScrollHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const deepOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const seaOpacity = useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0, 1, 0]);
  const sandOpacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const contentFade = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 1, 0.35]);

  return (
    <section ref={containerRef} className="relative h-[220vh] md:h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layered sky / ocean / sand */}
        <motion.div
          className="absolute inset-0 bg-[#0f3550]"
          style={{ opacity: deepOpacity }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#1B4D6E] via-[#3A8FB7] to-[#7EC8E3]"
          style={{ opacity: seaOpacity }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#c5e4f0] via-[#e8d5bc] to-[#F4E8D8]"
          style={{ opacity: sandOpacity }}
        />

        <WaveLayers progress={scrollYProgress} />

        {/* Soft sun glow */}
        <div
          className="pointer-events-none absolute -top-20 right-[-10%] h-[40vh] w-[40vh] rounded-full bg-[#E8A87C]/25 blur-3xl"
          aria-hidden
        />

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ y: contentY, opacity: contentFade }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/80 md:text-xs"
          >
            WEDDING INVITATION
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif text-4xl font-light tracking-wide text-white drop-shadow-sm md:text-6xl"
          >
            {APP_CONTENT.coupleName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-3 font-serif text-lg text-white/90 md:text-xl"
          >
            {APP_CONTENT.chineseNames}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-8 max-w-md"
          >
            <RouteLine light className="mb-4 justify-center" />
            <p className="font-serif text-sm leading-relaxed text-white/85 md:text-base">
              {APP_CONTENT.quote}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-col items-center gap-1"
          >
            <p className="font-display text-xs tracking-[0.25em] text-white/75">
              {APP_CONTENT.date}
            </p>
            <p className="font-serif text-sm text-white/80">
              {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <span className="block text-[10px] tracking-[0.3em] text-white/60">
              SCROLL
            </span>
            <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
