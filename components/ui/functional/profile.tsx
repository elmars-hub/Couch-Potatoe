"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Bookmark, Heart, Library, User } from "lucide-react";
import { Button } from "../button";
import { useAuthentication } from "@/context/AuthenticationContext";
import { LogoutConfirmation } from "./logout";

export default function ProfileTag() {
  const { checkAuth, getUser } = useAuthentication();

  // Function to get the display name
  const getUsername = () => {
    return getUser()?.user_metadata?.displayName || "User";
  };

  // Function to get initials
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0]?.charAt(0) || "";
    const secondInitial = nameParts[1]?.charAt(0) || "";
    return `${firstInitial}${secondInitial}`.toUpperCase(); // Convert to uppercase
  };

  const username = getUsername();
  const initials = getInitials(username);

  return (
    <>
      {checkAuth() ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src=""
                  alt={username}
                  className="bg-red-500 text-white"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{username}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer w-full flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/library"
                className="cursor-pointer w-full flex items-center"
              >
                <Library className="mr-2 h-4 w-4" />
                <span>Library</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/bookmarks"
                className="cursor-pointer w-full flex items-center"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Bookmarks</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/favorites"
                className="cursor-pointer w-full flex items-center"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutConfirmation />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild className="">
          <Link href="/auth/register">Sign In</Link>
        </Button>
      )}
    </>
  );
}
