"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useCart, CartItem } from "../../../context/cartContext";
import styles from "./checkout.module.css";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ORDERS,
  OrderInput,
  CreateOrdersResponse,
  CuisineType, // ✅ from schema
} from "../../schema/order";
import { useAuthStore } from "../../../hooks/AuthStore";
import { normalizeId } from "../../utils/normalize";
import { useRouter } from "next/navigation";
import PaymentRevieved from "./public/money-received.png";
import cart from "./public/shopping-bag.png";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuthStore();
  const router = useRouter();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [createBatchOrder] = useMutation<CreateOrdersResponse>(CREATE_ORDERS);

  const totalPrice = cartItems
    .reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0)
    .toFixed(2);

  const increaseQty = (item: CartItem) => addToCart({ ...item, quantity: 1 });
  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) addToCart({ ...item, quantity: -1 });
  };

  const getFlavourColor = (flavour: string) => {
    const lower = flavour.toLowerCase();
    if (lower.includes("spicy")) return styles.flavourSpicy;
    if (lower.includes("sweet")) return styles.flavourSweet;
    if (lower.includes("salty")) return styles.flavourSalty;
    return "";
  };

  const handlePayment = async () => {
    if (!user?._id) {
      alert("Please log in to place an order.");
      return router.push("/signup");
    }
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ✅ Map cuisine safely into valid CuisineType string union
    const validCuisines: CuisineType[] = [
      "KHMER",
      "KOREAN",
      "JAPANESE",
      "FAST_FOOD",
    ];

    const orderInputs: OrderInput[] = cartItems
      .filter((item) => item.productId)
      .map((item) => {
        const normalizedCuisine = item.cuisine
          ?.toUpperCase()
          .replace(/\s+/g, "_");
        const cuisine: CuisineType = validCuisines.includes(
          normalizedCuisine as CuisineType
        )
          ? (normalizedCuisine as CuisineType)
          : "KHMER"; // fallback default

        return {
          productId: normalizeId(item.productId),
          quantity: Number(item.quantity) || 1,
          flavour: item.flavour || [],
          sideDish: item.sideDish || [],
          cuisine,
        };
      });

    if (orderInputs.length === 0) return alert("No valid items to checkout.");

    try {
      setLoadingPayment(true);
      const { data } = await createBatchOrder({
        variables: { inputs: orderInputs },
      });

      if (data?.createOrders?.success) {
        setPaymentSuccess(true);
        clearCart();
      } else {
        alert(
          "Order failed: " + (data?.createOrders?.message || "Unknown error")
        );
      }
    } catch (err: any) {
      console.error(err);
      alert("Error creating order. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <Box className={styles.checkoutContainer}>
      {loadingPayment && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          Processing Payment...
        </div>
      )}

      <div className={styles.heading}>Checkout</div>

      <div className={styles.scrollableContent}>
        {paymentSuccess ? (
          <div className={styles.successContainer}>
            <Image
              alt="payment"
              src={PaymentRevieved}
              className={styles.successIcon}
              width={300}
              height={300}
            />
            <div className={styles.successTitle}>Payment Successful!</div>
            <div className={styles.successDetails}>
              Thank you for your order.
              <br />
              Total Paid: <strong>${totalPrice}</strong>
              <br />
              Your order will be processed shortly.
            </div>
            <button
              className={styles.successButton}
              onClick={() => router.push("/pages/myorders")}
            >
              Go to My Orders
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Image
              src={cart}
              alt="cart"
              className={styles.emptyIcon}
              width={300}
              height={300}
            />
            <div className={styles.emptyText}>Your cart is empty</div>
            <div>Browse our menu and add some delicious items!</div>
            <button
              className={styles.successButton}
              onClick={() =>
                router.push("/components/Cuisines?page=1&cuisine=South+Korea")
              }
            >
              Go to Menu
            </button>
          </div>
        ) : (
          cartItems.map((item, index) => (
            <Box key={index} className={styles.cartItem}>
              <div className={styles.cartWrapper}>
                <div className={styles.cartName}>{item.name}</div>
              </div>
              <div className={styles.maincartPreview}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={styles.cartImage}
                  />
                )}
                <div className={styles.cartPreview}>
                  <div className={styles.cartQuantityContainer}>
                    <div className={styles.cartname}>Qty:</div>
                    <div className={styles.cartQuantity}>{item.quantity}</div>
                  </div>
                  <div className={styles.cartPriceContainer}>
                    <div className={styles.cartname}>Price:</div>
                    <div className={styles.cartPrice}>
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                  {item.flavour.length > 0 && (
                    <div className={styles.cartFlavourContainer}>
                      <div className={styles.cartname}>Flavours:</div>
                      <div className={styles.cartFlavour}>
                        {item.flavour.map((f, i) => (
                          <span
                            key={i}
                            className={`${styles.flavourItem} ${getFlavourColor(
                              f
                            )}`}
                          >
                            {f}
                            {i < item.flavour.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.sideDish.length > 0 && (
                    <div className={styles.cartSidedishContainer}>
                      <div className={styles.cartname}>Sides:</div>
                      <div className={styles.cartSidedish}>
                        {item.sideDish.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.quantity}>
                <div className={styles.addminusContainer}>
                  <div
                    className={`${styles.minus} ${
                      item.quantity === 1 ? styles.disabled : ""
                    }`}
                    onClick={() => decreaseQty(item)}
                  >
                    -
                  </div>
                  <div
                    className={styles.plus}
                    onClick={() => increaseQty(item)}
                  >
                    +
                  </div>
                </div>
                <div
                  className={styles.remove}
                  onClick={() =>
                    removeFromCart(item.productId, item.flavour, item.sideDish)
                  }
                >
                  Remove
                </div>
              </div>
            </Box>
          ))
        )}
      </div>

      {!paymentSuccess && cartItems.length > 0 && (
        <Box className={styles.checkoutFooter}>
          <div className={styles.footerRow}>
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>
          <div className={styles.footerRow}>
            <span>Taxes (10%)</span>
            <span>${(Number(totalPrice) * 0.1).toFixed(2)}</span>
          </div>
          <div className={styles.footerRow}>
            <span>Delivery Fee</span>
            <span>$5.00</span>
          </div>
          <div className={`${styles.footerRow} ${styles.total}`}>
            <span>Total</span>
            <span>${(Number(totalPrice) * 1.1 + 5).toFixed(2)}</span>
          </div>
          <Button
            className={styles.checkoutBtn}
            variant="contained"
            onClick={handlePayment}
          >
            Pay Now
          </Button>
          <div className={styles.paymentNote}>
            Your order will be processed immediately after payment.
          </div>
        </Box>
      )}
    </Box>
  );
}
