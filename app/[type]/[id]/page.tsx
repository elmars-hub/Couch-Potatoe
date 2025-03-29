"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  fetchDetails,
  fetchCredits,
  MediaType,
  MovieDetails,
  TVDetails,
  Cast,
  Crew,
} from "@/lib/movies";
import CreditsSection from "@/components/ui/functional/credits-section";
import BookmarkButton from "@/components/ui/functional/bookmark-button";
import { useAuthentication } from "@/context/AuthenticationContext";
import Auth from "@/middleware/Auth";

interface Genre {
  id: number;
  name: string;
}

function isMovie(details: MovieDetails | TVDetails): details is MovieDetails {
  return "title" in details && "release_date" in details;
}

type Param = {
  type: string;
  id: string;
};

function Page() {
  const params = useParams<Param>();
  const type = params ? params.type : null;
  const id = params ? params.id : null;

  const [details, setDetails] = useState<MovieDetails | TVDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  const { checkAuth } = useAuthentication();
  const isAuth = checkAuth();

  // Fetch media details
  useEffect(() => {
    async function loadDetails() {
      setIsLoading(true);

      if (type !== "movie" && type !== "tv") {
        setError("Invalid media type");
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetchDetails(type as MediaType, parseInt(id));
        setDetails(result);
        console.log("Details loaded:", result);
      } catch (err) {
        console.error(`Failed to fetch media details: ${err}`);
        setError("Failed to load media details");
      } finally {
        setIsLoading(false);
      }
    }

    if (type && id) {
      loadDetails();
    }
  }, [type, id]);

  // Fetch credits separately
  useEffect(() => {
    async function loadCredits() {
      setCreditsLoading(true);

      if (type !== "movie" && type !== "tv") {
        setCreditsError("Invalid media type");
        setCreditsLoading(false);
        return;
      }

      try {
        const credits = await fetchCredits(type as MediaType, parseInt(id));
        console.log("Credits loaded:", credits);

        if (credits && typeof credits === "object") {
          // Check for cast property
          if ("cast" in credits && Array.isArray(credits.cast)) {
            setCast(credits.cast);
          } else {
            console.warn("No cast found in credits data");
            setCast([]);
          }

          // Check for crew property
          if ("crew" in credits && Array.isArray(credits.crew)) {
            setCrew(credits.crew);
          } else {
            console.warn("No crew found in credits data");
            setCrew([]);
          }
        } else {
          console.warn("Credits data is not in the expected format");
          setCast([]);
          setCrew([]);
        }
      } catch (err) {
        console.error(`Failed to fetch credits: ${err}`);
        setCreditsError("Failed to load cast and crew information");
        setCast([]);
        setCrew([]);
      } finally {
        setCreditsLoading(false);
      }
    }

    if (type && id) {
      loadCredits();
    }
  }, [type, id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg text-red-500">
          {error || "Something went wrong"}
        </p>
      </div>
    );
  }

  const title = isMovie(details) ? details.title : details.name;
  const releaseDate = isMovie(details)
    ? details.release_date
    : details.first_air_date;

  const imageUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "/placeholder-poster.jpg";

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isAuth && (
          <BookmarkButton
            mediaId={parseInt(id)}
            mediaType={type}
            title={title}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Image
            src={imageUrl}
            alt={`Poster for ${title}`}
            className="rounded-lg shadow-lg"
            width={500}
            height={750}
            priority
          />
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">{details.overview}</p>

          <div className="flex flex-wrap gap-2">
            {details.genres.map((genre: Genre) => (
              <span
                key={genre.id}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                aria-label={`Genre: ${genre.name}`}
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              Rating:{" "}
              {details.vote_average ? details.vote_average.toFixed(1) : "N/A"} /
              10
            </p>
            <p className="text-sm text-gray-500">
              Release Date: {releaseDate || "Unknown"}
            </p>
          </div>

          {creditsLoading ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-3">Cast & Crew</h2>
              <p className="text-sm text-gray-500">
                Loading cast and crew information...
              </p>
            </div>
          ) : creditsError ? (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-3">Cast & Crew</h2>
              <p className="text-sm text-gray-500">{creditsError}</p>
            </div>
          ) : cast.length > 0 || crew.length > 0 ? (
            <CreditsSection cast={cast} crew={crew} />
          ) : (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-3">Cast & Crew</h2>
              <p className="text-sm text-gray-500">
                No cast or crew information available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MediaDetailsPage = () => {
  return (
    <Auth>
      <Page />
    </Auth>
  );
};

export default MediaDetailsPage;
