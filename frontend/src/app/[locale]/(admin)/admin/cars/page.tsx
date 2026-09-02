"use client";

import "./cars.scss";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Swal, { type SweetAlertTheme } from "sweetalert2";
import { useTheme } from "next-themes";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: string;
};

export default function CarsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("admin.cars");

  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);

  const numberOfCars = cars.length;

  useEffect(() => {
    const getCars = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/vehicle`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();

        setCars(data.vehicles || []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    getCars();
  }, [API_URL]);

  const handleAdd = () => {
    router.push("/admin/cars/add");
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: t("alerts.deleteTitle"),
      text: t("alerts.deleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("alerts.deleteConfirm"),
      cancelButtonText: t("alerts.cancel"),
      reverseButtons: true,
      theme: resolvedTheme as SweetAlertTheme,
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: t("alerts.deletingTitle"),
      text: t("alerts.deletingText"),
      allowOutsideClick: false,
      theme: resolvedTheme as SweetAlertTheme,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_URL}/vehicle/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to delete vehicle",
        );
      }

      setCars((prevCars) =>
        prevCars.filter((car) => car.id !== id),
      );

      await Swal.fire({
        title: t("alerts.deleteSuccessTitle"),
        text: t("alerts.deleteSuccessText"),
        icon: "success",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);

      await Swal.fire({
        title: t("alerts.deleteErrorTitle"),
        text:
          error instanceof Error
            ? error.message
            : t("alerts.deleteErrorText"),
        icon: "error",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    }
  };

  return (
    <section className="carsPage">
      <div className="container">
        <div className="header">
          <div className="title">
            <h1>{t("title")}</h1>
            <p>{t("description")}</p>
          </div>

          <div className="headerActions">
            <div className="count">
              {numberOfCars} {t("vehicles")}
            </div>

            <button
              className="addVehicle"
              onClick={handleAdd}
            >
              + {t("addVehicle")}
            </button>
          </div>
        </div>

        <div className="carsTable">
          {loading ? (
            <div className="loading">
              {t("loading")}
            </div>
          ) : numberOfCars === 0 ? (
            <div className="noVehicles">
              {t("noVehicles")}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t("brand")}</th>
                  <th>{t("model")}</th>
                  <th>{t("year")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td className="brand">
                      {car.brand}
                    </td>

                    <td>
                      {car.model}
                    </td>

                    <td>
                      {car.year}
                    </td>

                    <td className="actions">
                      <button
                        className="delete"
                        onClick={() => handleDelete(car.id)}
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}