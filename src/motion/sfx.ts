// UI sound effects through Web Audio: buffers are decoded once and played with no latency.
// Sounds: Kenney "Interface Sounds" (CC0), see public/sfx/LICENSE-kenney.txt.

import { useEffect, useSyncExternalStore } from "react";

export type Sfx = "tap" | "switch" | "seal" | "denied" | "blocked" | "pending" | "approve" | "quorum" | "reveal" | "hide" | "enter" | "pop" | "chime";

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
  pop: 0.55,
  chime: 0.3,
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
  // Lets the film recorder line sounds up with the footage.
  window.dispatchEvent(new CustomEvent("unfound-sfx", { detail: name }));
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

// Synthesised air: band-passed noise swept up (curtain rising) or down (curtain lifting).
// No file needed, and it can be shaped to the exact length of the motion it accompanies.
export function whoosh(direction: "up" | "down" = "up", seconds = 0.55, level = 0.22) {
  if (muted || !ctx || !master) return;
  const c = ctx;
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.9;
  const t = c.currentTime;
  const [from, to] = direction === "up" ? [380, 2600] : [2400, 420];
  band.frequency.setValueAtTime(from, t);
  band.frequency.exponentialRampToValueAtTime(to, t + seconds);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(level, t + seconds * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  src.connect(band).connect(gain).connect(master);
  src.start(t);
  src.stop(t + seconds);
}

// Browsers keep audio locked until the first gesture. Chrome lifts that for sites you have
// used before, so try once at load; if it stays locked, the first tap unlocks it.
export function tryAutoUnlock(): Promise<boolean> {
  const c = ensureContext();
  if (!c) return Promise.resolve(false);
  void load();
  if (c.state === "running") return Promise.resolve(true);
  return c.resume().then(
    () => (c.state as AudioContextState) === "running",
    () => false,
  );
}

// One app-wide handler: unlock audio on the first gesture and give every button and link a sound.
// data-sfx="none" silences an element, data-sfx="<name>" picks another sound, data-sfx="whoosh"
// marks links that change page.
export function useGlobalSfx() {
  useEffect(() => {
    const down = (ev: PointerEvent) => {
      unlockSfx();
      const el = (ev.target as HTMLElement).closest<HTMLElement>("button, a");
      if (!el || (el as HTMLButtonElement).disabled) return;
      const kind = el.dataset.sfx ?? "tap";
      if (kind === "none") return;
      if (kind === "whoosh") {
        play("tap");
        whoosh("up", 0.5);
        return;
      }
      play(kind as Sfx);
    };
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, []);
}
