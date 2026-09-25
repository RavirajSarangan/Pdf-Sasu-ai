import { getStroke } from "perfect-freehand";
import { Point } from "@/types/pdf";

/**
 * Converts raw points into a smooth SVG path string using perfect-freehand
 */
export function getSvgPathFromStroke(points: Point[], size = 3, isHighlight = false): string {
  if (!points || points.length === 0) return "";

  const strokePoints = points.map((p) => [p.x, p.y]);
  const stroke = getStroke(strokePoints, {
    size: isHighlight ? size * 3 : size,
    thinning: isHighlight ? 0 : 0.5,
    smoothing: 0.5,
    streamline: 0.55,
    easing: (t) => t,
    start: {
      taper: isHighlight ? 0 : 1.5,
      easing: (t) => t,
      cap: true,
    },
    end: {
      taper: isHighlight ? 0 : 1.5,
      easing: (t) => t,
      cap: true,
    },
  });

  if (stroke.length === 0) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
