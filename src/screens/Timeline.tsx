import { useRef, useState } from "react";
import { OutlineWord } from "@/components/shape/OutlineWord";
import { SkewPanel } from "@/components/shape/SkewPanel";
import { SplitReveal } from "@/components/text/SplitReveal";
import { Heading, Kicker } from "@/components/ui/Button";
import { timeline } from "@/content/timeline";
import { useI18n } from "@/lib/i18n";
import { DUR, EASE, gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import styles from "./screens.module.css";

/*
 * Tartarus. Floors read chronologically top to bottom, the sticky column shows kind,
 * index and year of the active floor while a DrawSVG line follows the scroll.
 * Stations are the boss floors.
 */
export function Timeline() {
  const { t, ui } = useI18n();
  const root = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const [active, setActive] = useState(0);
  const total = timeline.length;

  useGSAP(
    () => {
      const el = root.current;
      const line = lineRef.current;
      if (!el) return;
      const floors = el.querySelectorAll<HTMLElement>("[data-floor]");
      floors.forEach((floor, i) => {
        ScrollTrigger.create({
          trigger: floor,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
        gsap.from(floor, {
          x: -40,
          opacity: 0,
          duration: reducedMotion() ? 0.01 : 0.6,
          ease: EASE.enter,
          delay: (i % 3) * (DUR.stagger / 2),
          scrollTrigger: { trigger: floor, start: "top 92%", once: true },
        });
      });
      if (line) {
        gsap.fromTo(
          line,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: el.querySelector("[data-floors]"),
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          },
        );
      }
    },
    { scope: root },
  );

  const current = timeline[active];

  return (
    <section ref={root} id="timeline" className={styles.section} data-scene="timeline">
      <span className={styles.bgWord} aria-hidden="true">
        TARTARUS
      </span>
      <div className={styles.sectionHead}>
        <Kicker>{ui.timeline.title}</Kicker>
        <Heading>{ui.timeline.title}</Heading>
        <SplitReveal as="p" className={styles.intro} text={ui.timeline.intro} />
      </div>
      <div className={styles.tower}>
        <div className={styles.towerSticky} aria-live="polite" aria-atomic="true">
          <span className={styles.floorLabel}>
            {current?.kind === "station" ? ui.timeline.station : ui.timeline.tech}{" "}
            {String(active + 1).padStart(2, "0")}/{total}
          </span>
          <OutlineWord
            className={styles.floorYear}
            tone={current?.kind === "station" ? "signal" : "cyan"}
          >
            {current?.date}
          </OutlineWord>
        </div>
        <div style={{ position: "relative" }}>
          <svg
            className={styles.floorLine}
            aria-hidden="true"
            viewBox="0 0 60 1000"
            preserveAspectRatio="none"
          >
            <line
              ref={lineRef}
              x1="14"
              y1="0"
              x2="14"
              y2="1000"
              stroke="#3ce2ff"
              strokeWidth="3"
              strokeDasharray="0"
            />
          </svg>
          <ol className={styles.floors} data-floors>
            {timeline.map((entry, i) => (
              <li
                key={entry.sortKey}
                className={styles.floor}
                data-floor
                data-kind={entry.kind}
                data-active={active === i}
              >
                <SkewPanel
                  cut={entry.kind === "station" ? "xl" : "lg"}
                  tone={entry.kind === "station" ? "deep" : "glass"}
                  skew={-4}
                  shadow={entry.kind === "station" ? "red" : "none"}
                  className={styles.floorSurface}
                  innerClassName={styles.floorPanel}
                >
                  <span className={styles.floorDate}>{entry.date}</span>
                  <h3 className={styles.floorTitle}>{t(entry.title)}</h3>
                  <p className={styles.floorDetail}>{t(entry.detail)}</p>
                  <span className={styles.floorKind} aria-hidden="true">
                    {entry.kind === "station" ? ui.timeline.station : ui.timeline.tech}
                  </span>
                </SkewPanel>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
