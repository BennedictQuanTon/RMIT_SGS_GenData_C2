import { useEffect, type ComponentType } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  Baby, BadgeCheck, Building2, Bus, EyeOff, FileText, Fingerprint, HeartPulse, House, KeyRound, Landmark, Lock, Mail,
  MapPinOff, Phone, Scale, School, Shield, Stethoscope, Vote,
  type LucideProps,
} from "lucide-react";
import { ease } from "../motion/tokens";

// The survivor's door stands on a dark platform. Around it, the services she uses float as coins:
// light coins can reach her (a sealed share), dark coins are everyone who must not find her.
type Icon = ComponentType<LucideProps>;
interface Coin { ring: 0 | 1; a: number; light: boolean; icon: Icon }

const CX = 600, CY = 330;
const RINGS = [
  { rx: 300, ry: 150 },
  { rx: 485, ry: 222 },
];

const COINS: Coin[] = [
  { ring: 0, a: 200, light: false, icon: Shield },
  { ring: 0, a: 232, light: true, icon: School },
  { ring: 0, a: 308, light: true, icon: Stethoscope },
  { ring: 0, a: 340, light: false, icon: Fingerprint },
  { ring: 0, a: 20, light: false, icon: Lock },
  { ring: 0, a: 62, light: true, icon: Mail },
  { ring: 0, a: 118, light: false, icon: Building2 },
  { ring: 0, a: 160, light: true, icon: Scale },
  { ring: 1, a: 188, light: false, icon: Landmark },
  { ring: 1, a: 212, light: true, icon: Baby },
  { ring: 1, a: 240, light: false, icon: EyeOff },
  { ring: 1, a: 300, light: false, icon: KeyRound },
  { ring: 1, a: 326, light: true, icon: HeartPulse },
  { ring: 1, a: 352, light: false, icon: Vote },
  { ring: 1, a: 16, light: true, icon: Phone },
  { ring: 1, a: 42, light: false, icon: FileText },
  { ring: 1, a: 138, light: false, icon: Bus },
  { ring: 1, a: 164, light: true, icon: House },
  { ring: 1, a: 92, light: true, icon: BadgeCheck },
  { ring: 0, a: 90, light: false, icon: MapPinOff },
];

const placed = COINS.map((c, i) => {
  const r = RINGS[c.ring];
  const rad = (c.a * Math.PI) / 180;
  return { ...c, i, x: CX + r.rx * Math.cos(rad), y: CY + r.ry * Math.sin(rad) };
}).sort((p, q) => p.y - q.y);

const DOOR_BASE = 372;

function CoinShape({ x, y, light, icon: I }: { x: number; y: number; light: boolean; icon: Icon }) {
  const rx = 34, ry = 17, t = 8;
  return (
    <g>
      <ellipse cx={x} cy={y + t} rx={rx} ry={ry} fill="#fff" stroke="#000" strokeWidth="1.6" />
      <rect x={x - rx} y={y} width={rx * 2} height={t} fill="#fff" />
      <line x1={x - rx} y1={y} x2={x - rx} y2={y + t} stroke="#000" strokeWidth="1.6" />
      <line x1={x + rx} y1={y} x2={x + rx} y2={y + t} stroke="#000" strokeWidth="1.6" />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={light ? "#d9e4ff" : "#0b0b0b"} stroke="#000" strokeWidth="1.6" />
      <g transform={`translate(${x - 11} ${y - 6.5}) scale(1 0.56)`}>
        <I size={22} color={light ? "#000" : "#fff"} strokeWidth={2.4} />
      </g>
    </g>
  );
}

function FloatingCoin({ c, k, mx, my }: { c: (typeof placed)[number]; k: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const depth = c.ring === 1 ? 14 : 7;
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth * 0.6);
  return (
    <motion.g style={{ x, y }}>
      <motion.g
        initial={{ opacity: 0, y: -36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.55 + k * 0.035 }}
      >
        <g className="bob" style={{ animationDuration: `${4.2 + (c.i % 5) * 0.55}s`, animationDelay: `${-(c.i * 0.7)}s` }}>
          <CoinShape x={c.x} y={c.y} light={c.light} icon={c.icon} />
        </g>
      </motion.g>
    </motion.g>
  );
}

function Door({ mx }: { mx: MotionValue<number> }) {
  // The Unfound mark, extruded: 18 dark layers stepping back, then a pale front face.
  const layers = Array.from({ length: 18 }, (_, i) => 18 - i);
  const x = useTransform(mx, (v) => v * -4);
  const path = "M16 60V28a16 16 0 0 1 32 0v32";
  return (
    <motion.g
      style={{ x }}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.35 }}
    >
      <ellipse cx={CX} cy={DOOR_BASE + 6} rx="92" ry="20" fill="#000" opacity="0.55" filter="url(#soft)" />
      <g transform={`translate(${CX - 96} ${DOOR_BASE - 180}) scale(3)`}>
        {layers.map((l) => (
          <g key={l} transform={`translate(${l * 0.42} ${-l * 0.3})`}>
            <path d={path} fill="none" stroke={`url(#side)`} strokeWidth="9" />
            <circle cx="32" cy="28" r="5.5" fill="url(#side)" />
          </g>
        ))}
        <path d={path} fill="none" stroke="#000" strokeWidth="10.4" />
        <path d={path} fill="none" stroke="url(#face)" strokeWidth="9" />
        <circle cx="32" cy="28" r="6.2" fill="#000" />
        <circle cx="32" cy="28" r="5.5" fill="url(#face)" />
      </g>
    </motion.g>
  );
}

export function HeroScene() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  const back = placed.filter((c) => c.y < DOOR_BASE - 40);
  const front = placed.filter((c) => c.y >= DOOR_BASE - 40);

  return (
    <svg className="hero-scene" viewBox="0 70 1200 520" role="img" aria-label="The survivor's door on a dark platform, surrounded by the services she uses: light coins can reach her, dark coins cannot find her">
      <defs>
        <radialGradient id="pit" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" />
          <stop offset="45%" stopColor="#0d0d0d" />
          <stop offset="75%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c7dcff" />
        </linearGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
        </filter>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="pitClip">
          <ellipse cx={CX} cy={CY + 20} rx="360" ry="210" />
        </clipPath>
      </defs>

      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: ease.outExpo, delay: 0.15 }} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <ellipse cx={CX} cy={CY + 20} rx="360" ry="210" fill="url(#pit)" />
        <g clipPath="url(#pitClip)" opacity="0.16">
          <rect x={CX - 360} y={CY - 190} width="720" height="420" filter="url(#grain)" />
        </g>
        {/* A signal leaves the door and fades: services can reach her */}
        <ellipse className="ping" cx={CX} cy={DOOR_BASE} rx="120" ry="40" fill="none" stroke="#8dbbff" strokeWidth="1.5" />
        <ellipse className="ping ping-2" cx={CX} cy={DOOR_BASE} rx="120" ry="40" fill="none" stroke="#8dbbff" strokeWidth="1.5" />
      </motion.g>

      {back.map((c, k) => <FloatingCoin key={c.i} c={c} k={k} mx={sx} my={sy} />)}
      <Door mx={sx} />
      {front.map((c, k) => <FloatingCoin key={c.i} c={c} k={k + back.length} mx={sx} my={sy} />)}
    </svg>
  );
}
