import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      navbar: (await import(`../messages/${locale}/navbar.json`)).default,
      footer: (await import(`../messages/${locale}/footer.json`)).default,
      landing: (await import(`../messages/${locale}/landing.json`)).default
    }
  };
});
