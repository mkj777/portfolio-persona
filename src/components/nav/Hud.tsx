import { useEffect, useState } from "react";
import { Keycap } from "@/components/shape/Keycap";
import { LANGUAGES } from "@/content/languages";
import { sfx, useSfxMuted } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { appStore, useApp } from "@/lib/store";
import styles from "./hud.module.css";

function LangToggle() {
  const { lang, setLang, ui } = useI18n();
  return (
    <fieldset className={styles.lang}>
      <legend className="sr-only">{ui.hud.language}</legend>
      {LANGUAGES.map((l) => (
        <button
          key={l}
          type="button"
          className={styles.langBtn}
          aria-pressed={lang === l}
          lang={l}
          onClick={() => {
            if (lang !== l) {
              sfx.play("confirm");
              setLang(l);
            }
          }}
        >
          <span>{l.toUpperCase()}</span>
        </button>
      ))}
    </fieldset>
  );
}

function SoundToggle() {
  const muted = useSfxMuted();
  const { ui } = useI18n();
  return (
    <button
      type="button"
      className={styles.chip}
      aria-pressed={!muted}
      aria-label={muted ? ui.hud.soundOff : ui.hud.soundOn}
      title={muted ? ui.hud.soundOff : ui.hud.soundOn}
      onClick={() => sfx.toggle()}
    >
      <span aria-hidden="true">{muted ? "SFX ✕" : "SFX ●"}</span>
    </button>
  );
}

function MenuTrigger() {
  const open = useApp((s) => s.menuOpen);
  const { ui } = useI18n();
  return (
    <button
      type="button"
      className={styles.chip}
      data-tone="signal"
      aria-expanded={open}
      aria-controls="main-menu"
      aria-label={open ? ui.menu.close : ui.menu.open}
      onClick={() => {
        sfx.play(open ? "back" : "open");
        appStore.set({ menuOpen: !open });
      }}
    >
      <span aria-hidden="true">{open ? "ESC" : ui.menu.trigger}</span>
    </button>
  );
}

export function Hud() {
  return (
    <>
      <div className={styles.controls}>
        <LangToggle />
        <SoundToggle />
        <MenuTrigger />
      </div>
      <HintBar />
    </>
  );
}

function HintBar() {
  const hints = useApp((s) => s.hints);
  const menuOpen = useApp((s) => s.menuOpen);
  const introDone = useApp((s) => s.introDone);
  const { ui } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), introDone ? 200 : 1400);
    return () => window.clearTimeout(t);
  }, [introDone]);

  const set = menuOpen ? "menu" : hints;
  const rows: Array<[string, string]> =
    set === "menu"
      ? [
          ["↑↓", ui.hints.navigate],
          ["↵", ui.hints.confirm],
          ["ESC", ui.hints.back],
        ]
      : set === "list"
        ? [
            ["↑↓", ui.hints.select],
            ["↵", ui.hints.open],
            ["ESC", ui.hints.back],
          ]
        : set === "detail"
          ? [
              ["ESC", ui.hints.back],
              ["M", ui.hints.menu],
            ]
          : set === "none"
            ? []
            : [
                ["SCROLL", ui.hints.navigate],
                ["M", ui.hints.menu],
              ];

  return (
    <div className={styles.hints} data-mounted={mounted && rows.length > 0} aria-hidden="true">
      {rows.map(([key, label]) => (
        <div key={key + label} className={styles.hintRow}>
          <Keycap>{key}</Keycap>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
