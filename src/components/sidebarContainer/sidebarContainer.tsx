import { useContext, useEffect, useState } from "react";
import styles from "./sidebarContainer.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { UserContext } from "@/context/userContext/userContext";
import { PopupContainer } from "../popupContainer/popupContainer";
import { User } from "@/types/userTypes";
import { useRouter } from "next/router";

interface SidebarContainerProps {
  children: React.ReactNode | React.ReactNode[];
  onSidebarToggle?: (isOpen: boolean) => void;
}

export const SidebarContainer = (props: SidebarContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (props.onSidebarToggle) props.onSidebarToggle(isOpen);
  }, [isOpen]);

  const email = "danbailey.813@gmail.com";
  const password = "poopooPeepee";
  const displayName = "Dan";

  const handleLoginButton = () => {
    router.push("/login");
  };

  const logoutUser = () => {
    setUser({} as User);
    localStorage.removeItem("user");
    router.push(`/`); //TODO: Go to logout successful page
  };

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
        <div className={styles.footerContent}>
          {!user.isLoggedIn && (
            <>
              <button onClick={handleLoginButton}>Log In</button>
            </>
          )}
          {user.isLoggedIn && (
            <div
              className={styles.userContainer}
              onMouseEnter={() => setProfileHover(true)}
              onMouseLeave={() => setProfileHover(false)}
            >
              <span>{user.displayName[0]}</span>
              <div className={styles.nameContainer}>
                <span className={styles.displayName}>{user.displayName}</span>
                <span className={styles.userName}>@{user.userName}</span>
              </div>
              <div
                className={`${styles.menu} ${profileHover ? styles.hover : ""}`}
              >
                <MoreVertIcon onClick={() => setPopupOpen(!popupOpen)} />
              </div>
              <PopupContainer popupOpen={popupOpen} setPopupOpen={setPopupOpen}>
                <button>
                  <PersonIcon />
                  <span>Profile</span>
                </button>
                <button>
                  <SettingsIcon />
                  <span>Settings</span>
                </button>
                <button onClick={logoutUser}>
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </PopupContainer>
            </div>
          )}
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
