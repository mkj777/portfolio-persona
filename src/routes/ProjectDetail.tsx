import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { CircleReveal } from "@/components/motion/CircleReveal";
import { useWipe } from "@/components/motion/PageWipe";
import { SplitReveal } from "@/components/text/SplitReveal";
import { Button, Kicker, Tag } from "@/components/ui/Button";
import { findProject } from "@/content/projects";
import { sfx } from "@/lib/audio";
import { takeFlip } from "@/lib/flip";
import { useI18n } from "@/lib/i18n";
import { EASE, gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { appStore } from "@/lib/store";
import { NotFound } from "./NotFound";
import styles from "./routes.module.css";

/*
 * Card lands as the header (manual FLIP from the captured rect), then the circle wipe
 * reveals the sticky screenshot stage. Scrolling the beats on the right swaps frames.
 */
export function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  if (!project) return <NotFound />;
  return <Detail key={project.slug} slug={project.slug} />;
}

function Detail({ slug }: { slug: string }) {
  const project = findProject(slug);
  const { t, ui, lang } = useI18n();
  const { wipeTo } = useWipe();
  const root = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const back = useCallback(() => {
    sfx.play("back");
    wipeTo("/#projects", { variant: "default" });
  }, [wipeTo]);

  useEffect(() => {
    appStore.set({ scene: "detail", hints: "detail" });
    root.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      const from = takeFlip(`project-${slug}`);
      if (!from || reducedMotion()) {
        setFlipped(true);
        return;
      }
      const to = header.getBoundingClientRect();
      gsap.from(header, {
        x: from.x - to.left,
        y: from.y - to.top,
        scaleX: from.width / to.width,
        scaleY: from.height / to.height,
        transformOrigin: "0 0",
        duration: 0.6,
        ease: EASE.enter,
        onComplete: () => setFlipped(true),
      });
      gsap.from(header.querySelectorAll("[data-flip-child]"), {
        opacity: 0,
        duration: 0.3,
        delay: 0.3,
      });
    },
    { scope: root, dependencies: [slug] },
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const beats = el.querySelectorAll<HTMLElement>("[data-beat]");
      beats.forEach((b, i) => {
        ScrollTrigger.create({
          trigger: b,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setBeat(i),
          onEnterBack: () => setBeat(i),
        });
      });
    },
    { scope: root, dependencies: [slug] },
  );

  if (!project) return null;
  const frame = project.frames[Math.min(beat, project.frames.length - 1)] ?? project.frames[0];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: scoped Escape/Back handler, focus target after navigation
    <div
      ref={root}
      className={styles.detail}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "ArrowLeft") {
          e.preventDefault();
          back();
        }
      }}
    >
      {flipped ? <CircleReveal /> : null}
      <div ref={headerRef} className={styles.detailHeader} data-flip-id={`project-${project.slug}`}>
        <span className={styles.detailIndex} aria-hidden="true" data-flip-child>
          {project.index}
        </span>
        <h1 className={styles.detailTitle}>{project.title}</h1>
        <span className={styles.detailKind} data-flip-child>
          {t(project.kind)}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.stage} aria-live="polite">
          <div className={styles.stageFrame}>
            {frame ? (
              <img
                key={frame.src}
                className={styles.stageImg}
                src={frame.src}
                width={frame.width}
                height={frame.height}
                alt={`${t(project.alt)}: ${t(frame.label)}`}
                fetchPriority="high"
                decoding="async"
              />
            ) : null}
            <span className={styles.stageLabel}>
              <span>{frame ? t(frame.label) : ""}</span>
            </span>
          </div>
        </div>

        <div className={styles.beats}>
          {project.frames.map((f, i) => (
            <section key={f.src} className={styles.beat} data-beat data-active={beat === i}>
              <span className={styles.beatNo} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className={styles.beatTitle}>{t(f.label)}</h2>
              {i === 0 ? (
                <SplitReveal
                  as="p"
                  key={lang}
                  className={styles.beatText}
                  text={t(project.description)}
                  trigger="mount"
                  delay={0.5}
                />
              ) : null}
              {i === 1 ? (
                <ul className={styles.techList}>
                  {project.tech.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              {i === project.frames.length - 1 ? (
                <>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <div className={styles.detailActions}>
                    <Button href={project.links.live} target="_blank" rel="noreferrer">
                      {ui.projects.live}
                    </Button>
                    {project.links.repo ? (
                      <Button
                        href={project.links.repo}
                        tone="ghost"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ui.projects.repo}
                      </Button>
                    ) : null}
                    <Button tone="paper" arrow={false} onClick={back}>
                      ◄ {ui.projects.back}
                    </Button>
                  </div>
                </>
              ) : null}
            </section>
          ))}
          <Kicker>{ui.projects.stage}</Kicker>
        </div>
      </div>
    </div>
  );
}
