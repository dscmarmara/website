"use client";

import { useSyncExternalStore } from "react";

/**
 * TEMPORARY preview-only switches toggled from the dev options bar (e.g. the
 * About page's department-handoff section). Stored per browser in
 * localStorage, so a switch stays on while navigating; the server always
 * renders them off, which keeps static pages and hydration intact.
 */
export type DevFlag = "flow";

const EVENT = "dsc-dev-flags";
const storageKey = (flag: DevFlag) => `dsc-dev:${flag}`;

function read(flag: DevFlag): boolean {
  try {
    return window.localStorage.getItem(storageKey(flag)) === "1";
  } catch {
    return false; // storage blocked (private mode etc.): treat as off
  }
}

export function setDevFlag(flag: DevFlag, on: boolean): void {
  try {
    if (on) window.localStorage.setItem(storageKey(flag), "1");
    else window.localStorage.removeItem(storageKey(flag));
  } catch {
    // storage blocked: nothing to persist
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDevFlag(flag: DevFlag): boolean {
  return useSyncExternalStore(subscribe, () => read(flag), () => false);
}
