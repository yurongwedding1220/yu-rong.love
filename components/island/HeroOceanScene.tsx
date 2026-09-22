import React from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { PerfMode } from '../../hooks/usePerfMode';

type HeroOceanSceneProps = {
  progress: MotionValue<number>;
  lite: boolean;
  perf: PerfMode;
};

const CloudSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 80" className={className} aria-hidden>
    <ellipse cx="68" cy="48" rx="42" ry="22" fill="rgba(255,255,255,0.82)" />
    <ellipse cx="108" cy="42" rx="36" ry="20" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="138" cy="50" rx="30" ry="18" fill="rgba(255,255,255,0.75)" />
    <ellipse cx="92" cy="54" rx="48" ry="16" fill="rgba(255,255,255,0.65)" />
  </svg>
);

const IslandSilhouette: React.FC = () => (
  <svg
    className="hero-ocean-scene__island-svg h-full w-full"
    viewBox="0 0 400 160"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden
  >
    <defs>
      <linearGradient id="hero-island-hill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3d8b6e" />
        <stop offset="55%" stopColor="#2d6a4f" />
        <stop offset="100%" stopColor="#1b4332" />
      </linearGradient>
      <linearGradient id="hero-island-shore" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f4e8d8" stopOpacity="0" />
        <stop offset="35%" stopColor="#faf3ea" />
        <stop offset="65%" stopColor="#faf3ea" />
        <stop offset="100%" stopColor="#f4e8d8" stopOpacity="0" />
      </linearGradient>
    </defs>

    <path
      d="M40,132 Q90,118 130,124 T200,120 T270,124 Q310,118 360,132 L360,160 L40,160 Z"
      fill="url(#hero-island-shore)"
      opacity="0.95"
    />
    <path
      d="M72,132 C95,78 128,52 168,48 C208,44 238,62 258,88 C278,68 310,58 332,78 C348,92 356,112 360,132 Z"
      fill="url(#hero-island-hill)"
    />
    <ellipse cx="142" cy="82" rx="28" ry="34" fill="#40916c" opacity="0.92" />
    <ellipse cx="178" cy="72" rx="34" ry="40" fill="#2d6a4f" />
    <ellipse cx="214" cy="80" rx="26" ry="32" fill="#52b788" opacity="0.9" />
    <ellipse cx="248" cy="88" rx="22" ry="28" fill="#40916c" opacity="0.85" />
    <path
      d="M196,58 L200,38 L204,58 Z"
      fill="#1b4332"
      opacity="0.7"
    />
    <path
      d="M220,66 L224,50 L228,66 Z"
      fill="#2d6a4f"
      opacity="0.65"
    />
  </svg>
);

const HorizonWaves: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="hero-ocean-scene__horizon-waves pointer-events-none absolute inset-x-[-6%] bottom-[34%] h-[14%]">
    <svg
      className={`absolute inset-0 h-full w-full opacity-55 ${animate ? 'hero-ocean-scene__wave-drift' : ''}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#1B4D6E"
        d="M0,72 C180,48 360,88 540,64 C720,40 900,80 1080,58 C1260,38 1380,68 1440,56 L1440,120 L0,120 Z"
      />
    </svg>
    <svg
      className={`absolute inset-0 h-full w-full opacity-70 ${animate ? 'hero-ocean-scene__wave-drift-slow' : ''}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#3A8FB7"
        d="M0,84 C200,62 400,96 600,74 C800,52 1000,88 1200,70 C1320,58 1380,78 1440,68 L1440,120 L0,120 Z"
      />
    </svg>
  </div>
);

/**
 * 開場遠景：純 SVG／CSS 藍天白雲、海平面、遠方小島。
 * 隨 Hero 捲動拉近，銜接後段沙灘／浅灣色調。無位圖，手機／桌機皆可。
 */
