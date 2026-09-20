"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../parts.scss";

type Category = {
  id: string;
  name: string;
};

type ProductType = {
  id: string;
  name: string;
};

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [productTypeId, setProductTypeId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingProductTypes, setLoadingProductTypes] = useState(false);
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
          setError(data.error || data.message || "Failed to load categories.");
          return;
        }

        if (data.error === "No categories found") {
          setCategories([]);
          return;
        }

        setCategories(
          data.categories || data.category || (Array.isArray(data) ? data : []),
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoadingData(false);
      }
    };

    void fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const fetchProductTypes = async () => {
      setLoadingProductTypes(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/categories/${categoryId}/product_types`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "No product types found") {
            setProductTypes([]);
            return;
          }

          setError(
            data.error || data.message || "Failed to load product types.",
          );
          return;
        }

        if (data.error === "No product types found") {
          setProductTypes([]);
          return;
        }

        setProductTypes(
          data.product_types || data.types || (Array.isArray(data) ? data : []),
        );
      } catch (error) {
        console.error("Failed to fetch product types:", error);
        setError("Failed to load product types.");
      } finally {
        setLoadingProductTypes(false);
      }
    };

    void fetchProductTypes();
  }, [categoryId, API_URL]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!productTypeId) {
      setError("Please select a product type.");
      return;
    }

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      quantity === "" ||
      Number(quantity) < 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      setError("Please enter a valid quantity.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: categoryId,
          product_type_id: productTypeId,
          name: name.trim(),
          description: description.trim() || undefined,
          sku: sku.trim(),
          price: Number(price),
          quantity: Number(quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to create product.");
        return;
      }

      router.push("/admin/parts");
      router.refresh();
    } catch (error) {
      console.error("Failed to create product:", error);
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
            <h1>Add Product</h1>
            <p>Create a new product.</p>
          </div>
        </header>

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Product Information</h2>
              <p>Enter the product details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setProductTypes([]);
                  setProductTypeId("");
                }}
                disabled={loading || loadingData}
              >
                <option value="">
                  {loadingData ? "Loading categories..." : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product-type">Product Type</label>

              <select
                id="product-type"
                value={productTypeId}
                onChange={(event) => setProductTypeId(event.target.value)}
                disabled={loading || loadingProductTypes || !categoryId}
              >
                <option value="">
                  {!categoryId
                    ? "Select a category first"
                    : loadingProductTypes
                      ? "Loading product types..."
                      : productTypes.length === 0
                        ? "No product types found"
                        : "Select a product type"}
                </option>

                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product-name">Product Name</label>

              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter product name"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter product description"
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU</label>

              <input
                id="sku"
                type="text"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                placeholder="Enter product SKU"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>

              <input
                id="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter product price"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>

              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter product quantity"
                min="0"
                step="1"
                disabled={loading}
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
                disabled={loading || loadingData || loadingProductTypes}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
