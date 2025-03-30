// // components/BookmarkButton.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useAuthentication } from "@/context/AuthenticationContext";
// import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface BookmarkButtonProps {
//   mediaId: string;
//   mediaType: "movie" | "tv";
//   title: string;
//   className?: string;
// }

// export const BookmarkButton = ({
//   mediaId,
//   mediaType,
//   title,
// }: BookmarkButtonProps) => {
//   const { user } = useAuthentication();
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const checkBookmark = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from("bookmarks")
//           .select("*")
//           .eq("user_id", user.id)
//           .eq("media_id", mediaId)
//           .single();

//         setIsBookmarked(!!data);
//       } catch (err) {
//         setError("Failed to check bookmark status");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkBookmark();
//   }, [user, mediaId]);

//   const toggleBookmark = async () => {
//     if (!user) return;

//     try {
//       setLoading(true);
//       if (isBookmarked) {
//         await supabase
//           .from("bookmarks")
//           .delete()
//           .eq("user_id", user.id)
//           .eq("media_id", mediaId);
//       } else {
//         await supabase.from("bookmarks").insert({
//           user_id: user.id,
//           media_id: mediaId,
//           media_type: mediaType,
//           title: title,
//         });
//       }
//       setIsBookmarked(!isBookmarked);
//     } catch (err) {
//       setError("Failed to update bookmark");
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
//       onClick={toggleBookmark}
//       disabled={loading}
//       aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
//     >
//       {isBookmarked ? (
//         <BookmarkCheck className="h-5 w-5 text-blue-500 fill-blue-500" />
//       ) : (
//         <Bookmark className="h-5 w-5 text-gray-500" />
//       )}
//     </Button>
//   );
// };
