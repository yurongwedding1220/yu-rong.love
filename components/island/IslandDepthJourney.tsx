import React, { useMemo } from 'react';
import { useScrollDepth, depthFade, depthPeak } from '../../hooks/useScrollDepth';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

const LINE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const DEPTH_CAPTIONS: { max: number; text: string }[] = [
  { max: 0.2, text: '望向夕陽海面' },
  { max: 0.4, text: '浪花輕撫沙灘' },
  { max: 0.54, text: '緩緩潛入海中' },
  { max: 0.76, text: '潛入清澈浅海' },
  { max: 1, text: '深海中有我們的約定' },
];

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

const FoamWaveSvg: React.FC = () => (
  <svg className="island-depth-foam__wave w-full" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden>
    <path
      fill="rgba(255,255,255,0.5)"
      d="M0,24 C180,8 360,40 540,22 C720,4 900,36 1080,20 C1260,6 1380,28 1440,18 L1440,48 L0,48 Z"
    />
    <path
      fill="rgba(255,255,255,0.25)"
      d="M0,32 C200,18 400,42 600,28 C800,14 1000,38 1200,24 C1320,16 1400,30 1440,26 L1440,48 L0,48 Z"
    />
  </svg>
);

/**
 * 全頁固定背景：捲動越深，從夕陽海面漸入水下世界。
 * 小島／靠岸段保留海面＋暖沙；入水從 depth≈0.46 才開始。
 */
export const IslandDepthJourney: React.FC = () => {
  const depth = useScrollDepth();
  const lite = isLowPerf(usePerfMode());

  /* 小島＋靠岸段結束後才淡出淺層（≈0.42–0.54） */
  const layerFadeOut = 1 - depthFade(depth, 0.42, 0.54);

  const sunsetOp = depthPeak(depth, 0.1, 0.2, 0.38) * layerFadeOut;
  const surfaceOp = depthPeak(depth, 0.05, 0.22, 0.5) * layerFadeOut;
  const shallowOp = depthFade(depth, 0.2, 0.46) * layerFadeOut;

  const beachBase = depthPeak(depth, 0.12, 0.28, 0.48);
  const beachWarm = depthFade(depth, 0.28, 0.38) * (1 - depthFade(depth, 0.4, 0.52));
  const beachOp = (beachBase + beachWarm * 0.8) * layerFadeOut;

  const warmOp = depthFade(depth, 0.27, 0.34) * (1 - depthFade(depth, 0.4, 0.54));
  const foamOp = depthPeak(depth, 0.18, 0.32, 0.54) * layerFadeOut;

  /* 入水過渡：靠岸後、Timeline 前（0.42–0.56） */
  const submergeOp = depthFade(depth, 0.42, 0.52) * (1 - depthFade(depth, 0.52, 0.6));

  const deepOp = depthFade(depth, 0.54, 0.92);
  const raysOp = (1 - depthFade(depth, 0.38, 0.58)) * shallowOp * (1 - depthFade(depth, 0.54, 0.64));

  const contentCalm = depthFade(depth, 0.54, 0.68);
  const decorFadeOut = 1 - depthFade(depth, 0.6, 0.74);

  /* 裝飾：入水後才出現，閱讀區再淡出 */
  const seaweedOp = depthFade(depth, 0.5, 0.6) * decorFadeOut;
  const fishOp = depthFade(depth, 0.56, 0.66) * decorFadeOut;
  const coralOp = depthFade(depth, 0.62, 0.74) * decorFadeOut * 0.5;

  const foamTop = `${Math.max(28, 52 - depth * 30)}vh`;

  const caption = useMemo(() => {
    const hit = DEPTH_CAPTIONS.find((c) => depth <= c.max);
    return hit?.text ?? DEPTH_CAPTIONS[DEPTH_CAPTIONS.length - 1].text;
  }, [depth]);

  return (
    <>
      <div className="island-depth-journey" aria-hidden>
        <div className="island-depth-layer island-depth-deep" style={{ opacity: deepOp }} />
        <div className="island-depth-layer island-depth-shallow" style={{ opacity: shallowOp * 0.85 }} />
        <div className="island-depth-layer island-depth-surface" style={{ opacity: surfaceOp * 0.9 }} />
        <div className="island-depth-layer island-depth-sunset" style={{ opacity: sunsetOp }} />

        <div className="island-depth-layer island-depth-warm" style={{ opacity: warmOp * 0.88 }} />
        <div className="island-depth-layer island-depth-submerge" style={{ opacity: submergeOp * 0.9 }} />

        <div
          className="island-depth-sun"
          style={{ opacity: Math.min(1, sunsetOp + warmOp * 0.35) }}
        />

        <div className="island-depth-layer island-depth-beach" style={{ opacity: beachOp }} />

        <div className="island-depth-foam" style={{ opacity: foamOp, top: foamTop }}>
          <FoamWaveSvg />
        </div>

        <div className="island-depth-layer island-depth-rays" style={{ opacity: raysOp }} />

        <div
          className="island-depth-layer island-depth-content-calm"
          style={{ opacity: contentCalm * 0.82 }}
        />

        {!lite && (
          <>
            <div
              className="island-depth-seaweed island-depth-seaweed--left"
              style={{ opacity: seaweedOp }}
            >
              <SeaweedSvg className="h-full w-full" />
            </div>
            <div
              className="island-depth-seaweed island-depth-seaweed--right"
              style={{ opacity: seaweedOp * 0.85 }}
            >
              <SeaweedSvg className="h-full w-full" />
            </div>

            <div
              className="island-depth-fish island-depth-fish--slow"
              style={{ opacity: fishOp, top: '38%', left: 0, width: '2rem' }}
            >
              <FishSvg className="h-4 w-8" />
            </div>
            <div
              className="island-depth-fish"
              style={{ opacity: fishOp * 0.8, top: '52%', left: 0, width: '1.75rem', animationDelay: '-8s' }}
            >
              <FishSvg className="h-3.5 w-7" />
            </div>
            <div
              className="island-depth-fish island-depth-fish--fast"
              style={{ opacity: fishOp * 0.65, top: '64%', left: 0, width: '1.5rem', animationDelay: '-14s' }}
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
            <div
              className="island-depth-seaweed island-depth-seaweed--left"
              style={{ opacity: seaweedOp * 0.7 }}
            >
              <SeaweedSvg className="h-full w-full" />
            </div>
            <div className="island-depth-coral" style={{ opacity: coralOp * 0.8 }}>
              <CoralSvg />
            </div>
          </>
        )}
      </div>

      {depth >= 0.04 && (
        <div
          className="island-depth-caption pointer-events-none fixed inset-x-0 z-30 flex justify-center"
          aria-hidden
        >
          <p className="island-depth-caption__text font-serif text-[11px] tracking-[0.28em] text-white/55 md:text-xs">
            {caption}
          </p>
        </div>
      )}
    </>
  );
};
