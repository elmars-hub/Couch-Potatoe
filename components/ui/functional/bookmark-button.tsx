"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  mediaId: number;
  mediaType: string;
  title: string;
}

export default function BookmarkButton({ title }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    // Here you would typically integrate with your bookmark storage solution
    setIsBookmarked(!isBookmarked);

    if (!isBookmarked) {
      // Add to bookmarks
      console.log(`Bookmarked: ${title}`);
    } else {
      // Remove from bookmarks
      console.log(`Removed bookmark: ${title}`);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`px-4 py-2 rounded-full transition-colors ${
        isBookmarked
          ? "bg-red-500 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
    >
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
