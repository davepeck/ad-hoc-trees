import { getBounds, circlePoint } from "./utils";


/** Options for the tree! */
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
export const ELLIE_TREE_OPTIONS = {
  maxDepth: 15,
  maxLength: 47,
  maxWidth: 2,
  spread: 0.225,
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
  drawBranch(ctx, options.maxDepth, Math.PI, bounds.width / 2, bounds.height, options);
};

