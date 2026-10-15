"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./shop.scss";

type Category = { id: string; name: string };
type ProductType = { id: string; name: string; category_id: string };
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  quantity: number;
  images?: { image_path: string; is_primary: boolean; display_order: number }[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export default function Shop() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    request<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const selectCategory = (id: string) => {
    setCategoryId(id);
    setTypeId(null);
    setProducts([]);
    setLoadingTypes(true);
    setError(false);
    request<ProductType[]>(`/categories/${id}/product_types`)
      .then(setTypes)
      .catch((requestError: Error) => {
        setTypes([]);
        if (!requestError.message.includes("status 404")) setError(true);
      })
      .finally(() => setLoadingTypes(false));
  };

  const selectType = (id: string) => {
    setTypeId(id);
    setLoadingProducts(true);
    setError(false);
    request<Product[]>(`/products?category_id=${categoryId}&product_type_id=${id}`)
      .then(setProducts)
      .catch((requestError: Error) => {
        setProducts([]);
        if (!requestError.message.includes("status 404")) setError(true);
      })
      .finally(() => setLoadingProducts(false));
  };

  const addToCart = async (productId: string) => {
    setAddingProduct(productId);
    setAddedProduct(null);
    setError(false);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (response.status === 401 || response.status === 403) {
        router.push(`/${locale}/login`);
        return;
      }
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setAddedProduct(productId);
    } catch {
      setError(true);
    } finally {
      setAddingProduct(null);
    }
  };

  if (loading) return <Loading title={t("loading")} />;

  return (
    <main className="shopPage">
      <div className="container">
        <header className="shopHeader">
          <p className="eyebrow">{t("title")}</p>
          <h1>{t("categories")}</h1>
        </header>

        {error && <p className="shopMessage error">{t("error")}</p>}

        <div className="shopTabs" role="tablist" aria-label={t("categories")}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={categoryId === category.id ? "active" : ""}
              onClick={() => selectCategory(category.id)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>

        {!categoryId && <p className="shopMessage">{t("chooseCategory")}</p>}

        {categoryId && (
          <section className="typesSection">
            <h2>{t("productTypes")}</h2>
            {loadingTypes ? (
              <p className="shopMessage">{t("loading")}</p>
            ) : types.length === 0 ? (
              <p className="shopMessage">{t("noTypes")}</p>
            ) : (
              <div className="shopTabs typeTabs" role="tablist">
                {types.map((type) => (
                  <button
                    key={type.id}
                    className={typeId === type.id ? "active" : ""}
                    onClick={() => selectType(type.id)}
                    type="button"
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {typeId && (
          <section className="productsSection">
            <h2>{t("products")}</h2>
            {loadingProducts ? (
              <p className="shopMessage">{t("loading")}</p>
            ) : products.length === 0 ? (
              <p className="shopMessage">{t("noProducts")}</p>
            ) : (
              <div className="productsGrid">
                {products.map((product) => {
                  const image = product.images?.find((item) => item.is_primary)?.image_path
                    || product.images?.[0]?.image_path;
                  return (
                    <article className="productCard" key={product.id}>
                      <Link
                        className="productLink"
                        href={`/${locale}/shop/${product.id}`}
                        aria-label={product.name}
                      >
                      <div className="productImage">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            width={400}
                            height={300}
                          />
                        ) : (
                          <span>SEG</span>
                        )}
                      </div>
                      <div className="productInfo">
                        <h3>{product.name}</h3>
                        {product.description && <p>{product.description}</p>}
                        <strong>
                          {new Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: "EGP",
                          }).format(Number(product.price))}
                        </strong>
                      </div>
                      </Link>
                      <button
                        className="addToCart"
                        type="button"
                        disabled={addingProduct === product.id}
                        onClick={() => addToCart(product.id)}
                      >
                        {addingProduct === product.id
                          ? t("adding")
                          : addedProduct === product.id
                            ? t("added")
                            : t("addToCart")}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}