"use client";

import Link from "next/link";
import Logo from "./logo";
import ProfileTag from "./profile";
import { Home, Search, Clapperboard, Tv } from "lucide-react";

export default function Header() {
  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 w-full p-4 z-50">
        <div className="max-w-7xl mx-auto h-16 bg-background/80 border backdrop-blur-md rounded-xl flex justify-between items-center px-4">
          {/* Logo - Left Side */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Navigation Group - Right Side */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-8 mr-8">
              <Link
                href="/"
                className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Home className="h-4 w-4 hidden md:inline" />
                Home
              </Link>
              <Link
                href="/movies"
                className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Clapperboard className="h-4 w-4 hidden md:inline" />
                Movies
              </Link>
              <Link
                href="/shows"
                className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Tv className="h-4 w-4 hidden md:inline" />
                Shows
              </Link>
              <Link
                href="/search"
                className="hidden sm:flex text-sm font-medium items-center gap-2 transition-colors hover:text-primary"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
              </Link>
            </nav>

            {/* Profile Tag */}
            <ProfileTag />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed sm:hidden bottom-0 left-0 w-full p-4 bg-background/80 border-t backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-around items-center">
          <Link href="/" className="p-2 transition-all hover:scale-110">
            <Home className="h-6 w-6" />
          </Link>
          <Link href="/movies" className="p-2 transition-all hover:scale-110">
            <Clapperboard className="h-6 w-6" />
          </Link>
          <Link href="/shows" className="p-2 transition-all hover:scale-110">
            <Tv className="h-6 w-6" />
          </Link>
          <Link href="/search" className="p-2 transition-all hover:scale-110">
            <Search className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    </>
  );
}
