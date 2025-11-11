"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_ORDERS } from "../../schema/order";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
} from "@mui/material";
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
    {
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
      <Box>
        <CircularProgress /> Loading orders...
      </Box>
    );

  if (error) return <Box>Error loading orders: {error.message}</Box>;

  // Client-side filtering since backend does not support `isCompleted` argument
  const batches: OrderBatch[] =
    data?.getMyOrders
      ?.map((batch) => ({
        ...batch,
        orders: batch.orders.filter((o) => o.isCompleted === isCompletedTab),
      }))
      .filter((batch) => batch.orders.length > 0) || [];

  return (
    <Box className={styles.ordersPage}>
      <Typography variant="h4">My Orders</Typography>
      <Tabs
        value={selectedTab}
        onChange={(_, newVal) => setSelectedTab(newVal)}
      >
        <Tab label="Active Orders" />
        <Tab label="Completed Orders" />
      </Tabs>

      {batches.length === 0 ? (
        <Typography>
          No {isCompletedTab ? "completed" : "active"} orders.
        </Typography>
      ) : (
        <List>
          {batches.map((batch) => (
            <Paper key={batch.batchId} sx={{ mb: 2, p: 2 }}>
              <Typography>Batch ID: {batch.batchId}</Typography>
              <Typography>Order Date: {formatDate(batch.orderDate)}</Typography>
              <Divider sx={{ my: 1 }} />
              {batch.orders.map((order: Order) => {
                const status: OrderStatus | "Completed" = order.isCompleted
                  ? "Completed"
                  : order.status || OrderStatus.Pending;
                const color = statusColors[status] || "#000";

                // Fix red underline: default to empty arrays
                const flavours = order.flavour || [];
                const sides = order.sideDish || [];

                return (
                  <ListItem key={order._id}>
                    {order.productId?.name} x {order.quantity} - $
                    {order.productId?.price * order.quantity}
                    {flavours.length > 0 &&
                      ` | Flavours: ${flavours.join(", ")}`}
                    {sides.length > 0 && ` | Sides: ${sides.join(", ")}`}
                    <span
                      style={{
                        backgroundColor: color,
                        marginLeft: 10,
                        padding: "2px 5px",
                      }}
                    >
                      {status}
                    </span>
                  </ListItem>
                );
              })}
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}
