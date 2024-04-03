const email = "danbailey.813@gmail.com";
const password = "poopooPeepee";
const displayName = "Dan";

export const loginUser = () => {
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
        displayName: user.display_name,
        email: user.email,
        userId: user.id,
      };
      setUser(localUser);

      localStorage.setItem("user", JSON.stringify(localUser));
    })
    .catch((err) => {
      console.error(err);
    });
};

export const createNewUser = async () => {
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

export const checkExistingUser = async () => {
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
