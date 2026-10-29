import { depositDraft, emitTrace, type Atmosphere } from "./butterfly-atmosphere";
import type { FieldState } from "./butterfly-field";
import { mergeAvoidBoxes, type AvoidBox } from "./butterfly-avoidance";
import type { FieldRenderer } from "./butterfly-renderer";

const AVOID_GAP = 160;

export function selectAvoidBoxes(field: FieldState, boxes: readonly AvoidBox[]): AvoidBox[] {
  const area = field.width * field.height;

  return boxes.filter((box) => box.width * box.height < area * 0.5);
}

export function depositDrafts(field: FieldState, atmosphere: Atmosphere): void {
  for (const specimen of field.specimens) {
    depositDraft(
      atmosphere,
      specimen.x,
      specimen.y,
      0.05 + (specimen.state === "flap" ? 0.04 : 0),
      2,
    );

    if (Math.floor(field.time * 3 + specimen.id) % 7 === 0) {
      emitTrace(atmosphere, specimen.x, specimen.y, specimen.heading);
    }
  }

  for (const butterfly of field.midground) {
    depositDraft(atmosphere, butterfly.x, butterfly.y, 0.012, 1);
  }
}

export function measureAvoidBoxes(renderer: FieldRenderer): AvoidBox[] {
  const canvasRect = renderer.canvas.getBoundingClientRect();

  if (canvasRect.width < 1 || canvasRect.height < 1) return [];

  const boxes: AvoidBox[] = [];

  for (const element of document.querySelectorAll("[data-butterfly-avoid]")) {
    const rect = element.getBoundingClientRect();

    if (rect.width < 1 || rect.height < 1) continue;
    const x = (rect.left - canvasRect.left) / renderer.cellWidth;
    const y = (rect.top - canvasRect.top) / renderer.cellHeight;
    const width = rect.width / renderer.cellWidth;
    const height = rect.height / renderer.cellHeight;

    if (x + width < 0 || y + height < 0) continue;

    if (x > renderer.cols || y > renderer.rows) continue;
    boxes.push({ x, y, width, height });
  }

  return mergeAvoidBoxes(boxes, Math.round(AVOID_GAP / Math.max(renderer.cellWidth, 1)));
}
