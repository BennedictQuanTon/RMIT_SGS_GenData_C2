import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Landing } from "./landing/Landing";
import { Morph } from "./motion/Morph";
import { SmoothScroll, scrollToTop } from "./motion/SmoothScroll";
import { useGlobalSfx } from "./motion/sfx";

// The demo (and the TideCloak SDK) loads in its own chunk, prefetched once the landing page is idle,
// so the curtain never waits on the network.
const loadDemo = () => import("./demo/Demo");
const Demo = lazy(() => loadDemo().then((m) => ({ default: m.Demo })));
const FilmPage = lazy(() => import("./film/Film").then((m) => ({ default: m.Film })));

function Page({ children }: { children: ReactNode }) {
  // The page itself stays put; the Morph sheet does the moving. Exit waits until the sheet covers it.
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.7 } }}>
      <Suspense fallback={null}>{children}</Suspense>
    </motion.div>
  );
}

// Opening the app straight on /demo: the black curtain lifts off the page once.
function BootCurtain() {
  return (
    <motion.div
      className="curtain"
      aria-hidden="true"
      initial={{ scaleY: 1, originY: 0 }}
      animate={{ scaleY: 0, originY: 0 }}
      transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1], delay: 0.35 }}
    >
      <motion.svg width="56" height="56" viewBox="0 0 64 64" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: 1 }} transition={{ duration: 0.8 }}>
        <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke="#fff" strokeWidth="9" />
        <circle cx="32" cy="28" r="5.5" fill="#fff" />
      </motion.svg>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [boot] = useState(() => location.pathname !== "/" && !location.pathname.startsWith("/film") && !new URLSearchParams(location.search).has("embed"));
  if (location.pathname === "/film") return <Suspense fallback={null}><FilmPage /></Suspense>;
  return (
    <>
    {boot && <BootCurtain />}
    <Morph />
    <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Landing /></Page>} />
        <Route path="/demo" element={<Page><Demo /></Page>} />
        {/* TideCloak redirects here after sign-in; the provider finishes the login, then we show the demo. */}
        <Route path="/auth/redirect" element={<Page><Demo /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    </>
  );
}

export function App() {
  useGlobalSfx();
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
    idle(() => void loadDemo());
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SmoothScroll />
        <AnimatedRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}
