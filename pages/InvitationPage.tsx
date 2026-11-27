import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvelopeScene } from '../components/invitation/EnvelopeScene';
import { InvitationLanding } from '../components/invitation/InvitationLanding';
import { InvitationOpening } from '../components/invitation/InvitationOpening';
import { InvitationMusicButton } from '../components/invitation/InvitationMusicButton';
import { PhotoCarousel } from '../components/invitation/PhotoCarousel';
import { InvitationCountdown } from '../components/invitation/InvitationCountdown';
import { InvitationCalendar } from '../components/invitation/InvitationCalendar';
import { InvitationAddToCalendar } from '../components/invitation/InvitationAddToCalendar';
import { InvitationMap } from '../components/invitation/InvitationMap';
import { DressPreview } from '../components/invitation/DressPreview';
import {
  INVITATION,
  invitationAsset,
  invitationThemeAsset,
} from '../data/invitation';
import { useInvitationAmbient } from '../hooks/useInvitationAmbient';
import { usePerfMode } from '../hooks/usePerfMode';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { playPaperCue } from '../utils/playPaperCue';
import { parseGuestName } from '../utils/guestName';
import '../styles/invitation.css';

const FOOTER_PETALS = [
  { left: '8%', delay: '0s', duration: '9.5s', size: 12, color: '#9eb4d4', dx: '8vw', rot: '80deg' },
  { left: '22%', delay: '1.6s', duration: '11s', size: 9, color: '#c5d4e8', dx: '-6vw', rot: '-70deg' },
  { left: '38%', delay: '3.2s', duration: '10s', size: 14, color: '#7a98be', dx: '10vw', rot: '110deg' },
  { left: '58%', delay: '0.8s', duration: '12s', size: 11, color: '#9eb4d4', dx: '-8vw', rot: '-95deg' },
  { left: '74%', delay: '2.4s', duration: '9.8s', size: 13, color: '#c5d4e8', dx: '5vw', rot: '60deg' },
  { left: '88%', delay: '4s', duration: '11.4s', size: 10, color: '#7a98be', dx: '-10vw', rot: '-120deg' },
] as const;

