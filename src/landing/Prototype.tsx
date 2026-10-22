import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Avatar } from "../brand/Avatar";
import { Device } from "../ui/Device";
import { ACTORS } from "../demo/engine";
import { Reveal, Words } from "../motion/primitives";
import { ease } from "../motion/tokens";

// Real screens from the running prototype (captured by tools/shots.mjs), set in their devices.
export function Prototype() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const padY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const macY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <section id="prototype" className="section proto" ref={ref}>
      <div className="container">
        <div className="section-head center">
          <Reveal><span className="eyebrow">Prototype</span></Reveal>
          <h2><Words text="Seven people. One address. No master key." /></h2>
          <Reveal delay={0.1}>
            <p>A survivor, two services, a rogue admin, two independent approvers and a police officer. Play the whole story or take any seat yourself.</p>
          </Reveal>
        </div>

        <div className="proto-stage">
          <motion.div className="proto-mac" style={{ y: macY }} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: ease.out }}>
            <Device kind="macbook">
              <img src="/shots/dan-412.png" alt="Dan, the IT admin, blocked with 412 QUORUM_NOT_MET after granting himself access" loading="lazy" />
            </Device>
            <span className="proto-num">02</span>
          </motion.div>
          <motion.div className="proto-phone" style={{ y: phoneY }} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.15 }}>
            <Device kind="iphone">
              <img src="/shots/linh-sealed.png" alt="Linh's phone showing her address sealed into three encrypted parts" loading="lazy" />
            </Device>
            <span className="proto-num">01</span>
          </motion.div>
          <motion.div className="proto-pad" style={{ y: padY }} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.25 }}>
            <Device kind="ipad">
              <img src="/shots/police-once.png" alt="The officer's tablet showing an address opened once after two approvals" loading="lazy" />
            </Device>
            <span className="proto-num">03</span>
          </motion.div>
        </div>

        <ol className="proto-legend">
          <li><span className="proto-num static">01</span><div><b>Linh, on her phone</b><span>Her address is sealed into three parts before it leaves.</span></div></li>
          <li><span className="proto-num static">02</span><div><b>Dan, the IT admin</b><span>Grants himself access. Alone, the commit returns 412.</span></div></li>
          <li><span className="proto-num static">03</span><div><b>Police, on a tablet</b><span>One view after two approvers sign, then revoked.</span></div></li>
        </ol>

        <ul className="cast">
          {ACTORS.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: ease.out, delay: i * 0.05 }}
            >
              <Avatar id={a.id} size={64} />
              <b>{a.name}</b>
              <span>{a.title}</span>
            </motion.li>
          ))}
        </ul>

        <Reveal className="row proto-ctas">
          <Link to="/demo?story=1" className="btn lam lg" data-sfx="whoosh">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
            Play the story
          </Link>
          <Link to="/demo" className="btn outline lg" data-sfx="whoosh">Take a seat yourself <span className="arrow">→</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
