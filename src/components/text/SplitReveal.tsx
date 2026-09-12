import { type ComponentPropsWithoutRef, type ElementType, useRef } from "react";
import { EASE, gsap, reducedMotion, SplitText, useGSAP } from "@/lib/motion";

type Props<T extends ElementType> = {
  as?: T;
  text: string;
  type?: "lines" | "words" | "chars";
  /* "scroll" reveals when the element enters the viewport, "mount" right away, "manual" never (parent drives). */
  trigger?: "scroll" | "mount" | "manual";
  delay?: number;
  stagger?: number;
  yPercent?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/*
 * SplitText with mask, autoSplit and built-in ARIA: the text stays selectable
 * and readable, only the visual pieces move.
 */
export function SplitReveal<T extends ElementType = "p">({
  as,
  text,
  type = "lines",
  trigger = "scroll",
  delay = 0,
  stagger,
  yPercent = 110,
  className,
  ...rest
}: Props<T>) {
  const Comp = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || trigger === "manual") return;
      const eachStagger = stagger ?? (type === "chars" ? 0.04 : type === "words" ? 0.05 : 0.08);
      SplitText.create(el, {
        type: type === "lines" ? "lines" : `${type},lines`,
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit: (self) => {
          const targets =
            type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent,
            opacity: type === "lines" ? 1 : 0.001,
            duration: reducedMotion() ? 0.01 : 0.9,
            ease: EASE.enter,
            stagger: eachStagger,
            delay,
            scrollTrigger:
              trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
          });
        },
      });
    },
    { scope: ref, dependencies: [text, type, trigger, delay, stagger, yPercent] },
  );

  return (
    <Comp ref={ref} className={className} {...rest}>
      {text}
    </Comp>
  );
}
