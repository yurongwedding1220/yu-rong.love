import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONTENT } from '../constants';

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
    const t = window.setTimeout(onComplete, 320);
    return () => window.clearTimeout(t);
  }, [isLoaded, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1B4D6E]"
    >
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/70">
          WEDDING INVITATION
        </p>
        <h1 className="font-serif text-3xl font-light text-white md:text-4xl">
          {APP_CONTENT.coupleName}
        </h1>
        <p className="mt-2 font-serif text-base text-white/85">{APP_CONTENT.chineseNames}</p>

        <div className="mt-10 h-px w-40 overflow-hidden rounded bg-white/25">
          <div
            className="h-full bg-white/90 transition-[width] duration-150 ease-linear"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-white/60">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </motion.div>
  );
};
