import { useContext, useEffect, useState } from "react";
import styles from "./login.module.scss";
import { TextInput } from "@/components/textInput/textInput";
import { UserContext } from "@/context/userContext/userContext";
import { useRouter } from "next/router";
import { title } from "@/constants/document";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberUser, setRememberUser] = useState<boolean>(false);

  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    title("Login");
  }, []);

  useEffect(() => {
    if (user.isLoggedIn) router.push("/");
  }, [user]);

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

        const localUser = {
          isLoggedIn: true,
          email: user.email,
          userName: user.user_name,
          displayName: user.display_name,
          userId: user.id,
          saved: user.saved,
        };

        localStorage.setItem("user", JSON.stringify(localUser));
        setUser(localUser);
        router.push("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
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
        {/* TODO: This */}
        {/* <button className={styles.forgotPassword}>Forgot Password?</button> */}
        <div className={styles.buttonContainer}>
          <button onClick={loginUser}>Log In</button>
          {/* <button onClick={() => router.push("/createUser")}>
            Create New User
          </button> */}
        </div>
      </div>
    </div>
  );
}
