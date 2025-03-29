"use client";

import Link from "next/link";
import Logo from "./logo";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full p-4 z-50">
      <div className="max-w-7xl mx-auto h-16 bg-white/80 border backdrop-blur-md rounded-xl flex justify-between items-center px-6">
        {/* Logo and Navigation */}

        <Link href="/">
          <Logo />
        </Link>

        <nav className=" items-center gap-10 h-full mt-0.5 px-3.5 hidden sm:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center h-full"
          >
            Home
          </Link>

          <Link
            href="/movies"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center h-full"
          >
            Movies
          </Link>
          <Link
            href="/shows"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center h-full"
          >
            Shows
          </Link>

          <Link
            href="/search"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center h-full"
          >
            Search
          </Link>
        </nav>

        <Search className="sm:hidden" />
      </div>
    </header>
  );
}
