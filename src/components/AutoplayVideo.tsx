'use client';

import { useEffect, useRef } from 'react';
import { motion, type MotionStyle } from 'framer-motion';

/**
 * Muted looping background video. React doesn't serialise `muted` into the
 * SSR markup, which makes some browsers refuse autoplay — so we force it on
 * the element and start playback only while it is on screen.
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      aria-hidden
    />
  );
}
