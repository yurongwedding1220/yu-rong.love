import React from 'react';
import { motion } from 'framer-motion';

type VoyageSectionHeaderProps = {
  chapter: string;
  title: string;
  intro?: string;
  align?: 'center' | 'left';
  animate?: boolean;
  className?: string;
};

export const VoyageSectionHeader: React.FC<VoyageSectionHeaderProps> = ({
  chapter,
  title,
  intro,
  align = 'center',
  animate = true,
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-center md:text-left';

  const ornamentAlign =
    align === 'left' ? 'island-ornament island-ornament--left' : 'island-ornament';

  const body = (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <p className="island-section-label">{chapter}</p>
      <div className={ornamentAlign} aria-hidden>
        <span className="island-ornament__mark">✦</span>
      </div>
      <h2 className="island-heading font-serif text-4xl font-light tracking-wide text-[#1A3344] md:text-5xl">
        {title}
      </h2>
      {intro && (
        <p
          className={`island-prose mt-4 ${align === 'center' ? 'mx-auto max-w-md' : 'max-w-md'}`}
        >
          {intro}
        </p>
      )}
    </div>
  );

  if (!animate) return body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.div>
  );
};
