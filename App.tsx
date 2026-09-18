import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IslandScrollHero } from './components/island/IslandScrollHero';
import { CalendarRevealSection } from './components/CalendarRevealSection';
import { Timeline } from './components/Timeline';
import { LoadingScreen } from './components/LoadingScreen';
import { APP_CONTENT } from './constants';
import { useIsMobile } from './hooks/useIsMobile';
import { usePerfMode } from './hooks/usePerfMode';

const FeaturedPhotos = lazy(() =>
  import('./components/island/FeaturedPhotos').then((m) => ({ default: m.FeaturedPhotos }))
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
  const lite = perf === 'low';
  const isNavigatingRef = useRef(false);

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(100);
  const [showNav, setShowNav] = useState(false);
  const [showRSVPButton, setShowRSVPButton] = useState(false);
  const [activeSection, setActiveSection] = useState('timeline');
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isInitialLoading) return;
    let progress = 0;
    let cancelled = false;
    // Don't restart when lite/isMobile flips — that was resetting to 0% and sticking
    const step = 20;
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + step);
      if (cancelled) return;
      setLoadingProgress(progress);
      if (progress >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => {
          if (cancelled) return;
          setIsInitialLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, 280);
      }
    }, 50);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isInitialLoading]);

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
      const y = window.scrollY;
      setShowNav(y > window.innerHeight * 0.85);
      setShowRSVPButton(y > window.innerHeight * 1.2);

      if (isNavigatingRef.current) return;
      const sections = ['timeline', 'location', 'photos', 'line'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
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
    { id: 'timeline', icon: ClockIcon, label: '流程' },
    { id: 'location', icon: PinIcon, label: '地點' },
    { id: 'photos', icon: CameraIcon, label: '精選' },
    { id: 'rsvp', icon: HeartIcon, label: 'RSVP', isRoute: true },
  ];

  return (
    <main className="w-full min-h-screen bg-transparent text-[#1A3344] selection:bg-[#E8A87C] selection:text-white">
      <AnimatePresence>
        {isInitialLoading && (
          <LoadingScreen
            progress={loadingProgress}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <IslandScrollHero />

        {/* Sand canvas for everything below the ocean hero */}
        <div className="bg-[#F4E8D8]">
        {/* Countdown bar — static on low-end (no infinite marquee paint) */}
        <div
          id="sticky-marquee"
          className="island-blur sticky top-0 z-30 overflow-hidden border-y border-[#3A8FB7]/15"
        >
          {lite ? (
            <div className="flex justify-center gap-3 px-4 py-2.5 text-center text-xs tracking-wider text-[#1B4D6E] font-display">
              <span>{APP_CONTENT.date}</span>
              <span className="text-[#E8A87C]">✦</span>
              <span>倒數 {timeLeft.days} 天</span>
            </div>
          ) : (
            <div className="flex animate-[marquee_36s_linear_infinite] whitespace-nowrap py-2.5 text-xs tracking-widest text-[#1B4D6E]">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="mx-8 inline-flex items-center gap-3 font-display">
                  <span>{APP_CONTENT.date}</span>
                  <span className="text-[#E8A87C]">✦</span>
                  <span>
                    {String(timeLeft.days).padStart(2, '0')}天{' '}
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[#E8A87C]">✦</span>
                  <span>
                    {APP_CONTENT.venueName} · {APP_CONTENT.venueHall}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        <CalendarRevealSection />

        <section id="timeline" className="island-defer scroll-mt-20 px-4 py-16 md:py-24">
          <div className="mx-auto mb-4 max-w-3xl text-center">
            <p className="island-section-label mb-2">01 / Program</p>
            <h2 className="font-serif text-3xl text-[#1A3344] md:text-4xl">婚禮流程</h2>
            <p className="mt-3 text-sm text-[#5A7380]">
              誠摯邀請您共度這美好的午後時光。
            </p>
          </div>
          <Timeline />
        </section>

        <section id="location" className="island-defer scroll-mt-20 px-4 py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-5xl text-center md:text-left">
            <p className="island-section-label mb-2">02 / Venue</p>
            <h2 className="font-serif text-3xl text-[#1A3344] md:text-4xl">交通資訊</h2>
          </div>
          <div className="mx-auto max-w-5xl">
            <Suspense fallback={<div className="h-40 rounded-2xl bg-white/40" />}>
              <LocationInfo />
            </Suspense>
          </div>
        </section>

        <section id="photos" className="island-defer scroll-mt-20 px-4 py-16 md:py-24">
          <div className="mx-auto mb-10 max-w-5xl">
            <p className="island-section-label mb-2">03 / Moments</p>
            <h2 className="font-serif text-3xl text-[#1A3344] md:text-4xl">精選瞬間</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5A7380]">
              島嶼航線上的幾個片段。正式照片上傳後會替換這裡的占位圖。
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <Suspense fallback={<div className="h-48 rounded-2xl bg-white/40" />}>
              <FeaturedPhotos />
            </Suspense>
          </div>
        </section>

        <section id="line" className="scroll-mt-20 px-4 py-16 md:py-20">
          <div className="island-card mx-auto max-w-lg rounded-2xl p-8 text-center">
            <p className="island-section-label mb-2">04 / Contact</p>
            <h2 className="font-serif text-2xl text-[#1A3344]">聯絡我們</h2>
            <p className="mt-3 text-sm text-[#5A7380]">
              LINE 連結待補。有問題歡迎之後透過官方帳號聯繫。
            </p>
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

        <footer className="border-t border-[#3A8FB7]/15 bg-[#F4E8D8]/80 px-4 py-20 text-center">
          <p className="font-display text-[10px] tracking-[0.4em] text-[#3A8FB7]">RSVP</p>
          <h2 className="mt-3 font-serif text-3xl text-[#1A3344]">出席回函</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#5A7380]">
            您的蒞臨將是我們最大的榮幸。請盡早確認出席，讓我們好好準備。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/rsvp"
              className="island-btn inline-flex px-10 py-3.5 text-sm font-semibold tracking-wide"
            >
              填寫出席回函
            </Link>
            <Link
              to="/invitation"
              className="inline-flex rounded-full border border-[#1B4D6E]/25 px-8 py-3.5 text-sm text-[#1B4D6E] transition-colors hover:bg-white/60"
            >
              查看電子喜帖
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
              出席回函
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
