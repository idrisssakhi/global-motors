'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, type MotionStyle } from 'framer-motion';
import { useMotionPaused } from '@/lib/motion';

/**
 * Muted looping background video (decorative: hidden from assistive tech).
 * React doesn't serialise `muted` into the SSR markup, which makes some
 * browsers refuse autoplay — so we force it on the element and start playback
 * only while it is on screen. Stays on its first frame for reduced-motion
 * users and when animations are paused from the header (WCAG 2.2.2).
 */
export function AutoplayVideo({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: MotionStyle;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const paused = useMotionPaused();
  const still = Boolean(reduce) || paused;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    if (still) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  return (
    <motion.video
      ref={ref}
      src={src}
      className={className}
      style={style}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden
    />
  );
}
