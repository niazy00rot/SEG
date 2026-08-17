import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import ThemeProvider from "@/providers/ThemeProvider";
import { getMessages } from "next-intl/server";
import { Cairo } from "next/font/google";
import AppButton from "@/components/ui/AppButton";
import "./globals.scss";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "SEG",
    description:
      locale === "en"
        ? "Your trusted online store for quality car spare parts, accessories, and replacement components."
        : "متجرك الموثوق عبر الإنترنت لقطع غيار السيارات عالية الجودة والإكسسوارات والمكونات البديلة.",
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <AppButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
