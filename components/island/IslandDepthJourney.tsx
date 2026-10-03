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

/** 海底珊瑚群 — 分枝剪影，避免與海草混淆 */
const CoralSvg: React.FC = () => (
  <svg className="h-full w-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet" aria-hidden>
    <defs>
      <linearGradient id="island-coral-fill" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#e8a87c" stopOpacity="0.42" />
        <stop offset="55%" stopColor="#f0b892" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#f4c4a0" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="island-coral-accent" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#e89b6a" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f4c4a0" stopOpacity="0.12" />
      </linearGradient>
    </defs>

    {/* 左簇：鹿角珊瑚 */}
    <g fill="url(#island-coral-fill)" stroke="#e8a87c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 120 C46 98 42 82 38 68 C34 54 28 48 22 42 C28 46 36 52 40 64 C42 72 44 88 48 120 Z" />
      <path d="M48 120 C50 96 54 78 58 62 C62 48 70 40 78 34 C70 38 62 46 58 58 C54 72 52 92 48 120 Z" />
      <path d="M48 120 C47 102 48 86 50 72 C52 58 50 46 46 34 C50 44 54 56 54 70 C54 86 52 102 48 120 Z" />
      <path
        d="M36 78 C30 72 24 70 18 68 C24 70 30 74 34 80"
        fill="none"
        stroke="#f0b892"
        strokeWidth="1.1"
        opacity="0.75"
      />
      <path
        d="M62 72 C68 66 76 62 84 58 C76 62 68 68 64 74"
        fill="none"
        stroke="#f0b892"
        strokeWidth="1.1"
        opacity="0.75"
      />
    </g>

    {/* 左中：扇形軟珊瑚 */}
    <g fill="url(#island-coral-accent)" stroke="#e89b6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M118 120 C116 104 112 92 108 82 C104 72 98 68 92 66 C100 68 108 74 112 84 C114 94 116 108 118 120 Z" />
      <path d="M118 120 C120 102 124 88 130 76 C136 64 146 56 156 52 C146 56 136 64 132 76 C126 90 122 106 118 120 Z" />
      <path d="M118 120 C119 106 122 94 126 84 C130 74 130 64 128 54 C130 64 132 74 130 86 C126 98 122 110 118 120 Z" />
      <ellipse cx="118" cy="108" rx="10" ry="5" fill="rgba(232,168,124,0.28)" stroke="none" />
    </g>

    {/* 中央偏後：較高枝 */}
    <g fill="url(#island-coral-fill)" stroke="#e8a87c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M198 120 C196 94 190 72 184 54 C178 36 168 28 158 24 C170 28 182 38 188 54 C192 70 196 94 198 120 Z" />
      <path d="M198 120 C200 92 206 68 214 48 C222 28 236 18 248 14 C234 20 222 30 216 48 C208 70 202 94 198 120 Z" />
      <path d="M198 120 C197 98 198 78 200 58 C202 40 198 26 192 14 C198 26 204 42 204 60 C204 80 202 100 198 120 Z" />
      <path
        d="M178 58 C170 50 160 46 150 44"
        fill="none"
        stroke="#f4c4a0"
        strokeWidth="1.05"
        opacity="0.7"
      />
      <path
        d="M220 50 C230 40 242 34 254 30"
        fill="none"
        stroke="#f4c4a0"
        strokeWidth="1.05"
        opacity="0.7"
      />
    </g>

    {/* 右中：矮叢 */}
    <g fill="url(#island-coral-accent)" stroke="#e89b6a" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M286 120 C284 106 280 96 274 88 C268 80 260 78 252 78 C262 78 272 84 278 94 C282 102 284 112 286 120 Z" />
      <path d="M286 120 C288 104 294 92 302 82 C310 72 322 66 332 64 C320 66 310 74 304 84 C296 96 290 108 286 120 Z" />
      <path d="M286 120 C287 108 290 98 294 90 C298 82 298 74 296 66 C298 74 300 84 298 94 C294 104 290 112 286 120 Z" />
      <ellipse cx="286" cy="110" rx="11" ry="5.5" fill="rgba(232,155,106,0.3)" stroke="none" />
    </g>

    {/* 最右：尖枝 */}
    <g fill="url(#island-coral-fill)" stroke="#e8a87c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M356 120 C354 100 348 84 342 70 C336 56 328 50 320 46 C330 50 340 58 344 70 C348 84 352 102 356 120 Z" />
      <path d="M356 120 C358 98 364 80 372 64 C380 48 392 40 400 36 C390 40 380 50 374 64 C366 82 360 100 356 120 Z" />
      <path d="M356 120 C355 104 356 88 358 74 C360 60 358 48 354 38 C358 48 362 60 362 76 C362 92 360 108 356 120 Z" />
    </g>

    {/* 底部礁石暗示 */}
    <path
      d="M20 120 Q60 112 100 118 Q160 108 210 116 Q270 106 330 118 Q360 112 390 120 L20 120 Z"
      fill="rgba(232,168,124,0.16)"
      stroke="none"
    />
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
