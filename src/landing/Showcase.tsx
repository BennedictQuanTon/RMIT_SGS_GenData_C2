import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Device } from "../ui/Device";
import { CHAPTERS, STORY } from "../demo/story";
import { unlockSfx } from "../motion/sfx";
import { ease } from "../motion/tokens";
import { Reveal, Words } from "../motion/primitives";

const DETAIL = [
  { body: "The new address is encrypted on the phone into three tagged parts. The server only ever stores ciphertext.", tide: "TideCloak doEncrypt · tag-based E2EE" },
  { body: "Each service holds a role for one tag. The school confirms the zone and never sees the street.", tide: "_tide_<tag>.selfdecrypt, checked by Tide's network" },
  { body: "An admin who grants himself access creates a change set. Alone, the commit returns 412.", tide: "Quorum-Enforced Governance · 2 of 3" },
  { body: "Police get one view after two independent approvers sign, then the role is removed.", tide: "Threshold-signed change sets · audit trail" },
];

const W = 1024, H = 640;

// How it works, shown with the product itself: the real demo runs inside the MacBook (an iframe
// on its own storage) and reports each scene back, so the chapter list follows along.
export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const near = useInView(section, { once: true, margin: "400px 0px" });
  const [scale, setScale] = useState(0.6);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [scene, setScene] = useState(-1);
  const chapter = scene >= 0 ? STORY[scene].chapter : -1;

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, [near]);

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== "unfound") return;
      if (e.data.type === "ready") setReady(true);
      if (e.data.type === "step") setScene(e.data.scene);
      if (e.data.type === "done") {
        setPlaying(false);
        setScene(-1);
      }
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  const send = (type: "play" | "stop") => frame.current?.contentWindow?.postMessage({ source: "unfound-landing", type }, window.location.origin);
  const start = () => {
    unlockSfx();
    send("play");
    setPlaying(true);
  };
  const stop = () => {
    send("stop");
    setPlaying(false);
    setScene(-1);
  };

  return (
    <section id="how" className="section" ref={section}>
      <div className="container">
        <div className="section-head">
          <Reveal><span className="eyebrow">How it works</span></Reveal>
          <h2><Words text="Watch the real app do it." /></h2>
          <Reveal delay={0.1}>
            <p>This is the prototype itself, running in the frame: the same screens, the same Tide operations, every sound. Press play with sound on.</p>
          </Reveal>
        </div>

        <div className="showcase">
          <ol className="sc-chapters">
            {CHAPTERS.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 0.06} className={`sc-ch ${chapter === i ? "on" : ""} ${chapter > i ? "past" : ""}`}>
                <span className="sc-n">0{i + 1}</span>
                <div className="sc-ch-body">
                  <h3>{c}</h3>
                  <AnimatePresence initial={false}>
                    {(chapter === i || (!playing && i === 0)) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }} style={{ overflow: "hidden" }}>
                        <p>{DETAIL[i].body}</p>
                        <p className="tide-line">{DETAIL[i].tide}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {chapter === i && <motion.span className="sc-ch-bar" layoutId="sc-ch-bar" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
              </Reveal>
            ))}
          </ol>

          <Reveal className="sc-stage" delay={0.1}>
            <Device kind="macbook" ref={screen} className="sc-device">
              {near && (
                <iframe
                  ref={frame}
                  src="/demo?embed=1"
                  title="Unfound prototype"
                  className="sc-frame"
                  style={{ width: W, height: H, transform: `scale(${scale})` }}
                  tabIndex={playing ? -1 : 0}
                />
              )}
              <AnimatePresence>
                {!playing && (
                  <motion.button
                    className="sc-play"
                    data-sfx="none"
                    onClick={start}
                    disabled={!ready}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
                    {ready ? "Play with sound" : "Loading the app…"}
                  </motion.button>
                )}
              </AnimatePresence>
            </Device>
            <div className="sc-caption" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={scene} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22 }}>
                  {scene >= 0 ? STORY[scene].caption : "Eight scenes, about seventy seconds, end to end."}
                </motion.p>
              </AnimatePresence>
              {playing && <button className="btn sm outline" onClick={stop}>Stop</button>}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
