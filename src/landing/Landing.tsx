import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Brand, Mark } from "../brand/Logo";
import { BarChart, StackedColumns, UnitChart } from "./Charts";
import { CountUp, Reveal, ScrollWords, Words } from "../motion/primitives";
import { Intro, introSeen } from "../motion/Intro";
import { ease } from "../motion/tokens";

function Orbit({ play }: { play: boolean }) {
  // Services orbit the survivor. Each can reach her; none holds the point that locates her.
  const cx = 280, cy = 180, rx = 220, ry = 130;
  const tokens = [
    { a: -90, t: "School", s: "zone only" },
    { a: -18, t: "GP", s: "relay only" },
    { a: 54, t: "Court mail", s: "at print" },
    { a: 126, t: "Police", s: "2 of 3 approve" },
    { a: 198, t: "Admin", s: "ciphertext" },
  ].map((k) => ({ ...k, x: cx + rx * Math.cos((k.a * Math.PI) / 180), y: cy + ry * Math.sin((k.a * Math.PI) / 180) }));
  const go = play ? "on" : "off";
  return (
    <svg className="orbit" viewBox="0 0 560 360" role="img" aria-label="Services orbit the survivor's sealed address: school, GP, court mail, police and admin">
      <motion.ellipse
        className="orbit-ring"
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none" stroke="#dfdfdf" strokeWidth="1.5" strokeDasharray="4 6"
        initial={{ opacity: 0 }}
        animate={go === "on" ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.5 }}
      />
      {tokens.map((k, i) => (
        <motion.line
          key={k.t + "l"} x1={cx} y1={cy} x2={k.x} y2={k.y} stroke="#e5e7eb" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={go === "on" ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.75 + i * 0.07 }}
        />
      ))}
      <motion.g
        initial={{ scale: 0.6, opacity: 0 }}
        animate={go === "on" ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.45 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r="62" fill="#000" />
        <g transform={`translate(${cx - 30} ${cy - 32}) scale(0.94)`}>
          <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" />
          <circle cx="32" cy="28" r="5.5" fill="#fff" />
        </g>
      </motion.g>
      {tokens.map((k, i) => (
        <motion.g
          key={k.t}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={go === "on" ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.6, ease: ease.outExpo, delay: 0.9 + i * 0.08 }}
          style={{ transformOrigin: `${k.x}px ${k.y}px` }}
        >
          <g className="float" style={{ animationDelay: `${i * -1.1}s` }}>
            <circle cx={k.x} cy={k.y} r="40" fill="#fff" stroke="#dfdfdf" />
            <text x={k.x} y={k.y - 2} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500" fill="#000">{k.t}</text>
            <text x={k.x} y={k.y + 14} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#6e6e6e">{k.s}</text>
          </g>
        </motion.g>
      ))}
    </svg>
  );
}

// Clutch's hero move: the headline sits in light gray and one phrase at a time turns black.
function HeroHeadline({ play, delay }: { play: boolean; delay: number }) {
  const phrases = ["Be reached.", "Not found."];
  const [on, setOn] = useState(-1);
  useEffect(() => {
    if (!play) return;
    let i = 0;
    let iv = 0;
    const first = window.setTimeout(() => {
      setOn(0);
      iv = window.setInterval(() => {
        i = (i + 1) % phrases.length;
        setOn(i);
      }, 2400);
    }, (delay + 0.7) * 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(iv);
    };
  }, [play, delay, phrases.length]);
  return (
    <h1 aria-label="Be reached. Not found.">
      {phrases.map((p, i) => (
        <span key={p} aria-hidden="true">
          <motion.span
            className={`phrase ${on === i ? "on" : ""}`}
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={play ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.7, ease: ease.out, delay: delay + i * 0.12 }}
          >
            {p}
          </motion.span>
          {i < phrases.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}

function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 240 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });
  return (
    <motion.header
      className={`nav ${scrolled ? "scrolled" : ""}`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: ease.out }}
    >
      <div className="container nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Sections">
          <a href="#problem"><span>Problem</span></a>
          <a href="#how"><span>How it works</span></a>
          <a href="#who"><span>Who sees what</span></a>
          <a href="#prototype"><span>Prototype</span></a>
        </nav>
        <Link to="/demo" className="btn" data-sfx="whoosh">Open demo</Link>
      </div>
      <motion.div className="progress" style={{ scaleX: progress }} />
    </motion.header>
  );
}

