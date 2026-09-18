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

  const body = (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <p className="island-section-label mb-2">{chapter}</p>
      <h2 className="font-serif text-3xl text-[#1A3344] md:text-4xl">{title}</h2>
      {intro && (
        <p className={`mt-3 text-sm leading-relaxed text-[#5A7380] ${align === 'center' ? 'mx-auto max-w-md' : 'max-w-md'}`}>
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
      transition={{ duration: 0.55 }}
    >
      {body}
    </motion.div>
  );
};
