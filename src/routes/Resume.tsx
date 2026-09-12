import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { CircleReveal } from "@/components/motion/CircleReveal";
import { useWipe } from "@/components/motion/PageWipe";
import { Button } from "@/components/ui/Button";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { sfx } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { useRovingList } from "@/lib/keyboard";
import { appStore } from "@/lib/store";
import styles from "./routes.module.css";

type CardId = "experience" | "education" | "skills" | "languages";
const CARDS: Array<{ id: CardId; badge: string }> = [
  { id: "experience", badge: "I" },
  { id: "education", badge: "II" },
  { id: "skills", badge: "III" },
  { id: "languages", badge: "IV" },
];

type Row = { index: string; title: string; sub?: string; status: string };

/* 1:1 optic of the original ResumePage with real content behind every card. */
export function Resume() {
  const { t, list, ui } = useI18n();
  const { wipeTo } = useWipe();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  const select = useCallback((i: number) => {
    setActive((prev) => {
      if (prev !== i) sfx.play("hover");
      return i;
    });
  }, []);

  const back = useCallback(() => {
    sfx.play("back");
    wipeTo("/", { variant: "resume" });
  }, [wipeTo]);

  const { onKeyDown, itemProps } = useRovingList({
    count: CARDS.length,
    active,
    onChange: select,
    onBack: back,
    handleEscape: true,
  });

  useEffect(() => {
    appStore.set({ scene: "resume", hints: "list" });
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => {
      setMounted(true);
      root.current
        ?.querySelector<HTMLElement>('[data-roving-index="0"]')
        ?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, []);

  const years = new Date().getFullYear() - 2022;
  const spoken = skills.find((s) => s.id === "spoken");
  const ranks: Record<CardId, number> = {
    experience: years,
    education: education.length,
    skills: skills.length,
    languages: 2,
  };

  const detail = ((): {
    title: string;
    progress: string;
    rows: Row[];
    bullets: readonly string[];
  } => {
    const card = CARDS[active]?.id ?? "experience";
    switch (card) {
      case "experience":
        return {
          title: experience.company,
          progress: `${years}Y`,
          rows: experience.pillars.map((p, i) => ({
            index: String(i + 1).padStart(2, "0"),
            title: t(p.label),
            sub: t(p.title),
            status: ui.resume.status.running,
          })),
          bullets: [
            t(experience.intro),
            `${t(experience.periodLabel)}: ${t(experience.period)}, ${experience.location}`,
          ],
        };
      case "education":
        return {
          title: ui.resume.cards.education.title,
          progress: `${education.length}`,
          rows: education.map((e, i) => ({
            index: String(i + 1).padStart(2, "0"),
            title: t(e.institution),
            sub: t(e.period),
            status: i === 0 ? ui.resume.status.running : ui.resume.status.done,
          })),
          bullets: education.map((e) => t(e.detail)),
        };
      case "skills":
        return {
          title: ui.resume.cards.skills.title,
          progress: `${skills.length}/${skills.length}`,
          rows: skills
            .filter((s) => s.id !== "spoken")
            .map((s, i) => ({
              index: String(i + 1).padStart(2, "0"),
              title: t(s.title),
              status: `${list(s.items).length}`,
            })),
          bullets: skills.slice(0, 3).flatMap((s) => list(s.items).slice(0, 1)),
        };
      default:
        return {
          title: ui.resume.cards.languages.title,
          progress: "2",
          rows: (spoken ? list(spoken.items) : []).map((item, i) => {
            const [name, level] = item.split(":").map((s) => s.trim());
            return {
              index: String(i + 1).padStart(2, "0"),
              title: name ?? item,
              status: level ?? (i === 0 ? ui.resume.status.native : "–"),
            };
          }),
          bullets: spoken ? list(spoken.items) : [],
        };
    }
  })();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: scoped Back handler, focus target after navigation
    <div
      ref={root}
      className={styles.resume}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          back();
        }
      }}
    >
      <CircleReveal />
      <div>
        <h1 className={styles.listTag} data-mounted={mounted}>
          {ui.resume.list}
        </h1>
        <ul className={styles.stack} onKeyDown={onKeyDown} aria-label={ui.resume.title}>
          {CARDS.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={styles.cardWrap}
                data-active={active === i}
                data-mounted={mounted}
                style={{ "--i": i } as CSSProperties}
                onPointerEnter={() => select(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
                aria-controls="resume-detail"
                {...itemProps(i)}
              >
                <span className={styles.cardShadow} aria-hidden="true" />
                <span className={styles.badge} aria-hidden="true">
                  <span className={styles.badgeText}>{c.badge}</span>
                </span>
                <span className={styles.card}>
                  <span className={styles.cardInner}>
                    <span className={styles.cardTitle}>{ui.resume.cards[c.id].title}</span>
                    <span className={styles.rank}>
                      <span className={styles.rankLabel}>{ui.skills.rank}</span>
                      <span className={styles.rankNumber}>{ranks[c.id]}</span>
                    </span>
                  </span>
                  <span className={styles.subtitleBar}>
                    <span className={styles.subtitle}>{ui.resume.cards[c.id].subtitle}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.resumeActions}>
          <Button href={profile.cvPath} download aria-label={ui.resume.downloadLabel} tone="paper">
            {ui.resume.download}
          </Button>
          <Button tone="ghost" arrow={false} onClick={back}>
            ◄ {ui.hints.back}
          </Button>
        </div>
      </div>

      <div className={styles.detailPanelWrap} id="resume-detail" aria-live="polite">
        <span className={styles.detailPanelShadow} aria-hidden="true" />
        <div className={styles.detailPanel} key={active}>
          <div style={{ position: "relative" }}>
            <span className={styles.detailTopShadow} aria-hidden="true" />
            <div className={styles.detailTop}>
              <span className={styles.detailTopIndex}>{String(active + 1).padStart(2, "0")}</span>
              <span className={styles.detailTopTitle}>
                {detail.title} {ui.resume.log}
              </span>
              <span className={styles.detailTopProgress}>{detail.progress}</span>
            </div>
          </div>
          <ul className={styles.detailList}>
            {detail.rows.map((row) => (
              <li key={row.index + row.title} className={styles.detailRow}>
                <span className={styles.detailRowIndex}>{row.index}</span>
                <span className={styles.detailRowTitle}>
                  {row.title}
                  {row.sub ? <span className={styles.detailRowSub}>{row.sub}</span> : null}
                </span>
                <span className={styles.detailStatus}>{row.status}</span>
              </li>
            ))}
          </ul>
          <div className={styles.detailBottom}>
            <h2 className={styles.detailBottomTitle}>{ui.resume.details}</h2>
            <ul className={styles.detailBullets}>
              {detail.bullets.map((b) => (
                <li key={b} className={styles.detailBullet}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
