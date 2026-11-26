import React, { useEffect, useMemo } from 'react';
import { INVITATION, invitationThemeAsset } from '../../data/invitation';

type Props = {
  onLetterStart: () => void;
  onDone: () => void;
};

export const OPENING_LETTER_START_MS = 700;
export const OPENING_TOTAL_MS = 2000;

const PETAL_COUNT = 16;

const Petal: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <circle cx="12" cy="12" r="2.1" />
      <ellipse cx="12" cy="5.6" rx="3.1" ry="5.4" />
      <ellipse cx="12" cy="5.6" rx="3.1" ry="5.4" transform="rotate(72 12 12)" />
      <ellipse cx="12" cy="5.6" rx="3.1" ry="5.4" transform="rotate(144 12 12)" />
      <ellipse cx="12" cy="5.6" rx="3.1" ry="5.4" transform="rotate(216 12 12)" />
      <ellipse cx="12" cy="5.6" rx="3.1" ry="5.4" transform="rotate(288 12 12)" />
    </g>
  </svg>
);

export const InvitationOpening: React.FC<Props> = ({ onLetterStart, onDone }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, index) => {
        const angle = (Math.PI * 2 * (index + 0.15)) / PETAL_COUNT + (index % 3) * 0.18;
        const distance = 42 + (index % 5) * 10;
        return {
          id: index,
          dx: `${Math.cos(angle) * distance}vw`,
          dy: `${Math.sin(angle) * distance * 0.72 - 8}vh`,
          rot: `${(index * 47) % 360}deg`,
          delay: `${0.70 + (index % 8) * 0.04}s`,
          duration: `${1.05 + (index % 5) * 0.08}s`,
          size: `${10 + (index % 4) * 3}px`,
          left: `${44 + ((index * 13) % 16)}%`,
          top: `${40 + ((index * 7) % 18)}%`,
          color: index % 3 === 0 ? '#9eb4d4' : index % 3 === 1 ? '#c5d4e8' : '#7a98be',
        };
      }),
    []
  );

  useEffect(() => {
    const letterTimer = window.setTimeout(onLetterStart, OPENING_LETTER_START_MS);
    const doneTimer = window.setTimeout(onDone, OPENING_TOTAL_MS);
    return () => {
      window.clearTimeout(letterTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onLetterStart, onDone]);

  return (
    <div
      className="inv-opening"
      role="img"
      aria-label="喜帖開啟中"
      style={{ '--inv-flap-mask': `url(${invitationThemeAsset('envelope-flap.webp')})` } as React.CSSProperties}
    >
      <div className="inv-opening-letter">
        <div className="inv-opening-letter-face">
          <p className="inv-opening-letter-names">
            <span>{INVITATION.groom}</span>
            <span className="inv-opening-letter-amp" aria-hidden="true">
              &amp;
            </span>
            <span>{INVITATION.bride}</span>
          </p>
          <p className="inv-opening-letter-date">{INVITATION.dateLabel}</p>
        </div>
      </div>

      <div className="inv-opening-stage">
        <div className="inv-opening-3d">
          <div className="inv-opening-body">
            <img
              src={invitationThemeAsset('envelope-pocket.webp')}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>

          <div className="inv-opening-flap">
            <div className="inv-opening-flap-face inv-opening-flap-face--front">
              <img
                src={invitationThemeAsset('envelope-flap.webp')}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </div>
            <div className="inv-opening-flap-face inv-opening-flap-face--back" />
          </div>
        </div>

        <div className="inv-opening-seal" aria-hidden="true">
          <span className="inv-opening-seal-half inv-opening-seal-half--left">
            <img src={invitationThemeAsset('wax-seal.webp')} alt="" draggable={false} />
          </span>
          <span className="inv-opening-seal-half inv-opening-seal-half--right">
            <img src={invitationThemeAsset('wax-seal.webp')} alt="" draggable={false} />
          </span>
        </div>
      </div>

      <div className="inv-opening-petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className="inv-opening-petal"
            style={
              {
                left: petal.left,
                top: petal.top,
                width: petal.size,
                color: petal.color,
                '--petal-dx': petal.dx,
                '--petal-dy': petal.dy,
                '--petal-rot': petal.rot,
                '--petal-delay': petal.delay,
                '--petal-duration': petal.duration,
              } as React.CSSProperties
            }
          >
            <Petal />
          </span>
        ))}
      </div>
    </div>
  );
};
