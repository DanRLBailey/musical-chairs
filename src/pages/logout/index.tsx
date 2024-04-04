import { useContext, useEffect, useState } from "react";
import styles from "./logout.module.scss";
import { UserContext } from "@/context/userContext/userContext";
import { title } from "@/constants/document";
import { useRouter } from "next/router";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    title("Logout");

    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, []);

  return (
    <div className={styles.logoutContainer}>
      You have successfully logged out!
      {/* TODO: Click here to go back home */}
    </div>
  );
}
