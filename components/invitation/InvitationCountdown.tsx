import React, { useEffect, useState } from 'react';
import { INVITATION } from '../../data/invitation';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (): TimeLeft => {
  const difference = +new Date(INVITATION.dateISO) - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const FlipDigit: React.FC<{ value: number; pad?: number; reducedMotion: boolean }> = ({
  value,
  pad = 2,
  reducedMotion,
}) => {
  const text = String(value).padStart(pad, '0');
  return (
    <span className="inv-count-digit-wrap">
      <span className="inv-count-digit" key={reducedMotion ? 'static' : text}>
        {text}
      </span>
    </span>
  );
};

export const InvitationCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const tick = () => setTimeLeft(calculateTimeLeft());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const label = `${timeLeft.days} 天 ${timeLeft.hours} 時 ${timeLeft.minutes} 分 ${timeLeft.seconds} 秒`;

  return (
    <p className="inv-countdown" aria-label={`婚禮倒數計時 ${label}`}>
      <span className="inv-count-unit">
        <FlipDigit value={timeLeft.days} pad={timeLeft.days >= 100 ? 3 : 2} reducedMotion={reducedMotion} />
        <span className="inv-count-label">天</span>
      </span>
      <span className="inv-count-unit">
        <FlipDigit value={timeLeft.hours} reducedMotion={reducedMotion} />
        <span className="inv-count-label">時</span>
      </span>
      <span className="inv-count-unit">
        <FlipDigit value={timeLeft.minutes} reducedMotion={reducedMotion} />
        <span className="inv-count-label">分</span>
      </span>
      <span className="inv-count-unit">
        <FlipDigit value={timeLeft.seconds} reducedMotion={reducedMotion} />
        <span className="inv-count-label">秒</span>
      </span>
    </p>
  );
};
