"use client";

import Link from "next/link";
import Logo from "./logo";
import ProfileTag from "./profile";
import { Home, Search, Clapperboard, Tv } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full p-4 z-50">
        <div className="max-w-7xl mx-auto h-16 bg-white/80 border backdrop-blur-md rounded-xl flex justify-between items-center px-6">
          {/* Desktop Navigation */}
          <Link href="/">
            <Logo />
          </Link>

          <nav className="flex items-center gap-10 h-full mt-0.5 px-3.5">
            <Link
              href="/"
              className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary items-center h-full"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary items-center h-full"
            >
              Movies
            </Link>
            <Link
              href="/shows"
              className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary items-center h-full"
            >
              Shows
            </Link>
            <Link
              href="/search"
              className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary items-center h-full"
            >
              Search
            </Link>
            <ProfileTag />
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed sm:hidden bottom-0 left-0 w-full p-4 bg-white/80 border-t backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link
            href="/"
            className="p-2 transition-transform duration-200 hover:scale-110"
          >
            <Home className="h-6 w-6" />
          </Link>

          <Link
            href="/movies"
            className="p-2 transition-transform duration-200 hover:scale-110"
          >
            <Clapperboard className="h-6 w-6" />
          </Link>

          <Link
            href="/shows"
            className="p-2 transition-transform duration-200 hover:scale-110"
          >
            <Tv className="h-6 w-6" />
          </Link>

          <Link
            href="/search"
            className="p-2 transition-transform duration-200 hover:scale-110"
          >
            <Search className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    </>
  );
}
