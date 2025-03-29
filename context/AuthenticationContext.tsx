"use client";
import React, { createContext, useContext, useState } from "react";
import { Auth, Token, User } from "./auth.type";

const AuthContext = createContext<Auth | null>(null);

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Token | null>(null);

  const getValue = (key: string) => {
    const value = window.localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  };

  const setValue = (key: string, value: unknown) => {
    const json = JSON.stringify(value);
    window.localStorage.setItem(key, json);
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
    window.localStorage.removeItem("auth-session");
    window.localStorage.removeItem("auth-user");
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
  const context: Auth | null = useContext(AuthContext);

  if (!context) {
    throw new Error("Context not defined");
  }

  return context;
};
