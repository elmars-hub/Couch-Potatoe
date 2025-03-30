"use client";

import { useEffect, useState } from "react";
import { searchData } from "@/lib/movies";
import MovieCard from "@/components/ui/functional/movie-card";
import PaginationComponent from "@/components/ui/functional/paginationcomponent";

// Define an interface for the search result items
interface SearchResultItem {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
  vote_average: number;
  // Add other properties as needed based on your API response
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
              vote_average: (result as SearchResultItem).vote_average ?? 0,
              media_type: result.media_type || "movie",
            }))
          );
          setTotalPages(res.total_pages);
          console.log("Search results:", res);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline gap-4 my-2">
        <h2 className="text-md uppercase font-semibold">Search</h2>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search movies, tv shows..."
          className="w-full px-4 py-2 border rounded-md 
            text-gray-700 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tempSearchValue}
          onChange={(e) => setTempSearchValue(e.target.value)}
        />
      </form>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <h3 className="text-center text-sm mt-10">{error}</h3>
      ) : data.length === 0 && searchValue ? (
        <h3 className="text-center text-sm mt-10">No results found</h3>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {data.map((item) => (
              <MovieCard key={item.id} item={item} type={item.media_type} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
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
