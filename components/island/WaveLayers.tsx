import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

type WaveLayersProps = {
  progress: MotionValue<number>;
};

const WaveSvg: React.FC<{
  fill: string;
  opacity?: number;
  y?: MotionValue<number> | number;
  className?: string;
  animateBreath?: boolean;
}> = ({ fill, opacity = 1, y = 0, className = '', animateBreath }) => (
  <motion.svg
    className={`absolute left-0 w-[200%] h-[28vh] md:h-[32vh] ${className}`}
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    style={{ y, opacity }}
    animate={animateBreath ? { x: [0, -40, 0] } : undefined}
    transition={
      animateBreath
        ? { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        : undefined
    }
  >
    <path
      fill={fill}
      d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,192C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </motion.svg>
);

export const WaveLayers: React.FC<WaveLayersProps> = ({ progress }) => {
  const y1 = useTransform(progress, [0, 1], [0, -80]);
  const y2 = useTransform(progress, [0, 1], [0, -140]);
  const y3 = useTransform(progress, [0, 1], [0, -200]);
  const fade = useTransform(progress, [0.55, 0.95], [1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] overflow-hidden"
      style={{ opacity: fade }}
    >
      <WaveSvg
        fill="#1B4D6E"
        opacity={0.55}
        y={y1}
        className="bottom-[18%] left-[-10%]"
        animateBreath
      />
      <WaveSvg
        fill="#3A8FB7"
        opacity={0.7}
        y={y2}
        className="bottom-[8%] left-[-5%]"
        animateBreath
      />
      <WaveSvg
        fill="#7EC8E3"
        opacity={0.85}
        y={y3}
        className="bottom-0 left-0"
      />
    </motion.div>
  );
};
