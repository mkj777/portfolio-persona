import type { ComponentPropsWithoutRef } from "react";
import styles from "./shape.module.css";

type Props = {
  tone?: "cyan" | "paper" | "signal" | "faint";
} & ComponentPropsWithoutRef<"span">;

/* Big Bebas Neue with text-stroke only, typography used as a graphic. */
export function OutlineWord({ tone = "cyan", className, children, ...rest }: Props) {
  return (
    <span
      className={[styles.outline, className].filter(Boolean).join(" ")}
      data-tone={tone}
      {...rest}
    >
      {children}
    </span>
  );
}
