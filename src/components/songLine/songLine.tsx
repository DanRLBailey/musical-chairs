import { isValidChordPart } from "@/helpers/chords";
import { Fragment, useState } from "react";
import { ChordPill } from "../chordPill/chordPill";
import { TabViewer } from "../tabViewer/tabViewer";
import { Setting } from "../songComponent/songComponent";
import { Chord, Line, Song, Tab, Word } from "@/types/songTypes";
import styles from "./songLine.module.scss";
import {
  getNoOfChordsBeforeCurrentLine,
  getTabsInLine,
} from "@/helpers/songHelper";

interface SongLineProps {
  song: Song;
  line: Line;
  lineIndex: number;
  allChords: Chord[];
  allWordsFiltered: Word[];
  currentTime: number;
  settings: Setting;
  editing?: boolean;
  isMobile: boolean;
  removeChordFromSongWord: (
    lineIndex: number,
    wordIndex: number,
    chordIndex: number
  ) => void;
  addChordToSongWord: (lineIndex: number, wordIndex: number) => void;
}

interface TabWithChordIndex extends Tab {
  chordIndex: number;
  timing: number;
}

export const SongLine = (props: SongLineProps) => {
  const [lineTabs, setLineTabs] = useState<TabWithChordIndex[]>([]);

  let lineChordIndex =
    0 + getNoOfChordsBeforeCurrentLine(props.song, props.line, props.lineIndex);

  return (
    <Fragment key={props.lineIndex}>
      {props.settings.showTabsInline.toggled &&
        getTabsInLine(props.line).length > 0 &&
        !props.editing &&
        !props.isMobile && (
          <div className={styles.songTabs}>
            {[...lineTabs]
              .sort((a, b) => a.chordIndex - b.chordIndex)
              .map((tab, tabIndex) => {
                const nextChord =
                  props.allChords[
                    props.allChords.findIndex(
                      (c) => c.chord == tab.name && c.timing == tab.timing
                    ) + 1
                  ];

                const active =
                  props.settings.highlightChords.toggled &&
                  props.currentTime > 0 &&
                  tab.timing !== null &&
                  tab.timing !== undefined &&
                  (tab.timing <= props.currentTime || tab.timing === 0) &&
                  (!nextChord ||
                    (nextChord.timing && nextChord.timing > props.currentTime));

                return (
                  <div
                    className={`${styles.songTab} ${
                      active ? styles.active : ""
                    }`}
                    id={`chordPill-${tab.chordIndex}`}
                  >
                    <TabViewer key={tabIndex} tab={tab} showTiming={false} />
                  </div>
                );
              })}
            {/* {getTabsInLine(props.line).map((tab, tabIndex) => {
              if (!props.song.tabs) return;

              const nextChord =
                props.allChords[props.allChords.findIndex((c) => c == tab) + 1];

              const active =
                props.settings.highlightChords.toggled &&
                props.currentTime > 0 &&
                tab.timing !== null &&
                tab.timing !== undefined &&
                (tab.timing <= props.currentTime || tab.timing === 0) &&
                (!nextChord ||
                  (nextChord.timing && nextChord.timing > props.currentTime));

              //props.overallChordIndex++;

              return (
                <div
                  className={`${styles.songTab} ${active ? styles.active : ""}`}
                  id={`chordPill-${props.overallChordIndex}`}
                >
                  <TabViewer
                    key={tabIndex}
                    tab={
                      props.song.tabs.find((t) => t.name == tab.chord) ??
                      props.song.tabs[0]
                    }
                    showTiming={false}
                  />
                </div>
              );
            })} */}
          </div>
        )}
      <div key={props.lineIndex} className={styles.songLine}>
        {props.line.words.map((word, wordIndex) => {
          const wordTiming =
            word.timing || word.timing == 0 ? word.timing : null;
          const hasWordTiming = wordTiming || wordTiming == 0;

          const hasLyric =
            !word.lyric.includes("[") &&
            !word.lyric.includes("]") &&
            word.lyric != "";

          const nextWord =
            props.allWordsFiltered[
              props.allWordsFiltered.findIndex((w) => w == word) + 1
            ];

          return (
            <div key={wordIndex} className={styles.songWord}>
              <div className={styles.songChord}>
                {word.chords.map((chord, chordIndex) => {
                  const chordTiming =
                    chord.timing || chord.timing == 0 ? chord.timing : null;

                  const hasChordTiming = chordTiming || chordTiming == 0;

                  const nextChord =
                    props.allChords[
                      props.allChords.findIndex((c) => c == chord) + 1
                    ];

                  if (
                    (props.settings.showTabsInline.toggled &&
                      chord.chord
                        .split("/")
                        .every((part) => !isValidChordPart(part).valid)) ||
                    !props.settings.showTabsInline.toggled ||
                    props.isMobile
                  ) {
                    const tab: Tab | undefined =
                      props.song.tabs?.find((t) => t.name == chord.chord) ??
                      undefined;

                    if (
                      !lineTabs.some((tab) => tab.chordIndex == lineChordIndex)
                    )
                      setLineTabs([
                        ...lineTabs,
                        {
                          ...tab,
                          timing: chord.timing,
                          chordIndex: lineChordIndex,
                        } as TabWithChordIndex,
                      ]);
                  }

                  lineChordIndex++;

                  return (
                    <ChordPill
                      key={chordIndex}
                      chord={chord}
                      nextChord={nextChord}
                      hasChordTiming={hasChordTiming}
                      chordTiming={chordTiming}
                      currentTime={
                        ((chordTiming && nextChord && nextChord.timing) ||
                          chordTiming == 0) &&
                        props.currentTime >= chordTiming &&
                        nextChord.timing &&
                        props.currentTime <= nextChord.timing
                          ? props.currentTime
                          : -1
                      }
                      overallChordIndex={lineChordIndex - 1}
                      lineIndex={props.lineIndex}
                      wordIndex={wordIndex}
                      chordIndex={chordIndex}
                      highlightChord={props.settings.highlightChords.toggled}
                      removeChordFromSongWord={() =>
                        props.editing
                          ? props.removeChordFromSongWord(
                              props.lineIndex,
                              wordIndex,
                              chordIndex
                            )
                          : null
                      }
                      hiddenMode={props.settings.hiddenMode.toggled}
                      showInline={
                        props.settings.showTabsInline.toggled &&
                        !chord.chord
                          .split("/")
                          .every((part) => isValidChordPart(part).valid) &&
                        !props.isMobile
                      }
                    />
                  );
                })}
              </div>
              <div
                className={`${styles.songLyric} ${
                  !hasWordTiming && hasLyric ? styles.missingWordTiming : ""
                } ${hasLyric ? styles.hasLyric : ""} ${
                  props.settings.highlightLyrics.toggled &&
                  word.timing &&
                  word.timing <= props.currentTime &&
                  (!nextWord ||
                    (nextWord.timing && nextWord.timing > props.currentTime))
                    ? styles.active
                    : ""
                }`}
                onClick={() =>
                  props.addChordToSongWord(props.lineIndex, wordIndex)
                }
              >
                <span>{word.lyric}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
