import styles from "./songPage.module.scss";
// import { useLocation } from "react-router-dom";
import { SongComponent } from "../../components/songComponent/songComponent";
import songs from "@/public/song-temp.json"; //TODO: Replace with rds call
import { useState } from "react";
import { songTemplate } from "../../types/songTypes";

export const SongPage = () => {
  // const location = useLocation();
  // const page = location.pathname.split("/")[1];
  // const slug = location.pathname.split("/")[2];
  // console.log(location);

  // const [isEditing, setIsEditing] = useState<boolean>(
  //   page.includes("edit") || page.includes("new")
  // );

  const [isEditing, setIsEditing] = useState<boolean>(true);

  return (
    <div className={styles.songPageContainer}>
      {/* <SongComponent
        existingSong={
          !page.includes("new")
            ? songs.find((song) => song.slug == slug)
            : songTemplate
        }
        editing={isEditing}
        setIsEditing={(isEditing) => setIsEditing(isEditing)}
      /> */}
      <SongComponent
        existingSong={songs[0]}
        editing={isEditing}
        setIsEditing={(isEditing) => setIsEditing(isEditing)}
      />
    </div>
  );
};
