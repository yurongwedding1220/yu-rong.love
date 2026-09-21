import React from 'react';
import { VOYAGE_NARRATIVE } from '../../constants';
import { IslandSectionReveal } from './IslandSectionReveal';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

export const VoyageInterlude: React.FC = () => {
  const lite = isLowPerf(usePerfMode());

  return (
    <section className="border-y border-[#3A8FB7]/10 bg-[#F4E8D8]/60 py-14 md:py-16">
      <IslandSectionReveal animate={!lite}>
        <div className="mx-auto max-w-lg px-6 text-center">
          <p className="island-section-label">{VOYAGE_NARRATIVE.interludeChapter}</p>
          <div className="island-ornament" aria-hidden>
            <span className="island-ornament__mark">✦</span>
          </div>
          <h2 className="island-heading font-serif text-2xl font-light tracking-wide text-[#1A3344] md:text-3xl">
            {VOYAGE_NARRATIVE.interludeTitle}
          </h2>
          <p className="island-prose mt-4">
            {VOYAGE_NARRATIVE.interludeBody}
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center gap-2 opacity-50" aria-hidden>
            <div className="h-8 w-px bg-gradient-to-b from-[#3A8FB7]/60 to-transparent" />
            <span className="font-display text-[9px] tracking-[0.35em] text-[#3A8FB7]">SCROLL</span>
          </div>
        </div>
      </IslandSectionReveal>
    </section>
  );
};
