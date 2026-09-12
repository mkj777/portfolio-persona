import { useRef, useState } from "react";
import signature from "@/assets/signature.png";
import { SplitReveal } from "@/components/text/SplitReveal";
import { Kicker } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { sfx } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import styles from "./screens.module.css";

/* Velvet Room: palette shifts to violet, motion calms down, one centered focus. */
export function Contact() {
  const { t, ui, fill } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [signed, setSigned] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        once: true,
        onEnter: () => setSigned(true),
      });
    },
    { scope: root },
  );

  const actions: Array<{ id: string; label: string; value: string; href: string; aria: string }> = [
    {
      id: "email",
      label: ui.contact.email,
      value: socials.email,
      href: `mailto:${socials.email}`,
      aria: fill(ui.contact.mailLabel, { email: socials.email }),
    },
    {
      id: "github",
      label: ui.contact.github,
      value: `github.com/${socials.github.handle}`,
      href: socials.github.url,
      aria: fill(ui.contact.githubLabel, { handle: socials.github.handle }),
    },
  ];
  if (socials.showPhone) {
    actions.push({
      id: "phone",
      label: ui.contact.phone,
      value: socials.phone,
      href: `tel:${socials.phone.replace(/\s+/g, "")}`,
      aria: fill(ui.contact.phoneLabel, { phone: socials.phone }),
    });
  }
  if (socials.linkedin) {
    actions.push({
      id: "linkedin",
      label: ui.contact.linkedin,
      value: "LinkedIn",
      href: socials.linkedin,
      aria: ui.contact.linkedin,
    });
  }

  return (
    <section
      ref={root}
      id="contact"
      className={`${styles.section} ${styles.contact}`}
      data-scene="contact"
    >
      <Kicker>{ui.nav.contact}</Kicker>
      <SplitReveal as="h2" className={styles.contactTitle} text={ui.contact.title} type="lines" />
      <SplitReveal as="p" className={styles.contactText} text={ui.contact.text} delay={0.15} />
      <ul className={styles.contactGrid}>
        {actions.map((a) => (
          <li key={a.id}>
            <a
              className={styles.contactCard}
              href={a.href}
              target={a.id === "email" || a.id === "phone" ? undefined : "_blank"}
              rel={a.id === "email" || a.id === "phone" ? undefined : "noreferrer"}
              aria-label={a.aria}
              onMouseEnter={() => sfx.play("hover")}
              onFocus={() => sfx.play("hover")}
              onClick={() => sfx.play("confirm")}
            >
              <span className={styles.contactCardBody}>
                <span className={styles.contactLabel}>{a.label}</span>
                <span className={styles.contactValue}>{a.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <img
        className={styles.signature}
        data-in={signed}
        src={signature}
        width={1428}
        height={288}
        alt={ui.contact.signature}
        loading="lazy"
        decoding="async"
      />
      <p className={styles.footerNote}>
        {t(profile.location)} · {ui.contact.footer}
      </p>
    </section>
  );
}
