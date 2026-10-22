import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Landing } from "./landing/Landing";
import { Curtain } from "./motion/Intro";
import { SmoothScroll, scrollToTop } from "./motion/SmoothScroll";
import { useGlobalSfx } from "./motion/sfx";

// The demo (and the TideCloak SDK) loads in its own chunk, prefetched once the landing page is idle,
// so the curtain never waits on the network.
const loadDemo = () => import("./demo/Demo");
const Demo = lazy(() => loadDemo().then((m) => ({ default: m.Demo })));

function Page({ children }: { children: ReactNode }) {
  // The page itself stays put; the curtain does the moving. Exit waits for the curtain to cover.
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.5 } }}>
      <Suspense fallback={null}>{children}</Suspense>
      <Curtain />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Landing /></Page>} />
        <Route path="/demo" element={<Page><Demo /></Page>} />
        {/* TideCloak redirects here after sign-in; the provider finishes the login, then we show the demo. */}
        <Route path="/auth/redirect" element={<Page><Demo /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
