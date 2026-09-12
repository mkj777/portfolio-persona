import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import type { WipeVariant } from "@/components/motion/PageWipe";
import { useWipe } from "@/components/motion/PageWipe";
import { sfx } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { useRovingList } from "@/lib/keyboard";
import { useMeasure } from "@/lib/measure";
import { appStore, useApp } from "@/lib/store";
import styles from "./menu.module.css";

type MenuItem = {
  id: "about" | "projects" | "skills" | "resume" | "contact";
  target: string;
  variant: WipeVariant;
  fontSize: number;
  offsetX: number;
  offsetY: number;
  skew: number;
  skewY: number;
};

/* Original P3Menu parameters: every row has its own size, offset and skew pair. */
const ITEMS: MenuItem[] = [
  {
    id: "about",
    target: "/#about",
    variant: "about",
    fontSize: 80,
    offsetX: 0,
    offsetY: 0,
    skew: -6,
    skewY: 10,
  },
  {
    id: "projects",
    target: "/#projects",
    variant: "default",
    fontSize: 66,
    offsetX: 20,
    offsetY: 8,
    skew: -11,
    skewY: -10,
  },
  {
    id: "skills",
    target: "/#skills",
    variant: "socials",
    fontSize: 68,
    offsetX: 8,
    offsetY: 6,
    skew: 0,
    skewY: -4,
  },
  {
    id: "resume",
    target: "/resume",
    variant: "resume",
    fontSize: 74,
    offsetX: 16,
    offsetY: 8,
    skew: -3,
    skewY: 5,
  },
  {
    id: "contact",
    target: "/#contact",
    variant: "default",
    fontSize: 56,
    offsetX: 10,
    offsetY: 6,
    skew: -4,
    skewY: 7,
  },
];

const wedge = (w: number, h: number) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`;

function MenuRow({
  item,
  index,
  active,
  mounted,
  animKey,
  distance,
  onActivate,
  onConfirm,
  itemProps,
}: {
  item: MenuItem;
  index: number;
  active: boolean;
  mounted: boolean;
  animKey: number;
  distance: number;
  onActivate: (i: number) => void;
  onConfirm: (i: number) => void;
  itemProps: Record<string, unknown>;
}) {
  const { ui } = useI18n();
  const [labelRef, size] = useMeasure<HTMLSpanElement>();
  /* Measured width replaces the label.length * fontSize * 0.6 heuristic of the original. */
  const w = size.width * 1.35 + 60;
  const h = size.height * 0.94;
  const clip = wedge(w, h);
  const opacity = active ? 1 : Math.max(0.5, 1 - distance * 0.2);
  const style = {
    "--i": index,
    marginRight: item.offsetX,
    marginTop: item.offsetY,
  } as CSSProperties;

  return (
    <li>
      <button
        type="button"
        className={styles.row}
        data-active={active}
        data-mounted={mounted}
        style={style}
        onPointerEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onClick={() => (active ? onConfirm(index) : onActivate(index))}
        aria-current={active ? "true" : undefined}
        {...itemProps}
      >
        <span className={styles.glow} aria-hidden="true" />
        <span
          className={styles.skewWrap}
          style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
        >
          <span
            key={active ? `pop-${animKey}` : "idle"}
            className={styles.shadowTri}
            data-pop={active}
            style={{ width: w, height: h, clipPath: clip }}
            aria-hidden="true"
          />
          <span
            className={styles.highlight}
            style={{
              width: w,
              height: h,
              clipPath: clip,
              transform: `translateY(-50%) scaleX(${active ? 1 : 0})`,
            }}
            aria-hidden="true"
          />
          <span className={styles.labelWrap} style={{ opacity }}>
            <span
              ref={labelRef}
              className={`${styles.label} ${styles.labelDark}`}
              style={{ "--fs": item.fontSize } as CSSProperties}
            >
              {ui.nav[item.id]}
            </span>
            <span
              className={`${styles.label} ${styles.labelBright}`}
              style={{ "--fs": item.fontSize, clipPath: clip } as CSSProperties}
              aria-hidden="true"
            >
              {ui.nav[item.id]}
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

export function MainMenu() {
  const open = useApp((s) => s.menuOpen);
  const { ui } = useI18n();
  const { wipeTo } = useWipe();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const activate = useCallback((i: number) => {
    setActive((prev) => {
      if (prev === i) return prev;
      sfx.play("hover");
      setAnimKey((k) => k + 1);
      return i;
    });
  }, []);

  const confirm = useCallback(
    (i: number) => {
      const item = ITEMS[i];
      if (!item) return;
      sfx.play("confirm");
      wipeTo(item.target, {
        variant: item.variant,
        onCover: () => appStore.set({ menuOpen: false }),
      });
    },
    [wipeTo],
  );

  const close = useCallback(() => {
    sfx.play("back");
    appStore.set({ menuOpen: false });
  }, []);

  const { onKeyDown, itemProps } = useRovingList({
    count: ITEMS.length,
    active,
    onChange: activate,
    onConfirm: confirm,
    onBack: close,
    handleEscape: true,
  });

  /* Rows stagger in after the content root has tilted away. */
  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const t = window.setTimeout(() => {
      setMounted(true);
      setAnimKey((k) => k + 1);
      listRef.current
        ?.querySelector<HTMLElement>(`[data-roving-index="${activeRef.current}"]`)
        ?.focus({ preventScroll: true });
    }, 280);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <div
      className={styles.overlay}
      data-open={open}
      aria-hidden={!open}
      style={{ visibility: open ? "visible" : "hidden" }}
    >
      <div className={styles.dim} />
      <nav aria-label={ui.menu.title} onKeyDown={onKeyDown}>
        <h2 className={styles.title}>{ui.menu.title}</h2>
        <ul ref={listRef} className={styles.menu}>
          {ITEMS.map((item, i) => (
            <MenuRow
              key={item.id}
              item={item}
              index={i}
              active={active === i}
              mounted={mounted}
              animKey={animKey}
              distance={Math.abs(i - active)}
              onActivate={activate}
              onConfirm={confirm}
              itemProps={itemProps(i)}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
