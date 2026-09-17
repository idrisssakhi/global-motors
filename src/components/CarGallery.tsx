'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { carImageUrl } from '@/lib/image';
import { Logo } from './Logo';

export function CarGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const urls = images.map(carImageUrl);
  const count = urls.length;

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, go]);

  if (count === 0) {
    return (
      <div className="grid aspect-[16/10] place-items-center rounded-3xl border border-white/[0.07] bg-surface opacity-40">
        <Logo variant="stacked" height={140} />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-surface"
        aria-label={alt}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={urls[active]} alt={`${alt} — ${active + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-4 end-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          {count > 1 && <span>{active + 1}/{count}</span>}
        </span>
      </button>

      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" data-lenis-prevent>
          {urls.map((u, i) => (
            <button
              key={u}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                i === active ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`${alt} — ${i + 1}`}
            >
              <Image src={u} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <Lightbox urls={urls} alt={alt} active={active} count={count} onClose={() => setOpen(false)} onNav={go} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({
  urls,
  alt,
  active,
  count,
  onClose,
  onNav,
}: {
  urls: string[];
  alt: string;
  active: number;
  count: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const btn = 'absolute z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20';

  return (
    <>
      <button type="button" onClick={onClose} className={`${btn} end-4 top-4`} aria-label="×">
        <X className="h-6 w-6" aria-hidden />
      </button>
      {count > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); onNav(-1); }} className={`${btn} start-3 sm:start-6`} aria-label="‹">
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" aria-hidden />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onNav(1); }} className={`${btn} end-3 sm:end-6`} aria-label="›">
            <ChevronRight className="h-6 w-6 rtl:rotate-180" aria-hidden />
          </button>
        </>
      )}
      <div
        className="relative h-full max-h-[85vh] w-full max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <Image key={active} src={urls[active]} alt={`${alt} — ${active + 1}`} fill sizes="92vw" className="object-contain" priority />
      </div>
    </>
  );
}
