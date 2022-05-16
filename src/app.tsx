import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Ranges } from "./Ranges";
// import {
//   drawTree,
//   TreeOptions,
//   DAVES_TREE_OPTIONS,
//   TREE_RANGE_SETTINGS,
// } from "./tree/fancy";
import {
  drawTree,
  TreeOptions,
  ELLIES_TREE_OPTIONS,
  TREE_RANGE_SETTINGS,
} from "./tree/simple";

/** Our primary application. */
export const App: React.FC = () => {
  const [options, setOptions] = useState<TreeOptions>(ELLIES_TREE_OPTIONS);

  return (
    <div className="outer">
      <h1>Trees!</h1>
      <h3>Project #1, 2022-05-15</h3>
      <Ranges
        onChange={(name, value) => setOptions({ ...options, [name]: value })}
        settings={TREE_RANGE_SETTINGS}
        initials={options}
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
