import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SplitReveal } from "@/components/text/SplitReveal";
import { Heading, Kicker, Tag } from "@/components/ui/Button";
import { projects } from "@/content/projects";
import { sfx } from "@/lib/audio";
import { captureFlip } from "@/lib/flip";
import { useI18n } from "@/lib/i18n";
import { useRovingList } from "@/lib/keyboard";
import { DUR, EASE, gsap, useGSAP } from "@/lib/motion";
import { appStore } from "@/lib/store";
import styles from "./screens.module.css";

/* Compendium: angled cards, hover cuts the screenshot in from the right, click flips into the detail route. */
export function Projects() {
  const { t, ui } = useI18n();
  const navigate = useNavigate();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  const select = useCallback((i: number) => {
    setActive((prev) => {
      if (prev !== i && i >= 0) sfx.play("hover");
      return i;
    });
  }, []);

  const open = useCallback(
    (i: number) => {
      const project = projects[i];
      const el = root.current?.querySelector<HTMLElement>(
        `[data-flip-id="project-${project?.slug}"]`,
      );
      if (!project || !el) return;
      sfx.play("confirm");
      captureFlip(`project-${project.slug}`, el);
      navigate(`/projects/${project.slug}`);
    },
    [navigate],
  );

  const { onKeyDown, itemProps } = useRovingList({
    count: projects.length,
    active: Math.max(0, active),
    onChange: select,
    onConfirm: open,
    orientation: "both",
  });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.from(el.querySelectorAll("[data-card]"), {
        y: 60,
        opacity: 0,
        rotate: 2,
        duration: 0.7,
        ease: EASE.enter,
        stagger: DUR.stagger,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" className={styles.section} data-scene="projects">
      <span className={styles.bgWord} aria-hidden="true">
        {ui.projects.title}
      </span>
      <div className={styles.sectionHead}>
        <Kicker>{ui.projects.kicker}</Kicker>
        <Heading>{ui.projects.title}</Heading>
        <SplitReveal as="p" className={styles.intro} text={ui.projects.intro} />
      </div>
      <ul
        className={styles.projectGrid}
        onKeyDown={onKeyDown}
        onFocus={() => appStore.set({ hints: "list" })}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            appStore.set({ hints: "home" });
        }}
        onPointerLeave={() => select(-1)}
      >
        {projects.map((p, i) => (
          <li key={p.slug} data-card>
            <button
              type="button"
              className={styles.card}
              data-active={active === i}
              data-flip-id={`project-${p.slug}`}
              onPointerEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => (active === i ? open(i) : select(i))}
              aria-label={`${p.title}: ${t(p.kind)}. ${ui.projects.open}`}
              {...itemProps(i)}
            >
              <span className={styles.cardBody}>
                <span className={styles.cardInner}>
                  <span className={styles.cardIndex} aria-hidden="true">
                    {p.index}
                  </span>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardKind}>{t(p.kind)}</span>
                  <span className={styles.cardDesc}>{t(p.description)}</span>
                  <span className={styles.cardTags}>
                    {p.tags.map((tag) => (
                      <Tag key={tag} tone={active === i ? "ink" : "cyan"}>
                        {tag}
                      </Tag>
                    ))}
                  </span>
                </span>
                <span className={styles.cardShot} aria-hidden="true">
                  <img
                    src={p.frames[0]?.src}
                    width={p.frames[0]?.width}
                    height={p.frames[0]?.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className={styles.cardCta} aria-hidden="true">
                  {ui.projects.open} ►
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
