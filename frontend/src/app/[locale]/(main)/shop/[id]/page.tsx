"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import "../shop.scss";

type Product = {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number | string;
  quantity: number;
  images?: { image_path: string; is_primary: boolean; display_order: number }[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProductDetails() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${params.id}`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Product request failed");
        return response.json() as Promise<Product>;
      })
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  const addToCart = async () => {
    if (!product) return;
    setAdding(true);
    setError(false);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (response.status === 401 || response.status === 403) {
        router.push(`/${locale}/login`);
        return;
      }
      if (!response.ok) throw new Error("Unable to add product");
      setAdded(true);
    } catch {
      setError(true);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loading title={t("loading")} />;
  if (error || !product) {
    return <p className="shopMessage error">{t("error")}</p>;
  }

  const image = product.images?.find((item) => item.is_primary)?.image_path
    || product.images?.[0]?.image_path;

  return (
    <main className="shopPage">
      <div className="container">
        <Link className="backLink" href={`/${locale}/shop`}>{t("backToShop")}</Link>
        <article className="productDetails">
          <div className="detailsImage">
            {image ? (
              <Image src={image} alt={product.name} width={700} height={520} />
            ) : (
              <span>SEG</span>
            )}
          </div>
          <div className="detailsInfo">
            <p className="eyebrow">{t("productDetails")}</p>
            <h1>{product.name}</h1>
            {product.description && <p>{product.description}</p>}
            <strong>
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: "EGP",
              }).format(Number(product.price))}
            </strong>
            {product.sku && <small>{t("sku")}: {product.sku}</small>}
            <button
              className="addToCart detailsButton"
              type="button"
              disabled={adding}
              onClick={addToCart}
            >
              {adding ? t("adding") : added ? t("added") : t("addToCart")}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
