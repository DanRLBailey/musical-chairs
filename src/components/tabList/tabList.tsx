import { useState } from "react";
import styles from "./tabList.module.scss";
import { TextInput } from "../textInput/textInput";

interface TabListProps {
  onTabPressed: (chord: string) => void;
}

export const TabList = (props: TabListProps) => {
  const [chosenTabs, setChosenTabs] = useState<string[]>([]);
  const [currentSelectedTab, setCurrentSelectedTab] = useState<number>(-1);
  const [searchedTab, setSearchedTab] = useState<string>("");

  const onInputChange = (e: string) => {
    setSearchedTab(e);
  };

  return (
    <div className={styles.tabListContainer}>
      <div className={styles.chordSearch}>
        <TextInput
          label="Tabs"
          value={searchedTab}
          onValueChange={(e) => onInputChange(e as string)}
          onButtonClick={() => {
            setChosenTabs([...chosenTabs, searchedTab]);
            setSearchedTab("");
          }}
          buttonText="+"
        />
      </div>
      <div className={styles.selectedTabs}>
        {chosenTabs.map((chord: string, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                props.onTabPressed(chord);
                setCurrentSelectedTab(index);
              }}
              className={currentSelectedTab == index ? styles.active : ""}
            >
              {chord}
            </button>
          );
        })}
      </div>
    </div>
  );
};
