import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { gsap, reducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { useScroll } from "@/lib/scroll";
import { appStore, type Scene } from "@/lib/store";
import { About } from "@/screens/About";
import { Contact } from "@/screens/Contact";
import { Hero } from "@/screens/Hero";
import { Projects } from "@/screens/Projects";
import { Skills } from "@/screens/Skills";
import { Timeline } from "@/screens/Timeline";

/* Home: the six screens as scrollable sections. Scene, hints and scroll skew live here. */
export function Home() {
  const root = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const scroll = useScroll();

  /* Hash targets are scrolled to immediately, the wipe hides the jump. */
  useEffect(() => {
    const { hash, key } = location;
    if (!key) return;
    const frame = requestAnimationFrame(() => {
      /* Pin spacers must exist before the target is measured, so refresh first. */
      ScrollTrigger.refresh();
      if (hash && document.querySelector(hash)) {
        scroll.scrollTo(hash, { immediate: true });
      } else {
        scroll.scrollTo(0, { immediate: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [location, scroll]);

  useEffect(() => {
    appStore.set({ hints: "home", scene: "home" });
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      for (const section of el.querySelectorAll<HTMLElement>("[data-scene]")) {
        const scene = section.dataset.scene as Scene;
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) appStore.set({ scene });
          },
        });
      }
      if (reducedMotion() || !scroll.enabled) return;
      /* Scroll skew: velocity tilts the whole page by up to 4 degrees. */
      const skewTo = gsap.quickTo(el, "skewY", { duration: 0.35, ease: "power3.out" });
      const tick = () => {
        const v = scroll.velocity();
        skewTo(gsap.utils.clamp(-4, 4, v * 0.06));
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
      };
    },
    { scope: root, dependencies: [scroll] },
  );

  return (
    <div ref={root} id="home-skew" style={{ transformOrigin: "center center" }}>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Timeline />
      <Contact />
    </div>
  );
}
