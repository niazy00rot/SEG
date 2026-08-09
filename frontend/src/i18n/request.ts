import { getRequestConfig } from "next-intl/server";

import enNavbar from "../messages/en/navbar.json";
import enFooter from "../messages/en/footer.json";
import enLanding from "../messages/en/landing.json";
import enAuth from "../messages/en/auth.json";

import arNavbar from "../messages/ar/navbar.json";
import arFooter from "../messages/ar/footer.json";
import arLanding from "../messages/ar/landing.json";
import arAuth from "../messages/ar/auth.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  return {
    locale,
    messages:
      locale === "ar"
        ? {
            navbar: arNavbar,
            footer: arFooter,
            landing: arLanding,
            auth: arAuth,
          }
        : {
            navbar: enNavbar,
            footer: enFooter,
            landing: enLanding,
            auth: enAuth,
          },
  };
});