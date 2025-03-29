"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 rounded-full bg-gray-300 text-black cursor-pointer "
    >
      <ChevronLeft />
    </button>
  );
}
