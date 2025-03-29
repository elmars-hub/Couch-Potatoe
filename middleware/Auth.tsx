"use client";

import { redirect } from "next/navigation";
import { useAuthentication } from "@/context/AuthenticationContext";
import { useEffect } from "react";

const Auth: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { checkAuth } = useAuthentication();

  useEffect(() => {
    const unauthenticated = checkAuth();

    if (!unauthenticated) {
      return redirect("/auth/login");
    }
  }, [checkAuth]);

  return children;
};

export default Auth;
