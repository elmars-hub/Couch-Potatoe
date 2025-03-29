"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useAuthentication } from "@/context/AuthenticationContext";

const Auth = ({ children }) => {
  const { checkAuth } = useAuthentication();

  return checkAuth() ? children : redirect("/auth/login");
};

export default Auth;
