import { useContext, useEffect, useState } from "react";
import styles from "./createUser.module.scss";
import { TextInput } from "@/components/textInput/textInput";
import { UserContext } from "@/context/userContext/userContext";
import { useRouter } from "next/router";
import { title } from "@/constants/document";

export default function CreateUserPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    title("Create User");
  }, []);

  const createNewUser = async () => {
    await fetch("/api/createUser", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
        username: username,
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
        username: username,
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
    <div className={styles.createUserContainer}>
      <div className={styles.createUser}>
        {/* TODO: Logo!!! */}
        {/* TODO: Validation */}
        <TextInput
          value={email}
          onValueChange={(newVal) => setEmail(newVal as string)}
          label="Email"
          required
        />
        <TextInput
          value={password}
          onValueChange={(newVal) => setPassword(newVal as string)}
          label="Password"
          type="password"
          required
        />
        <TextInput
          value={username}
          onValueChange={(newVal) => setUsername(newVal as string)}
          label="Username"
          required
        />
        <TextInput
          value={displayName}
          onValueChange={(newVal) => setDisplayName(newVal as string)}
          label="Display Name"
          required
        />
        <div className={styles.buttonContainer}>
          <button onClick={checkExistingUser}>Create</button>
        </div>
      </div>
    </div>
  );
}
