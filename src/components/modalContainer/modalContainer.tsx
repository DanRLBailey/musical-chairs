import { useEffect, useState } from "react";
import styles from "./modalContainer.module.scss";

interface ModalContainerProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: React.ReactNode | React.ReactNode[];
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

  return (
    <>
      {isOpen && (
        <div
          id={"modalContainer"}
          className={`${styles.modalContainer} ${isActive && styles.active}`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContent}
          >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};
