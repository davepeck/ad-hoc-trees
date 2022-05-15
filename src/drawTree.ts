import { getBounds, circlePoint } from "./utils";
import { SimpleRandom } from "./random";

/** Options for the tree drawing method! */
export interface TreeOptions {
  /** The max depth. */
  depth: number;

  /** The maximum branch length. */
  length: number;

  /** The max branch width. */
  width: number;

  /** The angle spread in each direction (radians). */
  spread: number;

  /** Length variation. */
  lengthVariation: number;

  /** Just how curvy should things be? */
  curviness: number;

  /** A random number seed. */
  seed: number;

  /** How much randomness to apply (0.0 -- none, 1.0 -- most) */
  randomness: number;
}

/** Default tree options! */
export const DEFAULT_TREE_OPTIONS: TreeOptions = {
  depth: 10,
  length: 71,
  width: 10,
  spread: 0.325,
  lengthVariation: 0.25,
  curviness: 0.2,
  seed: 1,
  randomness: 1.0,
};

/** Ellie's Default tree options! */
export const ELLIE_DEFAULT_TREE_OPTIONS: TreeOptions = {
  depth: 15,
  length: 46,
  width: 2,
  spread: 0.225,
  lengthVariation: 1.3,
  curviness: 0,
  seed: 1,
  randomness: 0,
};

/** Test tree options. */
export const TEST_DEFAULT_TREE_OPTIONS: TreeOptions = {
  depth: 2,
  length: 100,
  width: 9,
  spread: 0.675,
  lengthVariation: 4,
  curviness: 0.2,
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
  lengthVariation: {
    label: "Length Variation",
    min: 0.0,
    max: 1,
    step: 0.05,
  },
  curviness: {
    label: "Curviness",
    min: 0,
    max: 1,
    step: 0.01,
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

/** Draw a curvy branch. */
const drawBranch = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom
): { x: number, y: number } => {
  const depthPercent = depth / options.depth;
  const typicalLength = options.length * depthPercent;
  const randomLength = typicalLength * random.normal(1 - options.lengthVariation, 1 + options.lengthVariation);
  const length = linear(typicalLength, randomLength, options.randomness);
  const top = circlePoint(x, y, length, angle);
  ctx.beginPath();
  ctx.strokeStyle = "#3c3c3c";
  ctx.lineCap = "round";
  ctx.lineWidth = options.width * depthPercent;
  ctx.moveTo(x, y);
  ctx.lineTo(top.x, top.y);
  ctx.stroke();
  ctx.closePath();
  return top;
}

/** Draw a branch of our tree, recursively! */
const drawTreeRecursive = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom,
) => {
  if (depth > 0) {
    const top = drawBranch(ctx, depth, angle, x, y, options, random);

    // draw our left and right branches
    const deviation = linear(options.spread, options.spread * random.uniform(0.5, 1.5), options.randomness);
    drawTreeRecursive(ctx, depth - 1, angle - deviation, top.x, top.y, options, random);
    drawTreeRecursive(ctx, depth - 1, angle + deviation, top.x, top.y, options, random);

    // if we're near the top, draw a leaf
    if (depth <= 2) {
      drawLeaf(ctx, top.x, top.y, options, random);
    }
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
  drawTreeRecursive(
    ctx,
    options.depth,
    Math.PI / 2,
    bounds.width / 2,
    bounds.height,
    options,
    new SimpleRandom(options.seed)
  );
};
