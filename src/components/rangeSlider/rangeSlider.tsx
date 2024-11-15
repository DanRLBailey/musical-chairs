import { useEffect, useState } from "react";
import styles from "./rangeSlider.module.scss";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onValueChange: (newVal: number) => void;
  step?: number;
  label?: string;
  format?: (val: number) => string;
}

export const RangeSlider = (props: RangeSliderProps) => {
  const [value, setValue] = useState<number>(props.value);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    props.onValueChange(value);
  }, [value]);

  const getLeftMargin = () => {
    const numerator = value - props.min;
    const denominator = props.max - props.min;

    return Math.min(Math.max((numerator / denominator) * 100 - 1, 0), 90);
  };

  return (
    <div className={styles.multiHandleRangeSliderContainer}>
      <div className={styles.labelContainer}>
        {props.label && (
          <div className={styles.label}>
            <span>{props.label}</span>
          </div>
        )}
      </div>
      <div
        className={`${styles.slider} ${props.label ? styles.withLabel : ""} ${
          isFocused ? styles.focused : ""
        }`}
      >
        <span>{props.format ? props.format(props.min) : props.min}</span>
        <span>{props.format ? props.format(props.max) : props.max}</span>
        <input
          type="range"
          min={props.min}
          max={props.max}
          step={props.step ?? 1}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          value={value}
          onMouseDown={() => setIsFocused(true)}
          onMouseUp={() => setIsFocused(false)}
        />
      </div>
      <div
        className={styles.indicator}
        style={{ marginLeft: `${getLeftMargin()}%` }}
      >
        <span>{props.format ? props.format(value) : value}</span>
      </div>
    </div>
  );
};
