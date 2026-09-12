import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/motion";
import type { Scene } from "@/lib/store";
import styles from "./backdrop.module.css";
import { FRAGMENT, SCENES, type SceneUniforms, VERTEX } from "./shader";

type Props = { scene: Scene; paused?: boolean };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/*
 * OGL fullscreen quad. The module is imported lazily so the shader never costs the
 * first paint. Scene changes lerp the uniforms, nothing jumps.
 */
export function GenerativeCanvas({ scene, paused = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const sceneRef = useRef<Scene>(scene);
  const pausedRef = useRef(paused);
  sceneRef.current = scene;
  pausedRef.current = paused;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    let raf = 0;
    let cleanup = () => {};

    void import("ogl").then(({ Renderer, Program, Mesh, Triangle }) => {
      if (cancelled) return;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5),
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
      });
      const gl = renderer.gl;
      el.appendChild(gl.canvas);

      const start = SCENES[sceneRef.current] ?? SCENES.home;
      if (!start) return;
      const current: SceneUniforms = structuredClone(start);
      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
          uMouse: { value: [0.5, 0.5] },
          uColorA: { value: current.colorA },
          uColorB: { value: current.colorB },
          uColorC: { value: current.colorC },
          uIntensity: { value: current.intensity },
          uHalftone: { value: current.halftone },
          uAngle: { value: current.angle },
          uBubbles: { value: current.bubbles },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        renderer.setSize(el.clientWidth, el.clientHeight);
        program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1 - e.clientY / window.innerHeight;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let last = performance.now();
      let time = 0;
      const still = reducedMotion();
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (pausedRef.current || document.hidden) return;
        time += dt;
        const target = SCENES[sceneRef.current] ?? start;
        const k = 1 - Math.exp(-dt * 1.8);
        for (let i = 0; i < 3; i++) {
          current.colorA[i] = lerp(current.colorA[i] ?? 0, target.colorA[i] ?? 0, k);
          current.colorB[i] = lerp(current.colorB[i] ?? 0, target.colorB[i] ?? 0, k);
          current.colorC[i] = lerp(current.colorC[i] ?? 0, target.colorC[i] ?? 0, k);
        }
        current.intensity = lerp(current.intensity, target.intensity, k);
        current.halftone = lerp(current.halftone, target.halftone, k);
        current.angle = lerp(current.angle, target.angle, k);
        current.bubbles = lerp(current.bubbles, target.bubbles, k);
        mouse.x = lerp(mouse.x, mouse.tx, k);
        mouse.y = lerp(mouse.y, mouse.ty, k);

        program.uniforms.uTime.value = time;
        program.uniforms.uMouse.value = [mouse.x, mouse.y];
        program.uniforms.uIntensity.value = current.intensity;
        program.uniforms.uHalftone.value = current.halftone;
        program.uniforms.uAngle.value = current.angle;
        program.uniforms.uBubbles.value = current.bubbles;
        renderer.render({ scene: mesh });
        if (still) cancelAnimationFrame(raf);
      };
      raf = requestAnimationFrame(frame);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        gl.canvas.remove();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className={styles.canvas} data-ready={ready} aria-hidden="true" />;
}
