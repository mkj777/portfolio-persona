import { type CSSProperties, useRef, useState } from "react";
import { Scramble } from "@/components/text/Scramble";
import { SplitReveal } from "@/components/text/SplitReveal";
import { Heading, Kicker } from "@/components/ui/Button";
import { skills } from "@/content/skills";
import { useI18n } from "@/lib/i18n";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import styles from "./screens.module.css";

/*
 * Stats screen. Bars are decorative and equal, no invented percentages.
 * Ranks only where they are honest (languages).
 */
export function Skills() {
  const { t, list, ui } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        once: true,
        onEnter: () => setInView(true),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className={styles.section} data-scene="skills">
      <span className={styles.bgWord} aria-hidden="true">
        {ui.skills.title}
      </span>
      <div className={styles.sectionHead}>
        <Kicker>{ui.nav.skills}</Kicker>
        <Heading>{ui.skills.title}</Heading>
        <SplitReveal as="p" className={styles.intro} text={ui.skills.intro} />
      </div>
      <ul className={styles.statGrid}>
        {skills.map((g, i) => (
          <li
            key={g.id}
            className={styles.stat}
            data-in={inView}
            style={{ "--i": i } as CSSProperties}
          >
            <span className={styles.statIndex} aria-hidden="true">
              <Scramble text={String(i + 1).padStart(2, "0")} chars="0123456789" duration={0.6} />
            </span>
            <div>
              <div className={styles.statTitleRow}>
                <h3 className={styles.statTitle}>{t(g.title)}</h3>
                {g.rank ? (
                  <span className={styles.statRank}>
                    {ui.skills.rank} <strong>{g.rank}</strong>
                  </span>
                ) : null}
              </div>
              <div className={styles.statBar} aria-hidden="true">
                <span className={styles.statFill} />
              </div>
              <ul className={styles.statItems}>
                {list(g.items).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
