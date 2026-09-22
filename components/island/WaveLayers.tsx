import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import type { PerfMode } from '../../hooks/usePerfMode';

type WaveLayersProps = {
  progress: MotionValue<number>;
  mode: PerfMode;
};

/** 高度用父層 %，避免 vh 隨網址列跳動 */
const StaticWaves: React.FC = () => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] overflow-hidden">
    <svg
      className="absolute bottom-[12%] left-[-5%] h-[70%] w-[120%] opacity-50"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#1B4D6E"
        d="M0,192L80,176C160,160,320,128,480,133C640,138,800,180,960,186C1120,192,1280,160,1360,144L1440,128L1440,320L0,320Z"
      />
    </svg>
    <svg
      className="absolute bottom-0 left-0 h-[80%] w-full opacity-80"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="#7EC8E3"
        d="M0,224L60,208C120,192,240,160,360,154C480,149,600,171,720,186C840,202,960,210,1080,192C1200,174,1320,128,1380,106L1440,85L1440,320L0,320Z"
      />
    </svg>
  </div>
);

const DriftingWaves: React.FC<{
  yMain: MotionValue<number>;
  yFront: MotionValue<number>;
}> = ({ yMain, yFront }) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] overflow-hidden">
    <motion.div
      className="absolute bottom-[10%] left-[-8%] h-[72%] w-[170%]"
      style={{ y: yMain }}
    >
      <div className="island-wave-drift h-full w-full">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="#3A8FB7"
            opacity={0.75}
            d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,192C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>
    </motion.div>
    <motion.div
      className="absolute bottom-0 left-0 h-[78%] w-full"
      style={{ y: yFront }}
    >
      <div className="island-wave-drift island-wave-drift-slow h-full w-full">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="#6BB5D8"
            opacity={0.62}
            d="M0,224L80,208C160,192,320,160,480,154C640,149,800,171,960,186C1120,202,1280,210,1360,192L1440,174L1440,320L0,320Z"
          />
        </svg>
      </div>
    </motion.div>
  </div>
);

export const WaveLayers: React.FC<WaveLayersProps> = ({ progress, mode }) => {
  const isLow = mode === 'low';
  const isMedium = mode === 'medium';

  const yMain = useTransform(
    progress,
    [0, 1],
    [0, isLow ? -40 : isMedium ? -56 : -80]
  );
  const yFront = useTransform(
    progress,
    [0, 1],
    [0, isLow ? -60 : isMedium ? -88 : -120]
  );
  const fade = useTransform(progress, [0.5, 0.92], [1, 0]);

  if (isLow) {
    return (
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{ opacity: fade, y: yMain }}
      >
        <StaticWaves />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
      style={{ opacity: fade }}
    >
      <DriftingWaves yMain={yMain} yFront={yFront} />
    </motion.div>
  );
};
