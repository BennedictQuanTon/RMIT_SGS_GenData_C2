import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ComponentType } from "react";
import { EyeOff, FileSignature, KeyRound, Laptop, LockKeyhole, ShieldCheck, Smartphone, Tablet, type LucideProps } from "lucide-react";
import { siDocker, siFfmpeg, siFramer, siGithub, siJsonwebtokens, siKeycloak, siNodedotjs, siOpenid, siReact, siTypescript, siVercel, siVite } from "simple-icons";
import { avatarUri } from "../brand/Avatar";
import type { ActorId } from "../demo/engine";
import "./film.css";

const CAST: ActorId[] = ["linh", "school", "gp", "dan", "mai", "ruth", "officer"];

// The two-minute film, as a page. Everything is a pure function of the time `t`, so the renderer
// can seek frame by frame (window.__film.seek) and get the same picture every time.
// Voice: Kokoro af_heart. Footage: Mixkit (free licence) and the prototype itself.

export const T = {
  v01: 0.8, v02: 6.4, v03: 11.4, v04: 17.6, v05: 25.2, v06: 37.4, v07: 43.4,
  v08: 49.6, v09: 53.4, v10: 62.4, v11: 67.4, v12: 78.2, v13: 87.2,
  v14: 92.8, v15: 98.8, v16: 111.0,
};
export const END = 115.5;

// Windows of the recorded UI clip shown in the device frame: [film start, film end, clip offset, speed]
const UI_WINDOWS: [number, number, number, number, number][] = [
  [53.3, 62.3, 0.8, 1, 1.42],
  [62.3, 67.3, 11.0, 1, 1.22],
  [67.3, 78.1, 26.8, 1, 1.22],
  [78.1, 87.1, 41.4, 2.0, 1.22],
  [87.1, 92.9, 63.2, 1, 1.42],
];

// Sound cues the mixer reads back (film seconds).
export const SFX_CUES: { t: number; name: string; gain?: number }[] = [
  { t: 10.9, name: "whoosh_down" },
  { t: 48.9, name: "whoosh_up" },
  { t: 50.3, name: "chime" },
  { t: 56.6, name: "pop" }, { t: 63.4, name: "pop" }, { t: 70.0, name: "pop" }, { t: 72.0, name: "blocked", gain: 0.6 },
  { t: 82.4, name: "pop" }, { t: 85.0, name: "pop" },
  { t: 92.6, name: "whoosh_up" },
  { t: 99.2, name: "tap" }, { t: 99.6, name: "tap" }, { t: 100.0, name: "tap" }, { t: 100.4, name: "tap" },
  { t: 99.1, name: "pop", gain: 0.25 }, { t: 99.5, name: "pop", gain: 0.25 }, { t: 99.9, name: "pop", gain: 0.25 }, { t: 100.3, name: "pop", gain: 0.25 },
  { t: 104.3, name: "chime", gain: 0.3 },
  { t: 104.6, name: "pop" }, { t: 104.9, name: "pop" }, { t: 105.2, name: "pop" }, { t: 105.5, name: "pop" },
  ...Array.from({ length: 12 }, (_, i) => ({ t: 105.0 + i * 0.12, name: "tap", gain: 0.18 })),
  { t: 111.2, name: "chime" },
];
export const UI_WINDOWS_EXPORT = UI_WINDOWS;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t: number, a: number, d: number) => clamp((t - a) / d);
const eo = (x: number) => 1 - Math.pow(1 - x, 3);
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ---------- video registry: the renderer seeks every visible clip before each frame ----------
type Reg = { el: HTMLVideoElement; at: (t: number) => number | null };
const regs = new Set<Reg>();

async function seekAll(t: number) {
  await Promise.all(
    [...regs].map(async (r) => {
      const want = r.at(t);
      if (want == null) return;
      const v = r.el;
      if (Math.abs(v.currentTime - want) < 0.004 && v.readyState >= 2) return;
      await new Promise<void>((res) => {
        const done = () => { v.removeEventListener("seeked", done); res(); };
        v.addEventListener("seeked", done);
        v.currentTime = Math.max(0, Math.min(want, (v.duration || 999) - 0.05));
        setTimeout(done, 2000);
      });
    }),
  );
}

