import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Ranges } from "./Ranges";
import { Segmented } from "./Segmented";
import {
  drawTree as fancyDrawTree,
  TreeOptions as FancyTreeOptions,
  DAVES_TREE_OPTIONS,
  TREE_RANGE_SETTINGS as FANCY_TREE_RANGE_SETTINGS,
} from "./tree/fancy";
import {
  drawTree as simpleDrawTree,
  TreeOptions as SimpleTreeOptions,
  ELLIES_TREE_OPTIONS,
  TREE_RANGE_SETTINGS as SIMPLE_TREE_RANGE_SETTINGS,
} from "./tree/simple";

/** Our simple tree component. */
const SimpleTree = () => {
  const [options, setOptions] =
    useState<SimpleTreeOptions>(ELLIES_TREE_OPTIONS);

  return (
    <>
      <Ranges
        onChange={(name, value) => setOptions({ ...options, [name]: value })}
        settings={SIMPLE_TREE_RANGE_SETTINGS}
        initials={options}
      />
      <div className="tree-container">
        <Canvas
          draw={(ctx) => simpleDrawTree(ctx, options as any)}
          className="tree-drawing"
        />
      </div>
    </>
  );
};

/** Our fancy tree component. */
const FancyTree = () => {
  const [options, setOptions] = useState<FancyTreeOptions>(DAVES_TREE_OPTIONS);

  return (
    <>
      <Ranges
        onChange={(name, value) => setOptions({ ...options, [name]: value })}
        settings={FANCY_TREE_RANGE_SETTINGS}
        initials={options}
      />
      <div className="tree-container">
        <Canvas
          draw={(ctx) => fancyDrawTree(ctx, options as any)}
          className="tree-drawing"
        />
      </div>
    </>
  );
};

/** Our primary application. */
export const App: React.FC = () => {
  const [mode, setMode] = useState<"simple" | "fancy">("simple");

  return (
    <div className="outer">
      <h1>Trees!</h1>
      <h3>Project #1, 2022-05-15</h3>
      <Segmented
        segments={{ simple: "Simple", fancy: "Fancy" }}
        initialSelected={mode}
        onChange={(id) => setMode(id as "simple" | "fancy")}
      />
      {mode === "simple" ? <SimpleTree /> : <FancyTree />}
    </div>
  );
};
