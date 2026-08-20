"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "./employee.scss";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface NewEmployee {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function Admin() {
  const t = useTranslations("admin.employeePage");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addingEmployee, setAddingEmployee] = useState(false);

  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  /*
   * Fetch all employees
   */
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

  /*
   * Add employee
   */
  const handleAddEmployee = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setAddingEmployee(true);

      const response = await fetch(`${API_URL}/employee`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      // if (!response.ok) {
      //   throw new Error("Failed to add employee");
      // }

      const responseText = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Failed to add employee: ${response.status} - ${responseText}`
        );
      }

      const employee = await response.json();

      setEmployees((prev) => [...prev, employee]);

      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    } finally {
      setAddingEmployee(false);
    }
  };

  /*
   * Delete employee
   */
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(t("deleteConfirm"));

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/employee/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  /*
   * Edit employee
   */
  const handleEdit = (employee: Employee) => {
    console.log("Edit employee:", employee);
  };

  /*
   * Update new employee form
   */
  const handleInputChange = (field: keyof NewEmployee, value: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="employeeUser" id="employeeUser">
      <div className="container">
        {/* Page Header */}
        <div className="employeeHeader">
          <div>
            <h1>{t("title")}</h1>

            <p>{t("description")}</p>
          </div>

          <span className="employeeCount">
            {employees.length} {t("employees")}
          </span>
        </div>

        {/* Employees Table */}
        <div className="employeeTableWrapper">
          {loading ? (
            <div className="tableMessage">{t("loading")}</div>
          ) : employees.length === 0 ? (
            <div className="tableMessage">{t("noEmployees")}</div>
          ) : (
            <table className="employeeTable">
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
                    {/* Name */}
                    <td data-label={t("table.name")}>
                      <div className="employeeName">
                        <div className="employeeAvatar">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>

                        <span>{employee.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td data-label={t("table.email")}>{employee.email}</td>

                    {/* Phone */}
                    <td data-label={t("table.phone")}>{employee.phone}</td>

                    {/* Actions */}
                    <td data-label={t("table.actions")}>
                      <div className="employeeActions">
                        <button
                          type="button"
                          className="editButton"
                          onClick={() => handleEdit(employee)}
                        >
                          {t("edit")}
                        </button>

                        <button
                          type="button"
                          className="deleteButton"
                          onClick={() => handleDelete(employee.id)}
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Employee */}
        <div className="addEmployeeSection">
          <button
            type="button"
            className="addEmployeeButton"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            <span className="addIcon">+</span>

            {t("addEmployee")}
          </button>

          {/* Add Employee Form */}
          {showAddForm && (
            <form className="addEmployeeForm" onSubmit={handleAddEmployee}>
              <div className="formHeader">
                <h2>{t("addEmployee")}</h2>

                <p>{t("addEmployeeDescription")}</p>
              </div>

              <div className="formGrid">
                {/* Name */}
                <div className="formGroup">
                  <label htmlFor="employeeName">{t("form.name")}</label>

                  <input
                    id="employeeName"
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("form.namePlaceholder")}
                    required
                  />
                </div>

                {/* Email */}
                <div className="formGroup">
                  <label htmlFor="employeeEmail">{t("form.email")}</label>

                  <input
                    id="employeeEmail"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("form.emailPlaceholder")}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="formGroup">
                  <label htmlFor="employeePhone">{t("form.phone")}</label>

                  <input
                    id="employeePhone"
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t("form.phonePlaceholder")}
                    required
                  />
                </div>

                {/* Password */}
                <div className="formGroup">
                  <label htmlFor="employeePassword">{t("form.password")}</label>

                  <input
                    id="employeePassword"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={t("form.passwordPlaceholder")}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="formActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setShowAddForm(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="submitButton"
                  disabled={addingEmployee}
                >
                  {addingEmployee ? t("adding") : t("createEmployee")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
