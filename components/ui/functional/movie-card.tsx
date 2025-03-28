import Image from "next/image";
import Link from "next/link";
import { Card } from "../card";
import MovieOverlay from "./movie-overlay";

interface MovieCardProps {
  item: {
    media_type: string;
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    vote_average: number;
  };
  type: string;
}

const MovieCard = ({ item, type }: MovieCardProps) => {
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/images/placeholder.jpg";

  return (
    <Link href={`/${type}/${item.id}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:z-10">
        <div className="relative aspect-[3/4]">
          <Image
            src={imageUrl}
            alt={item.title || item.name || "Movie/Show"}
            fill
            sizes="100"
            className="object-cover"
            priority
          />
          <MovieOverlay item={item} />
        </div>
      </Card>
    </Link>
  );
};

export default MovieCard;
