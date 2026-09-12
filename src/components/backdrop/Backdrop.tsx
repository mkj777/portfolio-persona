import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { backdrops } from "@/content/backdrops";
import { profile } from "@/content/profile";
import { resolveBackdropMode } from "@/lib/backdrop-mode";
import { EASE, gsap, reducedMotion, useGSAP } from "@/lib/motion";
import { type Scene, useApp } from "@/lib/store";
import styles from "./backdrop.module.css";

const GenerativeCanvas = lazy(() =>
  import("./GenerativeCanvas").then((m) => ({ default: m.GenerativeCanvas })),
);

const VIDEO_SCENE: Record<Scene, keyof typeof backdrops.video> = {
  menu: "menu",
  home: "home",
  about: "about",
  projects: "home",
  skills: "about",
  timeline: "home",
  contact: "about",
  resume: "resume",
  detail: "resume",
};

/* Six angular splash shapes, morphed on scene change. */
const SPLASHES = [
  "M20 30 L70 5 L95 40 L80 90 L35 95 L5 60 Z",
  "M10 20 L60 0 L100 30 L85 70 L50 100 L0 75 Z",
  "M25 5 L90 15 L100 55 L65 95 L15 85 L0 40 Z",
  "M5 35 L45 0 L95 20 L90 65 L55 100 L10 80 Z",
  "M15 10 L75 0 L100 45 L70 100 L20 90 L0 50 Z",
  "M30 0 L85 10 L100 60 L60 95 L10 100 L0 30 Z",
];

function VideoLoop({ scene }: { scene: Scene }) {
  const entry = backdrops.video[VIDEO_SCENE[scene]];
  const [ready, setReady] = useState(false);
  if (!entry) return null;
  return (
    <video
      key={entry.src}
      className={styles.video}
      data-ready={ready}
      src={entry.src}
      poster={entry.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onCanPlay={() => setReady(true)}
      onError={() => setReady(false)}
    />
  );
}

/*
 * One instance under everything, persistent across routes. Scene comes from the store,
 * mode from content or the ?bg= query.
 */
export function Backdrop() {
  const scene = useApp((s) => s.scene);
  const menuOpen = useApp((s) => s.menuOpen);
  const mode = useMemo(resolveBackdropMode, []);
  const effectiveScene: Scene = menuOpen ? "menu" : scene;
  const splashRef = useRef<SVGPathElement>(null);
  const [canvasOn, setCanvasOn] = useState(false);

  useEffect(() => {
    if (mode === "video") return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const id = idle(() => setCanvasOn(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, [mode]);

  useGSAP(
    () => {
      const path = splashRef.current;
      if (!path) return;
      const order: Scene[] = [
        "home",
        "about",
        "projects",
        "skills",
        "timeline",
        "contact",
        "resume",
        "detail",
        "menu",
      ];
      const shape = SPLASHES[order.indexOf(effectiveScene) % SPLASHES.length] ?? SPLASHES[0];
      gsap.to(path, {
        morphSVG: shape,
        duration: reducedMotion() ? 0.01 : 0.6,
        ease: EASE.enter,
      });
    },
    { dependencies: [effectiveScene] },
  );

  return (
    <div className={styles.root} data-mode={mode} data-scene={effectiveScene} aria-hidden="true">
      <div className={styles.sun} />
      {mode !== "generative" ? <VideoLoop scene={effectiveScene} /> : null}
      {canvasOn ? (
        <Suspense fallback={null}>
          <GenerativeCanvas scene={effectiveScene} />
        </Suspense>
      ) : null}
      <div className={styles.scanlines} />
      <div className={styles.mask} />
      <svg
        className={styles.splash}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <path ref={splashRef} d={SPLASHES[0]} />
      </svg>
      <div className={styles.word}>{profile.wordmark}</div>
    </div>
  );
}
