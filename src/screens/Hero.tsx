import { useRef } from "react";
import silhouette from "@/assets/silhouette.svg";
import { Button, Tag } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import { useI18n } from "@/lib/i18n";
import { DUR, EASE, gsap, reducedMotion, SplitText, useGSAP } from "@/lib/motion";
import { useScroll } from "@/lib/scroll";
import { appStore, useApp } from "@/lib/store";
import styles from "./screens.module.css";

/*
 * Title screen. The intro runs once per session in six beats:
 * stripe, backdrop, name, role, buttons, hints. 1.4 s total.
 */
export function Hero() {
  const { t, ui, lang } = useI18n();
  const scroll = useScroll();
  const introDone = useApp((s) => s.introDone);
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const name = nameRef.current;
      if (!el || !name) return;
      const quick = introDone || reducedMotion();
      const tl = gsap.timeline({
        defaults: { ease: EASE.enter },
        onComplete: () => {
          appStore.set({ introDone: true });
          try {
            sessionStorage.setItem("portfolio-intro", "1");
          } catch {
            /* ignore */
          }
        },
      });
      const stripe = document.getElementById("signal-stripe");
      if (stripe && !quick) {
        tl.fromTo(
          stripe,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, duration: 0.3, ease: EASE.wipe },
          0,
        );
      }
      tl.fromTo(
        el.querySelector("[data-portrait]"),
        { xPercent: -30, opacity: 0 },
        { xPercent: 0, opacity: 0.96, duration: quick ? 0.01 : 0.6 },
        quick ? 0 : 0.2,
      );
      SplitText.create(name, {
        type: "chars,lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: quick ? 0.01 : 0.7,
            ease: EASE.enter,
            stagger: quick ? 0 : 0.04,
            delay: quick ? 0 : 0.35,
          }),
      });
      tl.fromTo(
        el.querySelectorAll("[data-beat]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: quick ? 0.01 : 0.5, stagger: quick ? 0 : DUR.stagger },
        quick ? 0 : 0.85,
      );
      tl.fromTo(
        el.querySelector("[data-scroll-hint]"),
        { opacity: 0 },
        { opacity: 1, duration: quick ? 0.01 : 0.4 },
        quick ? 0 : 1.3,
      );
    },
    { scope: root, dependencies: [lang] },
  );

  const lines = profile.titleLines[lang];

  return (
    <section
      ref={root}
      id="hero"
      className={`${styles.section} ${styles.hero}`}
      aria-label={ui.hero.screen}
      data-scene="home"
    >
      <div className={styles.portraitShell} data-portrait>
        <img
          className={styles.portraitImg}
          src={silhouette}
          width={600}
          height={800}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <span className={styles.portraitEdge} aria-hidden="true" />
      </div>
      <div className={styles.heroText}>
        <h1 ref={nameRef} className={styles.heroName} aria-label={profile.name}>
          {profile.name.split(" ")[0]}
          <br />
          <em>{profile.name.split(" ").slice(-1)[0]}</em>
        </h1>
        <p className={styles.heroRole} data-beat>
          {lines.join(" ")}
        </p>
        <p className={styles.heroLead} data-beat>
          {t(profile.heroText)}
        </p>
        <div className={styles.heroTags} data-beat>
          {t(profile.availability)
            .split("·")
            .map((s) => s.trim())
            .map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
        </div>
        <div className={styles.heroActions} data-beat>
          <Button
            onClick={() => {
              scroll.scrollTo("#projects");
            }}
          >
            {ui.hero.projects}
          </Button>
          <Button
            tone="ghost"
            onClick={() => {
              scroll.scrollTo("#contact");
            }}
          >
            {ui.hero.contact}
          </Button>
        </div>
      </div>
      <div className={styles.scrollHint} data-scroll-hint aria-hidden="true">
        {ui.hero.scroll}
      </div>
    </section>
  );
}
