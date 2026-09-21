import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONTENT, VOYAGE_NARRATIVE } from '../constants';

interface LoadingScreenProps {
  progress: number;
  isMobile: boolean;
  onComplete: () => void;
}

/** 簡約線稿小帆船 */
const SailboatSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    {/* mast */}
    <path d="M30 6v28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* mainsail */}
    <path
      d="M31 8c10 4 16 14 18 24H31V8Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* jib */}
    <path
      d="M29 12c-7 5-11 12-12 20h12V12Z"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* hull */}
    <path
      d="M12 36c4 5 12 7 20 7s16-2 20-7H12Z"
      fill="currentColor"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* flag */}
    <path d="M30 6h8l-2 3 2 3H30V6Z" fill="#E8A87C" fillOpacity="0.95" />
  </svg>
);

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  onComplete,
}) => {
  const isLoaded = progress >= 100;
  const clamped = Math.min(Math.max(progress, 0), 100);

  React.useEffect(() => {
    if (!isLoaded) return;
    const t = window.setTimeout(onComplete, 480);
    return () => window.clearTimeout(t);
  }, [isLoaded, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeOut' } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1B4D6E]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% 110%, #7EC8E3 0%, transparent 58%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 font-display text-[10px] tracking-[0.45em] text-white/70"
        >
          {VOYAGE_NARRATIVE.loadingHint}
        </motion.p>

        {/* 航道：小帆船隨進度駛入 */}
        <div className="relative mb-8 w-full max-w-[16rem]" aria-hidden>
          <div className="relative h-14 w-full">
            <motion.div
              className="absolute bottom-2 text-white"
              style={{
                left: `calc(${clamped}% - 1.75rem)`,
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SailboatSvg className="h-11 w-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]" />
            </motion.div>
          </div>

          {/* 波浪線 */}
          <svg
            className="h-5 w-full overflow-visible text-[#7EC8E3]/55"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <motion.g
              animate={{ x: [0, -25] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            >
              <path
                d="M0 10 Q 12.5 4 25 10 T 50 10 T 75 10 T 100 10 T 125 10 T 150 10 T 175 10 T 200 10 T 225 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.g>
            <motion.g
              animate={{ x: [0, -25] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
            >
              <path
                d="M0 14 Q 12.5 9 25 14 T 50 14 T 75 14 T 100 14 T 125 14 T 150 14 T 175 14 T 200 14 T 225 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-serif text-3xl font-light text-white md:text-4xl"
        >
          {APP_CONTENT.coupleName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 font-serif text-base text-white/85"
        >
          {APP_CONTENT.chineseNames}
        </motion.p>

        <div className="mt-10 h-px w-44 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7EC8E3] via-white/80 to-[#E8A87C]/90 transition-[width] duration-300 ease-out"
            style={{ width: `${clamped}%` }}
          />
        </div>
        <p className="mt-3 font-display text-[10px] tracking-[0.3em] text-white/50">
          {Math.round(clamped)}%
        </p>
      </div>
    </motion.div>
  );
};
