import { useEffect, useRef, useState } from "react";
import styles from "./musicPlayer.module.scss";
import ReactPlayer from "react-player";
import { Chord, Song } from "../../types/songTypes";
import { getPartsFromSong } from "@/helpers/songHelper";
import { Toggle } from "../toggle/toggle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

interface MusicPlayerProps {
  song: Song;
  addTimingToLatestChord?: (currentTime: number) => void;
  addTimingToLatestWord?: (currentTime: number) => void;
  removeTimingFromLatestWord?: () => void;
  removeTimingFromLatestChord?: () => void;
  allChords?: Chord[];
  onCurrentTimeChange?: (currentTime: number) => void;
  isEditing: boolean;
  onReady?: (maxTime: number) => void;
  keepPlaying?: boolean;
  onEnded?: () => void;
  isPlaying?: boolean;
  showPlayerTicks?: boolean;
}

export const MusicPlayer = (props: MusicPlayerProps) => {
  // TODO: Add physical buttons for adding timings
  const [playing, setPlaying] = useState<boolean>(false);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [addWordToggle, setAddWordToggle] = useState<boolean>(false);
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  const { allChords, allWords } = getPartsFromSong(props.song);

  useEffect(() => {
    if (props.onCurrentTimeChange) props.onCurrentTimeChange(currentTime);
  }, [currentTime]);

  useEffect(() => {
    if (props.onReady) props.onReady(maxTime);
  }, [maxTime]);

  const seekTo = (amount: number) => {
    player.current.seekTo(amount, "seconds");
    setCurrentTime(amount);
  };

  const player = useRef<any>();

  const handleEnterPress = () => {
    if (addWordToggle && props.addTimingToLatestWord)
      props.addTimingToLatestWord(currentTime);
    else if (props.addTimingToLatestChord)
      props.addTimingToLatestChord(currentTime);
  };

  const handleBackspacePress = () => {
    if (addWordToggle && props.removeTimingFromLatestWord)
      props.removeTimingFromLatestWord();
    else if (props.removeTimingFromLatestChord)
      props.removeTimingFromLatestChord();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const modal = document.getElementById("modalContainer");
      const tagName = (e.target as HTMLElement).tagName.toLowerCase();

      // Check if the target element is an input or textarea
      if (tagName === "input" || tagName === "textarea" || modal) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          handleEnterPress();
          break;
        case "Backspace":
          e.preventDefault();
          handleBackspacePress();
          break;
        case " ":
          e.preventDefault();
          setPlaying(!playing);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(currentTime + 5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(currentTime - 5);
          break;
        default:
          break;
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <div className={styles.musicPlayerContainer}>
      <div style={{ display: "none" }}>
        {hasWindow && (
          <ReactPlayer
            ref={player}
            url={props.song.link as string} //TODO: Use local songs if offline
            playing={
              playing && (props.isPlaying || props.isPlaying == undefined)
            }
            onReady={() => {
              setMaxTime(player.current.getDuration());
            }}
            progressInterval={1}
            onProgress={() => setCurrentTime(player.current.getCurrentTime())}
            width="auto"
            height="inherit"
            volume={volume}
            onEnded={() => {
              if (!props.keepPlaying) setPlaying(false);
              if (props.onEnded) props.onEnded();
            }}
          />
        )}
      </div>
      <button onClick={() => setPlaying(!playing)}>
        {!playing ? <PlayArrowIcon /> : <PauseIcon />}
      </button>
      <div className={styles.scrubberContainer}>
        {props.showPlayerTicks && (
          <div className={styles.overlayContainer}>
            {allChords.map((chord, chordIndex) => {
              if (!chord.timing && chord.timing != 0) return;

              return (
                <div
                  key={chordIndex}
                  className={styles.chord}
                  style={{ left: `${(chord.timing / maxTime) * 100}%` }}
                ></div>
              );
            })}
            {allWords.map((word, wordIndex) => {
              if (!word.timing && word.timing != 0) return;

              return (
                <div
                  key={wordIndex}
                  className={styles.word}
                  style={{ left: `${(word.timing / maxTime) * 100}%` }}
                ></div>
              );
            })}
          </div>
        )}
        <input
          type="range"
          min={0}
          max={maxTime}
          value={currentTime}
          step={0.1}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
        />
      </div>
      {props.isEditing && (
        <div className={styles.recordContainer}>
          <Toggle
            toggled={addWordToggle}
            setToggled={(newToggled) => setAddWordToggle(newToggled)}
            leftSideText={<MusicNoteIcon />}
            rightSideText={<MicIcon />}
          />
        </div>
      )}
      <div className={styles.volumeContainer}>
        <VolumeUpIcon />
        <div>
          <input
            type="range"
            min={0}
            max={1}
            value={volume}
            step={0.01}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
