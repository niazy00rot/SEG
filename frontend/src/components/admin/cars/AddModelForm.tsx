"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Swal, { type SweetAlertTheme } from "sweetalert2";
import { useTheme } from "next-themes";

type Brand = {
  id: string;
  name: string;
};

export default function AddModelForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const t = useTranslations("admin.cars.add.model");
  const { resolvedTheme } = useTheme();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await fetch(`${API_URL}/brands`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data = await response.json();

        setBrands(
          Array.isArray(data)
            ? data
            : data.brands || []
        );
      } catch (error) {
        console.error("Error fetching brands:", error);

        await Swal.fire({
          title: t("alerts.errorTitle"),
          text: t("alerts.loadBrandsFailed"),
          icon: "error",
          confirmButtonText: "OK",
          theme: resolvedTheme as SweetAlertTheme,
        });
      } finally {
        setLoadingBrands(false);
      }
    };

    getBrands();
  }, [API_URL, t, resolvedTheme]);

  const capitalizeModelName = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formattedName = capitalizeModelName(name);

    if (!brandId || !formattedName) {
      await Swal.fire({
        title: t("alerts.errorTitle"),
        text: t("alerts.validation"),
        icon: "warning",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });

      return;
    }

    try {
      setLoading(true);
      console.log("Brand ID:", brandId);
      console.log("Model Name:", formattedName);
      const response = await fetch(
        `${API_URL}/brands/${brandId}/models`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formattedName,
          }),
        }
      );

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || t("alerts.addFailed")
        );
      }

      setName("");

      await Swal.fire({
        title: t("alerts.successTitle"),
        text: t("alerts.successText"),
        icon: "success",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } catch (error) {
      console.error("Error adding model:", error);

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
          <label htmlFor="modelBrand">
            {t("brand")}
          </label>

          <select
            id="modelBrand"
            value={brandId}
            onChange={(event) =>
              setBrandId(event.target.value)
            }
            disabled={loadingBrands}
          >
            <option value="">
              {loadingBrands
                ? t("loadingBrands")
                : t("selectBrand")}
            </option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="modelName">
            {t("modelName")}
          </label>

          <input
            id="modelName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("placeholder")}
          />
        </div>

        <button
          type="submit"
          className="submitButton"
          disabled={loading || loadingBrands}
        >
          {loading
            ? t("saving")
            : t("addModel")}
        </button>
      </form>
    </div>
  );
}