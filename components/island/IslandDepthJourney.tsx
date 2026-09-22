import React, { useMemo } from 'react';
import { useScrollJourney } from '../../hooks/ScrollJourneyContext';
import { depthFade } from '../../utils/scrollDepthMath';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import {
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
  <svg viewBox="0 0 40 20" className={className} aria-hidden>
    {/* 魚身剪影 */}
    <path
      d="M4 10 C8 6 16 5 24 7.5 C28 8.5 32 9.5 35 10 C32 10.5 28 11.5 24 12.5 C16 15 8 14 4 10 Z"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 尾鰭 */}
    <path d="M35 10 L39 6.5 M35 10 L39 13.5" {...LINE} strokeWidth="1.4" />
    {/* 背鰭 */}
    <path d="M16 7.5 Q19 4.5 22 7" {...LINE} strokeWidth="1.2" opacity="0.75" />
    <circle cx="11" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

type DepthBubbleSpec = {
  side: 'left' | 'right';
  inset: string;
  size: string;
  duration: number;
  delay: number;
  drift: number;
  romantic?: boolean;
};

/** 兩側緩升泡泡 — 入水後伴隨航程 */
const DEPTH_SIDE_BUBBLES: DepthBubbleSpec[] = [
  { side: 'left', inset: '4%', size: '0.5rem', duration: 18, delay: 0, drift: 4 },
  { side: 'left', inset: '7%', size: '0.75rem', duration: 24, delay: -6, drift: -3, romantic: true },
  { side: 'left', inset: '2.5%', size: '0.35rem', duration: 14, delay: -11, drift: 2 },
  { side: 'left', inset: '5.5%', size: '0.55rem', duration: 20, delay: -15, drift: 5, romantic: true },
  { side: 'right', inset: '3.5%', size: '0.6rem', duration: 19, delay: -2, drift: -4 },
  { side: 'right', inset: '6%', size: '0.4rem', duration: 16, delay: -8, drift: 3 },
  { side: 'right', inset: '2%', size: '0.8rem', duration: 26, delay: -13, drift: -5, romantic: true },
  { side: 'right', inset: '5%', size: '0.45rem', duration: 21, delay: -17, drift: 2 },
];

const DepthSideBubbles: React.FC<{ opacity: number; animate: boolean; compact?: boolean }> = ({
  opacity,
  animate,
  compact = false,
}) => {
  const bubbles = compact
    ? DEPTH_SIDE_BUBBLES.filter((_, i) => i % 2 === 0)
    : DEPTH_SIDE_BUBBLES;

  return (
  <div className="island-depth-bubbles" style={{ opacity }}>
    {bubbles.map((b, i) => (
      <span
        key={`${b.side}-${i}`}
        className={`island-depth-bubble island-depth-bubble--${b.side} ${
          b.romantic ? 'island-depth-bubble--romantic' : ''
        } ${animate ? 'island-depth-bubble--rise' : ''}`}
        style={{
          ['--bubble-inset' as string]: b.inset,
          ['--bubble-drift' as string]: `${b.drift}px`,
          width: b.size,
          height: b.size,
          animationDuration: `${b.duration}s`,
          animationDelay: `${b.delay}s`,
        }}
      />
    ))}
  </div>
  );
};

