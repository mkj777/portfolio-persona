import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { WipeProvider } from "@/components/motion/PageWipe";
import { Hud } from "@/components/nav/Hud";
import { MainMenu } from "@/components/nav/MainMenu";
import { SignalStripe } from "@/components/shape/SignalStripe";
import { sfx } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";
import { DUR, EASE, gsap, useGSAP } from "@/lib/motion";
import { useScroll } from "@/lib/scroll";
import { appStore, useApp } from "@/lib/store";

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}

/*
 * Persistent shell: backdrop under everything, content root that tilts away when the
 * menu opens, then menu, HUD and stripe on top. Route swaps happen under the wipe.
 */
export function AppLayout() {
  const menuOpen = useApp((s) => s.menuOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  const { ui } = useI18n();

  /* The only window-level keys: Escape closes the menu, M toggles it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape" && appStore.get().menuOpen) {
        sfx.play("back");
        appStore.set({ menuOpen: false });
        return;
      }
      if (e.key === "m" || e.key === "M") {
        const open = !appStore.get().menuOpen;
        sfx.play(open ? "open" : "back");
        appStore.set({ menuOpen: open });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;
      if (menuOpen) {
        scroll.stop();
        gsap.to(el, {
          rotate: -6,
          xPercent: -110,
          duration: DUR.wipe,
          ease: EASE.wipe,
          overwrite: true,
          onStart: () => {
            el.style.willChange = "transform";
          },
        });
        return;
      }
      scroll.start();
      if (appStore.get().wiping) {
        gsap.set(el, { clearProps: "transform,willChange" });
        return;
      }
      gsap.to(el, {
        rotate: 0,
        xPercent: 0,
        duration: DUR.wipe,
        ease: EASE.wipe,
        overwrite: true,
        onComplete: () => gsap.set(el, { clearProps: "transform,willChange" }),
      });
    },
    { dependencies: [menuOpen] },
  );

  return (
    <WipeProvider>
      <a className="skip-link" href="#main">
        {ui.hud.skip}
      </a>
      <Backdrop />
      <div
        id="content-root"
        ref={contentRef}
        inert={menuOpen}
        style={{ position: "relative", zIndex: 10, transformOrigin: "center center" }}
      >
        <main id="main">
          <Outlet />
        </main>
      </div>
      <MainMenu />
      <Hud />
      <div
        id="signal-stripe"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
      >
        <SignalStripe />
      </div>
    </WipeProvider>
  );
}
