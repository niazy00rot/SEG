"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../parts.scss";

type Category = {
  id: string;
  name: string;
};

export default function AddProductTypePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error ||
              data.message ||
              "Failed to load categories.",
          );
          return;
        }

        if (data.error === "No categories found") {
          setCategories([]);
          return;
        }

        setCategories(
          data.categories ||
            data.category ||
            (Array.isArray(data) ? data : []),
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, [API_URL]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!name.trim()) {
      setError("Product type name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/product_types`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: categoryId,
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Failed to create product type.",
        );
        return;
      }

      router.push("/admin/parts");
      router.refresh();
    } catch (error) {
      console.error("Failed to create product type:", error);
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
            <h1>Add Product Type</h1>
            <p>Create a new product type.</p>
          </div>
        </header>

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Product Type Information</h2>
              <p>Enter the product type details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={loading || loadingCategories}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product-type-name">
                Product Type Name
              </label>

              <input
                id="product-type-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter product type name"
                disabled={loading}
                maxLength={100}
                autoComplete="off"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || loadingCategories}
              >
                {loading ? "Adding..." : "Add Product Type"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}