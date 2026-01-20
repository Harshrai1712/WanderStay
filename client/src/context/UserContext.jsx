// src/context/UserContext.jsx
import { createContext, useEffect, useState } from "react";
import * as api from "../api/requester";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      api.getUser()
        .then((userData) => {
          setUser(userData);
          setReady(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          setReady(true);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
