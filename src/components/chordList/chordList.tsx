import { useState } from "react";
import styles from "./chordList.module.scss";
import { TextInput } from "../textInput/textInput";

interface ChordListProps {
  onChordPressed: (chord: string) => void;
}

export const ChordList = (props: ChordListProps) => {
  const [chosenChords, setChosenChords] = useState<string[]>([]);
  const [currentSelectedChord, setCurrentSelectedChord] = useState<number>(-1);
  const [searchedChord, setSearchedChord] = useState<string>("");
  //TODO: CHANGE TO USE AN ACTUAL LIST OF CHORDS

  return (
    <div className={styles.chordListContainer}>
      <div className={styles.chordSearch}>
        <TextInput
          label="Chords"
          value={searchedChord}
          onValueChange={(e) => setSearchedChord(e as string)}
          onButtonClick={() => {
            setChosenChords([...chosenChords, searchedChord]);
            setSearchedChord("");
          }}
          buttonText="+"
        />
      </div>
      <div className={styles.selectedChords}>
        {chosenChords.map((chord: string, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                props.onChordPressed(chord);
                setCurrentSelectedChord(index);
              }}
              className={currentSelectedChord == index ? styles.active : ""}
            >
              {chord}
            </button>
          );
        })}
      </div>
    </div>
  );
};
