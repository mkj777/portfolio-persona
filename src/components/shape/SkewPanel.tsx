import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
import styles from "./shape.module.css";

export type Cut = "sm" | "md" | "lg" | "xl" | "card" | "badge";
export type Tone = "navy" | "deep" | "card" | "paper" | "ink" | "signal" | "cyan" | "glass";
export type HardShadow = "red" | "navy" | "double" | "none";

type Props<T extends ElementType> = {
  as?: T;
  cut?: Cut;
  tone?: Tone;
  /* Degrees. The panel skews, the content skews back so text stays upright. */
  skew?: number;
  shadow?: HardShadow;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/*
 * The one container formula: clip-path cut bottom right instead of border radius,
 * counter-transformed content, and hard offset shadows without blur.
 */
export function SkewPanel<T extends ElementType = "div">({
  as,
  cut = "md",
  tone = "navy",
  skew = 0,
  shadow = "none",
  className,
  innerClassName,
  children,
  style,
  ...rest
}: Props<T>) {
  const Comp = (as ?? "div") as ElementType;
  const panelStyle = { ...(style as CSSProperties), "--panel-skew": `${skew}deg` } as CSSProperties;
  const panel = (
    <Comp
      className={[styles.panel, className].filter(Boolean).join(" ")}
      data-cut={cut}
      data-tone={tone}
      style={panelStyle}
      {...rest}
    >
      <div className={[styles.panelInner, innerClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Comp>
  );
  if (shadow === "none") return panel;
  return (
    <div className={styles.shadowWrap} data-shadow={shadow}>
      <span
        className={styles.shadowGhost}
        data-cut={cut}
        aria-hidden="true"
        style={{ clipPath: clipFor(cut) }}
      />
      {shadow === "double" ? (
        <span
          className={styles.shadowGhost2}
          aria-hidden="true"
          style={{ clipPath: clipFor(cut) }}
        />
      ) : null}
      {panel}
    </div>
  );
}

function clipFor(cut: Cut): string {
  switch (cut) {
    case "card":
      return "var(--clip-card)";
    case "badge":
      return "var(--clip-badge)";
    default:
      return `var(--clip-cut-${cut})`;
  }
}
