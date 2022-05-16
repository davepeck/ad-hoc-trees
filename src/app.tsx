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

/** Our primary application. */
export const App: React.FC = () => {
  const [mode, setMode] = useState<"simple" | "fancy">("simple");
  const [options, setOptions] = useState<SimpleTreeOptions | FancyTreeOptions>(ELLIES_TREE_OPTIONS);

  const updateMode = (newMode: "simple" | "fancy") => {
    setMode(newMode);
    if (newMode === "simple") {
      setOptions(ELLIES_TREE_OPTIONS);
    }
    else {
      setOptions(DAVES_TREE_OPTIONS);
    }
  };

  const drawTree = mode === "simple" ? simpleDrawTree : fancyDrawTree;
  const rangeSettings = mode === "simple" ? SIMPLE_TREE_RANGE_SETTINGS : FANCY_TREE_RANGE_SETTINGS;

  return (
    <div className="outer">
      <h1>Trees!</h1>
      <h3>Project #1, 2022-05-15</h3>
      <Segmented segments={{ "simple": "Simple", "fancy": "Fancy" }} initialSelected={mode} onChange={(id) => updateMode(id as "simple" | "fancy")} />

      {/* <select onChange={(e) => updateMode(e.target.value as "simple" | "fancy")}>
        <option value="simple" selected={mode === "simple"}>Simple</option>
        <option value="fancy" selected={mode === "fancy"}>Fancy</option>
      </select> */}
      <Ranges
        onChange={(name, value) => setOptions({ ...options, [name]: value })}
        settings={rangeSettings}
        initials={options}
      />
      <div className="tree-container">
        <Canvas
          draw={(ctx) => drawTree(ctx, options as any)}
          className="tree-drawing"
        />
      </div>
    </div>
  );
};
