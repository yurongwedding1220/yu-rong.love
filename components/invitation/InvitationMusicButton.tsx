import React from 'react';

type Props = {
  playing: boolean;
  onToggle: () => void;
};

export const InvitationMusicButton: React.FC<Props> = ({ playing, onToggle }) => {
  return (
    <button
      type="button"
      className="inv-music-btn"
      onClick={onToggle}
      aria-label={playing ? '暫停音樂' : '播放音樂'}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
};
