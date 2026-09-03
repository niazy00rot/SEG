"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Swal, { type SweetAlertTheme } from "sweetalert2";
import { useTheme } from "next-themes";

type Brand = {
  id: string;
  name: string;
};

export default function AddBrandForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const t = useTranslations("admin.cars.add.brand");
  const { resolvedTheme } = useTheme();

  const [name, setName] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const capitalizeBrandName = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formattedName = capitalizeBrandName(name);

    if (!formattedName) {
      await Swal.fire({
        title: t("alerts.errorTitle"),
        text: t("alerts.required"),
        icon: "warning",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });

      return;
    }

    const exists = brands.some(
      (brand) =>
        brand.name.trim().toLowerCase() ===
        formattedName.toLowerCase()
    );

    if (exists) {
      await Swal.fire({
        title: t("alerts.errorTitle"),
        text: t("alerts.alreadyExists"),
        icon: "warning",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formattedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("alerts.addFailed")
        );
      }

      const newBrand = data.brand || data;

      setBrands((prev) => [...prev, newBrand]);
      setName("");

      await Swal.fire({
        title: t("alerts.successTitle"),
        text: t("alerts.successText"),
        icon: "success",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } catch (error) {
      console.error("Error adding brand:", error);

      await Swal.fire({
        title: t("alerts.errorTitle"),
        text:
          error instanceof Error
            ? error.message
            : t("alerts.addFailed"),
        icon: "error",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addCard">
      <div className="pageHeader">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="brandName">
            {t("brandName")}
          </label>

          <input
            id="brandName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("placeholder")}
          />
        </div>

        <button
          type="submit"
          className="submitButton"
          disabled={loading}
        >
          {loading
            ? t("saving")
            : t("addBrand")}
        </button>
      </form>
    </div>
  );
}