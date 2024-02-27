import { useEffect, useState } from "react";
import styles from "@/components/chordList/chordList.module.scss";
import { TextInput } from "../textInput/textInput";
import { ModalContainer } from "../modalContainer/modalContainer";
import { TabEditor } from "../tabEditor/tabEditor";
import { Tab } from "@/types/songTypes";

interface TabListProps {
  existingTabs?: Tab[];
  onTabPressed: (tab: string) => void;
  currentSelected: number | null;
  onTabsChange: (tabs: Tab[]) => void;
}

export const TabList = (props: TabListProps) => {
  const [chosenTabs, setChosenTabs] = useState<Tab[]>(props.existingTabs ?? []);
  const [currentSelectedTabNumber, setCurrentSelectedTab] =
    useState<number>(-1);
  const [searchedTab, setSearchedTab] = useState<Tab>({} as Tab);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log(props.existingTabs);
    if (!props.existingTabs) return;
    setChosenTabs(props.existingTabs);
  }, [props.existingTabs]);

  useEffect(() => {
    if (!props.currentSelected) return;
    setCurrentSelectedTab(props.currentSelected);
  }, [props.currentSelected]);

  useEffect(() => {
    props.onTabsChange(chosenTabs);
  }, [chosenTabs]);

  const onInputChange = (e: string) => {
    setSearchedTab({
      name: e,
      cols: [],
    } as Tab);
  };

  return (
    <div className={styles.tabListContainer}>
      <div className={styles.tabSearch}>
        <TextInput
          label="Tabs"
          value={searchedTab.name ?? ""}
          onValueChange={(e) => onInputChange(e as string)}
          onButtonClick={() => {
            setChosenTabs([...chosenTabs, searchedTab]);
            setSearchedTab({} as Tab);
          }}
          buttonText="+"
          isError={chosenTabs.some((tab) => tab.name === searchedTab.name)}
        />
      </div>
      <div
        className={`${styles.selectedTabs} ${
          chosenTabs.length > 0 ? styles.hasTabs : ""
        }`}
      >
        {chosenTabs.map((tab: Tab, index: number) => {
          return (
            <button
              key={index}
              onClick={() => {
                if (currentSelectedTabNumber != index) {
                  props.onTabPressed(tab.name);
                  setCurrentSelectedTab(index);
                } else {
                  setModalOpen(true);
                }
              }}
              className={currentSelectedTabNumber == index ? styles.active : ""}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      {modalOpen && (
        <ModalContainer modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <TabEditor
            tab={chosenTabs[currentSelectedTabNumber]}
            setTab={(newTab) => {
              const updatedTabs = chosenTabs.map((tab) => {
                if (tab.name === newTab.name) {
                  return newTab;
                }
                return tab;
              });
              setChosenTabs(updatedTabs);
            }}
          />
        </ModalContainer>
      )}
    </div>
  );
};
