import {
  siDocker, siFfmpeg, siFramer, siGithub, siJsonwebtokens, siKeycloak, siLucide, siNodedotjs, siOpenid, siReact,
  siReactrouter, siTypescript, siVercel, siVite,
  type SimpleIcon,
} from "simple-icons";
import { Reveal, Words } from "../motion/primitives";

type Tech = { name: string; icon?: SimpleIcon; mono?: string };

// What this repository actually uses (package.json, the TideCloak setup and the deploy config).
const rowA: Tech[] = [
  { name: "TideCloak", mono: "Tc" },
  { name: "Keycloak", icon: siKeycloak },
  { name: "OpenID Connect", icon: siOpenid },
  { name: "JSON Web Tokens", icon: siJsonwebtokens },
  { name: "Web Crypto", mono: "WC" },
  { name: "Docker", icon: siDocker },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Vercel", icon: siVercel },
];

const rowB: Tech[] = [
  { name: "React", icon: siReact },
  { name: "TypeScript", icon: siTypescript },
  { name: "Vite", icon: siVite },
  { name: "React Router", icon: siReactrouter },
  { name: "Motion", icon: siFramer },
  { name: "Lenis", mono: "Le" },
  { name: "Lucide", icon: siLucide },
  { name: "DiceBear", mono: "Db" },
  { name: "Web Audio", mono: "WA" },
  { name: "FFmpeg", icon: siFfmpeg },
  { name: "GitHub", icon: siGithub },
];

function Chip({ t }: { t: Tech }) {
  return (
    <li className="mq-chip">
      {t.icon ? (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true"><path d={t.icon.path} /></svg>
      ) : (
        <span className="mq-mono" aria-hidden="true">{t.mono}</span>
      )}
      <span>{t.name}</span>
    </li>
  );
}

/** Infinite loop: the list is rendered twice and shifted by exactly one copy. */
function Marquee({ items, reverse, seconds }: { items: Tech[]; reverse?: boolean; seconds: number }) {
  return (
    <div className="mq">
      <div className={`mq-track ${reverse ? "mq-reverse" : ""}`} style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined}>
            {items.map((t) => <Chip key={t.name} t={t} />)}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <section className="section stack-section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <Reveal><span className="eyebrow">Stack</span></Reveal>
          <h2><Words text="Open standards, no master key." /></h2>
        </div>
      </div>
      <Reveal className="mq-wrap">
        <Marquee items={rowA} seconds={36} />
        <Marquee items={rowB} seconds={42} reverse />
      </Reveal>
    </section>
  );
}