const FooterPetal: React.FC = () => (
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

const PageContent: React.FC<{ motionOn: boolean; lite: boolean }> = ({ motionOn, lite }) => {
  useScrollReveal(motionOn);
  useInvitationAmbient(motionOn, lite);

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

        <div className="inv-hero-envelope" data-anim-pause>
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

      <section className="inv-invite-section inv-reveal-item">
        <span className="inv-floating-flower inv-floating-flower--invite-left inv-floral-bloom" data-floral-depth="1.2" aria-hidden="true">
          <img src={invitationThemeAsset('flower3-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--invite-right inv-floral-bloom" data-floral-depth="0.55" aria-hidden="true">
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

        </div>
      </section>

      <section className="inv-album-section inv-reveal-item inv-reveal-item--soft">
        <span className="inv-floating-flower inv-floating-flower--album-left inv-floral-bloom" data-floral-depth="0.9" aria-hidden="true">
          <img src={invitationThemeAsset('flower3-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--album-right inv-floral-bloom" data-floral-depth="-0.5" aria-hidden="true">
          <img src={invitationThemeAsset('flower2-decoration.webp')} alt="" />
        </span>

        <h2 className="inv-section-title">相簿</h2>
        <PhotoCarousel photos={INVITATION.album} />
      </section>

      <section className="inv-info-section inv-reveal-item inv-reveal-item--flip">
        <span className="inv-floating-flower inv-floating-flower--info-left inv-floral-bloom" data-floral-depth="1.05" aria-hidden="true">
          <img src={invitationThemeAsset('flower4-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--info-right inv-floral-bloom" data-floral-depth="0.45" aria-hidden="true">
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
              <span className="inv-info-day">
                <span className="inv-info-day-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 22">
                    <path fill="currentColor" d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z" />
                  </svg>
                </span>
                {INVITATION.day}
              </span>
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
              <InvitationAddToCalendar />
            </div>
          </div>
        </div>
      </section>

      <section className="inv-location-section inv-reveal-item inv-reveal-item--rise">
        <h2 className="inv-section-title">婚宴地點</h2>
        <p className="inv-location-address">{INVITATION.venueAddress}</p>

        <InvitationMap />

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

        <div className="inv-parking">
          <h3 className="inv-parking-title">{INVITATION.parking.title}</h3>
          <a
            className="inv-route-link inv-parking-link"
            href={INVITATION.parking.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5V7.5h4.2a3 3 0 010 6H9" />
            </svg>
            {INVITATION.parking.name}
          </a>
        </div>
      </section>

      <section className="inv-dress-section inv-reveal-item inv-reveal-item--soft">
        <h2 className="inv-section-title">服裝規範</h2>
        <p className="inv-dress-code">{INVITATION.dressCode}</p>
        <DressPreview />
      </section>

      <footer className="inv-footer inv-reveal-item inv-reveal-item--close">
        <span className="inv-floating-flower inv-floating-flower--footer-left inv-floral-bloom" data-floral-depth="1.1" aria-hidden="true">
          <img src={invitationThemeAsset('flower3-decoration.webp')} alt="" />
        </span>
        <span className="inv-floating-flower inv-floating-flower--footer-right inv-floral-bloom" data-floral-depth="0.6" aria-hidden="true">
          <img src={invitationThemeAsset('flower2-decoration.webp')} alt="" />
        </span>

        <div className="inv-footer-petals" data-anim-pause aria-hidden="true">
          {(lite ? FOOTER_PETALS.slice(0, 4) : FOOTER_PETALS).map((petal, index) => (
            <span
              key={index}
              className="inv-footer-petal"
              style={{
                left: petal.left,
                width: petal.size,
                color: petal.color,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                ['--petal-dx']: petal.dx,
                ['--petal-rot']: petal.rot,
              } as React.CSSProperties}
            >
              <FooterPetal />
            </span>
          ))}
        </div>

        <img
          src={invitationThemeAsset('wax-seal.webp')}
          alt=""
          aria-hidden="true"
          className="inv-footer-seal"
        />
        <p className="inv-footer-names">
          <span>{INVITATION.groom}</span>
          <span className="inv-footer-amp" aria-hidden="true">&amp;</span>
          <span>{INVITATION.bride}</span>
        </p>
        <p className="inv-footer-thanks">您的蒞臨是我們最大的榮幸！</p>
        <p className="inv-footer-wish">期待與您相見</p>
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

const InvitationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const perfMode = usePerfMode();
  const lite = perfMode !== 'high';
  const lowPerf = perfMode === 'low';
  const searchParams = new URLSearchParams(location.search);
  const queryOpened = searchParams.get('open') === '1';
  const guestName = parseGuestName(searchParams.get('to'));
  const [opened, setOpened] = useState(queryOpened);
  const [opening, setOpening] = useState(false);
  const [justOpened, setJustOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fromCeremonyRef = useRef(false);

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
    if (opened) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [opened]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const markOpened = useCallback(() => {
    const fromCeremony = fromCeremonyRef.current;
    fromCeremonyRef.current = false;
    setOpening(false);
    setOpened(true);
    if (fromCeremony) {
      setJustOpened(true);
      window.setTimeout(() => setJustOpened(false), 1200);
    }
    const search = new URLSearchParams(location.search);
    search.set('open', '1');
    navigate({ pathname: location.pathname, search: `?${search.toString()}` }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(invitationAsset('perfect-ed-sheeran.m4a'));
      audio.loop = true;
      audio.preload = 'auto';
      audio.setAttribute('playsinline', '');
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  const unlockAudio = () => {
    const audio = ensureAudio();
    audio.muted = true;
    void audio.play().catch(() => undefined);
  };

  const startMusic = useCallback(() => {
    const audio = ensureAudio();
    audio.muted = false;
    audio.currentTime = 0;
    const play = audio.play();
    if (play) {
      play.then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
  }, []);

  const handleLetterStart = useCallback(() => {
    startMusic();
  }, [startMusic]);

  const handleSkipOpening = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) {
      startMusic();
    } else {
      audio.muted = false;
      setMusicPlaying(true);
    }
    markOpened();
  }, [markOpened, startMusic]);

  const toggleMusic = () => {
    const audio = ensureAudio();
    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  const handleOpen = () => {
    if (opened || opening) return;
    unlockAudio();
    if (!reducedMotion) {
      playPaperCue();
    }
    if (reducedMotion) {
      startMusic();
      markOpened();
      return;
    }
    fromCeremonyRef.current = true;
    setOpening(true);
  };

  const pageStyle = {
    '--inv-paper-image': `url(${invitationThemeAsset('paper.webp')})`,
  } as React.CSSProperties;

  return (
    <div
      className={`invitation-page${opening ? ' is-opening' : ''}${opened ? ' is-opened' : ''}${justOpened ? ' is-just-opened' : ''}${lite ? ' is-lite' : ''}${lowPerf ? ' is-low' : ''}`}
      style={pageStyle}
    >
      {!opened && !opening && <InvitationLanding onOpen={handleOpen} guestName={guestName} />}
      {opening && !opened && (
        <InvitationOpening onLetterStart={handleLetterStart} onDone={markOpened} onSkip={handleSkipOpening} lite={lite} />
      )}
      {(opened || opening) && (
        <div className={`inv-reveal${opened ? ' is-done' : ' is-waiting'}`}>
          <PageContent motionOn={!reducedMotion && (opened || opening)} lite={lite} />
        </div>
      )}
      {opened && <InvitationMusicButton playing={musicPlaying} onToggle={toggleMusic} />}
    </div>
  );
};

export default InvitationPage;
