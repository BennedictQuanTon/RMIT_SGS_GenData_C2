import { motion } from "motion/react";
import { Avatar, type AvatarKey } from "../brand/Avatar";
import { ScrambleIn, Reveal, Words } from "../motion/primitives";
import { ease } from "../motion/tokens";
import { useState } from "react";

const ROWS: { who: AvatarKey; name: string; today: string; unfound: string; tag: string }[] = [
  { who: "school", name: "School registrar", today: "Full address in the enrolment file", unfound: "In Footscray North zone ✓", tag: "addrzone" },
  { who: "gp", name: "GP clinic", today: "Address and mobile number", unfound: "Footscray · relay 0400 000 117", tag: "addrcontact" },
  { who: "court", name: "Court mail", today: "Address in a clerk's Word file", unfound: "Opened only as the label prints", tag: "addrfull" },
  { who: "officer", name: "Police", today: "Search the database any time", unfound: "One view after 2 of 3 approve", tag: "break-glass" },
  { who: "dan", name: "Admin, DBA, operator", today: "Everything", unfound: "Ciphertext. A self-grant gets 412", tag: "QEA" },
];

function Row({ r, i }: { r: (typeof ROWS)[number]; i: number }) {
  const [on, setOn] = useState(false);
  return (
    <motion.li
      className="ws-row"
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: ease.out, delay: 0.05 }}
      onViewportEnter={() => window.setTimeout(() => setOn(true), 380)}
    >
      <span className="ws-n">0{i + 1}</span>
      <div className="ws-who">
        <Avatar id={r.who} size={52} />
        <div>
          <b>{r.name}</b>
          <span className="mono">{r.tag}</span>
        </div>
      </div>
      <div className="ws-today">
        <span className="ws-label">Today</span>
        <span className="ws-strike">
          {r.today}
          <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.6, ease: ease.outExpo }} />
        </span>
      </div>
      <div className="ws-now">
        <span className="ws-label">With Unfound</span>
        <span className="ws-now-text">{on ? <ScrambleIn text={r.unfound} /> : <span className="ws-ghost">{r.unfound}</span>}</span>
      </div>
    </motion.li>
  );
}

export function WhoSees() {
  return (
    <section id="who" className="section">
      <div className="container">
        <div className="section-head">
          <Reveal><span className="eyebrow">Who sees what</span></Reveal>
          <h2><Words text="Every service can reach her. None can find her." /></h2>
        </div>
        <ol className="ws-list">
          {ROWS.map((r, i) => <Row key={r.name} r={r} i={i} />)}
        </ol>
        <p className="source" style={{ marginTop: 16 }}>Illustrations: Notionists by Zoish (CC0), rendered with DiceBear.</p>
      </div>
    </section>
  );
}
