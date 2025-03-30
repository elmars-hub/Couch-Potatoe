"use client";

import { useAuthentication } from "@/context/AuthenticationContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const LogoutConfirmation = () => {
  const { logout } = useAuthentication();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Use replace instead of push to prevent back navigation
    router.replace("/");
    // Force a hard refresh to clear any residual state
    window.location.assign("/");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          Logout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Confirm Logout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to log out? You&apos;ll need to sign in again
            to access your account.
          </p>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() =>
                document.body.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "Escape" })
                )
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Confirm Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
