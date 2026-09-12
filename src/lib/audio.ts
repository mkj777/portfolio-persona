import { useSyncExternalStore } from "react";

export type SfxName = "hover" | "confirm" | "back" | "open";

const STORAGE_KEY = "portfolio-sound";

/*
 * Tiny synthesized UI sounds, no assets. Muted by default until the user flips the toggle,
 * the context is unlocked by the first pointer or key gesture.
 */
class SfxPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private listeners = new Set<() => void>();
  private lastHover = 0;
  muted = true;

  constructor() {
    try {
      this.muted = localStorage.getItem(STORAGE_KEY) !== "on";
    } catch {
      this.muted = true;
    }
    if (typeof window !== "undefined") {
      const unlock = () => this.unlock();
      window.addEventListener("pointerdown", unlock, { passive: true });
      window.addEventListener("keydown", unlock);
    }
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getMuted = () => this.muted;

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
    } catch {
      /* ignore */
    }
    if (!muted) {
      this.unlock();
      this.play("confirm");
    }
    for (const fn of this.listeners) fn();
  }

  toggle() {
    this.setMuted(!this.muted);
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
  }

  play(name: SfxName) {
    if (this.muted || !this.ctx || !this.master) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    const now = this.ctx.currentTime;
    if (name === "hover") {
      /* Rate-limit the tick so a fast cursor sweep stays a texture, not a drum roll. */
      if (now - this.lastHover < 0.035) return;
      this.lastHover = now;
    }
    switch (name) {
      case "hover":
        this.blip(now, { freq: 1480, to: 1180, dur: 0.045, type: "square", gain: 0.18 });
        break;
      case "confirm":
        this.blip(now, { freq: 520, to: 260, dur: 0.12, type: "sawtooth", gain: 0.35 });
        this.blip(now + 0.01, { freq: 1600, to: 900, dur: 0.06, type: "triangle", gain: 0.2 });
        this.noise(now, 0.05, 0.22);
        break;
      case "back":
        this.blip(now, { freq: 700, to: 300, dur: 0.14, type: "triangle", gain: 0.28 });
        break;
      case "open":
        this.blip(now, { freq: 240, to: 720, dur: 0.16, type: "sawtooth", gain: 0.24 });
        this.noise(now + 0.02, 0.09, 0.14);
        break;
    }
  }

  private blip(
    at: number,
    o: { freq: number; to: number; dur: number; type: OscillatorType; gain: number },
  ) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = o.type;
    osc.frequency.setValueAtTime(o.freq, at);
    osc.frequency.exponentialRampToValueAtTime(o.to, at + o.dur);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(o.gain, at + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);
    osc.connect(gain).connect(this.master);
    osc.start(at);
    osc.stop(at + o.dur + 0.02);
  }

  private noise(at: number, dur: number, level: number) {
    if (!this.ctx || !this.master) return;
    const length = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2400;
    const gain = this.ctx.createGain();
    gain.gain.value = level;
    src.connect(filter).connect(gain).connect(this.master);
    src.start(at);
  }
}

export const sfx = new SfxPlayer();

export function useSfxMuted(): boolean {
  return useSyncExternalStore(sfx.subscribe, sfx.getMuted, () => true);
}
