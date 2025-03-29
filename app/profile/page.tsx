"use client";

import Auth from "@/middleware/Auth";

const Page = () => {
  return <div className="">Profile Page</div>;
};

const ProfilePage = () => {
  return (
    <Auth>
      <Page />
    </Auth>
  );
};

export default ProfilePage;
