import { getBounds, circlePoint } from "../utils";
import { SimpleRandom } from "../random";

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

  /** Length variation. */
  lengthVariation: number;

  /** Just how curvy should things be? */
  curviness: number;

  /** How likely is it that we have extra branches? */
  density: number;

  /** A random number seed. */
  seed: number;

  /** How much randomness to apply (0.0 -- none, 1.0 -- most) */
  randomness: number;
}

/** Dave's tree options! */
export const DAVES_TREE_OPTIONS: TreeOptions = {
  depth: 10,
  length: 74,
  width: 9,
  spread: 0.325,
  lengthVariation: 0.35,
  curviness: 0.43,
  density: 0.1034,
  seed: 7,
  randomness: 1.0,
};

/** Ellie's tree options! */
export const ELLIES_TREE_OPTIONS: TreeOptions = {
  depth: 15,
  length: 46,
  width: 2,
  spread: 0.225,
  lengthVariation: 1.3,
  curviness: 0,
  density: 0.03,
  seed: 1,
  randomness: 0,
};


/** Detail about a single tree range setting. */
export interface RangeSetting {
  /** The human-readable label for the option. */
  label: string;

  /** The minimum value. */
  min: number;

  /** The maximum value. */
  max: number;

  /** The step to take between values. */
  step: number;
}

/** Detail about all of a tree's range settings. */
export type RangeSettings = Record<keyof TreeOptions, RangeSetting>;

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
  lengthVariation: {
    label: "Length Variation",
    min: 0.0,
    max: 1,
    step: 0.05,
  },
  curviness: {
    label: "Curviness",
    min: 0,
    max: Math.PI,
    step: 0.01,
  },
  density: {
    label: "Density",
    min: 0,
    max: 0.15,
    step: 0.0001,
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
  },
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
};

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
};

/** Generate a linear interplation between two points. */
const linear = (a: number, b: number, t: number) => a * (1 - t) + b * t;

/** Draw a linear branch segment. */
const drawBranchSegment = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  width: number
) => {
  ctx.beginPath();
  ctx.strokeStyle = "#3c3c3c";
  ctx.lineCap = "round";
  ctx.lineWidth = width;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
};

/** Draw a curvy branch. */
const drawBranch = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom
): { x: number; y: number } => {
  const BRANCH_SEGMENT_LENGTH = 10;

  const depthPercent = depth / options.depth;
  const typicalLength = options.length * depthPercent;
  const randomLength =
    typicalLength *
    random.uniform(1 - options.lengthVariation, 1 + options.lengthVariation);
  const length = linear(typicalLength, randomLength, options.randomness);

  const segments = Math.round(length / BRANCH_SEGMENT_LENGTH);
  const leftoverSegmentLength = length - segments * BRANCH_SEGMENT_LENGTH;
  const defaultCurveDirection = (angle > Math.PI / 2) ? 1 : -1;
  const randomCurveDirection = (random.uniform(0, 1) < 0.5) ? -1 : 1;
  const curveDirection = linear(defaultCurveDirection, randomCurveDirection, options.randomness);
  const curveAngleIncrement = options.curviness * curveDirection * (1.0 - depthPercent);
  let current = { x, y };
  let curveAngle = angle;
  ctx.moveTo(current.x, current.y);
  for (let i = 0; i < segments; i++) {
    const segmentTop = circlePoint(
      current.x,
      current.y,
      BRANCH_SEGMENT_LENGTH,
      curveAngle
    );
    drawBranchSegment(ctx, current, segmentTop, options.width * depthPercent);

    const branchRandom = linear(0, random.uniform(0, 1), options.randomness);
    if (branchRandom > (1.0 - options.density)) {
      const randomDirection = random.uniform(0, 1) < 0.5 ? -1 : 1;
      drawTreeRecursive(
        ctx,
        depth - 1,
        curveAngle + randomDirection * options.spread,
        segmentTop.x,
        segmentTop.y,
        options,
        random
      )
    }

    current = segmentTop;
    curveAngle += curveAngleIncrement;
  }

  if (leftoverSegmentLength > 0) {
    const segmentTop = circlePoint(
      current.x,
      current.y,
      leftoverSegmentLength,
      curveAngle
    );
    drawBranchSegment(ctx, current, segmentTop, options.width * depthPercent);
    current = segmentTop;
  }

  return current;
};

/** Draw a branch of our tree, recursively! */
const drawTreeRecursive = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  angle: number,
  x: number,
  y: number,
  options: TreeOptions,
  random: SimpleRandom
) => {
  if (depth > 0) {
    const top = drawBranch(ctx, depth, angle, x, y, options, random);

    // draw our left and right branches
    const deviation = linear(
      options.spread,
      options.spread * random.uniform(0.5, 1.5),
      options.randomness
    );
    drawTreeRecursive(
      ctx,
      depth - 1,
      angle - deviation,
      top.x,
      top.y,
      options,
      random
    );
    drawTreeRecursive(
      ctx,
      depth - 1,
      angle + deviation,
      top.x,
      top.y,
      options,
      random
    );

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
