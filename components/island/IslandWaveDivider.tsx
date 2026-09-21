import React from 'react';
import { motion } from 'framer-motion';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

type IslandWaveDividerProps = {
  /** 浪線填色（銜接上一區底色或下一區頂色） */
  fill?: string;
  /** 下方漸層目標色 */
  toColor?: string;
  className?: string;
  animate?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 章節接縫浪線：淡入 + 輕微上移；lite 靜態。
 */
export const IslandWaveDivider: React.FC<IslandWaveDividerProps> = ({
  fill = '#F4E8D8',
  toColor = '#F4E8D8',
  className = '',
  animate,
}) => {
  const perf = usePerfMode();
  const shouldAnimate = animate ?? !isLowPerf(perf);

  const body = (
    <div className={`island-wave-divider relative w-full overflow-hidden ${className}`} aria-hidden>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${toColor} 100%)`,
        }}
      />
      <svg
        className="island-wave-divider__svg relative z-[1] block h-10 w-full md:h-12"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path
          fill={fill}
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
