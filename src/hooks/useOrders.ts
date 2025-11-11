"use client";

import {  gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { UserFragment } from "./AuthStore";

export interface ProductFragment {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export interface Order {
  _id: string;
  productId: ProductFragment;
  quantity: number;
  flavour?: string[];
  sideDish?: string[];
  status: string;
  isCompleted: boolean;
  batchId: string;
  orderDate: string;
}

export interface OrderBatch {
  batchId: string;
  orderDate: string;
  orders: Order[];
}

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    getMyOrders {
      batchId
      orderDate
      orders {
        _id
        productId {
          _id
          name
          price
          category
        }
        quantity
        flavour
        sideDish
        status
        isCompleted
        batchId
        orderDate
      }
    }
  }
`;

export const useOrders = () => {
  const { data, loading, error, refetch } = useQuery<{ getMyOrders: OrderBatch[] }>(GET_MY_ORDERS);

  const orders = data?.getMyOrders || [];

  const completedOrders = orders.map(batch => ({
    ...batch,
    orders: batch.orders.filter(order => order.isCompleted),
  }));

  const pendingOrders = orders.map(batch => ({
    ...batch,
    orders: batch.orders.filter(order => !order.isCompleted),
  }));

  return { orders, completedOrders, pendingOrders, loading, error, refetch };
};
