import React from 'react';
import { VOYAGE_NARRATIVE } from '../../constants';
import { IslandSectionReveal } from './IslandSectionReveal';
import { IslandOrnament } from './IslandOrnament';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

export const VoyageInterlude: React.FC = () => {
  const lite = isLowPerf(usePerfMode());

  return (
    <section
      data-depth-phase="surface"
      className="island-section-surface island-voyage-shore relative overflow-hidden py-14 md:py-16"
    >
      {!lite && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F4E8D8]/35 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-60"
            aria-hidden
          >
            <svg className="h-full w-full" viewBox="0 0 1440 48" preserveAspectRatio="none">
              <path
                fill="rgba(255,255,255,0.35)"
                d="M0,24 C240,8 480,40 720,22 C960,4 1200,36 1440,18 L1440,48 L0,48 Z"
              />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--island-shallow)]/40 to-transparent"
            aria-hidden
          />
        </>
      )}
      <IslandSectionReveal animate={!lite}>
        <div className="relative mx-auto max-w-lg px-6 text-center">
          <p className="island-section-label">{VOYAGE_NARRATIVE.interludeChapter}</p>
          <IslandOrnament seed="interlude" motif="compass" />
          <h2 className="island-heading font-serif text-2xl font-light tracking-wide md:text-3xl">
            {VOYAGE_NARRATIVE.interludeTitle}
          </h2>
          <p className="island-prose mt-4">
            {VOYAGE_NARRATIVE.interludeBody}
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center gap-2 opacity-50" aria-hidden>
            <div className="h-8 w-px bg-gradient-to-b from-[var(--island-sea)]/60 to-transparent" />
            <span className="island-nautical-coords">啟程，海風在前 · SCROLL</span>
          </div>
        </div>
      </IslandSectionReveal>
    </section>
  );
};
