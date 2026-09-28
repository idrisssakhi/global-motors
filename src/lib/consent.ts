'use client';

import { useSyncExternalStore } from 'react';
import { SITE } from './site';

/**
 * Cookie / tracker consent (CNIL guidelines).
 * The site sets no analytics or advertising cookies. The only optional
 * category is "external": third-party embeds (OpenStreetMap map, YouTube
 * videos) that receive the visitor's IP address and may store data.
 * They are never loaded before the visitor opts in.
 *
 * The choice itself is stored in localStorage (exempt from consent: it only
 * records the choice) and expires after SITE.consentMaxAgeMonths.
 */
export interface Consent {
  external: boolean;
  /** ISO date of the choice. */
  at: string;
}

const KEY = 'skh-consent-v1';
const EVENT = 'skh-consent-change';
const OPEN_EVENT = 'skh-consent-open';
const MAX_AGE_MS = SITE.consentMaxAgeMonths * 30.5 * 24 * 3600 * 1000;

let cachedRaw: string | null | undefined;
let cached: Consent | null = null;

function read(): Consent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cached; // storage blocked: in-memory choice (see saveConsent)
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Consent;
      if (Date.now() - new Date(parsed.at).getTime() < MAX_AGE_MS) cached = parsed;
    } catch {
      /* corrupted value — treated as no choice */
    }
  }
  return cached;
}

export function saveConsent(external: boolean) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ external, at: new Date().toISOString() }));
  } catch {
    /* storage blocked: the choice only lasts for this page view */
    cachedRaw = undefined;
    cached = { external, at: new Date().toISOString() };
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** Current choice, or null when the visitor has not decided (always null on the server). */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function hasConsentChoice(): boolean {
  return read() !== null;
}

/** Opens the cookie preferences dialog (footer link, embed placeholders). */
export function openConsentDialog() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentDialogOpen(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}
