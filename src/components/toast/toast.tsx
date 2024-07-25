import { Toast as ToastObj } from "@/context/toastContext/toastContext";
import styles from "./toast.module.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";

interface ToastProps extends ToastObj {
  duration: number;
  onClose: () => void;
}

export const Toast = (props: ToastProps) => {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleClose = () => {
    setIsOpening(false);

    setTimeout(() => {
      props.onClose();
    }, 0.4 * 1000);
  };

  useEffect(() => {
    setIsOpening(true);
    setIsClosing(true);

    setTimeout(() => {
      setIsOpening(false);
      handleClose();
    }, props.duration * 1000);
  }, []);

  const getIcon = () => {
    switch (props.type) {
      case "success":
        return <CheckCircleOutlineIcon />;
      case "error":
        return <CancelOutlinedIcon />;
      case "warning":
        return <ErrorOutlineIcon />;
      case "info":
        return <InfoOutlinedIcon />;
    }
  };

  const getClass = () => {
    switch (props.type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "warning":
        return styles.warning;
      case "info":
        return styles.info;
    }
  };

  return (
    <div
      onClick={handleClose}
      id={props.id}
      className={`${styles.toastContainer} ${getClass()} ${
        isOpening ? styles.open : ""
      }`}
    >
      <div className={styles.content}>
        {getIcon()}
        <span>{props.message}</span>
      </div>
      <div
        className={`${styles.timer} ${isClosing ? styles.closed : ""}`}
        style={{ transition: `${props.duration}s ease-in-out` }}
      ></div>
    </div>
  );
};
