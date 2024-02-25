import { chordsList, modifiersList } from "@/constants/chords";

export const isValidChord = (chord: string) => {
  let chordPart: string[] | undefined;
  chordPart =
    chordsList.find((chordArr) =>
      chordArr.find((c) => chord.toLowerCase() === c.toLowerCase())
    ) ??
    chordsList.find((chordArr) =>
      chordArr.find((c) => chord.slice(0, 2).toLowerCase() === c.toLowerCase())
    ) ??
    chordsList.find((chordArr) =>
      chordArr.find((c) => chord.slice(0, 1).toLowerCase() === c.toLowerCase())
    );

  const modifier = chordPart
    ? chordPart.length == 1
      ? chord.slice(1, 20)
      : chord.slice(2, 20)
    : "";

  const modifierPart = modifiersList.find(
    (mod) =>
      modifier.toLowerCase() == mod.toLowerCase() ??
      modifier.toLowerCase().startsWith(mod.toLowerCase())
  );

  const validChordPart =
    chordPart !== undefined && chordPart != null && chordPart.length > 0;
  const validModiferPart =
    modifier == "" ? true : modifierPart !== undefined && modifierPart != null;

  return {
    valid: validChordPart && validModiferPart,
    chordPart: chordPart,
    modifier: modifier,
    modifierPart: modifierPart,
  };
};
