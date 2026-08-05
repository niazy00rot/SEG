import type { Metadata } from "next";
import {NextIntlClientProvider} from "next-intl";
import ThemeProvider from "@/providers/ThemeProvider";
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEG",
  description:
    "Your trusted online store for quality car spare parts, accessories, and replacement components.",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[local]">) {
  const { local } = await params;
  const messages = await getMessages();

  return (
    <html lang={local} dir={local === "ar" ? "rtl" : "ltr"} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
