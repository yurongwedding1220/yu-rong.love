import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONTENT, VOYAGE_NARRATIVE } from '../constants';

interface LoadingScreenProps {
  progress: number;
  isMobile: boolean;
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  onComplete,
}) => {
  const isLoaded = progress >= 100;

  React.useEffect(() => {
    if (!isLoaded) return;
    const t = window.setTimeout(onComplete, 380);
    return () => window.clearTimeout(t);
  }, [isLoaded, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1B4D6E]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, #7EC8E3 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-display text-[10px] tracking-[0.45em] text-white/65"
        >
          {VOYAGE_NARRATIVE.loadingHint}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl font-light text-white md:text-4xl"
        >
          {APP_CONTENT.coupleName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-2 font-serif text-base text-white/85"
        >
          {APP_CONTENT.chineseNames}
        </motion.p>

        <div className="mt-10 h-px w-44 overflow-hidden rounded bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-[#7EC8E3] to-white/90 transition-[width] duration-150 ease-linear"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-white/50">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </motion.div>
  );
};
