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
    <path d="M30 6v28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M31 8c10 4 16 14 18 24H31V8Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M29 12c-7 5-11 12-12 20h12V12Z"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M12 36c4 5 12 7 20 7s16-2 20-7H12Z"
      fill="currentColor"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M30 6h8l-2 3 2 3H30V6Z" fill="var(--island-coral)" fillOpacity="0.95" />
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
      className="island-loading-screen fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 夕陽暖色 → 海面藍，與 Hero 無縫銜接 */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'linear-gradient(180deg, #f8c9a0 0%, #e8a87c 28%, #3a8fb7 72%, #1b4d6e 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #1b4d6e 0%, #134a62 45%, #0f3550 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% 110%, var(--island-shallow) 0%, transparent 58%)',
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute right-[14%] top-[12%] h-16 w-16 rounded-full md:h-20 md:w-20"
        initial={{ opacity: 0.9, scale: 0.92 }}
        animate={{ opacity: 0.15, scale: 1.08 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'radial-gradient(circle, #ffe8c8 0%, #e8a87c 55%, transparent 72%)',
          boxShadow: '0 0 60px 20px rgba(232, 168, 124, 0.3)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[
          { left: '15%', bottom: '22%', size: 'h-2 w-2', delay: '0s' },
          { left: '72%', bottom: '28%', size: 'h-1.5 w-1.5', delay: '1s' },
          { left: '40%', bottom: '18%', size: 'h-2.5 w-2.5', delay: '0.6s' },
          { left: '88%', bottom: '35%', size: 'h-1 w-1', delay: '1.8s' },
        ].map((b, i) => (
          <span
            key={i}
            className={`island-bubble-drift absolute rounded-full bg-white/20 ${b.size}`}
            style={{ left: b.left, bottom: b.bottom, animationDelay: b.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 font-display text-[10px] tracking-[0.45em] text-white/70"
        >
          {VOYAGE_NARRATIVE.loadingHint}
        </motion.p>

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

          <svg
            className="h-5 w-full overflow-visible text-[var(--island-shallow)]/55"
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
            className="h-full rounded-full bg-gradient-to-r from-[var(--island-shallow)] via-white/80 to-[var(--island-coral)]/90 transition-[width] duration-300 ease-out"
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
