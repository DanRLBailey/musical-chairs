import { useContext, useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { UserContext } from "@/context/userContext/userContext";
import { title } from "@/constants/document";

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    title("Login");
  }, []);

  return (
    <div className={styles.profileContainer}>
      {user.displayName} - {user.userName}
      {/* Your Songs - Published/drafts */}
      {/* Your Saved Songs */}
    </div>
  );
}
