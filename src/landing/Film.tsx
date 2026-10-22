import { useEffect, useState } from "react";
import { Reveal } from "../motion/primitives";

// Slot for the two-minute film. Drop the file at public/video/unfound.mp4 and it appears here;
// until then the frame stays empty on purpose.
const SRC = "/video/unfound.mp4";

export function Film() {
  const [has, setHas] = useState(false);
  useEffect(() => {
    fetch(SRC, { method: "HEAD" })
      .then((r) => setHas(r.ok && (r.headers.get("content-type") ?? "").startsWith("video")))
      .catch(() => setHas(false));
  }, []);
  return (
    <section id="film" className="section film">
      <div className="container">
        <Reveal className="film-frame">
          {has && <video src={SRC} controls playsInline preload="metadata" />}
        </Reveal>
      </div>
    </section>
  );
}
