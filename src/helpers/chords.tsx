import { chordsList, modifiersList } from "@/constants/chords";

export const isValidChordPart = (part: string) => {
  let chordPart: string[] | undefined;
  chordPart =
    chordsList.find((chordArr) =>
      chordArr.find((c) => part.toLowerCase() === c.toLowerCase())
    ) ??
    chordsList.find((chordArr) =>
      chordArr.find((c) => part.slice(0, 2).toLowerCase() === c.toLowerCase())
    ) ??
    chordsList.find((chordArr) =>
      chordArr.find((c) => part.slice(0, 1).toLowerCase() === c.toLowerCase())
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
    modifier == "" ? true : modifierPart !== undefined && modifierPart != null;

  return {
    valid: validChordPart && validModiferPart,
    chordPart: chordPart,
    modifier: modifier,
    modifierPart: modifierPart,
  };
};
