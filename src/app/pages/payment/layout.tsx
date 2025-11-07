"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import styles from "./payment.module.css";
import { useCart, CartItem } from "../../../context/cartContext";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ORDERS,
  OrderInput,
  BulkOrderResponse,
} from "../../schema/order";
import { useAuthStore } from "../../../hooks/AuthStore";
import { normalizeId } from "../../utils/normalize";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuthStore();
  const router = useRouter();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const [createBatchOrder] = useMutation<BulkOrderResponse>(CREATE_ORDERS);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
    .toFixed(2);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      alert("Please log in to place an order.");
      return router.push("/signup");
    }

    if (cartItems.length === 0) {
      return alert("Your cart is empty.");
    }

    // Map cart items to OrderInput
    const orderInputs: OrderInput[] = cartItems.map((item: CartItem) => ({
      productId: normalizeId(item.productId),
      quantity: item.quantity,
      flavour: item.flavour || [],
      sideDish: item.sideDish || [],
      cuisine: item.cuisine,
    }));

    try {
      const { data } = await createBatchOrder({
        variables: { inputs: orderInputs },
      });

      if (data?.createOrders?.success) {
        setPaymentSuccess(true);
        clearCart();
      } else {
        alert("Order failed: " + data?.createOrders?.message);
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Error creating order.");
    }
  };

  useEffect(() => {
    if (!paymentSuccess) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push("/components/MyOrders");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentSuccess, router]);

  if (paymentSuccess)
    return (
      <Box className={styles.paymentContainer}>
        <Typography variant="h4" className={styles.successTitle}>
          Payment Successful!
        </Typography>
        <Typography className={styles.successText}>
          Total Paid: ${totalPrice}
        </Typography>
        <Typography className={styles.redirectText}>
          Redirecting in {redirectCountdown}...
        </Typography>
        <Button
          onClick={() => router.push("/components/myorders")}
          variant="contained"
        >
          Go to My Orders
        </Button>
      </Box>
    );

  return (
    <Box className={styles.paymentContainer}>
      <Typography variant="h3" className={styles.heading}>
        Payment Information
      </Typography>
      <form onSubmit={handlePayment} className={styles.paymentForm}>
        <TextField label="Cardholder Name" fullWidth className={styles.input} />
        <TextField
          label="Card Number"
          fullWidth
          className={styles.input}
          inputProps={{ maxLength: 16 }}
        />
        <div className={styles.row}>
          <TextField
            label="Expiry (MM/YY)"
            className={styles.smallInput}
            inputProps={{ maxLength: 5 }}
          />
          <TextField
            label="CVV"
            className={styles.smallInput}
            inputProps={{ maxLength: 3 }}
          />
        </div>

        <Button type="submit" variant="contained" className={styles.payBtn}>
          Pay ${totalPrice}
        </Button>
      </form>
    </Box>
  );
}
