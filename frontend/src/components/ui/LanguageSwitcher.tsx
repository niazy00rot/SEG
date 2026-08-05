"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function changeLanguage() {
    const newLocale = locale === "en" ? "ar" : "en";

    router.replace(pathname, {
      locale: newLocale,
    });
  }

  return (
    <button onClick={changeLanguage}>
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
