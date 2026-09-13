'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { AutoplayVideo } from '@/components/AutoplayVideo';

/** A framed video that grows to full-bleed as it scrolls into view. */
export function VideoShowcase({
  src,
  eyebrow,
  title,
  text,
}: {
  src: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 0.42], [0.84, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.42], [36, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const textY = useTransform(scrollYProgress, [0.2, 0.55], [60, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section ref={ref} className="relative py-8">
      <motion.div
        style={reduce ? undefined : { scale, borderRadius: radius }}
        className="relative h-[88svh] min-h-[520px] overflow-hidden rounded-3xl will-change-transform"
      >
        <AutoplayVideo
          src={src}
          className="absolute inset-0 h-[120%] w-full -translate-y-[8%] object-cover"
          style={reduce ? undefined : { y: videoY }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/40 to-canvas/10" aria-hidden />
        <div className="absolute inset-0 bg-linear-to-r from-canvas/70 to-transparent rtl:bg-linear-to-l" aria-hidden />

        <motion.div
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
          className="container-x absolute inset-x-0 bottom-0 pb-14 sm:pb-20"
        >
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
