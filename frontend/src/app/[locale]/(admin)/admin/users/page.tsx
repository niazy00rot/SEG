"use client";

import { useTranslations } from "next-intl";
import { RiAdminFill } from "react-icons/ri";
import { FaUserCog, FaUser } from "react-icons/fa";


import "../admin.scss";
import "./users.scss";
import Link from "next/dist/client/link";

export default function Home() {
  const t = useTranslations("admin.user");


  return (
    <section className="admin" id="admin">
      <div className="container">

        <div className="admin-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>

        <div className="admin-grid">

          <Link href="/admin/users/admin" className="admin-card">
            <div className="admin-card-icon"><RiAdminFill /></div>
            <h2>{t("admin.title")}</h2>
            <p>{t("admin.description")}</p>
          </Link>

          <Link href="/admin/users/employee" className="admin-card">
            <div className="admin-card-icon"><FaUserCog /></div>
            <h2>{t("employee.title")}</h2>
            <p>{t("employee.description")}</p>
          </Link>

          <Link href="/admin/users/customer" className="admin-card">
            <div className="admin-card-icon"><FaUser /></div>
            <h2>{t("customer.title")}</h2>
            <p>{t("customer.description")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}