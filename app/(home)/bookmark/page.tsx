"use client";

import Auth from "@/middleware/Auth";
import { useAuthentication } from "@/context/AuthenticationContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

import { Bookmark } from "@/types/library";

const BookmarksPage = () => {
  const { user } = useAuthentication();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!user) {
          setError("User not authenticated");
          return;
        }

        setLoading(true);
        const { data, error } = await supabase
          .from("bookmarks")
          .select("movie_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookmarks(data || []);
      } catch (err) {
        setError("Failed to load bookmarks");
        console.error("Bookmark Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const removeBookmark = async (movieId: string) => {
    try {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("movie_id", movieId)
        .eq("user_id", user.id);

      if (error) throw error;
      setBookmarks((prev) => prev.filter((b) => b.movie_id !== movieId));
    } catch (err) {
      setError("Failed to remove bookmark");
      console.error("Remove Bookmark Error:", err);
    }
  };

  return (
    <Auth>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Bookmarks</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4">
              {error && (
                <div className="text-red-500 text-center text-sm p-2">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-lg" />
                  ))}
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center text-gray-500 p-4">
                  No bookmarks found
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.movie_id} className="relative group">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-2">
                          <div className="relative aspect-[2/3]">
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${bookmark.movie_id}`}
                              alt="Movie poster"
                              fill
                              className="rounded-lg object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm font-medium truncate">
                              {bookmark.movie_id}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBookmark(bookmark.movie_id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Auth>
  );
};

export default BookmarksPage;
