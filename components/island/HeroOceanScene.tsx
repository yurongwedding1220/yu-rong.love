import React from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';

const HERO_IMAGE = `${import.meta.env.BASE_URL}voyage/hero-ocean-island.png`;

type HeroOceanSceneProps = {
  progress: MotionValue<number>;
  lite: boolean;
};

const CloudLayer: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 1,
}) => (
  <svg
    className={className}
    viewBox="0 0 1440 320"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden
    style={{ opacity }}
  >
    <path
      fill="rgba(255,255,255,0.72)"
      d="M180,88 C240,62 320,58 380,78 C440,98 520,102 580,86 C640,70 720,52 800,64 C880,76 960,98 1040,92 C1120,86 1200,58 1280,52 C1340,48 1390,62 1440,74 L1440,0 L0,0 Z"
    />
    <path
      fill="rgba(255,255,255,0.55)"
      d="M0,120 C120,96 240,108 360,92 C480,76 600,58 720,72 C840,86 960,112 1080,98 C1200,84 1320,62 1440,78 L1440,0 L120,0 C80,18 40,52 0,72 Z"
    />
    <path
      fill="rgba(255,255,255,0.38)"
      d="M320,148 C420,128 520,132 620,148 C720,164 820,156 920,138 C1020,120 1120,98 1220,108 C1300,116 1380,132 1440,142 L1440,80 L280,80 C300,98 310,122 320,148 Z"
    />
  </svg>
);

/**
 * 開場遠景：藍天白雲、海平面、遠方小島。
 * 隨 Hero 捲動拉近，銜接後段沙灘／浅灣色調。
 */
export const HeroOceanScene: React.FC<HeroOceanSceneProps> = ({ progress, lite }) => {
  const vistaScale = useTransform(progress, [0, 0.5, 1], lite ? [1, 1.12, 1.22] : [1, 1.2, 1.42]);
  const vistaY = useTransform(progress, [0, 1], [0, lite ? 28 : 52]);
  const cloudOp = useTransform(progress, [0, 0.65, 1], [1, 0.88, 0.72]);
  const shallowMix = useTransform(progress, [0, 0.4, 0.75, 1], [0, 0.12, 0.32, 0.48]);
  const skyBright = useTransform(progress, [0, 0.85, 1], [1, 0.96, 0.88]);

  return (
    <>
      <motion.div className="absolute inset-0" style={{ opacity: skyBright }} aria-hidden>
        <div className="hero-ocean-scene__sky absolute inset-0" />
        {!lite ? (
          <motion.div
            className="hero-ocean-scene__clouds pointer-events-none absolute inset-x-[-8%] top-0 h-[38%]"
            style={{ opacity: cloudOp }}
          >
            <div className="hero-ocean-scene__cloud-drift h-full w-[116%]">
              <CloudLayer className="h-full w-full" />
            </div>
          </motion.div>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[32%] opacity-80">
            <CloudLayer className="h-full w-full" />
          </div>
        )}
      </motion.div>

      <motion.div
        className="hero-ocean-scene__vista pointer-events-none absolute inset-0 origin-[50%_42%] overflow-hidden"
        style={{ scale: vistaScale, y: vistaY }}
        aria-hidden
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <motion.div
          className="hero-ocean-scene__shallow absolute inset-x-0 bottom-0 h-[48%]"
          style={{ opacity: shallowMix }}
        />
        <div className="hero-ocean-scene__horizon-glow absolute inset-x-0 top-[36%] h-10" />
      </motion.div>

      <div className="hero-ocean-scene__vignette pointer-events-none absolute inset-0" aria-hidden />
    </>
  );
};
