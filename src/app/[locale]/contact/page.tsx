import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';

import { SITE, MAPS_URL, whatsappLink } from '@/lib/site';
import { pageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { LeadForm } from '@/components/LeadForm';
import { SocialLinks } from '@/components/SocialLinks';
import { FadeIn } from '@/components/FadeIn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return pageMeta(locale, '/contact', `${t('metaTitle')} — ${SITE.name}`, t('subtitle'));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tl, tc] = await Promise.all([getTranslations('contact'), getTranslations('lead'), getTranslations('common')]);
  const wa = whatsappLink();

  const items = [
    { icon: MapPin, label: t('address'), value: `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`, href: MAPS_URL },
    SITE.phone && { icon: Phone, label: t('phone'), value: SITE.phone, href: SITE.phoneHref },
    wa && { icon: MessageCircle, label: t('whatsapp'), value: SITE.phone || 'WhatsApp', href: wa },
    SITE.email && { icon: Mail, label: t('email'), value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, label: t('hours'), value: t('hoursValue'), href: null },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string | null }[];

  const { lat, lng } = SITE.address;
  const bbox = [lng - 0.012, lat - 0.006, lng + 0.012, lat + 0.006].join('%2C');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <section className="container-x py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {items.map((it, i) => {
              const inner = (
                <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-surface p-5 transition-colors hover:border-accent/25">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <it.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{it.label}</p>
                    <p className="mt-1 font-medium text-white" dir="auto">{it.value}</p>
                  </div>
                </div>
              );
              return (
                <FadeIn key={it.label} delay={i * 0.05}>
                  {it.href ? (
                    <a href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </FadeIn>
              );
            })}

            <FadeIn delay={0.25}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07]">
                <iframe
                  title={t('mapTitle')}
                  src={mapSrc}
                  loading="lazy"
                  className="h-72 w-full [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.6)_brightness(0.9)]"
                />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-gold absolute bottom-4 end-4 !px-4 !py-2 text-sm">
                  <Navigation className="h-4 w-4" aria-hidden />
                  {t('directions')}
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <SocialLinks className="pt-2" label={tc('followUs')} />
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="glass rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
              <LeadForm kind="contact" title={tl('titleContact')} />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
