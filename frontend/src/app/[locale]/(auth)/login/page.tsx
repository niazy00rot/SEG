"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleAuth from "@/components/auth/GoogleButton";
import Link from "next/link";
import "../auth.scss";
import "./login.scss";

export default function LoginPage() {

  useEffect(() => {
    document.title = "Login | SEG";
  }, []);

  const t = useTranslations("auth.login");
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com|seg\.com)$/i;

    if (!formData.email.trim()) {
      newErrors.email = t("email.errorRequired");
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("email.errorInvalid");
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = t("password.errorRequired");
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(result.error);
        return;
      }

      if (result.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <section className="auth login">
      <div className="left">
        <div className="container">
          <h1>{t("title.one")}</h1>
          <h1>{t("title.two")}</h1>

          <p>{t("paragraph")}</p>

          <div className="boxes">
            <div className="box">
              <h2>{t("box1.title")}</h2>
              <p>{t("box1.description")}</p>
            </div>
            <div className="box">
              <h2>{t("box2.title")}</h2>
              <p>{t("box2.description")}</p>
            </div>
            <div className="box">
              <h2>{t("box3.title")}</h2>
              <p>{t("box3.description")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="container">
          <h1>{t("heading")}</h1>

          <p>{t("description")}</p>

          <GoogleAuth />

          <div className="email">{t("orEmail")}</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">
                {t("email.label")}
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder={t("email.placeholder")}
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <span className="error-msg">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">
                {t("password.label")}
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder={t("password.placeholder")}
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <span className="error-msg">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="forgot-password">
              <Link href="/forgot-password">
                {t("forgotPassword")}
              </Link>
            </div>

            <button type="submit">
              {t("submit")}
            </button>
          </form>

          <p>
            {t("signupPrompt")}{" "}
            <Link href="/signup">
              {t("signup")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}