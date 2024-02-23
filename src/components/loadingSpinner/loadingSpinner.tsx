import { useState } from "react";
import styles from "./loadingSpinner.module.scss";

interface LoadingSpinnerProps {
  multiplier?: number;
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <svg
        width={24 * (props.multiplier ?? 1)}
        height={24 * (props.multiplier ?? 1)}
        stroke="#000"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={styles.spinner}>
          <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
        </g>
      </svg>
    </div>
  );
};
