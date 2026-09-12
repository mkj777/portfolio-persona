import { type CSSProperties, useCallback, useRef, useState } from "react";
import { AngledBar } from "@/components/shape/AngledBar";
import { Heading, Kicker } from "@/components/ui/Button";
import { experience } from "@/content/experience";
import { sfx } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { useRovingList } from "@/lib/keyboard";
import { isTouchOnly, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import styles from "./screens.module.css";

const ROLE_TAGS = ["FS", "SEC", "ARC"];

/*
 * Profile screen in the Socials bar layout. The section pins and scroll walks through the
 * three pillars, hover and arrow keys pick directly.
 */
export function About() {
  const { t, list, ui } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  const select = useCallback((i: number) => {
    setActive((prev) => {
      if (prev !== i) sfx.play("hover");
      return i;
    });
  }, []);

  const { onKeyDown, itemProps } = useRovingList({
    count: experience.pillars.length,
    active,
    onChange: select,
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const pin = !reducedMotion() && !isTouchOnly();
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        once: true,
        onEnter: () => setMounted(true),
      });
      if (!pin) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=160%",
        pin: true,
        pinSpacing: true,
        /* The home wrapper carries the scroll skew transform, so fixed pinning would break. */
        pinType: "transform",
        onUpdate: (self) => {
          const next = Math.min(2, Math.floor(self.progress * 3));
          setActive((prev) => (prev === next ? prev : next));
        },
      });
    },
    { scope: root },
  );

  const pillar = experience.pillars[active] ?? experience.pillars[0];

  return (
    <section
      ref={root}
      id="about"
      className={`${styles.section} ${styles.about}`}
      data-scene="about"
    >
      <span className={styles.bgWord} aria-hidden="true">
        {ui.about.title}
      </span>
      <div>
        <div className={styles.sectionHead}>
          <Kicker>{ui.about.eyebrow}</Kicker>
          <Heading>{ui.about.title}</Heading>
        </div>
        <div
          className={styles.bars}
          role="tablist"
          aria-label={ui.about.eyebrow}
          onKeyDown={onKeyDown}
        >
          {experience.pillars.map((p, i) => (
            <AngledBar
              key={p.id}
              index={i}
              active={active === i}
              mounted={mounted}
              role={ROLE_TAGS[i] ?? ""}
              label={t(p.label)}
              right={<span>{String(i + 1).padStart(2, "0")}</span>}
              onSelect={() => select(i)}
              aria-controls={`about-panel-${p.id}`}
              {...itemProps(i)}
            />
          ))}
        </div>
      </div>
      <div className={styles.reveal} data-mounted={mounted}>
        <span className={styles.revealGhost2} aria-hidden="true" />
        <span className={styles.revealGhost} aria-hidden="true" />
        <div className={styles.revealPanel} id={`about-panel-${pillar?.id}`} role="tabpanel">
          <div className={styles.revealInner} key={pillar?.id}>
            <span className={styles.revealMeta}>
              {experience.company}, {experience.location}, {t(experience.period)}
            </span>
            <h3 className={styles.revealTitle}>{pillar ? t(pillar.title) : ""}</h3>
            <p className={styles.revealIntro}>{t(experience.intro)}</p>
            <ul className={styles.revealList}>
              {pillar
                ? list(pillar.bullets).map((b, i) => (
                    <li key={b} className={styles.revealItem} style={{ "--i": i } as CSSProperties}>
                      {b}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
