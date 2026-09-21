import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_EVENTS } from '../constants';

const CocktailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75-.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const RingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
    <circle cx="9" cy="12" r="5" />
    <circle cx="15" cy="12" r="5" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

const getIcon = (index: number) => {
  if (index === 0) return <CocktailIcon />;
  if (index === 1) return <RingIcon />;
  return <CameraIcon />;
};

type TimelineProps = {
  animate?: boolean;
};

export const Timeline: React.FC<TimelineProps> = ({ animate = true }) => (
  <div className="relative w-full bg-transparent py-8 md:py-12">
    <div className="relative mx-auto max-w-3xl space-y-12">
      <div className="island-timeline-spine" aria-hidden />

      {TIMELINE_EVENTS.map((event, index) => {
        const isEven = index % 2 === 0;
        /* 手機最多 3 層 stagger，避免長清單卡頓 */
        const staggerDelay = Math.min(index, 2) * 0.08;
        const content = (
          <>
            <div
              className={`hidden w-1/2 md:block ${
                isEven ? 'pr-12 text-right' : 'pl-12 text-left'
              }`}
            >
              <span className="island-tabular font-display text-4xl font-light text-[#3A8FB7]/80">
                {event.time}
              </span>
            </div>

            <div className="absolute left-0 z-10 flex items-center justify-center md:left-1/2 md:-translate-x-1/2">
              <div className="island-timeline-dot flex h-14 w-14 items-center justify-center rounded-full border border-[#3A8FB7]/25 bg-[#F4E8D8] text-[#1B4D6E]">
                {getIcon(index)}
              </div>
            </div>

            <div className="w-full pl-20 md:w-1/2 md:pl-0">
              <div
                className={`relative ${isEven ? 'md:ml-12' : 'md:mr-12 md:text-right'}`}
              >
                <span className="island-tabular mb-2 block font-display text-2xl font-light text-[#3A8FB7] md:hidden">
                  {event.time}
                </span>
                <div className="island-card rounded-xl p-6 md:p-7">
                  <div className={`flex flex-col ${!isEven ? 'md:items-end' : ''}`}>
                    <span className="mb-1 font-display text-[11px] uppercase tracking-[0.22em] text-[#3A8FB7]">
                      {event.title}
                    </span>
                    <h3 className="island-heading mb-3 font-serif text-xl font-light text-[#1A3344] md:text-2xl">
                      {event.chineseTitle}
                    </h3>
                    <p className="island-prose text-left text-base md:text-[1.05rem]">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

        if (!animate) {
          return (
            <div
              key={index}
              className={`relative flex items-start gap-6 md:items-center md:gap-0 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {content}
            </div>
          );
        }

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.5, delay: staggerDelay, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex items-start gap-6 md:items-center md:gap-0 ${
              isEven ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {content}
          </motion.div>
        );
      })}
    </div>
  </div>
);
