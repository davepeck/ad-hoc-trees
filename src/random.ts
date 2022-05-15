/** SFC32 (Simple Fast Counter) PRNG. */
function sfc32(a: number, b: number, c: number, d: number): () => number {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/**
 * A simple seedable random number generator.
 *
 * Because it's seedable, you can use it to get deterministic results by
 * sending in the same seed and calling it the same way a second time.
 *
 * NOT intended to be used for anything important, like cryptography.
 */
export class SimpleRandom {
  static MAGIC_1 = 0x9e3779b9;
  static MAGIC_2 = 0x243f6a88;
  static MAGIC_3 = 0xb7e15162;
  static MAGIC_4 = 0xdeadbeef;

  generator: () => number;

  constructor(seed: number) {
    this.generator = sfc32(
      seed ^ SimpleRandom.MAGIC_1,
      seed ^ SimpleRandom.MAGIC_2,
      seed ^ SimpleRandom.MAGIC_3,
      seed ^ SimpleRandom.MAGIC_4
    );
    for (let i = 0; i < 100; i++) {
      this.generator();
    }
  }

  /** Return an arbitrary random number from [0.0, 1.0). */
  random(): number {
    return this.generator();
  }

  /** Return an arbitrary random number from [min, max) */
  uniform(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  /** Use the box-muller algorithm to return numbers from (0, 1) w/ mean 0.5 */
  boxMuellerRandom(): number {
    let u = 0;
    let v = 0;
    // Convert [0, 1) to (0, 1)
    while (u === 0) u = this.random();
    while (v === 0) v = this.random();

    // Box-Muller transform
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Convert to (0, 1)
    num = num / 10.0 + 0.5;

    // Special case: re-run if we're out of expected range.
    if (num > 1 || num < 0) {
      return this.boxMuellerRandom();
    }

    return num;
  }

  /** Return a normal-distribution number between `min` and `max`. */
  normal(min: number, max: number): number {
    const r = min + this.boxMuellerRandom() * (max - min);
    return r;
  }
}
