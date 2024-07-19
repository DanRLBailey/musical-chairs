import { useEffect, useState } from "react";
import styles from "./keyboard.module.scss";
import { Tab, TabColumn } from "@/types/songTypes";
import { chordsList } from "@/constants/chords";
import { KeyboardKey } from "../keyboardKey/keyboardKey";

interface KeyboardProps {
  startingChord: string;
  tabCol?: TabColumn;
  includeStartBuffer?: boolean;
  includeEndBuffer?: boolean;
  noOfScales?: number;
  type?: "editor" | "viewer" | "ghost";
}

export const Keyboard = (props: KeyboardProps) => {
  const type = props.type ?? "viewer";

  const createArr = (noOfItems: number) => {
    const arr = [];
    for (let i = 0; i < noOfItems; i++) arr.push(i);
    return arr;
  };

  const handleKeyPress = (key: string) => {
    console.log(key);
  };

  const getChordsListFromChord = (chordToStart: string) => {
    let chordList = [...chordsList];
    let startBuffer: string[][] = [];
    let endBuffer: string[][] = [];
    const firstChordIndex = chordList.findIndex((item) =>
      item.find((i) => i == chordToStart)
    );

    if (firstChordIndex <= -1)
      return {
        chordList: [],
        startBuffer: [],
        endBuffer: [],
      };

    const firstPart = [...chordList].splice(0, firstChordIndex);
    const secondPart = [...chordList].splice(firstChordIndex);
    chordList = [...secondPart, ...firstPart];

    if (props.includeStartBuffer) {
      const tempList = [...chordList];
      startBuffer = [...tempList].splice(-4);
    }

    if (props.includeEndBuffer) {
      const tempList = [...chordList];
      endBuffer = [...tempList].splice(0, 4);
    }

    if (
      startBuffer &&
      startBuffer.length > 0 &&
      startBuffer[0].find((chord) => chord.includes("b"))
    )
      startBuffer.splice(0, 1);

    if (
      endBuffer &&
      endBuffer.length > 0 &&
      endBuffer[endBuffer.length - 1].find((chord) => chord.includes("b"))
    ) {
      const newList = [...endBuffer];
      endBuffer = newList.splice(0, endBuffer.length - 1);
    }

    return {
      chordList: chordList,
      startBuffer: startBuffer,
      endBuffer: endBuffer,
    };
  };

  const { chordList, startBuffer, endBuffer } = getChordsListFromChord(
    props.startingChord
  );

  const arr = createArr(props.noOfScales ?? 1);

  const getListOfKeys = (scaleIndex: number) => {
    let newList: string[][] = [];

    if (
      props.includeStartBuffer &&
      !props.includeEndBuffer &&
      scaleIndex == 0
    ) {
      newList = [...startBuffer, ...chordList];
    } else if (
      !props.includeStartBuffer &&
      props.includeEndBuffer &&
      scaleIndex == arr.length - 1
    ) {
      newList = [...chordList, ...endBuffer];
    } else if (props.includeStartBuffer && props.includeEndBuffer) {
      if (props.noOfScales == 1) {
        newList = [...startBuffer, ...chordList, ...endBuffer];
      } else if (scaleIndex == 0) {
        newList = [...startBuffer, ...chordList];
      } else if (scaleIndex == arr.length - 1) {
        newList = [...chordList, ...endBuffer];
      }
    } else {
      newList = [...chordList];
    }

    return newList;
  };

  const getTypeClass = () => {
    switch (type) {
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
    <div className={styles.keyboardContainer}>
      <div className={`${styles.keyboard} ${getTypeClass()}`}>
        {arr.map((item: number, scaleIndex: number) => {
          const newList = getListOfKeys(scaleIndex);

          return (
            <ul key={item} className={styles.scale}>
              {newList.map((chordArr: string[], chordIndex: number) => {
                const c = chordArr[chordArr.length - 1];
                const isLeftOfBlack =
                  chordArr.length == 1 &&
                  newList[chordIndex + 1] &&
                  newList[chordIndex + 1].length == 2;
                const isRightOfBlack =
                  (chordArr.length == 1 &&
                    newList[chordIndex - 1] &&
                    newList[chordIndex - 1].length == 2) ||
                  chordIndex == 0;

                console.log();

                return (
                  <KeyboardKey
                    key={chordIndex}
                    chord={c}
                    isLeftOfBlack={isLeftOfBlack}
                    isRightOfBlack={isRightOfBlack}
                    handleKeyPress={(chordPressed) =>
                      handleKeyPress(chordPressed)
                    }
                    isActive={
                      props.tabCol
                        ? (
                            props.tabCol[scaleIndex.toString()] as string[]
                          )?.some((chord) => chord == c)
                        : false
                    }
                    type={type}
                  />
                );
              })}
            </ul>
          );
        })}
      </div>
    </div>
  );
};
