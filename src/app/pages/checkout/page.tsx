"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useCart } from "../../../context/cartContext";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useAuthStore } from "../../../hooks/AuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import client from "../../../../lib/apollo-client";
import PaymentReceived from "./public/money-received.png";
import cartIcon from "./public/shopping-bag.png";
import styles from "./checkout.module.css";

// --- GraphQL mutation ---
const CREATE_ORDERS = gql`
  mutation CreateOrders($inputs: [OrderInput!]!) {
    createOrders(inputs: $inputs) {
      success
      message
      orders {
        _id
        quantity
        flavour
        sideDish
        cuisine
        status
        isCompleted
        batchId
        orderDate
        productId {
          _id
          name
          price
          category
        }
        userId {
          _id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

// --- TypeScript types ---
interface OrderProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

interface OrderItem {
  _id: string;
  quantity: number;
  flavour: string[];
  sideDish: string[];
  cuisine: string;
  status: string;
  isCompleted: boolean;
  batchId: string;
  orderDate: string;
  productId: OrderProduct;
  userId: OrderUser;
}

interface CreateOrdersResult {
  createOrders: {
    success: boolean;
    message?: string;
    orders: OrderItem[];
  };
}

interface OrderInput {
  productId: string;
  quantity: number;
  flavour: string[];
  sideDish: string[];
  cuisine: string;
}

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuthStore();
  const router = useRouter();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Typed mutation with auth client
  const [createBatchOrder] = useMutation<CreateOrdersResult>(CREATE_ORDERS, {
    client,
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );
  const taxes = subtotal * 0.1;
  const deliveryFee = 5;
  const total = subtotal + taxes + deliveryFee;

  const handlePayment = async () => {
    if (!user?._id) return router.push("/signup");
    if (!cartItems.length) return alert("Your cart is empty.");

    const orderInputs: OrderInput[] = cartItems.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      flavour: item.flavour || [],
      sideDish: item.sideDish || [],
      cuisine: item.cuisine?.toUpperCase() || "KHMER",
    }));

    try {
      setLoadingPayment(true);

      const { data } = await createBatchOrder({
        variables: { inputs: orderInputs },
      });

      if (data?.createOrders.success) {
        setPaymentSuccess(true);
        clearCart();
      } else {
        alert(data?.createOrders.message || "Order failed");
      }
    } catch (err: any) {
      alert("Error creating order: " + err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <Box className={styles.checkoutContainer}>
      {loadingPayment && (
        <div className={styles.loadingOverlay}>Processing Payment...</div>
      )}

      {paymentSuccess ? (
        <Box className={styles.successContainer}>
          <Image src={PaymentReceived} width={300} height={300} alt="success" />
          <h2>Payment Successful!</h2>
          <p>Total Paid: {formatCurrency(total)}</p>
          <Button onClick={() => router.push("/pages/myorders")}>
            Go to My Orders
          </Button>
        </Box>
      ) : !cartItems.length ? (
        <Box className={styles.emptyContainer}>
          <Image src={cartIcon} width={300} height={300} alt="cart" />
          <p>Your cart is empty</p>
          <Button
            onClick={() =>
              router.push("/components/Cuisines?page=1&cuisine=South+Korea")
            }
          >
            Go to Menu
          </Button>
        </Box>
      ) : (
        <>
          <Box className={styles.scrollableContent}>
            {cartItems.map((item) => (
              <Box key={item.productId} className={styles.cartItem}>
                <p className={styles.cartName}>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Flavour:{" "}
                  {item.flavour?.length ? item.flavour.join(", ") : "N/A"}
                </p>
                <p>
                  Side Dish:{" "}
                  {item.sideDish?.length ? item.sideDish.join(", ") : "N/A"}
                </p>
                <p>
                  Price:{" "}
                  {formatCurrency(Number(item.price) * Number(item.quantity))}
                </p>
              </Box>
            ))}
          </Box>

          <Box className={styles.checkoutFooter}>
            <div className={styles.footerRow}>
              Subtotal: {formatCurrency(subtotal)}
            </div>
            <div className={styles.footerRow}>
              Taxes: {formatCurrency(taxes)}
            </div>
            <div className={styles.footerRow}>
              Delivery: {formatCurrency(deliveryFee)}
            </div>
            <div className={`${styles.footerRow} ${styles.total}`}>
              Total: {formatCurrency(total)}
            </div>
            <Button className={styles.checkoutBtn} onClick={handlePayment}>
              Pay Now
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
