import styles from "@/styles/songPage.module.scss";
import { useRouter } from "next/router";
import { SongComponent } from "@/components/songComponent/songComponent";
import { useState } from "react";

export default () => {
  const [isEditing, setIsEditing] = useState<boolean>(true);

  return (
    <div className={styles.songPageContainer}>
      <SongComponent
        editing={isEditing}
        setIsEditing={(isEditing) => setIsEditing(isEditing)}
      />
    </div>
  );
};
