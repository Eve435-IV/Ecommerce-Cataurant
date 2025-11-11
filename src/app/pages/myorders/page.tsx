"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ORDERS } from "../../schema/order";
import { formatDistanceToNow, isValid } from "date-fns";
import styles from "./myOrders.module.css";
import {
  GetMyOrdersResponse,
  OrderBatch,
  Order,
  OrderStatus,
} from "../../schema/order";

const statusColors: Record<string, string> = {
  Pending: "#FFC107",
  Accepted: "#4CAF50",
  Declined: "#F44336",
  Completed: "#2196F3",
};

export default function MyOrdersPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const isCompletedTab = selectedTab === 1;

  const { data, loading, error } = useQuery<GetMyOrdersResponse>(
    GET_MY_ORDERS,
    { fetchPolicy: "network-only" }
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    if (!isValid(date)) return "N/A";
    return `${date.toLocaleString()} (${formatDistanceToNow(date, {
      addSuffix: true,
    })})`;
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <p>Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.error}>
        <p>Error loading orders: {error.message}</p>
      </div>
    );

  const batches: OrderBatch[] =
    data?.getMyOrders
      ?.map((batch) => ({
        ...batch,
        orders: batch.orders.filter((o) => o.isCompleted === isCompletedTab),
      }))
      .filter((batch) => batch.orders.length > 0) || [];

  return (
    <div className={styles.ordersPage}>
      <h2 className={styles.heading}>My Orders</h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setSelectedTab(0)}
          style={{
            padding: "8px 20px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            backgroundColor: !isCompletedTab ? "#ff5c5c" : "#fff",
            fontWeight: !isCompletedTab ? 700 : 700,
            color: !isCompletedTab ? "White" : "black",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Active Orders
        </button>
        <button
          onClick={() => setSelectedTab(1)}
          style={{
            padding: "8px 20px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            backgroundColor: !isCompletedTab ? "#fff" : "#ff5c5c",
            fontWeight: !isCompletedTab ? 700 : 700,
            color: !isCompletedTab ? "black" : "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Completed Orders
        </button>
      </div>

      {batches.length === 0 ? (
        <div className={styles.empty}>
          No {isCompletedTab ? "completed" : "active"} orders.
        </div>
      ) : (
        <div className={styles.ordersScrollArea}>
          {batches.map((batch) => (
            <div key={batch.batchId} className={styles.batchCard}>
              <div className={styles.batchHeader}>
                <span>Batch ID: {batch.batchId}</span>
                <span>Order Date: {formatDate(batch.orderDate)}</span>
              </div>
              {batch.orders.map((order: Order) => {
                const status: OrderStatus | "Completed" = order.isCompleted
                  ? "Completed"
                  : order.status || OrderStatus.Pending;
                const color = statusColors[status] || "#000";

                const flavours = order.flavour || [];
                const sides = order.sideDish || [];

                return (
                  <div key={order._id} className={styles.orderItem}>
                    <div>
                      {order.productId?.name} x {order.quantity} - $
                      {order.productId?.price * order.quantity}
                      {flavours.length > 0 &&
                        ` | Flavours: ${flavours.join(", ")}`}
                      {sides.length > 0 && ` | Sides: ${sides.join(", ")}`}
                    </div>
                    <div className={styles.orderStatus}>
                      <span
                        className={styles.statusIndicator}
                        style={{ backgroundColor: color }}
                      ></span>
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
