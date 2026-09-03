"use client";

import "./addCars.scss";
import { useRouter } from "next/navigation";

import AddVehicleForm from "@/components/admin/cars/AddVehicleForm";
import AddBrandForm from "@/components/admin/cars/AddBrandForm";
import AddModelForm from "@/components/admin/cars/AddModelForm";

export default function AddCarsPage() {
  const router = useRouter();

  return (
    <section className="addVehiclePage">
      <div className="container">

        <button type="button" className="backButton" onClick={() => router.push("/admin/cars")}>
          ← Back
        </button>

        <div className="formsGrid">
          <AddVehicleForm />
          <AddBrandForm />
          <AddModelForm />
        </div>

      </div>
    </section>
  );
}