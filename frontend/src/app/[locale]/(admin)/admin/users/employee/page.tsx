"use client";

import './employee.scss';
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type Employee = {
  name: string;
  email: string;
  phone: string;
};

export default function EmployeePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations('admin.users.employee');
  
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const numberOfEmployees = employees.length;

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/employee`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, [API_URL]);



  return (
    <>
      <section className="employeePage">
        <div className="container">
          <div className="header">
            <div className="title">
              <h1>{t('title')}</h1>
              <p>{t('description')}</p>
            </div>
            <div className="count">{numberOfEmployees} {t('employees')}</div>
          </div>

          <div className="employeeTable">
            {loading ? (
              <div className="loading">{t('loading')}</div>
            ) : numberOfEmployees === 0 ? (
              <div className="noEmployees">{t('noEmployees')}</div>
            ): (
              <table>
                <thead>
                  <tr>
                    <th>{t('table.name')}</th>
                    <th>{t('table.email')}</th>
                    <th>{t('table.phone')}</th>
                    <th>{t('table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.email}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <button>{t('table.edit')}</button>
                        <button>{t('table.delete')}</button>
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