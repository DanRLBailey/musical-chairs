import { useContext, useEffect, useState } from "react";
import styles from "./songComponent.module.scss";
import {
  Chord,
  ChordObj,
  Line,
  Song,
  Tab,
  Word,
  songTemplate,
} from "../../types/songTypes";
import {
  getIndecesOfLatestBlankChord,
  getIndecesOfLatestBlankWord,
  getIndecesOfLatestChord,
  getIndecesOfLatestWord,
  getPartsFromSong,
} from "@/helpers/songHelper";
import { ChordList } from "../chordList/chordList";
import { SidebarContainer } from "../sidebarContainer/sidebarContainer";
import { TextInput } from "../textInput/textInput";
import ReactPlayer from "react-player";
import { BottomBarContainer } from "../bottomBarContainer/bottomBarContainer";
import { MusicPlayer } from "../musicPlayer/musicPlayer";
import { useRouter } from "next/router";
import { TabList } from "../tabList/tabList";
import { isValidChordPart } from "@/helpers/chords";
import { title } from "@/constants/document";
import { SongHeader } from "../songHeader/songHeader";
import { TabViewer } from "../tabViewer/tabViewer";
import { ChordViewer } from "../chordViewer/chordViewer";
import allChordsJson from "@/public/chords.json";
import Link from "next/link";
import { NetworkContext } from "@/context/networkContext/networkContext";
import { UserContext } from "@/context/userContext/userContext";
import { DropdownContainer } from "../dropdownContainer/dropdownContainer";
import { Toggle } from "../toggle/toggle";
import { ToastContext } from "@/context/toastContext/toastContext";
import { SongLine } from "../songLine/songLine";

interface SongComponentProps {
  existingSong?: Song;
  editing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}

export interface Setting {
  [key: string]: {
    toggled: boolean;
    allowInMobile: boolean;
  };
}

