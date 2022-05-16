import React, { useState } from "react";
import "./segmented.scss";


interface SegmentedProps {
  /** A mapping from identifier to display name for each segment. */
  segments: Record<string, string>;

  /** The initial selected segment identifier. */
  initialSelected: string;

  /** The function to call when the selected segment changes. */
  onChange: (newSelected: string) => void;
}


/** The Segmented component displays a set of segments, each of which can be selected. */
export const Segmented: React.FC<SegmentedProps> = (props) => {
  const [selected, setSelected] = useState(props.initialSelected);

  const onChange = (newSelected: string) => {
    setSelected(newSelected);
    props.onChange(newSelected);
  };

  return (
    <div className="segmented">
      {Object.entries(props.segments).map(([id, name]) => (
        <React.Fragment key={id}>
          <input
            type="radio"
            id={id}
            value={id}
            checked={selected === id}
            onChange={(e) => onChange(e.target.value)}
            className={`segment ${id === selected ? "selected" : ""}`}
            onClick={() => onChange(id)}
          />
          <label htmlFor={id}>{name}</label>
        </React.Fragment>
      ))}
    </div>
  );
};
