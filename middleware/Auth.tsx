"use client";

import { redirect } from "next/navigation";
import { useAuthentication } from "@/context/AuthenticationContext";

const Auth: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { checkAuth } = useAuthentication();

  return checkAuth() ? children : redirect("/auth/login");
};

export default Auth;
