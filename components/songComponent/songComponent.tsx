import { useEffect, useState } from "react";
import styles from "./songComponent.module.scss";
import { Chord, Line, Song, Word, songTemplate } from "../../types/songTypes";
import {
  getIndecesOfLatestBlankChord,
  getIndecesOfLatestBlankWord,
  getIndecesOfLatestChord,
  getIndecesOfLatestWord,
  getPartsFromSong,
} from "../../helpers/songHelper";
import { ChordList } from "../chordList/chordList";
import { SidebarContainer } from "../sidebarContainer/sidebarContainer";
import { TextInput } from "../textInput/textInput";
import ReactPlayer from "react-player";
import { BottomBarContainer } from "../bottomBarContainer/bottomBarContainer";
import { MusicPlayer } from "../musicPlayer/musicPlayer";
import oldSong from "../../../../public/song-old.json";
import { ChordPill } from "../chordPill/chordPill";

interface AddSongComponentProps {
  existingSong?: Song;
  editing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}

export const SongComponent = (props: AddSongComponentProps) => {
  const [song, setSong] = useState<Song>(props.existingSong ?? songTemplate);
  const [textAreaVal, setTextAreaVal] = useState<string>("");
  const [currentChord, setCurrentChord] = useState<string>();
  const [currentTime, setCurrentTime] = useState<number>(-1);
  const [allWordsFiltered, setAllWordsFiltered] = useState<Word[]>([]);
  const [allChords, setAllChords] = useState<Chord[]>([]);
  const [allChordsInSong, setAllChordsInSong] = useState<string[]>([]); //List the chords at the top of the page
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1);

  function convertOldSong() {
    const nSong: Song = {
      name: song.name,
      artist: song.artist,
      slug: `${song.name.toLowerCase().split(" ").join("-")}-${song.artist
        .toLowerCase()
        .split(" ")
        .join("-")}`,
      difficulty: 0,
      capo: 0,
      key: "A",
      tuning: "Standard",
      duration: 175,
      lines: [],
      link: song.link,
    } as Song;

    oldSong.forEach((section) =>
      section.Lines.forEach((line, lineIndex) => {
        const newLine: Line = { words: [] };

        line.forEach((word, wordIndex) => {
          const parts = word.split(/[*^]/);
          const lyric =
            lineIndex == 0 && wordIndex == 0 && parts[0] == ""
              ? section.Section
              : parts[0];
          parts.shift();
          const chords = parts;

          const newWord: Word = {
            lyric: lyric,
            chords: chords.map((chord) => {
              return { chord: chord } as Chord;
            }),
          };
          newLine.words.push(newWord);
        });

        nSong.lines.push(newLine);
      })
    );

    console.log(nSong);
  }

  useEffect(() => {
    if (song.lines.length <= 0) return;

    const { allLines, allWords: words, allChords } = getPartsFromSong(song);
    const allLinesToString = allLines
      .map((line) => line.words.map((word) => word.lyric).join(" "))
      .join("\n");

    setAllWordsFiltered(
      words.filter(
        (word) =>
          word &&
          !word.lyric.includes("[") &&
          !word.lyric.includes("]") &&
          word.lyric != ""
      )
    );
    setAllChords(allChords);

    const songChords: string[] = [];
    allChords.forEach((chord) => {
      if (songChords.some((c) => c == chord.chord)) return;
      songChords.push(chord.chord);
    });

    setAllChordsInSong(songChords);

    setTextAreaVal(allLinesToString);
  }, [song]);

  useEffect(() => {
    const { allChords } = getPartsFromSong(song);
    const index =
      allChords.length -
      [...allChords]
        .reverse()
        .findIndex(
          (chord) =>
            chord.timing !== null &&
            chord.timing !== undefined &&
            chord.timing <= currentTime
        ) -
      1;

    if (index != currentChordIndex) {
      setCurrentChordIndex(index);

      const el = document.getElementById(`chordPill-${index}`);
      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentTime]);

  const addChordToSongWord = (lineIndex: number, wordIndex: number) => {
    if (!currentChord) return;

    const { allLines, line, word } = getPartsFromSong(
      song,
      lineIndex,
      wordIndex
    );
    word.chords.push({ chord: currentChord });
    line.words[wordIndex] = word;

    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const removeChordFromSongWord = (
    lineIndex: number,
    wordIndex: number,
    chordIndex: number
  ) => {
    const { allLines, line, word, chord } = getPartsFromSong(
      song,
      lineIndex,
      wordIndex,
      chordIndex
    );
    const index = word.chords.findIndex((c) => c == chord);
    word.chords.splice(index, 1);
    line.words[wordIndex] = word;

    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const addTimingToLatestChord = (currentTime: number) => {
    const { latestChord, lineIndex, wordIndex, chordIndex } =
      getIndecesOfLatestBlankChord(song);

    if (!latestChord) return;

    const { line, word, allLines } = getPartsFromSong(
      song,
      lineIndex,
      wordIndex,
      chordIndex
    );

    const newChord = { ...latestChord, timing: currentTime };
    word.chords[chordIndex] = newChord as Chord;
    line.words[wordIndex] = word;
    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const removeTimingFromLatestChord = () => {
    const { latestChord, lineIndex, wordIndex, chordIndex } =
      getIndecesOfLatestChord(song);

    if (!latestChord) return;

    const { line, word, allLines } = getPartsFromSong(
      song,
      lineIndex,
      wordIndex,
      chordIndex
    );

    const newChord = { ...latestChord };
    delete newChord.timing;
    word.chords[chordIndex] = newChord as Chord;
    line.words[wordIndex] = word;
    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const addTimingToLatestWord = (currentTime: number) => {
    const { latestWord, lineIndex, wordIndex } =
      getIndecesOfLatestBlankWord(song);

    if (!latestWord) return;

    const { line, allLines } = getPartsFromSong(song, lineIndex, wordIndex);

    const newWord = { ...latestWord, timing: currentTime };
    line.words[wordIndex] = newWord;
    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const removeTimingFromLatestWord = () => {
    const { latestWord, lineIndex, wordIndex } = getIndecesOfLatestWord(song);

    if (!latestWord) return;

    const { line, allLines } = getPartsFromSong(song, lineIndex, wordIndex);

    const newWord = { ...latestWord };
    delete newWord.timing;
    line.words[wordIndex] = newWord;
    allLines[lineIndex] = line;

    setSong({
      ...song,
      lines: [...allLines],
    });
  };

  const handleTextAreaChange = (text: string) => {
    setTextAreaVal(text);
    const textAreaLines = text.split("\n");
    const currentLines: Line[] = [];

    textAreaLines.forEach((line, lineIndex) => {
      const newLine: Line = { words: [] };
      const words = line.split(" ");
      const currentWords: Word[] = [];

      words.forEach((word, wordIndex) => {
        if (
          props.existingSong &&
          props.existingSong.lines[lineIndex]?.words[wordIndex]
        ) {
          const { word: selectedWord } = getPartsFromSong(
            props.existingSong,
            lineIndex,
            wordIndex
          );

          selectedWord.lyric = word;
          currentWords.push(selectedWord);
        } else if (song?.lines[lineIndex]?.words[wordIndex]) {
          const { word: selectedWord } = getPartsFromSong(
            song,
            lineIndex,
            wordIndex
          );

          selectedWord.lyric = word;
          currentWords.push(selectedWord);
        } else {
          const newWord: Word = {
            chords: [],
            lyric: word,
          };

          currentWords.push(newWord);
        }
      });

      newLine.words = currentWords;
      currentLines.push(newLine);
    });

    setSong({
      ...song,
      lines: currentLines,
    });
  };

  let overallChordIndex = -1;

  return (
    <div className={styles.addSongContainer}>
      <SidebarContainer>
        <>
          {props.editing && (
            <div className={styles.addSongSidebar}>
              <div className={styles.list}>
                <TextInput
                  label="Song Name"
                  value={song.name}
                  onValueChange={(newVal) =>
                    setSong({ ...song, name: newVal as string })
                  }
                  placeholder="Name"
                />
                <TextInput
                  label="Artist"
                  value={song.artist}
                  onValueChange={(newVal) =>
                    setSong({ ...song, artist: newVal as string })
                  }
                  placeholder="Artist"
                />
              </div>
              <TextInput
                label="Link"
                value={song.link}
                onValueChange={(newVal) =>
                  setSong({ ...song, link: newVal as string })
                }
                placeholder="youtube.com/..."
              />
              <div className={styles.list}>
                <TextInput
                  label="Key"
                  value={song.key}
                  onValueChange={(newVal) =>
                    setSong({ ...song, key: newVal as string })
                  }
                  placeholder="Gb"
                />
                <TextInput
                  label="Capo"
                  value={song.capo}
                  onValueChange={(newVal) =>
                    setSong({ ...song, capo: newVal as number })
                  }
                  placeholder="0"
                />
              </div>
              <div className={styles.list}>
                <TextInput
                  label="Tuning"
                  value={song.tuning}
                  onValueChange={(newVal) =>
                    setSong({ ...song, tuning: newVal as string })
                  }
                  placeholder="Standard"
                />
                <TextInput
                  label="Duration"
                  value={song.duration}
                  onValueChange={(newVal) =>
                    setSong({ ...song, duration: newVal as number })
                  }
                  placeholder="0"
                />
              </div>
              <TextInput
                label="Lyrics"
                value={textAreaVal}
                onValueChange={(newVal) =>
                  handleTextAreaChange(newVal as string)
                }
                type="textArea"
              />
              <ChordList onChordPressed={(chord) => setCurrentChord(chord)} />
              <button
                onClick={() => {
                  song.slug = `${song.name
                    .toLowerCase()
                    .split(" ")
                    .join("-")}-${song.artist
                    .toLowerCase()
                    .split(" ")
                    .join("-")}`;
                  console.log(song);
                  navigator.clipboard.writeText(JSON.stringify(song));
                }}
              >
                Save
              </button>
              <button onClick={convertOldSong}>Convert</button>
            </div>
          )}
        </>
      </SidebarContainer>
      <BottomBarContainer isOpen={ReactPlayer.canPlay(song.link)}>
        <>
          {song.link != "" && (
            <MusicPlayer
              song={song}
              isEditing={props.editing ?? false}
              addTimingToLatestChord={(currentTime) =>
                addTimingToLatestChord(currentTime)
              }
              addTimingToLatestWord={(currentTime) =>
                addTimingToLatestWord(currentTime)
              }
              removeTimingFromLatestWord={removeTimingFromLatestWord}
              removeTimingFromLatestChord={removeTimingFromLatestChord}
              onCurrentTimeChange={(currentTime) => setCurrentTime(currentTime)}
            />
          )}
        </>
      </BottomBarContainer>
      <div className={styles.songContent}>
        <div className={styles.songDetails}>
          <span className={styles.heading}>{song.name}</span>
          <span className={styles.subHeading}>{song.artist}</span>
          {/* {allChordsInSong.map((c) => {
          return <div>{c}</div>;
        })} */}
        </div>
        <div className={styles.songContainer}>
          {song.lines.map((line, lineIndex) => {
            return (
              <div key={lineIndex} className={styles.songLine}>
                {line.words.map((word, wordIndex) => {
                  const wordTiming =
                    word.timing || word.timing == 0 ? word.timing : null;
                  const hasWordTiming = wordTiming || wordTiming == 0;

                  const hasLyric =
                    !word.lyric.includes("[") &&
                    !word.lyric.includes("]") &&
                    word.lyric != "";

                  const nextWord =
                    allWordsFiltered[
                      allWordsFiltered.findIndex((w) => w == word) + 1
                    ];

                  return (
                    <div key={wordIndex} className={styles.songWord}>
                      <div className={styles.songChord}>
                        {word.chords.map((chord, chordIndex) => {
                          overallChordIndex++;
                          const chordTiming =
                            chord.timing || chord.timing == 0
                              ? chord.timing
                              : null;

                          const hasChordTiming =
                            chordTiming || chordTiming == 0;

                          const nextChord =
                            allChords[
                              allChords.findIndex((c) => c == chord) + 1
                            ];

                          return (
                            <ChordPill
                              key={chordIndex}
                              chord={chord}
                              nextChord={nextChord}
                              hasChordTiming={hasChordTiming}
                              chordTiming={chordTiming}
                              currentTime={currentTime}
                              overallChordIndex={overallChordIndex}
                              lineIndex={lineIndex}
                              wordIndex={wordIndex}
                              chordIndex={chordIndex}
                              removeChordFromSongWord={removeChordFromSongWord}
                            />
                          );
                        })}
                      </div>
                      <div
                        className={`${styles.songLyric} ${
                          !hasWordTiming && hasLyric
                            ? styles.missingWordTiming
                            : ""
                        } ${hasLyric ? styles.hasLyric : ""} ${
                          word.timing &&
                          word.timing <= currentTime &&
                          (!nextWord ||
                            (nextWord.timing && nextWord.timing > currentTime))
                            ? styles.active
                            : ""
                        }`}
                        onClick={() => addChordToSongWord(lineIndex, wordIndex)}
                      >
                        <span>{word.lyric}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
