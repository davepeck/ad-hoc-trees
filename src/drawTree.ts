import { getBounds, circlePoint } from "./utils";
import { SimpleRandom } from "./random";

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

  /** A random number seed. */
  seed: number;

  /** How much randomness to apply (0.0 -- none, 1.0 -- most) */
  randomness: number;
}

/** Default tree options! */
export const DEFAULT_TREE_OPTIONS = {
  maxDepth: 10,
  maxLength: 71,
  maxWidth: 10,
  spread: 0.325,
  seed: 1,
  randomness: 1.0,
};

/** Ellie's Default tree options! */
export const ELLIE_DEFAULT_TREE_OPTIONS = {
  maxDepth: 15,
  maxLength: 47,
  maxWidth: 2,
  spread: 0.225,
  seed: 1,
  randomness: 0,
};

/** Test tree options. */
export const TEST_DEFAULT_TREE_OPTIONS = {
  maxDepth: 2,
  maxLength: 100,
  maxWidth: 9,
  spread: 0.675,
  seed: 1,
  randomness: 1.0,
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
    max: 15,
    step: 1,
  },
  spread: {
    label: "Spread",
    min: 0,
    max: Math.PI / 4.0,
    step: 0.025,
  },
  seed: {
    label: "Seed",
    min: 1,
    max: 30,
    step: 1,
  },
  randomness: {
    label: "Randomness",
    min: 0,
    max: 1,
    step: 0.1,
  }
};


/** Generate a random leaf color! */
const leafColor = (options: TreeOptions, random: SimpleRandom): string => {
  const defaultH = 165;
  const defaultS = 70;
  const defaultL = 65;
  const defaultA = 0.5;
  const randomH = random.uniform(defaultH - 5, defaultH + 5);
  const randomS = random.uniform(defaultS - 5, defaultS + 5);
  const randomL = random.uniform(defaultL - 5, defaultL + 5);
  const randomA = random.uniform(defaultA - 0.25, defaultA + 0.5);
  const h = linear(defaultH, randomH, options.randomness);
  const s = linear(defaultS, randomS, options.randomness);
  const l = linear(defaultL, randomL, options.randomness);
  const a = linear(defaultA, randomA, options.randomness);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

/** Draw a single leaf! */
const drawLeaf = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom
) => {
  ctx.beginPath();
  ctx.fillStyle = leafColor(options, random);
  const defaultRadius = 5;
  const randomRadius = random.normal(2, 7);
  const radius = linear(defaultRadius, randomRadius, options.randomness);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

/** Generate a linear interplation between two points. */
const linear = (a: number, b: number, t: number) => a * (1 - t) + b * t;

/** Draw a branch of our tree, recursively! */
const drawBranch = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom,
) => {
  const depthPercent = depth / options.maxDepth;
  if (depth > 0) {
    const top = circlePoint(x, y, options.maxLength * depthPercent, angle);
    ctx.beginPath();
    ctx.strokeStyle = "#3c3c3c";
    ctx.lineCap = "round";
    ctx.lineWidth = options.maxWidth * depthPercent;
    ctx.moveTo(x, y);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();
    ctx.closePath();

    if (depth <= 3) {
      drawLeaf(ctx, top.x, top.y, options, random);
    }

    const deviation = linear(options.spread, options.spread * random.uniform(0.5, 1.5), options.randomness);
    drawBranch(ctx, depth - 1, angle - deviation, top.x, top.y, options, random);
    drawBranch(ctx, depth - 1, angle + deviation, top.x, top.y, options, random);
  }
};

/** Draw a tree with specified options. */
export const drawTree = (
  ctx: CanvasRenderingContext2D,
  options: TreeOptions
) => {
  const bounds = getBounds(ctx);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, bounds.width, bounds.height);
  drawBranch(
    ctx,
    options.maxDepth,
    Math.PI / 2,
    bounds.width / 2,
    bounds.height,
    options,
    new SimpleRandom(options.seed)
  );
};
