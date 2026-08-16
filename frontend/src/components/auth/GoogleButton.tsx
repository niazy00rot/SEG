"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.login");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) return;

    localStorage.setItem("token", token);

    router.replace("/");
  }, [searchParams, router]);

  return (
    <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`} className="google">
      <FcGoogle />
      {t("google")}
    </a>
  );
}