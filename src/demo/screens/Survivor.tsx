import { useState } from "react";
import { actor, fmtTime, LINH_ID, LINH_NEW_ADDRESS, role, TAGS, type Tag } from "../engine";
import { useUnfound } from "../store";
import { Badge, describe, ScreenHead, SealedField, StatusBadge } from "../ui";

const SHARES: { service: "school" | "gp"; tag: Tag; note: string }[] = [
  { service: "school", tag: "addrzone", note: "Can confirm An is in the school zone" },
  { service: "gp", tag: "addrcontact", note: "Can reach you through a relay number" },
];

export function Survivor() {
  const { state, sealAddress, open, requestRevoke, rolesOf } = useUnfound();
  const [tab, setTab] = useState<"address" | "shares" | "looked">("address");
  const [values, setValues] = useState<Record<Tag, string>>({ ...LINH_NEW_ADDRESS });
  const [shown, setShown] = useState<Partial<Record<Tag, string>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rec = state.records.find((r) => r.id === LINH_ID)!;
  const sealed = !!rec.sealed.addrfull;

  const seal = async () => {
    setBusy(true);
    setError("");
    try {
      await sealAddress(LINH_ID, values);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reveal = async (t: Tag) => {
    if (shown[t]) return setShown((s) => ({ ...s, [t]: undefined }));
    try {
      const plain = await open(LINH_ID, t);
      setShown((s) => ({ ...s, [t]: plain }));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const timeline = state.log.filter((e) => e.subject === LINH_ID && e.actor !== "linh");
  const pendingAboutMe = state.requests.filter((c) => c.subject === LINH_ID && c.status === "PENDING");

  return (
    <div className="phone">
      <ScreenHead eyebrow="Linh · Survivor" title={sealed ? <>Your address is <b>sealed.</b></> : <>Seal your <b>new address.</b></>}>
        {sealed ? "Services can reach you. Nobody can look you up, including Unfound." : "It is encrypted on this phone before it goes anywhere."}
      </ScreenHead>

      <div className="tabs" role="tablist">
        {(["address", "shares", "looked"] as const).map((t) => (
          <button key={t} role="tab" className="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t === "address" ? "Address" : t === "shares" ? "Shares" : `Who looked${timeline.length ? ` · ${timeline.length}` : ""}`}
          </button>
        ))}
      </div>

      {error && <div className="notice dark">{error}</div>}

      {tab === "address" &&
        (!sealed ? (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              seal();
            }}
          >
            {(Object.keys(TAGS) as Tag[]).map((t) => (
              <div className="field" key={t}>
                <label htmlFor={`f-${t}`}>{TAGS[t].label}</label>
                <input id={`f-${t}`} value={values[t]} onChange={(e) => setValues((v) => ({ ...v, [t]: e.target.value }))} />
              </div>
            ))}
            <p className="muted" style={{ fontSize: 13 }}>Example data. Each line becomes its own sealed part, so a service can be given one part without the others.</p>
            <button className="btn" type="submit" disabled={busy}>{busy ? "Sealing…" : "Seal my address"}</button>
          </form>
        ) : (
          <div className="stack">
            {(Object.keys(TAGS) as Tag[]).map((t) => (
              <SealedField key={t} tag={t} ct={rec.sealed[t]?.ct}>
                {shown[t] && <div className="reveal">{shown[t]}</div>}
                <div>
                  <button className="btn ghost sm" onClick={() => reveal(t)}>{shown[t] ? "Hide" : "Show to me"}</button>
                </div>
              </SealedField>
            ))}
            {pendingAboutMe.length > 0 && (
              <div className="notice">
                <b>{pendingAboutMe.length} request{pendingAboutMe.length > 1 ? "s" : ""} about your address</b>
                <span className="muted" style={{ fontSize: 14 }}>Nothing opens until 2 of 3 independent approvers agree. You can see them under Who looked.</span>
              </div>
            )}
          </div>
        ))}

      {tab === "shares" && (
        <div className="list">
          {SHARES.map((s) => {
            const has = rolesOf(s.service).includes(role(s.tag, "selfdecrypt"));
            const pending = state.requests.find((c) => c.target === s.service && c.action === "REVOKE" && c.status === "PENDING");
            return (
              <div key={s.service} className="stack" style={{ gap: 8 }}>
                <div className="row between">
                  <b>{actor(s.service).name}</b>
                  {pending ? <StatusBadge status="PENDING" /> : has ? <Badge kind="approved">Shared</Badge> : <Badge kind="neutral">Withdrawn</Badge>}
                </div>
                <span className="muted" style={{ fontSize: 14 }}>{TAGS[s.tag].label} · {s.note}</span>
                {has && !pending && (
                  <div>
                    <button
                      className="btn outline sm"
                      onClick={() => requestRevoke({ target: s.service, tag: s.tag, subject: LINH_ID, reason: "Survivor withdrew consent" })}
                    >
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div className="muted" style={{ fontSize: 13 }}>Withdrawing is a governed change too, so nobody can quietly add a share back.</div>
        </div>
      )}

      {tab === "looked" && (
        <div className="list">
          {timeline.length === 0 ? (
            <div className="muted">Nobody has asked for your address yet.</div>
          ) : (
            timeline.map((e) => (
              <div key={e.id} className="row between" style={{ alignItems: "flex-start" }}>
                <div className="stack" style={{ gap: 2, minWidth: 0, flex: 1 }}>
                  <span>{describe(e)}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{fmtTime(e.at)} · {actor(e.actor).title}</span>
                </div>
                <Badge kind={e.result === "ok" ? "approved" : e.result === "denied" ? "denied" : "pending"}>
                  {e.result === "ok" ? "Done" : e.result === "denied" ? "Blocked" : "Pending"}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
