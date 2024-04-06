import styles from "@/styles/playlistPage.module.scss";
import { useRouter } from "next/router";
import { SongComponent } from "@/components/songComponent/songComponent";
import { useContext, useEffect, useState } from "react";
import { Song, songTemplate } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { NetworkContext } from "@/context/networkContext/networkContext";
import offlineSongs from "@/public/songs-offline.json";
import { MultiSongComponent } from "@/components/multiSongComponent/multiSongComponent";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/context/userContext/userContext";

export default () => {
  const router = useRouter();
  const { pathname } = router;
  const { isOnline } = useContext(NetworkContext);
  const { user } = useContext(UserContext);

  const searchParams = useSearchParams();

  const [songs, setSongs] = useState<Song[]>();
  const [loading, setLoading] = useState<boolean>(true);

  // const getSongsFromFile = () => {
  //   if (!slug) return;

  //   const song = offlineSongs.find((song) => song.slug == slug);

  //   if (!song) return;

  //   setSongs([song as Song]);
  //   setLoading(false);
  // };

  // const getSongsFromDb = () => {
  //   fetch("/api/getSong", {
  //     method: "POST",
  //     body: JSON.stringify({ slug: slug }),
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       if (json && json.length > 0) {
  //         setSongs(json[0]);
  //         setLoading(false);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   if (!isOnline) {
  //     getSongFromFile();
  //     return;
  //   }
  //   getSongFromDb();
  // }, [isOnline]);

  useEffect(() => {
    if (!searchParams || searchParams === undefined) return;

    const params: string[] = [];

    searchParams.forEach((val) => {
      params.push(`'${val}'`);
    });

    if (params.length <= 0) return;

    fetch("/api/getMultipleSongs", {
      method: "POST",
      body: JSON.stringify({ userId: user.userId, slugs: params }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length > 0) {
          const songList: Song[] = [];
          params.forEach((slug: string, index: number) => {
            const jsonSong = json.find((song: Song) =>
              slug.includes(song.slug)
            );

            if (jsonSong) songList.push(jsonSong);
          });

          setSongs(songList);
          setLoading(false);
        }
      });
  }, [searchParams]);

  if (!pathname) return;

  return (
    <div className={styles.songPageContainer}>
      {(loading || !songs) && <LoadingSpinner multiplier={2} />}
      {!loading && songs && <MultiSongComponent songs={songs} />}
    </div>
  );
};
