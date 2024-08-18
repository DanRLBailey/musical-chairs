import { Chord, Line, Song, Word } from "@/types/songTypes";
import { isValidChordPart } from "./chords";

interface PartsFromSong {
  (song: Song): { allLines: Line[]; allWords: Word[]; allChords: Chord[] };
  (song: Song, lineIndex: number): {
    allLines: Line[];
    allWords: Word[];
    allChords: Chord[];
    line: Line;
  };
  (song: Song, lineIndex: number, wordIndex: number): {
    allLines: Line[];
    allWords: Word[];
    allChords: Chord[];
    line: Line;
    word: Word;
  };
  (song: Song, lineIndex: number, wordIndex: number, chordIndex: number): {
    allLines: Line[];
    allWords: Word[];
    allChords: Chord[];
    line: Line;
    word: Word;
    chord: Chord;
  };
}

export const getPartsFromSong: PartsFromSong = (
  song: Song,
  lineIndex: number = 0,
  wordIndex: number = 0,
  chordIndex: number = 0
) => {
  const allLines = [...song.lines];
  if (allLines.length <= 0)
    return {
      allLines: [] as Line[],
      allWords: [] as Word[],
      allChords: [] as Chord[],
      line: {} as Line,
      word: {} as Word,
      chord: {} as Chord,
    };

  const allWords = allLines.flatMap((line) => line.words);
  const allChords = allWords.flatMap((word) => word.chords);

  const selectedLine = { ...allLines[lineIndex] };
  const selectedWord = { ...selectedLine.words[wordIndex] };
  const selectedChord = { ...selectedWord.chords[chordIndex] };

  return {
    allLines,
    allWords,
    allChords,
    line: selectedLine,
    word: selectedWord,
    chord: selectedChord,
  };
};

export const getIndecesOfLatestBlankChord = (song: Song) => {
  const { allLines, allChords } = getPartsFromSong(song);
  let lineIndex = 0;
  let wordIndex = 0;
  let chordIndex = 0;

  const latestChord = allChords.find((chord) => chord.timing == null);

  allLines.forEach((line, lIndex) => {
    line.words.forEach((word, wIndex) => {
      word.chords.forEach((chord, cIndex) => {
        if (chord == latestChord) {
          lineIndex = lIndex;
          wordIndex = wIndex;
          chordIndex = cIndex;
        }
      });
    });
  });

  return { latestChord, lineIndex, wordIndex, chordIndex };
};

export const getIndecesOfLatestChord = (song: Song) => {
  const { allLines, allChords } = getPartsFromSong(song);
  let lineIndex = 0;
  let wordIndex = 0;
  let chordIndex = 0;

  const latestChord = allChords.reverse().find((chord) => chord.timing != null);

  allLines.forEach((line, lIndex) => {
    line.words.forEach((word, wIndex) => {
      word.chords.forEach((chord, cIndex) => {
        if (chord == latestChord) {
          lineIndex = lIndex;
          wordIndex = wIndex;
          chordIndex = cIndex;
        }
      });
    });
  });

  return { latestChord, lineIndex, wordIndex, chordIndex };
};

export const getIndecesOfLatestBlankWord = (song: Song) => {
  const { allLines, allWords } = getPartsFromSong(song);
  let lineIndex = 0;
  let wordIndex = 0;

  const latestWord = allWords.find(
    (word) =>
      word.timing == null &&
      !word.lyric.includes("[") &&
      !word.lyric.includes("]") &&
      word.lyric != ""
  );

  allLines.forEach((line, lIndex) => {
    line.words.forEach((word, wIndex) => {
      if (word == latestWord) {
        lineIndex = lIndex;
        wordIndex = wIndex;
      }
    });
  });

  return { latestWord, lineIndex, wordIndex };
};

export const getIndecesOfLatestWord = (song: Song) => {
  const { allLines, allWords } = getPartsFromSong(song);
  let lineIndex = 0;
  let wordIndex = 0;

  const latestWord = allWords.reverse().find((word) => word.timing != null);

  allLines.forEach((line, lIndex) => {
    line.words.forEach((word, wIndex) => {
      if (word == latestWord) {
        lineIndex = lIndex;
        wordIndex = wIndex;
      }
    });
  });

  return { latestWord, lineIndex, wordIndex };
};

export const getTabsInLine = (line: Line) => {
  return [...line.words].flatMap((word) =>
    [...word.chords].filter(
      (chord) =>
        !chord.chord.split("/").every((part) => isValidChordPart(part).valid)
    )
  );
};

export const getNoOfChordsBeforeCurrentLine = (
  song: Song,
  line: Line,
  lineIndex: number
) => {
  const { allLines } = getPartsFromSong(song, lineIndex);
  const lines = allLines.filter((line, index) => index < lineIndex);

  const chords = lines.flatMap((line) =>
    line.words.flatMap((word) => word.chords)
  );

  return chords.length;
};
