"use client";
import {
  fetchTrending,
  type TrendingResult,
  type TimeWindow,
} from "@/lib/movies";
import { useEffect, useState } from "react";
import MovieCard from "@/components/ui/functional/movie-card";
import MovieCardSkeleton from "@/components/ui/functional/movie-card-skeleton";
import Header from "@/components/ui/functional/header";
import PaginationComponent from "@/components/ui/functional/paginationcomponent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Footer from "@/components/ui/functional/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [data, setData] = useState<TrendingResult[]>([]);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchTrending(timeWindow, activePage);
        setData(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        console.error("Error fetching trending data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeWindow, activePage]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold uppercase text-card-foreground shrink-0">
            Trending
          </h2>

          {/* Desktop Tabs Container */}
          <div className="hidden md:block">
            <Tabs
              value={timeWindow}
              onValueChange={(value) => {
                setTimeWindow(value as TimeWindow);
                setActivePage(1);
              }}
            >
              <TabsList className="border border-teal-500 rounded-full p-1 h-auto">
                <TabsTrigger
                  value="day"
                  className="rounded-full px-4 py-1 data-[state=active]:bg-secondary hover:bg-secondary/50"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="rounded-full px-4 py-1 data-[state=active]:bg-secondary hover:bg-secondary/50"
                >
                  This Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Select Container */}
          <div className="w-full md:hidden">
            <Select
              value={timeWindow}
              onValueChange={(value) => {
                setTimeWindow(value as TimeWindow);
                setActivePage(1);
              }}
            >
              <SelectTrigger className="w-full border-teal-500">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 20 }).map((_, index) => (
                <MovieCardSkeleton key={index} />
              ))
            : data?.map((item) => (
                <MovieCard key={item.id} item={item} type={item.media_type} />
              ))}
        </div>

        {!loading && totalPages > 1 && (
          <PaginationComponent
            activePage={activePage}
            totalPages={totalPages}
            setActivePage={setActivePage}
          />
        )}
      </div>

      <Footer />
    </>
  );
}
