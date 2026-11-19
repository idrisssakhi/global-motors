'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Download, Maximize, Maximize2, Minimize, X, ZoomIn, ZoomOut } from 'lucide-react';
import { carImageUrl } from '@/lib/image';
import { Logo } from './Logo';

interface Labels {
  photo: (i: number, n: number) => string;
  enlarge: string;
  prev: string;
  next: string;
}

export function CarGallery({ images, alt, sold = false }: { images: string[]; alt: string; sold?: boolean }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const locale = useLocale();
  const tc = useTranslations('car');
  const ts = useTranslations('status');
  const L: Labels = {
    photo: (index, count) => tc('photoOf', { index, count }),
    enlarge: tc('enlarge'),
    prev: tc('prevPhoto'),
    next: tc('nextPhoto'),
  };
  const rtl = locale === 'ar';
  const urls = images.map(carImageUrl);
  const count = urls.length;
  /** "{title} — photo 2 sur 8" (just the title when there is one photo). */
  const altFor = (i: number) => (count > 1 ? `${alt} — ${L.photo(i + 1, count)}` : alt);

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
      else if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, go, rtl]);

  if (count === 0) {
    return (
      <div className="grid aspect-[16/10] place-items-center rounded-3xl border border-white/[0.07] bg-surface opacity-40">
        <Logo variant="stacked" height={140} decorative />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-surface"
        aria-label={`${L.enlarge} — ${altFor(active)}`}
        aria-haspopup="dialog"
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
            <Image src={urls[active]} alt={altFor(active)} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        {sold && (
          <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35">
            <span className="-rotate-12 rounded-lg border-[3px] border-white bg-black/60 px-6 py-2 text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
              {ts('vendu')}
            </span>
          </span>
        )}
        <span aria-hidden className="absolute bottom-4 end-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
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
              aria-label={altFor(i)}
              aria-current={i === active ? 'true' : undefined}
            >
              <Image src={u} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <Lightbox urls={urls} altFor={altFor} labels={L} active={active} count={count} onClose={() => setOpen(false)} onNav={go} onJump={setActive} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MAX_ZOOM = 4;
const clampNum = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** "Peugeot 3008 2024 — photo 2 sur 8" → "peugeot-3008-2024-2.jpg" */
function downloadName(alt: string, index: number, url: string) {
  const ext = url.split('?')[0].match(/\.(jpe?g|png|webp|avif)$/i)?.[1]?.toLowerCase() ?? 'jpg';
  const base = alt
    .split(' — ')[0]
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'skh-global-motors'}-${index + 1}.${ext}`;
}

/**
 * Full-screen photo viewer: browser full screen, zoom (wheel, pinch,
 * double-click/tap, +/- buttons and keys), drag to pan, swipe to change
 * photo, thumbnails and download of the original file.
 */
function Lightbox({
  urls,
  altFor,
  labels,
  active,
  count,
  onClose,
  onNav,
  onJump,
}: {
  urls: string[];
  altFor: (i: number) => string;
  labels: Labels;
  active: number;
  count: number;
  onClose: () => void;
  onNav: (dir: number) => void;
  onJump: (i: number) => void;
}) {
  const t = useTranslations('nav');
  const tc = useTranslations('car');
  const closeRef = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  // Zoom state, tied to the photo index so it resets when the photo changes.
  const [view, setView] = useState({ photo: active, scale: 1, x: 0, y: 0 });
  const { scale, x, y } = view.photo === active ? view : { scale: 1, x: 0, y: 0 };
  const zoomed = scale > 1.01;
  // True while a finger / mouse is down, so the transform follows it without easing.
  const [dragging, setDragging] = useState(false);
  // Once a photo is zoomed past 1.5×, load the original file on top for sharp detail.
  const [hiRes, setHiRes] = useState<Record<number, boolean>>({});
  const [hiResLoaded, setHiResLoaded] = useState<Record<number, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canFullscreen = typeof document !== 'undefined' && !!document.fullscreenEnabled;

  /** Rendered (object-contain) size of the photo at scale 1. */
  const baseSize = useCallback(() => {
    const box = stage.current?.getBoundingClientRect();
    const el = img.current;
    if (!box) return { w: 0, h: 0, cw: 0, ch: 0 };
    if (!el?.naturalWidth) return { w: box.width, h: box.height, cw: box.width, ch: box.height };
    const k = Math.min(box.width / el.naturalWidth, box.height / el.naturalHeight);
    return { w: el.naturalWidth * k, h: el.naturalHeight * k, cw: box.width, ch: box.height };
  }, []);

  /** Zoom to `next` keeping the point (px, py) — relative to the stage centre — still. */
  const zoomTo = useCallback(
    (next: number | ((current: number) => number), px = 0, py = 0) => {
      setView((v) => {
        const cur = v.photo === active ? v : { photo: active, scale: 1, x: 0, y: 0 };
        const s = clampNum(typeof next === 'function' ? next(cur.scale) : next, 1, MAX_ZOOM);
        if (s > 1.5) queueMicrotask(() => setHiRes((h) => (h[active] ? h : { ...h, [active]: true })));
        if (s <= 1.01) return { photo: active, scale: 1, x: 0, y: 0 };
        const k = s / cur.scale;
        const { w, h, cw, ch } = baseSize();
        const mx = Math.max(0, (w * s - cw) / 2);
        const my = Math.max(0, (h * s - ch) / 2);
        return {
          photo: active,
          scale: s,
          x: clampNum(px - (px - cur.x) * k, -mx, mx),
          y: clampNum(py - (py - cur.y) * k, -my, my),
        };
      });
    },
    [active, baseSize]
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      setView((v) => {
        if (v.photo !== active || v.scale <= 1.01) return v;
        const { w, h, cw, ch } = baseSize();
        const mx = Math.max(0, (w * v.scale - cw) / 2);
        const my = Math.max(0, (h * v.scale - ch) / 2);
        return { ...v, x: clampNum(v.x + dx, -mx, mx), y: clampNum(v.y + dy, -my, my) };
      });
    },
    [active, baseSize]
  );

  /** Pointer position relative to the stage centre. */
  const fromCentre = (clientX: number, clientY: number) => {
    const box = stage.current!.getBoundingClientRect();
    return [clientX - box.left - box.width / 2, clientY - box.top - box.height / 2] as const;
  };

  // Browser full screen: enter on open (desktop), follow changes, leave on close.
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    const dialog = stage.current?.closest<HTMLElement>('[role="dialog"]');
    if (dialog && document.fullscreenEnabled && window.matchMedia('(pointer: fine)').matches) {
      dialog.requestFullscreen?.().catch(() => {});
    }
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const toggleFullscreen = () => {
    const dialog = stage.current?.closest<HTMLElement>('[role="dialog"]');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else dialog?.requestFullscreen?.().catch(() => {});
  };

  // Wheel / trackpad zoom (non-passive so the page does not scroll).
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const [px, py] = fromCentre(e.clientX, e.clientY);
      zoomTo((cur) => cur * Math.exp(-e.deltaY * 0.002), px, py);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [active, zoomTo]);

  // Keyboard: + / - / 0 zoom (arrows and Escape are handled by the gallery).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') zoomTo((cur) => cur * 1.5);
      else if (e.key === '-') zoomTo((cur) => cur / 1.5);
      else if (e.key === '0') zoomTo(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [zoomTo]);

  // Modal focus: move into the dialog, keep Tab inside, restore on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const close = closeRef.current;
    close?.focus();
    const dialog = close?.closest<HTMLElement>('[role="dialog"]');
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href]'));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, []);

  // Pointer gestures: drag to pan (zoomed), swipe to change photo (not zoomed),
  // pinch to zoom (two fingers), tap on the black area to close.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; moved: boolean; pinch?: number; pinchScale?: number }>({
    startX: 0,
    startY: 0,
    moved: false,
  });
  const lastTap = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = { startX: e.clientX, startY: e.clientY, moved: false };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { ...gesture.current, moved: true, pinch: Math.hypot(a.x - b.x, a.y - b.y), pinchScale: scale };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2 && g.pinch) {
      const [a, b] = [...pointers.current.values()];
      const [px, py] = fromCentre((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo((g.pinchScale ?? 1) * (Math.hypot(a.x - b.x, a.y - b.y) / g.pinch), px, py);
      return;
    }
    if (Math.abs(e.clientX - g.startX) + Math.abs(e.clientY - g.startY) > 6) g.moved = true;
    if (zoomed) panBy(e.clientX - prev.x, e.clientY - prev.y);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) return;
    setDragging(false);
    if (g.pinch) {
      gesture.current = { startX: 0, startY: 0, moved: false };
      return;
    }
    const dx = e.clientX - g.startX;
    if (g.moved) {
      if (!zoomed && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - g.startY)) onNav(dx < 0 ? 1 : -1);
      return;
    }
    // Tap / click.
    const now = Date.now();
    const [px, py] = fromCentre(e.clientX, e.clientY);
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      zoomTo(zoomed ? 1 : 2.5, px, py);
      return;
    }
    lastTap.current = now;
    const { w, h } = baseSize();
    const onPhoto = Math.abs(px - x) <= (w * scale) / 2 && Math.abs(py - y) <= (h * scale) / 2;
    if (!onPhoto && !zoomed) {
      const at = now;
      setTimeout(() => lastTap.current === at && onClose(), 300);
    }
  };

  const btn =
    'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:cursor-default disabled:opacity-40';
  const src = urls[active];

  return (
    <div className="absolute inset-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 bg-linear-to-b from-black/70 to-transparent p-3 sm:p-4">
        {count > 1 && (
          <p className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white tabular-nums">
            {active + 1} / {count}
          </p>
        )}
        <div className="ms-auto flex items-center gap-2">
          <button type="button" onClick={() => zoomTo((cur) => cur / 1.5)} disabled={!zoomed} className={btn} aria-label={tc('zoomOut')} title={tc('zoomOut')}>
            <ZoomOut className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => zoomTo((cur) => cur * 1.5)} disabled={scale >= MAX_ZOOM} className={btn} aria-label={tc('zoomIn')} title={tc('zoomIn')}>
            <ZoomIn className="h-5 w-5" aria-hidden />
          </button>
          <a href={src} download={downloadName(altFor(active), active, src)} className={btn} aria-label={tc('download')} title={tc('download')}>
            <Download className="h-5 w-5" aria-hidden />
          </a>
          {canFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`${btn} max-sm:hidden`}
              aria-label={isFullscreen ? tc('exitFullscreen') : tc('fullscreen')}
              title={isFullscreen ? tc('exitFullscreen') : tc('fullscreen')}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" aria-hidden /> : <Maximize className="h-5 w-5" aria-hidden />}
            </button>
          )}
          <button ref={closeRef} type="button" onClick={onClose} className={btn} aria-label={t('close')} title={t('close')}>
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      {/* Photo */}
      <div
        ref={stage}
        className={`relative min-h-0 flex-1 touch-none overflow-hidden select-none ${zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <Image
            ref={img}
            key={active}
            src={src}
            alt={altFor(active)}
            fill
            sizes="100vw"
            className="pointer-events-none object-contain"
            draggable={false}
            priority
          />
          {hiRes[active] && (
            // Original file, only fetched once the visitor zooms in.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`hi-${active}`}
              src={src}
              alt=""
              aria-hidden
              draggable={false}
              onLoad={() => setHiResLoaded((h) => ({ ...h, [active]: true }))}
              className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${hiResLoaded[active] ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>

        {count > 1 && (
          <>
            <button type="button" onClick={() => onNav(-1)} className={`${btn} absolute top-1/2 start-3 z-10 -translate-y-1/2 sm:start-6`} aria-label={labels.prev}>
              <ChevronLeft className="h-6 w-6 rtl:rotate-180" aria-hidden />
            </button>
            <button type="button" onClick={() => onNav(1)} className={`${btn} absolute top-1/2 end-3 z-10 -translate-y-1/2 sm:end-6`} aria-label={labels.next}>
              <ChevronRight className="h-6 w-6 rtl:rotate-180" aria-hidden />
            </button>
          </>
        )}
        <p className="sr-only" aria-live="polite">{labels.photo(active + 1, count)}</p>
      </div>

      {/* Thumbnails (hidden while zoomed to give the photo all the room) */}
      {count > 1 && !zoomed && (
        <div className="no-scrollbar flex shrink-0 justify-center gap-2 overflow-x-auto bg-black/60 p-2 sm:p-3" data-lenis-prevent>
          {urls.map((u, i) => (
            <button
              key={u}
              type="button"
              onClick={() => onJump(i)}
              className={`relative aspect-[4/3] w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all sm:w-20 ${
                i === active ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
              aria-label={altFor(i)}
              aria-current={i === active ? 'true' : undefined}
            >
              <Image src={u} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
