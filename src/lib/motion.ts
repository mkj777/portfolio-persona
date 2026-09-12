import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  CustomEase,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
);

/* Mirror of the CSS easing tokens. Only these four, never ease-in-out. */
CustomEase.create("enter", "0.22,1,0.36,1");
CustomEase.create("wipe", "0.76,0,0.24,1");
CustomEase.create("pop", "0.34,1.56,0.64,1");
CustomEase.create("reveal", "0.16,1,0.3,1");

export const EASE = {
  enter: "enter",
  wipe: "wipe",
  pop: "pop",
  reveal: "reveal",
} as const;

/* Seconds, mirrors --dur-* in tokens.css. */
export const DUR = {
  color: 0.12,
  micro: 0.16,
  shape: 0.22,
  pop: 0.28,
  enter: 0.38,
  bar: 0.55,
  wipe: 0.45,
  reveal: 1.2,
  stagger: 0.08,
} as const;

const mql =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

export function reducedMotion(): boolean {
  return mql?.matches ?? false;
}

export function isTouchOnly(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

function applyReducedMotion() {
  gsap.globalTimeline.timeScale(reducedMotion() ? 100 : 1);
}
applyReducedMotion();
mql?.addEventListener("change", applyReducedMotion);

gsap.defaults({ ease: EASE.enter, duration: DUR.enter });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, useGSAP };
