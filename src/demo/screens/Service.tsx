import { useState } from "react";
import { motion } from "motion/react";
import { ScrambleIn } from "../../motion/primitives";
import { actor, TAGS, type Tag } from "../engine";
import { useUnfound } from "../store";
import { Badge, ScreenHead } from "../ui";

// School and GP share one screen; each is allowed exactly one tag.
const ALLOWED: Record<"school" | "gp", Tag> = { school: "addrzone", gp: "addrcontact" };

export function Service({ who }: { who: "school" | "gp" }) {
  const { state, open } = useUnfound();
  const mine = ALLOWED[who];
  const [opened, setOpened] = useState<Record<string, string>>({});
  const [denied, setDenied] = useState<Record<string, string>>({});

  const tryOpen = async (id: string, tag: Tag) => {
    const key = `${id}:${tag}`;
    try {
      const plain = await open(id, tag);
      setOpened((o) => ({ ...o, [key]: plain }));
    } catch (e) {
      setDenied((d) => ({ ...d, [key]: (e as Error).message }));
    }
  };

  const records = state.records.filter((r) => r.sealed.addrfull);

  return (
    <>
      <ScreenHead eyebrow={`${actor(who).name} · ${actor(who).title}`} title={who === "school" ? <>Enrolments, <b>without addresses.</b></> : <>Patients you can <b>reach.</b></>}>
        {who === "school"
          ? "You can confirm a family lives in your zone. You cannot see where."
          : "You can contact patients through a relay. You cannot see where they live."}
      </ScreenHead>

      {records.length === 0 ? (
        <div className="notice">No sealed records yet. Switch to Linh and seal her address first.</div>
      ) : (
        <div className="tablebox">
          <table>
            <thead>
              <tr>
                <th>Family</th>
                <th>{TAGS[mine].label}</th>
                <th>Full address</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => {
                const kMine = `${r.id}:${mine}`;
                const kFull = `${r.id}:addrfull`;
                return (
                  <tr key={r.id}>
                    <td>
                      <b>{r.alias}</b>
                      <div className="muted" style={{ fontSize: 13 }}>{r.enrolment}</div>
                    </td>
                    <td>
                      {opened[kMine] ? (
                        <span data-demo={`zone-${idx}`}><ScrambleIn text={opened[kMine]} /> ✓</span>
                      ) : (
                        <button className="btn sm" data-demo={`check-${idx}`} onClick={() => tryOpen(r.id, mine)}>{who === "school" ? "Check zone" : "Show relay"}</button>
                      )}
                    </td>
                    <td>
                      {denied[kFull] ? (
                        <motion.div className="stack" data-demo={`denied-${idx}`} style={{ gap: 4 }} initial={{ x: 0 }} animate={{ x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.4 }}>
                          <Badge kind="denied">Denied</Badge>
                          <span className="muted mono" style={{ fontSize: 12 }}>{denied[kFull]}</span>
                        </motion.div>
                      ) : (
                        <div className="row">
                          <Badge kind="sealed">Sealed</Badge>
                          <button className="btn ghost sm" data-demo={`open-${idx}`} onClick={() => tryOpen(r.id, "addrfull")}>Try to open</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
