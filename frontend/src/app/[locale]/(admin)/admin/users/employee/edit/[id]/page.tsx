"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function EditEmployeePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const response = await fetch(`${API_URL}/employee/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employee");
        }

        const data = await response.json();

        setEmployee(data.employee);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    getEmployee();
  }, [API_URL, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/employee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      router.push("/admin/users/employee");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };


  return (
    <section className="editEmployeePage">
      <div className="container">
        <h1>Edit Employee</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={employee.name}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={employee.email}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>

            <input
              id="phone"
              type="tel"
              value={employee.phone ?? ""}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <button type="submit">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </form>
      </div>
    </section>
  );
}