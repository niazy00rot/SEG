"use client";

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

export default function AddVehicleForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("admin.cars.add.vehicle");

  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingData(true);

        const brandsResponse = await fetch(`${API_URL}/brands`, {
          credentials: "include",
        });

        if (!brandsResponse.ok) {
          throw new Error("Failed to fetch brands");
        }

        const brandsData = await brandsResponse.json();

        const fetchedBrands = Array.isArray(brandsData)
          ? brandsData
          : brandsData.brands || [];

        setBrands(fetchedBrands);

        const modelsRequests = fetchedBrands.map(
          async (brand: Brand) => {
            const response = await fetch(
              `${API_URL}/brands/${brand.id}/models`,
              {
                credentials: "include",
              }
            );

            if (!response.ok) return [];

            const data = await response.json();

            const brandModels = Array.isArray(data)
              ? data
              : data.models || [];

            return brandModels.map((model: Model) => ({
              ...model,
              brand_id: brand.id,
            }));
          }
        );

        const modelsResults = await Promise.all(modelsRequests);

        setModels(modelsResults.flat());
      } catch (error) {
        console.error("Error fetching brands and models:", error);

        await Swal.fire({
          title: t("alerts.addErrorTitle"),
          text: t("alerts.addErrorText"),
          icon: "error",
          confirmButtonText: "OK",
          theme: resolvedTheme as SweetAlertTheme,
        });
      } finally {
        setLoadingData(false);
      }
    };

    getData();
  }, [API_URL, t, resolvedTheme]);

  const filteredModels = models.filter(
    (model) => String(model.brand_id) === String(brandId)
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
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
          year: Number(year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add vehicle"
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
    <div className="addCard">
      <div className="pageHeader">
        <h1>{t("addVehicle")}</h1>

        <p>{t("addDescription")}</p>
      </div>

      {loadingData ? (
        <div className="loading">Loading...</div>
      ) : (
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

            <select
              id="year"
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
            >
              <option value="">
                {t("selectYear")}
              </option>

              {Array.from(
                {
                  length:
                    new Date().getFullYear() + 1 - 1989,
                },
                (_, index) =>
                  new Date().getFullYear() + 1 - index
              ).map((vehicleYear) => (
                <option
                  key={vehicleYear}
                  value={vehicleYear}
                >
                  {vehicleYear}
                </option>
              ))}
            </select>
          </div>

          <div className="formActions">
            <button
              type="button"
              className="cancelButton"
              onClick={() => router.push("/admin/cars")}
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
      )}
    </div>
  );
}