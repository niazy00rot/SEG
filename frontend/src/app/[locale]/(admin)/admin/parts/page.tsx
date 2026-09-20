"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { IoCarSport } from "react-icons/io5";
import "./parts.scss";
import Link from "next/dist/client/link";

export default function Home() {
  const t = useTranslations("admin");
  const router = useRouter();

  return (
    <section className="partsPage" id="partsPage">
      <div className="container">
      
      </div>
    </section>
  );
}