function Clip({ src, at, style, className }: { src: string; at: (t: number) => number | null; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const atRef = useRef(at);
  atRef.current = at;
  useEffect(() => {
    const el = ref.current!;
    const r: Reg = { el, at: (t) => atRef.current(t) };
    regs.add(r);
    return () => void regs.delete(r);
  }, []);
  return <video ref={ref} src={src} muted playsInline preload="auto" className={className} style={style} />;
}

// ---------- kinetic type ----------
function Kinetic({ t, at, out, text, size = 72, style, className, stagger = 0.07, accent }: {
  t: number; at: number; out: number; text: string; size?: number; style?: CSSProperties; className?: string; stagger?: number; accent?: string;
}) {
  if (t < at - 0.05 || t > out + 0.7) return null;
  const e = eio(prog(t, out, 0.55));
  const words = text.split(" ");
  return (
    <div className={`k ${className ?? ""}`} style={{ fontSize: size, ...style }}>
      {words.map((w, i) => {
        const k = eo(prog(t, at + i * stagger, 0.7));
        const acc = w.startsWith("*") && w.endsWith("*");
        const label = w.replace(/\*/g, "");
        const op = k * (1 - e);
        return (
          <span
            key={i}
            className={acc ? "acc" : undefined}
            style={{
              opacity: op,
              transform: `translateY(${(1 - k) * 0.32 - e * 0.18}em)`,
              filter: `blur(${(1 - k) * 10 + e * 8}px)`,
              color: acc ? accent : undefined,
            }}
          >
            {label}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
}

function Count({ t, at, out, value, decimals = 0, suffix = "", comma = false, size = 220, style }: {
  t: number; at: number; out: number; value: number; decimals?: number; suffix?: string; comma?: boolean; size?: number; style?: CSSProperties;
}) {
  if (t < at - 0.05 || t > out + 0.7) return null;
  const k = eo(prog(t, at, 1.4));
  const e = eio(prog(t, out, 0.55));
  const v = value * k;
  const txt = (comma ? Math.round(v).toLocaleString("en-US") : v.toFixed(decimals)) + suffix;
  return (
    <div className="count" style={{ fontSize: size, opacity: clamp(k * 3) * (1 - e), filter: `blur(${e * 10}px)`, transform: `translateY(${(1 - eo(prog(t, at, 0.7))) * 30 - e * 20}px)`, ...style }}>
      {txt}
    </div>
  );
}

function Pill({ t, at, out, children, dark, style }: { t: number; at: number; out: number; children: ReactNode; dark?: boolean; style?: CSSProperties }) {
  if (t < at - 0.05 || t > out + 0.5) return null;
  const k = prog(t, at, 0.5);
  const spring = 1 - Math.exp(-7 * k) * Math.cos(9 * k); // a small overshoot
  const e = eio(prog(t, out, 0.4));
  return (
    <div className={`pill ${dark ? "dark" : ""}`} style={{ opacity: clamp(k * 4) * (1 - e), transform: `scale(${0.7 + 0.3 * spring - e * 0.1})`, ...style }}>
      <i />
      {children}
    </div>
  );
}

function Source({ t, at, out, children }: { t: number; at: number; out: number; children: ReactNode }) {
  if (t < at || t > out + 0.5) return null;
  return <div className="src" style={{ opacity: eo(prog(t, at, 0.6)) * (1 - eio(prog(t, out, 0.4))) }}>{children}</div>;
}

function Eyebrow({ t, at, out, children, style }: { t: number; at: number; out: number; children: ReactNode; style?: CSSProperties }) {
  if (t < at || t > out + 0.5) return null;
  const k = eo(prog(t, at, 0.6));
  return <div className="eb" style={{ opacity: k * (1 - eio(prog(t, out, 0.4))), transform: `translateY(${(1 - k) * 10}px)`, ...style }}>{children}</div>;
}

function Mark({ t, at, size = 140, color = "#000" }: { t: number; at: number; size?: number; color?: string }) {
  const k = eio(prog(t, at, 0.9));
  const dot = eo(prog(t, at + 0.7, 0.4));
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke={color} strokeWidth="9" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - k} />
      <circle cx="32" cy="28" r={5.5 * dot} fill={color} />
    </svg>
  );
}

// ---------- built + thanks visuals ----------
const pop = (t: number, at: number) => {
  const k = prog(t, at, 0.45);
  return k <= 0 ? 0.4 : 1 - Math.exp(-7 * k) * Math.cos(10 * k) * 0.6;
};
const ico = (I: ComponentType<LucideProps>) => <I size={30} strokeWidth={2} />;
const BUILT: { v: number; l: string; art: ReactNode[] }[] = [
  { v: 7, l: "people", art: CAST.map((id) => <img key={id} src={avatarUri(id)} alt="" />) },
  { v: 8, l: "scenes, end to end", art: [ico(Smartphone), ico(Laptop), ico(Tablet)] },
  { v: 15, l: "Tide operations", art: [ico(KeyRound), ico(ShieldCheck), ico(FileSignature)] },
  { v: 0, l: "plaintext addresses", art: [ico(LockKeyhole), ico(EyeOff)] },
];

const STACK = [siKeycloak, siOpenid, siJsonwebtokens, siReact, siTypescript, siVite, siDocker, siNodedotjs, siVercel, siFramer, siGithub, siFfmpeg];
const TIDE = ["TideCloak", "Hermetic E2EE", "Quorum governance", "Tide Fabric"];

function Orbit({ t }: { t: number }) {
  const cx = 960, cy = 552;
  const out = eio(prog(t, 110.2, 0.6));
  const ringIn = eio(prog(t, 104.3, 1.0));
  const spinA = -(t - 104) * 9; // Tide ring, slow, counter-clockwise
  const spinB = (t - 104) * 6; // open stack, clockwise
  return (
    <div className="orbit-film" style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.04})` }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" className="orbit-rings">
        <ellipse cx={cx} cy={cy} rx="600" ry="330" fill="none" stroke="#c9d6f5" strokeWidth="1.5" strokeDasharray="5 9" pathLength={1} style={{ strokeDashoffset: 0, opacity: ringIn }} />
        <ellipse cx={cx} cy={cy} rx="300" ry="170" fill="none" stroke="#8dbbff" strokeWidth="1.5" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - ringIn} />
      </svg>
      <div className="orbit-core" style={{ left: cx, top: cy, transform: `translate(-50%, -50%) scale(${pop(t, 104.3)})` }}>
        <svg width="76" height="76" viewBox="0 0 64 64"><path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" /><circle cx="32" cy="28" r="5.5" fill="#fff" /></svg>
      </div>
      {TIDE.map((label, i) => {
        const a = ((spinA + i * 90) * Math.PI) / 180;
        return (
          <div key={label} className={`pill orbit-pill ${i === 3 ? "dark" : ""}`} style={{ left: cx + 300 * Math.cos(a), top: cy + 170 * Math.sin(a), transform: `translate(-50%, -50%) scale(${pop(t, 104.6 + i * 0.3)})`, opacity: clamp(prog(t, 104.6 + i * 0.3, 0.15)) }}>
            <i />{label}
          </div>
        );
      })}
      {STACK.map((icon, i) => {
        const a = ((spinB + i * (360 / STACK.length)) * Math.PI) / 180;
        const depth = (Math.sin(a) + 1) / 2; // front of the ellipse is bigger
        return (
          <div key={icon.slug} className="orbit-logo" style={{ left: cx + 600 * Math.cos(a), top: cy + 330 * Math.sin(a), transform: `translate(-50%, -50%) scale(${pop(t, 105.0 + i * 0.12) * (0.82 + depth * 0.3)})`, opacity: clamp(prog(t, 105.0 + i * 0.12, 0.15)), zIndex: Math.round(depth * 10) }}>
            <svg viewBox="0 0 24 24" width="44" height="44"><path d={icon.path} fill={`#${icon.hex}`} /></svg>
            <span>{icon.title}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- the film ----------
const ACC_DARK = "#8dbbff";
const ACC_LIGHT = "#3d8bff";

function Frame({ t }: { t: number }) {
  const inA = t < 11.6;
  const inB = t >= 10.6 && t < 49.9;
  const inC = t >= 48.8 && t < 93.4;
  const inD = t >= 92.4;
  const broll = (s: string, a: number, b: number, off: number) => ({
    src: `/film/stock/${s}.mp4`,
    at: (x: number) => (x >= a - 0.6 && x <= b + 0.6 ? off + (x - a) : null),
    op: eo(prog(t, a - 0.5, 0.6)) * (1 - eio(prog(t, b - 0.1, 0.6))),
    scale: 1.08 - 0.06 * prog(t, a, b - a),
  });
  const A = [broll("15149", 0, 3.8, 0.5), broll("15182", 3.6, 7.6, 1), broll("2293", 7.4, 11.4, 1)];
  const B = [broll("22126", 11.0, 17.6, 2), broll("41161", 17.4, 25.3, 1), broll("4939", 25.1, 31.4, 0), broll("144", 31.2, 37.6, 1), broll("4629", 37.4, 43.6, 1)];
  const wipeC = eio(prog(t, 48.9, 0.8)); // light sheet rising over the dark
  const glow = (x: number) => Math.sin(t * 0.35 + x) * 60;

  // UI device window
  const win = UI_WINDOWS.find(([a, b]) => t >= a && t < b) ?? null;
  const uiIn = eo(prog(t, 53.0, 0.9)) * (1 - eio(prog(t, 92.3, 0.6)));
  const lastCut = UI_WINDOWS.map((w) => w[0]).filter((a) => a > 53.4 && t >= a).pop();
  const flash = lastCut ? 1 - prog(t, lastCut, 0.25) : 0;

  return (
    <div className="film-stage">
      {/* A · possibility, bright footage */}
      {inA && A.map((c) => (
        <div key={c.src} className="layer" style={{ opacity: c.op }}>
          <Clip src={c.src} at={c.at} className="bg-video" style={{ transform: `scale(${c.scale})` }} />
          <div className="shade-a" />
        </div>
      ))}

      {/* B · constraint, dark footage */}
      {inB && (
        <div className="layer dark-base" style={{ opacity: eo(prog(t, 10.7, 0.7)) }}>
          {B.map((c) => (
            <div key={c.src} className="layer" style={{ opacity: c.op }}>
              <Clip src={c.src} at={c.at} className="bg-video" style={{ transform: `scale(${c.scale})` }} />
            </div>
          ))}
          <div className="shade-b" style={{ opacity: 0.62 + 0.38 * prog(t, 43.0, 1) }} />
          <div className="navy-glow" style={{ transform: `translate(${glow(1)}px, ${glow(2) / 2}px)` }} />
        </div>
      )}

      {/* C · prototype, light */}
      {inC && (
        <div className="layer light-base" style={{ clipPath: `inset(${(1 - wipeC) * 100}% 0 0 0)` }}>
          <div className="lam-glow g1" style={{ transform: `translate(${glow(0)}px, ${glow(3)}px)` }} />
          <div className="lam-glow g2" style={{ transform: `translate(${glow(5)}px, ${glow(1)}px)` }} />
          <div
            className="ui-frame"
            style={{
              opacity: uiIn,
              transform: `perspective(2200px) translate(${(1 - uiIn) * 80}px, ${Math.sin(t * 0.6) * 6}px) rotateY(${-11 + Math.sin(t * 0.25) * 1.5}deg) rotateX(${4}deg) scale(${0.94 + 0.06 * uiIn})`,
            }}
          >
            <Clip
              src="/film/ui.mp4"
              at={(x) => { const w = UI_WINDOWS.find(([a, b]) => x >= a && x < b); return w ? w[2] + (x - w[0]) * w[3] : x < 53.3 ? 0.8 : null; }}
              className="ui-video"
              style={{ transform: `scale(${win ? win[4] : 1.42})` }}
            />
            <div className="ui-flash" style={{ opacity: flash * 0.7 }} />
          </div>
        </div>
      )}

      {/* D · what changes, light with the app blurred behind */}
      {inD && (
        <div className="layer light-base" style={{ opacity: eo(prog(t, 92.5, 0.8)) }}>
          <Clip src="/film/ui.mp4" at={(x) => (x >= 92.4 ? 18 + (x - 92.4) * 0.6 : null)} className="bg-video blurred" />
          <div className="veil" />
          <div className="lam-glow g1" style={{ transform: `translate(${glow(2)}px, ${glow(4)}px)` }} />
        </div>
      )}

      {/* ---------- type ---------- */}
      <div className="type">
        {/* v01 */}
        <Kinetic t={t} at={0.9} out={3.0} text="Every day, someone *starts* *over.*" size={92} className="center light" accent="#fff" />
        <div className="stack-left">
          <Kinetic t={t} at={3.2} out={6.2} text="A new home." size={84} className="light" />
          <Kinetic t={t} at={4.1} out={6.25} text="A new school." size={84} className="light" />
          <Kinetic t={t} at={5.0} out={6.3} text="A new doctor." size={84} className="light" />
        </div>
        {/* v02 */}
        <Kinetic t={t} at={6.5} out={8.6} text="And every one of them asks for the same thing." size={60} className="center light" />
        <Kinetic t={t} at={8.7} out={10.8} text="Her *new* *address.*" size={150} className="center light" accent="#fff" />

        {/* v03 */}
        <Kinetic t={t} at={11.5} out={13.9} text="For a survivor of family violence," size={64} className="center light" />
        <Kinetic t={t} at={13.9} out={17.2} text="that address is the *most* *dangerous* thing she owns." size={78} className="center light wide" accent={ACC_DARK} />
        {/* v04 */}
        <Count t={t} at={17.8} out={22.6} value={1.5} decimals={1} suffix="M" style={{ top: 300 }} />
        <Kinetic t={t} at={18.7} out={22.6} text="Australian women have faced violence from a *former* partner." size={46} className="center light under" accent={ACC_DARK} />
        <Kinetic t={t} at={22.8} out={25.0} text="Most of them *move.*" size={110} className="center light" accent={ACC_DARK} />
        <Source t={t} at={18.0} out={25.0}>ABS, Personal Safety Survey 2021–22</Source>
        {/* v05 */}
        <Kinetic t={t} at={25.3} out={28.6} text="Then the address lands in" size={64} className="center light up" />
        <Kinetic t={t} at={26.4} out={30.2} text="*dozens* of systems." size={96} className="center light" accent={ACC_DARK} />
        <Kinetic t={t} at={27.6} out={30.25} text="*thousands* of staff." size={96} className="center light down" accent={ACC_DARK} />
        <Count t={t} at={30.6} out={36.8} value={2215} comma style={{ top: 300 }} />
        <Kinetic t={t} at={31.5} out={36.8} text="insider misuse allegations · Queensland · four years" size={46} className="center light under" />
        <Source t={t} at={30.6} out={36.8}>CCC Queensland, Operation Impala (2019)</Source>
        {/* v06 */}
        <Count t={t} at={37.6} out={42.9} value={90.4} decimals={1} suffix="%" style={{ top: 300 }} />
        <Kinetic t={t} at={38.5} out={42.9} text="of women abused by a husband in Viet Nam *never* sought formal help." size={46} className="center light under" accent={ACC_DARK} />
        <Source t={t} at={37.6} out={42.9}>National Study on Violence against Women in Viet Nam, 2019</Source>
        {/* v07 */}
        <Kinetic t={t} at={43.5} out={45.6} text="The problem isn't *hackers.*" size={92} className="center light" accent={ACC_DARK} />
        <Kinetic t={t} at={45.8} out={48.7} text="Someone always holds *the* *key.*" size={120} className="center light" accent={ACC_DARK} />

        {/* v08 · logo */}
        {t >= 49.6 && t < 53.6 && (
          <div className="logo" style={{ opacity: 1 - eio(prog(t, 52.8, 0.6)), transform: `translateY(${-eio(prog(t, 52.8, 0.6)) * 40}px)` }}>
            <Mark t={t} at={49.7} />
            <Kinetic t={t} at={50.3} out={60} text="unfound" size={120} className="word" stagger={0.04} />
            <Kinetic t={t} at={50.9} out={60} text="Be reached, *not* *found.*" size={44} className="slogan" accent={ACC_LIGHT} />
          </div>
        )}

        {/* v09 – v13 · left column beside the device */}
        <div className="left-col">
          <Eyebrow t={t} at={53.5} out={62.0}>01 · Seal once</Eyebrow>
          <Kinetic t={t} at={53.7} out={57.6} text="Sealed on *her* *phone.*" size={76} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={57.7} out={62.0} text="Our server only ever stores *ciphertext.*" size={60} className="dark" accent={ACC_LIGHT} />
          <Eyebrow t={t} at={62.5} out={67.0}>02 · Share the minimum</Eyebrow>
          <Kinetic t={t} at={62.6} out={65.0} text="The school sees *the* *zone.*" size={76} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={65.1} out={67.0} text="Nothing more." size={76} className="dark" />
          <Eyebrow t={t} at={67.5} out={77.8}>03 · No one alone</Eyebrow>
          <Kinetic t={t} at={67.6} out={70.4} text="Full admin rights." size={76} className="dark" />
          <Kinetic t={t} at={70.5} out={72.6} text="No *key.*" size={120} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={72.7} out={75.0} text="Alone, he *can't.*" size={76} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={75.1} out={77.8} text="Two of three must *sign.*" size={68} className="dark" accent={ACC_LIGHT} />
          <Eyebrow t={t} at={78.3} out={86.8}>04 · Emergencies, with witnesses</Eyebrow>
          <Kinetic t={t} at={78.4} out={81.6} text="Two *witnesses.*" size={84} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={81.7} out={84.3} text="One view." size={84} className="dark" />
          <Kinetic t={t} at={84.4} out={86.8} text="Then it's *gone.*" size={84} className="dark" accent={ACC_LIGHT} />
          <Kinetic t={t} at={87.3} out={92.2} text="Every attempt, *on* *record.*" size={72} className="dark" accent={ACC_LIGHT} />
        </div>
        <Pill t={t} at={56.6} out={61.8} style={{ left: 1080, top: 150 }}>doEncrypt · 3 tags</Pill>
        <Pill t={t} at={63.4} out={66.8} style={{ left: 1500, top: 880 }}>_tide_addrzone.selfdecrypt</Pill>
        <Pill t={t} at={70.0} out={77.6} style={{ left: 1060, top: 140 }}>change set · PENDING</Pill>
        <Pill t={t} at={72.0} out={77.6} dark style={{ left: 1420, top: 900 }}>412 QUORUM_NOT_MET</Pill>
        <Pill t={t} at={82.4} out={86.6} style={{ left: 1100, top: 150 }}>APPROVED · 2 of 3</Pill>
        <Pill t={t} at={85.0} out={86.6} dark style={{ left: 1480, top: 890 }}>role revoked after one use</Pill>

        {/* v14 */}
        <Kinetic t={t} at={92.9} out={95.5} text="Survivors stop choosing between *help* and *hiding.*" size={84} className="center dark wide" accent={ACC_LIGHT} />
        <Kinetic t={t} at={95.6} out={98.4} text="Services stop being *the* *leak.*" size={96} className="center dark" accent={ACC_LIGHT} />
        {/* v15 · what we built: numbers with the real cast and devices */}
        <Eyebrow t={t} at={98.9} out={103.9} style={{ left: 0, right: 0, top: 250, textAlign: "center" }}>What we built, and tested</Eyebrow>
        {t >= 99.0 && t < 104.6 && (
          <div className="built" style={{ opacity: 1 - eio(prog(t, 103.9, 0.5)) }}>
            {BUILT.map((s, i) => (
              <div key={s.l} className="built-cell">
                <div className="built-art">
                  {s.art.map((a, k) => (
                    <span key={k} className="built-chip" style={{ transform: `scale(${pop(t, 99.1 + i * 0.4 + k * 0.07)})`, opacity: clamp(prog(t, 99.1 + i * 0.4 + k * 0.07, 0.15)) }}>
                      {a}
                    </span>
                  ))}
                </div>
                <Count t={t} at={99.2 + i * 0.4} out={200} value={s.v} size={140} style={{ position: "static" }} />
                <Kinetic t={t} at={99.5 + i * 0.4} out={200} text={s.l} size={30} className="dark" />
              </div>
            ))}
          </div>
        )}

        {/* thanks to: the Tide ecosystem in the inner ring, the open stack orbiting outside */}
        <Kinetic t={t} at={104.2} out={110.3} text="*Thanks* *to*" size={76} className="center dark thanks" accent="#000" />
        {t >= 104.1 && t < 110.9 && <Orbit t={t} />}
        <Kinetic t={t} at={106.4} out={110.3} text="no one ever holds the master key." size={38} className="center dark thanks-sub" />

        {/* v16 · end card */}
        {t >= 110.9 && (
          <div className="logo end">
            <Mark t={t} at={111.0} size={120} />
            <Kinetic t={t} at={111.5} out={999} text="unfound" size={110} className="word" stagger={0.04} />
            <Kinetic t={t} at={112.0} out={999} text="Be reached, *not* *found.*" size={42} className="slogan" accent={ACC_LIGHT} />
            <Kinetic t={t} at={112.8} out={999} text="Built with TideCloak · Team GenData · RMIT Hackathon 2026" size={22} className="credit" stagger={0.03} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Film() {
  const [t, setT] = useState(() => Number(new URLSearchParams(window.location.search).get("t") ?? 0));
  const render = new URLSearchParams(window.location.search).has("render");

  useEffect(() => {
    document.documentElement.classList.add("film-mode");
    const w = window as unknown as { __film: object };
    w.__film = {
      duration: END,
      vo: T,
      sfx: SFX_CUES,
      ui: UI_WINDOWS,
      seek: async (x: number) => {
        setT(x);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await seekAll(x);
        await new Promise((r) => requestAnimationFrame(r));
      },
    };
    if (render) return;
    // Preview: play in real time (muted footage, no voice).
    let raf = 0;
    const t0 = performance.now() - t * 1000;
    const tick = () => {
      const x = (performance.now() - t0) / 1000;
      setT(x > END ? 0 : x);
      void seekAll(x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="film-root">
      <Frame t={t} />
    </div>
  );
}
