import { useState } from "react";
import styles from "./chordList.module.scss";
import { TextInput } from "../textInput/textInput";
import { chordsList, modifiersList } from "@/constants/chords";

interface ChordListProps {
  onChordPressed: (chord: string) => void;
}

export const ChordList = (props: ChordListProps) => {
  const [chosenChords, setChosenChords] = useState<string[]>([]);
  const [currentSelectedChord, setCurrentSelectedChord] = useState<number>(-1);
  const [searchedChord, setSearchedChord] = useState<string>("");
  const [validChord, setValidChord] = useState<boolean>(true);

  const onInputChange = (e: string) => {
    //split the string by "/"
    const chordParts = e.toLowerCase().split("/");
    let validChord = true;

    //loop over the array
    chordParts.forEach((part, partIndex) => {
      let chordPart: string[] | undefined;
      chordPart =
        chordsList.find((chordArr) =>
          chordArr.find((c) => part.toLowerCase() === c.toLowerCase())
        ) ??
        chordsList.find((chordArr) =>
          chordArr.find(
            (c) => part.slice(0, 2).toLowerCase() === c.toLowerCase()
          )
        ) ??
        chordsList.find((chordArr) =>
          chordArr.find(
            (c) => part.slice(0, 1).toLowerCase() === c.toLowerCase()
          )
        );

      const modifier = chordPart
        ? chordPart.length == 1
          ? part.slice(1, 20)
          : part.slice(2, 20)
        : "";

      const modifierPart = modifiersList.find(
        (mod) =>
          modifier.toLowerCase() == mod.toLowerCase() ??
          modifier.toLowerCase().startsWith(mod.toLowerCase())
      );

      const validChordPart =
        chordPart !== undefined && chordPart != null && chordPart.length > 0;
      const validModiferPart =
        modifier == ""
          ? true
          : modifierPart !== undefined && modifierPart != null;

      if (validChord) validChord = validChordPart && validModiferPart;

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
