import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IslandScrollHero } from './components/island/IslandScrollHero';
import { VoyageInterlude } from './components/island/VoyageInterlude';
import { VoyageSectionHeader } from './components/island/VoyageSectionHeader';
import { HarborCountdownBar } from './components/island/HarborCountdownBar';
import { IslandWaveDivider } from './components/island/IslandWaveDivider';
import { IslandSectionReveal } from './components/island/IslandSectionReveal';
import { IslandOrnament } from './components/island/IslandOrnament';
import { IslandDepthJourney } from './components/island/IslandDepthJourney';
import { SubmergeGate } from './components/island/SubmergeGate';
import { ScrollJourneyProvider } from './hooks/ScrollJourneyContext';
import { CalendarRevealSection } from './components/CalendarRevealSection';
import { Timeline } from './components/Timeline';
import { LoadingScreen } from './components/LoadingScreen';
import { APP_CONTENT, VOYAGE_NARRATIVE } from './constants';
import { useIsMobile } from './hooks/useIsMobile';
import { usePerfMode, isLowPerf } from './hooks/usePerfMode';

const IslandVoyageGallery = lazy(() =>
  import('./components/island/IslandVoyageGallery').then((m) => ({
    default: m.IslandVoyageGallery,
  }))
);
const LocationInfo = lazy(() =>
  import('./components/LocationInfo').then((m) => ({ default: m.LocationInfo }))
);
const GuestBook = lazy(() =>
  import('./components/GuestBook').then((m) => ({ default: m.GuestBook }))
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

const AnchorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 0c-2.5 0-4.5 2-4.5 4.5S9.5 18 12 18s4.5-2 4.5-4.5S14.5 9 12 9zm0 9v6m-7-3h14" />
  </svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile(768);
  const perf = usePerfMode();
  const lite = isLowPerf(perf);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.perf = perf;
    return () => {
      delete document.documentElement.dataset.perf;
    };
  }, [perf]);

  const [isInitialLoading, setIsInitialLoading] = useState(
    () => !sessionStorage.getItem('hasVisited')
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [showRSVPButton, setShowRSVPButton] = useState(false);
  const [activeSection, setActiveSection] = useState('photos');
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isGuestBookExpanded, setIsGuestBookExpanded] = useState(false);
  const [guestBookRefresh, setGuestBookRefresh] = useState(0);

  useEffect(() => {
    if (!isInitialLoading) return;
    let progress = 0;
    const step = lite ? 22 : isMobile ? 14 : 8;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + step);
      setLoadingProgress(progress);
      if (progress >= 100) window.clearInterval(id);
    }, lite ? 40 : 70);
    return () => window.clearInterval(id);
  }, [isInitialLoading, isMobile, lite]);

  useEffect(() => {
    const tick = () => {
      const diff = +new Date(APP_CONTENT.dateISO) - +new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: lite ? 0 : Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    // Low-end: update countdown every 30s instead of every second
    const id = window.setInterval(tick, lite ? 30000 : 1000);
    return () => window.clearInterval(id);
  }, [lite]);

  useEffect(() => {
    let ticking = false;
    let scrollEndTimer = 0;

    const updateChrome = () => {
      ticking = false;
      const harbor = document.getElementById('harbor');
      const timeline = document.getElementById('timeline');
      const vh = window.innerHeight;

      const marqueeOn = !!harbor && harbor.getBoundingClientRect().top < vh * 0.9;
      setShowNav(marqueeOn);
      document.documentElement.dataset.marquee = marqueeOn ? 'visible' : 'hidden';
      setShowRSVPButton(!!timeline && timeline.getBoundingClientRect().top < vh * 0.75);

      if (isNavigatingRef.current) return;
      const sections = ['line', 'guestbook', 'location', 'timeline', 'harbor', 'photos'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.42) {
          setActiveSection(id);
          break;
        }
      }
    };

    const onScroll = () => {
      document.documentElement.classList.add('is-scrolling');
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 140);

      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateChrome);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateChrome();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(scrollEndTimer);
      document.documentElement.classList.remove('is-scrolling');
      delete document.documentElement.dataset.marquee;
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    if (sessionStorage.getItem('guestbook_refresh')) {
      sessionStorage.removeItem('guestbook_refresh');
      setGuestBookRefresh((v) => v + 1);
    }
  }, [location.pathname]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    isNavigatingRef.current = true;
    setActiveSection(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 800);
  };

  const navItems = [
    { id: 'photos', icon: CameraIcon, label: '航程' },
    { id: 'harbor', icon: AnchorIcon, label: '靠岸' },
    { id: 'timeline', icon: ClockIcon, label: '宴會' },
    { id: 'location', icon: PinIcon, label: '停泊' },
    { id: 'guestbook', icon: PenIcon, label: '祝福' },
    { id: 'rsvp', icon: HeartIcon, label: '登船', isRoute: true },
  ];

  return (
    <ScrollJourneyProvider>
    <main
      id="main-content"
      className="w-full min-h-screen bg-transparent text-[#1A3344] selection:bg-[#E8A87C] selection:text-white"
    >
      <a href="#photos" className="island-skip-link island-focus">
        跳至主要內容
      </a>
      <IslandDepthJourney />

      <AnimatePresence>
        {showNav && !isGuestBookExpanded && !isInitialLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[45]"
          >
            <HarborCountdownBar timeLeft={timeLeft} lite={lite} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInitialLoading && (
          <LoadingScreen
            progress={loadingProgress}
            isMobile={isMobile}
            onComplete={() => {
              setIsInitialLoading(false);
              sessionStorage.setItem('hasVisited', 'true');
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <IslandScrollHero />

        <VoyageInterlude />

        <section id="photos" className="island-section-surface scroll-mt-20">
          <div
            data-depth-value="0.2"
            className="island-gallery-header island-section-surface px-4 pb-8 pt-14 md:pb-10 md:pt-20"
          >
            <VoyageSectionHeader
              chapter={VOYAGE_NARRATIVE.galleryChapter}
              title={VOYAGE_NARRATIVE.galleryTitle}
              intro={VOYAGE_NARRATIVE.galleryIntro}
              animate={!lite}
              className="mx-auto max-w-5xl"
            />
          </div>
          <Suspense fallback={<div className="h-[60vh] bg-[var(--island-deep)]/10" />}>
            <IslandVoyageGallery />
          </Suspense>
        </section>

        <IslandWaveDivider fromDepth={0.34} toDepth={0.36} animate={!lite} />

        <section
          id="harbor"
          data-depth-phase="harbor"
          className="island-section-harbor relative scroll-mt-20 px-4 pb-8 pt-0 md:pb-12"
        >
          <div className="relative z-[1] pt-8 md:pt-10">
            <VoyageSectionHeader
              chapter={VOYAGE_NARRATIVE.harborChapter}
              title={VOYAGE_NARRATIVE.harborTitle}
              intro={VOYAGE_NARRATIVE.harborIntro}
              animate={!lite}
              className="mx-auto mb-6 max-w-5xl"
            />
            <CalendarRevealSection />
          </div>
          <div data-depth-value="0.4" className="island-depth-anchor" aria-hidden />
        </section>

        <div data-depth-phase="descent" className="island-depth-anchor" aria-hidden />

        <IslandWaveDivider fromDepth={0.4} toDepth={0.46} animate={!lite} />

        <SubmergeGate />

        <section
          id="timeline"
          data-depth-phase="underwater"
          className="island-defer island-section-underwater relative scroll-mt-20 overflow-hidden px-4 py-16 md:py-24"
        >
          <div className="relative z-[1]">
            <VoyageSectionHeader
              chapter={VOYAGE_NARRATIVE.programChapter}
              title={VOYAGE_NARRATIVE.programTitle}
              intro={VOYAGE_NARRATIVE.programIntro}
              animate={!lite}
              className="mx-auto mb-4 max-w-3xl"
            />
            <Timeline animate={!lite} />
          </div>
        </section>

        <IslandWaveDivider fromDepth={0.56} toDepth={0.72} animate={!lite} />

        <section
          id="location"
          data-depth-value="0.72"
          className="island-defer island-section-underwater scroll-mt-20 px-4 py-16 md:py-24"
        >
          <VoyageSectionHeader
            chapter={VOYAGE_NARRATIVE.berthChapter}
            title={VOYAGE_NARRATIVE.berthTitle}
            intro={VOYAGE_NARRATIVE.berthIntro}
            align="left"
            animate={!lite}
            className="mx-auto mb-10 max-w-5xl"
          />
          <div className="mx-auto max-w-5xl">
            <Suspense fallback={<div className="h-40 rounded-2xl bg-[var(--island-paper)]/40" />}>
              <LocationInfo />
            </Suspense>
          </div>
        </section>

        <IslandWaveDivider fromDepth={0.72} toDepth={0.82} animate={!lite} />

        <section
          id="guestbook"
          data-depth-value="0.82"
          className="island-defer island-section-underwater island-chrome-pad relative scroll-mt-20 overflow-hidden px-4 py-16 md:py-24"
        >
          <div className="relative z-[1]">
          <VoyageSectionHeader
            chapter={VOYAGE_NARRATIVE.guestbookChapter}
            title={VOYAGE_NARRATIVE.guestbookTitle}
            intro={VOYAGE_NARRATIVE.guestbookIntro}
            animate={!lite}
            className="mx-auto mb-10 max-w-3xl"
          />
          <IslandSectionReveal animate={!lite}>
            <Suspense fallback={<div className="mx-auto h-64 max-w-[600px] rounded-2xl bg-[var(--island-paper)]/40" />}>
              <GuestBook
                onExpandChange={setIsGuestBookExpanded}
                refreshTrigger={guestBookRefresh}
                onWriteMessage={() => navigate('/rsvp')}
              />
            </Suspense>
          </IslandSectionReveal>
          </div>
        </section>

        <section
          id="line"
          data-depth-value="0.88"
          className="island-section-underwater island-chrome-pad scroll-mt-20 px-4 py-16 md:py-20"
        >
          <IslandSectionReveal animate={!lite}>
            <div className="island-card island-card--sea relative z-[1] mx-auto max-w-lg rounded-2xl p-8 text-center md:p-10">
              <p className="island-section-label">{VOYAGE_NARRATIVE.contactChapter}</p>
              <IslandOrnament seed="contact" motif="anchor" />
              <h2 className="island-heading font-serif text-2xl font-light tracking-wide md:text-3xl">
                {VOYAGE_NARRATIVE.contactTitle}
              </h2>
              <p className="island-prose mt-4">{VOYAGE_NARRATIVE.contactIntro}</p>
              {APP_CONTENT.lineLink ? (
                <a
                  href={APP_CONTENT.lineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="island-btn island-focus mt-6 inline-flex px-8 py-3 text-sm font-medium"
                >
                  加入 LINE 好友
                </a>
              ) : (
                <div className="mt-6 inline-flex rounded-full border border-dashed border-[var(--island-sea)]/40 px-6 py-2.5 text-xs tracking-wider text-[var(--island-sea)]">
                  LINE 即將開放
                </div>
              )}
            </div>
          </IslandSectionReveal>
        </section>

        <footer
          id="rsvp"
          data-depth-phase="abyss"
          className="island-section-abyss island-chrome-pad relative scroll-mt-20 overflow-hidden border-t border-[var(--island-shallow)]/15 px-4 py-20 text-center"
        >
          <IslandSectionReveal animate={!lite} className="relative z-[1]">
            <p className="island-section-label">{VOYAGE_NARRATIVE.finaleChapter}</p>
            <IslandOrnament seed="finale" motif="helm" />
            <h2 className="island-heading font-serif text-3xl font-light tracking-wide md:text-4xl">
              {VOYAGE_NARRATIVE.finaleTitle}
            </h2>
            <p className="island-prose mx-auto mt-4 max-w-sm">
              {VOYAGE_NARRATIVE.finaleIntro}
            </p>
            <div className="mt-8">
              <Link
                to="/rsvp"
                className="island-btn island-focus inline-flex px-12 py-3.5 text-sm font-semibold tracking-wide"
              >
                {VOYAGE_NARRATIVE.rsvpCta}
              </Link>
            </div>
            <p className="mt-16 font-serif text-sm text-white/65" translate="no">
              {APP_CONTENT.chineseNames}
            </p>
            <p className="island-tabular mt-1 font-display text-[10px] tracking-[0.3em] text-[var(--island-shallow)]/75">
              {APP_CONTENT.date} · DOULIU
            </p>
            <p className="island-nautical-coords mt-3">
              23.7°N · 120.5°E · DOULIU HARBOR
            </p>
          </IslandSectionReveal>
        </footer>
      </div>

      {/* Nav dock — 左下；RSVP CTA 右下，避免互相重疊 */}
      <AnimatePresence>
        {showNav && !isGuestBookExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="island-nav-dock fixed z-50"
          >
            <div className="relative flex flex-col items-start">
              <AnimatePresence>
                {isNavExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="island-blur absolute bottom-[calc(100%+0.5rem)] left-0 w-[min(11.5rem,calc(100vw-5.5rem))] overflow-hidden rounded-2xl border border-white/70 p-1.5 shadow-lg"
                  >
                    <nav className="flex flex-col gap-0.5" aria-label="章節導覽">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = !item.isRoute && activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={item.label}
                            aria-current={isActive ? 'true' : undefined}
                            onClick={() => {
                              if (item.isRoute) {
                                navigate('/rsvp');
                                return;
                              }
                              scrollTo(item.id);
                              setIsNavExpanded(false);
                            }}
                            className={`island-focus island-touch flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'bg-[var(--island-deep)] text-white'
                                : 'text-[var(--island-deep)] hover:bg-[var(--island-sand)]/80'
                            }`}
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                              <Icon />
                            </span>
                            <span className="font-serif tracking-wide">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="island-blur flex h-12 w-12 items-center justify-center rounded-full border border-white/70 shadow-lg">
                <button
                  type="button"
                  aria-label={isNavExpanded ? '收合選單' : '展開選單'}
                  aria-expanded={isNavExpanded}
                  onClick={() => setIsNavExpanded((v) => !v)}
                  className="island-focus island-touch flex h-11 w-11 items-center justify-center rounded-full text-[var(--island-deep)] hover:bg-white/40"
                >
                  <span aria-hidden>{isNavExpanded ? <XIcon /> : <MenuIcon />}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating RSVP — 右下主行動 */}
      <AnimatePresence>
        {showRSVPButton && !isNavExpanded && !isGuestBookExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="island-floating-rsvp fixed z-40"
          >
            <Link
              to="/rsvp"
              className="island-btn island-focus flex h-12 items-center gap-2 px-5 text-sm font-medium shadow-lg"
            >
              <span aria-hidden><HeartIcon /></span>
              {VOYAGE_NARRATIVE.rsvpCta}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
    </ScrollJourneyProvider>
  );
}

export default App;
