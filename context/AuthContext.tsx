"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  emailConfirmed: boolean;
  getUserDisplayName: () => Promise<string>;
  checkEmailConfirmation: () => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  emailConfirmed: false,
  getUserDisplayName: async () => "Guest",
  checkEmailConfirmation: async () => false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);

      if (session?.user) {
        setEmailConfirmed(session.user.email_confirmed_at !== null);
        localStorage.setItem("jwt", session.access_token || "");
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        if (session?.user) {
          setEmailConfirmed(session.user.email_confirmed_at !== null);
          localStorage.setItem("jwt", session.access_token || "");
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Get Display Name from Supabase metadata
  const getUserDisplayName = async (): Promise<string> => {
    if (!user) return "Guest";
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return "Guest";
    return data.user.user_metadata?.displayName || "User";
  };

  // Check if email is confirmed
  const checkEmailConfirmation = async (): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return false;
    const isConfirmed = data.user.email_confirmed_at !== null;
    setEmailConfirmed(isConfirmed);
    return isConfirmed;
  };

  const value = {
    user,
    token,
    loading,
    emailConfirmed,
    getUserDisplayName,
    checkEmailConfirmation,
    signUp: async (email: string, password: string, displayName: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { displayName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setUser(data.user);
        setEmailConfirmed(false);
      } finally {
        setLoading(false);
      }
    },
    signIn: async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setToken(data.session?.access_token ?? null);
        if (data.session) {
          localStorage.setItem("jwt", data.session.access_token);
        }
        setEmailConfirmed(data.user.email_confirmed_at !== null);
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setToken(null);
        setEmailConfirmed(false);
        localStorage.removeItem("jwt");
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
