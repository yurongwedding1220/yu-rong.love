import React from 'react';
import { motion } from 'framer-motion';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import { WaveBubbles } from './IslandSeaMotifs';

export type WaveDividerPreset = 'surface' | 'shallow' | 'descent' | 'underwater' | 'abyss';

const WAVE_PRESETS: Record<WaveDividerPreset, { fill: string; toColor: string }> = {
  surface: {
    fill: 'rgba(244, 232, 216, 0.55)',
    toColor: 'rgba(244, 232, 216, 0.35)',
  },
  shallow: {
    fill: 'rgba(58, 143, 183, 0.28)',
    toColor: 'rgba(244, 232, 216, 0.4)',
  },
  descent: {
    fill: 'rgba(244, 232, 216, 0.5)',
    toColor: 'rgba(58, 143, 183, 0.32)',
  },
  underwater: {
    fill: 'rgba(15, 53, 80, 0.55)',
    toColor: 'rgba(10, 36, 56, 0.45)',
  },
  abyss: {
    fill: 'rgba(10, 36, 56, 0.6)',
    toColor: 'rgba(8, 28, 44, 0.55)',
  },
};

type IslandWaveDividerProps = {
  /** 浪線填色（銜接上一區底色或下一區頂色） */
  fill?: string;
  /** 下方漸層目標色 */
  toColor?: string;
  /** 預設色階；未傳 fill/toColor 時使用 */
  preset?: WaveDividerPreset;
  className?: string;
  animate?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 章節接縫浪線：淡入 + 輕微上移；lite 靜態。
 */
export const IslandWaveDivider: React.FC<IslandWaveDividerProps> = ({
  fill,
  toColor,
  preset = 'surface',
  className = '',
  animate,
}) => {
  const perf = usePerfMode();
  const lite = isLowPerf(perf);
  const shouldAnimate = animate ?? !lite;
  const colors = WAVE_PRESETS[preset];
  const waveFill = fill ?? colors.fill;
  const waveTo = toColor ?? colors.toColor;

  const body = (
    <div className={`island-wave-divider relative w-full overflow-hidden ${className}`} aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${waveTo} 100%)`,
        }}
      />
      {!lite && preset !== 'descent' && preset !== 'underwater' && preset !== 'abyss' && (
        <WaveBubbles className="island-wave-divider__bubbles h-full w-full" />
      )}
      <svg
        className="island-wave-divider__svg relative z-[1] block h-10 w-full md:h-12"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path
          fill={waveFill}
          d="M0,32 C200,58 400,8 600,28 C800,48 1000,12 1200,30 C1320,42 1380,24 1440,34 L1440,60 L0,60 Z"
        />
      </svg>
    </div>
  );

  if (!shouldAnimate) return body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {body}
    </motion.div>
  );
};
