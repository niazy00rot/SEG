"use client";

import { useEffect, useState } from "react";

export default function CartNum() {
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const getCartCount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          setCartCount(0);
          return;
        }

        const data = await response.json();

        const count = data.reduce(
          (total: number, item: { quantity: number }) =>
            total + item.quantity,
          0
        );

        setCartCount(count);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCartCount(0);
      }
    };

    getCartCount();
  }, []);

  return (
    <>
      {cartCount > 0 && (
        <div className="cartNum">
          <span>{cartCount}</span>
        </div>
      )}
    </>
  );
}