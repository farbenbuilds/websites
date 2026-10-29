import { clamp } from "./butterfly-math";

export type AvoidBox = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type Steering = {
  x: number;
  y: number;
};

export type BreezePointer = {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
};

export const BREEZE_RADIUS = 22;

export function mergeAvoidBoxes(boxes: readonly AvoidBox[], gap: number): AvoidBox[] {
  const merged = boxes.map((box) => ({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
  }));

  let changed = true;

  while (changed) {
    changed = false;

    for (let i = 0; i < merged.length; i++) {
      for (let j = i + 1; j < merged.length; j++) {
        const a = merged[i];
        const b = merged[j];

        if (!a || !b) continue;

        const touches =
          a.x - gap < b.x + b.width &&
          a.x + a.width + gap > b.x &&
          a.y - gap < b.y + b.height &&
          a.y + a.height + gap > b.y;

        if (!touches) continue;
        const minX = Math.min(a.x, b.x);
        const minY = Math.min(a.y, b.y);
        const maxX = Math.max(a.x + a.width, b.x + b.width);
        const maxY = Math.max(a.y + a.height, b.y + b.height);
        merged[i] = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        };
        merged.splice(j, 1);
        changed = true;
        break;
      }

      if (changed) break;
    }
  }

  return merged;
}

export function steerFromBoxes(
  boxes: readonly AvoidBox[],
  x: number,
  y: number,
  margin: number,
  out: Steering,
): void {
  out.x = 0;
  out.y = 0;

  for (const box of boxes) {
    const closestX = clamp(x, box.x, box.x + box.width);
    const closestY = clamp(y, box.y, box.y + box.height);
    const dx = x - closestX;
    const dy = y - closestY;
    const distance = Math.hypot(dx, dy);

    if (distance > margin) continue;
    const strength = 1 - distance / margin;

    if (distance < 0.001) {
      out.y -= (box.height + margin) * strength;
      continue;
    }

    out.x += (dx / distance) * strength;
    out.y += (dy / distance) * strength;
  }
}

export function steerFromPointer(
  pointer: BreezePointer,
  x: number,
  y: number,
  out: Steering,
): void {
  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const distance = Math.hypot(dx, dy);

  out.x = 0;
  out.y = 0;

  if (distance > BREEZE_RADIUS || distance < 0.001) return;
  const strength = (1 - distance / BREEZE_RADIUS) ** 2;
  out.x = (dx / distance) * strength;
  out.y = (dy / distance) * strength - strength * 0.35;
}
