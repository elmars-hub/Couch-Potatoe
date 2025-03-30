"use client";

import MovieCard from "@/components/ui/functional/movie-card";
import PaginationComponent from "@/components/ui/functional/paginationcomponent";
import { fetchMovies, SortBy } from "@/lib/movies";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  media_type: string;
  poster_path: string;
  vote_average: number;
  name?: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("popularity.desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetchMovies(activePage, sortBy);

        if (res?.results) {
          setMovies(
            res.results.map((movie) => ({
              ...movie,
              media_type: "movie",
              vote_average:
                (movie as unknown as { vote_average: number }).vote_average ??
                0,
            }))
          );

          setActivePage(res.page);
          setTotalPages(res.total_pages);
          console.log("Total pages:", res.total_pages); // Add this line
        } else {
          throw new Error("No results found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movies");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [activePage, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivePage(1);
    setSortBy(e.target.value as SortBy);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline gap-4 my-10">
        <h2 className="text-md uppercase font-semibold">Discover Movies</h2>
        <select
          className="w-[130px] border rounded py-1 px-2"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc&vote_count.gte=1000">
            Top Rated
          </option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] bg-gray-200 animate-pulse rounded"
              />
            ))
          : movies.map((item) => (
              <MovieCard key={item.id} item={item} type="movie" />
            ))}
      </div>
      {totalPages > 1 && (
        <div className="my-8 s">
          <PaginationComponent
            activePage={activePage}
            totalPages={totalPages}
            setActivePage={setActivePage}
          />
        </div>
      )}
    </div>
  );
}
