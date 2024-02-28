import { useState } from "react";
import styles from "./songHeader.module.scss";

interface SongHeaderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const SongHeader = (props: SongHeaderProps) => {
  //Rename as header and keep at the top of the page at all times
  //Scroll the chords/tabs as they come as if they are in a list
  //Chords on one line show up as a line
  return <div className={styles.songHeaderContainer}>{props.children}</div>;
};
