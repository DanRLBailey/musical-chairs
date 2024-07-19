import { useContext, useEffect, useState } from "react";
import styles from "./multiSongComponent.module.scss";
import typography from "@/styles/typography.module.scss";
import { Chord, ChordObj, Song, Word } from "../../types/songTypes";
import { getPartsFromSong } from "@/helpers/songHelper";
import { SidebarContainer } from "../sidebarContainer/sidebarContainer";
import ReactPlayer from "react-player";
import { BottomBarContainer } from "../bottomBarContainer/bottomBarContainer";
import { MusicPlayer } from "../musicPlayer/musicPlayer";
import { ChordPill } from "../chordPill/chordPill";
import { useRouter } from "next/router";
import { isValidChordPart } from "@/helpers/chords";
import { title } from "@/constants/document";
import { SongHeader } from "../songHeader/songHeader";
import { TabViewer } from "../tabViewer/tabViewer";
import { ChordViewer } from "../chordViewer/chordViewer";
import allChordsJson from "@/public/chords.json";
import { NetworkContext } from "@/context/networkContext/networkContext";
import { TextInput } from "../textInput/textInput";
import { Setting } from "../songComponent/songComponent";
import { Toggle } from "../toggle/toggle";

interface MultiSongComponentProps {
  songs: Song[];
}

