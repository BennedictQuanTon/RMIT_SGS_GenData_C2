import { useEffect } from "react";
import Lenis from "lenis";

// One Lenis instance for the whole app. Inertia-smoothed wheel scrolling on desktop;
// touch devices keep native scrolling, which is already smooth and never fights the finger.
export let lenis: Lenis | null = null;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -72 }, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
