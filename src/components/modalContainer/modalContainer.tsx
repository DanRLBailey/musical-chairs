import { useEffect, useState } from "react";
import styles from "./modalContainer.module.scss";
import CloseIcon from "@mui/icons-material/Close";

interface ModalContainerProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: React.ReactNode | React.ReactNode[];
  title?: string;
  size?: "sm" | "md" | "lg";
}

export const ModalContainer = (props: ModalContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.modalOpen ?? false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(isOpen);
    }, 50);
  }, []);

  const handleClose = () => {
    setIsActive(false);

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  useEffect(() => {
    props.setModalOpen(isOpen);
  }, [isOpen]);

  const getSize = () => {
    switch (props.size) {
      case "sm":
        console.log("es emming");
        return styles.sm;
      case "md":
        return styles.md;
      case "lg":
        return styles.lg;
      default:
        return "";
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`${styles.modalContainer} ${isActive && styles.active}`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${styles.modalContent} ${getSize()}`}
          >
            <div className={styles.header}>
              <span className={styles.heading}>{props.title}</span>
              <CloseIcon className={styles.icon} onClick={handleClose} />
            </div>
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};
