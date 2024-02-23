import { useState } from "react";
import styles from "./songContainer.module.scss";
import { Song } from "../../types/songTypes";

interface SongContainer {
  song: Song;
}

export const SongContainer = (props: SongContainer) => {
  return (
    <div className={styles.songPageContainer}>
      <div className={styles.songDetails}>
        <span className={styles.heading}>{props.song.name}</span>
        <span className={styles.subHeading}>{props.song.artist}</span>
      </div>
      <div className={styles.songContainer}>
        {props.song.lines.map((line, lineIndex) => {
          return (
            <div key={lineIndex} className={styles.songLine}>
              {line.words.map((word, wordIndex) => {
                return (
                  <div key={wordIndex} className={styles.songWord}>
                    <div className={styles.songChord}>
                      {word.chords.map((chord, chordIndex) => {
                        return <span key={chordIndex}>{chord}</span>;
                      })}
                    </div>
                    <span className={styles.songLyric}>{word.lyric}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