export const getSettingsFromLocal = () => {
  const defaultSettings: Setting = {
    autoscroll: {
      toggled: true,
      allowInMobile: true,
    },
    hiddenMode: {
      toggled: false,
      allowInMobile: true,
    },
    showChordPopup: {
      toggled: true,
      allowInMobile: false,
    },
    showPopupTiming: {
      toggled: true,
      allowInMobile: true,
    },
    highlightChords: {
      toggled: true,
      allowInMobile: true,
    },
    highlightLyrics: {
      toggled: true,
      allowInMobile: true,
    },
    // showCountdown: true,
    // showChords: true,
    showPlayerTicks: {
      toggled: true,
      allowInMobile: true,
    },
    showTabsInline: {
      toggled: false,
      allowInMobile: false,
    },
  };

  if (typeof window === "undefined") return defaultSettings;
  const localSettings = localStorage.getItem("songSettings");

  if (!localSettings) {
    localStorage.setItem("songSettings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...JSON.parse(localSettings),
  };
};

export const SongComponent = (props: SongComponentProps) => {
  const [song, setSong] = useState<Song>(props.existingSong ?? songTemplate);
  const [textAreaVal, setTextAreaVal] = useState<string>("");
  const [currentChord, setCurrentChord] = useState<string>();
  const [validChord, setValidChord] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(-1);
  const [allWordsFiltered, setAllWordsFiltered] = useState<Word[]>([]);
  const [allChords, setAllChords] = useState<Chord[]>([]);
  const [uniqueChords, setUniqueChords] = useState<string[]>([]);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(-1);
  const [highlightedChord, setHighlightedChord] = useState<Chord>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>();
  const [settings, setSettings] = useState<Setting>(getSettingsFromLocal());

  const { isOnline } = useContext(NetworkContext);
  const { user } = useContext(UserContext);
  const { showToast } = useContext(ToastContext);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 568 : false;

  useEffect(() => {
    if (!currentChord) return;

    setValidChord(isValidChordPart(currentChord).valid);
  }, [currentChord]);

  const router = useRouter();

  useEffect(() => {
    if (!props.existingSong) title("New Song");
    else if (props.editing) title(`${song.name} - ${song.artist} | Edit`);
    else title(`${song.name} - ${song.artist}`);
  }, []);

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

      setHighlightedChord(allChords[index]);

      const el = document.getElementById(`chordPill-${index}`);

      if (settings.autoscroll.toggled && el) {
        const scroll = document.getElementById("scrollContainer");

        const y = el.offsetTop;
        const offset = -100;

        if (scroll)
          scroll.scrollTo({
            top: y + offset,
            behavior: "smooth",
          });
      }
    }
  }, [currentTime]);

  useEffect(() => {
    localStorage.setItem("songSettings", JSON.stringify(settings));
  }, [settings]);

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
    //TODO: fix line removal
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

  const handleSaveButtonClick = () => {
    const postNewSong = () => {
      const randomNum = Math.floor(Math.random() * 90000) + 10000;

      song.slug = `${song.name.toLowerCase().split(" ").join("-")}-${song.artist
        .toLowerCase()
        .split(" ")
        .join("-")}-${randomNum}`;

      fetch("/api/postSong", {
        method: "POST",
        body: JSON.stringify(song),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json["error"]) throw new Error(json["error"]);
          showToast(`Added song: ${song.name} - ${song.artist}`, "success");
          router.push(`/song/${song.slug}`);
        })
        .catch((err) => {
          console.error(err);
          showToast("Error creating song", "error");
        });
    };

    const updateExistingSong = () => {
      fetch("/api/updateSong", {
        method: "POST",
        body: JSON.stringify(song),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json["error"]) throw new Error(json["error"]);
          showToast(`Updated song: ${song.name} - ${song.artist}`, "success");
          router.push(`/song/${song.slug}`);
        })
        .catch((err) => {
          showToast("Error saving song", "error");
        });
    };

    const { pathname } = router;

    pathname.includes("edit") ? updateExistingSong() : postNewSong();
  };

  const onTabChange = (tabs: Tab[]) => {
    setSong({ ...song, tabs: tabs });
  };

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

  const verifyString = (str: string, matcher: RegExp = /["\\]/) => {
    const match = str.match(matcher);

    if (!match) return false;

    return match.length > 0;
  };

  return (
    <div className={styles.songComponentContainer}>
      <SidebarContainer
        onSidebarToggle={(isOpen: boolean) => setSidebarOpen(isOpen)}
      >
        {props.editing && (
          <div className={styles.songSidebar}>
            <div className={styles.list}>
              {/* TODO: Add validation */}
              <TextInput
                label="Song Name"
                value={song.name}
                onValueChange={(newVal) =>
                  setSong({ ...song, name: newVal as string })
                }
                placeholder="Name"
                required
              />
              <TextInput
                label="Artist"
                value={song.artist}
                onValueChange={(newVal) =>
                  setSong({ ...song, artist: newVal as string })
                }
                placeholder="Artist"
                required
              />
            </div>
            <div className={styles.list}>
              <TextInput
                label="Link"
                value={song.link}
                onValueChange={(newVal) =>
                  setSong({ ...song, link: newVal as string })
                }
                placeholder="youtube.com/..."
                required
              />
              <TextInput
                label="Difficulty"
                value={song.difficulty}
                onValueChange={(newVal) =>
                  setSong({ ...song, difficulty: newVal as number })
                }
                placeholder="0"
                required
              />
            </div>
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
            <DropdownContainer
              values={["Guitar", "Fingerstyle guitar", "Keyboard", "Bass"]}
              onValueChange={(newVal) =>
                setSong({ ...song, instrument: newVal.toLowerCase() })
              }
              label="Instrument"
              placeholder="Guitar"
            />
            <TextInput
              label="Lyrics"
              value={textAreaVal}
              onValueChange={(newVal) => handleTextAreaChange(newVal as string)}
              type="textArea"
              required
              isError={verifyString(textAreaVal)}
              errorMessage={
                verifyString(textAreaVal)
                  ? 'Please remove any " or \\'
                  : undefined
              }
            />
            <ChordList
              existingChords={uniqueChords}
              onChordPressed={(chord) => setCurrentChord(chord)}
              currentSelected={validChord ? null : -1}
            />
            {(song.instrument.includes("guitar") ||
              song.instrument.includes("bass") ||
              song.instrument == "") && (
              <TabList
                existingTabs={song.tabs ?? []}
                onTabPressed={(tab) => setCurrentChord(tab)}
                currentSelected={validChord ? -1 : null}
                onTabsChange={onTabChange}
              />
            )}
            <div className={styles.list}>
              <DropdownContainer
                values={["draft", "published"]}
                onValueChange={(newVal) =>
                  setSong({ ...song, status: newVal.toLowerCase() })
                }
                label="Status"
                placeholder="draft"
              />
              <DropdownContainer
                values={["public", "private"]}
                onValueChange={(newVal) =>
                  setSong({ ...song, access: newVal.toLowerCase() })
                }
                label="Access"
                placeholder="public"
              />
            </div>
            <button onClick={handleSaveButtonClick}>Save</button>
            {/* <button onClick={convertOldSong}>Convert</button> */}
          </div>
        )}
        {!props.editing && (
          <div className={styles.songSidebar}>
            {isOnline && user.isLoggedIn && !isMobile && (
              <Link href={`/edit/${song.slug}`} className="button">
                Edit
              </Link>
            )}
            <div className={styles.settingsContainer}>
              <span className={styles.header}>Settings</span>
              <div className={styles.settings}>
                {Object.keys(settings).map((setting, index) => {
                  return (
                    <Toggle
                      key={index}
                      toggled={settings[setting].toggled}
                      setToggled={(toggled) =>
                        setSettings({
                          ...settings,
                          [setting]: {
                            toggled: toggled,
                            allowInMobile: settings[setting].allowInMobile,
                          },
                        })
                      }
                      title={setting}
                      type="button"
                      disabled={!settings[setting].allowInMobile && isMobile}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SidebarContainer>
      <div className={styles.songContent} id="scrollContainer">
        <div className={styles.songDetails}>
          <span className={styles.heading}>{song.name}</span>
          <span className={styles.subHeading}>{song.artist}</span>
          {!props.editing && (
            <div className={styles.extraDetails}>
              {song.capo > 0 && (
                <span className={styles.subHeading}>Capo: {song.capo}</span>
              )}
              {song.key && (
                <span className={styles.subHeading}>Key: {song.key}</span>
              )}
              {song.tuning && (
                <span className={styles.subHeading}>Tuning: {song.tuning}</span>
              )}
            </div>
          )}
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
          {song.lines.map((line, lineIndex) => {
            return (
              <SongLine
                song={song}
                line={line}
                lineIndex={lineIndex}
                allChords={allChords}
                allWordsFiltered={allWordsFiltered}
                currentTime={currentTime}
                settings={settings}
                editing={props.editing}
                isMobile={isMobile}
                removeChordFromSongWord={(
                  lineIndex: number,
                  wordIndex: number,
                  chordIndex: number
                ) => removeChordFromSongWord(lineIndex, wordIndex, chordIndex)}
                addChordToSongWord={(lineIndex: number, wordIndex: number) =>
                  addChordToSongWord(lineIndex, wordIndex)
                }
              />
            );
          })}
        </div>
      </div>
      <BottomBarContainer
        isOpen={ReactPlayer.canPlay(song.link)}
        isSidebarOpen={sidebarOpen}
      >
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
            onReady={(maxTime) =>
              setSong({ ...song, duration: maxTime as number })
            }
            showPlayerTicks={settings.showPlayerTicks.toggled}
          />
        )}
      </BottomBarContainer>
      {!props.editing &&
        currentTime > 0 &&
        highlightedChord &&
        (settings.showChordPopup.toggled || isMobile) &&
        (highlightedChord.chord
          .split("/")
          .every((part) => isValidChordPart(part).valid) ||
          (!highlightedChord.chord
            .split("/")
            .every((part) => isValidChordPart(part).valid) &&
            song.tabs &&
            song.instrument.includes("guitar") &&
            (!settings.showTabsInline.toggled || isMobile))) && (
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
                type={song.instrument}
                showTiming={settings.showPopupTiming.toggled}
              />
            )}
            {!highlightedChord.chord
              .split("/")
              .every((part) => isValidChordPart(part).valid) &&
              song.tabs &&
              song.instrument.includes("guitar") &&
              (!settings.showTabsInline.toggled || isMobile) && (
                <TabViewer
                  tab={
                    song.tabs.find(
                      (tab) => tab.name == highlightedChord.chord
                    ) ?? song.tabs[0]
                  }
                  currentTime={currentTime}
                  countdown={getTimingTillNextChord()}
                  showTiming={settings.showPopupTiming.toggled}
                />
              )}
          </SongHeader>
        )}
      {/* TODO: Add controls key for adding timings */}
    </div>
  );
};
function showToast(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
