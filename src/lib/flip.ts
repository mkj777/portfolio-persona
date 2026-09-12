/*
 * Shared-element hand-off between the project card and the detail header.
 * The card rect is captured right before navigation, the detail route animates
 * its header from that rect. Viewport rects on both sides, so scroll resets are harmless.
 */
export type FlipRect = { x: number; y: number; width: number; height: number };

let pending: { id: string; rect: FlipRect } | null = null;

export function captureFlip(id: string, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  pending = { id, rect: { x: r.left, y: r.top, width: r.width, height: r.height } };
}

export function takeFlip(id: string): FlipRect | null {
  if (!pending || pending.id !== id) return null;
  const rect = pending.rect;
  pending = null;
  return rect;
}
