import { actor, fmtTime, type ActorId } from "../engine";
import { useUnfound } from "../store";
import { Quorum, ScreenHead, StatusBadge } from "../ui";

export function Approver({ who }: { who: ActorId }) {
  const { state, approve, deny } = useUnfound();
  const open = state.requests.filter((c) => c.status === "PENDING");
  const closed = state.requests.filter((c) => c.status !== "PENDING");
  const me = actor(who);

  return (
    <>
      <ScreenHead eyebrow={`${me.name} · ${me.title}`} title={<>Approvals <b>inbox.</b></>}>
        You are one of three independent realm admins. Any change to who can open an address needs two of you.
      </ScreenHead>

      {open.length === 0 ? (
        <div className="notice">No pending requests.</div>
      ) : (
        <div className="stack" style={{ gap: 16 }}>
          {open.map((c) => {
            const voted = c.approvals.includes(who) || c.denials.includes(who);
            const selfGrant = c.target === c.requestedBy;
            return (
              <article key={c.id} className="card stack" data-demo={`card-${c.id}`} style={{ gap: 14 }}>
                <div className="row between">
                  <b className="mono">{c.id}</b>
                  <StatusBadge status={c.status} />
                </div>
                <dl className="kv">
                  <dt>Requested by</dt><dd>{actor(c.requestedBy).name} · {actor(c.requestedBy).title}</dd>
                  <dt>Change</dt><dd>{c.action === "GRANT" ? "Give" : "Remove"} <span className="mono">{c.role}</span> {c.action === "GRANT" ? "to" : "from"} {actor(c.target).name}</dd>
                  <dt>About</dt><dd>{c.subject ? state.records.find((r) => r.id === c.subject)?.alias : "—"}</dd>
                  <dt>Reason</dt><dd>{c.reason}{c.oneTime ? " · one view, then revoked" : ""}</dd>
                  <dt>Created</dt><dd>{fmtTime(c.createdAt)}</dd>
                </dl>
                {selfGrant && (
                  <div className="notice">
                    <b>Self-grant</b>
                    <span className="muted" style={{ fontSize: 14 }}>The requester is asking to give this access to himself.</span>
                  </div>
                )}
                <Quorum cr={c} />
                <div className="row">
                  <button className="btn" data-demo={`approve-${c.id}`} onClick={() => approve(c.id)} disabled={voted}>Approve</button>
                  <button className="btn outline" data-demo={`deny-${c.id}`} onClick={() => deny(c.id)} disabled={voted}>Deny</button>
                  {voted && <span className="muted" style={{ fontSize: 13 }}>You voted {c.approvals.includes(who) ? "approve" : "deny"}.</span>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {closed.length > 0 && (
        <div className="stack">
          <span className="eyebrow">Closed</span>
          <div className="list" data-demo="closed">
            {closed.map((c) => (
              <div key={c.id} className="row between">
                <span><b className="mono">{c.id}</b> <span className="muted">{c.role} → {actor(c.target).name}</span></span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
