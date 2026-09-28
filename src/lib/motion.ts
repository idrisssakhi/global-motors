import { useSyncExternalStore } from 'react';

/**
 * Site-wide "pause animations" preference (WCAG 2.2.2). Stored on
 * <html data-motion="paused"> so CSS loops stop (globals.css), mirrored to
 * localStorage, and exposed to JS (background videos) through a hook.
 */
const KEY = 'gm-motion';
const EVENT = 'gm-motion-change';

export function isMotionPaused(): boolean {
  return document.documentElement.dataset.motion === 'paused';
}

export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = 'paused';
  else delete document.documentElement.dataset.motion;
  try {
    localStorage.setItem(KEY, paused ? 'paused' : 'on');
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Re-applies the stored preference after a full page load. */
export function restoreMotionPreference() {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {}
  if (stored === 'paused' && !isMotionPaused()) setMotionPaused(true);
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, isMotionPaused, () => false);
}
