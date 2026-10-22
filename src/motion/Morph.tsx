import { useEffect, useState, type CSSProperties } from "react";
import { play } from "./sfx";

// Page change, born from the button you pressed: the button's own shape swells into a full-screen
// sheet (a lam layer chasing a black one, corners easing from pill to square), the mark pops in,
// then the two sheets lift off the new page one after the other.
// Any link marked data-sfx="whoosh" triggers it.

type Phase = { rect: { t: number; r: number; b: number; l: number; radius: number }; stage: "cover" | "reveal"; id: number };

export function Morph() {
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    let timers: number[] = [];
    const onDown = (ev: PointerEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>('a[data-sfx="whoosh"]');
      if (!el || ev.button !== 0) return;
      const href = el.getAttribute("href") ?? "";
      if (href.split("?")[0] === window.location.pathname) return; // same page, no transition
      const b = el.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 6;
      timers.forEach(clearTimeout);
      const id = Date.now();
      setPhase({ id, stage: "cover", rect: { t: b.top, r: window.innerWidth - b.right, b: window.innerHeight - b.bottom, l: b.left, radius } });
      timers = [
        window.setTimeout(() => play("pop"), 420),
        window.setTimeout(() => setPhase((p) => (p && p.id === id ? { ...p, stage: "reveal" } : p)), 900),
        window.setTimeout(() => setPhase((p) => (p && p.id === id ? null : p)), 1800),
      ];
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!phase) return null;
  const { rect, stage } = phase;
  const vars = {
    "--t": `${rect.t}px`,
    "--r": `${rect.r}px`,
    "--b": `${rect.b}px`,
    "--l": `${rect.l}px`,
    "--rad": `${rect.radius}px`,
  } as CSSProperties;
  return (
    <div className={`morph ${stage}`} style={vars} aria-hidden="true" key={phase.id}>
      <div className="morph-layer lam" />
      <div className="morph-layer ink" />
      <svg className="morph-mark" width="64" height="64" viewBox="0 0 64 64">
        <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" pathLength={1} />
        <circle cx="32" cy="28" r="5.5" fill="#fff" />
      </svg>
    </div>
  );
}
