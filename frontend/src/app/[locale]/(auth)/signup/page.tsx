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
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      newErrors.name = "Name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com)$/i;
    if (!formDataState.email.trim()) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(formDataState.email)) {
      newErrors.email = "Please use a valid email ending with @gmail.com or @outlook.com.";
      isValid = false;
    }

    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!formDataState.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!phoneRegex.test(formDataState.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
      isValid = false;
    }

    if (!formDataState.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formDataState.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (!formDataState.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formDataState.password !== formDataState.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
      isValid = false;
    }

    if (!formDataState.terms) {
      newErrors.terms = "You must agree to the terms and privacy policy.";
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

    const response = await fetch(`${process.env.API_URL}/register`, {
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
            <h1>Join 80,000+</h1>
            <h1><span>Drivers</span> Who</h1>
            <h1>Trust SEG.</h1>
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

            <Link href={`${process.env.API_URL}/auth/google`} className="google">
              <FcGoogle />Sign up with Google
            </Link>
            <div className="email">Or sign up with email</div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formDataState.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@gmail.com"
                  value={formDataState.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+20 123 456 7890"
                  value={formDataState.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formDataState.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formDataState.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
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
                    I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
                    <Link href="/privacy">Privacy Policy</Link>.
                  </label>
                </div>
                {errors.terms && <span className="error-msg">{errors.terms}</span>}
              </div>

              <button type="submit">Sign Up</button>
            </form>

            <p>Already have an account? <Link href="/login">Login</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}