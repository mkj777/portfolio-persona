import { type ComponentPropsWithoutRef, useRef } from "react";
import { gsap, reducedMotion, useGSAP } from "@/lib/motion";

type Props = {
  text: string;
  trigger?: "scroll" | "mount";
  duration?: number;
  chars?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

/* ScrambleText for counters, floor numbers and the 404 title. Final text is in the DOM from the start. */
export function Scramble({
  text,
  trigger = "scroll",
  duration = 0.8,
  chars = "0123456789ABCDEF",
  delay = 0,
  ...rest
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      gsap.to(el, {
        duration,
        delay,
        scrambleText: { text, chars, speed: 0.5, revealDelay: 0.1 },
        scrollTrigger:
          trigger === "scroll" ? { trigger: el, start: "top 90%", once: true } : undefined,
      });
    },
    { scope: ref, dependencies: [text, trigger, duration, chars, delay] },
  );

  return (
    <span {...rest}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
