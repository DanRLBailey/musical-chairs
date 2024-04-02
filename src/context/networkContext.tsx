import React, { createContext, useEffect, useState } from "react";
import styles from "./networkContext.module.scss";
import WifiOffIcon from "@mui/icons-material/WifiOff";

interface NetworkContextProps {
  isOnline: boolean | undefined;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const NetworkContext = createContext<NetworkContextProps>({
  isOnline: true,
  setIsOnline: () => {},
});

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOnline, setIsOnline] = useState<boolean>();

  useEffect(() => {
    setIsOnline(!window.navigator.onLine); //reverse
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, setIsOnline }}>
      {!isOnline && (
        <div className={styles.networkContextContainer}>
          <WifiOffIcon />
        </div>
      )}
      {children}
    </NetworkContext.Provider>
  );
};
