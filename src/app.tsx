import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { drawTree } from "./drawTree";
import { Range } from "./Range";
import {
  TreeOptions,
  DEFAULT_TREE_OPTIONS,
  DRAW_TREE_RANGES,
} from "./drawTree";
import { SimpleRandom } from "./random";

/** Our primary application. */
export const App: React.FC = () => {
  const [options, setOptions] = useState<TreeOptions>(
    DEFAULT_TREE_OPTIONS
  );

  return (
    <div className="outer">
      <h1>Trees!</h1>
      <h3>Project #1, 2022-05-15</h3>
      {Object.entries(DRAW_TREE_RANGES).map(([name, range]) => (
        <Range
          key={name}
          initial={options[name as keyof TreeOptions]}
          {...range}
          onChange={(value) => setOptions({ ...options, [name]: value })}
        />
      ))}
      <div className="tree-container">
        <Canvas
          draw={(ctx) => drawTree(ctx, options)}
          className="tree-drawing"
        />
      </div>
    </div>
  );
};
