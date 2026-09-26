"use client";

import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import Swal from "sweetalert2";

type LogoutButtonProps = {
  onLoggedOut?: () => void;
};

export default function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
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

      onLoggedOut?.();

      await Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        text: "You have been logged out.",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);

      await Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <button onClick={handleLogout}>
      <IoIosLogOut />
    </button>
  );
}