import styles from "@/styles/songPage.module.scss";
import { useRouter } from "next/router";
import { SongComponent } from "@/components/songComponent/songComponent";
import { useContext, useEffect, useState } from "react";
import { Song, songTemplate } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { NetworkContext } from "@/context/networkContext";

export default () => {
  const router = useRouter();
  const { pathname } = router;
  const { slug } = router.query;
  const { isOnline } = useContext(NetworkContext);

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [song, setSong] = useState<Song>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOnline) return;

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
