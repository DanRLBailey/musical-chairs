import { useState } from "react";
import styles from "./toggle.module.scss";

interface ToggleProps {
  toggled: boolean;
  setToggled: (newToggled: boolean) => void;
  leftSideText?: string | React.ReactNode;
  rightSideText?: string | React.ReactNode;
  title?: string;
  type?: "toggle" | "button";
}

export const Toggle = (props: ToggleProps) => {
  const formatText = (text: string) => {
    if (!text || text == "") return text;

    const uppercaseText = `${text[0].toUpperCase()}${text.substring(1)}`;
    return uppercaseText.match(/[A-Z][a-z]+/g)?.join(" ");
  };

  if (props.type == "button") {
    return (
      <div
        className={`${styles.toggleButtonContainer} ${
          props.toggled ? styles.toggled : ""
        }`}
        onClick={() => props.setToggled(!props.toggled)}
      >
        {props.title && formatText(props.title)}
        {!props.title && props.toggled}
      </div>
    );
  }

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
