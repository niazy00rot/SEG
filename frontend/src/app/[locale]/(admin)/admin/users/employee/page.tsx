"use client";

import "./employee.scss";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Swal, { type SweetAlertTheme } from "sweetalert2";
import { useTheme } from "next-themes";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function EmployeePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("admin.users.employee");

  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const numberOfEmployees = employees.length;

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/employee`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, [API_URL]);


  const handleAdd = () => {
    router.push("/admin/users/employee/add");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/employee/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      theme: resolvedTheme as SweetAlertTheme,
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Deleting...",
      text: "Please wait",
      allowOutsideClick: false,
      theme: resolvedTheme as SweetAlertTheme,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${API_URL}/employee/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id),
      );
      
      await Swal.fire({
        title: "Deleted!",
        text: "Employee has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);

      await Swal.fire({
        title: "Error!",
        text: "Failed to delete employee.",
        icon: "error",
        confirmButtonText: "OK",
        theme: resolvedTheme as SweetAlertTheme,
      });
    }
  };

  return (
    <>
      <section className="employeePage">
        <div className="container">
          <div className="header">
            <div className="title">
              <h1>{t("title")}</h1>
              <p>{t("description")}</p>
            </div>
            <div className="headerActions">
              <div className="count">
                {numberOfEmployees} {t("employees")}
              </div>

              <a className="addEmployee" onClick={handleAdd}>
                Add Employee
              </a>
            </div>
          </div>

          <div className="employeeTable">
            {loading ? (
              <div className="loading">{t("loading")}</div>
            ) : numberOfEmployees === 0 ? (
              <div className="noEmployees">{t("noEmployees")}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>{t("table.name")}</th>
                    <th>{t("table.email")}</th>
                    <th>{t("table.phone")}</th>
                    <th>{t("table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <button onClick={() => handleEdit(employee.id)}>
                          {t("table.edit")}
                        </button>
                        <button onClick={() => handleDelete(employee.id)}>
                          {t("table.delete")}
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
    </>
  );
}
