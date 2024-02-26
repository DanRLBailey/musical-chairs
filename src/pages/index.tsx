import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SongDetail } from "@/components/songDetail/songDetail";
import { SidebarContainer } from "@/components/sidebarContainer/sidebarContainer";
import { TextInput } from "@/components/textInput/textInput";
import { Song } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { title } from "@/constants/document";

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    title("Home");
  }, []);

  useEffect(() => {
    fetch("/api/getSongs")
      .then((res) => res.json())
      .then((json) => {
        setSongs(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <SidebarContainer>
        <>
          <TextInput
            label="Filter"
            value={filter}
            onValueChange={(newVal) => setFilter(newVal as string)}
          />
        </>
      </SidebarContainer>
      <div className={styles.homePageContent}>
        {songs && songs.length > 0 && (
          <div className={styles.songGrid}>
            {songs
              .filter(
                (song) =>
                  song.name.toLowerCase().includes(filter.toLowerCase()) ||
                  song.artist.toLowerCase().includes(filter.toLowerCase())
              )
              .map((song, index) => {
                return (
                  <Link
                    href={`song/${song.slug
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    className={styles.song}
                    key={index}
                  >
                    <SongDetail song={song} />
                  </Link>
                );
              })}
          </div>
        )}
        {(!songs || songs.length == 0 || loading) && (
          <LoadingSpinner multiplier={2} />
        )}
      </div>
    </div>
  );
}
