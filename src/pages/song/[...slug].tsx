import styles from "@/styles/songPage.module.scss";
import { useRouter } from "next/router";
import { SongComponent } from "@/components/songComponent/songComponent";
import { useContext, useEffect, useState } from "react";
import { Song, songTemplate } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { NetworkContext } from "@/context/networkContext";
import offlineSongs from "@/public/songs-offline.json";

export default () => {
  const router = useRouter();
  const { pathname } = router;
  const { slug } = router.query;
  const { isOnline } = useContext(NetworkContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [song, setSong] = useState<Song>();
  const [loading, setLoading] = useState<boolean>(true);

  const getSongFromFile = () => {
    if (!slug) return;

    const song = offlineSongs.find((song) => song.slug == slug);

    if (!song) return;

    setSong(song as Song);
    setLoading(false);
  };

  const getSongFromDb = () => {
    fetch("/api/getSong", {
      method: "POST",
      body: JSON.stringify({ slug: slug }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length > 0) {
          setSong(json[0]);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (isOnline === undefined) return;

    if (!isOnline) {
      getSongFromFile();
      return;
    }

    getSongFromDb();
  }, [isOnline, slug]);

  if (!slug || !pathname) return;

  return (
    <div className={styles.songPageContainer}>
      {(loading || !song) && <LoadingSpinner multiplier={2} />}
      {!loading && song && (
        <SongComponent
          existingSong={song}
          editing={isEditing}
          setIsEditing={(isEditing) => setIsEditing(isEditing)}
        />
      )}
    </div>
  );
};
