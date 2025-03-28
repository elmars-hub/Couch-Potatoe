"use client";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface CreditsSectionProps {
  cast: CastMember[];
  crew: CrewMember[];
}

export default function CreditsSection({ cast, crew }: CreditsSectionProps) {
  const directors = crew.filter((member) => member.job === "Director");
  const writers = crew.filter(
    (member) =>
      member.job === "Screenplay" ||
      member.job === "Writer" ||
      member.department === "Writing"
  );

  return (
    <div className="space-y-6">
      {cast.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Cast</h3>
          <div className="space-y-2">
            {cast.slice(0, 6).map((member) => (
              <div key={member.id} className="text-sm">
                <span className="font-medium">{member.name}</span>
                {member.character && (
                  <span className="text-gray-500"> as {member.character}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {directors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Director{directors.length > 1 ? "s" : ""}
          </h3>
          <div className="space-y-1">
            {directors.map((director) => (
              <div key={director.id} className="text-sm">
                {director.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {writers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Writer{writers.length > 1 ? "s" : ""}
          </h3>
          <div className="space-y-1">
            {writers.map((writer) => (
              <div key={writer.id} className="text-sm">
                {writer.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
