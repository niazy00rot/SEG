"use client";

import { useTranslations } from "next-intl";
import { FaUsers } from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { IoCarSport } from "react-icons/io5";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin.scss";
import Link from "next/link";

export default function Admin() {
  const t = useTranslations("admin");

  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          router.replace("/");
          return;
        }

        const data = await response.json();

        if (data.role !== "Admin") {
          router.replace("/");
          return;
        }

      } catch (error) {
        console.error("Authentication error:", error);
        router.replace("/login");
      }
    }

    checkAdmin();
  }, [router]);

  return (
    <section className="admin" id="admin">
      <div className="container">
        <div className="admin-header">
          <h1>{t("landing.title")}</h1>
          <p>{t("landing.description")}</p>
        </div>

        <div className="admin-grid">
          <Link href="/admin/users" className="admin-card">
            <div className="admin-card-icon">
              <FaUsers />
            </div>
            <h2>{t("landing.users.title")}</h2>
            <p>{t("landing.users.description")}</p>
          </Link>

          <Link href="/admin/parts" className="admin-card">
            <div className="admin-card-icon">
              <HiWrenchScrewdriver />
            </div>
            <h2>{t("landing.parts.title")}</h2>
            <p>{t("landing.parts.description")}</p>
          </Link>

          <Link href="/admin/cars" className="admin-card">
            <div className="admin-card-icon">
              <IoCarSport />
            </div>
            <h2>{t("landing.cars.title")}</h2>
            <p>{t("landing.cars.description")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
