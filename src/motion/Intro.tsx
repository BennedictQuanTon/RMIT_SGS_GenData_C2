import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "./tokens";
import { lenis } from "./SmoothScroll";
import { play, tryAutoUnlock, whoosh } from "./sfx";


// The intro plays on every fresh page load (opening the app), and not again when you come back
// to the landing page from inside the app.
let played = false;
export function introSeen(): boolean {
  return played;
}

// First visit only: the mark draws itself, the wordmark rises, then the page is unveiled by a wipe.
// Click or any key skips it.
export function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"draw" | "out" | "gone">("draw");

  // Sound for the opening: soft air while the arch draws, a pop when the dot lands.
  // Plays only if the browser allows audio before a click (see README for recording).
  useEffect(() => {
    played = true;
    let pop = 0;
    tryAutoUnlock().then((ok) => {
      if (!ok) return;
      whoosh("up", 0.8, 0.08);
      pop = window.setTimeout(() => play("pop"), 600);
    });
    return () => window.clearTimeout(pop);
  }, []);

  useEffect(() => {
    // Listen for a skip only while the mark is drawing; afterwards clicks belong to the page.
    if (phase !== "draw") return;
    lenis?.stop();
    const t1 = setTimeout(() => setPhase("out"), 1250);
    const skip = () => setPhase("out");
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(t1);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    onDone(); // start the hero while the curtain lifts, so the two overlap
    whoosh("up", 0.85, 0.16);
    const t = setTimeout(() => {
      setPhase("gone");
      lenis?.start();
    }, 900);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          className="intro"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={phase === "out" ? { clipPath: "inset(0% 0% 100% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.85, ease: ease.inOut }}
          aria-hidden="true"
        >
          <motion.div
            className="intro-lockup"
            animate={phase === "out" ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <svg width="88" height="88" viewBox="0 0 64 64">
              <motion.path
                d="M16 60V28a16 16 0 0 1 32 0v32"
                fill="none"
                stroke="#000"
                strokeWidth="9"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.75, ease: ease.inOut }}
              />
              <motion.circle
                cx="32"
                cy="28"
                r="5.5"
                fill="#000"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 18, delay: 0.62 }}
                style={{ transformOrigin: "32px 28px" }}
              />
            </svg>
            <span className="intro-word">
              {"unfound".split("").map((c, i) => (
                <span className="word" key={i}>
                  <motion.span
                    style={{ display: "inline-block" }}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.45 + i * 0.035 }}
                  >
                    {c}
                  </motion.span>
                </span>
              ))}
            </span>
            <motion.span
              className="intro-tag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Be reached, not found.
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Black curtain between routes. Rises over the old page, then lifts off the new one.
export function Curtain() {
  return (
    <motion.div
      className="curtain"
      aria-hidden="true"
      initial={{ scaleY: 1, originY: 0 }}
      animate={{ scaleY: 0, originY: 0, transition: { duration: 0.6, ease: ease.inOut, delay: 0.08 } }}
      exit={{ scaleY: 1, originY: 1, transition: { duration: 0.5, ease: ease.inOut } }}
    >
      <motion.svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 0.2 } }}
        exit={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
      >
        <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" />
        <circle cx="32" cy="28" r="5.5" fill="#fff" />
      </motion.svg>
    </motion.div>
  );
}
