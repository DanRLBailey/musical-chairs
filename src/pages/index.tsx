import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SongDetail } from "@/components/songDetail/songDetail";
import { SidebarContainer } from "@/components/sidebarContainer/sidebarContainer";
import { TextInput } from "@/components/textInput/textInput";
import { Song } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { title } from "@/constants/document";
import { DropdownContainer } from "@/components/dropdownContainer/dropdownContainer";

interface Filter {
  search: string;
  instrument: string;
  key: string;
  capo: string;
  tuning: string;
}

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter>({
    search: "",
    instrument: "",
    key: "",
    capo: "",
    tuning: "",
  });

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

  const getIsFiltered = (song: Song) => {
    if (!filter) return true;

    const isWithinSearch =
      song.name
        .toLowerCase()
        .includes(filter?.search.toString().toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(filter?.search.toString().toLowerCase());

    const isWithInstrument =
      filter.instrument != "" ? filter.instrument == song.instrument : true;

    const isWithKey = filter.key != "" ? filter.key == song.key : true;

    const isWithCapo =
      filter.capo != "" ? filter.capo == song.capo.toString() : true;

    const isWithTuning =
      filter.tuning != "" ? filter.tuning == song.tuning : true;

    return (
      isWithinSearch &&
      isWithInstrument &&
      isWithKey &&
      isWithCapo &&
      isWithTuning
    );
  };

  return (
    <div className={styles.homePageContainer}>
      <SidebarContainer>
        <Link href={"/new"} className="button">
          Add New Song
        </Link>
        <TextInput
          label="Search"
          value={filter?.search as string}
          onValueChange={(newVal: string | number) =>
            setFilter({ ...filter, search: newVal as string } as Filter)
          }
        />
        <DropdownContainer
          values={
            songs && songs.length > 0
              ? Array.from(new Set(songs.map((song) => song.instrument)))
              : []
          }
          onValueChange={(newVal: string) => {
            setFilter({ ...filter, instrument: newVal as string } as Filter);
          }}
          label="Instrument"
          placeholder="Select an Instrument"
        />
        <DropdownContainer
          values={
            songs && songs.length > 0
              ? Array.from(new Set(songs.map((song) => song.key))).sort()
              : []
          }
          onValueChange={(newVal: string) =>
            setFilter({ ...filter, key: newVal as string } as Filter)
          }
          label="Key"
          placeholder="Select a Key"
        />
        <DropdownContainer
          values={
            songs && songs.length > 0
              ? Array.from(
                  new Set(songs.map((song) => song.capo.toString()))
                ).sort()
              : []
          }
          onValueChange={(newVal: string) =>
            setFilter({ ...filter, capo: newVal as string } as Filter)
          }
          label="Capo"
          placeholder="Select a Capo"
        />
        <DropdownContainer
          values={
            songs && songs.length > 0
              ? Array.from(new Set(songs.map((song) => song.tuning))).sort()
              : []
          }
          onValueChange={(newVal: string) =>
            setFilter({ ...filter, tuning: newVal as string } as Filter)
          }
          label="Tuning"
          placeholder="Select a Tuning"
        />
        {/* TODO: Length Slider (min/max) */}
        {/* TODO: Difficulty Slider (min/max) */}
      </SidebarContainer>
      <div className={styles.homePageContent}>
        {songs &&
          songs.length > 0 &&
          Array.from(new Set(songs.map((song) => song.instrument))).map(
            (instrument, instrumentIndex) => {
              const filteredSongs = songs
                .filter((song) => song.instrument == instrument)
                .filter((song) => getIsFiltered(song));

              if (filteredSongs.length > 0)
                return (
                  <div
                    className={styles.instrumentSection}
                    key={instrumentIndex}
                  >
                    <span className={styles.songHeader}>{instrument}</span>
                    <div className={styles.songGrid}>
                      {filteredSongs.map((song, index) => {
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
                  </div>
                );
            }
          )}
        {(!songs || songs.length == 0 || loading) && (
          <LoadingSpinner multiplier={2} />
        )}
      </div>
    </div>
  );
}
