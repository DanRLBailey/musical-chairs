import { useEffect, useState } from "react";
import styles from "@/components/chordList/chordList.module.scss";
import { TextInput } from "../textInput/textInput";
import { ModalContainer } from "../modalContainer/modalContainer";

interface TabListProps {
  onTabPressed: (tab: string) => void;
  currentSelected: number | null;
}

export const TabList = (props: TabListProps) => {
  const [chosenTabs, setChosenTabs] = useState<string[]>([]);
  const [currentSelectedTab, setCurrentSelectedTab] = useState<number>(-1);
  const [searchedTab, setSearchedTab] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!props.currentSelected) return;
    setCurrentSelectedTab(props.currentSelected);
  }, [props.currentSelected]);

  const onInputChange = (e: string) => {
    setSearchedTab(e);
  };

  return (
    <div className={styles.tabListContainer}>
      <div className={styles.tabSearch}>
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
      <div
        className={`${styles.selectedTabs} ${
          chosenTabs.length > 0 ? styles.hasTabs : ""
        }`}
      >
        {chosenTabs.map((tab: string, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                if (currentSelectedTab != index) {
                  props.onTabPressed(tab);
                  setCurrentSelectedTab(index);
                } else {
                  console.log("open modal");
                  setModalOpen(true);
                }
              }}
              className={currentSelectedTab == index ? styles.active : ""}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {modalOpen && (
        <ModalContainer modalOpen={modalOpen} setModalOpen={setModalOpen}>
          tabEditor
        </ModalContainer>
      )}
    </div>
  );
};
