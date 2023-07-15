import { createContext, useState } from "react";
import { useRouter } from "next/router";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;

const IS_BROWSER = typeof window !== "undefined";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const router = useRouter();

  let token = null;
  let payload = {};

  if (IS_BROWSER) {
    token = localStorage.getItem("token");
    if (token) {
      payload = { ...parseJwt(token), token };
    }
  }

  const [user, setUser] = useState({ ...payload, token });

  const signIn = (token) => {
    setUser({ ...parseJwt(token), token });
    router.push("/");
    localStorage.setItem("token", token);
  };

  const signOut = () => {
    setUser({ token: null });
    router.push("/signin");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
