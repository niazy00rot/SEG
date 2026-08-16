import { getRequestConfig } from "next-intl/server";

import enNavbar from "../messages/en/navbar.json";
import enFooter from "../messages/en/footer.json";
import enLanding from "../messages/en/landing.json";
import enAuth from "../messages/en/auth.json";
import enAdmin from "../messages/en/admin.json";

import arNavbar from "../messages/ar/navbar.json";
import arFooter from "../messages/ar/footer.json";
import arLanding from "../messages/ar/landing.json";
import arAuth from "../messages/ar/auth.json";
import arAdmin from "../messages/ar/admin.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (locale !== "en" && locale !== "ar") {
    return {
      locale: "en",
      messages: {
        navbar: enNavbar,
        footer: enFooter,
        landing: enLanding,
        auth: enAuth,
        admin: enAdmin,
      },
    };
  }

  return {
    locale,
    messages:
      locale === "ar"
        ? {
            navbar: arNavbar,
            footer: arFooter,
            landing: arLanding,
            auth: arAuth,
            admin: arAdmin,
          }
        : {
            navbar: enNavbar,
            footer: enFooter,
            landing: enLanding,
            auth: enAuth,
            admin: enAdmin,
          },
  };
});