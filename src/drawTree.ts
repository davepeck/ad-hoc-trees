import { getBounds, circlePoint } from "./utils";

/** Options for the tree drawing method! */
export interface TreeOptions {
  /** The max depth. */
  maxDepth: number;

  /** The maximum branch length. */
  maxLength: number;

  /** The max branch width. */
  maxWidth: number;

  /** The angle spread in each direction (radians). */
  spread: number;
}

/** Default tree options! */
export const DEFAULT_TREE_OPTIONS = {
  maxDepth: 10,
  maxLength: 70,
  maxWidth: 4,
  spread: 0.25,
};

/** Ellie's Default tree options! */
export const ELLIE_DEFAULT_TREE_OPTIONS = {
  maxDepth: 15,
  maxLength: 47,
  maxWidth: 2,
  spread: 0.225,
};

/** Detail about a single tree option's range. */
export interface OptionRange {
  /** The human-readable label for the option. */
  label: string;

  /** The minimum value. */
  min: number;

  /** The maximum value. */
  max: number;

  /** The step to take between values. */
  step: number;
}

/** Suggested ranges for all drawing options. */
export const DRAW_TREE_RANGES: Record<keyof TreeOptions, OptionRange> = {
  maxDepth: {
    label: "Depth",
    min: 1,
    max: 15,
    step: 1,
  },
  maxLength: {
    label: "Length",
    min: 10,
    max: 100,
    step: 1,
  },
  maxWidth: {
    label: "Width",
    min: 1,
    max: 10,
    step: 1,
  },
  spread: {
    label: "Spread",
    min: 0,
    max: Math.PI / 4.0,
    step: 0.025,
  },
};

/** Draw a branch of our tree, recursively! */
const drawBranch = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions
) => {
  const depthPercent = depth / options.maxDepth;
  if (depth > 0) {
    const top = circlePoint(x, y, options.maxLength * depthPercent, angle);
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = options.maxWidth * depthPercent;
    ctx.moveTo(x, y);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();
    ctx.closePath();
    drawBranch(ctx, depth - 1, angle - options.spread, top.x, top.y, options);
    drawBranch(ctx, depth - 1, angle + options.spread, top.x, top.y, options);
  }
};

/** Draw a tree with specified options. */
export const drawTree = (
  ctx: CanvasRenderingContext2D,
  options: TreeOptions
) => {
  const bounds = getBounds(ctx);
  ctx.fillStyle = "#00f";
  ctx.fillRect(0, 0, bounds.width, bounds.height);
  drawBranch(
    ctx,
    options.maxDepth,
    Math.PI,
    bounds.width / 2,
    bounds.height,
    options
  );
};
