import styles from "./songPage.module.scss";
import { useRouter } from "next/router";
// import { useLocation } from "react-router-dom";
import { SongComponent } from "@/components/songComponent/songComponent";
import songs from "@/public/song-temp.json"; //TODO: Replace with rds call
import { useState } from "react";
import { songTemplate } from "@/types/songTypes";

export default () => {
  // const location = useLocation();
  // const page = location.pathname.split("/")[1];
  // const slug = location.pathname.split("/")[2];
  // console.log(location);

  // const [isEditing, setIsEditing] = useState<boolean>(
  //   page.includes("edit") || page.includes("new")
  // );
  const router = useRouter();
  const { pathname } = router;
  const { slug } = router.query;

  const [isEditing, setIsEditing] = useState<boolean>(
    pathname.includes("edit") || pathname.includes("new")
  );

  if (!slug || !pathname) return;

  return (
    <div className={styles.songPageContainer}>
      <SongComponent
        existingSong={
          !pathname.includes("new")
            ? songs.find((song) => song.slug == slug)
            : songTemplate
        }
        editing={isEditing}
        setIsEditing={(isEditing) => setIsEditing(isEditing)}
      />
      {/* <SongComponent
        existingSong={songs.find((song) => song.slug == slug)}
        editing={isEditing}
        setIsEditing={(isEditing) => setIsEditing(isEditing)}
      /> */}
    </div>
  );
};
