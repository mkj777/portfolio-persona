import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { EASE, gsap, reducedMotion } from "@/lib/motion";
import { appStore } from "@/lib/store";
import styles from "./wipe.module.css";

export type WipeVariant = "default" | "about" | "socials" | "resume";

type WipeOptions = {
  variant?: WipeVariant;
  /* Runs while the screen is covered, after navigation. */
  onCover?: () => void;
};

type WipeApi = {
  wipeTo: (to: string, opts?: WipeOptions) => void;
  /* Cover, run a callback, uncover. No navigation. */
  wipe: (opts?: WipeOptions) => void;
};

const WipeContext = createContext<WipeApi | null>(null);

const DEFAULT_BLOCKS = ["#0d1a3a", "#1a6aff", "#7dd4fc"];
const ABOUT_BANDS = [
  { color: "#00184c", top: "-12vh", left: "-18vw", width: "86vw" },
  { color: "#53edff", top: "24vh", left: "-10vw", width: "72vw" },
  { color: "#ffffff", top: "58vh", left: "-14vw", width: "82vw" },
];
const SOCIALS_STRIPES = [
  { color: "#00184c", left: "72vw", width: "24vw" },
  { color: "#00dff7", left: "80vw", width: "14vw" },
  { color: "#ffffff", left: "88vw", width: "8vw" },
];
const RESUME_CARDS = [
  { top: "14vh", color: "#0f1760" },
  { top: "31vh", color: "#7ff6ff" },
  { top: "48vh", color: "#ffffff" },
  { top: "65vh", color: "#0f1760" },
];

/*
 * Builds one timeline per variant with a "cover" label at the moment the screen is
 * hidden. The route swap happens there, so the old content never has to animate out.
 */
function buildTimeline(variant: WipeVariant, layer: HTMLElement): gsap.core.Timeline {
  const pieces = Array.from(layer.querySelectorAll<HTMLElement>("[data-piece]"));
  const tl = gsap.timeline({ paused: true });
  tl.set(layer, { attr: { "data-active": "true" } }, 0);

  switch (variant) {
    case "about": {
      pieces.forEach((p, i) => {
        tl.fromTo(
          p,
          { x: -500, opacity: 1 },
          { x: 20, duration: 0.354, ease: EASE.enter },
          i * 0.05,
        ).to(p, { x: 0, opacity: 0, duration: 0.17, ease: EASE.enter }, 0.354 + i * 0.05);
      });
      tl.addLabel("cover", 0.28);
      break;
    }
    case "socials": {
      pieces.forEach((p, i) => {
        tl.fromTo(p, { y: "-120vh" }, { y: 0, duration: 0.235, ease: EASE.wipe }, i * 0.06).to(
          p,
          { y: "120vh", duration: 0.235, ease: EASE.wipe },
          0.325 + i * 0.06,
        );
      });
      tl.addLabel("cover", 0.36);
      break;
    }
    case "resume": {
      pieces.forEach((p, i) => {
        tl.fromTo(p, { x: "-100vw" }, { x: 30, duration: 0.29, ease: EASE.wipe }, i * 0.05)
          .to(p, { x: 0, duration: 0.13, ease: EASE.enter }, 0.29 + i * 0.05)
          .to(p, { x: "100vw", duration: 0.18, ease: EASE.wipe }, 0.42 + i * 0.05);
      });
      tl.addLabel("cover", 0.44);
      break;
    }
    default: {
      pieces.forEach((p, i) => {
        tl.fromTo(
          p,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.18, ease: EASE.wipe },
          i * 0.05,
        );
      });
      tl.addLabel("cover", 0.3);
      pieces.forEach((p, i) => {
        tl.set(p, { transformOrigin: "right center" }, `cover+=${0.06 + i * 0.05}`).to(
          p,
          { scaleX: 0, duration: 0.18, ease: EASE.wipe },
          `cover+=${0.06 + i * 0.05}`,
        );
      });
    }
  }
  tl.set(layer, { attr: { "data-active": "false" } });
  return tl;
}

export function WipeProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const layers = useRef<Record<WipeVariant, HTMLDivElement | null>>({
    default: null,
    about: null,
    socials: null,
    resume: null,
  });
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const run = useCallback(
    (to: string | null, opts?: WipeOptions) => {
      const variant = opts?.variant ?? "default";
      const layer = layers.current[variant];
      const swap = () => {
        if (to) navigate(to);
        opts?.onCover?.();
      };
      if (!layer || reducedMotion() || busyRef.current) {
        if (busyRef.current) return;
        swap();
        return;
      }
      busyRef.current = true;
      setBusy(true);
      appStore.set({ wiping: true });
      const content = document.getElementById("content-root");
      const tl = buildTimeline(variant, layer);
      tl.call(swap, [], "cover");
      if (content) {
        tl.set(content, { opacity: 0 }, "cover").to(
          content,
          { opacity: 1, duration: 0.24, ease: "none" },
          "cover+=0.12",
        );
      }
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
        setBusy(false);
        appStore.set({ wiping: false });
        tl.kill();
      });
      tl.play();
    },
    [navigate],
  );

  const api = useMemo<WipeApi>(
    () => ({
      wipeTo: (to, opts) => run(to, opts),
      wipe: (opts) => run(null, opts),
    }),
    [run],
  );

  return (
    <WipeContext.Provider value={api}>
      {children}
      <div aria-hidden="true" data-busy={busy}>
        <div
          className={styles.layer}
          ref={(el) => {
            layers.current.default = el;
          }}
        >
          {DEFAULT_BLOCKS.map((color, i) => (
            <div
              key={color}
              data-piece
              className={`${styles.piece} ${styles.block}`}
              style={{ background: color, zIndex: 999 - i }}
            />
          ))}
        </div>
        <div
          className={styles.layer}
          ref={(el) => {
            layers.current.about = el;
          }}
        >
          {ABOUT_BANDS.map((b, i) => (
            <div
              key={b.color}
              data-piece
              className={`${styles.piece} ${styles.band}`}
              style={{
                background: b.color,
                top: b.top,
                left: b.left,
                width: b.width,
                zIndex: 999 - i,
              }}
            />
          ))}
        </div>
        <div
          className={styles.layer}
          ref={(el) => {
            layers.current.socials = el;
          }}
        >
          {SOCIALS_STRIPES.map((s, i) => (
            <div
              key={s.color}
              data-piece
              className={`${styles.piece} ${styles.stripe}`}
              style={{ background: s.color, left: s.left, width: s.width, zIndex: 999 - i }}
            />
          ))}
        </div>
        <div
          className={styles.layer}
          ref={(el) => {
            layers.current.resume = el;
          }}
        >
          {RESUME_CARDS.map((c, i) => (
            <div
              key={c.top}
              data-piece
              className={`${styles.piece} ${styles.card}`}
              style={{
                background: c.color,
                top: c.top,
                zIndex: 999 - i,
                boxShadow: c.color === "#ffffff" ? "10px 0 0 #d63232" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </WipeContext.Provider>
  );
}

export function useWipe(): WipeApi {
  const ctx = useContext(WipeContext);
  if (!ctx) throw new Error("useWipe must be used inside WipeProvider");
  return ctx;
}
