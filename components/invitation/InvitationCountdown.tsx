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
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const pad = (value: number) => String(value).padStart(2, '0');

export const InvitationCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const tick = () => setTimeLeft(calculateTimeLeft());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    { value: timeLeft.days, label: '天' },
    { value: timeLeft.hours, label: '小時' },
    { value: timeLeft.minutes, label: '分' },
    { value: timeLeft.seconds, label: '秒' },
  ];

  return (
    <div className="inv-countdown" aria-label="婚禮倒數計時">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          {index > 0 && <span className="inv-countdown-sep" aria-hidden="true">:</span>}
          <div className="inv-countdown-unit">
            <span className="inv-countdown-value">{pad(unit.value)}</span>
            <span className="inv-countdown-label">{unit.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
