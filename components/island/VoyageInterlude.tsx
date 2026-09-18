import React from 'react';
import { motion } from 'framer-motion';
import { VOYAGE_NARRATIVE } from '../../constants';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

export const VoyageInterlude: React.FC = () => {
  const lite = isLowPerf(usePerfMode());

  const content = (
    <div className="mx-auto max-w-lg px-6 text-center">
      <p className="island-section-label mb-3">{VOYAGE_NARRATIVE.interludeChapter}</p>
      <h2 className="font-serif text-2xl text-[#1A3344] md:text-3xl">
        {VOYAGE_NARRATIVE.interludeTitle}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#5A7380]">
        {VOYAGE_NARRATIVE.interludeBody}
      </p>
      <div className="mx-auto mt-8 flex flex-col items-center gap-2 opacity-50" aria-hidden>
        <div className="h-8 w-px bg-gradient-to-b from-[#3A8FB7]/60 to-transparent" />
        <span className="font-display text-[9px] tracking-[0.35em] text-[#3A8FB7]">SCROLL</span>
      </div>
    </div>
  );

  if (lite) {
    return (
      <section className="border-y border-[#3A8FB7]/10 bg-[#F4E8D8]/60 py-14 md:py-16">
        {content}
      </section>
    );
  }

  return (
    <section className="border-y border-[#3A8FB7]/10 bg-[#F4E8D8]/60 py-14 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6 }}
      >
        {content}
      </motion.div>
    </section>
  );
};
