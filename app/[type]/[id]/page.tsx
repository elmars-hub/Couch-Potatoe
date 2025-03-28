import { fetchDetails, MediaType, MovieDetails, TVDetails } from "@/lib/movies";
import { notFound } from "next/navigation";
import Image from "next/image";
import CreditsSection from "@/components/ui/functional/credits-section";
import BookmarkButton from "@/components/ui/functional/bookmark-button";

interface Props {
  params: {
    type: string;
    id: string;
  };
}

interface Genre {
  id: number;
  name: string;
}

function isMovie(details: MovieDetails | TVDetails): details is MovieDetails {
  return "title" in details && "release_date" in details;
}

async function getDetails(
  type: string,
  id: string
): Promise<MovieDetails | TVDetails> {
  if (type !== "movie" && type !== "tv") {
    notFound();
  }

  try {
    return await fetchDetails(type as MediaType, parseInt(id));
  } catch (error) {
    console.error(`Failed to fetch media details: ${error}`);
    notFound();
  }
}

export default async function MediaDetailsPage({ params }: Props) {
  const { type, id } = params;
  const details = await getDetails(type, id);

  // Debugging: Check if credits are present
  console.log("Details object:", details);

  if (!details.credits) {
    console.error("Credits data is missing from the details object.");
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
        <BookmarkButton mediaId={parseInt(id)} mediaType={type} title={title} />
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

          <CreditsSection
            cast={details.credits?.cast ?? []}
            crew={details.credits?.crew ?? []}
          />
        </div>
      </div>
    </div>
  );
}
