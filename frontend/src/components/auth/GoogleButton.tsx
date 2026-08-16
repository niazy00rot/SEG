"use client";

import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";

export default function GoogleAuth() {
  const t = useTranslations("auth.login");

  return (
    <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`} className="google">
      <FcGoogle />
      {t("google")}
    </a>
  );
}