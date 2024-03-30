import { useState } from "react";
import styles from "./sidebarContainer.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";

interface SidebarContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

export const SidebarContainer = (props: SidebarContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div
      className={`${styles.sidebarContainer} ${!isOpen ? styles.closed : ""}`}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.mainContent}>
          <div className={styles.homePageLink}>
            <Link href={"/"}>Musical Chairs</Link>
          </div>
          {props.children}
        </div>
      </div>
      <div className={styles.sidebarCollapse}>
        <div className={styles.collapse} onClick={() => setIsOpen(!isOpen)}>
          <div className={!isOpen ? styles.closed : ""}>
            <KeyboardArrowDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
