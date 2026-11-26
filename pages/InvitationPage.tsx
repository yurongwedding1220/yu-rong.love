import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { InvitationLanding } from '../components/invitation/InvitationLanding';
import { EnvelopeScene } from '../components/invitation/EnvelopeScene';
import { PhotoCarousel } from '../components/invitation/PhotoCarousel';
import { InvitationCountdown } from '../components/invitation/InvitationCountdown';
import { InvitationCalendar } from '../components/invitation/InvitationCalendar';
import { INVITATION, invitationThemeAsset } from '../data/invitation';
import '../styles/invitation.css';

const PageContent: React.FC = () => {
  return (
    <motion.main
      className="inv-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
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
        <p className="inv-hero-date">{INVITATION.dateLabel}</p>
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
            <p className="inv-invite-kicker">誠摯邀請</p>
            <div className="inv-invite-names">
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
            <p className="inv-invite-lead">與我們一同見證這一天</p>
          </div>
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
        <p className="inv-location-venue">
          {INVITATION.venueName} · {INVITATION.venueHall}
        </p>
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
              <span className="inv-swatch-name">{color.name}</span>
            </div>
          ))}
        </div>
        <p className="inv-dress-hint">歡迎穿著與婚禮色系呼應的服裝，與我們一起留下美好畫面。</p>
      </section>

      <footer className="inv-footer">
        <img
          src={invitationThemeAsset('goldenline3-decoration.webp')}
          alt=""
          aria-hidden="true"
          className="inv-footer-line"
        />
        <p className="inv-footer-thanks">您的蒞臨是我們最大的榮幸！</p>
        <p className="inv-footer-heart" aria-hidden="true">♡</p>

        <div className="inv-footer-actions">
          <Link className="inv-footer-button inv-footer-button--primary" to="/rsvp">
            確認出席
          </Link>
          <Link className="inv-footer-button" to="/">
            回到官網
          </Link>
        </div>

        <p className="inv-footer-signature">
          {INVITATION.groom} &amp; {INVITATION.bride} · 2026.12.20
        </p>
      </footer>
    </motion.main>
  );
};

const InvitationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryOpened = new URLSearchParams(location.search).get('open') === '1';
  const [opened, setOpened] = useState(queryOpened);

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
    if (opened) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    const search = new URLSearchParams(location.search);
    search.set('open', '1');
    navigate({ pathname: location.pathname, search: `?${search.toString()}` }, { replace: true });
  };

  const pageStyle = {
    '--inv-paper-image': `url(${invitationThemeAsset('paper.webp')})`,
  } as React.CSSProperties;

  return (
    <div className="invitation-page" style={pageStyle}>
      <AnimatePresence mode="wait">
        {opened ? (
          <PageContent key="content" />
        ) : (
          <InvitationLanding key="landing" onOpen={handleOpen} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvitationPage;
