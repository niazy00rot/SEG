"use client";

import "../auth.scss";
import { FormEvent } from "react";

export default function Signup() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value,
    };

    const response = await fetch("http://localhost:3001/register", {
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
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <input type="tel" name="phone" placeholder="Phone" />

      <button type="submit">Sign Up</button>
    </form>
  );
}