const CoralSvg: React.FC = () => (
  <svg className="h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet" aria-hidden>
    <g fill="rgba(232,168,124,0.22)" stroke="#e8a87c" strokeWidth="1.8">
      <path d="M40 120 Q45 80 55 55 T60 20" fill="rgba(232,168,124,0.18)" />
      <path d="M55 120 Q60 85 70 60 T75 30" />
      <path d="M120 120 Q115 75 125 45 T130 15" fill="rgba(232,168,124,0.2)" />
      <path d="M135 120 Q140 90 148 65" />
      <path d="M200 120 Q195 70 205 40 T210 10" fill="rgba(244,180,140,0.24)" strokeWidth="2" />
      <path d="M280 120 Q275 80 285 50 T290 25" fill="rgba(232,168,124,0.2)" />
      <path d="M295 120 Q300 95 308 70" />
      <path d="M350 120 Q345 75 355 48 T360 18" fill="rgba(232,168,124,0.18)" />
    </g>
    <ellipse cx="60" cy="95" rx="12" ry="8" fill="rgba(232,168,124,0.35)" stroke="#f0b892" strokeWidth="1.2" />
    <ellipse cx="210" cy="100" rx="14" ry="9" fill="rgba(244,180,140,0.4)" stroke="#f0b892" strokeWidth="1.2" />
    <ellipse cx="355" cy="92" rx="11" ry="7" fill="rgba(232,168,124,0.35)" stroke="#f0b892" strokeWidth="1.2" />
  </svg>
);

export const IslandDepthJourney: React.FC = () => {
  const { depth } = useScrollJourney();
  const perf = usePerfMode();
  const lite = isLowPerf(perf);
  const mediumOnly = perf === 'medium';

  const galleryPalette = useMemo(() => getGalleryPaletteAtDepth(depth), [depth]);
  const galleryOp = getGalleryLayerOpacity(depth);
  const duskOp = getDuskLayerOpacity(depth);

  const layerFadeOut = 1 - depthFade(depth, 0.42, 0.54);

  const submergeOp = depthFade(depth, 0.42, 0.52) * (1 - depthFade(depth, 0.52, 0.6));
  const deepOp = depthFade(depth, 0.54, 0.92);
  const raysOp = galleryOp * 0.35 * (1 - depthFade(depth, 0.54, 0.64)) * layerFadeOut;

  const contentCalm = depthFade(depth, 0.54, 0.68);
  /* 裝飾從入水過場出現，一路伴隨到頁面最底 */
  const decorIn = depthFade(depth, 0.44, 0.56);

  const seaweedOp = decorIn;
  const fishOp = depthFade(depth, 0.48, 0.56);
  const coralOp = depthFade(depth, 0.5, 0.6);
  const bubbleOp = depthFade(depth, 0.45, 0.53);

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

      </div>

      <div className="island-depth-decor" aria-hidden>
        <DepthSideBubbles opacity={bubbleOp} animate={!lite} compact={mediumOnly} />

        {!lite && (
          <>
            <div className="island-depth-seaweed island-depth-seaweed--left" style={{ opacity: seaweedOp }}>
              <SeaweedSvg className="h-full w-full" />
            </div>
            {!mediumOnly && (
              <div className="island-depth-seaweed island-depth-seaweed--right" style={{ opacity: seaweedOp * 0.85 }}>
                <SeaweedSvg className="h-full w-full" />
              </div>
            )}

            <div className="island-depth-fish island-depth-fish--slow" style={{ opacity: fishOp, top: '38%', left: 0, width: '2rem' }}>
              <FishSvg className="h-4 w-8" />
            </div>
            {!mediumOnly && (
              <>
                <div className="island-depth-fish" style={{ opacity: fishOp * 0.8, top: '52%', left: 0, width: '1.75rem', animationDelay: '-8s' }}>
                  <FishSvg className="h-3.5 w-7" />
                </div>
                <div className="island-depth-fish island-depth-fish--fast" style={{ opacity: fishOp * 0.65, top: '64%', left: 0, width: '1.5rem', animationDelay: '-14s' }}>
                  <FishSvg className="h-3 w-6" />
                </div>
              </>
            )}
            <div
              className="island-depth-fish island-depth-fish--slow"
              style={{ opacity: fishOp * 0.5, top: '46%', left: 0, width: '1.25rem', animationDelay: '-22s' }}
            >
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
            <div className="island-depth-coral" style={{ opacity: coralOp * 0.85 }}>
              <CoralSvg />
            </div>
          </>
        )}
      </div>

    </>
  );
};
