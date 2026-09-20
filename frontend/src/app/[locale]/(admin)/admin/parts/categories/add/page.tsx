"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "../../parts.scss";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Failed to create category.",
        );
        return;
      }

      router.push("/admin/parts");
      router.refresh();
    } catch (error) {
      console.error("Failed to create category:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="products-management">
      <div className="container">
        <header className="page-header">
          <div>
            <h1>Add Category</h1>
            <p>Create a new product category.</p>
          </div>
        </header>

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Category Information</h2>
              <p>Enter the category details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="category-name">Category Name</label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter category name"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}