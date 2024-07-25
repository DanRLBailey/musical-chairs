import React, { createContext, useEffect, useState } from "react";
import styles from "./toastContext.module.scss";
import { Toast } from "@/components/toast/toast";

export interface Toast {
  message: string;
  type: "success" | "error" | "warning" | "info";
  id: string;
}

interface ToastContextProps {
  toastList: Toast[];
  setToastList: React.Dispatch<React.SetStateAction<Toast[]>>;
  showToast: (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
}

export const ToastContext = createContext<ToastContextProps>({
  toastList: [],
  setToastList: () => {},
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success"
  ) => {
    const id = `${message}-${type}-${new Date().getTime()}`;

    setToastList([
      ...toastList,
      {
        message: message,
        type: type,
        id: id,
      },
    ]);
  };

  const removeToast = (id: string) => {
    const listWithoutToast = [...toastList].filter((toast) => toast.id != id);

    // console.log(...listWithoutToast);
    setToastList(listWithoutToast);
  };

  useEffect(() => {
    // console.log("toastList", ...toastList);
  }, [toastList]);

  return (
    <ToastContext.Provider value={{ toastList, setToastList, showToast }}>
      <div className={styles.toastContextContainer}>
        {toastList.map((toast, index) => (
          <Toast
            key={index}
            {...toast}
            duration={10}
            onClose={() => {
              removeToast(toast.id);
            }}
          />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};
