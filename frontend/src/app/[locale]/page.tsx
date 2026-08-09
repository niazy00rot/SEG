"use client";

import Link from "next/dist/client/link";
import "./landing.scss";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("landing");

  return (
    <>
      <section className="landing" id="home">
        <div className="container">
          <div className="popup">
            <p>{t("home.popupText")}</p>
          </div>
          <h1>{t("home.homeTitle1")}</h1>
          <h1>
            {t.rich("home.homeTitle2", {
              highlight: (chunks) => (
                <span className="highlight">{chunks}</span>
              ),
            })}
          </h1>
          <p>{t("home.paragraph")}</p>

          <div className="links">
            <Link href="/parts">{t("home.button1")}<FaArrowRightLong /></Link>
            <Link href="/categories">{t("home.button2")}</Link>
          </div>

          <div className="ranks">
            <div className="box">
              <p>50,000+</p>
              <p>{t("home.ranks.one")}</p>
            </div>

            <div className="box">
              <p>200+</p>
              <p>{t("home.ranks.two")}</p>
            </div>

            <div className="box">
              <p>2M+</p>
              <p>{t("home.ranks.three")}</p>
            </div>

            <div className="box">
              <p>4.8<FaStar /></p>
              <p>{t("home.ranks.four")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
