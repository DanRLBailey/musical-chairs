import styles from "./index.module.scss";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { SongDetail, getDifficulty } from "@/components/songDetail/songDetail";
import { SidebarContainer } from "@/components/sidebarContainer/sidebarContainer";
import { TextInput } from "@/components/textInput/textInput";
import { Song } from "@/types/songTypes";
import { LoadingSpinner } from "@/components/loadingSpinner/loadingSpinner";
import { title } from "@/constants/document";
import { DropdownContainer } from "@/components/dropdownContainer/dropdownContainer";
import { MultiHandleRangeSlider } from "@/components/multiHandleRangeSlider/multiHandleRangeSlider";
import { formatSeconds } from "@/components/chordPill/chordPill";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { ModalContainer } from "@/components/modalContainer/modalContainer";
import { NetworkContext } from "@/context/networkContext/networkContext";
import { UserContext } from "@/context/userContext/userContext";
import offlineSongs from "@/public/songs-offline.json";

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
  // TODO: Add "Playlist" feature for consecutive songs
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
  const [sorting, setSorting] = useState<string[]>(["", ""]);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [sortModalOpen, setSortModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const { isOnline } = useContext(NetworkContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    title("Home");
  }, []);

  const email = "danbailey.813@gmail.com";
  const password = "poopooPeepee";
  const displayName = "Dan";

  const loginUser = () => {
    fetch("/api/loginUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const user = json.user;
        const localUser = {
          isLoggedIn: true,
          displayName: user.display_name,
          email: user.email,
          userId: user.id,
        };
        setUser(localUser);

        localStorage.setItem("user", JSON.stringify(localUser));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createNewUser = async () => {
    await fetch("/api/createUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "User Created"); //TODO: Move to notification
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkExistingUser = async () => {
    await fetch("/api/getExistingUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (!json.userExists) {
          await createNewUser();
        } else {
          console.log("User already exists, please log in"); //TODO: Move to notification
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return;
  };

  const getSongsFromFile = () => {
    setSongs(offlineSongs as Song[]);
    setLoading(false);
  };

  const getSongsFromDb = () => {
    fetch("/api/getSongs")
      .then((res) => res.json())
      .then((json) => {
        setSongs(json);
        console.log(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (isOnline === undefined) return;

    if (!isOnline) {
      getSongsFromFile();
      return;
    }

    getSongsFromDb();
  }, [isOnline]);

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
    switch (sorting[0]) {
      case "Artist":
        return sorting[1] == "Ascending" || sorting[1] == ""
          ? songsList.sort((a, b) => (a.artist < b.artist ? -1 : 0))
          : songsList.sort((a, b) => (a.artist > b.artist ? -1 : 0));
      case "Duration":
        return sorting[1] == "Ascending" || sorting[1] == ""
          ? songsList.sort((a, b) => (a.duration < b.duration ? -1 : 0))
          : songsList.sort((a, b) => (a.duration > b.duration ? -1 : 0));
      case "Difficulty":
        return sorting[1] == "Ascending" || sorting[1] == ""
          ? songsList.sort((a, b) => (a.difficulty < b.difficulty ? -1 : 0))
          : songsList.sort((a, b) => (a.difficulty > b.difficulty ? -1 : 0));
      case "Song Name":
      default:
        return sorting[1] == "Ascending" || sorting[1] == ""
          ? songsList.sort((a, b) => (a.name < b.name ? -1 : 0))
          : songsList.sort((a, b) => (a.name > b.name ? -1 : 0));
    }
  };

  const getRandomSong = () => {
    const rand = Math.floor(Math.random() * songs.length);
    router.push(`/song/${songs[rand].slug}`);
  };

  return (
    <div className={styles.homePageContainer}>
      <SidebarContainer>
        <div className={styles.sidebarHeaderButtons}>
          {isOnline && (
            <Link href={"/new"} className="button">
              <AddIcon />
            </Link>
          )}
          <button onClick={getRandomSong}>
            <ShuffleIcon />
          </button>
          <button onClick={() => setFilterModalOpen(!filterModalOpen)}>
            <FilterListIcon />
          </button>
          <button onClick={() => setSortModalOpen(!sortModalOpen)}>
            <SortIcon />
          </button>
          {/* TODO: Add search page */}
        </div>
        <button onClick={loginUser}>Login</button>
        <button onClick={checkExistingUser}>Create</button>
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
      {filterModalOpen && (
        // TODO: Bug: filters reset on opening modal
        <ModalContainer
          modalOpen={filterModalOpen}
          setModalOpen={setFilterModalOpen}
          title={"Filter"}
          size="sm"
        >
          <div className={styles.modalStyles}>
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
                setFilter({
                  ...filter,
                  instrument: newVal as string,
                } as Filter);
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
          </div>
        </ModalContainer>
      )}
      {sortModalOpen && (
        <ModalContainer
          modalOpen={sortModalOpen}
          setModalOpen={setSortModalOpen}
          title={"Sort"}
          size="sm"
        >
          <div className={styles.modalStyles}>
            <DropdownContainer
              values={["Song Name", "Artist", "Duration", "Difficulty"]}
              onValueChange={(newVal: string) => {
                setSorting([newVal, sorting[1]]);
              }}
              label="Sort"
              placeholder="Select a Sort By"
            />
            <DropdownContainer
              values={["Ascending", "Descending"]}
              onValueChange={(newVal: string) => {
                setSorting([sorting[0], newVal]);
              }}
              label="Direction"
              placeholder="Select a Direction"
            />
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
