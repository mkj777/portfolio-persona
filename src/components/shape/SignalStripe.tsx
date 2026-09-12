import styles from "./shape.module.css";

/* 5 px red edge plus a 2 px ghost 9 px inward. Minimal effort, instant brand. */
export function SignalStripe() {
  return (
    <>
      <div className={styles.stripe} aria-hidden="true" />
      <div className={styles.stripeGhost} aria-hidden="true" />
    </>
  );
}
