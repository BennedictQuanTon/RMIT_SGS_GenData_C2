import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Brand } from "../brand/Logo";
import { ACTORS, type ActorId } from "./engine";
import { mockFabric } from "./fabric";
import { LiveRoot, type LiveInfo } from "./live";
import { UnfoundProvider, useUnfound } from "./store";
import { FabricLog } from "./ui";
import { play, setMuted, unlockSfx, useMuted, type Sfx } from "../motion/sfx";
import { ease } from "../motion/tokens";
import type { LogEvent } from "./engine";
import { Admin } from "./screens/Admin";
import { Approver } from "./screens/Approver";
import { Police } from "./screens/Police";
import { Service } from "./screens/Service";
import { Survivor } from "./screens/Survivor";

const PERSONA_KEY = "unfound-demo-persona";

function Screen({ who }: { who: ActorId }) {
  switch (who) {
    case "linh": return <Survivor />;
    case "school": return <Service who="school" />;
    case "gp": return <Service who="gp" />;
    case "dan": return <Admin />;
    case "mai": return <Approver who="mai" />;
    case "ruth": return <Approver who="ruth" />;
    case "officer": return <Police />;
  }
}

// Every Tide operation has its own sound, so the demo can be followed with eyes closed.
function soundFor(e: LogEvent): Sfx | null {
  if (e.detail.includes("412")) return "blocked";
  if (e.result === "denied") return "denied";
  if (e.result === "pending") return "pending";
  if (e.op === "doEncrypt") return "seal";
  if (e.op === "commit" || e.op === "revoke") return "quorum";
  if (e.op === "authorize") return "approve";
  if (e.op === "doDecrypt") return "reveal";
  return null;
}

function useDemoSounds(log: LogEvent[]) {
  // Unlock audio on the first gesture, and give every button a tap.
  useEffect(() => {
    const down = (ev: PointerEvent) => {
      unlockSfx();
      const el = (ev.target as HTMLElement).closest<HTMLElement>("button, a");
      if (!el || (el as HTMLButtonElement).disabled) return;
      const kind = (el.dataset.sfx ?? "tap") as Sfx | "none";
      if (kind !== "none") play(kind);
    };
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, []);
  // Then a semantic sound for each new Tide operation (newest only, so bursts stay clean).
  const last = useRef(log[0]?.id ?? 0);
  useEffect(() => {
    const top = log[0];
    if (!top || top.id === last.current) return;
    last.current = top.id;
    const s = soundFor(top);
    if (s) window.setTimeout(() => play(s), 60);
  }, [log]);
}

function SoundToggle() {
  const muted = useMuted();
  return (
    <button className="btn ghost sm mute" data-sfx="none" onClick={() => setMuted(!muted)} aria-pressed={!muted} title="Sound effects">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
        {muted ? <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.4" /> : <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" strokeWidth="1.4" />}
      </svg>
      {muted ? "Sound off" : "Sound on"}
    </button>
  );
}

function Shell({ live }: { live?: LiveInfo }) {
  const { state, current, setCurrent, reset, fabric } = useUnfound();
  const pending = state.requests.filter((c) => c.status === "PENDING").length;
  useDemoSounds(state.log);

  return (
    <div className="app">
      <motion.header className="topbar" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: ease.out, delay: 0.35 }}>
        <div className="topbar-inner">
          <Brand />
          <span className={`badge ${fabric.mode === "live" ? "approved" : "neutral"}`}>{fabric.mode === "live" ? "Live · TideCloak" : "Demo · mock fabric"}</span>
          <div className="spacer" />
          {live ? (
            <div className="row">
              <span className="muted" style={{ fontSize: 13 }}>{live.authenticated ? `Signed in as ${live.username}` : live.initializing ? "Connecting to TideCloak…" : "Not signed in"}</span>
              {live.authenticated ? (
                <button className="btn outline sm" onClick={live.logout}>Switch user</button>
              ) : (
                <button className="btn sm" onClick={live.login}>Sign in with Tide</button>
              )}
            </div>
          ) : (
            <LayoutGroup id="personas">
            <nav className="personas" aria-label="Act as">
              {ACTORS.map((a, i) => (
                <motion.button
                  key={a.id}
                  className="persona-btn"
                  data-sfx="switch"
                  aria-pressed={current === a.id}
                  onClick={() => setCurrent(a.id)}
                  title={`${a.name} · ${a.title}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: ease.out, delay: 0.45 + i * 0.04 }}
                >
                  {current === a.id && <motion.span className="persona-pill" layoutId="persona-pill" transition={{ type: "spring", stiffness: 520, damping: 40 }} />}
                  <span className="avatar">{a.initials}</span>
                  <span>{a.name.split(" ")[0]}{(a.id === "mai" || a.id === "ruth") && pending ? ` · ${pending}` : ""}</span>
                </motion.button>
              ))}
            </nav>
            </LayoutGroup>
          )}
          <SoundToggle />
          <button className="btn ghost sm" data-sfx="hide" onClick={reset}>Reset demo</button>
        </div>
      </motion.header>
      <div className="workspace">
        <main className="screen">
          {live?.error && <div className="notice dark">TideCloak: {live.error}</div>}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              className="screen-body"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: ease.out } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.14, ease: ease.out } }}
            >
              <Screen who={current} />
            </motion.div>
          </AnimatePresence>
        </main>
        <FabricLog log={state.log} mode={fabric.mode} />
      </div>
    </div>
  );
}

function MockDemo() {
  const [current, setCurrent] = useState<ActorId>(() => {
    try {
      return (localStorage.getItem(PERSONA_KEY) as ActorId) || "linh";
    } catch {
      return "linh";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(PERSONA_KEY, current);
    } catch {
      /* ignore */
    }
  }, [current]);
  return (
    <UnfoundProvider fabric={mockFabric} current={current} setCurrent={setCurrent}>
      <Shell />
    </UnfoundProvider>
  );
}

// Live mode turns on when public/tidecloak.json exists and VITE_UNFOUND_MODE is not "mock".
export function Demo() {
  const [mode, setMode] = useState<"checking" | "mock" | "live">(import.meta.env.VITE_UNFOUND_MODE === "mock" ? "mock" : "checking");
  useEffect(() => {
    if (mode !== "checking") return;
    fetch("/tidecloak.json", { cache: "no-store" })
      .then(async (r) => {
        const ok = r.ok && (r.headers.get("content-type") ?? "").includes("json");
        setMode(ok ? "live" : "mock");
      })
      .catch(() => setMode("mock"));
  }, [mode]);

  if (mode === "checking") return null;
  if (mode === "mock") return <MockDemo />;
  return (
    <LiveRoot>
      {({ fabric, current, setCurrent, live }) => (
        <UnfoundProvider fabric={fabric} current={current} setCurrent={setCurrent}>
          <Shell live={live} />
        </UnfoundProvider>
      )}
    </LiveRoot>
  );
}
