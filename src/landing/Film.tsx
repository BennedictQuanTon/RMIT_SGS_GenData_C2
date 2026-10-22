import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Reveal } from "../motion/primitives";

// The two-minute film, sitting under the Approach headline. It plays muted on its own when it
// scrolls into view (browsers only allow muted autoplay) and pauses when it leaves; the button
// turns the sound on.
const SRC = "/video/unfound.mp4";

export function FilmPlayer() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(frame, { amount: 0.45 });
  const [has, setHas] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    fetch(SRC, { method: "HEAD" })
      .then((r) => setHas(r.ok && (r.headers.get("content-type") ?? "").startsWith("video")))
      .catch(() => setHas(false));
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) void v.play().catch(() => {});
    else v.pause();
  }, [inView, has]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) void v.play().catch(() => {});
  };

  return (
    <Reveal className="film-frame">
      <div ref={frame} className="film-inner">
        {has && <video ref={video} src={SRC} muted playsInline loop preload="metadata" />}
        {has && (
          <button className="film-sound" data-sfx="none" onClick={toggle} aria-pressed={!muted} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
            <svg width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
              {muted ? (
                <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        )}
      </div>
    </Reveal>
  );
}
