import { type KeyboardEvent, useCallback } from "react";

type Options = {
  count: number;
  active: number;
  onChange: (index: number) => void;
  onConfirm?: (index: number) => void;
  onBack?: () => void;
  orientation?: "vertical" | "horizontal" | "both";
  /* Escape is only handled here when the list owns it, the menu handles it globally. */
  handleEscape?: boolean;
};

/*
 * Scoped roving list navigation. Attach `onKeyDown` to the container, spread
 * `itemProps(i)` on each item. Handlers only fire while focus is inside the container,
 * there is no window-level keydown apart from the menu's Escape.
 */
export function useRovingList(o: Options) {
  const orientation = o.orientation ?? "vertical";

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const vertical = orientation !== "horizontal";
      const horizontal = orientation !== "vertical";
      let next: number | null = null;
      switch (e.key) {
        case "ArrowUp":
          if (vertical) next = Math.max(0, o.active - 1);
          break;
        case "ArrowDown":
          if (vertical) next = Math.min(o.count - 1, o.active + 1);
          break;
        case "ArrowLeft":
          if (horizontal) next = Math.max(0, o.active - 1);
          else if (o.onBack) {
            e.preventDefault();
            o.onBack();
          }
          break;
        case "ArrowRight":
          if (horizontal) next = Math.min(o.count - 1, o.active + 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = o.count - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          o.onConfirm?.(o.active);
          return;
        case "Escape":
          if (o.handleEscape && o.onBack) {
            e.preventDefault();
            o.onBack();
          }
          return;
        default:
          return;
      }
      if (next !== null && next !== o.active) {
        e.preventDefault();
        o.onChange(next);
        const container = e.currentTarget;
        const item = container.querySelector<HTMLElement>(`[data-roving-index="${next}"]`);
        item?.focus({ preventScroll: true });
      } else if (next !== null) {
        e.preventDefault();
      }
    },
    [o.active, o.count, o.onChange, o.onConfirm, o.onBack, o.handleEscape, orientation],
  );

  const itemProps = useCallback(
    (index: number) => ({
      tabIndex: index === o.active ? 0 : -1,
      "data-roving-index": index,
      "aria-selected": index === o.active,
    }),
    [o.active],
  );

  return { onKeyDown, itemProps };
}
