// // components/FavoriteButton.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useAuthentication } from "@/context/AuthenticationContext";
// import { Heart, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export const FavoriteButton = ({ movieId }: { movieId: string }) => {
//   const { user } = useAuthentication();
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const checkFavorite = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from("favorites")
//           .select("*")
//           .eq("user_id", user.id)
//           .eq("movie_id", movieId)
//           .single();

//         setIsFavorite(!!data);
//       } catch (err) {
//         setError("Failed to check favorite status");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkFavorite();
//   }, [user, movieId]);

//   const toggleFavorite = async () => {
//     if (!user) return;

//     try {
//       setLoading(true);
//       if (isFavorite) {
//         await supabase
//           .from("favorites")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("movie_id", movieId);
//       } else {
//         await supabase
//           .from("favorites")
//           .insert({ user_id: user.id, movie_id: movieId });
//       }
//       setIsFavorite(!isFavorite);
//     } catch (err) {
//       setError("Failed to update favorite");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
//   if (error) return <div className="text-red-500 text-sm">{error}</div>;

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={toggleFavorite}
//       disabled={loading}
//     >
//       {isFavorite ? (
//         <Heart className="h-5 w-5 text-red-500 fill-red-500" />
//       ) : (
//         <Heart className="h-5 w-5 text-gray-500" />
//       )}
//     </Button>
//   );
// };
