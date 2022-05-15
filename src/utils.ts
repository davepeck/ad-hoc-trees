/** Return resolution-independent drawing boundaries. */
export const getBounds = (
  ctx: CanvasRenderingContext2D
): { width: number; height: number } => {
  const { devicePixelRatio: ratio = 1 } = window;
  const { width, height } = ctx.canvas;
  return { width: width / ratio, height: height / ratio };
};

/** Compute the point on a circle centered at (cx, cy) and with radius r and angle `a` in radians. */
export const circlePoint = (
  cx: number,
  cy: number,
  r: number,
  a: number
): { x: number; y: number } => ({
  x: cx + r * Math.sin(a),
  y: cy + r * Math.cos(a),
});

