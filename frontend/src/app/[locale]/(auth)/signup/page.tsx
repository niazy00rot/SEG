"use client";

import "../auth.scss";
import { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";


export default function Signup() {
  const t = useTranslations("auth");
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    };

    const response = await fetch( `${process.env.API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log(result);
  }

  return (
    <>
      <section className="signup">
        <div className="left">
          <div className="container">
            <h1>
              {t.rich("signup.title", {
                highlight: (chunks) => (
                  <span className="highlight">{chunks}</span>
                ),
              })}
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
            <h1>Create Your SEG Account</h1>
            <p>Start shopping genuine parts in minutes.</p>

            <div className="google"><FcGoogle />Sign up with Google</div>
            <div className="email">Or sign up with email</div>

            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" />
              <input type="email" name="email" placeholder="Email" />
              <input type="password" name="password" placeholder="Password" />
              <input type="tel" name="phone" placeholder="Phone" />

              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}