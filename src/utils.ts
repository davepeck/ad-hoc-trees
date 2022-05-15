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
  a: number,
  xSign: number = 1,
  ySign: number = -1  // chosen to match canvas coordinate system directions.
): { x: number; y: number } => ({
  x: cx + xSign * r * Math.cos(a),
  y: cy + ySign * r * Math.sin(a),
});

