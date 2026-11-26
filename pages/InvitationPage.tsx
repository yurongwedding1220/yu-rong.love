import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvelopeScene } from '../components/invitation/EnvelopeScene';
import { InvitationLanding, type RevealOrigin } from '../components/invitation/InvitationLanding';
import { InvitationMusicButton } from '../components/invitation/InvitationMusicButton';
import { PhotoCarousel } from '../components/invitation/PhotoCarousel';
import { InvitationCountdown } from '../components/invitation/InvitationCountdown';
import { InvitationCalendar } from '../components/invitation/InvitationCalendar';
import {
  INVITATION,
  cloudinaryImage,
  invitationAsset,
  invitationThemeAsset,
  preloadInvitationAlbum,
} from '../data/invitation';
import '../styles/invitation.css';

type PageContentProps = {
  musicPlaying: boolean;
  onToggleMusic: () => void;
};

const PageContent: React.FC<PageContentProps> = ({ musicPlaying, onToggleMusic }) => {
  return (
    <main className="inv-shell">
      <header className="inv-header">
        <img
          src={invitationThemeAsset('castle-background.webp')}
          alt=""
          aria-hidden="true"
          className="inv-header-castle"
        />
        <img
          src={invitationThemeAsset('goldenline2-decoration.webp')}
          alt=""
          aria-hidden="true"
          className="inv-gold-line"
        />
        <p className="inv-eyebrow">{INVITATION.eyebrow}</p>

        <div className="inv-hero-envelope">
          <EnvelopeScene />
        </div>

        <div className="inv-couple-names">
          <span>{INVITATION.groom}</span>
          <span className="inv-amp" aria-hidden="true">
            &amp;
          </span>
          <span>{INVITATION.bride}</span>
        </div>
      </header>

      <section className="inv-invite-section">
        <span className="inv-floating-flower inv-floating-flower--invite-left" aria-hidden="true">
          <img src={invitationThemeAsset('flower3-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--invite-right" aria-hidden="true">
          <img src={invitationThemeAsset('flower2-decoration.webp')} alt="" />
        </span>

        <div className="inv-navy-card inv-invite-card">
          <div className="inv-card-paper" aria-hidden="true" />
          <div className="inv-card-content">
            <div className="inv-parents">
              <div className="inv-parents-side">
                <p className="inv-parents-honorific">{INVITATION.parents.groom.honorific}</p>
                {INVITATION.parents.groom.names.map((name) => (
                  <p className="inv-parents-name" key={name}>{name}</p>
                ))}
              </div>
              <span className="inv-parents-divider" aria-hidden="true" />
              <div className="inv-parents-side">
                <p className="inv-parents-honorific">{INVITATION.parents.bride.honorific}</p>
                {INVITATION.parents.bride.names.map((name) => (
                  <p className="inv-parents-name" key={name}>{name}</p>
                ))}
              </div>
            </div>

            <div className="inv-invite-couple">
              <div className="inv-invite-person">
                <span className="inv-invite-name">{INVITATION.groom}</span>
                <span className="inv-invite-role">新郎</span>
              </div>
              <span className="inv-invite-amp" aria-hidden="true">&amp;</span>
              <div className="inv-invite-person">
                <span className="inv-invite-name">{INVITATION.bride}</span>
                <span className="inv-invite-role">新娘</span>
              </div>
            </div>
          </div>

          <InvitationMusicButton playing={musicPlaying} onToggle={onToggleMusic} />
        </div>
      </section>

      <section className="inv-album-section">
        <span className="inv-floating-flower inv-floating-flower--album-left" aria-hidden="true">
          <img src={invitationThemeAsset('flower3-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--album-right" aria-hidden="true">
          <img src={invitationThemeAsset('flower2-decoration.webp')} alt="" />
        </span>

        <h2 className="inv-section-title">相簿</h2>
        <PhotoCarousel photos={INVITATION.album} />
      </section>

      <section className="inv-info-section">
        <span className="inv-floating-flower inv-floating-flower--info-left" aria-hidden="true">
          <img src={invitationThemeAsset('flower4-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--info-right" aria-hidden="true">
          <img src={invitationThemeAsset('flower5-decoration.webp')} alt="" />
        </span>

        <div className="inv-navy-card inv-info-card">
          <div className="inv-card-paper" aria-hidden="true" />
          <div className="inv-card-content">
            <h2 className="inv-info-title">婚宴資訊</h2>

            <p className="inv-info-lead">婚宴將於以下時間舉行：</p>
            <div className="inv-info-time">
              <span>{INVITATION.time}</span>
              <span>{INVITATION.weekday}</span>
            </div>

            <div className="inv-info-date">
              <span className="inv-info-day">{INVITATION.day}</span>
              <span className="inv-info-divider" aria-hidden="true" />
              <div className="inv-info-month">
                <span>{INVITATION.month}月</span>
                <span>{INVITATION.year}</span>
              </div>
            </div>

            <p className="inv-info-lunar">（{INVITATION.lunar}）</p>

            <div className="inv-countdown-block">
              <h3>倒計時</h3>
              <InvitationCountdown />
            </div>

            <div className="inv-calendar-block">
              <InvitationCalendar />
              <a
                className="inv-calendar-link"
                href={INVITATION.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                添加到日曆
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="inv-location-section">
        <h2 className="inv-section-title">婚宴地點</h2>
        <p className="inv-location-address">{INVITATION.venueAddress}</p>

        <iframe
          className="inv-map"
          title="婚宴地點地圖"
          src={INVITATION.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <a
          className="inv-route-link"
          href={INVITATION.mapDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          路線導航
        </a>
      </section>

      <section className="inv-dress-section">
        <h2 className="inv-section-title">服裝規範</h2>
        <p className="inv-dress-code">{INVITATION.dressCode}</p>
        <div className="inv-swatches" aria-label={INVITATION.dressCode}>
          {INVITATION.dressColors.map((color) => (
            <div className="inv-swatch" key={color.name}>
              <span
                className="inv-swatch-dot"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="inv-footer">
        <p className="inv-footer-thanks">您的蒞臨是我們最大的榮幸！</p>
        <img
          src={invitationThemeAsset('goldenline3-decoration.webp')}
          alt=""
          aria-hidden="true"
          className="inv-footer-line"
        />
      </footer>
    </main>
  );
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const InvitationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryOpened = new URLSearchParams(location.search).get('open') === '1';
  const [opened, setOpened] = useState(queryOpened);
  const [revealing, setRevealing] = useState(false);
  const [revealOrigin, setRevealOrigin] = useState({ x: '50%', y: '38%' });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const revealTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = `${INVITATION.coupleName} · 電子喜帖`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        `誠摯邀請您蒞臨 ${INVITATION.coupleName} 的婚禮 · 2026年12月20日 · 緻麗伯爵酒店`
      );
    }
    return () => {
      document.title = '政憲 & 幸容 婚禮邀請函';
    };
  }, []);

  useEffect(() => {
    [INVITATION.portraits.groom, INVITATION.portraits.bride].forEach((id) => {
      const image = new Image();
      image.src = cloudinaryImage(id, 900);
    });
    preloadInvitationAlbum();
  }, []);

  useEffect(() => {
    if (opened) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [opened]);

  useEffect(() => {
    if (!revealing || !revealLayerRef.current) return;
    const el = revealLayerRef.current;
    const origin = `${revealOrigin.x} ${revealOrigin.y}`;
    el.style.clipPath = `circle(0px at ${origin})`;
    const animation = el.animate(
      [
        { clipPath: `circle(0px at ${origin})` },
        { clipPath: `circle(150vmax at ${origin})` },
      ],
      { duration: 950, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );
    return () => animation.cancel();
  }, [revealing, revealOrigin]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  const markOpened = () => {
    setOpened(true);
    setRevealing(false);
    const search = new URLSearchParams(location.search);
    search.set('open', '1');
    navigate({ pathname: location.pathname, search: `?${search.toString()}` }, { replace: true });
  };

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const play = audio.play();
    if (play) {
      play.then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  const handleOpen = (origin: RevealOrigin) => {
    startMusic();
    if (opened) return;

    if (prefersReducedMotion()) {
      markOpened();
      return;
    }

    setRevealOrigin({ x: `${Math.round(origin.x)}px`, y: `${Math.round(origin.y)}px` });
    setRevealing(true);
    revealTimer.current = window.setTimeout(markOpened, 980);
  };

  const pageStyle = {
    '--inv-paper-image': `url(${invitationThemeAsset('paper.webp')})`,
    '--inv-reveal-x': revealOrigin.x,
    '--inv-reveal-y': revealOrigin.y,
  } as React.CSSProperties;

  return (
    <div className={`invitation-page${revealing ? ' is-revealing' : ''}${opened ? ' is-opened' : ''}`} style={pageStyle}>
      <audio
        ref={audioRef}
        src={invitationAsset('perfect-ed-sheeran.mp3')}
        loop
        preload="auto"
        playsInline
      />

      {!opened && <InvitationLanding onOpen={handleOpen} />}

      {(opened || revealing) && (
        <div ref={revealLayerRef} className={`inv-reveal${revealing ? ' is-animating' : ' is-done'}`}>
          <PageContent musicPlaying={musicPlaying} onToggleMusic={toggleMusic} />
        </div>
      )}
    </div>
  );
};

export default InvitationPage;
