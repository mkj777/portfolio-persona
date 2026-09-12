import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { sfx } from "@/lib/audio";
import styles from "./ui.module.css";

type Tone = "cyan" | "ghost" | "signal" | "paper";

type Common = {
  tone?: Tone;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsButton = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className"
  >;
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "className">;

export function Button(props: AsButton | AsLink) {
  const { tone = "cyan", arrow = true, children, className, ...rest } = props;
  const body = (
    <>
      <span>{children}</span>
      {arrow ? (
        <span className={styles.arrow} aria-hidden="true">
          ►
        </span>
      ) : null}
    </>
  );
  const wrapClass = [styles.btnWrap, className].filter(Boolean).join(" ");

  if ("href" in rest && typeof rest.href === "string") {
    const { onMouseEnter, onClick, href, ...a } = rest as ComponentPropsWithoutRef<"a"> & {
      href: string;
    };
    return (
      <span className={wrapClass}>
        <a
          href={href}
          className={styles.btn}
          data-tone={tone}
          onMouseEnter={(e) => {
            sfx.play("hover");
            onMouseEnter?.(e);
          }}
          onClick={(e) => {
            sfx.play("confirm");
            onClick?.(e);
          }}
          {...a}
        >
          {body}
        </a>
      </span>
    );
  }
  const { onMouseEnter, onClick, type, ...b } = rest as ComponentPropsWithoutRef<"button">;
  return (
    <span className={wrapClass}>
      <button
        type={type ?? "button"}
        className={styles.btn}
        data-tone={tone}
        onMouseEnter={(e) => {
          sfx.play("hover");
          onMouseEnter?.(e);
        }}
        onClick={(e) => {
          sfx.play("confirm");
          onClick?.(e);
        }}
        {...b}
      >
        {body}
      </button>
    </span>
  );
}

export function Tag({
  tone = "cyan",
  children,
}: {
  tone?: "cyan" | "signal" | "paper" | "ink";
  children: ReactNode;
}) {
  return (
    <span className={styles.tag} data-tone={tone}>
      {children}
    </span>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className={styles.kicker}>{children}</span>;
}

export function Heading({
  children,
  tone,
  as: Comp = "h2",
  id,
}: {
  children: ReactNode;
  tone?: "cyan";
  as?: "h1" | "h2" | "h3";
  id?: string;
}) {
  return (
    <Comp className={styles.heading} data-tone={tone} id={id}>
      {children}
    </Comp>
  );
}
