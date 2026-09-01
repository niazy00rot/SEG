"use client";

import "../cars.scss";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Swal, { type SweetAlertTheme } from "sweetalert2";
import { useTheme } from "next-themes";

type Brand = {
  id: string;
  name: string;
};

type Model = {
  id: string;
  name: string;
  brand_id: string;
};

export default function AddVehiclePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("admin.cars");

  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const [brandsResponse, modelsResponse] =
          await Promise.all([
            fetch(`${API_URL}/brand`, {
              credentials: "include",
            }),
            fetch(`${API_URL}/model`, {
              credentials: "include",
            }),
          ]);

        if (!brandsResponse.ok || !modelsResponse.ok) {
          throw new Error("Failed to fetch brands or models");
        }

        const brandsData = await brandsResponse.json();
        const modelsData = await modelsResponse.json();

        setBrands(brandsData.brands || []);
        setModels(modelsData.models || []);
      } catch (error) {
        console.error(
          "Error fetching brands and models:",
          error,
        );
      }
    };

    getData();
  }, [API_URL]);

  const filteredModels = models.filter(
    (model) => model.brand_id === brandId,
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!brandId || !modelId || !year) {
      await Swal.fire({
        title: t("alerts.addErrorTitle"),
        text: t("alerts.validation"),
        icon: "warning",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          brand_id: brandId,
          model_id: modelId,
          year,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add vehicle",
        );
      }

      await Swal.fire({
        title: t("alerts.addSuccessTitle"),
        text: t("alerts.addSuccessText"),
        icon: "success",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });

      router.push("/admin/cars");
    } catch (error) {
      console.error("Error adding vehicle:", error);

      await Swal.fire({
        title: t("alerts.addErrorTitle"),
        text:
          error instanceof Error
            ? error.message
            : t("alerts.addErrorText"),
        icon: "error",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="addVehiclePage">
      <div className="container">
        <div className="addVehicleCard">
          <div className="pageHeader">
            <button
              className="backButton"
              onClick={() => router.push("/admin/cars")}
            >
              ← {t("back")}
            </button>

            <h1>{t("addVehicle")}</h1>

            <p>
              {t("addDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="brand">
                {t("brand")}
              </label>

              <select
                id="brand"
                value={brandId}
                onChange={(event) => {
                  setBrandId(event.target.value);
                  setModelId("");
                }}
              >
                <option value="">
                  {t("selectBrand")}
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
              <label htmlFor="model">
                {t("model")}
              </label>

              <select
                id="model"
                value={modelId}
                disabled={!brandId}
                onChange={(event) =>
                  setModelId(event.target.value)
                }
              >
                <option value="">
                  {brandId
                    ? t("selectModel")
                    : t("selectBrandFirst")}
                </option>

                {filteredModels.map((model) => (
                  <option
                    key={model.id}
                    value={model.id}
                  >
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label htmlFor="year">
                {t("year")}
              </label>

              <input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2024"
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
              />
            </div>

            <div className="formActions">
              <button
                type="button"
                className="cancelButton"
                onClick={() =>
                  router.push("/admin/cars")
                }
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >
                {loading
                  ? t("saving")
                  : t("addVehicle")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}