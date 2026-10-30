export type Steering = {
  x: number;
};

export type BreezePointer = {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
};

export const BREEZE_RADIUS = 22;

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

  if (distance > BREEZE_RADIUS || distance < 0.001) return;
  const strength = (1 - distance / BREEZE_RADIUS) ** 2;
  out.x = (dx / distance) * strength;
}
