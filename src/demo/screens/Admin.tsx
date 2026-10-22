import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Scramble } from "../../motion/primitives";
import { ease } from "../../motion/tokens";
import { actor, LINH_ID, shortCt, THRESHOLD, type Tag } from "../engine";
import { QuorumError, useUnfound } from "../store";
import { Badge, Quorum, ScreenHead, StatusBadge } from "../ui";
import { LiveAdminPanel } from "../live";

const COLS: Tag[] = ["addrfull", "addrzone", "addrcontact"];

export function Admin() {
  const { state, requestGrant, approve, commit, open, fabric } = useUnfound();
  const [tab, setTab] = useState<"db" | "roles">("db");
  const [legacy, setLegacy] = useState(false);
  const [blocked, setBlocked] = useState("");
  const [openErr, setOpenErr] = useState("");
  const [reason, setReason] = useState("Routine access review");

  const mine = state.requests.filter((c) => c.requestedBy === "dan");

  const tryCommit = (id: string) => {
    try {
      commit(id);
      setBlocked("");
    } catch (e) {
      if (e instanceof QuorumError) setBlocked(`412 QUORUM_NOT_MET · ${e.have} of ${e.need} approvals. The change was not applied.`);
    }
  };

  const tryOpen = async () => {
    try {
      await open(LINH_ID, "addrfull");
    } catch (e) {
      setOpenErr((e as Error).message);
    }
  };

  return (
    <>
      <ScreenHead eyebrow={`${actor("dan").name} · ${actor("dan").title}`} title={<>Full admin rights. <b>No key.</b></>}>
        Dan runs the agency's systems. In this story he is also a friend of Linh's ex-partner.
      </ScreenHead>

      <div className="tabs" role="tablist">
        {(["db", "roles"] as const).map((t) => (
          <button key={t} role="tab" className="tab" data-sfx="switch" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t === "db" ? "Database" : "Roles"}
            {tab === t && <motion.span className="tab-line" layoutId="tab-dan" transition={{ type: "spring", stiffness: 520, damping: 40 }} />}
          </button>
        ))}
      </div>

      {tab === "db" && (
        <div className="stack" style={{ gap: 16 }}>
          <div className="row between">
            <div className="row" role="group" aria-label="Which system">
              <button className={`btn sm ${legacy ? "" : "outline"}`} data-sfx="switch" onClick={() => setLegacy(true)}>Legacy system</button>
              <button className={`btn sm ${legacy ? "outline" : ""}`} data-sfx="switch" onClick={() => setLegacy(false)}>Unfound</button>
            </div>
            <span className="muted" style={{ fontSize: 13 }}>{legacy ? "What an admin sees today" : "What Dan sees with Unfound"}</span>
          </div>
          <div className="tablebox">
            <table>
              <thead>
                <tr>
                  <th>Record</th>
                  {COLS.map((c) => <th key={c}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {state.records.map((r) => (
                  <tr key={r.id}>
                    <td><b>{r.id}</b><div className="muted" style={{ fontSize: 13 }}>{r.alias}</div></td>
                    {COLS.map((c) => (
                      <td key={c} className={legacy ? "" : "mono"} style={{ fontSize: legacy ? 14 : 12 }}>
                        <Scramble text={legacy ? r.legacyPlain[c] : r.sealed[c] ? shortCt(r.sealed[c]!.ct, 22) : "not onboarded"} duration={600} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!legacy && (
            <div className="row">
              <button className="btn outline sm" onClick={tryOpen}>Open Linh's full address</button>
              {openErr && <Badge kind="denied">Denied</Badge>}
              {openErr && <span className="mono muted" style={{ fontSize: 12 }}>{openErr}</span>}
            </div>
          )}
        </div>
      )}

      {tab === "roles" && (
        <div className="stack" style={{ gap: 16 }}>
          <div className="card stack">
            <b>Assign role</b>
            <div className="kv">
              <dt>User</dt><dd>Dan K. (himself)</dd>
              <dt>Role</dt><dd className="mono">_tide_addrfull.selfdecrypt</dd>
              <dt>About</dt><dd>Linh N. · {LINH_ID}</dd>
            </div>
            <div className="field">
              <label htmlFor="dan-reason">Reason shown to approvers</label>
              <input id="dan-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div>
              <button className="btn" onClick={() => requestGrant({ target: "dan", tag: "addrfull", subject: LINH_ID, reason })}>Assign role</button>
            </div>
            <span className="muted" style={{ fontSize: 13 }}>
              In TideCloak this write is not applied. It becomes a change set that needs {THRESHOLD} of 3 realm admins.
            </span>
          </div>

          <AnimatePresence>
            {blocked && (
              <motion.div
                key={blocked + state.log.length}
                className="notice dark"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, -2, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: ease.out }}
              >
                <b>Blocked by quorum</b>
                <span className="mono" style={{ fontSize: 13 }}>{blocked}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {mine.length > 0 && (
            <div className="list">
              {mine.map((c) => (
                <div key={c.id} className="stack" style={{ gap: 10 }}>
                  <div className="row between">
                    <b className="mono">{c.id}</b>
                    <StatusBadge status={c.status} />
                  </div>
                  <span className="muted" style={{ fontSize: 14 }}>{c.role} → {actor(c.target).name}</span>
                  <Quorum cr={c} />
                  {c.status === "PENDING" && (
                    <div className="row">
                      <button className="btn outline sm" onClick={() => approve(c.id)} disabled={c.approvals.includes("dan")}>
                        {c.approvals.includes("dan") ? "Authorized by you" : "Authorize (my vote)"}
                      </button>
                      <button className="btn sm" onClick={() => tryCommit(c.id)}>Commit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {fabric.mode === "live" && <LiveAdminPanel />}
        </div>
      )}
    </>
  );
}
