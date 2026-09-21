import React from 'react';
import { motion } from 'framer-motion';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

const EASE = [0.22, 1, 0.36, 1] as const;

/** 靠岸後 → Timeline 前的入水儀式感過場 */
export const SubmergeGate: React.FC = () => {
  const lite = isLowPerf(usePerfMode());

  const body = (
    <>
      <div data-depth-value="0.52" className="island-depth-anchor" aria-hidden />
      <div className="island-submerge-gate pointer-events-none relative overflow-hidden py-10 md:py-14" aria-hidden>
        <div className="island-submerge-gate__ripple absolute inset-x-0 top-1/2 h-32 -translate-y-1/2 md:h-40" />
        <p className="relative z-[1] text-center font-serif text-sm tracking-[0.35em] text-white/70 md:text-base">
          緩緩潛入海中
        </p>
      </div>
    </>
  );

  if (lite) return body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {body}
    </motion.div>
  );
};
