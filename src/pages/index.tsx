import styles from "./index.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SongDetail, getDifficulty } from "@/components/songDetail/songDetail";
import { SidebarContainer } from "@/components/sidebarContainer/sidebarContainer";
import { TextInput } from "@/components/textInput/textInput";
import { Song } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { title } from "@/constants/document";
import { DropdownContainer } from "@/components/dropdownContainer/dropdownContainer";
import { MultiHandleRangeSlider } from "@/components/multiHandleRangeSlider/multiHandleRangeSlider";
import { formatSeconds } from "@/components/chordPill/chordPill";

interface Filter {
  search: string;
  instrument: string;
  key: string;
  capo: string;
  tuning: string;
  duration: number[];
  difficulty: number[];
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
    duration: [0, 1000],
    difficulty: [0, 1000],
  });
  const [sorting, setSorting] = useState<string>();

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

  const getFilteredSongs = (song: Song) => {
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

    const isWithinDuration =
      song.duration >= filter.duration[0] &&
      song.duration <= filter.duration[1];

    const isWithinDifficulty =
      song.difficulty >= filter.difficulty[0] &&
      song.difficulty <= filter.difficulty[1];

    return (
      isWithinSearch &&
      isWithInstrument &&
      isWithKey &&
      isWithCapo &&
      isWithTuning &&
      isWithinDuration &&
      isWithinDifficulty
    );
  };

  const getSortedSongs = (songsList: Song[]) => {
    //Ascending
    //For descending, reverse the "<"
    switch (sorting) {
      case "Artist":
        return songsList.sort((a, b) => (a.artist < b.artist ? -1 : 0));
      case "Duration":
        return songsList.sort((a, b) => (a.duration < b.duration ? -1 : 0));
      case "Difficulty":
        return songsList.sort((a, b) => (a.difficulty < b.difficulty ? -1 : 0));
      case "Song Name":
      default:
        return songsList.sort((a, b) => (a.name < b.name ? -1 : 0));
    }

    return songsList;
  };

  useEffect(() => {
    // console.log(filter.duration);
  }, [filter]);

  return (
    <div className={styles.homePageContainer}>
      <SidebarContainer>
        <Link href={"/new"} className="button">
          Add New Song
        </Link>
        <DropdownContainer
          values={["Song Name", "Artist", "Duration", "Difficulty"]}
          onValueChange={(newVal: string) => {
            setSorting(newVal);
          }}
          label="Sort"
          placeholder="Select a Sorting"
        />
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
        {songs && songs.length > 0 && (
          <MultiHandleRangeSlider
            min={songs.reduce((minDuration, song) => {
              return Math.min(minDuration, song.duration);
            }, Infinity)}
            max={songs.reduce((maxDuration, song) => {
              return Math.max(maxDuration, song.duration);
            }, 0)}
            onValuesChange={(min, max) => {
              setFilter({ ...filter, duration: [min, max] } as Filter);
            }}
            label="Duration"
            format={(val: number) => formatSeconds(val, false)}
          />
        )}
        {songs && songs.length > 0 && (
          <MultiHandleRangeSlider
            min={0}
            max={songs.reduce((maxDifficulty, song) => {
              return Math.max(maxDifficulty, song.difficulty);
            }, 0)}
            onValuesChange={(min, max) => {
              setFilter({ ...filter, difficulty: [min, max] } as Filter);
            }}
            label="Difficulty"
            format={(val: number) => getDifficulty(val)}
          />
        )}
      </SidebarContainer>
      <div className={styles.homePageContent}>
        {songs &&
          songs.length > 0 &&
          Array.from(new Set(songs.map((song) => song.instrument))).map(
            (instrument, instrumentIndex) => {
              const filteredSongs = songs
                .filter((song) => song.instrument == instrument)
                .filter((song) => getFilteredSongs(song));

              if (filteredSongs.length > 0)
                return (
                  <div
                    className={styles.instrumentSection}
                    key={instrumentIndex}
                  >
                    <span className={styles.songHeader}>{instrument}</span>
                    <div className={styles.songGrid}>
                      {getSortedSongs(filteredSongs).map((song, index) => {
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
