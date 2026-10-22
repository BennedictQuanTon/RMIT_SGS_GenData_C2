import { motion } from "motion/react";
import { KeyRound, Play, Sparkles } from "lucide-react";
import { Mark } from "../brand/Logo";
import { Avatar } from "../brand/Avatar";
import { ACTORS } from "./engine";
import { ease } from "../motion/tokens";

// The welcome screen in front of /demo: the cast gathers around the mark, and you choose how to run it.
export function Gate({ liveReady, onLive, onMock, onStory }: { liveReady: boolean; onLive: () => void; onMock: () => void; onStory: () => void }) {
  // Seven people on an ellipse around the mark.
  const seats = ACTORS.map((a, i) => {
    const ang = (-90 + (i * 360) / ACTORS.length) * (Math.PI / 180);
    return { a, x: 50 + 44 * Math.cos(ang), y: 50 + 45 * Math.sin(ang), i };
  });

  return (
    <div className="gate">
      <div className="gate-stage" aria-hidden="true">
        {seats.map(({ a, x, y, i }) => (
          <motion.div
            key={a.id}
            className="gate-person"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 + i * 0.07 }}
          >
            <div className="bob-soft" style={{ animationDelay: `${-i * 0.8}s` }}>
              <Avatar id={a.id} size={84} />
              <span>{a.name.split(" ")[0]}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="gate-center">
        <motion.div className="gate-brand" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>
          <Mark size={56} />
          <span>unfound</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.35 }}>
          Welcome. <em>Pick a seat.</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          Seven people, one address, no master key. How would you like to run it?
        </motion.p>

        <div className="gate-choices">
          <motion.button
            className="gate-choice dark"
            onClick={onLive}
            disabled={!liveReady}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out, delay: 0.7 }}
          >
            <span className="gate-icon"><KeyRound size={26} strokeWidth={2} /></span>
            <span className="gate-text">
              <b>Sign in with Tide</b>
              <span>{liveReady ? "Real TideCloak. Encrypt and decrypt run on Tide's network." : "Connect the local TideCloak realm first (docs/LIVE_TIDECLOAK.md)."}</span>
            </span>
            <span className="gate-tag">{liveReady ? "Live" : "Not set up"}</span>
          </motion.button>

          <motion.button
            className="gate-choice"
            onClick={onMock}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out, delay: 0.8 }}
          >
            <span className="gate-icon"><Sparkles size={26} strokeWidth={2} /></span>
            <span className="gate-text">
              <b>Explore without an account</b>
              <span>The same flow on a local mock fabric. Switch between all seven people.</span>
            </span>
            <span className="gate-tag">Instant</span>
          </motion.button>
        </div>

        <motion.button className="gate-story" onClick={onStory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <Play size={14} fill="currentColor" /> or watch the 70-second story, with sound
        </motion.button>
      </div>
    </div>
  );
}
