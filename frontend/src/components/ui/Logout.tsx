"use client";

import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";

type LogoutButtonProps = {
  onLoggedOut?: () => void;
};

export default function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
      }

      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      onLoggedOut?.();
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
