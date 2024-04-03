import { useEffect, useState } from "react";
import styles from "./bottomBarContainer.module.scss";

interface BottomBarContainerProps {
  children: React.ReactNode | React.ReactNode[];
  isOpen: boolean;
  isSidebarOpen?: boolean;
}

export const BottomBarContainer = (props: BottomBarContainerProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    props.isSidebarOpen ?? true
  );

  useEffect(() => {
    setIsSidebarOpen(props.isSidebarOpen ?? false);
  }, [props.isSidebarOpen]);

  return (
    <div
      className={`${styles.bottomBarContainer} ${
        !props.isOpen ? styles.closed : ""
      } ${isSidebarOpen ? styles.sidebarOpen : ""}`}
    >
      <div className={styles.bottomBarContent}>{props.children}</div>
    </div>
  );
};
