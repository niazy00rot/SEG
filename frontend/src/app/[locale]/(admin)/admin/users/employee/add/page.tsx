"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EmployeeForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export default function AddEmployeePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [employee, setEmployee] = useState<EmployeeForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      router.push("/admin/users/employee");
    } catch (error) {
      console.error("Error adding employee:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="addEmployeePage">
      <div className="container">
        <h1>Add Employee</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={employee.phone}
              onChange={handleChange}
            />
          </div>


          <div>
            <label htmlFor="phone">Password</label>

            <input
              id="password"
              name="password"
              type="text"
              value={employee.password}
              onChange={handleChange}
            />
          </div>

          <div className="actions">
            <button
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}