import { useState } from "react";
import { motion } from "motion/react";
import { ScrambleIn } from "../../motion/primitives";
import { ease } from "../../motion/tokens";
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

      <div className="card stack compact-form">
        <div className="row between">
          <b>Request the full address</b>
          <span className="chips">
            <span className="chip">Linh N. · {LINH_ID}</span>
            <span className="chip mono">_tide_addrfull.selfdecrypt · one view</span>
          </span>
        </div>
        <div className="inline-field">
          <label htmlFor="pol-reason" className="sr-only">Reason</label>
          <input id="pol-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button
            className="btn"
            disabled={!sealed}
            data-demo="breakglass"
            onClick={() => requestGrant({ target: "officer", tag: "addrfull", subject: LINH_ID, reason, oneTime: true })}
          >
            Request break-glass
          </button>
        </div>
        {!sealed && <span className="muted" style={{ fontSize: 12 }}>Linh has not sealed an address yet.</span>}
      </div>

      {mine.length > 0 && (
        <div className="list">
          {mine.map((c) => (
            <div key={c.id} className="stack" data-demo="cr-officer" style={{ gap: 10 }}>
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
        <motion.div className="notice seal" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: ease.out }}>
          <b>Approved by quorum</b>
          <span style={{ fontSize: 14 }}>You can open this address once. The role is removed straight after.</span>
          <div><button className="btn" data-demo="open-once" onClick={view}>Open address (one time)</button></div>
        </motion.div>
      )}
      {address && (
        <div className="sealed-field" data-demo="revealed">
          <span className="eyebrow" style={{ background: "transparent", padding: 0 }}>Opened once · now revoked</span>
          <div className="reveal"><ScrambleIn text={address} /></div>
        </div>
      )}
      {err && <div className="notice dark mono" style={{ fontSize: 13 }}>{err}</div>}
    </>
  );
}
