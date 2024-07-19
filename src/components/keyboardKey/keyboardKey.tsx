import { useState } from "react";
import styles from "./keyboardKey.module.scss";

interface KeyboardKeyProps {
  chord: string;
  isLeftOfBlack?: boolean;
  isRightOfBlack?: boolean;
  handleKeyPress: (key: string) => void;
  isActive?: boolean;
  type?: "editor" | "viewer" | "ghost";
}

export const KeyboardKey = (props: KeyboardKeyProps) => {
  const [active, setActive] = useState<boolean>(props.isActive ?? false);

  const onKeyPress = () => {
    if (props.type == "editor") {
      setActive(!active);
      props.handleKeyPress(props.chord);
    }
  };

  const getTypeClass = () => {
    switch (props.type) {
      case "editor":
        return styles.editor;
      case "ghost":
        return styles.ghost;
      case "viewer":
      default:
        return styles.viewer;
    }
  };

  return (
    <li
      data-chord={props.chord}
      className={`${styles.keyboardKeyContainer} ${
        props.chord.includes("b") ? styles.black : styles.white
      } ${props.isLeftOfBlack ? styles.leftOfBlack : ""} ${
        props.isRightOfBlack ? styles.rightOfBlack : ""
      } ${active ? styles.active : ""} ${getTypeClass()}`}
      onClick={onKeyPress}
    ></li>
  );
};
