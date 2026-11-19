'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

/**
 * Phone-only bar pinned to the bottom of a car page: price + contact button.
 * It hides while the summary card (with the same buttons) is on screen.
 */
export function MobileCarBar({
  watchId,
  title,
  price,
  priceNote,
  whatsappHref,
  whatsappLabel,
  phoneHref,
  phoneLabel,
}: {
  watchId: string;
  title: string;
  price: string;
  priceNote?: string;
  whatsappHref?: string | null;
  whatsappLabel: string;
  phoneHref?: string | null;
  phoneLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  if (!whatsappHref && !phoneHref) return null;

  return (
    <div
      className={`car-bar fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-surface/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted">{title}</p>
          <p className="font-display text-lg font-semibold leading-tight text-white">
            {price}
            {priceNote && <span className="ms-1.5 text-[11px] font-normal text-muted">{priceNote}</span>}
          </p>
        </div>
        {phoneHref && (
          <a href={phoneHref} className="btn-ghost !p-3" aria-label={phoneLabel}>
            <Phone className="h-4 w-4" aria-hidden />
          </a>
        )}
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !py-3 text-sm">
            <MessageCircle className="h-4 w-4" aria-hidden /> {whatsappLabel}
          </a>
        )}
      </div>
    </div>
  );
}
