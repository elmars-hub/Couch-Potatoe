"use client";

import {
  fetchTrending,
  type TrendingResult,
  type TimeWindow,
} from "@/lib/movies";
import { useEffect, useState } from "react";
import MovieCard from "@/components/ui/functional/movie-card";
import { Button } from "@/components/ui/button";
import MovieCardSkeleton from "@/components/ui/functional/movie-card-skeleton";
import Header from "@/components/ui/functional/header";

export default function Home() {
  // const [displayName, setDisplayName] = useState("");
  // const router = useRouter();
  const [data, setData] = useState<TrendingResult[]>([]);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrending(timeWindow)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeWindow]);

  console.log(data, "data");

  // // Redirect to login if user is not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/auth/login");
  //   }
  // }, [user, router]);

  // Fetch display name only if the user is authenticated
  // useEffect(() => {
  //   if (user) {
  //     const fetchDisplayName = async () => {
  //       const name = await getUserDisplayName();
  //       setDisplayName(name);
  //     };
  //     fetchDisplayName();
  //   }
  // }, [user, getUserDisplayName]);

  // if (!user) return null;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-baseline gap-4 mb-10">
          <h2 className="text-xl font-semibold uppercase text-card-foreground">
            Trending
          </h2>
          <div className="flex items-center gap-2 border border-teal-500 rounded-full">
            <Button
              variant={timeWindow === "day" ? "secondary" : "ghost"}
              className="rounded-full px-3 py-1"
              onClick={() => setTimeWindow("day")}
            >
              Today
            </Button>
            <Button
              variant={timeWindow === "week" ? "secondary" : "ghost"}
              className="rounded-full px-3 py-1"
              onClick={() => setTimeWindow("week")}
            >
              This Week
            </Button>
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
      </div>

      {/* {loading && <div>Loading...</div>} */}
    </>
  );
}
