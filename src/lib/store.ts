import { useSyncExternalStore } from "react";

/* Minimal external store: enough for menu state, scene and HUD hints without a dependency. */
export type Store<T> = {
  get: () => T;
  set: (patch: Partial<T> | ((prev: T) => Partial<T>)) => void;
  subscribe: (fn: () => void) => () => void;
};

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (patch) => {
      const next = typeof patch === "function" ? patch(state) : patch;
      let changed = false;
      for (const key in next) {
        if (next[key] !== state[key]) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = { ...state, ...next };
      for (const fn of listeners) fn();
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function useStore<T extends object, S>(store: Store<T>, select: (s: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => select(store.get()),
    () => select(store.get()),
  );
}

export type Scene =
  | "menu"
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "timeline"
  | "contact"
  | "resume"
  | "detail";

export type HintSet = "home" | "menu" | "list" | "detail" | "none";

export type AppState = {
  menuOpen: boolean;
  scene: Scene;
  hints: HintSet;
  introDone: boolean;
  wiping: boolean;
};

export const appStore = createStore<AppState>({
  menuOpen: false,
  scene: "home",
  hints: "home",
  introDone:
    typeof sessionStorage !== "undefined" && sessionStorage.getItem("portfolio-intro") === "1",
  wiping: false,
});

export function useApp<S>(select: (s: AppState) => S): S {
  return useStore(appStore, select);
}
