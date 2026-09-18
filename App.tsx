import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IslandScrollHero } from './components/island/IslandScrollHero';
import { VoyageInterlude } from './components/island/VoyageInterlude';
import { VoyageSectionHeader } from './components/island/VoyageSectionHeader';
import { HarborCountdownBar } from './components/island/HarborCountdownBar';
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
    const onScroll = () => {
      const harbor = document.getElementById('harbor');
      const timeline = document.getElementById('timeline');

      setShowNav(
        !!harbor && harbor.getBoundingClientRect().top < window.innerHeight * 0.9
      );
      setShowRSVPButton(
        !!timeline && timeline.getBoundingClientRect().top < window.innerHeight * 0.75
      );

      if (isNavigatingRef.current) return;
      const sections = ['line', 'location', 'timeline', 'harbor', 'photos'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    { id: 'rsvp', icon: HeartIcon, label: '登船', isRoute: true },
  ];

  return (
    <main className="w-full min-h-screen bg-transparent text-[#1A3344] selection:bg-[#E8A87C] selection:text-white">
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

        <section id="photos" className="scroll-mt-20">
          <div className="px-4 pb-8 pt-14 md:pb-10 md:pt-20">
            <VoyageSectionHeader
              chapter={VOYAGE_NARRATIVE.galleryChapter}
              title={VOYAGE_NARRATIVE.galleryTitle}
              intro={VOYAGE_NARRATIVE.galleryIntro}
              animate={!lite}
              className="mx-auto max-w-5xl"
            />
          </div>
          <Suspense fallback={<div className="h-[60vh] bg-[#1B4D6E]/10" />}>
            <IslandVoyageGallery />
          </Suspense>
        </section>

        <section
          id="harbor"
          className="scroll-mt-20 bg-gradient-to-b from-[#F4E8D8] to-[#F4E8D8]/60 px-4 pb-8 pt-0 md:pb-12"
        >
          <HarborCountdownBar timeLeft={timeLeft} lite={lite} perf={perf} />
          <div className="pt-12 md:pt-16">
          <VoyageSectionHeader
            chapter={VOYAGE_NARRATIVE.harborChapter}
            title={VOYAGE_NARRATIVE.harborTitle}
            intro={VOYAGE_NARRATIVE.harborIntro}
            animate={!lite}
            className="mx-auto mb-6 max-w-5xl"
          />
          <CalendarRevealSection />
          </div>
        </section>

        <section id="timeline" className="island-defer scroll-mt-20 px-4 py-16 md:py-24">
          <VoyageSectionHeader
            chapter={VOYAGE_NARRATIVE.programChapter}
            title={VOYAGE_NARRATIVE.programTitle}
            intro={VOYAGE_NARRATIVE.programIntro}
            animate={!lite}
            className="mx-auto mb-4 max-w-3xl"
          />
          <Timeline animate={!lite} />
        </section>

        <section id="location" className="island-defer scroll-mt-20 px-4 py-16 md:py-24">
          <VoyageSectionHeader
            chapter={VOYAGE_NARRATIVE.berthChapter}
            title={VOYAGE_NARRATIVE.berthTitle}
            intro={VOYAGE_NARRATIVE.berthIntro}
            align="left"
            animate={!lite}
            className="mx-auto mb-10 max-w-5xl"
          />
          <div className="mx-auto max-w-5xl">
            <Suspense fallback={<div className="h-40 rounded-2xl bg-white/40" />}>
              <LocationInfo />
            </Suspense>
          </div>
        </section>

        <section id="line" className="scroll-mt-20 px-4 py-16 md:py-20">
          <div className="island-card mx-auto max-w-lg rounded-2xl p-8 text-center">
            <p className="island-section-label mb-2">{VOYAGE_NARRATIVE.contactChapter}</p>
            <h2 className="font-serif text-2xl text-[#1A3344]">{VOYAGE_NARRATIVE.contactTitle}</h2>
            <p className="mt-3 text-sm text-[#5A7380]">{VOYAGE_NARRATIVE.contactIntro}</p>
            {APP_CONTENT.lineLink ? (
              <a
                href={APP_CONTENT.lineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="island-btn mt-6 inline-flex px-8 py-3 text-sm font-medium"
              >
                加入 LINE 好友
              </a>
            ) : (
              <div className="mt-6 inline-flex rounded-full border border-dashed border-[#3A8FB7]/40 px-6 py-2.5 text-xs tracking-wider text-[#3A8FB7]">
                LINE 即將開放
              </div>
            )}
          </div>
        </section>

        <footer id="rsvp" className="scroll-mt-20 border-t border-[#3A8FB7]/15 bg-[#F4E8D8]/80 px-4 py-20 text-center">
          <p className="island-section-label mb-2">{VOYAGE_NARRATIVE.finaleChapter}</p>
          <h2 className="font-serif text-3xl text-[#1A3344] md:text-4xl">
            {VOYAGE_NARRATIVE.finaleTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#5A7380]">
            {VOYAGE_NARRATIVE.finaleIntro}
          </p>
          <div className="mt-8">
            <Link
              to="/rsvp"
              className="island-btn inline-flex px-12 py-3.5 text-sm font-semibold tracking-wide"
            >
              {VOYAGE_NARRATIVE.rsvpCta}
            </Link>
          </div>
          <p className="mt-16 font-serif text-sm text-[#1B4D6E]/70">
            {APP_CONTENT.chineseNames}
          </p>
          <p className="mt-1 font-display text-[10px] tracking-[0.3em] text-[#3A8FB7]/80">
            {APP_CONTENT.date} · DOULIU
          </p>
        </footer>
      </div>

      {/* Nav dock */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="island-blur flex items-center gap-1 rounded-full border border-white/70 p-1.5 shadow-lg">
              <button
                type="button"
                aria-label={isNavExpanded ? '收合選單' : '展開選單'}
                onClick={() => setIsNavExpanded((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#1B4D6E]"
              >
                {isNavExpanded ? <XIcon /> : <MenuIcon />}
              </button>
              <AnimatePresence>
                {isNavExpanded &&
                  navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = !item.isRoute && activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        aria-label={item.label}
                        onClick={() => {
                          if (item.isRoute) {
                            navigate('/rsvp');
                            return;
                          }
                          scrollTo(item.id);
                          setIsNavExpanded(false);
                        }}
                        className={`flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-2 text-xs ${
                          isActive
                            ? 'bg-[#1B4D6E] text-white'
                            : 'text-[#1B4D6E] hover:bg-[#F4E8D8]'
                        }`}
                      >
                        <Icon />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </motion.button>
                    );
                  })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating RSVP */}
      <AnimatePresence>
        {showRSVPButton && !isNavExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-5 z-40 md:right-8"
          >
            <Link
              to="/rsvp"
              className="island-btn flex items-center gap-2 px-5 py-3 text-sm font-medium shadow-lg"
            >
              <HeartIcon />
              {VOYAGE_NARRATIVE.rsvpCta}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}

export default App;
