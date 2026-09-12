import { useEffect, useRef } from "react";
import { useWipe } from "@/components/motion/PageWipe";
import { Scramble } from "@/components/text/Scramble";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { appStore } from "@/lib/store";
import styles from "./routes.module.css";

/* "Now Loading" look for routes that do not exist. */
export function NotFound() {
  const { ui } = useI18n();
  const { wipeTo } = useWipe();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    appStore.set({ scene: "menu", hints: "detail" });
    root.current?.focus({ preventScroll: true });
  }, []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: scoped Escape handler, focus target after navigation
    <div
      ref={root}
      className={styles.notFound}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          wipeTo("/", { variant: "default" });
        }
      }}
    >
      <svg
        className={styles.notFoundSplash}
        viewBox="0 0 100 100"
        aria-hidden="true"
        role="presentation"
      >
        <path
          d="M20 30 L70 5 L95 40 L80 90 L35 95 L5 60 Z"
          fill="none"
          stroke="#3ce2ff"
          strokeWidth="1.5"
        />
        <path
          d="M30 0 L85 10 L100 60 L60 95 L10 100 L0 30 Z"
          fill="none"
          stroke="#c4001a"
          strokeWidth="1"
        />
      </svg>
      <h1 className={styles.notFoundTitle}>
        <Scramble text={ui.notFound.title} trigger="mount" duration={1.2} chars="NOWLADIG404" />
      </h1>
      <p className={styles.notFoundText}>{ui.notFound.text}</p>
      <Button onClick={() => wipeTo("/", { variant: "default" })}>{ui.notFound.back}</Button>
    </div>
  );
}
