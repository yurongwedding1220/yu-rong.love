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
  isMobile,
  onComplete,
}) => {
  const isLoaded = progress >= 100;

  React.useEffect(() => {
    if (!isLoaded) return;
    const t = window.setTimeout(onComplete, 480);
    return () => window.clearTimeout(t);
  }, [isLoaded, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      style={{ willChange: isMobile ? 'opacity' : 'auto' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1B4D6E] via-[#3A8FB7] to-[#F4E8D8]"
    >
      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[18%] left-[-10%] h-[30vh] w-[120%] rounded-[100%] bg-[#7EC8E3]/40 blur-2xl"
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 font-display text-[10px] tracking-[0.4em] text-white/70">
          WEDDING INVITATION
        </p>
        <h1 className="font-serif text-3xl font-light text-white md:text-4xl">
          {APP_CONTENT.coupleName}
        </h1>
        <p className="mt-2 font-serif text-base text-white/85">{APP_CONTENT.chineseNames}</p>

        <div className="mt-10 h-px w-40 overflow-hidden rounded bg-white/25">
          <motion.div
            className="h-full bg-white/90"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: 'linear', duration: 0.15 }}
          />
        </div>
        <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-white/60">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
    </motion.div>
  );
};
