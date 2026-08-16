"use client";

import "../auth.scss";
import { FormEvent, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Signup() {
  const t = useTranslations("auth");

  const [formDataState, setFormDataState] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormDataState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };

    let isValid = true;

    if (!formDataState.name.trim()) {
      newErrors.name = t("signup.name.error");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com)$/i;

    if (!formDataState.email.trim()) {
      newErrors.email = t("signup.email.errorRequired");
      isValid = false;
    } else if (!emailRegex.test(formDataState.email)) {
      newErrors.email = t("signup.email.errorInvalid");
      isValid = false;
    }

    const phoneRegex = /^\+[1-9]\d{7,14}$/;

    if (!formDataState.phone.trim()) {
      newErrors.phone = t("signup.phone.errorRequired");
      isValid = false;
    } else if (!phoneRegex.test(formDataState.phone)) {
      newErrors.phone = t("signup.phone.errorInvalid");
      isValid = false;
    }

    if (!formDataState.password) {
      newErrors.password = t("signup.password.errorRequired");
      isValid = false;
    } else if (formDataState.password.length < 8) {
      newErrors.password = t("signup.password.errorMinLength");
      isValid = false;
    }

    if (!formDataState.confirmPassword) {
      newErrors.confirmPassword = t(
        "signup.confirmPassword.errorRequired"
      );
      isValid = false;
    } else if (
      formDataState.password !== formDataState.confirmPassword
    ) {
      newErrors.confirmPassword = t(
        "signup.confirmPassword.errorMismatch"
      );
      isValid = false;
    }

    if (!formDataState.terms) {
      newErrors.terms = t("signup.terms.error");
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const data = {
      name: formDataState.name,
      email: formDataState.email,
      password: formDataState.password,
      phone: formDataState.phone,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      console.log(result);
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <section className="signup">
      <div className="left">
        <div className="container">
          <h1>
            {t("signup.title")}
          </h1>

          <p>{t("signup.paragraph")}</p>

          <ul>
            <li>{t("signup.ul.li1")}</li>
            <li>{t("signup.ul.li2")}</li>
            <li>{t("signup.ul.li3")}</li>
            <li>{t("signup.ul.li4")}</li>
          </ul>
        </div>
      </div>

      <div className="right">
        <div className="container">
          <h1>{t("signup.heading")}</h1>

          <p>{t("signup.description")}</p>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="google"
          >
            <FcGoogle />
            {t("signup.google")}
          </a>

          <div className="email">
            {t("signup.orEmail")}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="name">
                {t("signup.name.label")}
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder={t("signup.name.placeholder")}
                value={formDataState.name}
                onChange={handleChange}
              />

              {errors.name && (
                <span className="error-msg">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">
                {t("signup.email.label")}
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder={t("signup.email.placeholder")}
                value={formDataState.email}
                onChange={handleChange}
              />

              {errors.email && (
                <span className="error-msg">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="phone">
                {t("signup.phone.label")}
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={t("signup.phone.placeholder")}
                value={formDataState.phone}
                onChange={handleChange}
              />

              {errors.phone && (
                <span className="error-msg">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">
                {t("signup.password.label")}
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder={t("signup.password.placeholder")}
                value={formDataState.password}
                onChange={handleChange}
              />

              {errors.password && (
                <span className="error-msg">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">
                {t("signup.confirmPassword.label")}
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t(
                  "signup.confirmPassword.placeholder"
                )}
                value={formDataState.confirmPassword}
                onChange={handleChange}
              />

              {errors.confirmPassword && (
                <span className="error-msg">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="terms-container">
              <div className="terms-group">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  checked={formDataState.terms}
                  onChange={handleChange}
                />

                <label htmlFor="terms">
                  {t("signup.terms.text")}{" "}
                  <Link href="/terms">
                    {t("signup.terms.terms")}
                  </Link>{" "}
                  {t("signup.terms.and")}{" "}
                  <Link href="/privacy">
                    {t("signup.terms.privacy")}
                  </Link>
                  .
                </label>
              </div>

              {errors.terms && (
                <span className="error-msg">
                  {errors.terms}
                </span>
              )}
            </div>

            <button type="submit">
              {t("signup.submit")}
            </button>
          </form>

          <p>
            {t("signup.loginPrompt")}{" "}
            <Link href="/login">
              {t("signup.login")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}