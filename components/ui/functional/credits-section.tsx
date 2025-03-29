"use client";

import Image from "next/image";
import { Cast, Crew } from "@/lib/movies";

interface CreditsSectionProps {
  cast: Cast[];
  crew: Crew[];
}

export default function CreditsSection({ cast, crew }: CreditsSectionProps) {
  const mainCrew = crew.filter(
    (member) =>
      member.job === "Director" ||
      member.job === "Producer" ||
      member.job === "Screenplay" ||
      member.job === "Writer"
  );

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-3">Cast & Crew</h2>

      {/* Main Crew */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 text-gray-600">Main Crew</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {mainCrew.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              {member.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${member.profile_path}`}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.job}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cast */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-600">Cast</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {cast.slice(0, 6).map((actor) => (
            <div key={actor.id} className="text-center">
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  width={92}
                  height={138}
                  className="rounded-lg mb-1"
                />
              ) : (
                <div className="w-[92px] h-[138px] rounded-lg bg-gray-200 flex items-center justify-center mb-1">
                  <span className="text-gray-500 text-xl">
                    {actor.name.charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-sm font-medium truncate">{actor.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
