import { useState } from "react";
import styles from "./chordPill.module.scss";
import { Chord } from "../../types/songTypes";
import { Tooltip } from "../tooltip/tooltip";

interface ChordPillProps {
  chord: Chord;
  nextChord: Chord;
  hasChordTiming: number | boolean;
  chordTiming: number | null;
  currentTime: number;
  overallChordIndex: number;
  lineIndex: number;
  wordIndex: number;
  chordIndex: number;
  removeChordFromSongWord?: (
    lineIndex: number,
    wordIndex: number,
    chordIndex: number
  ) => void;
}

export const formatSeconds = (
  time: number,
  includeMilliseconds: boolean = true
) => {
  const totalMilliseconds = time * 1000;
  const minutes = Math.floor(totalMilliseconds / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");
  const milliseconds = Math.floor(totalMilliseconds % 1000)
    .toString()
    .padStart(3, "0")
    .substring(0, 2); // Pad and take the first two digits

  let str = `${minutes}:${seconds}`;
  if (includeMilliseconds) str += `:${milliseconds.toString().substring(0, 2)}`;

  return str;
};

export const ChordPill = (props: ChordPillProps) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className={`${styles.chordPillContainer} ${false ? styles.active : ""} ${
        !props.hasChordTiming ? styles.missingChordTiming : ""
      } ${
        props.chordTiming !== null &&
        (props.chordTiming <= props.currentTime || props.chordTiming === 0) &&
        (!props.nextChord ||
          (props.nextChord.timing &&
            props.nextChord.timing > props.currentTime))
          ? styles.active
          : ""
      }`}
      id={`chordPill-${props.overallChordIndex}`}
      onClick={() => {
        if (props.removeChordFromSongWord)
          props.removeChordFromSongWord(
            props.lineIndex,
            props.wordIndex,
            props.chordIndex
          );
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div key={`chord-${props.chordIndex}`}>
        {props.chord.chord}
        {props.hasChordTiming && (
          <Tooltip key={`timing-${props.chordIndex}`} hovering={hovering}>
            {formatSeconds(props.chordTiming ?? 0)}
          </Tooltip>
        )}
      </div>
    </div>
  );
};
