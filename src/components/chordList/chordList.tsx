import { useEffect, useState } from "react";
import styles from "./chordList.module.scss";
import { TextInput } from "../textInput/textInput";
import { isValidChord } from "@/helpers/chords";

interface ChordListProps {
  existingChords?: string[];
  onChordPressed: (chord: string) => void;
  currentSelected: number | null;
}

export const ChordList = (props: ChordListProps) => {
  const [chosenChords, setChosenChords] = useState<string[]>(
    props.existingChords ?? []
  );
  const [currentSelectedChord, setCurrentSelectedChord] = useState<number>(-1);
  const [searchedChord, setSearchedChord] = useState<string>("");
  const [validChord, setValidChord] = useState<boolean>(true);

  useEffect(() => {
    if (!props.currentSelected) return;
    setCurrentSelectedChord(props.currentSelected);
  }, [props.currentSelected]);

  useEffect(() => {
    if (!props.existingChords) return;
    setChosenChords(props.existingChords);
  }, [props.existingChords]);

  const onInputChange = (e: string) => {
    //split the string by "/"
    const chordParts = e.toLowerCase().split("/");
    let validChord = true;

    //loop over the array
    chordParts.forEach((part, partIndex) => {
      const { valid, chordPart, modifierPart, modifier } = isValidChord(part);
      if (validChord) validChord = valid;

      chordParts[partIndex] = chordPart ? chordPart[0] : "";
      if (modifierPart) chordParts[partIndex] += modifierPart;
      else chordParts[partIndex] += modifier;
    });

    setValidChord(validChord);
    setSearchedChord(chordParts.join("/"));
  };

  return (
    <div className={styles.chordListContainer}>
      <div className={styles.chordSearch}>
        <TextInput
          label="Chords"
          value={searchedChord}
          onValueChange={(e) => onInputChange(e as string)}
          onButtonClick={() => {
            setChosenChords([...chosenChords, searchedChord]);
            setSearchedChord("");
          }}
          isError={!validChord && searchedChord != ""}
          buttonText="+"
        />
      </div>
      <div
        className={`${styles.selectedChords} ${
          chosenChords.length > 0 ? styles.hasChords : ""
        }`}
      >
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
