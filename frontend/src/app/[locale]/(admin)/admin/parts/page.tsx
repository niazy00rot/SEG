"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./parts.scss";

type Category = {
  id: number;
  name: string;
};

type ProductType = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

type DeleteType = "category" | "product_type" | "product";

type EditData = {
  name: string;
  sku: string;
  price: string;
  quantity: string;
};

export default function ProductsManagementPage() {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingType, setEditingType] =
    useState<DeleteType | null>(null);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingData, setEditingData] = useState<EditData>({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [
        categoriesResponse,
        productTypesResponse,
        productsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/categories`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/product_types`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/products`, {
          credentials: "include",
        }),
      ]);

      const categoriesData = await categoriesResponse.json();
      const productTypesData = await productTypesResponse.json();
      const productsData = await productsResponse.json();

      // Categories
      if (categoriesData.error === "No categories found") {
        setCategories([]);
      } else {
        setCategories(
          categoriesData.categories ||
            categoriesData.category ||
            (Array.isArray(categoriesData)
              ? categoriesData
              : []),
        );
      }

      // Product Types
      if (productTypesData.error === "No product types found") {
        setProductTypes([]);
      } else {
        setProductTypes(
          productTypesData.product_types ||
            productTypesData.types ||
            (Array.isArray(productTypesData)
              ? productTypesData
              : []),
        );
      }

      // Products
      if (productsData.error === "No products found") {
        setProducts([]);
      } else {
        setProducts(
          productsData.product ||
            productsData.products ||
            [],
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch products data:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(fetchTimer);
  }, [fetchData]);

  const handleEdit = (
    type: DeleteType,
    item: Category | ProductType | Product,
  ) => {
    setEditingType(type);
    setEditingId(item.id);

    if (
      type === "category" ||
      type === "product_type"
    ) {
      setEditingData({
        name: item.name,
        sku: "",
        price: "",
        quantity: "",
      });
    }

    if (type === "product") {
      setEditingData({
        name: item.name,
        sku: item.sku,
        price: String(item.price),
        quantity: String(item.quantity),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingType(null);
    setEditingId(null);

    setEditingData({
      name: "",
      sku: "",
      price: "",
      quantity: "",
    });
  };

  const handleSave = async () => {
    if (
      editingId === null ||
      editingType === null
    ) {
      return;
    }

    if (!editingData.name.trim()) {
      alert("Name is required.");
      return;
    }

    let endpoint = "";
    let body = {};

    // Category
    if (editingType === "category") {
      endpoint = `${API_URL}/categories/${editingId}`;

      body = {
        name: editingData.name.trim(),
      };
    }

    // Product Type
    if (editingType === "product_type") {
      endpoint = `${API_URL}/product_types/${editingId}`;

      body = {
        name: editingData.name.trim(),
      };
    }

    // Product
    if (editingType === "product") {
      if (!editingData.sku.trim()) {
        alert("SKU is required.");
        return;
      }

      if (
        editingData.price === "" ||
        Number(editingData.price) < 0
      ) {
        alert("Please enter a valid price.");
        return;
      }

      if (
        editingData.quantity === "" ||
        Number(editingData.quantity) < 0 ||
        !Number.isInteger(
          Number(editingData.quantity),
        )
      ) {
        alert("Please enter a valid quantity.");
        return;
      }

      endpoint = `${API_URL}/products/${editingId}`;

      body = {
        name: editingData.name.trim(),
        sku: editingData.sku.trim(),
        price: Number(editingData.price),
        quantity: Number(editingData.quantity),
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            "Failed to update item.",
        );
        return;
      }

      handleCancelEdit();

      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (
    type: DeleteType,
    id: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmed) {
      return;
    }

    let endpoint = "";

    if (type === "category") {
      endpoint = `${API_URL}/categories/${id}`;
    }

    if (type === "product_type") {
      endpoint = `${API_URL}/product_types/${id}`;
    }

    if (type === "product") {
      endpoint = `${API_URL}/products/${id}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            "Failed to delete item",
        );
        return;
      }

      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="products-management">
      <div className="container">

        <header className="page-header">
          <div>
            <h1>Products Management</h1>
            <p>
              Manage categories, product types and products.
            </p>
          </div>
        </header>

        {/* Categories */}

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Categories</h2>
              <p>Manage product categories.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("parts/categories/add")
              }
            >
              Add Category
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={2}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => {
                    const isEditing =
                      editingType === "category" &&
                      editingId === category.id;

                    return (
                      <tr key={category.id}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingData.name}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  name: event.target.value,
                                })
                              }
                            />
                          ) : (
                            category.name
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleSave}
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    "category",
                                    category,
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    "category",
                                    category.id,
                                  )
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Product Types */}

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Product Types</h2>
              <p>Manage product types.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("parts/product-types/add")
              }
            >
              Add Product Type
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {productTypes.length === 0 ? (
                  <tr>
                    <td colSpan={2}>
                      No product types found.
                    </td>
                  </tr>
                ) : (
                  productTypes.map((type) => {
                    const isEditing =
                      editingType === "product_type" &&
                      editingId === type.id;

                    return (
                      <tr key={type.id}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingData.name}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  name: event.target.value,
                                })
                              }
                            />
                          ) : (
                            type.name
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleSave}
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    "product_type",
                                    type,
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    "product_type",
                                    type.id,
                                  )
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Products */}

        <section className="management-section">
          <div className="section-header">
            <div>
              <h2>Products</h2>
              <p>Manage actual products.</p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("parts/products/add")
              }
            >
              Add Product
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const isEditing =
                      editingType === "product" &&
                      editingId === product.id;

                    return (
                      <tr key={product.id}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingData.name}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  name: event.target.value,
                                })
                              }
                            />
                          ) : (
                            product.name
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingData.sku}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  sku: event.target.value,
                                })
                              }
                            />
                          ) : (
                            product.sku
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingData.price}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  price: event.target.value,
                                })
                              }
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            product.price
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editingData.quantity}
                              onChange={(event) =>
                                setEditingData({
                                  ...editingData,
                                  quantity: event.target.value,
                                })
                              }
                              min="0"
                              step="1"
                            />
                          ) : (
                            product.quantity
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleSave}
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    "product",
                                    product,
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    "product",
                                    product.id,
                                  )
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}