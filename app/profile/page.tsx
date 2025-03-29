"use client";

import Auth from "@/middleware/Auth";

const Page = () => {
  return (
    <Auth>
      <div className="">Profile Page</div>
    </Auth>
  );
};

export default Page;
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
