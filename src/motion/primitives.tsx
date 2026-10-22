import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ease } from "./tokens";

// Fades and lifts its children into place the first time they scroll into view.
export function Reveal({ children, delay = 0, y = 12, className, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "article" | "li" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: ease.out, delay }}
    >
      {children}
    </M>
  );
}

// Headline whose words rise out of a mask. "*word*" renders at weight 600.
// mode "mount" plays when `play` turns true; mode "view" plays on scroll into view.
export function Words({ text, mode = "view", play = true, delay = 0, stagger = 0.035, className }: { text: string; mode?: "mount" | "view"; play?: boolean; delay?: number; stagger?: number; className?: string }) {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null); // "*word*" markers are kept for copy, Clutch sets the whole heading at 600
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const go = mode === "mount" ? play : inView;
  return (
    <span ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((w, i) => {
        const label = w.replace(/\*/g, "");
        return (
          <Fragment key={i}>
            <motion.span
              aria-hidden="true"
              style={{ display: "inline-block" }}
              initial={{ opacity: 0, y: "0.18em", scale: 0.98 }}
              animate={go ? { opacity: 1, y: "0em", scale: 1 } : undefined}
              transition={{ duration: 0.7, ease: ease.out, delay: delay + i * stagger }}
            >
              {label}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

// Counts up to the value once visible. Text is final at rest and before hydration.
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", comma = false }: { value: number; decimals?: number; prefix?: string; suffix?: string; comma?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (v: number) => {
    const n = v.toFixed(decimals);
    return prefix + (comma ? Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n) + suffix;
  };
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (reduce || !ref.current) return;
    if (!inView) {
      if (!started) ref.current.textContent = fmt(0);
      return;
    }
    setStarted(true);
    const node = ref.current;
    const c = animate(0, value, { duration: 1.6, ease: ease.outExpo, onUpdate: (v) => (node.textContent = fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);
  return <span ref={ref}>{fmt(value)}</span>;
}

// Adds "in" once the element is a third visible. CSS does the rest (cheap for many children).
export function useInClass<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView ? "in" : ""] as const;
}

// Text that decodes from random glyphs into its final value whenever it changes.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export function Scramble({ text, duration = 520, className }: { text: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const prev = useRef<string | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce || prev.current === null || prev.current === text) {
      prev.current = text;
      node.textContent = text;
      return;
    }
    prev.current = text;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      node.textContent = out;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, reduce]);
  return <span ref={ref} className={className}>{text}</span>;
}

// Scramble that plays on mount (used when a value first appears).
export function ScrambleIn({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(() => text.replace(/[^ ]/g, "·"));
  useEffect(() => setShown(text), [text]);
  return <Scramble text={shown} className={className} />;
}

// Scroll-linked word highlighting: each word brightens as the section passes.
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <h2 ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((w, i) => (
        <ScrollWord key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} last={i === words.length - 1} />
      ))}
    </h2>
  );
}

function ScrollWord({ word, progress, range, last }: { word: string; progress: MotionValue<number>; range: [number, number]; last: boolean }) {
  // Clutch's gray-to-black: each word goes from Stone to Obsidian as it passes.
  const color = useTransform(progress, range, ["#c9c9c9", "#000000"]);
  return (
    <span aria-hidden="true">
      <motion.span style={{ color }}>{word.replace(/\*/g, "")}</motion.span>
      {last ? "" : " "}
    </span>
  );
}
