import styles from "./index.module.scss";
import songs from "@/public/song-temp.json"; //TODO: Replace with rds call
import Link from "next/link";
import { useState } from "react";
import { SongDetail } from "@/components/songDetail/songDetail";
import { SidebarContainer } from "@/components/sidebarContainer/sidebarContainer";
import { TextInput } from "@/components/textInput/textInput";

export default function HomePage() {
  const [filter, setFilter] = useState<string>("");

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
        <div>
          {songs
            .filter(
              (song) =>
                song.name.toLowerCase().includes(filter.toLowerCase()) ||
                song.artist.toLowerCase().includes(filter.toLowerCase())
            )
            .map((song, index) => {
              return (
                // <span key={index}>
                //   <SongDetail song={song} />
                // </span>
                <Link
                  href={`song/${song.slug.toLowerCase().replaceAll(" ", "-")}`}
                  className={styles.song}
                  key={index}
                >
                  <SongDetail song={song} />
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
