import { useEffect, useState } from "react";
import styles from "./popupContainer.module.scss";

interface PopupContainerProps {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  children: React.ReactNode | React.ReactNode[];
  position?: "top" | "bottom" | "left" | "right";
}

export const PopupContainer = (props: PopupContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.popupOpen ?? false);

  useEffect(() => {
    setIsOpen(props.popupOpen);
  }, [props.popupOpen]);

  return (
    <div className={`${styles.popupContainer} ${isOpen && styles.active}`}>
      <div onClick={(e) => e.stopPropagation()} className={styles.popupContent}>
        {props.children}
      </div>
    </div>
  );
};
