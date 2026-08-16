"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { IoCarSport } from "react-icons/io5";
import "./cars.scss";
import Link from "next/dist/client/link";

export default function Home() {
  const t = useTranslations("admin");
  const router = useRouter();

  return (
    <section className="admin" id="admin">
      <div className="container">

        <div className="admin-header">
          <h1>{t("landing.title")}</h1>
          <p>{t("landing.description")}</p>
        </div>

        <div className="admin-grid">

          <Link href="/admin/users" className="admin-card">
            <div className="admin-card-icon"><FaUsers /></div>
            <h2>{t("landing.title")}</h2>
            <p>{t("landing.description")}</p>
          </Link>

          <Link href="/admin/parts" className="admin-card">
            <div className="admin-card-icon"><HiWrenchScrewdriver /></div>
            <h2>{t("landing.title")}</h2>
            <p>{t("landing.description")}</p>
          </Link>

          <Link href="/admin/cars" className="admin-card">
            <div className="admin-card-icon"><IoCarSport /></div>
            <h2>{t("landing.title")}</h2>
            <p>{t("landing.description")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}