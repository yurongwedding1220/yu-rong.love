import React from 'react';
import { motion } from 'framer-motion';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

type IslandSectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** 額外延遲（秒），用於同區 stagger */
  delay?: number;
  /** 覆寫是否動畫；預設依 perf */
  animate?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 章節區塊入場：只動 opacity + translateY，適合手機。
 * low perf / reduced-motion → 直出。
 */
export const IslandSectionReveal: React.FC<IslandSectionRevealProps> = ({
  children,
  className = '',
  delay = 0,
  animate,
}) => {
  const perf = usePerfMode();
  const shouldAnimate = animate ?? !isLowPerf(perf);

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};
