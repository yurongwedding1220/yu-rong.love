import React, { useMemo } from 'react';
import { useScrollJourney } from '../../hooks/ScrollJourneyContext';
import { depthFade } from '../../utils/scrollDepthMath';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import {
  getDepthCaption,
  getDuskLayerOpacity,
  getGalleryLayerOpacity,
  getGalleryPaletteAtDepth,
  galleryPaletteGradient,
} from '../../utils/galleryDepthPalette';

const LINE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const SeaweedSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 200" className={className} aria-hidden>
    <path d="M35 200 Q30 140 38 95 T42 20" {...LINE} stroke="#3d8b6e" strokeWidth="2" />
    <path d="M55 200 Q48 130 52 80 T58 35" {...LINE} stroke="#2d6a4f" strokeWidth="1.8" />
    <path d="M72 200 Q78 150 70 100 T68 45" {...LINE} stroke="#40916c" strokeWidth="1.6" />
    <path d="M48 160 Q62 150 58 138" {...LINE} stroke="#52b788" strokeWidth="1.2" opacity="0.7" />
    <path d="M40 110 Q55 100 50 88" {...LINE} stroke="#52b788" strokeWidth="1.2" opacity="0.7" />
  </svg>
);

const FishSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 16" className={className} aria-hidden>
    <path d="M4 8h16" {...LINE} />
    <path d="M20 6l6 2-6 2" {...LINE} />
    <circle cx="10" cy="8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const CoralSvg: React.FC = () => (
  <svg className="h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet" aria-hidden>
    <path d="M40 120 Q45 80 55 55 T60 20" {...LINE} strokeWidth="2" />
    <path d="M55 120 Q60 85 70 60 T75 30" {...LINE} />
    <path d="M120 120 Q115 75 125 45 T130 15" {...LINE} strokeWidth="2" />
    <path d="M135 120 Q140 90 148 65" {...LINE} />
    <path d="M200 120 Q195 70 205 40 T210 10" {...LINE} strokeWidth="2" />
    <path d="M280 120 Q275 80 285 50 T290 25" {...LINE} strokeWidth="2" />
    <path d="M295 120 Q300 95 308 70" {...LINE} />
    <path d="M350 120 Q345 75 355 48 T360 18" {...LINE} strokeWidth="2" />
    <ellipse cx="60" cy="95" rx="12" ry="8" {...LINE} strokeWidth="1.2" opacity="0.6" />
    <ellipse cx="210" cy="100" rx="14" ry="9" {...LINE} strokeWidth="1.2" opacity="0.6" />
    <ellipse cx="355" cy="92" rx="11" ry="7" {...LINE} strokeWidth="1.2" opacity="0.6" />
  </svg>
);

export const IslandDepthJourney: React.FC = () => {
  const { depth } = useScrollJourney();
  const lite = isLowPerf(usePerfMode());

  const galleryPalette = useMemo(() => getGalleryPaletteAtDepth(depth), [depth]);
  const galleryOp = getGalleryLayerOpacity(depth);
  const duskOp = getDuskLayerOpacity(depth);

  const layerFadeOut = 1 - depthFade(depth, 0.42, 0.54);

  const submergeOp = depthFade(depth, 0.42, 0.52) * (1 - depthFade(depth, 0.52, 0.6));
  const deepOp = depthFade(depth, 0.54, 0.92);
  const raysOp = galleryOp * 0.35 * (1 - depthFade(depth, 0.54, 0.64)) * layerFadeOut;

  const contentCalm = depthFade(depth, 0.54, 0.68);
  const decorFadeOut = 1 - depthFade(depth, 0.6, 0.74);

  const seaweedOp = depthFade(depth, 0.5, 0.6) * decorFadeOut;
  const fishOp = depthFade(depth, 0.56, 0.66) * decorFadeOut;
  const coralOp = depthFade(depth, 0.62, 0.74) * decorFadeOut * 0.5;

  const caption = useMemo(() => getDepthCaption(depth), [depth]);

  return (
    <>
      <div className="island-depth-journey" aria-hidden>
        <div className="island-depth-layer island-depth-deep" style={{ opacity: deepOp }} />

        <div
          className="island-depth-layer island-depth-gallery"
          style={{
            opacity: galleryOp,
            background: galleryPaletteGradient(galleryPalette),
          }}
        />

        <div className="island-depth-layer island-depth-dusk" style={{ opacity: duskOp * 0.85 }} />
        <div className="island-depth-sun island-depth-sun--dusk" style={{ opacity: duskOp }} />

        <div className="island-depth-layer island-depth-submerge" style={{ opacity: submergeOp * 0.9 }} />

        <div className="island-depth-layer island-depth-rays" style={{ opacity: raysOp }} />

        <div
          className="island-depth-layer island-depth-content-calm"
          style={{ opacity: contentCalm * 0.82 }}
        />

        {!lite && (
          <>
            <div className="island-depth-seaweed island-depth-seaweed--left" style={{ opacity: seaweedOp }}>
              <SeaweedSvg className="h-full w-full" />
            </div>
            <div className="island-depth-seaweed island-depth-seaweed--right" style={{ opacity: seaweedOp * 0.85 }}>
              <SeaweedSvg className="h-full w-full" />
            </div>

            <div className="island-depth-fish island-depth-fish--slow" style={{ opacity: fishOp, top: '38%', left: 0, width: '2rem' }}>
              <FishSvg className="h-4 w-8" />
            </div>
            <div className="island-depth-fish" style={{ opacity: fishOp * 0.8, top: '52%', left: 0, width: '1.75rem', animationDelay: '-8s' }}>
              <FishSvg className="h-3.5 w-7" />
            </div>
            <div className="island-depth-fish island-depth-fish--fast" style={{ opacity: fishOp * 0.65, top: '64%', left: 0, width: '1.5rem', animationDelay: '-14s' }}>
              <FishSvg className="h-3 w-6" />
            </div>

            <div className="island-depth-coral" style={{ opacity: coralOp }}>
              <CoralSvg />
            </div>
          </>
        )}

        {lite && (
          <>
            <div className="island-depth-seaweed island-depth-seaweed--left" style={{ opacity: seaweedOp * 0.7 }}>
              <SeaweedSvg className="h-full w-full" />
            </div>
            <div className="island-depth-coral" style={{ opacity: coralOp * 0.8 }}>
              <CoralSvg />
            </div>
          </>
        )}
      </div>

      {depth >= 0.04 && (
        <div className="island-depth-caption pointer-events-none fixed inset-x-0 z-30 flex justify-center" aria-hidden>
          <p className="island-depth-caption__text font-serif text-[11px] tracking-[0.28em] text-white/55 md:text-xs">
            {caption}
          </p>
        </div>
      )}
    </>
  );
};
