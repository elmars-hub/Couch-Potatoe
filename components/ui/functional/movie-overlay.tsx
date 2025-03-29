import { StarIcon } from "lucide-react";

interface MovieOverlayProps {
  item: {
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number; // Made optional with ?
  };
}

const MovieOverlay = ({ item }: MovieOverlayProps) => {
  // Safe date handling
  const dateString = item.release_date || item.first_air_date;
  const year = dateString ? new Date(dateString).getFullYear() : "N/A";

  // Safe rating handling
  const rating =
    typeof item.vote_average === "number"
      ? item.vote_average.toFixed(1)
      : "N/A";

  return (
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/90 opacity-0 transition-opacity duration-300 ease-in-out overlay">
      <div className="p-2 text-center">
        <p className="text-white">{item.title || item.name || "Untitled"}</p>
        <p className="text-green-200 text-xs">{year}</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-white">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieOverlay;
