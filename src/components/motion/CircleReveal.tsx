import { useRef, useState } from "react";
import { DUR, EASE, gsap, reducedMotion, useGSAP } from "@/lib/motion";
import styles from "./wipe.module.css";

/* Blue cover with a hole growing from the center: circle(0) to circle(150vmax) in 1.2 s. */
export function CircleReveal({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(reducedMotion());

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || done) return;
      gsap.to(el, {
        "--r": "150vmax",
        duration: DUR.reveal,
        delay,
        ease: EASE.reveal,
        onComplete: () => setDone(true),
      });
    },
    { scope: ref, dependencies: [delay, done] },
  );

  if (done) return null;
  return <div ref={ref} className={styles.circle} aria-hidden="true" />;
}
