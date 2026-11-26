import React, { useEffect, useState } from 'react';
import { INVITATION } from '../../data/invitation';

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

export const InvitationCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const tick = () => setTimeLeft(calculateTimeLeft());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const label = `${timeLeft.days} 天 ${timeLeft.hours} 時 ${timeLeft.minutes} 分 ${timeLeft.seconds} 秒`;

  return (
    <p className="inv-countdown" aria-label="婚禮倒數計時">
      {label}
    </p>
  );
};