const rise = (play: boolean, delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.8, ease: ease.out, delay },
});

export function Landing() {
  const [showIntro] = useState(() => !introSeen());
  const [ready, setReady] = useState(!showIntro);
  const onIntroDone = useCallback(() => setReady(true), []);

  // Hero parallax: the orbit sinks and the copy fades as you scroll away.
  const { scrollY } = useScroll();
  const orbitY = useTransform(scrollY, [0, 700], [0, 110]);
  const orbitScale = useTransform(scrollY, [0, 700], [1, 0.92]);
  const copyOpacity = useTransform(scrollY, [0, 420], [1, 0.25]);
  const base = showIntro ? 0.15 : 0.35; // after a route change, wait for the curtain to lift

  return (
    <>
      {showIntro && <Intro onDone={onIntroDone} />}
      <Nav />

      <div className="rails">
      <main>
        <section className="container hero">
          <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
            <motion.span className="eyebrow" {...rise(ready, base)}>Built with TideCloak · RMIT Hackathon 2026</motion.span>
            <HeroHeadline play={ready} delay={base + 0.05} />
            <motion.p className="lede" {...rise(ready, base + 0.35)}>
              A safe address for family-violence survivors. Schools, clinics and courts can reach you. No admin can find you.
            </motion.p>
            <motion.div className="hero-ctas" {...rise(ready, base + 0.45)}>
              <Link to="/demo" className="btn lam lg" data-sfx="whoosh">Try the prototype</Link>
              <a href="#problem" className="btn outline lg">See the problem <span className="arrow">→</span></a>
            </motion.div>
          </motion.div>
          <motion.div className="orbit-wrap" style={{ y: orbitY, scale: orbitScale }}>
            <Orbit play={ready} />
          </motion.div>
        </section>

        <section id="problem" className="section fog">
          <div className="container">
            <div className="section-head">
              <Reveal><span className="eyebrow">The problem</span></Reveal>
              <h2><Words text="A new address is the *most* *dangerous* *data* a survivor owns." /></h2>
              <Reveal delay={0.15}>
                <p>
                  Leaving is when the risk peaks. Every service a survivor uses afterwards stores the new address in plain text,
                  readable by thousands of staff and every administrator. One lookup by one insider is enough.
                </p>
              </Reveal>
            </div>

            <div className="stats">
              <Reveal as="article" className="card stat" delay={0}>
                <div className="stat-top"><span className="eyebrow">AU · Partner violence</span></div>
                <div className="stat-num"><CountUp value={1.5} decimals={1} suffix="M" /></div>
                <p className="stat-claim">Australian women have experienced violence from a <b>previous</b> partner, about nine times more than from a current one. The threat is someone who no longer knows where you live.</p>
                <BarChart
                  label="Share of Australian adults who experienced cohabiting partner violence since age 15"
                  max={20}
                  ticks={["0%", "5%", "10%", "15%", "20%"]}
                  bars={[
                    { label: "Women · previous partner", value: 16, display: "16% · 1.5M", tone: "seal" },
                    { label: "Men · previous partner", value: 4.5, display: "4.5% · 425,400", tone: "ctx" },
                    { label: "Women · current partner", value: 1.7, display: "1.7% · 173,300", tone: "ink" },
                  ]}
                />
                <p className="source">ABS, Personal Safety Survey 2021–22, Partner violence.</p>
              </Reveal>

              <Reveal as="article" className="card stat" delay={0.08}>
                <div className="stat-top"><span className="eyebrow">AU · Leaving</span></div>
                <div className="stat-num"><CountUp value={64} suffix="%" /></div>
                <p className="stat-claim">of those women moved out when the relationship ended: <b>866,700</b> new addresses that school, GP, bank and electoral records all ask for.</p>
                <UnitChart on={64} label="64 of 100 squares filled: 64% moved out at final separation" />
                <div className="legend">
                  <span><i style={{ background: "var(--color-seal)" }} />Moved out at separation · 64%</span>
                  <span><i style={{ background: "var(--color-slate-mist)" }} />Did not · 36%</span>
                </div>
                <p className="source">ABS, Personal Safety Survey 2021–22. Women who lived with a violent previous partner.</p>
              </Reveal>

              <Reveal as="article" className="card stat" delay={0}>
                <div className="stat-top"><span className="eyebrow">AU · Insiders</span></div>
                <div className="stat-num"><CountUp value={2215} comma /></div>
                <p className="stat-claim">allegations of misused confidential information in four years, across just seven Queensland agencies. Outside the police they grew <b>4.8×</b>, in health, schools and corrections.</p>
                <StackedColumns
                  label="Misuse of confidential information allegations by financial year, Queensland, 2015/16 to 2018/19"
                  max={700}
                  ticks={[0, 200, 400, 600]}
                  ctxName="Police (QPS)"
                  growName="Health, education, corrections, transport"
                  data={[
                    { year: "15/16", ctx: 488, grow: 65 },
                    { year: "16/17", ctx: 439, grow: 73 },
                    { year: "17/18", ctx: 371, grow: 174 },
                    { year: "18/19", ctx: 293, grow: 312 },
                  ]}
                />
                <p className="source">Crime and Corruption Commission QLD, Operation Impala, Exhibit 95 (2019).</p>
              </Reveal>

              <Reveal as="article" className="card stat" delay={0.08}>
                <div className="stat-top"><span className="eyebrow">VN · Silence</span></div>
                <div className="stat-num"><CountUp value={90.4} decimals={1} suffix="%" /></div>
                <p className="stat-claim">of Vietnamese women abused physically or sexually by a husband never went to a formal service. Fear of stigma and further harassment was a main reason.</p>
                <BarChart
                  label="National Study on Violence against Women in Viet Nam 2019"
                  max={100}
                  ticks={["0%", "25%", "50%", "75%", "100%"]}
                  bars={[
                    { label: "Ever abused by husband (married women)", value: 62.9, display: "62.9%", tone: "ctx" },
                    { label: "Told no one at all", value: 50, display: "~50%", tone: "ink" },
                    { label: "Never sought formal help", value: 90.4, display: "90.4%", tone: "seal" },
                  ]}
                />
                <p className="source">MOLISA, GSO, UNFPA and DFAT, National Study on Violence against Women in Viet Nam 2019.</p>
              </Reveal>
            </div>

            <div className="cases">
              <Reveal className="case">
                <span className="eyebrow">Queensland · 2014</span>
                <p>A senior constable searched the police database and passed a survivor's new address to her abuser, his friend. A tribunal found the police service liable for failing to control access.</p>
              </Reveal>
              <Reveal className="case" delay={0.1}>
                <span className="eyebrow">Queensland · 2024</span>
                <p>The same system auto-filled survivors' addresses into forms served on offenders. The Information Commissioner found police had known the risk "since at least 2017".</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="section-head">
              <Reveal><span className="eyebrow">How it works</span></Reveal>
              <h2><Words text="The address is *sealed* before it leaves the phone." /></h2>
              <Reveal delay={0.15}>
                <p>Unfound uses TideCloak's Emergent Authority: the power to open an address only exists when the right person, the right role and enough independent approvals line up.</p>
              </Reveal>
            </div>
            <div className="steps">
              {[
                ["01", "Seal once", "The survivor types the new address. It is encrypted in the browser into three parts: full address, school zone and contact relay.", "TideCloak doEncrypt with tags. Our server stores ciphertext only."],
                ["02", "Share the minimum", "Each service can open only its own part. The school sees \"in zone\". The clinic sees a relay number. Nobody else sees anything.", "_tide_<tag>.selfdecrypt roles, checked by Tide's network, not by our code."],
                ["03", "No one alone", "Granting anyone the full address needs 2 of 3 independent approvers. An admin who tries to give themselves access is stopped by cryptography.", "Quorum-Enforced Governance. Threshold-signed changes, every vote logged."],
              ].map(([n, h, p, t], i) => (
                <Reveal className="step" key={n} delay={i * 0.1}>
                  <span className="step-n">{n}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                  <p className="tide-line">{t}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="who" className="section fog">
          <div className="container">
            <div className="section-head">
              <Reveal><span className="eyebrow">Who sees what</span></Reveal>
              <h2><Words text="Every service can *reach* her. None can *find* her." /></h2>
            </div>
            <Reveal className="tablebox">
              <table>
                <thead>
                  <tr><th>Who</th><th>Today</th><th>With Unfound</th></tr>
                </thead>
                <tbody>
                  {[
                    ["School registrar", "Full address in the enrolment file", "\"In Footscray North zone ✓\""],
                    ["GP clinic", "Address and phone", "Suburb and a relay number"],
                    ["Court mail", "Address in a clerk's document", "Opened only when the label prints"],
                    ["Police", "Search the database at any time", "Break-glass: 2 of 3 approve, one view, then revoked"],
                    ["Admin, DBA, operator", "Everything", "Ciphertext. A self-grant stays pending"],
                  ].map(([a, b, c], i) => (
                    <motion.tr
                      key={a}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.6, ease: ease.out, delay: 0.1 + i * 0.06 }}
                    >
                      <td>{a}</td><td>{b}</td><td>{c}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        <section id="prototype" className="section">
          <div className="container split">
            <div className="stack" style={{ gap: 24 }}>
              <Reveal><span className="eyebrow">Prototype</span></Reveal>
              <h2><Words text="Seven people. *One* *address.* No master key." /></h2>
              <Reveal delay={0.1}>
                <p className="muted">Switch between the survivor, the services, a rogue admin and the approvers. Every Tide operation appears in the Fabric log on the right of the demo.</p>
              </Reveal>
              <Reveal delay={0.2} className="row">
                <Link to="/demo" className="btn lg" data-sfx="whoosh">Open demo <span className="arrow">→</span></Link>
                <a className="btn outline lg" href="https://tide.org/tidecloak" target="_blank" rel="noreferrer">About TideCloak <span className="arrow">→</span></a>
              </Reveal>
            </div>
            <div className="persona-list">
              {[
                ["LN", "Linh N.", "Survivor. Seals her new address on her phone."],
                ["WP", "Westgate Primary", "Sees the school zone. The full address stays sealed."],
                ["DK", "Dan K., IT admin", "Tries to grant himself access. Gets 412."],
                ["MT", "Mai T. and Ruth A.", "Independent approvers. 2 of 3 required."],
                ["CR", "Const. Reyes", "Welfare check. One approved view, then revoked."],
              ].map(([i, n, d], k) => (
                <motion.div
                  className="persona-row"
                  key={n}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: ease.out, delay: k * 0.07 }}
                >
                  <span className="avatar">{i}</span>
                  <div className="who"><b>{n}</b><span>{d}</span></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section fog tall">
          <div className="container section-head" style={{ marginBottom: 0 }}>
            <Reveal><span className="eyebrow">What changes</span></Reveal>
            <ScrollWords text="Survivors stop choosing between *help* and *hiding.* Services stop being the leak." />
            <Reveal delay={0.1}>
              <p>Agencies can prove that no single employee, including their own admins, can reveal where someone lives.</p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="stack">
            <div className="row"><Mark size={22} /><b>unfound</b></div>
            <p className="muted">Be reached, not found. All data in this prototype is synthetic.</p>
            <a href="https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked" target="_blank" rel="noreferrer">
              <img src="https://tide.org/badges/built-with-tidecloak.svg" alt="Built with TideCloak" height={28} />
            </a>
          </div>
          <ol>
            <li>ABS, Personal Safety, Australia 2021–22 (Partner violence).</li>
            <li>CCC Queensland, Operation Impala Exhibit 95, 2019.</li>
            <li>National Study on Violence against Women in Viet Nam 2019 (MOLISA, GSO, UNFPA, DFAT).</li>
            <li>QCAT decision on Queensland Police Service, reported 2018–2019; Queensland Information Commissioner, QPrime report, 2025.</li>
          </ol>
        </div>
      </footer>
      </div>
    </>
  );
}
