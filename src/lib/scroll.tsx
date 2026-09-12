import Lenis from "lenis";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, isTouchOnly, reducedMotion, ScrollTrigger } from "./motion";

type ScrollTarget = string | number | HTMLElement;

type ScrollApi = {
  scrollTo: (target: ScrollTarget, opts?: { immediate?: boolean; offset?: number }) => void;
  stop: () => void;
  start: () => void;
  /* Current smoothed velocity, used for the scroll skew. */
  velocity: () => number;
  enabled: boolean;
};

const ScrollContext = createContext<ScrollApi | null>(null);

function nativeScrollTo(target: ScrollTarget, immediate?: boolean) {
  const behavior: ScrollBehavior = immediate || reducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior, block: "start" });
}

/*
 * Lenis smooth scroll wired into the GSAP ticker. Off for reduced motion and touch-only
 * devices, where native scrolling is the better feel anyway.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const enabled = useMemo(() => !reducedMotion() && !isTouchOnly(), []);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  const api = useMemo<ScrollApi>(
    () => ({
      enabled,
      scrollTo: (target, opts) => {
        const lenis = lenisRef.current;
        if (lenis) {
          /* Dimensions are observed asynchronously, a route swap needs a fresh limit right now. */
          lenis.resize();
          lenis.scrollTo(target, {
            immediate: opts?.immediate,
            offset: opts?.offset ?? 0,
            duration: 1.1,
            easing: (t: number) => 1 - (1 - t) ** 4,
          });
        } else {
          nativeScrollTo(target, opts?.immediate);
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      velocity: () => lenisRef.current?.velocity ?? 0,
    }),
    [enabled],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useScroll(): ScrollApi {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used inside ScrollProvider");
  return ctx;
}