export const MultiSongComponent = (props: MultiSongComponentProps) => {
  const [songs, setSongs] = useState<Song[]>(props.songs);
  const [currentChord, setCurrentChord] = useState<string>();
  const [validChord, setValidChord] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(-1);
  const [allWordsFiltered, setAllWordsFiltered] = useState<Word[]>([]);
  const [allChords, setAllChords] = useState<Chord[]>([]);
  const [uniqueChords, setUniqueChords] = useState<string[]>([]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1);
  const [highlightedChord, setHighlightedChord] = useState<Chord>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [nextSongDelay, setNextSongDelay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [endOfPlaylist, setEndOfPlaylist] = useState<boolean>(false);
  const [settings, setSettings] = useState<Setting>({
    autoscroll: true,
    showChordPopup: true,
    showPopupTiming: true,
    hiddenMode: false,
    // showCountdown: true,
  });

  const { isOnline } = useContext(NetworkContext);

  useEffect(() => {
    if (!currentChord) return;

    setValidChord(isValidChordPart(currentChord).valid);
  }, [currentChord]);

  const getAllChords = () => {
    const {
      allLines,
      allWords: words,
      allChords,
    } = getPartsFromSong(songs[currentSongIndex]);

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

    const uniqueChords: string[] = [];
    allChords.forEach((chord) => {
      if (
        uniqueChords.some((c) => c == chord.chord) ||
        !isValidChordPart(chord.chord).valid
      )
        return;
      uniqueChords.push(chord.chord);
    });

    setUniqueChords(uniqueChords);
  };

  useEffect(() => {
    if (songs[currentSongIndex].lines.length <= 0) return;

    getAllChords();
  }, [songs]);

  useEffect(() => {
    const { allChords } = getPartsFromSong(songs[currentSongIndex]);
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

      setHighlightedChord(allChords[index]);

      const el = document.getElementById(`chordPill-${index}`);
      if (settings.autoscroll)
        el?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
    }
  }, [currentTime]);

  const getTimingTillNextChord = () => {
    const currentChordTiming = allChords[currentChordIndex]?.timing ?? null;
    const nextChordTiming = allChords[currentChordIndex + 1]?.timing ?? null;

    if (
      currentChordIndex >= allChords.length ||
      (!currentChordTiming && currentChordTiming != 0) ||
      !nextChordTiming
    )
      return 0;

    const timingDiff = nextChordTiming - currentChordTiming;

    return timingDiff;
  };

  const resetSong = () => {
    title(`${songs[currentSongIndex].name} | Playlist`);
    getAllChords();
  };

  useEffect(() => {
    resetSong();
  }, [currentSongIndex]);

  const handleSongEnded = () => {
    if (currentSongIndex + 1 >= songs.length) {
      setCurrentSongIndex(0);
      setEndOfPlaylist(true);
      return;
    }

    setCurrentSongIndex(currentSongIndex + 1);
    setIsPlaying(false);

    setTimeout(() => {
      setIsPlaying(true);
    }, nextSongDelay * 1000);
  };

  let overallChordIndex = -1;
  return (
    <div className={styles.multiSongComponentContainer}>
      <SidebarContainer
        onSidebarToggle={(isOpen: boolean) => setSidebarOpen(isOpen)}
      >
        <div className={styles.playlist}>
          <span className={typography.heading}>Playlist</span>
          {songs.map((song, index) => {
            return (
              <button
                key={index}
                className={`${currentSongIndex == index ? styles.active : ""}`}
                onClick={() => setCurrentSongIndex(index)}
              >
                {song.name}
              </button>
            );
          })}
        </div>
        <TextInput
          value={nextSongDelay}
          onValueChange={(newVal) => setNextSongDelay(newVal as number)}
          label="Delay"
          type={"number"}
        />
        <div className={styles.settingsContainer}>
          <span className={styles.header}>Settings</span>
          <div className={styles.settings}>
            {Object.keys(settings).map((setting, index) => {
              return (
                <Toggle
                  key={index}
                  toggled={settings[setting]}
                  setToggled={(toggled) =>
                    setSettings({
                      ...settings,
                      [setting]: toggled,
                    })
                  }
                  title={setting}
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </SidebarContainer>
      <div className={styles.songContent}>
        <div className={styles.songDetails}>
          <span className={styles.heading}>{songs[currentSongIndex].name}</span>
          <span className={styles.subHeading}>
            {songs[currentSongIndex].artist}
          </span>
          <div className={styles.extraDetails}>
            {songs[currentSongIndex].capo && (
              <span className={styles.subHeading}>
                Capo: {songs[currentSongIndex].capo}
              </span>
            )}
            {songs[currentSongIndex].key && (
              <span className={styles.subHeading}>
                Key: {songs[currentSongIndex].key}
              </span>
            )}
            {songs[currentSongIndex].tuning && (
              <span className={styles.subHeading}>
                Tuning: {songs[currentSongIndex].tuning}
              </span>
            )}
          </div>
          <div className={styles.chordList}>
            {uniqueChords.map((c, cIndex) => {
              return (
                <div key={cIndex} className={styles.chordPill}>
                  {c}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.songContainer}>
          {songs[currentSongIndex].lines.map((line, lineIndex) => {
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
                              hiddenMode={settings.hiddenMode}
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
      <BottomBarContainer
        isOpen={ReactPlayer.canPlay(songs[currentSongIndex].link)}
        isSidebarOpen={sidebarOpen}
      >
        {songs[currentSongIndex].link != "" && (
          <MusicPlayer
            song={songs[currentSongIndex]}
            isEditing={false}
            onCurrentTimeChange={(currentTime) => setCurrentTime(currentTime)}
            isPlaying={isPlaying}
            keepPlaying={!endOfPlaylist}
            onEnded={handleSongEnded}
          />
        )}
      </BottomBarContainer>
      {currentTime > 0 && highlightedChord && settings.showChordPopup && (
        //TODO: Bug: Timings not getting reset properly when scrubbing
        <SongHeader>
          {highlightedChord.chord
            .split("/")
            .every((part) => isValidChordPart(part).valid) && (
            <ChordViewer
              chordName={highlightedChord.chord}
              chord={(allChordsJson as ChordObj)[highlightedChord.chord][0]}
              currentTime={currentTime}
              countdown={getTimingTillNextChord()}
              type={songs[currentSongIndex].instrument}
            />
          )}
          {/* TODO: Fix undefined */}
          {!highlightedChord.chord
            .split("/")
            .every((part) => isValidChordPart(part).valid) &&
            songs[currentSongIndex].tabs &&
            songs[currentSongIndex].instrument == "guitar" && (
              <TabViewer
                tab={
                  songs[currentSongIndex].tabs?.find(
                    (tab) => tab.name == highlightedChord.chord
                  ) ?? undefined
                }
                currentTime={currentTime}
                countdown={getTimingTillNextChord()}
              />
            )}
        </SongHeader>
      )}
      {/* TODO: Add controls key for adding timings */}
    </div>
  );
};
