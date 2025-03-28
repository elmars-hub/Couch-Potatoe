"use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function Home() {
  // const { user, signOut, getUserDisplayName } = useAuth();
  // const [displayName, setDisplayName] = useState("");
  // const router = useRouter();

  // Redirect to login if user is not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/auth/login");
  //   }
  // }, [user, router]);

  // Fetch display name only if the user is authenticated
  // useEffect(() => {
  //   if (user) {
  //     const fetchDisplayName = async () => {
  //       const name = await getUserDisplayName();
  //       setDisplayName(name);
  //     };
  //     fetchDisplayName();
  //   }
  // }, [user, getUserDisplayName]);

  // if (!user) return null;

  return (
    <div>
      <h1>Welcome to CouchPotato</h1>
      {/* <p>Hello, {displayName || ""}!</p>
      <button
        onClick={async () => {
          await signOut();
          router.push("/auth/login");
        }}
      >
        Logout
      </button> */}
    </div>
  );
}
