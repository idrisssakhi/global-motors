import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'ar', 'en'],
  defaultLocale: 'fr',
  // FR is served at "/", Arabic at "/ar", English at "/en".
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  ar: 'rtl',
  en: 'ltr',
};
