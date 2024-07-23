import { useEffect, useState } from "react";
import styles from "./tabEditor.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";
import React from "react";

interface TabEditorProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const TabEditor = (props: TabEditorProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>(props.tab);
  const [heldKeys, setHeldKeys] = useState<string[]>([]);
  const [currentHover, setCurrentHover] = useState<number>(-1);

  useEffect(() => {
    props.setTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!heldKeys.includes(e.key)) setHeldKeys([...heldKeys, e.key]);

      if (!heldKeys.includes("Control")) return;

      switch (e.key) {
        // TODO: Show controls in UI
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
          [stringKey]: val,
        } as TabColumn;
      }),
    });
  };

  const addColumnToTab = (index?: number) => {
    if (!index)
      setCurrentTab({
        ...currentTab,
        cols: [...currentTab.cols, {} as TabColumn],
      });
    else {
      const preIndex = [...currentTab.cols].splice(0, index + 1);
      const postIndex = [...currentTab.cols].splice(
        index + 1,
        currentTab.cols.length - index - 1
      );

      setCurrentTab({
        ...currentTab,
        cols: [...preIndex, {} as TabColumn, ...postIndex],
      });
    }
  };

  const removeColumnFromTab = (index?: number) => {
    if (!index) {
      const tabCols = [...currentTab.cols];
      tabCols.pop();

      setCurrentTab({
        ...currentTab,
        cols: tabCols,
      });
    } else {
      const preIndex = [...currentTab.cols].splice(0, index);
      const postIndex = [...currentTab.cols].splice(
        index + 1,
        currentTab.cols.length - index - 1
      );

      setCurrentTab({
        ...currentTab,
        cols: [...preIndex, ...postIndex],
      });
    }
  };

  const toggleColumnSeparator = (index: number) => {
    const preIndex = [...currentTab.cols].splice(0, index);
    const periIndex = [...currentTab.cols][index];
    const postIndex = [...currentTab.cols].splice(
      index + 1,
      currentTab.cols.length - index - 1
    );

    periIndex["separator"] = !periIndex["separator"];

    setCurrentTab({
      ...currentTab,
      cols: [...preIndex, periIndex, ...postIndex],
    });
  };

  return (
    <div className={styles.tabEditorContainer}>
      <div className={styles.tabName}>
        <span>Editing: {currentTab.name}</span>
      </div>
      <div className={styles.tabContainer}>
        <div className={styles.tabCol}>
          <div className={styles.col}>
            <span></span>
            <span>e</span>
            <span>B</span>
            <span>G</span>
            <span>D</span>
            <span>A</span>
            <span>E</span>
          </div>
        </div>
        {currentTab.cols.map((tabCol, tabColIndex) => {
          return (
            <div
              key={tabColIndex}
              className={`${styles.tabCol} ${
                tabCol["separator"] ? styles.separator : ""
              } ${currentHover == tabColIndex ? styles.remove : ""}`}
            >
              <div className={styles.col}>
                <input
                  value={(tabCol.chord as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "chord")
                  }
                />
                <input
                  value={(tabCol.e as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "e")
                  }
                />
                <input
                  value={(tabCol.B as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "B")
                  }
                />
                <input
                  value={(tabCol.G as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "G")
                  }
                />
                <input
                  value={(tabCol.D as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "D")
                  }
                />
                <input
                  value={(tabCol.A as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "A")
                  }
                />
                <input
                  value={(tabCol.E as string) ?? ""}
                  onChange={(e) =>
                    handleTabChange(e.target.value, tabColIndex, "E")
                  }
                />
              </div>
              <div className={styles.columnButtonContainer}>
                <div>
                  <button
                    onClick={() => removeColumnFromTab(tabColIndex)}
                    onMouseEnter={() => setCurrentHover(tabColIndex)}
                    onMouseLeave={() => setCurrentHover(-1)}
                  >
                    -
                  </button>
                  <button onClick={() => toggleColumnSeparator(tabColIndex)}>
                    |
                  </button>
                  <button onClick={() => addColumnToTab(tabColIndex)}>+</button>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.tabEndCol} onClick={() => addColumnToTab()}>
          +
        </div>
      </div>
    </div>
  );
};
