import { useEffect, useState } from "react";
import styles from "./tabViewer.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";

interface TabViewerProps {
  tab: Tab | undefined;
  currentTime: number;
  countdown?: number;
  showTiming?: boolean;
}

export const TabViewer = (props: TabViewerProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(props.tab as Tab);
  const [countdownVal, setCountdownVal] = useState<number>(
    props.countdown ?? 0
  );
  const [initialCurrentTime, setInitialCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!props.countdown) return;

    setCountdownVal(props.countdown);
    setInitialCurrentTime(props.currentTime);
  }, [props.countdown]);

  useEffect(() => {
    setCurrentTab(props.tab as Tab);
  }, [props.tab]);

  if (!props.tab) return;

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
            <div
              key={tabColIndex}
              className={`${styles.tabCol} ${
                tabCol.chord?.toString().includes("|")
                  ? styles.includesLine
                  : ""
              }`}
            >
              <span className={styles.tabColName}>
                {tabCol.chord?.toString().replaceAll("|", "") ?? ""}
              </span>
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
      {props.showTiming !== false && (
        <input
          type="range"
          min={initialCurrentTime}
          max={initialCurrentTime + countdownVal}
          value={props.currentTime}
          onChange={() => {}}
          step={0.01}
        ></input>
      )}
    </div>
  );
};
