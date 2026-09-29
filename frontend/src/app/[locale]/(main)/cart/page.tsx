"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTrash2,
} from "react-icons/fi";

import "./cart.scss";
import Loading from "@/components/ui/Loading";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCart(): Promise<CartItem[]> {
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to load cart");
  }

  return data;
}

async function updateCartItem(
  productId: number,
  quantity: number,
): Promise<CartItem> {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to update item");
  }

  return data;
}

async function removeCartItem(productId: number): Promise<void> {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to remove item");
  }
}

async function clearCart(): Promise<void> {
  const response = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to clear cart");
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const cart = await getCart();

      setItems(cart);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCart();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchCart]);

  async function handleUpdateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProduct(productId);

      await updateCartItem(productId, quantity);

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
              }
            : item,
        ),
      );
    } finally {
      setUpdatingProduct(null);
    }
  }

  async function handleRemove(productId: number) {
    try {
      setUpdatingProduct(productId);

      await removeCartItem(productId);

      setItems((currentItems) =>
        currentItems.filter((item) => item.product_id !== productId),
      );
    } finally {
      setUpdatingProduct(null);
    }
  }

  async function handleClearCart() {
    if (items.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);
      await clearCart();

      setItems([]);
    } finally {
      setClearing(false);
    }
  }

  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);


  async function checkAuth(): Promise<boolean> {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.error === "Invalid or expired token") {
      return false;
    }

    return true;
  }

  useEffect(() => {
    async function checkAuthentication() {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    }

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <main className="cartPage">
        <div className="container">
          <Loading title="Loading your cart..." />
        </div>
      </main>
    );
  }

  return (
    <main className="cartPage">
      <div className="container">
        <header>
          <Link href="/">
            <FiArrowLeft />
            Continue Shopping
          </Link>

          <div className="cartTitle">
            <div className="icon">
              <FiShoppingCart />
            </div>

            <div>
              <h1>Your Cart</h1>

              <p>
                {items.length === 0
                  ? "Your cart is empty"
                  : `${totalItems} ${
                      totalItems === 1 ? "item" : "items"
                    } in your cart`}
              </p>
            </div>
          </div>
        </header>

        {!isAuthenticated ? (
          <div className="loginRequiredContent">
            <h2>Login Required</h2>
            <p>You need to log in to your account before you can view and manage your cart.</p>

            <div className="authButtons">
              <Link href="/login" className="loginButton">Login</Link>
              <Link href="/signup" className="signupButton">Sign Up</Link>
            </div>
          </div>
        ) : (
          items.length === 0 ? (
            <section className="emptyCart">
              <div className="icon">
                <FiShoppingCart />
              </div>
  
              <h2>Your cart is empty</h2>
              <p>Looks like you haven &apos;t added anything to your cart yet.</p>
  
              <Link href="/products">
                Start Shopping
              </Link>
            </section>
          ) : (
            <section className="cartLayout">
  
              <div className="cartItems">
                <div className="header">
                  <h2>Cart Items</h2>
  
                  <span>
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
  
                <div className="list">
                  {items.map((item) => {
                    const itemTotal = Number(item.price) * item.quantity;
  
                    const updating = updatingProduct === item.product_id;
  
                    return (
                      <article className="cartItem" key={item.id}>
                        <div className="image">
                          <span>SEG</span>
                        </div>
  
                        <div className="content">
                          <div className="info">
                            <div>
                              <h3>{item.name}</h3>
                              <p>${Number(item.price).toFixed(2)}</p>
                            </div>
                            <div className="total">
                              ${itemTotal.toFixed(2)}
                            </div>
  
                          </div>
  
                          <div className="actions">
                            <div className="quantityControl">
                              <button
                                type="button"
                                disabled={updating || item.quantity <= 1}
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product_id,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                <FiMinus />
                              </button>
  
                              <span>{item.quantity}</span>
  
                              <button
                                type="button"
                                disabled={updating}
                                aria-label="Increase quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product_id,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <FiPlus />
                              </button>
                            </div>
  
                            <button
                              type="button"
                              className="removeButton"
                              disabled={updating}
                              onClick={() => handleRemove(item.product_id)}
                            >
                              <FiTrash2 />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
  
              <aside className="cartSummary">
                <div className="header">
                  <h2>Order Summary</h2>
                </div>
  
                <div className="body">
                  <div className="summaryRow">
                    <span>
                      Subtotal
                      <small>
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </small>
                    </span>
  
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
  
                  <div className="summaryRow">
                    <span>Shipping</span>
  
                    <strong className="free">Free</strong>
                  </div>
  
                  <div className="summaryDivider" />
  
                  <div className="summaryTotal">
                    <span>Total</span>
  
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
  
                  <button type="button" className="checkoutButton">
                    Proceed to Checkout
                    <FiArrowRight />
                  </button>
  
                  <button
                    type="button"
                    className="clearButton"
                    disabled={clearing}
                    onClick={handleClearCart}
                  >
                    {clearing ? "Clearing..." : "Clear Cart"}
                  </button>
                </div>
              </aside>
            </section>
          )
        )}

      </div>
    </main>
  );
}
