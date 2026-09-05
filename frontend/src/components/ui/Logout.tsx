"use client";

import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      <IoIosLogOut />
    </button>
  );
}