export const HeroOceanScene: React.FC<HeroOceanSceneProps> = ({ progress, lite, perf }) => {
  const animate = !lite && perf !== 'low';
  const vistaScale = useTransform(
    progress,
    [0, 0.5, 1],
    lite ? [1, 1.1, 1.2] : perf === 'medium' ? [1, 1.16, 1.32] : [1, 1.22, 1.45]
  );
  const vistaY = useTransform(progress, [0, 1], [0, lite ? 24 : perf === 'medium' ? 40 : 56]);
  const cloudOp = useTransform(progress, [0, 0.65, 1], [1, 0.9, 0.75]);
  const shallowMix = useTransform(progress, [0, 0.35, 0.72, 1], [0, 0.15, 0.34, 0.5]);
  const skyBright = useTransform(progress, [0, 0.85, 1], [1, 0.96, 0.88]);
  const islandLift = useTransform(progress, [0, 1], [0, lite ? 6 : 14]);

  return (
    <>
      <motion.div className="absolute inset-0" style={{ opacity: skyBright }} aria-hidden>
        <div className="hero-ocean-scene__sky absolute inset-0" />

        <div
          className="hero-ocean-scene__sun pointer-events-none absolute right-[18%] top-[10%] h-11 w-11 rounded-full md:right-[16%] md:top-[9%] md:h-14 md:w-14"
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: cloudOp }}
        >
          {lite ? (
            <>
              <CloudSvg className="absolute left-[8%] top-[10%] h-14 w-36 opacity-80" />
              <CloudSvg className="absolute right-[6%] top-[16%] h-12 w-32 scale-90 opacity-70" />
            </>
          ) : (
            <>
              <div className="hero-ocean-scene__cloud-drift absolute left-[-4%] top-[8%] h-16 w-40 opacity-85">
                <CloudSvg className="h-full w-full" />
              </div>
              <div
                className="hero-ocean-scene__cloud-drift hero-ocean-scene__cloud-drift--slow absolute right-[-2%] top-[14%] h-14 w-36 opacity-75"
              >
                <CloudSvg className="h-full w-full scale-90" />
              </div>
              <div
                className="hero-ocean-scene__cloud-drift hero-ocean-scene__cloud-drift--mid absolute left-[38%] top-[6%] h-12 w-32 opacity-60"
              >
                <CloudSvg className="h-full w-full scale-75" />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-ocean-scene__vista pointer-events-none absolute inset-0 origin-[50%_42%] overflow-hidden"
        style={{ scale: vistaScale, y: vistaY }}
        aria-hidden
      >
        <div className="hero-ocean-scene__ocean-deep absolute inset-x-0 bottom-0 top-[38%]" />
        <div className="hero-ocean-scene__ocean-mid absolute inset-x-0 bottom-0 top-[48%]" />

        <HorizonWaves animate={animate} />

        <div className="hero-ocean-scene__horizon-glow absolute inset-x-0 top-[36%] h-12" />

        <motion.div
          className="absolute left-1/2 w-[min(72vw,22rem)] -translate-x-1/2 md:w-[min(56vw,26rem)]"
          style={{ bottom: 'calc(34% - 0.5rem)', y: islandLift }}
        >
          <div className={animate ? 'hero-ocean-scene__island-bob' : undefined}>
            <IslandSilhouette />
          </div>
        </motion.div>

        <motion.div
          className="hero-ocean-scene__shallow absolute inset-x-0 bottom-0 h-[48%]"
          style={{ opacity: shallowMix }}
        />
      </motion.div>

      <div className="hero-ocean-scene__vignette pointer-events-none absolute inset-0" aria-hidden />
    </>
  );
};

/** Loading 用靜態版，與 Hero 視覺一致、無捲動依賴 */
export const HeroOceanSceneStatic: React.FC<{ lite?: boolean }> = ({ lite = false }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <div className="hero-ocean-scene__sky absolute inset-0" />
    <div className="hero-ocean-scene__sun absolute right-[18%] top-[10%] h-11 w-11 rounded-full md:h-14 md:w-14" />
    {!lite && (
      <>
        <CloudSvg className="absolute left-[10%] top-[10%] h-14 w-36 opacity-80" />
        <CloudSvg className="absolute right-[8%] top-[16%] h-12 w-32 opacity-70" />
      </>
    )}
    <div className="hero-ocean-scene__ocean-deep absolute inset-x-0 bottom-0 top-[38%]" />
    <div className="hero-ocean-scene__ocean-mid absolute inset-x-0 bottom-0 top-[48%]" />
    <HorizonWaves animate={false} />
    <div className="hero-ocean-scene__horizon-glow absolute inset-x-0 top-[36%] h-12" />
    <div className="absolute bottom-[calc(34%-0.5rem)] left-1/2 w-[min(68vw,20rem)] -translate-x-1/2">
      <IslandSilhouette />
    </div>
    <div className="hero-ocean-scene__vignette absolute inset-0" />
  </div>
);
