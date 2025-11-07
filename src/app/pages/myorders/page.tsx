"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_ORDER_PAGINATION,
  OrderBatchPaginator,
  OrderBatch,
} from "../../schema/order";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  List,
  ListItem,
  Tabs,
  Tab,
} from "@mui/material";
import { formatDistanceToNow, isValid } from "date-fns";
import styles from "./myOrders.module.css";

const statusColors: Record<string, string> = {
  Pending: "#FFC107",
  Accepted: "#4CAF50",
  Declined: "#F44336",
  Completed: "#2196F3",
};

export default function MyOrdersPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const isCompleted = selectedTab === 1;

  const { data, loading, error, refetch } = useQuery<OrderBatchPaginator>(
    GET_ORDER_PAGINATION,
    {
      variables: { page: 1, limit: 20, pagination: true, isCompleted },
      fetchPolicy: "network-only",
    }
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    refetch({
      page: 1,
      limit: 50,
      pagination: true,
      isCompleted: newValue === 1,
    });
  };

  if (loading)
    return (
      <Box className={styles.loading}>
        <CircularProgress color="primary" size={50} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your orders...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box className={styles.error}>
        <Typography color="error" variant="h6">
          Error loading orders: {error.message}
        </Typography>
      </Box>
    );

  const batches: OrderBatch[] = data?.getOrderWithPagination?.data || [];

  const formatOrderDate = (timestamp: string | number, completed: boolean) => {
    const date = new Date(Number(timestamp));
    if (!isValid(date)) return "N/A";

    if (completed) {
      // Completed orders show fixed date/time
      return date.toLocaleString();
    } else {
      // Active orders show relative time
      return `${date.toLocaleString()} (${formatDistanceToNow(date, {
        addSuffix: true,
      })})`;
    }
  };

  return (
    <Box className={styles.ordersPage}>
      <Typography variant="h4" component="h1" className={styles.heading}>
        My Orders
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 3,
          "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
          "& .Mui-selected": { color: "var(--primary-color)" },
          "& .MuiTabs-indicator": { backgroundColor: "var(--primary-color)" },
        }}
      >
        <Tab label="Active Orders" />
        <Tab label="Completed Orders" />
      </Tabs>

      <Box className={styles.ordersScrollArea}>
        {batches.length === 0 ? (
          <Box className={styles.empty}>
            <Typography variant="h6" color="text.secondary">
              {isCompleted
                ? "No completed orders yet."
                : "You don't have any active orders right now."}
            </Typography>
          </Box>
        ) : (
          <List>
            {batches.map((batch) => (
              <Paper
                key={batch.batchId}
                className={styles.batchCard}
                elevation={6}
              >
                <Box className={styles.batchHeader}>
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Batch ID: #{batch.batchId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order Date:{" "}
                    {formatOrderDate(
                      batch.orderDate,
                      batch.orders.every((o) => o.isCompleted)
                    )}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                {batch.orders.map((order) => {
                  const displayStatus = order.isCompleted
                    ? "Completed"
                    : order.status || "Pending";

                  const color =
                    order.isCompleted && !statusColors[displayStatus]
                      ? statusColors["Completed"]
                      : statusColors[displayStatus] || statusColors["Pending"];

                  return (
                    <ListItem
                      key={order._id}
                      className={styles.orderItem}
                      disableGutters
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography>
                          <strong>
                            {order.productId?.name || "Unknown Product"}
                          </strong>
                          x {order.quantity} - $
                          {(
                            (order.productId?.price || 0) * order.quantity
                          ).toFixed(2)}
                        </Typography>

                        {(order.flavour?.length > 0 ||
                          order.sideDish?.length > 0) && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {order.flavour?.length > 0 &&
                              `Flavours: ${order.flavour.join(", ")}`}
                            {order.flavour?.length > 0 &&
                              order.sideDish?.length > 0 &&
                              " | "}
                            {order.sideDish?.length > 0 &&
                              `Sides: ${order.sideDish.join(", ")}`}
                            {order.cuisine && ` | Cuisine: ${order.cuisine}`}
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        className={styles.orderStatus}
                        sx={{ ml: 2 }}
                      >
                        <Box
                          component="span"
                          style={{ backgroundColor: color }}
                          className={styles.statusIndicator}
                        />
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                          {displayStatus}
                        </Box>
                      </Typography>
                    </ListItem>
                  );
                })}
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
