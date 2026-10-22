import { useState } from "react";
import { LINH_ID, role } from "../engine";
import { useUnfound } from "../store";
import { Quorum, ScreenHead, StatusBadge } from "../ui";

export function Police() {
  const { state, requestGrant, open, rolesOf } = useUnfound();
  const [reason, setReason] = useState("Welfare check: school reports An absent for 3 days, no contact.");
  const [address, setAddress] = useState("");
  const [err, setErr] = useState("");
  const mine = state.requests.filter((c) => c.requestedBy === "officer");
  const canOpen = rolesOf("officer").includes(role("addrfull", "selfdecrypt"));
  const sealed = !!state.records.find((r) => r.id === LINH_ID)?.sealed.addrfull;

  const view = async () => {
    try {
      setAddress(await open(LINH_ID, "addrfull"));
      setErr("");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <>
      <ScreenHead eyebrow="Const. Reyes · Police" title={<>Break-glass, <b>with witnesses.</b></>}>
        Emergencies still work. They just need two independent people to agree, and the access ends after one view.
      </ScreenHead>

      <div className="card stack">
        <b>Request the full address</b>
        <div className="kv">
          <dt>Person</dt><dd>Linh N. · {LINH_ID}</dd>
          <dt>Access</dt><dd className="mono">_tide_addrfull.selfdecrypt · one view</dd>
        </div>
        <div className="field">
          <label htmlFor="pol-reason">Reason</label>
          <textarea id="pol-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div>
          <button
            className="btn"
            disabled={!sealed}
            onClick={() => requestGrant({ target: "officer", tag: "addrfull", subject: LINH_ID, reason, oneTime: true })}
          >
            Request break-glass
          </button>
        </div>
        {!sealed && <span className="muted" style={{ fontSize: 13 }}>Linh has not sealed an address yet.</span>}
      </div>

      {mine.length > 0 && (
        <div className="list">
          {mine.map((c) => (
            <div key={c.id} className="stack" style={{ gap: 10 }}>
              <div className="row between">
                <b className="mono">{c.id}</b>
                <StatusBadge status={c.status} />
              </div>
              <Quorum cr={c} />
              {c.status === "PENDING" && <span className="muted" style={{ fontSize: 14 }}>Waiting for Mai and Ruth. Switch to them to approve.</span>}
            </div>
          ))}
        </div>
      )}

      {canOpen && !address && (
        <div className="notice seal">
          <b>Approved by quorum</b>
          <span style={{ fontSize: 14 }}>You can open this address once. The role is removed straight after.</span>
          <div><button className="btn" onClick={view}>Open address (one time)</button></div>
        </div>
      )}
      {address && (
        <div className="sealed-field">
          <span className="eyebrow" style={{ background: "transparent", padding: 0 }}>Opened once · now revoked</span>
          <div className="reveal">{address}</div>
        </div>
      )}
      {err && <div className="notice dark mono" style={{ fontSize: 13 }}>{err}</div>}
    </>
  );
}
