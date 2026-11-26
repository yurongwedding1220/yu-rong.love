import React from 'react';
import { cloudinaryImage, INVITATION, invitationThemeAsset } from '../../data/invitation';

type Props = {
  variant?: 'landing' | 'hero';
};

export const EnvelopeScene: React.FC<Props> = ({ variant = 'hero' }) => {
  const isLanding = variant === 'landing';

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
            src={cloudinaryImage(INVITATION.portraits.groom, isLanding ? 900 : 700)}
            alt={`${INVITATION.groom}的照片`}
            loading={isLanding ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      </div>

      <div className="inv-scene-photo inv-scene-photo--bride">
        <div className="inv-scene-photo-frame">
          <img
            src={cloudinaryImage(INVITATION.portraits.bride, isLanding ? 900 : 700)}
            alt={`${INVITATION.bride}的照片`}
            loading={isLanding ? 'eager' : 'lazy'}
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
