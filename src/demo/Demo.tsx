import { useEffect, useState } from "react";
import { Brand } from "../brand/Logo";
import { ACTORS, type ActorId } from "./engine";
import { mockFabric } from "./fabric";
import { LiveRoot, type LiveInfo } from "./live";
import { UnfoundProvider, useUnfound } from "./store";
import { FabricLog } from "./ui";
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

function Shell({ live }: { live?: LiveInfo }) {
  const { state, current, setCurrent, reset, fabric } = useUnfound();
  const pending = state.requests.filter((c) => c.status === "PENDING").length;

  return (
    <div className="app">
      <header className="topbar">
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
            <nav className="personas" aria-label="Act as">
              {ACTORS.map((a) => (
                <button key={a.id} className="persona-btn" aria-pressed={current === a.id} onClick={() => setCurrent(a.id)} title={`${a.name} · ${a.title}`}>
                  <span className="avatar">{a.initials}</span>
                  <span>{a.name.split(" ")[0]}{(a.id === "mai" || a.id === "ruth") && pending ? ` · ${pending}` : ""}</span>
                </button>
              ))}
            </nav>
          )}
          <button className="btn ghost sm" onClick={reset}>Reset demo</button>
        </div>
      </header>
      <div className="workspace">
        <main className="screen">
          {live?.error && <div className="notice dark">TideCloak: {live.error}</div>}
          <Screen who={current} />
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
