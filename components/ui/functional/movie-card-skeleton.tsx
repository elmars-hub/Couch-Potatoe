import { Card } from "../card";
import { Skeleton } from "../skeleton";

const MovieCardSkeleton = () => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:z-10 border-0">
      <div className="relative aspect-[2/3]">
        <Skeleton className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/90 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <div className="p-2 text-center">
            <Skeleton className="h-4 w-3/4 mx-auto mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            <Skeleton className="h-3 w-1/4 mx-auto mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
              <Skeleton className="h-4 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MovieCardSkeleton;
