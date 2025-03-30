"use client";

import Link from "next/link";
import Logo from "./logo";
import ProfileTag from "./profile";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full p-4 z-50">
      <div className="max-w-7xl mx-auto h-16 bg-white/80 border backdrop-blur-md rounded-xl flex justify-between items-center px-6">
        {/* Logo and Navigation */}

        <Link href="/">
          <Logo />
        </Link>

        <nav className="flex items-center gap-10 h-full mt-0.5 px-3.5 ">
          <Link
            href="/"
            className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary  items-center h-full"
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
  );
}
