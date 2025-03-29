"use client";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<unknown>(null);

type User = {
  id: string;
};

type Token = {
  accessToken: string;
  expiresAt: number;
};

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Token | null>(null);

  const getValue = (key: string) => {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  };

  const setValue = (key: string, value: unknown) => {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  };

  const loginUser = (user: User, token: Token) => {
    setSession(token);
    setUser(user);
    setValue("auth-session", token);
    setValue("auth-user", user);
  };

  const getUser = (): User | null => {
    const userData = user ?? getValue("auth-user");

    const authenticated = checkAuth();

    return authenticated ? userData : null;
  };

  const logout = () => {
    localStorage.removeItem("auth-session");
    localStorage.removeItem("auth-user");
  };

  const checkAuth = () => {
    const authSession = getValue("auth-session");
    const sessionData = session ?? authSession;
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
        getUser,
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
