import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeScene } from './EnvelopeScene';
import { INVITATION, invitationThemeAsset } from '../../data/invitation';

type Props = {
  onOpen: () => void;
};

export const InvitationLanding: React.FC<Props> = ({ onOpen }) => {
  return (
    <motion.div
      className="inv-landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={invitationThemeAsset('castle-background.webp')}
        alt=""
        aria-hidden="true"
        className="inv-landing-castle"
      />

      <div className="inv-landing-inner">
        <img
          src={invitationThemeAsset('goldenline2-decoration.webp')}
          alt=""
          aria-hidden="true"
          className="inv-gold-line"
        />
        <p className="inv-eyebrow">{INVITATION.eyebrow}</p>

        <div className="inv-landing-envelope">
          <EnvelopeScene variant="landing" />
        </div>

        <div className="inv-landing-names" aria-label={INVITATION.coupleName}>
          <span>{INVITATION.groom}</span>
          <span className="inv-amp" aria-hidden="true">
            &amp;
          </span>
          <span>{INVITATION.bride}</span>
        </div>

        <p className="inv-landing-date">
          2026.12.20 <span>SUNDAY</span>
        </p>

        <motion.button
          type="button"
          className="inv-open-btn"
          onClick={onOpen}
          whileHover={{ scale: 1.035 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>開啟喜帖</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.8-9.3-9.1C1.2 8.7 3.1 5.2 6.5 5.2c2 0 3.6 1.1 4.5 2.7.9-1.6 2.5-2.7 4.5-2.7 3.4 0 5.3 3.5 3.8 6.7C19.5 16.2 12 21 12 21Z"
              fill="currentColor"
            />
          </svg>
          <span className="inv-open-btn-shine" aria-hidden="true" />
        </motion.button>

        <p className="inv-landing-hint">點開信封，與我們一起倒數幸福</p>
      </div>
    </motion.div>
  );
};
