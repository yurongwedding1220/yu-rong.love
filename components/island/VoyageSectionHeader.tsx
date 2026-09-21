import React from 'react';
import { motion } from 'framer-motion';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import { IslandOrnament } from './IslandOrnament';

type VoyageSectionHeaderProps = {
  chapter: string;
  title: string;
  intro?: string;
  align?: 'center' | 'left';
  animate?: boolean;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export const VoyageSectionHeader: React.FC<VoyageSectionHeaderProps> = ({
  chapter,
  title,
  intro,
  align = 'center',
  animate = true,
  className = '',
}) => {
  const perf = usePerfMode();
  const shouldAnimate = animate && !isLowPerf(perf);
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-center md:text-left';

  const ornament = (
    <IslandOrnament seed={`${chapter}-${title}`} align={align} />
  );

  const body = (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {shouldAnimate ? (
        <>
          <motion.p
            className="island-section-label"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {chapter}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
          >
            {ornament}
          </motion.div>
          <motion.h2
            className="island-heading font-serif text-3xl font-light tracking-wide md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          >
            {title}
          </motion.h2>
          {intro && (
            <motion.p
              className={`island-prose mt-4 ${align === 'center' ? 'mx-auto max-w-md' : 'max-w-md'}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
            >
              {intro}
            </motion.p>
          )}
        </>
      ) : (
        <>
          <p className="island-section-label">{chapter}</p>
          {ornament}
          <h2 className="island-heading font-serif text-3xl font-light tracking-wide md:text-5xl">
            {title}
          </h2>
          {intro && (
            <p
              className={`island-prose mt-4 ${align === 'center' ? 'mx-auto max-w-md' : 'max-w-md'}`}
            >
              {intro}
            </p>
          )}
        </>
      )}
    </div>
  );

  return body;
};
