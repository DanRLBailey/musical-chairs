export interface Song {
  name: string;
  artist: string;
  slug: string;
  lines: Line[];
  tabs?: Tab[];
  link: string;
  capo: number;
  key: string;
  tuning: string;
  duration: number;
  difficulty: number;
  instrument: string;
  status: "draft" | "published";
  access: "public" | "private";
  saved?: boolean;
}

export interface Line {
  words: Word[];
}

export interface Word {
  chords: Chord[];
  lyric: string;
  timing?: number;
}

export interface Chord {
  timing?: number;
  chord: string;
}

export interface Tab {
  name: string;
  cols: TabColumn[];
}

export interface TabColumn {
  [key: string]: string | number | undefined;
}

export interface ChordObj {
  [key: string]: ChordPartObj[];
}

export interface ChordPartObj {
  positions: string[];
  fingerings: string[][];
}

export const songTemplate: Song = {
  name: "",
  artist: "",
  slug: "new-slug",
  lines: [],
  link: "",
  capo: 0,
  key: "",
  tuning: "",
  duration: 0,
  difficulty: 0,
  instrument: "guitar",
  status: "published",
  access: "public",
};
