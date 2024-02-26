import { useEffect, useState } from "react";
import styles from "./tabEditor.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";

interface TabEditorProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const TabEditor = (props: TabEditorProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(props.tab); //Change to be a prop
  const [heldKeys, setHeldKeys] = useState<string[]>([]);

  useEffect(() => {
    props.setTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!heldKeys.includes(e.key)) setHeldKeys([...heldKeys, e.key]);

      if (!heldKeys.includes("Control")) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          addColumnToTab();
          break;
        case "Backspace":
          e.preventDefault();
          removeColumnFromTab();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setHeldKeys(heldKeys.filter((key) => key !== e.key));
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

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
              : (val === "" || !parseInt(val)) && val != "0"
              ? null
              : parseInt(val),
        } as TabColumn;
      }),
    });
  };

  const addColumnToTab = () => {
    setCurrentTab({
      ...currentTab,
      cols: [...currentTab.cols, {} as TabColumn],
    });
  };

  const removeColumnFromTab = () => {
    const tabCols = [...currentTab.cols];
    tabCols.pop();

    setCurrentTab({
      ...currentTab,
      cols: tabCols,
    });
  };

  return (
    <div className={styles.tabEditorContainer}>
      <div className={styles.tabName}>
        <span>Editing: {currentTab.name}</span>
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
        <div className={styles.tabEndCol} onClick={addColumnToTab}>
          +
        </div>
      </div>
    </div>
  );
};
