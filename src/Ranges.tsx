import { Range } from "./Range";

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
export type RangeSettings = Record<string, RangeSetting>;

/** Props to a collection of Range sliders. */
export interface RangesProps {
  /** Details about all available ranges. */
  settings: RangeSettings;

  /** The initial values for each range. */
  initials: Record<string, number>;

  /** Callback when any of the values change. */
  onChange: (name: string, value: number) => void;
}

/** A Ranges component -- displays a collection of Range sliders. */
export const Ranges: React.FC<RangesProps> = ({
  settings,
  initials,
  onChange,
}) => (
  <div className="ranges">
    {Object.entries(settings).map(([name, setting]) => (
      <Range
        key={name}
        label={setting.label}
        min={setting.min}
        max={setting.max}
        step={setting.step}
        initial={initials[name]}
        onChange={(value) => onChange(name, value)}
      />
    ))}
  </div>
);
