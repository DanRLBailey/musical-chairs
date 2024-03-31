import { useEffect, useState } from "react";
import styles from "./chordViewer.module.scss";
import { ChordObj, ChordPartObj } from "@/types/songTypes";

interface ChordViewerProps {
  chordName: string;
  chord: ChordPartObj;
  currentTime: number;
  countdown?: number;
}

export const ChordViewer = (props: ChordViewerProps) => {
  const [frets, setFrets] = useState<string[]>(props.chord.positions);
  const [fretOffset, setFretOffset] = useState<number>(0);
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
    setFrets(props.chord.positions);

    const fretNums: number[] = props.chord.positions
      .map((fret) => (parseInt(fret) ? parseInt(fret) : null))
      .filter((fret) => fret !== null) as number[];

    const min = Math.min(...fretNums);
    const offset = min - 1;
    setFretOffset(offset);
  }, [props.chord]);

  return (
    <div className={styles.chordViewerContainer}>
      <div className={styles.chordName}>
        <span>{props.chordName}</span>
      </div>
      <div className={styles.chordContainer}>
        <div className={styles.chordCol}>
          <div></div>
          <div>{fretOffset > 0 && <>{fretOffset + 1}fr</>}</div>
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
              <div>
                {(parseInt(fret) - fretOffset).toString() == "1" && (
                  <span className={styles.fret}></span>
                )}
              </div>
              <div>
                {(parseInt(fret) - fretOffset).toString() == "2" && (
                  <span className={styles.fret}></span>
                )}
              </div>
              <div>
                {(parseInt(fret) - fretOffset).toString() == "3" && (
                  <span className={styles.fret}></span>
                )}
              </div>
              <div>
                {(parseInt(fret) - fretOffset).toString() == "4" && (
                  <span className={styles.fret}></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <input
        type="range"
        min={initialCurrentTime}
        max={initialCurrentTime + countdownVal}
        value={props.currentTime}
        onChange={() => {}}
        step={0.01}
      ></input>
    </div>
  );
};
