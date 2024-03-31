import { useEffect, useState } from "react";
import styles from "./multiHandleRangeSlider.module.scss";
import RefreshIcon from "@mui/icons-material/Refresh";

interface MultiHandleRangeSliderProps {
  min: number;
  max: number;
  onValuesChange: (min: number, max: number) => void;
  label?: string;
  format?: (val: number) => string;
}

export const MultiHandleRangeSlider = (props: MultiHandleRangeSliderProps) => {
  const [values, setValues] = useState<number[]>([props.min, props.max]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleMinValueChange = (newVal: number) => {
    const newMin = newVal > values[1] ? values[1] : newVal;

    setValues([newMin, values[1]]);
  };

  const handleMaxValueChange = (newVal: number) => {
    const newMax = newVal < values[0] ? values[0] : newVal;

    setValues([values[0], newMax]);
  };

  useEffect(() => {
    props.onValuesChange(values[0], values[1]);
  }, [values]);

  const getWidth = () => {
    const maxDiff = props.max - props.min;
    const diff = values[1] - values[0];
    const percent = (diff / maxDiff) * 100;
    return Math.max(percent, 35);
  };

  const getLeftMargin = () => {
    const diff = props.max - props.min;
    const min = props.max - values[0];
    const percent = (min / diff) * 100;

    // TODO: Centre instead of left align
    return Math.min(100 - percent, 65);
  };

  return (
    <div className={styles.multiHandleRangeSliderContainer}>
      <div className={styles.labelContainer}>
        {props.label && (
          <div className={styles.label}>
            <span>{props.label}</span>
          </div>
        )}
        <RefreshIcon
          className={styles.refreshIcon}
          onClick={() => setValues([props.min, props.max])}
        />
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
          className={values[0] == values[1] ? styles.equal : ""}
          min={props.min}
          max={props.max}
          step={1}
          onChange={(e) => handleMinValueChange(parseInt(e.target.value))}
          value={values[0]}
          onMouseDown={() => setIsFocused(true)}
          onMouseUp={() => setIsFocused(false)}
        />
        <input
          type="range"
          className={values[0] == values[1] ? styles.equal : ""}
          min={props.min}
          max={props.max}
          step={1}
          onChange={(e) => handleMaxValueChange(parseInt(e.target.value))}
          value={values[1]}
          onMouseDown={() => setIsFocused(true)}
          onMouseUp={() => setIsFocused(false)}
        />
      </div>
      <div
        className={styles.indicator}
        style={{ marginLeft: `${getLeftMargin()}%`, width: `${getWidth()}%` }}
      >
        <span>{props.format ? props.format(values[0]) : values[0]}</span>
        {values[0] != values[1] && (
          <>
            <div></div>
            <span>{props.format ? props.format(values[1]) : values[1]}</span>
          </>
        )}
      </div>
    </div>
  );
};
