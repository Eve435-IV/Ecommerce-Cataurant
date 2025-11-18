"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { formatDistanceToNow, isValid } from "date-fns";
import {
  GetMyOrdersResponse,
  OrderBatch,
  Order,
  OrderStatus,
  GET_MY_ORDERS,
} from "../../schema/order";
import styles from "./myOrders.module.css";

const statusColors: Record<string, string> = {
  Pending: "#FFC107",
  Accepted: "#4CAF50",
  Declined: "#F44336",
  Completed: "#2196F3",
};

export default function MyOrdersPage() {
  const [selectedTab, setSelectedTab] = useState<0 | 1>(0);
  const isCompletedTab = selectedTab === 1;

  const { data, loading, error } = useQuery<GetMyOrdersResponse>(
    GET_MY_ORDERS,
    {
      variables: { page: 1, limit: 20, isCompleted: null },
      fetchPolicy: "network-only",
    }
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
        <div className={styles.loaderRing}></div>
      </div>
    );
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  const batches: OrderBatch[] =
    data?.getMyOrders?.data
      ?.map((batch) => ({
        ...batch,
        orders: batch.orders.filter((o) => o.isCompleted === isCompletedTab),
      }))
      ?.filter((batch) => batch.orders.length > 0) || [];

  return (
    <div className={styles.ordersPage}>
      <h2 className={styles.heading}>My Orders</h2>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            !isCompletedTab ? styles.activeTab : ""
          }`}
          onClick={() => setSelectedTab(0)}
        >
          Active Orders
        </button>
        <button
          className={`${styles.tabButton} ${
            isCompletedTab ? styles.activeTab : ""
          }`}
          onClick={() => setSelectedTab(1)}
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

                return (
                  <div key={order._id} className={styles.orderItem}>
                    <div>
                      {order.productId?.name} x {order.quantity} — $
                      {(order.productId?.price * order.quantity).toFixed(2)}
                      {order.flavour?.length
                        ? ` | Flavours: ${order.flavour.join(", ")}`
                        : ""}
                      {order.sideDish?.length
                        ? ` | Sides: ${order.sideDish.join(", ")}`
                        : ""}
                    </div>
                    <div className={styles.orderStatus}>
                      <span
                        className={styles.statusIndicator}
                        style={{ backgroundColor: color }}
                      />
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
