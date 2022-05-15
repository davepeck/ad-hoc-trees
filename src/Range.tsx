import React, { useState } from "react";
import "./range.scss";

/** Props to a range slider. */
export interface RangeProps {
  /** The label to display for the value. */
  label: string;

  /** The minimum value. */
  min: number;

  /** The maximum value. */
  max: number;

  /** The step to take between values. */
  step: number;

  /** The initial value. */
  initial: number;

  /** Callback when the value changes. */
  onChange: (value: number) => void;
}

/** A range slider. */
export const Range: React.FC<RangeProps> = ({
  label,
  min,
  max,
  step,
  initial,
  onChange,
}) => {
  const [value, setValue] = useState(initial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="range">
      <label htmlFor={`range-${label}`}>
        {label}
      </label>
      <input
        id={`range-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span className="range-value">
        {value}
      </span>
    </div>
  );
};
