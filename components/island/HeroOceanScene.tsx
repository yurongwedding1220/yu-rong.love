import React, { useId } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { PerfMode } from '../../hooks/usePerfMode';

type HeroOceanSceneProps = {
  progress: MotionValue<number>;
  lite: boolean;
  perf: PerfMode;
};

const CloudSvg: React.FC<{ className?: string; variant?: 'cumulus' | 'wisp' }> = ({
  className,
  variant = 'cumulus',
}) => {
  const filterId = useId().replace(/:/g, '');

  if (variant === 'wisp') {
    return (
      <svg viewBox="0 0 240 64" className={className} aria-hidden>
        <ellipse cx="72" cy="36" rx="56" ry="10" fill="rgba(255,255,255,0.42)" />
        <ellipse cx="128" cy="32" rx="48" ry="8" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="178" cy="38" rx="40" ry="7" fill="rgba(255,255,255,0.28)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 88" className={className} aria-hidden>
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <ellipse cx="62" cy="52" rx="44" ry="20" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="98" cy="46" rx="38" ry="18" fill="rgba(255,255,255,0.72)" />
        <ellipse cx="132" cy="50" rx="32" ry="16" fill="rgba(255,255,255,0.62)" />
        <ellipse cx="86" cy="58" rx="52" ry="14" fill="rgba(255,255,255,0.48)" />
      </g>
    </svg>
  );
};

const IslandSilhouette: React.FC<{ idPrefix: string }> = ({ idPrefix }) => (
  <svg
    className="hero-ocean-scene__island-svg h-full w-full"
    viewBox="0 0 400 180"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden
  >
    <defs>
      <linearGradient id={`${idPrefix}-hill`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#52b788" />
        <stop offset="42%" stopColor="#2d6a4f" />
        <stop offset="100%" stopColor="#1b4332" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-hill-light`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#74c69d" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-shore`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#faf3ea" stopOpacity="0" />
        <stop offset="28%" stopColor="#faf3ea" />
        <stop offset="72%" stopColor="#f4e8d8" />
        <stop offset="100%" stopColor="#faf3ea" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="100%" r="55%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${idPrefix}-reflect`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    {/* 水面倒影 */}
    <ellipse
      cx="200"
      cy="148"
      rx="108"
      ry="10"
      fill="rgba(255,255,255,0.22)"
      filter={`url(#${idPrefix}-reflect)`}
    />

    {/* 沙灘 */}
    <path
      d="M52,142 C110,128 160,134 200,130 C240,126 290,128 348,142 L348,180 L52,180 Z"
      fill={`url(#${idPrefix}-shore)`}
    />

    {/* 主丘 */}
    <path
      d="M68,142 C88,96 128,68 168,62 C198,58 224,72 244,96 C268,76 302,66 332,88 C348,102 356,124 360,142 Z"
      fill={`url(#${idPrefix}-hill)`}
    />
    <path
      d="M108,142 C124,108 148,88 176,82 C192,80 206,88 218,104 C228,92 248,84 268,96 C280,106 286,122 290,142 Z"
      fill={`url(#${idPrefix}-hill-light)`}
    />

    {/* 樹冠 — 有機曲線取代圓形 */}
    <path
      d="M132,108 C118,88 128,72 146,74 C154,62 168,58 176,72 C188,64 202,66 208,80 C220,72 234,76 238,92 C246,84 258,88 262,102 C268,96 276,100 278,112 C262,118 248,122 232,120 C214,126 198,124 182,118 C164,124 148,120 132,108 Z"
      fill="#40916c"
      opacity="0.92"
    />
    <path
      d="M156,96 C148,82 158,70 172,72 C180,64 192,66 198,78 C206,72 218,74 222,86 C230,80 240,84 242,96 C234,100 224,104 212,102 C200,108 188,106 176,100 C168,104 160,102 156,96 Z"
      fill="#74c69d"
      opacity="0.55"
    />

    {/* 椰影 */}
    <path d="M198,78 C196,62 200,48 204,36 C208,48 206,62 204,78 Z" fill="#1b4332" opacity="0.75" />
    <path
      d="M204,40 C188,38 182,48 188,54 C194,50 200,46 204,40 Z"
      fill="#2d6a4f"
      opacity="0.8"
    />
    <path
      d="M204,40 C220,42 226,52 220,58 C214,54 208,48 204,40 Z"
      fill="#40916c"
      opacity="0.75"
    />

    {/* 水線光暈 */}
    <ellipse cx="200" cy="140" rx="96" ry="6" fill={`url(#${idPrefix}-glow)`} />
  </svg>
);

const HorizonWaves: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div className="hero-ocean-scene__horizon-waves pointer-events-none absolute inset-x-[-8%] bottom-[33%] h-[16%]">
    <svg
      className={`absolute inset-0 h-full w-full opacity-40 ${animate ? 'hero-ocean-scene__wave-drift' : ''}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#134a62"
        d="M0,78 C200,54 420,92 640,68 C860,44 1080,82 1320,60 C1380,54 1410,66 1440,72 L1440,120 L0,120 Z"
      />
    </svg>
    <svg
      className={`absolute inset-0 h-full w-full opacity-65 ${animate ? 'hero-ocean-scene__wave-drift-slow' : ''}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#3A8FB7"
        d="M0,88 C180,68 380,100 580,78 C780,56 980,94 1180,74 C1300,62 1380,80 1440,76 L1440,120 L0,120 Z"
      />
    </svg>
    <svg
      className="absolute inset-0 h-full w-full opacity-35"
      viewBox="0 0 1440 24"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="rgba(255,255,255,0.5)"
        d="M0,12 C240,4 480,20 720,10 C960,0 1200,16 1440,8 L1440,24 L0,24 Z"
      />
    </svg>
  </div>
);

const SunDisc: React.FC<{ animate: boolean }> = ({ animate }) => (
  <div
    className={`hero-ocean-scene__sun pointer-events-none absolute right-[16%] top-[8%] md:right-[14%] md:top-[7%] ${
      animate ? 'hero-ocean-scene__sun-pulse' : ''
    }`}
    aria-hidden
  >
    <div className="hero-ocean-scene__sun-halo" />
    <div className="hero-ocean-scene__sun-core" />
  </div>
);

/**
 * 開場遠景：純 SVG／CSS 藍天白雲、海平面、遠方小島。
 */
export const HeroOceanScene: React.FC<HeroOceanSceneProps> = ({ progress, lite, perf }) => {
  const islandId = useId().replace(/:/g, '');
  const animate = !lite && perf !== 'low';
  const vistaScale = useTransform(
    progress,
    [0, 0.5, 1],
    lite ? [1, 1.1, 1.2] : perf === 'medium' ? [1, 1.14, 1.28] : [1, 1.18, 1.38]
  );
  const vistaY = useTransform(progress, [0, 1], [0, lite ? 24 : perf === 'medium' ? 40 : 56]);
  const cloudOp = useTransform(progress, [0, 0.65, 1], [1, 0.92, 0.78]);
  const shallowMix = useTransform(progress, [0, 0.35, 0.72, 1], [0, 0.12, 0.3, 0.46]);
  const skyBright = useTransform(progress, [0, 0.85, 1], [1, 0.97, 0.9]);
  const islandLift = useTransform(progress, [0, 1], [0, lite ? 6 : 12]);
  const shimmerOp = useTransform(progress, [0, 0.5, 1], [0.55, 0.35, 0.15]);

  return (
    <>
      <motion.div className="absolute inset-0" style={{ opacity: skyBright }} aria-hidden>
        <div className="hero-ocean-scene__sky absolute inset-0" />
        <div className="hero-ocean-scene__sky-haze absolute inset-x-0 top-[28%] h-[22%]" />

        <SunDisc animate={animate} />

        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: cloudOp }}>
          {lite ? (
            <>
              <CloudSvg className="absolute left-[6%] top-[9%] h-16 w-40 opacity-85" />
              <CloudSvg variant="wisp" className="absolute right-[4%] top-[12%] h-10 w-48 opacity-60" />
            </>
          ) : (
            <>
              <div className="hero-ocean-scene__cloud-drift absolute left-[-6%] top-[7%] h-[4.5rem] w-44 opacity-90">
                <CloudSvg className="h-full w-full" />
              </div>
              <div className="hero-ocean-scene__cloud-drift hero-ocean-scene__cloud-drift--slow absolute right-[-4%] top-[11%] h-14 w-40 opacity-75">
                <CloudSvg className="h-full w-full scale-95" />
              </div>
              <div className="hero-ocean-scene__cloud-drift hero-ocean-scene__cloud-drift--mid absolute left-[32%] top-[5%] h-10 w-52 opacity-55">
                <CloudSvg variant="wisp" className="h-full w-full" />
              </div>
              <div className="absolute left-[58%] top-[14%] h-8 w-36 opacity-40">
                <CloudSvg variant="wisp" className="h-full w-full scale-90" />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-ocean-scene__vista pointer-events-none absolute inset-0 origin-[50%_40%] overflow-hidden"
        style={{ scale: vistaScale, y: vistaY }}
        aria-hidden
      >
        <div className="hero-ocean-scene__ocean-deep absolute inset-x-0 bottom-0 top-[36%]" />
        <div className="hero-ocean-scene__ocean-mid absolute inset-x-0 bottom-0 top-[46%]" />
        <div className="hero-ocean-scene__ocean-surface absolute inset-x-0 bottom-0 top-[58%]" />

        {animate && (
          <motion.div
            className="hero-ocean-scene__shimmer absolute inset-x-[18%] bottom-[32%] top-[40%]"
            style={{ opacity: shimmerOp }}
          />
        )}

        <HorizonWaves animate={animate} />
        <div className="hero-ocean-scene__horizon-line absolute inset-x-0 top-[35.5%] h-px" />

        <motion.div
          className="absolute left-1/2 w-[min(68vw,20rem)] -translate-x-1/2 md:w-[min(52vw,24rem)]"
          style={{ bottom: 'calc(33% - 0.25rem)', y: islandLift }}
        >
          <div className={animate ? 'hero-ocean-scene__island-bob' : undefined}>
            <IslandSilhouette idPrefix={islandId} />
          </div>
        </motion.div>

        <motion.div
          className="hero-ocean-scene__shallow absolute inset-x-0 bottom-0 h-[46%]"
          style={{ opacity: shallowMix }}
        />
      </motion.div>

      <div className="hero-ocean-scene__vignette pointer-events-none absolute inset-0" aria-hidden />
    </>
  );
};

export const HeroOceanSceneStatic: React.FC<{ lite?: boolean }> = ({ lite = false }) => {
  const islandId = useId().replace(/:/g, '');

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-ocean-scene__sky absolute inset-0" />
      <div className="hero-ocean-scene__sky-haze absolute inset-x-0 top-[28%] h-[22%]" />
      <SunDisc animate={false} />
      {!lite && (
        <>
          <CloudSvg className="absolute left-[8%] top-[9%] h-16 w-40 opacity-85" />
          <CloudSvg variant="wisp" className="absolute right-[6%] top-[13%] h-10 w-48 opacity-55" />
        </>
      )}
      <div className="hero-ocean-scene__ocean-deep absolute inset-x-0 bottom-0 top-[36%]" />
      <div className="hero-ocean-scene__ocean-mid absolute inset-x-0 bottom-0 top-[46%]" />
      <div className="hero-ocean-scene__ocean-surface absolute inset-x-0 bottom-0 top-[58%]" />
      <HorizonWaves animate={false} />
      <div className="hero-ocean-scene__horizon-line absolute inset-x-0 top-[35.5%] h-px" />
      <div className="absolute bottom-[calc(33%-0.25rem)] left-1/2 w-[min(64vw,18rem)] -translate-x-1/2">
        <IslandSilhouette idPrefix={islandId} />
      </div>
      <div className="hero-ocean-scene__vignette absolute inset-0" />
    </div>
  );
};
