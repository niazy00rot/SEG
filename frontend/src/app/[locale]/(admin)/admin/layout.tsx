"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          credentials: "include",
        });

        if (response.status === 401 || response.status === 403) {
          router.replace("/unauthorized");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to verify authentication");
        }

        const data = await response.json();

        if (data.user.role !== "Admin") {
          router.replace("/unauthorized");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/login");
      }
    };

    checkAdmin();
  }, [API_URL, router]);

  if (loading) {
    return <div>Checking authorization...</div>;
  }

  return <>{children}</>;
}