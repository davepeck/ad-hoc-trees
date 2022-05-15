import React, { useState } from "react";
import { Canvas } from "./canvas";
import { drawTree } from "./drawTree";
import { Range } from "./range";
import type { CanvasDrawFunction } from "./useCanvas";
import { TreeOptions, ELLIE_TREE_OPTIONS } from "./drawTree";

/** Our primary application. */
export const App: React.FC = () => {
  const [options, setOptions] = useState<TreeOptions>(ELLIE_TREE_OPTIONS);

  return (
    <div className="outer">
      <h1>Trees!</h1>
      <h3>Project #1, 2022-05-15</h3>
      <Range
        name="Depth"
        min={1}
        max={15}
        step={1}
        initial={options.maxDepth}
        onChange={(maxDepth) => setOptions({ ...options, maxDepth })}
      />
      <Range
        name="Length"
        min={10}
        max={100}
        step={1}
        initial={options.maxLength}
        onChange={(maxLength) => setOptions({ ...options, maxLength })}
      />
      <Range
        name="Width"
        min={1}
        max={10}
        step={1}
        initial={options.maxWidth}
        onChange={(maxWidth) => setOptions({ ...options, maxWidth })}
      />
      <Range
        name="Spread"
        min={0}
        max={Math.PI / 4}
        step={0.025}
        initial={options.spread}
        onChange={(spread) => setOptions({ ...options, spread })}
      />
      <div className="tree-container">
        <Canvas
          draw={(ctx) => drawTree(ctx, options)}
          className="tree-drawing"
        />
      </div>
    </div>
  );
};
