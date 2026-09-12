import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import styles from "./shape.module.css";

type Props = {
  index: number;
  active: boolean;
  mounted: boolean;
  role: string;
  label: string;
  right?: ReactNode;
  onSelect: () => void;
  onConfirm?: () => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onSelect" | "role">;

/*
 * The Socials-screen bar: enters from the left, red underlay flashes on selection,
 * white fill grows along the diagonal. Height change uses scaleY plus counter scale
 * so nothing reflows.
 */
export function AngledBar({
  index,
  active,
  mounted,
  role,
  label,
  right,
  onSelect,
  onConfirm,
  className,
  style,
  ...rest
}: Props) {
  const outerStyle = { ...style, "--i": index } as CSSProperties;
  return (
    <button
      type="button"
      className={[styles.barOuter, className].filter(Boolean).join(" ")}
      data-active={active}
      data-mounted={mounted}
      style={outerStyle}
      onPointerEnter={onSelect}
      onFocus={onSelect}
      onClick={() => (active ? onConfirm?.() : onSelect())}
      {...rest}
    >
      <span className={styles.barRed} aria-hidden="true" />
      <span className={styles.bar}>
        <span className={styles.barFill} aria-hidden="true" />
        <span className={styles.barShade} aria-hidden="true" />
        <span className={styles.barContent}>
          <span className={styles.barRole} aria-hidden="true">
            {role}
          </span>
          <span className={styles.barLabel}>{label}</span>
          {right ? <span className={styles.barRight}>{right}</span> : null}
        </span>
      </span>
    </button>
  );
}
