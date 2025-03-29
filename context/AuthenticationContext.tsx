"use client";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<unknown>(null);

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const loginUser = (user, token) => {
    setSession(token);
    setUser(user);
    localStorage.setItem("auth-session", JSON.stringify(token));
    localStorage.setItem("auth-user", JSON.stringify(user));
  };

  const getUser = () => {
    const userData = user ?? localStorage.getItem("auth-user");

    const authenticated = checkAuth();

    return authenticated ? userData : null;
  };

  const logout = () => {
    localStorage.removeItem("auth-session");
    localStorage.removeItem("auth-user");
  };

  const checkAuth = () => {
    const sessionData = session ?? localStorage.getItem("auth-session");
    const now = Math.round(Date.now() / 1000);

    if (!sessionData) {
      logout();
      return false;
    }

    if (now > sessionData?.expiresAt) {
      logout();
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        session,
        checkAuth,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthContext);
};
