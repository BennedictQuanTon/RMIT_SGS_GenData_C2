import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brand, Mark } from "../brand/Logo";
import { BarChart, StackedColumns, UnitChart } from "./Charts";

function Orbit() {
  // Services orbit the survivor. Each can reach her; none holds the point that locates her.
  const cx = 280, cy = 180, rx = 220, ry = 130;
  const tokens = [
    { a: -90, t: "School", s: "zone only" },
    { a: -18, t: "GP", s: "relay only" },
    { a: 54, t: "Court mail", s: "at print" },
    { a: 126, t: "Police", s: "2 of 3 approve" },
    { a: 198, t: "Admin", s: "ciphertext" },
  ].map((k) => ({ ...k, x: cx + rx * Math.cos((k.a * Math.PI) / 180), y: cy + ry * Math.sin((k.a * Math.PI) / 180) }));
  return (
    <svg className="orbit" viewBox="0 0 560 360" role="img" aria-label="Services orbit the survivor's sealed address: school, GP, court mail, police and admin">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 6" />
      {tokens.map((k) => (
        <line key={k.t + "l"} x1={cx} y1={cy} x2={k.x} y2={k.y} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r="62" fill="#000" />
      <g transform={`translate(${cx - 30} ${cy - 32}) scale(0.94)`}>
        <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" />
        <circle cx="32" cy="28" r="5.5" fill="#fff" />
      </g>
      {tokens.map((k) => (
        <g key={k.t}>
          <circle cx={k.x} cy={k.y} r="40" fill="#fff" stroke="#dfdfdf" />
          <text x={k.x} y={k.y - 2} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="500" fill="#000">{k.t}</text>
          <text x={k.x} y={k.y + 14} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#6e6e6e">{k.s}</text>
        </g>
      ))}
    </svg>
  );
}

export function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <Brand />
          <nav className="nav-links" aria-label="Sections">
            <a href="#problem">Problem</a>
            <a href="#how">How it works</a>
            <a href="#who">Who sees what</a>
            <a href="#prototype">Prototype</a>
          </nav>
          <Link to="/demo" className="btn">Open demo</Link>
        </div>
      </header>

      <main>
        <section className="container hero">
          <span className="eyebrow">Built with TideCloak · RMIT Hackathon 2026</span>
          <h1>
            Be <b>reached.</b> Not <b>found.</b>
          </h1>
          <p className="lede">
            Unfound lets family-violence survivors enrol a child at school, see a GP and receive court mail after they move,
            without their new address sitting readable in anyone's database. No admin, agency or operator can open it alone.
          </p>
          <div className="hero-ctas">
            <Link to="/demo" className="btn cobalt">Try the prototype</Link>
            <a href="#problem" className="btn outline">See the problem →</a>
          </div>
          <Orbit />
        </section>

        <section id="problem" className="section fog">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">The problem</span>
              <h2>
                A new address is the <b>most dangerous data</b> a survivor owns.
              </h2>
              <p>
                Leaving is when the risk peaks. Every service a survivor uses afterwards stores the new address in plain text,
                readable by thousands of staff and every administrator. One lookup by one insider is enough.
              </p>
            </div>

            <div className="stats">
              <article className="card stat">
                <div className="stat-top"><span className="eyebrow">AU · Partner violence</span></div>
                <div className="stat-num">1.5M</div>
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
              </article>

              <article className="card stat">
                <div className="stat-top"><span className="eyebrow">AU · Leaving</span></div>
                <div className="stat-num">64%</div>
                <p className="stat-claim">of those women moved out when the relationship ended: <b>866,700</b> new addresses that school, GP, bank and electoral records all ask for.</p>
                <UnitChart on={64} label="64 of 100 squares filled: 64% moved out at final separation" />
                <div className="legend">
                  <span><i style={{ background: "var(--color-seal)" }} />Moved out at separation · 64%</span>
                  <span><i style={{ background: "var(--color-slate-mist)" }} />Did not · 36%</span>
                </div>
                <p className="source">ABS, Personal Safety Survey 2021–22. Women who lived with a violent previous partner.</p>
              </article>

              <article className="card stat">
                <div className="stat-top"><span className="eyebrow">AU · Insiders</span></div>
                <div className="stat-num">2,215</div>
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
              </article>

              <article className="card stat">
                <div className="stat-top"><span className="eyebrow">VN · Silence</span></div>
                <div className="stat-num">90.4%</div>
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
              </article>
            </div>

            <div className="cases">
              <div className="case">
                <span className="eyebrow">Queensland · 2014</span>
                <p>A senior constable searched the police database and passed a survivor's new address to her abuser, his friend. A tribunal found the police service liable for failing to control access.</p>
              </div>
              <div className="case">
                <span className="eyebrow">Queensland · 2024</span>
                <p>The same system auto-filled survivors' addresses into forms served on offenders. The Information Commissioner found police had known the risk "since at least 2017".</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2>
                The address is <b>sealed</b> before it leaves the phone.
              </h2>
              <p>Unfound uses TideCloak's Emergent Authority: the power to open an address only exists when the right person, the right role and enough independent approvals line up.</p>
            </div>
            <div className="steps">
              <div className="step">
                <span className="step-n">01</span>
                <h3>Seal once</h3>
                <p>The survivor types the new address. It is encrypted in the browser into three parts: full address, school zone and contact relay.</p>
                <p className="tide-line">TideCloak doEncrypt with tags. Our server stores ciphertext only.</p>
              </div>
              <div className="step">
                <span className="step-n">02</span>
                <h3>Share the minimum</h3>
                <p>Each service can open only its own part. The school sees "in zone". The clinic sees a relay number. Nobody else sees anything.</p>
                <p className="tide-line">_tide_&lt;tag&gt;.selfdecrypt roles, checked by Tide's network, not by our code.</p>
              </div>
              <div className="step">
                <span className="step-n">03</span>
                <h3>No one alone</h3>
                <p>Granting anyone the full address needs 2 of 3 independent approvers. An admin who tries to give themselves access is stopped by cryptography.</p>
                <p className="tide-line">Quorum-Enforced Governance. Threshold-signed changes, every vote logged.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="who" className="section fog">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Who sees what</span>
              <h2>
                Every service can <b>reach</b> her. None can <b>find</b> her.
              </h2>
            </div>
            <div className="tablebox">
              <table>
                <thead>
                  <tr><th>Who</th><th>Today</th><th>With Unfound</th></tr>
                </thead>
                <tbody>
                  <tr><td>School registrar</td><td>Full address in the enrolment file</td><td>"In Footscray North zone ✓"</td></tr>
                  <tr><td>GP clinic</td><td>Address and phone</td><td>Suburb and a relay number</td></tr>
                  <tr><td>Court mail</td><td>Address in a clerk's document</td><td>Opened only when the label prints</td></tr>
                  <tr><td>Police</td><td>Search the database at any time</td><td>Break-glass: 2 of 3 approve, one view, then revoked</td></tr>
                  <tr><td>Admin, DBA, operator</td><td>Everything</td><td>Ciphertext. A self-grant stays pending</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="prototype" className="section">
          <div className="container split">
            <div className="stack" style={{ gap: 24 }}>
              <span className="eyebrow">Prototype</span>
              <h2>
                Seven people. <b>One address.</b> No master key.
              </h2>
              <p className="muted">Switch between the survivor, the services, a rogue admin and the approvers. Every Tide operation appears in the Fabric log on the right of the demo.</p>
              <div className="row">
                <Link to="/demo" className="btn">Open demo</Link>
                <a className="btn outline" href="https://tide.org/tidecloak" target="_blank" rel="noreferrer">About TideCloak →</a>
              </div>
            </div>
            <div className="persona-list">
              {[
                ["LN", "Linh N.", "Survivor. Seals her new address on her phone."],
                ["WP", "Westgate Primary", "Sees the school zone. The full address stays sealed."],
                ["DK", "Dan K., IT admin", "Tries to grant himself access. Gets 412."],
                ["MT", "Mai T. and Ruth A.", "Independent approvers. 2 of 3 required."],
                ["CR", "Const. Reyes", "Welfare check. One approved view, then revoked."],
              ].map(([i, n, d]) => (
                <div className="persona-row" key={n}>
                  <span className="avatar">{i}</span>
                  <div className="who"><b>{n}</b><span>{d}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section fog">
          <div className="container section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">What changes</span>
            <h2>
              Survivors stop choosing between <b>help</b> and <b>hiding.</b>
            </h2>
            <p>Services stop being the leak. Agencies can prove that no single employee, including their own admins, can reveal where someone lives.</p>
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
    </>
  );
}
