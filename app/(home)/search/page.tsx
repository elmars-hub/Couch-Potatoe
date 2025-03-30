"use client";

import { useEffect, useState } from "react";
import { searchData } from "@/lib/movies";
import MovieCard from "@/components/ui/functional/movie-card";
import PaginationComponent from "@/components/ui/functional/paginationcomponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2 } from "lucide-react";

interface SearchResultItem {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
  vote_average: number;
}

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchValue.trim()) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await searchData(searchValue, activePage);
        if (res?.results) {
          setData(
            res.results.map((result) => ({
              ...result,
              vote_average: result.vote_average ?? 0,
              media_type: result.media_type || "movie",
            }))
          );
          setTotalPages(res.total_pages);
        } else {
          setData([]);
          setError("No results found");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch results");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchValue, activePage]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tempSearchValue.trim() !== searchValue) {
      setActivePage(1);
      setSearchValue(tempSearchValue.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Movies & TV Shows</h1>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Input
              placeholder="Search movies, TV shows..."
              className="pl-10 pr-4 py-2 h-12 text-lg"
              value={tempSearchValue}
              onChange={(e) => setTempSearchValue(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 px-6"
            disabled={isLoading || !tempSearchValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-lg text-destructive mt-10">
          {error}
        </div>
      ) : data.length === 0 && searchValue ? (
        <div className="text-center text-lg text-muted-foreground mt-10">
          No results found for {searchValue}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.map((item) => (
              <MovieCard key={item.id} item={item} type={item.media_type} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationComponent
                activePage={activePage}
                totalPages={totalPages}
                setActivePage={setActivePage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
