import { useEffect, useState } from "react";
import styles from "./tabEditor.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";

interface TabEditorProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const TabEditor = (props: TabEditorProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(props.tab); //Change to be a prop

  useEffect(() => {
    props.setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (
    val: string,
    colIndex: number,
    stringKey: string
  ) => {
    setCurrentTab({
      ...currentTab,
      cols: [...currentTab.cols].map((col, index) => {
        if (index !== colIndex) return col;

        return {
          ...currentTab.cols[colIndex],
          [stringKey]:
            stringKey == "chord"
              ? val
              : val === "" || !parseInt(val)
              ? null
              : parseInt(val),
        } as TabColumn;
      }),
    });
  };

  return (
    <div className={styles.tabEditorContainer}>
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
            <input
              value={tabCol.chord ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "chord")
              }
            />
            <input
              value={tabCol.e ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "e")
              }
            />
            <input
              value={tabCol.B ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "B")
              }
            />
            <input
              value={tabCol.G ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "G")
              }
            />
            <input
              value={tabCol.D ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "D")
              }
            />
            <input
              value={tabCol.A ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "A")
              }
            />
            <input
              value={tabCol.E ?? ""}
              onChange={(e) =>
                handleTabChange(e.target.value, tabColIndex, "E")
              }
            />
          </div>
        );
      })}
    </div>
  );
};
