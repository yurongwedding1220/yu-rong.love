import React, { useEffect, useRef } from 'react';
import { INVITATION, cloudinaryImage, invitationThemeAsset } from '../../data/invitation';

export type RevealOrigin = {
  x: number;
  y: number;
};

type Props = {
  onOpen: (origin: RevealOrigin) => void;
};

const MOTIFS: Array<{ top: string; left?: string; right?: string; size: number; rotate: number; opacity: number }> = [
  { top: '6%', left: '8%', size: 22, rotate: 12, opacity: 0.28 },
  { top: '11%', right: '12%', size: 18, rotate: -20, opacity: 0.22 },
  { top: '22%', left: '4%', size: 14, rotate: 40, opacity: 0.2 },
  { top: '28%', right: '6%', size: 26, rotate: 8, opacity: 0.26 },
  { top: '42%', left: '10%', size: 16, rotate: -30, opacity: 0.18 },
  { top: '58%', right: '9%', size: 20, rotate: 18, opacity: 0.24 },
  { top: '68%', left: '6%', size: 24, rotate: -8, opacity: 0.22 },
  { top: '78%', right: '16%', size: 15, rotate: 28, opacity: 0.2 },
  { top: '86%', left: '18%', size: 19, rotate: -16, opacity: 0.22 },
  { top: '4%', left: '46%', size: 13, rotate: 6, opacity: 0.16 },
  { top: '92%', left: '48%', size: 17, rotate: 14, opacity: 0.18 },
  { top: '48%', right: '3%', size: 12, rotate: -24, opacity: 0.16 },
];

const FlowerMotif: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <g fill="currentColor" transform="translate(16 16)">
      <circle r="2.2" />
      { [0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-8" rx="3.1" ry="6.2" transform={`rotate(${deg})`} />
      )) }
    </g>
  </svg>
);

export const InvitationLanding: React.FC<Props> = ({ onOpen }) => {
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [INVITATION.portraits.groom, INVITATION.portraits.bride].forEach((id) => {
      const image = new Image();
      image.src = cloudinaryImage(id, 900);
    });
  }, []);

  const handleOpen = () => {
    const rect = heartRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight * 0.38 };
    onOpen(origin);
  };

  return (
    <div className="inv-landing">
      <div className="inv-landing-motifs" aria-hidden="true">
        {MOTIFS.map((motif, index) => (
          <span
            key={index}
            className="inv-landing-motif"
            style={{
              top: motif.top,
              left: motif.left,
              right: motif.right,
              opacity: motif.opacity,
              transform: `rotate(${motif.rotate}deg)`,
            }}
          >
            <FlowerMotif size={motif.size} />
          </span>
        ))}
      </div>

      <div className="inv-cover-card">
        <img
          src={invitationThemeAsset('flower-background.webp')}
          alt=""
          aria-hidden="true"
          className="inv-cover-flower inv-cover-flower--tl"
        />
        <img
          src={invitationThemeAsset('flower-background.webp')}
          alt=""
          aria-hidden="true"
          className="inv-cover-flower inv-cover-flower--tr"
        />
        <img
          src={invitationThemeAsset('flower2-decoration.webp')}
          alt=""
          aria-hidden="true"
          className="inv-cover-flower inv-cover-flower--br"
        />

        <div className="inv-cover-heart" ref={heartRef} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 21s-7.2-4.6-9.2-8.9C1.1 8.6 3.2 5.2 6.6 5.2c2 0 3.5 1.1 4.4 2.7.9-1.6 2.4-2.7 4.4-2.7 3.4 0 5.5 3.4 3.8 6.9C19.2 16.4 12 21 12 21Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <h1 className="inv-cover-names">
          <span>{INVITATION.groom}</span>
          <span className="inv-cover-amp" aria-hidden="true">&amp;</span>
          <span>{INVITATION.bride}</span>
        </h1>

        <div className="inv-cover-divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 24 24">
            <path
              d="M12 20s-6.4-4.2-8.1-7.8C2.4 9.4 4.2 6.6 7 6.6c1.6 0 2.9.9 3.6 2.2C11.3 7.5 12.6 6.6 14.2 6.6c2.8 0 4.6 2.8 3.1 5.6C18.4 15.8 12 20 12 20Z"
              fill="currentColor"
            />
          </svg>
          <span />
        </div>

        <p className="inv-cover-date">{INVITATION.dateLabel}</p>
        <p className="inv-cover-kicker">誠摯邀請</p>

        <button type="button" className="inv-open-btn" onClick={handleOpen}>
          <span>開啟喜帖</span>
        </button>
      </div>
    </div>
  );
};
