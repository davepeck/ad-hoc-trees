import { getBounds, circlePoint } from "../utils";
import { RangeSettings } from "../Ranges";

/** Options for the tree drawing method! */
export interface TreeOptions extends Record<string, number> {
  /** The max depth. */
  depth: number;

  /** The maximum branch length. */
  length: number;

  /** The max branch width. */
  width: number;

  /** The angle spread in each direction (radians). */
  spread: number;
}

/** Ellie's tree options! */
export const ELLIES_TREE_OPTIONS: TreeOptions = {
  depth: 15,
  length: 46,
  width: 2,
  spread: 0.225,
};

/** Suggested ranges for all drawing options. */
export const TREE_RANGE_SETTINGS: RangeSettings = {
  depth: {
    label: "Depth",
    min: 1,
    max: 15,
    step: 1,
  },
  length: {
    label: "Length",
    min: 10,
    max: 100,
    step: 1,
  },
  width: {
    label: "Width",
    min: 1,
    max: 15,
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
const drawTreeRecursive = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions
) => {
  if (depth > 0) {
    const depthPercent = depth / options.depth;
    const top = circlePoint(x, y, options.length, angle);
    ctx.beginPath();
    ctx.lineWidth = options.width * depthPercent;
    ctx.strokeStyle = "#fff";
    ctx.lineCap = "round";
    ctx.moveTo(x, y);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();
    ctx.closePath();

    drawTreeRecursive(
      ctx,
      depth - 1,
      angle - options.spread,
      top.x,
      top.y,
      options
    );
    drawTreeRecursive(
      ctx,
      depth - 1,
      angle + options.spread,
      top.x,
      top.y,
      options
    );
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
  drawTreeRecursive(
    ctx,
    options.depth,
    Math.PI / 2,
    bounds.width / 2,
    bounds.height,
    options
  );
};
