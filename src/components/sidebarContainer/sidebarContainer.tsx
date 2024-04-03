import { useContext, useState } from "react";
import styles from "./sidebarContainer.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";
import { UserContext } from "@/context/userContext/userContext";

interface SidebarContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

export const SidebarContainer = (props: SidebarContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { user, setUser } = useContext(UserContext);

  const email = "danbailey.813@gmail.com";
  const password = "poopooPeepee";
  const displayName = "Dan";

  const loginUser = () => {
    fetch("/api/loginUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const user = json.user;
        console.log(user);
        const localUser = {
          isLoggedIn: true,
          email: user.email,
          userName: user.user_name,
          displayName: user.display_name,
          userId: user.id,
          saved: user.saved,
        };
        setUser(localUser);

        localStorage.setItem("user", JSON.stringify(localUser));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createNewUser = async () => {
    await fetch("/api/createUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "User Created"); //TODO: Move to notification
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkExistingUser = async () => {
    await fetch("/api/getExistingUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (!json.userExists) {
          await createNewUser();
        } else {
          console.log("User already exists, please log in"); //TODO: Move to notification
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return;
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
              {/* <button onClick={loginUser}>Login</button>
              <button onClick={checkExistingUser}>Create</button> */}
            </>
          )}
          {user.isLoggedIn && (
            <div className={styles.userContainer}>
              <span>{user.displayName[0]}</span>
              <div className={styles.nameContainer}>
                <span className={styles.displayName}>{user.displayName}</span>
                <span className={styles.userName}>@{user.userName}</span>
              </div>
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
