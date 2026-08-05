import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  return {
    locale,
    messages: {
      navbar: (await import(`../messages/${locale}/navbar.json`)).default,
      footer: (await import(`../messages/${locale}/footer.json`)).default,
      landing: (await import(`../messages/${locale}/landing.json`)).default
    }
  };
});
