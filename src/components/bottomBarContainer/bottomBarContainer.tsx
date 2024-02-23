import { useState } from "react";
import styles from "./bottomBarContainer.module.scss";

interface BottomBarContainerProps {
  children: React.ReactElement | React.ReactElement[];
  isOpen: boolean;
}

export const BottomBarContainer = (props: BottomBarContainerProps) => {
  return (
    <div
      className={`${styles.bottomBarContainer} ${
        !props.isOpen ? styles.closed : ""
      }`}
    >
      <div className={styles.bottomBarContent}>{props.children}</div>
    </div>
  );
};
