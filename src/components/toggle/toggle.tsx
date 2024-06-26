import { useState } from "react";
import styles from "./toggle.module.scss";

interface ToggleProps {
  toggled: boolean;
  setToggled: (newToggled: boolean) => void;
  leftSideText: string | React.ReactNode;
  rightSideText: string | React.ReactNode;
}

export const Toggle = (props: ToggleProps) => {
  return (
    <div
      className={styles.toggleContainer}
      onClick={() => props.setToggled(!props.toggled)}
    >
      <span>{props.leftSideText}</span>
      <div
        className={`${styles.toggle} ${props.toggled ? styles.toggled : ""}`}
      >
        <div className={styles.toggleIndicator}></div>
      </div>
      <span>{props.rightSideText}</span>
    </div>
  );
};
