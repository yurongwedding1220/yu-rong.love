import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FEATURED_PHOTOS, FeaturedPhoto } from '../../constants';
import { usePerfMode } from '../../hooks/usePerfMode';

export const FeaturedPhotos: React.FC = () => {
  const [active, setActive] = useState<FeaturedPhoto | null>(null);
  const lite = usePerfMode() === 'low';

  if (!FEATURED_PHOTOS.length) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {FEATURED_PHOTOS.map((photo, index) => {
          const body = (
            <>
              <img
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {photo.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1B4D6E]/70 to-transparent px-3 py-3 text-[10px] tracking-wider text-white/90">
                  {photo.caption}
                </span>
              )}
            </>
          );

          if (lite) {
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActive(photo)}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/70 bg-white/40 text-left shadow-sm"
              >
                {body}
              </button>
            );
          }

          return (
            <motion.button
              key={photo.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setActive(photo)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/70 bg-white/40 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A8FB7]"
            >
              <img
                src={`${import.meta.env.BASE_URL}${photo.src}`}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {photo.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1B4D6E]/70 to-transparent px-3 py-3 text-[10px] tracking-wider text-white/90">
                  {photo.caption}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1B4D6E]/88 p-4"
            onClick={() => setActive(null)}
          >
            <img
              src={`${import.meta.env.BASE_URL}${active.src}`}
              alt={active.alt}
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              aria-label="關閉"
              className="absolute right-5 top-5 rounded-full bg-white/20 px-3 py-1 text-sm text-white"
              onClick={() => setActive(null)}
            >
              關閉
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
