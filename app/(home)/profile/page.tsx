"use client";

import Auth from "@/middleware/Auth";
import { useAuthentication } from "@/context/AuthenticationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { getUser } = useAuthentication();

  // Function to get the display name
  const getDisplayInfo = () => {
    const user = getUser(); // Get the user object once

    return {
      displayName: user?.user_metadata?.displayName || "User",
      email: user?.email || "No email",
    };
  };

  const { displayName, email } = getDisplayInfo();

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0]?.charAt(0) || "";
    const secondInitial = nameParts[1]?.charAt(0) || "";
    return `${firstInitial}${secondInitial}`.toUpperCase(); // Convert to uppercase
  };

  const initials = getInitials(displayName);

  return (
    <Auth>
      <div className="min-h-screen flex justify-center p-6 pt-10">
        <Card className="w-full max-w-md shadow-lg h-96">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl">Your Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={displayName} alt="Profile picture" />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <>
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="text-muted-foreground">{email}</p>
                </>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Auth>
  );
};

export default ProfilePage;
// const ProfilePage = () => {
//   return (
//     <Auth>
//       <Page />
//     </Auth>
//   );
// };

// const ProfilePage = () => {
//   return (
//     <Auth>
//       <Page />
//     </Auth>
//   );
// }
