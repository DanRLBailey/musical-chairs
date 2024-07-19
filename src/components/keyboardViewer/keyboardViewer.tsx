import { useEffect, useState } from "react";
import styles from "./keyboardViewer.module.scss";
import { Keyboard } from "../keyboard/keyboard";
import { Tab, TabColumn } from "@/types/songTypes";

interface KeyboardViewerProps {
  tab?: Tab;
  type?: "viewer" | "editor";
  noOfSteps?: number;
  currentIndex?: number;
}

export const KeyboardViewer = (props: KeyboardViewerProps) => {
  const [tab, setTab] = useState<Tab>(props.tab ?? ({} as Tab));
  const [type, setType] = useState<string>(props.type ?? "viewer");
  const [noOfSteps, setNoOfSteps] = useState<number>(props.noOfSteps ?? 1);
  const [currentIndex, setCurrentIndex] = useState<number>(
    props.currentIndex ?? 0
  );
  const [keyboardList, setKeyboardList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setTab(props.tab ?? ({} as Tab));
    setType(props.type ?? "viewer");
    setNoOfSteps(props.noOfSteps ?? 1);
    setCurrentIndex(props.currentIndex ?? 0);
  }, [props.tab, props.type, props.noOfSteps, props.currentIndex]);

  useEffect(() => {
    getKeyboards();
  }, [currentIndex]);

  const getKeyboards = () => {
    const keyboardArr: JSX.Element[] = [];

    if (tab.cols) {
      const cols = [...tab.cols];

      for (let i = 0; i < noOfSteps; i++) {
        keyboardArr.push(
          <Keyboard
            key={i + currentIndex}
            startingChord="A"
            tabCol={cols[currentIndex + i] ?? ({} as TabColumn)}
            noOfScales={7}
            includeEndBuffer
            type={i == 0 ? "viewer" : "ghost"}
          />
        );
      }
    } else {
      keyboardArr.push(
        <Keyboard
          startingChord="A"
          noOfScales={7}
          includeEndBuffer
          type={"editor"}
        />
      );
    }

    setKeyboardList(keyboardArr);
  };

  return <div className={styles.keyboardViewerContainer}>{keyboardList}</div>;
};
