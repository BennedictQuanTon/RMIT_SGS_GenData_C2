// UI sound effects through Web Audio: buffers are decoded once and played with no latency.
// Sounds: Kenney "Interface Sounds" (CC0), see public/sfx/LICENSE-kenney.txt.

import { useSyncExternalStore } from "react";

export type Sfx = "tap" | "switch" | "seal" | "denied" | "blocked" | "pending" | "approve" | "quorum" | "reveal" | "hide" | "enter";

const VOLUME: Record<Sfx, number> = {
  tap: 0.35,
  switch: 0.4,
  seal: 0.5,
  denied: 0.45,
  blocked: 0.55,
  pending: 0.4,
  approve: 0.45,
  quorum: 0.5,
  reveal: 0.35,
  hide: 0.3,
  enter: 0.35,
};

const MUTE_KEY = "unfound-sfx-muted";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers = new Map<Sfx, AudioBuffer>();
let loading: Promise<void> | null = null;
let muted = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
})();
const listeners = new Set<() => void>();

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  return ctx;
}

function load(): Promise<void> {
  if (loading) return loading;
  const c = ensureContext();
  if (!c) return Promise.resolve();
  loading = Promise.all(
    (Object.keys(VOLUME) as Sfx[]).map(async (name) => {
      try {
        const res = await fetch(`/sfx/${name}.mp3`);
        buffers.set(name, await c.decodeAudioData(await res.arrayBuffer()));
      } catch {
        /* a missing sound never breaks the UI */
      }
    }),
  ).then(() => undefined);
  return loading;
}

// Browsers only allow audio after a user gesture. Call this from the first pointerdown.
export function unlockSfx() {
  const c = ensureContext();
  if (c?.state === "suspended") void c.resume();
  void load();
}

export function play(name: Sfx) {
  if (muted || !ctx || !master) return;
  const buf = buffers.get(name);
  if (!buf) return;
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  gain.gain.value = VOLUME[name];
  // A touch of pitch variation keeps repeated taps from sounding mechanical.
  src.playbackRate.value = name === "tap" || name === "switch" ? 0.96 + Math.random() * 0.08 : 1;
  src.buffer = buf;
  src.connect(gain).connect(master);
  src.start();
}

export function setMuted(v: boolean) {
  muted = v;
  try {
    localStorage.setItem(MUTE_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useMuted(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => muted,
  );
}
