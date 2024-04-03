import { User } from "@/types/userTypes";
import React, { createContext, useEffect, useState } from "react";

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps>({
  user: {} as User,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({ isLoggedIn: false } as User);

  useEffect(() => {
    if (user.isLoggedIn) return;

    const local = localStorage.getItem("user");
    if (!local) return;

    setUser(JSON.parse(local) as User);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
