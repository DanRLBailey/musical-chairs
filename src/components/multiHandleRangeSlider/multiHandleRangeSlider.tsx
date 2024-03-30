import { useEffect, useState } from "react";
import styles from "./multiHandleRangeSlider.module.scss";
import RefreshIcon from "@mui/icons-material/Refresh";
import { formatSeconds } from "../chordPill/chordPill";

interface MultiHandleRangeSliderProps {
  min: number;
  max: number;
  onValuesChange: (min: number, max: number) => void;
  label?: string;
  format?: boolean;
}

export const MultiHandleRangeSlider = (props: MultiHandleRangeSliderProps) => {
  const [values, setValues] = useState<number[]>([props.min, props.max]);

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
    return Math.max(((values[1] - values[0]) / props.max) * 100, 35);
  };

  const getLeftMargin = () => {
    const min = 100 - getWidth();
    return Math.min((values[0] / props.max) * 100, min);
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
        className={`${styles.slider} ${props.label ? styles.withLabel : ""}`}
      >
        <span>
          {props.format ? formatSeconds(props.min, false) : props.min}
        </span>
        <span>
          {props.format ? formatSeconds(props.max, false) : props.max}
        </span>
        <input
          type="range"
          className={values[0] == values[1] ? styles.equal : ""}
          min={props.min}
          max={props.max}
          step={1}
          onChange={(e) => handleMinValueChange(parseInt(e.target.value))}
          value={values[0]}
        />
        <input
          type="range"
          className={values[0] == values[1] ? styles.equal : ""}
          min={props.min}
          max={props.max}
          step={1}
          onChange={(e) => handleMaxValueChange(parseInt(e.target.value))}
          value={values[1]}
        />
      </div>
      <div
        className={styles.indicator}
        style={{ marginLeft: `${getLeftMargin()}%`, width: `${getWidth()}%` }}
      >
        <span>
          {props.format ? formatSeconds(values[0], false) : values[0]}
        </span>
        <div></div>
        <span>
          {props.format ? formatSeconds(values[1], false) : values[1]}
        </span>
      </div>
    </div>
  );
};
