import { useEffect, useState } from "react";
import styles from "./tabViewer.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";

interface TabViewerProps {
  tab: Tab;
}

export const TabViewer = (props: TabViewerProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(props.tab);

  useEffect(() => {
    setCurrentTab(props.tab);
  }, [props.tab]);

  return (
    <div className={styles.tabViewerContainer}>
      <div className={styles.tabName}>
        <span>{currentTab.name}</span>
      </div>
      <div className={styles.tabContainer}>
        <div className={styles.tabCol}>
          <span></span>
          <span>e</span>
          <span>B</span>
          <span>G</span>
          <span>D</span>
          <span>A</span>
          <span>E</span>
        </div>
        {currentTab.cols.map((tabCol, tabColIndex) => {
          return (
            <div key={tabColIndex} className={styles.tabCol}>
              <span>{tabCol.chord ?? ""}</span>
              <span>{tabCol.e ?? ""}</span>
              <span>{tabCol.B ?? ""}</span>
              <span>{tabCol.G ?? ""}</span>
              <span>{tabCol.D ?? ""}</span>
              <span>{tabCol.A ?? ""}</span>
              <span>{tabCol.E ?? ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
