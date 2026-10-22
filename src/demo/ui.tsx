import type { ReactNode } from "react";
import { actor, fmtTime, TAGS, THRESHOLD, type ChangeRequest, type CRStatus, type LogEvent, type Tag } from "./engine";

export function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" />
      <path d="M4 5V3.5a2 2 0 0 1 4 0V5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Badge({ kind, children }: { kind: "sealed" | "denied" | "pending" | "approved" | "neutral"; children: ReactNode }) {
  return (
    <span className={`badge ${kind}`}>
      {kind === "sealed" && <Lock />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: CRStatus }) {
  const map: Record<CRStatus, "pending" | "approved" | "denied" | "neutral"> = {
    PENDING: "pending",
    APPROVED: "approved",
    DENIED: "denied",
    USED: "neutral",
  };
  return <Badge kind={map[status]}>{status === "USED" ? "Used · revoked" : status}</Badge>;
}

export function Quorum({ cr }: { cr: ChangeRequest }) {
  return (
    <span className="row" style={{ gap: 8 }}>
      <span className="quorum" aria-label={`${cr.approvals.length} of ${THRESHOLD} approvals`}>
        {Array.from({ length: THRESHOLD }, (_, i) => (
          <i key={i} className={i < cr.approvals.length ? "on" : undefined} />
        ))}
      </span>
      <span className="muted" style={{ fontSize: 13 }}>
        {cr.approvals.length}/{THRESHOLD} approvals
      </span>
    </span>
  );
}

export function SealedField({ tag, ct, children }: { tag: Tag; ct?: string; children?: ReactNode }) {
  return (
    <div className="sealed-field">
      <div className="row between">
        <b style={{ fontSize: 14 }}>{TAGS[tag].label}</b>
        <Badge kind="sealed">Sealed</Badge>
      </div>
      <div className="ct">{ct ?? "not sealed yet"}</div>
      {children}
    </div>
  );
}

export function ScreenHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="screen-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children && <p className="muted">{children}</p>}
    </div>
  );
}

// Plain-language version of a log event, for the survivor's "Who looked" timeline.
export function describe(e: LogEvent): string {
  const who = actor(e.actor).name;
  const tag = (Object.keys(TAGS) as Tag[]).find((t) => e.detail.includes(t));
  const what = tag ? TAGS[tag].label.toLowerCase() : "your address";
  const cr = e.detail.match(/CR-\d+/)?.[0] ?? "a request";
  switch (e.op) {
    case "doEncrypt":
      return `${who} sealed ${tag ? what : "the address"}`;
    case "doDecrypt":
      return e.result === "ok" ? `${who} opened your ${what}` : `${who} tried to open your ${what} and was blocked`;
    case "assignRole":
      return `${who} asked for access to your ${what}`;
    case "removeRole":
      return `${who} asked to remove access to your ${what}`;
    case "authorize":
      return `${who} approved ${cr}`;
    case "deny":
      return `${who} denied ${cr}`;
    case "commit":
      return e.result === "ok" ? `Quorum reached on ${cr}, change applied` : e.detail.includes("412") ? `${who} tried to force a change and was blocked` : `${cr} closed without quorum`;
    case "revoke":
      return `Access removed after one use`;
    default:
      return `${who}: ${e.op}`;
  }
}

export function FabricLog({ log, mode }: { log: LogEvent[]; mode: "mock" | "live" }) {
  return (
    <aside className="log" aria-label="Fabric log">
      <div className="row between">
        <span className="eyebrow">Fabric log</span>
        <Badge kind={mode === "live" ? "approved" : "neutral"}>{mode === "live" ? "Live TideCloak" : "Mock fabric"}</Badge>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>Every Tide operation the app performs, newest first.</p>
      {log.length === 0 ? (
        <p className="muted" style={{ fontSize: 13 }}>Nothing yet. Start as Linh and seal the address.</p>
      ) : (
        <ol className="log-list">
          {log.map((e) => (
            <li key={e.id}>
              <span className="t">{fmtTime(e.at)} · {actor(e.actor).name}</span>
              <span>{e.op}</span>
              <span className="muted">{e.detail}</span>
              <span className={e.result === "ok" ? "r-ok" : e.result === "denied" ? "r-no" : "r-wait"}>
                {e.result === "ok" ? "OK" : e.result === "denied" ? "DENIED" : "PENDING"}
              </span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
