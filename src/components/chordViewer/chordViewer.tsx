import { useEffect, useState } from "react";
import styles from "./chordViewer.module.scss";
import { ChordObj, ChordPartObj } from "@/types/songTypes";

interface ChordViewerProps {
  chordName: string;
  chord: ChordPartObj;
}

export const ChordViewer = (props: ChordViewerProps) => {
  const [frets, setFrets] = useState<string[]>(props.chord.positions);
  //TODO: fix for when the positions are further in the fretboard
  //TODO: fix last open chord showing higher than all the others

  useEffect(() => {
    setFrets(props.chord.positions);
  }, [props.chord]);

  return (
    <div className={styles.chordViewerContainer}>
      <div className={styles.chordName}>
        <span>{props.chordName}</span>
      </div>
      <div className={styles.chordContainer}>
        <div className={styles.chordCol}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {frets.map((fret, fretIndex) => {
          return (
            <div key={fretIndex} className={styles.chordCol}>
              <div>
                {fret == "x" && <span className={styles.muted}>X</span>}{" "}
                {fret == "0" && <span className={styles.open}></span>}
              </div>
              <div>{fret == "1" && <span className={styles.fret}></span>}</div>
              <div>{fret == "2" && <span className={styles.fret}></span>}</div>
              <div>{fret == "3" && <span className={styles.fret}></span>}</div>
              <div>{fret == "4" && <span className={styles.fret}></span>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
