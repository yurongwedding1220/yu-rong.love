import React from 'react';
import {
  INVITATION,
  cloudinaryHeroPortrait,
  cloudinarySrcSet,
  invitationThemeAsset,
} from '../../data/invitation';

type Props = {
  variant?: 'landing' | 'hero';
};

const HERO_WIDTHS = [600, 900, 1200] as const;
const HERO_SIZES = '(max-width: 767px) 70vw, 240px';

export const EnvelopeScene: React.FC<Props> = ({ variant = 'hero' }) => {
  return (
    <div className={`inv-envelope-scene inv-envelope-scene--${variant}`}>
      <img
        src={invitationThemeAsset('flower-background.webp')}
        alt=""
        aria-hidden="true"
        className="inv-scene-flower inv-scene-flower--left"
      />

      <img
        src={invitationThemeAsset('envelope-background.webp')}
        alt=""
        aria-hidden="true"
        className="inv-scene-envelope"
      />

      <div className="inv-scene-photo inv-scene-photo--groom">
        <div className="inv-scene-photo-frame">
          <img
            src={cloudinaryHeroPortrait(INVITATION.portraits.groom, 900)}
            srcSet={cloudinarySrcSet(cloudinaryHeroPortrait, INVITATION.portraits.groom, HERO_WIDTHS)}
            sizes={HERO_SIZES}
            alt={`${INVITATION.groom}的照片`}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className="inv-scene-photo inv-scene-photo--bride">
        <div className="inv-scene-photo-frame">
          <img
            src={cloudinaryHeroPortrait(INVITATION.portraits.bride, 900)}
            srcSet={cloudinarySrcSet(cloudinaryHeroPortrait, INVITATION.portraits.bride, HERO_WIDTHS)}
            sizes={HERO_SIZES}
            alt={`${INVITATION.bride}的照片`}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <img
        src={invitationThemeAsset('envelope-cover.webp')}
        alt=""
        aria-hidden="true"
        className="inv-scene-cover"
      />

      <span className="inv-scene-flower inv-scene-flower--right">
        <img src={invitationThemeAsset('flower2-decoration.webp')} alt="" aria-hidden="true" />
      </span>
    </div>
  );
};
