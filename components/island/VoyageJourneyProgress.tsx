import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollJourney } from '../../hooks/ScrollJourneyContext';
import { getChapterAtDepth, VOYAGE_CHAPTERS } from '../../constants/voyageChapters';

type VoyageJourneyProgressProps = {
  visible: boolean;
};

export const VoyageJourneyProgress: React.FC<VoyageJourneyProgressProps> = ({ visible }) => {
  const { depth } = useScrollJourney();

  const { index, chapter, localProgress } = useMemo(
    () => getChapterAtDepth(depth),
    [depth]
  );

  const overallPct =
    ((index + localProgress) / (VOYAGE_CHAPTERS.length - 1)) * 100;

  return (
    <AnimatePresence>
      {visible && depth >= 0.12 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="island-journey-progress pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[max(0.5rem,env(safe-area-inset-top))]"
          aria-hidden
        >
          <div className="island-journey-progress__pill w-full max-w-md px-4 py-2.5 md:max-w-lg">
            <div className="flex items-center justify-between gap-3 text-[11px] tracking-wide md:text-xs">
              <span className="island-journey-progress__label font-display">
                第 {String(index + 1).padStart(2, '0')} 章
              </span>
              <span className="island-journey-progress__title font-serif">{chapter.label}</span>
              <span className="island-journey-progress__count font-display tabular-nums">
                {index + 1}/{VOYAGE_CHAPTERS.length}
              </span>
            </div>
            <div className="island-journey-progress__track mt-2 h-1 overflow-hidden rounded-full">
              <div
                className="island-journey-progress__fill h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
